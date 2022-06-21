setTimeout(() => {
  let turnScreenOff = setInterval(() => {
    if (framework.getCurrCtxtId() === 'DisplayOff') {
      clearInterval(turnScreenOff);
      turnScreenOff = null;
    } else {
      framework.sendEventToMmui('common', 'Global.IntentSettingsTab', {payload: {settingsTab: 'Display'}});
    }
    setTimeout(() => {
      framework.sendEventToMmui('syssettings', 'SelectDisplayOff');
    }, 1500);
  }, 3000);
}, 10000);
