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
            "hideHomeBtn" : true,
            "template": "AndroidAutoTmplt",
            "properties" : {
				"customBgImage" : "common/images/FullTransparent.png",
                "keybrdInputSurface" : "TV_TOUCH_SURFACE", 
                "visibleSurfaces" :  ["TV_TOUCH_SURFACE"]    // Do not include JCI_OPERA_PRIMARY in this list            
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
    
    var ws = null;
};

/**
 * =========================
 * CONTEXT CALLBACKS
 * =========================
 */
_androidautoApp.prototype._StartContextReady = function ()
{
    // do anything you want here
	if (!document.getElementById("jquery1-script")) {
		var docBody = document.getElementsByTagName("body")[0];
		if (docBody) {
			var script1 = document.createElement("script");
			script1.setAttribute("id", "jquery1-script");
			script1.setAttribute("src", "/jci/gui/apps/_androidauto/js/jquery.min.js");
			script1.addEventListener('load', function () {
				androidauto();
			}, false);
			docBody.appendChild(script1);
		}
	} else {
		
		androidauto();
	}
};
function startAA()
{
		ws.send("/data_persist/dev/bin/headunit-wrapper; echo 'END' \n");	

}

function androidauto() {
	
	ws = new WebSocket('ws://localhost:9999/');
	
	debugTxt = '';
	
	var credits = document.getElementsByClassName("TemplateWithStatusLeft AndroidAutoTmplt")[0];

	if (!window.aaHasStartedOnce)
		$('#'+credits.id).children().fadeIn().delay(3000).fadeOut();
	else
		$('#'+credits.id).children().fadeOut(0);

	window.aaHasStartedOnce = true;
 
	ws.onopen = function() {
		ws.send("pgrep headunit && echo 'IS_RUNNING' || echo 'NOT_RUNNING' \n");
	};

	
	ws.onmessage = function(event) {
		
		debugTxt = debugTxt + event.data + '\n';
		
		if ( event.data.indexOf("END") > -1) {
			var psconsole = $('#aaStatusText');
			psconsole.focus();
			psconsole.append(debugTxt);

			if(psconsole.length)
				psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());

			var credits = document.getElementsByClassName("TemplateWithStatusLeft AndroidAutoTmplt")[0];

			$('#'+credits.id).children().fadeIn();

            //put these back to what the JS code thinks they are just incase
            utility.setRequiredSurfaces(framework._visibleSurfaces, true);
		}
		else if ( event.data.indexOf("NOT_RUNNING") > -1) {
			startAA();
		}
		else if ( event.data.indexOf("IS_RUNNING") > -1) {
			$('#'+credits.id).remove();

			ws.send("kill -SIGUSR1 $(pgrep headunit) \n");
		}
	}; 
}  

_androidautoApp.prototype._StartContextOut = function ()
{
	ws.send("killall headunit \n");
	ws.close();
};



/**
 * =========================
 * Framework register
 * Tell framework this .js file has finished loading
 * =========================
 */
framework.registerAppLoaded("_androidauto", null, false);
