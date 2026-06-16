# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install bun
RUN npm install -g bun

COPY package.json ./
RUN bun install

COPY . .
RUN bun run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Install bun for runtime
RUN npm install -g bun

COPY package.json ./
RUN bun install --production

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["bun", "dist/main.js"]
