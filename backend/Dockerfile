# Production Dockerfile for AURA-OS Backend
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package manifests first for optimal caching
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Ensure uploads directories exist
RUN mkdir -p uploads/projects uploads/submissions logs

# Expose default backend port
EXPOSE 5000

# Set production environment variables defaults
ENV NODE_ENV=production
ENV PORT=5000

# Start server
CMD ["node", "src/server.js"]
