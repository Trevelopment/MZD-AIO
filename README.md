# MZD-AIO-TI 2.8 [![Download](./aio.svg?version=MZD-AIO-TI) ](http://dl.mazdatweaks.win)

## MZD All In One tweaks Installer

#### Installer and uninstaller for several different system tweaks for Mazda MZD Infotainment System

 [How To Install](#how-to-install)

##### App Size ~ 260MB

AIO Rebuilt with [Electron] & [AngularJS][mazdatweaks.com]  
Included Translator & Photo-Joiner (for background rotator tweak)

### Special thanks to all the developers out there that made this possible!

### And of course, Thanks to @Siutsch for [AIO 1.x][1]

##### (Mazda 2 (DJ), Mazda 3 (BM), Mazda 6 (GJ), Mazda CX-3 (DK), Mazda CX-5 (KE), Mazda MX-5 Roadster (ND) and Mazda CX-9 (TC))

* * *

### **IMPORTANT: All changes happen at your own risk!**

##### **Please understand that you can damage or brick your infotainment system running these tweaks!**

##### **Anyone who is unsure should leave it alone, ask someone with experience to help or ask in the forum.**

##### **I am not responsible for damages that may incur from the use.**

* * *

##### Touchscreen

Allows the use of the touchscreen while driving.  
Fix Cluster Compass: Some things will be disabled while driving but the touchscreen itself and the cluster compass will work

##### No More Disclaimer

Completely remove the disclaimer or reduce the expansion time of the disclaimer from 3.5 to 0.5 seconds.

##### Reverse Camera Safety Warning

No security

##### Semi-Transparent Parking Sensor Graphics.

Semitransparent parking sensor graphics for proximity sensors. When activating the rear camera, the car is displayed at the top right corner. The graphics now appear semitransparent by installing tweak. ![semi-transparent_parking-sensors](app/files/img/semi-transparent_parking-sensors.jpg)

##### Main Menu Loop.

Loop for the main menu.  
You can jump from left to far right, and vice versa.

##### Improved List Loop.

Loop for all lists and submenu (music, contacts, etc.).  
You can now jump from the top position of a list to the bottom and vice versa.

##### Shorter Delay Mod.

Reduces the waiting time for switching between pages with the multi commander from 1.5 to 0.3 seconds.

##### No More Beeps

Disable all 'Beeps' made by the system that are not silenced by the 'Settings > Sound > Beep' option. This also includes the beeps that cannot be silenced by the settings option.

##### Change Order of the Audio Source List.

Customize The order of the audio sources list.

##### Pause On Mute.

When pressing mute (pressing the volume button) played media are also paused. Only works in the music player screen.

##### Remove Message Replies

Removes the text 'Sent from my Mazda Quick Text System' if answering messages.

##### 1 Sec Diag Menu

Allows you to open the diagnostic menu by touching the clock at the top right of the **display settings menu** for one second.

##### Boot Animation

Customize the boot animation.

##### Date In Status Bar Mod.

Permanently visible date + icons above the clock, even if system messages are displayed.  Choose between 3 date formats. ![mzd_datum_icons_all](app/files/img/mzd_datum_icons_all.jpg)

##### USB Audio Mod. By: Enlsen

## **NOT Compatible with FW v59.00.502+**

\*\*Patches The USB Audio App With These Mods:  

1.  Long press (click hold) folders/all songs to play
2.  Adds new icon for USB root menu on the UMP control
3.  Removes "More like this" button from UMP control
4.  Adds folders button to UMP control
5.  Set folders and song list icons correctly (were switched) on UMP control
6.  Removes trailing "/" character from folder names for list control and title of now playing
7.  Adds folder and song icons to the list control
8.  Adds folder and playlist icons to now playing
9.  At the begining or each track shows **Artist - Title** in a status-bar notification.

![USBAudioMod](app/files/img/USBAudioMod.jpg)

##### Bigger Album Art

You get a bigger album art graphic.
Extra Options:

-   Full Width Titles: Song/Album/Artist will span across the entire screen.
-   Hide Album Art: Hides all album art.
    ![full_titles](app/files/img/full_titles.png)

##### No Background Behind Buttons

Remove the background behind the buttons and other semi-transparent overlay backgrounds. Overlays that can be removed: Now Playing, List View, In Call, Text Message View, and Behind Buttons ![NoButtonBackground](app/files/img/NoButtonBackground.jpg)

##### Change Blank Album Art Frame

The empty album cover frame is removed, which is displayed when there is no entry in the Gracenote database for the artist. Then the image of your choice (or transparent image) is displayed, if there is no cover in the MP3 tag too. Supported image formats are: jpg, jpeg, and png (any size). Note: The image chosen will be resized to 146px x 146px **BUT NOT CROPPED** and converted to .png format

##### Swapfile

The Swapfile will provide your system with an additional 1 GB of RAM running from the USB drive for playing videos. The installation of the swap file must be done on a USB drive with music and/or movies, that remains in the car.. The installation files are automatically deleted, the drive may no longer be removed during operation, because the system will use it also as memory.. Only remove the USB drive if the MZD system is off.

##### Fuel Consumption Tweak.

Additional display of KM / L (or MPG). ![FuelConsumptionTweak](app/files/img/FuelConsumptionTweak.jpg)

##### Videoplayer

[The VideoPlayer App.](/videoplayer/)

##### Speedometer

Speedometer App with many options and features.

![mzd_SpeedoCompass](app/files/img/mzd_SpeedoCompass.gif)

##### Castscreen receiver.

After installation you can mirror the smartphone screen at the infotainment display (mirroring).

-   You have to install the castscreen app on your Android Phone (castscreen-1.0.apk) The app can be found in the 'config' folder of your USB drive
-   activate the debug mode on your smartphone
-   connect the smartphone with USB cable to the infotainment system
-   start the app settings: H264, 800x480 @ 160, 1 mbps, then input 127.0.0.1 and press input receiver, then tap Start on right-up corner.

.

##### Android Auto Headunit App.

1.  Install the Android app from google play store
2.  Connect the phone to USB and pair the phone bluetooth with the CMU
3.  Android Auto will then start. If it does not try to open from the 'Applications' menu
4.  3 ways to stop AA
    1.  Press Home Button on the Mazda's Commander
    2.  Disconnect the USB cable
    3.  Use the onscreen menu 'Return to Mazda Connect' on last screen with speedo icon.

![AndroidAuto](app/files/img/AndroidAuto.jpg)

##### AIO Tweaks App.

###### **Every function in this app is _not_ guaranteed to work** but here are some useful and/or fun things you can do:

-   'Apps' Tab:
    -   Home: Goes home. This was the easy part.
    -   Go to: USB A, USB B, Bluetooth (audio context).
    -   Previous, Next - Works without changing contexts
    -   Stop (and Start\*) Android Auto Headunit process.
        -   Killing headunit process with allow Bluetooth calling to work correctly.
        -   Starting the process does not work properly yet, reboot CMU to restart headunit process.
    -   Stop and Start Castscreen Receiver
        -   Useful for troubleshooting if it is not functioning correctly.
        -   Both of these do work but there is a possibility that a memory issue may prevent the process from properly starting in which case a reboot is required to allow the process to run.
-   'Tweaks' Tab:
    -   Many familiar AIO layout related tweaks that can be applied on the fly
        -   Applied tweaks are automatically saved to localStorage and saved tweaks are applied on boot.
        -   Toggle each individual tweak on or off.
        -   One button to reset all tweaks.
        -   _NOTE: AIO Tweaks App will not UNDO installed tweaks, they will mix and may result in unexpected and/or interesting layouts_
-   'Options' Tab:

    -   Enable/Disable Touchscreen: _NOTE: Changes to the touchscreen functionality are applied when the vehicle comes to a **COMPLETE STOP**_

    -   Reboot: To Reboot.

![AIO_Tweaks-Screen](app/files/img/AIO_Tweaks-Screen.png)

# [CHANGELOG]

## In 2.3.x
- Video Player v2.7
- Android Auto v1.02
- Remove List Beep
- Skip Confirmation Option
- 6 New Themes
- Custom Theme Support

## In 2.2.x
- User Interface Style Tweaks (UI Style)
 - Set Music Song Title Color
 - Set Music Artist Color
 - Set Other Text Colors
 - Text Shadows
- Date2Statusbar v3.3
- Main Menu Tweaks
 - Layouts
 - 3d Main Menu label
 - Small Coins
 - Remove Ellipse
- Touchscreen Tweak Compass Fix
- Options For Background Rotator Tweak
 - Set how many images to rotate through.
 - Set amount of time for each image to show.  
- Backup Options

## In 2.1.x:
- Statusbar Tweaks
 - Set App Name Color
 - Set Clock Color
 - Set Navigation Notifications Color
 - Remove Statusbar Image
 - Set Statusbar Opacity (0 - 1: 0 - Transparent / 1 - Black)
- Off Screen Background
 - Set a background image for "Turn Display Off and Show Clock" in the Settings Menu.
 - Will also display on system shutdown.

## New Features in 2.0:
* Completely Rebuilt Desktop App GUI.
* Ability to install and uninstall tweaks in the same installation (Be careful this is a Beta feature).
* Tweak files for 'Color Scheme' (105MB) and 'Speedcam Patch' (207MB) are downloadable extras to keep the app size small.
* Choose an image to replace your infotainment background, automatically resized to 480x800px to fit the screen.
* Replace blank album art with any image, automatically resized to 146x146px.
* Image-Joiner for joining multiple images for the 'Background Rotator' tweak. Each Image is resized to 480x800px.
* Also, a choice to upload an image that will not get resized for background rotator.
* Separated the 'Improved List Loop' and 'Shorter Delay Mod' into individual tweaks.  
* Choice for 'Enable Wifi' and 'CID to SD' tweaks (enabled by default).
* Choice to use color scheme background or not.
* More information and backups are collected during tweak installation (For planned 'Save Backups to PC' and 'System Analysis' tweaks).
* Copy Files to USB Drive (works for a single plugged in drive or choose 1 out of a list of all available external drives)
* Save/Load tweak options.
* All 40+ tweaks from [AIO 1.x][1] with variations.
* Automatic Updates.
* Updated to most current version of Android Auto.
* More to come!

#### - Image formats supported: .png .jpg .jpeg .bmp .tiff

#### - Images are converted to .png format

#### - Built in Translator

**Only use with Firmaware >= v55.  DO NOT USE with V30/31/33 OR THE SYSTEM TO STAY AT MAZDA BOOT LOGO!!!!!**

-----

#### **What is 'MZD-AIO-TI'?**
My good friend Siutsch copied files from many different tweaks for his infotainment system and thought, it would be helpful if you could choose what tweaks you wanted to install or uninstall. He went on to develop a CMD based program to accomplish this and it worked well but lacked that modern app feel and faced other limitations.  As a developer, I felt like I should upgrade AIO into a full fledged desktop app but with the same underlying tweaks that we all know from [AIO v1.5.x][1]. It was around that time I came across [Electron] and I went on to develop MZD-AIO-TI.

This Project has 2 particular aspects, user interface and the custom built installer script: **tweaks.sh** and associated files. @Siutsch and I continue to work together on that aspect to this project to optimize the tweaks.sh script for safety, efficiency, and in the future analysis.

### How to install:  

###### Download and open the setup file and it will install and start up.
- Select Desired Tweaks and Press the "Start Compilation" Button.
- Insert a blank FAT32 USB flash drive to copy files directly to the drive
- Or copy the contents of "_copy to usb_" (created on your desktop) to the root of a blank USB flash drive.

###### Before Car Installation:
- unplug any other USB drives from the car except this flash drive.  
- In general, the SD card can remain in the car during the tweak installations.  

#### Installation Into MZD Infotainment System:
- Plugin USB drive, turn on car and wait for the "==  MZD-AIO-TI ==" window to appear (This may take 2 - 20 minutes so be patient).
- At that point you will be given the option to continue or abort the installation.
- Associated messages with pop up during installation (No further user interaction is needed).  
- The system will be restarted automatically.
- Remove the USB drive after restart.
- Tweaks will be applied upon reboot.


##### The following tweaks are checked for compatibility:

- track-order/FLAC support
- no_more_disclaimer
- list_loop
- order_of_audio_source_list


##### ~~Track-order/FLAC support only for:~~
- 56.00.100A/240B/513C -ADR (4A N)
- 56.00.230A/511A/512A/513B -EU
- 55.00.650A/753A/760A / 58.00.250A -NA

#### These tweaks will only install on compatible firmware vesions.
---
#### TOOLS:
- [Electron] is an amazing shell developed by Github utilizing the awesome power of both the [NodeJS] and [Chromium] APIs into a single runtime harnessing web based programming languages into beautifully packaged desktop apps.
- [AngularJS] New hot Javascript app framework by Google
---
# List of original tweaks:

## **Tweaks Master Bundle (v55)**
#### by miket0429
- <http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-258.html#post1442746>
- **Reduce disclaimer time** (actually no longer necessary, because it can be completely disabled by "No_More_Disclaimer" tweak)
- **Enable the touchscreen** while moving
- **Turn on WIFI** (not necessary with EU versions)
- **Change the background image**: replace background.png inside config folder with own 800x480 .png
- **Remove the safety warning label** from the reverse camera (10 different countrys)
- **Remove the blank album art frame**
  * now with additional picture of a radio, if there is no entry in the gracenote database or no album art is found in mp3 tag.
  * <http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-526.html#post1656898>
***
## **Speedometer_v4.4**
#### by_Diginix
- Based on mod by Trookam (which is based on mod by anderml1955 I think), first version of speedometer by serezhka, mph changes first done by windwalker
- <http://www.mazda6-forum.info/index.php?page=Thread&postID=329244#post329244>
- <https://dl.orangedox.com/pbnRlEewGyqUJ3lBvn>
- <http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-373.html#post1537450>
- <http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-384.html#post1548834>
- For changelog look at speedometer_changelog.txt
- And look at speedometer_readme.txt
***
## **Video player v2**
#### by Waisky2 with mods by vic_bam85
Use H264 video codec and MPEG-4 AAC audio codec  
You have to place your videos in a folder "Movies"!
- <http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-477.html#post1596306>
- <http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-480.html#post1597962>
- <http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-295.html#post1466322>
- It uses page up/down button to navigate video list (previous version scroll bar too heavy and slow)
- It uses websocket to handle all functions request so the response is instant (no more using nc command)
- Functions remain Load Video List / Start Stop Playback / Next Track / Repeat 1 (looping the same video)
- Integrated as native app in menu (thanks to Diginix)

##### Changes by vic_bam85:
- <http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-518.html#post1634913>
- <http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/122458-aio-all-one-tweaks-49.html#post1691370>
- v2.0 Initial Version
- v2.1 Included more video types (previous release)
- v2.2 Enabled the fullscreen Option (not released)
- v2.3 Included the status bar and adjusts to play in a window (not full screen) (not released)
- v2.4 Included a shuffle option
  * fixed the problem of pressing the next button rapidly
  * The list updates automatically at start
  * Option to stop the video when you go backwards (doesn't work well), but it stops the video, so it doesn't stays playing on the video in the background
- v2.5
  * It can now logs the steps (have to enable it on the videoplayer-v2.js & videoplayer.sh files)
  * closes the app if is not the current (first attempt)
  * fixes the issue of pressing mutiple times the search video button
  * fixes the application not showing the controls again when a video play fails
  * fixes playing the same video when shuffle is active
  * starts using a swap file on start of the app if not running (still have to create the swap with the AIO)
***
## **Date_to_statusbar_mod_by**
#### by Diginix
#### v1.0, v2.1 and v2.2 by Diginix, base by ForeverYoung (icons and date smaller just above the clock)
- <https://dl.orangedox.com/Vlyi3jrJIPfOdFiRFc>
- <http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-370.html#post1533778>

#### Changes done by Diginix:
- numeric date
- increase icon size (Wifi, Bluetooth...)
- a little more distance from the right and the top border
- disabled red border of system messages
- smaller font size for all statusbar texts
***
## **Custom infotainment colors**
#### (blue, green, orange, pink, purple, silver, yellow) by mrnerdbanger
- **Info: a color matching background image will be replaced too and the speedometer graphics also, if you install speedometer.**
- <http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/92330-custom-infotainment-colors.html>

***

## **Pause on mute**
#### by jimmyfergus, USB script by ForeverYoung
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-331.html#post1484922
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-349.html#post1517210
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-439.html#post1573354
***
## **Semi-transparent_parking_sensors_mod**
#### by Diginix
#### (folders "HorizontalSensors" and "VerticalSensors" used)
#### Original patch by vic_bam85 not working on V 56.00.230A german version, because only folder "HorizontalSensors" used
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-346.html#post1515386
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-376.html#post1540882
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-342.html#post1507786
***
## **Improved list loop**
#### by yuikjh
#### With additional shorter delay mod by yuikjh (generates frequent beeps!)
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-342.html#post1507786
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-332.html#post1486914
***
## **Main menu loop**
#### by ForeverYoung
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-344.html#post1510946
***
## **No_more_disclaimer**
#### by bob12x
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/117850-way-remove-disclaimer-boot.html

***

## **Media order patch** and **FLAC Support**
#### by diorcety
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/117162-media-flac-support-track-ordering.html
- http://dl.free.fr/getfile.pl?file=/rfIWhre7
- http://dl.free.fr/getfile.pl?file=/giB5cD8i (newer version?)
- https://mega.nz/#!DURwjLbL!UMO6XuasECekgJKpp7CUejsm9jqd9_2yn74ny_fbHR8
- FLAC support seems to be limited to max 2GB for music files!
***
## **Change order of the audio source list**
#### to this new order (often used inputs shifted upward)
-  'USB_A'
-  'USB_B'
-  'AuxIn'
-  'BTAudio'
-  'FMRadio'
-  'DAB'
-  'CD'
-  'SatRadio' (not visible in Germany)
-  'AhaRadio'
-  'Pandora' (not visible in Germany)
-  'Stitcher'
-  'AMRadio'
-  'DVD' (not visible in Germany, only Japan?)
-  'TV'  (not visible in Germany, only Japan?)
http://www.mazda3hacks.com/doku.php?id=hacks:sourcelistorder
***
## **Speedcam patch**
#### by diorcety
#### Speedcam.txt for Germany or Europe, with or without mobile cameras (4 different databases!)
- https://github.com/diorcety/mazda3/wiki/NNG-Speedcam-patching
- http://poiplaza.com/index.php?p=download&d=788&lstpg2=sdb&lstpg=ds&lsts=616

#### NGG-Patcher for Windows
#### by bob12x:
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/112465-sd-card-cloning-tutorial-13.html#post1581778
- https://mega.nz/#!DURwjLbL!UMO6XuasECekgJKpp7CUejsm9jqd9_2yn74ny_fbHR8
***
## **Castscreen receiver**
#### Version 2016- 03- 08 (mirroring of Android Smartphone) by daguschi, USB script by trookam
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-418.html#post1564545
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-422.html#post1566625
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-486.html#post1603929
- Install the CastScreen App on your Android phone (castscreen- 1.0.apk) and enable debug mode on your device
  * **you will find the app in config folder of your USB drive**
- Connect your Android device with USB cable to infotainment system
- Launch CastScreen App, change setting to H264, 800x480@160, 1 Mbps, then input 127.0.0.1 and press input receiver, then tap Start on right- up corner

##### Changelog:
  * Use 'adb reverse' instead of 'adb forward'. (I also reverse ssh port to 2222 after device connect to infotainment system.)
  * Fix unexpected close during mirroring
  * Support mirroring via both USB and WiFi (You can input the WiFi IP address of your car instead of 127.0.0.1 in the following steps)
***
## **SSH_bringback**
#### for 56.00.511A/512A/513B- EU by mzd3-k
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-436.html#post1571842
***
## **Open JCI test console**
#### Diagnostic menu by 1 sec. clock pressing in display settings, no more pressing music + favourites + power/mute
- http://minkara.carview.co.jp/userid/448162/car/1572030/3274514/3/note.aspx#title
- http://minkara.carview.co.jp/en/userid/448162/profile/

***
## **Swapfile**
#### by Waisky2
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/57714-infotainment-project-480.html#post1597962
***
## **Disable/Enable the boot animation**
#### to red button menu by Siutsch
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/125545-easy-way-get-cid-any-sd-card-cmu-usb-tweak.html#post1618697
***
## **Get CID** of any SD card
#### by Modfreakz
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/125545-easy-way-get-cid-any-sd-card-cmu-usb-tweak.html#post1618697
***
## **New scheme 'carOS'**
#### by epadillac
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/92330-custom-infotainment-colors-14.html#post1627265
***
## **Bigger album art** tweak
#### by epadillac
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/92330-custom-infotainment-colors-14.html#post1627033
***
## **No buttons background graphics** tweak
#### by epadillac
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/92330-custom-infotainment-colors-14.html#post1627033

***
## **Fuel Consumption Tweak**
#### by edyvsr from mazdateammexico.com - add fuel efficiency unit KM/L
- http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/122458-aio-all-one-tweaks-49.html#post1658314
- http://mazdateammexico.com/index.php?topic=16015.msg267577#msg267577

***
## **Background Rotator**
#### by TREZDOG44
 - This was my first tweak I wrote with pure CSS animation
 - Image Joiner is now included in 2.0
***

 ## **Android Auto Headunit App**
 #### V0.93A (2016-07-29) by spadival / agartner (use with google Android App)
 - http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/121561-android-auto-headunit-app-beta.html
 - https://github.com/spadival/headunit/releases
 - https://github.com/gartnera/headunit/releases/tag/v0.91B

 1. Install Android Auto app on your phone: https://play.google.com/store/apps/details?id=com.google.android.projection.gearhead or here: https://www.apkmirror.com/apk/google-inc/android-auto/android-auto-1-5-100945-2462389-release-release/android-auto-1-5-100945-2462389-release-android-apk-download/
 2. Connect the phone to USB (*) and pair the phone bluetooth with the CMU
 3. Click on Android Auto under Applications Menu on the CMU
 4. A black screen with credits should open up first
 5. Android Auto will then start. If it does not, pull out the USB and start over again (or check the installation.)

 _**NOTE: If you are using USB Audio for sound, You can only connect your phone after car has started and the CMU has booted up. If anything is connected, the source ids change and the headunit app is not yet designed to handle that**_

 #### Version 0.93A Change log
 -    Working again with newer google play services

 #### Version 0.92A/B Change log
 -    When using fav key to switch to radio, track keys allow you to change between presets
 -    When exiting AA, audio automatically switches back to radio
 -    Added oppo to the vendor list

 #### Version 0.91b Change log
 -    Backup cam is no longer broken
 -    Media keys work and voice button works
 -    Press favorite key to toggle between AA audio and radio audio
 -    Press home key to quickly kill AA
 -    Some startup issues fixed

 ####   Known issues:
 -    Credits only displayed on first opening of AA
 -    Blank screen after exiting AA if backup cam was used
 -    when returning from backup cam, first frame will be static/garbage. A new gui frame needs to originate from the phone before static disappears.
 -    Phone bluetooth not functioning (disable bluetooth on car/phone)
 -    Next and previous buttons will generate two keystrokes the first time pressed

 #### TODO:
 -    fix phone
 -    use track keys to switch radio stations when in radio mode
 -    fix audio level issues (try skipping a song, then pause and press play again)

 #### Version 0.83 Change log
 1. Performance improvements via sequential operation and removal of mutex locks - provided by @agartner
 2. Changed Video sink to mfw_isink - supposed to be faster and also now opera status (volume) bar can be overlayed if required - need some javascript expertise to make it a floating bar.
 3. Hide the disclaimer/credits after 2- 3 seconds
 4. Now you can touch drag/swipe
 5. Added VID for Lenovo

 #### Version 0.7 Change log
 1. USB Audio is enabled - to actually use this, you need a separate USB thumb drive in one of the slots, as this is the only way for you to be able to select USB audio in the CMU. Please do not try to use MTP option on your android phone, as it is not going to work.. Also, you need at least one mp3 or any music file in the USB thumb drive (I used http://www.xamuel.com/blank- mp3- files/point1sec.mp3)
 2. Since there was a severe case of audio stuttering once for me, I have included an option to disable USB audio and switch back to AUX. You can do this by placing a file called hu_disable_audio_out in the SD CARD (which, of course, means you now need an SD card ). I haven't actually tested this out as USB Audio worked fine at all times except that one instance.
 3. Nexus fix provided by @agartner
 4. Debug version of the app - to be run from ssh only - download from here . Copy to /data_persist/dev/bin, chmod 755 and run after executing the following command:
 ```sh
 export LD_LIBRARY_PATH=/data_persist/dev/androidauto/custlib:/jci/lib:/jci/opera/3rdpartylibs/freetype:/usr/lib/imx-mm/audio-codec:/usr/lib/imx-mm/parser:/data_persist/dev/lib:
 ```

 #### Version 0.6 Change log
 1. Voice control should not cause app to quit
 2. More VIDs added, including a possible fix for Nexus phones with VID 0x18D1

 #### Version 0.5 Change log
 1. Voice control enabled
 2. More VIDs added, including a possible fix for Nexus phones with VID 0x18D1
 3. Graceful kill when reverse gear engaged - App will restart when reverse gear is disengaged. However, reverse camera is still dark (because same V4L device?) as app isn't killed fast enough.

 #### Version 0.4 Change log
 1. Performance improvement to the gstreamer pipeline - testing shows no issues with Nav now. However, need some feedback to check if it is the same for everyone.
 2. Removed auto switch to Bluetooth as it causes problems with the UI. Need to switch manually now.
 3. Added a bunch of other Vendor id to Android USB Device VID list
 4. Removed aaserver and switched to websocketd.
 5. New gstreamer plugin h264parse compiled and added.
 6. UI now has USB/Gstreamer debug message window

 #### Version 0.3 Change log
 1. Night Mode - Simple logic for now - 6AM to 6PM is day .. Night afterwards
 2. First attempt at making libssl/libusb calls thread safe (Voice control will crash otherwise ocassionally).
 3. Increased USB send timeouts for better screen refresh.
 4. Added LG's Vendor id to Android USB Device VID list

 #### Version 0.2 Change log
 1. Code sync with Mikereidis/Master
 2. aaserver - microhttpd server to launch and pass status back to UI - no more messy sh, watch and other hoops.
 3. UI integration using Herko ter Horst's method.
 4. Exit AA using on screen menu (last screen with speedo icon)

 ***
[CHANGELOG]: (CHANGELOG.md)
[Electron]: (http://electron.atom.io/)
[AngularJS]: (https://angularjs.org/)    
[MazdaTweaks.com]: (http://mazdatweaks.com/)
[NodeJS]: (https://nodejs.org/)
[Chromium]: (https://www.chromium.org/)
[1]: (https://github.com/Siutsch/AIO---All-in-one-tweaks)
