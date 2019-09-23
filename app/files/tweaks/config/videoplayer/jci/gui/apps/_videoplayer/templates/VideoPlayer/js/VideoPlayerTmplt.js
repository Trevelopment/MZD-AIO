/*
 Copyright 2019 Trezdog44 & VIC_BAM85
 __________________________________________________________________________

 Filename: VideoPlayerTmplt.js
 __________________________________________________________________________
*/
/* jshint -W117 */
log.addSrcFile("VideoPlayerTmplt.js", "videoplayer");

/*
 * =========================
 * Constructor
 * =========================
 */
function VideoPlayerTmplt(uiaId, parentDiv, templateID, controlProperties) {
  this.divElt = null;
  this.templateName = "VideoPlayerTmplt";

  this.onScreenClass = "VideoPlayerTmplt";

  log.debug("  templateID in VideoPlayerTmplt constructor: " + templateID);
  this.longholdTimeout = null;
  //@formatter:off
  //set the template properties
  this.properties = {
    "statusBarVisible": true,
    "leftButtonVisible": false,
    "rightChromeVisible": false,
    "hasActivePanel": true, //changed
    "isDialog": false
  };
  //@formatter:on

  // create the div for template
  this.divElt = document.createElement('div');
  this.divElt.id = templateID;
  this.divElt.className = "TemplateFull VideoPlayerTmplt";

  parentDiv.appendChild(this.divElt);

  // do whatever you want here
  //var script1 = document.createElement("script");
  this.divElt.innerHTML = '<div id="myVideoContainer">' +
    '<div id="myVideoControlDiv">' +
    '<ul>' +
    '<li id="myVideoStopBtn" style="background-image: url(apps/_videoplayer/templates/VideoPlayer/images/myVideoStopBtn.png)"></li>' +
    '<li id="myVideoNextBtn" style="background-image: url(apps/_videoplayer/templates/VideoPlayer/images/myVideoNextBtn.png)"></li>' +
    '<li id="myVideoFF" style="background-image: url(apps/_videoplayer/templates/VideoPlayer/images/FF.png)"></li>' +
    '<li id="myVideoPausePlayBtn" style="background-image: url(apps/_videoplayer/templates/VideoPlayer/images/myVideoPauseBtn.png)"></li>' +
    '<li id="myVideoRW" style="background-image: url(apps/_videoplayer/templates/VideoPlayer/images/RW.png)"></li>' +
    '<li id="myVideoPreviousBtn" style="background-image: url(apps/_videoplayer/templates/VideoPlayer/images/myVideoPreviousBtn.png)"></li>' +

    '<li id="myVideoFullScrBtn" class="playbackOption"><a>Full Screen</a></li>' +
    '<li id="myVideoRepeatBtn" class="playbackOption"><a>Repeat</a></li>' +
    '<li id="myVideoShuffleBtn" class="playbackOption"><a>Shuffle</a></li>' +
    '<li id="myResumePlay" class="playbackOption"><a>Resume Play</a></li>' +
    '<li id="myPlayMusicBtn" class="playbackOption"><a>Play Music</a></li>' +
    '<li id="rebootBtnDiv" class="playbackOption" style="float:left !important; background-image: url(apps/_videoplayer/templates/VideoPlayer/images/rebootSys.png)"></li>' +
    '</ul>' +
    '<div id="myVideoName" style="font-style:italic"></div>' +
    '<div id="myVideoStatus" style="font-style:italic"></div>' +
    '</div>' +
    '<div id="myMusicMetadata"></div>' +
    '<div id="myVideoScroll">' +
    '<li id="myVideoInfo" class="playbackOption" style="background-image:url(apps/_videoplayer/templates/VideoPlayer/images/Info.png)"></li>' +
    '<img src="apps/_videoplayer/templates/VideoPlayer/images/myVideoUpBtn.png" id="myVideoScrollUp" />' +
    '<img src="apps/_videoplayer/templates/VideoPlayer/images/myVideoDownBtn.png" id="myVideoScrollDown" />' +
    '<li id="toggleBgBtn" class="playbackOption" style="background-image:url(apps/_videoplayer/templates/VideoPlayer/images/bgbtn.png)"></li>' +
    '<li id="myVideoMovieBtn" class="playbackOption" style="background-image: url(apps/_videoplayer/templates/VideoPlayer/images/myVideoMovieBtn.png)"></li>' +
    '</div>' +
    '</div>' +
    '<div id="videoInfoPanel" class="panelOptions">' +
    '<span id="popInfoTab" class="infoBtn">Options</span>' +
    '<span id="popOptionsTab" class="infoBtn">Info</span>' +
    '<span id="myVideoInfoClose"><a>&times;</a></span>' +
    '<aside id="widget-content">' +
    '<div id="widgetContent">' +
    '<div id="optionTitle">Video Player Options</div>' +
    '<ul><li id="optionStatusbarTitle" class="panelOption"><a>Title to Statusbar</a></li>' +
    '<li id="optionBlackOut" class="panelOption"><a>Black Out Background</a></li>' +
    '<li id="colorThemes" class="panelOption">' +
    '<a class="darkred" style="color:red">red</a>' +
    '<a class="darkblue" style="color:blue">blue</a>' +
    '<a class="darkgreen" style="color:green">green</a>' +
    '<a class="darkviolet" style="color:darkviolet">violet</a><br>' +
    '<a class="darkorange" style="color:orange">orange</a>' +
    '<a class="teal" style="color:teal">teal</a>' +
    '<a class="darkslategrey" style="color:darkslategrey">slate</a>' +
    '<a class="seashell" style="color:seashell">white</a>' +
    '</li></ul></div>' +
    '<div id="widgetContentState">' +
    '<div id="infoTitle">Video Player Information</div>' +
    '<ul><li>Best Video Format: 360p MP4 H264 AAC</li>' +
    '<li>For Hackers:</li>' +
    '<li>https://github.com/Trevelopment/Mazda-Videoplayer</li>' +
    '<li id="unmountbtn" class="vpUnmnt"><button id="unmountSwapVP">Unmount Swap</button></li>' +
    '<li id="unmountMsg" class="vpUnmnt"></li>' +
    '</ul></div></aside></div>' +
    '<script src="apps/_videoplayer/js/videoplayer-v3.js" type="text/javascript"></script>';
  // Append the control div with black overlay background to body so it overlays everything
  // this div is removed in the cleanUp() function
  document.body.appendChild(document.createElement('div')).className = "VPControlOverlay";
  this.playerControl = '<div id="blackBgn">' +
    '<div class="StatusBarCtrlAppName VPCtrlAppName"></div>' +
    '<div id="blackOutVideoStatus" style="font-style:italic"></div>' +
    '</div>' +
    '<ul>' +
    '<li id="videoPrevBtn" class="videoTouchControls"></li>' +
    '<li id="videoPlayRWBtn" class="videoTouchControls"></li>' +
    '<li id="videoPlayBtn" class="videoTouchControls"></li>' +
    '<li id="videoStopBtn" class="videoTouchControls"></li>' +
    '<li id="videoShuffleBtn" class="videoTouchControls"></li>' +
    '<li id="videoReAllBtn" class="videoTouchControls"></li>' +
    '<li id="videoPlayFFBtn" class="videoTouchControls"></li>' +
    '<li id="videoNextBtn" class="videoTouchControls"></li>' +
    '</ul>';
  document.getElementsByClassName('VPControlOverlay')[0].innerHTML = this.playerControl;
  setTimeout(function() {
    // We initialize the video player with this function
    StartVideoPlayerApp();
  }, 700);
}
if (typeof player === "undefined") {
  player = framework.getAppInstance("_videoplayer");
}
/*
 * =========================
 * Standard Template API functions
 * =========================
 */
/*
 *  singleClick - used by handleControllerEvent for short click multicontroller events
 * @param   clickTarget (function) Function to run on a single click
 * @param   eventID (string) event ID to pass to clickTarget
 *
 */
VideoPlayerTmplt.prototype.singleClick = function(clickTarget, eventID) {
  clearTimeout(this.longholdTimeout);
  this.longholdTimeout = null;
  (player.hold) ? player.hold = false: (typeof clickTarget === "function") ? clickTarget(eventID) : null;
}
/*
 * longClick - used by handleControllerEvent for long hold multicontroller events
 * @param   clickFunction (function) Function to run on a long click
 * @param   eventID (string) event ID to passs to clickFunction
 */
VideoPlayerTmplt.prototype.longClick = function(clickFunction, eventID) {
  this.longholdTimeout = setTimeout(function() {
    player.hold = true;
    (typeof clickFunction === "function") ? clickFunction(eventID): null;
  }, 1200);
}
/* (internal - called by the framework)
 * Handles multicontroller events.
 * @param   eventID (string) any of the Internal event name values in IHU_GUI_MulticontrollerSimulation.docx (e.g. 'cw',
 * 'ccw', 'select')
 */
VideoPlayerTmplt.prototype.handleControllerEvent = function(eventID) {
  log.debug("handleController() called, eventID: " + eventID);

  var retValue;
  if (eventID.indexOf('Start') !== -1) {
    retValue = this.longClick(handleHoldCommander, eventID);
  } else {
    retValue = this.singleClick(handleCommander, eventID);
  }

  //case "down":
  //case "up":
  //case "ccw":
  //case "cw":
  //case "select":
  //case "left":
  //case "right":
  // case "downStart":
  // case "upStart":
  // case "leftStart":
  // case "rightStart":
  // case "selectStart":
  //case "selectHold":
  //case "leftHold":
  //case "rightHold":
  //case "upHold":
  //case "downHold":

  //retValue = "consumed";
  //retValue = 'giveFocusLeft';

  return retValue;
};
/*
 * Called by the app during templateNoLongerDisplayed. Used to perform garbage collection procedures on the template and
 * its controls.
 */
VideoPlayerTmplt.prototype.cleanUp = function() {
  $('#SbSpeedo').removeClass('stayHidden');
  var child = document.getElementById(this.divElt.id);
  child.parentNode.removeChild(child);
  this.divElt = null;
  child = null;
  document.getElementsByClassName('VPControlOverlay')[0].parentNode.removeChild(document.getElementsByClassName('VPControlOverlay')[0]);
  $('#SbSpeedo, #Sbfuel-bar-wrapper').fadeIn();
};

framework.registerTmpltLoaded("VideoPlayerTmplt");
