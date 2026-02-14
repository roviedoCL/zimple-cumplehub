# Multi-stage build para producción
# Force rebuild: Sat Feb 14 15:15:00 UTC 2026
# Stage 1: Build del frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build del backend
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Stage 3: Producción
FROM node:20-alpine
WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache postgresql-client

# Copiar backend
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/package*.json ./backend/

# Copiar frontend estático a la ubicación correcta (al mismo nivel que backend)
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000
# Default ENCRYPTION_KEY for Railway (should be overridden by Railway variables)
ENV ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

EXPOSE 3000

CMD ["node", "backend/dist/main.js"]