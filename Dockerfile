FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (leverages Docker layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ── production image ────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy only what's needed at runtime
COPY --from=builder /app/public          ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next  ./.next
COPY --from=builder /app/package.json      ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/next.config.ts    ./next.config.ts

# Install production dependencies only (next, react, etc. are in dependencies)
RUN npm ci --omit=dev && npm cache clean --force

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
