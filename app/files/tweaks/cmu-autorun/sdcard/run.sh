#!/bin/sh
## Master Run Script
### Runs all cmu-autorun scripts

# Disable watchdog
echo 1 > /sys/class/gpio/Watchdog\ Disable/value
mount -o rw,remount /
# Set environment
DIR=$(dirname $(readlink -f $0))
CONFIGFILE="${DIR}/autorun.conf"

# Exits if no config file is found
if [ -e "${CONFIGFILE}" ]; then
	. "${CONFIGFILE}"
else
	exit 1 # exit 1 to show error has occured
fi

if [ ${RUN_DRYRUN} = "1" ]; then
  sh ${DIR}/dryrun/run.sh 
fi

if [ ${RUN_ADB} = "1" ]; then
  sh ${DIR}/adb/run.sh &
  sleep 5
fi

if [ ${RUN_SSH} = "1" ]; then
  sh ${DIR}/temporary-ssh-access/run.sh &
  sleep 5
fi

if [ ${RUN_WIFI} = "1" ]; then
  sh ${DIR}/WifiAP-toggle/run.sh &
  sleep 5
fi

if [ ${RUN_SS} = "1" ]; then
  sh ${DIR}/screenshots/run.sh &
  sleep 5
fi

if [ ${RUN_AA} = "1" ]; then
  sh ${DIR}/headunit/run.sh &
  sleep 5
fi

if [ ${RUN_ML} = "1" ]; then
  sh ${DIR}/memory-log/run.sh &
fi

exit 0
