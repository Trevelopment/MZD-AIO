/*
 Copyright 2012 by Johnson Controls
 __________________________________________________________________________

 Filename: MainMenuCtrl.js
 __________________________________________________________________________

 Project: JCI-IHU
 Language: EN
 Author: agohsmbr
 Date: 4.10.2012
 __________________________________________________________________________

 Description: System Main Menu Control

 Revisions:
 v0.1 (10-April-2012) First Version
 v0.2 (23-May-2012) Cleanup and optimization - awoodhc
 v0.3 (03-Aug-2012) Re-write of MainMenuCtrl with new Studio Assets -awoodhc
 v0.4 (06-Aug-2012) Re-added multicontroller handling -awoodhc
 v0.5 (27-Aug-2012) Updated Control select callback. Removed dummy functions from Main Menu Ctrl -awoodhc
 v0.6 (06-Mar-2013) Updated to v3.80 UI specifications from Studio -apeter9
 __________________________________________________________________________

 */

log.addSrcFile("MainMenuCtrl.js", "system");

function MainMenuCtrl(uiaId, parentDiv, controlId, properties)
{
    this.uiaId = uiaId;
    this.divElt = null;
    this.controlId = controlId;

    this.properties = 
    {
        // (Object) Arbitrary passed back to the app.
        "appData" : null,

        // (Function) Called when the user selects a coin via touch or commander.
        "selectCallback" : null,

        // (Number) Milliseconds to hold the controller left or right before fast-tilt kicks in. Default 1500.
        "tiltHoldTime" : 1500,

        // (Number) Milliseconds between fast-tilt steps. Default 500.
        "tiltStepTime" : 500,
    };
    
    for (var i in properties)
    {
        this.properties[i] = properties[i];
    }
    
    this._coins = 
    [
        { key : "App", focusTranslateX : 30,  focusTranslateY : -53, hasFocus : false, nameId : "Applications" },
        { key : "Ent", focusTranslateX : -15,   focusTranslateY : -30, hasFocus : false, nameId : "Entertainment" },
        { key : "Com", focusTranslateX : -15,   focusTranslateY : -30, hasFocus : false, nameId : "Communication" },
        { key : "Nav", focusTranslateX : -15,   focusTranslateY : -30, hasFocus : false, nameId : "NavigationTitle" },
        { key : "Set", focusTranslateX : -58, focusTranslateY : -53, hasFocus : false, nameId : "Settings" }
    ];

    this._tiltHoldTimerId = null;
    this._fastTiltStepIntervalId = null;

    this._fullyHighlightedIndex = null; // (Number) The index that currently has the full focus highlight.
    this._lastControllerStartEvent = "";    // (String) Used to ensure the current tabs control instance doesn't process tilt-release events from a previous tabs control instance.
    this._allowInput = true;            // (Boolean) If true, allow mouse down and controller inputs.
    this._allowInputTimerId = null;     // (Handle) setTimeout ID used to unblock input after a short time.
    this._pendingInvokeSelectIndex = null;  // (Number) Index (or null) of the selected coin used to delay the callback until the focus animation completes

    this.createStructure();   
    parentDiv.appendChild(this.divElt);
    this._prvFocus = -1 ;
    this.init();
}

// This function creates the div classes of the Main Menu
MainMenuCtrl.prototype.createStructure = function()
{ 
    this.divElt = document.createElement('div');
    this.divElt.id = this.controlId;
    this.divElt.className = "MainMenuCtrl";
    
    var ellipse = document.createElement('div');
    ellipse.className = "MainMenuCtrlEllipse";
    this.divElt.appendChild(ellipse);

    for (var i = 0; i < this._coins.length; i++)
    {
        var key = this._coins[i].key;

        this._coins[i].div = document.createElement('div');
        this._coins[i].div.className = "MainMenuCtrl" + key + "Div";

        div = document.createElement('div');
        div.className = "MainMenuCtrl" + key + "Focus";
        this._coins[i].div.appendChild(div);

        var div = document.createElement('div');
        div.className = "MainMenuCtrl" + key + "Normal";
        this._coins[i].div.appendChild(div);

        this._coins[i].highlight = document.createElement('div');
        this._coins[i].highlight.className = "MainMenuCtrl" + key + "Highlight";

        this._coins[i].setHighlightEndBinder = this._setHighlightEnd.bind(this, i);
        this._coins[i].div.addEventListener('OTransitionEnd', this._coins[i].setHighlightEndBinder, false);
    }

    // Add coins and highlight in correct z-order

    this.divElt.appendChild(this._coins[1].highlight);
    this.divElt.appendChild(this._coins[2].highlight);
    this.divElt.appendChild(this._coins[3].highlight);

    this.divElt.appendChild(this._coins[1].div);
    this.divElt.appendChild(this._coins[2].div);
    this.divElt.appendChild(this._coins[3].div);

    this.divElt.appendChild(this._coins[4].highlight);
    this.divElt.appendChild(this._coins[4].div);

    this.divElt.appendChild(this._coins[0].highlight);
    this.divElt.appendChild(this._coins[0].div);

    // Create text area for icon names
    this._iconNameDiv = document.createElement('div');
    this._iconNameDiv.className = "MainMenuCtrlIconName";
    this.divElt.appendChild(this._iconNameDiv);
}

// This function will be used to set the default main menu icon (maybe not always com)
MainMenuCtrl.prototype.init = function()
{
    // Record the hit test area for each normal and focus coin (can only be done after the divs are added to the DOM)
    for (var i = 0; i < this._coins.length; i++)
    {
        this._computeHitAreas(this._coins[i]);

        // Draw hit test circles for visual testing.
        // this._drawCoinBorder(this._coins[i].normalHitArea, "blue");
        // this._drawCoinBorder(this._coins[i].focusHitArea, "yellow");
    }

    this._mouseDownCallback = this._mouseDown.bind(this);
    this._mouseUpCallback = this._mouseUp.bind(this);
    this._mouseMoveCallback = this._mouseMove.bind(this);
    document.body.addEventListener("mousedown", this._mouseDownCallback);

    // (Boolean) Flag used to avoid exploding coin animations when the transition occurs for something other than touch or controller input.
    this._hasInvokedSelectCallback = false;

    // Set initial focus flag on the navigation coin
    this._setFocus(2);
}

// Debug helper function to draw a border around each hit area.
MainMenuCtrl.prototype._drawCoinBorder = function(hitArea, color)
{
    // Add a circle to the document to show the hit area.
    var r = Math.sqrt(hitArea.r2);
    var d = r * 2;
    var x = hitArea.x - r;
    var y = hitArea.y - r - 64;

    var style = 'position:absolute; left:' + x + 'px; top:' + y + 'px; border:1px solid ' + color + '; width:' + d + 'px; height:' + d + 'px; z-index:999; border-radius:999px';

    var div = document.createElement('div');
    div.style = style;
    this.divElt.appendChild(div);
}

MainMenuCtrl.prototype._computeHitAreas = function(coin)
{
    var div = coin.div;
    var w = coin.div.offsetWidth;
    var h = coin.div.offsetHeight;

    var radius = h / 2;
    coin.normalHitArea = {
        x : div.offsetLeft + w / 2,
        y : div.offsetTop + h / 2 + 64, // account for the status bar
        r2 : radius * radius,
    };

    h = h * 1.2;
    w = w * 1.2;
    radius = h / 2;
    coin.focusHitArea = {
        x : div.offsetLeft + w / 2 + coin.focusTranslateX,
        y : div.offsetTop + h / 2 + 64 + coin.focusTranslateY, // account for the status bar
        r2 : radius * radius,
    };

    coin.currentHitArea = coin.normalHitArea;
}

MainMenuCtrl.prototype._mouseDown = function(evt)
{
    if (this._allowInput)
    {
        var index = this._hitTestEvent(evt);
        if (index !== -1)
        {
            if (this._getFocus() == -1)
            {
                framework.common.stealFocus();
            }
            // Install mousemove / mouseup handlers to implement touch-move behavior.
            document.body.addEventListener("mousemove", this._mouseMoveCallback);
            document.body.addEventListener("mouseup", this._mouseUpCallback);

            this._setFocus(index);
            this._setHighlight(index);
        }
    }
};

MainMenuCtrl.prototype._mouseUp = function(evt)
{
    document.body.removeEventListener("mousemove", this._mouseMoveCallback);
    document.body.removeEventListener("mouseup", this._mouseUpCallback);

    var index = this._hitTestEvent(evt, true);
    if (index === -1)
    {
        // Also test the normal hit area for the two side coins because these coins move when focussed.
        // This avoids the scenario where the user touches the coin, it gets focus and expands, but upon touch-release
        // the hit test doesn't return a hit and we don't change contexts.
        var f = this._getFocus();
        if (f === 0 || f === 4)
        {
            var hitArea = this._coins[f].normalHitArea;
            if (this._hitTestHelper(evt.x, evt.y, hitArea))
            {
                index = f;
            }
        }
    }

    if (index !== -1)
    {
        framework.common.beep("Short", "Touch");
        this._invokeSelectCallback(index);
    }
};

MainMenuCtrl.prototype._mouseMove = function(evt)
{
    var index = this._hitTestEvent(evt);
    if (index !== -1)
    {
        // User is touching a coin so move focus and highlight
        this._setFocus(index);
        this._setHighlight(index);
    }
};

// Perform a hit test of the given mouse event and return the index of the coin hit, or -1 if no hit.
MainMenuCtrl.prototype._hitTestEvent = function(evt)
{
    var hitIndex = -1;
    var order = [0, 4, 1, 2, 3]; // We test the outside coins first because they overlap the three middle coins.
    for (var i = 0; i < order.length; ++i)
    {
        var hitArea = this._coins[ order[i] ].currentHitArea;

        if (this._hitTestHelper(evt.pageX, evt.pageY, hitArea))
        {
            hitIndex = order[i];
            break;
        }
    }
    return hitIndex;
};

MainMenuCtrl.prototype._hitTestHelper = function(x, y, hitArea)
{
    var dx = x - hitArea.x;
    var dy = y - hitArea.y;
    var distance = dx * dx + dy * dy;
    return (distance < hitArea.r2);
};

// Sets the hightlight to the coin with the given index and removes it from all other coins.
// Call this with an invalid index such as -1 to clear the visible highlight effects from the screen.
MainMenuCtrl.prototype._setHighlight = function(index)
{
    if (this._fullyHighlightedIndex !== index)
    {
        this._fullyHighlightedIndex = null;

        if (index === -1)
        {
            this._prvFocus = this._getFocus();
        }
        else
        {
            this._prvFocus = -1;
        }

        var name = "";
        for (var i = 0; i < this._coins.length; i++)
        {
            if (i === index)
            {
                this._coins[i].div.classList.add("MainMenuCtrlCoinFocus");
                this._coins[i].highlight.classList.add("Visible");
                this._coins[i].currentHitArea = this._coins[i].focusHitArea;
                name = framework.localize.getLocStr(this.uiaId, this._coins[i].nameId);
            }
            else if (this._coins[i].highlight.style.opacity !== "0")
            {
                this._coins[i].div.classList.remove("MainMenuCtrlCoinFocus");
                this._coins[i].highlight.classList.remove("Visible");
                this._coins[i].currentHitArea = this._coins[i].normalHitArea;
            }
        }

        if ( name != "")
        {
            // TODO: workaround for remoteUI text. Do not override with blank text
            this._iconNameDiv.innerHTML = name;
        }
    }
};

MainMenuCtrl.prototype.setText = function(text)
{
    this._iconNameDiv.innerHTML = text;
};

// TODO: Workaround: Add better logic involving common. Focus should not be gained by app iteself mutually. Can be given by common (handleControllerEvents) or stolen (stealFocus).
// This restores the focus on the previous icon, if carPlay had focus before and was removed.
MainMenuCtrl.prototype.getRemoteUiButtonStatus = function(enabled)
{
    if(!enabled && this._iconNameDiv.innerHTML != name && this._prvFocus != -1)
    {
        this._setHighlight(this._prvFocus) ;
    }
};

// Called when the focus animation on a coin ends.
MainMenuCtrl.prototype._setHighlightEnd = function(index, evt)
{
    if (evt.currentTarget.classList.contains("MainMenuCtrlCoinFocus"))
    {
        this._fullyHighlightedIndex = index;
        if (this._pendingInvokeSelectIndex !== null)
        {
            log.debug("_setHighlightEnd: invoking pending select callback on index " + this._pendingInvokeSelectIndex);
            var tmp = this._pendingInvokeSelectIndex;
            this._pendingInvokeSelectIndex = null;
            this._invokeSelectCallback(tmp);
        }
    }
};

// Return the index of the coin that currently has focus.
MainMenuCtrl.prototype._getFocus = function()
{
    for (var i = 0; i < this._coins.length; i++)
    {
        if (this._coins[i].hasFocus)
        {
            return i;
        }
    }
    return -1;
};

// Set focus to the coin with the given index.
MainMenuCtrl.prototype._setFocus = function(index)
{
    for (var i = 0; i < this._coins.length; i++)
    {
        this._coins[i].hasFocus = (i === index);
    }
};

// Invoke the select callback to the application.
MainMenuCtrl.prototype._invokeSelectCallback = function(index)
{
    if (0 <= index && index < 5)
    {
        // Temporarily block input to allow time for a context change transition.
        // ** DO NOT **  block input indefinitely in case MMUI does not send a context change.
        if (this._allowInput)
        {
            this._allowInput = false;
            this._allowInputTimerId = setTimeout(function(){
                this._allowInput = true;
                this._allowInputTimerId = null;
            }.bind(this), 1000);
        }

        if (index === this._fullyHighlightedIndex)
        {
            this._hasInvokedSelectCallback = true;
            if (this.properties.selectCallback)
            {
                var icon = this._coins[index].key.toLowerCase();
                this.properties.selectCallback(this, this.properties.appData, { "icon" : icon });
            }
        }
        else
        {
            log.info("_invokeSelectCallback: Select callback delayed because coin is not fully highlighted yet.");
            this._pendingInvokeSelectIndex = index;
        }
    }
};

// A support function to move the focus left or right from the current focus position. Pass -1 to move left, pass +1 to move right.
MainMenuCtrl.prototype._offsetFocus = function(direction)
{
    var index = this._getFocus();
    index += direction;

    if (index < 0)
    {
        index = 0;
    }
    if (index > 4)
    {
        index = 4;
    }

    if (index !== this._getFocus())
    {
        this._setFocus(index);
        this._setHighlight(index);
    }
};

// Start a timer while the user holds tilt.
MainMenuCtrl.prototype._startTiltHoldTimer = function()
{
    this._cancelFastTilt();

    // Only start the fast tilt hold timer if fast-tilting would have any effect from the current focus position.
    if ((this._fastTiltDirection === -1 && this._getFocus() > 0) ||
        (this._fastTiltDirection === 1 && this._getFocus() < 4))
    {
        this._tiltHoldTimerId = setTimeout(this._startFastTiltInterval.bind(this), this.properties.tiltHoldTime);
    }
};

// Invoked when the user holds tilt long enough to start fast tilting.
MainMenuCtrl.prototype._startFastTiltInterval = function()
{
    framework.common.beep("Long", "Multicontroller");
    this._tiltHoldTimerId = null;
    this._fastTiltStep();
    this._fastTiltStepIntervalId = setInterval(this._fastTiltStep.bind(this), this.properties.tiltStepTime);
};

// Cancels all fast-tilt or tilt-hold timers.
MainMenuCtrl.prototype._cancelFastTilt = function()
{
    clearTimeout(this._tiltHoldTimerId);
    clearInterval(this._fastTiltStepIntervalId);

    this._tiltHoldTimerId = null;
    this._fastTiltStepIntervalId = null;
};

// Periodic interval invoked during fast tilting.
MainMenuCtrl.prototype._fastTiltStep = function()
{
    this._offsetFocus(this._fastTiltDirection);
};

// Handle multicontroller events.
MainMenuCtrl.prototype.handleControllerEvent = function(eventId)
{
    var response = "consumed";
    switch(eventId)
    {
        case "lostFocus":
            this._setHighlight(-1);
            response = "consumed";
            break;

        case "acceptFocusInit": // intentional fall through
        case "acceptFocusFromTop":
            if (this._prvFocus != -1)
            {
                this._setHighlight(this._prvFocus) ;
            }
            else if (this._getFocus() != -1)
            {
                this._setHighlight(this._getFocus()) ;
            }
            else
            {
                // set default focus - communication // remove hardcoding later
                this._setHighlight(2) ;
            }
            break;

        case "ccw":
            if (this._allowInput)
            {
                this._offsetFocus(-1);
            }
            break;

        case "cw":
            if (this._allowInput)
            {
                this._offsetFocus(1);
            }
            break;

        case "leftStart":
            if (this._allowInput)
            {
                this._lastControllerStartEvent = eventId;
                this._fastTiltDirection = -1;
                this._offsetFocus(this._fastTiltDirection);
                this._startTiltHoldTimer();
            }
            break;

        case "left":
            if (this._allowInput && this._lastControllerStartEvent === "leftStart")
            {
                this._cancelFastTilt();
            }
            this._lastControllerStartEvent = "";
            break;

        case "rightStart":
            if (this._allowInput)
            {
                this._lastControllerStartEvent = eventId;
                this._fastTiltDirection = 1;
                this._offsetFocus(this._fastTiltDirection);
                this._startTiltHoldTimer();
            }
            break;

        case "right":
            if (this._allowInput && this._lastControllerStartEvent === "rightStart")
            {
                this._cancelFastTilt();
            }
            this._lastControllerStartEvent = "";
            break;

        case "selectStart":
            if (this._allowInput)
            {
                this._lastControllerStartEvent = eventId;
                this._setHighlight(this._getFocus());
            }
            break;

        case "select":
            if (this._allowInput && this._lastControllerStartEvent === "selectStart")
            {
                this._invokeSelectCallback(this._getFocus());
            }
            this._lastControllerStartEvent = "";
            break;
        case "upStart":
            if (this._allowInput)
            {
                this._lastControllerStartEvent = "";
                response = "giveFocusUp";
            }
            break;

        case "up":
            // do nothing
            break;
        default:
            // do nothing
            // throws many warnings. Made debug for now. // change once have consistent multicontroller event handeling acrross common
            log.debug("MainMenuCtrl.handleControllerEvent - event " + eventId + " is not handled. Sending response ignored");
            response = "ignored";
            break;
    }

    return response;
};

MainMenuCtrl.prototype.startTransitionFrom = function()
{
    if (this._hasInvokedSelectCallback)
    {
        var index = this._getFocus();
        switch (index)
        {
            case 0: // fallthrough
            case 4:
                this._coins[index].div.classList.add("MainMenuCtrlCoinAExplode");
                this._coins[index].highlight.classList.add("MainMenuCtrlHighlightExplode");
                break;

            case 1: // fallthrough
            case 2: // fallthrough
            case 3:
                this._coins[index].div.classList.add("MainMenuCtrlCoinBExplode");
                this._coins[index].highlight.classList.add("MainMenuCtrlHighlightExplode");
                break;

            default:
                break;
        }
    }
};

MainMenuCtrl.prototype.endTransitionTo = function()
{
    this._iconNameDiv.classList.add("Visible");
};

MainMenuCtrl.prototype.getContextCapture = function()
{
    var capture = {};
    capture.focusedIcon = this._getFocus();
    log.debug("MainMenuCtrl.prototype.getContextCapture " + capture.focusedIcon);
    return capture;
};

MainMenuCtrl.prototype.restoreContext = function(capture)
{
    if (capture && typeof capture.focusedIcon === "number")
    {
        this._setFocus(capture.focusedIcon);
        log.debug("MainMenuCtrl.prototype.restoreContext " + capture.focusedIcon);
    }
};

MainMenuCtrl.prototype.finishPartialActivity = function()
{
    this._cancelFastTilt();

    // Null out the selectCallback to prevent any inadvertant callbacks while/after this template is destroyed.
    this.properties.selectCallback = null;
};

MainMenuCtrl.prototype.cleanUp = function()
{
    // delete obj reference
    delete this.properties;

    document.body.removeEventListener("mousemove", this._mouseMoveCallback);
    document.body.removeEventListener("mousedown", this._mouseDownCallback);
    document.body.removeEventListener("mouseup", this._mouseUpCallback);

    for (var i = 0; i < this._coins.length; i++)
    {
        this._coins[i].div.removeEventListener('OTransitionEnd', this._coins[i].setHighlightEndBinder);
    }

    if (this._allowInputTimerId)
    {
        clearTimeout(this._allowInputTimerId);
        this._allowInputTimerId = null;
    }

    this._cancelFastTilt();
};

framework.registerCtrlLoaded("MainMenuCtrl");
