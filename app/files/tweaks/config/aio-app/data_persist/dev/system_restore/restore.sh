#!/bin/sh
# restore.sh - MZD-AIO-TI Version 2.7.9
# The Full Restore script for the AIO Tweaks app
# For more information visit http://mazdatweaks.com
# By Trezdog44 - Trevelopment.com

# Time
hwclock --hctosys

# AIO Variables
AIO_VER=0.7
AIO_DATE=2018.06.01

# TO DELETE ALL BACKUP FILES CHENGE DEL_BAKUPS=0 TO DEL_BAKUPS=1
DEL_BAKUPS=0

timestamp()
{
  date +"%D %T"
}
get_cmu_sw_version()
{
  _ver=$(grep "^JCI_SW_VER=" /jci/version.ini | sed 's/^.*_\([^_]*\)\"$/\1/')
  _patch=$(grep "^JCI_SW_VER_PATCH=" /jci/version.ini | sed 's/^.*\"\([^\"]*\)\"$/\1/')
  _flavor=$(grep "^JCI_SW_FLAVOR=" /jci/version.ini | sed 's/^.*_\([^_]*\)\"$/\1/')

  if [ ! -z "${_flavor}" ]; then
    echo "${_ver}${_patch}-${_flavor}"
  else
    echo "${_ver}${_patch}"
  fi
}
get_cmu_ver()
{
  _ver=$(grep "^JCI_SW_VER=" /jci/version.ini | sed 's/^.*_\([^_]*\)\"$/\1/' | cut -d '.' -f 1)
  echo ${_ver}
}
compatibility_check()
{
  # Compatibility check falls into 5 groups:
  # 59.00.5XX ($COMPAT_GROUP=5) When it is cracked 500+ will be compatible
  # 59.00.4XX ($COMPAT_GROUP=4)
  # 59.00.3XX ($COMPAT_GROUP=3)
  # 58.00.XXX ($COMPAT_GROUP=2)
  # 55.00.XXX - 56.00.XXX ($COMPAT_GROUP=1)
  _VER=$(get_cmu_ver)
  _VER_EXT=$(grep "^JCI_SW_VER=" /jci/version.ini | sed 's/^.*_\([^_]*\)\"$/\1/' | cut -d '.' -f 3)
  _VER_MID=$(grep "^JCI_SW_VER=" /jci/version.ini | sed 's/^.*_\([^_]*\)\"$/\1/' | cut -d '.' -f 2)
  if [ $_VER_MID -ne "00" ] # Only development versions have numbers other than '00' in the middle
  then
    echo 0 && return
  fi
  if [ $_VER -eq 55 ] || [ $_VER -eq 56 ]
  then
    echo 1 && return
  elif [ $_VER -eq 58 ]
  then
    echo 2 && return
  elif [ $_VER -eq 59 ]
  then
    if [ $_VER_EXT -lt 400 ] # v59.00.300-400
    then
      echo 3 && return
    elif [ $_VER_EXT -lt 500 ] # v59.00.400-500
    then
      echo 4 && return
    elif [ $_VER_EXT -eq 502 ]
    then
      echo 5 && return # 59.00.502 is another level because it is not compatible with USB Audio Mod
    else
      echo 0 && return
    fi
  else
    echo 0
  fi
}
log_message()
{
  echo "$*" 1>&2
  echo "$*" >> /tmp/root/AIO_log.txt
  /bin/fsync /tmp/root/AIO_log.txt
}
show_message()
{
  sleep 5
  killall jci-dialog
  #	log_message "= POPUP: $* "
  /jci/tools/jci-dialog --info --title="AIO TWEAKS v.${AIO_VER}" --text="$*" --no-cancel &
}
show_message_OK()
{
  sleep 4
  killall jci-dialog
  #	log_message "= POPUP: $* "
  /jci/tools/jci-dialog --confirm --title="AIO TWEAKS SYSTEM RESTORE" --text="$*" --ok-label="YES - GO ON" --cancel-label="NO - ABORT"
  if [ $? != 1 ]
  then
    killall jci-dialog
    return
  else
    log_message "********************* INSTALLATION ABORTED *********************"
    show_message "SYSTEM RESTORE ABORTED!"
    sleep 10
    killall jci-dialog
	mount -o ro,remount /
    exit 0
  fi
}

# disable watchdog and allow write access
echo 1 > /sys/class/gpio/Watchdog\ Disable/value
mount -o rw,remount /

MYDIR=$(dirname "$(readlink -f "$0")")
CMU_VER=$(get_cmu_ver)
CMU_SW_VER=$(get_cmu_sw_version)
COMPAT_GROUP=$(compatibility_check)
rm -f /tmp/root/AIO_log.txt

log_message "========================================================================="
log_message "=======================   START LOGGING TWEAKS...  ======================"
log_message "======================= AIO v.${AIO_VER}  -  ${AIO_DATE} ======================"
log_message "======================= CMU_SW_VER = ${CMU_SW_VER} ======================"
log_message "=======================  COMPATIBILITY_GROUP  = ${COMPAT_GROUP} ======================="
#log_message "======================== CMU_VER = ${CMU_VER} ====================="
log_message ""
log_message "=======================   MYDIR = ${MYDIR}    ======================"
log_message "==================      DATE = $(timestamp)        ================="

show_message "==== AIO Tweaks  v${AIO_VER} ====\n==== System Restore ===="

# first test, if copy from MZD to usb drive is working to test correct mount point
cp /jci/gui/common/images/FullTransparent.png "${MYDIR}"
if [ -e "${MYDIR}/FullTransparent.png" ]
then
  log_message "===         Copytest successful, mount point is OK         ==="
  log_message " "
  rm -f "${MYDIR}/FullTransparent.png"
else
  log_message "===     Copytest to sd card not successful, mount point not found!    ==="
  /jci/tools/jci-dialog --title="ERROR!" --text="Mount point not found, have to reboot again" --ok-label='OK' --no-cancel &
  sleep 5
  reboot
fi


show_message_OK "AIO TWEAKS v.${AIO_VER} FULL SYSTEM RESTORE\nALL TWEAKS WILL BE REMOVED EXCEPT COLOR THEME\nALL AIO APPS *INCLUDING THIS ONE* WILL BE UNINSTALLED\n\nTO RESTORE SYSTEM COLOR SCHEME, USE MZD-AIO-TI"

# a window will appear for 4 seconds to show the beginning of installation
show_message "AIO TWEAKS SYSTEM RESTORE\nBy: Trezdog44\n(This and the following message popup windows\n DO NOT have to be confirmed with OK)\nLets Go!"

log_message "*************************************************************************"
log_message "********************* BEGIN FULL SYSTEM RESTORE *************************"
log_message "*************************************************************************"
log_message " "
show_message "DISABLE TOUCHSCREEN WHILE DRIVING ..."
log_message "=====********* UNINSTALL REMOVE TOUCHSCREEN RESTRICTION ... *********===="
/jci/scripts/set_lvds_speed_restriction_config.sh enable
/jci/scripts/set_speed_restriction_config.sh enable
log_message "===               Touchscreen Speed Restriction Enabled               ==="

log_message "======*** END UNINSTALLATION OF REMOVE TOUCHSCREEN RESTRICTION ***======="
log_message " "
# restore data.zip back to original
if [ -e /jci/nng/data.zip.org ]
then
	# remove speedcam patch and speedcam.txt
	show_message "REMOVE SPEEDCAM PATCH AND SPEEDCAM.TXT ..."
	log_message "===******      UNINSTALL SPEEDCAM PATCH AND SPEEDCAM.TXT ...    ******==="
	log_message "===              Original data.zip is available as backup             ==="
	cp -a /jci/nng/data.zip.org /jci/nng/data.zip
	log_message "===               Renamed data.zip.org back to data.zip               ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/nng/data.zip.org
		log_message "===                 Deleted backup: data.zip.org                      ==="
	fi
	chmod 755 /jci/nng/data.zip
fi
# restore jci-linux_imx6_volans-release back to original
if [ -e /jci/nng/jci-linux_imx6_volans-release.org ]
then
	mv /jci/nng/jci-linux_imx6_volans-release.org /jci/nng/jci-linux_imx6_volans-release
	show_message "RESTORED JCI-LINUX_IMX6_VOLANS-RELEASE BACK TO ORIGINAL"
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/nng/jci-linux_imx6_volans-release.org
		log_message "===       Deleted backup: jci-linux_imx6_volans-release.org           ==="
	fi
	chmod 755 /jci/nng/jci-linux_imx6_volans-release
fi
rm -f /jci/nng/2
if [ -e /mnt/sd_nav/content/speedcam ]
then
	#	cp -a /mnt/sd_nav/content/speedcam/speedcam.txt ${MYDIR}
	#	log_message "=== Copied speedcam.txt to USB ==="
	#	rm -f /mnt/sd_nav/content/speedcam/speedcam.txt
	#	rm -f /mnt/sd_nav/content/speedcam/speedcam.spdb
	log_message "***Remove speedcam.txt and speedcam.spdb from SD card to complete uninstalation of speedcam patch***"
	log_message "===***** END UNINSTALLATION OF SPEEDCAM PATCH AND SPEEDCAM.TXT  ******==="
	log_message " "
fi

# remove track-order and FLAC support
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
#		log_message "===         Deleted backup: libmc_user.so.org              ==="
#	fi
#	log_message "===*** END UNINSTALLATION OF TRACK-ORDER AND FLAC SUPPORT ***==="
#	log_message " "
#fi

# restore systemApp.js
if [ -e /jci/gui/apps/system/js/systemApp.js.org ]
then
	show_message "RESTORE DISCLAIMER & ORDER OF AUDIO SOURCE LIST ..."
	log_message "===*** UNINSTALL NO-MORE-DISCLAIMER & ORDER OF AUDIO SOURCE LIST...***==="
	cp -a /jci/gui/apps/system/js/systemApp.js.org /jci/gui/apps/system/js/systemApp.js
	log_message "===                  Restored systemApp.js from backup                ==="
	rm -f /jci/gui/apps/system/js/systemApp.js.audio
	rm -f /jci/gui/apps/system/js/systemApp.js.disclaimer
	log_message "===   Removed systemApp.js.audio and systemApp.js.disclaimer flags    ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/apps/system/js/systemApp.js.org
		log_message "===               Deleted backup: systemApp.js.org                    ==="
	fi
	log_message "=====**********  END UNINSTALLATION OF NO-MORE-DISCLAIMER *********======"
	log_message "=====***************  AND ORDER OF AUDIO SOURCE LIST   ************======"
	log_message " "
fi

# restore MainMenuCtrl.js
if [ -e /jci/gui/apps/system/controls/MainMenu/js/MainMenuCtrl.js.org ]
then
	# remove main menu loop
	show_message "REMOVE MAIN-MENU-LOOP  ..."
	log_message "============********** UNINSTALL MAIN-MENU-LOOP ... ********============="
	cp -a /jci/gui/apps/system/controls/MainMenu/js/MainMenuCtrl.js.org /jci/gui/apps/system/controls/MainMenu/js/MainMenuCtrl.js
	log_message "===          Restored Original MainMenuCtrl.js From Backup            ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/apps/system/controls/MainMenu/js/MainMenuCtrl.js.org
		log_message "===               Deleted backup: MainMenuCtrl.js.org                 ==="
	fi
	log_message "========******** END UNINSTALLATION OF MAIN-MENU-LOOP ***********========"
	log_message " "
fi

# restore List2Ctrl.js
if [ -e /jci/gui/common/controls/List2/js/List2Ctrl.js.org ]
then
	show_message "REMOVE LIST_LOOP_MOD  ..."
	log_message "=========********      UNINSTALL LIST_LOOP_MOD ...       *********======="
	cp -a /jci/gui/common/controls/List2/js/List2Ctrl.js.org /jci/gui/common/controls/List2/js/List2Ctrl.js
	log_message "===                Restored List2Ctrl.js from backup                  ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/common/controls/List2/js/List2Ctrl.js.org
		log_message "===               Deleted backup: List2Ctrl.js.org                    ==="
	fi
	log_message "======*******      END UNINSTALLATION OF LIST_LOOP_MOD      *******======"
	log_message " "
fi


#remove diagmenu with 1 sec. press at clock in display settings menu, script made by Sumire_Racing_JPN
if [ -e /jci/gui/apps/diag/js/diagApp.js.org2 ]
then
	show_message "REMOVE DIAGMENU W. 1 SEC. PRESS AT CLOCK \nIN DISPLAY SETTINGS MENU"
	log_message "===**** UNINSTALL DIAGMENU AT CLOCK IN DISPLAY SETTINGS MENU ... *****==="
	cp -a /jci/gui/apps/diag/js/diagApp.js.org2 /jci/gui/apps/diag/diagApp.js
elif [ -e /jci/gui/apps/diag/js/diagApp.js.org ]
then
	show_message "REMOVE DIAGMENU W. 1 SEC. PRESS AT CLOCK \nIN DISPLAY SETTINGS MENU"
	log_message "===**** UNINSTALL DIAGMENU AT CLOCK IN DISPLAY SETTINGS MENU ... *****==="
	cp -a /jci/gui/apps/diag/js/diagApp.js.org /jci/gui/apps/diag/diagApp.js
fi
if [ -e /jci/gui/apps/diag/js/diagApp.js.org ] || [ -e /jci/gui/apps/diag/js/diagApp.js.org2 ]
then
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/apps/diag/js/diagApp.js.org
		rm -f /jci/gui/apps/diag/js/diagApp.js.org2
		log_message "===                 Deleted backup:  diagApp.js.org                   ==="
	fi
fi
if [ -e /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org2 ]
then
	if ! grep formatDateCustom /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org2
	then
		cp -a /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org2 /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js
	fi
	rm -f /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org2
fi
if [ -e /jci/gui/common/js/Common.js.org2 ]
then
	if ! grep "isMuted \? \"Global.Pause\" : \"Global.Resume\");" /jci/gui/common/js/Common.js.org2
	then
		cp -a /jci/gui/common/js/Common.js.org2  /jci/gui/common/js/Common.js.org
	fi
	rm -f /jci/gui/common/js/Common.js.org2
fi
# remove pause on mute
if [ -e /jci/gui/common/js/Common.js.org ]
then
	show_message "REMOVE PAUSE_ON_MUTE  ..."
	log_message "===========*********** UNINSTALL PAUSE_ON_MUTE ... **********============"
	if ! grep "Sumire Racing" /jci/gui/common/js/Common.js.org
	then
		cp -a /jci/gui/common/js/Common.js.org  /jci/gui/common/js/Common.js
	else
		rm -f /jci/gui/common/js/Common.js.org
	fi
	cp -a /jci/gui/common/js/Common.js.org /jci/gui/common/js/Common.js
	log_message "===                 Common.js Restored From Backup                    ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/common/js/Common.js.org
		log_message "===                  Deleted backup: Common.js.org                    ==="
	fi
	log_message "========********** END UNINSTALLATION OF PAUSE-ON-MUTE **********========"
	log_message " "
fi
sed -i 's/"settleTime" : 1000,/"settleTime" : 20000,/g' /jci/gui/apps/diag/js/diagApp.js
sed -i '/Sumire Racing/d' /jci/gui/common/js/Common.js
sed -i 's/"holdTimeout" : 1000,/"holdTimeout" : 5000,/g' /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js

# restore background image and common.css to original
if [ -e /jci/gui/common/css/common.css.org ]
then
	show_message "UNINSTALL BACKGROUND ROTATOR ..."
	log_message "========**********    UNINSTALL BACKGROUND ROTATOR ...    *******========"
	cp -a /jci/gui/common/css/common.css.org /jci/gui/common/css/common.css
	log_message "===         Restored /jci/gui/common/css/common.css from backup       ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/common/css/common.css.org
		log_message "===               Deleted backup: common.css.org                      ==="
	fi
	log_message "=====*********** END UNINSTALLATION OF BACKGROUND ROTATOR **********====="
	log_message " "
fi
# restore message replies
if [ -e /jci/settings/configurations/blm_msg-system.xml.org ]
then
	show_message "RESTORE MESSAGE REPLIES ..."
	log_message "=========********* UNINSTALL REMOVE MESSAGE REPLIES ... ********========="
	cp -a /jci/settings/configurations/blm_msg-system.xml.org /jci/settings/configurations/blm_msg-system.xml
	log_message "===    Message Replies Restored From Backup blm_msg-system.xml.org    ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/settings/configurations/blm_msg-system.xml.org
		log_message "===             Deleted backup: blm_msg-system.xml.org                ==="
	fi
	log_message "=====******** END UNINSTALLATION OF REMOVE MESSAGE REPLIES ********======"
	log_message " "
fi

# restore boot animation
if [ -e /jci/resources/LoopLogo.ivf.org ]
then
	show_message "RESTORE BOOT ANIMATION ..."
	log_message "========********   UNINSTALL DISABLE BOOT ANIMATION ...  ********========"
	cp -a /jci/resources/LoopLogo.ivf.org /jci/resources/LoopLogo.ivf
	log_message "===           Restored original /jci/resources/LoopLogo.ivf           ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/resources/LoopLogo.ivf.org
		log_message "===                  Deleted backup: LoopLogo.ivf.org                 ==="
	fi
fi
if [ -e /jci/resources/ExitLogo.ivf.org ]
then
	cp -a /jci/resources/ExitLogo.ivf.org /jci/resources/ExitLogo.ivf
	log_message "===           Restored original /jci/resources/ExitLogo.ivf           ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/resources/ExitLogo.ivf.org
		log_message "===                 Deleted backup: ExitLogo.ivf.org                  ==="
	fi
fi
if [ -e /jci/resources/TranLogo.ivf.org ]
then
	cp -a /jci/resources/TranLogo.ivf.org /jci/resources/TranLogo.ivf
	log_message "===           Restored original /jci/resources/TranLogo.ivf           ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/resources/TranLogo.ivf.org
		log_message "===              Deleted backup: TranLogo.ivf.org                     ==="
	fi
fi
if [ -e /jci/resources/TranLogoEnd.ivf.org ]
then
	cp -a /jci/resources/TranLogoEnd.ivf.org /jci/resources/TranLogoEnd.ivf
	log_message "===         Restored original /jci/resources/TranLogoEnd.ivf          ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/resources/TranLogoEnd.ivf.org
		log_message "===             Deleted backup: TranLogoEnd.ivf.org                   ==="
	fi
	log_message "======******** END UNINSTALLATION OF DISABLE BOOT ANIMATION  ******======"
	log_message " "
fi
# remove Date_to_Statusbar mod
if [ -e /jci/gui/common/controls/Sbn/css/SbnCtrl.css.org ]
then
	show_message "REMOVE STATUSBAR TWEAKS ..."
	log_message "=======*********    UNINSTALL STATUSBAR TWEAKS ...     **********========"
	cp -a /jci/gui/common/controls/Sbn/css/SbnCtrl.css.org /jci/gui/common/controls/Sbn/css/SbnCtrl.css
	log_message "===              Restored backup from SbnCtrl.css.org                 ==="
	rm -f /jci/gui/common/controls/Sbn/css/SbnCtrl.all.css
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/common/controls/Sbn/css/SbnCtrl.css.org
		log_message "===               Deleted backup: SbnCtrl.css.org                     ==="
	fi
fi
if [ -e /jci/gui/common/controls/StatusBar/css/StatusBarCtrl.css.org ]
then
	cp -a /jci/gui/common/controls/StatusBar/css/StatusBarCtrl.css.org /jci/gui/common/controls/StatusBar/css/StatusBarCtrl.css
	log_message "===            Restored backup from StatusBarCtrl.css.org             ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/common/controls/StatusBar/css/StatusBarCtrl.css.org
		log_message "===              Deleted backup: StatusBarCtrl.css.org                ==="
	fi
fi
if [ -e /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org ]
then
  # make sure the backup does not have date entries from a bug in AIO v1.x
	if grep formatDateCustom /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org
	then
    log_message "===           Repairing backup file StatusBarCtrl.js.org             ==="
    sed -i '/this.date/d' /jci/gui/common/controls/StatusBar/css/StatusBarCtrl.js.org
  fi
  cp -a /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js
  log_message "===             Restored backup from StatusBarCtrl.js.org             ==="
  if [ $DEL_BAKUPS -eq 1 ]
  then
    rm -f /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js.org
    log_message "===             Deleted backup: StatusBarCtrl.js.org                  ==="
  fi
else
  # in this scenerio we need to repair StatusBarCtrl.js since there is no backup file
  # but there is leftover code from date2statusbar because of a bug in AIO 1.x
  if grep formatDateCustom /jci/gui/common/controls/StatusBar/js/StatusBarCtrl.js
  then
    log_message "===               Repairing file StatusBarCtrl.js                     ==="
    sed -i '/this.date/d' /jci/gui/common/controls/StatusBar/css/StatusBarCtrl.js
  fi
fi
if [ -e /jci/gui/common/controls/StatusBar/images/StatusBarBg.png.org ]
then
	cp -a /jci/gui/common/controls/StatusBar/images/StatusBarBg.png.org /jci/gui/common/controls/StatusBar/images/StatusBarBg.png
	log_message "===               Restored backup from StatusBarBg.png.org            ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/common/controls/StatusBar/images/StatusBarBg.png.org
		log_message "===               Deleted backup: StatusBarBg.png.org                 ==="
	fi
fi
if [ -e /jci/gui/framework/js/Utility.js.org ]
then
	cp -a /jci/gui/framework/js/Utility.js.org /jci/gui/framework/js/Utility.js
	log_message "===                Restored backup from Utility.js.org                ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/framework/js/Utility.js.org
		log_message "===                Deleted backup: Utility.js.org                     ==="
	fi
	log_message "=====*********    END UNINSTALLATION OF STATUSBAR TWEAKS     *******====="
	log_message " "
fi
# restore button background graphics
if [ -e /jci/gui/common/controls/Ump3/css/Ump3Ctrl.css.org ]
then
	show_message "RESTORE BUTTON BACKGROUND GRAPHICS ..."
	log_message "======*********  UNINSTALL NO BUTTON BACKGROUND GRAPHICS ... ******======"
	cp -a /jci/gui/common/controls/Ump3/css/Ump3Ctrl.css.org /jci/gui/common/controls/Ump3/css/Ump3Ctrl.css
	log_message "===            Restored Ump3Ctrl.css from backup                      ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/common/controls/Ump3/css/Ump3Ctrl.css.org
		log_message "===                Deleted backup: Ump3Ctrl.css.org                   ==="
	fi
	log_message "=====********* END UNINSTALLATION OF NO BUTTON BACKGROUND *******========"
	log_message " "
fi
# Restore Backgounds that were changed prior to AIO v2.1
if [ -e /jci/gui/common/controls/Ump3/images/UMP_Bg.png.org ]
then
	rm -f /jci/gui/common/controls/Ump3/images/UMP_Bg.png
	mv /jci/gui/common/controls/Ump3/images/UMP_Bg.png.org /jci/gui/common/controls/Ump3/images/UMP_Bg.png
	log_message "===                  Restored Original UMP_Bg.png                     ==="
	if [ -e /jci/gui/common/controls/Ump3/images/UMP_Bg_Arch.png.org ]
	then
		rm -f /jci/gui/common/controls/Ump3/images/UMP_Bg_Arch.png
		mv /jci/gui/common/controls/Ump3/images/UMP_Bg_Arch.png.org /jci/gui/common/controls/Ump3/images/UMP_Bg_Arch.png
		log_message "===                Restored Original UMP_Bg_Arch.png                  ==="
		if [ -e /jci/gui/common/controls/Ump3/images/UMP_Btn_Separator.png.org ]
		then
			rm -f /jci/gui/common/controls/Ump3/images/UMP_Btn_Separator.png
			mv /jci/gui/common/controls/Ump3/images/UMP_Btn_Separator.png.org /jci/gui/common/controls/Ump3/images/UMP_Btn_Separator.png
			log_message "===              Restored Original UMP_Btn_Separator.png              ==="
		fi
	fi
fi
# UI Style Tweaks
if [ -e /jci/gui/common/controls/List2/css/List2Ctrl.css.org ]
then
	show_message "UNINSTALL USER INTERFACE TEXT STYLE TWEAKS ..."
	log_message "========********    UNINSTALL UI TEXT STYLE TWEAKS ...   ********========"
	cp -a /jci/gui/common/controls/List2/css/List2Ctrl.css.org /jci/gui/common/controls/List2/css/List2Ctrl.css
	log_message "===             Restored backup from List2Ctrl.css.org                ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/common/controls/List2/css/List2Ctrl.css.org
		log_message "===                  Deleted backup: List2Ctrl.css.org                ==="
	fi
fi
if [ -e /jci/gui/common/controls/NowPlaying4/css/NowPlaying4Ctrl.css.org ]
then
	cp -a /jci/gui/common/controls/NowPlaying4/css/NowPlaying4Ctrl.css.org /jci/gui/common/controls/NowPlaying4/css/NowPlaying4Ctrl.css
	log_message "===         Restored backup from NowPlaying4Ctrl.css.org              ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/common/controls/NowPlaying4/css/NowPlaying4Ctrl.css.org
		log_message "===              Deleted backup: NowPlaying4Ctrl.css.org              ==="
	fi
fi
if [ -e /jci/gui/apps/system/controls/MainMenu/css/MainMenuCtrl.css.org ]
then
	cp -a /jci/gui/apps/system/controls/MainMenu/css/MainMenuCtrl.css.org /jci/gui/apps/system/controls/MainMenu/css/MainMenuCtrl.css
	log_message "===           Restored backup from MainMenuCtrl.css.org               ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/apps/system/controls/MainMenu/css/MainMenuCtrl.css.org
		log_message "===               Deleted backup: MainMenuCtrl.css.org                ==="
	fi
	log_message "=====*****    END UNINSTALLATION OF UI TEXT STYLE TWEAKS ...   *****====="
	log_message " "
fi
# FuelConsumptionTweak
if [ -e /jci/gui/apps/ecoenergy/controls/FuelConsumption/css/FuelConsumptionCtrl.css.org ]
then
	show_message "REMOVE FUEL CONSUMPTION TWEAK  ..."
	log_message "========********* UNINSTALL FUEL CONSUMPTION TWEAK  ... *********========"
	cp -a /jci/gui/apps/ecoenergy/controls/FuelConsumption/css/FuelConsumptionCtrl.css.org /jci/gui/apps/ecoenergy/controls/FuelConsumption/css/FuelConsumptionCtrl.css
	log_message "===        Restored original FuelConsumptionCtrl.css from backup      ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/apps/ecoenergy/controls/FuelConsumption/css/FuelConsumptionCtrl.css.org
		log_message "===            Deleted backup: FuelConsumptionCtrl.css.org            ==="
	fi
fi
if [ -e /jci/gui/apps/ecoenergy/controls/FuelConsumption/images/FuelConsBG.png.org ]
then
	cp -a /jci/gui/apps/ecoenergy/controls/FuelConsumption/images/FuelConsBG.png.org /jci/gui/apps/ecoenergy/controls/FuelConsumption/images/FuelConsBG.png
	log_message "===        Restored original FuelConsumptionCtrl.png from backup      ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/apps/ecoenergy/controls/FuelConsumption/images/FuelConsBG.png.org
		log_message "===                 Deleted backup: FuelConsBG.png.org                ==="
	fi
fi
if [ -e /jci/gui/apps/ecoenergy/controls/FuelConsumption/js/FuelConsumptionCtrl.js.org ]
then
	cp -a /jci/gui/apps/ecoenergy/controls/FuelConsumption/js/FuelConsumptionCtrl.js.org /jci/gui/apps/ecoenergy/controls/FuelConsumption/js/FuelConsumptionCtrl.js
	log_message "===          Restored original FuelConsBG.png from backup             ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/apps/ecoenergy/controls/FuelConsumption/js/FuelConsumptionCtrl.js.org
		log_message "===              Deleted backup: FuelConsumptionCtrl.js.org           ==="
	fi
	log_message "=======******* END UNINSTALLATION OF FUEL CONSUMPTION TWEAK *******======"
	log_message " "
fi
# change off screen background image
if [ -e /jci/gui/apps/system/controls/OffScreen/images/OffScreenBackground.png.org ]
then
	show_message "REVERTING OFF SCREEN BACKGROUND IMAGE ..."
	log_message "========******* UNINSTALL OFF SCREEN BACKGROUND IMAGE ... *******========"
	cp -a /jci/gui/apps/system/controls/OffScreen/images/OffScreenBackground.png.org /jci/gui/apps/system/controls/OffScreen/images/OffScreenBackground.png
	log_message "===       Reverting From Backup OffScreenBackground.png.org           ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/apps/system/controls/OffScreen/images/OffScreenBackground.png.org
		log_message "===            Deleted backup: OffScreenBackground.png.org            ==="
	fi
	log_message "=====****** END UNINSTALLATION OF OFF SCREEN BACKGROUND IMAGE ******====="
	log_message " "
fi

if [ -e /jci/gui/apps/usbaudio/js/usbaudioApp.js.org ]
then
	log_message "==========************ UNINSTALL USB AUDIO MOD ... ************=========="
	cp -a /jci/gui/apps/usbaudio/js/usbaudioApp.js.org /jci/gui/apps/usbaudio/js/usbaudioApp.js
	log_message "=== /jci/gui/apps/usbaudio/js/usbaudioApp.js Restored from backup     ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f  /jci/gui/apps/usbaudio/js/usbaudioApp.js.org
		log_message "===               Deleted backup: usbaudioApp.js.org                  ==="
	fi
fi
if [ -e /jci/gui/common/controls/NowPlaying4/js/NowPlaying4Ctrl.js.org ]
then
	cp -a /jci/gui/common/controls/NowPlaying4/js/NowPlaying4Ctrl.js.org /jci/gui/common/controls/NowPlaying4/js/NowPlaying4Ctrl.js
	log_message "===                Restored NowPlaying4Ctrl.js from backup            ==="
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/gui/common/controls/NowPlaying4/js/NowPlaying4Ctrl.js.org
		log_message "===               Deleted backup: NowPlaying4Ctrl.js.org              ==="
	fi
	log_message "==========****** END UNINSTALLATION OF OFF USB AUDIO MOD ******=========="
	log_message " "
fi
# Remove patch to asound.conf from AA 1.03
SOUND_X=$(grep -c "tel_asymed" /etc/asound.conf)
if [ $SOUND_X -eq 1 ]; then
	# remove patch to /etc/asound.conf Bluetooth calling Bug is fixed
	log_message "===     Detected Bluetooth call patch in asound.conf reverting file   ==="
	if [ -e /etc/asound.conf.org ];	then
		if mv /etc/asound.conf.org /etc/asound.conf; then
			log_message "===     /etc/asound.conf reverted from backup /etc/asound.conf.org    ==="
		else
			log_message "===           Error removing patch from /etc/asound.conf              ==="
		fi
	fi
fi
# restore phoneApp if the pach was applied
if [ -e /jci/gui/apps/phone/js/phoneApp.js.org ]
then
  cp -a /jci/gui/apps/phone/js/phoneApp.js.org /jci/gui/apps/phone/js/phoneApp.js
  log_message "===                 Restored phoneApp.js From Backup                  ==="
  rm -f /jci/gui/apps/phone/js/phoneApp.js.org
  log_message "===                 Deleted backup: phoneApp.js.org                   ==="
fi
# Remove APPS
show_message "REMOVE VIDEOPLAYER - SPEEDOMETER \n ANDROID AUTO - CASTSCREEN \n & AIO TWEAKS APP FILES ..."
log_message "=======*********  UNINSTALL VIDEOPLAYER, SPEEDOMETER,    ********========"
log_message "=======*********  ANDROID AUTO & CASTSCREEN RECIEVER ... ********========"

### kills all WebSocket daemons
killall -q -9 headunit
pkill cs_receiver_arm
rm -rf /jci/gui/addon-common
log_message "===                   Removed /jci/gui/addon-common                   ==="

if grep -Fq "input_filter" /jci/sm/sm.conf
then
	sed -i '/input_filter/d' /jci/sm/sm.conf
	log_message "===               input_filter removed from sm.conf.                  ==="
fi

rm -fr /jci/gui/addon-player
rm -fr /jci/gui/addon-speedometer
rm -fr /jci/gui/speedometer
rm -fr /jci/gui/apps/_speedometer
rm -fr /jci/gui/apps/_mzdmeter
rm -fr /jci/gui/apps/_videoplayer
rm -fr /jci/gui/apps/_aiotweaks
rm -fr /jci/gui/apps/_androidauto
rm -fr /jci/gui/apps/_*
rm -f /jci/opera/opera_dir/userjs/aio*js
rm -f /jci/opera/opera_dir/userjs/addon-startup.js
rm -f /jci/opera/opera_dir/userjs/mySpeedometer*
rm -f /jci/opera/opera_dir/userjs/speedometer*
rm -f /jci/opera/opera_dir/userjs/*-startup.*
rm -f /jci/opera/opera_dir/userjs/additionalApps.*
rm -f /tmp/mnt/data/enable_input_filter
rm -f /tmp/mnt/data/input_filter
rm -f /tmp/mnt/data_persist/dev/bin/websocketd
rm -f /tmp/mnt/data_persist/dev/bin/headunit
rm -f /tmp/mnt/data_persist/dev/bin/aaserver
rm -f /tmp/mnt/data_persist/dev/bin/headunit-wrapper
rm -f /tmp/mnt/data_persist/dev/bin/input_filter
rm -fr /tmp/mnt/data_persist/dev/androidauto
rm -fr /tmp/mnt/data_persist/dev/headunit_libs
rm -fr /tmp/mnt/data_persist/dev/bin/headunit_libs
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
rm -f /jci/scripts/stage_wifi.sh.bak?
rm -f /jci/scripts/stage_wifi.sh.old
rm -f /jci/scripts/stage_wifi.sh.org
rm -f /jci/scripts/stage_wifi.sh.org2
rm -f /jci/scripts/stage_wifi.sh.org3
rm -f /jci/scripts/stage_wifi.sh.AA
rm -f /usr/lib/gstreamer-0.10/libgsth264parse.so

echo "#!/bin/sh" > /jci/scripts/stage_wifi.sh
if [ -e /jci/scripts/jci-fw.sh.org ]
then
	log_message "===               Restoring /jci/scripts/jci-fw.sh                    ==="
	cp -a /jci/scripts/jci-fw.sh.org /jci/scripts/jci-fw.sh
	if [ $DEL_BAKUPS -eq 1 ]
	then
		rm -f /jci/scripts/jci-fw.sh.org
		log_message "===                     Deleted backup: jci-fw.sh.org                 ==="
	fi
fi
log_message "=======************ END UNINSTALLATION OF VIDEOPLAYER ************======="
log_message "=======************* END UNISTALLATION OF SPEEDOMETER ************======="
log_message "=======********* END UNINSTALLATION OF CASTSCREEN-RECEIVER *******======="
log_message "=======*****  END UNINSTALLATION OF ANDROID AUTO HEADUNIT APP ****======="
log_message " "

# restore safety warning from reverse camera
#show_message "RESTORE SAFETY WARNING FROM REVERSE CAMERA ..."
#log_message "===***** UNINSTALL REMOVE SAFETY WARNING FROM REVERSE CAMERA ... *****==="

# Copy reverse camera safety warning images
#cp -a ${MYDIR}/config_org/safety-warning-reverse-camera/jci/nativegui/images/*.png /jci/nativegui/images/
#log_message "===              Reverse Camera Safety Warning Restored               ==="

#log_message "===*** END UNINSTALLATION OF REMOVE REVERSE CAMERA SAFETY WARNING  ***==="
#log_message " "

#log_message " "
#cp -a "${MYDIR}/config_org/blank-album-art-frame/jci/gui/common/controls/InCall2/images/NowPlayingImageFrame.png" /jci/gui/common/controls/InCall2/images
#cp -a "${MYDIR}/config_org/blank-album-art-frame/jci/gui/common/controls/NowPlaying4/images/NowPlayingImageFrame.png" /jci/gui/common/controls/NowPlaying4/images
#cp -a "${MYDIR}/config_org/blank-album-art-frame/jci/gui/common/images/no_artwork_icon.png" /jci/gui/common/images

cp -a "${MYDIR}/config_org/background.png" /jci/gui/common/images
log_message "============******** RESTORED ORIGINAL BACKGROUND ***********============"
log_message " "
# uninstall CASDK
if [ -e /jci/casdk/casdk.aio ]
then
  show_message "===****** UNINSTALLING CASDK ******==="
  log_message "==========************ BEGIN UNINSTALLING CASDK ************==========="
  log_message " "

  # mount resources
  mount -o rw,remount /tmp/mnt/resources

  # kill all watch processes
  log_message "- Removing watch processes"
  pkill -f watch
  pkill -f 'watch -n 1'
  pkill -f 'watch -n 60'
  pkill -f 'watch -n 300'
  pkill -f 'mzd-casdk.start'

  # reset storage
  if [ -e /tmp/mnt/data_persist/storage ]
  then
  	log_message "- Removing storage folder"
  	rm -rf /tmp/mnt/data_persist/storage
  fi
  if [ -e /jci/opera/opera_home/pstorage/psindex.dat ]
  then
    if [ -f /jci/opera/opera_home/pstorage/psindex.dat.org ]
    then
    	log_message "- Removing local storage settings"
      cp -a /jci/opera/opera_home/pstorage/psindex.dat.org /jci/opera/opera_home/pstorage/psindex.dat
    	rm /jci/opera/opera_home/pstorage/psindex.dat.org
    else
      log_message "- Removing local storage settings and pstorage"
      rm -rf /jci/opera/opera_home/pstorage
    fi
  fi

  # remove data reader files
  if [ -e /jci/casdk ]
  then
  	log_message "- Removing data script folder /jci/casdk"
  	rm /jci/casdk/*
  	rmdir --ignore-fail-on-non-empty /jci/casdk
  else
    log_message "- CASDK Data script folder '/jci/casdk' not found"
  fi

  # remove initialization file
  if grep -q "# CASDK" /jci/scripts/stage_wifi.sh
  then
    log_message "- Removing staging scripts"
    #	echo '#!/bin/sh' > /jci/scripts/stage_wifi.sh
    sed -i '/# CASDK/d' /jci/scripts/stage_wifi.sh
    sed -i '/casdk/d' /jci/scripts/stage_wifi.sh
    sed -i '/################/d' /jci/scripts/stage_wifi.sh
    sed -i '/# one time/d' /jci/scripts/stage_wifi.sh
    sed -i '/# 1s update/d' /jci/scripts/stage_wifi.sh
    sed -i '/# 60s update/d' /jci/scripts/stage_wifi.sh
    sed -i '/# 300s update/d' /jci/scripts/stage_wifi.sh
    sed -i '/mzd-casdk.start/d' /jci/scripts/stage_wifi.sh
  else
  	log_message "- No staging scripts fouund in /jci/scripts/stage_wifi.sh"
  fi

  # remove proxy
  if [ -f /jci/opera/opera_dir/userjs/CustomApplicationsProxy.js ]
  then
  	log_message "- Removing proxys & startups"
  	rm -f /jci/opera/opera_dir/userjs/CustomApplicationsProxy.js
  	rm -f /jci/opera/opera_dir/userjs/nativeApps.js
  fi

  if [ -f /jci/opera/opera_dir/userjs/additionalApps.js.org ]
  then
  	log_message "- Restoring additionalApps.js"
  	mv /jci/opera/opera_dir/userjs/additionalApps.js.org /jci/opera/opera_dir/userjs/additionalApps.js
  fi

  # delete custom
  if [ -e /jci/gui/apps/custom ]
  then
  	log_message "- Removing custom application folder"
  	rm -rf /jci/gui/apps/custom||true
  else
    log_message "- Custom application folder does not exist"
  fi

  if [ -e /tmp/mnt/resources/aio ]
  then
  	log_message "- Removing custom runtime & apps"
  	rm -rf /resources/aio/mzd-casdk||true
  else
    log_message "- CASDK runtime & apps do not exist"
  fi
fi
sleep 2
log_message "************************ DELETING RESTORE FILES *************************"
rm -fr /tmp/mnt/data_persist/dev/system_restore
log_message "************************* SYSTEM FULLY RESTORED *************************"
show_message "========== SYSTEM FULLY RESTORED =========="
if [ -d /tmp/mnt/sda1 ]
then
  cp /tmp/root/AIO_log.txt /tmp/mnt/sda1
fi
# a window will appear before the system reboots automatically
sleep 3
killall jci-dialog
/jci/tools/jci-dialog --info --title="SYSTEM FULLY RESTORED" --text="THE SYSTEM WILL REBOOT IN A FEW SECONDS!" --no-cancel &
sleep 10
killall jci-dialog
reboot
