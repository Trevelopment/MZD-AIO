const electron = require('electron')
const ipc = electron.ipcRenderer
const webFrame = electron.webFrame
const maximumZoomLevel = 3

const {Menu} = electron.remote

var currentZoomLevel, zoomMenuItems

function getZoomUI () {
  const menu = Menu.getApplicationMenu()
  var menuItems = []
  menu.items.forEach((item) => {
    if (item.id === 'view') {
      item.submenu.items.forEach((item) => {
        if (item.id && item.id.match(/^zoom-.*/)) {
          menuItems.push(item)
        }
      })
    }
  })
  return menuItems
}

function enableZoomUI () {
  zoomMenuItems.forEach((item) => {
    item.enabled = true
  })
}

function disableZoomUI () {
  zoomMenuItems.forEach((item) => {
    item.enabled = false
  })
}

window.addEventListener('blur', () => {
  disableZoomUI()
})

window.addEventListener('focus', () => {
  enableZoomUI()
})

window.addEventListener('load', () => {
  currentZoomLevel = webFrame.getZoomLevel()
  zoomMenuItems = getZoomUI()
  enableZoomUI()
})
ipc.on('zoom-actual', (event) => {
  currentZoomLevel = webFrame.setZoomLevel(0)
})
ipc.on('zoom-in', (event) => {
  if (currentZoomLevel < maximumZoomLevel) {
    currentZoomLevel = webFrame.setZoomLevel(currentZoomLevel + 1)
  }
})
ipc.on('zoom-out', (event) => {
  if (currentZoomLevel > 0) {
    currentZoomLevel = webFrame.setZoomLevel(currentZoomLevel - 1)
  }
})
