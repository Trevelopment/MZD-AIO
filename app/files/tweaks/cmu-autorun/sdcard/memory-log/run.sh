#!/bin/sh

# Disable watchdog
echo 1 > /sys/class/gpio/Watchdog\ Disable/value
mount -o rw,remount /
# Set environment
DIR=$(dirname $(readlink -f $0))

sh ${DIR}/memLog/monitor.sh &

