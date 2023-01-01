import {app, globalShortcut, ipcMain as ipc, BrowserWindow} from 'electron';

app.on('ready', () => {
  globalShortcut.register('CommandOrControl+Alt+K', () => {
    BrowserWindow.fromId(1).webContents.send('start-compile');
  });
  globalShortcut.register('CommandOrControl+Alt+J', () => {
    ipc.emit('open-joiner-window');
  });
  globalShortcut.register('CommandOrControl+Alt+L', () => {
    BrowserWindow.fromId(1).webContents.send('open-translator');
  });
  globalShortcut.register('CommandOrControl+Alt+H', () => {
    BrowserWindow.fromId(1).webContents.send('go-home');
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
