#!/bin/sh
browserify socketClient.js --standalone SocketClient > socketClient.min.js;
cp socketClient.min.js ../music/laravel/resources/assets/js/libs/;
