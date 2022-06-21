/* ************************************************** */
/* Set this to true to use your values below ******** */
/* If this is false the following values are not used */
const overRideSpeed = false;
/* ************************************************** */
/* ****************** Start OverRide Variables ****** */
const SORV = {
  // Set the language for the speedometer
  // Available EN, ES, DE, PL, SK, TR, FR, IT, NL
  language: 'EN',

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

  // Set this to the color of the Analog SpeedoMeter
  // Valid Colors are (Capitalized and in quotes): Red, Blue, Green, Yellow, Pink, Orange, Purple, Silver
  analogColor: 'Red',

  // Set to the color theme for Bar SpeedoMeter
  // Theme will be a number 0-5 (0 is default white)
  barTheme: 0,

  // Set suffix appended to gauge value
  // default is "%" to show available fuel percentage
  // if set to L/Gal set fuelGuageFactor to the vehicle's fuel tank capacity in Liters/Gallons
  fuelGaugeValueSuffix: '%',

  // Set multiplier to get human readable output fuel value from its internal reading
  // default is 100 to show remaining percentage
  // set to fuel tank capacity in liters/gallons etc. and change aforementioned [fuelGaugeValueSuffix] to "L" etc.
  fuelGaugeFactor: 100,

};
