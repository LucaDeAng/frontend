# ---- BUILD STAGE ----
FROM node:18-alpine AS builder
WORKDIR /app

# 1) Installa tutte le dipendenze (dev + prod)
COPY package*.json ./
RUN npm ci

# 2) Copia tutto il sorgente
COPY . .

# 3) Genera il build (frontend + backend)
RUN npm run build

# ---- PRODUCTION STAGE ----
FROM node:18-alpine AS runner
WORKDIR /app

# Aggiungiamo un utente non-root per maggiore sicurezza
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 4) Copia tutta la directory /app generata dal builder
COPY --from=builder /app ./

# 5) Rimuovi le dev-dependencies per snellire l'immagine
RUN npm prune --production

# 6) Imposta i permessi corretti per content/articles
RUN mkdir -p content/articles && \
    chown -R appuser:appgroup /app && \
    chmod -R 755 /app/content

# 7) Variabili d'ambiente e porta
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# 8) Cambia all'utente non-root
USER appuser

# 9) Avvia il server
CMD ["node", "dist/index.js"]
    