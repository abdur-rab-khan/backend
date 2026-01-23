FROM node:alpine

RUN apk add --no-cache wget
RUN npm install -g pnpm 

WORKDIR /api

COPY ./package.json ./ 

RUN pnpm install

COPY ./index.js ./ 

CMD ["pnpm", "dev"]