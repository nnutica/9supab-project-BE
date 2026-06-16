FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Install bun globally
RUN npm install -g bun

# Copy package files
COPY package.json ./

# Install dependencies
RUN bun install --production=false

# Copy source code
COPY src ./src
COPY tsconfig.json tsconfig.build.json nest-cli.json ./

# Build application
RUN bun run build

# Remove dev dependencies
RUN bun install --production

EXPOSE 5000

CMD ["bun", "dist/main.js"]
