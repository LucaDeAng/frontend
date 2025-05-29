FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

# Installa tutte le dipendenze (dev + prod) per il build
RUN npm ci

COPY . .

RUN npm run build

# Dopo il build, rimuovi le devDependencies per alleggerire l'immagine
RUN npm prune --production

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "dist/index.js"]
