/* ****************************
** AIO Tweaks App
** Copyright 2019 Trezdog44
 __________________________________________________________________________

 Filename: AIO-startup.js
 __________________________________________________________________________
*/
/* jshint -W117 */
let turnScreenOff = false;
const turnWifiOn = false; // this is experimental and may not work yet
const AIOlonghold = false;

function applyTweaks() {
  const head = document.querySelector('head');
  const body = document.getElementsByTagName('body')[0];
  if (!window.jQuery) {
    utility.loadScript('addon-common/jquery.min.js');
  }
  const tweaks = localStorage.getItem('aio.tweaks') || '';
  if (tweaks.length > 0) {
    const AIOcss = document.createElement('link');
    AIOcss.href = 'apps/_aiotweaks/css/_aiotweaksApp.css';
    AIOcss.rel = 'stylesheet';
    AIOcss.type = 'text/css';
    body.insertBefore(AIOcss, body.firstChild);
    body.className = tweaks;
  }
}

framework.transitionsObj._genObj._TEMPLATE_CATEGORIES_TABLE.AIOTweaksTmplt = 'Detail with UMP';

applyTweaks();
/* ** Attempt to start speedometer app on boot **
** Works in the emulator but not in the car ** * /
setTimeout(function(){
framework.sendEventToMmui("system","SelectApplications");
setTimeout(function(){aioMagicRoute("_speedometer","Start");}, 4000);
}, 30000);
*/
utility.loadScript('apps/_aiotweaks/js/mzd.js', null, function() {
  if (turnWifiOn) {
    framework.common._contextCategory._contextCategoryTable['netmgmt.*'] = 'Other';
    setTimeout(function() {
      turnOnWifi();
    }, 3000); // 3 second delay to let everything load up
  }
  if (turnScreenOff) {
    setTimeout(function() {
      turnScreenOff = setInterval(function() {
        if (framework.getCurrCtxtId() === 'DisplayOff') {
          clearInterval(turnScreenOff);
          turnScreenOff = null;
        } else {
          framework.sendEventToMmui('common', 'Global.IntentSettingsTab', {payload: {settingsTab: 'Display'}});
          framework.sendEventToMmui('common', 'Global.IntentHome');
        }
        setTimeout(function() {
          framework.getCurrCtxtId() === 'DisplayOff' ? null : framework.sendEventToMmui('syssettings', 'SelectDisplayOff');
        }, 1000);
      }, 5000);
    }, 5000);
  }
});
