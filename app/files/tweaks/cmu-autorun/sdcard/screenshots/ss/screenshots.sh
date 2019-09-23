#!/bin/sh

##########################################
## screenshots.sh - Takes X screenshots
## Set options in screenshots.conf
## By: Trezdog44
##########################################

show_message()
{
	sleep 5
	killall jci-dialog
	/jci/tools/jci-dialog --info --title="SCREENSHOTS" --text="$*" --no-cancel &
}
MYDIR=$(dirname "$(readlink -f "$0")")
CONFIGFILE="${MYDIR}/screenshots.conf"

# Exits if no config file is found
if [ -e "${CONFIGFILE}" ]
then
	. "${CONFIGFILE}"
else
	exit 1
fi

# Reset or continue numbering for filenames
if [ $SSRESET = 1 ]
then
	MAX=0
else
	MAX=$IMG_COUNT
fi

# echo "=${NUMSCRNSHOTS}= =${SSGAP}= =${IMG_COUNT}=" >> ${MYDIR}/ss.log
# 60 seconds then start
sleep 60

if [ $DONE_MSG = 1 ]
then
	show_message "${NUMSCRNSHOTS} SCREENSHOTS"
	sleep 5
	killall jci-dialog
fi

if [ ! -e "${MYDIR}/screenshots" ]
then
	mkdir -p "${MYDIR}/screenshots"
fi

for i in $(seq 1 $NUMSCRNSHOTS)
do
	/usr/bin/screenshot
	sleep $SSGAP
	cp /wayland-screenshot.png "${MYDIR}/screenshots/screenshot$((i+MAX)).png"
	# echo "${MYDIR}/screenshots/screenshot$((i+MAX)).png" >> ${MYDIR}/ss.log
	NEWMAX=$((i+MAX))
	sleep $SSGAP
done

# Set starting point for next run to continue file numbering
sed -i s/IMG_COUNT=.*/IMG_COUNT=$NEWMAX/g "${CONFIGFILE}"

if [ $DONE_MSG = 1 ]
then
	show_message "${NUMSCRNSHOTS} SCREENSHOTS TAKEN"
	sleep 15
	killall jci-dialog
fi
