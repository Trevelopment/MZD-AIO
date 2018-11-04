#!/bin/sh

CMD="$1"
shift
echo $CMD
if [ "$CMD" == "" ] || [ "$CMD" == "mount" ] ; then
  USBDRV="$(ls /mnt | grep sd)"
  for USB in ${USBDRV}
  do
    USBPATH=/tmp/mnt/${USB}
    SWAPFILE="${USBPATH}"/swapfile
    if [ -e "${SWAPFILE}" ]
    then
      mount -o rw,remount ${USBPATH}
      mkswap ${SWAPFILE}
      swapon ${SWAPFILE}
      break
    fi
  done
  exit 0
fi

if [ "$CMD" == "unmount" ] ; then
  USBDRV="$(ls /mnt | grep sd)"
  for USB in ${USBDRV}
  do
    USBPATH=/tmp/mnt/${USB}
    SWAPFILE="${USBPATH}"/swapfile
    if [ -e "${SWAPFILE}" ]
    then
      mount -o rw,remount ${USBPATH}
      swapoff ${SWAPFILE}
      break
    fi
  done
  exit 0

fi
