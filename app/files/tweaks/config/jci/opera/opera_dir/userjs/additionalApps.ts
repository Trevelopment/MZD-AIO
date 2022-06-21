/* jshint -W086, -W116, -W117 */
const systemAppId = 'system';
const additionalAppsConfig = '/jci/opera/opera_dir/userjs/additionalApps.json';
let additionalApps = [];

/**
 * Sets up the additional apps and MMUI message interception magic
 */
function addAdditionalApps() {
  const category = 'Applications';

  // check that we're in the system app
  if (typeof framework === 'object' && framework._currentAppUiaId === systemAppId) {
    const systemApp = framework.getAppInstance(systemAppId);

    if (!systemApp.hasAdditionalApps) {
      systemApp.hasAdditionalApps = true; // so we only do this if needed

      // load additional app definitions from from
      getJSON('file://localhost' + additionalAppsConfig, function(data) {
        additionalApps = JSON.parse(data);
      }, function(status) {
        framework.log.error('Unable to load additionalApps from ' + additionalAppsConfig);
      });
      // add additional apps to 'Applications' list
      for (let i = 0; i < additionalApps.length; ++i) {
        const additionalApp = additionalApps[i];
        systemApp._masterApplicationDataList.items.push({appData: {appName: additionalApp.name, isVisible: true, mmuiEvent: 'Select' + additionalApp.name}, text1Id: additionalApp.name, disabled: false, itemStyle: 'style01', hasCaret: false});
        framework.localize._appDicts[systemAppId][additionalApp.name] = additionalApp.label;
        framework.common._contextCategory._contextCategoryTable[additionalApp.name + '.*'] = category;
        if (typeof systemApp._applicationsCtxtWiseAppNames !== 'undefined' && systemApp._applicationsCtxtWiseAppNames.Applications.indexOf(additionalApp.name) === -1) {
          systemApp._applicationsCtxtWiseAppNames.Applications.push(additionalApp.name);
        }
        if (additionalApp.preload !== undefined) {
          const preloadPath = 'apps/' + additionalApp.name + '/js/' + additionalApp.preload;
          utility.loadScript(preloadPath);
        }
      }

      // intercept app selection from the list to do our magic
      systemApp._contextTable[category].controlProperties.List2Ctrl.selectCallback = additionalAppMenuItemSelectCallback.bind(systemApp);

      // intercept MMUI messages in the framework
      framework.origRouteMmuiMsg = framework.routeMmuiMsg;
      framework.routeMmuiMsg = additionalAppRouteMmuiMsg.bind(framework);
      framework.sendEventToMmui = additionalAppSendEventToMmui.bind(framework);
    }
  }
}

/**
 * Using a disabled app from the list of apps in systemApp.js as a replacement to the MMUI
 */
const additionalAppReplacedAppName = 'vdt';
const additionalAppReplacedAppContext = 'DriveChartDetails';
const additionalAppReplacedMmuiEvent = 'SelectDriveRecord';

/**
 * Interceptor for systemApp._menuItemSelectCallback
 */
function additionalAppMenuItemSelectCallback(listCtrlObj, appData, params) {
  for (let i = 0; i < additionalApps.length; ++i) {
    const additionalApp = additionalApps[i];
    if (additionalApp.name === appData.appName) {
      framework.additionalAppName = appData.appName;
      framework.additionalAppContext = 'Start';
      appData = JSON.parse(JSON.stringify(appData));
      appData.appName = additionalAppReplacedAppName;
      appData.mmuiEvent = additionalAppReplacedMmuiEvent;
      break;
    }
  }
  this._menuItemSelectCallback(listCtrlObj, appData, params);
}

/**
 * Interceptor for Framework.routeMmuiMsg
 */
function additionalAppRouteMmuiMsg(jsObject) {
  switch (jsObject.msgType) {
    case 'ctxtChg':
      if (this.additionalAppName && jsObject.uiaId == additionalAppReplacedAppName) {
        jsObject.uiaId = this.additionalAppName;
        jsObject.ctxtId = this.additionalAppContext;
      }
      break;
    case 'focusStack':
      let additionalAppInFocusStack = false;
      if (this.additionalAppName) {
        for (let i = 0; i < jsObject.appIdList.length; i++) {
          const appId = jsObject.appIdList[i];
          if (appId.id == additionalAppReplacedAppName) {
            appId.id = this.additionalAppName;
          }
          if (appId.id == this.additionalAppName) {
            additionalAppInFocusStack = true;
          }
        }
      }
      if (!additionalAppInFocusStack) {
        this.additionalAppName = null;
        this.additionalAppContext = null;
      }
    case 'msg': // fall-through to alert
    case 'alert':
      if (this.additionalAppName && jsObject.uiaId == additionalAppReplacedAppName) {
        jsObject.uiaId = this.additionalAppName;
      }
      break;
    default:
    // do nothing
      break;
  }

  this.origRouteMmuiMsg(jsObject);
}

/**
 * Interceptor for Framework.sendEventToMmui
 */
function additionalAppSendEventToMmui(uiaId, eventId, params, fromVui) {
  if (uiaId == this.additionalAppName) {
    uiaId = additionalAppReplacedAppName;
  }

  let currentUiaId = this.getCurrentApp();
  let currentContextId = this.getCurrCtxtId();

  if (currentUiaId == this.additionalAppName) {
    currentUiaId = additionalAppReplacedAppName;
    currentContextId = additionalAppReplacedAppContext;
  }

  this.websockets.sendEventMsg(uiaId, eventId, params, fromVui, currentUiaId, currentContextId);

  // Let debug know about the message
  this.debug.triggerEvtToMmuiCallbacks(uiaId, eventId, params);
}

/**
 * Helper function to get JSON data
 */
function getJSON(url, successHandler, errorHandler) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.timeout = 30000;
  xhr.onload = () => {
    const status = xhr.status;
    if (status == 0) {
      successHandler && successHandler(xhr.response);
    } else {
      errorHandler && errorHandler(status);
    }
  };
  xhr.onerror = () => {
    // const status = xhr.status;
  };
  xhr.send();
}

/**
 * Function to get the whole thing started.
 */
(() => {
  window.opera.addEventListener('AfterEvent.load', function(e) {
    addAdditionalApps();
  });
})();
