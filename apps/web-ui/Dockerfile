# Production Dockerfile for Next.js web-ui
# This Dockerfile leverages Nx and BuildKit cache mounts for fast builds.

# Stage 1: Install dependencies
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root lockfiles
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set Nx environment variables for Docker
ENV NX_REJECT_UNKNOWN_LOCAL_CACHE=0

# Use BuildKit cache mount for Nx cache to speed up subsequent builds
# The target path /app/.nx/cache matches the default Nx cache location
RUN --mount=type=cache,target=/app/.nx/cache \
    npx nx build web-ui --prod

# Stage 3: Production server
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output from the builder stage
# Note: Nx puts the build output in dist/apps/web-ui
COPY --from=builder /app/dist/apps/web-ui/public ./apps/web-ui/public
COPY --from=builder /app/dist/apps/web-ui/.next/static ./apps/web-ui/.next/static
COPY --from=builder /app/dist/apps/web-ui/.next/standalone ./

USER nextjs

EXPOSE 3000

# Next.js standalone server entry point
CMD ["node", "apps/web-ui/server.js"]
