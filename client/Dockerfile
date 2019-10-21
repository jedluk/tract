FROM node:dubnium-slim as build

RUN npm i -g yarn 

WORKDIR /app

COPY package.json /app/package.json
COPY yarn-lock.json /opt/yarn-lock.json

RUN yarn install

COPY src /app
COPY public /app

RUN yarn build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]