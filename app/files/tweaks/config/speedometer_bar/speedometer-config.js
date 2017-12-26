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
|* Note: Only numbers inside [] brackets determine position, order in this list DOES NOT *|
\* ************************************************************************************* */
var spdTbl = {
  vehSpeed:   [0, 0, 0], //Vehicle Speed
  topSpeed:   [0, 1, 1], //Top Speed
  avgSpeed:   [0, 1, 2], //Average Speed
  gpsSpeed:   [0, 1, 3], //GPS Speed
  engSpeed:   [0, 1, 4], //Engine Speed
  trpTime:    [1, 1, 1], //Trip Time
  trpDist:    [1, 1, 2], //Trip Distance
  outTemp:    [1, 1, 3], //Outside Temperature
  inTemp:     [1, 1, 4], //Intake Temperature
  coolTemp:   [1, 1, 5], //Coolant Temperature
  gearPos:    [1, 2, 1], //Gear Position
  fuelLvl:    [1, 2, 2], //Fuel Gauge Level
  trpFuel:    [1, 2, 3], //Trip Fuel Economy
  totFuel:    [1, 2, 4], //Total Fuel Economy
  avgFuel:    [1, 2, 5], //Average Fuel Economy
  gpsAlt:     [1, 3, 2], //Altitude
  gpsAltMM:   [1, 3, 3], //Altitude Min/Max
  gpsHead:    [1, 3, 1], //GPS Heading
  gpsLat:     [1, 3, 4], //GPS Latitude
  gpsLon:     [1, 3, 5], //GPS Longitude
  trpIdle:    [1, 1, 0], //Idle Time
  trpEngIdle: [1, 1, 0], //Engine Idle Time
  engTop:     [1, 1, 0], //Engine Top Speed
};
