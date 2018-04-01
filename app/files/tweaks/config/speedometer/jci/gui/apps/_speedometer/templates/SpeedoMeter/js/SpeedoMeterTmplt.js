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
function SpeedoMeterTmplt(uiaId, parentDiv, templateID, controlProperties) {
  this.longholdTimeout = null;
  this.divElt = null;
  this.templateName = "SpeedoMeterTmplt";
  this.btns = spdBtn.classic;
  this.classicTemplate = classicSpeedoTmplt;
  this.valuetable = '';
  this.onScreenClass = "SpeedoMeterTmplt";

  log.debug("  templateID in SpeedoMeterTmplt constructor: " + templateID);

  //@formatter:off
  //set the template properties
  this.properties = {
    "statusBarVisible": true,
    "leftButtonVisible": false,
    "rightChromeVisible": false,
    "hasActivePanel": false,
    "isDialog": false
  };
  //@formatter:on

  // create the div for template
  this.divElt = document.createElement('div');
  this.divElt.id = templateID;
  this.divElt.className = "TemplateWithStatus SpeedoMeterTmplt";

  parentDiv.appendChild(this.divElt);

  // do whatever you want here
  this.divElt.innerHTML = '<!-- MZD Speedometer v5 - Variant Mod  -->' +
    '<div id="speedometerContainer">' +
    '<div id="hideIdleBtn"></div>' +
    ' <div class="spdBtn' + this.btns.select + ' spdBtnSelect"></div>' +
    ' <div class="spdBtn' + this.btns.up + ' spdBtnUp"></div>' +
    ' <div class="spdBtn' + this.btns.down + ' spdBtnDown"></div>' +
    ' <div class="spdBtn' + this.btns.right + ' spdBtnRight"></div>' +
    ' <div class="spdBtn' + this.btns.left + ' spdBtnLeft"></div>' +
    ' <div class="spdBtn' + this.btns.hold.select + ' spdBtnSelecth"></div>' +
    ' <div class="spdBtn' + this.btns.hold.up + ' spdBtnUph"></div>' +
    ' <div class="spdBtn' + this.btns.hold.down + ' spdBtnDownh"></div>' +
    ' <div class="spdBtn' + this.btns.hold.right + ' spdBtnRighth"></div>' +
    ' <div class="spdBtn' + this.btns.hold.left + ' spdBtnLefth"></div>' +
    '<div id="table_bg">' +
    '<div id="valuetable">' +
    '</div>' +
    '</div>' +
    '<div id="analog">' +
    '<div id="speedometerBG"></div>' +
    '<div id="speedometerDial"></div>' +
    '<div id="textSpeed0">0</div>' +
    '<div id="textSpeed20">20</div>' +
    '<div id="textSpeed40">40</div>' +
    '<div id="textSpeed60">60</div>' +
    '<div id="textSpeed80">80</div>' +
    '<div id="textSpeed100">100</div>' +
    '<div id="textSpeed120">120</div>' +
    '<div id="textSpeed140">140</div>' +
    '<div id="textSpeed160">160</div>' +
    '<div id="textSpeed180">180</div>' +
    '<div id="textSpeed200">200</div>' +
    '<div id="textSpeed220">220</div>' +
    '<div id="textSpeed240">240</div>' +
    '<div class="topSpeedIndicator"></div>' +
    '<div class="speedIndicator"></div>' +
    '<div class="gpsCompassBG">' +
    '<div id="gpsCompass">' +
    '<div class="North">N</div>' +
    '<div class="NorthEast small">NE</div>' +
    '<div class="East">E</div>' +
    '<div class="SouthEast small">SE</div>' +
    '<div class="South">S</div>' +
    '<div class="SouthWest small">SW</div>' +
    '<div class="West">W</div>' +
    '<div class="NorthWest small">NW</div>' +
    '</div>' +
    '</div>' +
    '<div class="vehicleSpeed">0</div>' +
    '<div class="speedUnit">---</div>' +
    '<div class="topRPMIndicator"></div>' +
    '<div class="RPMIndicator"></div>' +
    '<div id="rpmDial">' +
    '<div class="step s0">0</div>' +
    '<div class="step s1">1</div>' +
    '<div class="step s2">2</div>' +
    '<div class="step s3">3</div>' +
    '<div class="step s4">4</div>' +
    '<div class="step s5">5</div>' +
    '<div class="step s6">6</div>' +
    '<div class="step s7">7</div>' +
    '<div class="unit">r/min</div>' +
    '<div class="scale">x1000</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div id="digital">' +
    '<fieldset id="speedCurrentFieldSet" class="pos0">' +
    '<legend class="vehDataLegends">Veh Speed <span class="spunit">(<span class="speedUnit">---</span>)<span></legend>' +
    '<div class="vehicleSpeed">0</div>' +
    '</fieldset>' +
    '<div id="speedo-fuel-bar-wrapper" class="fuel-bar-wrapper">' +
    '<div id="speedo-fuel-bar-container" class="fuel-bar-container">' +
    '<span id="speedo-fuel-bar" class="fuel-bar" style="width: 100%;">' +
    '</span></div></div>' +
    //'<div class="vehicleSpeed pos0">0</div>'+
    //'<div class="speedUnit">---</div>'+
    '</div>';
  for (speedo in this.classicTemplate) {
    this.valuetable += '<fieldset id="' + this.classicTemplate[speedo].id + '">' +
      '<legend>' + this.classicTemplate[speedo].name;
    if (this.classicTemplate[speedo].unitClass !== null) {
      this.valuetable += '<span class="spunit">(<span class="' + this.classicTemplate[speedo].unitClass + '"></span>)<span>';
    }
    this.valuetable += '</legend>' +
      '<div class="' + this.classicTemplate[speedo].class + '">' + this.classicTemplate[speedo].starting + '</div>' +
      '</fieldset>';
  }

  // '<fieldset id="gpsAltitudeMinFieldSet">'+
  //     '<legend>Altitude <span>min</span></legend>'+
  //     '<div class="gpsAltitudeMin">-</div>'+
  // '</fieldset>'+
  // '<fieldset id="gpsAltitudeMaxFieldSet">'+
  //     '<legend>Altitude <span>max</span></legend>'+
  //     '<div class="gpsAltitudeMax">-</div>'+
  // '</fieldset>'+

  document.getElementById('valuetable').innerHTML = this.valuetable;
  //$.getScript('apps/_speedometer/js/speedometerUpdate.js',
  setTimeout(function() {
    updateSpeedoApp();
  }, 700); //);
}

/*
 *  @param clickTarget (jQuery Object) The jQuery Object to click on a single click action
 *  clickTarget can also be a function or a string of the DOM node to make the jQuery Object
 */
SpeedoMeterTmplt.prototype.singleClick = function(clickTarget) {
  if (typeof clickTarget === "string") { clickTarget = $(clickTarget) }
  (speedometerLonghold) ? speedometerLonghold = false: (typeof clickTarget === "function") ? clickTarget() : clickTarget.click();
  clearTimeout(this.longholdTimeout);
  this.longholdTimeout = null;
}
/*
 *  @param clickFunction (function) Function to run on a long click
 *  clickFunction can also be a a string of the DOM node or jQuery Object to click
 */
SpeedoMeterTmplt.prototype.longClick = function(clickFunction) {
  if (typeof clickFunction === "string") { clickFunction = $(clickFunction) }
  this.longholdTimeout = setTimeout(function() {
    speedometerLonghold = true;
    (typeof clickFunction === "function") ? clickFunction(): clickFunction.click();
  }, 1200);
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
 * Controller functions are defined in speedometerUpdate.js
 */
SpeedoMeterTmplt.prototype.handleControllerEvent = function(eventID) {
  log.debug("handleController() called, eventID: " + eventID);

  var retValue = 'giveFocusLeft';

  switch (eventID) {
    case "upStart":
      this.longClick('.spdBtnUph');
      retValue = "consumed";
      break;
    case "up":
      this.singleClick('.spdBtnUp');
      retValue = "consumed";
      break;
    case "downStart":
      this.longClick('.spdBtnDownh');
      retValue = "consumed";
      break;
    case "down":
      this.singleClick('.spdBtnDown');
      retValue = "consumed";
      break;
    case "selectStart":
      this.longClick('.spdBtnSelecth');
      retValue = "consumed";
      break;
    case "select":
      this.singleClick('.spdBtnSelect');
      retValue = "consumed";
      break;
    case "rightStart":
      this.longClick('.spdBtnRighth');
      retValue = "consumed";
      break;
    case "right":
      this.singleClick('.spdBtnRight');
      retValue = "consumed";
      break;
    case "leftStart":
      this.longClick('.spdBtnLefth');
      retValue = "consumed";
      break;
    case "left":
      this.singleClick('.spdBtnLeft');
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
SpeedoMeterTmplt.prototype.cleanUp = function() {
  if (framework.getCurrentApp() !== "_speedometer") {
    $('#SbSpeedo, #Sbfuel-bar-wrapper').fadeIn();
  }
};

framework.registerTmpltLoaded("SpeedoMeterTmplt");
