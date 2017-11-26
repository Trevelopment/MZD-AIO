/*
 Copyright 2016 Herko ter Horst
 __________________________________________________________________________

 Filename: _androidautoApp.js
 __________________________________________________________________________
 */

log.addSrcFile("_androidautoApp.js", "_androidauto");

function _androidautoApp(uiaId)
{
    log.debug("Constructor called.");

    // Base application functionality is provided in a common location via this call to baseApp.init().
    // See framework/js/BaseApp.js for details.
    baseApp.init(this, uiaId);

//    framework.sendEventToMmui("common", "SelectBTAudio");

}


/*********************************
 * App Init is standard function *
 * called by framework           *
 *********************************/

/*
 * Called just after the app is instantiated by framework.
 * All variables local to this app should be declared in this function
 */
_androidautoApp.prototype.appInit = function()
{
    log.debug("_androidautoApp appInit  called...");

    //Context table
    //@formatter:off
    this._contextTable = {
        "Start": { // initial context must be called "Start"
            "sbName": "Android Auto",
            "template": "AndroidAutoTmplt",
            "leftBtnStyle" : "goBack",
            "properties" : {

            },// end of list of controlProperties
            "templatePath": "apps/_androidauto/templates/AndroidAuto", //only needed for app-specific templates
            "readyFunction": this._StartContextReady.bind(this),
            "contextOutFunction" : this._StartContextOut.bind(this),
            "noLongerDisplayedFunction" : this._StartContextOut.bind(this)
        } // end of "AndroidAuto"
    }; // end of this.contextTable object
    //@formatter:on

    //@formatter:off
    this._messageTable = {
        // haven't yet been able to receive messages from MMUI
    };
    //@formatter:on

};

/**
 * =========================
 * CONTEXT CALLBACKS
 * =========================
 */

function AAcallCommandServer(method, request, resultFunc)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (xhttp.readyState == 4)
        {
            if (xhttp.status == 200)
            {
                resultFunc(JSON.parse(xhttp.responseText));
            }
            else
            {
                resultFunc(null);
            }
        }
    };
    xhttp.open(method, "http://localhost:9999/" + request, true);
    xhttp.send();
}

function AAdisplayError(location, err)
{
    var psconsole = document.getElementById('aaStatusText');
    if (psconsole != null)
    {
        psconsole.value = psconsole.value + location + ": " + err.toString() + "\n";
    }
}

function AAlogPoll()
{

    try
    {
        AAcallCommandServer("GET", "status",  function(currentStatus)
        {
            if (currentStatus == null)
            {
                AAdisplayError("AAlogPoll", "Can't connect to headunit process");
            }
            else
            {
                //no point updating if not showing this pane
                if (!currentStatus.videoFocus)
                {
                    //put these back to what the JS code thinks they are just incase
                    utility.setRequiredSurfaces(framework._visibleSurfaces, true);

                    if (currentStatus.logPath != null)
                    {
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function()
                        {
                            try
                            {
                                var debugTxt = null;
                                if (xhttp.readyState >= 3 && xhttp.status == 200)
                                {
                                    debugTxt = xhttp.responseText;
                                }
                                else if (xhttp.readyState == 4 && xhttp.status != 200)
                                {
                                    debugTxt = "HTTP Error: readyState " + xhttp.readyState + " status " + xhttp.status + "\n responseText " + xhttp.responseText + "\n";
                                }
                                var psconsole = document.getElementById('aaStatusText');
                                if (debugTxt != null && psconsole != null)
                                {
                                    var atBottom = (psconsole.scrollTop == psconsole.scrollHeight);
                                    psconsole.focus();
                                    psconsole.value = debugTxt;

                                    if(psconsole.length && atBottom)
                                        psconsole.scrollTop = psconsole.scrollHeight;
                                }
                            }
                            catch(err)
                            {
                                AAdisplayError("onreadystatechange", err);
                            }

                        };
                        xhttp.open("GET", "file://" + currentStatus.logPath, true);
                        xhttp.send();
                    }
                }
                else
                {
                    //try again later
                    window.setTimeout(AAlogPoll, 2000);
                }
            }
        });
    }
    catch(err)
    {
        AAdisplayError("AAlogPoll", err);
    }

}

_androidautoApp.prototype._StartContextReady = function ()
{
    framework.common.setSbDomainIcon("apps/_androidauto/aa.png");
    try
    {
        AAcallCommandServer("GET", "status", function(currentStatus)
        {
            if (currentStatus != null)
            {
                if (!currentStatus.videoFocus && currentStatus.connected)
                {
                    var takeFocus = function()
                    {
                        AAcallCommandServer("POST", "takeVideoFocus", function(currentStatus){});
                    };

                    //need to sleep a bit to make sure the pane switch is done otherwise it will blow out our focus change later
                    window.setTimeout(takeFocus, 1000);
                }
            }
            else
            {
                AAdisplayError("_StartContextReady", "Can't connect to headunit process");
            }
        });
    }
    catch(err)
    {
        AAdisplayError("_StartContextReady", err);
    }
};

_androidautoApp.prototype._StartContextOut = function ()
{
    try
    {
        //nothing
    }
    catch(err)
    {
        AAdisplayError("_StartContextOut", err);
    }
};



/**
 * =========================
 * Framework register
 * Tell framework this .js file has finished loading
 * =========================
 */
framework.registerAppLoaded("_androidauto", null, false);
