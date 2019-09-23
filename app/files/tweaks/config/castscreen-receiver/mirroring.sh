#!/bin/sh
# Enable Mirroring
# V1.0 - Initial

cd /jci/scripts

if which adb >/dev/null
then
  ./wait_adb_arm.sh
fi
