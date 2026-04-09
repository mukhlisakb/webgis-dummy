# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-slim AS builder

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy manifests
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build production bundle
RUN pnpm build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM node:20-slim AS runner

WORKDIR /app

# Install 'serve' globally for production statics serving
RUN npm install -g serve

# Copy built assets
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Run serve with SPA fallback (-s)
CMD ["serve", "-s", "dist", "-p", "3000"]
