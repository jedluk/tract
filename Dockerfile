FROM mhart/alpine-node:10

ENV NODE_ENV=production
ENV TFSERVER=http://tfserver:4000/api
WORKDIR /tmp
COPY package.json /tmp/
RUN npm install
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN cp -a /tmp/node_modules /usr/src/app/
WORKDIR /usr/src/app/client
RUN npm install
RUN npm run build:prod
WORKDIR /usr/src/app

CMD [ "npm", "run", "start" ]
