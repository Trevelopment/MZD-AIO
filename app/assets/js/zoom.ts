import {ipcRenderer as ipc, webFrame} from 'electron';
import remote from 'electron';
const {Menu} = remote;
const maximumZoomLevel = 3;


let currentZoomLevel: number;
let zoomMenuItems: any[] = [];

function getZoomUI() {
  const menu = Menu.getApplicationMenu() || {};
  const menuItems: any[] = [];
  if (menu) {
    menu.items.forEach((item) => {
      if (item.id === 'view') {
        item.submenu.items.forEach((item) => {
          if (item.id && item.id.match(/^zoom-.*/)) {
            menuItems.push(item);
          }
        });
      }
    });
  }
  return menuItems;
}

function enableZoomUI() {
  zoomMenuItems.forEach((item) => {
    item.enabled = true;
  });
}

function disableZoomUI() {
  zoomMenuItems.forEach((item) => {
    item.enabled = false;
  });
}

window.addEventListener('blur', () => {
  disableZoomUI();
});

window.addEventListener('focus', () => {
  enableZoomUI();
});

window.addEventListener('load', () => {
  currentZoomLevel = webFrame.getZoomLevel();
  zoomMenuItems = getZoomUI();
  enableZoomUI();
});
ipc.on('zoom-actual', (event) => {
  webFrame.setZoomLevel(0);
  currentZoomLevel = webFrame.getZoomLevel();
});
ipc.on('zoom-in', (event) => {
  if (currentZoomLevel < maximumZoomLevel) {
    webFrame.setZoomLevel(currentZoomLevel + 1);
    currentZoomLevel = webFrame.getZoomLevel();
  }
});
ipc.on('zoom-out', (event) => {
  if (currentZoomLevel > 0) {
    webFrame.setZoomLevel(currentZoomLevel - 1);
    currentZoomLevel = webFrame.getZoomLevel();
  }
});
