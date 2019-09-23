#!/bin/sh

MY_DIR=`dirname $0`
REC_LOG=${MY_DIR}/recovery.log
START_NORM=jci/scripts/start_normal_mode.sh
START_NORM_BIN=jci/bin/start_normal_mode.sh
EMMC_MOUNT=usr/sbin/emmc_mount_data_persist.sh
RECOVERY=/tmp/recover-autorun.sh
CONF_DIR=/mnt/data_persist/dev/bin
CONF_NAME=autorun
CONF_FILE=${CONF_DIR}/${CONF_NAME}
_FS=/

check_for_autocode ()
{
	local _CONF_FILE=$1
	if [ -f ${_CONF_FILE} ] && ! grep -Fq "autorun" ${_CONF_FILE}
	then
		mount -o rw,remount ${_FS}
		echo "" >> ${_CONF_FILE}
		echo "if [ -e /data_persist/dev/bin/autorun ] ; then" >> ${_CONF_FILE}
		echo "    /data_persist/dev/bin/autorun &" >> ${_CONF_FILE}
		echo "fi" >> ${_CONF_FILE}
	fi
}
cp -a ${MY_DIR}/* /tmp
if [ ! -e ${_FS}${START_NORM} ]; then
	_FS=/mnt/a/
	if [ ! -e ${_FS} ]; then
		echo "Mounting Root File System.."
		mkdir -p ${_FS}	
		mount /dev/ffx01p1 ${_FS}
	fi
fi
check_for_autocode ${_FS}${START_NORM}
check_for_autocode ${_FS}${START_NORM_BIN}
check_for_autocode ${_FS}${EMMC_MOUNT}
# while true
# do
	# sleep 10
	# if [ ! -e ${CONF_FILE} ]; then
		# sleep 5
		# /bin/sh ${RECOVERY} &
		# break
	# fi
# done
