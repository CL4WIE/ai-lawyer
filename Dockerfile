FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
# Next's standalone-output tracing only bundles what the app server itself
# imports, and docker-entrypoint.sh separately invokes the Prisma CLI
# (`prisma migrate deploy`) at container startup — the CLI pulls in a much
# bigger, differently-shaped dependency tree (@prisma/config, its `effect`
# dependency, the wasm schema/query engines under prisma/build/, etc.) that
# tracing doesn't include and that isn't fully contained within the
# .prisma/@prisma/prisma folders alone. Copying the whole `deps` (pre-build)
# node_modules gives the CLI everything it needs; the standalone and
# explicit .prisma/@prisma copies below are layered on top afterwards so
# the app's actual generated client (not the pre-`prisma generate` one from
# `deps`) is what the running server uses.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
