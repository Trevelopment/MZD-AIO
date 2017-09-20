#!/bin/sh

### Android Auto start
headunit-wrapper &

### find swap file for media player v2
sleep 5
for USB in a b c d e
do
	USBPATH=/tmp/mnt/sd${USB}1
	SWAPFILE="${USBPATH}"/swapfile
	if [ -e "${SWAPFILE}" ]
		then
			mount -o rw,remount ${USBPATH}
			swapon ${SWAPFILE}
			break
	fi
done
