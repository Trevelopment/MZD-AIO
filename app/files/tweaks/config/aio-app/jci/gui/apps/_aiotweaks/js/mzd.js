// *****************************
// ** AIO Tweaks App v0.4 - mzd.js
// ** All the functions for Buttons in AIO Tweaks App
// ** By Trezdog44
// *****************************
/* jshint -W117 */
var wsAIO = null;
var AArunning = false;
var AIOvideo = false;
var appListData = [];
var aioWsVideo = null;
$(document).ready(function(){
  try
  {
    $("#SbSpeedo").fadeOut();
    //framework.sendEventToMmui("common", "SelectBTAudio");
  }
  catch(err)
  {

  }
  // *****************************
  // ** Setting of Buttons BEGIN!
  // *****************************
  // AIO info
  getAppListData();
  $('button').on('click',function(){$('button').removeClass('selectedItem');$(this).addClass('selectedItem')});
  $("#aioInfo").on("click",function(){showAioInfo("<div class='infoMessage'><h1>AIO Tweaks App v0.4</h1>This is an experimental app by Trezdog44 made to test the capabilities, functionalities, and limitations of apps in the MZD Infotainment System.<br>This app has some useful and fun functions although it is not guaranteed that everything works.  There may be non-functioning or experimental features.</div>");});
  $("#aioReboot").on("click",myRebootSystem);
  $("#mainMenuLoop").on("click",setMainMenuLoop);
  $("#test").on("click",myTest);
  $("#touchscreenBtn").on("click",enableTouchscreen);
  $("#touchscreenOffBtn").on("click",disableTouchscreen);
  $("#touchscreenCompassBtn").on("click",enableCompass);
  $("#messageBtn").on("click",myMessage);
  $("#messageTestBtn").on("click",messageTest);
  $("#screenshotBtn").on("click",takeScreenshot);
  $("#saveScreenshotBtn").on("click",saveScreenshot);
  $("#AAstart").on("click",startHeadunit);
  $("#AAstop").on("click",stopHeadunit);
  $("#CSstart").on("click",startCastScreen);
  $("#CSstop").on("click",stopCastScreen);
  $("#SPstart").on("click",startSpeedometer);
  $("#SPstop").on("click",stopSpeedometer);
  $("#chooseBg").on("click",chooseBackground);
  $("#systemTab").on("click",settingsSystemTab);
  $("#wifiSettings").on("click",wifiSettings);
  $("#runTweaksBtn").on("click",playAllVideos);
  $("#fullRestoreConfirmBtn").on("click",fullSystemRestoreConfirm);
  $("#headunitLogBtn").on("click",showHeadunitLog);
  $("#scrollUpBtn").on("click",scrollUp);
  $("#scrollDownBtn").on("click",scrollDown);
  $("#appListBtn").on("click",showAppList);
  $("#showEnvBtn").on("click",showEnvVar);
  $("#closeAioInfo").on("click",closeAioInfo);
  $("#backupCamBtn").on("click",showBodyClassName);
  $("#showDFHBtn").on("click",showDFH);
  $("#showPSBtn").on("click",showPS);
  $("#showMeminfoBtn").on("click",showMeminfo);
  $("#toggleWifiAPBtn").on("click",toggleWifiAP);
  $("#stopFirewallBtn").on("click",stopFirewall);
  $("#displayOffBtn").on("click",displayOff);
  $("#mountSwapBtn").on("click",mountSwap);
  $("#createSwapBtn").on("click",createSwap);
  $("#showBgBtn").on("click",function(){$("html").addClass("showBg")});
  $("#twkOut").on("click",function(){framework.sendEventToMmui("common", "Global.IntentHome")});
  $("#usba").on("click",function(){framework.sendEventToMmui("system", "SelectUSBA")});
  $("#usbb").on("click",function(){framework.sendEventToMmui("system", "SelectUSBB")});
  $("#BluetoothAudio").on("click",function(){framework.sendEventToMmui("system", "SelectBTAudio")});
  $("#previousTrackBtn").on("click",function(){framework.sendEventToMmui("Common", "Global.Previous")});
  $("#nextTrackBtn").on("click",function(){framework.sendEventToMmui("Common", "Global.Next")});
  $(".mmLayout").on("click",function(){changeLayout($(this).attr("id"));$("#MainMenuMsg").html($(this).text());});
  $(".toggleTweaks").on("click",function(){$("body").toggleClass($(this).attr("id"));$("#MainMenuMsg").html($(this).text());});
  $("#clearTweaksBtn").on("click",function(){$("body").attr("class","");$("#MainMenuMsg").text("Main Menu Restored");localStorage.removeItem("aiotweaks");});
  //$("#touchscreenToggle").on("click",toggleTSPanel);
  $("#closeTouchPanel").on("click",closeTSPanel);
  // Tab select & localStrage save on each button press
  $(".toggleTweaks").on("click",saveTweaks);
  $(".tablinks").on("click",function(){
    $("#MainMenuMsg").html("");
    localStorage.setItem("aio.prevtab", JSON.stringify($(this).attr("id")));
  });
  $("#openNav").on("click",function(){
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  });
  $("#closeNav").on("click",function(){
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  });
});
// *****************************
// ** Button Functions GO!
// *****************************
function saveTweaks () {
  var body = document.getElementsByTagName("body")[0];
  localStorage.aiotweaks = JSON.stringify(body.className);
  aioWs("sync && echo DONE");
}
function changeLayout (newlayout) {
  for(i=1 ; i<6; i++) {
    $("body").removeClass("star"+i);
  }
  $("body").addClass(newlayout);
  saveTweaks();
}
function getAppListData(){
  $.getJSON( "../opera/opera_dir/userjs/additionalApps.json", function( data ) {
    appListData = data;
    hasAA();
    hasCS();
    hasSwap();
  });
}
/*this.unsetMainMenuLoop = function() {
this.offSetFocus = MainMenuCtrl.prototype._offsetFocus.toString();
}*/
function setMainMenuLoop() {
  MainMenuCtrl.prototype._offsetFocus = this._MainMenuLoop;
  $('#MainMenuMsg').text('Main Menu Loop');
}
_MainMenuLoop = function(direction)
{
  var index = this._getFocus();
  index += direction;

  if (index < 0)
  {
    index = 4;
  }
  if (index > 4)
  {
    index = 0;
  }

  if (index !== this._getFocus())
  {
    this._setFocus(index);
    this._setHighlight(index);
  }
}
function showEnvVar(){
  showAioInfo("$ env");
  aioWs('env', 3);
}
function takeScreenshot(){
  showAioInfo('Screenshot in 10 Seconds');
  setTimeout(function(){
    closeAioInfo(true);
    showSaveScreenshotBtn();
  }, 10000);
}
function showSaveScreenshotBtn(){
  aioWs('/bin/sh /jci/gui/apps/_aiotweaks/sh/screenshot.sh && echo "DONE"', 1);
  $('#saveScreenshotBtn').show();
}
function saveScreenshot(){
  $('#AioInfoPanel').show();
  var msg = '/jci/tools/jci-dialog --info --title="SCREENSHOT SAVED TO SD CARD" --text="NOT REALLY\\n I WILL DO THAT LATER" & ';
  msg += 'sleep 2; ';
  msg += 'killall jci-dialog; ';
  msg += "/bin/sh /jci/gui/apps/_aiotweaks/sh/screenshot.sh TrezShot ";
  msg += "\n";
  $('#AioInformation').css({'background':'url(/tmp/root/wayland-screenshot.png?'+Date.now()+')','background-size':'100% 100%','background-position':'center'});
  aioWs(msg, 0);
}
function showAioInfo(message,append){
  $('#aaTitle, #csTitle').css({'outline':'none'});
  $('#AioInfoPanel').addClass('opened');
  message += '<br>';
  if(!append) {
    $('#AioInformation').html(message);
  } else {
    $('#AioInformation').append(message);
  }
  if($('#AioInformation').height() === 360){
    $('#AioInfoPanel').addClass('scrollers');
  }
}
function AAInfo(message){
  $('#aaTitle, #csTitle').css({'outline':'none'});
  $('#AioInformation').prepend(message + '<br>');
  $('#AioInfoPanel').addClass('opened');
  if($('#AioInformation').height() === 360){
    $('#AioInfoPanel').addClass('scrollers');
  }
}
function closeAioInfo(erase){
  $('#aaTitle, #csTitle').css({'outline':''});
  $('#AioInfoPanel').removeClass('opened scrollers');
}
function toggleTSPanel(){
  $("#touchscreenPanel").toggle();
}
function closeTSPanel(){
  $("#Opt").click();
}
function myTest(){
  aioWs('node -e "console.log(\'Test\')"', 1);
}
function chooseBackground(){
  //aioWs('node -e "var fs = require("fs"); var contents = fs.readFileSync("apps/_aiotweaks/test.txt").toString(); console.log(contents);"', 0);
  //aioWs('node -v', 3);
}
function myRebootSystem(){
  showAioInfo("$ reboot");
  aioWs('reboot', 0); //reboot
}
function runTweaks(){
  CSExists();
  //aioWs('/bin/sh /jci/gui/apps/_aiotweaks/sh/poc.sh', 3); //run AIOtweaks
}
function fullSystemRestoreConfirm(){
  showAioInfo('<div class="infoMessage"><div style="font-weight:bold;font-size:40px;">ARE YOU SURE?</div><br>THIS WILL REMOVE ALL AIO TWEAKS AND APPS *INCLUDING THIS ONE*<br>But it will not restore default color theme files<br><br><button class="fullRestoreBtn" onclick="fullSystemRestore()">RUN SYSTEM RESTORE</button></div>');
}
function fullSystemRestore(){
  aioWs('/bin/sh /tmp/mnt/data_persist/dev/system_restore/restore.sh', 2); // Run Full Restore Script
}
function backUpCam(){
  utility.setRequiredSurfaces("NATGUI_SURFACE", true);
  aioWs('/bin/sh /jci/backupcam/start_cam.sh', 2);
}
function toggleWifiAP(){
  showAioInfo("$ start_wifi.sh && jci-wifiap.sh start");
  aioWs('/bin/sh /jci/scripts/start_wifi.sh; /bin/sh /jci/scripts/jci-wifiap.sh start && echo DONE  ', 5);
}
function stopFirewall(){
  showAioInfo("$ jci-fw.sh stop");
  aioWs('/bin/sh /jci/scripts/jci-fw.sh stop && echo "DONE" || echo "FAILBOAT" ', 1);
}
function myMessage(){
  var msg = '/jci/gui/apps/_aiotweaks/sh/message.sh "MESSAGES DISPLAY SUCCESS!!<br>THIS IS A P.O.C. FOR DISPAYING JCI-DIALOG<br>MESSAGES USING WEBSOCKETS AND JAVASCRIPT"';
  aioWs(msg, 0);
}
function hasAA(){
  var AA = false;
  $.each(appListData, function( key, val ) {
    if(val.name === "_androidauto") {
      AA = true;
    }
  });
  (AA) ? null : AioFileCheck('AIO_FC_NOAA');
}
function hasSwap() {
  aioWs('if [ -e /tmp/mnt/sd*1/swapfile ]; then echo AIO_FC_SWAP; else echo AIO_FC_NOSWAP; fi ');
}
function hasCS() {
  aioWs('if [ -e /jci/scripts/cs_receiver_arm ]; then echo AIO_FC_CS; else echo AIO_FC_NOCS; fi ');
}
function AioFileCheck(fc) {
  if(fc.indexOf('_NOAA') !== -1) {
    $('#aaTitle, .aaFunc').remove();
    $('#csTitle').addClass('centered');
  } else if (fc.indexOf('_CS') !== -1) {
    appListData.push({"name":"cs","label":"CastScreen Receiver"});
  } else if (fc.indexOf('_NOCS') !== -1) {
    $('#csTitle, .csFunc').remove();
    $('#aaTitle').addClass('centered');
  } else if (fc.indexOf('_SWAP') !== -1) {
    //$('#mountSwapBtn').html('<a>Mount Swapfile</a>').show();
    //$('#createSwapBtn').off('click').on('click',deleteSwap).html('<a>Delete Swapfile</a>');
  } else if (fc.indexOf('_NOSWAP') !== -1) {
    $('#mountSwapBtn').remove();
    //$('#mountSwapBtn').html('').hide();
    //$('#createSwapBtn').off('click').on('click',createSwap).html('<a>Create Swapfile</a>');
  } else {
    showAioInfo('INVALID FILE CHECK: ' + fc);
  }
}
function showAppList(){
  var items = [];
  $.each(appListData, function( key, val ) {
    items.push( "<li id='" + key + "'>" + val.label + "</li>" );
  });
  showAioInfo('Installed AIO Apps');
  $( "<ul/>", {
    "class": "my-new-list",
    html: items.join( "" )
  }).appendTo( "#AioInformation" );
}
function enableTouchscreen(){
  aioWs('/jci/scripts/set_speed_restriction_config.sh disable; /jci/scripts/set_lvds_speed_restriction_config.sh disable ', 2); //enabe trouchscreen and menu items
}
function disableTouchscreen(){
  aioWs('/jci/scripts/set_speed_restriction_config.sh enable; /jci/scripts/set_lvds_speed_restriction_config.sh enable ', 2); //disable trouchscreen while driving
}
function enableCompass(){
  aioWs('/jci/scripts/set_speed_restriction_config.sh enable; /jci/scripts/set_lvds_speed_restriction_config.sh disable ', 2); //enabe trouchscreen & Compas
}
function startHeadunit(){
  AArunning = true;
  showAioInfo("$ /tmp/mnt/data_persist/dev/bin/headunit-wrapper &");
  aioWs('/tmp/mnt/data_persist/dev/bin/headunit-wrapper 2>&1 & ', 30);
}
function stopHeadunit(){
  showAioInfo("$ killall headunit");
  aioWs('killall headunit 2>&1', 0);
}
function startCastScreen(){
  showAioInfo("$ cd /jci/scripts && ./cs_receiver_arm mfw_v4lsink");
  aioWs('cd /jci/scripts; killall cs_receiver_arm; sleep 1; ./cs_receiver_arm mfw_v4lsink 2>&1', 5);
}
function stopCastScreen(){
  showAioInfo("$ killall cs_receiver_arm");
  aioWs('killall cs_receiver_arm 2>&1', 0);
}
function startSpeedometer(){
  utility.loadScript('apps/_speedometer/js/speedometer.js');
  $('<div id="SbSpeedo"><div class="gpsAltitudeValue"></div><div class="gpsHeading"></div><div class="gpsSpeedValue">0</div><div class="speedUnit"></div></div>').appendTo('body');
  aioWs('/jci/gui/addon-common/websocketd --port=55554 /jci/gui/apps/_speedometer/sh/speedometer.sh &', 1);
}
function stopSpeedometer(){
  utility.removeScript('apps/_speedometer/js/speedometer.js');
  $("#SbSpeedo").remove();
  aioWs('pkill speedometer.sh', 1);
}
function settingsSystemTab(){
  framework.sendEventToMmui("common", "Global.IntentSettingsTab",{payload:{settingsTab:"System"}});
}
function wifiSettings(){
  //framework.sendEventToMmui("netmgmt", "SelectNetworkOptions");
  framework.sendEventToMmui("common", "Global.IntentSettingsTab",{payload:{settingsTab:"Devices"}});
  framework.sendEventToMmui("syssettings", "SelectNetworkManagement");
}
function messageTest() {
  aioWs('/bin/sh /jci/gui/apps/_aiotweaks/sh/message.sh');
}
function pocTweaks() {
  //	aioWs('/bin/sh /jci/gui/apps/_aiotweaks/sh/poc.sh "Yo What Up Dooooggggggg!!!!"');
}
function showVersion(){
  showAioInfo("$ show_version.sh");
  aioWs('show_version.sh', 1);
}
function displayOff(){
  framework.sendEventToMmui("common", "Global.IntentSettingsTab",{payload:{settingsTab:"Display"}});
  framework.sendEventToMmui("syssettings", "SelectDisplayOff");
  //framework.sendEventToMmui("system", "DisplayOffGUIActivity");
}
function showHeadunitLog(){
  /*showAioInfo("$ cat /tmp/mnt/data/headunit.log");
  aioWs('cat /tmp/mnt/data/headunit.log &', 2);*/
  showAioInfo();
  $.ajax({
     url : "/tmp/mnt/data/headunit.log",
     dataType: "text",
     success : function (data) {
         $("#AioInformation").html(data);
     },
     error : function(e){
       showAioInfo("ERROR: " + e);
     }
 });
}
function showBodyClassName(){
  //showAioInfo("Body className: <br> " + document.getElementsByTagName("body")[0].className + "<br><br>localStorage.getItem(\"aiotweaks\"): <br> " + JSON.parse(localStorage.getItem("aiotweaks")));
  showAioInfo("<div class='infoMessage'>" + JSON.stringify(localStorage) + "</div>");
}
function showDFH(){
  showAioInfo("$ df -h");
  aioWs('df -h 2>&1', 2);
}
function showMeminfo(){
  showAioInfo("$ cat /proc/swaps");
  aioWs('cat /proc/swaps && echo "$ cat /proc/meminfo" && cat /proc/meminfo && echo DONE 2>&1', 3);
}
function showPS(){
  showAioInfo("$ ps");
  aioWs('ps', 2);
}

function scrollUp(){
  $('#AioInformation').animate({scrollTop: '-=300px'}, 100);
}
function scrollDown(){
  $('#AioInformation').animate({scrollTop: '+=300px'}, 100);
}
function mountSwap(){
  showAioInfo('$ swapon ${SWAPFILE}<br>');
  aioWs('sh /jci/gui/apps/_aiotweaks/sh/resource_swap.sh 2>&1 && echo DONE');
}
function unmountSwap(){
  showAioInfo('$ swapoff -a<br>');
  aioWs('swapoff -a 2>&1');
}
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
function playAllVideos(){
  showAioInfo("$ gplay");
  //var src = 'gst-launch filesrc location=$(ls -d -1 /tmp/mnt/sd*/Movies/** | egrep ".avi|.mp4|.wmv|.flv" | tr "\n" ",") typefind=true ! aiurdemux name=demux demux. ! queue max-size-buffers=0 max-size-time=0 ! vpudec ! mfw_v4lsink demux. ! queue max-size-buffers=0 max-size-time=0 ! beepdec ! audioconvert ! "audio/x-raw-int, channels=2" ! alsasink'
  //var src = 'gplay --video-sink=mfw_v4lsink --audio-sink=alsasink $(ls -d -1 /tmp/mnt/sd*/Movies/** | egrep ".avi|.mp4|.wmv|.flv" | tr "\n" ",") 2>&1 && echo DONE';
  var src = 'sync; for n in 0 1 2 3; do echo $n > /proc/sys/vm/drop_caches; done; gplay --video-sink=mfw_v4lsink --audio-sink=alsasink $(ls -d -1 /tmp/mnt/sd*/Movies/** | egrep ".avi|.mp4|.wmv|.flv" | tr "\n" ";")  2>&1 && echo DONE';
  aioWs(src,4);
}
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
function aioWs(action, waitMessage){
  var msgnum = -1;
  var ws = new WebSocket('ws://127.0.0.1:9997/');

  var focusBtn = $('button.selectedItem');
  ws.onmessage = function(event){
    var res = event.data;
    //console.log(res);
    if(res.indexOf('AIO_FC_') !== -1) {
      AioFileCheck(res);
      ws.close();
      return;
    } else if(res.indexOf('DONE') === -1) {
      focusBtn.css({'background':'-o-linear-gradient(top,rgba(255,0,0,0),rgba(255,0,000,1))'});
      if(AArunning) {
        AAInfo(res);
      } else {
        showAioInfo(res, true);
      }
    }
    msgnum++;
    if(msgnum > waitMessage || res.indexOf('DONE') !== -1) {
      focusBtn.css({'background':'-o-linear-gradient(top,rgba(0,0,0,0),rgba(0,0,0,1))','color':'#fff'});
      setTimeout(function(){
        if (ws !== null) {
          ws.close();
          ws=null;
        }
        AArunning = false;
        $('button').css({'background':''});
      },4000);
    }
  };

  ws.onopen = function(){
    ws.send(action);
    focusBtn.css({'background':'-o-linear-gradient(top,rgba(255,255,255,.5),rgba(255,255,255,1))','color':'#000'});
    //console.info(action);
    if (waitMessage < 1)
    {
      setTimeout(function(){
        if (ws !== null) {
          ws.close();
          ws=null;
        }
      },4000);
    }
  };
  ws.onclose = function(){
    $('button').css({'background':'','color':''});
  };
}
/*function nodeWs(action, waitMessage){

var wsn = new WebSocket('ws://127.0.0.1:9997/');

wsn.onmessage = function(event){
var res = event.data;
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
// #############################################################################################
