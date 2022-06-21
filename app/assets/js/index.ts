/* ************************************************************************** *\
** ************************************************************************** **
** MZD-AIO-TI                                                                 **
** By: Trezdog44 - Trevor Martin                                              **
** http://mazdatweaks.com                                                    **
** ©2020 Trevelopment                                                         **
**                                                                            **
** index.js - Helper javascript functions for the main view using electron    **
** renderer process modules.                                                  **
**                                                                            **
** ************************************************************************** **
\* ************************************************************************** */
/* jshint esversion:8, -W033, -W117, -W097, -W116 */
const {electron, nativeImage, remote, clipboard, shell} = require('electron');
const {app, BrowserWindow, dialog} = remote;
const _ = require('lodash');
const fs = require('fs');
const ipc = require('electron').ipcRenderer;
const Config = require('electron-store');
export const settings = new Config({'name': 'aio-data'});
export const persistantData = new Config({'name': 'aio-persist'});
export const dataObj = new Config({'name': 'aio-data-obj'});
const lastView = new Config({'name': 'aio-last'});
export const userThemes = new Config({'name': 'user-themes'});
export const casdkApps = new Config({'name': 'casdk'});
export const speedoSave = new Config({'name': 'MZD_Speedometer'});
export const {writeFileSync} = require('fs');
const isDev = require('electron-is-dev');
const path = require('path');
export const os = require('os');
export const appender = require('appender'); // Appends the tweak files syncronously
export const crlf = require('crlf'); // Converts line endings (from CRLF to LF)
export const copydir = require('copy-dir'); // Copys full directories
const drivelist = require('drivelist'); // Module that gets the list of available USB drives
export const extract = require('extract-zip'); // For Unzipping
const mkdirp = require('mkdirp'); // Equiv of Unix command mkdir -p
export const rimraf = require('rimraf'); // Equiv of Unix command rm -rf
const copyFolderLocation = persistantData.get('copyFolderLocation', app.getPath('desktop'));
const visits = persistantData.get('visits', 0);
export const hasSpeedCamFiles = false; // fs.existsSync(`${app.getPath('userData')}/speedcam-patch/`)
let translateSchemas; let langPath; let langDefault;
export const colordir = `${app.getPath('userData')}/color-schemes/`; // Location of downloaded color theme files (userData)
export const hasColorFiles = fs.existsSync(`${colordir}`);
export const approot = (isDev ? './app/' : app.getAppPath());
export const builddir = `${approot}/files/tweaks/`; // Location of tweak files (as .txt files)
export const logFileName = 'MZD_LOG'; // Name of log file (without extension)
export const varDir = `${app.getPath('userData')}/background/`; // Location of files with saved variables
export const getBackground = `${varDir}/background.png`;
export const date = function() {return new Date();};
export const dataURL = '';
const aioURL = '';
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
let helpClick = false;
const updateVer = 286;
// require('./lib/log')('MZD-AIO-LOG')
// let output = process.stdout
// let errorOutput = process.stderr
/* TODO: REMOVE LOGS */
/* console.debug("colorfiles: "+hasColorFiles)
console.debug("speedcamfiles: "+hasSpeedCamFiles) */
// console.debug(visits)
/* END LOGS */
// Manage unhandled exceptions as early as possible
process.on('uncaughtException', (e) => {
  console.error(`Caught unhandled exception: ${e}`);
  dialog.showErrorBox('Caught unhandled exception: ' + (`${e}` || 'Unknown error message'), 'You can report this error to aio@mazdatweaks.com\nor open in issue in the repo https://github.com/Trevelopment/MZD-AIO');
  app.quit();
});
export const lang = persistantData.get('lang', 'english');
if (window.location.pathname.includes('joiner')) {
  langPath = `../lang/${lang}.aio.json`;
  langDefault = '../lang/english.aio.json';
  translateSchemas = require('../lang/aio.schema.json');
} else {
  langPath = `${app.getPath('home')}/lang/${lang}.aio.json`;
  langDefault = `${app.getPath('home')}/lang/english.aio.json`;
  translateSchemas = require(`${app.getPath('home')}/lang/aio.schema.json`);
}
export const translateSchema = translateSchemas;
const langObjs = require(langPath);
const langDef = require(langDefault);
export const langObj = _.merge(langDef, langObjs);
/* IDEA FOR AIO BG PICKER
let bg-images = []
fs.readdir('./background-images/', (err, files) => {
files.forEach(file => {
console.debug(file)
bg-images.push('<img src="file">')
})
})
const testFolder = './background-images/'
let bgpics = []
fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    bgpics.push('<img src="'+file+'" alt="" >')
    console.debug(file)
  })
})
*/

function saveMenuLock() {
  persistantData.set('menuLock', !persistantData.get('menuLock'));
  $('body, .hideNav, .w3-overlay').toggleClass('showNav');
}
/* Create Temporary Folder To Hold Images Before Compiling */
if (!fs.existsSync(varDir)) {
  mkdirp.sync(varDir);
}

function helpMessageFreeze(item) {
  $(item).children().toggleClass('w3-show');
}

function runAAPatcher(apk) {
  // require('./assets/js/aapatcher.js')(apk)
}

function runInstallCSApp() {
  require('./assets/js/installCS.js')();
}
/* Clock for Background preview */
function startTime() {
  const today = new Date();
  const h = today.getHours();
  let m = today.getMinutes();
  // let s = today.getSeconds()
  m = checkTime(m);
  // s = checkTime(s)
  $('#clock').html(`${h}:${m}`);
  const t = setTimeout(startTime, 10000);
  formatDateCustom(2);
}

function checkTime(i) {
  if (i < 10) {i = '0' + i;} // add zero in front of numbers < 10
  return i;
}

ipc.on('open-copy-folder', openCopyFolder);

function openCopyFolder() {
  const openCopy = `${persistantData.get('copyFolderLocation', copyFolderLocation)}/_copy_to_usb/`;
  if (!fs.existsSync(openCopy)) {
    mkdirp.sync(openCopy);
  }
  if (!shell.openItem(openCopy)) {
    bootbox.alert({
      message: `"${copyFolderLocation.replace('config', '')}" Does Not Exist.  Click "Start Compilation" to Run The Tweak Builder and Create the _copy_to_usb Folder.`,
    });
  }
}

function openApkFolder() {
  shell.openItem(path.normalize(path.join('file://', __dirname, '../../castscreenApp/')));
}

function openDlFolder() {
  shell.openItem(path.normalize(path.join(app.getPath('userData'), 'color-schemes/')));
}

function openDefaultFolder() {
  shell.openItem(path.normalize(path.join('file://', __dirname, '../background-images/default/')));
}

function autoHelp() {
  $.featherlight('views/autoHelp.htm', {closeSpeed: 500, variant: 'autoHelpBox'});
}

function myStance() {
  ipc.send('reset-window-size');
  // $.featherlight('views/stance.htm', { closeSpeed: 2000, variant: 'myStance', afterClose: updateNotesCallback })
  updateNotesCallback();
}

function announcement() {
  if (persistantData.get('visits', 0) % 20 === 0) {
    showAnnouncement();
  }
}

function dataCheck() {
  persistantData.delete('updateAvailable');
  localStorage.setItem(`dat${updateVer}`, true);
}

function showAnnouncement() {
  if (persistantData.get('anon', false)) {
    $.featherlight(aioURL, {closeSpeed: 1000, variant: 'announcementWindow'});
  }
}

function hideAnnouncement(anonNum) {
  $('.communicationFile').hide();
  $.featherlight.close();
  localStorage.setItem('anoncmnt', anonNum);
}

function anonData(anonNum) {
  localStorage.setItem('anondat', anonNum);
}

function updateNotes() {
  bootbox.hideAll();
  $.get('views/update.htm', function(data) {$('#changelog').html(data);});
  bootbox.dialog({
    title: `<div class='w3-center'>Welcome To MZD-AIO-TI v${app.getVersion()} | MZD All In One Tweaks Installer</div>`,
    message: `<div id='changelog'></div><button id='upVerBtn' style='display:none;font-weight:800;' class='w3-btn w3-hover-green w3-hover-text-black w3-display-bottommiddle' onclick='bootbox.hideAll();'>OK</button><br>`,
    className: 'update-info',
    size: 'large',
    closeButton: true,
  });
  setTimeout(() => {
    $('.modal-dialog').animate({'margin-top': '40px', 'margin-bottom': '60px'}, 3000);
    $('#upVerBtn').fadeIn(5000);
    persistantData.set('updated', true);
  }, 2000);
}

function firstTimeVisit() {
  if (persistantData.get('updateVer', 0) < updateVer) {
    myStance();
    settings.set('reset', true);
    lastView.clear();
    if (persistantData.has('updateVer')) {
      updateNotes();
    }
    persistantData.set('updateVer', updateVer);
    persistantData.set('updated', false);
    persistantData.delete('ver270');
    persistantData.delete('message-502');
    persistantData.delete('message-503');
    persistantData.delete('message-504');
    persistantData.delete('new-update-first-run');
    persistantData.delete('keepBackups');
    persistantData.delete('testBackups');
    persistantData.delete('skipConfirm');
    persistantData.delete('transMsg');
    persistantData.delete('delCopyFolder');
    persistantData.delete('known-issues-58');
    persistantData.delete('known-issues-59');
  } else {
    updateNotesCallback();
  }
}

function updateNotesCallback() {
  if (visits > 0) {
    if (!persistantData.get('updated', false)) {
      updateNotes();
    }
  } else {
    persistantData.set('visits', 1);
    $('body').prepend('<div id="super-overlay" style="z-index:999999;width:9999px;height:9999px;display:block;position:fixed;background:transparent;"></div>');
    const firstTimeMessage = bootbox.dialog({
      title: `<div class='w3-center'>Welcome To MZD-AIO-TI v${app.getVersion()} | MZD All In One Tweaks Installer</div>`,
      message: `<div class='w3-center'><h3>Welcome to the AIO!</h3></div><div class='w3-justify'> <b>All changes happen at your own risk! Please understand that you can damage or brick your infotainment system running these tweaks!  If you are careful, follow all instructions carefully, and heed all warnings, the chances of damaging your system are greatly reduced.<br>For more help, open the <a href='' onclick='helpDropdown()'>Help Panel</a> or visit <a href='https://mazdatweaks.com' class="link">MazdaTweaks.com</a><br><br>I appreciate feedback<br>use the <a href='' onclick='$("#feedback").click()'>feedback link</a> below to let me know what you think.<br><br><a href class='w3-btn w3-blue' onclick='$("#tourBtn").click()'>Take The Tour</a><br></center><br><h2><b>***NOTE: FOR FIRMWARE V59.00.502+*** CAN ONLY INSTALL TWEAKS AFTER <a href="" onclick="externalLink('im-super-serial')" title="By Serial Connection">GAINING ACCESS VIA SERIAL CONNECTION </a><b>.  THEN YOU WILL NEED TO INSTALL THE AUTORUN & RECOVERY SCRIPTS AFTER GAINING SERIAL ACCESS.</h2><br></b></div><div id="first-time-msg-btn" class="w3-center"><img class='loader' src='./files/img/load-0.gif' alt='...' /></div>`,
      closeButton: false,
      className: 'first-time-dialog',
    });
    setTimeout(() => {$('#super-overlay').remove();}, 9000);
    setTimeout(() => {
      $('#first-time-msg-btn').html(`<button id='newVerBtn' style='display:none' class='w3-btn w3-hover-text-light-blue w3-display-bottommiddle' onclick='bootbox.hideAll()'>OK</button><br>`);
      $('#newVerBtn').fadeIn(10000);
    }, 5000);
  }
  dataCheck();
}

function helpDropdown() {
  const x = document.getElementById('helpDrop');
  const y = document.getElementById('helpDropBtn');
  if (!x.className.includes('w3-show')) {
    x.className += ' w3-show';
    y.innerHTML = '<span class=\'icon-x\'></span>';
    document.getElementById('sidenavOverlay').display = 'block';
    if (!helpClick) {
      const myNotification = new Notification('Help', {
        body: 'Visit MazdaTweaks.com for more help',
        icon: 'favicon.ico',
        tag: 'MZD-AIO-TI',
        silent: true,
      });
      myNotification.onclick = () => {
        externalLink('mazdatweaks');
      };
      snackbar(`Visit <a href onclick='externalLink("mazdatweaks")'>MazdaTweaks.com</a> for more help`);
    }
    helpClick = true;
  } else {
    closeHelpDrop();
  }
}

function closeHelpDrop() {
  const x = document.getElementById('helpDrop');
  const y = document.getElementById('helpDropBtn');
  if (x) {
    x.className = x.className.replace(' w3-show', '');
  }
  if (y) {
    y.innerHTML = '<span class=\'icon-cog3\'></span>';
  }
}
// Normal Drop Down Menus
function dropDownMenu(id) {
  const x = document.getElementById(id);
  const y = $('#' + id);
  if (!x.className.includes('w3-show')) {
    $('.w3-dropdown-content').removeClass('w3-show');
    x.className += ' w3-show';
  } else {
    x.className = x.className.replace(' w3-show', '');
  }
  y.on({
    mouseleave: function() {
      y.toggleClass('w3-show');
    },
  });
}

function toggleFullScreen() {
  remote.BrowserWindow.getFocusedWindow().setFullScreen(!remote.BrowserWindow.getFocusedWindow().isFullScreen());
  $('.icon-fullscreen').toggleClass('icon-fullscreen-exit');
}
// Extra Options Togglers
let togg = false;

function toggleOps(x) {
  $(x).toggleClass('icon-plus-square').toggleClass('icon-minus-square');
}

function toggleAllOps() {
  const x = $('.toggleExtra');
  if (togg) {
    $('#alltoggle').addClass('icon-minus-alt').removeClass('icon-plus-alt');
    x.removeClass('icon-plus-square').addClass('icon-minus-square');
  } else {
    $('#alltoggle').removeClass('icon-minus-alt').addClass('icon-plus-alt');
    x.addClass('icon-plus-square').removeClass('icon-minus-square');
  }
  togg = !togg;
}

function externalLink(link) {
  shell.openExternal(`http://trevelopment.win/${link}`);
}

function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

function copyCode(x) {
  $(x).select();
  const copyText = document.execCommand('Copy');
  if (copyText) snackbar('Copied "' + $(x).val() + '" to clipboard');
}

function donate() {
  shell.openExternal('http://trevelopment.win/donate');
}
// Returns list of USB Drives
async function getUSBDrives() {
  const disks = [];
  const dsklst = await drivelist.list();
  drivelist.list(function(error, dsklst) {
    if (error) {
      console.error('Error finding USB drives');
    }
    for (let i = 0; i < dsklst.length; i++) {
      if (!dsklst[i].system) {
        // console.debug(disks[i]);console.debug(disks[i].name);console.debug(disks[i].description)
        disks.push({'name': dsklst[i].name, 'desc': dsklst[i].description, 'mp': dsklst[i].mountpoint});
      }
    }
    return disks;
  });
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  url = url.toLowerCase(); // This is just to avoid case sensitiveness
  name = name.replace(/[[\]]/g, '\\$&').toLowerCase(); // This is just to avoid case sensitiveness for query parameter name
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return ''; // url.substr(url.lastIndexOf('/') + 1)
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function alternateLayout() {
  $('#options, #sidePanel').toggleClass('alt-layout');
}

function secretMenu() {
  $(`<div id="secretMenu" class="w3-card-12 w3-container">
  <header class="w3-container w3-teal">
  <span onclick="$(this).parent().parent().remove()"
  class="w3-closebtn">&times;</span>
  <h2>Secret Menu</h2>
  </header>
  <div class="w3-container">
  <button class="w3-btn w3-red w3-hover-yellow w3-ripple w3-border" onclick="persistantData.delete('lang')">Reset Language Variable</button>
  <button class="w3-btn w3-green w3-hover-indigo w3-ripple w3-border" onclick="$('#instAll').click()">Install All</button>
  <button class="w3-btn w3-deep-orange w3-hover-red w3-ripple w3-border" onclick="$('#uninstAll').click()">Uninstall All</button>
  <button class="w3-btn w3-blue w3-hover-yellow w3-ripple w3-border" onclick="openDlFolder()">Downloaded Files</button>
  </div>
  <footer class="w3-container w3-teal">
  <p>Modal Footer</p>
  </div>`).insertAfter($('#snackbar'));
  $('#secretMenu').fadeOut(10000);
}

function toggleOverDraws() {
  $('.spdConfigInst').click(function() {$('#autorunCheck').toggle();});
}

function writeRotatorVars(imgs) {
  if (imgs > 1) {
    fs.writeFileSync(`${varDir}/bg-rotator.txt`, `BG_STEPS=${imgs}\nBG_SECONDS=${imgs * $('#bgRotatorSeconds').val()}\nBG_SEC_EACH=${$('#bgRotatorSeconds').val()}\nBG_WIDTH=${imgs * 800}`);
  } else {
    fs.writeFileSync(`${varDir}/bg-rotator.txt`, '');
  }
}

function saveAIOLogHTML() {
  const a = document.body.appendChild(document.createElement('a'));
  a.download = 'AIO_Log.html';
  a.href = 'data:text/html,' + document.getElementById('aio-comp-log').innerHTML;
  a.click();
}

function checkForUpdate(ver) {
  $.featherlight(`https://aio.trevelopment.com/update.php?ver=${updateVer}`, {closeSpeed: 100, variant: 'checkForUpdate'});
}

function formatDateCustom(dateFormatType) {
  const currentTime = new Date();
  let dateStr = null;

  // Dissect month (0-11) & day (1-31)
  const month = currentTime.getMonth() + 1;
  const day = currentTime.getDate();

  // numeric date output start
  // comment this block for standard
  const dayStr = ((day < 10) ? ('0' + day) : day);
  const monthStr = ((month < 10) ? ('0' + month) : month);
  // 1 For Date Format dd.mm.
  if (dateFormatType === 1) {
    dateStr = dayStr + '.' + monthStr + '.';
    // $('#date').css({'right':'35px','top':'6px','font-size':'18px'})
  } else if (dateFormatType === 2) {
    dateStr = monthStr + '/' + dayStr;
    // $('#date').css({'right':'35px','top':'6px','font-size':'18px'})
  } else { // if (dateFormatType === 0)
    dateStr = currentTime.toISOString().substring(0, 10);
    // $('#date').css({'right':'35px','top':'6px','font-size':'18px'})
  }
  $('#date').text(dateStr);
}

function getAIOver() {
  return app.getVersion();
}

function showCompatibility() {
  $(`<div id="compatibilityCheck" class="w3-small w3-padding" style="width:100%;max-width:1200px;margin:auto;background:rgba(0,0,0,.8);color:#fff;">
  <header class="w3-container w3-indigo">
  <span onclick="$(this).parent().parent().remove()"
  class="w3-closebtn">&times;</span>
  <h2>Compatibility</h2>
  </header>
  <div class="w3-container">
  <div class="w3-panel w3-center">
  <H2> **AIO IS COMPATIBLE WITH ALL FW V55, V56, V58, V59 AND UP TO V70.00.352** </H2>
  <h3 style="text-transform: capitalize;">NOTE: FW v59.00.502+ <a href="" onclick="externalLink('im-super-serial')">Requires Additional Steps To Install Tweaks.</a>  If updating to v59.00.502+ install Autorun & Recovery Scripts to allow Tweaks to be installed after updating.</h3>
  <h3 style="text-transform: capitalize;">WARNING: FW v70.00.335+ <a href="" onclick="externalLink('id7')">Requires Making A Serial Connection <strong>Before Updating</strong>.</a></h3>
  </div>`).insertAfter($('#mzd-title'));
}
$(function() {
  $('.toggleExtra.1').addClass('icon-plus-square').removeClass('icon-minus-square');
  setTimeout(() => {
    $('#IN21').click(function() {
      snackbar('THERE MAY BE ISSUES REGARDING COMPATIBILITY WITH THIS TWEAK. AFTER INSTALLING, YOUR USB PORTS MAY BECOME UNREADABLE TO THE CMU. <h5>AUTORUN-RECOVERY SCRIPT WILL BE INSTALLED IN CASE RECOVERY BY SD CARD SLOT IS NEEDED TO RECOVER USB FUNCTION</h5>');
    });
    $('#advancedOptions').click(function() {
      $('.advancedOp, #twkOpsTitle').toggle();
      $('.sidePanel').toggleClass('adv');
      if ($('#IN21').prop('checked')) {$('#IN21').click();}
    });
  }, 1000);
  $('body').css('overflow', 'auto');
});

function toggleTips() {
  showSpdHints = !showSpdHints;
  showSpdHints ? $('#SpdOpsTips').slideDown() : $('#SpdOpsTips').slideUp();
}

function numberReplacer(key, value) {
  if (key === 'pos' && value !== null) {
    value = value.toString();
  }
  return value;
}

export const replaceInFile = (someFile: any, toReplace: any, replacement: any, callback?: any) => {
  fs.readFile(someFile, 'utf8', function(err, data) {
    if (err) {
      err = err.toString();
      dialog.showErrorBox('ERROR', err);
      return console.error(err);
    }
    const re = new RegExp(toReplace, 'g');
    const result = data.replace(re, replacement);
    fs.writeFile(someFile, result, 'utf8', function(err) {
      if (err) {
        err = err.toString();
        dialog.showErrorBox('ERROR', err);
        return console.error(err);
      }
      if (typeof callback === 'function') callback();
    });
  });
};

function updateBgModal() {
  $('#infotnmtBG,#modalimg').attr('src', `${getBackground}`);
}
