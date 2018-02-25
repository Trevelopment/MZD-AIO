var systemAppId = 'system';
var additionalAppsConfig = '/jci/opera/opera_dir/userjs/additionalApps.json';
var additionalApps = [];

/**
 * Sets up the additional apps and MMUI message interception magic
 */
function addAdditionalApps() {
  var category = 'Applications';

  // check that we're in the system app
  if (typeof framework === 'object' && framework._currentAppUiaId === systemAppId) {
    var systemApp = framework.getAppInstance(systemAppId);

    if (!systemApp.hasAdditionalApps) {
      systemApp.hasAdditionalApps = true; // so we only do this if needed

      // load additional app definitions from from
      getJSON('file://localhost' + additionalAppsConfig, function (data) {
        additionalApps = JSON.parse(data);
      }, function (status) {
        framework.log.error('Unable to load additionalApps from ' + additionalAppsConfig);
      });
      // add additional apps to 'Applications' list
      for (var i = 0; i < additionalApps.length; ++i) {
        var additionalApp = additionalApps[i];
        systemApp._masterApplicationDataList.items.push({ appData: { appName: additionalApp.name, isVisible: true, mmuiEvent: 'Select' + additionalApp.name }, text1Id: additionalApp.name, disabled: false, itemStyle: 'style01', hasCaret: false });
        framework.localize._appDicts[systemAppId][additionalApp.name] = additionalApp.label;
        framework.common._contextCategory._contextCategoryTable[additionalApp.name + '.*'] = category;
        if (typeof systemApp._applicationsCtxtWiseAppNames !== "undefined" && systemApp._applicationsCtxtWiseAppNames.Applications.indexOf(additionalApp.name) === -1) {
          systemApp._applicationsCtxtWiseAppNames.Applications.push(additionalApp.name);
        }
        if (additionalApp.preload !== undefined) {
          var preloadPath = "apps/" + additionalApp.name + "/js/" + additionalApp.preload;
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
var additionalAppReplacedAppName = 'vdt';
var additionalAppReplacedAppContext = 'DriveChartDetails';
var additionalAppReplacedMmuiEvent = 'SelectDriveRecord';

/**
 * Interceptor for systemApp._menuItemSelectCallback
 */
function additionalAppMenuItemSelectCallback(listCtrlObj, appData, params) {
  for (var i = 0; i < additionalApps.length; ++i) {
    var additionalApp = additionalApps[i];
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
    var additionalAppInFocusStack = false;
    if (this.additionalAppName) {
      for (var i = 0; i < jsObject.appIdList.length; i++) {
        var appId = jsObject.appIdList[i];
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

  var currentUiaId = this.getCurrentApp();
  var currentContextId = this.getCurrCtxtId();

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
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.timeout = 30000;
  xhr.onload = function () {
    var status = xhr.status;
    if (status == 0) {
      successHandler && successHandler(xhr.response);
    } else {
      errorHandler && errorHandler(status);
    }
  };
  xhr.onerror = function () {
    var status = xhr.status;
  };
  xhr.send();
}

if (typeof aioContextCount === "undefined") {
  //console.log("initialize aioMagicRoute");
  var aioContextCount = 1;
  // The magic router from Debug.js - Fakes a context change message
  // Switch to any context from any other context
  // **Note: Works in the emulator but DOES NOT ALWAYS WORK IN THE CAR
  // Example: Switching to speedometer from main menu automatically on boot
  // Will flash the speedometer for only a second then switch back.
  // ** Needs further investigation **
  function aioMagicRoute(uiaId, ctxtId, params, contextSeq) {
    var currAppId = framework.getCurrentApp();
    var transitionTrue = JSON.stringify({ 'msgType': 'transition', 'enabled': true })
    var transitionFalse = JSON.stringify({ 'msgType': 'transition', 'enabled': false })

    if (!contextSeq) {
      contextSeq = aioContextCount;
      aioContextCount++;
    }

    var ctxtChgMsg = JSON.stringify({ "msgType": "ctxtChg", "ctxtId": ctxtId, "uiaId": uiaId, "params": params, "contextSeq": contextSeq });
    var focusStackMsg = JSON.stringify({ "msgType": "focusStack", "appIdList": [{ "id": uiaId }, { "id": currAppId }] });

    aioMagicMsg(transitionTrue, ctxtChgMsg, focusStackMsg, transitionFalse);
  }

  function aioMagicMsg(data) {
    if (arguments.length > 1) {
      //is the data a list of objects?
      for (var i = 0; i < arguments.length; i++) {
        log.debug("aioMagicMsg arguments passed as: ", arguments[i]);
        framework.routeMmuiMsg(JSON.parse(arguments[i]));
      }
      return;
    }

    if (Object.prototype.toString.call(data) == '[object Array]') {
      //is the data an array?
      for (var j = 0; j < data.length; j++) {
        framework.routeMmuiMsg(JSON.parse(data[j]));
      }
      return;
    }
    //otherwise we have 1 object to send
    framework.routeMmuiMsg(JSON.parse(data));
  }

  function AIO_SBN(message, pathToIcon) {
    framework.common.startTimedSbn(framework.getCurrentApp(), "MzdAioSbn", "typeE", {
      sbnStyle: "Style02",
      imagePath1: pathToIcon,
      text1: message
    });
  }

  function DOMtoJSON(node) {
    node = node || this;
    var obj = {
      nodeType: node.nodeType
    };
    if (node.tagName) {
      obj.tagName = node.tagName.toLowerCase();
    } else
    if (node.nodeName) {
      obj.nodeName = node.nodeName;
    }
    if (node.nodeValue) {
      obj.nodeValue = node.nodeValue;
    }
    var attrs = node.attributes;
    if (attrs) {
      var length = attrs.length;
      var arr = obj.attributes = new Array(length);
      for (var i = 0; i < length; i++) {
        var attr = attrs[i];
        arr[i] = [attr.nodeName, attr.nodeValue];
      }
    }
    var childNodes = node.childNodes;
    if (childNodes) {
      var lengthc = childNodes.length;
      var arrc = obj.childNodes = new Array(lengthc);
      for (var j = 0; j < lengthc; j++) {
        arrc[j] = DOMtoJSON(childNodes[j]);
      }
    }
    return obj;
  }

  function JSONtoDOM(obj) {
    if (typeof obj == 'string') {
      obj = JSON.parse(obj);
    }
    var node, nodeType = obj.nodeType;
    switch (nodeType) {
    case 1: //ELEMENT_NODE
      node = document.createElement(obj.tagName);
      var attributes = obj.attributes || [];
      for (var i = 0, len = attributes.length; i < len; i++) {
        var attr = attributes[i];
        node.setAttribute(attr[0], attr[1]);
      }
      break;
    case 3: //TEXT_NODE
      node = document.createTextNode(obj.nodeValue);
      break;
    case 8: //COMMENT_NODE
      node = document.createComment(obj.nodeValue);
      break;
    case 9: //DOCUMENT_NODE
      node = document.implementation.createDocument();
      break;
    case 10: //DOCUMENT_TYPE_NODE
      node = document.implementation.createDocumentType(obj.nodeName);
      break;
    case 11: //DOCUMENT_FRAGMENT_NODE
      node = document.createDocumentFragment();
      break;
    default:
      return node;
    }
    if (nodeType === 1 || nodeType === 11) {
      var childNodes = obj.childNodes || [];
      for (i = 0, len = childNodes.length; i < len; i++) {
        node.appendChild(JSONtoDOM(childNodes[i]));
      }
    }
    return node;
  }
}

/**
 * Function to get the whole thing started.
 */
(function () {
  window.opera.addEventListener('AfterEvent.load', function (e) {
    addAdditionalApps();
  });
})();
