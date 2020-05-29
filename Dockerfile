FROM node:14.3-alpine

WORKDIR /usr/src/app

COPY package.json .npmrc ./

RUN apk add git && \
    yarn install -q

ENV PORT 8000

EXPOSE 8000

COPY . ./

RUN node siteSearch/indexer/index.js

ARG VERSION
ENV VERSION $VERSION

CMD [ "node", "server" ]
