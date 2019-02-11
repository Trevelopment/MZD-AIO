 [Full Changelog](changelog.htm)

# AIO + CASDK

### v2.8.4

#### Android Auto Headunit App v1.11
- Tweaked Linux Stack TCP Buffers
- More Stable HUD support (It is not perfect yet)
  - Detects if HUD is present, if not available the feature is not used
- **Buttons Remapped:**
  - Home: AA Home screen
  - Ent: AA Music screen
  - Nav: AA Navigation screen
  - Fav: Switch Audio Focus (MZD <-> AA)
  - Call End (Steering Wheel): Exit AA (when not in active call otherwise reject/end call)

#### AIO Tweaks App v1.0
- *Show localStorage* Button shows the contents of localStorage (Values saved by Video Player, AIO Tweaks, and CASDK apps)
- *adb kill-server* Button kills adb server
- *Check IP Address* Button shows IP address (if WIFI or hotspot is connected or else there is no IP address)
- *Wink Test* Button shows test wink notification
- Better behavior from "Start/Stop" Android Auto buttons

#### Date 2 Statusbar / Statusbar Speedometer
- Minor spacing adjustments for date
- Coolant temp color (blue = under 30º; yellow = under 55º)

#### Touchscreen While Driving Option - **DVDs While Driving**
- Enable Playing DVDs while driving (DVD Player Required)

#### Fuel Consumption Tweak *FIXED*
- Added calculations for km/L (as default)
- Added L/100km option (as converted)
- Fixed all calculations (L/100km <-> km/L <-> mpg)
- If you choose the same unit as your default, will show the same value twice - this is expected behavior
 - Example: If your default is mpg and you choose mpg will show same number (in mpg) for both top and bottom values
 - The top value is in your default unit, bottom value is converted to chosen unit

#### Semi-Transparent Parking Sensors
- Now are in relevant colors (Green - Yellow - Orange - Red)

#### No More Beeps
- Fixed for FW v59.00.502+

#### Autorun & Recovery
- Fixed Firewall Recovery (jci-fw.sh)
- Fixed a bug where selecting autorun before compiling Full System Restore would create an autorun installer.
- Added additional WARNING message (and chance to cancel) when choosing to uninstall on FW 59.00.502+ (that tweaking ability will be lost)

#### *__Mac & Linux Quirks__*
- *Fixed* Blank window sometimes when navigating between Tweaks, CASDK, Autorun, & System Restore views
- *Fixed* Some of the "Open" buttons opening incorrect folders or none at all

- Various other bug fixes
