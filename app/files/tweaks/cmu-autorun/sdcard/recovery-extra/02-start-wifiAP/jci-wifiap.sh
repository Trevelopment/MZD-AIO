#!/bin/sh

#include variables from config file
. `dirname $0`/wifiAP.config

#channel: 9
#mode: only G
#WPA2 Personal + AES (no tkip)

NETWORK_INTERFACE_NAME=wlan0
NETWORK_DRIVER_NAME=nl80211

HOSTAPD_CONF_FILE=/tmp/current-session-hostapd.conf
UDHCPD_CONF_FILE=/tmp/current-session-udhcpd.conf

DHCP_DEAMON=udhcpd
WIFI_AP_DEAMON=hostapd

NETWORK_IP_ADDRESS=192.168.53.1
NETWORK_MASK=255.255.255.0
DHCP_START_ADDRESS=192.168.53.20
DHCP_END_ADDRESS=192.168.53.254

#configures interface
configure_interface()
{
    ifconfig $NETWORK_INTERFACE_NAME $NETWORK_IP_ADDRESS netmask $NETWORK_MASK
}

# create the 'hostapd.conf'
create_wifi_ap_configuration()
{
    # obtain the MAC address
    MAC_ADDRESS=`ifconfig | grep "$NETWORK_INTERFACE_NAME" | awk '{print $5}'`

    # create the file
    echo 'interface='$NETWORK_INTERFACE_NAME'' > $HOSTAPD_CONF_FILE
    echo 'driver='$NETWORK_DRIVER_NAME'' >> $HOSTAPD_CONF_FILE
    echo 'channel=9' >> $HOSTAPD_CONF_FILE
    echo 'hw_mode=g' >> $HOSTAPD_CONF_FILE
    echo 'wpa=2'     >> $HOSTAPD_CONF_FILE
    echo 'auth_algs=1' >> $HOSTAPD_CONF_FILE
    echo 'wpa_key_mgmt=WPA-PSK' >> $HOSTAPD_CONF_FILE
    echo 'wpa_passphrase='$NETWORK_WIFI_PASSWORD'' >> $HOSTAPD_CONF_FILE
    echo 'rsn_pairwise=CCMP' >> $HOSTAPD_CONF_FILE
    echo 'ssid='$NETWORK_WIFI_SSID'' >> $HOSTAPD_CONF_FILE
#    echo 'ssid=CMU-'$MAC_ADDRESS'' >> $HOSTAPD_CONF_FILE
}

#create the 'udhcpd.conf'
create_dhcp_confifuration()
{
    # create the file
    echo '# The start and end of the IP lease block' > $UDHCPD_CONF_FILE
    echo 'start  '$DHCP_START_ADDRESS'  #default: 192.168.0.20' >> $UDHCPD_CONF_FILE
    echo 'end   '$DHCP_END_ADDRESS'  #default: 192.168.0.254' >> $UDHCPD_CONF_FILE
    echo ''>>$UDHCPD_CONF_FILE
    echo '# The interface that udhcpd will use' >> $UDHCPD_CONF_FILE
    echo 'interface '$NETWORK_INTERFACE_NAME'  #default: eth0'  >> $UDHCPD_CONF_FILE
    echo '' >> $UDHCPD_CONF_FILE
    echo '#JCI configuration' >> $UDHCPD_CONF_FILE
    echo 'opt dns 192.168.0.1' >> $UDHCPD_CONF_FILE
    echo 'option subnet '$NETWORK_MASK'' >> $UDHCPD_CONF_FILE
    echo 'opt router '$NETWORK_IP_ADDRESS'' >> $UDHCPD_CONF_FILE
    echo 'option	lease	 864000  # 10 days of seconds' >> $UDHCPD_CONF_FILE
}

# Start DHCP deamon
start_dhcp_deamon()
{
    DHCPD_PID=$(pidof $DHCP_DEAMON)
    if [ "$DHCPD_PID" == "" ] ; then
       create_dhcp_confifuration
       $DHCP_DEAMON $UDHCPD_CONF_FILE &
       sleep 2
       get_dhcp_status
    else
       echo "DHCP deamon already started."
    fi
}

# start WiFi AP deamon
start_wifi_ap_deamon()
{
    AP_DEAMON_PID=$(pidof $WIFI_AP_DEAMON)
    if [ "$AP_DEAMON_PID" == "" ] ; then
       create_wifi_ap_configuration
       $WIFI_AP_DEAMON -dd $HOSTAPD_CONF_FILE &    # '-dd' provides extra debug information
       sleep 2
       get_wifi_ap_status
    else
       echo "WiFi AP mode already active."
    fi

}

# stop DHCP
stop_dhcp_deamon()
{
    DHCPD_PID=$(pidof $DHCP_DEAMON)
    if [ "$DHCPD_PID" == "" ] ; then
       echo "DHCP deamon already stopped"
    else
       kill $DHCPD_PID
       sleep 2
       get_dhcp_status
    fi
}

# stop WiFi AP deamon
stop_wifi_ap_deamon()
{
    AP_DEAMON_PID=$(pidof $WIFI_AP_DEAMON)
    if [ "$AP_DEAMON_PID" == "" ] ; then
       echo "AP deamon already stopped"
    else
       kill $AP_DEAMON_PID
       sleep 2
       get_wifi_ap_status
    fi
}

#get WiFi status
get_wifi_ap_status()
{
    AP_DEAMON_PID=$(pidof $WIFI_AP_DEAMON)
    if [ "$AP_DEAMON_PID" == "" ] ; then
        echo "WiFi AP mode : stopped"
    else
        echo "WiFi AP mode : started"
    fi
}

# get DHCP status
get_dhcp_status()
{
    DHCPD_PID=$(pidof $DHCP_DEAMON)
    if [ "$DHCPD_PID" == "" ] ; then
         echo "DHCP : stopped"
    else
        echo "DHCP : started"
    fi
}

display_usage()
{
    echo "JCI WiFi Access Point control script."
    echo ""
    echo "Usage:"
    echo -e "\t$0 <command> [<parameters> ...]"
    echo -e "\t$0 help"
}

display_help()
{
    echo "JCI WiFi Access Point control script."
    echo ""
    echo "Usage:"
    echo -e "\t$0 <command>]"
    echo ""
    echo "Commands:"
    echo -e "\tstatus      - display current status."
    echo -e "\tstart       - start logging daemon"
    echo -e "\tstop        - stop logging daemon"
    echo -e "\trestart     - restart logging daemon"
    echo -e "\thelp        - display this help screen"
}


CMD="$1"
#shift

if [ "$CMD" == "" ] ; then
    display_usage
    exit 1
fi

case "$CMD" in
    status)
        get_wifi_ap_status
        get_dhcp_status
        ;;

    start)
        configure_interface
        start_dhcp_deamon
        start_wifi_ap_deamon
        ;;

    stop)
        stop_dhcp_deamon
        stop_wifi_ap_deamon
        ;;

    restart)
        stop_dhcp_deamon
        stop_wifi_ap_deamon
        sleep 1
        configure_interface
        start_dhcp_deamon
        start_wifi_ap_deamon
        ;;

    help)
        display_help
        ;;

    *)
        echo -e "ERROR: Unknown command.\n"
        display_usage
        exit 2
        ;;
esac

exit 0
