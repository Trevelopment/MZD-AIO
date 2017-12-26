/*
 Copyright 2016 Herko ter Horst
 __________________________________________________________________________

 Filename: VideoPlayerTmplt.js
 __________________________________________________________________________
 */

log.addSrcFile("VideoPlayerTmplt.js", "videoplayer");

/*
 * =========================
 * Constructor
 * =========================
 */
function VideoPlayerTmplt(uiaId, parentDiv, templateID, controlProperties)
{
    this.divElt = null;
    this.templateName = "VideoPlayerTmplt";

    this.onScreenClass = "VideoPlayerTmplt";

    log.debug("  templateID in VideoPlayerTmplt constructor: " + templateID);

    //@formatter:off
    //set the template properties
    this.properties = {
        "statusBarVisible" : true,
        "leftButtonVisible" : false,
        "rightChromeVisible" : false,
        "hasActivePanel" : true,//changed
        "isDialog" : false
    };
    //@formatter:on

    // create the div for template
    this.divElt = document.createElement('div');
    this.divElt.id = templateID;
    this.divElt.className = "TemplateFull VideoPlayerTmplt";

    parentDiv.appendChild(this.divElt);

    // do whatever you want here
                //var script1 = document.createElement("script");
    this.divElt.innerHTML = '<div id="myVideoContainer">'+
	'<div id="myVideoControlDiv">'+
	'<ul>'+
	'<li id="myVideoStopBtn" style="display: none; background-image: url(apps/_videoplayer/templates/VideoPlayer/images/myVideoStopBtn.png)"></li>'+
	'<li id="myVideoNextBtn" style="display: none; background-image: url(apps/_videoplayer/templates/VideoPlayer/images/myVideoNextBtn.png)"></li>'+
	'<li id="myVideoFF" style="display: none; background-image: url(apps/_videoplayer/templates/VideoPlayer/images/FF.png)"></li>'+
	'<li id="myVideoPausePlayBtn" style="display: none; background-image: url(apps/_videoplayer/templates/VideoPlayer/images/myVideoPauseBtn.png)"></li>'+
	'<li id="myVideoRW" style="display: none; background-image: url(apps/_videoplayer/templates/VideoPlayer/images/RW.png)"></li>'+
	'<li id="myVideoPreviousBtn" style="display: none; background-image: url(apps/_videoplayer/templates/VideoPlayer/images/myVideoPreviousBtn.png)"></li>'+
	'<li id="myVideoMovieBtn" class="playbackOption" style="background-image: url(apps/_videoplayer/templates/VideoPlayer/images/myVideoMovieBtn.png)"><a>Search Videos</a></li>'+
	'<li id="myVideoFullScrBtn" class="playbackOption"><a>Full Screen</a></li>' +
	'<li id="myVideoRepeatBtn" class="playbackOption"><a>Repeat 1</a></li>'+
	'<li id="myVideoShuffleBtn" class="playbackOption"><a>Shuffle</a></li>'+
	'<li id="myVideoRepeatAllBtn" class="playbackOption"><a>Repeat All</a></li>'+
	'<li id="rebootBtnDiv" class="playbackOption" style="float:left !important; background-image: url(apps/_videoplayer/templates/VideoPlayer/images/rebootSys.png)"></li>'+
	'</ul>'+
	'<div id="myVideoName" style="font-style:italic"></div>'+
	'<div id="myVideoStatus" style="font-style:italic"></div></div>'+
	'<div id="myVideoList"></div>'+
	'<div id="myVideoScroll">'+
	'<li id="myUnicodeToggle" style="background-image:url(apps/_videoplayer/templates/VideoPlayer/images/uni.png)"></li>'+
	'<li id="myVideoInfo" class="playbackOption" style="background-image:url(apps/_videoplayer/templates/VideoPlayer/images/Info.png)"></li>'+
	'<img src="apps/_videoplayer/templates/VideoPlayer/images/myVideoUpBtn.png" id="myVideoScrollUp" />'+
	'<img src="apps/_videoplayer/templates/VideoPlayer/images/myVideoDownBtn.png" id="myVideoScrollDown" />'+
	'<li id="toggleBgBtn" class="playbackOption" style="background-image:url(apps/_videoplayer/templates/VideoPlayer/images/bgbtn.png)"></li>'+
	'</div>'+
	'<div id="videoPlayControl">'+
	'<ul>'+
	'<li id="videoPrevBtn" class="videoTouchControls"></li>'+
	'<li id="videoPlayRWBtn" class="videoTouchControls"></li>'+
  '<li id="videoPlayBtn" class="videoTouchControls"></li>'+
	'<li id="videoStopBtn" class="videoTouchControls"></li>'+
	'<li id="videoShuffleBtn" class="videoTouchControls"></li>'+
  '<li id="videoReAllBtn" class="videoTouchControls"></li>'+
  '<li id="videoPlayFFBtn" class="videoTouchControls"></li>'+
  '<li id="videoNextBtn" class="videoTouchControls"></li>'+
	'</ul>'+
	'</div>'+
	'</div>'+
  '<div id="videoInfoPanel" class="panelOptions">'+
	'<span id="popInfoTab" class="infoBtn">Options</span>'+
	'<span id="popOptionsTab" class="infoBtn">Info</span>'+
  '<span id="myVideoInfoClose"><a>&times;</a></span>'+
	'<aside id="widget-content">'+
	'<div id="widgetContent">'+
  '<div id="optionTitle">Video Player Options</div>'+
  '<button id="optionTestError" class="panelOption btn">Test Error Message</button>'+
  '<ul><li id="optionHideUnicodeBtn" class="panelOption"><a>Hide Unicode Button</a></li>' +
  '<li id="optionStatusbarTitle" class="panelOption"><a>Title to Statusbar</a></li>'+
  '<li id="colorThemes" class="panelOption">'+
  '<a class="darkred" style="color:red">red</a>'+
  '<a class="darkblue" style="color:blue">blue</a>'+
  '<a class="darkgreen" style="color:green">green</a>'+
  '<a class="darkviolet" style="color:darkviolet">violet</a><br>'+
  '<a class="darkorange" style="color:orange">orange</a>'+
  '<a class="teal" style="color:teal">teal</a>'+
  '<a class="darkslategrey" style="color:darkslategrey">slate</a>'+
  '<a class="seashell" style="color:seashell">white</a>'+
  '<!--a class="darkgoldenrod" style="color:darkgoldenrod">gold</a-->'+
  '</li></ul></div>'+
	'<div id="widgetContentState">'+
  '<div id="infoTitle">Video Player Information</div>'+
  '<ul><li>Best Video Format: 360p MP4 H264 AAC</li>'+
  '<li>Switch To Unicode Mode To Fix Character Isues</li>'+
  '<li>For Hackers:</li>'+
  '<li>https://github.com/Trevelopment/Mazda-Videoplayer</li>'+
	'</ul></div></aside></div>'+
  '<script src="addon-common/jquery.min.js" type="text/javascript"></script>'+
  '<script src="apps/_videoplayer/js/videoplayer-v2.js" type="text/javascript"></script>';
  /*if (!window.jQuery) {
    utility.loadScript("addon-common/jquery.min.js", {}, function(){
      $.getScript("apps/_videoplayer/js/videoplayer-v2.js");
    });
  }*/
}

/*
 * =========================
 * Standard Template API functions
 * =========================
 */

/* (internal - called by the framework)
 * Handles multicontroller events.
 * @param   eventID (string) any of the Internal event name values in IHU_GUI_MulticontrollerSimulation.docx (e.g. 'cw',
 * 'ccw', 'select')
 */
VideoPlayerTmplt.prototype.handleControllerEvent = function(eventID)
{
    log.debug("handleController() called, eventID: " + eventID);

	var retValue = handleCommander(eventID);

	//case "down":
	//case "up":
	//case "downStart":
	//case "upStart":
	//case "ccw":
	//case "cw":
	//case "leftStart":
	//case "select":
	//case "rightStart":
	//case "left":
	//case "right":
	//case "selectStart":
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
VideoPlayerTmplt.prototype.cleanUp = function()
{
	var child = document.getElementById(this.divElt.id);
	child.parentNode.removeChild(child);

	this.divElt=null;
	child=null;
  $('#SbSpeedo').fadeIn();
};

framework.registerTmpltLoaded("VideoPlayerTmplt");
