#!/usr/bin/env node

const fs = require('fs');
const args = process.argv.slice(2);
const file = args[0];
const key = args[1];
let count = 0;
fs.readFile(file, 'utf8', function(err, data) {
  if (err) throw err;
  try {
    const obj = JSON.parse(data);
    for (let i = 0; i < obj.length; i++) {
      if (obj[i].name === key) {
        obj.splice(i, 1);
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
  if (count > 0) {
    fs.writeFile(file, JSON.stringify(obj, null, '\t').replace(/\n\t\t/g, ' ').replace(/\n\t}/g, ' }'), function(err) {
      if (err) throw err;
      console.log('Removed ' + key + ' From ' + file);
    });
  } else {
    console.log(key + ' Does Not Exist In ' + file);
  }
});
