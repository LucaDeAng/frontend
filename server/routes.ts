import * as express from "express";
import { Express, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { extractFrontmatter } from "../client/src/lib/markdown";
import { ArticleMeta } from "@shared/types";
import { authMiddleware, adminMiddleware } from "./middleware/auth";
import jwt from "jsonwebtoken";
import multer from 'multer';
import Fuse from 'fuse.js';
import fsSync from 'fs';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Configurazione multer per usare /tmp in produzione e public/uploads in locale
const uploadsDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : path.join('public', 'uploads');

// Assicuriamoci che la directory esista (solo se siamo in grado di crearla)
try {
  if (!fsSync.existsSync(uploadsDir)) {
    // In produzione, /tmp/uploads dovrebbe essere sempre creabile
    // In sviluppo, creiamo public/uploads se possibile
    fsSync.mkdirSync(uploadsDir, { recursive: true });
    console.log(`✅ Directory uploads creata: ${uploadsDir}`);
  } else {
    console.log(`📁 Directory uploads già esistente: ${uploadsDir}`);
  }
} catch (error) {
  console.warn('⚠️ Impossibile creare la directory uploads:', error);
  
  // Se in produzione e /tmp/uploads non è creabile, questo è un problema serio
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ CRITICO: Impossibile creare directory uploads in produzione');
  } else {
    console.warn('⚠️ In sviluppo: uploads potrebbero non funzionare senza la directory');
  }
}

// Configurazione multer con DiskStorage personalizzato per Render
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Usa sempre la directory uploads configurata
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Genera un nome univoco per il file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: multerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: function (req, file, cb) {
    // Solo immagini
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo file immagine sono permessi!'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = express.Router();
  
  // Admin login
  apiRouter.post("/admin/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    console.log('Tentativo di login:', { username, password });
    console.log('Credenziali attese:', { ADMIN_USERNAME, ADMIN_PASSWORD });
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { id: 'admin', role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ token });
    } else {
      console.log('Login fallito - credenziali non corrispondono');
      res.status(401).json({ error: 'Credenziali non valide' });
    }
  });
  
  // Get all articles metadata
  apiRouter.get("/articles", async (req: Request, res: Response) => {
    try {
      console.log("🔍 [ARTICLES] Richiesta articoli ricevuta");
      const articles = await storage.getArticles();
      console.log("✅ [ARTICLES] Articoli recuperati:", articles?.length || 0);
      if (!articles || articles.length === 0) {
        console.log("⚠️ [ARTICLES] Nessun articolo trovato, ritorno array vuoto");
        return res.json([]);
      }
      console.log("📋 [ARTICLES] Primi 3 articoli:", articles.slice(0, 3).map(a => ({ slug: a.slug, title: a.title })));
      res.json(articles);
    } catch (error) {
      console.error("❌ [ARTICLES] Errore nel recupero degli articoli:", error);
      // In caso di errore, ritorniamo un array vuoto invece di un errore 500
      res.json([]);
    }
  });
  
  // Get single article by slug
  apiRouter.get("/articles/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      
      if (!slug) {
        return res.status(400).json({ 
          error: "Slug mancante",
          message: "È necessario specificare lo slug dell'articolo"
        });
      }
      
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        console.error(`Articolo non trovato: ${slug}`);
        return res.status(404).json({ 
          error: "Articolo non trovato",
          message: "L'articolo richiesto non esiste o non è disponibile",
          slug
        });
      }
      
      res.json(article);
    } catch (error) {
      console.error(`Errore nel recupero dell'articolo (${req.params.slug}):`, error);
      res.status(500).json({ 
        error: "Errore interno del server",
        message: "Si è verificato un errore nel recupero dell'articolo"
      });
    }
  });
  
  // Subscribe to newsletter
  apiRouter.post("/subscribe", async (req: Request, res: Response) => {
    console.log('📧 Richiesta iscrizione newsletter ricevuta:', req.body);
    
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      console.log('❌ Email non valida:', email);
      return res.status(400).json({ error: 'Invalid email' });
    }

    try {
      if (process.env.NODE_ENV === 'production') {
        // PRODUZIONE: Usa database PostgreSQL
        console.log('🗄️ [PROD] Salvando iscrizione nel database PostgreSQL:', email);
        
        try {
          // Import dinamico del database solo in produzione
          const { db } = await import("./db");
          const { subscribers } = await import("@shared/schema");
          const { eq } = await import("drizzle-orm");
          
          // Controlla se email già esiste
          const existingSubscriber = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
          
          if (existingSubscriber.length > 0) {
            console.log('⚠️ [PROD] Email già iscritta:', email);
            return res.status(409).json({ error: 'Email già iscritta alla newsletter' });
          }
          
          // Inserisci nuovo iscritto
          const newSubscriber = await db.insert(subscribers).values({ email }).returning();
          console.log('✅ [PROD] Iscritto salvato nel database:', email);
          
          // Invia email di benvenuto
          await sendWelcomeEmail(email);
          
          return res.status(200).json({ 
            success: true, 
            message: 'Iscrizione completata con successo!',
            email: email
          });
          
        } catch (dbError: any) {
          console.error('❌ [PROD] Errore database during subscription:', dbError);
          if (dbError.code === '23505') { // PostgreSQL unique constraint violation
            return res.status(409).json({ error: 'Email già iscritta alla newsletter' });
          }
          return res.status(500).json({ error: 'Errore durante l\'iscrizione al database' });
        }
      } else {
        // SVILUPPO: Usa file JSON
        console.log('📁 [DEV] Usando sistema file JSON per iscrizione:', email);
        
        const filePath = path.join('content', 'newsletter.json');
        let emails: string[] = [];
        
        // Assicurati che la directory content esista
        const contentDir = path.join('content');
        if (!fsSync.existsSync(contentDir)) {
          fsSync.mkdirSync(contentDir, { recursive: true });
          console.log('✅ [DEV] Directory content creata');
        }
        
        // Leggi file esistente
        try {
          if (fsSync.existsSync(filePath)) {
            const data = await fs.readFile(filePath, 'utf-8');
            emails = JSON.parse(data);
            console.log('📋 [DEV] Caricati', emails.length, 'iscritti esistenti');
          }
        } catch (e) {
          console.log('⚠️ [DEV] File newsletter.json non trovato, creo nuovo');
          emails = [];
        }
        
        // Controlla duplicati
        if (emails.includes(email)) {
          console.log('⚠️ [DEV] Email già iscritta:', email);
          return res.status(409).json({ error: 'Email già iscritta alla newsletter' });
        }
        
        // Aggiungi nuova email
        emails.push(email);
        
        // Salva nel file
        await fs.writeFile(filePath, JSON.stringify(emails, null, 2));
        console.log('✅ [DEV] Iscritto salvato in newsletter.json:', email);

        // Invia email di benvenuto
        await sendWelcomeEmail(email);

        return res.status(200).json({ 
          success: true, 
          message: 'Iscrizione completata con successo!',
          email: email
        });
      }
    } catch (error) {
      console.error('❌ Errore nell\'iscrizione:', error);
      res.status(500).json({ error: 'Errore durante l\'iscrizione' });
    }
  });

  // Funzione helper per inviare email di benvenuto
  async function sendWelcomeEmail(email: string) {
    try {
      console.log('📮 Configurazione trasporto email...');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      
      console.log('📧 Invio email di benvenuto a:', email);
      const html = `
        <div style="background: linear-gradient(135deg, #0f172a 0%, #2563eb 100%); padding: 0; min-height: 600px; font-family: Inter, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: rgba(30,41,59,0.98); border-radius: 24px; box-shadow: 0 8px 32px rgba(37,99,235,0.15); padding: 40px; position: relative; top: 0;">
            <div style="text-align:center; margin-bottom:32px;">
              <img src='https://genai4business.com/logo.png' alt='GenAI4Business Logo' style='height:48px; margin-bottom:16px;' />
              <h1 style="color: #2563eb; font-size: 32px; font-weight: 800; margin: 32px 0 16px;">Welcome to GenAI4Business!</h1>
            </div>
            <div style="color: #f1f5f9; font-size: 18px; line-height: 1.6; margin-bottom: 32px;">
              <p>Hello and welcome! 🎉<br><br>
              You've just joined a growing community of enthusiasts, professionals, and students passionate about Generative AI for business.<br><br>
              <b>What's next?</b><br>
              - Explore our latest articles, guides, and resources<br>
              - Get inspired by real-world AI use cases for business<br>
              - Access exclusive content and updates<br><br>
              <a href="https://genai4business.com" style="display:inline-block; background:#2563eb; color:#fff; border-radius:8px; padding:14px 32px; font-weight:700; text-decoration:none; font-size:18px; margin-top:16px;">Visit GenAI4Business</a>
              </p>
            </div>
            <div style="text-align: center; color: #94a3b8; font-size: 14px; margin-top: 48px;">
              You received this email because you subscribed to <b>GenAI4Business</b> newsletter.<br />
              <a href="mailto:info@genai4business.com?subject=Unsubscribe&body=Please remove ${email} from the newsletter" style="color: #60a5fa; text-decoration: underline;">Unsubscribe</a>
            </div>
          </div>
        </div>
      `;
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'GenAI4Business <no-reply@genai4business.com>',
        to: email,
        subject: 'Welcome to GenAI4Business! 🚀',
        html,
      });
      console.log('✅ Email di benvenuto inviata con successo a:', email);
    } catch (emailError) {
      console.error('⚠️ Errore invio email (ma iscrizione salvata):', emailError);
      // Non blocco la risposta - l'iscrizione è comunque avvenuta
    }
  }

  // Funzione helper per inviare email di benvenuto hackathon
  async function sendHackathonWelcomeEmail(email: string) {
    try {
      console.log('📮 Configurazione trasporto email per hackathon...');
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      
      console.log('📧 Invio email di benvenuto hackathon a:', email);
      const html = `
        <div style="background: linear-gradient(135deg, #581c87 0%, #2563eb 100%); padding: 0; min-height: 600px; font-family: Inter, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: rgba(30,41,59,0.98); border-radius: 24px; box-shadow: 0 8px 32px rgba(139,69,217,0.15); padding: 40px; position: relative; top: 0;">
            <div style="text-align:center; margin-bottom:32px;">
              <div style="width: 80px; height: 80px; margin: 0 auto 16px; background: linear-gradient(135deg, #8b5cf6, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 32px;">⚡</span>
              </div>
              <h1 style="color: #8b5cf6; font-size: 32px; font-weight: 800; margin: 32px 0 16px;">Benvenuto al Bolt Hackathon! ⚡</h1>
            </div>
            <div style="color: #f1f5f9; font-size: 18px; line-height: 1.6; margin-bottom: 32px;">
              <p>Ciao e benvenuto! 🎉<br><br>
              Ti sei appena iscritto per seguire il mio journey di 30 giorni nel Bolt Hackathon! 🚀<br><br>
              <b>Cosa riceverai:</b><br>
              - Aggiornamenti quotidiani sui progressi<br>
              - Insight su sfide e soluzioni<br>
              - Code snippets e breakthrough<br>
              - Dietro le quinte dello sviluppo<br><br>
              <a href="https://genai4business.com/bolt-hackathon" style="display:inline-block; background: linear-gradient(135deg, #8b5cf6, #3b82f6); color:#fff; border-radius:8px; padding:14px 32px; font-weight:700; text-decoration:none; font-size:18px; margin-top:16px;">Segui il Journey 🏃‍♂️</a>
              </p>
            </div>
            <div style="background: rgba(139,69,217,0.1); border: 1px solid rgba(139,69,217,0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #8b5cf6; margin: 0 0 12px; font-size: 18px;">🎯 Obiettivo del Hackathon</h3>
              <p style="color: #cbd5e1; margin: 0; font-size: 16px;">
                Trasformare AI Hub in una piattaforma completa in 30 giorni, documentando ogni step del processo.
              </p>
            </div>
            <div style="text-align: center; color: #94a3b8; font-size: 14px; margin-top: 48px;">
              Hai ricevuto questa email perché ti sei iscritto agli aggiornamenti del <b>Bolt Hackathon</b>.<br />
              <a href="mailto:info@genai4business.com?subject=Unsubscribe%20Hackathon&body=Please remove ${email} from the hackathon newsletter" style="color: #8b5cf6; text-decoration: underline;">Disiscrivi</a>
            </div>
          </div>
        </div>
      `;
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'GenAI4Business Hackathon <no-reply@genai4business.com>',
        to: email,
        subject: '⚡ Benvenuto al Bolt Hackathon Journey!',
        html,
      });
      console.log('✅ Email di benvenuto hackathon inviata con successo a:', email);
    } catch (emailError) {
      console.error('⚠️ Errore invio email hackathon (ma iscrizione salvata):', emailError);
      // Non blocco la risposta - l'iscrizione è comunque avvenuta
    }
  }
  
  // Admin API routes for content management
  apiRouter.post("/admin/articles", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const { title, slug, summary, category, content, author, date, image, tags } = req.body;
      
      if (!title || !slug || !summary || !category || !content || !author) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Check if article with this slug already exists
      const existingArticle = await storage.getArticleBySlug(slug);
      if (existingArticle) {
        return res.status(409).json({ error: "An article with this slug already exists" });
      }
      
      const tagsString = Array.isArray(tags) ? tags.map((t: string) => `- ${t}`).join('\n') : '';
      const articleContent = `---
title: "${title}"
date: "${date || new Date().toISOString().split('T')[0]}"
summary: "${summary}"
author: "${author}"
category: "${category}"
image: "${image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80'}"
tags:
${tagsString}
---

${content}`;
      
      // Create new article file
      const articlesDir = path.join("content", "articles");
      await fs.writeFile(path.join(articlesDir, `${slug}.md`), articleContent);
      
      res.status(201).json({ 
        success: true, 
        message: "Article created successfully",
        slug 
      });
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ error: "Failed to create article" });
    }
  });
  
  apiRouter.put("/admin/articles/:slug", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const { title, summary, category, content, author, date, image, tags } = req.body;
      const { slug } = req.params;
      
      if (!title || !summary || !category || !content || !author) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Check if article exists
      const existingArticle = await storage.getArticleBySlug(slug);
      if (!existingArticle) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      const tagsString = Array.isArray(tags) ? tags.map((t: string) => `- ${t}`).join('\n') : '';
      const articleContent = `---
title: "${title}"
date: "${date || existingArticle.meta.date}"
summary: "${summary}"
author: "${author}"
category: "${category}"
image: "${image || existingArticle.meta.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80'}"
tags:
${tagsString}
---

${content}`;
      
      // Update article file
      const articlesDir = path.join("content", "articles");
      await fs.writeFile(path.join(articlesDir, `${slug}.md`), articleContent);
      
      res.json({ 
        success: true, 
        message: "Article updated successfully",
        slug 
      });
    } catch (error) {
      console.error(`Error updating article (${req.params.slug}):`, error);
      res.status(500).json({ error: "Failed to update article" });
    }
  });
  
  apiRouter.delete("/admin/articles/:slug", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      
      // Check if article exists
      const existingArticle = await storage.getArticleBySlug(slug);
      if (!existingArticle) {
        return res.status(404).json({ error: "Articolo non trovato" });
      }
      
      // Elimina il file dell'articolo
      const articlesDir = path.join("content", "articles");
      await fs.unlink(path.join(articlesDir, `${slug}.md`));
      
      res.status(200).json({ 
        success: true, 
        message: "Article deleted successfully" 
      });
    } catch (error) {
      console.error(`Errore durante l'eliminazione dell'articolo (${req.params.slug}):`, error);
      res.status(500).json({ error: "Impossibile eliminare l'articolo" });
    }
  });

  // Upload immagine articolo
  apiRouter.post('/upload-image', upload.single('image'), (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ error: 'Nessun file caricato' });
    }
    // Costruisco l'URL pubblico
    const fileUrl = `/uploads/${file.filename}`;
    res.json({ url: fileUrl });
  });

  // Ricerca full-text
  apiRouter.get('/search', async (req: Request, res: Response) => {
    const { q = '', type } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Parametro di ricerca mancante' });
    }
    // Recupero tutti gli articoli
    const articles = await storage.getArticles();
    // TODO: prompt e risorse
    let data: any[] = articles;
    if (type === 'article' || !type) {
      // solo articoli per ora
      data = articles;
    }
    // Configuro Fuse.js
    const fuse = new Fuse(data, {
      keys: ['title', 'summary'],
      includeMatches: true,
      threshold: 0.4,
      minMatchCharLength: 2,
    });
    const results = fuse.search(q).map(result => {
      // Evidenzio i match
      const highlight = (text: string, matches: any[]) => {
        if (!matches) return text;
        let offset = 0;
        let highlighted = text;
        matches.forEach((m: any) => {
          m.indices.forEach(([start, end]: [number, number]) => {
            const before = highlighted.slice(0, start + offset);
            const match = highlighted.slice(start + offset, end + 1 + offset);
            const after = highlighted.slice(end + 1 + offset);
            highlighted = before + '<mark>' + match + '</mark>' + after;
            offset += '<mark>'.length + '</mark>'.length;
          });
        });
        return highlighted;
      };
      const { item, matches } = result;
      return {
        ...item,
        highlight: {
          title: highlight(item.title, [...(matches?.find((m: any) => m.key === 'title')?.indices || [])]),
          summary: highlight(item.summary, [...(matches?.find((m: any) => m.key === 'summary')?.indices || [])]),
        }
      };
    });
    res.json(results);
  });

  // API commenti articolo
  apiRouter.get('/articles/:slug/comments', async (req: Request, res: Response) => {
    const { slug } = req.params;
    const commentsPath = path.join('content', 'comments', `${slug}.json`);
    if (!fsSync.existsSync(commentsPath)) {
      return res.json([]);
    }
    const raw = await fs.readFile(commentsPath, 'utf-8');
    res.json(JSON.parse(raw));
  });

  apiRouter.post('/articles/:slug/comments', async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { author, text } = req.body;
    if (!author || !text) return res.status(400).json({ error: 'Autore e testo obbligatori' });
    const commentsPath = path.join('content', 'comments');
    if (!fsSync.existsSync(commentsPath)) fsSync.mkdirSync(commentsPath, { recursive: true });
    const file = path.join(commentsPath, `${slug}.json`);
    let comments = [];
    if (fsSync.existsSync(file)) {
      comments = JSON.parse(await fs.readFile(file, 'utf-8'));
    }
    const newComment = {
      id: Date.now(),
      author,
      text,
      date: new Date().toISOString(),
    };
    comments.push(newComment);
    await fs.writeFile(file, JSON.stringify(comments, null, 2));
    res.status(201).json(newComment);
  });

  // API Bookmark
  apiRouter.get('/bookmarks', async (req: Request, res: Response) => {
    const bookmarksPath = path.join('content', 'bookmarks.json');
    if (!fsSync.existsSync(bookmarksPath)) {
      return res.json([]);
    }
    const raw = await fs.readFile(bookmarksPath, 'utf-8');
    res.json(JSON.parse(raw));
  });

  apiRouter.post('/bookmarks', async (req: Request, res: Response) => {
    const { slug, title, summary, image } = req.body;
    if (!slug || !title) return res.status(400).json({ error: 'Slug e titolo obbligatori' });
    
    const bookmarksPath = path.join('content', 'bookmarks.json');
    let bookmarks = [];
    if (fsSync.existsSync(bookmarksPath)) {
      bookmarks = JSON.parse(await fs.readFile(bookmarksPath, 'utf-8'));
    }
    
    // Evita duplicati
    if (bookmarks.some((b: any) => b.slug === slug)) {
      return res.status(409).json({ error: 'Articolo già nei bookmark' });
    }
    
    const newBookmark = {
      slug,
      title,
      summary,
      image,
      date: new Date().toISOString()
    };
    
    bookmarks.push(newBookmark);
    await fs.writeFile(bookmarksPath, JSON.stringify(bookmarks, null, 2));
    res.status(201).json(newBookmark);
  });

  apiRouter.delete('/bookmarks/:slug', async (req: Request, res: Response) => {
    const { slug } = req.params;
    const bookmarksPath = path.join('content', 'bookmarks.json');
    
    if (!fsSync.existsSync(bookmarksPath)) {
      return res.status(404).json({ error: 'Nessun bookmark trovato' });
    }
    
    let bookmarks = JSON.parse(await fs.readFile(bookmarksPath, 'utf-8'));
    const initialLength = bookmarks.length;
    bookmarks = bookmarks.filter((b: any) => b.slug !== slug);
    
    if (bookmarks.length === initialLength) {
      return res.status(404).json({ error: 'Bookmark non trovato' });
    }
    
    await fs.writeFile(bookmarksPath, JSON.stringify(bookmarks, null, 2));
    res.status(200).json({ success: true });
  });

  // API Rating
  apiRouter.get('/articles/:slug/rating', async (req: Request, res: Response) => {
    const { slug } = req.params;
    const ratingsPath = path.join('content', 'ratings.json');
    
    if (!fsSync.existsSync(ratingsPath)) {
      return res.json({ average: 0, count: 0 });
    }
    
    const ratings = JSON.parse(await fs.readFile(ratingsPath, 'utf-8'));
    const articleRatings = ratings[slug] || { ratings: [], average: 0, count: 0 };
    
    res.json(articleRatings);
  });

  apiRouter.post('/articles/:slug/rating', async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { rating, userId } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating non valido' });
    }
    
    const ratingsPath = path.join('content', 'ratings.json');
    let allRatings: Record<string, any> = {};
    
    if (fsSync.existsSync(ratingsPath)) {
      allRatings = JSON.parse(await fs.readFile(ratingsPath, 'utf-8'));
    }
    
    if (!allRatings[slug]) {
      allRatings[slug] = { ratings: [], average: 0, count: 0 };
    }
    
    // Aggiorna o aggiungi il rating dell'utente
    const userRatingIndex = allRatings[slug].ratings.findIndex((r: any) => r.userId === userId);
    if (userRatingIndex >= 0) {
      allRatings[slug].ratings[userRatingIndex].rating = rating;
    } else {
      allRatings[slug].ratings.push({ userId, rating });
    }
    
    // Ricalcola media e conteggio
    const ratings = allRatings[slug].ratings.map((r: any) => r.rating);
    allRatings[slug].average = ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;
    allRatings[slug].count = ratings.length;
    
    await fs.writeFile(ratingsPath, JSON.stringify(allRatings, null, 2));
    res.json(allRatings[slug]);
  });

  // API Preferenze utente
  apiRouter.get('/user/preferences', async (req: Request, res: Response) => {
    const prefPath = path.join('content', 'user-preferences.json');
    let prefs = {
      theme: 'light',
      emailNotifications: false,
      categories: [] as string[],
    };
    if (fsSync.existsSync(prefPath)) {
      try {
        prefs = JSON.parse(await fs.readFile(prefPath, 'utf-8'));
      } catch (e) {
        // Se il file è corrotto, restituisco i default
      }
    }
    res.json(prefs);
  });

  apiRouter.post('/user/preferences', async (req: Request, res: Response) => {
    const prefPath = path.join('content', 'user-preferences.json');
    const { theme, emailNotifications, categories } = req.body;
    console.log('[PREFERENCES] Ricevuto:', req.body);
    if (!theme || !['light', 'dark'].includes(theme)) {
      console.error('[PREFERENCES] Tema non valido:', theme);
      return res.status(400).json({ error: 'Tema non valido' });
    }
    const prefs = {
      theme,
      emailNotifications: !!emailNotifications,
      categories: Array.isArray(categories) ? categories : [],
    };
    try {
      await fs.writeFile(prefPath, JSON.stringify(prefs, null, 2));
      console.log('[PREFERENCES] Preferenze salvate:', prefs);
      res.json({ success: true, preferences: prefs });
    } catch (err: any) {
      console.error('[PREFERENCES] Errore scrittura file:', err);
      res.status(500).json({ error: 'Errore nel salvataggio delle preferenze', details: err.message });
    }
  });

  // API Prompt avanzata
  const promptsPath = path.join('content', 'prompts.json');

  // GET tutti i prompt
  apiRouter.get('/prompts', async (req: Request, res: Response) => {
    let prompts: any[] = [];
    if (fsSync.existsSync(promptsPath)) {
      prompts = JSON.parse(await fs.readFile(promptsPath, 'utf-8'));
    }
    res.json(prompts);
  });

  // POST nuovo prompt
  apiRouter.post('/prompts', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    const { title, description, promptText, model, category, outputExample, createdBy } = req.body;
    if (!title || !promptText || !model || !category) {
      return res.status(400).json({ error: 'Campi obbligatori mancanti' });
    }
    let prompts: any[] = [];
    if (fsSync.existsSync(promptsPath)) {
      prompts = JSON.parse(await fs.readFile(promptsPath, 'utf-8'));
    }
    const newPrompt = {
      id: Date.now(),
      title,
      description: description || '',
      promptText,
      model,
      category,
      outputExample: outputExample || '',
      votes: 0,
      copyCount: 0,
      comments: [],
      createdBy: createdBy || 'admin',
      createdAt: new Date().toISOString(),
    };
    prompts.push(newPrompt);
    await fs.writeFile(promptsPath, JSON.stringify(prompts, null, 2));
    res.status(201).json(newPrompt);
  });

  // PUT modifica prompt
  apiRouter.put('/prompts/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;
    let prompts: any[] = [];
    if (fsSync.existsSync(promptsPath)) {
      prompts = JSON.parse(await fs.readFile(promptsPath, 'utf-8'));
    }
    const idx = prompts.findIndex((p: any) => String(p.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: 'Prompt non trovato' });
    prompts[idx] = { ...prompts[idx], ...req.body };
    await fs.writeFile(promptsPath, JSON.stringify(prompts, null, 2));
    res.json(prompts[idx]);
  });

  // POST incrementa copyCount
  apiRouter.post('/prompts/:id/copy', async (req: Request, res: Response) => {
    const { id } = req.params;
    let prompts: any[] = [];
    if (fsSync.existsSync(promptsPath)) {
      prompts = JSON.parse(await fs.readFile(promptsPath, 'utf-8'));
    }
    const idx = prompts.findIndex((p: any) => String(p.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: 'Prompt non trovato' });
    prompts[idx].copyCount = (prompts[idx].copyCount || 0) + 1;
    await fs.writeFile(promptsPath, JSON.stringify(prompts, null, 2));
    res.json({ copyCount: prompts[idx].copyCount });
  });

  // POST incrementa votes
  apiRouter.post('/prompts/:id/vote', async (req: Request, res: Response) => {
    const { id } = req.params;
    let prompts: any[] = [];
    if (fsSync.existsSync(promptsPath)) {
      prompts = JSON.parse(await fs.readFile(promptsPath, 'utf-8'));
    }
    const idx = prompts.findIndex((p: any) => String(p.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: 'Prompt non trovato' });
    prompts[idx].votes = (prompts[idx].votes || 0) + 1;
    await fs.writeFile(promptsPath, JSON.stringify(prompts, null, 2));
    res.json({ votes: prompts[idx].votes });
  });

  // POST aggiungi commento
  apiRouter.post('/prompts/:id/comment', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userName, text } = req.body;
    if (!userName || !text) return res.status(400).json({ error: 'Nome e testo obbligatori' });
    let prompts: any[] = [];
    if (fsSync.existsSync(promptsPath)) {
      prompts = JSON.parse(await fs.readFile(promptsPath, 'utf-8'));
    }
    const idx = prompts.findIndex((p: any) => String(p.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: 'Prompt non trovato' });
    const newComment = {
      id: Date.now(),
      userName,
      text,
      date: new Date().toISOString(),
    };
    prompts[idx].comments = prompts[idx].comments || [];
    prompts[idx].comments.push(newComment);
    await fs.writeFile(promptsPath, JSON.stringify(prompts, null, 2));
    res.status(201).json(newComment);
  });

  // API per ottenere la lista degli iscritti alla newsletter (pubblica)
  apiRouter.get('/newsletter-subscribers', async (req: Request, res: Response) => {
    try {
      if (process.env.NODE_ENV === 'production') {
        // PRODUZIONE: Usa database PostgreSQL
        console.log('🗄️ [PROD] Caricando iscritti da database per API pubblica');
        
        try {
          // Import dinamico del database solo in produzione
          const { db } = await import("./db");
          const { subscribers } = await import("@shared/schema");
          const { desc } = await import("drizzle-orm");
          
          const dbSubscribers = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
          const emails = dbSubscribers.map(sub => sub.email);
          console.log('✅ [PROD] Restituiti', emails.length, 'iscritti da database');
          return res.json(emails);
        } catch (dbError) {
          console.error('❌ [PROD] Errore database API pubblica:', dbError);
          return res.json([]); // Fallback: array vuoto
        }
      } else {
        // SVILUPPO: Usa file JSON
        console.log('📁 [DEV] Caricando iscritti da file per API pubblica');
        
        const filePath = path.join('content', 'newsletter.json');
        let emails: string[] = [];
        
        try {
          const data = await fs.readFile(filePath, 'utf-8');
          emails = JSON.parse(data);
          console.log('✅ [DEV] Restituiti', emails.length, 'iscritti da file');
        } catch (e) {
          console.log('⚠️ [DEV] File non trovato, ritorno array vuoto');
          emails = [];
        }
        
        return res.json(emails);
      }
    } catch (error) {
      console.error('❌ Errore API pubblica newsletter-subscribers:', error);
      res.json([]); // Sempre un array, mai errore 500 per API pubblica
    }
  });

  // Nuove API per la gestione della newsletter

  // Ottieni tutti gli iscritti alla newsletter
  apiRouter.get('/admin/newsletter/subscribers', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      console.log('📋 Richiesta lista iscritti newsletter');
      
      if (process.env.NODE_ENV === 'production') {
        // PRODUZIONE: Usa database PostgreSQL
        console.log('🗄️ [PROD] Usando database PostgreSQL per iscritti');
        
        try {
          // Import dinamico del database solo in produzione
          const { db } = await import("./db");
          const { subscribers } = await import("@shared/schema");
          const { desc } = await import("drizzle-orm");
          
          const dbSubscribers = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
          console.log('✅ [PROD] Caricati', dbSubscribers.length, 'iscritti da database');
          
          // Converti al formato atteso dal frontend
          const formattedSubscribers = dbSubscribers.map(sub => ({
            id: sub.id,
            email: sub.email,
            createdAt: sub.createdAt.toISOString()
          }));
          
          return res.json(formattedSubscribers);
        } catch (dbError) {
          console.error('❌ [PROD] Errore database:', dbError);
          return res.status(500).json({ error: 'Errore nel caricamento iscritti dal database' });
        }
      } else {
        // SVILUPPO: Usa file JSON
        console.log('📁 [DEV] Usando file JSON per iscritti');
        
        const filePath = path.join('content', 'newsletter.json');
        let emails: string[] = [];
        
        try {
          if (fsSync.existsSync(filePath)) {
            const data = await fs.readFile(filePath, 'utf-8');
            emails = JSON.parse(data);
            console.log('✅ [DEV] Caricati', emails.length, 'iscritti da newsletter.json');
          }
        } catch (e) {
          console.log('⚠️ [DEV] Errore lettura newsletter.json:', e);
          emails = [];
        }
        
        // Converti in formato richiesto dal componente
        const subscribersData = emails.map((email, index) => ({
          id: index + 1,
          email: email,
          createdAt: new Date().toISOString()
        }));
        
        return res.json(subscribersData);
      }
    } catch (error) {
      console.error('Errore nel recupero degli iscritti:', error);
      res.status(500).json({ error: 'Errore nel recupero degli iscritti' });
    }
  });

  // Elimina un iscritto
  apiRouter.delete('/admin/newsletter/subscribers/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { email } = req.body;
      
      console.log('🗑️ Richiesta cancellazione iscritto:', email);
      
      if (process.env.NODE_ENV === 'production') {
        // PRODUZIONE: Usa database PostgreSQL
        console.log('🗄️ [PROD] Cancellando iscritto dal database PostgreSQL:', email);
        
        try {
          // Import dinamico del database solo in produzione
          const { db } = await import("./db");
          const { subscribers } = await import("@shared/schema");
          const { eq } = await import("drizzle-orm");
          
          const result = await db.delete(subscribers).where(eq(subscribers.email, email)).returning();
          
          if (result.length === 0) {
            return res.status(404).json({ error: 'Iscritto non trovato' });
          }
          
          console.log('✅ [PROD] Iscritto rimosso dal database:', email);
          return res.json({ success: true });
          
        } catch (dbError) {
          console.error('❌ [PROD] Errore database durante cancellazione:', dbError);
          return res.status(500).json({ error: 'Errore nella cancellazione dal database' });
        }
      } else {
        // SVILUPPO: Usa file JSON
        console.log('📁 [DEV] Cancellando iscritto da file JSON:', email);
        
        const filePath = path.join('content', 'newsletter.json');
        let emails: string[] = [];
        
        try {
          if (fsSync.existsSync(filePath)) {
            const data = await fs.readFile(filePath, 'utf-8');
            emails = JSON.parse(data);
          }
        } catch (e) {
          console.log('⚠️ [DEV] Errore lettura newsletter.json:', e);
          return res.status(500).json({ error: 'Errore nella lettura del file iscritti' });
        }
        
        // Rimuovi l'email
        const originalLength = emails.length;
        emails = emails.filter(e => e !== email);
        
        if (emails.length === originalLength) {
          return res.status(404).json({ error: 'Iscritto non trovato' });
        }
        
        // Salva il file aggiornato
        await fs.writeFile(filePath, JSON.stringify(emails, null, 2));
        console.log('✅ [DEV] Iscritto rimosso da newsletter.json:', email);
        
        return res.json({ success: true });
      }
    } catch (error) {
      console.error('Errore nella cancellazione dell\'iscritto:', error);
      res.status(500).json({ error: 'Errore nella cancellazione dell\'iscritto' });
    }
  });

  // Ottieni tutte le campagne newsletter
  apiRouter.get('/admin/newsletter/campaigns', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      // Per ora usiamo un file JSON semplice per le campagne
      const campaignsPath = path.join('content', 'newsletter-campaigns.json');
      let campaigns = [];
      
      try {
        if (fsSync.existsSync(campaignsPath)) {
          const data = await fs.readFile(campaignsPath, 'utf-8');
          campaigns = JSON.parse(data);
        }
      } catch (e) {
        console.log('⚠️ Errore lettura campagne:', e);
        campaigns = [];
      }
      
      res.json(campaigns);
    } catch (error) {
      console.error('Errore nel recupero delle campagne:', error);
      res.status(500).json({ error: 'Errore nel recupero delle campagne' });
    }
  });

  // Crea una nuova campagna newsletter
  apiRouter.post('/admin/newsletter/campaigns', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const { subject, content, htmlContent } = req.body;
      
      if (!subject || !content) {
        return res.status(400).json({ error: 'Subject e content sono obbligatori' });
      }

      const campaignsPath = path.join('content', 'newsletter-campaigns.json');
      let campaigns = [];
      
      try {
        if (fsSync.existsSync(campaignsPath)) {
          const data = await fs.readFile(campaignsPath, 'utf-8');
          campaigns = JSON.parse(data);
        }
      } catch (e) {
        campaigns = [];
      }

      const newCampaign = {
        id: Date.now(),
        subject,
        content,
        htmlContent: htmlContent || content,
        status: 'draft',
        sentCount: 0,
        recipientsCount: 0,
        createdAt: new Date().toISOString()
      };

      campaigns.push(newCampaign);
      await fs.writeFile(campaignsPath, JSON.stringify(campaigns, null, 2));
      
      res.status(201).json(newCampaign);
    } catch (error) {
      console.error('Errore nella creazione della campagna:', error);
      res.status(500).json({ error: 'Errore nella creazione della campagna' });
    }
  });

  // Invia una campagna newsletter
  apiRouter.post('/admin/newsletter/campaigns/:id/send', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const campaignId = parseInt(id);

      console.log('🚀 [CAMPAIGN] Avvio invio campagna:', campaignId);

      // Carica campagne
      const campaignsPath = path.join('content', 'newsletter-campaigns.json');
      let campaigns = [];
      
      try {
        if (fsSync.existsSync(campaignsPath)) {
          const data = await fs.readFile(campaignsPath, 'utf-8');
          campaigns = JSON.parse(data);
          console.log('📋 [CAMPAIGN] Campagne caricate:', campaigns.length);
        }
      } catch (e) {
        console.log('❌ [CAMPAIGN] Errore caricamento campagne:', e);
        return res.status(500).json({ error: 'Errore nel caricamento delle campagne' });
      }

      const campaignIndex = campaigns.findIndex((c: any) => c.id === campaignId);
      if (campaignIndex === -1) {
        console.log('❌ [CAMPAIGN] Campagna non trovata:', campaignId);
        return res.status(404).json({ error: 'Campagna non trovata' });
      }

      const campaign = campaigns[campaignIndex];
      console.log('📧 [CAMPAIGN] Campagna trovata:', campaign.subject);
      
      // Carica subscribers
      const subscribersPath = path.join('content', 'newsletter.json');
      let emails: string[] = [];
      
      try {
        if (fsSync.existsSync(subscribersPath)) {
          const data = await fs.readFile(subscribersPath, 'utf-8');
          emails = JSON.parse(data);
          console.log('📋 [CAMPAIGN] Iscritti caricati:', emails.length);
          console.log('📋 [CAMPAIGN] Lista iscritti:', emails);
        } else {
          console.log('❌ [CAMPAIGN] File newsletter.json non trovato');
        }
      } catch (e) {
        console.log('❌ [CAMPAIGN] Errore caricamento iscritti:', e);
        return res.status(500).json({ error: 'Errore nel caricamento degli iscritti' });
      }

      if (emails.length === 0) {
        console.log('⚠️ [CAMPAIGN] Nessun iscritto trovato');
        // Aggiorna campagna come fallita
        campaigns[campaignIndex] = {
          ...campaign,
          status: 'failed',
          sentAt: new Date().toISOString(),
          recipientsCount: 0,
          sentCount: 0
        };
        await fs.writeFile(campaignsPath, JSON.stringify(campaigns, null, 2));
        return res.json({ success: false, sentCount: 0, failedCount: 0, totalSubscribers: 0, error: 'Nessun iscritto trovato' });
      }

      // Configura il trasportatore email
      console.log('📮 [CAMPAIGN] Configurazione email...');
      console.log('📮 [CAMPAIGN] SMTP Host:', process.env.SMTP_HOST || 'Non configurato');
      console.log('📮 [CAMPAIGN] SMTP User:', process.env.SMTP_USER || 'Non configurato');
      
      // Controlla se SMTP è configurato
      const isSmtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
      
      if (!isSmtpConfigured) {
        console.log('⚠️ [CAMPAIGN] SMTP non configurato - modalità DEMO attivata');
        
        // Modalità demo: simula l'invio
        let sentCount = 0;
        let failedCount = 0;

        console.log('📧 [CAMPAIGN] Simulazione invio a', emails.length, 'iscritti...');
        
        for (const email of emails) {
          console.log('📧 [CAMPAIGN] Simulazione invio a:', email);
          
          // Simula un piccolo delay come se stesse inviando
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Simula successo per tutti in modalità demo
          sentCount++;
          console.log('✅ [CAMPAIGN] Email simulata inviata con successo a:', email);
        }

        console.log('📊 [CAMPAIGN] Risultati simulazione - Successi:', sentCount, 'Errori:', failedCount);

        // Aggiorna la campagna con i risultati della simulazione
        campaigns[campaignIndex] = {
          ...campaign,
          status: 'sent',
          sentAt: new Date().toISOString(),
          recipientsCount: emails.length,
          sentCount: sentCount
        };
        
        await fs.writeFile(campaignsPath, JSON.stringify(campaigns, null, 2));

        return res.json({ 
          success: true, 
          sentCount, 
          failedCount, 
          totalSubscribers: emails.length,
          demo: true,
          message: 'Campagna inviata in modalità demo (SMTP non configurato)'
        });
      }
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      let sentCount = 0;
      let failedCount = 0;

      console.log('📧 [CAMPAIGN] Inizio invio reale a', emails.length, 'iscritti...');
      
      // Invia email a tutti gli iscritti
      for (const email of emails) {
        try {
          console.log('📧 [CAMPAIGN] Invio a:', email);
          
          const htmlTemplate = `
            <div style="background: linear-gradient(135deg, #0f172a 0%, #2563eb 100%); padding: 0; min-height: 600px; font-family: Inter, Arial, sans-serif;">
              <div style="max-width: 600px; margin: 0 auto; background: rgba(30,41,59,0.98); border-radius: 24px; box-shadow: 0 8px 32px rgba(37,99,235,0.15); padding: 40px; position: relative; top: 0;">
                <div style="text-align:center; margin-bottom:32px;">
                  <img src='https://genai4business.com/logo.png' alt='GenAI4Business Logo' style='height:48px; margin-bottom:16px;' />
                  <h1 style="color: #2563eb; font-size: 28px; font-weight: 800; margin: 16px 0;">GenAI4Business Newsletter</h1>
                </div>
                <div style="color: #f1f5f9; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                  ${campaign.htmlContent || campaign.content.replace(/\n/g, '<br>')}
                </div>
                <div style="text-align: center; color: #94a3b8; font-size: 14px; margin-top: 48px;">
                  You received this email because you subscribed to <b>GenAI4Business</b> newsletter.<br />
                  <a href="mailto:info@genai4business.com?subject=Unsubscribe&body=Please remove ${email} from the newsletter" style="color: #60a5fa; text-decoration: underline;">Unsubscribe</a>
                </div>
              </div>
            </div>
          `;

          await transporter.sendMail({
            from: process.env.SMTP_FROM || 'GenAI4Business <no-reply@genai4business.com>',
            to: email,
            subject: campaign.subject,
            html: htmlTemplate,
          });

          sentCount++;
          console.log('✅ [CAMPAIGN] Email inviata con successo a:', email);
        } catch (error) {
          console.error(`❌ [CAMPAIGN] Errore nell'invio a ${email}:`, error);
          failedCount++;
        }
      }

      console.log('📊 [CAMPAIGN] Risultati invio - Successi:', sentCount, 'Errori:', failedCount);

      // Aggiorna la campagna con i risultati
      campaigns[campaignIndex] = {
        ...campaign,
        status: sentCount > 0 ? 'sent' : 'failed',
        sentAt: new Date().toISOString(),
        recipientsCount: emails.length,
        sentCount: sentCount
      };
      
      await fs.writeFile(campaignsPath, JSON.stringify(campaigns, null, 2));

      res.json({ 
        success: sentCount > 0, 
        sentCount, 
        failedCount, 
        totalSubscribers: emails.length 
      });

    } catch (error) {
      console.error('❌ [CAMPAIGN] Errore nell\'invio della campagna:', error);
      res.status(500).json({ error: 'Errore nell\'invio della campagna' });
    }
  });

  // Reset campagna per permettere il reinvio
  apiRouter.put('/admin/newsletter/campaigns/:id/reset', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const campaignId = parseInt(id);

      console.log('🔄 [CAMPAIGN] Reset campagna:', campaignId);

      // Carica campagne
      const campaignsPath = path.join('content', 'newsletter-campaigns.json');
      let campaigns = [];
      
      try {
        if (fsSync.existsSync(campaignsPath)) {
          const data = await fs.readFile(campaignsPath, 'utf-8');
          campaigns = JSON.parse(data);
        }
      } catch (e) {
        console.log('❌ [CAMPAIGN] Errore caricamento campagne:', e);
        return res.status(500).json({ error: 'Errore nel caricamento delle campagne' });
      }

      const campaignIndex = campaigns.findIndex((c: any) => c.id === campaignId);
      if (campaignIndex === -1) {
        console.log('❌ [CAMPAIGN] Campagna non trovata:', campaignId);
        return res.status(404).json({ error: 'Campagna non trovata' });
      }

      const campaign = campaigns[campaignIndex];
      
      if (campaign.status === 'draft') {
        console.log('⚠️ [CAMPAIGN] Campagna già in stato draft:', campaignId);
        return res.status(400).json({ error: 'La campagna è già in stato draft' });
      }

      // Reset della campagna a stato draft
      campaigns[campaignIndex] = {
        ...campaign,
        status: 'draft',
        sentAt: null,
        sentCount: 0,
        recipientsCount: 0
      };
      
      await fs.writeFile(campaignsPath, JSON.stringify(campaigns, null, 2));
      
      console.log('✅ [CAMPAIGN] Campagna resettata a draft:', campaignId);
      
      res.json({ 
        success: true, 
        message: 'Campagna resettata con successo',
        campaign: campaigns[campaignIndex]
      });

    } catch (error) {
      console.error('❌ [CAMPAIGN] Errore nel reset della campagna:', error);
      res.status(500).json({ error: 'Errore nel reset della campagna' });
    }
  });

  // Ottieni statistiche newsletter
  apiRouter.get('/admin/newsletter/stats', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      // Conta iscritti
      const subscribersPath = path.join('content', 'newsletter.json');
      let emails: string[] = [];
      
      try {
        if (fsSync.existsSync(subscribersPath)) {
          const data = await fs.readFile(subscribersPath, 'utf-8');
          emails = JSON.parse(data);
        }
      } catch (e) {
        emails = [];
      }

      // Conta campagne
      const campaignsPath = path.join('content', 'newsletter-campaigns.json');
      let campaigns = [];
      
      try {
        if (fsSync.existsSync(campaignsPath)) {
          const data = await fs.readFile(campaignsPath, 'utf-8');
          campaigns = JSON.parse(data);
        }
      } catch (e) {
        campaigns = [];
      }

      const sentCampaigns = campaigns.filter((c: any) => c.status === 'sent').length;

      res.json({
        totalSubscribers: emails.length,
        totalCampaigns: campaigns.length,
        sentCampaigns: sentCampaigns
      });
    } catch (error) {
      console.error('Errore nel recupero delle statistiche:', error);
      res.status(500).json({ error: 'Errore nel recupero delle statistiche' });
    }
  });

  // GET top 50 prompts from internet
  apiRouter.get('/prompts/top', async (req: Request, res: Response) => {
    // Simuliamo i top 50 prompts caricati da internet
    const topPrompts = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `Top Prompt ${i + 1}`,
      description: `Description for top prompt ${i + 1}`,
      promptText: `This is the text for top prompt ${i + 1}`,
      model: 'gpt-4',
      category: 'general',
      votes: Math.floor(Math.random() * 100),
      copyCount: Math.floor(Math.random() * 50),
      comments: [],
      createdAt: new Date().toISOString()
    }));
    res.json(topPrompts);
  });

  // Debug endpoint temporaneo
  apiRouter.get("/debug/articles-log", async (req: Request, res: Response) => {
    try {
      // Usa /tmp invece di /app per evitare problemi di permessi su Render
      const debugFile = process.env.NODE_ENV === 'production' 
        ? path.join("/tmp", "debug-articles.log")
        : path.join(process.cwd(), "debug-articles.log");
      const content = await fs.readFile(debugFile, "utf-8");
      res.set('Content-Type', 'text/plain');
      res.send(content);
    } catch (error: any) {
      res.status(404).json({ error: "Debug log not found", message: error.message });
    }
  });

  // Nuovo endpoint debug per verificare gli articoli
  apiRouter.get("/debug/articles-info", async (req: Request, res: Response) => {
    try {
      const debug: {
        timestamp: string;
        workingDirectory: string;
        environment: string;
        contentDir: any;
        articlesInfo: {
          directoryExists: boolean;
          files: string[];
          articles: any[];
          errors: any[];
        };
      } = {
        timestamp: new Date().toISOString(),
        workingDirectory: process.cwd(),
        environment: process.env.NODE_ENV || 'development',
        contentDir: {},
        articlesInfo: {
          directoryExists: false,
          files: [],
          articles: [],
          errors: []
        }
      };

      // Verifica directory content
      try {
        const contentPath = path.join("content");
        const contentExists = await fs.access(contentPath).then(() => true).catch(() => false);
        if (contentExists) {
          const contentFiles = await fs.readdir(contentPath);
          debug.contentDir = { exists: true, files: contentFiles };
        } else {
          debug.contentDir = { exists: false, error: "Directory content not found" };
        }
      } catch (error: any) {
        debug.contentDir = { exists: false, error: error.message };
      }

      // Verifica directory articles
      try {
        const articlesPath = path.join("content", "articles");
        const articlesExists = await fs.access(articlesPath).then(() => true).catch(() => false);
        if (articlesExists) {
          debug.articlesInfo.directoryExists = true;
          const articleFiles = await fs.readdir(articlesPath);
          debug.articlesInfo.files = articleFiles.filter(f => f.endsWith('.md'));
          
          // Prova a leggere ogni articolo
          for (const file of debug.articlesInfo.files) {
            try {
              const filePath = path.join(articlesPath, file);
              const content = await fs.readFile(filePath, "utf-8");
              const lines = content.split('\n').length;
              const size = content.length;
              debug.articlesInfo.articles.push({
                file,
                slug: path.basename(file, '.md'),
                size,
                lines,
                hasContent: size > 0,
                preview: content.substring(0, 200) + (content.length > 200 ? '...' : '')
              });
            } catch (error: any) {
              debug.articlesInfo.errors.push({ file, error: error.message });
            }
          }
        } else {
          debug.articlesInfo.directoryExists = false;
        }
      } catch (error: any) {
        debug.articlesInfo.errors.push({ general: error.message });
      }

      res.json(debug);
    } catch (error: any) {
      res.status(500).json({ error: "Debug failed", message: error.message });
    }
  });

  // Debug endpoint temporaneo per newsletter (RIMUOVI IN PRODUZIONE)
  apiRouter.get('/debug/newsletter/subscribers', async (req: Request, res: Response) => {
    try {
      console.log('🔍 [DEBUG] Richiesta debug lista iscritti newsletter');
      
      // Sistema principale: file JSON
      const filePath = path.join('content', 'newsletter.json');
      let emails: string[] = [];
      
      try {
        if (fsSync.existsSync(filePath)) {
          const data = await fs.readFile(filePath, 'utf-8');
          emails = JSON.parse(data);
          console.log('✅ [DEBUG] Caricati', emails.length, 'iscritti da newsletter.json');
          console.log('📋 [DEBUG] Lista completa:', emails);
        } else {
          console.log('❌ [DEBUG] File newsletter.json non trovato');
        }
      } catch (e) {
        console.log('⚠️ [DEBUG] Errore lettura newsletter.json:', e);
        emails = [];
      }
      
      // Converti in formato richiesto dal componente
      const subscribers = emails.map((email, index) => ({
        id: index + 1,
        email: email,
        createdAt: new Date().toISOString()
      }));
      
      res.json({
        debug: true,
        filePath: filePath,
        fileExists: fsSync.existsSync(filePath),
        totalEmails: emails.length,
        rawEmails: emails,
        formattedSubscribers: subscribers
      });
    } catch (error) {
      console.error('❌ [DEBUG] Errore nel recupero degli iscritti:', error);
      res.status(500).json({ error: 'Errore nel recupero degli iscritti', debug: true });
    }
  });

  // Hackathon APIs
  
  // Get all hackathon days
  apiRouter.get("/hackathon/days", async (req: Request, res: Response) => {
    try {
      console.log("🔍 [HACKATHON] Richiesta giorni hackathon ricevuta");
      
      const hackathonFile = path.join('content', 'hackathon-days.json');
      
      try {
        const data = await fs.readFile(hackathonFile, 'utf-8');
        const days = JSON.parse(data);
        console.log("✅ [HACKATHON] Giorni caricati dal file:", days?.length || 0);
        res.json(days);
      } catch (fileError) {
        console.log("📁 [HACKATHON] File non trovato, inizializzo 30 giorni...");
        
        // Initialize 30 days of hackathon if file doesn't exist
        const startDate = new Date('2025-01-01');
        const hackathonDays = [];
        
        for (let i = 0; i < 30; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          hackathonDays.push({
            day: i + 1,
            date: currentDate.toLocaleDateString('it-IT'),
            title: i === 0 ? 'Kickoff - Setup del progetto' : `Giorno ${i + 1}`,
            description: i === 0 ? 'Configurazione ambiente, planning e obiettivi iniziali' : 'Da pianificare...',
            achievements: i === 0 ? ['Setup repository', 'Configurazione CI/CD', 'Planning roadmap'] : [],
            challenges: i === 0 ? ['Definire scope preciso', 'Bilanciare features vs tempo'] : [],
            techStack: i === 0 ? ['React', 'TypeScript', 'Vite'] : [],
            status: i === 0 ? 'completed' : 'planned',
            timeSpent: i === 0 ? 8 : 0,
            githubCommits: i === 0 ? 12 : 0
          });
        }
        
        // Save initialized data
        try {
          await fs.mkdir(path.dirname(hackathonFile), { recursive: true });
          await fs.writeFile(hackathonFile, JSON.stringify(hackathonDays, null, 2));
          console.log("✅ [HACKATHON] Giorni inizializzati e salvati");
        } catch (saveError) {
          console.warn("⚠️ [HACKATHON] Impossibile salvare il file iniziale:", saveError);
        }
        
        res.json(hackathonDays);
      }
    } catch (error) {
      console.error("❌ [HACKATHON] Errore nel recupero dei giorni:", error);
      res.status(500).json({ error: "Errore interno del server" });
    }
  });

  // Update a specific hackathon day
  apiRouter.put("/hackathon/days/:dayNumber", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const { dayNumber } = req.params;
      const updatedDay = req.body;
      
      console.log(`🔄 [HACKATHON] Aggiornamento giorno ${dayNumber}:`, updatedDay);
      
      const hackathonFile = path.join('content', 'hackathon-days.json');
      
      try {
        const data = await fs.readFile(hackathonFile, 'utf-8');
        const days = JSON.parse(data);
        
        const dayIndex = parseInt(dayNumber) - 1;
        if (dayIndex < 0 || dayIndex >= days.length) {
          return res.status(404).json({ error: "Giorno non trovato" });
        }
        
        // Update the specific day
        days[dayIndex] = { ...days[dayIndex], ...updatedDay, day: parseInt(dayNumber) };
        
        // Save updated data
        await fs.writeFile(hackathonFile, JSON.stringify(days, null, 2));
        
        console.log(`✅ [HACKATHON] Giorno ${dayNumber} aggiornato con successo`);
        res.json(days[dayIndex]);
        
      } catch (fileError) {
        console.error(`❌ [HACKATHON] Errore nel file per il giorno ${dayNumber}:`, fileError);
        res.status(404).json({ error: "File dei giorni hackathon non trovato" });
      }
    } catch (error) {
      console.error(`❌ [HACKATHON] Errore nell'aggiornamento del giorno ${req.params.dayNumber}:`, error);
      res.status(500).json({ error: "Errore interno del server" });
    }
  });

  // Subscribe to hackathon newsletter
  apiRouter.post("/hackathon/subscribe", async (req: Request, res: Response) => {
    console.log('📧 Richiesta iscrizione newsletter hackathon ricevuta:', req.body);
    
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      console.log('❌ Email non valida:', email);
      return res.status(400).json({ error: 'Invalid email' });
    }

    try {
      const subscriberFile = path.join('content', 'hackathon-subscribers.json');
      
      try {
        const data = await fs.readFile(subscriberFile, 'utf-8');
        const subscribers = JSON.parse(data);
        
        // Check if email already exists
        if (subscribers.find((sub: any) => sub.email === email)) {
          console.log('⚠️ Email già iscritta alla newsletter hackathon:', email);
          return res.status(409).json({ error: 'Email già iscritta alla newsletter' });
        }
        
        // Add new subscriber
        subscribers.push({
          email,
          subscribedAt: new Date().toISOString(),
          type: 'hackathon'
        });
        
        await fs.writeFile(subscriberFile, JSON.stringify(subscribers, null, 2));
        
      } catch (fileError) {
        // Create new file if doesn't exist
        const newSubscribers = [{
          email,
          subscribedAt: new Date().toISOString(),
          type: 'hackathon'
        }];
        
        await fs.mkdir(path.dirname(subscriberFile), { recursive: true });
        await fs.writeFile(subscriberFile, JSON.stringify(newSubscribers, null, 2));
      }
      
      console.log('✅ Iscritto salvato nella newsletter hackathon:', email);
      
      // Send welcome email for hackathon
      try {
        await sendHackathonWelcomeEmail(email);
      } catch (emailError) {
        console.warn('⚠️ Impossibile inviare email di benvenuto hackathon:', emailError);
        // Non blocchiamo la risposta se l'email fallisce
      }
      
      res.status(200).json({ 
        success: true, 
        message: 'Iscrizione alla newsletter hackathon completata!',
        email: email
      });
      
    } catch (error) {
      console.error('❌ Errore durante l\'iscrizione alla newsletter hackathon:', error);
      res.status(500).json({ error: 'Errore durante l\'iscrizione' });
    }
  });

  // Mount API routes under /api
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
