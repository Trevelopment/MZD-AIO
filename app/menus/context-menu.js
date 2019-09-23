/* jshint esversion:6, -W033, -W117, -W097, -W116 */
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const app = electron.app

const menu = new Menu()
require('electron-context-menu')({
  window: BrowserWindow.fromId(1),
  append: params => [
    { type: 'separator' },
    {
      label: 'Full Screen',
      accelerator: (function () {
        if (process.platform === 'darwin') { return 'Ctrl+Command+F' } else { return 'F11' }
      })(),
      click: function (item, focusedWindow) { if (focusedWindow) focusedWindow.setFullScreen(!focusedWindow.isFullScreen()) }
    },
    { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
    { type: 'separator' },
    { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomin' },
    { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomout' },
    { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+=', role: 'resetzoom' },
    { type: 'separator' },
    { label: 'Save', accelerator: 'CmdOrCtrl+s', click: function (item, focusedWindow) { focusedWindow.webContents.send('save-options') } },
    { label: 'Load', accelerator: 'CmdOrCtrl+l', click: function (item, focusedWindow) { focusedWindow.webContents.send('load-options') } },
    { label: 'Load Last Compile', accelerator: 'CmdOrCtrl+Shift+L', click: function (item, focusedWindow) { focusedWindow.webContents.send('load-last') } },
    { type: 'separator' },
    { label: 'Reload View', accelerator: 'CmdOrCtrl+R', role: 'reload' }, // , click: function (item, focusedWindow) {if (focusedWindow) focusedWindow.reload()}},
    { label: 'Quit', accelerator: 'CmdOrCtrl+Q', role: 'quit' } // , click: function (item, focusedWindow) {if (focusedWindow) focusedWindow.close()}
  ]
  // prepend: params => [{}]
})
/*
app.on('browser-window-created', function (event, win) {
win.webContents.on('context-menu', function (e, params) {
menu.popup(win, params.x, params.y)
})
})

ipc.on('show-context-menu', function (event) {
const win = BrowserWindow.fromWebContents(event.sender)
menu.popup(win)
}) */
