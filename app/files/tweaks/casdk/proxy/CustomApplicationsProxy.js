/**
* Custom Applications SDK for Mazda Connect Infotainment System
*
* A mini framework that allows to write custom applications for the Mazda Connect Infotainment System
* that includes an easy to use abstraction layer to the JCI system.
*
* Written by Andreas Schwarz (http://github.com/flyandi/mazda-custom-applications-sdk)
* Copyright (c) 2016. All rights reserved.
*
* WARNING: The installation of this application requires modifications to your Mazda Connect system.
* If you don't feel comfortable performing these changes, please do not attempt to install this. You might
* be ending up with an unusuable system that requires reset by your Dealer. You were warned!
*
* This program is free software: you can redistribute it and/or modify it under the terms of the
* GNU General Public License as published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
* the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
* License for more details.
*
* You should have received a copy of the GNU General Public License along with this program.
* If not, see http://www.gnu.org/licenses/
*
*/

/* ***********************    Native apps     *********************** */
var nativeApps = [];
var nativeAppsLoc = "apps/";

var _addAppFilesOverwrite = function(uiaId, mmuiMsgObj)
{
  log.debug("framework._addAppFiles called for: " + uiaId);

  var appName = null;
  var path = null;
  var jsPath = null;
  var cssPath = null;
  var cssRtlPath = null;

  this._lastAppLoaded = uiaId;

  if (uiaId === "common")
  {
    this._frameworkState = this._FWK_STATE_LOADING_CMN;

    appName = uiaId;

    // common is unique. "common" is not a uiaId, but we're using it here for convenience
    path = uiaId;
    jsPath = "common/js/Common.js";
  } else if (uiaId.substr(0,1) === "_") {
    this._frameworkState = this._FWK_STATE_LOADING_APP;

    appName = uiaId + "App";

    // file path is predictable (e.g. apps/system/)
    path = nativeAppsLoc + uiaId;
    jsPath = path + "/js/" + appName + ".js";

  } else {
    this._frameworkState = this._FWK_STATE_LOADING_APP;

    appName = uiaId + "App";

    // file path is predictable (e.g. apps/system/)
    path = "apps/" + uiaId;
    jsPath = path + "/js/" + appName + ".js";
  }

  // Set the CSS paths
  cssPath = path + "/css/" + appName + ".css";
  cssRtlPath = path + "/css/" + appName + "_rtl.css";

  // store the js object for when the app finishes loading
  this._loadingAppJsObj = mmuiMsgObj;

  utility.loadCss(cssPath);
  if (this._rtlLanguage)
  {
    utility.loadCss(cssRtlPath);
  }
  utility.loadScript(jsPath);

  this._filesToLoad = new Object();
  this._filesToLoad[appName] = false;

};
/* ***********************    ~Native apps     *********************** */



/**
* (GlobalError)
*/

window.onerror = function() {
  console.error(arguments);
};


/**
* (CustomApplicationsProxy)
*
* Registers itself between the JCI system and CustomApplication runtime.
*/

window.CustomApplicationsProxy = {

  /**
  * (locals)
  */

  debug: false,
  bootstrapped: false,

  systemAppId: 'system',
  systemAppCategory: 'Applications',

  proxyAppName: 'vdt',
  proxyAppContext: 'DriveChartDetails',
  proxyMmuiEvent: 'SelectDriveRecord',

  targetAppName: 'custom',
  targetAppContext: 'Surface',


  /**
  * (bootstrap)
  *
  * Bootstraps the JCI system
  */

  bootstrap: function() {

    // verify that core objects are available
    if(typeof framework === 'object' && framework._currentAppUiaId === this.systemAppId && this.bootstrapped === false) {

      // retrieve system app
      var systemApp = framework.getAppInstance(this.systemAppId);

      // verify bootstrapping - yeah long name
      if(systemApp) {

        // set to strap - if everything fails - no harm is done :-)
        this.bootstrapped = true;

        // let's boostrap
        try {

          // overwrite list2 handler
          systemApp._contextTable[this.systemAppCategory].controlProperties.List2Ctrl.selectCallback = this.menuItemSelectCallback.bind(systemApp);

          // for usb changes
          if(typeof(systemApp.overwriteStatusMenuUSBAudioMsgHandler) === "undefined") {
            systemApp.overwriteStatusMenuUSBAudioMsgHandler = systemApp._StatusMenuUSBAudioMsgHandler;
            systemApp._StatusMenuUSBAudioMsgHandler = this.StatusMenuUSBAudioMsgHandler.bind(systemApp);
          }

          // overwrite framework route handler
          if(typeof(framework.overwriteRouteMmmuiMsg) === "undefined") {
            framework.overwriteRouteMmmuiMsg = framework.routeMmuiMsg;
            framework.routeMmuiMsg = this.routeMmuiMsg.bind(framework);
          }

          // ovewrite framework MMUI sender
          if(typeof(framework.overwriteSendEventToMmui) === "undefined") {
            framework.overwriteSendEventToMmui = framework.sendEventToMmui;
            framework.sendEventToMmui = this.sendEventToMmui.bind(framework);
          }

          // assign template transition
          framework.transitionsObj._genObj._TEMPLATE_CATEGORIES_TABLE.SurfaceTmplt = 'Detail with UMP';

          // kick off loader
          this.prepareCustomApplications();

        } catch(e) {
          //do nothing
        }
      }
    }
  },


  /**
  * (Overwrite) menuItemSelectCallback
  */

  menuItemSelectCallback: function(listCtrlObj, appData, params) {

    try {
      if(appData.mmuiEvent === "SelectCustomApplication") {
        /* ***********************    Native apps     *********************** */
        if ( appData.appId.substr(0,1) === "_" ) {

          for (var i = 0; i < additionalApps.length; ++i) {
            var additionalApp = additionalApps[i];
            if(additionalApp.name === appData.appName) {
              framework.additionalAppName = appData.appName;
              framework.additionalAppContext = 'Start';

              CustomApplicationsProxy.targetAppName = appData.appName;
              CustomApplicationsProxy.targetAppContext = 'Start';

              appData = JSON.parse(JSON.stringify(appData));
              appData.appName = CustomApplicationsProxy.proxyAppName;
              appData.mmuiEvent = CustomApplicationsProxy.proxyMmuiEvent;
              break;
            }
          }
          /* ***********************    ~Native apps     *********************** */
          // launch app or exit if handler is not available
        } else if(typeof(CustomApplicationsHandler) !== "undefined" && CustomApplicationsHandler.launch(appData)) {
          CustomApplicationsProxy.targetAppName = 'custom';
          CustomApplicationsProxy.targetAppContext = 'Surface';
          try {
            appData = JSON.parse(JSON.stringify(appData));
            // set app data
            appData.appName = CustomApplicationsProxy.proxyAppName;
            appData.mmuiEvent = CustomApplicationsProxy.proxyMmuiEvent;
          } catch(e) {
            // do nothing
          }
        }
      }
    } catch(e) {
      // do nothing
    }
    // pass to original handler
    this._menuItemSelectCallback(listCtrlObj, appData, params);
  },

  /**
  * (Overwrite) sendEventToMmui
  */

  sendEventToMmui: function(uiaId, eventId, params, fromVui) {
    var currentUiaId = this.getCurrentApp(),
    currentContextId = this.getCurrCtxtId();
    // proxy overwrites
    if(currentUiaId === CustomApplicationsProxy.targetAppName) {
      currentUiaId = CustomApplicationsProxy.proxyAppName;
      currentContextId = CustomApplicationsProxy.proxyAppContext;
    }
    // pass to original handler
    framework.overwriteSendEventToMmui(uiaId, eventId, params, fromVui, currentUiaId, currentContextId);
  },

  /**
  * (Overwrite) routeMmuiMsg
  */
  routeMmuiMsg: function(jsObject) {
    try {
      var proxy = CustomApplicationsProxy;
      if(typeof(CustomApplicationsHandler) === 'object') {
        // validate routing message
        switch(jsObject.msgType) {
          // magic switch
          case 'ctxtChg':
          if(proxy.targetAppName && jsObject.uiaId === proxy.proxyAppName) {
            jsObject.uiaId = proxy.targetAppName;
            jsObject.ctxtId = proxy.targetAppContext;
          }
          break;
          // check if our proxy app is in the focus stack
          case 'focusStack':
          if(jsObject.appIdList && jsObject.appIdList.length) {
            for(var i = 0; i < jsObject.appIdList.length; i++) {
              var appId = jsObject.appIdList[i];
              if(appId.id === proxy.proxyAppName) {
                appId.id = proxy.targetAppName;
              }
            }
          }
          case 'msg':
          case 'alert':
          if(jsObject.uiaId === proxy.proxyAppName) {
            jsObject.uiaId = proxy.targetAppName;
          }
          break;
          default:
          // do nothing
          break;
        }
      }
    } catch(e) {
      // do nothing
    }
    // pass to framework
    framework.overwriteRouteMmmuiMsg(jsObject);
  },

  /**
  * (Overwrite) StatusMenuUSBAudioMsgHandler
  */
  StatusMenuUSBAudioMsgHandler: function(msg) {
    if(typeof(CustomApplicationsHandler) === 'object') {
      try {
        var proxy = CustomApplicationsProxy;
        console.log(JSON.stringify(msg));
      } catch(e) {
        // do nothing
      }
    }
    // pass to original handler
    this.overwriteStatusMenuUSBAudioMsgHandler(msg);
  },

  /**
  * (prepareCustomApplications)
  */
  prepareCustomApplications: function() {
    // load native apps & custom apps separately
    this.loadCount = 0;
    setTimeout(function() {
      this.loadCustomApplications();
      this.initNativeApplicationsDataList();
    }.bind(this), this.debug ? 500 : 5000); // first attempt wait 5s - the system might be booting still anyway
  },

  /**
  * (loadCustomApplications)
  */
  loadCustomApplications: function() {
    try {
      if(typeof(CustomApplicationsHandler) === 'undefined') {
        // clear
        clearTimeout(this.loadTimer);
        // try to load the runtime script
        utility.loadScript("apps/custom/runtime/runtime.js", false, function() {
          clearTimeout(this.loadTimer);
          this.initCustomApplicationsDataList();
        }.bind(this));
        // safety timer
        this.loadTimer = setTimeout(function() {
          if(typeof(CustomApplicationsHandler) === "undefined") {
            this.loadCount = this.loadCount + 1;
            // 20 attempts or we forget it - that's almost 3min
            if(this.loadCount < 20) {
              this.loadCustomApplications();
            }
          }
        }.bind(this), 10000);
      }
    } catch(e) {
      //log.error('loadCustomApplications failed, we won\'t attempt again because there could be issues with the actual handler');
    }
  },

  /**
  * (initCustomApplicationsDataList)
  */
  initCustomApplicationsDataList: function() {
    // extend with custom applications
    try {
      if(typeof(CustomApplicationsHandler) !== "undefined") {
        CustomApplicationsHandler.retrieve(function(items) {
          var systemApp = framework.getAppInstance(this.systemAppId);
          items.forEach(function(item) {
            systemApp._masterApplicationDataList.items.push(item);
            framework.localize._appDicts[this.systemAppId][item.appData.appName.replace(".", "_")] = item.title;
            framework.common._contextCategory._contextCategoryTable[item.appData.appName + '.*'] = 'Applications';
            // For v59+ there is an additional list _applicationsCtxtWiseAppNames.Applications
            if(typeof systemApp._applicationsCtxtWiseAppNames !== "undefined" && systemApp._applicationsCtxtWiseAppNames.Applications.indexOf(item.appData.appName) === -1) {
              systemApp._applicationsCtxtWiseAppNames.Applications.push(item.appData.appName);
            }
          }.bind(this));
        }.bind(this));
      }
    } catch(e) {
      // do nothing
    }
  },
  /**
  * (initNativeApplicationsDataList)
  */
  initNativeApplicationsDataList: function() {
    try {
      var systemApp = framework.getAppInstance(this.systemAppId);
      var category = 'Applications';
      if(!systemApp.hasAdditionalApps) {
        systemApp.hasAdditionalApps = true; // so we only do this if needed
        GuiFramework.prototype._addAppFiles = _addAppFilesOverwrite;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = (this.debug) ? 'apps/custom/apps/nativeApps.js':'/jci/opera/opera_dir/userjs/nativeApps.js';
        document.head.appendChild(script);
        script.onload = function(data) {
          if(typeof additionalApps !== "undefined"){
            for (var i = 0; i < additionalApps.length; ++i) {
              var additionalApp = additionalApps[i];
              systemApp._masterApplicationDataList.items.push(
                { appData :
                  { appName : additionalApp.name,
                    isVisible : true,
                    appId : additionalApp.name,
                    mmuiEvent : "SelectCustomApplication"
                  },
                  text1Id : additionalApp.name,
                  disabled : false,
                  itemStyle : 'style01',
                  hasCaret : false
                });
              framework.localize._appDicts['system'][additionalApp.name] = additionalApp.label;
              framework.common._contextCategory._contextCategoryTable[additionalApp.name+'.*'] = category;
              // For v59+ there is an additional list _applicationsCtxtWiseAppNames.Applications
              if(typeof systemApp._applicationsCtxtWiseAppNames !== "undefined" && systemApp._applicationsCtxtWiseAppNames.Applications.indexOf(additionalApp.name) === -1) {
                systemApp._applicationsCtxtWiseAppNames.Applications.push(additionalApp.name);
              }
              if (additionalApp.preload !== undefined) {
                var preloadPath = nativeAppsLoc + additionalApp.name + "/js/" + additionalApp.preload;
                utility.loadScript(preloadPath);
              }
            }
          }
        }
      }
    } catch(e) {
      // do nothing
    }
  },
}


/**
* Runtime Caller
*/

if(window.opera) {
  window.opera.addEventListener('AfterEvent.load', function (e) {
    CustomApplicationsProxy.bootstrap();
  });
}


/** EOF **/
