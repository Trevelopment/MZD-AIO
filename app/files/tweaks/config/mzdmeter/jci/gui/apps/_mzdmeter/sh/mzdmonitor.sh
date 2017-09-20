#!/bin/sh

if [ -e /paa/tunnel_backend.start ]; then
	rm -f /paa/tunnel_backend.start
fi


### MZDmeter : Support all data
/jci/gui/addon-common/websocketd --port=44944 /jci/gui/apps/_mzdmeter/sh/mzdmeterbackend.sh &

sleep 10

while true
do
	v1=`ps -ef | grep "websocketd --port=44944" | grep -v grep`
	if [ -z "$v1" ]; then
		rm -f /paa/tunnel_backend.start
		/jci/gui/addon-common/websocketd --port=44944 /jci/gui/apps/_mzdmeter/sh/mzdmeterbackend.sh &
		if [ "$?" = "0" ]; then
			touch /paa/tunnel_backend.start
			rm -f /paa/tunnel_backend.start_failed
		else
			touch /paa/tunnel_backend.start_failed
		fi
	fi

	sleep 10
done
