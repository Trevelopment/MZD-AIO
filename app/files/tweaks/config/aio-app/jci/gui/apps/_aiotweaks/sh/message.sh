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

if [ "$CMD" = "" ] ; then
  show_message "AIO TWEAKS MESSAGE TEST\\nIF YOU CAN SEE THIS\\nTHEN MESSAGES ARE DISPLAYING PROPERLY!\\n:-)"
else
	show_message "$CMD"
fi

exit 0
