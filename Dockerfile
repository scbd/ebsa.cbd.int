FROM node:0.10-onbuild

RUN ./node_modules/.bin/bower install --config.interactive=false --allow-root

ENV PORT 8000

EXPOSE 8000
