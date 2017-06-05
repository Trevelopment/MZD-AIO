'use strict'

/**
 * Redirects default log functions
 *
 * On Mac   => ~/Library/Logs/[AppName-WithoutSpaces|Electron].log
 * On Win   => C:\Users\[UserName]\AppData\Local\[AppName-WithoutSpaces|Electron].log
 * On Linux => ~/.[AppName-WithoutSpaces|Electron].log
 */

const os = require('os')
const fs = require('fs')
const path = require('path')
const isDev = require('electron-is-dev')

// Set default output streams (STDOUT/STDERR) and an empty log file path
var output = process.stdout
var errorOutput = process.stderr
var logFile = null

module.exports = (logFileName) => {
  switch (os.platform()) {
    case 'darwin':
      logFile = path.join(os.homedir(), 'Library/Logs', (logFileName || 'Electron').replace(' ', '') + '.log')
      break
    case 'win32':
      logFile = path.join(os.homedir(), 'AppData', 'Local', (logFileName || 'Electron').replace(' ', '') + '.log')
      break
    case 'linux':
      logFile = path.join(os.homedir(), '.' + (logFileName || 'Electron').replace(' ', '') + '.log')
      break
    default:
      // Others: leave untouched
  }

  // If we are in production and a log file is defined we redirect logs to that file
  if (!isDev && logFile) {
    output = fs.createWriteStream(logFile)
    errorOutput = fs.createWriteStream(logFile)
  }

  // Create common logger
  const logger = new console.Console(output, errorOutput)

  // Override default log utilities
  console.log = function () {
    arguments[0] = new Date().toISOString() + ' - ' + arguments[0]
    logger.log.apply(null, arguments)
  }

  console.debug = function () {
    arguments[0] = new Date().toISOString() + ' - <Debug> ' + arguments[0]
    if (isDev || (global.appSettings && global.appSettings.debug)) {
      logger.log.apply(null, arguments)
    }
  }

  console.info = function () {
    arguments[0] = new Date().toISOString() + ' - <Info> ' + arguments[0]
    logger.log.apply(null, arguments)
  }

  console.warn = function () {
    arguments[0] = new Date().toISOString() + ' - <Warning> ' + arguments[0]
    logger.log.apply(null, arguments)
  }

  console.error = function () {
    arguments[0] = new Date().toISOString() + ' - <Error> ' + arguments[0]
    logger.log.apply(null, arguments)
  }
}
