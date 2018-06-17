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
var selectedItem = 0;
var currTab = '';
var maxButtons = 13;

function AIOTweaksTmplt(uiaId, parentDiv, templateID, controlProperties) {
  this.divElt = null;
  this.templateName = "AIOTweaksTmplt";

  this.onScreenClass = "AIOTweaksTmplt";

  log.debug("  templateID in AIOTweaksTmplt constructor: " + templateID);

  //@formatter:off
  //set the template properties
  this.properties = {
    "statusBarVisible": true,
    "leftButtonVisible": false,
    "rightChromeVisible": false,
    "hasActivePanel": true,
    "isDialog": false
  };
  //@formatter:on

  // create the div for template
  this.divElt = document.createElement('div');
  this.divElt.id = templateID;
  this.divElt.className = "TemplateFull AIOTweaksTmplt";

  parentDiv.appendChild(this.divElt);

  // Build The Environment
  this.divElt.innerHTML = '<ul id="AIO-Main" class="tab" style="margin-top:60px">' +
    '<li><a href="javascript:void(0)" class="tablinks" id="Twk">Apps</a></li>' +
    '<li><a href="javascript:void(0)" class="tablinks" id="Main">Tweaks</a></li>' +
    '<li><a href="javascript:void(0)" class="tablinks" id="Opt">Options</a></li>' +
    '</ul>' +
    '<div id="MainMenu" class="tabcontent FadeIn">' +
    '</div>' +
    '<div id="Tweaks" class="tabcontent FadeIn">' +
    '</div>' +
    '<div id="Options" class="tabcontent FadeIn">' +
    '</div>' +
    '<div id="AioInfoPanel" class="animate-zoom"><div id="AioInformation"></div></div>';

  function AIOTabs(tab, tabLink) {
    $(".tablinks").removeClass("active-tab");
    $(".tabcontent").hide();
    $(".tabcontent").removeClass("animate-zoom");
    $("button").removeClass("selectedItem");
    maxButtons = $(tab + " a").length - 2;
    $(tab).show();
    $(tab).addClass('animate-zoom');
    (selectedItem < maxButtons) ? $(tab + " button").eq(selectedItem).addClass("selectedItem"): selectedItem = 0;
    $(tabLink).addClass("active-tab");
    currTab = tab;
  }

  // Buttons
  // Tweaks Section
  $("<button/>").attr("id", "star1").addClass('mmLayout').html('<a>Star 1</a>').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "star3").addClass('mmLayout').html('<a>Star 2</a>').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "star2").addClass('mmLayout').html('<a>Inverted</a>').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "star4").addClass('mmLayout').html('<a>Flat Line</a>').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "ellipse").addClass('toggleTweaks').html('<a>Hide Ellipse</a>').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "minicoins").addClass('toggleTweaks').html('<a>Mini Coins</a>').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "label3d").addClass('toggleTweaks').html('<a>3D Main Text</a>').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "hidelabel").addClass('toggleTweaks').html('<a>Hide Main Text</a>').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "bgrAlbmArt").addClass('toggleTweaks').html('<a>Bigger Albm Art</a>').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "txtShadow").addClass('toggleTweaks').html('<a>Text Shadow</a>').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "no-btn-bg").addClass('toggleTweaks').html('<a>Hide Button Background</a>').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "hideStatus").addClass('toggleTweaks').html('<a>Hide StatusBar</a>').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "hideMusicBg").addClass('toggleTweaks').html('<a>Hide Entertainment Background</a>').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "hideListBg").addClass('toggleTweaks').html('<a>Hide List Background</a>').appendTo($('#MainMenu'));
  $("<button/>").attr("id", "clearTweaksBtn").html('<a>Reset Tweaks</a>').appendTo($('#MainMenu'));
  $("<div/>").attr("id", "MainMenuMsg").css({ "padding": "0px" }).insertAfter($('#MainMenu'));

  // Apps Section
  $("<button/>").attr("id", "twkOut").addClass('mainApps').html('<a>Home</a>').addClass('audioSources').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "usba").html('<a>USB A</a>').addClass('audioSources').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "usbb").html('<a>USB B</a>').addClass('audioSources').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "BluetoothAudio").addClass('audioSources').html('<a>Bluetooth</a>').appendTo($('#Tweaks'));
  $("<br>").appendTo($('#Tweaks'));
  $("<button/>").attr("id", "previousTrackBtn").addClass('audioSources').html('<a>Previous</a>').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "nextTrackBtn").addClass('audioSources').html('<a>Next</a>').appendTo($('#Tweaks'));
  $("<br>").appendTo($('#Tweaks'));
  $("<button/>").attr("id", "headunitLogBtn").addClass('aaLog').html('<a>View Headunit Log</a>').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "mountSwapBtn").html('<a>Mount Swapfile</a>').appendTo($('#Tweaks')).hide();
  $("<button/>").attr("id", "unmountSwapBtn").html('<a>Unmount Swapfile</a>').appendTo($('#Tweaks')).hide();
  $('<div/>').attr('id', 'aaTitle').html('Android Auto Headunit').appendTo('#Tweaks');
  $("<button/>").attr("id", "AAstart").addClass('aaFunc fnStart').html('<a>Start</a>').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "AAstop").addClass('aaFunc fnStop').html('<a>Stop</a>').appendTo($('#Tweaks'));
  $('<div/>').attr('id', 'csTitle').html('CastScreen Receiver').appendTo('#Tweaks');
  $("<button/>").attr("id", "CSstart").addClass('csFunc fnStart').html('<a>Start</a>').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "CSstop").addClass('csFunc fnStop').html('<a>Stop</a>').appendTo($('#Tweaks'));
  $("<button/>").attr("id", "scrollUpBtn").addClass('AIO-scroller').html('<img src="apps/_aiotweaks/templates/AIOTweaks/images/scrollUp.png" />').insertAfter($('#AioInfoPanel'));
  $("<button/>").attr("id", "scrollDownBtn").addClass('AIO-scroller').html('<img src="apps/_aiotweaks/templates/AIOTweaks/images/scrollDown.png" />').insertAfter($('#AioInfoPanel'));
  $("<button/>").attr("id", "errLogBtn").html('<a>Error Log</a>').appendTo($('#Tweaks')).hide();
  //$("<button/>").attr("id", "backupCamBtn").html('<a>localStorage</a>').appendTo($('#Tweaks'));
  //$("<button/>").attr("id", "pauseBtn").html('<a>Clear localStorage</a>').appendTo($('#Tweaks'));
  //$("<button/>").attr("id", "createSwapBtn").html('<a>Vehicle Type</a>').appendTo($('#Tweaks'));
  //$("<button/>").attr("id", "fakeIncomingCallBtn").addClass('test').html('<a>Fake Incoming Call</a>').appendTo($('#Tweaks'));
  //$("<button/>").attr("id", "activeCallBtn").addClass('test').html('<a>Fake Active Call</a>').appendTo($('#Tweaks'));
  //$('<div/>').attr('id','spTitle').html('Speedometer').appendTo('#Tweaks');
  //$("<button/>").attr("id", "SPstart").addClass('spFunc fnStart').html('<a>Start</a>').appendTo($('#Tweaks'));
  //$("<button/>").attr("id", "SPstop").addClass('spFunc fnStop').html('<a>Stop</a>').appendTo($('#Tweaks'));

  // Options Section
  $("<button/>").attr("id", "aioInfo").html('<a>Info</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "adbBtn").html('<a>adb</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "messageTestBtn").html('<a>Message Test</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "test").html('<a>SBN Test</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "Tst").addClass("tablinks").html('<a>Touchscreen</a>').appendTo($('#Options'));
  //$("<button/>").attr("id", "showBgBtn").html('<a>Show Background</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "showEnvBtn").html('<a>Env</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "appListBtn").html('<a>App List</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "showDFHBtn").html('<a>Disk Space</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "showMeminfoBtn").html('<a>Memory Info</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "showPSBtn").html('<a>Running Processes</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "displayOffBtn").html('<a>Screen Off</a>').appendTo($('#Options'));
  //$("<button/>").attr("id", "runCheckIPBtn").html('<a>Check IP</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "reverseAppListBtn").html('<a>Reverse App List</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "systemTab").html('<a>Settings &gt; System</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "wifiToggle").html('<a>Turn WiFi On</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "wifiSettings").html('<a>WiFi Settings</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "toggleWifiAPBtn").html('<a>Wifi AP</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "stopFirewallBtn").html('<a>Stop Firewall</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "fullRestoreConfirmBtn").html('<a>System Restore</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "aioReboot").html('<a>Reboot</a>').appendTo($('#Options'));
  //$("<button/>").attr("id", "shiftEntListBtn").html('<a>Shift Ent List</a>').appendTo($('#Options'));
  $("<div/>").attr("id", "closeAioInfo").appendTo('#AioInfoPanel');
  $("<div/>").attr("id", "touchscreenPanel").addClass('tabcontent FadeIn').insertAfter($('#Options'));
  $("<button/>").attr("id", "closeTouchPanel").addClass('Touch').html('<a>&times;</a>').appendTo($('#touchscreenPanel'));
  $("<button/>").attr("id", "touchscreenBtn").addClass('Touch').html('<a>Enable Touchscreen & Menu</a>').appendTo($('#touchscreenPanel'));
  $("<button/>").attr("id", "touchscreenCompassBtn").addClass('Touch').html('<a>Enable Touchscreen & Compass</a>').appendTo($('#touchscreenPanel'));
  $("<button/>").attr("id", "touchscreenOffBtn").addClass('Touch').html('<a>Disable Touchscreen</a>').appendTo($('#touchscreenPanel'));
  //$("<button/>").attr("id", "screenshotBtn").html('<a>Screenshot</a>').appendTo($('#Options'));
  //$("<button/>").attr("id", "saveScreenshotBtn").html('<a>Save Screenshot to SD</a>').appendTo($('#Options')).hide();
  //$("<button/>").attr("id", "chooseBg").html('<a>Node Version</a>').appendTo($('#Options'));
  //$("<button/>").attr("id", "runTweaksBtn").html('<a>VidYos</a>').appendTo($('#Options'));
  $("<button/>").attr("id", "runTerminalBtn").html('Run Terminal').addClass('devTools').appendTo($('#Options'));
  $("<div/>").attr("id", "devModeSecretBtn").css({ 'position': 'fixed', 'height': '100px', 'width': '100px', 'bottom': '0', 'right': '0' }).appendTo($('#Options'));

  //$("<br>").appendTo($('#Options'));
  //function buildAIObuttons (aioButtons) {
  //TODO: This function will build the whole thing from a JSON object
  //{Buttons:[{tag:'button',id:'twkOut',label:'Home',tab:'Tweaks',classes:"mainApps audioSources"},]}
  //}
  // Tabs
  $("#Main").on('click', function() {
    AIOTabs("#MainMenu", "#Main");
  });
  $("#Twk").on('click', function() {
    AIOTabs("#Tweaks", "#Twk");
  });
  $("#Opt").on('click', function() {
    AIOTabs("#Options", "#Opt");
  });
  $("#Tst").on('click', function() {
    AIOTabs("#touchscreenPanel", "#Tst");
  });

  // Start from the last opened tab
  try {
    var prevTab = JSON.parse(localStorage.getItem("aio.prevtab")) || false;
    if (prevTab) {
      prevTab = "#" + prevTab;
      $(prevTab).click();
    } else {
      $("#Main").click();
    }
  } catch (e) {
    $("#Opt").click();
  }
  utility.loadScript('apps/_aiotweaks/js/mzd.js', null, StartAIOApp);
}

/*
 *  @param clickTarget (jQuery Object) The jQuery Object to click on a single click action
 *  clickTarget can also be a function or a string of the DOM node to make the jQuery Object
 */
AIOTweaksTmplt.prototype.singleClick = function(clickTarget) {
  if (typeof clickTarget === "string") { clickTarget = $(clickTarget) }
  (speedometerLonghold) ? speedometerLonghold = false: (typeof clickTarget === "function") ? clickTarget() : clickTarget.click();
  clearTimeout(this.longholdTimeout);
  this.longholdTimeout = null;
}
/*
 *  @param clickFunction (function) Function to run on a long click
 *  clickFunction can also be a a string of the DOM node or jQuery Object to click
 */
AIOTweaksTmplt.prototype.longClick = function(clickFunction) {
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
 */
AIOTweaksTmplt.prototype.handleControllerEvent = function(eventID) {
  log.debug("handleController() called, eventID: " + eventID);

  var retValue = null;
  switch (eventID) {
    case "ccw":
      if ($("#AioInfoPanel").hasClass("opened")) {
        document.getElementById("AioInformation").scrollTop -= 200;
      } else {
        $("button").removeClass("selectedItem");
        (selectedItem < 0) ? selectedItem = maxButtons: selectedItem--;
        $(currTab + " a").eq(selectedItem).parent().addClass("selectedItem");
      }
      break;
    case "cw":
      if ($("#AioInfoPanel").hasClass("opened")) {
        document.getElementById("AioInformation").scrollTop += 200;
      } else {
        $("button").removeClass("selectedItem");
        (selectedItem > maxButtons) ? selectedItem = 0: selectedItem++;
        $(currTab + " a").eq(selectedItem).parent().addClass("selectedItem");
      }
      break;
    case "up":
      this.singleClick(function() {

        if ($("#AioInfoPanel").hasClass("opened")) {
          if (document.getElementById("AioInformation").scrollTop === 0) {
            $("#closeAioInfo").click();
          }
          document.getElementById("AioInformation").scrollTop = 0;
          document.getElementById("AioInformation").scrollLeft = 0;
        } else {
          showAioInfo("", true);
        }
      })
      retValue = "consumed";
      break;
    case "down":
      if ($("#AioInfoPanel").hasClass("opened")) {
        document.getElementById("AioInformation").scrollTop += 2500;
      } else {
        retValue = $("#Main").click();
      }
      break;
    case "left":
      if ($("#AioInfoPanel").hasClass("opened")) {
        document.getElementById("AioInformation").scrollLeft -= 1000;
      } else {
        $("#Twk").click();
      }
      retValue = null;
      break;
    case "right":
      if ($("#AioInfoPanel").hasClass("opened")) {
        document.getElementById("AioInformation").scrollLeft += 500;
      } else {
        $("#Opt").click();
      }
      retValue = "consumed";
      break;
    case "select":
      if ($("#AioInfoPanel").hasClass("opened")) {
        $("#closeAioInfo").click();
      } else {
        $(currTab + " a").eq(selectedItem).parent().click();
      }
      retValue = "consumed";
      break;
    case "downStart":
    case "upStart":
    case "leftStart":
    case "rightStart":
    case "selectStart":
      retValue = "ignored";
      break;
    default:
      retValue = "giveFocusLeft";
      break;
  }
  $("button").blur();
  if(eventID.indexOf('Start')!==-1) $("html").removeClass("showBg");
  return retValue;
};
/*
 * Called by the app during templateNoLongerDisplayed. Used to perform garbage collection procedures on the template and
 * its controls.
 */
AIOTweaksTmplt.prototype.cleanUp = function() {
  $(".AIOTweaksTmplt").remove();
  $("html").removeClass("showBg");
  $('#SbSpeedo, #Sbfuel-bar-wrapper').fadeIn();
};

framework.registerTmpltLoaded("AIOTweaksTmplt");
