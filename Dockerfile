# ---- BUILD STAGE ----
FROM node:18-alpine AS builder
WORKDIR /app

# 1) Installa tutte le dipendenze (dev + prod)
COPY package.json package-lock.json ./
RUN npm ci

# 2) Copia il sorgente e genera il build
COPY . .
RUN npm run build

# ---- PRODUCTION STAGE ----
FROM node:18-alpine AS runner
WORKDIR /app

# 3) Copia il dist compilato (frontend + server bundle)
COPY --from=builder /app/dist ./dist

# 4) Copia le sole dipendenze di produzione
COPY --from=builder /app/node_modules ./node_modules

# 5) Copia la directory content/articles dal submodule
COPY --from=builder /app/sitopersonale-backend/content/articles ./content/articles

# 6) Variabili d'ambiente e porta
ENV NODE_ENV=production
EXPOSE 4000

# 7) Avvia il server
CMD ["node", "dist/index.js"]
