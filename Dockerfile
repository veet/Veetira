# Production image for Railway (or any Docker host).
# Needs Node 24+ for the built-in SQLite driver (node:sqlite).
FROM node:24-bookworm-slim

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies first so this layer is cached between deploys.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Build the site.
COPY . .
RUN npm run build

# Run it. The host sets PORT; `next start` listens on it.
# Keep the database on a persistent volume: set DATABASE_PATH=/data/app.db and mount a volume at /data.
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]
