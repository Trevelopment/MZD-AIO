#!/bin/sh

### Video player
/jci/gui/addon-common/websocketd --port=55555 /jci/gui/apps/_videoplayer/sh/videoplayer.sh &

### find swap file for media player v2
	sleep 5  // media player v2
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
