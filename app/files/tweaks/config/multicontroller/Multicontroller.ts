/*
 Copyright 2012 by Johnson Controls
 __________________________________________________________________________

 Filename: Multicontroller.js
 __________________________________________________________________________

 Project: JCI-IHU
 Language: EN
 Author: agohsmbr
 Date: 05.7.2012
 __________________________________________________________________________

 Description: IHU GUI Multicontroller Event Handler

 Revisions:
 v0.1 - 15-April-2012 Basic multicontroller input events are mapped to the keyboard
 v0.2 - 04-May-2012 Multicontroller now adds DIV to debug panel. -awoodhc
 v0.3 - 6-June-2012 firstMultiEvent param is passed to framework callback function. -awoodhc
 v0.4 - 19-June-2012 Added Support for mousewheel movement to map to rotate multicontroller. Added commenting -awoodhc
 v0.5 - 17-July-2012 Changed key mapping to arrow keys/enter -aganesar
 v0.6 (18-Sept-2012) File is now a part of common. Updated private function names -awoodhc
 v0.7 (19-Oct-2012) Added mouse up handler to block up/down events while framework is not in IDLE state -awoodhc
 v0.8 (31-Oct-2012) Added key release handler to ignore "hold" events sent from LIN simulator. -ahanisk
 v0.9 (21-Nov-2012) Fixed Debug Panel Multicontroller errors. _simulateKeyPress now simulates both down and up event -awoodhc
 v1.0 (21-Dec-2012) Added key press  handling for CW and CCW events. Mouse wheel support is still in there but have to be removed for production
 v1.1 (21-Jan-2013) All keypresses are now checked for occurring inside Debug Panel (while enabled) to prevent unusual behavior -awoodhc
 v1.2 (28-Feb-2013) Add long press/hold support
 */

log.addSrcFile('Multicontroller.js', 'common');

/*
 * =========================
 * Constructor
 * =========================
 * Multicontroller handles multicontroller event input. Event are mapped to the keyboard for PC testing.
 * See this._keyDownHandler for key mapping and tuiEvent names.
 * @tparam  Function    controllerEventCallback     Callback function used to tell framework about controller events
 */
function Multicontroller(controllerEventCallback) {
  this.controllerEventCallback = controllerEventCallback;
  this._mode = 'controllerActive';
  this._btnHeld = false;

  // temp is used for the callbacks because these are global listeners that do not get cleaned up
  let temp = this._registerTouchActive.bind(this);
  document.addEventListener('mousedown', temp, true);

  temp = this._mouseUpEventHandler.bind(this);
  document.addEventListener('mouseup', temp, true);

  temp = this._clickEventHandler.bind(this);
  document.addEventListener('click', temp, true);

  // check onKeyPress...
  temp = this._keyDownHandler.bind(this);
  document.addEventListener('keydown', temp, true);

  temp = this._keyUpHandler.bind(this);
  document.addEventListener('keyup', temp, true);

  // Mousewheel support for CW and CCW events is for development only
  temp = this._mouseWheelHandler.bind(this);
  document.addEventListener('mousewheel', temp, true);
}

/*
 * (internal)
 * Used by the debug panel buttons to simulate a keyboard event and force a multicontroller event
 * @tparam  Number  keycode The key code for the keyboard event that needs to be faked
 * @tparam  Boolean shift   true if the shift key should be "pressed" for the fake keyboard event
 */
Multicontroller.prototype._simulateKeyPress = function(keycode, shift) {
  const fakeEvt = {};
  fakeEvt.simulation = true;
  fakeEvt.which = keycode;
  fakeEvt.shiftKey = shift;
  this._keyDownHandler(fakeEvt);

  // Also create fake up event so that key gets released
  this._keyUpHandler(fakeEvt);
};

/*
 * Mouse Down handler for setting the the mode to "touchActive".
 * Mouse Down events outside the IHU screen area are ignored for correct multicontroller behavior
 * @tparam  Event   evt the mouse down event passed from the event listener
 * @treturn Boolean false   returns false to prevent the default browser behavior
 */
Multicontroller.prototype._registerTouchActive = function(evt) {
  // don't trigger touch events when outside the screen area
  if (evt.pageX <= 800 && evt.pageY <= 480) {
    // this._checkMode("touchActive");
  }

  if (framework.getInputEnabled() === false) {
    log.debug('Multicontroller._clickEventHandler: In Transition. Stopping mouse down event bubble.');
    evt.stopPropagation();
  } else {
    // Tell common about the activity (e.g. for auto-hide status bar)
    framework.common.activityDetected(true, evt);
  }

  // returns false to prevent the default browser behavior
  return false;
};

/*
 * Mouse up handler used to ignore mouse up events when framework is not ready for events.
 * Works by stopping events from propagating through the bubble phase.
 * For isntance, this function prevents up events from firing during transitions.
 * @tparam  Event   evt The mouse event passed from the event listener.
 */
Multicontroller.prototype._mouseUpEventHandler = function(evt) {
  if (framework.getInputEnabled() === false) {
    log.debug('Multicontroller._clickEventHandler: In Transition. Stopping mouse up event bubble.');
    evt.stopPropagation();
  } else {
    // Tell common about the activity (e.g. for auto-hide status bar)
    framework.common.activityDetected(true, evt);
  }
};

/*
 * Mouse click handler used to ignore mouse clicks when framework is not ready for events.
 * Works by stopping events from propagating through the bubble phase.
 * For isntance, this function prevents click events from firing during transitions.
 * @tparam  Event   evt The mouse event passed from the event listener.
 */
Multicontroller.prototype._clickEventHandler = function(evt) {
  if (framework.getInputEnabled() === false) {
    log.debug('Multicontroller._clickEventHandler: In Transition. Stopping click event bubble.');
    evt.stopPropagation();
  }
};

/*
 * Handles mousewheel events and maps the data to a tuiEvent
 * Note: In production, rotate events are handled as the M and N keys in _keyDownHandler.
 * This function is for development only.
 * @tparam  Event   evt the event passed from the event listener.
 * @treturn Boolean     false   false is returned to prevent the default browser behavior
 */
Multicontroller.prototype._mouseWheelHandler = function(evt) {
  if (evt.pageX <= 800 && evt.pageY <= 480) {
    // prevent page scroll if inside GUI area
    evt.preventDefault();
  } else {
    // wheel event was outside GUI area. Ignore GUI functionality.
    return;
  }

  let firstMultiEvent = false;
  let tuiEvent = '';

  if (this._checkMode('controllerActive')) {
    // Discard the first controller event if switching to controllerActive
    firstMultiEvent = true;
  }

  if (evt.wheelDelta > 0) {
    // Rotate Left (CCW)
    tuiEvent = 'ccw';
  } else if (evt.wheelDelta < 0) {
    // Rotate Right (CW)
    tuiEvent = 'cw';
  }

  if (tuiEvent != '') {
    // Notify framework of event
    if (this.controllerEventCallback != null) {
      this.controllerEventCallback(tuiEvent, firstMultiEvent);
    }

    // Tell common about the activity (e.g. for auto-hide status bar)
    framework.common.activityDetected(true, evt, tuiEvent);
  }

  // return false to eliminate the default document behavior (scrolling the window)
  return false;
};

/*
 * Checks the current input mode against the given input mode ("touchActive" or "controllerActive")
 * @tparam  String  mode    The mode to check (because an event has occurred)
 * @treturn Boolean result  true if the mode has changed. false if the mode has not changed.
 */
Multicontroller.prototype._checkMode = function(mode) {
  let result = false;
  if (this._mode != mode) {
    // Mode changed
    result = true;
    this._mode = mode;

    // Note: this callback is called twice on the first multicontroller event.
    // The first call, made here, tells framework about the mode change.
    if (this.controllerEventCallback != null) {
      this.controllerEventCallback(this._mode);
    }
  }
  return result;
};

/*
 * (internal)
 * Gets the Multicontroller mode ("touchActive" or "controllerActive")
 */
Multicontroller.prototype.getMode = function() {
  return this._mode;
};

/*
 * Checks what key was pressed and maps the data to a tuiEvent.
 * If a tuiEvent was mapped, this function lets framework know about the event.
 * @tparam  Event   evt     The keyboard event passed from the event listener.
 */
Multicontroller.prototype._keyDownHandler = function(evt) {
  // If typing in the debug panel, ignore all special behaviors
  if (guiConfig.debugPanelEnabled && evt && evt.srcElement && this._isInDebugPanel(evt.srcElement)) {
    return;
  }

  if (!this._btnHeld) {
    log.debug('Keycode Object passed as: ', evt, evt.which);

    this._btnHeld = true;

    let tuiEvent = '';
    let keycode;
    let firstMultiEvent = false;

    if (window.event && !evt.simulation) {
      keycode = window.event.keyCode;
    } else if (evt) {
      keycode = evt.which;
    }

    if (this._checkMode('controllerActive')) {
      // Discard the first controller event if switching to controllerActive
      firstMultiEvent = true;
    }

    switch (keycode) {
      case 16:
        // SHIFT - Ignore
        tuiEvent = '';
        break;
      case 13:
      // enter - Select
        tuiEvent = 'selectStart';
        break;
      case 37:
      // left arrow - Tilt left
        tuiEvent = 'leftStart';
        break;
      case 39:
      // right arrow - Tilt right
        tuiEvent = 'rightStart';
        break;
      case 38:
      // Up arrow - - Tilt Up
        tuiEvent = 'upStart';
        break;
      case 40:
      // Down arrow - Tilt Down
        tuiEvent = 'downStart';
        break;
      case 8:
      // Backspace - Go Back
      // Prevent the browser from doing a native 'Back' action
        evt.preventDefault(); // Note: this is not called while in debug panel because of check at top of function
        break;
      case 77:
      // 'M' pressed - Clockwise
        tuiEvent = 'cw';
        break;
      case 78:
      // 'N' pressed - Counter-clockwise
        tuiEvent = 'ccw';
        break;
      case 90:
      // 'Z' pressed - Call Button (Stearing wheel)
        tuiEvent = 'callStart';
        break;
      case 88:
      // 'X' pressed - End Call Button (Stearing wheel)
        tuiEvent = 'endcallStart';
        break;
      case 71:
      // 'G' pressed - Mic (Stearing wheel)
        tuiEvent = 'micStart';
        break;
      case 69:
      // 'E' pressed - Entertainment
        tuiEvent = 'entStart';
        break;
      case 82:
      // 'R' pressed - Navigation
        tuiEvent = 'navStart';
        break;
      case 84:
      // 'T' pressed - Favorites
        tuiEvent = 'favStart';
        evt.preventDefault();
        break;
      case 65:
      // 'A' pressed - Volume Up
        tuiEvent = 'volupStart';
        break;
      case 83:
      // 'S' pressed - Volume Down
        tuiEvent = 'voldownStart';
        break;
      default:
      // No action
        break;
    }

    // Note: This does not get called if the "touchActive" or "controllerActive". That is handled in the _checkMode function

    if (tuiEvent != '') {
      // Notify framework of event
      if (this.controllerEventCallback != null) {
        this.controllerEventCallback(tuiEvent, firstMultiEvent);
      }

      // Tell common about the activity (e.g. for auto-hide status bar)
      framework.common.activityDetected(true, evt, tuiEvent);
    } else {
      // Ignore
    }
  }
};

/*
 * Returns true if the given element is found inside the "DebugHtmlDiv" in the debug panel.
 * Used to detect if key presses came from inside the HTML Div (debug buttons) area
 * @param   elt HTMLElement Div to test
 */
Multicontroller.prototype._isInDebugPanel = function(elt) {
  while (elt.parentNode) {
    if (elt.id == 'DebugHtmlDiv' || elt.parentNode.id == 'DebugHtmlDiv') {
      // element is in debug panel
      return true;
    }
    elt = elt.parentNode;
  }
  return false;
};

/*
 * Called after a key is released. This logic prevents multiple events from occurring when a key is held.
 */
Multicontroller.prototype._keyUpHandler = function(evt) {
  // If typing in the debug panel, ignore all special behaviors
  if (guiConfig.debugPanelEnabled && evt && evt.srcElement && this._isInDebugPanel(evt.srcElement)) {
    return;
  }

  this._btnHeld = false;

  let tuiEvent = '';
  let keycode;
  let firstMultiEvent = false;

  if (window.event && !evt.simulation) {
    keycode = window.event.keyCode;
  } else if (evt) {
    keycode = evt.which;
  }

  if (this._checkMode('controllerActive')) {
    // Discard the first controller event if switching to controllerActive
    firstMultiEvent = true;
  }

  switch (keycode) {
    case 13:
      // enter - Select
      tuiEvent = 'select';
      break;
    case 37:
    // left arrow - Tilt left
      tuiEvent = 'left';
      break;
    case 39:
    // right arrow - Tilt right
      tuiEvent = 'right';
      break;
    case 38:
    // Up arrow - - Tilt Up
      tuiEvent = 'up';
      break;
    case 40:
    // Down arrow - Tilt Down
      tuiEvent = 'down';
      break;
    case 8:
    // Backspace - Go Back
      tuiEvent = 'goBack';
      evt.preventDefault(); // Note: this is not called while in debug panel because of check at top of function
      break;
    case 90:
    // 'Z' pressed - Call Button (Stearing wheel)
      tuiEvent = 'call';
      break;
    case 88:
    // 'X' pressed - End Call Button (Stearing wheel)
      tuiEvent = 'endcall';
      break;
    case 71:
    // 'G' pressed - Mic (Stearing wheel)
      tuiEvent = 'mic';
      break;
    case 69:
    // 'E' pressed - Entertainment
      tuiEvent = 'ent';
      break;
    case 82:
    // 'R' pressed - Navigation
      tuiEvent = 'nav';
      break;
    case 84:
    // 'T' pressed - Favorites
      tuiEvent = 'fav';
      evt.preventDefault();
      break;
    case 65:
    // 'A' pressed - Volume Up
      tuiEvent = 'volup';
      break;
    case 83:
    // 'S' pressed - Volume Down
      tuiEvent = 'voldown';
      break;
    default:
    // No action
      break;
  }

  if (tuiEvent != '') {
    // Notify framework of event
    if (this.controllerEventCallback != null) {
      this.controllerEventCallback(tuiEvent, firstMultiEvent);
    }

    // Tell common about the activity (e.g. for auto-hide status bar)
    framework.common.activityDetected(true, evt, tuiEvent);
  } else {
    // Ignore
  }
};

// This file is hardcoded in index.html; instantiated by GuiFramework.js
