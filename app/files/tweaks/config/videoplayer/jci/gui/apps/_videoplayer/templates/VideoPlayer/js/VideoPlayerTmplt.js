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
	'<li class="rebootBtnDiv" style="float:left !important; background-image: url(apps/_videoplayer/templates/VideoPlayer/images/rebootSys.png)"></li>'+
	'</ul>'+
	'<div id="myVideoName" style="font-style:italic"></div>'+
	'<div id="myVideoStatus" style="font-style:italic"></div></div>'+
	'<div id="myVideoList"></div>'+
	'<div id="myVideoScroll">'+
	'<img src="apps/_videoplayer/templates/VideoPlayer/images/Info.png" id="myVideoInfo" />'+
	'<img src="apps/_videoplayer/templates/VideoPlayer/images/myVideoUpBtn.png" id="myVideoScrollUp" />'+
	'<img src="apps/_videoplayer/templates/VideoPlayer/images/myVideoDownBtn.png" id="myVideoScrollDown" />'+
	'<img src="apps/_videoplayer/templates/VideoPlayer/images/bgbtn.png" id="toggleBgBtn" />'+
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
	'<div id="videoInfoPanel"><span id="myVideoInfoClose">&times;</span>'+
	'<span class="stateInfo infoBtn">State</span>'+
	'<span class="recentInfo infoBtn">Played</span>'+
	'<div id="infoTitle">Video Player Info</div>'+
	'<aside id="widget-content">'+
	'<div id="widgetContent"></div>'+
	'<div id="widgetContentState"></div>'+
	'</aside></div>'+
	'<script src="addon-common/jquery.min.js" type="text/javascript"></script>'+
	'<script src="apps/_videoplayer/js/videoplayer-v2.js" type="text/javascript"></script>';
	//$.getScript('apps/_videoplayer/js/videoplayer-v2.js');
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
};

framework.registerTmpltLoaded("VideoPlayerTmplt");
