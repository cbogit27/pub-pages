# Use the official Node.js image as the base image
FROM node:18-alpine AS base

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN yarn

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN yarn build

# Use a smaller image for production
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only necessary files from the base image
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/next.config.js ./next.config.js

# Expose the port the app runs on
EXPOSE 3000

# Run database migrations (if needed)
RUN yarn prisma generate

# Start the app in production mode
CMD ["yarn", "start"]