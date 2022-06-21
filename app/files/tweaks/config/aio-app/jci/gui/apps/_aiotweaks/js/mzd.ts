// *****************************
// ** AIO Tweaks App v1.0 - mzd.js
// ** All the functions for Buttons in AIO Tweaks App
// ** By Trezdog44
// __________________________________________________________________________
//
// Filename: mzd.js
// __________________________________________________________________________
// *****************************
/* jshint -W117 */
const aioTweaksVer = 1.0;
let AArunning = false;
let appListData = [];
let globalAIOerror = null;
// let wsAIO = null;
// let aioWsVideo = null;
// let AIOvideo = false;
function StartAIOApp() {
  try {
    $('#SbSpeedo, #Sbfuel-bar-wrapper').fadeOut();
    // framework.sendEventToMmui("common", "SelectBTAudio");
  } catch (err) {}
  // *****************************
  // ** Setting of Buttons BEGIN!
  // *****************************
  // AIO info
  getAppListData();
  $('button').on('click', function() {
    $('button').removeClass('selectedItem');
    $(this).addClass('selectedItem');
  });
  $('#aioInfo').on('click', function() {showAioInfo('<div class=\'infoMessage\'><h1>AIO Tweaks App v' + aioTweaksVer + ' </h1>This is an experimental app by Trezdog44 made to test the capabilities, functionalities, and limitations of apps in the MZD Infotainment System.<br>This app has some useful and fun functions although it is not guaranteed that everything works.  There may be non-functioning or experimental features.</div>');});
  $('#aioReboot').on('click', myRebootSystem);
  // $("#mainMenuLoop").on("click",setMainMenuLoop);
  $('#test').on('click', aioSBNtest);
  $('#touchscreenBtn').on('click', enableTouchscreen);
  $('#touchscreenOffBtn').on('click', disableTouchscreen);
  $('#touchscreenCompassBtn').on('click', enableCompass);
  $('#adbBtn').on('click', adbDevices);
  $('#adbKillBtn').on('click', adbKillServer);
  $('#adbRevBtn').on('click', adbReverse);
  $('#messageTestBtn').on('click', messageTest);
  // $("#screenshotBtn").on("click",takeScreenshot);
  // $("#saveScreenshotBtn").on("click",saveScreenshot);
  $('#AAstart').on('click', startHeadunit);
  $('#AAstop').on('click', stopHeadunit);
  $('#CSstart').on('click', startCastScreen);
  $('#CSstop').on('click', stopCastScreen);
  // $("#SPstart").on("click",startSpeedometer);
  // $("#SPstop").on("click",stopSpeedometer);
  // $("#chooseBg").on("click",chooseBackground);
  $('#systemTab').on('click', settingsSystemTab);
  $('#wifiSettings').on('click', wifiSettings);
  $('#runTweaksBtn').on('click', runTweaks);
  $('#runRemountBtn').on('click', runRemount);
  $('#fullRestoreConfirmBtn').on('click', fullSystemRestoreConfirm);
  $('#headunitLogBtn').on('click', showHeadunitLog);
  $('#scrollUpBtn').on('click', scrollUp);
  $('#scrollDownBtn').on('click', scrollDown);
  $('#appListBtn').on('click', showAppList);
  $('#showEnvBtn').on('click', showEnvVar);
  $('#closeAioInfo').on('click', closeAioInfo);
  $('#showDFHBtn').on('click', showDFH);
  $('#showPSBtn').on('click', showPS);
  $('#showMeminfoBtn').on('click', showMeminfo);
  $('#toggleWifiAPBtn').on('click', toggleWifiAP);
  $('#stopFirewallBtn').on('click', stopFirewall);
  $('#displayOffBtn').on('click', displayOff);
  $('#mountSwapBtn').on('click', mountSwap);
  $('#unmountSwapBtn').on('click', unmountSwap);
  $('#showVehData').on('click', showVehicleData);
  $('#backupCamBtn').on('click', backUpCam);
  $('#errLogBtn').on('click', showErrLog);
  $('#runTerminalBtn').on('click', TerminalConfirm);
  $('#runCheckIPBtn').on('click', RunCheckIP);
  $('#reverseAppListBtn').on('click', reverseApplicationList);
  $('#shiftEntListBtn').on('click', shiftEntertainmentList);
  $('#devModeSecretBtn').on('click', toggleDevMode);
  $('#showLocalStorage').on('click', showLocalStorage);
  $('#wifiToggle').on('click', turnOnWifi);
  $('#verBtn').on('click', showVersion);
  $('#showWinkBtn').on('click', function() {aioWink('Wink Test... It works!! :-)');});
  $('#showBgBtn').on('click', function() {$('html').addClass('showBg');});
  $('#twkOut').on('click', function() {framework.sendEventToMmui('common', 'Global.IntentHome');});
  $('#usba').on('click', function() {framework.sendEventToMmui('system', 'SelectUSBA');});
  $('#usbb').on('click', function() {framework.sendEventToMmui('system', 'SelectUSBB');});
  $('#pauseBtn').on('click', function() {localStorage.clear();});
  // $("#previousTrackBtn").on("click",function(){framework.sendEventToMmui("common", "Global.PreviousHoldStop")});
  // $("#nextTrackBtn").on("click",function(){framework.sendEventToMmui("common", "Global.NextHoldStop")});
  $('#BluetoothAudio').on('click', function() {framework.sendEventToMmui('system', 'SelectBTAudio');});
  $('#previousTrackBtn').on('click', function() {framework.sendEventToMmui('Common', 'Global.Previous');});
  $('#nextTrackBtn').on('click', function() {framework.sendEventToMmui('Common', 'Global.Next');});
  $('.mmLayout').on('click', function() {
    changeLayout($(this).attr('id'));
    $('#MainMenuMsg').html($(this).text());
  });
  $('.toggleTweaks').on('click', function() {
    $('body').toggleClass($(this).attr('id'));
    $('#MainMenuMsg').html($(this).text());
  });
  $('#clearTweaksBtn').on('click', function() {
    $('body').attr('class', '');
    $('#MainMenuMsg').text('Main Menu Restored');
    localStorage.removeItem('aio.tweaks');
  });
  // $("#touchscreenToggle").on("click",toggleTSPanel);
  $('#closeTouchPanel').on('click', closeTSPanel);
  // Tab select & localStrage save on each button press
  $('.toggleTweaks').on('click', saveTweaks);
  $('.tablinks').on('click', function() {
    $('#MainMenuMsg').html('');
    localStorage.setItem('aio.prevtab', $(this).attr('tabindex'));
  });
  $('#openNav').on('click', function() {
    document.getElementById('mySidenav').style.width = '250px';
    document.getElementById('main').style.marginLeft = '250px';
  });
  $('#closeNav').on('click', function() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('main').style.marginLeft = '0';
  });
  /* if (typeof(Storage) !== "undefined") {
    console.log("localStorage Supported: " + JSON.stringify(localStorage));
  } else {
    console.log("localStorage Not Supported!!");
  }*/
}
// *****************************
// ** Button Functions GO!
// *****************************
function saveTweaks() {
  const body = document.getElementsByTagName('body')[0];
  localStorage.setItem('aio.tweaks', body.className);
  aioWs('sync && echo DONE');
}

function changeLayout(newlayout) {
  for (i = 1; i < 6; i++) {
    $('body').removeClass('star' + i);
  }
  $('body').addClass(newlayout);
  saveTweaks();
}

function getAppListData() {
  try {
    $.getJSON('../opera/opera_dir/userjs/additionalApps.json', function(data) {
      appListData = data;
      hasAA();
      hasCS();
      hasSwap();
      hasErrLog();
      if (typeof CustomApplicationsHandler === 'object') {
        const custApps = CustomApplicationsHandler.getMenuItems();
        custApps.forEach(function(elmt) {
          appListData.push({'name': elmt.text1Id, 'label': elmt.title});
        });
      }
    });
  } catch (e) {
    showAioInfo('Error: Cannot retrieve AIO app list...  <br>' + e);
  }
}
/* this.unsetMainMenuLoop = function() {
this.offSetFocus = MainMenuCtrl.prototype._offsetFocus.toString();
}*/
const __MainMenuLoop = function(direction) {
  let index = this._getFocus();
  index += direction;
  if (index < 0) {
    index = 4;
  }
  if (index > 4) {
    index = 0;
  }
  if (index !== this._getFocus()) {
    this._setFocus(index);
    this._setHighlight(index);
  }
};

function setMainMenuLoop() {
  MainMenuCtrl.prototype._offsetFocus = __MainMenuLoop;
  $('#MainMenuMsg').text('Main Menu Loop');
}

function turnOnWifi() {
  let net; const wifiOn = 1; // 0 for off
  if (framework.getAppInstance('netmgmt') === undefined || framework.getAppInstance('syssettings') === undefined) { // only jump if needed
    framework.sendEventToMmui('common', 'Global.IntentHome');
    framework.sendEventToMmui('common', 'Global.IntentSettingsTab', {payload: {settingsTab: 'Devices'}});
    framework.sendEventToMmui('syssettings', 'SelectNetworkManagement'); // this may not be needed
    framework.sendEventToMmui('common', 'Global.IntentHome'); // Jump back to home screen?
  }
  setTimeout(function() {
    net = framework.getAppInstance('netmgmt');
    if (!net._onOffStatus) {
      framework.sendEventToMmui('netmgmt', 'SetWifiConnection', {payload: {offOn: wifiOn}});
      showAioInfo('WIFI ON??');
    }
  }, 1000); // give it a second to load
}

function shiftEntertainmentList() {
  const entList = framework.getAppInstance('system')._masterEntertainmentDataList.items;
  const shiftItem = entList.shift();
  entList.push(shiftItem);
}

function shiftApplicationList() {
  const appList = framework.getAppInstance('system')._masterApplicationDataList.items;
  const shiftItem = appList.shift();
  appList.push(shiftItem);
}

function reverseEntertainmentList() {
  framework.getAppInstance('system')._masterEntertainmentDataList.items.reverse();
  showAioInfo('Reversed Entertainment List');
}

function reverseApplicationList() {
  framework.getAppInstance('system')._masterApplicationDataList.items.reverse();
  showAioInfo('Reversed application List');
}

function toggleDevMode() {
  $('.devTools').toggle();
}

function showEnvVar() {
  // showAioInfo("$ env");
  // aioWs('env', 3);
  exeCmd('env');
}

function takeScreenshot() {
  showAioInfo('Screenshot in 10 Seconds');
  setTimeout(function() {
    closeAioInfo(true);
    showSaveScreenshotBtn();
  }, 10000);
}

function showSaveScreenshotBtn() {
  aioWs('/bin/sh /jci/gui/apps/_aiotweaks/sh/screenshot.sh && echo "DONE"', 1);
  $('#saveScreenshotBtn').show();
}

function saveScreenshot() {
  $('#AioInfoPanel').show();
  let msg = '/jci/tools/jci-dialog --info --title="SCREENSHOT SAVED TO SD CARD" --text="NOT REALLY\\n I WILL DO THAT LATER" & ';
  msg += 'sleep 2; ';
  msg += 'killall -q jci-dialog; ';
  msg += '/bin/sh /jci/gui/apps/_aiotweaks/sh/screenshot.sh TrezShot ';
  msg += '\n';
  $('#AioInformation').css({'background': 'url(/tmp/root/wayland-screenshot.png?' + Date.now() + ')', 'background-size': '100% 100%', 'background-position': 'center'});
  aioWs(msg, 0);
}

function showAioInfo(message, append) {
  $('#aaTitle, #csTitle').css({'outline': 'none'});
  $('#AioInfoPanel').addClass('opened');
  if (message !== '') {
    message += '<br>';
    if (!append) {
      $('#AioInformation').html(message);
    } else {
      $('#AioInformation').append(message);
    }
  }
  if ($('#AioInformation').height() === 360) {
    $('#AioInfoPanel').addClass('scrollers');
  }
}

function AAInfo(message) {
  $('#aaTitle, #csTitle').css({'outline': 'none'});
  $('#AioInformation').prepend(message + '<br>');
  $('#AioInfoPanel').addClass('opened');
  if ($('#AioInformation').height() === 360) {
    $('#AioInfoPanel').addClass('scrollers');
  }
}

function closeAioInfo(erase) {
  $('#aaTitle, #csTitle').css({'outline': ''});
  $('#AioInfoPanel').removeClass('opened scrollers');
}

function toggleTSPanel() {
  $('#touchscreenPanel').toggle();
}

function closeTSPanel() {
  $('#Opt').click();
}

function adbDevices() {
  // showAioInfo("$ adb devices -l");
  // aioWs('adb devices -l', 1);
  exeCmd('adb devices -l');
}

function adbKillServer() {
  // showAioInfo("$ adb ");
  exeCmd('adb kill-server');
}

function adbReverse() {
  exeCmd('adb reverse tcp:2222 tcp:22', 1);
}

function TerminalConfirm() {
  showAioInfo('<div class="infoMessage"><div style="font-weight:bold;font-size:40px;">FOR ADVANCED USERS ONLY</div>TO USE THE TERMINAL CONNECT A USB KEYBOARD<br>RUNNING THE TERMINAL DISABLES THE MULTICONTROLLER REBOOT TO RE-ENABLE MULTICONTROLLER FUNCTION<br><br>MAKE SURE YOUR USB KEYBOARD IS CONNECTED!!!<br><button class="confirmKeyboardBtn" onclick="$(this).fadeOut(\'1500\');$(\'.confirmTerminalBtn\').fadeIn(\'1500\')">MY USB KEYBOARD IS CONNECTED</button><button class="confirmTerminalBtn" style="display:none" onclick="$(this).hide();RunTerminal();">START TERMINAL</button><br>THIS TERMINAL HAS FULL ROOT ACCESS, DO NOT TYPE A COMMAND UNLESS YOU KNOW WHAT IT DOES!!!</div>');
}

function RunTerminal() {
  aioWs('/jci/scripts/run-terminal.sh', 0);
}

function RunCheckIP() {
  globalAIOerror = 'No Ip Address';
  showAioInfo('$ # IP Address:');
  exeCmd('ifconfig wlan0 | grep "inet addr" | cut -d: -f2 | awk "{print $1}"');
}

function aioSBNtest() {
  let msg; const msgChoice = Math.round(Math.random() * 10 / 3);
  switch (msgChoice) {
    case 1: msg = 'Pandamonium!!'; break;
    case 2: msg = 'Enter the Panda!!'; break;
    default: msg = 'Pandas are coming for you!!';
  }
  framework.common.startTimedSbn(this.uiaId, 'SbnAIOTest', 'typeE', {sbnStyle: 'Style02', imagePath1: 'apps/_aiotweaks/panda.png', text1: this.uiaId, text2: msg});
}

function aioWink(msg) {
  let wink;
  const properties = {
    'style': 'style03',
    'text1': msg,
    'winkTimeout': 5000,
    'alertId': '',
    'completeCallback': function() {aioRemoveWink(wink);},
  };
  wink = framework.instantiateControl('common', document.body, 'WinkCtrl', properties);
}

function aioRemoveWink(_wink) {
  if (_wink) {
    framework.destroyControl(_wink);
    _wink = null;
  }
}

function chooseBackground() {
  // aioWs('node -e "let fs = require("fs"); let contents = fs.readFileSync("apps/_aiotweaks/test.txt").toString(); console.log(contents);"', 0);
  // aioWs('node -v', 3);
}

function myRebootSystem() {
  showAioInfo('$ reboot');
  aioWs('reboot', 0); // reboot
}

function fullSystemRestoreConfirm() {
  showAioInfo('<div class="infoMessage"><div style="font-weight:bold;font-size:40px;">ARE YOU SURE?</div><br>THIS WILL REMOVE ALL AIO TWEAKS AND APPS *INCLUDING THIS ONE*<br>But it will not restore default color theme files<br><br><button class="fullRestoreBtn" onclick="$(this).hide();fullSystemRestore();">RUN SYSTEM RESTORE</button></div>');
}

function fullSystemRestore() {
  aioWs('/bin/sh /tmp/mnt/data_persist/dev/system_restore/restore.sh', 2); // Run Full Restore Script
}

function runRemount() {
  showAioInfo('Remounted RW /');
  aioWs('mount -o rw,remount /', 0);
}

function runTweaks() {
  aioWs('/bin/sh /tmp/mnt/sd*/tweaks.sh', 50);
}

function backUpCam() {
  // $("body").css({ "display": "none" });
  aioWs('export WAYLAND_IVI_SURFACE_ID=BACKUPCAM_SURFACE_ID; export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/tmp/dbus_hmi_socket', 0);
  aioWs('gst-launch -v mfw_v4lsrc ! mfw_v4lsink device=/dev/video17', 2);
  utility.setRequiredSurfaces(['BACKUPCAM_SURFACE_ID'], true);
  // 'aioWs('/bin/sh /jci/backupcam/start_cam.sh', 2);
  // aioMagicRoute("_aiotweaks", "RevCam");
  // aioMagicRoute("backupparking", "BackupCameraDisplay");
}

function toggleWifiAP() {
  // showAioInfo("$ start_wifi.sh && jci-wifiap.sh start");
  // aioWs('/bin/sh /jci/scripts/start_wifi.sh; /bin/sh /jci/scripts/jci-wifiap.sh start && echo DONE  ', 5);
  exeCmd('start_wifi.sh; jci-wifiap.sh start');
}

function stopFirewall() {
  showAioInfo('$ jci-fw.sh stop');
  aioWs('/bin/sh /jci/scripts/jci-fw.sh stop && echo "DONE" || echo "FAILBOAT" ', 1);
}
/* function myMessage(){
  let msg = '/jci/gui/apps/_aiotweaks/sh/message.sh "MESSAGES DISPLAY SUCCESS!!<br>THIS IS A P.O.C. FOR DISPAYING JCI-DIALOG<br>MESSAGES USING WEBSOCKETS AND JAVASCRIPT"';
  aioWs(msg, 0);
}*/
function hasAA() {
  let AA = false;
  $.each(appListData, function(key, val) {
    if (val.name === '_androidauto') {
      AA = true;
    }
  });
  (AA) ? null: AioFileCheck('AIO_FC_NOAA');
}

function hasSwap() {
  aioWs('if [ -e /tmp/mnt/sd*1/swapfile ]; then echo AIO_FC_SWAP; else echo AIO_FC_NOSWAP; fi ');
}

function hasCS() {
  aioWs('if [ -e /jci/scripts/cs_receiver_arm ]; then echo AIO_FC_CS; else echo AIO_FC_NOCS; fi ');
}

function hasErrLog() {
  aioWs('if [ -e /tmp/root/casdk-error.log ]; then echo AIO_FC_ERR; else echo AIO_FC_NOERR; fi ');
}

function AioFileCheck(fc) {
  const FC = fc.substr(fc.lastIndexOf('_'));
  switch (FC) {
    case '_NOAA':
      $('#aaTitle, .aaFunc, #headunitLogBtn').remove();
      $('#csTitle').addClass('centered');
      break;
    case '_CS':
      appListData.push({'name': 'cs', 'label': 'CastScreen Receiver'});
      break;
    case '_NOCS':
      $('#csTitle, .csFunc').remove();
      $('#aaTitle').addClass('centered');
      break;
    case '_SWAP':
    // $('#mountSwapBtn').html('<a>Mount Swapfile</a>').show();
    // $('#createSwapBtn').off('click').on('click',deleteSwap).html('<a>Delete Swapfile</a>');
      if (framework.getCurrentApp() === '_aiotweaks') {
        $('#mountSwapBtn').show();
        $('#unmountSwapBtn').show();
      } else if (UMswap === null) {
        swapfileShutdownUnmount();
      }
      break;
    case '_NOSWAP':
      $('#mountSwapBtn').remove();
      $('#unmountSwapBtn').remove();
      // $('#mountSwapBtn').html('').hide();
      // $('#createSwapBtn').off('click').on('click',createSwap).html('<a>Create Swapfile</a>');
      break;
    case '_ERR':
      $('#errLogBtn').show();
      break;
    case '_NOERR':
      $('#errLogBtn').remove();
      break;
    default:
      showAioInfo('INVALID FILE CHECK: ' + fc);
  }
}

function showVehicleData() {
  const vehicleType = [];
  vehicleType.push('<b>Shared Vehicle Data:</b>');
  vehicleType.push('<br>Vehicle Type: ' + framework.getSharedData('syssettings', 'VehicleType'));
  vehicleType.push('<br>HUD: ' + framework.getSharedData('vehsettings', 'HudInstalled'));
  vehicleType.push('<br>Ignition Status: ' + framework.getSharedData('vehsettings', 'IgnitionStatus'));
  vehicleType.push('<br>Can Status: ' + framework.getSharedData('vehsettings', 'CanStatus'));
  vehicleType.push('<br>Vehicle Configuration Data: ' + framework.getSharedData('syssettings', 'VehicleConfigData'));
  vehicleType.push('<br>Email Support: ' + framework.getSharedData('email', 'emailSupported'));
  vehicleType.push('<br>Destination: ' + framework.getSharedData('syssettings', 'DestinationCode'));
  vehicleType.push('<br>Steering Wheel Type: ' + framework.getSharedData('vehsettings', 'SteeringWheelLoc'));
  vehicleType.push('<br>Tool Tips Enabled: ' + framework.getSharedData('syssettings', 'ToolTips'));
  showAioInfo(vehicleType.join(' '));
}

function showAppList() {
  const items = [];
  $.each(appListData, function(key, val) {
    items.push('<li id=\'' + key + '\'>' + val.label + '</li>');
  });
  showAioInfo('<b>Installed AIO Apps:</b>');
  $('<ul/>', {
    'class': 'my-new-list',
    'html': items.join(''),
  }).appendTo('#AioInformation');
}

function enableTouchscreen() {
  aioWs('/jci/scripts/set_speed_restriction_config.sh disable; /jci/scripts/set_lvds_speed_restriction_config.sh disable ', 2); // enabe trouchscreen and menu items
}

function disableTouchscreen() {
  aioWs('/jci/scripts/set_speed_restriction_config.sh enable; /jci/scripts/set_lvds_speed_restriction_config.sh enable ', 2); // disable trouchscreen while driving
}

function enableCompass() {
  aioWs('/jci/scripts/set_speed_restriction_config.sh enable; /jci/scripts/set_lvds_speed_restriction_config.sh disable ', 2); // enabe trouchscreen & Compas
}

function startHeadunit() {
  showAioInfo('$ headunit-wrapper 2>&1 &');
  // AArunning = true;
  // showAioInfo("$ headunit-wrapper 2>&1 &");
  // aioWs('/tmp/mnt/data_persist/dev/bin/headunit-wrapper 2>&1 & ', 30);
  aioWs('headunit-wrapper 2>&1 &', 10);
}

function stopHeadunit() {
  showAioInfo('$ killall headunit-wrapper headunit 2>&1');
  aioWs('killall headunit-wrapper headunit 2>&1', 1);
}

function startCastScreen() {
  // showAioInfo("$ cd /jci/scripts && ./cs_receiver_arm mfw_v4lsink");
  // aioWs('cd /jci/scripts; killall cs_receiver_arm; sleep 1; ./cs_receiver_arm mfw_v4lsink 2>&1', 5);
  aioWs('killall -q -9 cs_receiver_arm; cd /jci/scripts', 0);
  exeCmd('./cs_receiver_arm mfw_v4lsink', true);
}

function stopCastScreen() {
  showAioInfo('$ killall cs_receiver_arm');
  // aioWs('killall cs_receiver_arm 2>&1', 0);
  aioWs('killall -q -9 cs_receiver_arm', 0);
}
/* function startSpeedometer(){
  utility.loadScript('apps/_speedometer/js/speedometer.js');
  $('<div id="SbSpeedo"><div class="gpsAltitudeValue"></div><div class="gpsHeading"></div><div class="gpsSpeedValue">0</div><div class="speedUnit"></div></div>').appendTo('body');
  aioWs('/jci/gui/addon-common/websocketd --port=9969 /jci/gui/apps/_speedometer/sh/speedometer.sh &', 1);
}
function stopSpeedometer(){
  utility.removeScript('apps/_speedometer/js/speedometer.js');
  $("#SbSpeedo").remove();
  aioWs('pkill speedometer.sh', 1);
}*/
function settingsSystemTab() {
  framework.sendEventToMmui('common', 'Global.IntentSettingsTab', {payload: {settingsTab: 'System'}});
}

function wifiSettings() {
  // framework.sendEventToMmui("netmgmt", "SelectNetworkOptions");
  framework.sendEventToMmui('common', 'Global.IntentSettingsTab', {payload: {settingsTab: 'Devices'}});
  framework.sendEventToMmui('syssettings', 'SelectNetworkManagement');
}

function messageTest() {
  aioWs('/bin/sh /jci/gui/apps/_aiotweaks/sh/message.sh');
}

function showVersion() {
  showAioInfo('$ show_version.sh');
  aioWs('show_version.sh', 1);
}

function displayOff() {
  if (typeof framework.common._sendDisplayOffNotification !== 'undefined') {
    framework.common._sendDisplayOffNotification(0);
  } else {
    if (framework.getAppInstance('syssettings') === undefined) {
      framework.sendEventToMmui('common', 'Global.IntentHome');
      framework.sendEventToMmui('common', 'Global.IntentSettingsTab', {payload: {settingsTab: 'Display'}});
    }
    framework.sendEventToMmui('system', 'SelectIdleStandby');
    framework.sendEventToMmui('system', 'DisplayOffGUIActivity');
    framework.sendEventToMmui('syssettings', 'SelectDisplayOff');
  }
}

function showHeadunitLog() {
  globalAIOerror = 'headunit log not available';
  showFile('/tmp/mnt/data/headunit.log');
}

function showErrLog() {
  globalAIOerror = 'error log not available';
  showFile('/tmp/root/casdk-error.log');
}

function exeCmd(command, silent) {
  silent ? aioWs(command, 10) : aioWs(command + ' > /tmp/root/stdout', 0);
  setTimeout(function() {
    silent ? null : showFile('/tmp/root/stdout', command);
  }, 2500);
}

function showFile(filepath, command) {
  showAioInfo(command ? '$ ' + command : 'Loading ' + filepath + ' ...');
  setTimeout(function() {
    $.ajax({
      url: filepath,
      dataType: 'text',
      success: function(data) {
        $('#AioInformation').append(data);
        globalAIOerror = null;
      },
      error: function(e) {
        showAioInfo('ERROR: ' + (globalAIOerror ? globalAIOerror : JSON.stringify(e)), true);
        globalAIOerror = null;
      },
    });
  }, command ? 1000 : 1);
}

function bodyClass() {
  // showAioInfo("Body className: <br> " + document.getElementsByTagName("body")[0].className + "<br><br>localStorage.getItem(\"aiotweaks\"): <br> " + JSON.parse(localStorage.getItem("aiotweaks")));
  str = JSON.stringify(localStorage);
  str = str.replace(/,/g, '<br>');
  showAioInfo('<div class=\'infoMessage\'>' + str + '</div>');
}

function showDFH() {
  // showAioInfo("$ df -h");
  // aioWs('df -h 2>&1', 2);
  exeCmd('df -h');
}

function showMeminfo() {
  showAioInfo('$ cat /proc/meminfo');
  // aioWs('cat /proc/swaps && echo "$ cat /proc/meminfo" && cat /proc/meminfo && echo DONE 2>&1', 3);
  exeCmd('cat /proc/meminfo', true);
}

function showPS() {
  // showAioInfo("$ ps");
  // aioWs('ps', 2);
  exeCmd('ps');
}

function scrollUp() {
  $('#AioInformation').animate({scrollTop: '-=300px'}, 300);
}

function scrollDown() {
  $('#AioInformation').animate({scrollTop: '+=300px'}, 300);
}

function mountSwap() {
  showAioInfo('$ swapon ${SWAPFILE}<br>');
  aioWs('sh /jci/gui/apps/_aiotweaks/sh/resource_swap.sh 2>&1 && echo DONE');
  $('#mountSwapBtn').fadeOut(500);
}

function unmountSwap() {
  showAioInfo('$ swapoff -a /tmp/mnt/sd*/swapfile<br>');
  aioWs('sh /jci/gui/apps/_aiotweaks/sh/resource_swap.sh unmount 2>&1 && echo DONE');
  $('#unmountSwapBtn').fadeOut(500);
}

function replacer(match, p1, p2, p3, p4) {
  const part = {indent: p1, key: p2, value: p3, end: p4};
  const key = '<span class="json-key">';
  const val = '<span class="json-value">';
  const bool = '<span class="json-boolean">';
  const str = '<span class="json-string">';
  const findName = /"([\w]+)": |"(.*)": /;
  const isStr = /[a-zA-Z]/.test(part.value);
  const isArray = /^"\[/.test(part.value);
  const isBool = /true|false/.test(part.value);
  const valSpan = isBool ? bool : isStr ? str : val;
  const indentHtml = part.indent || '';
  const keyHtml = part.key ? key + part.key.replace(findName, '"$1$2"') + '</span>: ' : '';
  const valueHtml = part.value ? valSpan + (isStr && !isArray && !isBool ? part.value : part.value.replace(/\"/g, '')) + '</span>' : '';
  const endHtml = part.end ? part.end + '\n' : '\n';
  return indentHtml + keyHtml + valueHtml + endHtml;
}

function showLocalStorage() {
  // Pretty Print JSON Data in Color
  const prettyPrintJson = function(obj) {
    return JSON.stringify(obj, null, 3).replace(/&/g, '&amp;').replace(/\\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/( *)("[^"]+": )?("[^"]*"|[\w.+-]*)?([{}[\],]*)?\n/g, replacer);
  };
  showAioInfo('localStorage: ');
  showAioInfo(prettyPrintJson(localStorage), true);
}
/*
function createSwap() {
  showAioInfo('$ dd if=/dev/zero of=${SWAPFILE} size=1024k steps=1000');
  aioWs('dd if=/dev/zero of=/tmp/mnt/sda1/swapfile bs=1024 count=524288 2>&1 && echo "Swapfile Created Successfully" && echo DONE &', 3);
  //aioWs('sh /jci/gui/apps/_aiotweaks/sh/createSwap.sh');
  hasSwap(true);
}
function deleteSwap() {
  showAioInfo('$ rm -f ${SWAPFILE}');
  aioWs('rm -f /tmp/mnt/sda1/swapfile && echo "swapfile deleted" && echo DONE & 2>&1', 3);
  //aioWs('sh /jci/gui/apps/_aiotweaks/sh/deleteSwap.sh');
  hasSwap(false);
}

*/
/* ******************
function globalPause(){ // only works with CASDK
framework.sendEventToMmui("system", "SelectUSBB");
framework.sendEventToMmui("Common", "Global.Pause");
framework.sendEventToMmui("Common", "Global.GoBack");
}
function fakeIncomingCall(){
framework.sendEventToMmui("phone", "SelectIncomingCall"); //only works in the emulator
}
function gotoActiveCall(){
framework.sendEventToMmui("phone", "SelectActiveCall"); //only works in the emulator
}
function gotoAllSongs(){
framework.sendEventToMmui("usbaudio", "SelectSongs"); // these functions would actually freeze up the system sometimes
}
************* */
/* websocket
============================================================================================= */
function aioWs(action, waitMessage) {
  function closeWS() {
    if (ws !== null) {
      ws.close();
      ws = null;
    }
    $('button').css({'background': '', 'color': ''});
  }
  let msgnum = -1;
  let ws = new WebSocket('ws://127.0.0.1:9997/');
  const focusBtn = $('button.selectedItem');
  ws.onmessage = function(event) {
    const res = event.data;
    // console.log(res);
    if (res.indexOf('AIO_FC_') !== -1) {
      AioFileCheck(res);
      closeWS();
      return;
    } else if (res.indexOf('DONE') === -1) {
      focusBtn.css({'background': '-o-linear-gradient(top,rgba(255,0,0,0.7),rgba(255,0,0,1))', 'color': '#f00fff'});
      if (AArunning) {
        AAInfo(res);
      } else {
        showAioInfo(res, true);
      }
    }
    msgnum++;
    if (msgnum > waitMessage || res.indexOf('DONE') !== -1) {
      focusBtn.css({'background': '-o-linear-gradient(top,rgba(0,0,0,0.3),rgba(0,0,0,1))', 'color': '#ff0000'});
      setTimeout(function() {
        closeWS();
        AArunning = false;
      }, 4000);
    }
  };
  ws.onopen = function() {
    ws.send(action);
    focusBtn.css({'background': '-o-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,1))', 'color': '#000fff'});
    if (waitMessage < 1) {
      setTimeout(function() {
        closeWS();
      }, 4000);
    }
  };
  ws.onclose = function() {
    closeWS();
  };
  ws.onerror = function() {
    closeWS();
  };
}
/* function nodeWs(action, waitMessage){

let wsn = new WebSocket('ws://127.0.0.1:9997/');

wsn.onmessage = function(event){
let res = event.data;
$('#AioInformation').text(res);
$('#AioInfoPanel').show();
wsn.close();
wsn=null;

};

wsn.onopen = function(){
wsn.send(action);
$('button:focus').css({'background':'#fff','color':'#000'});
console.info(action);
if (!waitMessage)
{
setTimeout(function(){
wsn.close();
wsn=null;
},2000);
}
};
wsn.onclose = function(){
$('button:focus').css({'background':'','color':''});
};
}*/
