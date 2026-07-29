# syntax=docker/dockerfile:1
# Build context: the repo root (locally), or the output of
# `turbo prune backend --docker` (CI) — both layouts work because the
# builder installs with pnpm workspace filtering either way.
#
# Cold-start posture (docs/backend-plan.md): tsup bundles the service +
# ALL dependencies into one JS file, so the runtime stage ships no
# node_modules at all — distroless base + a single file.

FROM node:22-alpine AS builder
RUN npm install -g pnpm@10
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile --filter backend...
RUN pnpm --filter backend build

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /repo/apps/backend/dist/index.js ./index.js
EXPOSE 8080
CMD ["index.js"]
