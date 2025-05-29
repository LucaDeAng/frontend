import { users, type User, type InsertUser } from "@shared/schema";
import fs from "fs/promises";
import path from "path";
import { Article, ArticleMeta } from "@shared/types";
import { extractFrontmatter } from "../client/src/lib/markdown";
import fsSync from 'fs';

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
      const backup = articlesContentBackup as Record<string, Article>;
      if (backup[slug]) {
        console.log(`📁 [STORAGE] Articolo '${slug}' caricato da backup locale`);
        return backup[slug];
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
}

export const storage = new MemStorage();
