FROM continuumio/miniconda3 as conda

RUN apt-get update
RUN apt-get install -y build-essential libssl-dev
RUN conda install -y numpy opencv

FROM conda as node

ENV NODE_VERSION v8.5.0
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
RUN source ~/.nvm/nvm.sh; \
    nvm install $NODE_VERSION; \
    nvm use --delete-prefix $NODE_VERSION;
RUN ln -sf /root/.nvm/versions/node/$NODE_VERSION/bin/node /usr/bin/node
RUN ln -sf /root/.nvm/versions/node/$NODE_VERSION/bin/npm /usr/bin/npm

FROM node as prod

ENV NODE_ENV=production
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
EXPOSE 5000
ENV DB_PASSWORD root123
ENV DB_USER_NAME root

CMD [ "npm", "run", "start" ]
