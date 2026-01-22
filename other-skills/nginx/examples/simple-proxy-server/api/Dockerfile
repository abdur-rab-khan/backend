FROM node:alpine

RUN apk add --no-cache wget

WORKDIR /api

COPY ./package.json ./pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install


COPY . .


CMD [ "node", "./index.js" ]