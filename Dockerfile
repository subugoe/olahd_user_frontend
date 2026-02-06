# Build
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# nginx-config:
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx
COPY ./conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

