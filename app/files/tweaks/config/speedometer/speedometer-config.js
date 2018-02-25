/** speedometer-config.js ************************************************************** *\
|* =========================                                                             *|
|* Speedometer Configuration - Used to configure position of Speedometer values.         *|
|* =========================                                                             *|
|* Main Speedometer Value: [0, 0, 0] - Large, Front, & Center.                           *|
|* Other Values: [ 0/1:(0 For Main Column OR 1 For Bottom Rows), Row Number, Position ]  *|
|* Main Column Positions: 4 Values (1-4 From Top to Bottom)                              *|
|* Bottom Rows Positions: 5 Values Per Row (1-5 From Left to Right)                      *|
|* Examples:                                                                             *|
|* [0, 1, 4] = [Main, Column, 4th position (Bottom of the Column)]                       *|
|* [1, 3, 1] = [Bottom, 3rd Row, First Position (Left Side)]                             *|
|* [1, 1, 5] = [Bottom, 1st Row, Last Position (Right Side)]                             *|
|* To Hide a Value = [1, 1, 0] (Any bottom row position 0 will hide the value)           *|
|* To Change Bottom Row Push Command Knob ("Select")                                     *|
|* Note: Only numbers inside [] brackets determine position, order in this list DOES NOT *|
|* ******* DELETE THIS CONFIG FILE TO REUSE YOUR CURRENT CONFIG-SPEEDOMETER.JS ********* *|
\* ************************************************************************************* */
var spdBottomRows = 4;   //Number of Bottom Rows
var spdTbl = {
  vehSpeed:   [0, 0, 0], //Vehicle Speed
  topSpeed:   [0, 1, 1], //Top Speed
  avgSpeed:   [0, 1, 2], //Average Speed
  gpsSpeed:   [0, 1, 3], //GPS Speed
  engSpeed:   [0, 1, 4], //Engine Speed
  trpTime:    [1, 1, 1], //Trip Time
  trpIdle:    [1, 1, 2], //Idle Time
  trpDist:    [1, 1, 3], //Trip Distance
  fuelLvl:    [1, 1, 4], //Fuel Gauge Level
  outTemp:    [1, 1, 5], //Outside Temperature
  gpsHead:    [1, 2, 1], //GPS Heading
  gpsAlt:     [1, 2, 2], //Altitude
  gpsAltMM:   [1, 2, 3], //Altitude Min/Max
  trpFuel:    [1, 2, 4], //Trip Fuel Economy
  inTemp:     [1, 2, 5], //Intake Temperature
  gearPos:    [1, 3, 1], //Gear Position
  gearLvr:    [1, 3, 2], //Transmission Lever Position
  engTop:     [1, 3, 3], //Engine Top Speed
  avgFuel:    [1, 3, 4], //Average Fuel Economy
  coolTemp:   [1, 3, 5], //Coolant Temperature
  engLoad:    [1, 4, 0], //Engine Load
  gpsLat:     [1, 4, 2], //GPS Latitude
  gpsLon:     [1, 4, 3], //GPS Longitude
  totFuel:    [1, 4, 4], //Total Fuel Economy
  trpEngIdle: [1, 4, 5], //Engine Idle Time
  batSOC:     [1, 4, 1], //Battery Charge State (i-stop)
};

/* ************************************************** */
/* Set this to true to use your values below ******** */
/* If this is false the following values are not used */
var overRideSpeed=false;
/* ************************************************** */
/* ****************** Start OverRide Variables ****** */
var SORV = {
  // Set the language for the speedometer
  // Available EN, ES, DE, PL, SK, TR, FR, IT
  language: "EN",

  // Used for metric/US english conversion flag (C/F, KPH/MPH, Meter/Feet, L per 100km/MPG)
  // Set isMPH: true for MPH, Feet, MPG
  // Set isMPH: false for KPH, Meter
  isMPH: false,

  // Set This to true to start with the Bar Speedometer Mod
  // False to use the analog speedometer
  barSpeedometerMod: true,

  // Set true to enable multicontroller and other mod features in classic mode
  // If false then use classic speedometer without Mods
  speedMod: true,

  // Set to true to start the classic speedometer in analog mode
  // False to start in digital mode
  startAnalog: true,

  // Set it true for the StatusBar Speedometer
  // False if you don't want the small speedometer in statusbar
  StatusBarSpeedometer: true,

  // Set to true for Outside Temperature & Fuel Efficiency in the statusbar
  // False for Compass & Altitude
  sbTemp: false,

  // Set true if you want the original speedometer background image as in version 4.2 or below
  // False for no background
  // If "true" the opacity above will be ignored
  original_background_image: false,

  // Set the opacity of black background color for speedometer, to reduce the visibility of custom MZD background images
  // Possible values 0.0 (full transparent) until 1.0 (complete black background)
  black_background_opacity: 0.0,

  // Set unit for fuel efficiency to km/L
  // False for L/100km
  fuelEffunit_kml: false,

  // Set this to true for Fahrenheit
  // False for Celsius
  tempIsF: false,

  // For the Speed Bar false for Current Vehicle Speed
  // Set This to true if you want the Colored Bar to measure engine speed
  engineSpeedBar: false,

  // Set This to true to hide the Speed Bar
  // False shows he bar
  hideSpeedBar: false,

  // Set this to true to enable counter animation on the speed number
  // False to disable speed counter animation
  // The animation causes the digital number to lag by 1 second
  speedAnimation: false,
};
