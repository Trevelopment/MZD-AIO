[Full Changelog](changelog.htm)  

# AIO + CASDK

### v2.8.0

> Update Summary:
>
> -   CASDK!
> -   Android Auto Headunit v1.09 w/ WiFi Support
> -   VideoPlayer v3.5
> -   AIO Tweaks App v0.7
> -   Speedometer v5.7
> -   Reworked some classic tweaks & other bug fixes

## CASDK

<div class="w3-container"><div class="header">CASDK is a micro framework that allows developers to write and deploy custom applications which integrate natively into the existing JCI framework without hassle.  CASDK simplifies the app development process with a straight-forward, and slimmed down but powerful API built on top of the JCI framework.  This version is integrated to run AIO apps alongside CASDK apps with no conflicts and imperceptible performance impact.  Together they create a unique framework and a new realm of customization and application possibilities.</div>
<h5>CASDK Comes With:</h5>
<ul>
  <li><b>CASDK Proxy</b> - Proxy registers both CASDK and AIO apps.</li>
  <li><b>Custom Application Runtime</b> - A microframework that handles the custom applications during runtime. </li>
  <li><b>Data Readers</b> - Poll vehicle data an certain intervals (1s, 60s, & 300s) </li>
  <li><b>JS logging</b> - JavaScript (and CSS) console log is written to /tmp/root/casdk-error.log </li>
  <li><b>LocalStorage</b> - Moves the save location of localStorage to /tmp/mnt/data_persist/storage/ </li>
  <li><b>NodeJS</b> - Powerful Server-side JavaScript.</li>
  <li><b>ADB</b> - Android Debug Bridge for Android devices.</li>
  <li><b>Custom Applications</b> - Apps that run on the CASDK framework</li>
  </ul>
  <b>CASDK Framework and Apps are installed internally to the 'resources' partition by default, optionally CASDK apps can be run from an SD Card. </b>
  <div> Native apps such as those installed with AIO will run on the CASDK framework although apps need to be installed differently with CASDK. The AIO Tweak installer will detect if CASDK is installed when running tweaks and adjust the installation accordingly but older app installers may not work while CASDK is installed.</div>
  <div>CASDK apps have minimal impact on system performance, I encourage all developers to create one. Using the SD Card app method allows you to run any CASDK app even one you create yourself!</div>
</div>

### CASDK Apps will be unlockable using codes I will post in my [https://trevelopment.win/casdk](<CASDK blog>)

-   Simple Dashboard App will be available by default and 2 more will be available by visiting the blog and entering the codes.
-   I did not create any of the CASDK apps but I did make numerous enhancements and bug fixes, you may report CASDK bugs in the [https://github.com/Trevelopment/MZD-AIO/issues](<MZD-AIO Github repository>).

#### Android Auto Headunit App v1.09 w/ Wifi Support

Instructions For Android Auto WiFi:
0. Before you start: Activate Android Auto developer mode by going to about and tapping the title bar until it says you are a developer
1. From Android Phone: Create Hotspot
2. From Vehicle: Turn on Wifi, connect to phone hotspot
3. Phone: In Android Auto app go to about screen menu and start headunit server
4. Android Auto will start automatically, if it does not or you get a black screen you can open Android Auto from the applications menu.

#### VideoPlayer v3.5

-   Fullscreen button toggles: Boxed - Keep Aspect Ratio - Fullscreen
-   Repeat is one button toggles: none - 1 - all
-   StatusBarNotifications for toggles
-   Video title will filter out the extension and turn underscores to spaces
-   Shows gplay error in error message
-   After hitting an error will make up to 3 attempts to re-start the video in 10 second intervals
-   Video Resumes where it left off when shifting out of reverse
-   Added to option "Resume Play" - when checked:
    -   Resumes the video where you left off if it was interrupted or the app was exited while playing.
    -   Saves video list to reopen and resume quickly (reloads if switch to music or press reload button)
    -   If the video is stopped and you are in the list view when you exit you will return to the list when reopened.
-   "Black Out Background" option - Will overlay all other GUI layers leaving only the video and solid black background
    -   If "Title to Statusbar" is checked, Video Title will show centered above video and time in the bottom left corner (but can be toggled with the multicontroller).
    -   This is ON TOP of all layers including the statusbar and bottom controls while the video player background is ON THE BOTTOM of all the other layers
    -   Pausing the video temporarily hides the overlay
-   In VideoPlayer Info panel (tab next to options) will show swap memory data and "unmount swap" button (if swapfile is present)
        -   Makes an attempt to unmount swapfile on shutdown to avoid freezing.
    NOTES ON SWAPFILE: When using the swapfile it is recommended to use the "unmount swap" button before turning off and shutting down the system. If a significant amount of memory is "swapped" then the shutdown sequence is not enough time for the swapfile to fully unmount and the system will freeze. In the list view long hold down to check how much memory is in the swap cache, manually unmounting a few seconds before system shutdown solves the freezing issue.
-   Added Multicontroller 'hold' actions
    -   While media is playing:
        -   Up - Toggle Title
        -   Down - Toggle Shuffle
        -   Left - Toggle VideoPlayer Background (Behind Layers)
        -   Right - Toggle Blackout Overlay
        -   Select - Toggle Repeat
    -   Video List View:
        -   Up - Open Options
        -   Down - Open Info
        -   Left - Play Next Video
        -   Right - Play Previous Video
        -   Select - Select Last Played Video

#### AIO Tweaks App v0.7

-   Turn Off Display On startup **(Experimental)**
    -   Screen will automatically turn off after boot up sequence is complete.
    -   System will be fully booted before display is turned off
    -   Pushing buttons before the boot sequence is complete may have unexpected effects
-   If the touchscreen is NOT enabled while driving, AIO will display the word "Driving..." (This was to test the new 'Touchscreen While Moving' tweak to make sure I completely stopped the signal from reaching the GUI)
-   Also, will display the word "Stop!" when you stop (This was also for testing intercepting speed signals from the CMU)

#### Speedometer v5.7, Sb Speedo, & Date2Statusbar Tweaks

-   Option: Temporarily hide Sb Speedometer during Statusbar notifications
-   Date to Statusbar is not needed anymore with Sb Speedometer (icons will be moved above clock)
-   Note: If installing SB Speedometer and Date2Statusbar is already installed then reinstall (or uninstall) to update, this only need to be done once.
-   Icons for Trip Dist, Coolant and Intake Temp.

#### Touching Up The Classics

-   **Touchscreen While Moving** will no longer disable the compass
    -   Replaced 'Fix Cluster Compass' with 'Enable Nav While Driving' option (Which disables the cluster compass).
    -   AtSpeed signal is still fired but it is blocked from reaching the JavaScript code
-   **No More Disclaimer & Order of Audio Source List** tweaks revamped and added support for FW v59.00.545
-   Removed No More Disclaimer option 'Reduce Time To .5 seconds' because it is pointless, remove it completely or leave it.
-   Background Rotator window handles errors better and shows error messages when variables are outside of the boundaries.
-   Redone "App List Patch" for v59, this patch is applied during app installation for FW v59 only if both 'No More Disclaimer' & 'Order of Audio Source List' are not installed.

##### NOTE: When installing apps on v59+ **No More Disclaimer & Order of Audio Source List** will need to be reinstalled only the first time installing with AIO v2.8.0

#### COMPATIBILITY ADDED FOR FW V70.00.000
