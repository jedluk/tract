FROM node:dubnium-slim

RUN npm i -g yarn 

WORKDIR /opt

COPY package.json /opt/
COPY yarn-lock.json /opt/

RUN yarn install

COPY src /opt

RUN yarn build


CMD ["npm", "serve"]