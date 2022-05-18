# Build
FROM node:lts-alpine as build
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Run
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# nginx-config:
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx
COPY ./conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

