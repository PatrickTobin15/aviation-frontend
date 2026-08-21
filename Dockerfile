# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

# Vite bakes VITE_ env vars in at build time, so pass them in as build args.
ARG VITE_API_BASE
ARG VITE_API_USERNAME
ARG VITE_API_PASSWORD
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_API_USERNAME=$VITE_API_USERNAME
ENV VITE_API_PASSWORD=$VITE_API_PASSWORD

RUN npm run build

# Serve stage 
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
