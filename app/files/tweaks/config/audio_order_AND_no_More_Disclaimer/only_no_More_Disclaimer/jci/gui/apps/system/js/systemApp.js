/*
 Copyright 2012 by Johnson Controls
 __________________________________________________________________________

 Filename: systemApp.js
 __________________________________________________________________________

 Project: JCI-IHU
 Language: EN
 Author: awoodhc
 Date: 05.7.2012
 __________________________________________________________________________

 Description: IHU GUI System App

 Revisions:
 v0.1 - 08-May-2012  Integrated mainMenuControl. Fixed issues with DOM ready
 v0.2 - 10-May-2012  Added ActivePanel, LeftButton, StatusBar
 v0.3 - 11-May-2012  Merged transitions.js code into framework. System App Prototype now shows transitions between contexts.
 v0.4 - 17-May-2012  Reworked functionality of Active Panel Content to handle transitions. Added alerts.
 v0.5 - 14-June-2012 Language Localization added to ListCtrls
 v0.6 - 20-June-2012 Fixed buggy ActivePanel behavior related to new "pop transitions"
 v0.7 - 22-June-2012 Code review changes and reworked context handling
 v0.8 - 03-July-2012 Fixed active content crash involving template with no active panel
 v0.9 - 09-July-2012 Added handling for UpdateEntertainmentMenu MMUI Messages. Moved appInit to top of file
 v1.0 - 31-July-2012 Updated Multicontroller behavior.
 v1.1 (13-Aug-2012) Modified handleControllerEvent behavior
 v1.2 (24-Aug-2012) Changed UiaMgr events to common events.
 v1.3 (28-Aug-2012) Gutted system app globl behavior. All global behavior is now in common.js. Updated control select callbacks
 v1.4 (08-Oct-2012) Changes according to 2.0 UI Spec
 v1.5 (19-Oct-2012) Enabled every feature in Entertainment menu
 v1.6 (24-Oct-2012) Add handling for StatusMenu, StatusMenuUSBAudio
 v1.7 (02-Nov-2012) StatusMenu is no longer case sensitive, CD is disabled by default
 v1.8 (06-Nov-2012) Changes in StatusMenuUSBAudio
 v1.9 (07-Nov-2012) Greyed out AuxIn, AhaRadio, Stitcher
 v2.0 (12-Nov-2012) Added ScreenRep to StatusMenu
 v2.1 (15-Nov-2012) Changes in _CommCtxtTmpltReadyToDisplay
 v2.2 (20-Nov-2012) Stitcher enabled
 v2.3 (22-Nov-2012) Switched to Global.IntentSettingsTab
 v2.4 (19-Dec-2012) Removed Settings context and datalist, removed the capital C from Common to common
 v2.5 (17-Jan-2013) Changed one event name
 v2.6 (22-Jan-2013) Add NotifyDialog and Notifications
 v2.7 (08-Feb-2013) Add now-playing icon to entertainment menu. Add traffic info item (Japan region only)
 v2.8 (15-Feb-2013) Communication context payload converted into msg instead. Hide home button icon on HomeScreen. Removed some remnants of change language.
 v2.9 (18-Feb-2013) HD Traffic Image item (regin specific)

 __________________________________________________________________________

 */

log.addSrcFile("systemApp.js", "system");

/**********************************************
 * Start of Base App Implementation
 *
 * Code in this section should not be modified
 * except for function names based on the appname
 *********************************************/

function systemApp(uiaId)
{
    log.debug("constructor called...");

    // Base application functionality is provided in a common location via this call to baseApp.init().
    // See framework/js/BaseApp.js for details.
    baseApp.init(this, uiaId);

    // All feature-specific initialization is done in appInit()
}

/*
 * Called just after the app is instantiated by framework.
 * App-specific variables should be declared here.
 */
systemApp.prototype.appInit = function()
{
    if (framework.debugMode)
    {
        utility.loadScript("apps/system/test/systemAppTest.js");
    }

    //@formatter:off

    this._initEntertainmentDataList();
    this._initApplicationsDataList();
    this._initCommunicationsDataList();

    this._contextTable = {

        "HomeScreen" : {
            "hideHomeBtn" : true,
            "template" : "MainMenuTmplt",
            "templatePath": "apps/system/templates/MainMenu", //only needed for app-specific templates
            "controlProperties": {
                "MainMenuCtrl" : {
                    "selectCallback":this._selectCallbackHomeScreen.bind(this),
                } // end of properties for "MainMenuCtrl"
            }, // end of list of controlProperties
        }, // end of "systemAppContext1"

        "Communication" : {
            "leftBtnStyle" : "goBack",
            "sbNameId" : "Communication",
            "template" : "List2Tmplt",
            "controlProperties": {
                "List2Ctrl" : {
                    "dataList": this._communicationsDataList,
                    titleConfiguration : 'noTitle',
                    numberedList : false,
                    selectCallback : this._menuItemSelectCallback.bind(this),
                } // end of properties for "List2Ctrl"
            }, // end of list of controlProperties
            "readyFunction" : this._readyCommunication.bind(this),
            "contextInFunction" : this._CommCtxtContextIn.bind(this),
        }, // end of "Communication"

        "Entertainment" : {
            "leftBtnStyle" : "goBack",
            "sbNameId" : "Entertainment",
            "template" : "List2Tmplt",
            "controlProperties": {
                "List2Ctrl" : {
                    "dataList": null,
                    titleConfiguration : 'noTitle',
                    numberedList : false,
                    selectCallback : this._menuItemSelectCallback.bind(this),
                } // end of properties for "List2Ctrl"
            }, // end of list of controlProperties
            "readyFunction" : this._readyEntertainment.bind(this),
        }, // end of "Entertainment"

        "Applications" : {
            "leftBtnStyle" : "goBack",
            "sbNameId" : "Applications",
            "template" : "List2Tmplt",
            "controlProperties": {
                "List2Ctrl" : {
                    "dataList": null,
                    titleConfiguration : 'noTitle',
                    numberedList : true,
                    selectCallback : this._menuItemSelectCallback.bind(this),
                } // end of properties for "List2Ctrl"
            }, // end of list of controlProperties
            "readyFunction" : this._readyApplications.bind(this),
        }, // end of "Applications"

        "NoConnectionNotify" : {
            "template" : "Dialog3Tmplt",
            "controlProperties": {
                "Dialog3Ctrl" : {
                    contentStyle : "style13",
                    defaultSelectCallback :  this._selectCallbackNoConnectionNotify.bind(this),
                    buttonCount : 2,
                    initialFocus : 1,
                    buttonConfig : {
                        button1 : {
                            labelId : "common.No",
                            appData : "Global.No"
                        },
                        button2 : {
                            labelId : "Connect",
                            appData : "SelectConnect"
                        },
                    },
                    text1Id : 'NoConnectionNotifyTitle',
                    text2Id : 'NoConnectionNotifyText',
                } // end of properties for "DialogCtrl"
            }, // end of list of controlProperties
        }, // end of "NoConnectionNotify"

        "NotifyDialog" : {
            "template" : "Dialog3Tmplt",
            "sbNameId" : null,
            "readyFunction" : this._NotifyDialogCtxtTmpltReadyToDisplay.bind(this),
            "displayedFunction" : this._NotifyDialogCtxtTmpltDisplayed.bind(this),
            "noLongerDisplayedFunction" : this._NotifyDialogCtxtTmpltNoLongerDisplayed.bind(this),
            "controlProperties": {
                "Dialog3Ctrl" : {
                    "defaultSelectCallback" : this._selectCallbackNotifyDialog.bind(this),
                    "contentStyle" : "style17",
                    "buttonCount" : 3,
                    "initialFocus" : 2,
                    "buttonConfig" : {
                        "button1" : {
                            labelId : "NotifyOff",
                            appData : "SelectNotifyOff",
                        },
                        "button2" : {
                            labelId : "NotifyIgnore",
                            appData : "Global.No",
                        },
                        "button3" : {
                            labelId : "NotifyRead",
                            appData : "SelectNotifyMessage"
                        }
                    }, // end of buttonConfig
                    "text1Id" : "NotifyIncomingMsg",
                    "text2" : "",
                    "text3Id" : "NotifyReadNow",
                } // end of properties for dialog
            }, // end of controlProperties
        }, // end of "NotifyDialog"

        "NotificationList" : {
            "leftBtnStyle" : "goBack",
            "template" : "List2Tmplt",
            "sbNameId" : "Notifications",
            "readyFunction" : this._readyNotificationList.bind(this),
            "noLongerDisplayedFunction" : this._noLongerDisplayedNotificationList.bind(this),
            "controlProperties": {
                "List2Ctrl" : {
                    titleConfiguration : "noTitle",
                    numberedList : true,
                    selectCallback: this._selectNotificationListItem.bind(this),
                    title : null,
                    dataList : null,
                },
            }, // end of controlProperties
        }, // end of "NotificationList"

        "NotificationListRetry" : {
            "template" : "Dialog3Tmplt",
            "controlProperties": {
                "Dialog3Ctrl" : {
                    contentStyle : "style02",
                    defaultSelectCallback :  this._selectCallbackNotificationListRetry.bind(this),
                    buttonCount : 2,
                    initialFocus : 1,
                    buttonConfig : {
                        button1 : {
                            labelId : "common.Cancel",
                            appData : "Global.Cancel"
                        },
                        button2 : {
                            labelId : "RetryLabel",
                            appData : "SelectRetry"
                        },
                    },
                    text1Id : 'FailedNotificationRetrieval',
                } // end of properties for "DialogCtrl"
            }, // end of list of controlProperties
        }, // end of NotificationListRetry

        "NoDevice" : {
            "template" : "Dialog3Tmplt",
            "controlProperties": {
                "Dialog3Ctrl" : {
                    contentStyle : "style13",
                    defaultSelectCallback :  this._selectCallbackNoDevice.bind(this),
                    buttonCount : 2,
                    initialFocus : 1,
                    buttonConfig : {
                        button1 : {
                            labelId : "common.No",
                            appData : "Global.GoBack"
                        },
                        button2 : {
                            labelId : "Connect",
                            appData : "SelectConnect"
                        },
                    },
                    text1Id : 'NoDeviceTitle',
                    text2Id : 'NoDeviceText',
                } // end of properties for "DialogCtrl"
            }, // end of list of controlProperties
        }, // end of "NoConnectionNotify"

        "DisplayOff" : {
            "hideHomeBtn" : true,
            "template" : "OffScreenTmplt",
            "templatePath": "apps/system/templates/OffScreen",
            "controlProperties": {
                "OffScreenCtrl" : {
                    userActivityCallback : this._displayOffUserActivity.bind(this),
                    showClock : true,
                }
            },
        }, // end of "DisplayOff"

        "Disclaimer" : {
			"template" : "NoCtrlTmplt",
            "hideHomeBtn" : true,
            "properties": {
                "visibleSurfaces" : ["TRANLOGO_SURFACE", "TRANLOGOEND_SURFACE"],
                "statusBarVisible" : false,
				"customBgImage" : "common/images/background.png",
            },
			"readyFunction" : this._noMoreDisclaimer.bind(this),
        }, // end of Disclaimer

        "SystemWarning" : {
            "hideHomeBtn" : true,
            "template" : "Dialog3Tmplt",
            "controlProperties": {
                "Dialog3Ctrl" : {
                    titleStyle : "titleStyle01",
                    titleId : "TempWarning",
                    contentStyle : "style02",
                    defaultSelectCallback :  this._selectCallbackSystemWarning.bind(this),
                    buttonCount : 1,
                    buttonConfig : {
                        button1 : {
                            labelId : "common.Ok",
                            appData : "Global.Yes"
                        },
                    },
                    text1Id : "TempWarningText",
                }
            },
        },

        "SourceReconnect" : {
            "template" : "Dialog3Tmplt",
            "controlProperties": {
                "Dialog3Ctrl" : {
                    "defaultSelectCallback" : this._selectSourceReconnect.bind(this),
                    "contentStyle" : "style14",
                    "fullScreen" : false,
                    "text1Id" : null,
                    "meter" : {"meterType":"indeterminate", "meterPath":"common/images/IndeterminateMeter_2.png"},
                    "buttonCount" : 1,
                    "buttonConfig" : {
                        button1 : {
                            labelId : "ReconnectEntMenuButton",
                            appData : "SelectEntertainmentMenu"
                        },
                    },
                }
            },
            "readyFunction" : this._readySourceReconnect.bind(this),
        },

        "SourceReconnectFailed" : {
            "template" : "Dialog3Tmplt",
            "controlProperties": {
                "Dialog3Ctrl" : {
                    "defaultSelectCallback" : this._selectSourceReconnectFailed.bind(this),
                    "contentStyle" : "style02",
                    "fullScreen" : false,
                    "text1Id" : null,
                    "buttonCount" : 1,
                    "buttonConfig" : {
                        button1 : {
                            labelId : "common.Ok",
                            appData : "Global.Yes"
                        },
                    },
                }
            },
            "readyFunction" : this._readySourceReconnectFailed.bind(this),
        },

        "IntroAnimation" : {
            "hideHomeBtn" : true,
            "template" : "NoCtrlTmplt",
            "properties": {
                "visibleSurfaces" : ["TRANLOGO_SURFACE", "TRANLOGOEND_SURFACE"],
                "statusBarVisible" : false,
                "customBgImage" : "common/images/FullTransparent.png",
            },
        },

        "QuickStartLoop" : {
            "hideHomeBtn" : true,
            "template" : "NoCtrlTmplt",
            "properties": {
                "visibleSurfaces" : ["QUICKTRANLOGO_SURFACE"],
                "statusBarVisible" : false,
                "customBgImage" : "common/images/FullTransparent.png",
            },
        },

        "PowerDownAnimation" : {
            "hideHomeBtn" : true,
            "template" : "NoCtrlTmplt",
            "properties": {
                "visibleSurfaces" : ["EXITLOGO_SURFACE"],
                "statusBarVisible" : false,
                "customBgImage" : "common/images/FullTransparent.png",
            },
        },

        "IdleStandby" : {
            "hideHomeBtn" : true,
            "template" : "OffScreenTmplt",
            "templatePath": "apps/system/templates/OffScreen",
            "controlProperties": {
                "OffScreenCtrl" : {
                    userActivityCallback : null,
                    showClock : false,
                }
            },
        },

        "WaitForEnding" : {
            "hideHomeBtn" : true,
            "template" : "OffScreenTmplt",
            "templatePath": "apps/system/templates/OffScreen",
            "controlProperties": {
                "OffScreenCtrl" : {
                    userActivityCallback : null,
                    showClock : false,
                }
            },
        },

        "EnableRVR" : {
            "template" : "Dialog3Tmplt",
            "controlProperties": {
                "Dialog3Ctrl" : {
                    contentStyle : "style02",
                    defaultSelectCallback :  this._selectCallbackEnableRVR.bind(this),
                    buttonCount : 1,
                    buttonConfig : {
                        button1 : {
                            labelId : "common.Ok",
                            appData : "Global.Yes"
                        },
                    },
                    text1Id : "SiriDisabled",
                }
            },
			"readyFunction" : this._readyEnableRVR.bind(this),
        },

        "RVRInstructions" : {
            "template" : "Dialog3Tmplt",
            "controlProperties": {
                "Dialog3Ctrl" : {
                    contentStyle : "style02",
                    defaultSelectCallback :  this._selectCallbackRVRInstructions.bind(this),
                    buttonCount : 1,
                    buttonConfig : {
                        button1 : {
                            labelId : "common.Ok",
                            appData : "Global.Yes"
                        },
                    },
                    text1Id : "InitiateSiri",
                }
            },
        },

		"SiriInSession" : {
            "template" : "Dialog3Tmplt",
            "controlProperties": {
                "Dialog3Ctrl" : {
                    titleStyle : "titleStyle01",
                    titleId : "Siri",
                    contentStyle : "style14",
					"meter" : {"meterType":"indeterminate", "meterPath":"apps/system/images/IcnSiri.png"}
                }
            },
        },

		 "SiriLaunchingError" : {
            "template" : "Dialog3Tmplt",
            "controlProperties": {
                "Dialog3Ctrl" : {
                    //titleStyle : "titleStyle01",
                   // titleId : "Siri",
                    contentStyle : "style02",
                    defaultSelectCallback :  this._selectCallbackRVRInstructions.bind(this),
                    buttonCount : 1,
                    buttonConfig : {
                        button1 : {
                            labelId : "common.Ok",
                            appData : "Global.Yes"
                        },
                    },
                    text1Id : "DisconnectThenReconnect",
                }
            },
			"readyFunction" : this._readySiriLaunchingError.bind(this),
        },
    }; // end of this._contextTable object

    //@formatter:off
    this._messageTable = {
        // Indicates Available / Unavailable for (most) apps, communication items, entertainment items, navi, and settings.
        "StatusMenu"                  : this._StatusMenuMsgHandler.bind(this),

        // Add or remove certain menu items.
        "StatusMenuVisible"           : this._StatusMenuVisibleMsgHandler.bind(this),

        // Indicates Available / Unavailable and device name for USB1 and USB2 audio
        "StatusMenuUSBAudio"          : this._StatusMenuUSBAudioMsgHandler.bind(this),

        // Indicates Available / Unavailable and device name for BTAudio
        "StatusMenuBTAudio"           : this._StatusMenuBTAudioMsgHandler.bind(this),

        // Indicates vehicle fuel type (GAS/HEV) for EcoEnergy
        "StatusUpdateEcoEnergy"       : this._StatusUpdateEcoEnergyMsgHandler.bind(this),

        // Updates the number of notifications for missed sms and emails.
        "StatusUpdateNotifications"   : this._StatusUpdateNotificationsHandler.bind(this),

        // Updates the phone connection status which adds or removes the "Active Call" item from the Communication context
        "StatusPhoneCall"             : this._StatusPhoneCallMsgHandler.bind(this),

        // Show an Audio SourceNotAvailable SBN
        "TimedSBN_SourceNotAvailable" : this._TimedSBN_SourceNotAvailableMsgHandler.bind(this),

        // Update the current audio source icon in the Entertainment menu
        "StatusUpdateAudioSource"     : this._StatusUpdateAudioSourceMsgHandler.bind(this),

        // Update the number of missed calls
        "StatusUpdateMissedCallCount" : this._StatusUpdateMissedCallCountMsgHandler.bind(this),

        // Update the number of warnings displayed apps men
        "WarningStatusCount"          : this._WarningStatusCountMsgHandler.bind(this),

        // Update whether scheduled maintenance is due
        "StatusUpdateSchedMaint"      : this._StatusUpdateSchedMaintHandler.bind(this),

		// Show an Siri SBN
		"ShowStateSBN_SiriActive"	  : this._ShowStateSBN_SiriActiveMsgHandler.bind(this),

		// Show an Siri Error SBN
		"TimedSBN_SiriError"		  : this._TimedSBN_SiriErrorMsgHandler.bind(this),

		// Remove an Siri SBN
		"RemoveStateSBN_SiriActive"	  : this._RemoveStateSBN_SiriActiveMsgHandler.bind(this),

		//Show timed SBN Voice not supported
		"TimedSBN_VoiceNotSupported"  : this._TimedSBN_VoiceNotSupportedMsgHandler.bind(this),

		//At Speed Restriction
		"Global.AtSpeed"			  : this._AtSpeedMsgHandler.bind(this),

		//At No Speed
		"Global.NoSpeed"	          : this._NoSpeedMsgHandler.bind(this),
    };
    //@formatter:on

    // (Object) Related values needed to implement the Disclaimer timeout. From the requirements:
    //      "Note:  The Disclaimer Screen Timer is paused if covered up by another screen."
    // The Disclaimer screen might be shown a second time during a quick start sequence that follows a normal start sequence
    // so the remaining time must be restarted when this happens.
    this._disclaimerTime = {

        // (Boolean) If true when showing the Disclaimer we should reset the default remaining time. The reset
        // flag is set true after a the timer times out or the user hits the OK button.
        reset : true,

        // (Number) Milliseconds remaining to show the Disclaimer.
        remaining : 0,

        // (Number) Millisecond timestamp when the Disclaimer was first shown.
        whenStarted : 0,

        // (Handle) setTimeout ID
        timeoutId : null
    };

	// Array containing the appName of the list which supports Speed Restriction.
	//@appName = appName of the item , @status = default value of disabled property for particular appName
	this._SpeedRestrictedApps = [ {appName : "vdt_settings",status : true}];
};

/**************************
 * Set Wink Properties *
 **************************/

systemApp.prototype.getWinkProperties = function(alert, params)
{
	log.info("setting wink properties for: ", alert, params);
    var winkProperties = null;
    switch(alert)
    {
        case "System_RVR_NOT_ACTIVE":
		case "System_RVR_EFM_ERROR":
		case "System_RVR_ACTIVATE_ERROR":
			winkProperties = {
                "style": "style03",
                "text1Id": "ErrorWhileStartingSiri"
            };
            break;
        case "System_RVR_ACTIVE":
		case "System_RVR_ACTIVE_WITH_EFM":
		case "System_RVR_ACTIVE_NO_EFM":
            winkProperties = {
                "style": "style03",
                "text1Id": "Siri"
            };
            break;
        default:
            // Display default Wink
            log.debug("No properties found for wink: " + alert);
            break;
    }
    // return the properties to Common
    return winkProperties;
}
///////////////////////////////////////////////////////////////////////////////
// Initialize various menu data lists
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._initEntertainmentDataList = function()
{
    var items = [];

    if (framework.localize.getRegion() === framework.localize.REGIONS.Japan)
    {
        // Traffic alert is Japan only. We do not get a separate StatusMenuVisible for this so we only
        // add it if the region is Japan.
        items.push({ appData : { appName : 'amradio', isVisible : true, audioSourceId : 'TrafficInfo' , mmuiEvent : 'SelectTrafficAlert' }, text1Id : 'TrafficAlertsItem', disabled : true, itemStyle : 'style01', hasCaret: false });
    }

      items.push(
          { appData : { appName : 'fmradio',  isVisible : true,  audioSourceId : 'FMRadio',   mmuiEvent : 'SelectRadioFM'  }, text1Id : 'FmRadio',       disabled : true,   itemStyle : 'style01',   hasCaret: false },
          { appData : { appName : 'amradio',  isVisible : true,  audioSourceId : 'AMRadio',   mmuiEvent : 'SelectRadioAM'  }, text1Id : 'AmRadio',       disabled : true,   itemStyle : 'style01',   hasCaret: false },
          { appData : { appName : 'dab',      isVisible : false, audioSourceId : 'DAB',       mmuiEvent : 'SelectDAB'      }, text1Id : 'DabRadio',      disabled : true,   itemStyle : 'style01',   hasCaret: false },
          { appData : { appName : 'satradio', isVisible : false, audioSourceId : 'SatRadio',  mmuiEvent : 'SelectSatRadio' }, text1Id : 'SdarsRadio',    disabled : true,   itemStyle : 'style01',   hasCaret: false },
          { appData : { appName : 'aharadio', isVisible : false, audioSourceId : 'AhaRadio',  mmuiEvent : 'SelectAhaRadio' }, text1Id : 'AhaRadio',      disabled : true,   itemStyle : 'style01',   hasCaret: false },
          { appData : { appName : 'pandora',  isVisible : false, audioSourceId : 'Pandora',   mmuiEvent : 'SelectPandora'  }, text1Id : 'Pandora',       disabled : true,   itemStyle : 'style01',   hasCaret: false },
          { appData : { appName : 'stitcher', isVisible : true,  audioSourceId : 'Stitcher',  mmuiEvent : 'SelectStitcher' }, text1Id : 'StitcherItem',  disabled : true,   itemStyle : 'style01',   hasCaret: false },
          { appData : { appName : 'btaudio',  isVisible : true,  audioSourceId : 'BTAudio',   mmuiEvent : 'SelectBTAudio'  }, text1Id : 'Bluetooth',     disabled : false,  itemStyle : 'style01',   hasCaret: false },
          { appData : { appName : '',         isVisible : true,  audioSourceId : 'USB_A',     mmuiEvent : 'SelectUSBA'     }, text1Id : 'UsbAudioA',     disabled : true,   itemStyle : 'style01',   hasCaret: false },
          { appData : { appName : '',         isVisible : true,  audioSourceId : 'USB_B',     mmuiEvent : 'SelectUSBB'     }, text1Id : 'UsbAudioB',     disabled : true,   itemStyle : 'style01',   hasCaret: false },
          { appData : { appName : 'cd',       isVisible : false, audioSourceId : 'CD',        mmuiEvent : 'SelectCD'       }, text1Id : 'CdPlayer',      disabled : true,   itemStyle : 'style01',   hasCaret: false },
          { appData : { appName : 'auxin',    isVisible : true,  audioSourceId : 'AuxIn',     mmuiEvent : 'SelectAuxIn'    }, text1Id : 'AuxIn',         disabled : true,   itemStyle : 'style01',   hasCaret: false },
          { appData : { appName : 'dvd',      isVisible : false, audioSourceId : 'DVD',       mmuiEvent : 'SelectDVD'      }, text1Id : 'DVDItem',       disabled : true,   itemStyle : 'style01',   hasCaret: false },
          { appData : { appName : 'tv',       isVisible : false, audioSourceId : 'TV',        mmuiEvent : 'SelectTV'       }, text1Id : 'TVItem',        disabled : true,   itemStyle : 'style01',   hasCaret: false }
      );
      items.sort(function(a, b) {
        return a.pos - b.pos;
      })
    // All Entertainment list items are kept in _masterEntertainmentDataList, including items that may or may not be present on a specific vehicle.
    //
    // MMUI will send a StatusMenuVisible message to show or hide a particular item. The message handler will update the isVisible flag in the appData above.
    // During Entertainment contexts readyFunction in we build a shallow copy of the master data and set it on the list.

    this._masterEntertainmentDataList = {
        items: items
    };
};

systemApp.prototype._initApplicationsDataList = function()
{
    var items = [];

    items.push(
        { appData : { appName : 'hdtrafficimage', isVisible : false, mmuiEvent : 'SelectHDTrafficImage'         }, text1Id : 'HDTrafficItem',               disabled : true,  itemStyle : 'style01', hasCaret : false },
        { appData : { appName : 'idm',            isVisible : false, mmuiEvent : 'SelectIntelligentDriveMaster' }, text1Id : 'IntelligentDriveMasterItem',  disabled : true,  itemStyle : 'style01', hasCaret : false },
        { appData : { appName : 'ecoenergy',      isVisible : true,  mmuiEvent : 'SelectEcoEnergy'              }, text1Id : 'EcoenergyApp',                disabled : true,  itemStyle : 'style01', hasCaret : false },
        { appData : { appName : 'driverid',       isVisible : false, mmuiEvent : 'SelectDriverIdentification'   }, text1Id : 'DriverIDItem',                disabled : true,  itemStyle : 'style01', hasCaret : false },
        { appData : { appName : 'schedmaint',     isVisible : true,  mmuiEvent : 'SelectSchedMaint'             }, text1Id : 'SchedMaintenanceApp',         disabled : true,  itemStyle : 'style22', hasCaret : false, image2: '', label1: "" },
        { appData : { appName : 'warnguide',      isVisible : true,  mmuiEvent : 'SelectWarnGuide'              }, text1Id : 'WarnGuidanceApp',             disabled : true,  itemStyle : 'style22', hasCaret : false, image2: '', label1: "" },
        { appData : { appName : 'vdt_settings',   isVisible : false, mmuiEvent : 'SelectVehicleTelemetryTransfer'}, text1Id : 'VehicleTelemetryTransfer',   disabled : true,  itemStyle : 'style01', hasCaret : false },
        { appData : { appName : 'vdt',            isVisible : false, mmuiEvent : 'SelectDriveRecord'    		}, text1Id : 'DriveRecord',                 disabled : true,  itemStyle : 'style01', hasCaret : false },
		{ appData : { appName : 'carplay',        isVisible : false, mmuiEvent : 'SelectCarPlay'   			    }, text1Id : 'CarPlay',   	     		    disabled : true,  itemStyle : 'style01', hasCaret : false },
        { appData : { appName : 'androidauto',    isVisible : false, mmuiEvent : 'SelectAndroidAuto'   			}, text1Id : 'AndroidAuto',     			disabled : true,  itemStyle : 'style01', hasCaret : false }

    );

    // All Application list items are kept in _masterApplicationDataList, including items that may or may not be present on a specific vehicle.
    //
    // MMUI will send a StatusMenuVisible message to show or hide a particular item. The message handler will update the isVisible flag in the appData above.
    // During Application contexts readyFunction in we build a shallow copy of the master data and set it on the list.

    this._masterApplicationDataList = {
        items: items
    };
};

systemApp.prototype._initCommunicationsDataList = function()
{
    var items = [];

    items.push(
        { appData : { appName : '',            isVisible : false, mmuiEvent : 'SelectActiveCall'    }, text1Id : 'ActiveCallItem',        disabled : false, itemStyle : 'style01', hasCaret : false},
        { appData : { appName : '',            isVisible : true,  mmuiEvent : 'SelectNotifications' }, text1Id : 'Notifications',         disabled : true,  itemStyle : 'style06', hasCaret : false, label1 : '' },
        { appData : { appName : 'favorites',   isVisible : true,  mmuiEvent : 'SelectFavoritesComm' }, text1Id : 'FavoritesItem',         disabled : true,  itemStyle : 'style01', hasCaret : false },
        { appData : { appName : 'contacts',    isVisible : true,  mmuiEvent : 'SelectContacts'      }, text1Id : 'Contacts',              disabled : true,  itemStyle : 'style01', hasCaret : false },
        { appData : { appName : 'phone',       isVisible : true,  mmuiEvent : 'SelectCallHistory'   }, text1Id : 'CallHistory',           disabled : true,  itemStyle : 'style06', hasCaret : false, label1 : '' },
        { appData : { appName : 'phone',       isVisible : true,  mmuiEvent : 'SelectPhone'         }, text1Id : 'DialPhone',             disabled : true,  itemStyle : 'style01', hasCaret : false },
        { appData : { appName : 'sms',         isVisible : true,  mmuiEvent : 'SelectSms'           }, text1Id : 'Sms',                   disabled : true,  itemStyle : 'style06', hasCaret : false, label1 : '' },
        { appData : { appName : 'email',       isVisible : false, mmuiEvent : 'SelectEmail'         }, text1Id : 'Email',                 disabled : true,  itemStyle : 'style06', hasCaret : false, label1 : '' },
        { appData : { appName : 'syssettings', isVisible : true,  mmuiEvent : 'SelectSettings'      }, text1Id : 'SettingsCommunication', disabled : true,  itemStyle : 'style01', hasCaret : false }
    );

    // All Communication list items are kept in _masterCommunicationDataList, including items that may or may not be present on a specific vehicle.
    //
    // MMUI will send a StatusMenuVisible message to show or hide a particular item. The message handler will update the isVisible flag in the appData above.
    // During Communication contexts readyFunction in we build a shallow copy of the master data and set it on the list.

    this._communicationsDataList = {

        items: items

    };
};

///////////////////////////////////////////////////////////////////////////////
// Message handlers, helpers
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._StatusPhoneCallMsgHandler = function(msg)
{
    if (msg.params && msg.params.payload && msg.params.payload.phoneCallStatus)
    {
        // Add or remove the Active Call item in the communications menu
        var hasActiveCall = msg.params.payload.phoneCallStatus === "ActiveCall" || msg.params.payload.phoneCallStatus === "Connecting";
        var dirty = false;
        if (hasActiveCall && this._communicationsDataList.items[0].appData.mmuiEvent !== 'SelectActiveCall')
        {
            this._communicationsDataList.items[0].appData.isVisible = true;
            dirty = true;
        }
        else if (!hasActiveCall && this._communicationsDataList.items[0].appData.mmuiEvent === 'SelectActiveCall'
            && this._communicationsDataList.items[0].appData.isVisible === true)
        {
            this._communicationsDataList.items[0].appData.isVisible = false;
            dirty = true;
        }

        // If it changed, and we are in the Comm ctxt, update the list shown
        if (dirty && this._currentContext && this._currentContext.ctxtId === "Communication" && this._currentContextTemplate)
        {
            //build list (which will exclude isVisible==false items)
            var dataList = this._buildCommunicationDataList();
            this._currentContextTemplate.list2Ctrl.setDataList(dataList);
            this._currentContextTemplate.list2Ctrl.updateItems(0, dataList.items.length - 1);
        }
    }
};

systemApp.prototype._StatusMenuMsgHandler = function(msg)
{
    log.debug("Received StatusMenu message: " + msg.params.payload.statusMenu.appName + " " + msg.params.payload.statusMenu.appStatus);

    // Update menu items associated with the given appName of the message. Menu items can appear
    // in several different contexts or appear multiple times: this function searches all those places.

    var appName = msg.params.payload.statusMenu.appName;
    var isDisabled = msg.params.payload.statusMenu.appStatus !== "Available";

	//Update the Availability Status of Speed Restricted Apps
	this._StatusMenuChanged(appName,isDisabled);

    // Update the static menu lists so they are correctly enable next time the context is shown
	this._enableAppListItem(appName, isDisabled, this._masterApplicationDataList);
	this._enableAppListItem(appName, isDisabled, this._communicationsDataList);
	this._enableAppListItem(appName, isDisabled, this._masterEntertainmentDataList);

    // Update the menu list in the current context if needed
    if (this._currentContext)
    {
        switch (this._currentContext.ctxtId)
        {
            case "Communication":
            case "Entertainment":
            case "Applications":
                if (this._currentContextTemplate && this._currentContextTemplate.list2Ctrl)
                {
                    var dataList = this._currentContextTemplate.list2Ctrl.dataList;
                    for (var i = 0; i < dataList.items.length; ++i)
                    {
                        if (dataList.items[i].appData.appName.indexOf(appName) === 0)
                        {
                            if(this._AtSpeedDisabled)// At speed : Available status will be skipped for the speed restricted apps
							{
								var speedRestrictedAppName = null;
								var isNoAppAtSpeed = true;

								for(var j = 0; j < this._SpeedRestrictedApps.length; ++j)
								{
									speedRestrictedAppName = this._SpeedRestrictedApps[j].appName;
									log.info("speedRestrictedAppName : "+speedRestrictedAppName + " checking for AppName : "+dataList.items[i].appData.appName);
									if(speedRestrictedAppName === dataList.items[i].appData.appName)
									{
										isNoAppAtSpeed = false;// App found with At Speed
										break;
									}
								}
								if(isNoAppAtSpeed)
								{
									dataList.items[i].disabled = isDisabled;
									if (isDisabled)
									{
										// Clear nowplaying icon just in case it was still shown for this now unavailable item
										dataList.items[i].image1 = "";
									}
									this._currentContextTemplate.list2Ctrl.updateItems(i, i);
								}
							}
							else
							{
								dataList.items[i].disabled = isDisabled;
								if (isDisabled)
								{
									// Clear nowplaying icon just in case it was still shown for this now unavailable item
									dataList.items[i].image1 = "";
								}
								this._currentContextTemplate.list2Ctrl.updateItems(i, i);
							}
                            log.debug("Updated current screen based on StatusMenu message: " + msg.params.payload.statusMenu.appName + " " + msg.params.payload.statusMenu.appStatus);
                        }
                    }
                }
                break;
        }
    }
};

systemApp.prototype._enableAppListItem = function(appName, isDisabled, dataList)
{
    for (var i = 0; i < dataList.items.length; ++i)
    {
        if (dataList.items[i].appData.appName.indexOf(appName) === 0)
        {
            if(this._AtSpeedDisabled) // At speed : Available status will be skipped for the speed restricted apps
			{
				var speedRestrictedAppName = null;
				var isNoAppAtSpeed = true;
				for(var j = 0; j < this._SpeedRestrictedApps.length; ++j)
				{
					speedRestrictedAppName = this._SpeedRestrictedApps[j].appName;
					log.info("speedRestrictedAppName : "+speedRestrictedAppName + " checking for AppName : "+dataList.items[i].appData.appName);
					if(speedRestrictedAppName === dataList.items[i].appData.appName)
					{
						isNoAppAtSpeed = false;// App found with At Speed
						break;
					}
				}
				if(isNoAppAtSpeed)
				{
					dataList.items[i].disabled = isDisabled;
				}
			}
			else
			{
				dataList.items[i].disabled = isDisabled;
			}
			log.debug("Updated cached list item based on StatusMenu message: " + appName + " " + !isDisabled);
        }
    }
};

systemApp.prototype._enableSpeedRestrictedItem = function(appName, isDisabled, dataList)
{
    for (var i = 0; i < dataList.items.length; ++i)
    {
        if (dataList.items[i].appData.appName === appName)
        {
            log.info("AppName : "+appName+" is found for making it disabled : "+isDisabled);
			dataList.items[i].disabled = isDisabled;
            log.debug("Updated cached list item based on StatusMenu message: " + appName + " " + !isDisabled);
        }
    }
};

systemApp.prototype._StatusMenuVisibleMsgHandler = function(msg)
{
    if (msg.params && msg.params.payload)
    {
        log.debug("Received StatusMenuVisible message: " + msg.params.payload.appName + " " + msg.params.payload.state);

        var appName = msg.params.payload.appName;
        var isVisible = msg.params.payload.state === "Visible";

        // Search entertainment items
        var isEntertainmentDirty = false;
        for (var i = 0; i < this._masterEntertainmentDataList.items.length; ++i)
        {
            if (this._masterEntertainmentDataList.items[i].appData.appName === appName
                && this._masterEntertainmentDataList.items[i].appData.isVisible != isVisible)
            {
                isEntertainmentDirty = true;
                this._masterEntertainmentDataList.items[i].appData.isVisible = isVisible;
            }
        }

        // Update the Entertainment context if it is currently displayed.
        if (isEntertainmentDirty
            && this._currentContext
            && this._currentContext.ctxtId === "Entertainment"
            && this._currentContextTemplate)
        {
            var dataList = this._buildEntertainmentDataList();
            this._currentContextTemplate.list2Ctrl.setDataList(dataList);
            this._currentContextTemplate.list2Ctrl.updateItems(0, dataList.items.length - 1);
        }

        // Search application items
        var isApplicationsDirty = false;
        for (var i = 0; i < this._masterApplicationDataList.items.length; ++i)
        {
            if (this._masterApplicationDataList.items[i].appData.appName === appName
                && this._masterApplicationDataList.items[i].appData.isVisible != isVisible)
            {
                isApplicationsDirty = true;
                this._masterApplicationDataList.items[i].appData.isVisible = isVisible;
            }
        }

        // Update the Applications context if it is currently displayed.
        if (isApplicationsDirty
            && this._currentContext
            && this._currentContext.ctxtId === "Applications"
            && this._currentContextTemplate)
        {
            var dataList = this._buildApplicationsDataList();
            this._currentContextTemplate.list2Ctrl.setDataList(dataList);
            this._currentContextTemplate.list2Ctrl.updateItems(0, dataList.items.length - 1);
        }

        // Now that we are listening to StatusMenuVisible for Comm items (for email only)
        // we want to ensure any messages sent by other apps that were previously ignored are still ignored
        // Shoki6 ONLY
        if (appName === "email")
        {
            // Search communication items - avalajh
            var isCommunicationDirty = false;
            for (var i = 0; i < this._communicationsDataList.items.length; ++i)
            {
                if (this._communicationsDataList.items[i].appData.appName === appName
                    && this._communicationsDataList.items[i].appData.isVisible != isVisible)
                {
                    isCommunicationDirty = true;
                    this._communicationsDataList.items[i].appData.isVisible = isVisible;
                }
            }

            // Update the Communication context if it is currently displayed.
            if (isCommunicationDirty
                && this._currentContext
                && this._currentContext.ctxtId === "Communication"
                && this._currentContextTemplate)
            {
                var dataList = this._buildCommunicationDataList();
                this._currentContextTemplate.list2Ctrl.setDataList(dataList);
                this._currentContextTemplate.list2Ctrl.updateItems(0, dataList.items.length - 1);
            }
        }
    }
};
systemApp.prototype._StatusMenuUSBAudioMsgHandler = function(msg)
{
    if (msg.params && msg.params.payload && msg.params.payload.statusMenuUSBAudio)
    {
        // Update cached values for the USB device status
        var status = msg.params.payload.statusMenuUSBAudio;
        var mmuiEvent = "";
        var textIdWithDevice = "";
        var textIdWithoutDevice = "";
        var masterIndex = -1;
        if (status.usbAB === "USB_A")
        {
            mmuiEvent = "SelectUSBA";
            textIdWithDevice = "UsbAudioAWithDevice";
            textIdWithoutDevice = "UsbAudioA";
        }
        else if (status.usbAB === "USB_B")
        {
            mmuiEvent = "SelectUSBB";
            textIdWithDevice = "UsbAudioBWithDevice";
            textIdWithoutDevice = "UsbAudioB";
        }

        // Update the master entertainment data list which contains all items
        for (var i = 0; i < this._masterEntertainmentDataList.items.length; ++i)
        {
            if (this._masterEntertainmentDataList.items[i].appData.mmuiEvent === mmuiEvent)
            {
                masterIndex = i;

                var isAvailable = status.statusMenu.appStatus === "Available";
                var name = status.displayName;
                this._masterEntertainmentDataList.items[i].disabled = !isAvailable;
                if (isAvailable && typeof name === 'string' && name.length > 0)
                {
                    this._masterEntertainmentDataList.items[i].text1Id = textIdWithDevice;
                    this._masterEntertainmentDataList.items[i].text1SubMap = { deviceName: name };
                }
                else
                {
                    this._masterEntertainmentDataList.items[i].text1Id = textIdWithoutDevice;
                    this._masterEntertainmentDataList.items[i].text1SubMap = null;
                }

                if (!isAvailable)
                {
                    // Clear nowplaying icon just in case it was still shown for this now unavailable item
                    this._masterEntertainmentDataList.items[i].image1 = "";
                }
            }
        }

        // Update current context if needed
        if (this._currentContext && this._currentContext.ctxtId === "Entertainment" && this._currentContextTemplate)
        {
            var list = this._currentContextTemplate.list2Ctrl;
            for (var i = 0; i < list.dataList.items.length; ++i)
            {
                if (list.dataList.items[i].appData.mmuiEvent === mmuiEvent)
                {
                    list.dataList.items[i] = this._masterEntertainmentDataList.items[masterIndex];
                    list.updateItems(i, i);
                }
            }
        }
    }
};

systemApp.prototype._StatusMenuBTAudioMsgHandler = function(msg)
{
    if (msg.params && msg.params.payload)
    {
        var masterIndex = -1;

        // Update the master entertainment data list which contains all items
        for (var i = 0; i < this._masterEntertainmentDataList.items.length; ++i)
        {
            if (this._masterEntertainmentDataList.items[i].appData.mmuiEvent === "SelectBTAudio")
            {
                masterIndex = i;

                var isAvailable = msg.params.payload.appStatus === "Available";
                var deviceName = msg.params.payload.deviceName;

                // NOTE: This message does not enable/disable the BTAudio menu item.
                // (The StatusMenu message will enable it on startup.)

                if (isAvailable && typeof deviceName === "string" && deviceName.length > 0)
                {
                    this._masterEntertainmentDataList.items[i].text1Id = "BluetoothWithDevice";
                    this._masterEntertainmentDataList.items[i].text1SubMap = { deviceName: deviceName };
                }
                else
                {
                    this._masterEntertainmentDataList.items[i].text1Id = "Bluetooth";
                    this._masterEntertainmentDataList.items[i].text1SubMap = null;
                }

                if (!isAvailable)
                {
                    // Clear nowplaying icon just in case it was still shown for this now unavailable item
                    this._masterEntertainmentDataList.items[i].image1 = "";
                }
            }
        }

        // Update current context if needed
        if (this._currentContext && this._currentContext.ctxtId === "Entertainment" && this._currentContextTemplate)
        {
            var list = this._currentContextTemplate.list2Ctrl;
            for (var i = 0; i < list.dataList.items.length; ++i)
            {
                if (list.dataList.items[i].appData.mmuiEvent === "SelectBTAudio")
                {
                    list.dataList.items[i] = this._masterEntertainmentDataList.items[masterIndex];
                    list.updateItems(i, i);
                }
            }
        }
    }
};

systemApp.prototype._StatusUpdateEcoEnergyMsgHandler = function(msg)
{
    if (msg.params && msg.params.payload)
    {
        log.debug("Received _StatusUpdateEcoEnergy message: " + msg.params.payload.fuelType);

        // Determine correct text ID, based on vehicle fuel type
        var fuelType = msg.params.payload.fuelType;
        var newText1Id;
        switch (fuelType)
        {
            case "HEV":
                newText1Id = "EcoenergyAppHEV";
                break;

            case "GAS":
            default:
                newText1Id = "EcoenergyApp";
                break;
        }

        // Search application items for the "ecoenergy" application
        var isApplicationsDirty = false;
        for (var i = 0; i < this._masterApplicationDataList.items.length; ++i)
        {
            if ((this._masterApplicationDataList.items[i].appData.mmuiEvent === "SelectEcoEnergy") &&
                (this._masterApplicationDataList.items[i].text1Id != newText1Id))
            {
                // Found the app, and it's text ID needs to change, so change it
                isApplicationsDirty = true;
                this._masterApplicationDataList.items[i].text1Id = newText1Id;
            }
        }

        // Update the Applications context if it is currently displayed.
        if (isApplicationsDirty
            && this._currentContext
            && this._currentContext.ctxtId === "Applications"
            && this._currentContextTemplate)
        {
            var dataList = this._buildApplicationsDataList();
            this._currentContextTemplate.list2Ctrl.setDataList(dataList);
            this._currentContextTemplate.list2Ctrl.updateItems(0, dataList.items.length - 1);
        }
    }
};

// Handle message to update the notification counts in the Communication context.
systemApp.prototype._StatusUpdateNotificationsHandler = function(msg)
{
    if (msg.params && msg.params.payload && msg.params.payload.messageCounts)
    {
        // Update message counts and the notifications list item displayed in the Communication menu
        var countEmail = msg.params.payload.messageCounts.countEmail;
        var countSMS = msg.params.payload.messageCounts.countSMS;
        var total = countEmail + countSMS;

        var showMessageIcon = total > 0;
        framework.common.setSbIcon("Message", showMessageIcon);

        for (var i = 0; i < this._communicationsDataList.items.length; ++i)
        {
            switch (this._communicationsDataList.items[i].appData.mmuiEvent)
            {
                case 'SelectNotifications':
                    this._communicationsDataList.items[i].disabled = (total === 0);
                    this._communicationsDataList.items[i].label1 = (total === 0) ? "" : total.toString();
                    break;

                case 'SelectSms':
                    this._communicationsDataList.items[i].label1 = (countSMS === 0) ? "" : countSMS.toString();
                    break;

                case 'SelectEmail':
                    this._communicationsDataList.items[i].label1 = (countEmail === 0) ? "" : countEmail.toString();
                    break;
            }
        }

        // Update current context if needed
        if (this._currentContext && this._currentContext.ctxtId === "Communication" && this._currentContextTemplate)
        {
			var dataList = this._buildCommunicationDataList();
			this._currentContextTemplate.list2Ctrl.setDataList(dataList);
			this._currentContextTemplate.list2Ctrl.updateItems(0, dataList.items.length - 1);
        }
    }
};

systemApp.prototype._ShowStateSBN_SiriActiveMsgHandler = function()
{
	framework.common.endStateSbn(this.uiaId, 'SiriStatusNotification', "vrStatus"); //End the SBN if displayed
	var params = {
            sbnStyle : 'Style02',
			text1Id : 'VoiceRecognition',
            imagePath1 : 'apps/system/images/IcnSiriSBN.png'
        };
	framework.common.showStateSbn(this.uiaId, 'SiriStatusNotification', "vrStatus", params);
}

systemApp.prototype._TimedSBN_SiriErrorMsgHandler = function()
{
	framework.common.endStateSbn(this.uiaId, 'SiriStatusNotification', "vrStatus");//End the SBN if displayed
	var params = {
            sbnStyle : 'Style01',
			text1Id : 'ErrorWhileStartingSiri',
        };
	framework.common.startTimedSbn(this.uiaId, 'SiriStatusNotification', "vrStatus", params);
}

systemApp.prototype._TimedSBN_VoiceNotSupportedMsgHandler = function()
{
	framework.common.endStateSbn(this.uiaId, 'SiriStatusNotification', "vrStatus");//End the SBN if displayed
	var params = {
            sbnStyle : 'Style02',
			text1Id : 'VoiceNotSupported',
			imagePath1 : 'common/images/icons/IcnSbnMicUnavail.png'
        };
	framework.common.startTimedSbn(this.uiaId, 'VoiceNotificationErr', "vrStatus", params);
}

systemApp.prototype._RemoveStateSBN_SiriActiveMsgHandler = function()
{
	framework.common.endStateSbn(this.uiaId, 'SiriStatusNotification', "vrStatus");
}

systemApp.prototype._TimedSBN_SourceNotAvailableMsgHandler = function(msg)
{
    if (msg.params && msg.params.payload)
    {
        var params = {
            sbnStyle : 'Style02',
            imagePath1 : 'common/images/icons/IcnListBtConnType_Music.png'
        };

        switch (msg.params.payload.audioSource)
        {
            case "BTAudio":
            case "Pandora":
            case "Stitcher":
            case "AhaRadio":
                params.text1Id = "AudioSourceNotAvailableBTAudio";
                break;

            case "USBAudio":
            case "USB_A":
            case "USB_B":
                params.text1Id = "AudioSourceNotAvailableUSB";
                break;

            case "CD":
                params.text1Id = "AudioSourceNotAvailableCD";
                break;

            case "DVD":
                params.text1Id = "AudioSourceNotAvailableDVD";
                break;

            case "TV":
                params.text1Id = "AudioSourceNotAvailableTV";
                break;
        }

        framework.common.startTimedSbn(this.uiaId, 'AudioSourceNotAvailable', "errorNotification", params);
    }
};

systemApp.prototype._updateEntertainmentNowPlayingIcon = function(audioSource, isPlaying, dataList)
{
    for (var i = 0; i < dataList.items.length; ++i)
    {
        if (isPlaying)
        {
            // Set the icon on the audioSource item and clearing it on all other items
            dataList.items[i].image1 = (dataList.items[i].appData.audioSourceId === audioSource) ? "common/images/icons/IcnListEntNowPlaying_En.png" : "";
        }
        else
        {
            // Only remove the icon from the audioSource item given. This is important because when switching audio sources the
            // "Off" and "Play" messages do not necessarily come in that order.
            if (dataList.items[i].appData.audioSourceId === audioSource)
            {
                dataList.items[i].image1 = "";
            }
        }
    }
};

systemApp.prototype._StatusUpdateAudioSourceMsgHandler = function(msg)
{
    if (msg.params && msg.params.payload)
    {
        var audioSource = msg.params.payload.statusAudio.audioSource;
        var isPlaying = msg.params.payload.statusAudio.audioActive === "Play";

        // Set the icon in the masterEntertainment data list so it is persisted between template instances
        this._updateEntertainmentNowPlayingIcon(audioSource, isPlaying, this._masterEntertainmentDataList);

        // Update current context if needed
        if (this._currentContext && this._currentContext.ctxtId === "Entertainment" && this._currentContextTemplate)
        {
            var list = this._currentContextTemplate.list2Ctrl;
            this._updateEntertainmentNowPlayingIcon(audioSource, isPlaying, list.dataList);
            list.updateItems(0, list.dataList.items.length - 1);
        }
    }
};

systemApp.prototype._StatusUpdateMissedCallCountMsgHandler = function(msg)
{
    var count = "";
    if (msg.params && msg.params.payload && msg.params.payload.missedCallCount > 0)
    {
        count = msg.params.payload.missedCallCount.toString();
    }

    // Update this._communicationsDataList
    for (var i = 0; i < this._communicationsDataList.items.length; ++i)
    {
        if (this._communicationsDataList.items[i].appData.mmuiEvent === "SelectCallHistory")
        {
            this._communicationsDataList.items[i].label1 = count;
        }
    }

    // Update current context if needed
    if (this._currentContext && this._currentContext.ctxtId === "Communication" && this._currentContextTemplate)
    {
        var list = this._currentContextTemplate.list2Ctrl;
        for (var i = 0; i < list.dataList.items.length; ++i)
        {
            if (list.dataList.items[i].appData.mmuiEvent === "SelectCallHistory")
            {
                list.dataList.items[i].label1 = count;
                list.updateItems(i, i);
            }
        }
    }
};

systemApp.prototype._WarningStatusCountMsgHandler = function(msg)
{
    if (msg.params && msg.params.payload)
    {
        var count = "";
        var icon = "";
        if (msg.params.payload.warningcount > 0)
        {
            count = msg.params.payload.warningcount.toString();
            icon = "common/images/icons/IcnListCarHealthAmber_Small.png";
        }

        for (var i = 0; i < this._masterApplicationDataList.items.length; ++i)
        {
            if (this._masterApplicationDataList.items[i].appData.mmuiEvent === "SelectWarnGuide")
            {
                this._masterApplicationDataList.items[i].label1 = count;
                this._masterApplicationDataList.items[i].image2 = icon;
                break;
            }
        }

        // Update current context if needed
        if (this._currentContext && this._currentContext.ctxtId === "Applications" && this._currentContextTemplate)
        {
            var list = this._currentContextTemplate.list2Ctrl;
            for (var i = 0; i < list.dataList.items.length; ++i)
            {
                if (list.dataList.items[i].appData.mmuiEvent === "SelectWarnGuide")
                {
                    list.dataList.items[i].label1 = count;
                    list.dataList.items[i].image2 = icon;
                    list.updateItems(i, i);
                }
            }
        }
    }
};

systemApp.prototype._StatusUpdateSchedMaintHandler = function(msg)
{
    if (msg.params && msg.params.payload)
    {
        var isDue = msg.params.payload.due;

        // Update the master list
        for (var i = 0; i < this._masterApplicationDataList.items.length; ++i)
        {
            if (this._masterApplicationDataList.items[i].appData.mmuiEvent === "SelectSchedMaint")
            {
                if (isDue)
                {
                    this._masterApplicationDataList.items[i].image2 = "apps/system/images/IcnListServiceNotifications_En.png";
                }
                else
                {
                    this._masterApplicationDataList.items[i].image2 = "";
                }
                break;
            }
        }

        // Update the current context if needed
        if (this._currentContext && this._currentContext.ctxtId === "Applications" && this._currentContextTemplate)
        {
            var list = this._currentContextTemplate.list2Ctrl;
            for (var i = 0; i < list.dataList.items.length; ++i)
            {
                if (list.dataList.items[i].appData.mmuiEvent === "SelectSchedMaint")
                {
                    if (isDue)
                    {
                        list.dataList.items[i].image2 = "apps/system/images/IcnListServiceNotifications_En.png";
                    }
                    else
                    {
                        list.dataList.items[i].image2 = "";
                    }
                    list.updateItems(i, i);
                }
            }
        }
    }
};

systemApp.prototype._AtSpeedMsgHandler = function(msg)
{
    //At speed will disable the speed Restricted items
	this._AtSpeedDisabled = true;
	this._updateSpeedRestrictedApps(this._AtSpeedDisabled);
};

systemApp.prototype._NoSpeedMsgHandler = function(msg)
{
    //At speed will Enable the speed Restricted items
	this._AtSpeedDisabled = false;
	this._updateSpeedRestrictedApps(this._AtSpeedDisabled);
};

/**************************
 * Control callbacks
 **************************/

/*
 * Callback for the Main Menu Context icon button clicks
 * @param   mainMenuObj (Object) Reference to the MainMenuCtrl
 * @param   appData     (Object) Data passed in by the app when the control was instantiated
 * @param   params      (Object) Contains label for the selected icon
 */
systemApp.prototype._selectCallbackHomeScreen = function(mainMenuCtrlObj, appData, params)
{
    log.debug("_selectCallbackHomeScreen() called for icon: " + params.icon);

    var icon = params.icon;

    switch(icon)
    {
        case "app":
            framework.sendEventToMmui(this.uiaId, "SelectApplications");
            break;
        case "com":
            framework.sendEventToMmui(this.uiaId, "SelectCommunication");
            break;
        case "ent":
            framework.sendEventToMmui(this.uiaId, "SelectEntertainment");
            break;
        case "nav":
            framework.sendEventToMmui(this.uiaId, "SelectNavigation");
            break;
        case "set":
            framework.sendEventToMmui(this.uiaId, "SelectSettings");
            break;
    }
};

/*
 * Select callback for Applications, Communication, and Entertainment contexts.
 * Appdata for these list items is a hash: { appName: "", mmuiEvent: ""}
 */
systemApp.prototype._menuItemSelectCallback = function(listCtrlObj, appData, params)
{
    framework.sendEventToMmui(this.uiaId, appData.mmuiEvent, {}, params.fromVui);
};

///////////////////////////////////////////////////////////////////////////////
// Communication
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._CommCtxtContextIn = function()
{
    var scrollTo = 0;

    // We cannot use the data list in the current context here, becuase it doesn't exist yet
    // so we use _buildCommunicationDataList() just like _readyCommunications() will
    var dataList = this._buildCommunicationDataList();

    // If Settings (the last item) is the only enabled item then scroll to that. Otherwise default focus behavior.
    var any = false;
    for (var i = 0; i < dataList.items.length - 1; ++i)
    {
        if (dataList.items[i].disabled === false)
        {
            any = true;
        }
    }

    if (any === false)
    {
        var lastIndex = dataList.items.length - 1;
        if (dataList.items[lastIndex].disabled === false)
        {
            scrollTo = lastIndex;
        }
    }

    this._contextTable["Communication"].controlProperties.List2Ctrl.scrollTo = scrollTo;
    this._contextTable["Communication"].controlProperties.List2Ctrl.focussedItem = scrollTo;
};
///////////////////////////////////////////////////////////////////////////////
// Applications
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._readyApplications = function()
{
    // This context has dynamically visible items (see StatusMenuVisible message) so the list contents is rebuilt.
    if (this._currentContext && this._currentContextTemplate)
    {
        this._AtSpeedDisabled = framework.common.getAtSpeedValue();

		var dataList = this._buildApplicationsDataList();
        this._currentContextTemplate.list2Ctrl.setDataList(dataList);
        this._currentContextTemplate.list2Ctrl.updateItems(0, dataList.items.length - 1);

		// Checking for Speed Restricted Items For Applications Screen
		this._updateSpeedRestrictedApps(this._AtSpeedDisabled);
    }
};

// Build list data from this._masterApplicationDataList based on the currently visible items.
systemApp.prototype._buildApplicationsDataList = function()
{
    var dataList = {
        itemCountKnown : true,
        itemCount : 0,
        items : [],
        vuiSupport: true
    };

    for (var i = 0; i < this._masterApplicationDataList.items.length; ++i)
    {
        if (this._masterApplicationDataList.items[i].appData.isVisible)
        {
            dataList.items.push(this._masterApplicationDataList.items[i]);
        }
    }
    dataList.itemCount = dataList.items.length;

    return dataList;
};

///////////////////////////////////////////////////////////////////////////////
// Entertainment
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._readyEntertainment = function()
{
    // This context has dynamically visible items (see StatusMenuVisible message) so the list contents is rebuilt.
    if (this._currentContext && this._currentContextTemplate)
    {
        this._AtSpeedDisabled = framework.common.getAtSpeedValue();
		var dataList = this._buildEntertainmentDataList();
        this._currentContextTemplate.list2Ctrl.setDataList(dataList);
        this._currentContextTemplate.list2Ctrl.updateItems(0, dataList.items.length - 1);

		// Checking for Speed Restricted Items For Entertainment Screen
		this._updateSpeedRestrictedApps(this._AtSpeedDisabled);
    }
};

// Build list data from this._masterEntertainmentDataList based on the currently visible items.
systemApp.prototype._buildEntertainmentDataList = function()
{
    var dataList = {
        itemCountKnown : true,
        itemCount : 0,
        items : [],
        vuiSupport: true
    };

    for (var i = 0; i < this._masterEntertainmentDataList.items.length; ++i)
    {
        if (this._masterEntertainmentDataList.items[i].appData.isVisible)
        {
            dataList.items.push(this._masterEntertainmentDataList.items[i]);
        }
    }
    dataList.itemCount = dataList.items.length;

    return dataList;
};


///////////////////////////////////////////////////////////////////////////////
// Communication - avalajh
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._readyCommunication = function()
{
    // This context has dynamically visible items (see StatusMenuVisible message) so the list contents is rebuilt.
    if (this._currentContext && this._currentContextTemplate)
    {
        this._AtSpeedDisabled = framework.common.getAtSpeedValue();
		var dataList = this._buildCommunicationDataList();
        this._currentContextTemplate.list2Ctrl.setDataList(dataList);
        this._currentContextTemplate.list2Ctrl.updateItems(0, dataList.items.length - 1);

		// Checking for Speed Restricted Items For Communication Screen
		this._updateSpeedRestrictedApps(this._AtSpeedDisabled);
    }
};

// Build list data from this._communicationsDataList based on the currently visible items.
systemApp.prototype._buildCommunicationDataList = function()
{
    var dataList = {
        itemCountKnown : true,
        itemCount : 0,
        items : [],
        vuiSupport: true
    };

    for (var i = 0; i < this._communicationsDataList.items.length; ++i)
    {
        if (this._communicationsDataList.items[i].appData.isVisible)
        {
            dataList.items.push(this._communicationsDataList.items[i]);
        }
    }
    dataList.itemCount = dataList.items.length;

    return dataList;
};


///////////////////////////////////////////////////////////////////////////////
// NoConnectionNotify
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._selectCallbackNoConnectionNotify = function(dialogBtnCtrlObj, appData, params)
{
    switch(this._currentContext.ctxtId)
    {
        case 'NoConnectionNotify':
            switch(appData)
            {
                case 'SelectConnect':
                    framework.sendEventToMmui("system", appData);
                    break;

                case 'Global.No':
                    framework.sendEventToMmui("common", appData);
                    break;
            }
            break;
        }
};

///////////////////////////////////////////////////////////////////////////////
//  NotifyDialog
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._NotifyDialogCtxtTmpltReadyToDisplay = function()
{
    if (this._currentContext.params && this._currentContext.params.payload && this._currentContext.params.payload.messageNotifyData)
    {
        this._currentContextTemplate.dialog3Ctrl.setText2(this._currentContext.params.payload.messageNotifyData.name);
    }
};

systemApp.prototype._NotifyDialogCtxtTmpltDisplayed = function()
{
    // Start timer to dismiss the notification if the user doesn't respond
    var self = this;
    this._NotifyDialogTimeoutId = setTimeout(function() {
        this._NotifyDialogTimeoutId = null;
        framework.sendEventToMmui(self.uiaId, "Timeout");
    }, 10000);
};

systemApp.prototype._NotifyDialogCtxtTmpltNoLongerDisplayed = function()
{
    if (this._NotifyDialogTimeoutId !== null)
    {
        clearTimeout(this._NotifyDialogTimeoutId);
        this._NotifyDialogTimeoutId = null;
    }
};

systemApp.prototype._selectCallbackNotifyDialog = function(controlRef, appData, params)
{
    if (this._NotifyDialogTimeoutId !== null)
    {
        clearTimeout(this._NotifyDialogTimeoutId);
        this._NotifyDialogTimeoutId = null;
    }

    switch (appData)
    {
        case "Global.No":
            framework.sendEventToMmui("common", appData);
            break;

        case "SelectNotifyOff":
            framework.sendEventToMmui(this.uiaId, appData);
            break;

        case "SelectNotifyMessage":
            if (this._currentContext.params && this._currentContext.params.payload)
            {
                var paramsData = {
                    payload : {
                        messageId           : this._currentContext.params.payload.messageNotifyData.messageId,
                        messageNotifyType   : this._currentContext.params.payload.messageNotifyData.messageNotifyType
                    }
                };
                framework.sendEventToMmui(this.uiaId, appData, paramsData);
            }
            break;
    }
};

///////////////////////////////////////////////////////////////////////////////
// NotificationListRetry
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._selectCallbackNotificationListRetry = function(controlRef, appData, params)
{
    switch (appData)
    {
        case "Global.Cancel":
            framework.sendEventToMmui("common", appData);
            break;

        case "SelectRetry":
            framework.sendEventToMmui(this.uiaId, appData);
            break;
    }
};

///////////////////////////////////////////////////////////////////////////////
// NotificationList
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._readyNotificationList = function(readyParams)
{
    log.debug("_readyNotificationList called...");

    if (readyParams)
    {
        readyParams.skipRestore = true;
    }

    var params = {
        "context_in": 0,

        // typedef enum MSG_client_type_e
        // {
        //     /// Used for min valid values range check
        //     MSG_CLIENT_MIN = 0,
        //     /// Invalid value of 0
        //     MSG_CLIENT_INVALID = MSG_CLIENT_MIN,
        //     /// Email client
        //     MSG_CLIENT_EMAIL,
        //     /// SMS/MMS client
        //     MSG_CLIENT_SMS,
        //     /// Settings client
        //     MSG_CLIENT_SETTINGS,
        //     /// Notifications client
        //     MSG_CLIENT_NOTIFICATIONS,
        //     /// Used for max valid values range check
        //     MSG_CLIENT_MAX
        // } MSG_client_type_t;
        "client_type_in": 4,
        "callbacks_in": 0
    };
    framework.sendRequestToAppsdk(this.uiaId, this._msgConnectCallback.bind(this), "msg", "Connect", params);
};

systemApp.prototype._noLongerDisplayedNotificationList = function()
{
    this._closeMsgApiConnection();
};

systemApp.prototype._msgConnectCallback = function(msg)
{
    if (msg && msg.msgType === "methodResponse" && msg.params && msg.params.status === 100)
    {
        this._msgApiConnection = msg.params.connection;
        var params = {
            "connection_in" : this._msgApiConnection,
            "context_in" : 0,
            "request_type" : 3, // MSG_REQUEST_NEW_DATA_STORE_AND_RETRIEVE
        };
        framework.sendRequestToAppsdk(this.uiaId, this._msgGetNewMessagesListCallback.bind(this), "msg", "GetNewMessagesList", params);
    }
    else
    {
        log.error("APPSDK response " + msg.serviceName + " " + msg.methodName + " " + msg.errorType);
        framework.sendEventToMmui(this.uiaId, "NotificationListRetrieveFailure");
        this._closeMsgApiConnection();
    }
};

systemApp.prototype._msgGetNewMessagesListCallback = function(msg)
{
    if (msg && msg.msgType === "methodResponse" && msg.params)
    {
        switch (msg.params.status)
        {
            // Successful retrieval w/ messages
            case 100:
            {
                log.info("####AppSDK Success####");
                this._closeMsgApiConnection();

                var messages = msg.params.message_list.messages;

                var dataList = {
                    itemCountKnown : true,
                    itemCount : 0,
                    items: [],
                    vuiSupport: true
                };

                for (var i = 0; i < messages.length; i++)
                {
                    var item = {
                        appData: { messageId: messages[i].id, name: messages[i].sender },
                        itemStyle : 'style07',
                        styleMod : 'bold',
                        hasCaret : false,
                        text1: messages[i].sender,
                        image1 : '',
                        label1 : utility.formatSmartDateTime(messages[i].datetime, false),
                        label2 : '', // label2 is only set for email's below and left blank for sms.
                        labelWidth : 'wide',
                    };

                    // Set image1 and set appData event name.
                    switch (messages[i].clientType)
                    {
                        // MSG_CLIENT_EMAIL
                        case 1:
                            item.appData.eventId = 'SelectMessageEmail';
                            item.image1 = 'common/images/icons/IcnListEmail_En.png';
                            item.label2 = messages[i].instance;
                            break;

                        // MSG_CLIENT_SMS
                        case 2:
                            item.appData.eventId = 'SelectMessageSMS';
                            item.image1 = 'common/images/icons/IcnListSms_En.png';
                            break;
                    }

                    dataList.items.push(item);
                }

                dataList.itemCount = dataList.items.length;

                if (this._currentContextTemplate && this._currentContextTemplate.list2Ctrl)
                {
                    this._currentContextTemplate.list2Ctrl.setDataList(dataList);
                    this._currentContextTemplate.list2Ctrl.updateItems(0, dataList.itemCount - 1);
                }
                break;
            }

            // Empty list returned
            case 107:
            {
                log.info("AppSDK returned empty message.");
                this._closeMsgApiConnection();
                if (this._currentContextTemplate && this._currentContextTemplate.list2Ctrl)
                {
                    this._currentContextTemplate.list2Ctrl.setLoading(false);
                }
                break;
            }

            // Unrecognized status code
            default:
            {
                log.error("APPSDK response " + msg.serviceName + " " + msg.methodName + " " + msg.errorType);
                if (this._currentContextTemplate && this._currentContextTemplate.list2Ctrl)
                {
                    this._currentContextTemplate.list2Ctrl.setLoading(false);
                }
                framework.sendEventToMmui(this.uiaId, "NotificationListRetrieveFailure");
                this._closeMsgApiConnection();
                break;
            }
        }
    }
    else
    {
        log.error("APPSDK response " + msg.serviceName + " " + msg.methodName + " " + msg.errorType);
        if (this._currentContextTemplate && this._currentContextTemplate.list2Ctrl)
        {
            this._currentContextTemplate.list2Ctrl.setLoading(false);
        }
        framework.sendEventToMmui(this.uiaId, "NotificationListRetrieveFailure");
        this._closeMsgApiConnection();
    }
};

systemApp.prototype._closeMsgApiConnection = function()
{
    if (this._msgApiConnection)
    {
        var params = {
            "connection_in" : this._msgApiConnection,
            "context_in" : 0,
        };
        framework.sendRequestToAppsdk(this.uiaId, function(){}, "msg", "Disconnect", params);
        this._msgApiConnection = null;
    }
};

systemApp.prototype._selectNotificationListItem = function(controlRef, appData, params)
{
    if (appData && appData.eventId)
    {
        switch (appData.eventId)
        {
            case 'SelectMessageEmail':
                var stuff = {
                    payload : {
                        messageId : appData.messageId,
                    }
                };
                framework.sendEventToMmui(this.uiaId, appData.eventId, stuff, params.fromVui);
                break;

            case 'SelectMessageSMS':
                var stuff = {
                    payload : {
                        messageId : appData.messageId,
                    }
                };
                framework.sendEventToMmui(this.uiaId, appData.eventId, stuff, params.fromVui);
                break;

            case 'SelectMissedCall':
                var stuff = {
                    payload : {
                        messageId : appData.messageId,
                    }
                };
                framework.sendEventToMmui(this.uiaId, appData.eventId, stuff, params.fromVui);
                break;
        }
    }
};

///////////////////////////////////////////////////////////////////////////////
// NoDevice
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._selectCallbackNoDevice = function(controlRef, appData, params)
{
    switch (appData)
    {
        case "Global.GoBack":
            framework.sendEventToMmui("common", appData);
            break;

        case "SelectConnect":
            framework.sendEventToMmui(this.uiaId, appData);
            break;
    }
};

///////////////////////////////////////////////////////////////////////////////
// DisplayOff
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._displayOffUserActivity = function(controlRef, appData, params)
{
    framework.sendEventToMmui("system", "DisplayOffGUIActivity");
};

///////////////////////////////////////////////////////////////////////////////
// Disclaimer
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._noMoreDisclaimer = function(controlRef, appData, params)
{
    framework.sendEventToMmui("system", "DisposeIntroVideo");

	// this need only for log
    this._disclaimerTime.remaining = 3500;
    log.debug("Starting a Disclaimer timer with remaining time: " + this._disclaimerTime.remaining);

	framework.sendEventToMmui("common", "Global.Yes");
};

///////////////////////////////////////////////////////////////////////////////
// SystemWarning
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._selectCallbackSystemWarning = function(controlRef, appData, params)
{
    switch (appData)
    {
        case "Global.Yes":
            framework.sendEventToMmui("common", appData);
            break;
    }
};

///////////////////////////////////////////////////////////////////////////////
// EnableRVR
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._selectCallbackEnableRVR = function(controlRef, appData, params)
{
    switch (appData)
    {
        case "Global.Yes":
            framework.sendEventToMmui("common", appData);
            break;
    }
};

///////////////////////////////////////////////////////////////////////////////
// RVRInstructions
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._selectCallbackRVRInstructions = function(controlRef, appData, params)
{
    switch (appData)
    {
        case "Global.Yes":
            framework.sendEventToMmui("common", appData);
            break;
    }
};

///////////////////////////////////////////////////////////////////////////////
// SourceReconnect
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._readySourceReconnect = function()
{
    if (this._currentContext.params &&
        this._currentContext.params.payload &&
        this._currentContextTemplate &&
        this._currentContextTemplate.dialog3Ctrl)
    {
        switch (this._currentContext.params.payload.audioSource)
        {
            case "BTAudio":
                this._currentContextTemplate.dialog3Ctrl.setText1Id("ReconnectBTAudio");
                break;

            case "Pandora":
                this._currentContextTemplate.dialog3Ctrl.setText1Id("ReconnectPandora");
                break;

            case "Stitcher":
                this._currentContextTemplate.dialog3Ctrl.setText1Id("ReconnectStitcher");
                break;

            case "AhaRadio":
                this._currentContextTemplate.dialog3Ctrl.setText1Id("ReconnectAhaRadio");
                break;

            case "USB_A":
            case "USB_B":
            case "USBAudio":
                this._currentContextTemplate.dialog3Ctrl.setText1Id("ReconnectUSB");
                break;

            case "CD":
                this._currentContextTemplate.dialog3Ctrl.setText1Id("ReconnectCD");
                break;

            case "DVD":
                this._currentContextTemplate.dialog3Ctrl.setText1Id("ReconnectDVD");
                break;

            case "TV":
                this._currentContextTemplate.dialog3Ctrl.setText1Id("ReconnectTV");
                break;

            default:
                break;
        }
    }
};

systemApp.prototype._selectSourceReconnect = function(controlRef, appData, params)
{
    switch (appData)
    {
        case "SelectEntertainmentMenu":
            framework.sendEventToMmui(this.uiaId, appData);
            break;
    }
};

///////////////////////////////////////////////////////////////////////////////
// SourceReconnectFailed
///////////////////////////////////////////////////////////////////////////////

systemApp.prototype._readySourceReconnectFailed = function()
{
	if (this._currentContext.params &&
        this._currentContext.params.payload &&
        this._currentContextTemplate &&
        this._currentContextTemplate.dialog3Ctrl)
    {
        switch (this._currentContext.params.payload.audioSource)
        {
            case "BTAudio":
            case "Pandora":
            case "Stitcher":
            case "AhaRadio":
                this._currentContextTemplate.dialog3Ctrl.setText1Id("ReconnectFailedBTAudio");
                break;

            case "USB_A":
            case "USB_B":
            case "USBAudio":
                this._currentContextTemplate.dialog3Ctrl.setText1Id("ReconnectFailedUSB");
                break;

            case "CD":
                this._currentContextTemplate.dialog3Ctrl.setText1Id("ReconnectFailedCD");
                break;

            case "DVD":
                this._currentContextTemplate.dialog3Ctrl.setText1Id("ReconnectFailedDVD");
                break;

            case "TV":
                this._currentContextTemplate.dialog3Ctrl.setText1Id("ReconnectFailedTV");
                break;

            default:
                break;
        }
    }
};

//Siri EnableRVR context ready to Display Function
systemApp.prototype._readyEnableRVR = function()
{
    if (this._currentContext.params &&
        this._currentContext.params.payload &&
        this._currentContextTemplate &&
        this._currentContextTemplate.dialog3Ctrl)
    {
        this._CachedDeviceName = this._currentContext.params.payload.deviceName;
		var subMapObj = {nameOfDevice : this._CachedDeviceName}
		this._currentContextTemplate.dialog3Ctrl.setText1Id("SiriDisabled",subMapObj);

    }
};

//Siri SiriLaunchingError context ready to Display Function
systemApp.prototype._readySiriLaunchingError = function()
{
    if (this._currentContext.params &&
        this._currentContext.params.payload &&
        this._currentContextTemplate &&
        this._currentContextTemplate.dialog3Ctrl)
    {
        this._CachedDeviceName = this._currentContext.params.payload.deviceName;
		var subMapObj = {nameOfDevice : this._CachedDeviceName}
		this._currentContextTemplate.dialog3Ctrl.setText1Id("DisconnectThenReconnect",subMapObj);

    }
};

systemApp.prototype._selectSourceReconnectFailed = function(controlRef, appData, params)
{
    switch (appData)
    {
        case "Global.Yes":
            framework.sendEventToMmui("common", appData);
            break;
    }
};

// Store the Availability Status of Speed Restricted Apps
systemApp.prototype._StatusMenuChanged = function(appName, isDisabled)
{
    for(var i = 0; i < this._SpeedRestrictedApps.length; ++i)
	{
		var speedRestrictedAppName = this._SpeedRestrictedApps[i].appName;
		if(speedRestrictedAppName.indexOf(appName) === 0)
		{
			this._SpeedRestrictedApps[i].status = isDisabled;
		}
	}
};

// Update the items for Speed Restricted Message
systemApp.prototype._updateSpeedRestrictedApps = function(isDisabled)
{
	var status = null;
	var appName = null;
	for(var i = 0; i < this._SpeedRestrictedApps.length; ++i)
	{
		appName = this._SpeedRestrictedApps[i].appName;
		status  =  this._SpeedRestrictedApps[i].status;

		log.info("AppName : "+appName+" is available or unavailable - (true/false)" +status);

		//Checks for Status Availability for the respective AppName
		if(!status)
		{
			this._enableSpeedRestrictedItem(appName, isDisabled, this._masterApplicationDataList);
		}
		// Update the menu list in the current context if needed
		if (this._currentContext && !status)
		{
			switch (this._currentContext.ctxtId)
			{
				case "Communication":
				case "Entertainment":
				case "Applications":
					if (this._currentContextTemplate && this._currentContextTemplate.list2Ctrl)
					{
						var dataList = this._currentContextTemplate.list2Ctrl.dataList;
						for (var j = 0; j < dataList.items.length; ++j)
						{
							if (dataList.items[j].appData.appName === appName)
							{
								log.info("AppName : "+appName+" is found for making it disabled : "+isDisabled);
								dataList.items[j].disabled = isDisabled;
								if (isDisabled)
								{
									// Clear nowplaying icon just in case it was still shown for this now unavailable item
									dataList.items[j].image1 = "";
								}
								this._currentContextTemplate.list2Ctrl.updateItems(j, j);
							}
						}
					}
				break;
			}
		}
    }
};

// Tell framework that system app has finished loading
framework.registerAppLoaded("system", null, true);
