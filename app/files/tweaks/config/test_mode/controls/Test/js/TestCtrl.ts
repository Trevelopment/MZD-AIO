
log.addSrcFile('TestCtrl.js', 'common');

function TestCtrl(uiaId, parentDiv, ctrlId, properties) {
  /* This is the constructor of the TestCtrl Component
     Create, set dimensions and assign default name*/

  this.id = ctrlId;
  this.divElt = null;
  this.uiaId = null;
  this.parentDiv = null;

  // @formatter:off
  this.properties = {
    'enterCallback': null, // (function)
    'longPressCallback': null, // (function)                     // Deprecated as per SCR #SW00166935
    'settleTime': null,
    'exitCallback': null, // (function)
    'clearCallback': null, // (function)
    'value': null, // (string)
    'appData': null,
    'dataValue': null,
    'statusValue': null,
    'keyPressCallback': null,
    'buttonValue': null, // For EXIT Lable - arsu
  };
  // @formatter:on
  for (const i in properties) {
    this.properties[i] = properties[i];
  }

  // set control's properties
  this.id = ctrlId; // control's id
  this.parentDiv = parentDiv; // control's immediate parent DOM element
  this.uiaId = uiaId; // uiaId of the owning app
  log.debug('Test Control constructor called with uiaId ' + this.uiaId);

  // control DOM elements
  this.input = null;
  this.data = null;
  this.status = null;
  this.btnEnter = null;
  this.btnExit = null;
  this.btnClear = null;
  this.btnDel = null;
  this.btnTest = null;
  this.btns;

  // handlers
  this.testHandler = this._testHandler.bind(this);
  this.enterHandler = this._enterHandler.bind(this);
  this.exitHandler = this._exitHandler.bind(this);
  this.clearHandler = this._clearHandler.bind(this);
  this.delHandler = this._delHandler.bind(this);
  this.btnSelectCallback = this._btnSelectCallback.bind(this);
  this.mouseUpBodyHandler = this._mouseUpBodyHandler.bind(this);

  this._testIdsArray = [];
  this._testNameArray = [];
  this._isTestRunning = false;
  this._prevFocusedBtnDOM = null;
  this._longPressTimeOut = null;
  this._isHDCertificationON = false;
  this._inputKeyPressed = false; // (Boolean) true: mousedown, false : mouseup

  // initialize
  this.init();
}

TestCtrl.prototype._MOUSEDOWNEVENT = 'mousedown';
TestCtrl.prototype._MOUSEUPEVENT = 'mouseup';
TestCtrl.prototype._MOUSEOUTEVENT = 'mouseout';
TestCtrl.prototype._CLICKEVENT = 'click';

TestCtrl.prototype.init = () => {
  /* CREATE ELEMENTS */
  // create control's container
  this.divElt = document.createElement('div');
  this.divElt.id = this.id;
  this.divElt.className = 'TestCtrl';

  //  title
  this.title = document.createElement('div');
  this.title.className = 'title';
  this.title.appendChild(document.createTextNode('Test Screen'));
  this.divElt.appendChild(this.title);

  // input
  this.input = document.createElement('div');
  this.input.className = 'input';

  this.input.innerText = '# #';
  this.input.style.color = 'grey';
  if (this.properties.value) {
    this.input.innerText = this.properties.value;
    this.input.style.color = 'white';
  }
  this.divElt.appendChild(this.input);

  // data window
  this.data = document.createElement('div');
  this.data.className = 'data';
  this.data.innerText = 'Data Window';
  this.data.style.color = 'grey';
  if (this.properties.dataValue) {
    this.data.innerText = this.properties.dataValue;
    this.data.style.color = 'white';
  }
  this.divElt.appendChild(this.data);

  // status window
  this.status = document.createElement('div');
  this.status.className = 'status';
  this.status.innerText = 'Status Window';
  this.status.style.color = 'grey';

  this.divElt.appendChild(this.status);

  // btn del
  this.btnDel = document.createElement('div');
  this.btnDel.className = 'del';
  this.btnDel.addEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.delHandler, false);
  this.btnDel.innerText = 'DEL';
  this.divElt.appendChild(this.btnDel);

  // btn enter
  this.btnTest = document.createElement('div');
  this.btnTest.className = 'test';
  this.btnTest.addEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.testHandler, false);
  this.btnTest.innerText = 'T/M';
  this.divElt.appendChild(this.btnTest);

  // btn enter
  this.btnEnter = document.createElement('div');
  this.btnEnter.className = 'enter';
  this.btnEnter.addEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.enterHandler, false);
  this.btnEnter.innerText = 'ENTER';
  this.divElt.appendChild(this.btnEnter);

  // btn Clear
  this.btnClear = document.createElement('div');
  this.btnClear.className = 'clear';
  this.btnClear.addEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.clearHandler, false);
  this.btnClear.innerText = 'CLEAR';
  this.divElt.appendChild(this.btnClear);

  // btn exit
  this.btnExit = document.createElement('div');
  this.btnExit.className = 'exit';
  this.btnExit.addEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.exitHandler, false);
  // Setting Button Lable - arsu
  this.btnExit.innerText = this.properties.buttonValue;
  this.divElt.appendChild(this.btnExit);

  // buttons
  this.btns = [];
  for (let i=0; i<10; i++) {
    const temp = document.createElement('div');
    temp.className = ('btn'+i);
    temp.appendChild(document.createTextNode(i));
    temp.setAttribute('data-value', i);
    this.btns[i] = temp;
    this.btns[i].addEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.btnSelectCallback, false);
    this.divElt.appendChild(temp);
  }

  // Add it to the DOM
  this.parentDiv.appendChild(this.divElt);
};

/*
 * =========================
 * Control's private API
 * The followig methods should be used only inside
 * this control.
 * =========================
 */

TestCtrl.prototype._btnSelectCallback = function(e) {
  // set value
  // log.info("inside _btnSelectCallback , is normal test running "+!this._JCITestRunning);

  if (this._inputKeyPressed) {
    document.body.removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.mouseUpBodyHandler);
    for (let i=0; i<10; i++) {
      this.btns[i].removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.btnSelectCallback, false);
    }
    this._inputKeyPressed = false;

    const val = e.target.getAttribute('data-value');
    if (!this._isHDCertificationON) {
      if (this.properties && this.properties.value && this.properties.value.length) {
        const lengthOfTestId = this.properties.value.length;
        if (this._JCITestRunning) {
          if (lengthOfTestId > 4) {
            // restrict the input window to accept upto five digits only
            this.properties.value = (parseInt(this.properties.value, 10)) % 10000;
            if (this.properties.value) {
              // this.childInputText.nodeValue = this.properties.value;
              this.input.innerText = this.properties.value;
              this.input.style.color = 'white';
            }
          }
        } else {
          if (lengthOfTestId > 1) {
            // restrict the input window to accept upto two digits only
            this.properties.value = (parseInt(this.properties.value, 10)) % 10;
            if (this.properties.value) {
              // this.childInputText.nodeValue = this.properties.value;
              this.input.innerText = this.properties.value;
              this.input.style.color = 'white';
            }
          }
        }
      }
      if (this.properties.value && this.properties.value !== '# #') {
        this.properties.value = this.properties.value + val;
      } else {
        this.properties.value = val;
      }
      if (this.properties.value) {
        this.input.innerText = this.properties.value;
        this.input.style.color = 'white';
        if (this.properties.keyPressCallback) {
          const params = {'input': null, 'inputData': this.input.innerText, 'statusData': null, 'dataWindowData': null, 'enterState': null};
          this.properties.keyPressCallback(this, this.properties.appData, params);
        }
      }
      this._checkedValidTestId(this.properties.value);
    } else {
      if (this.properties.keyPressCallback) {
        const params = {'input': val, 'inputData': null, 'statusData': null, 'dataWindowData': null, 'enterState': null};
        this.properties.keyPressCallback(this, this.properties.appData, params);
      }
    }
  } else {
    this._inputKeyPressed = true;

    const data = e.target.getAttribute('data-value');
    this.btns[data].addEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.btnSelectCallback, false);
    document.body.addEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.mouseUpBodyHandler);
  }
};

TestCtrl.prototype._checkedValidTestId = function(n) {
  if (n) {
    log.debug('_checkedValidTestId , this.properties.value : '+n);
    if (this._testIdsArray.length > 0) {
      for (let i = 0; i < this._testIdsArray.length; i++ ) {
        const testId = parseInt(n, 10);
        if (this._testIdsArray[i] === testId) {
          const status = this._testNameArray[i];
          // log.info("_checkedValidTestId , status :: "+status+" - Not Started");
          this.setStatus(status+' - Not Started');
          if (this.properties.keyPressCallback) {
            const params = {'input': null, 'inputData': null, 'statusData': status+' - Not Started', 'dataWindowData': '', 'enterState': true};
            this.properties.keyPressCallback(this, this.properties.appData, params);
          }
          // log.info("_checkedValidTestId ,Enter Activate : true");
          this.activateEnter(true);
          this.setData('');
          break;
        }
        if (i === this._testIdsArray.length -1 ) {
          // log.info("_checkedValidTestId , status :: Invalid");
          this.setStatus('Invalid');
          this.activateEnter(false);
          this.setData('');
          if (this.properties.keyPressCallback) {
            const params = {'input': null, 'inputData': null, 'statusData': 'Invalid', 'dataWindowData': '', 'enterState': false};
            this.properties.keyPressCallback(this, this.properties.appData, params);
          }
          // log.info("_checkedValidTestId ,Enter Activate : false");
          break;
        }
        this.setData('');
        this.setStatus('');
        if (this.properties.keyPressCallback) {
          const params = {'input': null, 'inputData': null, 'statusData': '', 'dataWindowData': '', 'enterState': null};
          this.properties.keyPressCallback(this, this.properties.appData, params);
        }
      }
    } else {
      if (this.properties.keyPressCallback) {
        const params = {'input': null, 'inputData': null, 'statusData': null, 'dataWindowData': null, 'enterState': true};
        this.properties.keyPressCallback(this, this.properties.appData, params);
      }
      // log.info("_checkedValidTestId ,only Enter Activate : true");
      this.activateEnter(true);
    }
  }
};

TestCtrl.prototype._testHandler = function(e) {
  this.properties.longPressCallback(this, this.properties.appData, null);
  this.btnExit.innerText = this.properties.buttonValue;
};

TestCtrl.prototype._enterHandler = function(e) {
  if (this._inputKeyPressed) {
    document.body.removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.mouseUpBodyHandler);
    this.btnEnter.removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.enterHandler, false);
    this._inputKeyPressed = false;

    // fire the callback
    // log.info("[TestCtrl] : enter pressed "+this.btnEnter.className);

    const params = {'input': this.properties.value};
    if (this.properties.enterCallback && this.btnEnter.className === 'enter') {
      log.debug('_enterHandler , this.btnEnter.className '+this.btnEnter.className);
      this.properties.enterCallback(this, this.properties.appData, params);
      this.btnExit.innerText = this.properties.buttonValue; // To set ButtonLable - arsu
    }
  } else {
    this._inputKeyPressed = true;
    this.btnEnter.addEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.enterHandler, false);
    document.body.addEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.mouseUpBodyHandler);
  }
};

TestCtrl.prototype._exitHandler = function(e) {
  if (this._inputKeyPressed) {
    document.body.removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.mouseUpBodyHandler);
    this.btnExit.removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.exitHandler, false);
    this._inputKeyPressed = false;

    // fire the callback
    if (this.properties.exitCallback) {
      this.properties.exitCallback(this, this.properties.appData, null);
      this.btnExit.innerText = this.properties.buttonValue; // To set ButtonLable - arsu
    }
  } else {
    this._inputKeyPressed = true;
    this.btnExit.addEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.exitHandler, false);
    document.body.addEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.mouseUpBodyHandler);
  }
};

TestCtrl.prototype._delHandler = function(e) {
  if (this._inputKeyPressed) {
    document.body.removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.mouseUpBodyHandler);
    this.btnDel.removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.delHandler, false);
    this._inputKeyPressed = false;

    // clear last digit
    const val = this.properties.value.substring(0, this.properties.value.length-1);
    this.properties.value = val;
    if (this.properties.value) {
      this.input.innerText = this.properties.value;
      this.input.style.color = 'white';
      if (this.properties.keyPressCallback) {
        this.setStatus('');
        this.setData('');
        const params = {'input': null, 'inputData': this.input.innerText, 'statusData': '', 'dataWindowData': '', 'enterState': ''};
        this.properties.keyPressCallback(this, this.properties.appData, params);
      }
    } else {
      this.input.innerText = '# #';
      this.input.style.color = 'grey';
      if (this.properties.keyPressCallback) {
        this.setStatus('');
        this.setData('');
        const params = {'input': null, 'inputData': '', 'statusData': '', 'dataWindowData': '', 'enterState': ''};
        this.properties.keyPressCallback(this, this.properties.appData, params);
      }
    }
    this._checkedValidTestId(this.properties.value);
    if (!this.properties.value) {
      this.setStatus('');
      this.activateEnter(false);
      if (this.properties.keyPressCallback) {
        const params = {'input': null, 'inputData': null, 'statusData': '', 'dataWindowData': null, 'enterState': false};
        this.properties.keyPressCallback(this, this.properties.appData, params);
      }
    }
  } else {
    this._inputKeyPressed = true;
    this.btnDel.addEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.delHandler, false);
    document.body.addEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.mouseUpBodyHandler);
  }
};

TestCtrl.prototype._clearHandler = function(e) {
  if (this._inputKeyPressed) {
    document.body.removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.mouseUpBodyHandler);
    this.btnClear.removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.clearHandler, false);
    this._inputKeyPressed = false;

    // fire the callback
    if (this.properties.clearCallback) {
      this.properties.clearCallback(this, this.properties.appData, null);
    }
  } else {
    this._inputKeyPressed = true;
    this.btnClear.addEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.clearHandler, false);
    document.body.addEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.mouseUpBodyHandler);
  }
};

TestCtrl.prototype.setStatus = function(e) {
  // set Status in Status Window
  if (e) {
    const val = e;
    this.status.innerText = val;
    // log.info("Status Data = "+val);
    this.status.style.color = 'white';
  } else {
    this.status.innerText = 'Status Window';
    this.status.style.color = 'grey';
  }
};

TestCtrl.prototype.setData = function(e) {
  // set Status in Status Window
  // log.info("inside set data "+e)
  if (e) {
    const val = e;
    log.debug('Data window = '+val);
    this.data.innerText = val;
    this.data.style.color = 'white';
  } else {
    this.data.innerText = 'Data Window';
    this.data.style.color = 'grey';
  }
};

TestCtrl.prototype.setInput = function(e) {
  // log.info("inside setInput: e is "+e);
  // Set input in Input Window
  const val = e;
  this.properties.value = val;
  if (this.properties.value) {
    this.input.innerText = this.properties.value;
    this.input.style.color = 'white';
    log.debug('Status Data = '+this.properties.value);

    if (this.properties.keyPressCallback) {
      const params = {'input': null, 'inputData': this.input.innerText, 'statusData': null, 'dataWindowData': null, 'enterState': null};
      this.properties.keyPressCallback(this, this.properties.appData, params);
    }
  } else {
    this.input.innerText = '# #';
    this.input.style.color = 'grey';
  }
};

TestCtrl.prototype.isTestRunning = function(stateOfEnter, jciTest) {
  // if State of Enter is disable means some test is running
  this._isTestRunning = stateOfEnter;
  this._JCITestRunning = jciTest;
};

TestCtrl.prototype.isHDCertificationON = function(hdTestState) {
  // if HDState ON or OFF
  this._isHDCertificationON = hdTestState;
};

TestCtrl.prototype.setButtonValue = function(s) {
  // Set Button Value in Input Window
  this.properties.buttonValue = s;
};

TestCtrl.prototype.setTestIds = function(array, nameList) {
  if (array) {
    this._testIdsArray = array;
  }
  if (nameList) {
    this._testNameArray = nameList;
  }
};

/*
 * =========================
 * MULTICONTROLLER
 * =========================
 */

TestCtrl.prototype.handleControllerEvent = function(eventID) {
  // log.info("TestCtrl: handleController() called, eventID: " + eventID);
  // log.info("TestCtrl: handleController()this._isTestRunning: " + this._isTestRunning);
  let returnValue = null;
  if (!this._isTestRunning) {
    switch (eventID) {
      case 'cw':
        // Rotate Right (CW)
        if (!this._timerStarted) {
          const getNextTestIdFunction = this._getNextTestId.bind(this);
          this._timerStarted = setTimeout(getNextTestIdFunction, 200);
        }
        returnValue = 'consumed';
        break;
      case 'ccw':
        // Rotate Left (CCW)
        if (!this._timerStarted) {
          const getPreviousTestIdFunction = this._getPreviousTestId.bind(this);
          this._timerStarted = setTimeout(getPreviousTestIdFunction, 200);
        }
        // this._getPreviousTestId();
        returnValue = 'consumed';
        break;
      case 'selectHold':
        // Select Hold
        break;
      case 'select':
        // Select (press down)
        this._enterHandler();
        // this._multicontrollerSelect();
        break;
      default:
        // No action
        break;
    }
  }
  return returnValue;
};

/*
 * =========================
 * GARBAGE COLLECTION
 * =========================
 */
TestCtrl.prototype.cleanUp = () => {
  // remove event listeners
  this.btnEnter.removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.enterHandler, false);
  this.btnExit.removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.exitHandler, false);
  this.btnClear.removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.clearHandler, false);
  this.btnDel.removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.delHandler, false);
  for (let i=0; i<this.btns.length; i++) {
    this.btns[i].removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.btnSelectCallback, false);
  }

  // remove properties
  this.properties.length = 0;

  // reset to default
  this._inputKeyPressed = false;
};

TestCtrl.prototype.deActivate = () => {
  // remove event listeners
  this.btnEnter.className = 'enterDisable';
  // If the button lable is EXIT then only Deactivate - arsu
  if (this.properties.buttonValue === 'EXIT') {
    this.btnExit.className = 'exitDisable';
    this.btnExit.removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.exitHandler, false);
  }
  this.btnClear.className = 'clearDisable';
  this.btnDel.className = 'delDisable';
  this.btnEnter.removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.enterHandler, false);
  this.btnClear.removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.clearHandler, false);
  this.btnDel.removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.delHandler, false);
  for (let i=0; i<this.btns.length; i++) {
    this.btns[i].className = ('btn'+i+'Disable');
    this.btns[i].removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.btnSelectCallback, false);
  }

  // remove properties
  this.properties.length = 0;

  // reset to default
  this._inputKeyPressed = false;
};

// Deprecated method..
TestCtrl.prototype.activate = () => {
  // add event listeners
  this.btnExit.innerText = this.properties.buttonValue;
  this.btnEnter.className = 'enter';
  this.btnExit.className = 'exit';
  this.btnClear.className = 'clear';
  this.btnDel.className = 'del';
  this.btnEnter.addEventListener('click', this.enterHandler, false);
  this.btnExit.addEventListener('click', this.exitHandler, false);
  this.btnClear.addEventListener('click', this.clearHandler, false);
  this.btnDel.addEventListener('click', this.delHandler, false);
  for (let i=0; i<this.btns.length; i++) {
    this.btns[i].className = ('btn'+i);
    this.btns[i].addEventListener('click', this.btnSelectCallback, false);
  }

  // remove properties
  this.properties.length = 0;
};

TestCtrl.prototype.activateEnter = function(state) {
  // log.info("[TestCtrl] : Activate the Enter ::: "+state);
  if (state === true) {
    // add or add event listeners
    this.btnEnter.className = 'enter';
    this.btnEnter.addEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.enterHandler, false);
  } else {
    this.btnEnter.className = 'enterDisable';
    this.btnEnter.removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.enterHandler, false);
  }
  this.properties.length = 0;
};

TestCtrl.prototype.activateExit = function(state) {
  if (state === true) {
    // add or remove event listeners
    this.btnExit.innerText = this.properties.buttonValue;
    this.btnExit.className = 'exit';
    this.btnExit.addEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.exitHandler, false);
  } else {
    this.btnExit.innerText = this.properties.buttonValue;
    this.btnExit.className = 'exitDisable';
    this.btnExit.removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.exitHandler, false);
  }
  this.properties.length = 0;
};

TestCtrl.prototype.activateClear = function(state) {
  if (state === true) {
    // add or remove event listeners
    this.btnClear.className = 'clear';
    this.btnClear.addEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.clearHandler, false);
  } else {
    this.btnClear.className = 'clearDisable';
    this.btnClear.removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.clearHandler, false);
  }
  this.properties.length = 0;
};

// Activate or Deactivate all keys of KeyPad
TestCtrl.prototype.activateKeyPad = function(state) {
  // add or remove event listeners
  for (let i=0; i<this.btns.length; i++) {
    if (state === true) {
      this.btns[i].className = ('btn'+i);
      this.btns[i].addEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.btnSelectCallback, false);
    } else {
      this.btns[i].className = ('btn'+i+'Disable');
      this.btns[i].removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.btnSelectCallback, false);
    }
  }
  this.properties.length = 0;
};

// Activate or Deactivate any specific key from Keypad
TestCtrl.prototype.activateAnyKey = function(state, key) {
  // add or remove event listeners
  if (state === true) {
    this.btns[key].className = ('btn'+key);
    this.btns[key].addEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.btnSelectCallback, false);
  } else {
    this.btns[key].className = ('btn'+key+'Disable');
    this.btns[key].removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.btnSelectCallback, false);
  }
  this.properties.length = 0;
};

TestCtrl.prototype.activateDel = function(state) {
  if (state === true) {
    // remove event listeners
    this.btnDel.className = 'del';
    this.btnDel.addEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.delHandler, false);
  } else {
    this.btnDel.className = 'delDisable';
    this.btnDel.removeEventListener(TestCtrl.prototype._MOUSEDOWNEVENT, this.delHandler, false);
  }
  this.properties.length = 0;
};
// To clear input
TestCtrl.prototype._focusLastBtn = () => {
  const prevBtn = this._prevFocusedBtnDOM;
  this._removeFocused();
  if (prevBtn != null) {
    this._makeFocused(prevBtn);
  } else if (this.btnContacts) {
    this._makeFocused(this.btnContacts);
  } else {
    this._makeFocused(this.btns[1]);
  }
};

TestCtrl.prototype._mouseUp = function(e) {
  const target = this._getDOMElementRef(e.currentTarget);
  if (!target.classList.contains('disabled')) {
    clearTimeout(this._longPressTimeOut);
    this._longPressTimeOut = null;

    this._removeActive(target);
    if (this._prevFocusedBtnDOM) {
      this._makeFocused(e.currentTarget);
    }
  }
};

TestCtrl.prototype._makeActive = function(target) {
  if (target != null) {
    target.classList.add('active');
  }
};

TestCtrl.prototype._removeActive = function(target) {
  if (target != null) {
    target.classList.remove('active');
  }
};

TestCtrl.prototype._mouseDown = function(e) {
  const target = this._getDOMElementRef(e.currentTarget);
  if (!target.classList.contains('disabled')) {
    if (this._currentFocusedBtnDOM != null) {
      this._removeFocused();
    }
    this._makeActive(target);

    // set long press timer
    clearTimeout(this._longPressTimeOut);
    this._longPressTimeOut = null;
    this._longPressTimeOut = setTimeout(this._longPressHandler.bind(this, target), this.properties.longPressTimeOut);
  }
};
TestCtrl.prototype._mouseOut = function(e) {
  const target = this._getDOMElementRef(e.currentTarget);
  if (!target.classList.contains('disabled')) {
    clearTimeout(this._longPressTimeOut);
    this._longPressTimeOut = null;
    this._ignoreOnce = false;

    this._removeActive(target);
  }
};

TestCtrl.prototype._getDOMElementRef = function(DOMEl) {
  const refName = DOMEl.getAttribute('data-ref');
  let ref = null;
  switch (refName) {
    case 'btn0':
      ref = this.btns[0];
      break;
    case 'btn1':
      ref = this.btns[1];
      break;
    case 'btn2':
      ref = this.btns[2];
      break;
    case 'btn3':
      ref = this.btns[3];
      break;
    case 'btn4':
      ref = this.btns[4];
      break;
    case 'btn5':
      ref = this.btns[5];
      break;
    case 'btn6':
      ref = this.btns[6];
      break;
    case 'btn7':
      ref = this.btns[7];
      break;
    case 'btn8':
      ref = this.btns[8];
      break;
    case 'btn9':
      ref = this.btns[9];
      break;
    case 'clear':
      ref = this.btnClear;
      break;
    case 'ok':
      ref = this.btnOK;
      break;
    case 'asterisk':
      ref = this.btns[10];
      break;
    case 'sharp':
      ref = this.btns[11];
      break;
    case 'contacts':
      ref = this.btnContacts;
      break;
    case 'call':
      ref = this.btnCall;
      break;
    case 'smallCancel':
      ref = this.btns[10];
      break;
    case 'smallOK':
      ref = this.btns[11];
      break;
    case 'closeDtmf':
      ref = this.btnCloseDtmf;
      break;
    default:
      log.warn('DalPadCtrl: undefined btn');
  }

  return ref;
};

TestCtrl.prototype._makeFocused = function(target) {
  this._currentFocusedBtnDOM = target;
  if (target != null && target.classList.contains('disabled')) {
    this._makeFocused.caller.apply(this);
  } else if (target != null) {
    target.classList.add('focused');
  } else if (this.btnContacts) {
    this._currentFocusedBtnDOM = this.btnContacts;
    this._currentFocusedBtnDOM.classList.add('focused');
  } else {
    this._currentFocusedBtnDOM = this.btns[1];
    this._currentFocusedBtnDOM.classList.add('focused');
  }
  return target;
};

TestCtrl.prototype._removeFocused = () => {
  if (this._currentFocusedBtnDOM != null) {
    this._currentFocusedBtnDOM.classList.remove('focused');
  }

  this._prevFocusedBtnDOM = this._currentFocusedBtnDOM;
  this._currentFocusedBtnDOM = null;
};

TestCtrl.prototype._getFocused = () => {
  if (this.properties.ctrlType != 'Dtmf') {
    this._makeFocused(this.btnContacts);
  } else {
    this._makeFocused(this.btns[1]);
  }
};

TestCtrl.prototype._getLeftBtn = () => {
  let returnValue = 'consumed';
  if (this._currentFocusedBtnDOM != null) {
    const value = this._currentFocusedBtnDOM.getAttribute('data-value');
    switch (value) {
      case 'contacts':
        returnValue = 'giveFocusLeft';
        break;
      case '1':
      case '4':
      case '7':
      case '*':
      case 'smallCancel':
        if (this.btnContacts) {
          this._removeFocused();
          this._makeFocused(this.btnContacts);
        } else {
          returnValue = 'giveFocusLeft';
        }
        break;
      case '0':
        this._removeFocused();
        this._makeFocused(this.btns[10]);
        break;
      case '#':
      case 'smallOK':
        this._removeFocused();
        this._makeFocused(this.btns[0]);
        break;
      case 'ok':
      case 'call':
        let prevBtn = this._prevFocusedBtnDOM;
        this._removeFocused();
        let prevValue;
        if (prevBtn) {
          prevValue = prevBtn.getAttribute('data-value');
        }
        if (prevValue == '3' || prevValue == '6' || prevValue == '9' || prevValue == '#' || prevValue == 'smallOK') {
          this._makeFocused(prevBtn);
        } else {
          this._makeFocused(this.btns[3]);
        }
        break;
      case 'clear':
        returnValue = 'giveFocusLeft';
        break;
      case 'closeDtmf':
        let prevBtn = this._prevFocusedBtnDOM;
        this._removeFocused();
        if (prevBtn) {
          this._makeFocused(prevBtn);
        } else {
          this._makeFocused(this.btns[11]);
        }
        break;
      default:
        const index = parseInt(value) - 1;
        this._removeFocused();
        this._makeFocused(this.btns[index]);
        break;
    }
  } else {
    this._getFocused();
  }
  return returnValue;
};

TestCtrl.prototype._getRightBtn = () => {
  let returnValue = 'consumed';
  if (this._currentFocusedBtnDOM != null) {
    const value = this._currentFocusedBtnDOM.getAttribute('data-value');
    switch (value) {
      case 'contacts':
        const prevBtn = this._prevFocusedBtnDOM;
        this._removeFocused();
        let prevValue;
        if (prevBtn) {
          prevValue = prevBtn.getAttribute('data-value');
        }
        if (prevValue == '1' || prevValue == '4' || prevValue == '7' || prevValue == '*' || prevValue == 'smallCancel') {
          this._makeFocused(prevBtn);
        } else {
          this._makeFocused(this.btns[1]);
        }
        break;
      case '3':
      case '6':
      case '9':
      case '#':
      case 'smallOK':
        if (this.btnCall) {
          this._removeFocused();
          this._makeFocused(this.btnCall);
        } else if (this.btnOK) {
          this._removeFocused();
          this._makeFocused(this.btnOK);
        } else if (this.btnCloseDtmf) {
          this._removeFocused();
          this._makeFocused(this.btnCloseDtmf);
        } else {
          returnValue = 'giveFocusRight';
        }
        break;
      case '0':
        this._removeFocused();
        this._makeFocused(this.btns[11]);
        break;
      case '*':
      case 'smallCancel':
        this._removeFocused();
        this._makeFocused(this.btns[0]);
        break;
      case 'ok':
      case 'call':
        returnValue = 'giveFocusRight';
        break;
      case 'clear':
        returnValue = 'giveFocusRight';
        break;
      case 'closeDtmf':
        returnValue = 'giveFocusRight';
        break;
      default:
        const index = parseInt(value) + 1;
        this._removeFocused();
        this._makeFocused(this.btns[index]);
        break;
    }
  } else {
    this._getFocused();
  }
  return returnValue;
};

TestCtrl.prototype._getUpBtn = () => {
  let returnValue = 'consumed';
  if (this._currentFocusedBtnDOM != null) {
    const value = this._currentFocusedBtnDOM.getAttribute('data-value');
    switch (value) {
      case '1':
      case '2':
      case '3':
        if (this.btnClear) {
          this._removeFocused();
          this._makeFocused(this.btnClear);
        } else {
          returnValue = 'giveFocusUp';
        }
        break;
      case 'contacts':
      case 'call':
      case 'ok':
      case 'clear':
        returnValue = 'giveFocusUp';
        break;
      case '*':
      case 'smallCancel':
        this._removeFocused();
        this._makeFocused(this.btns[7]);
        break;
      case '0':
        this._removeFocused();
        this._makeFocused(this.btns[8]);
        break;
      case '#':
      case 'smallOK':
        this._removeFocused();
        this._makeFocused(this.btns[9]);
        break;
      case 'closeDtmf':
        returnValue = 'giveFocusUp';
        break;
      default:
        const index = parseInt(value) - 3;
        this._removeFocused();
        this._makeFocused(this.btns[index]);
        break;
    }
  } else {
    this._getFocused();
  }
  return returnValue;
};

TestCtrl.prototype._getDownBtn = () => {
  let returnValue = 'consumed';
  if (this._currentFocusedBtnDOM != null) {
    const value = this._currentFocusedBtnDOM.getAttribute('data-value');
    switch (value) {
      case 'closeDtmf':
      case 'contacts':
      case 'call':
      case 'ok':
      case '*':
      case '0':
      case '#':
      case 'smallOK':
      case 'smallCancel':
        returnValue = 'giveFocusDown';
        break;
      case 'clear':
        const prevBtn = this._prevFocusedBtnDOM;
        this._removeFocused();
        let prevValue;
        if (prevBtn) {
          prevValue = prevBtn.getAttribute('data-value');
        }
        if (prevValue == '1' || prevValue == '2' || prevValue == '3') {
          this._makeFocused(prevBtn);
        } else {
          this._makeFocused(this.btns[1]);
        }
        break;
      case '7':
        this._removeFocused();
        this._makeFocused(this.btns[10]);
        break;
      case '8':
        this._removeFocused();
        this._makeFocused(this.btns[0]);
        break;
      case '9':
        this._removeFocused();
        this._makeFocused(this.btns[11]);
        break;
      default:
        const index = parseInt(value) + 3;
        this._removeFocused();
        this._makeFocused(this.btns[index]);
        break;
    }
  } else {
    this._getFocused();
  }
  return returnValue;
};

TestCtrl.prototype._getNextBtn = () => {
  if (this._currentFocusedBtnDOM != null) {
    const value = this._currentFocusedBtnDOM.getAttribute('data-value');
    switch (value) {
      case 'contacts':
        this._removeFocused();
        this._makeFocused(this.btns[1]);
        break;
      case '9':
        this._removeFocused();
        this._makeFocused(this.btns[10]);
        break;
      case '*':
      case 'smallCancel':
        this._removeFocused();
        this._makeFocused(this.btns[0]);
        break;
      case '0':
        this._removeFocused();
        this._makeFocused(this.btns[11]);
        break;
      case '#':
      case 'smallOK':
        this._removeFocused();
        if (this.btnCall != null) {
          this._makeFocused(this.btnCall);
        } else if (this.btnOK != null) {
          this._makeFocused(this.btnOK);
        } else {
          this._makeFocused(this.btns[1]);
        }
        break;
      case 'call':
        this._removeFocused();
        if (this.btnContacts != null) {
          this._makeFocused(this.btnContacts);
        } else {
          this._makeFocused(this.btns[1]);
        }
        break;
      case 'ok':
        this._removeFocused();
        if (this.btnContacts != null) {
          this._makeFocused(this.btnContacts);
        } else {
          this._makeFocused(this.btns[1]);
        }
        break;
      case 'clear':
        this._removeFocused();
        this._makeFocused(this.btnContacts);
        break;
      case 'closeDtmf':
        this._removeFocused();
        this._makeFocused(this.btns[1]);
        break;
      default:
        this._removeFocused();
        const index = parseInt(value) + 1;
        this._makeFocused(this.btns[index]);
        break;
    }
  } else {
    this._getFocused();
  }
};

TestCtrl.prototype._getPrevBtn = () => {
  if (this._currentFocusedBtnDOM != null) {
    const value = this._currentFocusedBtnDOM.getAttribute('data-value');
    switch (value) {
      case 'contacts':
        this._removeFocused();
        if (this.btnCall != null) {
          this._makeFocused(this.btnCall);
        } else if (this.btnOK != null) {
          this._makeFocused(this.btnOK);
        } else {
          this._makeFocused(this.btns[11]);
        }
        break;
      case '1':
        this._removeFocused();
        if (this.btnContacts) {
          this._makeFocused(this.btnContacts);
        } else {
          this._makeFocused(this.btns[11]);
        }
        break;
      case '*':
      case 'smallCancel':
        this._removeFocused();
        this._makeFocused(this.btns[9]);
        break;
      case '0':
        this._removeFocused();
        this._makeFocused(this.btns[10]);
        break;
      case '#':
      case 'smallOK':
        this._removeFocused();
        this._makeFocused(this.btns[0]);
        break;
      case 'call':
        this._removeFocused();
        this._makeFocused(this.btns[11]);
        break;
      case 'ok':
        this._removeFocused();
        this._makeFocused(this.btns[11]);
        break;
      case 'clear':
        this._removeFocused();
        this._makeFocused(this.btnContacts);
        break;
      case 'closeDtmf':
        this._removeFocused();
        this._makeFocused(this.btns[11]);
        break;
      default:
        this._removeFocused();
        const index = parseInt(value) - 1;
        this._makeFocused(this.btns[index]);
        break;
    }
  } else {
    this._getFocused();
  }
};


TestCtrl.prototype._multicontrollerSelect = () => {
  const value = this._currentFocusedBtnDOM.getAttribute('data-value');
  // log.info("inside _multicontrollerSelect : value = "+value);
  switch (value) {
    case 'contacts':
      this._selectCallback('Contacts');
      break;
    case 'call':
      this._selectCallback('Call');
      break;
    case 'ok':
      this._selectCallback('OK');
      break;
    case 'closeDtmf':
      this._selectCallback('CloseDtmf');
      break;
    case 'clear':
      this._clearHandler();
      break;
    default:
      this._btnSelectCallback({currentTarget: this._currentFocusedBtnDOM});
      break;
  }
};
TestCtrl.prototype._getNextTestId = () => {
  log.debug('_getNextTestId ');
  this._currentTestId = this.properties.value;
  // log.info("getNextTestId this._currentTestId "+this._currentTestId);
  const next = this._getNextVal(parseInt(this._currentTestId), this._testIdsArray);
  log.debug('next Id is '+next);
  if (next && next.value && next.index !== null && next.value !== 'undefined') {
    // log.info("NextTestId , set input "+next.value);
    this.setInput(next.value);
    // const status = this._testNameArray[next.index];
    this._checkedValidTestId(next.value);
  }
  if (this.properties.value) {
    this.activateEnter(true);
    if (this.properties.keyPressCallback) {
      const params = {'input': null, 'inputData': null, 'statusData': null, 'dataWindowData': null, 'enterState': true};
      this.properties.keyPressCallback(this, this.properties.appData, params);
    }
  }
  clearTimeout(this._timerStarted);
  this._timerStarted = null;
};

TestCtrl.prototype._getPreviousTestId = () => {
  this._currentTestId = this.properties.value;
  // log.info("inside getPreviousTestId: this._currentTestId is "+this._currentTestId);
  const pre = this._getPreviousVal(parseInt(this._currentTestId), this._testIdsArray);
  if (pre && pre.value && pre.index !== null && pre.value !== 'undefined') {
    // log.info("PreviousTestId , set input "+pre.value);
    this.setInput(pre.value);
    // const status = this._testNameArray[pre.index];
    this._checkedValidTestId(pre.value);
  }
  if (this.properties.value) {
    this.activateEnter(true);
    if (this.properties.keyPressCallback) {
      const params = {'input': null, 'inputData': null, 'statusData': null, 'dataWindowData': null, 'enterState': true};
      this.properties.keyPressCallback(this, this.properties.appData, params);
    }
  }
  clearTimeout(this._timerStarted);
  this._timerStarted = null;
};

TestCtrl.prototype._getNextVal = function(val, arr) {
  log.debug('_getNextVal ');
  // omit the next line if the array is always sorted:
  arr = arr.slice(0).sort(function(a, b) {
    return a-b;
  });
  const item = {value: '', index: ''};
  for (let i=0; i <= arr.length; i++) {
    if (i === arr.length) {
      item.value = arr[0]+'';
      item.index = 0;
      return item;
    }
    if (arr[i] > val) {
      item.value = arr[i]+'';
      log.debug(' item.value '+item.value);
      item.index = i;
      return item;
    }
  }
};

TestCtrl.prototype._getPreviousVal = function(val, arr) {
  // omit the next line if the array is always sorted:

  arr = arr.slice(0).sort(function(a, b) {
    return a-b;
  });
  const item = {value: '', index: ''};
  for (let i = arr.length - 1; i >= -1; i--) {
    if (i === -1) {
      // log.info("inside _getPreviousVal: return is "+arr[arr.length - 1]);
      item.value = arr[arr.length - 1]+'';
      item.index = arr.length - 1;
      return item;
    }
    if (arr[i] < val) {
      // log.info("inside _getPreviousVal: return is "+arr[i]);
      item.value = arr[i]+'';
      item.index = i;
      return item;
    }
  }
};

TestCtrl.prototype._mouseUpBodyHandler = function(e) {
  // reset to default
  this._inputKeyPressed = false;

  // remove event listeners
  document.body.removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.mouseUpBodyHandler);
  this.btnDel.removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.delHandler, false);
  this.btnEnter.removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.enterHandler, false);
  this.btnExit.removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.exitHandler, false);
  this.btnClear.removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.clearHandler, false);

  for (let i=0; i<10; i++) {
    this.btns[i].removeEventListener(TestCtrl.prototype._MOUSEUPEVENT, this.btnSelectCallback, false);
  }
};

framework.registerCtrlLoaded('TestCtrl');
