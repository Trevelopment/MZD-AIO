var testFolder = '/jci/gui/apps/';
var fs = require('fs');
var apps = '';

fs.readdir(testFolder, (err, files) => {
  if (err) { console.error(err) }
  files.forEach(file => {
    apps += file + ' ';
  });
  console.log(apps);
})
