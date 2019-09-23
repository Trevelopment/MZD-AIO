#!/bin/sh

if [ -f `dirname $0`/run-this ]; then 
  mv `dirname $0`/run-this `dirname $0`/run-this.sh
  /bin/sh `dirname $0`/run-this.sh >/dev/null 2>&1
  rm -f `dirname $0`/run-this.sh
fi
