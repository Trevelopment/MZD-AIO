/*
 Copyright 2016 Herko ter Horst
 __________________________________________________________________________

 Filename: _speedometerApp.js
 __________________________________________________________________________
 */

log.addSrcFile("_speedometerApp.js", "_speedometer");

function _speedometerApp(uiaId)
{
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
_speedometerApp.prototype.appInit = function()
{
    log.debug("_speedometerApp appInit  called...");

    //Context table
    //@formatter:off
    this._contextTable = {
        "Start": { // initial context must be called "Start"
            "sbName": "Speedometer",
            "template": "SpeedoMeterTmplt",
            "templatePath": "apps/_speedometer/templates/SpeedoMeter", //only needed for app-specific templates
            "readyFunction": this._StartContextReady.bind(this)
        } // end of "SpeedoMeter"
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
_speedometerApp.prototype._StartContextReady = function ()
{
  framework.common.setSbDomainIcon("apps/_speedometer/IcnSbnSpeedometer.png");
};

/**
 * =========================
 * Framework register
 * Tell framework this .js file has finished loading
 * =========================
 */
framework.registerAppLoaded("_speedometer", null, false);
