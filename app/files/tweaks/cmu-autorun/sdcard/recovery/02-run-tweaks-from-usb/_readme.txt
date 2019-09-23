
install-udev-handler-if-not-installed.autorun:
this script install a callback function "99-run-tweaks.rules" in /etc/udev/rules.d to run a script whern usb storage inserted
if this script is installed not do anything

/etc/udev/rules.d/99-run-tweaks.rules:
run "udev_add_action_handler.sh" when usb storage is inserted, got a paramenter sda, sdb,...

udev_add_action_handler.sh:
is executed for every inserted usb storage by /etc/udev/rules.d/99-run-tweaks.rules
-this script run "run-tweak-from-usb.sh" in background and return
-the system finish installing usb storage and mounting it
-on CMU apear "USB storage connected"

"run-tweak-from-usb.sh":
-wait 2sec to system finish mounting the usb storage
-search the usb storage for "dataRetrieval_config.txt"
-search it for "CMD_LINE=[script]" lines
-if found execute [script]

****** WARNING *****
jcidialog not working if executed by this script
BUT the script is executed ! (copy/modify files,...)
