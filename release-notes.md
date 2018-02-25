[Full Changelog](changelog.htm)  

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
    - Exiting The App Will Reset Positions To Your Default
    - Tap Selected Value Again To Cancel

#### AIO Tweaks App v0.6
- "Reverse App List" button - Reverses the Applications List (resets on boot).

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
