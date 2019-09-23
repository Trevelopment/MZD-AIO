#!/bin/sh

VERSION=1.3
MYDIR=$(dirname "$(readlink -f "$0")")
SCRIPTPATH=${MYDIR}
ROOT=/tmp/root/.aa


conf='{
    "launchOnDevice": true,
    "carGPS": true,
    "wifiTransport": false,
    "reverseGPS": false
}'

if ! [ -e /tmp/root/headunit.json ]; then
 printf "%s" "$conf" > /tmp/root/headunit.json
fi


log_message()
{
	mount -o rw,remount ${MYDIR}
        echo "$*" 1>&2
        echo "$*" >> "${MYDIR}/AIO_log.txt"
        /bin/fsync "${MYDIR}/AIO_log.txt"
	mount -o ro,remount ${MYDIR}
}

show_message()
{
        sleep 5
        killall jci-dialog
        /jci/tools/jci-dialog --info --title="MESSAGE" --text="$*" --no-cancel &
}

mount -o rw,remount ${MYDIR}
mkdir -p ${ROOT}
cp -a ${MYDIR}/* ${ROOT}

chmod 755 ${ROOT}/headunit
chmod 755 ${ROOT}/headunit_libs/libgsth264parse.so
chmod 755 ${ROOT}/headunit_libs/libmfw_gst_isink.so
mount -o ro,remount ${MYDIR}

cd ${ROOT}
pkill check-usb.sh
nohup ./check-usb.sh >/dev/null 2>&1 &
sleep 1

show_message "CMU-AUTORUN: Start autorun-headunit-${VERSION} USB/WIFI"
sleep 4
killall jci-dialog

nohup ./headunit-wrapper.start >/dev/null 2>&1 &

