/* jshint esversion:6, -W033, -W117, -W097, -W116 */
/**
 * Creates a default menu for electron apps
 *
 * @param {Object} app electron.app
 * @param {Object} shell electron.shell
 * @returns {Object}  a menu object to be passed to electron.Menu
 */
const electron = require('electron')
const { BrowserWindow, Menu, app, shell } = electron
const ipc = electron.ipcMain

function sendAction(action) {
  const win = BrowserWindow.getFocusedWindow()
  if (process.platform === 'darwin') {
    win.restore()
  }
  win.webContents.send(action)
}
const viewSubmenu = [{
    label: 'Back',
    accelerator: 'CmdOrCtrl+B',
    click: function(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.webContents.goBack()
      }
    }
  },
  {
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: function(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.reload()
      }
    }
  },
  {
    type: 'separator'
  },
  {
    role: 'togglefullscreen'
  },
  {
    label: 'Zoom In',
    id: 'zoom-in',
    accelerator: 'CmdOrCtrl+Plus',
    enabled: false,
    click() {
      sendAction('zoom-in')
    }
  }, {
    label: 'Zoom Out',
    id: 'zoom-out',
    accelerator: 'CmdOrCtrl+-',
    enabled: false,
    click() {
      sendAction('zoom-out')
    }
  }, {
    label: 'Reset Zoom',
    id: 'zoom-actual',
    accelerator: 'CmdOrCtrl+=',
    enabled: false,
    click() {
      sendAction('zoom-actual')
    }
  }
]

let template = [{
    label: 'File',
    submenu: [{
        label: 'Save',
        accelerator: 'CmdOrCtrl+s',
        role: 'save',
        click: function(item, focusedWindow) {
          sendAction('save-options')
        }
      },
      {
        label: 'Load',
        accelerator: 'CmdOrCtrl+l',
        role: 'load',
        click: function(item, focusedWindow) {
          sendAction('load-options')
        }

      },
      {
        label: 'Load Last Compile',
        accelerator: 'CmdOrCtrl+Shift+L',
        role: 'load',
        click: function(item, focusedWindow) {
          sendAction('load-last')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      },
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [{
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: function(item, focusedWindow) {
        if (focusedWindow)
          focusedWindow.reload();
      }
    }, {
      label: 'Full Screen',
      accelerator: (function() {
        if (process.platform === 'darwin')
          return 'Ctrl+Command+F';
        else
          return 'F11';
      })(),
      click: function(item, focusedWindow) {
        if (focusedWindow)
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    }, {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    }]
  },
  {
    label: 'Zoom',
    role: 'zoom',
    submenu: [{
        label: 'Reset Zoom',
        accelerator: '=',
        role: "resetzoom"
      },
      {
        label: 'Zoom In',
        accelerator: 'Plus',
        role: "zoomin"
      },
      {
        label: 'Zoom Out',
        accelerator: '-',
        role: "zoomout"
      }
    ]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      /*  {
      label: 'Info',
      click: () => {
      ipc.emit('open-info-window')
    }
  },*/
      {
        label: 'Learn More: MazdaTweaks.com',
        click: function() { shell.openExternal('http://aio.trevelopment.win/mazdatweaks') }
      },
      {
        label: 'Forum: Mazda3Revolution.com',
        click: function() { shell.openExternal('http://aio.trevelopment.win/mazda3revolution') }
      }
    ]
  },
  /*{
    label: 'Back',
    accelerator: 'CmdOrCtrl+B',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.webContents.goBack()
      }
    }
  },
  {
    label: 'Close',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  },*/
  {
    label: 'Quit',
    accelerator: 'CmdOrCtrl+Q',
    role: 'quit'
  }
];
/*if (process.platform === 'darwin') {
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() { app.quit(); }
      },
    ]
  });
  const windowMenu = template.find(function(m) { return m.role === 'window' })
  if (windowMenu) {
    windowMenu.submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      });
    }
  }*/
app.on('ready', function() {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  return template;
})
/*
  app.on('browser-window-created', function () {
  let reopenMenuItem = findReopenMenuItem()
  if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('window-all-closed', function () {
let reopenMenuItem = findReopenMenuItem()
if (reopenMenuItem) reopenMenuItem.enabled = true
})*/
