/*
Copyright 2017 Trez
__________________________________________________________________________

Filename: AIOTweaksTmplt.js
__________________________________________________________________________
*/
/* jshint -W108, -W117  */
log.addSrcFile("AIOTweaksTmplt.js", "AIOTweaks");

/*
* =========================
* Constructor
* =========================
*/
function AIOTweaksTmplt(uiaId, parentDiv, templateID, controlProperties)
{
  this.divElt = null;
  this.templateName = "AIOTweaksTmplt";

  this.onScreenClass = "AIOTweaksTmplt";

  log.debug("  templateID in AIOTweaksTmplt constructor: " + templateID);

  //@formatter:off
  //set the template properties
  this.properties = {
    "statusBarVisible" : true,
    "leftButtonVisible" : false,
    "rightChromeVisible" : false,
    "hasActivePanel" : true,
    "isDialog" : false
  };
  //@formatter:on

  // create the div for template
  this.divElt = document.createElement('div');
  this.divElt.id = templateID;
  this.divElt.className = "TemplateFull AIOTweaksTmplt";

  parentDiv.appendChild(this.divElt);

  // Build The Environment
  this.divElt.innerHTML = '<ul id="main" class="tab" style="margin-top:60px">' +
  '<li><a href="javascript:void(0)" class="tablinks" id="Twk">Apps</a></li>' +
  '<li><a href="javascript:void(0)" class="tablinks" id="Main">Tweaks</a></li>' +
  '<li><a href="javascript:void(0)" class="tablinks" id="Opt">Options</a></li>' +
  '</ul>' +
  '<div id="MainMenu" class="tabcontent FadeIn">' +
  '</div>'+
  '<div id="Tweaks" class="tabcontent FadeIn">'+
  '</div>'+
  '<div id="Options" class="tabcontent FadeIn">'+
  '</div>'+
  '<div id="AioInfoPanel"><div id="AioInformation"></div></div>';
  // Tab Openers
  $("#Main").click(function(){$('.tabcontent').hide();$('#MainMenu').show()});
  $("#Twk").click(function(){$('.tabcontent').hide();$('#Tweaks').show()});
  $("#Opt").click(function(){$('.tabcontent').hide();$('#Options').show()});

  // Buttons
  // Tweaks Section
  $("<button/>").attr("id", "star1").addClass('mmLayout').text('Star 1').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "star3").addClass('mmLayout').text('Star 2').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "star2").addClass('mmLayout').text('Inverted').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "star4").addClass('mmLayout').text('Flat Line').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "ellipse").addClass('toggleTweaks').text('Hide Ellipse').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "minicoins").addClass('toggleTweaks').text('Mini Coins').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "label3d").addClass('toggleTweaks').text('3D Main Text').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "hidelabel").addClass('toggleTweaks').text('Hide Main Text').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "bgrAlbmArt").addClass('toggleTweaks').text('Bigger Albm Art').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "txtShadow").addClass('toggleTweaks').text('Text Shadow').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "no-btn-bg").addClass('toggleTweaks').text('Hide Button Background').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "hideStatus").addClass('toggleTweaks').text('Hide StatusBar').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "hideMusicBg").addClass('toggleTweaks').text('Hide Entertainment Background').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "hideListBg").addClass('toggleTweaks').text('Hide List Background').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "clearTweaksBtn").text('Reset Tweaks').appendTo($('#MainMenu'));
  $("<div/>").attr("id", "MainMenuMsg").css({"padding":"0px"}).insertAfter($('#MainMenu'));

  // Apps Section
  $("<button/>").attr("id", "twkOut").addClass('mainApps').text('Home').addClass('audioSources').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "usba").text('USB A').addClass('audioSources').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "usbb").text('USB B').addClass('audioSources').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "BluetoothAudio").addClass('audioSources').text('Bluetooth').appendTo($('#Tweaks'));
  $("<br>").appendTo($('#Tweaks'));
  $("<button/>").attr("id", "previousTrackBtn").addClass('audioSources').text('Previous').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "nextTrackBtn").addClass('audioSources').text('Next').appendTo($('#Tweaks'));
  //$("<button/>").attr("id", "allSongsBtn").addClass('audioSources').text('All Songs').appendTo($('#Tweaks'));
  $("<br>").appendTo($('#Tweaks'));
  $("<button/>").attr("id", "headunitLogBtn").addClass('aaLog').text('View Headunit Log').appendTo($('#Tweaks'));
  //$("<button/>").attr("id", "fakeIncomingCallBtn").addClass('test').text('Fake Incoming Call').appendTo($('#Tweaks'));
  //$("<button/>").attr("id", "activeCallBtn").addClass('test').text('Fake Active Call').appendTo($('#Tweaks'));

  $('<div/>').attr('id','aaTitle').text('Android Auto Headunit').appendTo('#Tweaks');
  $("<button/>").attr("id", "AAstart").addClass('aaFunc').text('Start').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "AAstop").addClass('aaFunc').text('Stop').appendTo($('#Tweaks'));
  $('<div/>').attr('id','csTitle').text('CastScreen Receiver').appendTo('#Tweaks');
  $("<button/>").attr("id", "CSstart").addClass('csFunc').text('Start').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "CSstop").addClass('csFunc').text('Stop').appendTo($('#Tweaks'));
  //$("<button/>").attr("id", "pauseBtn").addClass('audioCtrls').text('Pause').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "scrollUpBtn").addClass('AIO-scroller').html('<img src="apps/_aiotweaks/templates/AIOTweaks/images/scrollUp.png" />').insertAfter($('#AioInfoPanel'));
  $("<button/>").attr("id", "scrollDownBtn").addClass('AIO-scroller').html('<img src="apps/_aiotweaks/templates/AIOTweaks/images/scrollDown.png" />').insertAfter($('#AioInfoPanel'));

  // Options Section
  //$("<button/>").attr("id", "screenshotBtn").text('Screenshot').appendTo($('#Options'));
  //$("<button/>").attr("id", "messageBtn").text('Message').appendTo($('#Options'));
  $("<button/>").attr("id", "aioInfo").text('Info').appendTo($('#Options'));
  $("<button/>").attr("id", "messageTestBtn").text('Message Test').appendTo($('#Options'));
  $("<button/>").attr("id", "touchscreenToggle").text('Touchscreen').appendTo($('#Options'));
  $("<button/>").attr("id", "showBgBtn").text('Show Background').appendTo($('#Options'));
  $("<button/>").attr("id", "showEnvBtn").text('Env').appendTo($('#Options'));
  $("<button/>").attr("id", "appListBtn").text('App List').appendTo($('#Options'));
  //$("<button/>").attr("id", "test").text('NodeJS Test').appendTo($('#Options'));
  //$("<button/>").attr("id", "chooseBg").text('Node Version').appendTo($('#Options'));
  //$("<button/>").attr("id", "saveScreenshotBtn").text('Save Screenshot to SD').appendTo($('#Options')).hide();
  //$("<button/>").attr("id", "runTweaksBtn").text('Run AIO Tweaks').appendTo($('#Options'));
  //$("<button/>").attr("id", "backupCamBtn").text('Backup Camera').appendTo($('#Options'));
  $("<button/>").attr("id", "displayOffBtn").text('Screen Off').appendTo($('#Options'));
  $("<button/>").attr("id", "wifiSettings").text('WIFI Settings').appendTo($('#Options'));
  $("<button/>").attr("id", "systemTab").text('Settings > System').appendTo($('#Options'));
  $("<button/>").attr("id", "toggleWifiAPBtn").text('WifiAP').appendTo($('#Options'));
  $("<button/>").attr("id", "stopFirewallBtn").text('Stop Firewall').appendTo($('#Options'));
  $("<button/>").attr("id", "fullRestoreConfirmBtn").text('System Restore').appendTo($('#Options'));
  $("<button/>").attr("id", "aioReboot").text('Reboot').appendTo($('#Options'));
  $("<div/>").attr("id", "closeAioInfo").appendTo('#AioInfoPanel');
  $("<div/>").attr("id", "touchscreenPanel").insertAfter($('#Options'));
  $("<div/>").attr("id", "closeTouchPanel").addClass('Touch').appendTo('#touchscreenPanel');
  $("<button/>").attr("id", "touchscreenBtn").addClass('Touch').text('Enable Touchscreen & Menu').appendTo($('#touchscreenPanel'));
  $("<button/>").attr("id", "touchscreenCompassBtn").addClass('Touch').text('Enable Touchscreen & Compass').appendTo($('#touchscreenPanel'));
  $("<button/>").attr("id", "touchscreenOffBtn").addClass('Touch').text('Disable Touchscreen').appendTo($('#touchscreenPanel'));
  //$("<br>").appendTo($('#Options'));
  // Start from the last opened tab
  var prevTab = JSON.parse(localStorage.getItem('aio.prevtab')) || null;
  if(prevTab) {
    prevTab = "#" + prevTab;
    $(prevTab).click();
  } else {
    $('#Main').click();
  }

  $.getScript('apps/_aiotweaks/js/mzd.js');
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
AIOTweaksTmplt.prototype.handleControllerEvent = function(eventID)
{
  log.debug("handleController() called, eventID: " + eventID);

  var retValue = null;
  switch(eventID) {

    /*
    * MultiController was moved to the left
    */
    case "ccw":
    case "left":
      $('#Twk').click();
      retValue = null;
      break;
    case "down":
      retValue = $('#Main').click();
      break;
    case "up":
      retValue = $('#AioInfoPanel').toggle();
      break;
    case "cw":
    case "right":
      $('#Opt').click();
      retValue = "consumed";
      break;
    case "select":
      retValue = framework.sendEventToMmui("common", "Global.IntentHome");
      break;
    case "downStart":
    case "upStart":
    case "leftStart":
    case "rightStart":
      retValue = "ignored"
      break;
    default:
      $('#closeAioInfo').click();
      retValue = 'giveFocusLeft';
      break;
  }
  $('#touchscreenPanel').hide();
  $('html').removeClass('showBg');
  return retValue;
};
/*
* Called by the app during templateNoLongerDisplayed. Used to perform garbage collection procedures on the template and
* its controls.
*/
AIOTweaksTmplt.prototype.cleanUp = function()
{
  $('html').removeClass('showBg');
  $('#SbSpeedo').fadeIn();
};

framework.registerTmpltLoaded("AIOTweaksTmplt");
