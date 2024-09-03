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

# Expose the port your app runs on (default for Next.js is 3000)
EXPOSE 3000

# Use the development mode command
CMD ["npm", "run", "dev"]
