log.addSrcFile('AndroidAutoTmplt.js', 'androidauto');

function AndroidAutoTmplt(uiaId, parentDiv, templateID, controlProperties) {
  this.divElt = null;
  this.templateName = 'AndroidAutoTmplt';
  this.onScreenClass = 'AndroidAutoTmplt';
  log.debug('  templateID in AndroidAutoTmplt constructor: ' + templateID);
  this.properties = {
    'statusBarVisible': true,
    'leftButtonVisible': false,
    'rightChromeVisible': false,
    'hasActivePanel': false,
    'isDialog': false,
  };
  this.divElt = document.createElement('div');
  this.divElt.id = templateID;
  this.divElt.className = 'TemplateWithStatusLeft AndroidAutoTmplt';
  parentDiv.appendChild(this.divElt);
  this.divElt.innerHTML = '<p id=\'aaText1\' style=\'color:white;font-family:"sans-serif"; font-weight:normal;font-style: normal;font-size: 25px;line-height: 29px; position:absolute; top:5px; left: 45%; transform: translate(-50%,0); white-space: nowrap;\'>\r\nHeadunit for Android Auto&trade; \r\n<\/p>\r\n<p id=\'aaText2\' style=\'color:white;font-family:"sans-serif"; font-weight:normal;font-style: normal;font-size: 20px;line-height: 29px; position:absolute; top:40px; left: 45%; transform: translate(-50%,0); white-space: nowrap;\'>\r\n&copy; 2011-2016 Original Author: Michael A. Reid. (mikereidis@gmail.com)\r\n<\/p>\r\n<p id=\'aaText3\' style=\'color:white;font-family:"sans-serif"; font-weight:normal;font-style: normal;font-size: 20px;line-height: 29px; position:absolute; top:70px; left: 45%; transform: translate(-50%,0); white-space: nowrap;\'>\r\nPortions &copy; 2015-2018 Konsulko Group, S Padival, A Gartner, and others\r\n<\/p>\r\n<p id=\'aaText4\' style=\'color:white;font-family:"sans-serif"; font-weight:normal;font-style: normal;font-size: 20px;line-height: 29px; position:absolute; top:100px; left: 45%; transform: translate(-50%,0); white-space: nowrap;\'>\r\nPorted to Mazda Connect by S Padival (spadival@gmail.com) All Rights Reserved\r\n<\/p>\r\n<p id=\'aaText5\' style=\'color:white;font-family:"sans-serif"; font-weight:normal;font-style: normal;font-size: 20px;line-height: 29px; position:absolute; top:130px; left: 45%; transform: translate(-50%,0); white-space: nowrap;\'>\r\nhttps:\/\/github.com\/gartnera\/headunit\/\r\n<\/p>\r\n<div id=\'aaDiv1\' style=\'position:absolute; top:180px; left:10px; height: 200px; width: 700px; left: 45%; transform: translate(-50%,0);\'>\r\n    <textarea readonly id=\'aaStatusText\' style=\'color:white; background: black; width: 100%; height: 100%; margin: 0; border: 0;\' onclick=\'AAlogPoll()\'>To Connect with WiFi: Create a hotspot from your Android phone and start headunit server from the Android Auto app. \nTo Connect with USB: Connect Android phone to vehicle with a USB cable to start...\n<\/textarea>\r\n<\/div>';
}

AndroidAutoTmplt.prototype.handleControllerEvent = function(eventID) {
  log.debug('handleController() called, eventID: ' + eventID);
  switch (eventID) {
    case 'ccw':
    case 'up':
      document.getElementById('aaStatusText').scrollTop -= 100;
      break;
    case 'cw':
    case 'down':
      document.getElementById('aaStatusText').scrollTop += 100;
      break;
    case 'select':
      // document.getElementById('aaStatusText').click();
      framework.getCurrAppInstance()._StartContextReady();
      break;
  }
  return 'giveFocusLeft';
};

AndroidAutoTmplt.prototype.cleanUp = () => {

};

framework.registerTmpltLoaded('AndroidAutoTmplt');
