/*
 Copyright 2012 by Johnson Controls
 __________________________________________________________________________

 Filename: diagApp.js
 __________________________________________________________________________

 Project: JCI-IHU
 Language: EN
 Author: asahum
 Date:  11-Oct-2012 
 __________________________________________________________________________

 Description: IHU GUI Test Screen Diagnostics App
 Revisions:
 v0.1 (11-October-2012)  diagApp created - asahum
 v0.2 (12-November-2012) New Message Handler is added for DataResponce - arsu
                         Hard coded string is removed - arsu
 v0.3 (21-November-2012) Changes made for Commander routine 65 - arsu
 v0.4 (27-November-2012) New message handler "CommanderResponse" is added for 
                         65 routine - arsu
                         Event added for END button - arsu
 v0.5 (11-December-2012) New message handler "ClearScreen" is added for - asahum
 v0.6 (09-January-2013)  fix for "When any of the TestScreen Ids are running, then Enter button should be disabled". - asahum
 v0.7 (29-January-2013)  fix for "In the Test Screen, the test screen ID entry needs to be limited to two digits.". - asahum
 v0.8 (12-Febuary-2013)  On "Timeout","Invalid","Complete" and "Precondition not met conditions" all button should be enable. - asahum
 v0.9 (20-Febuary-2013)  Redesign the GUI, as per new design buttons state will come from MMUI - asahum
 v0.10(28-Febuary-2013)  implementation of  section 2.1.9 Commander Behavior of Test Screen SRS 3.80 - asahum
 v0.11(26-April-2013)    changed all the input and textarea element to div element in TestCtrl.js- asahum
 _________________________________________________________________________
 
 */
log.addSrcFile("diagApp.js", "diag");

function diagApp(uiaId)
{
    //log.info("diagApp constructor called...");
    baseApp.init(this, uiaId);
    
    //Initialization
    this._cachedTestStatus = null;
    this._cachedGUIState = null;
    this._cachedTestInfo = new Array();;
    this._cachedDataResponseStatus = null;
    this._buttonValue = "EXIT";
    this._cachedData = "";
    this._cachedEndOfDataFlag = false;
    this._allTestIds = new Array();
    this._allTestName = new Array();
    this._cachedTestModeState = "NormalTestMode";
    this._prevCachedTestModeState = "NormalTestMode";
    this._isNormalTest = true;
    this._totalNumberOfTestId = 0;
    this._endOfTestIdList = true;
    this._prevGUIState = "";
}


/**************************
 * Standard App Functions *
 **************************/

/*
 * Called just after the app is instantiated by framework.
 */
diagApp.prototype.appInit = function()
{
    //log.info(" diagApp appInit  called...");
    if (framework.debugMode)
    {
        utility.loadScript("apps/diag/test/diagAppTest.js");
    }

    //@formatter:off
    this._contextTable = {
        //Diagnostics
        "Diagnostics" : {
            "template" : "TestTmplt",
            "templatePath": "apps/diag/templates/Test",
            "controlProperties" : {
                "TestCtrl" : {
                    "enterCallback" : this._DiagnosticsEnterCallback.bind(this),
                    "exitCallback": this._DiagnosticsExitCallback.bind(this),
                    "clearCallback": this._DiagnosticsClearCallback.bind(this),
                    "longPressCallback": this._DiagnosticsLongPressCallback.bind(this),
                    "buttonValue" : this._buttonValue,
                    "settleTime" : 20000,
                    "value" : "",
                    "keyPressCallback" : this._DiagnosticsKeyPressCallback.bind(this)
                }, // end of properties for "TestCtrlCtrl"
            }, // end of list of controlProperties
            "readyFunction" : this._DiagnosticsReadyToDisplay.bind(this),
        } // end of "Diagnostics"
    };// end of this.contextTable

    //@formatter:off
    this._messageTable = {
        "TestStatus" : this._TestStatusMsgHandler.bind(this),
        "TestInfo" : this._TestInfoMsgHandler.bind(this),
        "GUIState" : this._GUIStateMsgHandler.bind(this),
        "DataResponse" : this._DataResponseStatusMsgHandler.bind(this),
        "ClearScreen" : this._ClearScreenStatusMsgHandler.bind(this),
        "TestModeStatus" : this._TestModeStatusMsgHandler.bind(this),
        //"StateSbn_SystemFailure" : this._ErrorSBNMsgHandler.bind(this),
        //"EndStateSbn_SystemFailure" : this._EndErrorSBNMsgHandler.bind(this),
    };// end of this._messageTable
    
    //@formatter:on
}

/**************************
 * Context handlers
 **************************/

//Diagnostics Ready function
diagApp.prototype._DiagnosticsReadyToDisplay = function(params)
{
    //log.info("inside _DiagnosticsReadyToDisplay");
    
    //Successfully loaded the Diag screen, update the same to MMUI
    framework.sendEventToMmui(this.uiaId, "DiagLoaded");
    
    if(params && params.skipRestore !== null)
    {
        params.skipRestore = true;
    }
    
    if(this._cachedTestStatus)
    {
        if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId === "Diagnostics" )
        {
            this._updateStatusTestCtrl(this._currentContextTemplate);
        }
    }
    else
    {
        //log.info("Test Status not available "+this._cachedTestStatus);
    }
    if(this._cachedInputData)
    {
        if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId === "Diagnostics" )
        {
            this._currentContextTemplate.testCtrl.setInput(this._cachedInputData);
        }
    }
    else
    {
        //log.info("Test Input not available "+this._cachedInputData);
    }
    if(this._cachedTestData && this._cachedTestData.testId && this._cachedTestData.testName && this._endOfTestIdList)
    {
        if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId === "Diagnostics" )
        {
            this._currentContextTemplate.testCtrl.setTestIds(this._cachedTestData.testId,this._cachedTestData.testName);
        }
    }
    if(this._cachedGUIState)
    {
        if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId === "Diagnostics" )
        {
            this._updateGUIStateTestCtrl(this._currentContextTemplate);
        }
    }
    else
    {
        this._currentContextTemplate.testCtrl.activateEnter(false);
        this._currentContextTemplate.testCtrl.isTestRunning(false,!this._isNormalTest);
    }
    if(this._enterState !== null)
    {
        this._currentContextTemplate.testCtrl.activateEnter(this._enterState);
    }
    if(this._dataWindowUpdates)
    {
        if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId === "Diagnostics" )
        {
            this._currentContextTemplate.testCtrl.setData(this._dataWindowUpdates);
        }
    }
    else
    {
        //log.info("Test Data not available "+this._dataWindowUpdates);
    }
    if(this._cachedTestModeState)
    {
        this._handleTestModeStatus();
    }
    else
    {
        //log.info("TestMode State is not available");
    }
}

/**************************
 * Message handlers
 **************************/
//TestMode state
/*diagApp.prototype._ErrorSBNMsgHandler = function(msg)
{
    if(msg && msg.params && msg.params.payload && msg.params.payload && msg.params.payload.failureType != null)
    {
        this._showErrorSBN(msg.params.payload.failureType);
    }
}
*/

//TestMode state
diagApp.prototype._TestModeStatusMsgHandler = function(msg)
{
    if(msg && msg.params && msg.params.payload && msg.params.payload && msg.params.payload.mode)
    {
        this._cachedTestModeState = msg.params.payload.mode;
        this._handleTestModeStatus();
    }
}

// Test Status
diagApp.prototype._TestStatusMsgHandler = function(msg)
{
    if(msg && msg.params && msg.params.payload && msg.params.payload)
    {
        this._cachedTestStatus = msg.params.payload.teststatus;
        if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId === "Diagnostics" )
        {
            //log.info("inside _TestStatusMsgHandler");
            this._updateStatusTestCtrl(this._currentContextTemplate);
        }
    }
}

// TestInfo Response
diagApp.prototype._TestInfoMsgHandler = function(msg)
{
    if(msg && msg.params && msg.params.payload && msg.params.payload.testInfo)
    {
        if(msg.params.payload.totalNoOfTest)
        {
            this._cachedTestInfo = msg.params.payload.testInfo;
            this._totalNumberOfTestId =  msg.params.payload.totalNoOfTest;
            //log.info("TestInfoMsgHandler:::"+this._totalNumberOfTestId +", EndOfList is "+msg.params.payload.endOfList);
            for(var i = 0 ; i < this._totalNumberOfTestId ; i++)
            {
                if(this._cachedTestInfo[i].TestID && this._cachedTestInfo[i].TestName)
                {
                        this._allTestIds.push(this._cachedTestInfo[i].TestID);
                        this._allTestName.push(this._cachedTestInfo[i].TestName);
                }
            }
            if(msg.params.payload.endOfList)
            {
                this._cachedTestData = { testId : null , testName :null };
                this._endOfTestIdList = msg.params.payload.endOfList;
                this._updateTestInfoTestCtrl(this._currentContextTemplate);
            }
            else
            {
                this._endOfTestIdList = msg.params.payload.endOfList;
            }
        }
    }
}

// GUIState Response
diagApp.prototype._GUIStateMsgHandler = function(msg)
{
    if(msg && msg.params && msg.params.payload && msg.params.payload)
    {
        this._cachedGUIState = msg.params.payload;
        if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId === "Diagnostics" )
        {
            var jsonStringofPrevGUIState = JSON.stringify(this._prevGUIState);
            var jsonStringofCachedGUIState = JSON.stringify(this._cachedGUIState);
            if(jsonStringofPrevGUIState !== jsonStringofCachedGUIState)
            {
                this._updateGUIStateTestCtrl(this._currentContextTemplate);
            }
            else
            {
                //log.info("Received Diag GUI Button state has no change");
            }
        }
    }
}

// DataResponse Status
diagApp.prototype._DataResponseStatusMsgHandler = function(msg)
{
    if(msg && msg.params && msg.params.payload && msg.params.payload.dataresponse)
    {
        this._cachedEndOfDataFlag = msg.params.payload.endOfData;
        this._cachedDataResponseStatus = msg.params.payload.dataresponse;
        this._updateDataTestCtrl(this._currentContextTemplate);
    }
}

// Clear Screen Status
diagApp.prototype._ClearScreenStatusMsgHandler = function(msg)
{
    if(this._currentContextTemplate && this._currentContextTemplate.testCtrl)
    {
        this._currentContextTemplate.testCtrl.setStatus(""); // clearing the data of status window
        this._currentContextTemplate.testCtrl.setData("");  //clearing the data of Data Window
        this._currentContextTemplate.testCtrl.setInput("");//clearing the data of input Window
        this._currentContextTemplate.testCtrl.activateEnter(false);//Greying out the Enter Button
    }
    this._cachedGUIState = null;
    this._cachedInputData = null;
    this._dataWindowUpdates = null;
    this._cachedTestStatus = null;
    this._enterState = false;
}

/* //removing error status bar notification
diagApp.prototype._EndErrorSBNMsgHandler = function(msg)
{
    if(msg && msg.params && msg.params.payload)
    {
        //log.info("Ended SBN : " + "DiagErrSBN_Failure"+msg.params.payload.failureType);
        framework.common.endStateSbn(this.uiaId, "DiagErrSBN_Failure"+msg.params.payload.failureType, "systemFailure");
    }
} */
/**************************
 * Control callbacks
 **************************/

diagApp.prototype._DiagnosticsKeyPressCallback = function(diagnosticsCtrlObj,appData, params)
{
    log.debug("DiagnosticsKeyPressCallback ");
    if (params && params.input !== null)
    {        
        var input = parseInt(params.input , 10);
        //this._currentContextTemplate.testCtrl.setData(""); // clearing the data of Data window
        framework.sendEventToMmui(this.uiaId, "ReadDTC", {payload : { testId: input}});
    }
    if(params && params.inputData !== null )
    {
        this._cachedInputData = params.inputData;
    }
    if(params && params.statusData !== null )
    {
         this._cachedTestStatus = params.statusData;
    }
    
    if(params && params.dataWindowData !== null)
    {
        this._dataWindowUpdates = params.dataWindowData;
    }
    if(params && params.enterState !== null)
    {
        this._enterState = params.enterState;
    }
}
 
diagApp.prototype._DiagnosticsEnterCallback = function(diagnosticsCtrlObj,appData, params)
{
    if (params && params.input)
    {        
        var input = parseInt(params.input , 10);
        
        this._currentContextTemplate.testCtrl.setData(""); // clearing the data of Data window
        framework.sendEventToMmui(this.uiaId, "ReadDTC", {payload : { testId: input}});
    }
}

diagApp.prototype._DiagnosticsExitCallback = function(diagnosticsCtrlObj,appData, params)
{
    if(this._buttonValue === "EXIT")
    {
        framework.sendEventToMmui(this.uiaId, "Deactivation");
        this._cachedInputData = null;
        this._dataWindowUpdates = null;
        this._cachedTestData = { testId : null , testName :null };
        this._cachedTestStatus = null;
        //this._enterState = false;
        this._cachedGUIState = null;
    }
    else
    {
        framework.sendEventToMmui(this.uiaId, "EndTest");
    }
}

diagApp.prototype._DiagnosticsClearCallback = function(diagnosticsCtrlObj,appData, params)
{
    framework.sendEventToMmui(this.uiaId, "ClearDTC");
}

diagApp.prototype._DiagnosticsLongPressCallback = function(diagnosticsCtrlObj,appData, params)
{
    if(this._isNormalTest)
    {
        framework.sendEventToMmui(this.uiaId, "ActivateJCITest");
    }
    else
    {
        framework.sendEventToMmui(this.uiaId, "DeactivateJCITest");
    }
}

/**************************
 * Helper functions
 **************************/
diagApp.prototype._updateTestInfoTestCtrl = function(tmplt)
{
    //log.info("UpdateTestInfoTestCtrl ");
    if(this._cachedTestInfo && this._totalNumberOfTestId)
    {
        this._cachedTestData = { testId : this._allTestIds , testName :this._allTestName };
        
        if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId === "Diagnostics" )
        {
            this._totalNumberOfTestId = 0;
            tmplt.testCtrl.setTestIds(this._allTestIds,this._allTestName);
            //log.info("Updated TestCtrl with testIds :: "+this._allTestIds);
            
        }
        this._cachedTestInfo = new Array();
        this._allTestIds = new Array();
        this._allTestName = new Array();
    }
}

diagApp.prototype._updateGUIStateTestCtrl = function(tmplt)
{
    //log.info("Inside _updateGUIStateTestCtrl");
    if(this._cachedGUIState)
    {
        if(this._cachedGUIState.keypadEnabled && this._cachedGUIState.keypadButtonsStatus)
        {
            var keypadButtonsStatusArray = this._cachedGUIState.keypadButtonsStatus;
            for(var i = 0; i < keypadButtonsStatusArray.length; i++)
            {
                if(keypadButtonsStatusArray[i] && keypadButtonsStatusArray[i].KeyPadButtonState === 1)
                {
                    tmplt.testCtrl.activateAnyKey(true,i);
                }
                else
                {
                    tmplt.testCtrl.activateAnyKey(false,i);
                }
            }
        }
        else
        {
            tmplt.testCtrl.activateKeyPad(false);
        }
        tmplt.testCtrl.activateEnter(this._cachedGUIState.enterEnabled);
        this._enterState = this._cachedGUIState.enterEnabled;
        tmplt.testCtrl.activateDel(this._cachedGUIState.delEnabled);
        tmplt.testCtrl.activateClear(this._cachedGUIState.clearEnabled);
        if(this._cachedGUIState.exitText)
        {
            tmplt.testCtrl.setButtonValue(this._cachedGUIState.exitText);
            this._buttonValue = this._cachedGUIState.exitText;
        }
        tmplt.testCtrl.activateExit(this._cachedGUIState.exitEnabled);
        tmplt.testCtrl.isTestRunning(!this._cachedGUIState.enterEnabled,!this._isNormalTest);
        this._prevGUIState = this._cachedGUIState;
    }
}

diagApp.prototype._updateStatusTestCtrl = function(tmplt)
{
    var status = this._cachedTestStatus;
    tmplt.testCtrl.setStatus(status);
}

diagApp.prototype._updateDataTestCtrl = function(tmplt)
{
    if(this._cachedDataResponseStatus)
    {
        if(this._cachedDataResponseStatus.response_message)
        {
            var dataResponse = this._cachedDataResponseStatus.response_message;
            if(this._cachedData)
            {
                
				if(this._cachedData.length > 10000)
				{
					this._cachedData = this._cachedData.substr(0, 10000) ;
					
					this._cachedData = this._cachedData + "..."
					
				}
				this._cachedData = dataResponse + "\n" + this._cachedData;
            }
            else
            {
                this._cachedData = dataResponse;
            }
        }
        if (this._currentContext && tmplt && this._currentContext.ctxtId === "Diagnostics" )
        {
            tmplt.testCtrl.setData(this._cachedData);
        }
        
        this._dataWindowUpdates = this._cachedData;
        if(this._cachedEndOfDataFlag === true)
        {
            this._cachedData = "";
        }
        this._cachedDataResponseStatus = null;
    }
} 

//showing error status bar notification
/*diagApp.prototype._showErrorSBN = function(id)
{
    //create SBN based on the failure type
    //log.info("Started SBN : " + "DiagErrSBN_Failure"+id);
    framework.common.showStateSbn(this.uiaId, "DiagErrSBN_Failure"+id, "systemFailure",
    { sbnStyle : "Style02",imagePath1 : "common/images/icons/IcnListCarHealthAmber_Med.png", text1Id : "SystemNeedsService", text2 : null });
}
*/

//TestModeStatus handling
diagApp.prototype._handleTestModeStatus = function(id)
{
    this._isNormalTest = true;
    var isHDTest = false;
    var isAnyTestRunning = false;
    if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId === "Diagnostics" )
    {
        switch(this._cachedTestModeState)
        {
            case "NormalTestMode":
                this._isNormalTest = true;
                if(this._prevCachedTestModeState === "JCITestMode")
                {
                    this._ClearScreenStatusMsgHandler();//clear the old display of test ids as JCITestMode is false
                }
                break;
            case "JCITestMode":
                this._isNormalTest = false;
                break;
            case "HDCertificationTestMode":
                isHDTest = true;
                break;
            default :
                break;
        }
        if(this._cachedGUIState)
        {
            isAnyTestRunning = !this._cachedGUIState.enterEnabled;
        }

        this._currentContextTemplate.testCtrl.isHDCertificationON(isHDTest);
        this._currentContextTemplate.testCtrl.isTestRunning(isAnyTestRunning,!this._isNormalTest);
    }
    this._prevCachedTestModeState = this._cachedTestModeState;
}
/**************************
 * Framework register
 **************************/
 
framework.registerAppLoaded("diag", null, true);
