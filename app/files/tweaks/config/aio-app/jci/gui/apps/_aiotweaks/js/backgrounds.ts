const testFolder = '/jci/gui/apps/';
const fs = require('fs');
let apps = '';

fs.readdir(testFolder, (err, files) => {
  if (err) {console.error(err);}
  files.forEach(file => {
    apps += file + ' ';
  });
  console.log(apps);
});
