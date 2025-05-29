import type { Express } from "express";
import * as express from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { nanoid } from "nanoid";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  try {
    const { createServer: createViteServer, createLogger } = await import("vite");
    
    // Import vite.config solo se disponibile
    let viteConfig;
    try {
      const configModule = await import("../vite.config.js");
      viteConfig = configModule.default;
    } catch {
      // Se vite.config non esiste, usa configurazione di base
      viteConfig = {
        root: path.resolve(__dirname, "..", "client"),
        build: {
          outDir: path.resolve(__dirname, "..", "dist/public"),
        }
      };
    }
    
    const serverOptions = {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true as const
    };

    const vite = await createViteServer({
      ...viteConfig,
      configFile: false,
      customLogger: {
        ...createLogger(),
        error: (msg, options) => {
          createLogger().error(msg, options);
          process.exit(1);
        },
      },
      server: serverOptions,
      appType: "custom",
    });

    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;

      // NON intercettare le routes API
      if (url.startsWith('/api')) {
        return next();
      }

      try {
        const clientTemplate = path.resolve(
          __dirname,
          "..",
          "client",
          "index.html"
        );

        if (!fs.existsSync(clientTemplate)) {
          throw new Error(`Could not find index.html at ${clientTemplate}`);
        }

        // always reload the index.html file from disk incase it changes
        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        template = template.replace(
          `src="/src/main.tsx"`,
          `src="/src/main.tsx?v=${nanoid()}"`,
        );
        const page = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(page);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } catch (error) {
    console.error("Errore nell'impostazione di Vite:", error);
    // In caso di errore, continua senza Vite
  }
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  // MA NON per le routes API
  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
