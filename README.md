# MZD-AIO-TI 2.5 [![Download](https://api.bintray.com/packages/trevelopment/MZD-AIO-TI/AIO/images/download.svg?version=MZD-AIO-TI) ](http://dl.mazdatweaks.win)

## MZD All In One tweaks Installer

#### Installer and uninstaller for several different system tweaks for Mazda MZD Infotainment System


##### App Size ~ 260MB
AIO Rebuilt with [Electron] & [AngularJS]
[MazdaTweaks.com]      
Included Translator & Photo-Joiner (for background rotator tweak)
### Special thanks to all the developers out there that made this possible!
### And of course, Thanks to @Siutsch for [AIO 1.x][1]
##### (Mazda 2 (DJ), Mazda 3 (BM), Mazda 6 (GJ), Mazda CX-3 (DK), Mazda CX-5 (KE), Mazda MX-5 Roadster (ND) and new 2017 Mazda CX-9 (TC))

-----

### **IMPORTANT: All changes happen at your own risk!**
##### **Please understand that you can damage or brick your infotainment system running these tweaks!**
##### **Anyone who is unsure should leave it alone, ask someone with experience to help or ask in the forum.**
##### **I am not responsible for damages that may incur from the use.**

-----
# The MZD-AIO-TI v2 Philosophy

### AIO is an awesome program but it is far from complete.  I have adopted a new way of unifying AIO into an integrated system and have begun to work toward achieving that philosophy through this set of rules:
1. **Avoid Replacing Files** When The Same Can Be Achieved By Appending A Modification.  This will reduce issues with updated firmware versions because a file will never be replaced with an old incompatible version and it make for easier removal of modifications.  This only applies to tweaks where this is possible.
2. When Modifying, **Always Backup The Original Files** With The Added Extension .org (except images). This will eliminate the need for fallback files, though fallbacks will still be used if needed.  Also this should only be done once with the **original file** so it can be used to revert the system.
3. **Keep .org Files Forever!** Honestly, there is no reason to delete the backup files created by AIO.  After a .org is made of the original file the system will always have a way to revert that file back to its original state by copying the .org file without the .org extension, once it is deleted the system loses that failsafe.  Creating a new .org on every install can also have issues, especially if you install and uninstall many tweaks over a long period of time with tweaks that modify or replace the same files, so why not just keep the original as your failsafe from the start?
4. **Information Is Key.**  The AIO desktop app and MZD system can be aware of the state of one another by passing data back and forth with the USB drive.  At least you should be able to somehow keep track of the modifications you've made to your system and be able to access that information easily and that is something that will eventually be a feature of this app.  This is a separate from the actual tweaks but in the end will prove to be beneficial in many ways.
5. **Know Your Compatibility.**  There are several kinds of files in your MZD system and some are completely safe to modify such as:
 * *Any Image File* - .png/.jpg - As long as you replace it with another image file, any image is safe to modify and replace.
 * *CSS Files* - .css - CSS (Cascading Style Sheets) files control formatting only and will not damage the system no matter what errors may be contained in the file.  Worst case scenario you can always revert the file to the original.
Those 2 kinds of files are completely safe to modify and really can achieve a great deal including almost any formatting related modifications to the system.  I wrote the Background Rotator tweak and Statusbar tweaks purely with CSS.  I also wrote the Off Screen Background tweak which just replaces an image.  

#### Files that and riskier to modify:

 * *JavaScript* - .js - Some JavaScript files and required to boot up the system so just leave them alone unless you know what you are doing.  That being said, there are many JavaScript files that are safe to edit but you probably need to know what you are doing to figure that out anyway.
 * *Shell Scripts* - .sh - Same thing, to avoid a boot loop situation only modify these if you know what you are doing.
 * *Binary Files* - various extensions or no extension - Just stay away from modifying these in general unless you **really** know what you are doing they are very important.

**I am working toward developing all AIO Tweaks to adhere to these rules.  Not every tweak follows these rules as of now but there are certain safety precautions already built in.**

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
***
~~:bomb:**A T T E N T I O N - Important information:**~~

 ~~**DOING A FACTORY RESET AFTER INSTALLING ANDROID AUTO LEADS THE SYSTEM TO STAY AT MAZDA BOOT LOGO!!!**
 **SO AVOID A FACTORY RESET OR UNINSTALL AA BEFORE THAT!**  :dizzy_face:
**There is unfortunately no chance to get access again on the CMU after doing a factory reset,**
 **the wireless settings will be deleted too when doing a factory reset**~~
#### **[This issue has recently been fixed!!!](https://github.com/Siutsch/AIO---All-in-one-tweaks/pull/20)!!!! Perfect timing for MZD-AIO-TI 2.0 release**
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
-
For installation of speedcam patch (see below), the NAVI SD card must remain in the car, because speedcam.txt file will be copied directly to SD card.  
- For installation of speedometer, the NAVI SD card must remain in the car too, without NAVI SD card a special patch will be installed, otherwise the compass is rotated 180 degrees.  
- In general, the SD card can remain in the car during the tweak installations.  

#### Installation Into MZD Infotainment System:
- Plugin USB drive, turn on car and wait for the "==  MZD-AIO-TI ==" window to appear (This may take 2 - 20 minutes so be patient).
- At that point you will be given the option to continue or abort the installation.
- Associated messages with pop up during installation (No further user interaction is needed).  
- The system will be restarted automatically.
- Remove the USB drive after restart.
- Tweaks will be applied upon reboot.

#### WHICH FW VERSIONS ARE SUPPORTED:

##### The tweaks can be installed for these FW versions at this time:

- 56.00.100A/230A/240B/511A/512A/513C / 59.00.326A -ADR (4A N)
- 56.00.230A/511A/512A/513B -EU
- 55.00.650A/753A/760A / 58.00.250A -NA
- 56.00.401A-JP
- 59.00.330A/441A/443A/446A/450A-NA(N NA)

_**This will be generally checked at the beginning of an installation, if your FW is not compatible the installation will abort at this point.  This is for the safety of incompatible systems.**_


##### The following tweaks are checked individually during installation of tweaks.sh, because there are different (config)-files to consider:

- speedcam-patch
- pause_on_mute
- track-order/FLAC support
- no_more_disclaimer
- list_loop
- order_of_audio_source_list


##### Speedcam-patch support is only for:

- 56.00.100A/230A/240B/513C / 59.00.326A -ADR (4A N)
- 56.00.230A/511A/512A/513B -EU
- 55.00.650A/753A/760A / 58.00.250A -NA
- 56.00.401A -JP

##### For 56.00.51xX -EU / ADR there is no GPS data anymore! Use this workaround:

- After opening the doors at least wait 35 seconds, then press the start button or start the car
- Before starting the speedometer app, start the NAVI app before (and close again)
- Unplug and replug the NAV SD card (should be avoided)

##### Track-order/FLAC support only for:
- 56.00.100A/240B/513C -ADR (4A N)
- 56.00.230A/511A/512A/513B -EU
- 55.00.650A/753A/760A / 58.00.250A -NA

#### These tweaks will only install on compatible firmware vesions.
---
#### TOOLS:
- [Electron] is an amazing shell developed by Github utilizing the awesome power of both the [NodeJS] and [Chromium] APIs into a single runtime harnessing web based programming languages into beautifully packaged desktop apps.
- [AngularJS] New hot Javascript app framework by Google
---
# List of tweaks:

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
