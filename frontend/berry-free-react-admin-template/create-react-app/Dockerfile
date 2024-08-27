# Use the official Node.js image to build the app
FROM node:18.17.0 AS build

# Set the working directory
WORKDIR /usr/local/app

# Copy package.json and package-lock.json to the working directory
COPY frontend/berry-free-react-admin-template/create-react-app/package*.json ./

# Install dependencies
RUN npm install --verbose --force

# Copy the rest of the application code
COPY frontend/berry-free-react-admin-template/create-react-app/ .

# Build the React application
RUN npm run build

# Use a lightweight web server to serve the built files
FROM nginx:latest

# Copy the built files from the previous stage
COPY --from=build /usr/local/app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY frontend/berry-free-react-admin-template/create-react-app/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
