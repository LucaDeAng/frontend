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

// Configurazione multer per usare /tmp invece di public/uploads
const uploadsDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : path.join('public', 'uploads');

// Assicuriamoci che la directory esista
try {
  if (!fsSync.existsSync(uploadsDir)) {
    fsSync.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (error) {
  console.warn('Impossibile creare la directory uploads:', error);
}

const upload = multer({ dest: uploadsDir });

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
    const { email } = req.body;
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });
    await storage.saveEmail(email);

    // Invia email di benvenuto
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      const html = `
        <div style="background: linear-gradient(135deg, #0f172a 0%, #2563eb 100%); padding: 0; min-height: 600px; font-family: Inter, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: rgba(30,41,59,0.98); border-radius: 24px; box-shadow: 0 8px 32px rgba(37,99,235,0.15); padding: 40px; position: relative; top: 0;">
            <div style="text-align:center; margin-bottom:32px;">
              <img src='https://aihub.dev/logo.png' alt='AI Hub Logo' style='height:48px; margin-bottom:16px;' />
              <h1 style="color: #2563eb; font-size: 32px; font-weight: 800; margin: 32px 0 16px;">Welcome to AI Hub!</h1>
            </div>
            <div style="color: #f1f5f9; font-size: 18px; line-height: 1.6; margin-bottom: 32px;">
              <p>Hi and welcome! 🎉<br><br>
              You've just joined a growing community of AI enthusiasts, professionals, and learners.<br><br>
              <b>What's next?</b><br>
              - Explore our latest articles, guides, and resources<br>
              - Get inspired by real-world AI use cases<br>
              - Access exclusive content and updates<br><br>
              <a href="https://aihub.dev" style="display:inline-block; background:#2563eb; color:#fff; border-radius:8px; padding:14px 32px; font-weight:700; text-decoration:none; font-size:18px; margin-top:16px;">Visit AI Hub</a>
              </p>
            </div>
            <div style="text-align: center; color: #94a3b8; font-size: 14px; margin-top: 48px;">
              You received this email because you subscribed to <b>AI Hub</b>.<br />
              <a href="#" style="color: #60a5fa; text-decoration: underline;">Unsubscribe</a>
            </div>
          </div>
        </div>
      `;
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'AI Hub <no-reply@aihub.dev>',
        to: email,
        subject: 'Welcome to AI Hub! 🚀',
        html,
      });
    } catch (err) {
      console.error('Error sending welcome email:', err);
      // Non blocco la risposta all'utente
    }

    res.status(200).json({ success: true });
  });
  
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

  // API per ottenere la lista degli iscritti alla newsletter
  apiRouter.get('/newsletter-subscribers', async (req: Request, res: Response) => {
    const filePath = path.join('content', 'newsletter.json');
    let emails: string[] = [];
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      emails = JSON.parse(data);
    } catch (e) {
      // Se il file non esiste, emails resta []
    }
    // Se in futuro vuoi aggiungere la data, qui puoi restituire un array di oggetti { email, date }
    res.json(emails);
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

  // Mount API routes under /api
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
