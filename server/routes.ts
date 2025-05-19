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
  
  // Mount API routes under /api
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
