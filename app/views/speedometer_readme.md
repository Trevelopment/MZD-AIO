### FAQ
- A touch on the MZD clock toggles the small statusbar speedo on and off.
  It appears automatically after a MZD restart or if you open the speedo app.
- The analog tachometer on the left side displays the untouched vehicle speed. The value in OEM tachometer and HUD are artificially manipulated.
- Top and average speed will be calculated with vehicle speed, not with gps speed.
- GPS and vehicle speed shows normally the same, because the sensor for vehicle speed is very correct. Sometimes it has a difference by 1 kph.
- Fuel consumption in brackets is calculated over the total distance of odometer and will never be reset.
  Second fuel consumption value is only for the current trip.
- Idle time runs as soon as no vehicle speed is detected, no matter if istop is active.
  Engine idle time runs if engine is running but car has no speed (opposite to iStop time)
- The small speedometer has no influence on performance anymore, because it uses no extra javascript like in older versions.
- If you have used All-In-One tool for installation and the compass points to the opposite direction, there was something wrong at the installation process (e.g. the NAV SD was ejected).
  In this case you can toggle manually the user config variable "var noNavSD" or make a second installation with AIO again and inserted NAV SD.
- Pointer of Engine Speed goes until 8000 r/min, even if the scale ends at 7000.
  The pointer for max engine speed will stay at the correct value (also above 7000 r/min) and should be understandable without digit.

### Important for MZD firmware version 56.00.511/512/513
If you have one of the above version and an optional OEM SD card navigation the GPS values can't correctly be retrieved from car.
This causes lagging or no refreshes of altitude, latitude, longitude and speed in status bar.
One confirmed workaround is to eject and shortly reinsert the SD card while driving.
Not confirmed: Have navigation as last opened app before switching off ignition. Next time you start the car the speedo shows correct GPS values.


### Bug reporting
Any bug report should contain the following information:
- used installer (single installer by diginix or All-In-One tool from Siutsch)
- speedometer version
- MZD firmware version
- Mazda model (M3,M6,CX-5,MX-5)
- what other (app menu) tweaks are installed


### User config
all customization can be done in this file
jci/opera/opera_dir/userjs/speedometer-startup.js

***
** // set it false if you don't want the small speedometer in statusbar  
// (could be helpful if you have performance problems)  
*var enableSmallSbSpeedo = true;***

**// isMPH is used for metric/US english conversion flag (C/F, KPH/MPH, Meter/Feet, L per 100km/MPG)  
// Set isMPH = true for MPH, Feet, MPG  
// Set isMPH = false for KMH, Meter, km/L  
*var isMPH = false;***

**// set the language for the speedometer  
// if DE fuel consumption is L/100km  
// available EN, ES, DE, PL, SK, FR  
*var language = "DE";***

**// set unit for fuel efficiency to km/L instead of L/100km  
var fuelEffunit_kml = false;**      
**// set true if you have no Mazda navigation SD card (important for the compass)  
*var noNavSD = false;***

**// set the opacity of black background color for speedometer,  
// to reduce the visibility of custom MZD background images  
// possible values 0.0 (full transparent) until 1.0 (complete black background)  
*var black\_background\_opacity = 0.0;***

**// set true if you want the original speedometer background image as in version 4.2 or below  
// if "true" the opacity above will be ignored  
*var original_background_image = false;***

***
