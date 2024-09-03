# Use an official Node.js image as the base image
FROM node:22.3.0

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose the port your app runs on
EXPOSE 4000

# Use nodemon for development to auto-reload the server on changes
CMD ["npm", "run", "dev"]
