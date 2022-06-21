/*
Copyright 2017 Trez
__________________________________________________________________________

Filename: AIOTweaksTmplt.js
__________________________________________________________________________
*/
/* jshint -W108, -W117, -W116, -W086  */
log.addSrcFile('AIOTweaksTmplt.js', 'AIOTweaks');
/*
 * =========================
 * Constructor
 * =========================
 */
let selectedItem = 0;
let currTab = 1;
let maxButtons = 13;

function AIOTweaksTmplt(uiaId, parentDiv, templateID, controlProperties) {
  this.divElt = null;
  this.templateName = 'AIOTweaksTmplt';
  this.onScreenClass = 'AIOTweaksTmplt';
  log.debug('  templateID in AIOTweaksTmplt constructor: ' + templateID);
  // @formatter:off
  // set the template properties
  this.properties = {
    'statusBarVisible': true,
    'leftButtonVisible': false,
    'rightChromeVisible': false,
    'hasActivePanel': true,
    'isDialog': false,
  };
  // @formatter:on
  // create the div for template
  this.divElt = document.createElement('div');
  this.divElt.id = templateID;
  this.divElt.className = 'TemplateFull AIOTweaksTmplt';
  parentDiv.appendChild(this.divElt);
  // Build The Environment
  this.divElt.innerHTML = '<ul id="AIO-Main" class="tab" style="margin-top:60px">' +
    '<li><a href="javascript:void(0)" class="tablinks" id="Twk" tabindex=1>Apps</a></li>' +
    '<li><a href="javascript:void(0)" class="tablinks" id="Main" tabindex=2>Tweaks</a></li>' +
    '<li><a href="javascript:void(0)" class="tablinks" id="Opt" tabindex=3>Options</a></li>' +
    '<li><a href="javascript:void(0)" class="tablinks" id="Shll" tabindex=4>Shell</a></li>' +
    '</ul>' +
    '<div id="MainMenu" class="tabcontent FadeIn">' +
    '</div>' +
    '<div id="Tweaks" class="tabcontent FadeIn">' +
    '</div>' +
    '<div id="Options" class="tabcontent FadeIn">' +
    '</div>' +
    '<div id="Shell" class="tabcontent FadeIn">' +
    '</div>' +
    '<div id="AioInfoPanel" class="animate-zoom"><div id="AioCmd"></div><pre id="AioInformation"></pre></div>';

  function AIOTabs(tab, tabLink) {
    $('.tablinks, .tabcontent').removeClass('active-tab');
    $('.tabcontent, .devTools, #devModeSecretBtn').hide();
    $('.tabcontent').removeClass('animate-zoom');
    $('button').removeClass('selectedItem');
    maxButtons = $(tab + ' a').length - 2;
    $(tab).show();
    $(tab).addClass('animate-zoom active-tab');
    (selectedItem < maxButtons) ? $(tab + ' button').eq(selectedItem).addClass('selectedItem'): selectedItem = 0;
    $(tabLink).addClass('active-tab');
    currTab = $(tabLink).attr('tabindex');
  }
  // Buttons
  // Tweaks Section
  $('<button/>').attr('id', 'star1').addClass('mmLayout').html('<a>Star 1</a>').appendTo($('#MainMenu'));
  $('<button/>').attr('id', 'star3').addClass('mmLayout').html('<a>Star 2</a>').appendTo($('#MainMenu'));
  $('<button/>').attr('id', 'star2').addClass('mmLayout').html('<a>Inverted</a>').appendTo($('#MainMenu'));
  $('<button/>').attr('id', 'star4').addClass('mmLayout').html('<a>Flat Line</a>').appendTo($('#MainMenu'));
  $('<button/>').attr('id', 'ellipse').addClass('toggleTweaks').html('<a>Hide Ellipse</a>').appendTo($('#MainMenu'));
  $('<button/>').attr('id', 'minicoins').addClass('toggleTweaks').html('<a>Mini Coins</a>').appendTo($('#MainMenu'));
  $('<button/>').attr('id', 'label3d').addClass('toggleTweaks').html('<a>3D Main Text</a>').appendTo($('#MainMenu'));
  $('<button/>').attr('id', 'hidelabel').addClass('toggleTweaks').html('<a>Hide Main Text</a>').appendTo($('#MainMenu'));
  $('<button/>').attr('id', 'bgrAlbmArt').addClass('toggleTweaks').html('<a>Bigger Albm Art</a>').appendTo($('#MainMenu'));
  $('<button/>').attr('id', 'txtShadow').addClass('toggleTweaks').html('<a>Text Shadow</a>').appendTo($('#MainMenu'));
  $('<button/>').attr('id', 'no-btn-bg').addClass('toggleTweaks').html('<a>Hide Button Background</a>').appendTo($('#MainMenu'));
  $('<button/>').attr('id', 'hideStatus').addClass('toggleTweaks').html('<a>Hide StatusBar</a>').appendTo($('#MainMenu'));
  $('<button/>').attr('id', 'hideMusicBg').addClass('toggleTweaks').html('<a>Hide Entertainment Background</a>').appendTo($('#MainMenu'));
  $('<button/>').attr('id', 'hideListBg').addClass('toggleTweaks').html('<a>Hide List Background</a>').appendTo($('#MainMenu'));
  $('<button/>').attr('id', 'clearTweaksBtn').html('<a>Reset Tweaks</a>').appendTo($('#MainMenu'));
  $('<div/>').attr('id', 'MainMenuMsg').css({'padding': '0px'}).insertAfter($('#MainMenu'));
  // Apps Section
  $('<button/>').attr('id', 'twkOut').addClass('audioSources mainApps').html('<a><img src="common/images/icons/IcnSbHome.png" alt="Home"></a>').appendTo($('#Tweaks'));
  $('<button/>').attr('id', 'BluetoothAudio').addClass('audioSources').html('<a><img src="common/images/icons/IcnListBluetooth_On.png" alt="Bluetooth"></a>').appendTo($('#Tweaks'));
  $('<button/>').attr('id', 'usba').addClass('audioSources').html('<a><img src="apps/_aiotweaks/templates/AIOTweaks/images/usb.png" alt="USB"> A</a>').appendTo($('#Tweaks'));
  $('<button/>').attr('id', 'usbb').addClass('audioSources').html('<a><img src="apps/_aiotweaks/templates/AIOTweaks/images/usb.png" alt="USB"> B</a>').appendTo($('#Tweaks'));
  $('<button/>').attr('id', 'previousTrackBtn').addClass('audioSources').html('<a><img src="common/images/icons/IcnUmpPreviousAudio_Hd.png" alt="Previous"></a>').appendTo($('#Tweaks'));
  $('<button/>').attr('id', 'nextTrackBtn').addClass('audioSources').html('<a><img src="common/images/icons/IcnUmpNextAudio_Hd.png" alt="Next"></a>').appendTo($('#Tweaks'));
  $('<br>').appendTo($('#Tweaks'));
  $('<button/>').attr('id', 'mountSwapBtn').html('<a>Mount Swapfile</a>').appendTo($('#Tweaks')).hide();
  $('<button/>').attr('id', 'unmountSwapBtn').html('<a>Unmount Swapfile</a>').appendTo($('#Tweaks')).hide();
  $('<button/>').attr('id', 'appListBtn').html('<a>App List</a>').appendTo($('#Tweaks'));
  $('<button/>').attr('id', 'backupCamBtn').html('<a>Reverse Cam</a>').appendTo($('#Tweaks'));
  $('<button/>').attr('id', 'errLogBtn').html('<a>Error Log</a>').appendTo($('#Tweaks')).hide();
  $('<button/>').attr('id', 'headunitLogBtn').addClass('aaLog').html('<a>View Headunit Log</a>').appendTo($('#Tweaks'));
  $('<br>').appendTo($('#Tweaks'));
  $('<div/>').attr('id', 'aaTitle').html('Android Auto Headunit').appendTo('#Tweaks');
  $('<button/>').attr('id', 'AAstart').addClass('aaFunc fnStart').html('<a>Start</a>').appendTo($('#Tweaks'));
  $('<button/>').attr('id', 'AAstop').addClass('aaFunc fnStop').html('<a>Stop</a>').appendTo($('#Tweaks'));
  $('<div/>').attr('id', 'csTitle').html('CastScreen Receiver').appendTo('#Tweaks');
  $('<button/>').attr('id', 'CSstart').addClass('csFunc fnStart').html('<a>Start</a>').appendTo($('#Tweaks'));
  $('<button/>').attr('id', 'CSstop').addClass('csFunc fnStop').html('<a>Stop</a>').appendTo($('#Tweaks'));
  // $("<button/>").attr("id", "pauseBtn").html('<a>Clear localStorage</a>').appendTo($('#Tweaks'));
  // $("<button/>").attr("id", "fakeIncomingCallBtn").addClass('test').html('<a>Fake Incoming Call</a>').appendTo($('#Tweaks'));
  // $("<button/>").attr("id", "activeCallBtn").addClass('test').html('<a>Fake Active Call</a>').appendTo($('#Tweaks'));
  // $('<div/>').attr('id','spTitle').html('Speedometer').appendTo('#Tweaks');
  // $("<button/>").attr("id", "SPstart").addClass('spFunc fnStart').html('<a>Start</a>').appendTo($('#Tweaks'));
  // $("<button/>").attr("id", "SPstop").addClass('spFunc fnStop').html('<a>Stop</a>').appendTo($('#Tweaks'));
  // Options Section
  $('<button/>').attr('id', 'aioInfo').html('<a>Info</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'verBtn').html('<a>Show Version</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'showVehData').html('<a>Vehicle Data</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'showLocalStorage').html('<a>localStorage</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'showWinkBtn').html('<a>Wink Test</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'messageTestBtn').html('<a>Message Test</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'test').html('<a>SBN Test</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'Tst').addClass('tablinks').html('<a>Touchscreen</a>').appendTo($('#Options'));
  // $("<button/>").attr("id", "showBgBtn").html('<a>Show Background</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'reverseAppListBtn').html('<a>Reverse App List</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'displayOffBtn').html('<a>Screen Off</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'systemTab').html('<a>Settings &gt; System</a>').appendTo($('#Options'));
  // $("<button/>").attr("id", "wifiToggle").html('<a>Turn WiFi On</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'wifiSettings').html('<a>WiFi Settings</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'toggleWifiAPBtn').html('<a>Wifi AP</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'stopFirewallBtn').html('<a>Stop Firewall</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'fullRestoreConfirmBtn').html('<a>System Restore</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'aioReboot').html('<a>Reboot</a>').appendTo($('#Options'));
  // $("<button/>").attr("id", "shiftEntListBtn").html('<a>Shift Ent List</a>').appendTo($('#Options'));
  $('<div/>').attr('id', 'closeAioInfo').appendTo('#AioInfoPanel');
  $('<div/>').attr('id', 'touchscreenPanel').addClass('tabcontent FadeIn').insertAfter($('#Options'));
  $('<button/>').attr('id', 'closeTouchPanel').addClass('Touch').html('<a>&times;</a>').appendTo($('#touchscreenPanel'));
  $('<button/>').attr('id', 'touchscreenBtn').addClass('Touch').html('<a>Enable Touchscreen & Menu</a>').appendTo($('#touchscreenPanel'));
  $('<button/>').attr('id', 'touchscreenCompassBtn').addClass('Touch').html('<a>Enable Touchscreen & Compass</a>').appendTo($('#touchscreenPanel'));
  $('<button/>').attr('id', 'touchscreenOffBtn').addClass('Touch').html('<a>Disable Touchscreen</a>').appendTo($('#touchscreenPanel'));
  // $("<button/>").attr("id", "screenshotBtn").html('<a>Screenshot</a>').appendTo($('#Options'));
  // $("<button/>").attr("id", "saveScreenshotBtn").html('<a>Save Screenshot to SD</a>').appendTo($('#Options')).hide();
  // $("<button/>").attr("id", "chooseBg").html('<a>Node Version</a>').appendTo($('#Options'));
  $('<button/>').attr('id', 'adbBtn').html('<a>adb Devices</a>').appendTo($('#Shell'));
  $('<button/>').attr('id', 'adbKillBtn').html('<a>adb kill-server</a>').appendTo($('#Shell'));
  $('<button/>').attr('id', 'adbRevBtn').html('<a>adb Reverse Port</a>').appendTo($('#Shell'));
  $('<button/>').attr('id', 'showEnvBtn').html('<a>Env</a>').appendTo($('#Shell'));
  $('<button/>').attr('id', 'showDFHBtn').html('<a>Disk Space</a>').appendTo($('#Shell'));
  $('<button/>').attr('id', 'showMeminfoBtn').html('<a>Memory Info</a>').appendTo($('#Shell'));
  $('<button/>').attr('id', 'showPSBtn').html('<a>Running Processes</a>').appendTo($('#Shell'));
  $('<button/>').attr('id', 'runCheckIPBtn').html('<a>Check IP</a>').appendTo($('#Shell'));
  $('<button/>').attr('id', 'runTweaksBtn').html('Run Tweaks.sh').addClass('devTools').insertAfter($('#Shell'));
  $('<button/>').attr('id', 'runTerminalBtn').html('Run Terminal').addClass('devTools').insertAfter($('#Shell'));
  $('<button/>').attr('id', 'runRemountBtn').html('Remount RW').addClass('devTools').insertAfter($('#Shell'));
  $('<div/>').attr('id', 'devModeSecretBtn').insertAfter($('#Shell'));
  $('<button/>').attr('id', 'scrollUpBtn').addClass('AIO-scroller').html('<img src="apps/_aiotweaks/templates/AIOTweaks/images/scrollUp.png" />').insertAfter($('#AioInfoPanel'));
  $('<button/>').attr('id', 'scrollDownBtn').addClass('AIO-scroller').html('<img src="apps/_aiotweaks/templates/AIOTweaks/images/scrollDown.png" />').insertAfter($('#AioInfoPanel'));
  // $("<br>").appendTo($('#Options'));
  // function buildAIObuttons (aioButtons) {
  // TODO: This function will build the whole thing from a JSON object
  // {Buttons:[{tag:'button',id:'twkOut',label:'Home',tab:'Tweaks',classes:"mainApps audioSources"},]}
  // }
  // Tabs
  $('#Main').on('click', () => {
    AIOTabs('#MainMenu', '#Main');
  });
  $('#Twk').on('click', () => {
    AIOTabs('#Tweaks', '#Twk');
  });
  $('#Opt').on('click', () => {
    AIOTabs('#Options', '#Opt');
  });
  $('#Shll').on('click', () => {
    AIOTabs('#Shell', '#Shll');
    $('#devModeSecretBtn').show();
  });
  $('#Tst').on('click', () => {
    AIOTabs('#touchscreenPanel', '#Tst');
  });
  // Start from the last opened tab
  try {
    let prevTab = JSON.parse(localStorage.getItem('aio.prevtab')) || false;
    if (prevTab) {
      prevTab = $('.tablinks[tabindex=' + prevTab + ']');
      prevTab.click();
    } else {
      $('#Main').click();
    }
  } catch (e) {
    $('#Opt').click();
  }
  utility.loadScript('apps/_aiotweaks/js/mzd.js', null, StartAIOApp);
}
/*
 *  @param clickTarget (jQuery Object) The jQuery Object to click on a single click action
 *  clickTarget can also be a function or a string of the DOM node to make the jQuery Object
 */
AIOTweaksTmplt.prototype.singleClick = function(clickTarget) {
  if (typeof clickTarget === 'string') {
    clickTarget = $(clickTarget);
  }
  (AIOlonghold) ? AIOlonghold = false: (typeof clickTarget === 'function') ? clickTarget(arguments[1]) : clickTarget.click();
  clearTimeout(this.longholdTimeout);
  this.longholdTimeout = null;
};
/*
 *  @param clickFunction (function) Function to run on a long click
 *  clickFunction can also be a a string of the DOM node or jQuery Object to click
 */
AIOTweaksTmplt.prototype.longClick = function(clickFunction) {
  if (typeof clickFunction === 'string') {
    clickFunction = $(clickFunction);
  }
  const arg = arguments[1];
  this.longholdTimeout = setTimeout(() => {
    AIOlonghold = true;
    (typeof clickFunction === 'function') ? clickFunction(arg): clickFunction.click();
  }, 1200);
};
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
AIOTweaksTmplt.prototype.ControllerEvents = function(eventID) {
  let retValue = null;
  // console.log("EVENT: " + eventID);
  const infoOpen = $('#AioInfoPanel').hasClass('opened');
  switch (eventID) {
    case 'ccw':
      if (infoOpen) {
        document.getElementById('AioInformation').scrollTop -= 200;
      } else {
        $('button').removeClass('selectedItem');
      (selectedItem < 0) ? selectedItem = maxButtons: selectedItem--;
      $('.tabcontent.active-tab a').eq(selectedItem).parent().addClass('selectedItem');
      }
      break;
    case 'cw':
      if (infoOpen) {
        document.getElementById('AioInformation').scrollTop += 200;
      } else {
        $('button').removeClass('selectedItem');
      (selectedItem > maxButtons) ? selectedItem = 0: selectedItem++;
      $('.tabcontent.active-tab a').eq(selectedItem).parent().addClass('selectedItem');
      }
      break;
    case 'left':
      if (infoOpen) {
        document.getElementById('AioInformation').scrollLeft -= 1000;
      } else {
        currTab--;
        if (currTab < 1) currTab = 4;
        $('.tablinks[tabindex=' + currTab + ']').click();
      }
      retValue = null;
      break;
    case 'right':
      if (infoOpen) {
        document.getElementById('AioInformation').scrollLeft += 500;
      } else {
        currTab++;
        if (currTab > 4) currTab = 1;
        $('.tablinks[tabindex=' + currTab + ']').click();
      }
      retValue = 'consumed';
      break;
    case 'select':
      if (infoOpen) {
        $('#closeAioInfo').click();
      } else {
        $('.tabcontent.active-tab a').eq(selectedItem).parent().click();
      }
      retValue = 'consumed';
      break;
    case 'down':
      if (infoOpen) {
        document.getElementById('AioInformation').scrollTop += 2500;
        break;
      } // intentional fallthrough
    case 'up':
      if (infoOpen) {
        if (document.getElementById('AioInformation').scrollTop === 0) {
          $('#closeAioInfo').click();
        } else {
          document.getElementById('AioInformation').scrollTop -= 2500;
        }
        break;
      } // intentional fallthrough
    case 'holddown':
      if (infoOpen) {
        $('#AioInformation').animate({scrollTop: 999999}, 3000);
        aioWs('killall -9 gst-launch', 1);
        break;
      } // intentional fallthrough
    case 'holdup':
      if (infoOpen) {
        if (document.getElementById('AioInformation').scrollTop === 0) {
          $('#closeAioInfo').click();
        } else {
          $('#AioInformation').animate({scrollTop: 0, scrollLeft: 0}, 3000);
        }
      } else {
        showAioInfo('');
      }
      break;
    case 'holdleft':
      currTab = 1;
      $('.tablinks[tabindex=' + currTab + ']').click();
      break;
    case 'holdright':
      currTab = 4;
      $('.tablinks[tabindex=' + currTab + ']').click();
      break;
    case 'holdselect':
      $('body').css({'display': ''});
      break;
    case 'controllerActive':
    case 'lostFocus':
    case 'acceptFocusInit':
    case 'nothing':
      break;
    default:
      AIO_SBN(eventID, 'apps/_aiotweaks/panda.png');
      retValue = 'giveFocusLeft';
      break;
  }
  $('button').blur();
  return retValue;
};
AIOTweaksTmplt.prototype.handleControllerEvent = function(eventID) {
  log.debug('handleController() called, eventID: ' + eventID);
  let retValue = 'giveFocusLeft';
  let ev = eventID;
  if (ev.indexOf('Start') !== -1) {
    $('body').css({'display': ''});
    $('html').removeClass('showBg');
    ev = 'hold' + ev.replace(/Start/, '');
    retValue = this.longClick(this.ControllerEvents, ev);
  } else {
    retValue = this.singleClick(this.ControllerEvents, ev);
  }
  return retValue;
};
/*
 * Called by the app during templateNoLongerDisplayed. Used to perform garbage collection procedures on the template and
 * its controls.
 */
AIOTweaksTmplt.prototype.cleanUp = () => {
  $('.AIOTweaksTmplt').remove();
  $('html').removeClass('showBg');
  $('body').css({'display': ''});
  $('#SbSpeedo, #Sbfuel-bar-wrapper').fadeIn();
};
framework.registerTmpltLoaded('AIOTweaksTmplt');
