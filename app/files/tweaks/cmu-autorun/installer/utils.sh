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

log_message()
{
	echo "$*" 1>&2
	echo "$*" >> "${MYDIR}/AIO_log.txt"
	/bin/fsync "${MYDIR}/AIO_log.txt"
}

show_message()
{
	sleep 5
	killall jci-dialog
#	log_message "= POPUP: $* "
	/jci/tools/jci-dialog --info --title="MESSAGE" --text="$*" --no-cancel &
}

show_message_OK()
{
	sleep 4
	killall jci-dialog
#	log_message "= POPUP: $* "
	/jci/tools/jci-dialog --confirm --title="CONTINUE INSTALLATION?" --text="$*" --ok-label="YES - GO ON" --cancel-label="NO - ABORT"
	if [ $? != 1 ]
		then
			killall jci-dialog
			return
		else
			show_message "INSTALLATION ABORTED! PLEASE UNPLUG USB DRIVE"
			sleep 5
			exit
		fi
}

add_app_json()
# script by vic_bam85
{
	# check if entry in additionalApps.json still exists, if so nothing is to do
	count=$(grep -c '{ "name": "'"${1}"'"' /jci/opera/opera_dir/userjs/additionalApps.json)
	if [ "$count" = "0" ]
		then
			log_message "=== No entry of ${2} found in additionalApps.json, seems to be the first installation ==="
			mv /jci/opera/opera_dir/userjs/additionalApps.json /jci/opera/opera_dir/userjs/additionalApps.json.old
			sleep 2
			# delete last line with "]" from additionalApps.json
			grep -v "]" /jci/opera/opera_dir/userjs/additionalApps.json.old > /jci/opera/opera_dir/userjs/additionalApps.json
			sleep 2
			cp /jci/opera/opera_dir/userjs/additionalApps.json "${MYDIR}/additionalApps${1}-2._delete_last_line.json"
			# check, if other entrys exists
			count=$(grep -c '}' /jci/opera/opera_dir/userjs/additionalApps.json)
			if [ "$count" != "0" ]
				then
					# if so, add "," to the end of last line to additionalApps.json
					echo "$(cat /jci/opera/opera_dir/userjs/additionalApps.json)", > /jci/opera/opera_dir/userjs/additionalApps.json
					sleep 2
					cp /jci/opera/opera_dir/userjs/additionalApps.json "${MYDIR}/additionalApps${1}-3._add_comma_to_last_line.json"
					log_message "=== Found existing entrys in additionalApps.json ==="
			fi
			# add app entry and "]" again to last line of additionalApps.json
			log_message "=== Add ${2} to last line of additionalApps.json ==="
			echo '{ "name": "'"${1}"'", "label": "'"${2}"'" }' >> /jci/opera/opera_dir/userjs/additionalApps.json
			sleep 2
			cp /jci/opera/opera_dir/userjs/additionalApps.json "${MYDIR}/additionalApps${1}-4._add_entry_to_last_line.json"
			echo "]" >> /jci/opera/opera_dir/userjs/additionalApps.json
			sleep 2
			cp /jci/opera/opera_dir/userjs/additionalApps.json "${MYDIR}/additionalApps${1}-5._after.json"
			rm -f /jci/opera/opera_dir/userjs/additionalApps.json.old
		else
			log_message "=== ${2} already exists in additionalApps.json, no modification necessary ==="
	fi
}

remove_app_json()
# script by vic_bam85
{
	# check if app entry in additionalApps.json still exists, if so, then it will be deleted
	count=$(grep -c '{ "name": "'"${1}"'"' /jci/opera/opera_dir/userjs/additionalApps.json)
	if [ "$count" -gt "0" ]
		then
			log_message "=== ${count} entry(s) of ${1} found in additionalApps.json, app is already installed and will be deleted now ==="
			mv /jci/opera/opera_dir/userjs/additionalApps.json /jci/opera/opera_dir/userjs/additionalApps.json.old
			# delete last line with "]" from additionalApps.json
			grep -v "]" /jci/opera/opera_dir/userjs/additionalApps.json.old > /jci/opera/opera_dir/userjs/additionalApps.json
			sleep 2
			cp /jci/opera/opera_dir/userjs/additionalApps.json "${MYDIR}/additionalApps${1}-2._delete_last_line.json"
			# delete all app entrys from additionalApps.json
			sed -i "/${1}/d" /jci/opera/opera_dir/userjs/additionalApps.json
			sleep 2
			cp /jci/opera/opera_dir/userjs/additionalApps.json "${MYDIR}/additionalApps${1}-3._delete_app_entry.json"
			json="$(cat /jci/opera/opera_dir/userjs/additionalApps.json)"
			# check if last sign is comma
			rownend=$(echo -n "$json" | tail -c 1)
			if [ "$rownend" = "," ]
				then
					# if so, remove "," from back end
					echo "${json%,*}" > /jci/opera/opera_dir/userjs/additionalApps.json
					sleep 2
					log_message "=== Found comma at last line of additionalApps.json and deleted it ==="
			fi
			# add "]" again to last line of additionalApps.json
			echo "]" >> /jci/opera/opera_dir/userjs/additionalApps.json
			rm -f /jci/opera/opera_dir/userjs/additionalApps.json.old
			sleep 2
			cp /jci/opera/opera_dir/userjs/additionalApps.json "${MYDIR}/additionalApps${1}-4._after.json"
		else
			log_message "=== ${1} not found in additionalApps.json, no modification necessary ==="
	fi
}
