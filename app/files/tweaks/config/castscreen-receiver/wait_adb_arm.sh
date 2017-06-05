#!/bin/sh
cd /jci/scripts || exit 1

killall cs_receiver_arm
adb kill-server
sleep 2
adb start-server

while [ true ]
do
  echo "wait adb device"
  adb wait-for-device
  echo "adb device presents, reverse port"
  adb reverse tcp:53515 tcp:53515
  adb reverse tcp:2222 tcp:22
  ./cs_receiver_arm mfw_v4lsink &
  while [ true ]
  do
    if [ "$(adb get-state)" = "device" ]
    then
      sleep 3
    else
      sleep 1
      killall cs_receiver_arm
      sleep 1
      break
    fi
  done
done
