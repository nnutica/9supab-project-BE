# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
# If bun.lock exists, we can still use it or just npm install
# But to be safe and use standard node, we'll use npm
RUN npm install

# Copy source code and config
COPY . .

# Build application using Nest CLI
RUN npm run build


# Runtime stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package.json ./

# Install ONLY production dependencies
RUN npm install --omit=dev

# Copy compiled dist from builder
COPY --from=builder /app/dist ./dist

# Check structure again (for logging)
RUN ls -R dist

EXPOSE 5000

CMD ["node", "dist/main.js"]
