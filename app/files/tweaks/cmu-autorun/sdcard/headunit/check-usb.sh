#!/bin/sh

LIST="/tmp/root/.aa/usb-allow.list"

DEBUG=0

while [ true ]; do
while IFS='' read -r line || [[ -n "$line" ]]; do
 count=`lsusb | grep $line|wc -l|awk '{print $1}'`
 if [ $count -gt 0 ]; then
  break
 fi
done < "$LIST"

if [ $count -gt 0 ]; then
  [ $DEBUG -eq 1 ] && echo "USB Connected"
  if ! [ -e /tmp/root/usb_connect ]; then
    touch /tmp/root/usb_connect
  fi
 else
  [ $DEBUG -eq 1 ] && echo "USB disconnect"
  if [ -e /tmp/root/usb_connect ]; then
   rm -f /tmp/root/usb_connect
  fi
fi
RAND=`expr $RANDOM % 4`
[ $DEBUG -eq 1 ] && echo "go sleep $RAND"
sleep $RAND

done
