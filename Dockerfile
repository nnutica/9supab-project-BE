# Build stage
FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --production=false

COPY . .
RUN bun run build

# Runtime stage
FROM oven/bun:latest

WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

EXPOSE 5000

CMD ["bun", "dist/main.js"]
