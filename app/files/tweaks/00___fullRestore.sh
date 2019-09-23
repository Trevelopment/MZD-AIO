if [ ! -e "${MYDIR}/org_files" ]
then
  mkdir "${MYDIR}/org_files"
fi
restore_full()
{
  FILE="${1}"
  BACKUP_FILE="${1}.org"
  FILENAME=$(basename -- "$FILE")
  if [ -e "${BACKUP_FILE}" ]
  then
    if [ -s "${BACKUP_FILE}" ]
    then
      cp "${BACKUP_FILE}" "${MYDIR}/org_files/"
      cp -a "${BACKUP_FILE}" "${FILE}" && log_message "***+++ Restored ${FILENAME} From ${BACKUP_FILE} +++***"
      if [ $DEL_BAKUPS -eq 1 ]
      then
        rm -f "${BACKUP_FILE}"
        log_message "***===---      Deleted backup: ${FILENAME}.org           ---===***"
      fi
    else
      # Backup file is blank, run integrity check
      log_message "!!!+++ WARNING: BACKUP FILE ${BACKUP_FILE} WAS BLANK!!! +++!!!"
      v70_integrity_check
    fi
    return 0
  else
    # New secondary location for storing .org files for v70+
    BACKUP_FILE="${NEW_BKUP_DIR}/${FILENAME}.org"
    if [ -s "${BACKUP_FILE}" ]
    then
      cp "${BACKUP_FILE}" "${MYDIR}/org_files/"
      cp -a "${BACKUP_FILE}" "${FILE}" && log_message "+++*** Restored ${FILENAME} From Backup ${BACKUP_FILE} ***+++"
      return 0
    fi
    return 1
  fi
}
[ $COMPAT_GROUP -eq 6 ] && v70_integrity_check
log_message "*************************************************************************"
log_message "********************* BEGIN FULL SYSTEM RESTORE *************************"
log_message "*************************************************************************"
show_message "BEGIN FULL SYSTEM RESTORE ...\nALL FILES TWEAKED BY AIO WILL BE RESTORED\nALL APPS INSTALLED BY AIO WILL BE REMOVED\nBY: TREZDOG44 ..."
log_message "=======************ ENABLE TOUCHSCREEN RESTRICTION ... ***********======="
/jci/scripts/set_lvds_speed_restriction_config.sh enable
/jci/scripts/set_speed_restriction_config.sh enable

if [ -e /jci/nng/jci-linux_imx6_volans-release.org ]
then
  if (restore_full /jci/nng/jci-linux_imx6_volans-release)
  then
    log_message "========*********      REMOVING SPEEDCAM PATCH ...    ***********========"
    log_message "=======********  jci-linux_imx6_volans-release RESTORED   *********======"
  fi
  chmod 755 /jci/nng/jci-linux_imx6_volans-release
fi
if (restore_full /jci/nng/data.zip)
then
  log_message "=============************  data.zip RESTORED   *************============="
  chmod 755 /jci/nng/data.zip
fi
rm -f /jci/nng/2
if [ -e /mnt/sd_nav/content/speedcam/speedcam.txt ] || [ -e /mnt/sd_nav/content/speedcam/speedcam.spdb ]
then
  #	cp /mnt/sd_nav/content/speedcam/speedcam.txt ${MYDIR}
  #	log_message "=== Copied speedcam.txt to USB ==="
  #	rm -f /mnt/sd_nav/content/speedcam/speedcam.txt
  #	rm -f /mnt/sd_nav/content/speedcam/speedcam.spdb
  log_message "===*** Remove speedcam.txt and speedcam.spdb from SD card to complete uninstalation of speedcam patch ***==="
fi

# remove track-order and FLAC support
# Uncomment to remove
#if [ -e /jci/lib/libmc_user.so.org ]
#then
#	show_message "REMOVE TRACK-ORDER AND FLAC SUPPORT ..."
#	log_message "====****   UNINSTALL TRACK-ORDER AND FLAC SUPPORT    ****====="
#	cp -a /jci/lib/libmc_user.so.org /jci/lib/libmc_user.so
#	log_message "=== Restored libmc_user.so from backup ==="
#	chmod 755 /jci/lib/libmc_user.so
#	rm -f /usr/lib/gstreamer-0.10/libgstflac.so
#	rm -f /usr/lib/libFLAC.so.8.3.0
#	rm -f /usr/lib/libFLAC.so.8
#	if [ $DEL_BAKUPS -eq 1 ]
#	then
#		rm -f /jci/lib/libmc_user.so.org
#		log_message "=====****** Deleted backup: libmc_user.so.org ********========"
#	fi
#	log_message "===*** END UNINSTALLATION OF TRACK-ORDER AND FLAC SUPPORT ***==="
#	#fi

# restore systemApp.js
if (restore_full /jci/gui/apps/system/js/systemApp.js)
then
  log_message "==========***************  systemApp.js RESTORED   ************=========="
  rm -f /jci/gui/apps/system/js/systemApp.js.audio
  rm -f /jci/gui/apps/system/js/systemApp.js.disclaimer
  log_message "===***  Removed systemApp.js.audio & systemApp.js.disclaimer flags ***==="
fi

# restore MainMenuCtrl.js
if (restore_full /jci/gui/apps/system/controls/MainMenu/js/MainMenuCtrl.js)
then
  log_message "==========************  MainMenuCtrl.js RESTORED   ************=========="
fi

# restore List2Ctrl.js
if (restore_full /jci/gui/common/controls/List2/js/List2Ctrl.js)
then
  log_message "============************  List2Ctrl.js RESTORED   *************=========="
fi
if [ -e /jci/gui/apps/diag/js/diagApp.js.org2 ]
then
  cp -a /jci/gui/apps/diag/js/diagApp.js.org2 /jci/gui/apps/diag/diagApp.js
  log_message "============*************  diagApp.js RESTORED   *************==========="
  rm -f /jci/gui/apps/diag/js/diagApp.js.org2
elif (restore_full /jci/gui/apps/diag/js/diagApp.js)
then
  log_message "============*************  diagApp.js RESTORED   *************==========="
fi
if [ -s /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org2 ]
then
  if ! grep -Fq "formatDateCustom" /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org2
  then
    cp -a /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org2 /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org
  fi
  rm -f /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org2
fi
if [ -e /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org ] && grep -Fq "formatDateCustom" /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org
then
  log_message "===           Repairing backup file StatusBarCtrl.js.org             ==="
  sed -i '/this.date/d' /jci/gui/common/controls/StatusBar/css/StatusBarCtrl.js.org
fi
if (restore_full /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js)
then
  log_message "============*********** StatusBarCtrl.js RESTORED **************========="
else
  # in this scenerio we need to repair StatusBarCtrl.js since there is no backup file
  # but there is leftover code from date2statusbar because of a bug in AIO 1.x
  if grep -Fq "formatDateCustom" /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js
  then
    log_message "==========********* Repairing file StatusBarCtrl.js ***********=========="
    sed -i '/this.date/d' /jci/gui/common/controls/StatusBar/css/StatusBarCtrl.js
  fi
fi
if [ -e /jci/gui/common/js/Common.js.org2 ]
then
  if ! grep -q "isMuted \? \"Global.Pause\" : \"Global.Resume\");" /jci/gui/common/js/Common.js.org2
  then
    cp -a /jci/gui/common/js/Common.js.org2  /jci/gui/common/js/Common.js.org
  fi
  rm -f /jci/gui/common/js/Common.js.org2
fi
if (restore_full /jci/gui/common/js/Common.js)
then
  log_message "==============*********** Common.js RESTORED ***********================="
fi
if (restore_full /jci/gui/apps/diag/controls/Test/js/TestCtrl.js)
then
  log_message "============*********** TestCtrl.js RESTORED ***********================="
fi
if (restore_full /jci/gui/apps/diag/controls/Test/css/TestCtrl.css)
then
  log_message "===========*********** TestCtrl.css RESTORED ***********================="
fi
if (restore_full /jci/gui/common/controls/Sbn/css/SbnCtrl.css)
then
  log_message "============************* SbnCtrl.css RESTORED ***************==========="
  rm -f /jci/gui/common/controls/Sbn/css/SbnCtrl.all.css
fi
if (restore_full /jci/gui/common/controls/StatusBar/css/StatusBarCtrl.css)
then
  log_message "===========************ StatusBarCtrl.css RESTORED ************=========="
fi
if (restore_full /jci/gui/common/controls/StatusBar/images/StatusBarBg.png)
then
  log_message "============************ StatusBarBg.png RESTORED ***************========"
fi
if (restore_full /jci/gui/framework/js/Utility.js)
then
  log_message "============************* Utility.js RESTORED **************============="
fi
grep -Fq '"settleTime" : 1000,' /jci/gui/apps/diag/js/diagApp.js && sed -i 's/"settleTime" : 1000,/"settleTime" : 20000,/g' /jci/gui/apps/diag/js/diagApp.js
grep -Fq 'Sumire Racing' /jci/gui/common/js/Common.js && sed -i '/Sumire Racing/d' /jci/gui/common/js/Common.js
grep -Fq '"holdTimeout" : 1000,' /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js && sed -i 's/"holdTimeout" : 1000,/"holdTimeout" : 5000,/g' /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js
# restore background image and common.css to original
if (restore_full /jci/gui/common/css/common.css)
then
  log_message "=============*********** Common.css RESTORED ***********================="
fi
if grep -Fq "keyframes slide" /jci/gui/common/css/common.css
then
  cp -a ${MYDIR}/config_org/BackgroundRotator/jci/gui/common/css/common.css /jci/gui/common/css/
  log_message "=======******* Common.css RESTORED FROM USB FALLBACK **********=========="
fi
show_message "RESTORING TWEAKED FILES ...\nPLEASE WAIT ..."
# restore message replies
if (restore_full /jci/settings/configurations/blm_msg-system.xml)
then
  log_message "==========*********** blm_msg-system.xml RESTORED ***********============"
fi

# restore boot animation
if (restore_full /jci/resources/newLoopLogo.ivf)
then
  log_message "============*********** newLoopLogo.ivf RESTORED ************============"
fi
if (restore_full /jci/resources/LoopLogo.ivf)
then
  log_message "============************ LoopLogo.ivf RESTORED **************============"
fi
if (restore_full /jci/resources/ExitLogo.ivf)
then
  log_message "============************ ExitLogo.ivf RESTORED **************============"
fi
if (restore_full /jci/resources/TranLogo.ivf)
then
  log_message "============************ TranLogo.ivf RESTORED ***************==========="
fi
if (restore_full /jci/resources/TranLogoEnd.ivf)
then
  log_message "============*********** TranLogoEnd.ivf RESTORED **************=========="
fi
# restore button background graphics
if (restore_full /jci/gui/common/controls/Ump3/css/Ump3Ctrl.css)
then
  log_message "===========************ Ump3Ctrl.css RESTORED **************============="
fi
# Restore Backgounds that were changed prior to AIO v2.1
if (restore_full /jci/gui/common/controls/Ump3/images/UMP_Bg.png)
then
  rm -f /jci/gui/common/controls/Ump3/images/UMP_Bg.png.org
  log_message "==============************** UMP_Bg RESTORED ****************============"
  if (restore_full /jci/gui/common/controls/Ump3/images/UMP_Bg_Arch.png)
  then
    rm -f /jci/gui/common/controls/Ump3/images/UMP_Bg_Arch.png.org
    log_message "============************* UMP_Bg_Arch RESTORED **************============"
    if (restore_full /jci/gui/common/controls/Ump3/images/UMP_Btn_Separator.png)
    then
      rm -f /jci/gui/common/controls/Ump3/images/UMP_Btn_Separator.png.org
      log_message "===========*********** UMP_Btn_Separator RESTORED ************==========="
    fi
  fi
fi
# UI Style Tweaks
if (restore_full /jci/gui/common/controls/List2/css/List2Ctrl.css)
then
  log_message "============************ List2Ctrl.css RESTORED *************============"
fi
if (restore_full /jci/gui/common/controls/NowPlaying4/css/NowPlaying4Ctrl.css)
then
  log_message "==========*********** NowPlaying4Ctrl.css RESTORED ***********==========="
fi
if (restore_full /jci/gui/apps/system/controls/MainMenu/css/MainMenuCtrl.css)
then
  log_message "===========*********** MainMenuCtrl.css RESTORED *************==========="
fi
# FuelConsumptionTweak
if (restore_full /jci/gui/apps/ecoenergy/controls/FuelConsumption/css/FuelConsumptionCtrl.css)
then
  log_message "========************ FuelConsumptionCtrl.css RESTORED ************======="
fi
if (restore_full /jci/gui/apps/ecoenergy/controls/FuelConsumption/images/FuelConsBG.png)
then
  log_message "=========*************** FuelConsBG.png RESTORED **************=========="
fi
if (restore_full /jci/gui/apps/ecoenergy/controls/FuelConsumption/js/FuelConsumptionCtrl.js)
then
  log_message "========*********** FuelConsumptionCtrl.js RESTORED *************======="
fi
# change off screen background image
if (restore_full /jci/gui/apps/system/controls/OffScreen/images/OffScreenBackground.png)
then
  log_message "========********** OffScreenBackground.png RESTORED *************======="
fi

if (restore_full /jci/gui/apps/usbaudio/js/usbaudioApp.js)
then
  log_message "===========************ usbaudioApp.js RESTORED **************=========="
fi
if (restore_full /jci/gui/common/controls/NowPlaying4/js/NowPlaying4Ctrl.js)
then
  log_message "=========*********** NowPlaying4Ctrl.js RESTORED **************=========="
fi
if [ -e /etc/asound.conf.org ]
then
  # fix link from previous version
  if ! [ -L /etc/asound.conf ]; then
    mv /etc/asound.conf ${MYDIR}/asound.conf.AA
    ln -sf /data/asound.conf /etc/asound.conf
  fi
  rm -f /etc/asound.conf.org
  log_message "===     /etc/asound.conf reverted from factory /data/asound.conf    ==="
fi
# restore phoneApp if the pach was applied
if (restore_full /jci/gui/apps/phone/js/phoneApp.js)
then
  rm -f /jci/gui/apps/phone/js/phoneApp.js.org
  log_message "=======*********   Deleted backup: phoneApp.js.org      ********========"
fi
# Remove APPS
show_message "REMOVE VIDEOPLAYER - SPEEDOMETER \n ANDROID AUTO - CASTSCREEN FILES \n & AIO TWEAKS APP FILES..."
log_message "=======*********  UNINSTALL VIDEOPLAYER, SPEEDOMETER,    ********========"
log_message "=======*********  ANDROID AUTO & CASTSCREEN RECIEVER ... ********========"

# kills all WebSocket daemons, headunit process, and castscreen receiver
killall -q -9 headunit
pkill cs_receiver_arm
pkill websocketd
rm -rf /jci/gui/addon-common && log_message "==========**************** Removed addon-common **************==========="

if grep -Fq "input_filter" /jci/sm/sm.conf
then
  sed -i '/input_filter/d' /jci/sm/sm.conf
  log_message "========********* input_filter removed from sm.conf. ************========"
fi
rm -rf /tmp/mnt/data_persist/dev/androidauto
rm -rf /tmp/mnt/data_persist/dev/bin/headunit*
rm -rf /tmp/mnt/data_persist/dev/headunit*
rm -rf /tmp/mnt/data_persist/dev/system_restore
rm -rf /jci/gui/addon-player
rm -rf /jci/gui/addon-speedometer
rm -rf /jci/gui/speedometer
rm -rf /jci/gui/apps/_speedometer
rm -rf /jci/gui/apps/_videoplayer
rm -rf /jci/gui/apps/_aiotweaks
rm -rf /jci/gui/apps/_androidauto
rm -rf /jci/gui/apps/_mzdmeter
rm -f /jci/opera/opera_dir/userjs/mySpeedometer*
rm -f /jci/opera/opera_dir/userjs/speedometer*
rm -f /jci/opera/opera_dir/userjs/*-startup.*
rm -f /jci/opera/opera_dir/userjs/additionalApps.*
rm -f /jci/opera/opera_dir/userjs/aio*
rm -f /jci/scripts/get-gps-data*
rm -f /jci/scripts/get-log-data*
rm -f /jci/scripts/get-vehicle-data-other*
rm -f /jci/scripts/get-vehicle-gear*
rm -f /jci/scripts/get-vehicle-speed*
rm -f /jci/scripts/wait_adb_arm.sh
rm -f /jci/scripts/adb
rm -f /jci/scripts/cs_receiver_arm
rm -f /jci/scripts/cs_receiver_conn_arm
rm -f /jci/scripts/mirroring.sh
rm -f /tmp/mnt/data_persist/dev/bin/flac-usb-recover
rm -f /tmp/mnt/data_persist/dev/bin/websocketd
rm -f /tmp/mnt/data_persist/dev/bin/aaserver
rm -f /tmp/mnt/data_persist/dev/bin/input_filter
rm -f /tmp/mnt/data_persist/dev/bin/check-usb.sh
rm -f /tmp/mnt/data_persist/dev/bin/usb-allow.list
rm -f /tmp/mnt/data/enable_input_filter
rm -f /tmp/mnt/data/input_filter
rm -f /usr/lib/gstreamer-0.10/libgsth264parse.so
rm -f ${STAGE_WIFI}.*
# if [ -e /usr/lib/gstreamer-0.10/libgstalsa.so.org ]
# then
# 		cp -a /usr/lib/gstreamer-0.10/libgstalsa.so.org /usr/lib/gstreamer-0.10/libgstalsa.so
# 	  cmp --silent ${MYDIR}/config_org/androidauto/usr/lib/gstreamer-0.10/libgstalsa.so /usr/lib/gstreamer-0.10/libgstalsa.so.org || cp -a ${MYDIR}/config_org/androidauto/usr/lib/gstreamer-0.10/libgstalsa.so /usr/lib/gstreamer-0.10/
# 		log_message "=======*************  Restored libgstalsa.so            ********========"
# 		rm -f /usr/lib/gstreamer-0.10/libgstalsa.so.org
# 		/bin/fsync /usr/lib/gstreamer-0.10/libgstalsa.so
# fi
echo "#!/bin/sh" > ${STAGE_WIFI}
# if (restore_full /jci/scripts/jci-fw.sh)
# then
#   log_message "===========************* jci-fw.js RESTORED ****************============="
# fi
show_message "RESTORE ALL INFOTAINMENT COLORS AND IMAGES\n(BACK TO RED) ..."
cp -a ${MYDIR}/config_org/safety-warning-reverse-camera/jci/nativegui/images /jci/nativegui
log_message "=======******* SAFETY WARNING FROM REVERSE CAMERA RESTORED *******======="
cp -a ${MYDIR}/config_org/transparent-parking-sensor/jci/nativegui/images  /jci/nativegui
log_message "===========********* PARKING SENSOR GRAPHICS RESTORED **********========="
cp -a "${MYDIR}/config_org/blank-album-art-frame/jci/gui/common/controls/InCall2/images/NowPlayingImageFrame.png" /jci/gui/common/controls/InCall2/images
cp -a "${MYDIR}/config_org/blank-album-art-frame/jci/gui/common/controls/NowPlaying4/images/NowPlayingImageFrame.png" /jci/gui/common/controls/NowPlaying4/images
cp -a "${MYDIR}/config_org/blank-album-art-frame/jci/gui/common/images/no_artwork_icon.png" /jci/gui/common/images
log_message "===========*********** BLANK ALBUM ART FRAME RESTORED ***********========"
if [ -e ${MYDIR}/config/color-schemes/Red/jci/ ]
then
  log_message "===**** RESTORE INFOTAINMENT COLORS AND IMAGES (BACK TO RED) ... *****==="
  cp -a ${MYDIR}/config/color-schemes/Red/jci /

  if [ -e /jci/nng/ux/_skin_jci_bluedemo.zip ]
  then
    rm -f /jci/nng/ux/_skin_jci_bluedemo.zip
    log_message "=======********* Deleted blue color scheme for NAV App **********========"
  fi
  rm -f /jci/gui/common/images/blue.aio
  rm -f /jci/gui/common/images/green.aio
  rm -f /jci/gui/common/images/orange.aio
  rm -f /jci/gui/common/images/pink.aio
  rm -f /jci/gui/common/images/purple.aio
  rm -f /jci/gui/common/images/silver.aio
  rm -f /jci/gui/common/images/yellow.aio
fi
cp -a "${MYDIR}/config_org/background.png" /jci/gui/common/images
log_message "============******** RESTORED ORIGINAL BACKGROUND ***********============"
mount -o rw,remount /tmp/mnt/resources
sleep 2
rm -rf /tmp/mnt/resources/aio
# uninstall CASDK
if [ -e /jci/casdk/casdk.aio ]
then
  show_message "===****** UNINSTALLING CASDK ******==="
  log_message "==========************ BEGIN UNINSTALLING CASDK ************==========="

  # kill all watch processes
  pkill -f watch
  pkill -f 'watch -n 1'
  pkill -f 'watch -n 60'
  pkill -f 'watch -n 300'
  pkill -f 'mzd-casdk.start'
  rm -rf /jci/casdk /jci/gui/apps/custom
  rm -f /jci/opera/opera_dir/userjs/CustomApplicationsProxy.js /jci/opera/opera_dir/userjs/nativeApps.js
  log_message "==========************ Removing watch processes ************==========="

  # reset storage
  if [ -e /tmp/mnt/data_persist/storage ]
  then
    rm -rf /tmp/mnt/data_persist/storage
    log_message "==========************ Removing storage folder *************==========="
  fi
  if [ -e /jci/opera/opera_home/pstorage/psindex.dat ]
  then
    if [ -f /jci/opera/opera_home/pstorage/psindex.dat.org ]
    then
      cp -a /jci/opera/opera_home/pstorage/psindex.dat.org /jci/opera/opera_home/pstorage/psindex.dat
      rm /jci/opera/opera_home/pstorage/psindex.dat.org
      log_message "==========********* Removing local storage settings ********==========="
    else
      rm -rf /jci/opera/opera_home/pstorage
      log_message "======***** Removing local storage settings and pstorage ********======"
    fi
  fi

fi
log_message "************************* SYSTEM FULLY RESTORED *************************"
show_message "========== SYSTEM FULLY RESTORED =========="

# a window will appear before the system reboots automatically
sleep 3
killall -q jci-dialog
/jci/tools/jci-dialog --info --title="SYSTEM FULLY RESTORED" --text="THE SYSTEM WILL REBOOT IN A FEW SECONDS!" --no-cancel &
sleep 10
killall -q jci-dialog
reboot
