import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();

// Configurazione CORS
app.use(cors({
  origin: ['http://localhost:5000', 'http://127.0.0.1:5000'],
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

  const port = process.env.PORT || 5000;
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
  const uploadsDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : path.join(process.cwd(), 'public', 'uploads');
  
  // Middleware per servire file uploads
  app.use('/uploads', express.static(uploadsDir));
  console.log(`📁 Servendo file uploads da: ${uploadsDir}`);
  
  console.log(`📁 Tentativo di servire file statici da: ${distPath}`);
  
  if (fs.existsSync(distPath)) {
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
