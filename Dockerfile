# Stage 1: Build the React frontend
FROM node:14 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM node:14-alpine
WORKDIR /app
COPY --from=build /app/server ./server
COPY --from=build /app/build ./build
COPY --from=build /app/package.json .
RUN npm install --production
EXPOSE 5000
CMD ["node", "server/server-json.js"]