FROM node:0.12
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev libkrb5-dev
RUN mkdir /myapp
WORKDIR /myapp
ADD package.json /myapp/package.json
ADD bower.json /myapp/bower.json
RUN npm install
RUN npm install -g bower
RUN bower install --config.interactive=false --allow-root
ADD . /myapp