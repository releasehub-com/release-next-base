FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# work around core pack issue
# https://github.com/nodejs/corepack/issues/616#issuecomment-2622079955
RUN npm install -g corepack@latest && corepack enable
RUN apt-get update && apt-get install curl -y

# Install dependencies only when needed
FROM base AS deps
WORKDIR /build
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed and upload the sourcemaps
FROM base AS builder
WORKDIR /app

# Set all the Environment Variables, they need to be present before the build command happens
ARG NEXT_PUBLIC_APP_BASE_URL
ARG DD_API_KEY

ENV NEXT_PUBLIC_APP_BASE_URL=$NEXT_PUBLIC_APP_BASE_URL \
    DD_API_KEY=$DD_API_KEY

# Install sharp for image optimization
RUN apt-get update && apt-get install -y build-essential
RUN npm install sharp

COPY package.json pnpm-lock.yaml .npmrc ./
COPY . .
COPY --from=deps /build/node_modules ./node_modules

# Extract hostname from base URL
COPY extract-hostname.js .
RUN node extract-hostname.js

RUN pnpm build

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Prune out the devDependencies from node_modules after build
RUN pnpm install --production --frozen-lockfile

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Pass through the build-time environment variables
ARG NEXT_PUBLIC_APP_BASE_URL
ENV NEXT_PUBLIC_APP_BASE_URL=$NEXT_PUBLIC_APP_BASE_URL
ENV NEXT_PUBLIC_APP_HOSTNAME=$NEXT_PUBLIC_APP_HOSTNAME

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Install sharp in the runner stage as well
RUN apt-get update && apt-get install -y build-essential
RUN npm install sharp

COPY package.json pnpm-lock.yaml .npmrc ./

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/app /app/app

#USER nextjs

EXPOSE 4001

ENV PORT 4001
# ENV NODE_OPTIONS "-r dd-trace/init"

WORKDIR /app
CMD ["pnpm", "start"]
