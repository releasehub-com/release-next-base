FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@8.15.4 --activate
RUN apk add --no-cache curl

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /build

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies and update lockfile
RUN pnpm install --no-frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Set Environment Variables
ARG NEXT_PUBLIC_APP_BASE_URL
ARG DD_API_KEY

ENV NEXT_PUBLIC_APP_BASE_URL=$NEXT_PUBLIC_APP_BASE_URL \
    DD_API_KEY=$DD_API_KEY \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /build/node_modules ./node_modules
COPY . .

# Ensure case studies directory exists and has correct permissions
RUN mkdir -p app/case-studies/content public/case-study-images && \
    chmod -R 755 app/case-studies/content public/case-study-images

# Build the application
RUN pnpm build

# Generate sitemap
RUN pnpm update-sitemap

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    apk add --no-cache curl

# Copy necessary files from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ensure proper permissions
RUN chown -R nextjs:nodejs .

USER nextjs

EXPOSE 4001
ENV PORT 4001
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
