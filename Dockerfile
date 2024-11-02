# Use Node 16 alpine as parent image
FROM node:20.9-alpine3.17

# Change the working directory on the Docker image to /app
WORKDIR /app

# Copy package.json and package-lock.json to the /app directory
COPY profile_auth_nodejs/package.json profile_auth_nodejs/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of project files into this image
COPY profile_auth_nodejs/. .

# Expose application port
EXPOSE 6000

# Start the application
CMD npm start
