#!/bin/sh

MYDIR=$(dirname "$(readlink -f "$0")")

get_cmu_sw_version()
{
	_ver=$(/bin/grep "^JCI_SW_VER=" /jci/version.ini | /bin/sed 's/^.*_\([^_]*\)\"$/\1/')
	_patch=$(/bin/grep "^JCI_SW_VER_PATCH=" /jci/version.ini | /bin/sed 's/^.*\"\([^\"]*\)\"$/\1/')
	_flavor=$(/bin/grep "^JCI_SW_FLAVOR=" /jci/version.ini | /bin/sed 's/^.*_\([^_]*\)\"$/\1/')

	if [ ! -z "${_flavor}" ]; then
		echo "${_ver}${_patch}-${_flavor}"
	else
		echo "${_ver}${_patch}"
	fi
}

show_message()
{
	sleep 5
	killall jci-dialog
	/jci/tools/jci-dialog --info --title="MESSAGE" --text="$*" --no-cancel &
}

# disable watchdog and allow write access
echo 1 > /sys/class/gpio/Watchdog\ Disable/value
mount -o rw,remount /

CMU_SW_VER=$(get_cmu_sw_version)

show_message "INSTALLING RECOVERY FILES"

cp -a "${MYDIR}"/00-* /tmp/mnt/data_persist/dev/bin/
cp -a "${MYDIR}"/01-* /tmp/mnt/data_persist/dev/bin/
chmod -R +x /tmp/mnt/data_persist/dev/bin/

show_message "RECOVERY FILES INSTALLED"

exit 0
