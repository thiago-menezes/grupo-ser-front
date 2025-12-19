# Multi-stage Dockerfile for Next.js production deployment
# Optimized for size and security

# ===================================
# Stage 1: Install dependencies
# ===================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package manager files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Enable corepack and install dependencies
RUN corepack enable && \
    corepack prepare yarn@4.9.4 --activate && \
    yarn install --immutable

# ===================================
# Stage 2: Build application
# ===================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application
# The standalone output will be in .next/standalone
RUN corepack enable && \
    corepack prepare yarn@4.9.4 --activate && \
    yarn build

# ===================================
# Stage 3: Production runtime
# ===================================
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone build output
# Next.js standalone mode includes all necessary files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set environment variables for Next.js server
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check (optional but recommended for container orchestration)
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health-check', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the Next.js server
CMD ["node", "server.js"]
