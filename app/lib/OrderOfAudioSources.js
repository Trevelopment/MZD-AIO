#!/usr/bin/env node
var fs = require('fs');

var args=process.argv.slice(2);
var appname=args[0];
var visible=args[1];
var sourceId=args[2];
var mmui=args[3];
var textId=args[4];
var disable=(textId!=='Bluetooth')

var NewApp={ appData:
  { appName: appname,
    isVisible: visible,
    audioSourceId: sourceId,
    mmuiEvent: mmui
  },
  text1Id: textId,
  disabled: disable,
  itemStyle: 'style01',
  hasCaret: false
}

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
    console.log('Added '+NewApp.label+' To '+file);
  });
 }else{
    console.log(NewApp.label+' Already Exists In '+file);
 }
});
