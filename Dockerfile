# Stage 1: Build the React frontend
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Build without REACT_APP_API_URL so it uses relative URLs in production
ENV REACT_APP_API_URL=""
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine
WORKDIR /app

# Create server directory and data subdirectory for persistent storage
RUN mkdir -p /app/server/data && chmod 755 /app/server && chmod 755 /app/server/data

# Copy server files
COPY --from=build /app/server ./server
COPY --from=build /app/build ./build
COPY --from=build /app/package.json .

# Install production dependencies
RUN npm install --production --omit=dev

# Ensure server directory and data subdirectory are writable for db.json
# node user already exists in node:18-alpine image
RUN chown -R node:node /app && chmod -R 755 /app/server && chmod -R 755 /app/server/data

# Switch to non-root user for security
USER node

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server/server-json.js"]