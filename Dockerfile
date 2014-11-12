FROM google/nodejs:0.10.32

ADD  package.json  /source/
ADD  bower.json    /source/
add .bowerrc       /source/
ADD  app           /source/app/
ADD  siteSearch    /source/siteSearch/
ADD  server.js     /source/

WORKDIR /source

RUN rm -rf app/libs/
RUN npm install --ignore-scripts
RUN ./node_modules/.bin/bower install --config.interactive=false --allow-root

ENV PORT 2010
EXPOSE   2010

CMD [ "node", "server" ]
