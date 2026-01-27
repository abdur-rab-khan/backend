FROM node:alpine

RUN apk add --no-cache curl &&\
    npm install -g pnpm

WORKDIR /my-app

COPY ./package.json ./

RUN pnpm install

COPY ./index.js ./

ENTRYPOINT [ "pnpm" ]
CMD [ "start" ]