# Use an official lightweight Nginx image as base
FROM nginx:stable-alpine

# Remove default Nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy your static website assets into the container
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80
