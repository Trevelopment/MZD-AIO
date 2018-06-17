#!/bin/bash
## NOTE: sips only works with Mac OSX
if [ "$(uname)" = "Darwin" ]; then
  cd icons
  cp -a ../background/* .
  sips -Z 225 *.jpg
  sips -Z 225 *.png
else
  echo "This script only works with Mac OSX"
  sleep 5
  exit
fi
