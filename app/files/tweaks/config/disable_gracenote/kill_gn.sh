#!/bin/sh
# kill gracenote. by Trezdog44
# initially wait 30 seconds for everything to boot up
sleep 30

# try to kill gracenote server every 30 seconds
while true
do
	if [ ! -z $(pgrep gracenote_server) ]; then
		killall -9 gracenote_server
		break
	else
		sleep 30
	fi
done
