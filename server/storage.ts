import { users, type User, type InsertUser } from "@shared/schema";
import fs from "fs/promises";
import path from "path";
import { Article, ArticleMeta } from "@shared/types";
import { extractFrontmatter } from "../client/src/lib/markdown";
import fsSync from 'fs';
// Import dinamico del database solo se disponibile


// Import del backup locale degli articoli
import articlesBackup from './articles-backup.json';
import articlesContentBackup from './articles-content-backup.json';

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getArticles(): Promise<ArticleMeta[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  saveEmail(email: string): Promise<void>;
  saveArticleToDb(data: { slug: string; title: string; summary: string; content: string; author: string; category: string; image?: string; tags?: string[]; date?: string; }): Promise<void>;
  updateArticleInDb(slug: string, data: { title: string; summary: string; content: string; author: string; category: string; image?: string; tags?: string[]; date?: string; }): Promise<void>;
  deleteArticleFromDb(slug: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
      password: insertUser.password ?? null,
      displayName: insertUser.displayName ?? null,
      avatar: insertUser.avatar ?? null,
      bio: insertUser.bio ?? null,
      preferences: {
        theme: (insertUser.preferences?.theme ?? "light") as "light" | "dark",
        emailNotifications: insertUser.preferences?.emailNotifications ?? false,
        categories: (insertUser.preferences?.categories ?? []) as string[]
      },
      isVerified: insertUser.isVerified ?? null,
      loginProvider: insertUser.loginProvider ?? null
    };
    this.users.set(id, user);
    return user;
  }

  async getArticles(): Promise<ArticleMeta[]> {
    try {
      if (process.env.DATABASE_URL) {
        try {
          const { db } = await import("./db");
          const { articles } = await import("@shared/schema");
          const { desc } = await import("drizzle-orm");

          const rows = await db.select().from(articles).orderBy(desc(articles.date));
          if (rows.length > 0) {
            console.log(`✅ [STORAGE] Articoli caricati da database: ${rows.length}`);
            return rows.map(row => ({
              slug: row.slug,
              title: row.title,
              date: (row.date instanceof Date ? row.date.toISOString() : row.date) as string,
              summary: row.summary,
              author: row.author,
              category: row.category,
              image: row.featuredImage ?? undefined,
              tags: row.tags || []
            }));
          }
        } catch (dbErr) {
          console.warn("⚠️ [STORAGE] Errore DB articoli, fallback a filesystem", dbErr);
        }
      }

      const contentDir = path.join("content", "articles");
      
      // Prova prima a leggere dalla directory
      try {
        await fs.access(contentDir, fs.constants.R_OK);
        const files = await fs.readdir(contentDir);
        
        const articles = await Promise.all(
          files
            .filter(file => file.endsWith(".md"))
            .map(async (file) => {
              try {
                const filePath = path.join(contentDir, file);
                await fs.access(filePath, fs.constants.R_OK);
                const content = await fs.readFile(filePath, "utf-8");
                const article = extractFrontmatter(content, path.basename(file, ".md"));
                return article.meta;
              } catch (error) {
                console.error(`Errore nella lettura dell'articolo ${file}:`, error);
                return null;
              }
            })
        );
        
        // Filtra gli articoli null e ordina per data
        const validArticles = articles
          .filter((article): article is ArticleMeta => article !== null)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
        if (validArticles.length > 0) {
          console.log(`✅ [STORAGE] Articoli caricati da filesystem: ${validArticles.length}`);
          return validArticles;
        }
      } catch (error) {
        console.warn("⚠️ [STORAGE] Directory articles non accessibile, uso backup locale");
      }

      // Fallback al backup locale
      console.log("📁 [STORAGE] Uso backup locale degli articoli");
      return (articlesBackup as ArticleMeta[]).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error("❌ [STORAGE] Errore nel recupero degli articoli:", error);
      // Ultimo fallback: ritorna il backup
      return (articlesBackup as ArticleMeta[]).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    try {
      if (process.env.DATABASE_URL) {
        try {
          const { db } = await import("./db");
          const { articles } = await import("@shared/schema");
          const { eq } = await import("drizzle-orm");

          const rows = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
          if (rows.length > 0) {
            const row = rows[0];
            console.log(`✅ [STORAGE] Articolo '${slug}' caricato da database`);
            return {
              slug: row.slug,
              meta: {
                slug: row.slug,
                title: row.title,
                summary: row.summary,
                author: row.author,
                category: row.category,
                date: (row.date instanceof Date ? row.date.toISOString() : row.date) as string,
                image: row.featuredImage ?? undefined,
                tags: row.tags || []
              },
              content: row.content
            };
          }
        } catch (dbErr) {
          console.warn(`⚠️ [STORAGE] Errore DB per l'articolo '${slug}', fallback`, dbErr);
        }
      }

      // Prova prima a leggere dal filesystem
      const filePath = path.join("content", "articles", `${slug}.md`);
      
      try {
        await fs.access(filePath, fs.constants.R_OK);
        const content = await fs.readFile(filePath, "utf-8");
        const article = extractFrontmatter(content, slug);
        console.log(`✅ [STORAGE] Articolo '${slug}' caricato da filesystem`);
        return article;
      } catch (error) {
        console.warn(`⚠️ [STORAGE] Articolo '${slug}' non trovato nel filesystem, uso backup`);
      }

      // Fallback al backup locale
      const backup = articlesContentBackup as Record<string, { meta: ArticleMeta; content: string }>;
      if (backup[slug]) {
        console.log(`📁 [STORAGE] Articolo '${slug}' caricato da backup locale`);
        return { slug, ...backup[slug] } as Article;
      }

      console.error(`❌ [STORAGE] Articolo '${slug}' non trovato neanche nel backup`);
      return undefined;
    } catch (error) {
      console.error(`❌ [STORAGE] Errore nel recupero dell'articolo '${slug}':`, error);
      return undefined;
    }
  }

  async saveEmail(email: string): Promise<void> {
    const filePath = path.join("content", "newsletter.json");
    let emails: string[] = [];
    try {
      const data = await fs.readFile(filePath, "utf-8");
      emails = JSON.parse(data);
    } catch (e) {
      // Se il file non esiste, emails resta []
    }
    if (!emails.includes(email)) {
      emails.push(email);
      await fs.writeFile(filePath, JSON.stringify(emails, null, 2), "utf-8");
    }
  }

  // Metodi per la persistenza degli articoli nel database
  async saveArticleToDb(data: { slug: string; title: string; summary: string; content: string; author: string; category: string; image?: string; tags?: string[]; date?: string; }) {
    if (!process.env.DATABASE_URL) return;
    try {
      const { db } = await import("./db");
      const { articles } = await import("@shared/schema");
      await db.insert(articles).values({
        slug: data.slug,
        title: data.title,
        summary: data.summary,
        content: data.content,
        author: data.author,
        category: data.category,
        featuredImage: data.image,
        tags: data.tags ?? [],
        date: data.date ? new Date(data.date) : new Date(),
      }).onConflictDoNothing();
      console.log(`🗄️ [STORAGE] Articolo '${data.slug}' salvato nel database`);
    } catch (err) {
      console.error(`⚠️ [STORAGE] Errore salvataggio articolo '${data.slug}' nel database`, err);
    }
  }

  async updateArticleInDb(slug: string, data: { title: string; summary: string; content: string; author: string; category: string; image?: string; tags?: string[]; date?: string; }) {
    if (!process.env.DATABASE_URL) return;
    try {
      const { db } = await import("./db");
      const { articles } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      await db.update(articles).set({
        title: data.title,
        summary: data.summary,
        content: data.content,
        author: data.author,
        category: data.category,
        featuredImage: data.image,
        tags: data.tags ?? [],
        date: data.date ? new Date(data.date) : new Date(),
        updatedAt: new Date(),
      }).where(eq(articles.slug, slug));
      console.log(`🗄️ [STORAGE] Articolo '${slug}' aggiornato nel database`);
    } catch (err) {
      console.error(`⚠️ [STORAGE] Errore aggiornamento articolo '${slug}' nel database`, err);
    }
  }

  async deleteArticleFromDb(slug: string) {
    if (!process.env.DATABASE_URL) return;
    try {
      const { db } = await import("./db");
      const { articles } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      await db.delete(articles).where(eq(articles.slug, slug));
      console.log(`🗄️ [STORAGE] Articolo '${slug}' eliminato dal database`);
    } catch (err) {
      console.error(`⚠️ [STORAGE] Errore eliminazione articolo '${slug}' dal database`, err);
    }
  }
}

export const storage = new MemStorage();
