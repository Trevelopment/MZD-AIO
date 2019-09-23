#!/bin/sh
if ! which adb > /dev/null; then
  echo "adb not found~!"
  exit 1
fi

adb start-server

echo "wait adb device"
adb wait-for-device
echo "adb device presents, reverse porting ssh on port 2222"
adb reverse tcp:2222 tcp:22
while [ true ]
do
  if [ "$(adb get-state)" = "device" ]; then
    sleep 5
  else
    sleep 1
    echo "adb disconnected"
    break
  fi
done
exit 0
