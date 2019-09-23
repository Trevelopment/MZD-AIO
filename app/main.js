/* ************************************************************************** *\
** ************************************************************************** **
** MZD-AIO-TI                                                                 **
** By: Trezdog44 - Trevor Martin                                              **
** http://mazdatweaks.com                                                     **
** ©2019 Trevelopment                                                         **
**                                                                            **
** main.js - The main process to run in electron.                             **
**                                                                            **
** ************************************************************************** **
\* ************************************************************************** */
/* jshint esversion:8, -W033, -W117, -W097, -W116 */
'use strict'
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const dialog = electron.dialog
const Tray = electron.Tray
const ipc = electron.ipcMain
const nativeImage = electron.nativeImage
const crashReporter = electron.crashReporter
// Manage unhandled exceptions as early as possible
process.on('uncaughtException', (e) => {
  console.error(`Caught unhandled exception: ${e}`)
  dialog.showErrorBox('Caught unhandled exception', e.message || 'Unknown error message')
  app.quit()
})
const windowStateKeeper = require('electron-window-state')
const path = require('path')
const pjson = require('./package.json')
const _ = require('lodash')
const fs = require('fs')
const rimraf = require('rimraf')
const extract = require('extract-zip') // For Unzipping
const drivelist = require('drivelist') // Module that gets the available USB drives
const backgroundDir = path.resolve(path.join(`${__dirname}`, `../background-images/`))
const defaultDir = path.join(backgroundDir, 'default/')
const blankAlbumArtDir = path.join(backgroundDir, 'blank-album-art/')
const Config = require('electron-store')
const persistantData = new Config({ 'name': 'aio-persist' })
const userThemes = new Config({ 'name': 'user-themes' })
const gotTheLock = app.requestSingleInstanceLock()
require('./menus/menu.js') // Menu
require('./menus/context-menu.js')
require('./menus/shortcuts.js')
require('./lib/log')(pjson.productName || 'MZD-AIO-TI')
var hasColorFiles = fs.existsSync(`${app.getPath('userData')}/color-schemes/`)
var hasSpeedCamFiles = fs.existsSync(`${app.getPath('userData')}/speedcam-patch/`)
var iconLoc = path.join(app.getAppPath(), '/icon.icns')
var favicon = './app/icon.icns'
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true
if (process.platform === 'win32') {
  iconLoc = path.join(app.getAppPath(), 'icon.ico')
  favicon = './app/icon.ico'
}
let nimage = nativeImage.createFromPath(iconLoc)

console.log('Locale: ' + persistantData.get('locale'))
if (!persistantData.has('visits')) {
  persistantData.set('visits', 0)
}
// Load build target configuration file
try {
  var config = require('./config.json')
  _.merge(pjson.config, config)
} catch (e) {
  console.warn('No config file loaded, using defaults')
}
const isDev = (require('electron-is-dev') || pjson.config.debug)
global.appSettings = pjson.config
global.pjson = pjson
persistantData.set('AIO-Ver', pjson.version)
crashReporter.start({
  companyName: 'Trevelopment',
  submitURL: 'https://trevelopment.com/crash/bin/mini-breakpad-server',
  uploadToServer: true,
  extra: persistantData.store
})
if (isDev) {
  console.info('Running in development')
  app.setPath('home', path.resolve(`${__dirname}`))
  console.log(`Home: ${app.getPath('home')}`)
  // console.debug(JSON.stringify(pjson))
  console.debug(JSON.stringify(persistantData.store))
  console.debug(JSON.stringify(pjson.config))
} else {
  // console.info('Running in production')
  app.setPath('home', app.getAppPath())
  console.log(`Home: ${app.getPath('home')}`)
}
app.setAppUserModelId('com.trevelopment.mzd-aio-ti')
// Adds debug features like hotkeys for triggering dev tools and reload
// (disabled in production, unless the menu item is displayed)
require('electron-debug')({
  enabled: pjson.config.debug || isDev || false
})
// Prevent window being garbage collected
let mainWindow
// Other windows we may need
let devtools = null
let infoWindow = null
let downloadwin = null
let mailform = null
let tray = null
let imageJoin = null
app.setName(pjson.productName || 'MZD-AIO-TI')

function initialize () {
  if (!persistantData.has('copyFolderLocation')) {
    persistantData.set('copyFolderLocation', app.getPath('desktop'))
  }

  function onClosed () {
    // Dereference used windows
    downloadwin = null
    mailform = null
    mainWindow = null
    infoWindow = null
    imageJoin = null
    app.quit()
  }

  function createMainWindow () {
    let mainWindowState = windowStateKeeper({
      defaultWidth: 1280,
      defaultHeight: 800
    })
    const win = new BrowserWindow({
      'title': app.getName() || 'MZD-AIO-TI | Mazda All In One Tweaks Installer',
      'width': mainWindowState.width,
      'height': mainWindowState.height,
      'x': mainWindowState.x,
      'y': mainWindowState.y,
      'minWidth': 800,
      'minHeight': 650,
      'resizable': true,
      'show': false,
      'icon': favicon,
      'webPreferences': {
        'nodeIntegration': pjson.config.nodeIntegration || true, // Disabling node integration allows to use libraries such as jQuery/React, etc
        'nodeIntegrationInSubFrames': false,
        'preload': path.resolve(path.join(__dirname, 'preload.js'))
      }
    })
    mainWindowState.manage(win)
    // Remove file:// if you need to load http URLs
    win.loadURL(`file://${__dirname}/${pjson.config.url}`, {})
    win.on('closed', onClosed)
    win.on('unresponsive', function () {
      var unresponsiveClose = dialog.showMessageBox({
        type: 'warning',
        title: 'Unresponsive',
        detail: '',
        message: 'MZD-AIO-TI is unresponsive, would you like to close the app?',
        buttons: ['Close', 'Wait'],
        defaultId: 0,
        cancelId: 1
      })
      if (unresponsiveClose === 0) {
        win.close()
        app.quit()
      }
    })
    if (!isDev) {
      win.setMenuBarVisibility(false)
    }
    win.webContents.on('did-fail-load', (error, errorCode, errorDescription) => {
      var errorMessage
      if (errorCode === -105) {
        errorMessage = errorDescription || '[Connection Error] The host name could not be resolved, check your network connection'
        console.log(errorMessage)
      } else {
        errorMessage = error + ' ' + errorCode + ' - ' + (errorDescription || 'Unknown error')
      }
      error.sender.loadURL(`file://${__dirname}/views/404.html`)
      win.webContents.on('did-finish-load', () => {
        win.webContents.send('app-error', errorMessage)
      })
    })
    win.webContents.on('crashed', () => {
      // In the real world you should display a box and do something
      dialog.showErrorBox('MZD-AIO-TI has crashed', 'MZD-AIO-TI ERROR')
      console.error('The window has just crashed')
    })
    win.webContents.on('did-finish-load', () => {})
    win.on('ready-to-show', () => {
      win.show()
      win.focus()
    })

    function setCopyLoc (loc) {
      persistantData.set('copyFolderLocation', app.getPath(loc))
      win.webContents.send('set-copy-loc', app.getPath(loc))
      console.log(`Copy_to_usb: ${persistantData.get('copyFolderLocation')}`)
    }
    console.log(`Copy_to_usb: ${persistantData.get('copyFolderLocation')}`)
    if (process.platform === 'win32') {
      tray = new Tray(nimage)
      var template = [{
        label: 'Location of _copy_to_usb',
        submenu: [
            { label: 'Desktop', id: 'desktop', type: 'radio', checked: persistantData.get('copyFolderLocation').includes('Desktop'), click: function (menuItem, browserWindow, event) { setCopyLoc('desktop') } },
            { label: 'Downloads', id: 'downloads', type: 'radio', checked: persistantData.get('copyFolderLocation').includes('Downloads'), click: function (menuItem, browserWindow, event) { setCopyLoc('downloads') } },
            { label: 'Documents', id: 'documents', type: 'radio', checked: persistantData.get('copyFolderLocation').includes('Documents'), click: function (menuItem, browserWindow, event) { setCopyLoc('documents') } }
        ]
      },
        { type: 'separator' },
        { label: 'Open _copy_to_usb Folder', click: function () { win.webContents.send('open-copy-folder') } },
      {
        label: 'Delete _copy_to_usb Folder',
        type: 'normal',
        click: function (menuItem, browserWindow, event) {
          rimraf(path.normalize(path.join(persistantData.get('copyFolderLocation'), '_copy_to_usb')), function (e) {
            if (e) {
              console.error(e.message)
              dialog.showErrorBox(`Error Deleting ${path.normalize(path.join(persistantData.get('copyFolderLocation'), '_copy_to_usb'))}`, `${e.message}`)
            } else {
              console.log(`Deleted ${path.normalize(path.join(persistantData.get('copyFolderLocation'), '_copy_to_usb'))}`)
              win.webContents.send('snackbar-msg', `Deleted ${path.normalize(path.join(persistantData.get('copyFolderLocation'), '_copy_to_usb'))}`)
            }
          })
        }
      },
        { type: 'separator' },
        { label: 'Fullscreen', click: function () { win.setFullScreen(!win.isFullScreen()) } },
        { label: 'Close', role: 'close', click: function () { win.close() } }
      ]
      var trayMenu = Menu.buildFromTemplate(template)
      tray.setToolTip('MZD-AIO-TI')
      tray.setContextMenu(trayMenu)
      tray.on('click', () => {
        win.isVisible() ? win.hide() : win.show()
      })
      tray.on('double-click', () => {
        win.setFullScreen(win.isVisible())
      })
    }
    // if (isDev) {
    //   devtools = new BrowserWindow()
    //   win.webContents.setDevToolsWebContents(devtools.webContents)
    //   win.webContents.openDevTools({ mode: 'detach' })
    // }
    return win
  }
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  app.on('activate', () => {
    if (!mainWindow) {
      mainWindow = createMainWindow()
    }
  })
  app.on('ready', () => {
    if (!mainWindow) {
      mainWindow = createMainWindow()
    }
    makeSingleInstance(gotTheLock)
    persistantData.set('locale', app.getLocale())
    if (persistantData.get('locale', 'unknown').includes('en-US') && persistantData.get('visits', 0) > 250) {
      if (!persistantData.get('Diehard', false) || persistantData.get('visits', 0) > 500) {
        persistantData.set('checkMeter', true)
        persistantData.set('Diehard', true)
      }
    }
    if (!persistantData.has('menuLock')) {
      persistantData.set('menuLock', true)
    }
    // Manage automatic updates
    try {
      if (!process.execPath.includes('electron')) { // match(/[\\\/]electron/)) {
        require('./lib/auto-update/update.js')({
          url: (pjson.config.update) ? pjson.config.update.url || false : false,
          version: app.getVersion()
        })
        ipc.on('update-downloaded', (autoUpdater) => {
          // Elegant solution: display unobtrusive notification messages
          mainWindow.webContents.send('update-downloaded')
          ipc.on('update-and-restart', () => {
            autoUpdater.quitAndInstall()
          })
        })
      }
    } catch (e) {
      console.error(e.message)
      dialog.showErrorBox('Update Error', e.message)
    }
    try {
      getUSBDrives()
    } catch (e) {
      console.error(`Could not find USB Drives ${e.message}`)
    }
  })
  app.on('will-quit', () => {})
  app.on('before-quit', () => {
    var v = Number(persistantData.get('visits')) + 1
    // save some persistant data
    persistantData.set('visits', v)
  })
  app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, url, frameName, disposition, options) => {
      // event.preventDefault()
      if(options.webPreferences) {
        options.webPreferences.nodeIntegration = false
        //console.dir(options.webPreferences)
        //console.dir(event)
        //console.log(url)
        //console.log(disposition)
        //console.log(frameName)
        //console.dir(options)
      }
    })
  })
  ipc.on('reset-window-size', () => {
    mainWindow.setSize(1280, 800)
    mainWindow.center()
  })
  ipc.on('open-info-window', () => {
    if (infoWindow) {
      return
    }
    infoWindow = new BrowserWindow({
      width: 600,
      height: 600,
      icon: favicon,
      resizable: false
    })
    infoWindow.loadURL(`file://${__dirname}/views/info.html`)
    infoWindow.on('closed', () => {
      infoWindow = null
    })
  })
  // Triggers ImageJoiner Window
  ipc.on('open-joiner-window', () => {
    var previewClose = false
    if (imageJoin) {
      imageJoin.show()
      return
    }
    imageJoin = new BrowserWindow({
      width: 1600,
      height: 600,
      minWidth: 1450,
      minHeight: 500,
      modal: true,
      icon: favicon,
      title: 'Join Images Together to Create a Your Rotating Background Images',
      autoHideMenuBar: true,
      parent: mainWindow,
      resizable: true,
      'webPreferences': {
        'nodeIntegration': pjson.config.nodeIntegration || true,
        'preload': path.resolve(path.join(__dirname, 'preload.js'))
      }
    })
    imageJoin.loadURL(`file://${__dirname}/views/joiner.html#joiner`)
    imageJoin.on('did-finish-load', () => {})
    ipc.on('bg-prev', () => {
      previewClose = true
    })
    // Update the background preview in the Main Window on joiner Window close
    imageJoin.on('closed', () => {
      mainWindow.webContents.send('set-bg', previewClose)
      imageJoin = null
    })
  })
}
// Make this app a single instance app.
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
function makeSingleInstance (lock) {
  if (!lock) {
    console.warn('Single Instance App - Quit')
    app.quit()
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) { mainWindow.restore() }
        mainWindow.focus()
      }
    })
  }
}

async function getUSBDrives () {
  var disks = []
  var dsklst = await drivelist.list()
  var aioInfo
  var aioBkups = []
  var aioJSON = null
  if (typeof dsklst !== 'undefined') {
    dsklst.forEach((drive) => {
      var sizeGB = Math.round(drive.size / 100000000) / 10
      if (!drive.system && drive.mountpoints[0]) {
        console.log(`Raw: ${drive.raw}\n Mountpoint: ${drive.mountpoints[0].path}\n Description: ${drive.description}\n Size: ${sizeGB}GB`)
        disks.push({ 'desc': drive.description, 'mp': drive.mountpoints[0].path })
      }
    })
    if (typeof disks !== 'undefined' && disks.length) {
      disks.forEach((drive) => {
        try {
          if (fs.existsSync(`${drive.mp}/AIO_info.json`)) {
            console.log(`Found AIO_info.json on USB Drive - ${drive.mp} ${drive.desc}`)
            aioJSON = fs.readFileSync(`${drive.mp}/AIO_info.json`)
          }
        } catch (e) {
          console.dir(e)
          dialog.showErrorBox('USB DRIVE ERROR', `Error reading from ${drive.mp} ${drive.desc}: ${e.toString()}.  Data on the device might be corrupt.`)
        }
      })
    }
    if (aioJSON) {
      try {
        aioInfo = JSON.parse(aioJSON)
        aioBkups = aioInfo.Backups
        console.log(aioBkups)
        /* console.log(`FW_VER: ${aioInfo.info.CMU_SW_VER}`)
        console.log(`AIO_VER: ${aioInfo.info.AIO_VER}`) */
        persistantData.set('FW', aioInfo.info.CMU_SW_VER)
        persistantData.set('last_aio', aioInfo.info.AIO_VER)
        // _.pullAll(aioBkups)
        if (mainWindow) {
          mainWindow.webContents.send('aio-info')
        }
      } catch (e) { console.error(e.toString()) }
    }
  }
}
/* function createMenu () {
  return Menu.buildFromTemplate(require('./lib/menu'))
} */
// Manage Squirrel startup event (Windows)
// require('./lib/auto-update/startup')(initialize)

ipc.on('open-file-bg', function (event) {
  openBGFolder(backgroundDir, event)
})
ipc.on('open-file-default', function (event) {
  event.sender.send('selected-bg', defaultDir + 'default.png')
  // openBGFolder(defaultDir, event)
})

function openBGFolder (path, event) {
  dialog.showOpenDialog({
    title: 'MZD-AIO-TI | Background Image Will Be Resized To: 800 px X 480 px and converted to png format.',
    properties: ['openFile'],
    defaultPath: path,
    filters: [
      { name: 'Background Image', extensions: ['png', 'jpg', 'jpeg'] }
    ]
  }, function (files) {
    if (files) { event.sender.send('selected-bg', files) }
  })
}
ipc.on('open-offscreen-bg', function (event) {
  dialog.showOpenDialog({
    title: 'MZD-AIO-TI | Off Screen Background Image Will Be Resized To: 800 px X 480 px and converted to png format.',
    properties: ['openFile'],
    defaultPath: backgroundDir,
    filters: [
      { name: 'Off Screen Background Image', extensions: ['png', 'jpg', 'jpeg'] }
    ]
  }, function (files) {
    if (files) { event.sender.send('selected-offscreen-bg', files) }
  })
})
ipc.on('open-offscreen-default', function (event) {
  event.sender.send('selected-offscreen-bg', defaultDir + 'OffScreenBackground.png')
})
ipc.on('default-blnk-art', function (event) {
  event.sender.send('selected-album-art', blankAlbumArtDir + 'no_artwork_icon.png')
})
ipc.on('transparent-blnk-art', function (event) {
  event.sender.send('selected-album-art', blankAlbumArtDir + 'no_artwork_icon_blank.png')
})
ipc.on('open-file-blnk-art', function (event) {
  dialog.showOpenDialog({
    title: 'MZD-AIO-TI | Blank Album Art Image Will Be Resized To: 146 px X 146 px and converted to png format.',
    properties: ['openFile'],
    defaultPath: blankAlbumArtDir,
    filters: [
      { name: 'Blank Album Art', extensions: ['png', 'jpg', 'jpeg'] }
    ]
  }, function (files) {
    if (files) { event.sender.send('selected-album-art', files) }
  })
})
ipc.on('bg-no-resize', (event, arg) => {
  dialog.showOpenDialog({
    title: 'MZD-AIO-TI | Choose A Joined Background (Will Not Be Resized).',
    properties: ['openFile'],
    filters: [
      { name: 'Background Image', extensions: ['png', 'jpg', 'jpeg'] }
    ]
  }, function (files) {
    if (files) {
      event.sender.send('selected-joined-bg', files)
    }
  })
})
ipc.on('theme-jci', function (event) {
  openThemeDialog(event)
})

function openThemeDialog (event) {
  dialog.showOpenDialog({
    title: 'MZD-AIO-TI | Choose The JCI Folder From Any Theme Package.',
    properties: ['openDirectory']
  }, function (files) {
    if (files) {
      event.sender.send('custom-theme', files)
    } else {
      console.log('No Folder Selected')
    }
  })
}
// ***********************************  TODO: fix this      *********************
ipc.on('download-aio-files', (event, arg) => {
  var fileName = `${arg}`
  var alreadyDownloaded = false
  if (`${fileName}` === 'color-schemes') {
    alreadyDownloaded = hasColorFiles
    hasColorFiles = true
  } else if (`${fileName}` === 'speedcam-patch') {
    alreadyDownloaded = hasSpeedCamFiles
    hasSpeedCamFiles = true
  }
  if (alreadyDownloaded) {
    mainWindow.webContents.send('already-downloaded')
  } else {
    // ipc.emit('resume-dl') //TODO: see if this works
    downloadZip(`${fileName}`)
  }
  ipc.once('resume-dl', (event) => {
    downloadZip(`${fileName}`)
  })

  function downloadZip (arg) {
    downloadwin = new BrowserWindow({
      show: false,
      frame: false,
      focusable: false,
      'webPreferences': {
        'nodeIntegration': false
      }
    })
    resetDL()
    downloadwin.loadURL(path.join('http://trevelopment.win', `${arg}`))
    downloadwin.on('closed', () => {
      downloadwin = null
    })
  }

  function resetDL () {
    downloadwin.webContents.session.once('will-download', (event, item, webContents) => {
      // fileSize = (typeof fileSize === 'undefined') ? item.getTotalBytes() : fileSize;
      // Set the save path, making Electron not to prompt a save dialog.
      var fileName = item.getFilename()
      item.setSavePath(`${app.getPath('temp')}/${fileName}`)
      var savePath = item.getSavePath()
      /*   ******         TODO:See if I need this or not maybe just need for testing          ***** */
      if (fs.existsSync(`${savePath}`)) {
        console.log(`${path.resolve(savePath)} Already Exists`)
        item.cancel()
        extract(`${savePath}`, { dir: `${app.getPath('userData')}` }, function (err) {
          if (err) { console.error(err) }
          fs.unlinkSync(`${savePath}`)
          console.log(`${fileName} unzipped & deleted`)
          mainWindow.webContents.send('notif-progress', `<h3>${fileName} Unzipped</h3>`)
        })
      }
      /* *** END *** */
      var fileSize = 107
      if (`${fileName}` === 'speedcam-patch.zip') { fileSize += 80 }
      // var totalSize = parseInt(`${item.getTotalBytes()}`/1000000)
      item.on('updated', function (event, state) {
        if (state === 'interrupted') {
          mainWindow.webContents.send('notif-progress', 'Download interrupted. Please try again.')
          console.log('Download is interrupted, canceling')
          item.cancel()
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused')
          } else {
            mainWindow.webContents.send('dl-progress', `${item.getReceivedBytes()}` / 1000000, `${fileName}`, `${fileSize}`)
            console.log(`Received bytes: ${item.getReceivedBytes()}`)
          }
        }
      })
      item.once('done', (event, state) => {
        if (state === 'completed') {
          console.log(`${savePath} Downloaded successfully`)
          extract(`${savePath}`, { dir: `${app.getPath('userData')}` }, function (err) {
            if (err) { console.error(err) }
            fs.unlinkSync(`${savePath}`)
            console.log(`${fileName} unzipped & deleted`)
            mainWindow.webContents.send('notif-progress', `<h3>${fileName} Unzipped</h3>`)
            mainWindow.webContents.send('downzip-complete')
          })
        } else if (state === 'cancelled') {
          console.log(`${fileName} Download Cancelled.`)
          if (fs.existsSync(`${savePath}`)) {
            fs.rmdirSync(`${savePath}`)
          }
          mainWindow.webContents.send('notif-progress', `<h3>${fileName} Download Cancelled.</h3>`)
        } else {
          mainWindow.webContents.send('notif-progress', `<h3>${fileName} Download failed! Try Again.<br>${state}</h3>`)
          console.log(`${fileName} Download failed: ${state}`)
        }
      })
    })
  }
})
initialize()
