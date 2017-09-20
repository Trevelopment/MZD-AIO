#!/bin/sh
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
sleep 5
if [ "$CMD" = "" ] ; then
  /usr/bin/screenshot
else
  /usr/bin/screenshot > /tmp/root/"$CMD".png
fi

sleep 5

if [ -e /tmp/root/wayland-screenshot.png ] || [ -e /tmp/root/"$CMD".png ]; then
	show_message "Screenshot Successful"
else
	show_message "Screenshot Failed"
fi

exit 0
