// *****************************
// ** AIO Tweaks App v0.3 - mzd.js
// ** All the functions for Buttons in AIO Tweaks App
// ** By Trezdog44
// *****************************
//# Testing websockets
/* jshint -W117 */
var wsAIO = null;
var myVideo = null;
var currSelected = 0;
var AArunning = false;
$(document).ready(function(){
	try
	{
		$('#SbSpeedo').fadeOut();
		//framework.sendEventToMmui("common", "SelectBTAudio");
	}
	catch(err)
	{

	}
	// *****************************
	// ** Setting of Buttons BEGIN!
	// *****************************
	// AIO info
	$('#aioInfo').click(function(){showAioInfo('<h1>AIO Tweaks App v0.3</h1>This is an experimental app by Trezdog44 made to test the capabilities, functionalities, and limitations of apps in the MZD Infotainment System.<br>This app has some useful and fun functions although it is not guaranteed that everything works.  There may be non-functioning or experimental features.');});
	$('#aioReboot').click(myRebootSystem);
	$('#mainMenuLoop').click(setMainMenuLoop);
	$('#test').click(myTest);
	$('#touchscreenBtn').click(enableTouchscreen);
	$('#touchscreenOffBtn').click(disableTouchscreen);
	$('#touchscreenCompassBtn').click(enableCompass);
	$('#messageBtn').click(myMessage);
	$('#messageTestBtn').click(messageTest);
	$('#screenshotBtn').click(takeScreenshot);
	$('#saveScreenshotBtn').click(saveScreenshot);
	$('#AAstart').click(startHeadunit);
	$('#AAstop').click(stopHeadunit);
	$('#CSstart').click(startCastScreen);
	$('#CSstop').click(stopCastScreen);
	$('#chooseBg').click(chooseBackground);
	$('#systemTab').click(settingsSystemTab);
	$('#wifiSettings').click(wifiSettings);
	$('#chooseBg').click(chooseBackground);
	$('#runTweaksBtn').click(runTweaks);
	$('#fullRestoreConfirmBtn').click(fullSystemRestoreConfirm);
	$('#headunitLogBtn').click(showHeadunitLog);
	$('#scrollUpBtn').click(scrollUp);
	$('#scrollDownBtn').click(scrollDown);
	$('#appListBtn').click(showAppList);
	$('#showEnvBtn').click(showEnvVar);
	$('#closeAioInfo').click(closeAioInfo);
	$('#backupCamBtn').click(backUpCam);
	$('#toggleWifiAPBtn').click(toggleWifiAP);
	$('#stopFirewallBtn').click(stopFirewall);
	$('#displayOffBtn').click(displayOff);
	$('#allSongsBtn').click(gotoAllSongs);
	$('#activeCallBtn').click(gotoActiveCall);
	$('#fakeIncomingCallBtn').click(fakeIncomingCall);
	$('#showBgBtn').click(function(){$('html').addClass('showBg')});
	$('#twkOut').click(function(){framework.sendEventToMmui('common', 'Global.IntentHome')});
	$('#usba').click(function(){framework.sendEventToMmui('system', 'SelectUSBA')});
	$('#usbb').click(function(){framework.sendEventToMmui('system', 'SelectUSBB')});
	$('#BluetoothAudio').click(function(){framework.sendEventToMmui('system', 'SelectBTAudio')});
	$('#previousTrackBtn').click(function(){framework.sendEventToMmui('Common', 'Global.Previous')});
	$('#nextTrackBtn').click(function(){framework.sendEventToMmui('Common', 'Global.Next')});
	$('.mmLayout').click(function(){changeLayout($(this).attr('id'));$('#MainMenuMsg').text($(this).text());});
	$('.toggleTweaks').click(function(){$('body').toggleClass($(this).attr('id'));$('#MainMenuMsg').text($(this).text());});
	$('#clearTweaksBtn').click(function(){$('body').attr('class','');$('#MainMenuMsg').text('Main Menu Restored');localStorage.removeItem('aiotweaks');});
	$('#touchscreenToggle').click(function(){$('#touchscreenPanel').toggle()});
	$('#closeTouchPanel').click(function(){$('#touchscreenPanel').hide()});
	// Tab select & localStrage save on each button press
	$('button').click(setTimeout(function(){
		localStorage.setItem('aiotweaks', JSON.stringify($('body').attr('class')));
	}), 500);
	$('.tablinks').click(function(){
		$('#MainMenuMsg').text('');
		$('.tablinks').removeClass('active');
		$(this).addClass('active');
		localStorage.setItem('aio.prevtab', JSON.stringify($(this).attr('id')));
	});
	$('#openNav').click(function(){
		document.getElementById('mySidenav').style.width = '250px';
		document.getElementById('main').style.marginLeft = '250px';
	});
	$('#closeNav').click(function(){
		document.getElementById('mySidenav').style.width = '0';
		document.getElementById('main').style.marginLeft= '0';
	});
});
// *****************************
// ** Button Functions GO!
// *****************************
function changeLayout (newlayout) {
	for(i=1 ; i<5; i++) {
		$('body').removeClass('star'+i);
	}
	$('body').addClass(newlayout);
	localStorage.setItem('aiotweaks',JSON.stringify($('body').attr('class')));
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
	$('#AioInfoPanel, .AIO-scroller').show();
	if(append) {
		$('#AioInformation').append(message + '<br>');
	} else {
		$('#AioInformation').html(message);
	}
}
function AAInfo(message){
	$('#aaTitle, #csTitle').css({'outline':'none'});
	$('#AioInfoPanel, .AIO-scroller').show();
	$('#AioInformation').prepend(message + '<br>');
}
function closeAioInfo(erase){
	$('#aaTitle, #csTitle').css({'outline':''});
	$('#AioInfoPanel, .AIO-scroller').hide();
	if(erase){
		$('#AioInformation').html('');
	}
}
function myTest(){
	aioWs('node -e "console.log(\'Test\')"', 1);
}
function chooseBackground(){
	//aioWs('node -e "var fs = require("fs"); var contents = fs.readFileSync("apps/_aiotweaks/test.txt").toString(); console.log(contents);"', 0);
	aioWs('node -v', 3);
}
function myRebootSystem(){
	aioWs('reboot', 0); //reboot
}
function runTweaks(){
	aioWs('/bin/sh /jci/gui/apps/_aiotweaks/sh/poc.sh', 3); //run AIOtweaks
}
function fullSystemRestoreConfirm(){
	showAioInfo('<div style="font-weight:bold;font-size:40px">ARE YOU SURE?</div><br>THIS WILL REMOVE ALL AIO TWEAKS AND APPS *INCLUDING THIS ONE*<br>But it will not restore default color theme files<br><br><button class="fullRestoreBtn" onclick="fullSystemRestore()">RUN SYSTEM RESTORE</button>');
}
function fullSystemRestore(){
	aioWs('/bin/sh /tmp/mnt/data_persist/dev/system_restore/restore.sh', 2); // Run Full Restore Script
}
function backUpCam(){
	aioWs('/bin/sh /jci/backupcam/start_cam.sh', 0);
}
function toggleWifiAP(){
	aioWs('/bin/sh /jci/scripts/start_wifi.sh; /bin/sh /jci/scripts/jci-wifiap.sh start && echo DONE  ', 5);
}
function stopFirewall(){
	aioWs('/bin/sh /jci/scripts/jci-fw.sh stop && echo "DONE" || echo "FAILBOAT" ', 1);
}
function myMessage(){
	var msg = '/jci/gui/apps/_aiotweaks/sh/message.sh "MESSAGES DISPLAY SUCCESS!!<br>THIS IS A P.O.C. FOR DISPAYING JCI-DIALOG<br>MESSAGES USING WEBSOCKETS AND JAVASCRIPT"';
	aioWs(msg, 0);
}
function showAppList(){
	$('#AioInfoPanel').show();
	$.getJSON( "../opera/opera_dir/userjs/additionalApps.json", function( data ) {
		var items = [];
		$.each( data, function( key, val ) {
			items.push( "<li id='" + key + "'>" + val.label + "</li>" );
		});
		$("#AioInformation").html('Installed AIO Apps<br><br>');
		$( "<ul/>", {
			"class": "my-new-list",
			html: items.join( "" )
		}).appendTo( "#AioInformation" );
	});
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
	aioWs('/tmp/mnt/data_persist/dev/bin/headunit-wrapper & ', 30);
}
function stopHeadunit(){
	aioWs('killall headunit', 0);
}
function startCastScreen(){
	aioWs('cd /jci/scripts; killall cs_receiver_arm; sleep 1; ./cs_receiver_arm mfw_v4lsink ', 5);
}
function stopCastScreen(){
	aioWs('killall cs_receiver_arm', 0);
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
	aioWs('show_version.sh', 1);
}
function displayOff(){
	framework.sendEventToMmui("common", "Global.IntentSettingsTab",{payload:{settingsTab:"Display"}});
	framework.sendEventToMmui("syssettings", "SelectDisplayOff");
	//framework.sendEventToMmui("system", "DisplayOffGUIActivity");
}
function showHeadunitLog(){
	aioWs('cat /tmp/mnt/data/headunit.log', 2);
}
function scrollUp(){
	$('#AioInformation').animate({scrollTop: '-=300px'}, 500);
}
function scrollDown(){
	$('#AioInformation').animate({scrollTop: '+=300px'}, 500);
}
function globalPause(){
	/*framework.sendEventToMmui("system", "SelectUSBB");
	framework.sendEventToMmui("Common", "Global.Pause");
	framework.sendEventToMmui("Common", "Global.GoBack");*/
}
function fakeIncomingCall(){
	framework.sendEventToMmui("phone", "SelectIncomingCall"); //only works in the emulator
}
function gotoActiveCall(){
	framework.sendEventToMmui("phone", "SelectActiveCall"); //only works in the emulator
}
function gotoAllSongs(){
	framework.sendEventToMmui("usbaudio", "SelectSongs");
}
/* websocket
============================================================================================= */
function aioWs(action, waitMessage){
	var msgnum = 0;
	var ws = new WebSocket('ws://127.0.0.1:9997/');

	var focusBtn = $('button:focus');
	ws.onmessage = function(event){
		var res = event.data;
		if(AArunning) {
			AAInfo(res);
		} else {
			showAioInfo(res, true);
		}
		focusBtn.css({'background':'#ff0000'});
		msgnum++;
		if(msgnum > waitMessage || res.indexOf('DONE') > -1) {
		focusBtn.css({'background':'#0000ff'});
			setTimeout(function(){
				ws.close();
				ws=null;
				AArunning = false;
			},4000);
		}
	};

	ws.onopen = function(){
		ws.send(action);
		focusBtn.css({'background':'#fff','color':'#000'});
		console.info(action);
		if (waitMessage < 1)
		{
			setTimeout(function(){
				ws.close();
				ws=null;
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
