[Full Changelog](changelog.htm)  

### 2.7.0
## The software distribution service bintray.com has cancelled my account because they had recently seen the DMCA Takedown notice in the MZD-AIO-TI GitHub repository from March 6th, 2017.  Although I explained that the NNG files had been removed immediately upon receiving the notice they only agreed to leave the versions that had already been uploaded (Ending with v2.6.8) but would block my account from uploading any future versions. Therefor Automatic updates may of may not work in this version until I find another distribution solution.  So in case new updates do not download automatically "Check For Update" has been added in the top menu bar under the "Download" menu.

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
