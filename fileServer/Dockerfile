FROM node:dubnium-slim

WORKDIR /opt

COPY package*.json /opt/

RUN npm install

COPY api /opt/api
COPY config /opt/config
COPY server.js /opt/server.js

CMD ["npm", "run", "start"]