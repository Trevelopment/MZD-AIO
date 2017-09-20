FROM node:boron
MAINTAINER Misha Nasledov <misha@nasledov.com>

RUN apt-get update \
    && apt-get -y install graphicsmagick icnsutils \
    && apt-get clean

ADD . /work

RUN cd /work \
    && npm install
