# Etapa 1: deps (instala node_modules)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Etapa 2: build (compila TS)
FROM node:20-alpine AS build
WORKDIR /app
# traemos node_modules ya instalados
COPY --from=deps /app/node_modules ./node_modules
# ⚠️ también necesitamos package.json aquí para poder correr "npm run build"
COPY package*.json ./
# resto de fuentes
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src
# prisma client + build
RUN npx prisma generate
RUN npm run build

# Etapa 3: runtime (solo lo necesario para correr)
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist
# (opcional) copiar package.json si quieres tener metadata
COPY package*.json ./
EXPOSE 4001
CMD sh -c "npx prisma migrate deploy && node dist/index.js"
