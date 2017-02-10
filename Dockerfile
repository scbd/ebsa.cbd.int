FROM node:6.7

WORKDIR /usr/src/app

COPY package.json bower.json .bowerrc .npmrc ./

RUN npm install -q

ENV PORT 8000

EXPOSE 8000

COPY . ./

RUN node siteSearch/indexer/index.js

ARG VERSION
ENV VERSION $VERSION

CMD [ "node", "server" ]
