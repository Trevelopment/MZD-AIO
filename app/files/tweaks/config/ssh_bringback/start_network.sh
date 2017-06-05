#!/bin/sh

# Start some developer mode tools
if [ -f /data/integration/developer_mode_on_flag ]; then
    # Start HTTP server for "remote GUI"
    /usr/sbin/httpd -p 80 -h /jci/gui
else
    #start firewall only if NOT developer mode on
    nice -n 20 /jci/scripts/jci-fw.sh start
fi

if [ -f /data/integration/eth0_on_flag ]; then
insmod /lib/modules/3.0.35/kernel/drivers/net/phy/smsc.ko
insmod /lib/modules/3.0.35/kernel/drivers/net/fec.ko

ifplugd -M -I -i eth0
fi

# USB ethernet (eth1)
insmod /lib/modules/3.0.35/kernel/drivers/net/usb/usbnet.ko
insmod /lib/modules/3.0.35/kernel/drivers/net/usb/asix.ko
# CDC-NCM is required for MirrorLink :
#insmod /lib/modules/3.0.35/kernel/drivers/net/usb/cdc_ncm.ko

/jci/scripts/start_eth1_dhcp.sh &

/usr/sbin/sshd

echo 1 > /sys/class/gpio/Watchdog\ Disable/value

touch /var/run/start_network_ready
