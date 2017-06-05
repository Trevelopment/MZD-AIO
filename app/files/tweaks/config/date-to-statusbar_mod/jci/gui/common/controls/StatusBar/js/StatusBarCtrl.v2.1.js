/*
 Copyright 2012 by Johnson Controls
 __________________________________________________________________________

 Filename: StatusBarCtrl.js
 __________________________________________________________________________

 Project: JCI-IHU
 Language: EN
 Author: awoodhc
 Date: 05.8.2012
 __________________________________________________________________________

 Description: IHU GUI Status Bar Control

 Revisions:
 v0.1 (8-May-2012)
 v0.2 (06-Aug-2012) Updated Home Button to use ButtonCtrl. Removed deprecated code.
 v0.3 (17-Aug-2012) Restyled to simpler Studio Design.
 v0.4 (28-Sept-2012) Updated Home Button Select Callback
 v0.5 (10-Oct-2012) Added API to show/hide the Home button
 v0.6 (04-Nov-2012) Added API to display App Name in Status Bar
 v0.7 (05-Nov-2012) Added functionality for Diagnostics Entry Point
 v0.8 (13-Nov-2012) Merged Vol function from Nov 6 branch
 v0.9 (16-Nov-2012) Fix for Home button not firing select callback if held too long
 v1.0 (19-Nov-2012) Added API to override internal clock logic with message from MMUI
 v1.1 (27-Nov-2012) Fixed to properly check for clock button before attempting to remove it
 v1.2 (05-Dec-2012) Added API to set state of status bar icons
 v1.3 (12-Mar-2013) Correct callback references. Added appData property. Remvoed setCallback API.
 v1.4 (27-Mar-2013) Removed volDiv as deprecated in favor of SBN.
 __________________________________________________________________________

 */

log.addSrcFile("StatusBarCtrl.js", "common");
//log.addSrcFile("StatusBarCtrl.js", "StatusBarCtrl");
//log.setLogLevel("StatusBarCtrl", "debug");

/*
 * =========================
 * StatusBarCtrl's constructor
 * =========================
 * The StatusBarCtrl is a unique control instantiated by SystemApp to display general information to the user.
 *
 */
function StatusBarCtrl(uiaId, parentDiv, controlId, properties)
{
    // public variables
    this.controlId = controlId;
    this.divElt = null;
    this.uiaId = uiaId;

    this.homeBtn = null;            // (Object) Read-only. Reference to the Home Button control object
    this.clock = null;              // (HTMLElement) Read-only. Reference to the clock DIV.
    this.date = null;              // (HTMLElement) Read-only. Reference to the date DIV.

    // private variables

    this._clockBtn = null;          // (Object) Used to instantiate the clock button for diag entry
    this._iconContainer0 = null;    // (HTMLElement) div that contains icons for row 0
    this._iconContainer1 = null;    // (HTMLElement) div that contains icons for row 1
    this._iconDivs = new Object();  // (Object) Stores references to the Status Bar icon divs
    this._ICON_CONT_MAP = null;     // (Object) Maps Icon name to container name
    this._appNameUiaId = null;      // (String) UIA ID for translating an application name
    this._appNameStringId = null;   // (String) String ID for translating an application name
    this._appNameSubMap = null;     // (Object) Sub-map for translating an application name

    //@formatter:off
    this.properties = {
        "selectCallback": null,     // (Function) Will be called when any button in the status bar is clicked.
        "longPressCallback": null,  // (Function) Will be called when any button in the status bar is long pressed.
        "appData": null,            // Any data that should be passed back when a callback is made
        "sbVisible": true           // (Boolean) Status bar is visible (true) or hidden (false)
    };
    //@formatter:on

    for (var i in properties)
    {
        this.properties[i] = properties[i];
    }

    this.divElt = document.createElement('div');
    this.divElt.id = controlId;
    this.divElt.className = 'StatusBarCtrl';

    this._createStructure();

    // Add the Status Bar to the DOM
    parentDiv.appendChild(this.divElt);

    // Setup initial status bar visibility state
    this._onAnimationEndBinder = this._onAnimationEnd.bind(this);
    this.divElt.addEventListener('animationend', this._onAnimationEndBinder, false);
    this._sbVisible = this.properties.sbVisible;
    this._setVisible(this._sbVisible);
}

/*
 * Helper function to create all necessary DIVs for Status Bar
 */
StatusBarCtrl.prototype._createStructure = function()
{
    // Create the home button
    var homeBtnSelectCallback = this._homeBtnSelected.bind(this); // bind once
    //@formatter:off
    var homeBtnProperties = {
        "buttonBehavior" : "shortAndHold",
        "selectCallback": homeBtnSelectCallback,
        "holdStartCallback" : this._homeBtnLongPress.bind(this),
        "holdStopCallback" : homeBtnSelectCallback,
        "holdTimeout" : 5000,
        "enabledClass": "StatusBarCtrlHomeBtn",
    };
    //@formatter:on

    this.homeBtn = framework.instantiateControl(this.uiaId, this.divElt, "ButtonCtrl", homeBtnProperties, "StatusBar_");

    this._dividerDiv = document.createElement('div');
    this._dividerDiv.className = "StatusBarCtrlDivider";

    this._domainIconDiv = document.createElement('div');
    this._domainIconDiv.className = "StatusBarCtrlDomainIcon";

    // Add the App Name DIV
    this._appNameDiv = document.createElement('div');
    this._appNameDiv.className = 'StatusBarCtrlAppName';

    // Add the date
    this.date = document.createElement('div');
    this.date.className = 'StatusBarCtrlDate';

    // Add the clock
    this.clock = document.createElement('div');
    this.clock.className = 'StatusBarCtrlClock';

    //TODO: Internal clock update logic may need to be removed when BLM is implemented
    this._updateClock();
    this.clockIntId = setInterval(this._updateClock.bind(this), 60000);

    this._ICON_CONT_MAP = {
        "Batt": "Batt",
        "PhoneSignal": "Bluetooth",
        "Bluetooth": "Bluetooth",
        "Music": "Bluetooth",
        "Message": "Message",
        "Roaming": "Roaming",
        "Traffic": "Traffic",
        "WifiSignal": "WifiSignal"
    };

    var iconsR0 = ["Traffic", "Roaming"];
    var iconsR1 = ["Message", "WifiSignal", "Batt", "Bluetooth"];

    var iconsMatrix = [iconsR0, iconsR1];

    for (var row in iconsMatrix)
    {
        this["_iconContainer" + row] = document.createElement('div');
        this["_iconContainer" + row].className = "StatusBarCtrlIconContainer";
        for (var col in iconsMatrix[row])
        {
            var iconDiv = document.createElement('div');
                iconDiv.className = "StatusBarCtrlIcon";

            var name = iconsMatrix[row][col];
            iconDiv.id = "StatusBar_" + name; // set the name to make this easier to find in the DOM

            this._iconDivs[name] = this["_iconContainer" + row].appendChild(iconDiv); // Store the divs to access later
        }

        this.divElt.appendChild(this["_iconContainer" + row]);

    }

    this.divElt.appendChild(this._dividerDiv);
    this.divElt.appendChild(this._domainIconDiv);
    this.divElt.appendChild(this._appNameDiv);
    this.divElt.appendChild(this.date);
    this.divElt.appendChild(this.clock);
};

/*
 * Updates the display clock to match the system clock.
 *  TODO: this function's behavior might need to be removed after BLM clock is implemented
 */
StatusBarCtrl.prototype._updateClock = function()
{
    var currentTime = new Date();

    if (utility.toType(currentTime) == 'number')
    {
        currentTime = new Date(currentTime);
    }
    else if (utility.toType(currentTime) != 'date')
    {
        log.warn("Current time must be given in either Date Object or milliseconds since the Unix epoch.");
    }

    var hours = currentTime.getHours();
    var mins = currentTime.getMinutes();
    var timeStr = "00:00";

    if (isNaN(hours) || isNaN(mins) || currentTime.getTime() <= 0)
    {
        log.warn("Time value is unreadable: the result was NaN, negative, or set to the Unix epoch.");
    }
    else
    {
        // Set the correct clock value
        if (framework.localize.getTimeFormat() == "12hrs")
        {
            if (hours > 12)
            {
                hours -= 12;
            }
            else if (hours == 0)
            {
                hours = 12;
            }

            timeStr = hours + ':' + (mins > 9 ? mins : '0' + mins);

        }
        else if (framework.localize.getTimeFormat() == "24hrs")
        {
            timeStr = (hours > 9 ? hours : '0' + hours) + ':' + (mins > 9 ? mins : '0' + mins);
        }
        else
        {
            log.debug("Cannot read current time format:", framework.localize.getTimeFormat(), "Defaulting to 24hr time.");
            // Default to 24hr
            timeStr = (hours > 9 ? hours : '0' + hours) + ':' + (mins > 9 ? mins : '0' + mins);
        }
    }

    this.date.innerText = utility.formatDateCustom(currentTime);
    this.clock.innerText = timeStr;
};

/*
 * Tells the status bar to show/hide the Home button
 * @param   show    Boolean     true if the home button should be displayed. false if it should be hidden
 */
StatusBarCtrl.prototype.showHomeBtn = function(show)
{
    if (show == false)
    {
        this.homeBtn.divElt.style.display = "none";
        this._dividerDiv.style.display = "none";
    }
    else
    {
        this.homeBtn.divElt.style.display = "block";
        this._dividerDiv.style.display = "block";
    }
};

/* (internal) Called by Common.js
 * Adds/removes the button over the clock that is used to access the Diagnostic App
 * @param   flag    Boolean     true to display the invisible button. false to remove it.
 */
StatusBarCtrl.prototype.enableClockBtn = function(flag)
{
    if (flag)
    {
        if (this._clockBtn)
        {
            // Safety check. There should never be 2 of these
            framework.destroyControl(this._clockBtn);
            this._clockBtn = null;
        }

        var clockBtnProperties = {
            "buttonBehavior": "shortAndLong",
            "holdTimeout" : 5000,
            "longPressCallback": this._clockBtnLongPress.bind(this),
            "enabledClass": "StatusBarCtrlClockBtn",
        };
        this._clockBtn = framework.instantiateControl(this.uiaId, this.divElt, "ButtonCtrl", clockBtnProperties, "StatusBar_");
    }
    else
    {
        if (this._clockBtn)
        {
            framework.destroyControl(this._clockBtn);
            this._clockBtn = null; // be sure to null out variable for next check
        }
    }
};

/*
 * (internal) Called by common. Sets the App name text in the status bar
 * @param label String  Literal text Name to display in the status bar
 */
StatusBarCtrl.prototype.setAppName = function(text)
{
    if (text &&
        (utility.toType(text) == 'string'))
    {
        if (text.indexOf(".png") != -1)
        {
            // if there's no backslashes, assume image is in common
            var isFullPath = (/\/|\\/).test(text);
            var prefix = "";

            if (isFullPath == false)
            {
                prefix = "common/images/icons/";
            }

            this._appNameDiv.style.backgroundImage = "url(" + prefix + text + ")";
            this._appNameDiv.innerText = "";
        }
        else
        {
            this._appNameDiv.innerText = text;
            this._appNameDiv.style.backgroundImage = "none";
        }
    }
    else
    {
        // null or undefined
        this._appNameDiv.innerText = "";
        this._appNameDiv.style.backgroundImage = "none";
        this._appNameUiaId = null;
        this._appNameStringId = null;
        this._appNameSubMap = null;
    }
};

/*
 * (internal) Called by common. Sets the translated App name text in the status bar
 * @param uiaId     String  UiaId of the App the string should be translated for
 * @param labelId   String  StringID to be translated
 * @param subMap    Object  Optional subMap to be placed in the text
 */
StatusBarCtrl.prototype.setAppNameId = function(uiaId, stringId, subMap)
{
    this._appNameUiaId = uiaId;
    this._appNameStringId = stringId;
    this._appNameSubMap = subMap;
    var text = framework.localize.getLocStr(uiaId, stringId, subMap);
    this.setAppName(text);
};

/*
 * Sets an icon in the Status Bar to display between the Home Button and App Name/Image
 * @param   path    String  Path to the icon relative to index.html. Pass null to remove the current icon
 */
StatusBarCtrl.prototype.setDomainIcon = function(path)
{
    log.debug("setDomainIcon(\"" + path + "\")");
    if ((utility.toType(path) == 'string') &&
        (path != ""))
    {
        // if there's no backslashes, assume icon is in common
        var isFullPath = (/\/|\\/).test(path);
        var prefix = "";

        if (isFullPath == false)
        {
            prefix = "common/images/icons/";
        }

        this._domainIconDiv.style.backgroundImage = "url(" + prefix + path + ")";
    }
    else
    {
        this._domainIconDiv.style.backgroundImage = "none";
    }

    log.debug("setDomainIcon(): backgroundImage set to \"" + this._domainIconDiv.style.backgroundImage + "\"");
};

/*
 * Updates the state of a Status Bar Icon
 * @param   name    String  Base Icon name ("Batt", "PhoneSignal", "Roaming", "Traffic", "WifiSignal", "Music", "Bluetooth", "Message")
 * @param   visible Boolean True if the icon should be shown. False if it should be hidden
 * @param   state   String  (Optional) String corrsponding to the state of the icon ("00", "01", "02", "03", "04", "05")
 */
StatusBarCtrl.prototype.setIcon = function(name, visible, state)
{
    var contName = this._ICON_CONT_MAP[name]; // get the container name based on icon name
    var icon = this._iconDivs[contName]; // get the contianer

    if (!icon)
    {
        log.info("There is no support for the requested icon name: " + name);
        return;
    }

    if (visible == true)
    {
        var bg = null;
        if (state)
        {
            if (utility.toType(state) == 'string')
            {
                bg = "url(common/images/icons/IcnSb" + name + "_" + state + ".png)";
            }
            else
            {
                log.warn("Status Bar Icon State must be given in string format");
            }
        }
        else
        {
            bg = "url(common/images/icons/IcnSb" + name + ".png)";
        }

        icon.style.backgroundImage = bg;
        icon.style.display = "inline-block";
    }
    else
    {
        icon.style.display = "none";
    }
};

/*
 * Sets whether a Status Bar Notification is currently displayed.
 * Called by Common so that the Status Bar Control can update its currently displayed items
 */
StatusBarCtrl.prototype.setSbnDisplayed = function(flag)
{
    log.debug("StatusBarCtrl.setSbnDisplayed(" + flag + ")");

    if (flag === true)
    {
        // Hide app name and icons
        this._domainIconDiv.style.opacity = 0;
        this._appNameDiv.style.opacity = 0;

        this._iconContainer0.style.opacity = 0;
        // this._iconContainer1.style.opacity = 0;
    }
    else
    {
        // Restore app name and icons
        this._domainIconDiv.style.opacity = 1;
        this._appNameDiv.style.opacity = 1;

        this._iconContainer0.style.opacity = 1;
        // this._iconContainer1.style.opacity = 1;
    }
};

/*
 * Utility function (called by Common.addControls during a language change)
 * to cause the status bar to re-read/re-translate the translation tables
 * for display format and application title.
 * MPP 08/29/2013  SW00127573
 */
StatusBarCtrl.prototype._refresh = function()
{
    log.debug("_refresh() called...");

    // Get the current time (cached in common)
    var currentTime = framework.common.getCurrentTime();
    this.updateClock(framework.common.getCurrentTime());

    // If we have a translatable application title...
    if (this._appNameUiaId && this._appNameStringId)
    {
        // ... re-translate it with the now-current language
        var text = framework.localize.getLocStr(this._appNameUiaId, this._appNameStringId, this._appNameSubMap);
        this.setAppName(text);
    }
};

/*
 * Updates the clock to display the value given. Value should be given in Unix format
 * @param    currentTime       Number||Date    the current time in number of milliseconds in a date string since midnight of January 1, 1970
 */
StatusBarCtrl.prototype.updateClock = function(currentTime)
{
    // Immediately stop updating the clock internally (TODO: remove internal GUI clock behavior after BLM clock is implemented)

    clearInterval(this.clockIntId);

    if (utility.toType(currentTime) == 'number')
    {
        currentTime = new Date(currentTime);
    }
    else if (utility.toType(currentTime) != 'date')
    {
        log.warn("Current time must be given in either Date Object or milliseconds since the Unix epoch.");
    }

    var hours = currentTime.getHours();
    var mins = currentTime.getMinutes();
    var timeStr = "00:00";

    if (isNaN(hours) || isNaN(mins) || currentTime.getTime() <= 0)
    {
        log.warn("Time value is unreadable: the result was NaN, negative, or set to the Unix epoch.");
    }
    else
    {
        // Set the correct clock value
        if (framework.localize.getTimeFormat() == "12hrs")
        {
            if (hours > 12)
            {
                hours -= 12;
            }
            else if (hours == 0)
            {
                hours = 12;
            }

            timeStr = hours + ':' + (mins > 9 ? mins : '0' + mins);

        }
        else if (framework.localize.getTimeFormat() == "24hrs")
        {
            timeStr = (hours > 9 ? hours : '0' + hours) + ':' + (mins > 9 ? mins : '0' + mins);
        }
        else
        {
            log.info("Cannot read current time format:", framework.localize.getTimeFormat());
            // Default to 24hr
            timeStr = (hours > 9 ? hours : '0' + hours) + ':' + (mins > 9 ? mins : '0' + mins);
        }
    }

    this.date.innerText = utility.formatDateCustom(currentTime);
    this.clock.innerText = timeStr;

};

/*
 * The Select Callback for the homeBtn
 * @param btnObj    (Object) The instance of the button
 * @param btnData   (Object) The data passed in by the app when the button was instantiated
 * @param params    (Object) Optional parameters passed by the control
 */
StatusBarCtrl.prototype._homeBtnSelected = function(btnObj, btnData, params)
{
    var params = {
        "statusBtn": "home"
    };

    if (typeof this.properties.selectCallback == 'function')
    {
        this.properties.selectCallback(this, this.properties.appData, params);
    }
};

/*
 * The Long Press Callback for the homeBtn (only used for Diag entry)
 * @param btnObj    (Object) The instance of the button
 * @param btnData   (Object) The data passed in by the app when the button was instantiated
 * @param params    (Object) Optional parameters passed by the control
 */
StatusBarCtrl.prototype._homeBtnLongPress = function(btnObj, btnData, params)
{
    var params = {
        "statusBtn" : "home"
    };
    if (typeof this.properties.longPressCallback == 'function')
    {
        this.properties.longPressCallback(this, this.properties.appData, params);
    }
};

/*
 * The Long Press Callback for the clock button (only used for Diag entry)
 * @param btnObj    (Object) The instance of the button
 * @param btnData   (Object) The data passed in by the app when the button was instantiated
 * @param params    (Object) Optional parameters passed by the control
 */
StatusBarCtrl.prototype._clockBtnLongPress = function(btnObj, btnData, params)
{
    var params = {
        "statusBtn" : "clock"
    };
    if (typeof this.properties.longPressCallback == 'function')
    {
        this.properties.longPressCallback(this, this.properties.appData, params);
    }
};

/*
 * Utility function to capitalize the first letter of a string.  Used to go
 * from a transition method (e.g. "fade") to a CSS class name component (e.g. "Fade")
 * @param str (String) The string whose first character needs to be capitalized.
 */
StatusBarCtrl.prototype._capitalizeFirstLetter = function(str)
{
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/*
 * Slide/fade the control in or out of view.
 * @param delay (Number) Time in ms before the transition starts.
 * @param duration (Number) Time in ms to animate the actual status bar.
 * @param mthd (String) A value, "fade" or "slide", for the animation method.
 * @param sbVisible (Boolean) true if the status bar should slide/fade into view, false otherwise
 * @param cbComplete (Function) A callback function to call when the animation completes (optional)
 */
StatusBarCtrl.prototype.transitionVisible = function(delay, duration, mthd, sbVisible, cbComplete)
{
    log.debug("transitionVisible " + delay + " " + duration + " " + mthd + " " + sbVisible);
    log.debug("status bar is currently " + (this._sbVisible ? "visible" : "hidden"));

    if ((typeof delay === "number") &&
        (typeof duration === "number") &&
        (typeof mthd === "string") &&
        (typeof sbVisible === "boolean"))
    {
        if (this._sbVisible !== sbVisible)
        {
            // If we're already in the middle of an animation, ...
            if (this.divElt.classList.contains("StatusBarCtrl_Fade_In") ||
                this.divElt.classList.contains("StatusBarCtrl_Fade_Out") ||
                this.divElt.classList.contains("StatusBarCtrl_Slide_In") ||
                this.divElt.classList.contains("StatusBarCtrl_Slide_Out"))
            {
                // ... interrupt the current animation in favor of the new one
                log.debug("ending slide animation early");
                this._onAnimationEnd();

                // Reparent the status bar to its parent, forcing Opera to reload its classes
                this.divElt.parentNode.appendChild(this.divElt);
            }

            this._sbVisible = sbVisible;
            log.debug("Status bar visible? " + this._sbVisible);

            if (delay === 0 && duration === 0)
            {
                log.debug("Snapping visibility", this._sbVisible);
                this._setVisible(this._sbVisible);
            }
            else
            {
                // Convert method specifier into a CSS class name component
                mthd = this._capitalizeFirstLetter(mthd);

                if (this._sbVisible)
                {
                    log.debug("Showing status bar:");

                    // Configure the transition
                    this.divElt.style.animationDelay = delay.toString() + "ms";
                    this.divElt.style.animationDuration = duration.toString() + "ms";

                    // Initiate the transition
                    framework.common.statusBar.divElt.classList.add("StatusBarCtrl_" + mthd + "_In");

                    // Reparent the status bar to its parent, forcing Opera to reload its classes
                    this.divElt.parentNode.appendChild(this.divElt);

                    // Make sure it's visible
                    this.divElt.classList.remove("StatusBarCtrl_Hidden");
                }
                else
                {
                    log.debug("Hiding status bar:");

                    // Configure the transition
                    this.divElt.style.animationDelay = delay.toString() + "ms";
                    this.divElt.style.animationDuration = duration.toString() + "ms";

                    // Initiate the transition
                    framework.common.statusBar.divElt.classList.add("StatusBarCtrl_" + mthd + "_Out");

                    // Reparent the status bar to its parent, forcing Opera to reload its classes
                    this.divElt.parentNode.appendChild(this.divElt);
                }
            }
        }   // end if (this._sbVisible !== sbVisible)
        else
        {
            log.debug("Status bar already in requested state");
        }
    }
    else
    {
        log.error("Invalid parameters passed to StatusBarCtrl.transitionVisible.");
    }
};

StatusBarCtrl.prototype._onAnimationEnd = function()
{
    log.debug("_onAnimationEnd()");
    if (this.divElt.classList.contains("StatusBarCtrl_Slide_In") ||
        this.divElt.classList.contains("StatusBarCtrl_Fade_In"))
    {
        this._setVisible(true);
    }
    else if (this.divElt.classList.contains("StatusBarCtrl_Slide_Out") ||
             this.divElt.classList.contains("StatusBarCtrl_Fade_Out"))
    {
        this._setVisible(false);
    }

    // Make sure all the animation classes are removed
    this.divElt.style.animationDelay = "";
    this.divElt.style.animationDuration = "";
    this.divElt.classList.remove("StatusBarCtrl_Slide_Init");
    this.divElt.classList.remove("StatusBarCtrl_Fade_Init");
    this.divElt.classList.remove("StatusBarCtrl_Slide_In");
    this.divElt.classList.remove("StatusBarCtrl_Fade_In");
    this.divElt.classList.remove("StatusBarCtrl_Slide_Out");
    this.divElt.classList.remove("StatusBarCtrl_Fade_Out");
};

StatusBarCtrl.prototype._setVisible = function(sbVisible)
{
    if (sbVisible)
    {
        this.divElt.classList.remove("StatusBarCtrl_Hidden");
    }
    else
    {
        this.divElt.classList.add("StatusBarCtrl_Hidden");
    }
};

StatusBarCtrl.prototype.setVisible = function(mthd, sbVisible)
{
    log.debug("setVisible() ", mthd, sbVisible);
    this.transitionVisible(0, 500, mthd, sbVisible);
};

StatusBarCtrl.prototype.isVisible = function()
{
    return this._sbVisible;
};

/*
 * Clean Up function called by template
 */
StatusBarCtrl.prototype.cleanUp = function()
{
    clearInterval(this.clockIntId);
    this.homeBtn.cleanUp();

    if (this._clockBtn)
    {
        this._clockBtn.cleanUp();
    }

    this.divElt.removeEventListener('animationend', this._onAnimationEndBinder);

    //delete obj reference
    delete this.properties;

};

framework.registerCtrlLoaded("StatusBarCtrl");
