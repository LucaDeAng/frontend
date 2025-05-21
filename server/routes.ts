import express, { type Express } from "express";
import fs from "fs/promises";
import path from "path";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { extractFrontmatter } from "../client/src/lib/markdown";
import { ArticleMeta } from "@shared/types";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = express.Router();
  
  // Get all articles metadata
  apiRouter.get("/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Error fetching articles" });
    }
  });
  
  // Get single article by slug
  apiRouter.get("/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error(`Error fetching article ${req.params.slug}:`, error);
      res.status(500).json({ message: "Error fetching article" });
    }
  });
  
  // Placeholder for AI playground API
  apiRouter.post("/playground/generate", (req, res) => {
    const { prompt, model, temperature, maxTokens } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }
    
    // In a real implementation, this would call an AI model API
    // For now, we'll just return a fixed response
    setTimeout(() => {
      res.json({
        text: "L'intelligenza artificiale sta rapidamente trasformando il panorama lavorativo globale. Da un lato, automatizza compiti ripetitivi e standardizzati, liberando tempo per attività creative e strategiche. Dall'altro, crea nuove professioni legate alla gestione, sviluppo e supervisione di sistemi AI. Nel prossimo decennio, assisteremo a una profonda riconfigurazione del mercato del lavoro, con competenze come il pensiero critico, la creatività e l'intelligenza emotiva che diventeranno ancora più preziose. La sfida sarà garantire che questa transizione avvenga in modo inclusivo, offrendo opportunità di riqualificazione e formazione continua per tutti i lavoratori.",
        model,
        generationTime: "2.3"
      });
    }, 1500);
  });
  
  // Subscribe to newsletter
  apiRouter.post("/newsletter/subscribe", (req, res) => {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: "Valid email is required" });
    }
    
    // In a real implementation, this would add the email to a database or newsletter service
    res.json({ message: "Subscription successful" });
  });
  
  // Admin API routes for content management
  apiRouter.post("/admin/articles", async (req, res) => {
    try {
      const { title, slug, summary, category, content, author, date } = req.body;
      
      if (!title || !slug || !summary || !category || !content || !author) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Check if article with this slug already exists
      const existingArticle = await storage.getArticleBySlug(slug);
      if (existingArticle) {
        return res.status(409).json({ error: "An article with this slug already exists" });
      }
      
      const articleContent = `---
title: "${title}"
date: "${date || new Date().toISOString().split('T')[0]}"
summary: "${summary}"
author: "${author}"
category: "${category}"
image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80"
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
  
  apiRouter.put("/admin/articles/:slug", async (req, res) => {
    try {
      const { title, summary, category, content, author, date } = req.body;
      const { slug } = req.params;
      
      if (!title || !summary || !category || !content || !author) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Check if article exists
      const existingArticle = await storage.getArticleBySlug(slug);
      if (!existingArticle) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      const articleContent = `---
title: "${title}"
date: "${date || existingArticle.meta.date}"
summary: "${summary}"
author: "${author}"
category: "${category}"
image: "${existingArticle.meta.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80"}"
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
  
  apiRouter.delete("/admin/articles/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      // Check if article exists
      const existingArticle = await storage.getArticleBySlug(slug);
      if (!existingArticle) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      // Delete article file
      const articlesDir = path.join("content", "articles");
      await fs.unlink(path.join(articlesDir, `${slug}.md`));
      
      res.json({ 
        success: true, 
        message: "Article deleted successfully" 
      });
    } catch (error) {
      console.error(`Error deleting article (${req.params.slug}):`, error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });
  
  // Mount API routes under /api
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
