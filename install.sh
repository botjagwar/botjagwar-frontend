#!/bin/bash
if [ -d /opt/botjagwar-front ]; then
    rm -rf /opt/botjagwar-front
fi

mkdir -p /opt/botjagwar-front
cp -r . /opt/botjagwar-front

chown $(whoami):$(whoami) /opt/botjagwar-front -R