#!/usr/bin/env node

const fs = require('fs');

function fsTest() {
  const contents = fs.readFileSync('/jci/gui/apps/_aiotweaks/test.txt').toString();
  console.log(contents);
}
