#!/bin/sh
# dry run example : run.sh
DIR=$(dirname $(readlink -f $0))
/jci/tools/jci-dialog --title="SUCCESS" --text="AUTORUN ACTIVATED!\n${DIR}" --ok-label='OK' --no-cancel &
sleep 30
killall jci-dialog
