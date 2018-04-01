[Full Changelog](changelog.htm)  

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
