/*
 Copyright 2016 Herko ter Horst
 __________________________________________________________________________

 Filename: SpeedoMeterTmplt.js
 __________________________________________________________________________
 */

log.addSrcFile("SpeedoMeterTmplt.js", "speedometer");

/*
 * =========================
 * Constructor
 * =========================
 */
function SpeedoMeterTmplt(uiaId, parentDiv, templateID, controlProperties)
{
    this.divElt = null;
    this.templateName = "SpeedoMeterTmplt";

    this.onScreenClass = "SpeedoMeterTmplt";

    log.debug("  templateID in SpeedoMeterTmplt constructor: " + templateID);

    //@formatter:off
    //set the template properties
    this.properties = {
        "statusBarVisible" : true,
        "leftButtonVisible" : false,
        "rightChromeVisible" : false,
        "hasActivePanel" : false,
        "isDialog" : false
    };
    //@formatter:on

    // create the div for template
    this.divElt = document.createElement('div');
    this.divElt.id = templateID;
    this.divElt.className = "TemplateWithStatus SpeedoMeterTmplt";

    parentDiv.appendChild(this.divElt);

    // do whatever you want here
    this.divElt.innerHTML = '<!-- MZD Speedometer v5.0 - Variant Mod  -->'+
'<div id="speedometerContainer">'+
'<div id="hideIdleBtn"></div>'+
'<div id="table_bg">'+
'<div id="valuetable">'+
'<fieldset id="tripDistFieldSet">'+
    '<legend>Trip Dist. <span class="spunit">(<span class="distUnit">km</span>)</span></legend>'+
    '<div class="tripDistance">0.00</div>'+
'</fieldset>'+
'<fieldset id="speedTopFieldSet">'+
    '<legend>Top Speed</legend>'+
    '<div class="speedTopValue"><span>(0)</span>0</div>'+
'</fieldset>'+
'<fieldset id="speedAvgFieldSet">'+
    '<legend>Avg. Speed</legend>'+
    '<div class="speedAvgValue">0</div>'+
'</fieldset>'+
'<fieldset id="gpsAltitudeFieldSet">'+
    '<legend>Altitude <span class="spunit">(<span class="altUnit">m</span>)</span></legend>'+
    '<div class="gpsAltitudeValue">-</div>'+
'</fieldset>'+
// '<fieldset id="gpsAltitudeMinFieldSet">'+
//     '<legend>Altitude <span>min</span></legend>'+
//     '<div class="gpsAltitudeMin">-</div>'+
// '</fieldset>'+
// '<fieldset id="gpsAltitudeMaxFieldSet">'+
//     '<legend>Altitude <span>max</span></legend>'+
//     '<div class="gpsAltitudeMax">-</div>'+
// '</fieldset>'+
'<fieldset id="gpsAltitudeMinMaxFieldSet">'+
    '<legend><span>min/max</span></legend>'+
    '<div class="gpsAltitudeMinMax">-</div>'+
'</fieldset>'+
'<fieldset id="gpsLatitudeFieldSet">'+
    '<legend>Lat.</legend>'+
    '<div class="gpsLatitudeValue">-</div>'+
'</fieldset>'+
'<fieldset id="gpsLongitudeFieldSet">'+
    '<legend>Lon.</legend>'+
    '<div class="gpsLongitudeValue">-</div>'+
'</fieldset>'+
'<fieldset id="tripTimeFieldSet">'+
    '<legend>Total Time</legend>'+
    '<div class="tripTimeValue">0:00</div>'+
'</fieldset>'+
'<fieldset id="idleTimeFieldSet">'+
    '<legend>Idle Time</legend>'+
    '<div class="idleTimeValue">0:00</div>'+
'</fieldset>'+
'<fieldset id="engIdleTimeFieldSet">'+
    '<legend>Engine Idle</legend>'+
    '<div class="engineIdleTimeValue">0:00</div>'+
'</fieldset>'+
'<fieldset id="Drv1AvlFuelEFieldSet">'+
    '<legend>L/100 km &empty;</legend>'+
    '<div class="Drv1AvlFuelEValue"><span>(0)</span>0</div>'+
'</fieldset>'+
'<fieldset id="outsideTempFieldSet">'+
    '<legend>Outside Temp.</legend>'+
    '<div class="outsideTempValue">0</div>'+
'</fieldset>'+
'<fieldset id="intakeTempFieldSet">'+
    '<legend>Intake Temp.</legend>'+
    '<div class="intakeTempValue">0</div>'+
'</fieldset>'+
'<fieldset id="coolantTempFieldSet">'+
    '<legend>Coolant Temp.</legend>'+
    '<div class="coolantTempValue">0</div>'+
'</fieldset>'+
'<fieldset id="gearPositionFieldSet">'+
    '<legend>Gear Position</legend>'+
    '<div class="gearPositionValue">0</div>'+
'</fieldset>'+
'</div>'+
'</div>'+
'<div id="analog" style="display: none;">'+
    '<div id="speedometerBG"></div>'+
    '<div id="speedometerDial"></div>'+
    '<div id="textSpeed0">0</div>'+
    '<div id="textSpeed20">20</div>'+
    '<div id="textSpeed40">40</div>'+
    '<div id="textSpeed60">60</div>'+
    '<div id="textSpeed80">80</div>'+
    '<div id="textSpeed100">100</div>'+
    '<div id="textSpeed120">120</div>'+
    '<div id="textSpeed140">140</div>'+
    '<div id="textSpeed160">160</div>'+
    '<div id="textSpeed180">180</div>'+
    '<div id="textSpeed200">200</div>'+
    '<div id="textSpeed220">220</div>'+
    '<div id="textSpeed240">240</div>'+
    '<div class="topSpeedIndicator"></div>'+
    '<div class="speedIndicator"></div>'+
    '<div class="gpsCompassBG">'+
    '<div id="gpsCompass">'+
        '<div class="North">N</div>'+
        '<div class="NorthEast small">NE</div>'+
        '<div class="East">E</div>'+
        '<div class="SouthEast small">SE</div>'+
        '<div class="South">S</div>'+
        '<div class="SouthWest small">SW</div>'+
        '<div class="West">W</div>'+
        '<div class="NorthWest small">NW</div>'+
    '</div>'+
    '</div>'+
    '<div class="vehicleSpeed">0</div>'+
    '<div class="speedUnit">---</div>'+
    '<div class="topRPMIndicator"></div>'+
    '<div class="RPMIndicator"></div>'+
    '<div id="rpmDial">'+
        '<div class="step s0">0</div>'+
        '<div class="step s1">1</div>'+
        '<div class="step s2">2</div>'+
        '<div class="step s3">3</div>'+
        '<div class="step s4">4</div>'+
        '<div class="step s5">5</div>'+
        '<div class="step s6">6</div>'+
        '<div class="step s7">7</div>'+
        '<div class="unit">r/min</div>'+
        '<div class="scale">x1000</div>'+
    '</div>'+
'</div>'+
'</div>'+
'<div id="digital">'+
	'<div class="vehicleSpeed">0</div>'+
	'<div class="speedUnit">---</div>'+
'</div>'+
'<!-- script language="javascript" type="text/javascript">setTimeout(function() {updateSpeedoApp();}, 700);</script -->';
$.getScript('apps/_speedometer/js/speedometerUpdate.js', setTimeout(function() {updateSpeedoApp();}, 700));
}

/*
 * =========================
 * Standard Template API functions
 * =========================
 */

/* (internal - called by the framework)
 * Handles multicontroller events.
 * @param   eventID (string) any of the “Internal event name” values in IHU_GUI_MulticontrollerSimulation.docx (e.g. 'cw',
 * 'ccw', 'select')
 */
SpeedoMeterTmplt.prototype.handleControllerEvent = function(eventID)
{
    log.debug("handleController() called, eventID: " + eventID);

    var retValue = 'giveFocusLeft';

    switch(eventID) {
  case "select":
		$('#speedAvgFieldSet').click();
		retValue = "consumed";
		break;
  case "down":
		$('#speedTopFieldSet').click();
		retValue = "consumed";
		break;
  case "up":
		$('#engineSpeedFieldSet').click();
		retValue = "consumed";
		break;
  case "left":
		$('#analog').click();
		retValue = "consumed";
		break;
  case "right":
 		$('#digital').click();
		retValue = "consumed";
		break;
    //  case "cw":
    //  case "ccw":
  default:
		retValue = "ignored";
	}

    return retValue;
};
/*
 * Called by the app during templateNoLongerDisplayed. Used to perform garbage collection procedures on the template and
 * its controls.
 */
SpeedoMeterTmplt.prototype.cleanUp = function()
{

};

framework.registerTmpltLoaded("SpeedoMeterTmplt");
