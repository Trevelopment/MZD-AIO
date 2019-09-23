# SSH Access Via USB cable Over ADB - Android Debug Bridge
### Allows for SSH connection using a USB cable and an Android phone over ADB.

##### This is the fastest SSH connection you can make with the CMU.  The pre-req is SSH must be enabled if it is not for your FW version try SSH_Bringback tweak from [AIO Tweaks](http://mazdatweaks.com).  Also an Android phone to connect to ADB.

## Connect to SSH with a USB cable and Android phone or tablet.
1. Copy `cmu-autorun/sdcard/adb/*` to the root of your SD card
2. Plug SD card to car
3. Plug Android phone to car USB port (debugging mode must be activated in developer options)
4. Start car
5. A message will pop up prompting to connect via SSH
> Host: localhost (or 127.0.0.1)  
>  Port: 2222  
>  User: cmu (or root for FW < v56.00.513)  
>  Pass: jci

Example: ssh cmu:jci@localhost -p 2222
