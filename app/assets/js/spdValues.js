var SbOpsHTML = ''
var spdCtrlHTML = ''
var spdSbOptions = []
var spdColorOptions = []
var spdCtrlOptions = []
var spdBarCtrlOptions = []
var spdExtraOptions = []
var barColorFile = ''
var speedoOps = {
  lang: { id: null },
  xph: { id: 11 },
  sml: { id: 22 },
  bg: { id: 30 },
  effic: { id: 40 },
  temperature: { id: 42 },
  startbar: { id: 45 },
  color: null,
  mod: true,
  modAlt: true,
  simpmod: true,
  sbtemp: false,
  sbreverse: false,
  sbhideinapp: true,
  digiclock: false,
  sbint: 2,
  sbfuel: 'disable',
  sbmain: 'gpsSpeedValue',
  sbval1: 'gpsHeading',
  sbval2: 'gpsAltitudeValue',
  classicLargeText: false,
  opac: 0
}
var spdValues = [
  { elmnt: "vehSpeed", pos: ["0", "0", "0"], label: "Vehicle Speed", class: "vehicleSpeed" },
  { elmnt: "topSpeed", pos: ["0", "1", "1"], label: "Top Speed", class: "speedTopValue" },
  { elmnt: "avgSpeed", pos: ["0", "1", "2"], label: "Average Speed", class: "speedAvgValue" },
  { elmnt: "gpsSpeed", pos: ["0", "1", "3"], label: "GPS Speed", class: "gpsSpeedValue" },
  { elmnt: "engSpeed", pos: ["0", "1", "4"], label: "Engine RPM", class: "engineSpeedValue" },
  { elmnt: "trpTime", pos: ["1", "1", "1"], label: "Trip Time", class: "tripTimeValue" },
  { elmnt: "trpIdle", pos: ["1", "1", "2"], label: "Idle Time", class: "idleTimeValue" },
  { elmnt: "trpDist", pos: ["1", "1", "3"], label: "Trip Distance", class: "tripDistance" },
  { elmnt: "fuelLvl", pos: ["1", "1", "4"], label: "Fuel Gauge Level", class: "fuelGaugeValue" },
  { elmnt: "outTemp", pos: ["1", "1", "5"], label: "Outside Temperature", class: "outsideTempValue" },
  { elmnt: "gpsHead", pos: ["1", "2", "1"], label: "GPS Heading", class: "gpsHeading" },
  { elmnt: "gpsAlt", pos: ["1", "2", "2"], label: "Altitude", class: "gpsAltitudeValue" },
  { elmnt: "gpsAltMM", pos: ["1", "2", "3"], label: "Altitude Min/Max", class: "gpsAltitudeMinMax" },
  { elmnt: "trpFuel", pos: ["1", "2", "4"], label: "Trip Fuel Economy", class: "Drv1AvlFuelEValue" },
  { elmnt: "inTemp", pos: ["1", "2", "5"], label: "Intake Temperature", class: "intakeTempValue" },
  { elmnt: "gearPos", pos: ["1", "3", "1"], label: "Gear Position", class: "gearPositionValue" },
  { elmnt: "gearLvr", pos: ["1", "3", "2"], label: "Transmission Lever Position", class: "gearLeverPositionValue" },
  { elmnt: "engTop", pos: ["1", "3", "3"], label: "Engine Top RPM", class: "engineSpeedTopValue" },
  { elmnt: "avgFuel", pos: ["1", "3", "4"], label: "Average Fuel Economy", class: "avgFuelValue" },
  { elmnt: "coolTemp", pos: ["1", "3", "5"], label: "Coolant Temperature", class: "coolantTempValue" },
  { elmnt: "engLoad", pos: ["2", "4", "0"], label: "Engine Load", class: "engineLoadValue" },
  { elmnt: "gpsLat", pos: ["1", "4", "2"], label: "GPS Latitude", class: "gpsLatitudeValue" },
  { elmnt: "gpsLon", pos: ["1", "4", "3"], label: "GPS Longitude", class: "gpsLongitudeValue" },
  { elmnt: "totFuel", pos: ["1", "4", "4"], label: "Total Fuel Economy", class: "TotFuelEfficiency" },
  { elmnt: "trpEngIdle", pos: ["1", "4", "5"], label: "Engine Idle Time", class: "engineIdleTimeValue" },
  { elmnt: "batSOC", pos: ["1", "4", "1"], label: "Battery Charge State (i-stop)", class: "batSOCValue" }
]
var classicSpeedoTmplt = [
  { id: "speedTopFieldSet", name: "Top Speed", class: "speedTopValue", starting: "0", unitClass: null, pos: 1 },
  { id: "tripDistFieldSet", name: "Trip Dist.", unitClass: "distUnit", starting: "0.00", class: "tripDistance", pos: 2 },
  { id: "speedAvgFieldSet", name: "Avg. Speed", class: "speedAvgValue", starting: "0", unitClass: "speedUnit", pos: 3 },
  { id: "gpsAltitudeFieldSet", name: "Altitude ", unitClass: "altUnit", starting: "---", class: "gpsAltitudeValue", pos: 4 },
  { id: "gpsAltitudeMinMaxFieldSet", name: "ALT. <span>min/max</span>", class: "gpsAltitudeMinMax", starting: "---/---", unitClass: null, pos: 5 },
  { id: "gpsLatitudeFieldSet", name: "Lat.", class: "gpsLatitudeValue", starting: "---", unitClass: null, pos: 6 },
  { id: "gpsLongitudeFieldSet", name: "Lon.", class: "gpsLongitudeValue", starting: "---", unitClass: null, pos: 7 },
  { id: "tripTimeFieldSet", name: "Total Time", class: "tripTimeValue", starting: "0:00", unitClass: null, pos: 8 },
  { id: "idleTimeFieldSet", name: "Idle Time", class: "idleTimeValue", starting: "0:00", unitClass: null, pos: 9 },
  { id: "engIdleTimeFieldSet", name: "Engine Idle", class: "engineIdleTimeValue", starting: "0:00", unitClass: null, pos: 10 },
  { id: "Drv1AvlFuelEFieldSet", name: "<span class='hideFuel'>Fuel Eff.</span>", class: "Drv1AvlFuelEValue", starting: "---", unitClass: "fuelEffUnit", pos: 11 },
  { id: "outsideTempFieldSet", name: "Outside ", unitClass: "tempUnit", starting: "---", class: "outsideTempValue", pos: 12 },
  { id: "intakeTempFieldSet", name: "Intake ", unitClass: "tempUnit", starting: "---", class: "intakeTempValue", pos: 13 },
  { id: "coolantTempFieldSet", name: "Coolant ", unitClass: "tempUnit", starting: "---", class: "coolantTempValue", pos: 14 },
  { id: "gearPositionFieldSet", name: "Gear Pos.", class: "gearPositionValue", starting: "---", unitClass: null, pos: 15 },
  { id: "gearLeverPositionFieldSet", name: "Gear Lvr. Pos.", class: "gearLeverPositionValue", starting: "---", unitClass: null, pos: 16 },
  { id: "batSOCFieldSet", name: "Bat SOC.", class: "batSOCValue", starting: "---", unitClass: null, pos: 17 },
]
var spdCtrlValues = [
  { id: "0", default: "select", bar: "Show Next Bottom Row", classic: "Toggle Speed (Analog-Digital)" },
  { id: "1", default: "up", bar: "Toggle Speed Unit (mph-km/h)", classic: "Toggle Speed Unit (mph-km/h)" },
  { id: "2", default: "down", bar: "Toggle Speed Bar (VehSpeed-RPM)", classic: "Toggle Larger Text" },
  { id: "3", default: "right", bar: "Toggle Temp in mph mode (C-F) Fuel Eff in km/h mode (L/km-km/100L)", classic: "Toggle Temp in mph mode (C-F) Fuel Eff in km/h mode (L/km-km/100L)" },
  { id: "4", default: "left", bar: "Toggle Background", classic: "Toggle Background" },
  { id: "5", default: "hold.select", bar: "Reset Layout", classic: "Pop Top Value (Append To Botom)" },
  { id: "6", default: "hold.up", bar: "Switch To Classic Speedometer", classic: "Switch To Bar Speedometer" },
  { id: "7", default: "hold.down", bar: "Hide/Show Speed Bar", classic: "Basic Speedo - Analog & Disables Toggles Except Itself To Toggle Back" },
  { id: "8", default: "hold.right", bar: "Reset Trip Time, Distance, Top/Ave Speed", classic: "Reset Trip Time, Distance, Top/Ave Speed" },
  { id: "9", default: "hold.left", bar: "Change Color Theme", classic: "Change Color Theme" },
  { id: "10", default: null, bar: "Toggle StatusBar Speedometer & Fuel Gauge", classic: "Toggle StatusBar Speedometer & Fuel Gauge" },
]
var multictrl = {
  bar: { select: "0", up: "1", down: "2", right: "3", left: "4", hold: { select: "5", up: "6", down: "7", right: "8", left: "9", } },
  classic: { select: "0", up: "1", down: "2", right: "3", left: "4", hold: { select: "5", up: "6", down: "7", right: "8", left: "9", } }
}
var barThemeColors = [
  { num: '1', main: '#7fffd4', secondary: '#64bfff', border: '#0000ff' },
  { num: '2', main: '#3fff17', secondary: '#ff8181', border: '#ffca00' },
  { num: '3', main: '#ed4bff', secondary: '#52ff5a', border: '#e4c300' },
  { num: '4', main: '#a680ff', secondary: '#e644ff', border: '#1484b8' },
  { num: '5', main: '#FF0000', secondary: '#00ff00', border: '#0000ff' },
]

var fuelBarColors = [
  { label: "< 20", bashVar: "FBC20", colorVal: "#ff0096" },
  { label: "< 40", bashVar: "FBC40", colorVal: "#ff9600" },
  { label: "< 60", bashVar: "FBC60", colorVal: "#9600ff" },
  { label: "< 80", bashVar: "FBC80", colorVal: "#0096ff" },
  { label: "< 100", bashVar: "FBC100", colorVal: "#00ff96" },
]

var spdExtraValues = {
  barThemeStart: "0",
  speedoctrls: "Bar",
  barSpeedoRows: "4",
  fuelGaugeValueSuffix: "%",
  fuelGaugeFactor: 100,
  engineSpeedBar: false,
  hideSpeedBar: false,
  speedAnimation: false,
  hidespeedosbn: true,
}

// Push Disable & Hidden Options
spdSbOptions.push(`<option value="hidden">None (hidden)</option>`)
spdCtrlOptions.push(`<option value="null">Disable</option>`)
spdBarCtrlOptions.push(`<option value="null">Disable</option>`)

// Build Option Lists
for (var i in spdValues) {
  spdSbOptions.push(`<option value="${spdValues[i].class}">${spdValues[i].label}</option>`)
}
for (var i in spdCtrlValues) {
  spdCtrlOptions.push(`<option value="${spdCtrlValues[i].id}">${spdCtrlValues[i].classic}</option>`)
  spdBarCtrlOptions.push(`<option value="${spdCtrlValues[i].id}">${spdCtrlValues[i].bar}</option>`)
}
/*for (var key in spdExtraValues) {
  key = key.toString()
  if (!key.includes('bar') && !key.includes('ctrls')) {
    if (key.includes('fuelGauge')) {
      spdExtraOptions.push(`<div class="spdExtraOp">` + (key === 'fuelGaugeFactor' ? `<label for="fuelGaugeFactor">Fuel Tank Capacity (L/Gal):</label><input id="fuelGaugeFactor" type="number" min="40" max="100" ng-value="user.spdExtra.fuelGaugeFactor" ng-model="user.spdExtra.fuelGaugeFactor" ng-disabled="user.spdExtra.fuelGaugeValueSuffix === '%'">` : `Fuel Gage Type: <select ng-value="user.spdExtra.fuelGaugeValueSuffix" ng-model="user.spdExtra.fuelGaugeValueSuffix"><option value="%">%</option><option value="Gal">Gal.</option><option value="L">L</option></select>`) + `</div>`)
    } else {
      spdExtraOptions.push(`<div class="spdExtraOp"><input type="checkbox" class="w3-check" id="${spdExtraValues[key]}" ng-model="user.spdExtra.${key}" ng-value="user.spdExtra.${key}"></div>`)
      console.log(key, spdExtraValues[key])
    }
  }
}*/
// Statusbar Speedometer Options
SbOpsHTML += '<header class="w3-row w3-col w3-text-white w3-xlarge w3-cyan"><span class="w3-threequarter">Status Bar Speedometer</span><div class="w3-quarter w3-small" title="Extra Values Rotation Interval"><div class="w3-half">Fade Interval (Seconds):</div><input type="number" min="1" id="spdOp-interval" ng-model="user.speedoOps.sbint" ng-value="user.speedoOps.sbint" ng-disabled="user.speedoOps.sml.id === 22 || user.speedoOps.sbval1 === \'hidden\' || user.speedoOps.sbval2 === \'hidden\'" class="w3-input w3-half" /></span><span onclick="$(\'#SbSpeedoOps\').fadeToggle()" class="closeBtn">&times;</span><span onclick="toggleTips()" class="toggleTipsBtn"><i class="icon-question2" title="Tips"></i></span><span ng-click="reset_fuelBarColors()" class="resetBtn"><i class="icon-reload" title="Reset To Default"></i></span></header><div class="sbspeedoops">'
SbOpsHTML += `<span class="speedo-radio"><input id="speedo-sb" type="radio" name="sbspeedo" ng-model="user.speedoOps.sml.id" ng-value="20" ng-click="miniSpeedo()" /><label for="speedo-sb" data-toggle="tooltip" data-placement="auto bottom" title="Activate Statusbar Speedometer & Fuel Gauge">Statusbar Speedometer & Fuel Gauge</label></span><span class="speedo-radio"><input id="speedo-sboff" type="radio" name="sbspeedo" ng-model="user.speedoOps.sml.id" ng-value="22" ng-click="" /><label for="speedo-sboff" data-toggle="tooltip" data-placement="auto bottom" title="Do Not Activate Statusbar Speedometer & Fuel Gauge">Do Not Activate</label>
</span>`
SbOpsHTML += '<div class="w3-row sbMainVal">Main Value: <select ng-model="user.speedoOps.sbmain" id="SbMainVal" ng-disabled="user.speedoOps.sml.id === 22">' + spdSbOptions.join('') + '</select></div>'
SbOpsHTML += '<div class="w3-row sbMainVal">Rotating Value 1: <select ng-model="user.speedoOps.sbval1" id="SbVal1" ng-disabled="user.speedoOps.sml.id === 22">' + spdSbOptions.join('') + '</select></div>'
SbOpsHTML += '<div class="w3-row sbMainVal">Rotating Value 2: <select ng-model="user.speedoOps.sbval2" id="SbVal2" ng-disabled="user.speedoOps.sml.id === 22">' + spdSbOptions.join('') + '</select></div>'
SbOpsHTML += '<div class="w3-row sbFuelBar">Fuel Gauge Bar: <select ng-model="user.speedoOps.sbfuel" id="SbFuelBar" ng-disabled="user.speedoOps.sml.id === 22"><option value="disable">Disable</option><option value="default">Below StatusBar</option><option value="topbar">Above StatusBar</option><option value="bottombar">Bottom of the Screen</option></select></div>'
SbOpsHTML += '<span ng-hide="user.speedoOps.sbfuel===\'disable\'"><div>Fuel Bar Colors:</div><span class="sbFuelBarColors" ng-repeat="fb in user.fuelBarColors">{{fb.label}}%: <input id="fb.bashVar" type="color" ng-model="fb.colorVal" ng-value="fb.colorVal" /></span></span>'
SbOpsHTML += '<span class="w3-row w3-col"><span class="speedo-radio half"> <input id="DigitalClockFont" type="checkbox" name="digiclock" ng-disabled="user.speedoOps.sml.id === 22" ng-model="user.speedoOps.digiclock" ng-value="user.speedoOps.digiclock"/><label for="DigitalClockFont" data-toggle="tooltip" data-placement="auto bottom" title="Change the clock font to a digital clock."> Digital Clock Mod </label></span>'
SbOpsHTML += '<span class="speedo-radio half"> <input id="ShowSBReverse" type="checkbox" name="ShowSBReverse" ng-disabled="user.speedoOps.sml.id === 22" ng-model="user.speedoOps.sbreverse" ng-value="user.speedoOps.sbreverse"/><label for="ShowSBReverse" data-toggle="tooltip" data-placement="auto bottom" title="Hide Statusbar Speedometer in Reverse."> Hide In Reverse </label></span>'
SbOpsHTML += '<span class="speedo-radio half"> <input id="ShowSbInApp" type="checkbox" name="ShowSbInApp" ng-disabled="user.speedoOps.sml.id === 22" ng-model="user.speedoOps.sbhideinapp" ng-value="user.speedoOps.sbhideinapp"/><label for="ShowSbInApp" data-toggle="tooltip" data-placement="auto bottom" title="Hide Statusbar Speedometer When Speedometer App Is Open."> Hide In App </label></span>'
SbOpsHTML += '<span class="speedo-radio half"> <input id="HideSpeedoSBN" type="checkbox" name="HideSpeedoSBN" ng-disabled="user.speedoOps.sml.id === 22" ng-model="user.spdExtra.hidespeedosbn" ng-value="user.speedoOps.hidespeedosbn"/><label for="HideSpeedoSBN" data-toggle="tooltip" data-placement="auto bottom" title="Hide Statusbar Speedometer During Statusbar Notifications"> Hide During Notifications </label></span></span></span></div>'

// Controller Options
spdCtrlHTML += '<header class="w3-large w3-amber">Speedometer Multi-Controller:<br>** Currently Editing <b>{{user.spdExtra.speedoctrls}} Speedometer</b> Controls **</header> <div class="w3-row"><span class="speedo-radio"> <input id="custom-bar-ctrls" type="radio" name="spdCtrlOps" value="Bar" ng-model="user.spdExtra.speedoctrls"/> <label for="custom-bar-ctrls" data-toggle="tooltip" data-placement="auto bottom" title="Controls For Digital Bar Speedometer">Bar Speedometer</label> </span> <span class="speedo-radio"> <input id="custom-classic-ctrls" type="radio" name="spdCtrlOps" value="Classic" ng-model="user.spdExtra.speedoctrls"/> <label for="custom-classic-ctrls" data-toggle="tooltip" data-placement="auto bottom" title="Controls For Classic Speedometer">Classic Speedometer</label> </span></span></div>'
spdCtrlHTML += '<span onclick="$(\'#SpeedoControlOps\').fadeToggle()" class="closeBtn">&times;</span><span onclick="toggleTips()" class="toggleTipsBtn"><i class="icon-question2" title="Tips"></i></span><span ng-click="reset_multictrl()" class="resetBtn"><i class="icon-reload" title="Reset To Default"></i></span>'
spdCtrlHTML += '<img src="files/img/mc.png" style="" class="mc-wheel">'
spdCtrlHTML += '<div class="multictrl-right" ng-show="user.spdExtra.speedoctrls===\'Bar\'">Right: <select ng-model="user.multictrl.bar.right" id="BarRight">' + spdBarCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-holdright" ng-show="user.spdExtra.speedoctrls===\'Bar\'">Hold Right: <select ng-model="user.multictrl.bar.hold.right" id="BarHoldRight">' + spdBarCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-left" ng-show="user.spdExtra.speedoctrls===\'Bar\'">Left: <select ng-model="user.multictrl.bar.left" id="BarLeft">' + spdBarCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-holdleft" ng-show="user.spdExtra.speedoctrls===\'Bar\'">Hold Left: <select ng-model="user.multictrl.bar.hold.left" id="BarHoldLeft">' + spdBarCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-up" ng-show="user.spdExtra.speedoctrls===\'Bar\'">Up: <select ng-model="user.multictrl.bar.up" id="BarUp">' + spdBarCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-holdup" ng-show="user.spdExtra.speedoctrls===\'Bar\'">Hold Up: <select ng-model="user.multictrl.bar.hold.up" id="BarHoldUp">' + spdBarCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-down" ng-show="user.spdExtra.speedoctrls===\'Bar\'">Down: <select ng-model="user.multictrl.bar.down" id="BarDown">' + spdBarCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-holddown" ng-show="user.spdExtra.speedoctrls===\'Bar\'">Hold Down: <select ng-model="user.multictrl.bar.hold.down" id="BarHoldDown">' + spdBarCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-select" ng-show="user.spdExtra.speedoctrls===\'Bar\'">Select: <select ng-model="user.multictrl.bar.select" id="BarSelect">' + spdBarCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-holdselect" ng-show="user.spdExtra.speedoctrls===\'Bar\'">Hold Select: <select ng-model="user.multictrl.bar.hold.select" id="BarHoldSelect">' + spdBarCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-right" ng-show="user.spdExtra.speedoctrls===\'Classic\'">Right: <select ng-model="user.multictrl.classic.right" id="ClassicRight">' + spdCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-holdright" ng-show="user.spdExtra.speedoctrls===\'Classic\'">Hold Right: <select ng-model="user.multictrl.classic.hold.right" id="ClassicHoldRight">' + spdCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-left" ng-show="user.spdExtra.speedoctrls===\'Classic\'">Left: <select ng-model="user.multictrl.classic.left" id="ClassicLeft">' + spdCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-holdleft" ng-show="user.spdExtra.speedoctrls===\'Classic\'">Hold Left: <select ng-model="user.multictrl.classic.hold.left" id="ClassicHoldLeft">' + spdCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-up" ng-show="user.spdExtra.speedoctrls===\'Classic\'">Up: <select ng-model="user.multictrl.classic.up" id="ClassicUp">' + spdCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-holdup" ng-show="user.spdExtra.speedoctrls===\'Classic\'">Hold Up: <select ng-model="user.multictrl.classic.hold.up" id="ClassicHoldUp">' + spdCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-down" ng-show="user.spdExtra.speedoctrls===\'Classic\'">Down: <select ng-model="user.multictrl.classic.down" id="ClassicDown">' + spdCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-holddown" ng-show="user.spdExtra.speedoctrls===\'Classic\'">Hold Down: <select ng-model="user.multictrl.classic.hold.down" id="ClassicHoldDown">' + spdCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-select" ng-show="user.spdExtra.speedoctrls===\'Classic\'">Select: <select ng-model="user.multictrl.classic.select" id="ClassicSelect">' + spdCtrlOptions.join('') + '</select></div>'
spdCtrlHTML += '<div class="multictrl-holdselect" ng-show="user.spdExtra.speedoctrls===\'Classic\'">Hold Select: <select ng-model="user.multictrl.classic.hold.select" id="ClassicHoldSelect">' + spdCtrlOptions.join('') + '</select></div>'

// Start of the Bar Color Theme File
barColorFile += '/* barThemes.css - Customize Bar Speedometer Color Themes\n* Any Valid CSS Colors Can Be Used Examples:\n* Names -    Ex: blue;\n* Hex -      Ex: #00ff66;\n* RGB -      Ex: rgb(100, 255, 0);\n* HSL -      Ex: hsl(248, 53%, 58%);\n* For More Info On CSS Colors Visit https://www.w3schools.com/colors/colors_names.asp\n* Each Theme Has 3 Colors In This Order:\n* Primary - Color of Values\n* Secondary - Color of Labels/Units\n* Border-Color - Color of the Box Borders\n* If you know CSS then have fun with it\n* CSS is a very forgiving language any errors in this file will be ignored\n*/\n'
classicSpeedoTmplt.sort(function(a, b) {
  return a.pos - b.pos
})
