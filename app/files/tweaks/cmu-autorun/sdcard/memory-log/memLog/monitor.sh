#!/bin/sh
# Momory Monitor Log - 20 entries, 60 seconds apart
MYDIR=$(dirname "$(readlink -f "$0")")
LOGFILE="${MYDIR}/memory.log"
# rm -f "${LOGFILE}"
echo "**** START MEMORY LOG - ${timestamp} ****" >> "${LOGFILE}"
sleep 60
for i in $(seq 1 20)
do
	sleep 60
	timestamp=$(date +%s)
	echo "********* LOG - ${timestamp} ********" >> "${LOGFILE}"
	cat /proc/swaps >> "${LOGFILE}"
	cat /proc/meminfo >> "${LOGFILE}"
done
exit
