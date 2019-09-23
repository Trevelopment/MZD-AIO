#!/bin/sh

MY_DIR=`dirname $0`
START_NORM=/jci/scripts/start_normal_mode.sh
CONF_NAME=autorun
CONF_DIR=/mnt/data_persist/dev/bin
CONF_ADB=${CONF_DIR}/adb
CONF_FILE=${CONF_DIR}/${CONF_NAME}
MY_CONF=${MY_DIR}/${CONF_NAME}
MY_ADB=${MY_DIR}/adb
UDEV_HANDLR=${CONF_DIR}/02-run-tweaks-from-usb/install-udev-handler-if-not-installed
UDEV_AUTO=${CONF_DIR}/02-run-tweaks-from-usb/install-udev-handler-if-not-installed.autorun
REC_LOG=${MY_DIR}/recovery.log

sleep 5
echo "*** Begin Autorun Recovery ***" >> ${REC_LOG}

while true
do
  if [ ! -e ${CONF_FILE} ]
  then
    echo "Recover Autorun & Files" >> ${REC_LOG}
    cp -a ${MY_CONF} ${CONF_FILE}
    cp -a ${MY_ADB} ${CONF_ADB}
    cp -a ${MY_DIR}/02-* ${CONF_DIR}
    mv ${UDEV_HANDLR} ${UDEV_AUTO}
  fi
  sleep 5
done
