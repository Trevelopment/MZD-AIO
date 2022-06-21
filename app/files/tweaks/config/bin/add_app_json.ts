#!/usr/bin/env node

const fs = require('fs');
const args = process.argv.slice(2);
const file = args[0];
const key = args[1];
const value = args[2];
const preload = args[3];
const NewApp = {'name': key, 'label': value};
let count = 0;
if (preload) NewApp.preload = preload;
fs.readFile(file, 'utf8', function(err, data) {
  if (err) throw err;
  try {
    const obj = JSON.parse(data);
    for (let i = 0; i < obj.length; i++) {
      if (obj[i].name === NewApp.name) {
        count++;
      }
    }
  } catch (e) {
    obj = [];
    fs.unlinkSync(file);
    fs.writeFile(file, '[]', function(err) {
      if (err) throw err;
      console.log(file + ' is not valid... rebuilding');
    });
  }
  if (count == 0) {
    obj.push(NewApp);
    fs.writeFile(file, JSON.stringify(obj, null, '\t').replace(/\n\t\t/g, ' ').replace(/\n\t}/g, ' }'), function(err) {
      if (err) throw err;
      console.log('Added ' + value + ' To ' + file);
    });
  } else {
    console.log(value + ' Already Exists In ' + file);
  }
});
