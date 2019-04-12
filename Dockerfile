FROM node:8-alpine AS base
WORKDIR /app/
COPY package.json .
COPY yarn.lock .
RUN yarn install

FROM base AS build
RUN mkdir -p /app/storage/temporary/
RUN mkdir -p /app/storage/permanent/
COPY source ./source
COPY config.json .
RUN yarn run build
RUN yarn run bundle-slow
CMD sleep 10 && yarn run start
