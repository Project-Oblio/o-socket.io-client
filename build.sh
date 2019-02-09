#!/bin/sh
browserify socketClient.js --standalone SocketClient > socketClient.raw.js;
minify socketClient.raw.js -d tempdist;
mv ./tempdist/socketClient.raw.js ./dist/socketClient.min.js;
rm -rf tempdist
mv socketClient.raw.js ./dist;
cp ./dist/socketClient.min.js ../music/laravel/resources/assets/js/libs/;
cp ./dist/socketClient.min.js ../music/laravel/resources/assets/util/lib/;
musicYarn
