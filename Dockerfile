FROM node:0.10-onbuild

RUN ./node_modules/.bin/bower install --config.interactive=false --allow-root

EXPOSE 2010
