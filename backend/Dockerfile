# Use Node.js as the base image
FROM node:22

# Create a non-root user and group
RUN groupadd -r appuser && useradd -r -g appuser -s /bin/bash -m appuser

# Set the working directory inside the container
WORKDIR /usr/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Remove source files and only keep the build files
RUN rm -rf src && rm -rf node_modules && npm install --omit=dev

# Change ownership of the working directory
RUN chown -R appuser:appuser /usr/app

# Switch to the non-root user
USER appuser

# Expose the port the backend will run on
EXPOSE 4000

CMD ["sh", "-c", "npm run migration:run:prod && npm start"]