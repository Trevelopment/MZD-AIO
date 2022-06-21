setTimeout(function() {
  let turnScreenOff = setInterval(function() {
    if (framework.getCurrCtxtId() === 'DisplayOff') {
      clearInterval(turnScreenOff);
      turnScreenOff = null;
    } else {
      framework.sendEventToMmui('common', 'Global.IntentSettingsTab', {payload: {settingsTab: 'Display'}});
    }
    setTimeout(function() {
      framework.sendEventToMmui('syssettings', 'SelectDisplayOff');
    }, 1500);
  }, 3000);
}, 10000);
