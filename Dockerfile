# ---- BUILD STAGE ----
FROM node:18-alpine AS builder
WORKDIR /app

# 1) Installa tutte le dipendenze (dev + prod)
COPY package*.json ./
RUN npm ci

# 2) Copia tutto il sorgente (inclusi i tuoi .md sotto sitopersonale-backend/content/articles)
COPY . .

# 3) Genera il build (frontend + backend)
RUN npm run build

# ---- PRODUCTION STAGE ----
FROM node:18-alpine AS runner
WORKDIR /app

# Aggiungiamo un utente non-root per maggiore sicurezza
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 4) Copia solo i file necessari per la produzione
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/content ./content

# 5) Installa solo le dipendenze di produzione
RUN npm ci --only=production

# 6) Crea le directory necessarie e imposta i permessi SOLO dove serve
RUN mkdir -p content/articles content/comments content/uploads && \
    chown -R appuser:appgroup content && \
    chmod -R 755 content

# 7) Debug temporaneo - copio e imposto permessi prima di cambiare utente
COPY check-articles.sh /app/check-articles.sh
RUN chmod +x /app/check-articles.sh && chown appuser:appgroup /app/check-articles.sh

# 8) Variabili d'ambiente e porta
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# 9) Cambia all'utente non-root
USER appuser

# 10) Avvia il server
CMD ["/app/check-articles.sh"]
