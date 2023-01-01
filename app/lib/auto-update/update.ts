'use strict';

const ipc = require('electron').ipcMain;
const BrowserWindow = require('electron').BrowserWindow;
const Config = require('electron-store');
const persistantData = new Config({'name': 'aio-persist'});

// const os = require('os');
// const platform = os.platform() + '_' + os.arch();
// const {autoUpdater} = require('electron-updater');
import {autoUpdater} from 'electron';

let win = BrowserWindow.fromId(1);

export const update = (options) => {
  /* if (!options.url) {
    console.log('Automatic updates disabled')
    return
  } */
  // var updaterFeedUrl = options.url // + platform + '/' + options.version
  // console.info('Running version %s on platform %s', options.version, platform, " execPAth", process.execPath, "?", process.execPath.match(/[\\\/]electron/), "!", process.execPath.includes('electron'))

  try {
    autoUpdater.checkForUpdates();
  } catch (e) {
    console.error(e.message);
    ipc.emit('update-err', autoUpdater);
    win.webContents.send('update-err');
  }

  autoUpdater.on('error', (e) => {
    console.error(e.message);
    ipc.emit('update-err', autoUpdater);
    win.webContents.send('update-err');
    win.webContents.send('update-not-available');
    persistantData.set('updateAvailable', false);
  });

  autoUpdater.on('checking-for-update', () => {
    console.info('Checking for update...');
    win.webContents.send('checking-updates');
  });

  autoUpdater.on('update-available', () => {
    if (win === null) {
      win = BrowserWindow.getFocusedWindow();
    }
    console.info('Found available update!');
    ipc.emit('update-available-alert', autoUpdater);
    win.webContents.send('update-available-alert');
    persistantData.set('updateAvailable', true);
  });

  autoUpdater.on('update-not-available', () => {
    if (win === null) {
      win = BrowserWindow.getFocusedWindow();
    }
    win.webContents.send('update-not-available');
    console.info('There are no updates available.');
  });

  autoUpdater.on('update-downloaded', () => {
    console.info('Update package downloaded');
    ipc.emit('update-downloaded', autoUpdater);
  });
};
/*
module.export = function AppUpdater () {
const version = app.getVersion()
if (os.platform() === "linux") {
return
}

autoUpdater.addListener("update-available", (event: any) => {
log("A new update is available")
})
autoUpdater.addListener("update-downloaded", (event: any, releaseNotes: string, releaseName: string, releaseDate: string, updateURL: string) => {
notify("A new update is ready to install", `Version ${releaseName} is downloaded and will be automatically installed on Quit`)
log("quitAndInstall")
autoUpdater.quitAndInstall()
return true

})
autoUpdater.addListener("error", (error: any) => {
log(error)
})
autoUpdater.addListener("checking-for-update", (event: any) => {
log("checking-for-update")
})
autoUpdater.addListener("update-not-available", () => {
log("update-not-available")
})

if (platform === "darwin") {
autoUpdater.setFeedURL(`https://${UPDATE_SERVER_HOST}/update/${platform}_${os.arch()}/${version}`)
}

window.webContents.once("did-frame-finish-load", (event: any) => {
autoUpdater.checkForUpdates()
})
}
}
*/
