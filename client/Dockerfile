FROM node:dubnium-slim as build

RUN npm i -g yarn 

WORKDIR /app

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn install

COPY src /app/src
COPY public /app/public

RUN yarn build

# production environment
FROM nginx:1.16.0-alpine

RUN rm -rf /etc/nginx/conf.d
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]