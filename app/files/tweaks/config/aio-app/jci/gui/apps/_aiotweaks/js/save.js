#!/usr/bin/env node

var fs = require('fs');

function fsTest() {
  var contents = fs.readFileSync('/jci/gui/apps/_aiotweaks/test.txt').toString();
  console.log(contents);
}
