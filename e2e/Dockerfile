FROM cypress/base:10

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

RUN npx cypress verify