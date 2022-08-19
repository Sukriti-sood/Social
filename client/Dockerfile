FROM node:16.15.1-alpine as build

LABEL version="1.0"
LABEL description="Production Image for Social Frontend"

WORKDIR /app

COPY ./package.json ./

RUN npm install --legacy-peer-deps --only=production

COPY . .

RUN npm run build

EXPOSE 3000

FROM nginx:1.23.0

WORKDIR /usr/share/nginx/html

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/*
# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage
COPY --from=build /app/build .

# Update the nginx config with our own config file
COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/

EXPOSE 80
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]