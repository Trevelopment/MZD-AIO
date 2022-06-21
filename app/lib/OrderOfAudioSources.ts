#!/usr/bin/env node
/* jshint esversion:6, -W033, -W117, -W097, -W116 */
const fs = require('fs');

const args = process.argv.slice(2);
const appname = args[0];
const visible = args[1];
const sourceId = args[2];
const mmui = args[3];
const textId = args[4];
const disable = (textId !== 'Bluetooth');

const NewApp = {appData:
{appName: appname,
  isVisible: visible,
  audioSourceId: sourceId,
  mmuiEvent: mmui,
},
text1Id: textId,
disabled: disable,
itemStyle: 'style01',
hasCaret: false,
};

let count = 0;
fs.readFile(file, 'utf8', function(err, data) {
  if (err) throw err;
  const obj = JSON.parse(data);
  if (preload) data.preload = preload;
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].name === NewApp.name) {
      count++;
    }
  }
  if (count == 0) {
    obj.push(NewApp);
    fs.writeFile(file, JSON.stringify(obj, null, '\t').replace(/\n\t\t/g, ' ').replace(/\n\t}/g, ' }'), function(err) {
      if (err) throw err;
      console.log('Added ' + NewApp.label + ' To ' + file);
    });
  } else {
    console.log(NewApp.label + ' Already Exists In ' + file);
  }
});
