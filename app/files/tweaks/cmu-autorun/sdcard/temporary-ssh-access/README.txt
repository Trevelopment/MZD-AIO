This will (temporarily, until the next reboot) open up SSH (root) access to
the Mazda CMU running v56. It does not make any changes to files on the CMU.

NOTE: I've only tested this using a USB Ethernet dongle (in particular this
      one: http://www.dx.com/p/414475). However, the tweak does disable
      (again, temporarily) the firewall, so it _should_ work over wifi as
      well.

Steps:

1. Copy the contents of this directory to a USB stick.

2. Insert the stick into your Mazda.

3. Wait for the dialog to appear.

4. ssh to your car:

  $ ssh -p 7777 -i mazda-ssh cmu@192.168.42.1

  Where `mazda-pub` is the file named as such in this directory (containing
  the private SSH key).

192.168.42.1 is the default IP-address that the CMU will use if you're not
using a DHCP daemon. You should be able to reach it if you assign a static
IP-number (like 192.168.42.2) to your ethernet interface.

If you're using wifi, the IP-address may be different (I believe that you
can look it up somewhere in the CMU settings).
