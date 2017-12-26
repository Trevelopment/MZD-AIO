/*
 Copyright 2016 Herko ter Horst
 __________________________________________________________________________

 Filename: _videoplayerApp.js
 __________________________________________________________________________
 */

log.addSrcFile("_videoplayerApp.js", "_videoplayer");

function _videoplayerApp(uiaId)
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
_videoplayerApp.prototype.appInit = function()
{
    log.debug("_videoplayerApp appInit  called...");


    //Context table
    //@formatter:off

    this._contextTable = {
        "Start": { // initial context must be called "Start"
            "sbName": "Video Player",
            "template": "VideoPlayerTmplt",
            "templatePath": "apps/_videoplayer/templates/VideoPlayer", //only needed for app-specific templates
            "readyFunction": this._StartContextReady.bind(this)
        } // end of "VideoPlayer"
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
_videoplayerApp.prototype._StartContextReady = function ()
{
  framework.common.setSbDomainIcon("apps/_videoplayer/templates/VideoPlayer/images/icon.png");
  framework.transitionsObj._genObj._TEMPLATE_CATEGORIES_TABLE.VideoPlayerTmplt = "Detail with UMP";
};

/**
 * =========================
 * Framework register
 * Tell framework this .js file has finished loading
 * =========================
 */
framework.registerAppLoaded("_videoplayer", null, false);
