// Allow JS code from remote URLs to require app libraries
// by using var myLib = REMOTE.require("lib/somelib")
// or var otherLib = REMOTE.nodeRequire("lib/somelib")
// See also http://electron.atom.io/docs/api/process#event-loaded
var _remote = require('electron').remote
// var _require = require; // in case node binding is disabled
process.once('loaded', () => {
  global.REMOTE = _remote
  // global.nodeRequire = _require; // in case node binding is disabled
  //require("menus/context-menu.js")
})
