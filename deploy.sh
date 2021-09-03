#!/bin/bash

if [ "$1" == "-f" ]; then
  FORCE=true
fi

PORT=3013

ENVFILE="$DIR/.env"
echo "VUE_APP_PORT=$PORT" > $ENVFILE
  
PWD=`pwd`
APP=`basename $PWD`
git stash
GIT=`git pull`
echo $GIT
if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
  exit 0
fi

npm install
npm run build
rm /var/www/html/$APP/css/*
rm /var/www/html/$APP/js/*
cp -R dist/* /var/www/html/$APP
if [ -f "src/server.js" ]; then
  SERVER=`ps -ef | grep server.js | grep $PORT | awk {'print $2'}`
  if [ "$SERVER" != "" ]; then
    kill -9 $SERVER
  fi
fi

ps -ef | grep php | grep outdated
if [ $? -eq 1 ]; then
  php /usr/apps/monitor/src/lib/outdated.php &
fi
