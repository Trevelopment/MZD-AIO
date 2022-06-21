/* jshint esversion:6, -W033, -W117, -W097, -W116 */
import {BrowserWindow, Menu, MenuItem, app} from 'electron';

const template = [{
  label: 'File',
  submenu: [{
    label: 'Open',
    click: (focusedWindow) => {
      console.log(electron.dialog.showOpenDialog(focusedWindow, {properties: ['openFile', 'openDirectory', 'multiSelections']}));
    },
    accelerator: 'CmdOrCtrl+o',
    role: 'open',
  }, {
    label: 'Save',
    accelerator: 'CmdOrCtrl+S',
    role: 'save',
  }],
},
{
  label: 'Back',
  click: function(item, focusedWindow) {
    if (focusedWindow) {
      focusedWindow.webContents.goBack();
    }
  },
}, {
  label: 'Dev Tools',
  click: function(item, focusedWindow) {
    if (focusedWindow) {
      focusedWindow.toggleDevTools();
    }
  },
}, {
  label: 'AIO',
  click: function() {
    bootbox.alert('Hi! ;-P');
  },
}, {
  label: 'Reload',
  accelerator: 'CmdOrCtrl+R',
  click: function(item, focusedWindow) {
    if (focusedWindow) {
      // on reload, start fresh and close any old
      // open secondary windows
      if (focusedWindow.id === 1) {
        BrowserWindow.getAllWindows().forEach(function(win) {
          if (win.id > 1) {
            win.close();
          }
        });
      }
      focusedWindow.reload();
    }
  },
}, {
  label: 'Window',
  role: 'window',
  submenu: [{
    label: 'Toggle Full Screen',
    accelerator: (function() {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F';
      } else {
        return 'F11';
      }
    })(),
    click: function(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    },
  }, {
    label: 'Minimize',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize',
  }, {
    label: 'Close',
    accelerator: 'CmdOrCtrl+W',
    role: 'close',
  }, {
    type: 'separator',
  }, {
    label: 'Reopen Window',
    accelerator: 'CmdOrCtrl+Shift+T',
    enabled: false,
    key: 'reopenMenuItem',
    click: function() {
      app.emit('activate');
    },
  },
  ]}, {
  label: 'Help',
  role: 'help',
  submenu: [{
    label: 'Learn More',
    click: function() {
      electron.shell.openExternal('http://electron.atom.io');
    },
  }, {
    label: 'MazdaTweaks.com',
    click: function() {
      electron.shell.openExternal('http://link.trevelopment.com/mazdaatweaks');
    },
  }],
}];

function addUpdateMenuItems(items, position) {
  if (process.mas) return;

  const version = electron.app.getVersion();
  const updateItems = [{
    label: `Version ${version}`,
    enabled: false,
  }];

  items.splice([position, 0].concat(updateItems));
}

const findReopenMenuItem = (): MenuItem | undefined => {
  const menu = Menu.getApplicationMenu();
  if (!menu) {
    return;
  }

  const reopenMenuItems: any[] = menu.items.map(function(item) {
    if (item.submenu) {
      item.submenu.items.forEach(function(item) {
        if (item.key === 'reopenMenuItem') {
          return item;
        }
        return undefined;
      });
    }
    return undefined;
  });
  return reopenMenuItems.length === 1 ? reopenMenuItems[0] : undefined;
};

if (process.platform === 'darwin') {
  const name = electron.app.getName();
  template.unshift({
    label: name,
    submenu: [{
      label: `About ${name}`,
      role: 'about',
    }, {
      type: 'separator',
    }, {
      label: 'Services',
      role: 'services',
      submenu: [],
    }, {
      type: 'separator',
    }, {
      label: `Hide ${name}`,
      accelerator: 'Command+H',
      role: 'hide',
    }, {
      label: 'Hide Others',
      accelerator: 'Command+Alt+H',
      role: 'hideothers',
    }, {
      label: 'Show All',
      role: 'unhide',
    }, {
      type: 'separator',
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: function() {
        app.quit();
      },
    }],
  });

  // Window menu.
  template[3].submenu.push({
    type: 'separator',
  }, {
    label: 'Bring All to Front',
    role: 'front',
  });

  addUpdateMenuItems(template[0].submenu, 1);
}

if (process.platform === 'win32') {
  const helpMenu = template[template.length - 1].submenu;
  addUpdateMenuItems(helpMenu, 0);
}

app.on('ready', function() {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on('browser-window-created', function() {
  const reopenMenuItem = findReopenMenuItem();
  if (reopenMenuItem) {
    reopenMenuItem.enabled = false;
  }
});

app.on('window-all-closed', function() {
  const reopenMenuItem = findReopenMenuItem();
  if (reopenMenuItem) {
    reopenMenuItem.enabled = true;
  }
});

/* function oldAIO () {
opn('./AIO/choose.exe').then(() => {
//mainWindow.focus();
});
} */
