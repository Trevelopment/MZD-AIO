# MZD-AIO-TI 2.x.x CHANGELOG  [![Download](https://api.bintray.com/packages/trevelopment/MZD-AIO-TI/AIO/images/download.svg?version=MZD-AIO-TI)](http://dl.mazdatweaks.win)
##### FOR [AIO v1.x.x CHANGELOG](https://github.com/Siutsch/AIO---All-in-one-tweaks/blob/master/CHANGELOG.md) or visit [MazdaTweaks.com]
### v2.8.3

#### AIO Tweaks App v0.9
- **System Restore** - Rewritten to accommodate new backup methods in v70

#### **Background Rotator**
- *Fixed* Drag & Drop reordering functionality
- *Fixed* Sideways scrolling with mouse wheel
- *Fixed* "Use Your Own Joined Image (No Resize)" Button
  - Completely works now, choose seconds-per-background first

#### Google Translate
- Hide "contribute to a better translation" pop-up (would cover AIO tooltips)

#### **CASDK** Apps available by default
- Clock
- Tetris
- Multidash

### v2.8.2

#### **Android Auto Headunit App v1.10+**

*   Same as v1.10 except:
    *   HUD is optional <var>*Beta*</var> feature
    *   Restored "Reverse GPS" Option

#### **Video Player App v3.7**

*   Compatibility for v70 using mfw_isink
    *   Resizing video during playback does not work with mfw_isink
    *   Choice to use the old video sink for FW before v70
*   Shows videos or songs in **all subdirectories in the "Movies" or "Music" folders** respectively
    *   All videos in one list alphabetical order by first letter in file path
    *   Search takes approximately 30 seconds per 1000 songs/videos

#### **No More Beeps**:

*   Now Disables Beeps By directly disabling the MMUI Message That Triggers The Beep instead of disabling certain Calls to Common.Beep()

#### **Date 2 Statusbar**:

*   Fixed dangerous code that could potentially cause a bootloop in _extremely rare situations_
    *   If already installed, reinstalling this tweak is recommended to ensure dangerous code is fixed

##### **Apps To Resources**

*   addon-common files are saved to resources partition to free up more space

#### v70+ Fixes:

*   **v70.00.100**: Fixed _No More Disclaimer_ & _Order of Audio Sources_ Tweaks
*   Backup ".org" files are saved on resources partition
*   Periodic Space/Safety checks/alerts to abort the installation whenever 100% space is used
*   v70 Integrity check (up to v70.00.100 only)
    *   Checks all .org backup files for integrity
    *   If backup is found to be incomplete or empty a fallback file is copied to new backup location, invalid backup is deleted
    *   If backup is valid it is moved to new backup location to free up space
    *   Repairs all broken backup files created by AIO
    *   _**On v70 if you have run out of space on the rootfs it is recommended to run "Full System Restore" ONCE to repair any potentially broken files**_

### v2.8.1

#### **Android Auto Headunit App v1.10**

*   HUD Support
*   USB/WiFi Switching Improvements
*   Various Codeing Improvements/Bug Fixes

#### **Video Player App v3.6**

*   Choose defaults for Shuffle, Repeat, & fullscreen
*   Video will resume where it left off after a phone call

#### **AIO Tweaks App v0.8**

*   Home & Playback buttons changed to icons
*   Added "Shell" tab and moved most of the shell commands
*   Controls change: Left/Right - Switch Tabs; Up/Down - Open Info Panel
*   Faster loading responses from shell commands
    *   Before response came through line by line via websocket (~.3 second per line)
    *   Now response is written to temp file and the file's contents are loaded & displayed. (~1 second per command)
*   **Show Version** - Shows FW Version
*   **Vehicle Data** - Shows Shared Vehicle Data
*   ~~**Reverse Cam** - Shows Reverse Camera~~ (_So close!_)

#### **Remove Message Replies**:

*   Set the **preset text messages** in _ANY_ available language even edit multiple languages.
*   After installing will prompt to perform a Factory Reset to apply message settings (or normal reboot, message setting will not be applied until the system is factory reset).
    *   NOTE: IF _"SKIP CONFIRMATION"_ INSTALL OPTION IS CHOSEN THIS PROMP WILL BE SKIPPED AND FACTORY RESET WILL BE DONE AUTOMATIICALLY

#### **Install Options:**

*   **Build "run.sh"**: Renames "tweaks.sh" to "run.sh" to be executed by autorun
    *   _Must have autorun installed prior to running_
    *   Only runs once when the system is booting up.
    *   Mostly for recovery purposes.
*   **Apps To Resources**: Install App Files To The "/resources" Partition
    *   Resources is about 3GB (rootfs is only about 500MB) mostly used for language files (because some regions have many languages available)
    *   **(v70)** If space on rootfs is low (under 5% free) apps will Be Installed to resources automatically
    *   _Recomended for all app installations_ (checked by default)

#### **CASDK:**

*   In AIO: Help/Controls/Info panel for each app when you click the app's image.

#### **Bug Fixes:**

*   **No More Disclaimer/Order Audio Sources & App List Patch (v59+):** Uses proper Application list structure based on vehicle configuration type (old or new)
    *   **(v70)** Fixed AA/CarPlay button disappearing from statusbar.*   **USB Audio Mod**: Fixed "Powered by Gracenote" text not displaying (normal & custom text)*   **Pause On Mute (v70)**: Installation is skipped for v70+ because pause on mute behavior is built in.*   **Boot Animations (v59.00.502+)** Fixed Custom Boot Animations, v59.00.502+ only one boot animation is used (LoopLogo in AIO Options)*   **tweaks.sh**: Coding/Error handling improvements.
    *   AIO_logs saved in `/bakups/` folder on USB now contain all error output from stdout & stderr
    *   Additional log is created `/bakups/info.log` with some general system information for troubleshooting issues if needed
    *   The Most important thing AIO does is create backups of the original system files before modifying them
        *   If a file backup fails the install will abort with a warning message
        *   This issue was seen on v70.00.021, Backups could not be created due to lack of disk space making it very difficult to revert tweaks.*   AIO will use a default image when no image is chosen in the options (instead of hanging during compile due to missing image file) for tweaks that are expecting an image (Background, Change Blank Album Art, etc.).*   Install Options tab is shown in all applicable views (CASDK, Full System Recovery & autorun).

### v2.8.0

## CASDK

> CASDK is a micro framework that allows developers to write and deploy custom applications which integrate natively into the existing JCI framework without hassle. CASDK simplifies the app development process with a straight-forward, and slimmed down but powerful API. This version is integrated to run AIO apps alongside CASDK apps with no conflicts and imperceptible performance impact. Together they create a unique framework and a new realm of customization and application possibilities.

##### CASDK Comes With:

*   **CASDK Proxy** - Proxy registers both CASDK and AIO apps.
*   **Custom Application Runtime** - A microframework that handles the custom applications during runtime.
*   **Data Readers** - Poll vehicle data an certain intervals (1s, 60s, & 300s)
*   **JS logging** - JavaScript (and CSS) console log is written to /tmp/root/casdk-error.log
*   **LocalStorage** - Moves the save location of localStorage to /tmp/mnt/data_persist/storage/
*   **NodeJS** - Powerful Server-side JavaScript.
*   **ADB** - Android Debug Bridge for Android devices.
*   **Custom Applications** - Apps that run on the CASDK framework

**AIO + CASDK Framework and Apps are installed internally to the 'resources' partition by default, optionally CASDK apps can be run from an SD Card.**

**Native apps installed with AIO (Speedometer, Video Player, AA, etc.) will run on the CASDK framework although apps need to be installed differently with CASDK. The AIO Tweak installer will detect if CASDK is installed when running tweaks and adjust the installation accordingly but older app installers may not work while CASDK is installed.**


### CASDK Apps will be unlockable using codes found @ <a href="" onclick="externalLink('casdk')">https://mazdatweaks.com/casdk</a>

*   Simple Dashboard App will be available by default and 2 more will be available by visiting the blog and entering the codes.
*   I did not create any of the CASDK apps but I did make numerous enhancements and bug fixes, you may report CASDK bugs in the <a href="" onclick="externalLink('issues')">MZD-AIO Github Repository Issues Section</a>.

#### Android Auto Headunit App v1.09 w/ Wifi Support

Instructions For Android Auto WiFi: 0\. Before you start: Activate Android Auto developer mode by going to about and tapping the title bar until it says you are a developer 1\. From Android Phone: Create Hotspot 2\. From Vehicle: Turn on Wifi, connect to phone hotspot 3\. Phone: In Android Auto app go to about screen menu and start headunit server 4\. Android Auto will start automatically, if it does not or you get a black screen you can open Android Auto from the applications menu.

#### VideoPlayer v3.5

*   Fullscreen button toggles: Boxed - Keep Aspect Ratio - Fullscreen
*   Repeat is one button toggles: none - 1 - all
*   StatusBarNotifications for toggles
*   Video title will filter out the extension and turn underscores to spaces
*   Shows gplay error in error message
*   After hitting an error will make up to 3 attempts to re-start the video in 10 second intervals
*   Video Resumes where it left off when shifting out of reverse
*   Added to option "Resume Play" - when checked:
    *   Resumes the video where you left off if it was interrupted or the app was exited while playing.
    *   Saves video list to reopen and resume quickly (reloads if switch to music or press reload button)
    *   If the video is stopped and you are in the list view when you exit you will return to the list when reopened.
*   "Black Out Background" option - Will overlay all other GUI layers leaving only the video and solid black background
    *   If "Title to Statusbar" is checked, Video Title will show centered above video and time in the bottom left corner (but can be toggled with the multicontroller).
    *   This is ON TOP of all layers including the statusbar and bottom controls while the video player background is ON THE BOTTOM of all the other layers
    *   Pausing the video temporarily hides the overlay
*   In VideoPlayer Info panel (tab next to options) will show swap memory data and "unmount swap" button (if swapfile is present) - Makes an attempt to unmount swapfile on shutdown to avoid freezing. NOTES ON SWAPFILE: When using the swapfile it is recommended to use the "unmount swap" button before turning off and shutting down the system. If a significant amount of memory is "swapped" then the shutdown sequence is not enough time for the swapfile to fully unmount and the system will freeze. In the list view long hold down to check how much memory is in the swap cache, manually unmounting a few seconds before system shutdown solves the freezing issue.
*   Added Multicontroller 'hold' actions
    *   While media is playing:
        *   Up - Toggle Title
        *   Down - Toggle Shuffle
        *   Left - Toggle VideoPlayer Background (Behind Layers)
        *   Right - Toggle Blackout Overlay
        *   Select - Toggle Repeat
    *   Video List View:
        *   Up - Open Options
        *   Down - Open Info
        *   Left - Play Next Video
        *   Right - Play Previous Video
        *   Select - Select Last Played Video

#### AIO Tweaks App v0.7

*   Turn Off Display On startup **(Experimental)**
    *   Screen will automatically turn off after boot up sequence is complete.
    *   System will be fully booted before display is turned off
    *   Pushing buttons before the boot sequence is complete may have unexpected effects
*   If the touchscreen is NOT enabled while driving, AIO will display the word "Driving..." (This was to test the new 'Touchscreen While Moving' tweak to make sure I completely stopped the signal from reaching the GUI)
*   Also, will display the word "Stop!" when you stop (This was also for testing intercepting speed signals from the CMU)

#### Speedometer v5.7, Sb Speedo, & Date2Statusbar Tweaks

*   Option: Temporarily hide Sb Speedometer during Statusbar notifications
*   Date to Statusbar is not needed anymore with Sb Speedometer (icons will be moved above clock)
*   Note: If installing SB Speedometer and Date2Statusbar is already installed then reinstall (or uninstall) to update, this only need to be done once.
*   Icons for Trip Dist, Coolant and Intake Temp.

#### Touching Up The Classics

*   **No More Disclaimer & Order of Audio Source List** tweaks revamped and added support for FW v59.00.545+ & v70.00.000
*   Removed No More Disclaimer option 'Reduce Time To .5 seconds' to not complicate compatibility/because it is pointless.
*   Background Rotator window handles errors better and shows error messages when variables are outside of the boundaries. + A bunch of new backgrounds
*   Redone "App List Patch" for v59, this patch is applied during app installation for FW v59 only if both 'No More Disclaimer' & 'Order of Audio Source List' are not installed.
*   NOTE: **When installing apps on v59+ with AIO v2.8.0 for the first time only, "No More Disclaimer" and "Order of Audio Source List" tweaks will need to be reinstalled because of the new patch.**

### 2.7.9

#### Order Audio Source List:

-   Order Your Audio Source List With In AIO
    -   _Finally!!_ No more manually editing the systemApp.js
    -   **NOTE: Although you will be able to order all the values, Some list items may not show for your particular vehicle or region**

#### Speedometer v5.6

-   **Edit all customizations from the AIO interface** - **_Option Panels:_**
    -   StatusBar Speedometer & Fuel Bar
    -   Bar Speedometer Layout
    -   Classic Speedometer Layout
    -   Bar Speedometer Color Themes
    -   Multicontroller Functions
    -   Extra Options
-   Statusbar Speedometer Options
    -   Set all 3 Statusbar Speedometer Values To Anything!
        -   NOTE: There are only 7 icons for 21 values so they are all reused. If someone wants to contribute, some white 32x32px icons would be cool!
    -   Set Interval Of Rotating Values Or Set Only 1 Extra Value to stop the rotation interval
    -   Option To Hide In Reverse - reverse adjusted to accommodate all extra values
    -   Option To Hide When Speedometer App is Open - true by default
    -   Statusbar Fuel Gauge
        -   Positions: Top of Screen, Bottom of Screen, or Below Statusbar
        -   Customize Colors For Each 20% Interval
-   **Bar Speedometer:** layout changes are remembered until reboot
    -   Multicontroller: Hold.select (default) to reset to your default layout
    -   5 Customizable Color Themes
        -   Randomize Colors Button
-   **The Classic Speedometer:** has a different design structure as the Bar Speedometer in that instead of each position being mapped to a location on the screen, it is essentially a stack inside a table.
    -   Customize order of value table stack
    -   Added Fuel Bar to the Digital Speedometer in Classic Mode (bottom left in the previously unused space)
    -   In accordance with the stack model, values are "popped" off the top of the value table and appended to the bottom
        -   Multicontroller: hold.select (default)
        -   Tap the top value will also pop it
-   Extra Options:
    -   Hide Speed Bar in Bar Mode
    -   Start with Speed Bar in RPM Mode
    -   Turn on Counter Animation (Makes output lag by about 1 second because the counter cannot predict the future so it is always a little bit behind while chasing the dragon)
    -   Fuel Gauge Type: (experimental) Fuel Gauge reading will show approximate Gallons or Liters remaining
        -   % (default)
        -   L - Liters
        -   Gal. - Gallons
    -   Fuel Tank Capacity - The Fuel Tank Capacity of your Vehicle in Gal/L (From Fuel Gauge Type)
-   **UX**: Toggle sorting lists by the order number (Auto Sorts when position numbers change)
-   Each panel is saved when compile is run.
-   Each panel can be reset individually or "Reset Options" in the top/side menus will reset all the panels.
-   Dutch Translation by: Taeke

#### Autorun & Recovery - For Serial Connection

-   Recovery files will be copied to "XX" folder be used with &lt;a onclick="externalLink('serial')"these instructions</a>
-   No installer is included, files need to be manually copied from USB Drive to CMU using a connected computer.
-   **Only for gaining access via serial connection.**

##### Tweak Installer Changes/Fixes

-   Fixed the NodeJS code to handle all errors and repair broken installations
    -   Removed the short lived "Use legacy install" because the new method will repair errors if they exist.
    -   This should solve the apps disappearing from the app list issues and fix all other app installation/uninstallation issues too.
-   One additional file (/jci/opera/opera_dir/userjs/aio.js) is installed with apps containing some global AIO helper functions
    -   Separated from additionalApps.js to maintain backward and cross compatibility (with CASDK, cmu-opkg, and other older community developed mods/apps that install old versions of additionalApps.js will not break the new apps)

##### One More Thing

-   Added "Load Last Compile" to the top menu and context (right-click) menu.

### 2.7.8

#### Speedometer v5.5 - All In One Speedometer
- Analog, Modded and Bar Speedometers are now All In One!
- All options are available and will be applied to the proper Speedometer
- Choose which speedometer to start with by default (if starting with Bar Speedometer other options will still determine the starting state of the Classic Speedometer)
- The speedometer-config.js file now has all the options, set a variable to determine if override values are used or installed options.
- Invalid Values Show "---" Such As Gear Position/Lever for Manual Transmissions
- Toggles will Show The Action In A Statusbar Notification
- Hold "Up" on multicontroller to switch between Classic and Bar Speedometer Mode
- Hold "Down" in Classic mode to switch between Basic and Modded Speedometer (Basic is only analog with no toggles except long holds to change to Modded or Bar Speedometer)
- Modded Speedometer (in Classic mode):
  - Single click "Up" to increase size of values
  - Multicontroller "Select" toggles between Digital and Analog speed
  - Single click "Down" to show alternate values
- Bar Speedometer:
  - Configure The Amount of Bottom Rows in "speedometer-config.js" (Default 4)
  - Hold "Down" to show/hide speed bar
  - **TAP Any 2 Values To Swap Their Positions!**
    - Any Values Can Be Swapped Even The Main
    - When The Main Value Is Swapped An SBN Will Show With The Value Name
    - Tap Below The Bottom Row To Swap Hidden Values In Other Rows
    - Tap Selected Value Again To Cancel

#### AIO Tweaks App v0.6
- "Reverse App List" button - Reverses the Applications List (resets on boot).
- "Unmount Swap" button - Unmount a mounted swapfile

#### Test Mode (T/M) Button [(Thread)](https://trevelopment.win/jci-test-mode)
- Included with the **1 Second Diagnostic Menu** tweak because it is part of the Diagnostic App
- In v59 "JCI Test Mode" was disabled in the Diagnostic App
  - This tweak brings back Test Mode for v59
  - Makes it easier to get to in v55-v58 (Just press the T/M button)
- Once Test Mode is started type 11 to open the well known Test Menu
- **_BE CAREFUL IN TEST MODE, DON'T DO ANYTHING YOU ARE UNSURE ABOUT!_**

##### Tweak Installer Changes/Fixes
- App install/uninstall now uses NodeJS to add/remove from app list
  - Allows for cleaner installations
  - Backward compatible
  - Solves the issue of all apps disappearing off the app list when only 1 is uninstalled due to improperly formatted JSON file
  - "_Legacy App Install_" in install options to use the old method (using bash)
    - The only reason I can think of for this is if you already have an improperly formatted JSON file then you need to uninstall all apps with legacy installer because the NodeJS code will throw an error.  Other than that the NodeJS code will never cause an improperly formatted JSON file.
  - *Note: NodeJS will run from the USB drive, Coming Soon: Install NodeJS to the system*
- Cleaned up installer code
  - Removed some superfluous code
  - Fixed many inconsequential errors

### 2.7.6

### MZD-AIO GUI Changes/Fixes:
- Fixed "Bootbox is not defined" error preventing AIO from running for some.
- Alternate Layout Toggle (Full Width Tweak Choices & Options)
- Changed Up Notification Style
- Phase 1 of GUI Style Redesign
- Autorun & Recovery and Full System Restore links in dropdown menu by "Start Compilation"
- Home Button brings you back to main page. (if you ever wondered what that was for)

### Video Player v3.3.1
* Fixed the unicode list retrieve and removes the "only unicode" method
*	Disabled the log functions as they are not needed now
* Video Name shows in a Statusbar Notification at the beginning of each video
*	Now it takes the time from gplay app
*	**Music player with MP3 & FLAC support** (From the Music folder on the USB Drive).
*	Adds the FLAC codec to the gstreamer libs
*	It shows the metadata of the files when playing music
*   Other small bug fixes
> * __*Pause Audio Hack*__
      * **Pressing the "Entertainment" (Music) button will pause audio**
      * **This only works ONCE AFTER OPENING THE VIDEO PLAYER APP AND BEFORE PLAYING THE FIRST VIDEO**
      * **Audio has to be playing from USB or button will function normally**
      * After it has been done once or the first video is played the entertainment button will function normally
      * You will see a split-second context change... that is the only way I could get the audio to pause.

### AIO Tweaks App v0.5
- Fixed The Freezing Issue
- Added SBN Test Button (Status Bar Notification)
- ADB Button ($ adb devices -l)

### Speedometer v5.1
- Added values (set in "speedometer-config.js")
  - Battery SOC (State of charge iStop only)
  - Engine Load (Only shows 0 or 1 for now)
  - Gear Lever Position
- Gear Position will show correct gear for Manual Transmissions (delayed by 1 second)
- Fixed non working values (idle time, engine idle time, engine top speed)
- To reuse current "speedometer-config.js" file just delete "config/speedometer_bar/speedometer-config.js" before installing
- CHANGED: WebSocket port from 55554 => 9969
- CHANGED: Multicontroller Tilt Down Now Toggles the SPEED BAR from Vehicle Speed to Engine Speed

### USB Audio MOD
- Statusbar Notifications On Every Screen At The Start Of Each Song!
  - SBN for 5 Seconds: "Artist - Song"
  - Not Android Auto Screens (Sorry its not possible to cross surfaces like that)
- Change the "Powered By Gracenote®" flash text to whatever you want!
  - Clear text field blank to disable altogether.
  - If flash text is not showing, genre will show on that line for about 10 seconds (If it is in the metadata)

### Other Changes/Fixes
- *Tweak Installer:*
  - When installing apps, all common files (addon-common and opera folders) for are now in /config/jci/...
  - Cleaned up app install scripts to be more uniform and efficient
  - No more app list patch for v59! (Apps are added to the app ctxt list dynamically.)
  - Log files are saved in bakup folder so they are not lost if install accidently runs twice
- *Other Tweaks:*
  - Added Language Support for 'Reverse Camera Safety Warning' Tweak
    - Ukrainian, Japanese, Chinese, Korean, Thai, Hebrew, Swedish, Slovak
  - Added Ukrainian to 'Remove Message Replies' Tweak

### 2.7.4

##### Android Auto v1.08
- Fixed music not resuming after phone calls
- More code optimizations
- Navigation Fixes
- All Audio Focus transitions are smooth

##### Speedometer v5.0  
- Major performance improvements to all styles and variants. (All variants use the same data collection script)
- Every variation value is configurable and toggleable
  - Added option for starting temperature (&deg;C &amp; &deg;F)
  - and fuel efficiency (km/L &amp; L/100km)
- **Digital Bar Speedometer Mod**
  - 4 values in the right column
  - Cycle through 3 groups of 5 values on the bottom row.
  - Including Main speed that's 20 values!
  - Command knob "select" to change bottom bar values.
  - Tilt up to toggle mph & km/h
  - Tilt right to
    - Toggle km/L & L/100km (in km/h mode)
    - Toggle &deg;C &amp; &deg;F (in mph mode)
  - Tilt left to toggle background.
  - Tilt down to toggle the speedometer in statusbar extra values between Heading/Altitude & Temperature/Fuel Efficiency
  - Fully Customizable - Value positions can be customized in and easy and intuitive way
    - Instructions Included in Speedometer Options (When Bar Speedometer is Selected)
- **Speedometer in Statusbar Alternate Values**
  - Outside Temperature & Current Drive Fuel Efficiency
  - Tap the statusbar speedometer to toggle the extra values (same as tilt down when speedometer is open)
- **Digital Clock Mod**
  - Use the font from the digital bar speedometer on the statusbar speedometer & clock.

##### Video Player v3.2
*	I need a lot of color in my life so now you can choose between 8!
  * Red, Green, Blue, Violet, Orange, Teal, Slate, and White.
* Merged improvements by *VIC_BAM85*
  *	Sort order now is case insensitive (only for ASCII mode Not Unicode)
  *	You start with selection on the last played video
  *	Small fixes on the FF / RW in order to make only one call
  *	Added a plugin to the cmu in order to allow fullscreen toggle (commander up while playing) so it changes while playing the video, resize and rotate (not available on the GUI yet)
  *	Delete the gstreamer registry on start in order to fix the plugin repository (Resets to the one without the codecs at car restart)

##### Swapfile
- Fixed swap memory mounting on boot
- Improvements to how swapfile is mounted and order of apps initializing during boot

##### All Apps
- Now use built in framework transitions for smoother opening and closing
- Improvements with initialization methods & startup scripts

### 2.7.2

##### Android Auto v1.07
- Bluetoth Calling & Video Focus Issues *__fixed__*
- Making and receiving calls work perfectly
- Release Audio Focus (To Radio, USB Audio, etc.) with FAV (<span class="icon-star"></span>) Button
- Control USB Audio with Next/Prev steering wheel buttons when it has Audio Focus
- Fix for GPS, Mazda Navigation and HUD features will now function correctly
- Black screen issues are memory related and can be avoided by minimizing the amount of memory being used by the system. This can be done by:
  - Removing Nav SD card and other connected USB devices.
  - Speedometer and CastScreen apps use active memory, uninstalling them will improve AA performance.
  - Reboot the system, connect your phone after reboot.
  - Use the Swapfile for additional memory.

##### VideoPlayer v3.1
- Fully Multicontroller Navigable
- Navigate "Video Options/Info" panel with Control Knob.
  - Rotate to choose
  - Push to toggle option
  - Tilt up/down to close options/info panel
  - Tilt left right to choose between info and options
- Change Highlight Color
  - Choices: Red, Blue, Green, Pink
- Fixed bug: random never played the last video in the list

##### AIO Tweaks v0.4
- Mount SwapFile
  - Mount an unmounted SwapFile
- Some shell commands with output (command shown in message when one is used)
  - Running Processes: ps
  - Disk Space: df -h
  - Memory Info: cat /proc/swaps && cat /proc/meminfo
  - E-mail me for requests/suggestions
- Select Tweaks with command knob
  - Rotate to choose
  - Push to Select
- Scroll message box by rotating/tilting command knob
  - Tilt up at the top and pushing select close the message box
  - Tilt up to reopen
  - Works well when checking headunit.log
- Irrelevant options are now hidden
  - Ex: If CastScreen is not installed the CastScreen Start/Stop options will be hidden
- General little fixes
###### There are MANY failed legitimate attempts in the AIO Tweaks App code, most notable of which include "Show Backup Camera," "Take Screenshot" and global "Pause/Play Music". If you think you can get something to work that I have not, go for it!

##### Speedometer to StatusBar
- Now Speedometer to StatusBar moves the 'volume meter' and 'contact loading meter' a little bit to the left so they do not overlap the numbers.

#### Swapfile
- Choose to mount on boot (on by default) or copy without mounting.
  - Mounted automatically when starting the VideoPlayer App
  - Can be mounted manually with the AIO Tweaks App
  - **Swapfile can be copied by itself onto the root of a separate USB drive containing music and/or videos and mounted during run-time as needed**

#### App Changes
- Skip Confirmation choice will persist

### 2.7.0

##### Android Auto v1.04
- __*Bluetooth Call Bug Fixed!!!*__ *Big thanks to @lmagder for fixing the headunit code after @Trezdog44 found the root of the issue with the 'Bluetooth call patch'*
- Video focus is lost at the beginning and end of a call due to the system expecting a context change.  Press the FAV (<span class="icon-star"></span>) Button to get video focus back and AA will function normally.
- Phone button opens AA phone screen, also call buttons work for answering and ending calls.
- N\AV button opens the AA home screen
- Tap the black box on the credit screen to display contents of the headunit.log file.
- Added the Android Auto Icon to the statusbar
- (The 'Bluetooth Call Patch' from AA 1.03 is no longer needed from this version on.)
  - (If it was applied will be reverted back to normal)
##### VideoPlayer v3.0
- Gave the VideoPlayer its own Icon
- Toggle Unicode Mode On/Off with "U" Icon (If you have a lot of videos you will see the difference in load time)
- Information/Options Panel, Open/Close with "i" Icon
- Close by pressing command knob
- Option: Hide/Show Unicode button
- Video Title to Statusbar
- Test Error Message
- I put this in for me to test the error message because all my videos are formatted **360p MP4 H264 AAC** so I rarely hit a memory error.
- Select options with left/right now includes reboot, show/hide background and info/options button.
- Memory Error Message is now very informative
- Offers Suggestions to Avoid Future Errors
- Changed highlight color to blue

##### AIO Tweaks v0.3
- Start Headunit Process
  - Will now successfully Start Android Auto Headunit Process
  - Also Active Headunit stdout will pop up
- View Headunit Log
  - Shows the existing headunit.log file in a window
- Screen off
  - Turns the screen off
- wifiAP
 - Starts Wifi Access Point
   - (start_wifi.sh; jci-wifiap.sh start)
- Stop Firewall
 - Stops the firewall
   - (jci-fw.sh stop)
- System Restore *WARNING: This will remove all tweaks and uninstall all AIO apps*
  - Restore you system on the fly with a slimmed down restore script
  - Removes all tweaks and AIO apps including this one
  - Does not restore Color Scheme (all those image files take up a lot of space)
  - Very small and safe only targets and restores from internal backups.
  - Asks for verification twice to ensure it is not accidentally run.
- Env - Environment variables
  - For informational/educational purposes
  - Also used by developers for fun times
- Fixed saving issue with the tweak toggle buttons

- General Improvements/Bug Fixes
 - On Startup looks for some AIO log files loads FW version if found.
  - If FW version is found An "i" Icon will appear in the top menu bar to the left of the "reload" icon.
  - Click the icon to show your FW version, future plans to display more pertinent information as well.
 - Added Save Button to Success Dialog
 - Added To Top Menu "Downloads > Check For Update"
 - Small logging fixes in autorun and recovery scripts
 - Fixed WiFiAP files not copying when it was the only autorun script chosen
 - Many other small improvements/fixes

### 2.6.8

- New Install Option: **Retrieve CMU Data**
  - Changes the 'no's to 'yes' in dataRetrieval_config.txt
  - Dumps diagnostic and error files from CMU data partitions
  - Good to do every once in a while, cleans the system of error and log files.
- Autorun Change: Choose options after pressing 'autorun' button.
  - Options:
    - ID7_Recovery Scripts Pack
    - **Automatic WiFi AP**
      - Starts WiFi AP on boot starts DHCP Server IP: 192.168.53.1
      - MUST change values for 'YourSSID' &amp; 'YourSSIDPassword' to run.
        - AIO will prompt for these values and apply them while building installer.
    - **SSH Over ADB**
      - Starts ADB Server on boot starts ADB reverse porting SSH on port 2222.
      - Over a USB cable it is the fastest connection.
- AIO Tweaks App v0.2
  - Shortcut to WiFi settings
  - Fixed 'Bigger Album Art' toggle
  - Adjusted the 'enable touchscreen' buttons so they can be tapped, its still in the air how well they work since the vehicle has to make a complete stop to apply changes.

- Cleaned up logging a bit
- Announcements (aka The Emergency Broadcast System): Each announcement will show once in the "Selected Tweaks" sidebar until it is hidden.  
  - You can view the announcement again from the help menu.
  - This is because communication needs to happen more quickly and directly.  You better believe Visteon has someone checking this app and in all the forums daily and reporting back to keep up with us so if we want to keep the upper hand our communication needs to be just as fast.  Everyone needs to know right away if there is a critical change or update to look out for, this is the way we will minimize damage and loss of access for the community as a whole.
- Fixed contact form not sending the email but still reporting success **Sorry if you tried to contact me with the feedback form recently and I didn't answer your email, I just didn't receive it**
  - Now it will only say successfully sent if it actually was sent and prompt to fix the contact form if any values are not valid.
- AIO Docker Build for Linux
  - Running the Docker script builds a container with all dependencies and spits out a .deb Linux installer for MZD-AIO-TI in the root directory.
  - Big Thanks to Xep and Khantaena for that

### 2.6.6

##### ID7_Recovery Pack - A collection of autorun scripts that will lay dormant until needed for recovery.
**These scripts will persist through a Firmware update.  On each boot they check, and if necessary repair the following files:**
- SSH access
  - passwd
  - sshd_config
  - firewall
- Ability to run `tweaks.sh`
  - add udev rules
  - watch for existence of tweaks file to run (every 5 seconds)
- Search and if present run script `run.sh` from the root of SD card
  - OR search and execute `run.sh` from the root of a USB Drive

*ID7_Recovery Pack will lie dormant until it has detected that one or more of the above files have changed, this will trigger the repair of the targeted files.  __It is recommended to install this pack BEFORE updating firmware or anytime as a safety net.  This script will ensure that SSH access will be automatically restored if it is lost for any reason__*

### 2.6.4

### CMU-Autorun - _For Testing and **Recovery**_
- Autorun Installer - Install the autorun script **BEFORE** updating to v59.00.502 to **recover your system** and regain access after the update is complete.
- There is *no harm, performance impact, or danger* installing the autorun script and not using it until it is needed.
- If there is no `run.sh` script file available at the root of the SD card or USB drives the script silently does nothing.  
- Ultimately it is a good idea for everyone to install because it provides an additional layer of safety for system recovery in any situation.
- More to come in the next AIO update, for SD card scripts to use with autorun check out the [CMU-autorun repository](https://trevelopment.win/cmu-autorun "CMU-autorun Repo")
- *Make sure you check the forums* before allowing an update to an unknown firmware version to ensure this and other known workarounds have not been closed.

#### AIO Tweaks App!
##### This is an experimental app that I made to test the limits of app functionality.  For each success there were several failures.
###### **Every function in this app is _not_ guaranteed to work** but here are some useful and/or fun things you can do:
- 'Apps' Tab:
  - Home: Goes home. This was the easy part.
  - Go to: USB A, USB B, Bluetooth (audio context).
  - Previous, Next - Works without changing contexts
  - Stop (and Start*) Android Auto Headunit process.
    - Killing headunit process with allow Bluetooth calling to work correctly.
    - Starting the process does not work properly yet, reboot CMU to restart headunit process.
  - Stop and Start Castscreen Receiver
    - Useful for troubleshooting if it is not functioning correctly.  
    - Both of these do work but there is a possibility that a memory issue may prevent the process from properly starting in which case a reboot is required to allow the process to run.
- 'Tweaks' Tab:
  - Many familiar AIO layout related tweaks that can be applied on the fly
    - Applied tweaks are automatically saved to localStorage and saved tweaks are applied on boot.
    - Toggle each individual tweak on or off.
    - One button to reset all tweaks.
    - *NOTE: AIO Tweaks App will not UNDO installed tweaks, they will mix and may result in unexpected and/or interesting layouts*
- 'Options' Tab:
  - Touchscreen: *NOTE: Changes to the touchscreen functionality are applied when the vehicle comes to a __COMPLETE STOP__*
    - Enable Touchscreen and Menu
      - Normally disabled menu items while driving ie. Text messages & enter address for navigation,
      - Compass is disabled
    - Enable Touchscreen and Compass
      - Compass is functional
      - Menu items are disabled
    - Disable Touchscreen
      - Touchscreen and Menu Items disabled
      - Compass is functional
  - Reset Background: Reset to the first background.
  - Reboot: To Reboot

###### Speedometer
- Choose speedometer color independently of theme color
###### Speedometer Variant
- Press Command Knob or Tap 'Total Time':  Reset 'Total Time,' (to 0) 'Ave. Speed,' 'Top Speed,' (to 0 or current speed) and both idle time fields (reset to 0 view will reset when vehicle is idle again).
- Tilt-Down or Tap 'Top Speed': Toggle hide/show for both idle times and increase the font-size of all other fields.
- Tilt-Left: Digital Speedometer
- Tilt-Right: Analog Speedometer
- Tilt-Up: Toggle between mph and km/h

### Bug Fixes
- Fixed Bug with Apps randomly disappearing from App Menu effecting v59.00.400 - v59.00.450
- Fixed bug where after running the 'Full Restore' Script, 'Android Auto' could not be reinstalled.
  - Applied fix to both the 'Full Restore' Script and 'Android Auto' Install Script

#### 2.6.1

###### CMU-Autorun
- Linked in the "download" menu & "Help Panel > Tips & Tricks" - Installer/Uninstaller is in one script.
- For advanced users - This script has no protection any code in \"run.sh\" will be executed each time the system boots up.
- The reason autorun script installer will not be tweak choice in AIO is because it requires a higher level of awareness of what you are doing.
- In the "Help Panel > Tips & Tricks" Section instructions how use autorun to run Android Auto from an SD card or USB drive.
- Runs every time the system boots up, after running SD card will have a "log" folder containing the headunit log file.
- Additional autorun scripts include a memory logging script and a script that takes and saves multiple screenshots in intervals.

###### Tweak Fixes  
- Fixed Bug with Apps randomly disappearing from App Menu effecting v59.00.400 - v59.00.450
  - (Reinstall "No More Disclaimer" and/or "Order of Audio Source List" to apply fix)
- Fixed Smooth color themes changing background when "Use Color Scheme Background" option is not checked.
- Applying color scheme will no longer overwrite custom blank album art or custom off-screen background.

###### App Fixes  
- Many small cosmetic fixes & code cleanup
- Cleaned up and Updated all Node packages/dependencies to latest versions

#### 2.6.0
### **NEW TWEAKS:**
- **USB Audio Mod** | *By: Enlsen*
  - Long press folders/all songs in list view to play
  - Adds folders button
  - Removes "More like this" button
  - Adds new icon for USB root button
  - Set folders and song list icons correctly (were switched)
  - Removes trailing "/" from folder names for list view and title of now playing
  - Adds folder and song icons to the list view
  - Adds folder and playlist icons to now playing
  - Medium Album Art (180 pixels)
> Bigger Album Art Tweak
>   - Will make album art even larger (210 pixels)
>   - Stretch smaller images to enforce bigger size
>   - More Space For Long Titles (Folder, Song Title, Album etc.)
>  - **Full Width Titles** Option
>    - Titles will span the entire width of the screen.
>    - Will overlap album art if not hidden
>  - **Hide Album Art** Option
>    - Hides all Album Art

- **No More Beeps**
  - Disables All System 'Beeps' (Those that are not be silenced by 'Settings > Sound > Beep' option).
  - 'Improved List Loop > Remove List Beeps' option is redundant but only disables list scrolling Beeps, I see no reason to remove it.
- 'Remove Background Behind Buttons' is now **'Remove Background Overlays'** Options to Remove the Following Background Overlays:
  - Behind Buttons (Original Tweak)
  - **Now Playing** (Entertainment)
  - **List View**
  - **Text Message View**
  - **In Call** (Active Caller Background)
- Options Under 'Main Menu Tweaks'
  - Main Menu Layout: **FlatLine**
  - Main Menu Text: **Color Text** & **Hide Text**
  - Smaller Coins > **Small Focused Coin**
  - **Remove Glow** (Behind Selected Coin)

##### Simplified Compatibility Check:
  - Checked by Compatibility Group Based on FW version
  - For better readability and to extend compatibility to cover all FW in the known groups.
  - Compatibility Extended to: (Flavor and Region letters are irrelevant for these checks)
    - Group 1 = All v55 & v56
    - Group 2 = All v58
    - Group 3 = All v59.00.300 - v59.00.399
    - Group 4 = All v59.00.400 - v59.00.499
  - A few specific checks are still done by FW these so certain tweaks may not install on unknown versions.
  - Other than v59.00.500+ and v54- if you have a firmware version that does not fall in those ranges email me but I think that covers all of them.

###### Bug Fixes & Changes
- Wifi will now be enabled for Japan and NorthAmerica (From this point on Wifi is enabled for all no matter what region, previous installations are not be effected)
- 'Remove Message Replies' now also removes the TTS Message "End of the message" After Reading a Text Message.
  - Must factory reset __*ALL settings*__ after installing to apply changes
- Fixed Bug where Install/Uninstall for 'Improved List Loop' would uninstall 'Shorter Delay Mod' and 'No More Beeps'
- Moved some of the tweaks around in the list
- Merged Windows, Mac OSX, and Linux projects into one so they are all on the same version. Required changes and improvements in the tweak building process and platform checks.
- Full Restore Script can be accessed from the left side navigation menu

#### 2.5.10
-  Reworked v59 App List Patch
  -  Pro: Menu structure will no longer be broken (VSM submenu will be restored)
  -  Con: All apps that can come up on the list need to be added to the 'additionalApps' array in systemApp.js (I included every app I have ever seen or heard of including CASDK apps in the array you will only need to add custom developed apps)
-  Patch to Full Restore Script to prevent potential bootloop when running with 'delete backups' option several times in a row.
-  Replaced missing speedometer images
-  Adjusted CastScreen, may fix issues for some.

#### Bug Fixes
- Replaced Missing Speedometer Images.
- Choosing Speedometer in Statusbar will auto-select Date to Statusbar Mod

#### 2.5.9  
#### SSH_Bringback:
- A second root user/pass - jci/jci is now added.
- This is to give AIO a unique user to check the passwd file to ensure SSH is actually re-enabled.
- Added 'Force SSH' option that will force update SSH settings. For FW < 56.00.511 this will change the root user to cmu (and add second root user jci).
  - I personally did this on my v55.00.753A-NA and added a few of my own root usernames as well.
- For more information I am adding a 'Pro Tips' page to MazdaTweaks.com The first entry will be about the importance of SSH access + how to add your own user/pass to your system.  
#### JCI backup
- Zip Backup Option
  - Creates a .zip file containing your backup JCI folder
  - Takes longer than a regular backup
  - You cannot create both a regular backup and a zipped backup in the same installation, that would take a very long time.
- When an unknown firmare version is encountered AIO now does one of 3 things:
 - If FW < v55: Shows user a message that AIO is not compatible and they need to update to FW v55+ to use AIO.
 - If FW >= 58: Shows user a message that AIO is not compatible and a choice is given to make a JCI backup and instructions on where to send it to test for compatibility.
 - If FW = 55 or 56: All FW v55 & v56 will pass the initial compatibility check but **may not pass compatibility checks for certain tweaks** meaning those teaks will be skipped during installation.
  - Email aio@mazdatweaks.com if you need assistance with an incompatible firmware, unless you are have FW less than v55 then just update to v55 or higher.  
##### Added Compatible FW:
  - 59.00.446A-NA
  - 59.00.450A-NA
  - 59.00.447A-EU
  - 59.00.449A-EU
  - 59.00.449A-ADR
  - 59.00.450A-ADR

####  2.5.6

- PATCHES:
  - Fixed the Error Message Display in the VideoPlayer
    - It says to reboot your CMU but sometimes exiting and reopening the app is enough
    - Of coarse if it keeps happening then reboot
  - Fixed a typo in the 'order of audio source' tweak
  - Fixed transparency in images when resizing especially 'blank album art'
    - Electron changed something in the resize API, now its faster. Cropping may be coming soon too!
  - Fixed Boot Animation compile failing whey no option is chosen
  - Temporary Remove Criss-Cross Boot Animation (Not Working)

#### 2.5.5
- **VIDEO PLAYER V2.9**
  - Full multicontroller functionality
    - Scroll and Select Video List (cw/ccw - select)
      - List looping in selection and playback
    - Scroll and Select Options (tile-right/left - select)
  - Previous track
    - Play Previous Video
  - Repeat all option
    - Recently Played Videos are not repeated in shuffle mode until the entire list is played.
    - Toggling Repeat All will clear recently played videos list.
  - Save Configuration To Local Storage
    - Utilize the CMU's Local Storage to save options even after a reboot.
    - All option choices AND recently played video list are saved to local storage.
  - More Touch Controls During playback
    - Control next/prev/ff/rw and more by tapping sections of the touch screen.
    - See [Touch Screen Control Map](app/files/img/scrnCtrlMap.jpg) for details
 - Removing Navigation SD card **will improve video player performance** this is due to the memory issues that exist within the MZD system.
 - Installation of the swapfile will also improve performance, swap mounting has been improved.

##### Want more info on the Video Player? Check out the [Video Player Repository](http://trevelopment.win/videoplayergithub)

- **CUSTOM BOOT ANIMATIONS**
  - Change all or part of the boot animation (Default 'Disabled' Animation Uses Default LoopLogo for all 3 parts of the sequence allowing for the shortest boot time the illusion of no boot animation)
  - Boot Animation Sequence Goes: LoopLogo[1] => TranLogo[2] => TranLogoEnd[3]
  - Choices:
    - Mazda Logo (Default LoopLogo) [All]
    - Matrix [All]
    - Mazda Z Loop [All]
    - Large Mazda Tran [All]
    - Mazda Cinema [Loop - 1 & 2, end 3]
    - Criss Cross [Loop - 1 & 2, end 3]
    - Mazda Race [Loop - 1 & 2, end 3]
    - Fiat Logo [1]
    - Spider 124 Tran [2]
    - MZD Title Slam [3]
    - MZD Space Logo [3]
    - Car Flash [3]
    - Default Animations Are Also Included As Choices
  - *In App Preview of Boot Animation*
___
- BUG FIXES / CHANGES
   - Fixed error when choosing CarOS theme
   - Improved SwapFile Mounting
   - SSH_Bringback is now selected by default
   - App List Patch is automatically applied to v59 when installing apps if no-more-disclaimer and order of audio source list are not installed
   - Some Layout Improvements
   - Media Order Patch and FLAC Support can be chosen under 'Advanced Options'.  Wifi and SSH are FORCE INSTALLED if this tweak is chosen.
 - **Unconfirmed Fix For CastScreen**
   - **Adds Port 53515 (ADB Default Port) To Firewall IPTables Accepted Connections**
   - If this fix works for anyone let me know.

___
#### 2.5.0
## IMPORTANT: DUE TO A [DMCA TAKEDOWN](http://trevelopment.win/DMCA) ALL FILES ASSOCIATED WITH THE SPEEDCAM PATCH, NNG, IGO AND ANY NAVIGATION PATCHING TOOLS ARE NO LONGER AVAILABLE WITH MZD-AIO-TI.
### This will allow for continued development of this project without infringing on the copyrights of NNG Kft. and potentially causing the company to target developers and/or users to sue for Copyright Infringement.  Additionally, no information regarding speedcam or navigation patching will be available or provided through MZD-AIO-TI or any associated developer of MZD-AIO-TI.
##### **Uninstall for speedcam patch will be available but is _deprecated_ and will eventually be removed**
**Thank you for your cooperation reguarding these matters**
___
##### 2.4.3
- VIDEO PLAYER MUTICONTROLLER!
  - ButtonPress = Play/Pause
  - Tilt-Right = Next
  - Tilt-Left = Stop
  - Tilt-Up/Down = Scroll Video List
  - Rotate-CC/CCW = RW/FF
    - RW/FF Frame skip time lowered from 30s -> 10s
    - Because with the wheel rotation, 30 second jumps are too much
- Speedometer Variant Option:
 - Start App In Analog Mode
##### 2.4.2
- Reverted Compatibility for 'Media Order Patch & FLAC Support' tweak.
  - Compatibilities with issues are neatly commented out in the code for  testing purposes.
  - Toned down the warning message.
  - I appreciate all those who help out on this issue, Lets try getting these compatibilities all straightened out.
- Choosing 'Media Order Patch & FLAC Support' will auto-choose SSH_Bringback (It can be unselected but that is not recommended).
- Speedcam Patch Compatibility should be ok but should be **considered a beta test for FW. ver. 59.00.411A-NA & 59.00.443C-EU.**

##### 2.4.0 Release
- **Android Auto Bugfixes**
 - re-enables the dialer interface if the phone is paired and connected to the headunit via BT (Not Completely fixed, Still an Issue)
 - fix issue for screen corruption with backup camera
 - Increase the size of the USB receive buffer to 16384
- I was a little nervous while confirming this because I have run AIO in my car hundreds of times - To apply "Remove Message Replies" tweak you **must factory reset your settings after installing**.
  - Since nothing bad happened to me after countless experimental system modifications, it is unlikely that factory resetting options would cause any damage.
  - Edit messages for your language in blm_msg-system.xml to start with your own preset messages.
- 2 new smooth themes by Zephnath
 - Smooth Azure (Blue)
 - Smooth Violet (Purple)
- Added Compatible Firmware: v56.00.403A-JP
- SSH Bringback
 - Compatibility extended to all FW v56.00.511 - 59.00.443 (Prior to v56.00.511 SSH is already enabled)
 - New user/password will persist through firmware upgrade. [For More Information View This Infotainment Project Thread](http://trevelopment.win/SSHBringback)
  - New User: cmu
  - Password: jci
 - *New Username and Password will only apply to installations from this point on*
- ~~Media Order and FLAC Support Compatibility:~~
 - ~~59.00.330A-ADR~~
 - ~~59.00.342A-ADR~~
 - ~~59.00.441A-NA~~
 - ~~59.00.443C-EU~~
- Speedcam Patch Compatibility:
 - 59.00.441A-NA
 - 59.00.443C-EU
- UI Fixes
  - Fixed some colors in Dark Mode.
  - Bits of Resizing and shifting.
  - Font change.
___
##### 2.3.6
- Fixed Android Auto Install To Clean Up Old Config If Already Installed (Causing "Can't connect to headunit process" Error)
- Added Speedometer Variation By: pnedkov
 - Tap Screen To Switch Between Analog & Digital Style Speedometer

##### 2.3.3
- Fixed Android Auto Install
- Moved Backup options to a Pop-out 'Install Options' panel on the top-left side
- Added a 'Skip Confirmation' Option (Also in the Install Options Pop-out Panel)
- Added a 'Compatibility Check' view to clarify Compatibilities (Under the 'Help' Menu)

##### 2.3.1:
- Fix Bug with Compass and Speedometer in v59+ (noNavSD = true;)
- Added 'Remove List Loop Beep' Option

#### 2.3.0:

##### Video Player v2.7 Update - IS AWESOME THANK YOU VIC_BAM85!!!
- New Controls in full screen mode:
 - Tap (& hold) left side to rewind
 - Tap (& hold) right side to fast-forward
 - Tap center to pause-play
- Works better and Looks better too!
- No need to uninstall, just install over old Video Player to update

##### Android Auto v1.02 Update - By: Khantaena
- "Android Audio" menu option no longer starts the process, instead it tells the phone to ask for video focus again if you have pressed the physical "Home" button and left the AA UI.
- Refactor code into a long-running service that starts on CMU boot. Allows auto-start on phone connection.
- Fix bug in focus handling when the audio focus is lost externally. No longer gets stuck unfocused
- Audio and video focus can now be gained/last at will and restore previous focus. This allows you to play the radio but also receive navigation prompts (for example) or use the CMU UI while playing music via AA.

##### NNG Patch Tool v1.4 Update - By Modfreakz!

##### 6 New Themes
- Smooth Red
 - Fully Smoothed Out Theme Changes Everything - Very Awesome
- Storm Troopers
  - Storm Trooper Style Coins
- Poker
 - Playing Card Coins
- Mazda Logos
 - Mazda Logo Coins
- Floating Logo
 - Invisible coins - Selected Coin shows Mazda logo
- X-Men
 - X-men Character Coins

__Mix and Match Themes with Main Menu Layouts.__

_Pro Tip -_ Install partial color scheme by deleting some of the images before installing.  
##### Custom Theme Support
- Download any premade theme and use with MZD-AIO-TI
 - Download from: [List of MZD Themes](http://trevelopment.win/MZD-themes)
 - Forum: [Corwin9s's Themes for MZD Connect](http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/186218-corwin9s-s-themes-mzd-connect.html)
- Install your own custom made theme

###### New Backgrounds
- To go with the new Themes

###### Bug Fixes:
- Fixed Semi-transparent-parking-sensor Uninstall (Replaced All Missing Images)
- Some Tweaks not showing for certain languages

**Compatible Firmware Version: 56.00.514A-ADR**
___
#### 2.2.4:
 - Better Comments - If You Like To Look At The Code
 - Fallbacks Are Commented Out - So If You Really Need One You Can Get It
  - This Leaves Only One Assumption That AIO Follows: Any File That Has Been Modified Will Have A Backup Of The Original As A .org File.
  - The Only Way This Assumption Is Broken Is If Modifications Were Made To A File Before AIO And No Backup Was Created.
- Italian Language For Speedometer App
- _Option For Touchscreen Tweak:_ **Fix Cluster Compass**
 - Some Settings Will Be Disabled While Driving But The Touchscreen & Compass Will Work.
- _Option For Main Menu Tweaks:_ **Smaller 'Coins'**
 - Half Sized Main Menu Coins.
- _Backup Saving Options:_ (Image File Are Not Backed Up)
 - **Copy Backups:**
   - Copies The .org Backup File Of All Modified Files To Your USB Drive
 - **Test Backups:**
   - Some Tweaks Will Copy Before And After Copies Of The Files They Modify To Your USB Drive.
- Updated The Translator
- Updated Remove Message Reply File - Deleted Unnecessary Line Breaks, Might Get It To Actually Work Soon
- Added Compatible Firmware Versions
 - 58.00.251A-ADR
 - 59.00.342A-ADR
 - 59.00.442A-ADR
 - 59.00.443C-EU
 - 59.00.443C-ADR
- Small change to build logic - All relevant option variables are loaded at the beginning of the tweaks.sh

#### 2.2.0:
**MAJOR CODE REFACTORING**
###### Tweak Files - All around improvements in coding style, efficiency, logging, compatibility, commenting, and error handling
###### IF YOU HAVE PREVIOUSLY INSTALLED NO-MORE-DISCLAIMER, ORDER OF AUDIO SOURCE LIST, OR IMPROVED LIST LOOP MOD ON FW V59 PLEASE REINSTALL (OR UNINSTALL) BECAUSE THE FILES USED IN YOUR INSTALLATION WERE NOT UPDATED TO YOUR FIRMWARE.
###### ALSO, YOU MUST INSTALL NO-MORE-DISCLAIMER OR AUDIO SOURCE LIST ORDER (OR BOTH) FOR APPS TO APPEAR IN THE APP LIST ON V59 ALL UPDATED FILES IN AIO V2.2.0 WERE UPDATED FROM FW V59.00.441A-NA SO CONTINUE TO BE CAREFUL (THOUGH ALL FW V59 SHOULD BE COMPATIBLE SINCE USING FILES FROM V55 ON V59 WAS STILL WORKING FOR THESE TWEAKS).
##### NEW TWEAKS
- _NEW_ **Main Menu Tweaks:**  | _Pure CSS | No File Replacements | Compatible With All FW Versions_
- Hide The Main Menu Ellipse
- Give Main Menu Label a '3D' Effect
- *Two Alternative Main Menu Layouts*
  - **'Star Points' Layout**
  - **'Inverted' Layout**


- **Text Style Tweaks**
  - Added Song Title Color
  - And Radio Station Title Color As Options
  - Text Shadow (Global It Is More Noticeable Against Light Colored Backgrounds)

##### Notable Changes:
- 'Date To Statusbar mod' and 'Statusbar Tweaks' are now combined.  
  - Date to Statusbar Mod v3.3 (like v2 but with 3 clear date format choices)
  - Clock Color Also Applies to Statusbar-Mini-Speedometer (Even In Reverse :+1:)
  - Status Notification Color Includes all types of notifications (not just nav).
  - **IT IS RECOMENDED THAT YOU UNINSTALL THE DATE TO STATUSBAR MOD V2 BEFORE INSTALLING V3.  IT IS NOT REQUIRED BUT IT WILL PRODUCE BETTER RESULTS.**
- Date To Statusbar Mod v3.3 is compatible with all FW v55-v58 and:
  - 59.00.330A-EU
  - 59.00.331A-EU
  - 59.00.330A-NA
  - 59.00.441A-NA
  - 59.00.443A-NA
  - 59.00.443C-ADR
  - 59.00.326A-ADR  
- Mini Speedometer automatically hides the notification border without date to statusbar mod
- Fixed a typo causing the blue nav color scheme to fail to uninstall.  Now it is removed when changing back to default (red).

### I Will take suggestions for layouts, Just mock up your Idea in Photoshop or paint or for you software freedom lovers [GIMP2](http://gimp.org)
#### **'Star Points' Layout**:
<center><div style="max-width:50%">
![Star Points Layout](./app/files/screenshots/Alt-layout.jpg)
</div></center>

#### **'Inverted' Layout**:
<center><div style="max-width:50%">
![Inverted Layout](./app/files/screenshots/Alt-layou-ut.jpg)
</div>(Main Menu Label On Top Of The Screen Under Statusbar)</center>
___
#### 2.1.5
- UI Style Tweaks:
  - Body Text Color - Audio Artist & Album Title + more
  - Song Title Color
  - List Item Color
  - Disabled List Item Color
- ReCoded Tweaks for better compatibility:
  - Pause On Mute Tweak is now compatible with all FW versions - No longer replaces files
  - No Background Behind Buttons - Hides the background images with CSS rather than replacing them with transparent images
  - Better logging
- Blue Color Scheme Now Includes Blue Navigation Color Scheme
- Android Auto Install Works!

#### 2.1.3:
- Fixed Issue with installation not starting.
- Window state is now saved on exit and restored upon reopening. For real this time.
  - Added a menu Icon to reset window size and position.
-
#### 2.1.2:
- Background Rotator will now rotate up to 50 backgrounds (Larger backgrounds will take longer to load)
  - Also set the number of seconds each background will show: from 10 - 300 seconds (5 minutes)
- Fixed Speedometer and video player.
- 3rd attempt at fixing Android Auto (3rd time's the charm?)
- Beginning to standardize tweak installs/uninstalls.
- Fixed some corrupt binaries.

#### 2.1.0:
**NEW TWEAKS!!**
- Statusbar Tweaks
  - App Name Color
  - Clock Color
  - Nav Notification Color
  - Remove Statusbar Background Image
  - Set Statusbar Opacity
- Off Screen Background
  - Set a background image for "Turn Display Off and Show Clock" in the Settings Menu.
  - Will also display on system shutdown
- Added MPG or Km/L choice for Fuel Consumption Tweak
- Hopefully all tweaks are working correctly
  - Need additional confirmation for Android Auto (issue AA just shows a black screen)
- Background preview shows statusbar tweaks
- Added preview buttons to trigger background preview
- Added Tipperary font for background preview
- Retrieves FW version from previously used USB drive
- French Translation By: Salegosse (Mazda3revolution.com)
___
#### 2.0.6:
- Copy buttons for text fields on translator page.
- Added a top bar and clock to the background preview.
- Now compatible with 32 bit Windows
- Fixed Castscreen Receiver and put apk in its own folder
- Fixed Android Auto

#### 2.0.5:
- Initial language chosen for Speedometer Tweak based on locale (Fallback to English if locale does not match any provided translations or is not found.)
- Speedometer: Km/h selected by default except en-US (mph if locale = en-US).
- Selecting Speedometer_to_Statusbar options now auto-select date_to_statusbar mod 2.2 (km/h) except en-US (v2.3 if locale = en-US).
- Fixed Uninstalling Color Scheme to also remove blue nav color scheme if installed
- Warning message during tweak install for FW: 59.XX.XXX about apps not showing up in the app list.
- Added some HINT messages during Compilation
- Added Infotainment Frame to background preview

#### 2.0.4:
- Fixed bug when choosing Swapfile tweak and not copying directly to USB Drive.
- Fixed bug where Patched files were not copying for Speedcam Patch
- Formatting fixes
- Bug fixes
###### New Key bindings:
- Ctrl + Alt + H
 - Opens Main Page (Home)
- Ctrl + Alt + J
 - Opens Photo Joiner Window
- Ctrl + Alt + K
 - Triggers Start Compile
- Ctrl + Alt + L
 - Opens Translator Page

#### 2.0.3:
- Updated Patching Tool 2.3 (Thanks Modfreakz!).
- Added Compatible fw v.56.00.100A-EU.
- Added Compatible fw v.59.00.441A-NA.
- Updated date_to_statusbar to reject if FW = v.59.x+
- Snackbar messages
- Less intrusive alert of available update using Snackbar (and Native Notifications on Windows 10)
- Trigger changelog message after update.
- Added help panel info (Contributing section).
- **EXPERIMENTAL FEATURE: GOOGLE TRANSLATE** Can be found in Help & Settings Menu. (Some languages will break the formatting)
- GOOGLE TRANSLATE pop-up on the translator page to assist with translations.

#### 2.0.2:
- Clean up code/Improvements in logging
- **Updated Android Auto** with the latest binaries.  Should be stable now but needs additional testing to confirm

#### 2.0.1:
- Automatic Updates
- Delete _copy to usb_ folder after copying to USB Drive option  

## New Features in AIO 2.0.0:
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
[Electron]: (http://electron.atom.io/)
[AngularJS]: (https://angularjs.org/)    
[MazdaTweaks.com]:(http://mazdatweaks.com/)
[NodeJS]: (https://nodejs.org/)
[Chromium]: (https://www.chromium.org/)
[1]: (https://github.com/Siutsch/AIO---All-in-one-tweaks)
