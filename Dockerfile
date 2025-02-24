FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install pnpm with exact version matching our local environment
RUN npm install -g pnpm@9.11.0

# Install system dependencies including those needed for sharp
RUN apt-get update && apt-get install -y \
    curl \
    postgresql-client \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies only when needed
FROM base AS deps
WORKDIR /build
# Install build dependencies for sharp
RUN apt-get update && apt-get install -y build-essential python3 && \
    rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml .npmrc ./
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --prefer-offline

# Development dependencies for building
FROM deps AS dev-deps
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline

# Builder stage
FROM base AS builder
WORKDIR /app

# Set all the Environment Variables needed for build
ARG NEXT_PUBLIC_APP_BASE_URL
ARG DD_API_KEY

# Using NEXT_PUBLIC_APP_BASE_URL for all URL-related variables since it contains the actual deployment URL
ENV NEXT_PUBLIC_APP_BASE_URL=$NEXT_PUBLIC_APP_BASE_URL \
    NEXTAUTH_URL=$NEXT_PUBLIC_APP_BASE_URL \
    NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_APP_BASE_URL \
    NEXT_TELEMETRY_DISABLED=1 \
    OPENAI_API_KEY="sk-dummy-key-for-build" \
    NEXTAUTH_SECRET="dummy-secret-for-build"

# Install build dependencies
RUN apt-get update && apt-get install -y build-essential python3 && \
    rm -rf /var/lib/apt/lists/*

# Copy only necessary files for build
COPY package.json pnpm-lock.yaml .npmrc next.config.js contentlayer.config.ts tsconfig.json tsconfig.contentlayer.json middleware.ts tailwind.config.ts postcss.config.mjs ./
COPY app ./app
COPY public ./public
COPY lib ./lib
COPY types ./types
COPY components ./components
COPY hooks ./hooks
COPY config ./config
COPY docs ./docs
COPY scripts ./scripts

# Copy node_modules from dev-deps
COPY --from=dev-deps /build/node_modules ./node_modules

RUN pnpm build && \
    pnpm update-sitemap && \
    rm -rf node_modules/.cache

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=4001

# Install required tools and libraries for runtime
RUN apt-get update && apt-get install -y \
    postgresql-client \
    curl \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# These will need to be set at runtime with actual values
ENV POSTGRES_URL="" \
    NEXTAUTH_SECRET="" \
    GOOGLE_CLIENT_ID="" \
    GOOGLE_CLIENT_SECRET="" \
    TWITTER_CLIENT_ID="" \
    TWITTER_CLIENT_SECRET="" \
    TWITTER_API_KEY="" \
    TWITTER_API_SECRET="" \
    LINKEDIN_CLIENT_ID="" \
    LINKEDIN_CLIENT_SECRET="" \
    OPENAI_API_KEY="" \
    POST_WORKER_API_KEY=""

# Set URL-related variables from the build arg
ARG NEXT_PUBLIC_APP_BASE_URL
ENV NEXT_PUBLIC_APP_BASE_URL=$NEXT_PUBLIC_APP_BASE_URL \
    NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_APP_BASE_URL \
    NEXTAUTH_URL=$NEXT_PUBLIC_APP_BASE_URL

# Copy only production dependencies
COPY --from=dev-deps /build/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.contentlayer ./.contentlayer
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/types ./types
COPY --from=builder /app/app ./app

# Set up user, groups and permissions
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p .next/cache/images && \
    chown -R nextjs:nodejs . && \
    chmod -R 755 . && \
    chmod +x ./scripts/*.sh

USER nextjs

EXPOSE 4001

CMD ["pnpm", "start"]
