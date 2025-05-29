import { users, type User, type InsertUser } from "@shared/schema";
import fs from "fs/promises";
import path from "path";
import { Article, ArticleMeta } from "@shared/types";
import { extractFrontmatter } from "../client/src/lib/markdown";

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
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
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
      
      // Verifica se la directory esiste e i permessi
      try {
        await fs.access(contentDir, fs.constants.R_OK);
      } catch (error) {
        console.error("Directory content/articles non trovata o non accessibile:", error);
        return [];
      }
      
      const files = await fs.readdir(contentDir);
      
      const articles = await Promise.all(
        files
          .filter(file => file.endsWith(".md"))
          .map(async (file) => {
            try {
              const filePath = path.join(contentDir, file);
              // Verifica i permessi del file
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
      return articles
        .filter((article): article is ArticleMeta => article !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error("Error reading articles directory:", error);
      return [];
    }
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    try {
      const filePath = path.join("content", "articles", `${slug}.md`);
      
      // Verifica se il file esiste
      try {
        await fs.access(filePath);
      } catch (error) {
        console.error(`Articolo non trovato: ${slug}`);
        return undefined;
      }
      
      const content = await fs.readFile(filePath, "utf-8");
      if (!content) {
        console.error(`Contenuto vuoto per l'articolo: ${slug}`);
        return undefined;
      }
      
      const article = extractFrontmatter(content, slug);
      if (!article || !article.meta) {
        console.error(`Frontmatter non valido per l'articolo: ${slug}`);
        return undefined;
      }
      
      return article;
    } catch (error) {
      console.error(`Errore nella lettura dell'articolo (${slug}):`, error);
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
