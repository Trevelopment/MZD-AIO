const electron = require('electron')
const ipc = electron.ipcRenderer

// Request printer list on load
window.addEventListener('load', () => {
  window.printers = []
  ipc.send('list-printers')
})

// Send printer events
function printTXTTest (i) {
  console.log('Printing TXT test on', window.printers[i].name)
  ipc.send('print-txt-test', window.printers[i])
}

function printPDFTest (i) {
  console.log('Printing PDF test on', window.printers[i].name)
  ipc.send('print-pdf-test', window.printers[i])
}

// Manage printer events
ipc.on('printing-error', (event, error) => {
  console.log('Printing Error: ', error)
  window.alert('Error while printing, see log for details')
})

ipc.on('printing-success', (event) => {
  console.log('Printing Complete')
  window.alert('Printing Complete')
})

// Display printer list
ipc.on('printer-list', (event, printers) => {
  // Make the printers box visible, if present
  var printersListBox = document.getElementsByClassName('printer-list')
  if (printersListBox.length === 0) {
    return
  }
  printersListBox[0].className += ' printer-list-active'

  var html = '<p>No printers found.</p>'

  // Get printers data
  if (printers.length > 0) {
    window.printers = printers
    html = '<ul>'
    printers.forEach(function (device, i) {
      var isDefault = (device.isDefault) ? ' <small>(default)</small>' : ''
      var deviceName = (device.options && device.options['printer-info']) ? device.options['printer-info'] : device.name
      var buttons = `<button class="printTXTTest" data-printer="${i}">Print TXT Test</button>&nbsp;<button class="printPDFTest" data-printer="${i}">Print PDF Test</button>`
      if (process.platform === 'win32') {
        buttons = ''
      }
      html += `<li>${deviceName}${isDefault} ${buttons}</li>`
    })
    html += '</ul>'
  }
  var printerList = document.getElementById('printers')
  printerList.innerHTML = html

  // Add buttons handlers
  var printTXTTestButtons = printerList.getElementsByClassName('printTXTTest')
  for (var i = 0; i < printTXTTestButtons.length; i++) {
    printTXTTestButtons[i].addEventListener('click', (event) => {
      var device = event.target.getAttribute('data-printer') || null
      if (device) {
        printTXTTest(device)
      }
    })
  }

  var printPDFTestButtons = printerList.getElementsByClassName('printPDFTest')
  for (i = 0; i < printPDFTestButtons.length; i++) {
    printPDFTestButtons[i].addEventListener('click', (event) => {
      var device = event.target.getAttribute('data-printer') || null
      if (device) {
        printPDFTest(device)
      }
    })
  }
})
