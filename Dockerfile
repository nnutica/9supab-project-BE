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

# Copy package files
COPY package.json ./

# Install ONLY production dependencies (Using npm/yarn for stability in Runtime if needed, but keeping bun install --production as requested)
RUN npm install -g bun && bun install --production

# Copy compiled dist from builder
COPY --from=builder /app/dist ./dist

# Ensure the app can find the modules by checking structure
RUN ls -R dist

EXPOSE 5000

CMD ["node", "dist/main.js"]
