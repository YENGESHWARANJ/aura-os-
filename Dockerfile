# Production Dockerfile for AURA-OS Backend (Monorepo Root context)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy backend package manifests
COPY backend/package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy backend source
COPY backend ./

# Ensure uploads directories exist
RUN mkdir -p uploads/projects uploads/submissions logs

# Expose default backend port
EXPOSE 5000

# Set production environment variables defaults
ENV NODE_ENV=production
ENV PORT=5000

# Start server
CMD ["node", "src/server.js"]
