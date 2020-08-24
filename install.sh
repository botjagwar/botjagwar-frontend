#!/bin/bash
if [ -d /opt/botjagwar-front ]; then
    rm -rf /opt/botjagwar-front
fi

nginx -v
if [[ $? = 127 ]]; then
    sudo apt-get update
    sudo apt-get install -y nginx
    nginx -v
    if [[ $? = 127 ]]; then
        echo "Could not install nginx"
        exit 100
    else
        echo "nginx installed."
    fi
fi

mkdir -p /opt/botjagwar-front
for folder in config css img js lib scripts templates; do
    cp -r $folder /opt/botjagwar-front/$folder
done

cp -r *.html /opt/botjagwar-front
cp -r *.js /opt/botjagwar-front
cp -r *.json /opt/botjagwar-front

mkdir -p /opt/botjagwar-front/bin
cp bin/$(uname -m)/* /opt/botjagwar-front/bin

chown $(whoami):$(whoami) /opt/botjagwar-front -R
