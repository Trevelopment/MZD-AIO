const electron = require('electron')
const app = electron.app
const globalShortcut = electron.globalShortcut
const ipc = electron.ipcMain
const BrowserWindow = electron.BrowserWindow

app.on('ready', function () {
  globalShortcut.register('CommandOrControl+Alt+K', function () {
    BrowserWindow.fromId(1).webContents.send('start-compile')
  })
  globalShortcut.register('CommandOrControl+Alt+J', function () {
    ipc.emit('open-joiner-window')
  })
  globalShortcut.register('CommandOrControl+Alt+L', function () {
    BrowserWindow.fromId(1).webContents.send('open-translator')
  })
  globalShortcut.register('CommandOrControl+Alt+H', function () {
    BrowserWindow.fromId(1).webContents.send('go-home')
  })
})

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})
