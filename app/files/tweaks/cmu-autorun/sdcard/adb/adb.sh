#!/bin/sh
MYDIR=$(dirname $(readlink -f $0))
INSTALLDIR=/data_persist/dev/bin
SYMDIR=/usr/bin
TIMESTAMP=$(date "+%m%d%Y-%H%M%S")
LOGFILE=${MYDIR}/adb_log.txt

echo "Start adb ssh script" >> ${LOGFILE}

if [ ! -f ${INSTALLDIR}/adb ]; then
	mkdir -p ${INSTALLDIR}
	if [ ! -f ${MYDIR}/adb ]; then
		/jci/tools/jci-dialog --title="SSH" --text="adb not found please install adb to use adb SSH " --ok-label='OK' --no-cancel &
		exit
	else
		/jci/tools/jci-dialog --title="SSH" --text="Installing adb... " --ok-label='OK' --no-cancel &
	fi
	echo "Disabling Watchdog Service" >> ${LOGFILE}
	echo 1 > /sys/class/gpio/Watchdog\ Disable/value
	echo "Mounting filesystem read/write" >> ${LOGFILE}
	mount -o rw,remount /  >> ${LOGFILE} 2>&1
	echo "Install adb files" >> ${LOGFILE}
	mv ${MYDIR}/adb ${INSTALLDIR}/adb >> ${LOGFILE} 2>&1
	chmod 755 ${INSTALLDIR}/adb >> ${LOGFILE} 2>&1
	ln -sf ${INSTALLDIR}/adb ${SYMDIR}/adb
	killall jci-dialog >> ${LOGFILE}
fi

/jci/tools/jci-dialog --title="SSH" --text="Connect Android to Mazda USB port" --ok-label='OK' --no-cancel &
echo "Wait for device" >> ${LOGFILE}
adb wait-for-device >> ${LOGFILE} 2>&1
killall jci-dialog >> ${LOGFILE}
echo "adb reverse tcp:2222 tcp:22" >> ${LOGFILE}
 adb reverse tcp:2222 tcp:22 >> ${LOGFILE} 2>&1
/jci/tools/jci-dialog --title="SSH" --text="on Android do ssh cmu@localhost -p 2222\nCMU Firmware < v56.00.513 use root@localhost -p 2222\n(password: jci)"  --ok-label='OK' --no-cancel
echo "Disconnected" >> ${LOGFILE}
sleep 5
killall jci-dialog >> ${LOGFILE}
/jci/tools/jci-dialog --title="SSH" --text="SSH DISCONNECTED"  --ok-label='OK' --no-cancel &
sleep 5
killall jci-dialog >> ${LOGFILE}
exit
