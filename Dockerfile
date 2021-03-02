FROM node:14.16.0

WORKDIR /usr/src/app

RUN npm i -g npm@7.6.0
RUN npm i
