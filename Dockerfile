# Use a Node.js base image
FROM node:18-alpine as development

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application in development mode
CMD ["npm", "run", "start:dev"]

# --- Production build (optional, but good practice for multi-stage) ---
FROM node:18-alpine as production

WORKDIR /app

COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the built application from the development stage
COPY --from=development /app/dist ./dist

# Command to run the application in production mode
CMD ["node", "dist/main"]
