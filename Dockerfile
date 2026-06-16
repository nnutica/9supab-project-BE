# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install bun globally
RUN npm install -g bun

# Copy package files
COPY package.json ./

# Install ALL dependencies (Dev + Prod) for building
RUN bun install

# Copy source code and config
COPY . .

# Build application
RUN bun run build


# Runtime stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Install bun globally
RUN npm install -g bun

# Copy package files
COPY package.json ./

# Install ONLY production dependencies
RUN bun install --production

# Copy compiled dist from builder
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["bun", "dist/main.js"]
