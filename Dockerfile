FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache curl

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /build

# Use corepack to set pnpm version
RUN corepack prepare pnpm@8.15.4 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies and update lockfile
RUN pnpm install --no-frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install pnpm in builder stage
RUN corepack prepare pnpm@8.15.4 --activate

# Set Environment Variables
ARG NEXT_PUBLIC_APP_BASE_URL
ARG DD_API_KEY

ENV NEXT_PUBLIC_APP_BASE_URL=$NEXT_PUBLIC_APP_BASE_URL \
    DD_API_KEY=$DD_API_KEY \
    NEXT_TELEMETRY_DISABLED=1

COPY package.json pnpm-lock.yaml .npmrc ./
COPY . .
COPY --from=deps /build/node_modules ./node_modules

# Build the application
RUN pnpm build

# After successful build, prune dev dependencies
RUN pnpm install --prod --no-frozen-lockfile

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Uncomment the following line in case you want to disable telemetry during runtime.
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

#USER nextjs

EXPOSE 4001

ENV PORT 4001
# ENV NODE_OPTIONS "-r dd-trace/init"

WORKDIR /app
CMD ["pnpm", "start"]
