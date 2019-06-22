FROM node:12.4
RUN mkdir -p /app
WORKDIR /app
ADD . /app

RUN apt-get update -qq && apt-get -y install nodejs build-essential git nano
RUN npm install -g yarn && \
    chmod +x /usr/local/bin/yarn && \
    yarn install --network-timeout 1000000

RUN yarn run build
