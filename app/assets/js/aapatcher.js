/* jshint esversion:6, -W117 */
'use strict'

const path = require('path')
const cp = require('child_process')
const remote = require('electron').remote
const app = remote.app
const dialog = remote.dialog
const isDev = require('electron-is-dev')
const aaPatchPath = path.resolve((isDev ? path.resolve(`${__dirname}`, "../../") : path.dirname(process.execPath)), 'resources/adb/')
const aaPatcher = path.join(aaPatchPath, "adb.exe")
var apk2Patch = null

// Run AA+Patcher
module.exports = function AAPatcher(apk, done) {
  apk2Patch = (apk) ? path.join(aaPatchPath, "apk/", apk) : path.join(app.getPath('desktop'), "my.apk")
  var deviceConnected = false
  var adb = cp.spawn(aaPatcher, ['devices', '-l'], { detached: true })
  adb.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
    if (data.includes('model')) {
      deviceConnected = true
      snackbar("Begin AA Patcher <br>Patching " + (apk ? apk : "my.apk") + " ... ")
    }
  })

  adb.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })
  adb.on('close', function(code) {
    console.log(`exit code: ${code}`)
    if (typeof done === "function") {
      done(code)
    }
    if (code === 0 && deviceConnected) {
      copyAPK(apk2Patch)
    } else {
      dialog.showErrorBox(`ERROR: Device not found`, `Connect phone to PC via USB and enable adb debugging in developer options.`)
    }
  })
  adb.on('error', (err) => {
    // dialog.showErrorBox('Failed to start subprocess.', err)
  })
}

function copyAPK(apk) {
  snackbar(`Device Found, Copying APK...`)
  var adb = cp.spawn(aaPatcher, ['push', apk, 'mnt/sdcard/AIO-IN.apk'], { detached: true })
  adb.stdout.on('data', (data) => {
    //console.log(`stdout: ${data}`)
    if (data.indexOf('error:') > 0) {
      //dialog.showErrorBox(`ERROR: CONNECT PHONE TO USB AND ENABLE ADB DEBUGGING`, `${data}`)
    }
  })
  adb.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })
  adb.on('close', function(code) {
    console.log(`exit code: ${code}`)
    if (code === 0) {
      snackbar(`APK Copyed To Device, Patching...`)
      applyPatch()
    } else {
      console.log(code)
      dialog.showErrorBox(`ERROR: APK FILE NOT FOUND`, `apk file: ${apk} was not found`)
    }
  })
  adb.on('error', (err) => {
    console.log('Failed to start subprocess.')
  })

}

function applyPatch() {
  // patch to run:
  // adb shell pm install -i "com.android.vending" -r /path-to-your-app/file.apk
  var adb = cp.spawn(aaPatcher, ['shell', 'pm', 'install', '-i', 'com.android.vending', '-r', 'mnt/sdcard/AIO-IN.apk'], { detached: true })
  adb.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  adb.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })
  adb.on('close', function(code) {
    console.log(`exit code: ${code}\nAPK Patched! Cleaning up...`)
    cleanApkFile()
  })
  adb.on('error', (err) => {
    dialog.showErrorBox('Error Patching APK.', err);
  })
}

function cleanApkFile() {
  var adb = cp.spawn(aaPatcher, ['shell', 'rm', '-f', 'mnt/sdcard/AIO-IN.apk'], { detached: true })
  adb.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  adb.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })
  adb.on('close', function(code) {
    console.log(`exit code: ${code}\nDone!`)
    snackbarstay('Patched APK Installation Complete!<br>The App Will Work With Android Auto Now!')
  })
  adb.on('error', (err) => {
    console.log('Failed to start subprocess.')
  })
}
/*
module.exports = function AAPatcher() {
  adb({
    cmd: ['devices']
  }, function(result) {
    console.log(result);
  });
}*/
