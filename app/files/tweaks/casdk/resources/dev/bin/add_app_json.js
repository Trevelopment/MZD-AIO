#!/usr/bin/env node
var fs = require('fs');
var args=process.argv.slice(2);
var file=args[0];
var key=args[1];
var value=args[2];
var preload=args[3];

var NewApp = { "name": key, "label": value };

var count=0;
fs.readFile(file, 'utf8', function (err, data) {
 if (err) throw err;
 var obj=JSON.parse(data);
 if (preload) data.preload = preload;
 for(var i=0; i<obj.length;i++){
  if(obj[i].name===NewApp.name) {
   count++;
  }
 }
 if(count==0) {
  obj.push(NewApp);
  fs.writeFile (file, JSON.stringify(obj, null, '\t').replace(/\n\t\t/g,' ').replace(/\n\t}/g,' }'), function(err) {
    if (err) throw err;
    console.log('Added '+NewApp.name+' To '+file);
  });
 }else{
    console.log(NewApp.name+' Already Exists In '+file);
 }
});
