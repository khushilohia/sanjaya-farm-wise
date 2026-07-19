# Sanjaya — single-container production image.
# The Vite/Nitro build compiles the frontend (static assets) and the backend
# (server functions) into one standalone Node server under dist/.

# --- Build stage -------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# node-server preset: standalone Node output instead of Vercel layout
ENV NITRO_PRESET=node-server
RUN npm run build

# --- Runtime stage -----------------------------------------------------------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist ./dist

# Non-root user; /app/data holds the SQLite DB when DATABASE_URL is not set
RUN addgroup -S app && adduser -S app -G app \
  && mkdir -p /app/data && chown -R app:app /app
USER app
VOLUME /app/data

EXPOSE 3000
ENV PORT=3000
CMD ["node", "dist/server/index.mjs"]
