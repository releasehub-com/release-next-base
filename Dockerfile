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

COPY package.json pnpm-lock.yaml .npmrc ./
COPY . .
COPY --from=deps /build/node_modules ./node_modules

# Ensure case studies directory exists and has correct permissions
RUN mkdir -p app/case-studies/content public/case-study-images && \
    chmod -R 755 app/case-studies/content public/case-study-images

# Build the application
RUN pnpm build

# Generate sitemap
RUN pnpm update-sitemap

# After successful build, prune dev dependencies
RUN pnpm install --prod --no-frozen-lockfile

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY package.json pnpm-lock.yaml .npmrc ./
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/app/blog/posts /app/app/blog/posts
COPY --from=builder /app/app/case-studies/content /app/app/case-studies/content

EXPOSE 4001
ENV PORT 4001

WORKDIR /app
CMD ["pnpm", "start"]
