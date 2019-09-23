#!/bin/sh

sleep 3

RUN=0
if [ -f `dirname $0`/usb-serial.config ]; then 
  ID=`dirname $0`/usb-serial.config
  if [ `cat $ID` == `udevadm info -q all -n /dev/$1 | grep "ID_SERIAL=" | awk -F = '{print $2}'` ]; then 
    RUN=1
  else
    echo "/jci/tools/jci-dialog --info --title='NOT ALLOWED $1' --text='Executing of autorun scripts from this drive are not allowed' --no-cancel \& " >/tmp/mnt/data_persist/dev/bin/02-run-tweaks-from-usb/run-this
  fi  
else
  RUN=1
fi

if [ $RUN == 1 ]; then 
  grep CMD_LINE= /tmp/mnt/$1/dataRetrieval_config.txt 2>/dev/null | awk -F = '{print $2}' | dos2unix >/tmp/mnt/data_persist/dev/bin/02-run-tweaks-from-usb/run-this
  if [ -s /tmp/mnt/data_persist/dev/bin/02-run-tweaks-from-usb/run-this ]; then 
   /bin/mount -o rw,remount /tmp/mnt/$1
   udevadm info -q all -n /dev/$1 | grep "ID_SERIAL=" | awk -F = '{print $2}' >/tmp/mnt/$1/usb-serial.config
   sync
  fi
fi
