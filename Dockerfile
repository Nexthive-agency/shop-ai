# Build Stage
FROM node:20-slim AS builder

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Run Stage
FROM node:20-slim AS runner

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the output from the build stage
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy entrypoint script
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Expose the port Nuxt runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Command to run the application using entrypoint
CMD ["./entrypoint.sh"]
