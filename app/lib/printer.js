'use strict'

const np = require('printer')
const fs = require('fs')
const path = require('path')

const ipc = require('electron').ipcMain

// Manage renderer requests
ipc.on('list-printers', (event) => {
  event.sender.send('printer-list', listPrinters())
})

ipc.on('print-txt-test', (event, device) => {
  printTXTTest(device, (err, jobID) => {
    if (err) {
      event.sender.send('printing-error', err)
    } else {
      event.sender.send('printing-success', jobID)
    }
  })
})

ipc.on('print-pdf-test', (event, device) => {
  printPDFTest(device, (err, jobID) => {
    if (err) {
      event.sender.send('printing-error', err)
    } else {
      event.sender.send('printing-success', jobID)
    }
  })
})

function listPrinters () {
  return np.getPrinters()
}

/**
 * Sync Copy the given file to a temp path
 * Returns the destination tmp file
 */
function copyToTemp (filePath) {
  var tempDir = require('os').tmpdir()
  var destFile = path.join(tempDir, path.basename(filePath))
  var srcData = fs.readFileSync(filePath)
  fs.writeFileSync(destFile, srcData)
  return destFile
}

function printTXTTest (device, callback) {
  var filename = copyToTemp(path.resolve(path.join(__dirname, '../assets/printer/test.txt')))
  console.info('Printing TXT test page', device)
  console.debug('Platform:', process.platform)
  console.debug('Trying to print file: ' + filename)

  if (process.platform !== 'win32') {
    np.printFile({filename: filename,
      printer: device.name,
      success: function (jobID) {
        console.info('Job sent to printer with ID: ' + jobID)
        return callback(null, jobID)
      },
      error: function (err) {
        console.error(err)
        return callback(err)
      }
    })
  } else {
    // not yet implemented, use printDirect and text
    return callback('Sorry, printing not supported on Windows :(')
  }
}

function printPDFTest (device, callback) {
  var filename = path.resolve(path.join(__dirname, '../assets/printer/test.pdf'))
  console.info('Printing PDF test page', device)
  console.debug('Platform:', process.platform)
  console.debug('Trying to print file: ' + filename)

  if (process.platform === 'win32') {
    return callback('Sorry, printing not supported on Windows :(')
  }
  fs.readFile(filename, function (err, data) {
    if (err) {
      console.error('Err:' + err)
      return callback(err)
    }
    console.debug('Data type is: ' + typeof (data) + ', is buffer: ' + Buffer.isBuffer(data))
    np.printDirect({
      printer: device.name,
      data: data,
      type: 'PDF',
      success: function (jobID) {
        console.info('Printed with id ' + jobID)
        return callback(null, jobID)
      },
      error: function (err) {
        console.error('Error on printing: ' + err)
        return callback(err)
      }
    })
  })
}

module.exports = {
  listPrinters: listPrinters,
  printTXTTest: printTXTTest,
  printPDFTest: printPDFTest
}
