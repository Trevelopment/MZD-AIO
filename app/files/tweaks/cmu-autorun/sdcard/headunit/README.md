# Changlog

- [20180930] : autorun-headunit-1.3
* HUD support (Need tester) 
* source : https://github.com/silverchris/
* Improved start script

- [20180811] : support config file 
* support config file github/@Peck07
* Improve USB/WIFI switch machanism
* support config file for Reverse direction
* support config file for Car GPS/ Phone GPS

# Instructions

After activating autorun.

1. copy `cmu-autorun/sdcard/headunit/*` to SDCARD
2. plug SDCARD to car
3. plug Android phone to car USB port
4. Start car

Android Auto should automatically start.  
## Wireless Mode

### Initial wireless connection 
1. <b>Vehicle</b> : Start car
2. <b>PHONE</b>: Share personal hotspot
3. <b>Vehicle</b> : Connect to personal hotspot
4. <b>PHONE</b>:  Enable Developer Settings on Android Auto 

### Instructions:
1. Phone: Create Hotspot
2. Vehicle: Turn on Wifi, connect to phone hotspot
3. Phone: In Android Auto app go to about screen menu and start headunit server
Android Auto will start automatically, if it does not or you get a black screen for more than 5 minutes you can open Android Auto from the applications menu. 

### Stop

1. <b>Vehicle</b>: Exit Headunit
2. <b>Vehicle</b>: Disconnect personal hotspot
3. <b>PHONE</b>: Stop Head unit Server. Disable developer mode (options).
4. <b>PHONE</b>: disable personal hotspot

Permanent stop headunit-wirelss can do by disable personal hotspot or unplug SDcard/USB.

# Compile source
* <https://gitlab.com/mzdonline/headunit/tree/wireless>

# Compile script
* <https://gitlab.com/mzdonline/AR4/tree/master/compile-script>
