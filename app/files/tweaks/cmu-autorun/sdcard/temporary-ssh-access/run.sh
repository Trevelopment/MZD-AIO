#!/bin/sh

DEBUG=1

sleep 5

show_message()
{
        sleep 5
        killall jci-dialog
        /jci/tools/jci-dialog --info --title="MESSAGE" --text="$*" --no-cancel &
}

# Disable watchdog
echo 1 > /sys/class/gpio/Watchdog\ Disable/value

# Set environment
DIR=$(dirname $(readlink -f $0))
PATH=$PATH:/bin:/sbin:/usr/bin:/usr/sbin

mount -o rw,remount ${DIR}

# Log all stdout/stderr to file
exec > $DIR/installer.log 2>&1

# Stop firewall
#/jci/scripts/jci-fw.sh stop >>$DIR/installer.log

# Start WiFiAP
killall wpa_supplicant >> $DIR/installer.log
/jci/scripts/jci-fw.sh stop >> $DIR/installer.log
sleep 1
/jci/scripts/jci-wifiap.sh start >> $DIR/installer.log

iptables -A INPUT -p tcp --dport 7777 -j ACCEPT >> $DIR/installer.log

# Start sshd on port 7777 using our public key
/usr/sbin/sshd -D -p 7777 -o "AuthorizedKeysFile ${DIR}/mazda-ssh.pub" -o "StrictModes no" >> $DIR/installer.log &

/jci/tools/jci-dialog --title="SUCCESS" --text="WiFi-AP and SSHD  STARTED!\nssh -i mazda-ssh -p7777 cmu@192.168.53.1" --ok-label='OK' --no-cancel
