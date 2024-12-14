# Use Node.js as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/index

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the backend will run on
EXPOSE 4000

# Set the command to start the application
CMD ["npm", "run", "start"]