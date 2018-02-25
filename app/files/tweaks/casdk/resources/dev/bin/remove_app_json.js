#!/usr/bin/env node
var fs = require('fs');
var args=process.argv.slice(2);
var file=args[0];
var key=args[1];

var count=0;
fs.readFile(file, 'utf8', function (err, data) {
 if (err) throw err;
 var obj=JSON.parse(data);
 for(var i=0; i<obj.length;i++){
  if(obj[i].name===key) {
    obj.splice(i,1);
    count++;
  }
 }

 if(count>0) {
  fs.writeFile (file, JSON.stringify(obj, null, '\t').replace(/\n\t\t/g,' ').replace(/\n\t}/g,' }'), function(err) {
    if (err) throw err;
    console.log('Removed '+key+' From '+file);
  });
 }else{
    console.log(key+' Does Not Exist In '+file);
 }
});
