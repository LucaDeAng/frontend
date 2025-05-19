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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getArticles(): Promise<ArticleMeta[]> {
    try {
      const contentDir = path.join("content", "articles");
      const files = await fs.readdir(contentDir);
      
      const articles = await Promise.all(
        files
          .filter(file => file.endsWith(".md"))
          .map(async (file) => {
            const slug = path.basename(file, ".md");
            const content = await fs.readFile(path.join(contentDir, file), "utf-8");
            const article = extractFrontmatter(content, slug);
            return article.meta;
          })
      );
      
      // Sort articles by date (newest first)
      return articles.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error("Error reading articles directory:", error);
      throw error; // Re-throw to see the actual error
    }
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    try {
      const filePath = path.join("content", "articles", `${slug}.md`);
      const content = await fs.readFile(filePath, "utf-8");
      return extractFrontmatter(content, slug);
    } catch (error) {
      console.error(`Error reading article file (${slug}):`, error);
      return undefined;
    }
  }
}

export const storage = new MemStorage();
