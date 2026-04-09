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

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "3000"]
