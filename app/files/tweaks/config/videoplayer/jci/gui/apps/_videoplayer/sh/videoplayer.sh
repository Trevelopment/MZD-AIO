#!/bin/sh

while read action
do
	break
done

enableLog=0


writeLog()
{
	if [ "${enableLog}" == "1" ]
	then
		echo $(date) ' ; ' "${*}" >> /jci/gui/apps/_videoplayer/log/videoplayer_log.txt
	fi
}


# start swap
# ================================================================================================
if [ "${action}" == "start-swap" ]
then
	USBDRV=$(ls /mnt | grep sd)

	for USB in $USBDRV
	do
		USBPATH=/tmp/mnt/${USB}
		SWAPFILE="${USBPATH}"/swapfile
		if [ -e "${SWAPFILE}" ]
			then
				mount -o rw,remount ${USBPATH}
				swapon ${SWAPFILE}
				break
		fi
	done
fi


# enable write
# ================================================================================================
if [ "${action}" == "enable-write" ]
then
	hwclock  --hctosys
	mount -o rw,remount /
fi


# disable write
# ================================================================================================
if [ "${action}" == "disable-write" ]
then
	mount -o ro,remount /
fi


# reboot system
# ================================================================================================
if [ "${action}" == "reboot-system" ]
then
	reboot
fi


# video player - playback status
# ================================================================================================
if [ "${action}" == "playback-status" ]
then
	writeLog "SH playback-status start"
	GSTLAUNCH=`ps | grep 'gst-launch' | grep -v grep`
	if [ ! -z "${GSTLAUNCH}" ]
	then
		echo "playback-status#1"
	else
		echo "playback-status#0"
	fi
	writeLog "SH playback-status end"
fi


#video player - start full screen
# ================================================================================================
guess=$(echo ${action} | grep 'playback_fullscreen')
if [ ! -z "${guess}" ]
then
	writeLog "SH playback_fullscreen start"
	killall gst-launch-0.10
	sync && echo 3 > /proc/sys/vm/drop_caches
	VIDEOFILE=$(echo ${action} | cut -d'#' -f 2)
	if [ ! -z "${VIDEOFILE}" ] && [ -e "${VIDEOFILE}" ]
	then
		writeLog "SH playback_fullscreen gst-launch ${VIDEOFILE}"
		
		if [ "${enableLog}" == "1" ]
		then
			/usr/bin/gst-launch --gst-fatal-warnings playbin2 uri=file://"${VIDEOFILE}" video-sink="mfw_v4lsink" audio-sink="alsasink" max-size-buffers="1" max-size-bytes="0" max-size-time="0" > /dev/null 2>&1 >> /jci/gui/apps/_videoplayer/log/videoplayer_log.txt &
		else
			/usr/bin/gst-launch --gst-fatal-warnings playbin2 uri=file://"${VIDEOFILE}" video-sink="mfw_v4lsink" audio-sink="alsasink" max-size-buffers="1" max-size-bytes="0" max-size-time="0" > /dev/null 2>&1 &
		fi
	fi
	
	sleep 3
	GSTLAUNCH=`ps | grep 'gst-launch' | grep -v grep`
	if [ ! -z "${GSTLAUNCH}" ]
	then
		echo "playback-start#1"
	else
		echo "playback-start#0"
	fi
	
	writeLog "SH playback_fullscreen end"
fi


# video player - start playback
# ================================================================================================
guess=$(echo ${action} | grep 'playback-start')
if [ ! -z "${guess}" ]
then
	writeLog "SH playback-start start"
	writeLog "SH ${action}"
	
	killall gst-launch-0.10
	sync && echo 3 > /proc/sys/vm/drop_caches
	VIDEOFILE=$(echo ${action} | cut -d'#' -f 2)
	writeLog "SH playback-start gst-launch ${VIDEOFILE}"
	
	if [ ! -z "${VIDEOFILE}" ] && [ -e "${VIDEOFILE}" ]
	then
		#Screen size 800w*480h
		#/usr/bin/gst-launch --gst-fatal-warnings playbin2 uri=file://"${VIDEOFILE}" video-sink="mfw_v4lsink disp-height=430" audio-sink="alsasink" max-size-buffers="1" max-size-bytes="0" max-size-time="0" > /dev/null 2>&1 &
		#700x368 / top 64 left 50
		writeLog "/usr/bin/gst-launch --gst-fatal-warnings playbin2 uri=file://'${VIDEOFILE}' video-sink=\"mfw_v4lsink disp-width=700 disp-height=368 axis-left=50 axis-top=64\" audio-sink=\"alsasink\" max-size-buffers=\"1\" max-size-bytes=\"0\" max-size-time=\"0\" > /dev/null 2>&1"
		
		if [ "${enableLog}" == "1" ]
		then
			/usr/bin/gst-launch --gst-fatal-warnings playbin2 uri=file://"${VIDEOFILE}" video-sink="mfw_v4lsink disp-width=700 disp-height=368 axis-left=50 axis-top=64" audio-sink="alsasink" max-size-buffers="1" max-size-bytes="0" max-size-time="0" > /dev/null 2>&1 >> /jci/gui/apps/_videoplayer/log/videoplayer_log.txt &
		else
			/usr/bin/gst-launch --gst-fatal-warnings playbin2 uri=file://"${VIDEOFILE}" video-sink="mfw_v4lsink disp-width=700 disp-height=368 axis-left=50 axis-top=64" audio-sink="alsasink" max-size-buffers="1" max-size-bytes="0" max-size-time="0" > /dev/null 2>&1 &
		fi
		
		#gnonlin example
		#gst-launch gnlfilesource location=file:///path/to/my/video.mov media-start=10000000000 media-duration=2000000000 ! autovideosink
		
	fi
	sleep 3
	GSTLAUNCH=`ps | grep 'gst-launch' | grep -v grep`
	if [ ! -z "${GSTLAUNCH}" ]
	then
		echo "playback-start#1"
	else
		echo "playback-start#0"
	fi
	
	writeLog "SH playback-start end"
fi


# video player - stop playback
# ================================================================================================
if [ "${action}" == "playback-stop" ]
then
	writeLog "SH playback-stop start"
	
	killall gst-launch-0.10
	echo "playback-stop#"
	
	writeLog "SH playback-stop end"
fi


# video player - next track
# ================================================================================================
if [ "${action}" == "playback-next" ]
then
	writeLog "SH playback-next start"

	killall gst-launch-0.10
	echo "playback-next#"
	
	writeLog "SH playback-next end"
fi


# video player - load list
# ================================================================================================
if [ "${action}" == "playback-list" ]
then
	writeLog "SH playback-list start"

	LI_ELEMENT=0
	TRACKCOUNT=0
	VIDEOS=''


	USBDRV=$(ls /mnt | grep sd)

	for USB in $USBDRV
	do
		writeLog "SH playback-list USB: "${USB}
		
		USBPATH=/tmp/mnt/${USB}	

		FOLDER=$(ls $USBPATH | grep -m 1 -i "movies")
		USBPATH=$USBPATH/$FOLDER
	
		#add more file type if needed
		for VIDEO in "${USBPATH}"/*.mp4 "${USBPATH}"/*.avi "${USBPATH}"/*.flv "${USBPATH}"/*.wmv
		do
						
			VIDEONAME=$(echo "${VIDEO}" | cut -d'/' -f 6)
			VIDEOCHECK=${VIDEONAME:0:1}
			if [ "${VIDEOCHECK}" != "*" ]
			then
								
				let "LI_ELEMENT=$LI_ELEMENT+1"
				if [ $LI_ELEMENT == "1" ]
				then
					VIDEOS="${VIDEOS}<ul class='videoListContainer'>"
				fi

				let "TRACKCOUNT=$TRACKCOUNT+1"
				
				writeLog "SH <li video-name='${VIDEONAME}' video-data='${VIDEO}' class='videoTrack'>${TRACKCOUNT}. ${VIDEONAME}</li>"
				VIDEOS="${VIDEOS}<li video-name='${VIDEONAME}' video-data='${VIDEO}' class='videoTrack'>${TRACKCOUNT}. ${VIDEONAME}</li>"

				if [ $LI_ELEMENT == "8" ]
				then
					VIDEOS="${VIDEOS}</ul>"
					LI_ELEMENT=0
				fi
				
			fi
		done
	done

	if [ $LI_ELEMENT != 0 ]
	then
		VIDEOS="${VIDEOS}</ul>"
	fi

	echo "playback-list#${VIDEOS}#${TRACKCOUNT}"
	
	writeLog "SH playback-list end"
fi


# write log
# ================================================================================================
guess=$(echo ${action} | grep 'write_log')
if [ ! -z "${guess}" ]
then
	LOG=$(echo ${action} | cut -d'#' -f 2)
	
	writeLog $LOG
fi
