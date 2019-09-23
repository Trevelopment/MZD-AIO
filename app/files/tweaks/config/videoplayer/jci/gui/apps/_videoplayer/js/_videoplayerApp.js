/* jshint -W117 */
/*
 Copyright 2016 Herko ter Horst
 __________________________________________________________________________

 Filename: _videoplayerApp.js
 __________________________________________________________________________
 */

log.addSrcFile("_videoplayerApp.js", "_videoplayer");

function _videoplayerApp(uiaId) {
  log.debug("Constructor called.");

  // Base application functionality is provided in a common location via this call to baseApp.init().
  // See framework/js/BaseApp.js for details.
  baseApp.init(this, uiaId);
}

// load jQuery Globally (if needed)
if (!window.jQuery) {
  utility.loadScript("addon-common/jquery.min.js");
}
/*********************************
 * App Init is standard function *
 * called by framework           *
 *********************************/

/*
 * Called just after the app is instantiated by framework.
 * All variables local to this app should be declared in this function
 */

_videoplayerApp.prototype.appInit = function() {
  log.debug("_videoplayerApp appInit  called...");
  // These values need to persist through videoplayer instances
  this.hold = false;
  this.resumePlay = 0;
  this.musicIsPaused = false;
  this.savedVideoList = null;
  this.resumeVideo = JSON.parse(localStorage.getItem('videoplayer.resumevideo')) || true; // resume is now checked by default
  this.currentVideoTrack = JSON.parse(localStorage.getItem('videoplayer.currentvideo')) || null;
  //this.resumePlay = JSON.parse(localStorage.getItem('videoplayer.resume')) || 0;

  //Context table
  //@formatter:off

  this._contextTable = {
    "Start": { // initial context must be called "Start"
      "sbName": "Video Player",
      "template": "VideoPlayerTmplt",
      "templatePath": "apps/_videoplayer/templates/VideoPlayer", //only needed for app-specific templates
      "readyFunction": this._StartContextReady.bind(this),
      "contextOutFunction": this._StartContextOut.bind(this),
      "noLongerDisplayedFunction": this._noLongerDisplayed.bind(this)
    } // end of "VideoPlayer"
  }; // end of this.contextTable object
  //@formatter:on

  //@formatter:off
  this._messageTable = {
    // haven't yet been able to receive messages from MMUI
  };
  //@formatter:on
  framework.transitionsObj._genObj._TEMPLATE_CATEGORIES_TABLE.VideoPlayerTmplt = "Detail with UMP";
};

/**
 * =========================
 * CONTEXT CALLBACKS
 * =========================
 */
_videoplayerApp.prototype._StartContextReady = function() {
  framework.common.setSbDomainIcon("apps/_videoplayer/templates/VideoPlayer/images/icon.png");
};
_videoplayerApp.prototype._StartContextOut = function() {
  CloseVideoFrame();
  framework.common.setSbName('');
};

_videoplayerApp.prototype._noLongerDisplayed = function() {
  // Stop and close video frame
  CloseVideoFrame();
  // If we are in reverse then save CurrentVideoPlayTime to resume the video where we left of
  if (framework.getCurrentApp() === 'backupparking'|| framework.getCurrentApp() === 'phone' || (ResumePlay && CurrentVideoPlayTime !== null)) {
    this.resumePlay = this.resumePlay || CurrentVideoPlayTime;
    CurrentVideoPlayTime = 0;
    //localStorage.setItem('videoplayer.resume', JSON.stringify(CurrentVideoPlayTime));
  }
  // If we press the 'Entertainment' button we will be running this in the 'usbaudio' context
  if (!this.musicIsPaused) {
    setTimeout(function() {
      if (framework.getCurrentApp() === 'usbaudio') {
        framework.sendEventToMmui('Common', 'Global.Pause');
        framework.sendEventToMmui('Common', 'Global.GoBack');
        this.musicIsPaused = true; // Only run this once
      }
    }, 100);
  }
};

/**
 * =========================
 * Framework register
 * Tell framework this .js file has finished loading
 * =========================
 */
framework.registerAppLoaded("_videoplayer", null, false);
