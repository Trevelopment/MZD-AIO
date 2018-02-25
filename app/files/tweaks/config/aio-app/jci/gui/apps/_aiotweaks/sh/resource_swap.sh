#!/bin/sh
# Use <br> for line breaks
show_message()
{
  MSG=$(echo "$*" | sed 's/<br>/\\n/g')
  killall -q jci-dialog
  /jci/tools/jci-dialog --info --title="AIO TWEAKS" --text="$MSG" --no-cancel &
  sleep 7
  killall -q jci-dialog
}

CMD="$1"
shift
echo $CMD
if [ "$CMD" == "" ] || [ "$CMD" == "mount" ] ; then
  USBDRV="resources $(ls /mnt | grep sd)"
  for USB in ${USBDRV}
  do
    USBPATH=/tmp/mnt/${USB}
    SWAPFILE="${USBPATH}"/swapfile
    if [ -e "${SWAPFILE}" ]
    then
      show_message "SWAPFILE FOUND, MOUNTING: ${SWAPFILE}"
      mount -o rw,remount ${USBPATH}
      mkswap ${SWAPFILE}
      swapon ${SWAPFILE}
      break
    fi
  done
  exit 0
fi

if [ "$CMD" == "unmount" ] ; then
  USBDRV="resources $(ls /mnt | grep sd)"
  for USB in ${USBDRV}
  do
    USBPATH=/tmp/mnt/${USB}
    SWAPFILE="${USBPATH}"/swapfile
    if [ -e "${SWAPFILE}" ]
    then
      show_message "SWAPFILE FOUND, UNMOUNTING: ${SWAPFILE}"
      mount -o rw,remount ${USBPATH}
      swapoff ${SWAPFILE}
      break
    fi
  done
  exit 0

fi
