'use strict'

const isDev = (require('electron-is-dev') || global.appSettings.debug)
const { app, BrowserWindow } = require('electron')
const ipc = require('electron').ipcMain

function sendAction (action) {
  const win = BrowserWindow.getFocusedWindow()
  if (process.platform === 'darwin') {
    win.restore()
  }
  win.webContents.send(action)
}

const viewSubmenu = [
  {
    label: 'Back',
    accelerator: 'CmdOrCtrl+B',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.webContents.goBack()
      }
    }
  },
  {
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: function (item, focusedWindow) {
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
    click () {
      sendAction('zoom-in')
    }
  },
  {
    label: 'Zoom Out',
    id: 'zoom-out',
    accelerator: 'CmdOrCtrl+-',
    enabled: false,
    click () {
      sendAction('zoom-out')
    }
  },
  {
    label: 'Reset Zoom',
    id: 'zoom-actual',
    accelerator: 'CmdOrCtrl+=',
    enabled: false,
    click () {
      sendAction('zoom-actual')
    }
  }
]

var menuTemplate = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    id: 'view',
    submenu: viewSubmenu
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Info',
        click: () => {
          ipc.emit('open-info-window')
        }
      }
    ]
  }
]

// Show Dev Tools menu if running in development
if (isDev) {
  menuTemplate[1].submenu.push({
    type: 'separator'
  })
  menuTemplate[1].submenu.push(
    {
      label: 'Toggle Developer Tools',
      accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.webContents.toggleDevTools()
        }
      }
    }
  )
}

if (process.platform === 'darwin') {
  var name = app.getName()
  menuTemplate.unshift({
    label: name,
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Window menu.
  menuTemplate[3].submenu.push(
    {
      type: 'separator'
    },
    {
      role: 'front'
    }
  )
}

module.exports = menuTemplate
