// Carica le variabili d'ambiente dal file .env
import dotenv from 'dotenv';
dotenv.config();

// Debug: verifica che le variabili SMTP siano caricate
console.log('🔧 [DEBUG] Configurazioni SMTP caricate:');
console.log('🔧 [DEBUG] SMTP_HOST:', process.env.SMTP_HOST ? '✅ Configurato' : '❌ Non configurato');
console.log('🔧 [DEBUG] SMTP_USER:', process.env.SMTP_USER ? '✅ Configurato' : '❌ Non configurato');
console.log('🔧 [DEBUG] SMTP_PASS:', process.env.SMTP_PASS ? '✅ Configurato' : '❌ Non configurato');

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { storage } from "./storage";
import { ensureUploadsDir, getUploadsDir } from './uploads';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();

// Configurazione CORS
const allowedOrigins: (string | RegExp)[] = [
  'http://localhost:3000', 
  'http://127.0.0.1:3000', 
  'http://localhost:5000', 
  'http://127.0.0.1:5000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3002',
  'http://localhost:5173', // Vite dev server
  'http://127.0.0.1:5173',
  // Domini di produzione
  'https://genai4business.com',
  'https://www.genai4business.com'
];

// Aggiungi domini di produzione se disponibili
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Per Render, permetti tutti i domini *.onrender.com in produzione
if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push(/https:\/\/.*\.onrender\.com$/);
}

app.use(cors({
  origin: (origin, callback) => {
    // Permetti richieste senza origin (es. app mobile, Postman)
    if (!origin) return callback(null, true);
    
    // Controlla se l'origin è nella lista degli allowedOrigins
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`🚫 Origin non consentito: ${origin}`);
      callback(new Error('Non consentito da CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Setup DRASTICAMENTE SEMPLIFICATO - NO VITE MAI
  console.log("🚀 Avvio server in modalità simplificata...");
  console.log(`📍 NODE_ENV: ${process.env.NODE_ENV}`);
  
  // Sempre e solo file statici
  serveStaticFiles(app);

  // Gestione errori globale
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    console.error('Errore server:', err);
    
    res.status(status).json({ 
      error: true,
      message,
      status
    });
  });

  const port = process.env.PORT || 3002;
  const host = "0.0.0.0";

  server.listen({
    port,
    host,
    reusePort: true,
  }, () => {
    console.log(`Server in ascolto su http://${host}:${port}`);
    console.log(`📁 Servendo file statici senza vite`);
  }).on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Errore: La porta ${port} è già in uso`);
      process.exit(1);
    } else {
      console.log(`Errore del server: ${err.message}`);
      process.exit(1);
    }
  });
})();

// Funzione per servire file statici senza dipendenze da vite
function serveStaticFiles(app: express.Express) {
  const distPath = path.resolve(process.cwd(), "dist/public");
  
  // Configurazione per servire i file uploads
  ensureUploadsDir();
  const uploadsDir = getUploadsDir();

  // Middleware per servire file uploads
  app.use('/uploads', express.static(uploadsDir));
  console.log(`📁 Servendo file uploads da: ${uploadsDir}`);
  
  console.log(`📁 Tentativo di servire file statici da: ${distPath}`);
  
  if (fs.existsSync(distPath)) {
    // Route dinamica per le pagine articolo con meta tag OG specifici
    app.get('/article/:slug', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { slug } = req.params;
        const article = await storage.getArticleBySlug(slug);
        const indexPath = path.resolve(distPath, 'index.html');
        if (!fs.existsSync(indexPath)) {
          return res.status(404).send("Applicazione non trovata. Eseguire 'npm run build' per buildare l'applicazione.");
        }
        let html = await fs.promises.readFile(indexPath, 'utf-8');
        if (article) {
          const articleUrl = `https://genai4business.com/article/${article.slug}`;
          const imageUrl = article.meta.image ||
            'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80';

          html = html
            .replace(/<title>.*?<\/title>/, `<title>${article.meta.title} | AI Hub<\/title>`)
            .replace(/<meta name="description" content=".*?" \/>/,
              `<meta name="description" content="${article.meta.summary}" />`)
            .replace(/<meta property="og:title" content=".*?" \/>/,
              `<meta property="og:title" content="${article.meta.title} | AI Hub" />`)
            .replace(/<meta property="og:description" content=".*?" \/>/,
              `<meta property="og:description" content="${article.meta.summary}" />`)
            .replace(/<meta property="og:image" content=".*?" \/>/,
              `<meta property="og:image" content="${imageUrl}" />`)
            .replace(/<meta property="og:image:width" content=".*?" \/>/,
              `<meta property="og:image:width" content="1200" />`)
            .replace(/<meta property="og:image:height" content=".*?" \/>/,
              `<meta property="og:image:height" content="630" />`)
            .replace(/<meta property="og:image:alt" content=".*?" \/>/,
              `<meta property="og:image:alt" content="${article.meta.title} - AI Hub" />`)
            .replace(/<meta property="og:url" content=".*?" \/>/,
              `<meta property="og:url" content="${articleUrl}" />`)
            .replace(/<meta property="og:type" content=".*?" \/>/,
              `<meta property="og:type" content="article" />`)
            .replace(/<meta name="twitter:title" content=".*?" \/>/,
              `<meta name="twitter:title" content="${article.meta.title} | AI Hub" />`)
            .replace(/<meta name="twitter:description" content=".*?" \/>/,
              `<meta name="twitter:description" content="${article.meta.summary}" />`)
            .replace(/<meta name="twitter:image" content=".*?" \/>/,
              `<meta name="twitter:image" content="${imageUrl}" />`)
            .replace(/<meta name="twitter:image:alt" content=".*?" \/>/,
              `<meta name="twitter:image:alt" content="${article.meta.title} - AI Hub" />`)
            .replace(/<link rel="canonical" href=".*?" \/>/,
              `<link rel="canonical" href="${articleUrl}" />`);

          const articleMeta = [
            `<meta property="article:published_time" content="${new Date(article.meta.date).toISOString()}" />`,
            `<meta property="article:author" content="${article.meta.author}" />`,
            `<meta property="article:section" content="${article.meta.category}" />`,
            ...(article.meta.tags || []).map(tag => `<meta property="article:tag" content="${tag}" />`)
          ].join('\n');

          html = html.replace('</head>', `${articleMeta}\n</head>`);
        }
        res.set('Content-Type', 'text/html');
        res.send(html);
      } catch (e) {
        next(e);
      }
    });

    app.use(express.static(distPath));
    console.log("✅ File statici configurati correttamente");
    
    // Fallback per SPA routing - MA NON per le routes API
    app.use("*", (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      
      const indexPath = path.resolve(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Applicazione non trovata. Eseguire 'npm run build' per buildare l'applicazione.");
      }
    });
  } else {
    console.warn(`⚠️ Directory dist/public non trovata: ${distPath}`);
    console.warn("   Per servire file statici, eseguire 'npm run build' prima di avviare il server");
    
    // Serve una pagina di errore base per non-API routes
    app.use("*", (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      
      res.status(404).json({ 
        error: "Applicazione frontend non trovata", 
        message: "Eseguire 'npm run build' per buildare l'applicazione"
      });
    });
  }
}
