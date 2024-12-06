FROM node:lts-alpine AS build-stage
WORKDIR /var/www/artists-client
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build