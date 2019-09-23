#!/bin/sh

# disable watchdog and allow write access
echo 1 > /sys/class/gpio/Watchdog\ Disable/value
mount -o rw,remount /

MYDIR=$(dirname "$(readlink -f "$0")")
NAME="autorun"
CONF_DIR="/tmp/mnt/data_persist/dev/bin"
CONF_FILE=${CONF_DIR}/${NAME}
SRC_FILE=${MYDIR}/${NAME}

. "${MYDIR}"/utils.sh

CMU_SW_VER=$(get_cmu_sw_version)
CMU_VER=${CMU_SW_VER:0:2}
rm -f "${MYDIR}/AIO_log.txt"

if [ ! -e ${CONF_DIR} ]; then
  mkdir -p ${CONF_DIR}
fi
choice=0
# confirmation /jci/tools/jci-dialog --3-button-dialog --title="Tweaks Selection for AUTORUN" --text="Choose Installation Method" --ok-label="Install" --cancel-label="Uninstall" --button3-label="Skip"
# confirmation choice=$?
if [ "$choice" -eq 0 ]; then
  msg="Install.."
  # Remove old files
  rm -rf ${CONF_DIR}/00-* ${CONF_DIR}/01-*
  rm -rf ${CONF_DIR}/02-* ${CONF_DIR}/44-*
  rm -f ${CONF_DIR}/tweaks.sh
  cat ${SRC_FILE} > ${CONF_FILE}
  show_message "INSTALLING RECOVERY FILES"
  cp -a "${MYDIR}"/02-* ${CONF_DIR}
  cp -a "${MYDIR}"/44-* ${CONF_DIR}
  if [ -e "${MYDIR}"/adb ]; then
    show_message "INSTALLING ADB"
    cp -a "${MYDIR}"/adb ${CONF_DIR}
  fi
  chmod +x ${CONF_FILE}
  sleep 2
  killall jci-dialog
  reboot=0
  # confirmation /jci/tools/jci-dialog --question --title="CMU-AUTORUN" --text="autorun installation complete\n\nReboot?"  --ok-label="Now" --cancel-label="Later"
  # confirmation reboot=$?
  show_message "AUTORUN & RECOVERY INSTALLATION COMPLETE"
  if [ "$reboot" -eq 0 ]; then
    reboot
  fi
elif [ "$choice" -eq 1 ]; then
  if [ "$CMU_VER" -ge 59 ]; then
    show_message_OK "WARNING: UNINSTALLING AUTORUN WILL PERMANENTLY\nREMOVE YOUR ABILITY TO INSTALL TWEAKS\nAND YOU WILL LOSE ALL ACCESS TO MODIFY YOUR SYSTEM\nDO NOT CONTINUE IF THIS IS NOT YOUR INTENTION!!!"
  fi
  show_message "UNINSTALLING AUTORUN AND RECOVERY FILES..."
  if [ -e ${CONF_FILE} ]; then
    if grep -Fq "### ${NAME}" ${CONF_FILE}
    then
      t=$(cat ${CONF_FILE}.temp)
      # sed -i "/### ${NAME}/,/### END ${NAME}/d" ${CONF_FILE}
    else
      echo "Clean"
    fi
  else
    show_message "NO AUTORUN"
  fi
  rm -rf ${CONF_DIR}/00-* ${CONF_DIR}/01-*
  rm -rf ${CONF_DIR}/02-* ${CONF_DIR}/44-*

  chmod -R 777 ${CONF_DIR}
  killall jci-dialog
  show_message "REBOOTING"
  sleep 5
  reboot
else
  show_message "INSTALLATION ABORTED PLEASE UNPLUG USB DRIVE"
fi

chmod 777 -R /tmp/mnt/data_persist
sleep 2
killall jci-dialog
exit 0
