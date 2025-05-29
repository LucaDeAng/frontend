# ---- BUILD STAGE ----
FROM node:18-alpine AS builder
WORKDIR /app

# 1) Installa tutte le dipendenze (dev + prod)
COPY package.json package-lock.json ./
RUN npm ci

# 2) Copia tutto il sorgente (inclusi i tuoi .md sotto sitopersonale-backend/content/articles)
COPY . .

# 3) Genera il build (frontend + backend)
RUN npm run build

# ---- PRODUCTION STAGE ----
FROM node:18-alpine AS runner
WORKDIR /app

# 4) Copia tutta la directory /app generata dal builder
COPY --from=builder /app ./

# 5) Rimuovi le dev-dependencies per snellire l’immagine
RUN npm prune --production

# 6) Variabili d’ambiente e porta
ENV NODE_ENV=production
EXPOSE 4000

# 7) Avvia il server
CMD ["node", "dist/index.js"]

