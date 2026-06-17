FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json turbo.json ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci

FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/turbo.json ./turbo.json
COPY --from=deps /app/tsconfig.base.json ./tsconfig.base.json
COPY apps/worker ./apps/worker
COPY packages ./packages
CMD ["npx", "tsx", "apps/worker/src/index.ts"]
