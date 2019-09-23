#!/bin/sh

# disable watchdog and allow write access
echo 1 > /sys/class/gpio/Watchdog\ Disable/value
mount -o rw,remount /

MYDIR=$(dirname "$(readlink -f "$0")")

# Start Wifi AP Toggle

/jci/scripts/jci-fw.sh stop
killall wpa_supplicant
sleep 2
/jci/scripts/jci-wifiap.sh start
sleep 2
/jci/scripts/jci-wifiap.sh status > ${MYDIR}/wifiAPToggle.log
