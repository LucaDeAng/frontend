# ---- BUILD STAGE ----
FROM node:18-alpine AS builder
WORKDIR /app
# 1) Install dev + prod deps
COPY package.json package-lock.json ./
RUN npm ci
# 2) Build sia frontend (vite) che backend (esbuild)
COPY . .
RUN npm run build

# ---- PRODUCTION STAGE ----
FROM node:18-alpine
WORKDIR /app
# 3) Copia il dist compilato
COPY --from=builder /app/dist ./dist
# 4) Copia TUTTI i moduli (incluso vite)
COPY --from=builder /app/node_modules ./node_modules
# 5) Solo se hai bisogno di package.json in runtime
COPY package.json ./

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
