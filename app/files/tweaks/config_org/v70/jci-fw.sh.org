#!/bin/sh

#sumire_restored
# JCI firewall control script.
#
# $Archive$
# $Author$
# $Date$
# $Modtime$
# $Revision$
# $Workfile
#
# (C) Johnson Controls, Inc.
#

# RK: Add to src/flash/armv7le/jci/security in Dimensions product dev project.

LOG_TAG=FW
IPTABLES=/usr/sbin/iptables


log()
{
    local MSG="$1"

    logger -s -t FW "$MSG"
}


display_usage()
{
    echo "JCI firewall control script."
    echo ""
    echo "Usage:"
    echo -e "\t$1 <command>"
    echo -e "\t$1 help"
}


display_help()
{
    echo "JCI firewall control script."
    echo ""
    echo "Usage:"
    echo -e "\t$1 <command>"
    echo ""
    echo "Commands:"
    echo -e "\tstatus                   - display current status and configuration."
    echo -e "\tstart                    - start the firewall"
    echo -e "\tstop                     - stop the firewall"
    echo -e "\trestart                  - restart the firewall"
    echo ""
    echo -e "\thelp                     - display this help screen"
}


do_status()
{
    $IPTABLES -L -n -v --line-numbers
}


do_start()
{
    # This iptables configuration:
    # rejects any incoming packets by default (a "deny by default" approach)
    # allows any outgoing packets by default
    # allows incoming SSH connections on any interface
    # allows incoming DHCP packets on the wlan0 interface
    # allows incoming DNS packets on the wlan0 interface
    # allows incoming ICMP echo and trace packets on any interface

    export IPTABLES=/usr/sbin/iptables


    # load modules explicitly as otherwise it takes about 2 seconds for modprobe to resolve...
    insmod /lib/modules/3.0.35/kernel/net/netfilter/x_tables.ko
    insmod /lib/modules/3.0.35/kernel/net/ipv4/netfilter/ip_tables.ko
    insmod /lib/modules/3.0.35/kernel/net/ipv4/netfilter/iptable_filter.ko
    insmod /lib/modules/3.0.35/kernel/net/netfilter/nf_conntrack.ko
    insmod /lib/modules/3.0.35/kernel/net/netfilter/xt_state.ko
    insmod /lib/modules/3.0.35/kernel/net/ipv4/netfilter/nf_defrag_ipv4.ko
    insmod /lib/modules/3.0.35/kernel/net/ipv4/netfilter/nf_conntrack_ipv4.ko
    insmod /lib/modules/3.0.35/kernel/net/netfilter/xt_tcpudp.ko
    insmod /lib/modules/3.0.35/kernel/net/netfilter/xt_limit.ko

    $IPTABLES -F
    $IPTABLES -X

    # Accept anything on the loopback interface
    # KGT: We want this fast
    $IPTABLES -A INPUT -i lo -j ACCEPT
    $IPTABLES -A OUTPUT -o lo -j ACCEPT

    # Set Default Chain Policies (Reject all incoming and allow all outgoing packets)
    $IPTABLES -P INPUT DROP
    $IPTABLES -P OUTPUT ACCEPT
    $IPTABLES -P FORWARD DROP

    # Drop any invalid packets
    # KGT: Just in case
    $IPTABLES -A INPUT -m state --state INVALID -j DROP
    $IPTABLES -A OUTPUT -m state --state INVALID -j DROP
    # KGT: This is the default, but protecting for Wi-Fi AP...
    #$IPTABLES -A FORWARD -m state --state INVALID -j DROP

    # Accept incoming packets on already esablished connections
    $IPTABLES -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

    # Allow incoming SSH connections on any interface
    # Note that iptables with kernel 2.4/2.6 allows for a filter rule based upon
    # different connection states (NEW, ESTABLISHED, RELATED, INVALID).
    $IPTABLES -A INPUT -p tcp -m multiport --destination-ports 22,24000,36000 -m state --state NEW,ESTABLISHED -j ACCEPT
    # KGT: This is the default
    #$IPTABLES -A OUTPUT -p tcp --sport 22 -m state --state ESTABLISHED -j ACCEPT

    # Allow incoming DHCP packets on wlan0 interface
    $IPTABLES -A INPUT -p udp -i wlan0 --sport 68 --dport 67 -j ACCEPT
    $IPTABLES -A INPUT -p tcp -i wlan0 --sport 68 --dport 67 -j ACCEPT

    # Allow incoming DNS packets on the wlan0 interface
    $IPTABLES -A INPUT -p udp -i wlan0 --dport 53 -m state --state NEW -j ACCEPT
    $IPTABLES -A INPUT -p tcp -i wlan0 --dport 53 -m state --state NEW -j ACCEPT

    # Allow incoming ICMP echo and trace
    # To prevent DoS attacks, limit responses to x per second
    $IPTABLES -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT

    # KGT: Reject nicely anything else
    #$IPTABLES -A INPUT -p tcp -j REJECT --reject-with tcp-reset
    #$IPTABLES -A INPUT -j REJECT --reject-with icmp-port-unreachable
}


do_stop()
{
    log 'Stopping firewall...'

    # Accept all incoming and outgoing packets
    $IPTABLES -F
    $IPTABLES -X
    $IPTABLES -P INPUT ACCEPT
    $IPTABLES -P OUTPUT ACCEPT
    $IPTABLES -P FORWARD ACCEPT
}


CMD="$1"
shift

if [ "$CMD" == "" ] ; then
    display_usage "$0"
    exit 0
fi

case "$CMD" in
    status)
        do_status $*
        ;;

    start)
        do_start $*
        ;;

    stop)
        do_stop $*
        ;;

    restart)
        do_stop
        do_start
        ;;

    help)
        display_help "$0"
        ;;

    *)
        echo -e "ERROR: Unknown command.\n"
        display_usage "$0"
        exit 1
        ;;
esac

exit 0
