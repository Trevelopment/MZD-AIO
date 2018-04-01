/*
 Copyright 2016 Herko ter Horst
 __________________________________________________________________________

 Filename: _speedometerApp.js
 __________________________________________________________________________
 */

log.addSrcFile("_speedometerApp.js", "_speedometer");

function _speedometerApp(uiaId) {
  log.debug("Constructor called.");

  // Base application functionality is provided in a common location via this call to baseApp.init().
  // See framework/js/BaseApp.js for details.
  baseApp.init(this, uiaId);
}


/*********************************
 * App Init is standard function *
 * called by framework           *
 *********************************/

/*
 * Called just after the app is instantiated by framework.
 * All variables local to this app should be declared in this function
 */
_speedometerApp.prototype.appInit = function() {
  log.debug("_speedometerApp appInit  called...");
  //Context table
  //@formatter:off
  this._contextTable = {
    "Start": { // Speedometer Start and choose context
      "sbName": "Speedometer",
      "readyFunction": this._StartContextReady.bind(this),
      "template": "StartTmplt",
      "templatePath": "apps/_speedometer/start",
      //"noLongerDisplayedFunction" : this._noLongerDisplayed.bind(this),
    },
    "SpeedClassic": { // Classic Speedometer
      "sbName": "Speedometer",
      "template": "SpeedoMeterTmplt",
      "templatePath": "apps/_speedometer/templates/SpeedoMeter", //only needed for app-specific templates
      "readyFunction": this._SpeedoContextReady.bind(this),
      "contextInFunction": this._SpeedCtxtInFunction.bind(this),
    }, // end of "SpeedoMeter"
    "SpeedBar": { // Bar Speedometer
      "sbName": "Speedometer",
      "template": "SpeedBarTmplt",
      "templatePath": "apps/_speedometer/templates/SpeedBar",
      "readyFunction": this._SpeedoContextReady.bind(this),
      "contextInFunction": this._BarCtxtInFunction.bind(this),
      "contextOutFunction": this._BarCtxtOutFunction.bind(this),
    } // end of "SpeedBar"
  }; // end of this.contextTable object
  //@formatter:on

  //@formatter:off
  this._messageTable = {
    // haven't yet been able to receive messages from MMUI
  };
  //@formatter:on
};

/**
 * =========================
 * CONTEXT CALLBACKS
 * =========================
 */
_speedometerApp.prototype._StartContextReady = function() {
  barSpeedometerMod ? aioMagicRoute("_speedometer", "SpeedBar") : aioMagicRoute("_speedometer", "SpeedClassic");
};
_speedometerApp.prototype._SpeedoContextReady = function() {
  framework.common.setSbDomainIcon("apps/_speedometer/IcnSbnSpeedometer.png");
  if (barSpeedometerMod) {
    LoadSpeedBarLayout();
  } else {
    LoadSpeedoClassicLayout();
  }
  if (sbHideInApp) {
    $('#SbSpeedo, #Sbfuel-bar-wrapper').fadeOut();
  }
};
_speedometerApp.prototype._SpeedCtxtInFunction = function() {
  barSpeedometerMod = false;
};
_speedometerApp.prototype._BarCtxtInFunction = function() {
  barSpeedometerMod = true;
};
_speedometerApp.prototype._BarCtxtOutFunction = function() {
  //TODO: Save changed layout to load when bar speedometer is reopened
};

/**
 * =========================
 * Framework register
 * Tell framework this .js file has finished loading
 * =========================
 */
framework.registerAppLoaded("_speedometer", null, false);
