/*
    Copyright 2012 by Johnson Controls
    __________________________________________________________________________

    Filename: List2Ctrl.js
    __________________________________________________________________________

    Project: JCI-IHU
    Language: EN
    Author: avorotp
    Date:
    __________________________________________________________________________

    Description: IHU GUI List 2 Control

    Revisions:
    v0.1 - Initial revision
    __________________________________________________________________________

*/

log.addSrcFile('List2Ctrl.js', 'common');

/**
 * =========================
 * CONSTRUCTOR
 * =========================
 * Standard control constructor
 * TAG: framework
 * =========================
 * @param {string} - uiaid of the owning app
 * @param {html element} - control parent
 * @param {string} - control id
 * @param {object} - control properties
 * @return {List2Ctrl}
 */
function List2Ctrl(uiaId, parentDiv, controlId, properties)
{
  /*
     * ---------------------------------------
     * DEFAULT CONTROL CONFIGURATION
     * ---------------------------------------
     */

  // set default properties
  this.properties = {

    /* CONFIGURATION PROVIDED BY APPS, CONTROLS OR FWK */
    // title config
    title: {}, /* {object} If the value of the titleStyle property is “listTitle” this gives the
                                                         parameters of the list title – what style it has, what are its elements, etc. */
    titleConfiguration: 'noTitle', /* {string} The style of the top part of the list control. It can be either a textual content,
                                                         tabs that can be selected to change the list content, or no title to be shown. */

    // tabs configuration
    tabsButtonConfig: {}, /* {object} If the value of the titleStyle property is “tabsTitle”
                                                         this gives the parameters of the tabs control that will appear on the top of the list. */

    // dataList
    dataList: null, /* {object} Preset dataList of the control */
    protectDataList: false, /* {boolean} Wheter the list clones the dataList items array protecting the owning app's private
                                                        instance of that array from modifications by the list. */

    // layout config
    inDialog: false, /* {boolean} Indicates whether the list is contained in a dialog.
                                                         When set to true, special list control styling is implemented, with 3.5 lines.
                                                         The thickItems property must be false if inDialog is true. */
    dialogStyle: null, /* {string} Defines the list style when embedded in a dialog.
                                                         Requires inDialog property set to true. */
    numberedList: false, /* {boolean} Whether the numbered chrome arc is shown, with numbers on the left of each list line. */

    // items config
    thickItems: false, /* {boolean} Indicates whether the items in the list will be thin or thick.
                                                         Must be set to true if any items in the list are one of the two-line item styles. */
    smallItemText: false, /* {boolean} When True, all B Rank text in single-line item styles will be displayed as C Rank instead */
    listReorder: false, /* {boolean} Indicates whether the items in the list can be reordered by long press and dragging. */
    scrollTo: 0, /* {integer} Set the initial position of the list (where the list is initially scrolled to on display).
                                                         It accepts positive integers not exceeding the item count.
                                                         When higher number than the item count is provided, it is automatically lowered to the item count.
                                                         Requires having a dataList preset in the configuration.
                                                         Normally the specified item will be placed at the first visible list position.
                                                         However, if the specified item is near the end of the list it may be positioned
                                                         farther down to maintain normal “bottom of list” scroll positioning. */

    focussedItem: 0, /* {integer} Which item has initial focus on list instantiation.
                                                         Requires the list to have a dataList preset in the configuration. */

    hasLetterIndex: false, /* {boolean} Indicates whether the list will have a letter index showing on the right, containing
                                                        letters for quick jump to their respective list items (scroll positions) defined in letterIndexData. */
    letterIndexData: [], /* {array} Contains information for the scroll position of each letter as well as the letter label itself. */
    listBackground: null, /* {string} URL for a custom list background */

    // callbacks
    selectCallback: null, /* {function} Called when a list item is selected either by touch or by multicontroller or by voice. */
    longPressCallback: null, /* {function} Called on long press on an item. */
    holdStartCallback: null, /* {function} Called on start of hold (after longPress timeout expires) */
    holdStopCallback: null, /* {function} Called on end of hold (when the finger is lifted) */
    selectDisabledCallback: null, /* {function} Called when a disabled list item is selected. */
    slideCallback: null, /* {function} Called when the slider handle is being dragged on slider items */
    needDataCallback: null, /* {function} Called when the list has reached a point, when being scrolled,
                                                         where no more data for rendering the list items is available */
    loadingConfig: {/* {object} gives the app the ability to change the loading text while waiting the fitst items to come */
      loadingText: null,
      loadingTextId: 'common.Loading',
      loadingSubMap: null,
      image: null,
    },


    /* CONFIGURATION USED INTERNALLY BY THE LIST */
    itemHeight: 64,
    visibleItems: 6,
    itemsBefore: 5, /* {integer} items before the top one */
    itemsAfter: 9, /* {integer} items after and including the top one */
    selectThreshold: 20,
    hitTimeout: 0,
    letterIndexHeight: 64,
    visibleLetterIndexItems: 6,
    letterIndexSelectTimeout: 1000,

    eventFilterThreshold: (guiConfig.debugMode) ? 0 : 50,

    longPressTimeout: 1500,
    listReorderScrollTimeout: 0, // @SW00155245, needs faster scroll during re-oreder

    // multicontroller hold timeouts and intervals
    autoscrollTier1Timeout: 1500,
    autoscrollTier2Timeout: 5000,
    autoscrollTier1Interval: 500,
    autoscrollTier2Interval: 1000,

    hvThreshold: 45 * (Math.PI/180),

    sliderReferencePointRight: 665,
    sliderReferencePointLeft: 94,
    sliderWidth: 346, // {integer} will be passed to SliderCtrl
    sliderHandleWidth: 43, // {integer} will be passed to SliderCtrl
    indentOffset: 38, // defined in List2Ctrl_mixins.scss
    // open/closed loop handling for sliders
    minChangeInterval: 250, // {integer} will be passed to SliderCtrl
    settleTime: 1000, // {integer} will be passed to SliderCtrl
    rotationIdleDetectTime: 500, // {integer} will be passed to SliderCtrl

    toggleButtonWidth: 120, /* styles CSV-dependent */
    toggleReferencePointRight: 675, /* styles CSV-dependent */
    // open/closed loop handling for toggles
    toggleMinChangeInterval: 250, /* {integer} number of ms that must occur between toggle callbacks. This is used for Outgoing Event Filtering */
    toggleSettleTime: 1000, /* {integer} number of ms between when the user last toggles the item, and when the item will
                                                             update to its last cached value. This is used for Incoming Event Filtering. */
    checkMinChangeInterval: 250,
    checkSettleTime: 1000,

    stepMinChangeInterval: 0, /* {integer} number of ms that must occur between step callbacks. This is used for Outgoing Event Filtering */

    wrapTextThreshold: 604, /* styles CSV-dependent */

    poolsize: 15, /* {integer} has to be more than (itemsBefore + itemsAfter), preferably (itemsBefore + itemsAfter + 1) */
    showScrollIndicator: true,
    scrollIndicatorMinSize: 20,
    scrollIndicatorFadeTimeout: 0,
    scrollIndicatorFadeOutDuration: 700,
    scrollIndicatorFadeInDuration: 200,

    // flicking
    swipeThreshold: 300,
    swipeAnimationDuration: 300,
    deceleration: 0.0006,

    scrollingDuringLoading: false,
    loadingOverlayEnabled: true,
    showLoadingOverlayTimeout: 200, /* {integer} the time that needs to pass before showing the loading overlay */
    hideLoadingOverlayTimeout: 0, /* {integer} the min time that needs to have passed before hiding the loading overlay */
    enableSecondaryItemRequest: true,
    enableItemRequestOnScroll: false,
    secondaryRequestLimit: 5, /* {integer} number of retries to get needed data to fill all the elements in the DOM */
    needDataTimeout: 3000, /* {integer} number of ms to wait before unlocking the list after needDataCallback is fired */
    requestSize: 20, /* has to be more than the poolsize, ideally poolsize + 5 */

    // Position select
    listPositionSelect: false, /* {boolean} indicates if list position select is allowed*/
  };

  // Merge with user configuration
  for (const i in properties)
  {
    this.properties[i] = properties[i];
  }


  /*
     * ---------------------------------------
     * INTERNAL CONTROL CONFIGURATION
     * The following configuration should not be changed by
     * the application or some other place outside this control.
     * ---------------------------------------
     */

  /*
     * the following list item types have a secondary multicontroller behavior
     * i.e. when focussed and the user press select, the focus goes to
     * an inner subwidget (slider, button or icon) and any subsequent
     * multicontroller interaction is on these subwidget. The user
     * exits this mode by pressing select again. At this point the
     * respective callback should be fired.
     */
  this._secondaryMulticontrollerTypes = [
    'style12', // slider
    'style13', // slider - deprecated
    'styleStep',
    'styleLock',
  ];

  /*
     * The following table contains items, that are okay to be displayed, even if they don't contain text.
     */
  this._itemsWithNoText = [
    'style28',
  ];

  /*
     * Normally sliders are positioned to the right part of a listItem, and there is text/image on the left.
     * So, clicks in different position of the list item have to be treated differently.
     * However, for some slider items, that are positioned to the right an exception has to be made, in order
     *for them to behave correctly. This table contains such items, and new ones can be added with ease.
     */
  this._rightHittableArea = [
    'style28',
  ];

  if (true === this.properties.inDialog)
  {
    this.properties.itemHeight = 64; // set item height regardless of the thickItems property
    this.properties.thickItems = false; // update thickItems if set wrong

    // set visible items
    switch (this.properties.dialogStyle)
    {
      case 'DialogStyle01':
        this.properties.visibleItems = 4;
        break;
      case 'DialogStyle02':
        this.properties.visibleItems = 3;
        break;
      case 'DialogStyle03':
        this.properties.visibleItems = 2;
        break;
      case 'DialogStyle04':
        this.properties.visibleItems = 5;
        break;
      default:
        log.error('List2: Unsupported dialogStyle property set: ' + this.properties.dialogStyle);
        break;
    }
  }
  else
  {
    this.properties.itemHeight = (this.properties.thickItems) ? 82 : 64; // set item height

    // set visible items
    switch (this.properties.titleConfiguration)
    {
      case 'tabsTitle':
        this.properties.visibleItems = (this.properties.thickItems) ? 4 : 5;
        this.properties.visibleLetterIndexItems = 5;
        break;
      case 'listTitle':
        switch (this.properties.title.titleStyle)
        {
          case 'style02':
          case 'style02a':
          case 'style03':
          case 'style03a':
          case 'style12':
            this.properties.visibleItems = (this.properties.thickItems) ? 4 : 5;
            break;
          case 'style05':
            this.properties.visibleItems = (this.properties.thickItems) ? 3 : 4;
            break;
          case 'style06':
          case 'style07':
            this.properties.visibleItems = (this.properties.thickItems) ? 2 : 3;
            break;
          case 'style08':
            this.properties.visibleItems = (this.properties.thickItems) ? 3 : 4;
            break;
          default:
            this.properties.visibleItems = (this.properties.thickItems) ? 4 : 5;
            break;
        }
        this.properties.visibleLetterIndexItems = 5;
        break;
      case 'noTitle':
        this.properties.visibleItems = (this.properties.thickItems) ? 5 : 6;
        this.properties.visibleLetterIndexItems = 6;
        break;
      default:
        log.error('Unknown title configuration set: ' + this.properties.titleConfiguration);
    }
  }

  /*
     * ---------------------------------------
     * CONTROL PUBLIC PROPERTIES
     * ---------------------------------------
     */
  // set list properties
  this.id = controlId; // control's id
  this.parentDiv = parentDiv; // control's immediate parent DOM element
  this.uiaId = uiaId; // uiaId of the owning app

  // list DOM elements
  this.divElt = null; // control's container
  this.title = null; // control's title
  this.titleCanvas = null; // control's title preview image if supplied in the title config
  this.mask = null; // control's mask (hides everything outside)
  this.scroller = null; // control's main scrolling element
  this.scrollIndicatorWrapper = null; // control's scroll indicator wrapper
  this.scrollIndicator = null; // control's scroll indicator
  this.loading = null; // control's loading item
  // this.arc                       = null; // control's right most arc
  this.activeArea = null; // control's hit-test area
  this.letterIndexWrapper = null; // control's letter index area wrapper
  this.letterIndex = null; // control's letter index area
  this.listBackground = null; // control's custom background image

  // tabs
  this.tabsCtrl = null; // reference to tabs control

  // animation callbacks
  this.scrollerAnimationEndCallback = null; // fired when the scroller animation finishes
  this.scrollIndicatorAnimationEndCallback = null; // fired when scrollIndicator animation finishes
  this.letterIndexAnimationEndCallback = null; // fired when letter index animation finishes
  this.firstFocusAnimationEndCallback = null; // fired when the first focus animation finishes

  // handlers
  this.touchHandler = null; // fired on any mouse/touch event

  // dataList and items
  this.pool = null; // {object} pool of list items
  this.dataList = null; // {object} holds all the list data
  this.items = []; // {array} holds currently displayed list items. Usually these extend the visible range

  // letter index
  this.letterIndexData = []; // {array} holds letter index data

  /*
     * ---------------------------------------
     * CONTROL PRIVATE PROPERTIES
     * These change a lot during interactions
     * ---------------------------------------
     */
  this._inDrag = false; // {boolean} indicates whether the list is currently being dragged
  this._inScroll = false; // {boolean} indicates whether the list is currently being scrolled

  this._scrollerHeight = 0; // {integer} height of the scroller (replaces this.scroller.offsetHeight)
  this._scrollIndicatorHeight = 0; // {integer} height of the scroll indicator (replaces this.scrollIndicator.offsetHeight)
  this._scrollerH = 0; // {integer} height of the scroller
  this._maskPositionY = 0; // {integer} position of the mask
  this._maskPositionX = 0; // {integer} position of the mask
  this._maskH = 0; // {integer} height of the mask
  this._maskW = 0; // {integer} width of the mask
  this._startY = 0; // {integer} y position of the drag start
  this._startX = 0; // {integer} x position of the drag start
  this._startTime = 0; // {integer} when the dragging started
  this._y = 0; // {integer} current position of the list
  this._startItem = -1; // {integer} index of the item when dragging starts
  this._startDOMItem = null; // {HMTL element} reference to the HTML element when dragging starts

  // inline buttons
  this._startButton = null; // {integer} index of the toggle button that has first gained hit highlight
  this._startLockButton = null; // {integer} index of the lock button that has first gained hit highlight

  this._minScrollY = 0; // {integer} top-most position of the list
  this._maxScrollY = 0; // {integer} bottom-most position of the list
  this._stopSelect = false; // {boolean} indicates whether to stop select (e.g. when the list is scrolling)

  this._initialScrollMode = null; // {string} Carries information about the nature of the initial scroll and focus restore if any
  // possible values: 'init', 'config', 'restore'

  this._currentTitle = null; // {object} holds current title object as set with the setTitle method
  this._leftBtnStyle = ''; // {string} left button numbers style based on list configuration

  // letter index
  this._scrollerHIndex = 0; // {integer} height of the letter index scroller
  this._inDragIndex = false; // {boolean} indicates whether the letter index is currently being dragged
  this._startIndexY = 0; // {integer} y position of the letter index drag start
  this._startIndexX = 0; // {integer} x position of the letter index drag start
  this._startTimeIndex = 0; // {integer} when the letter index dragging started
  this._yIndex = 0; // {integer} current position of the letter index
  this._minScrollYIndex = 0; // {integer} top-most position of the letter index
  this._maxScrollYIndex = 0; // {integer} bottom-most position of the letter index
  this._topLetterIndex = 0; // {integer} the letter index that is currently on top
  this._prevTopLetterIndex = 0; // {integer} the letter index that has been previously at top

  this._trackedEvents = []; // {array} tracks the events
  this._indicatorMin = 0; // {integer} top-most position of the scroll indicator
  this._indicatorMax = 0; // {integer} bottom-most position of the scroll indicator
  this._topItem = 0; // {integer} the item currently on top (expressed as index in the this.dataList.items array)
  this._prevTopItem = 0; // {integer} the item that has been previously on top
  this._hasFill = false; // {boolean} whether the control has initially filled any items TODO: Think of how to remove this
  this._inLoading = false; // {boolean} whether there's a loading in progress
  this._secondaryRequestCount = 0; // {integer} current count of the secondary needDataCallback() calls
  this._scrollNature = null; // {string} the nature of the scrolling action
  this._lastControllerEvent = null; // {string} keeps the last received controller event

  this._isScrollable = false; // {boolean} indicates whether the list can be scrolled. It is unscrollable when the items are lte than the visible items
  this._inputMode = 'controller';// {string} indicates the input mode. 'touch' || 'controller'
  this._hasFocus = false; // {boolean} indicates whether the control currently has focus
  this._showFocusAnimation = false; // {boolean} wheter the show the focus entry animation
  this._focusStolen = false; // {boolean} flag that shows whether the focus placement is a result of a stolen focus
  this._lastItemWithFocus = 0; // {integer} stores the last item index with focus when multicontroller lostFocus event comes in
  this._inLetterIndexMulticontroller = false; // {boolean} indicates whether the multicontroller events should be directed to the letter index area if present

  // sorted letter index data
  this._letterIndexDataSorted = []; // {array} holds sorted letter index data

  // list loading
  this._loadingData = { // {object} contains internal data for the loading overlay
    timeStarted: 0,
    timeShown: 0,
    startTimeoutId: null,
    endTimeoutId: null,
  };

  // horizontal drag
  this._inHorizontalDrag = null; // {boolean|null} whether the drag is horizontal (or vertical). The default value is 'null' (it's has different meaning than 'false')
  this._hDragItem = null; // {integer} index of the item currently being draagged horizontally

  // sliders
  this._sliders = {}; // {object} hash with slider references
  this._activeSlider = null; // {object} contains currently active slider

  // secondary multicontroller
  this._currentSecondaryMulticontrollerItem = null; // {integer}
  this._inSecondaryMulticontroller = false; // {boolean} indicates whether the multicontroller events should be directed to the subwidgets of the focussed item

  // longpress
  this._inLongPress = false; // {boolean} indicates whether the list is in long press
  this._longPressIssued = false; // {boolean} indicates whether the longPress/holdStart callback has been issued

  // list reordering
  this._inListReorder = false; // {boolean} indicates whether the list is currently in reorder mode
  this._reorderItem = null; // {object} copy of the list item that is going to be reordered
  this._reorderItemIndex = null; // {integer} copy of the old index of the list item that is going to be reordered
  this._reorderCurrentIndex = null; // {integer} current index of the reorder item before committing the change
  this._reorderTouchElt = null; // {HTML DOM Element} the actual DOM list item
  this._releaseReorderByTouch = false; // {boolean} indicates wheter the user is about to release the list reorder by touch

  // timeouts and intervals
  this._makeHitTimeoutId = null; // {timeout} enter into hit state after some time
  this._longPressTimeoutId = null; // {timeout} enter into longpress state after some time
  this._touchReorderTimeoutId = null; // {timeout} enter into list reorder after some time
  this._scrollIndicatorTimeoutId = null; // {timeout} fade out scroll indicator after some time
  this._indexSelectTimeoutId = null; // {timeout} scroll the list some time after a letter index is selected by multicontroller
  this._tiltHoldTimeoutId = null; // {timeout} - timeout after which next autoscroll tier starts
  this._tiltHoldIntervalId = null; // {interval} - repeated autoscroll action for the current autoscroll tier
  this._needDataTimeoutId = null; // {timeout} timeout after which the list will no longer wait for items
  this._radioSettleTimeoutId = null; // {timeout} settle timeout for radio group items - this is reset on every user input and checked on every API call
  this._tickSettleTimeoutId = null; // {timeout} settle timeout for tick group items - this is reset on every user input and checked on every API call
  this._appIsAtSpeed = false; // {boolean} Indicates whether app is at speed.
  // Note: checkboxes, onOff and toggle items have their own timeouts for every item

  // event filtering
  this._lastEventTime = 0; // {integer} timestamp of the last handled move event

  // list event API
  this._eventListeners = {}; // {object} has of the registered listeners

  /*
     * ---------------------------------------
     * SETTERS AND GETTERS
     * These control various public and private properties
     * ---------------------------------------
     */
  // focussedItem - the currently (or most recently) focussed item
  this.__defineGetter__('focussedItem', function() {
    return this._getFocussedIndex();
  });

  // focussedItem - set focus on a list item
  this.__defineSetter__('focussedItem', function(focussedItem) {
    this._manageFocus(focussedItem);
  });

  // topItem - current list position expressed in item index
  this.__defineGetter__('topItem', function() {
    return this._topItem;
  });

  // topItem - perform scroll to a new list position
  this.__defineSetter__('topItem', function(topItem) {
    this._scrollTo(topItem, 0);
  });

  /* ====== scrollTo is a topItem alias ====== */
  // scrollTo - current list position expressed in item index
  this.__defineGetter__('scrollTo', function() {
    return this.topItem;
  });
  // scrollTo - perform scroll to a new list position
  this.__defineSetter__('scrollTo', function(scrollTo) {
    this.topItem = scrollTo;
  });
  /* ====== scrollTo is a topItem alias ====== */

  // inLoading - current loading state of the list
  this.__defineGetter__('inLoading', function() {
    return this._inLoading;
  });


  // initialize
  this.init();
}


/**
 * =========================
 * LIST EVENTS AND PROTOTYPE PROPERTIES
 * =========================
 */
List2Ctrl.prototype._USER_EVENT_START = 'mousedown';
List2Ctrl.prototype._USER_EVENT_END = 'mouseup';
List2Ctrl.prototype._USER_EVENT_MOVE = 'mousemove';
List2Ctrl.prototype._USER_EVENT_OUT = 'mouseleave';
List2Ctrl.prototype._VENDOR = ('opera' in window) ? 'O' : 'webkit';

List2Ctrl.prototype._EVENT_START = 'start';
List2Ctrl.prototype._EVENT_MOVE = 'move';
List2Ctrl.prototype._EVENT_END = 'end';
List2Ctrl.prototype._EVENT_OUT = 'out';

List2Ctrl.prototype._EVENTS = {
  ITEM_SELECT: 'itemSelect',
  LETTER_SELECT: 'letterSelect',
  DATALIST_CHANGE: 'dataListChange',
  SCROLL_START: 'scrollStart',
  SCROLL_END: 'scrollEnd',
  CLEAN_UP: 'cleanUp',
};

/**
 * =========================
 * INIT ROUTINE
 * Any initialization code goes here
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype.init = function()
{
  /* CREATE ELEMENTS */

  // container
  this.divElt = document.createElement('div');
  this.divElt.id = this.id;
  this.divElt.className = 'List2Ctrl';

  // add it to the DOM
  this.parentDiv.appendChild(this.divElt);

  // additional container classes
  if (this.properties.titleConfiguration)
  {
    this.divElt.classList.add(this.properties.titleConfiguration);
  }
  this.divElt.classList.add((this.properties.inDialog) ? 'inDialog' : 'noDialog');
  if (this.properties.inDialog && this.properties.dialogStyle)
  {
    this.divElt.classList.add(this.properties.dialogStyle);
  }
  if (this.properties.numberedList)
  {
    this.divElt.classList.add('numberedList');
  }
  if (this.properties.hasLetterIndex)
  {
    this.divElt.classList.add('letterIndex');
  }
  this.divElt.classList.add((this.properties.thickItems) ? 'thickItems' : 'normalItems');
  if (this.properties.smallItemText)
  {
    this.divElt.classList.add('smallItemText');
  }


  /* TITLE AREA */
  switch (this.properties.titleConfiguration)
  {
    case 'listTitle':
      // normal title
      this.title = document.createElement('h1');
      this.title.className = 'List2CtrlTitle';
      this.divElt.appendChild(this.title);
      this.setTitle(this.properties.title);
      if (this.properties.title && this.properties.title.titleStyle == 'style06')
      {
        // special title style having tabs control
        this.tabsCtrl = this._createTabsControl();
      }
      break;

    case 'tabsTitle':
      log.debug('List has tabs');
      this.tabsCtrl = this._createTabsControl();
      break;

    case 'noTitle':
      // nothing to do
      break;

    default:
      log.error('List2: Wrong title configuration: ' + this.properties.titleConfiguration);
      break;
  }

  // mask
  this.mask = document.createElement('div');
  this.mask.className = 'List2CtrlMask';
  this.divElt.appendChild(this.mask);

  // list items container
  this.scroller = document.createElement('ul');
  this.scroller.className = 'List2CtrlScroller';
  this.mask.appendChild(this.scroller);

  // arc
  // MPP 8/9/2013  Commented out in favor of right chrome global control w/ transitions
  // this.arc = document.createElement('div');
  // this.arc.className = 'List2CtrlArc';
  // this.divElt.appendChild(this.arc);

  // active area
  this.activeArea = document.createElement('div');
  this.activeArea.className = 'List2CtrlActiveArea';
  this.divElt.appendChild(this.activeArea);

  // letter index
  if (this.properties.hasLetterIndex)
  {
    this.letterIndexWrapper = document.createElement('div');
    this.letterIndexWrapper.className = 'List2CtrlLetterIndexWrapper';
    this.divElt.appendChild(this.letterIndexWrapper);

    this.letterIndex = document.createElement('ol');
    this.letterIndex.className = 'List2CtrlLetterIndex';
    this.letterIndexWrapper.appendChild(this.letterIndex);
  }

  // loading
  this.loading = document.createElement('div');
  this.loading.className = 'List2CtrlLoading';
  const loadingImage1 = document.createElement('span');
  loadingImage1.className = 'loadingImage1';
  loadingImage1.style.backgroundImage = 'url(' + this.properties.loadingConfig.loadingImage1 + ')';
  this.loading.appendChild(loadingImage1);
  const loadingText = document.createElement('span');
  loadingText.className = 'loadingText';
  if (null !== this.properties.loadingConfig.loadingTextId && undefined !== this.properties.loadingConfig.loadingTextId && '' !== this.properties.loadingConfig.loadingTextId)
  {
    this.properties.loadingConfig.loadingText = this._getLocalizedString(this.properties.loadingConfig.loadingTextId, this.properties.loadingConfig.loadingSubMap);
  }
  loadingText.appendChild(document.createTextNode(this.properties.loadingConfig.loadingText));
  this.loading.appendChild(loadingText);
  const loadingImage = document.createElement('span');
  loadingImage.className = 'loadingImage';
  this.loading.appendChild(loadingImage);


  /* ATTACH HANDLERS */

  // Primary event handlers
  // keep reference to the handler
  this.touchHandler = this._touch.bind(this);
  // start
  this.divElt.addEventListener(this._USER_EVENT_START, this.touchHandler, false);

  /* CREATE POOL */
  this._createPool();

  /* SET DATALIST */
  if (this.properties.dataList)
  {
    // bind dataList
    this.setDataList(this.properties.dataList);

    if (true === this.properties.dataList.itemCountKnown)
    {
      // show items
      this.updateItems(0, this.properties.dataList.itemCount-1);

      /*
             * Perform initial scroll if it is set in the config properties.
             * Focussed item has precedence over the scroll position, i.e. when
             * the focussed item contradicts the scroll position, it is considered
             * as a primary clue for scrolling the list to that position that the
             * focussed item becomes visible on the screen. This logic is followed
             * throughout all auto-scroll / auto-focus logic implemented in the list.
             */

      // first check if the focussed item and the scroll position are all on the same screen
      // scroll to that position and show the focus according to the config
      if ( (this.properties.focussedItem > 0 || this.properties.scrollTo > 0) &&
                 (this.m.abs(this.properties.focussedItem - this.properties.scrollTo) <= (this.properties.visibleItems - 2)) )
      {
        log.debug('Lis2: Focus is visible on screen');
        this._scrollTo(this.properties.scrollTo, 0);
        this._showFocus(this.properties.focussedItem);
        this._initialScrollMode = 'init';
      }
      // set initial focus to a particular item if the list is populated
      // the list will be scrolled so that this item is visible
      else if (this.properties.focussedItem > 0)
      {
        log.debug('Lis2: Focus is not visible and has priority');
        this._showFocus(this.properties.focussedItem);
        this._initialScrollMode = 'init';
      }
      // scroll (no animation) to a particular item if the list is populated
      // the focus will be placed on the top item
      else if (this.properties.scrollTo > 0)
      {
        log.debug('Lis2: Focus is 0 and scrollTo has priority');
        this._scrollTo(this.properties.scrollTo, 0);
        this._showFocus(this._topItem);
        this._initialScrollMode = 'init';
      }

      // enter list reorder if the list is reordable
      if (true === this.properties.listReorder)
      {
        this._enterListReorder(true);
      }
    }
  }
  else
  {
    this._setLoading(true);
  }


  /* SET LETTER INDEX DATA */
  if (this.properties.hasLetterIndex && this.properties.letterIndexData)
  {
    // bind letter index data
    this.setLetterIndexData(this.properties.letterIndexData);
  }

  /* SET CUSTOM LIST BACKGROUND */
  if (null != this.properties.listBackground && '' != this.properties.listBackground)
  {
    this.setListBackground(this.properties.listBackground);
  }
};


/**
 * =========================
 * LIST ITEMS
 * 1. pool (_createPool)
 * 2. default items configuration (_prepareItems, _prepareListItem) for every item style
 * 3. items localization (_localizeItems, _getLocalizedString)
 * 4. pool operations (_setText, _setImage, _getListItem, _returnListItem, _putToScroller, _emptyScroller)
 * 5. dynamic list items (_updateRange, _updateDisplay, _requestMore, _fill)
 * 6. set internal properties (_checkScrollable, _setTopListItem, _setLoading)
 * 7. default title configuration (_prepareTitle)
 * =========================
 */

/** 1. POOL **/

/**
 * Create list items pool
 * Add HTML elements to each item in the pool
 * depending on its style
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._createPool = function()
{
  this.pool = {
    empty: [], // 'empty' is internal style
    draggable: [], // 'draggable' is internal style
    ghost: [], // 'ghost' is internal style

    style01: [],
    style02: [],
    style03: [],
    style03a: [],
    style04: [],
    style05: [],
    style06: [],
    style07: [],
    style09: [],
    style10: [],
    style11: [],
    style12: [],
    style13: [], // deprecated
    style14: [],
    style17: [],
    style18: [],
    style19: [],
    style20: [],
    style21: [],
    style22: [],
    // TODO: style23 - same as style12
    // TODO: style24 - same as style12
    style25: [],
    styleOnOff: [], // not official name
    styleStep: [], // TODO: rename this to style26
    styleLock: [], // not official name
    style28: [],
    style29: [],
    style30a: [],

    style35: [],
    style36: [],
    style37: [],
    style37a: [],
    style38: [],
  };

  // the pool size (this.properties.poolsize) should be at least 3 times
  // the visible items (one for above and two for below the top item)
  let line1; let line2;
  let image1; let image2;
  let label1; let label2;
  let button1; let button2; let button3;
  let caret;

  for (const i in this.pool)
  {
    for (let j=0; j<this.properties.poolsize; j++)
    {
      const li = document.createElement('li');
      li.setAttribute('data-itemStyle', i);
      li.className = 'ListItem ' + i;
      li.setAttribute('data-poolId', j);

      // fill the items with blank content
      switch (i)
      {
        case 'empty':
          // empty item -> no content
          break;

        case 'draggable':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          button1 = document.createElement('span');
          button1.className = 'button buttonOk';
          li.appendChild(button1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);

          label2 = document.createElement('span');
          label2.className = 'label2';
          li.appendChild(label2);

          break;

        case 'ghost':
          // ghost item -> no contet
          break;

        case 'style01':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          break;

        case 'style02':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          image2 = document.createElement('span');
          image2.className = 'image2';
          li.appendChild(image2);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          break;

        case 'style03':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          image2 = document.createElement('span');
          image2.className = 'image2';
          li.appendChild(image2);

          image3 = document.createElement('span');
          image3.className = 'image3';
          li.appendChild(image3);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          break;

        case 'style03a':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          break;

        case 'style04':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          line2 = document.createElement('span');
          line2.className = 'line2';
          li.appendChild(line2);

          break;

        case 'style05':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          image2 = document.createElement('span');
          image2.className = 'image2';
          li.appendChild(image2);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          line2 = document.createElement('span');
          line2.className = 'line2';
          li.appendChild(line2);

          break;

        case 'style06':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          break;

        case 'style07':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);

          label2 = document.createElement('span');
          label2.className = 'label2';
          li.appendChild(label2);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          break;

        case 'style09':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);

          label2 = document.createElement('span');
          label2.className = 'label2';
          li.appendChild(label2);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          line2 = document.createElement('span');
          line2.className = 'line2';
          li.appendChild(line2);

          break;

        case 'style10':
          let buttonsWrapper = document.createElement('div');
          buttonsWrapper.className = 'buttonsWrapper';
          li.appendChild(buttonsWrapper);

          button1 = document.createElement('span');
          button1.className = 'button button1';
          buttonsWrapper.appendChild(button1);

          button2 = document.createElement('span');
          button2.className = 'button button2';
          buttonsWrapper.appendChild(button2);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          break;

        case 'style11':
          let buttonsWrapper = document.createElement('div');
          buttonsWrapper.className = 'buttonsWrapper';
          li.appendChild(buttonsWrapper);

          button1 = document.createElement('span');
          button1.className = 'button button1';
          buttonsWrapper.appendChild(button1);

          button2 = document.createElement('span');
          button2.className = 'button button2';
          buttonsWrapper.appendChild(button2);

          button3 = document.createElement('span');
          button3.className = 'button button3';
          buttonsWrapper.appendChild(button3);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          break;

        case 'style12':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          let subcontainer = document.createElement('div');
          subcontainer.className = 'subcontainer';
          li.appendChild(subcontainer);

          break;

        case 'style13':
          // style13 is deprecated
          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          let subcontainer = document.createElement('div');
          subcontainer.className = 'subcontainer';
          li.appendChild(subcontainer);

          break;

        case 'style14':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          let subcontainer = document.createElement('div');
          subcontainer.className = 'subcontainer';
          li.appendChild(subcontainer);

          label1 = document.createElement('span');
          label1.className = 'label1';
          subcontainer.appendChild(label1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          subcontainer.appendChild(line1);

          break;

        case 'style17':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          // label is inside line1 element to allow natural text flow
          label1 = document.createElement('span');
          label1.className = 'label1';
          line1.appendChild(label1);

          break;

        case 'style18':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          let subcontainer = document.createElement('div');
          subcontainer.className = 'subcontainer';
          li.appendChild(subcontainer);

          label1 = document.createElement('span');
          label1.className = 'label1';
          subcontainer.appendChild(label1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          subcontainer.appendChild(line1);

          label2 = document.createElement('span');
          label2.className = 'label2';
          li.appendChild(label2);

          break;

        case 'style19':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          let subcontainer = document.createElement('div');
          subcontainer.className = 'subcontainer';
          li.appendChild(subcontainer);

          line1 = document.createElement('span');
          line1.className = 'line1';
          subcontainer.appendChild(line1);

          break;

        case 'style20':
          button1 = document.createElement('span');
          button1.className = 'button1';
          li.appendChild(button1);

          break;

        case 'style21':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          image2 = document.createElement('span');
          image2.className = 'image2';
          li.appendChild(image2);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          line2 = document.createElement('span');
          line2.className = 'line2';
          li.appendChild(line2);

          break;

        case 'style22':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          image2 = document.createElement('span');
          image2.className = 'image2';
          li.appendChild(image2);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          break;

        case 'style25':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          image2 = document.createElement('span');
          image2.className = 'image2';
          li.appendChild(image2);

          image3 = document.createElement('span');
          image3.className = 'image3';
          li.appendChild(image3);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          line2 = document.createElement('span');
          line2.className = 'line2';
          li.appendChild(line2);

          break;

        case 'styleOnOff':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          image2 = document.createElement('span');
          image2.className = 'image2';
          li.appendChild(image2);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          break;

        case 'styleStep':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);

          label2 = document.createElement('span');
          label2.className = 'label2';
          li.appendChild(label2);

          const plusSign = document.createElement('span');
          plusSign.className = 'plus';
          li.appendChild(plusSign);

          const minusSign = document.createElement('span');
          minusSign.className = 'minus';
          li.appendChild(minusSign);

          break;

        case 'styleLock':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          image2 = document.createElement('span');
          image2.className = 'image2 buttonLock';
          li.appendChild(image2);

          image3 = document.createElement('span');
          image3.className = 'image3 buttonDelete';
          li.appendChild(image3);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          line2 = document.createElement('span');
          line2.className = 'line2';
          li.appendChild(line2);

          break;

        case 'style28':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          let subcontainer = document.createElement('div');
          subcontainer.className = 'subcontainer';
          li.appendChild(subcontainer);

          break;

        case 'style29':
          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);

          label2 = document.createElement('span');
          label2.className = 'label2';
          li.appendChild(label2);

          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          break;

        case 'style30a':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);

          label2 = document.createElement('span');
          label2.className = 'label2';
          li.appendChild(label2);

          label3 = document.createElement('span');
          label3.className = 'label3';
          li.appendChild(label3);

          break;
        case 'style35':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);

          label2 = document.createElement('span');
          label2.className = 'label2';
          li.appendChild(label2);

          break;

        case 'style36':

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);

          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          label2 = document.createElement('span');
          label2.className = 'label2';
          li.appendChild(label2);
          break;

        case 'style37':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          image2 = document.createElement('span');
          image2.className = 'image2';
          li.appendChild(image2);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);
          break;

        case 'style37a':
          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);

          label2 = document.createElement('span');
          label2.className = 'label2';
          li.appendChild(label2);
          break;

        case 'style38':

          image1 = document.createElement('span');
          image1.className = 'image1';
          li.appendChild(image1);

          line1 = document.createElement('span');
          line1.className = 'line1';
          li.appendChild(line1);

          label1 = document.createElement('span');
          label1.className = 'label1';
          li.appendChild(label1);

          label2 = document.createElement('span');
          label2.className = 'label2';
          li.appendChild(label2);

          image2 = document.createElement('span');
          image2.className = 'image2';
          li.appendChild(image2);
          break;

        default:
          log.error('List2: unknown list item style in pool: ' + i);
          break;
      }

      // add common elements
      caret = document.createElement('span');
      caret.className = 'caret';
      li.appendChild(caret);


      this.pool[i].push(li);
    }
  }
};

/** 2. DEFAULT ITEMS CONFIGURATION **/

/**
 * Prepare items
 * Extend the whole dataList so that every item
 * meet the required structure.
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._prepareItems = function(firstItem, lastItem)
{
  if ((firstItem == null) || (firstItem < 0))
  {
    firstItem = 0;
  }

  if ((lastItem == null) || (lastItem >= this.dataList.items.length))
  {
    lastItem = this.dataList.items.length - 1;
  }

  for (let i=firstItem, l=lastItem; i<=l; i++)
  {
    this.dataList.items[i] = this._prepareListItem(this.dataList.items[i]);
  }
};

/**
 * Prepare list item
 * A list item can be defined with minimal set of properties
 * that are needed for its proper display. In fact these
 * properties extend the default list item structure defined below.
 * This function sets default configuration for a valid list item and merge
 * it with the custom configuration passed to the item.
 * TAG: internal
 * =========================
 * @param {object} - the list item that will be set a default set of properties and will be returned
 * @return {object} - the complete list item
 */
List2Ctrl.prototype._prepareListItem = function(item)
{
  // The itemStyle property is required
  if (!item.hasOwnProperty('itemStyle'))
  {
    log.error('List2: list item should have itemStyle property: ' + item);
    return;
  }

  /*
     * All types of list items extend this
     * default structure by overriding the
     * values and adding specific ones. The
     * extended structure is then returned to be
     * fed in the dataList container.
     */
  const completeItem = {
    appData: null, // Any kind of data that will be passed in the callbacks
    text1Id: null, // String ID of the label
    text1SubMap: null, // String Sub Map of the label
    text1: '', // Textual content of the label
    hasCaret: true, // Show the caret icon on the right of the item
    disabled: false, // Whether the list item is disabled
    separator: 'normal', // normal /thick list seperator
    styleMod: '', // Style modifier, 'hint', 'bold', or ''/omitted
    disabledStyleMod: 'normal', // Disabled style modifier, 'normal' or 'white'
    background: 'normal', // Background modifier, 'normal' or 'grey'
    itemStyle: '', // String indicating the list type
    itemBehavior: 'shortPressOnly', // String "hold" behavior for the item ('shortPressOnly', 'shortAndHold', or 'shortAndLong')
    vuiSelectable: true, // Boolean for some items that cannot be selected by vui even when they are enabled
    _data: { // Object containing any item-specific data used ONLY by the control
      eventTimeout: null,
      lastEvent: null,
      settleTimeout: null,
      lastUpdated: null,
      settleValue: null,
    },
  };

  // extend the default structure with default specific properties
  let specificItem = {};
  switch (item.itemStyle)
  {
    case 'empty':
      specificItem = {hasCaret: false};
      break;
    case 'draggable':
      specificItem = {image1: '', button1Id: null, button1SubMap: null, button1: ''};
      break;
    case 'ghost':
      specificItem = {};
      break;
    case 'style01':
      specificItem = {image1: '', indented: false};
      break;
    case 'style02':
      specificItem = {image1: '', image2: ''};
      break;
    case 'style03':
      specificItem = {image1: '', image2: '', image3: '', checked: false, indented: false};
      break;
    case 'style03a':
      specificItem = {image1: '', label1Id: null, label1SubMap: null, label1: '', checked: false, labelWidth: 'wide2', label1Align: 'right', styleMod: 'hint'};
      break;
    case 'style04':
      specificItem = {image1: '', text2Id: null, text2SubMap: null, text2: ''};
      break;
    case 'style05':
      specificItem = {image1: '', image2: '', text2Id: null, text2SubMap: null, text2: ''};
      break;
    case 'style06':
      specificItem = {image1: '', label1Id: null, label1SubMap: null, label1: '', labelWidth: 'normal', label1Align: 'right', label1Warning: false};
      break;
    case 'style07':
      specificItem = {image1: '', label1Id: null, label1SubMap: null, label1: '', label2Id: null, label2SubMap: null, label2: '', labelWidth: 'normal', label1Align: 'right', label1Warning: false, label2Align: 'right', label2Warning: false};
      break;
    case 'style09':
      specificItem = {image1: '', text2Id: null, text2SubMap: null, text2: '', label1Id: null, label1SubMap: null, label1: '', label2Id: null, label2SubMap: null, label2: '', labelWidth: 'normal', label1Align: 'right', label1Warning: false, label2Align: 'right', label2Warning: false};
      break;
    case 'style10':
      specificItem = {button1Id: null, button1SubMap: null, button1: '', button2Id: null, button2SubMap: null, button2: '', value: 1, indeterminate: false, minChangeInterval: this.properties.toggleMinChangeInterval, settleTime: this.properties.toggleSettleTime};
      break;
    case 'style11':
      specificItem = {button1Id: null, button1SubMap: null, button1: '', button2Id: null, button2SubMap: null, button2: '', button3Id: null, button3SubMap: null, button3: '', value: 1, minChangeInterval: this.properties.toggleMinChangeInterval, settleTime: this.properties.toggleSettleTime};
      break;
    case 'style12':
      specificItem = {image1: '', min: 0, max: 1, increment: 0.1, value: 1, allowAdjust: true, showTickMarks: false, tickMarkObject: null, showLabels: false, labelObject: null, showPlusMinus: false, pivot: false, minChangeInterval: this.properties.minChangeInterval, settleTime: this.properties.settleTime, rotationIdleDetectTime: this.properties.rotationIdleDetectTime};
      break;
    case 'style13':
      // deprecated - issue a warning
      log.warn(this.uiaId + ': List2 style13 has been deprecated. Please use style12 instead. Setting pivot=True. Check SDD for details.');
      specificItem = {min: 0, max: 1, increment: 0.1, value: 1, allowAdjust: true, showTickMarks: false, tickMarkObject: null, showLabels: false, labelObject: null, showPlusMinus: false, pivot: true};
      break;
    case 'style14':
      specificItem = {image1: '', label1Id: null, label1SubMap: null, label1: '', text1Align: 'left'};
      break;
    case 'style17':
      specificItem = {image1: '', label1Id: null, label1SubMap: null, label1: ''};
      break;
    case 'style18':
      specificItem = {image1: '', label1Id: null, label1SubMap: null, label1: '', label2Id: null, label2SubMap: null, label2: ''};
      break;
    case 'style19':
      specificItem = {image1: ''};
      break;
    case 'style20':
      // nothing specific for this style
      break;
    case 'style21':
      specificItem = {image1: '', image2: '', label1Id: null, label1SubMap: null, label1: '', text2Id: null, text2SubMap: null, text2: ''};
      break;
    case 'style22':
      specificItem = {image1: '', image2: '', label1Id: null, label1SubMap: null, label1: '', indented: false};
    case 'style25':
      specificItem = {image1: '', image2: '', image3: '', text2Id: null, text2SubMap: null, text2: ''};
      break;
    case 'styleOnOff':
      specificItem = {image1: '', value: 2, minChangeInterval: this.properties.toggleMinChangeInterval, settleTime: this.properties.toggleSettleTime};
      break;
    case 'styleStep':
      specificItem = {image1: '', label1Id: null, label1SubMap: null, label1: '', label2Id: null, label2: '', min: 0, max: 36, increment: 1, value: 0, warning: false};
      break;
    case 'styleLock':
      specificItem = {image1: '', text2Id: null, text2SubMap: null, text2: '', locked: false};
      break;
    case 'style28':
      specificItem = {image1: '', min: 0, max: 1, increment: 0.1, value: 1, allowAdjust: true, showTickMarks: false, tickMarkObject: null, showLabels: false, labelObject: null, showPlusMinus: false, pivot: false, minChangeInterval: this.properties.minChangeInterval, settleTime: this.properties.settleTime, rotationIdleDetectTime: this.properties.rotationIdleDetectTime, indented: false};
      break;
    case 'style29':
      specificItem = {label1Id: null, label1SubMap: null, label1: '', label2Id: null, label2SubMap: null, label2: '', image1: ''};
      break;
    case 'style30a':
      specificItem = {image1: '', label1Id: null, label1SubMap: null, label1: '', label2Id: null, label2SubMap: null, label2: '', label3Id: null, label3SubMap: null, label3: '', isLabel2Disabled: 'false'};
      break;
    case 'style35':
      specificItem = {image1: '', label1Id: null, label1SubMap: null, label1: '', label2Id: null, label2SubMap: null, label2: ''};
      break;
    case 'style36':
      specificItem = {image1: '', label1Id: null, label1SubMap: null, label1: '', label2Id: null, label2SubMap: null, label2: ''};
      break;
    case 'style37':
      specificItem = {image1: '', text1Id: null, text1SubMap: null, text1: '', label1Id: null, label1SubMap: null, label1: '', image2: ''};
      break;
    case 'style37a':
      specificItem = {image1: '', text1Id: null, text1SubMap: null, text1: '', label1Id: null, label1SubMap: null, label1: '', label2Id: null, label2SubMap: null, label2: '', isLabel1Disabled: false};
      break;
    case 'style38':
      specificItem = {image1: '', text1Id: null, text1SubMap: null, text1: '', label1SubMap: null, label1: '', label2Id: null, label2SubMap: null, label2: '', image2: ''};
      break;
    default:
      log.error('List2: unknown item style: ' + item.itemStyle);
      break;
  }

  // Extend default structure with the specific one
  for (const i in specificItem)
  {
    completeItem[i] = specificItem[i];
  }

  // Extend default structure with the supplied item
  for (const j in item)
  {
    completeItem[j] = item[j];
  }

  return completeItem;
};


List2Ctrl.prototype._updateModifiedTimestamps = function(firstItem, lastItem)
{
  // update lastModified timestamp
  const now = new Date().getTime();
  for (let i=firstItem; i<=lastItem; i++)
  {
    if (this._hasData(i))
    {
      this.dataList.items[i]._data.lastUpdated = now;
    }
  }
};


/** 3. ITEMS LOCALIZATION **/

/**
 * Localize items
 * Localize text in known list items using localization framework.
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._localizeItems = function(firstItem, lastItem)
{
  log.debug('Localizing...');

  if ((firstItem == null) || (firstItem < 0))
  {
    firstItem = 0;
  }

  if ((lastItem == null) ||(lastItem >= this.dataList.items.length))
  {
    lastItem = this.dataList.items.length - 1;
  }

  // iterate through the dataList
  for (let i=firstItem, l=lastItem; i<=l; i++)
  {
    switch (this.dataList.items[i].itemStyle)
    {
      // no elements
      case 'empty':
        // do nothing
        break;

        // text1, button1
      case 'draggable':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        // label1 and label2 only supports for style38 for reorderList
        if (this._reorderItem.itemStyle === 'style38')
        {
          if (this.dataList.items[i].laebl1Id)
          {
            const label1 = this._getLocalizedString(this.dataList.items[i].laebl1Id, this.dataList.items[i].label1SubMap);
            this.dataList.items[i].label1 = label1;
          }
          if (this.dataList.items[i].laebl2Id)
          {
            const label2 = this._getLocalizedString(this.dataList.items[i].laebl2Id, this.dataList.items[i].label2SubMap);
            this.dataList.items[i].label2 = label2;
          }
        }
        if (this.dataList.items[i].button1Id)
        {
          const button1 = this._getLocalizedString(this.dataList.items[i].button1Id, this.dataList.items[i].button1SubMap);
          this.dataList.items[i].button1 = button1;
        }
        break;

        // no elements
      case 'ghost':
        // do nothing
        break;

        // text1
      case 'style01':
      case 'style02':
      case 'style03':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        break;

      case 'style03a':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, this.dataList.items[i].label1SubMap);
          this.dataList.items[i].label1 = label1;
        }
        break;

        // text1, text2
      case 'style04':
      case 'style05':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].text2Id)
        {
          const text2 = this._getLocalizedString(this.dataList.items[i].text2Id, this.dataList.items[i].text2SubMap);
          this.dataList.items[i].text2 = text2;
        }
        break;

        // text1, label1
      case 'style06':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, this.dataList.items[i].label1SubMap);
          this.dataList.items[i].label1 = label1;
        }
        break;

        // text1, label1, label2
      case 'style07':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, this.dataList.items[i].label1SubMap);
          this.dataList.items[i].label1 = label1;
        }
        if (this.dataList.items[i].label2Id)
        {
          const label2 = this._getLocalizedString(this.dataList.items[i].label2Id, this.dataList.items[i].label2SubMap);
          this.dataList.items[i].label2 = label2;
        }
        break;

        // text1, text2, label1, label2
      case 'style09':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].text2Id)
        {
          const text2 = this._getLocalizedString(this.dataList.items[i].text2Id, this.dataList.items[i].text2SubMap);
          this.dataList.items[i].text2 = text2;
        }
        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, this.dataList.items[i].label1SubMap);
          this.dataList.items[i].label1 = label1;
        }
        if (this.dataList.items[i].label2Id)
        {
          const label2 = this._getLocalizedString(this.dataList.items[i].label2Id, this.dataList.items[i].label2SubMap);
          this.dataList.items[i].label2 = label2;
        }
        break;

        // text1, button1, button2
      case 'style10':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].button1Id)
        {
          const button1 = this._getLocalizedString(this.dataList.items[i].button1Id, this.dataList.items[i].button1SubMap);
          this.dataList.items[i].button1 = button1;
        }
        if (this.dataList.items[i].button2Id)
        {
          const button2 = this._getLocalizedString(this.dataList.items[i].button2Id, this.dataList.items[i].button2SubMap);
          this.dataList.items[i].button2 = button2;
        }
        break;

        // text1, button1, button2, button3
      case 'style11':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].button1Id)
        {
          const button1 = this._getLocalizedString(this.dataList.items[i].button1Id, this.dataList.items[i].button1SubMap);
          this.dataList.items[i].button1 = button1;
        }
        if (this.dataList.items[i].button2Id)
        {
          const button2 = this._getLocalizedString(this.dataList.items[i].button2Id, this.dataList.items[i].button2SubMap);
          this.dataList.items[i].button2 = button2;
        }
        if (this.dataList.items[i].button3Id)
        {
          const button3 = this._getLocalizedString(this.dataList.items[i].button3Id, this.dataList.items[i].button3SubMap);
          this.dataList.items[i].button3 = button3;
        }
        break;

        // text1, labelLeft, labelRight
      case 'style12':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        break;

        // text1, labelLeft, labelCenter, labelRight
      case 'style13':
        // style13 is deprecated
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        break;

        // text1, label1
      case 'style14':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, this.dataList.items[i].label1SubMap);
          this.dataList.items[i].label1 = label1;
        }
        break;

        // text1, label1
      case 'style17':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, this.dataList.items[i].label1SubMap);
          this.dataList.items[i].label1 = label1;
        }
        break;

        // text1, label1, label2
      case 'style18':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, this.dataList.items[i].label1SubMap);
          this.dataList.items[i].label1 = label1;
        }
        if (this.dataList.items[i].label2Id)
        {
          const label2 = this._getLocalizedString(this.dataList.items[i].label2Id, this.dataList.items[i].label2SubMap);
          this.dataList.items[i].label2 = label2;
        }
        break;

        // text1
      case 'style19':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        break;

        // text1
      case 'style20':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        break;

        // text1, text2, label1
      case 'style21':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].text2Id)
        {
          const text2 = this._getLocalizedString(this.dataList.items[i].text2Id, this.dataList.items[i].text2SubMap);
          this.dataList.items[i].text2 = text2;
        }
        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, this.dataList.items[i].label1SubMap);
          this.dataList.items[i].label1 = label1;
        }
        break;

        // text1, label1
      case 'style22':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, this.dataList.items[i].label1SubMap);
          this.dataList.items[i].label1 = label1;
        }
        break;

        // text1, text2
      case 'style25':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].text2Id)
        {
          const text2 = this._getLocalizedString(this.dataList.items[i].text2Id, this.dataList.items[i].text2SubMap);
          this.dataList.items[i].text2 = text2;
        }
        break;

        // text1
      case 'styleOnOff':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        break;

        // text1, label1, label2
      case 'styleStep':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, this.dataList.items[i].label1SubMap);
          this.dataList.items[i].label1 = label1;
        }
        if (this.dataList.items[i].label2Id)
        {
          const label2 = this._getLocalizedString(this.dataList.items[i].label2Id, {value: this.dataList.items[i].value});
          this.dataList.items[i].label2 = label2;
        }
        else
        {
          log.warn(this.uiaId + ' possible issue. Lis2: item ' + i + ' does not specify label2Id');
        }
        break;

        // text1, text2
      case 'styleLock':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].text2Id)
        {
          const text2 = this._getLocalizedString(this.dataList.items[i].text2Id, this.dataList.items[i].text2SubMap);
          this.dataList.items[i].text2 = text2;
        }
        break;

      case 'style29':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }
        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, this.dataList.items[i].label1SubMap);
          this.dataList.items[i].label1 = label1;
        }
        if (this.dataList.items[i].label2Id)
        {
          const label2 = this._getLocalizedString(this.dataList.items[i].label2Id, this.dataList.items[i].label2SubMap);
          this.dataList.items[i].label2 = label2;
        }
        break;

      case 'style30a':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }

        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, {value: this.dataList.items[i].value});
          this.dataList.items[i].label1 = label1;
        }
        if (this.dataList.items[i].label2Id)
        {
          const label2 = this._getLocalizedString(this.dataList.items[i].label2Id, {value: this.dataList.items[i].value});
          this.dataList.items[i].label2 = label2;
        }
        if (this.dataList.items[i].label3Id)
        {
          const label3 = this._getLocalizedString(this.dataList.items[i].label3Id, {value: this.dataList.items[i].value});
          this.dataList.items[i].label3 = label3;
        }
        break;

      case 'style35':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }

        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, {value: this.dataList.items[i].value});
          this.dataList.items[i].label1 = label1;
        }

        if (this.dataList.items[i].label2Id)
        {
          const label2 = this._getLocalizedString(this.dataList.items[i].label2Id, {value: this.dataList.items[i].value});
          this.dataList.items[i].label2 = label2;
        }

        break;

      case 'style36':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }

        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, {value: this.dataList.items[i].value});
          this.dataList.items[i].label1 = label1;
        }

        if (this.dataList.items[i].label2Id)
        {
          const label2 = this._getLocalizedString(this.dataList.items[i].label2Id, {value: this.dataList.items[i].value});
          this.dataList.items[i].label2 = label2;
        }
        break;

      case 'style37':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }

        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, {value: this.dataList.items[i].value});
          this.dataList.items[i].label1 = label1;
        }
        break;
      case 'style37a':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }

        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, {value: this.dataList.items[i].value});
          this.dataList.items[i].label1 = label1;
        }
        if (this.dataList.items[i].label2Id)
        {
          const label2 = this._getLocalizedString(this.dataList.items[i].label2Id, {value: this.dataList.items[i].value});
          this.dataList.items[i].label2 = label2;
        }
        break;

      case 'style38':
        if (this.dataList.items[i].text1Id)
        {
          const text1 = this._getLocalizedString(this.dataList.items[i].text1Id, this.dataList.items[i].text1SubMap);
          this.dataList.items[i].text1 = text1;
        }

        if (this.dataList.items[i].label1Id)
        {
          const label1 = this._getLocalizedString(this.dataList.items[i].label1Id, {value: this.dataList.items[i].value});
          this.dataList.items[i].label1 = label1;
        }
        if (this.dataList.items[i].label2Id)
        {
          const label2 = this._getLocalizedString(this.dataList.items[i].label2Id, {value: this.dataList.items[i].value});
          this.dataList.items[i].label2 = label2;
        }
        break;
    }
  }
};

/**
 * Get localization entry for a string id
 * TAG: internal
 * =========================
 * @return {string}
 */
List2Ctrl.prototype._getLocalizedString = function(labelId, subMap)
{
  return framework.localize.getLocStr(this.uiaId, labelId, subMap);
};

/** 4. POOL OPERATIONS **/

/**
 * Set line 1 content
 * This helper function clears any previous content for the supplied
 * element class and sets new one. Then the list item is returned.
 * TAG: internal
 * =========================
 * @param {HTML element} - <li> element as taken from the pool
 * @param {string} - className of the taget element
 * @param {string} - textual content to be inserted
 * @param {boolean} - do not remove child html tags when inserting textual content
 * @return {HTML element} - <li> element with the new content
 */
List2Ctrl.prototype._setText = function(li, className, content, preserveHTML)
{
  if (!li)
  {
    log.error('Lis2: HTML LI element should be passed');
    return;
  }
  if (!className)
  {
    log.error('Lis2: className should be passed');
    return;
  }
  if (!content)
  {
    content = '';
  }
  li.querySelector(className).innerText = '';
  li.querySelector(className).appendChild(document.createTextNode(content));
  return li;
};

/**
 * Set image background
 * This helper function clears any previous path for the supplied
 * image class and sets new one. Then the list item is returned.
 * TAG: internal
 * =========================
 * @param {HTML element} - <li> element as taken from the pool
 * @param {string} - className of the taget element
 * @param {string} - path to the image
 * @return {HTML element} - <li> element with the new content
 */
List2Ctrl.prototype._setImage = function(li, className, url)
{
  if (!li)
  {
    log.error('Lis2: HTML LI element should be passed');
    return;
  }
  if (!className)
  {
    log.error('Lis2: className should be passed');
    return;
  }
  li.querySelector(className).style.backgroundImage = '';
  if ('' != url)
  {
    li.querySelector(className).style.backgroundImage = 'url(' + url + ')';
  }
  return li;
};

/**
 * Set slider
 * This helper function clears any previous slider in the list item
 * and cleans up local references. It then creates a new slider control
 * inside the list item and sets its values
 * TAG: internal
 * =========================
 * @param {HTML element} - <li> element as taken from the pool
 * @param {string} - className of the taget element
 * @param {object} - slider configuration
 * @return {HTML element} - <li> element with the new content
 */
List2Ctrl.prototype._setSlider = function(li, className, sliderProperties, itemIndex)
{
  if (!li)
  {
    log.error('Lis2: HTML LI element should be passed');
    return;
  }
  if (!className)
  {
    log.error('Lis2: className should be passed');
    return;
  }

  // get current item poolid
  const poolId = li.getAttribute('data-poolid');

  // get previous itemIndex for this particular li
  const prevItemIndex = li.getAttribute('data-ref');

  // destruct any previous sliders for this poolid and previous index
  if (prevItemIndex != 'undefined')
  {
    const hashKey = 'slider_'+prevItemIndex+'_'+poolId;

    // remove slider from the hash and the DOM
    if (this._sliders.hasOwnProperty(hashKey))
    {
      this._sliders[hashKey]['slider'].cleanUp();
      this._sliders[hashKey]['slider'].divElt.parentElement.removeChild(this._sliders[hashKey]['slider'].divElt);
    }
  }

  // add slider to the hash and the DOM
  const sliderCont = li.querySelector(className);
  if (sliderProperties && sliderCont)
  {
    const hashKey = 'slider_'+itemIndex+'_'+poolId;

    // instantiate slider and add it to the _sliders hash
    this._sliders[hashKey] = {};
    this._sliders[hashKey]['itemIndex'] = itemIndex;
    this._sliders[hashKey]['poolId'] = poolId;
    this._sliders[hashKey]['slider'] = framework.instantiateControl(this.uiaId, sliderCont, 'SliderCtrl', sliderProperties);
  }
  return li;
};

/**
 * Set toggle
 * This helper function clears any previous toggled buttons in
 * the supplied list item and sets initial toggle value
 * TAG: internal
 * =========================
 * @param {HTML element} - <li> element as taken from the pool
 * @param {string} - className of the taget element
 * @param {object} - slider configuration
 * @return {HTML element} - <li> element with the new content
 */
List2Ctrl.prototype._setToggle = function(li, className, value)
{
  if (!li)
  {
    log.error('Lis2: HTML LI element should be passed');
    return;
  }
  if (!className)
  {
    log.error('Lis2: className should be passed');
    return;
  }
  const buttons = li.querySelectorAll(className);
  for (let i=0; i<buttons.length; i++)
  {
    buttons[i].classList.remove('active');
    if (value === (i+1))
    {
      buttons[i].classList.add('active');
    }
  }
  return li;
};

/**
 * Get list item from the pool
 * This will result in decreasing the pool contents
 * with one item. The taken item will be added to the DOM
 * TAG: internal
 * =========================
 * @param {object} - the raw list item from the dataList
 * @param {integer} - valid list item index as defined in the dataList
 * @return {HTML element} - <li> element wit proper elements inside
 */
List2Ctrl.prototype._getListItem = function(listItem, dataListIndex)
{
  // get it from the pool
  const li = this.pool[listItem.itemStyle].shift();

  // remove any residual touch classes
  li.classList.remove('hit');
  li.classList.remove('focus');
  li.classList.remove('longpress');
  li.classList.remove('secondaryFocus');

  // add content to it following style definitions
  switch (listItem.itemStyle)
  {
    case 'empty':
      // empty item -> no content
      break;

    case 'draggable':
      // listItem : { text1:String, image1:String, button1:String }
      this._setText(li, '.line1', listItem.text1);
      if (this._reorderItem.itemStyle === 'style38' )
      {
        // For style 38 line1 width should be shorter as compare the other style.
        li.querySelector('.line1').classList.add('shortText');
      }

      // label1 and label2 only supports for style38 for reorderList
      if (this._reorderItem.itemStyle === 'style38' )
      {
        this._setText(li, '.label1', listItem.label1);
        this._setText(li, '.label2', listItem.label2);
      }
      this._setImage(li, '.image1', listItem.image1);
      this._setText(li, '.buttonOk', listItem.button1);
      break;

    case 'ghost':
      // list item : {}
      break;

    case 'style01':
      // listItem : { text1:String, image1:String }
      this._setText(li, '.line1', listItem.text1);
      this._setImage(li, '.image1', listItem.image1);

      // configure text indentation
      if (listItem.indented)
      {li.classList.add('indented');}
      else
      {li.classList.remove('indented');}

      break;

    case 'style02':
      // listItem : { text1:String, image1:String, image2:String }
      this._setText(li, '.line1', listItem.text1);
      this._setImage(li, '.image1', listItem.image1);
      if (listItem.image2 === 'indeterminate')
      {
        li.classList.add('indeterminate');
      }
      else
      {
        li.classList.remove('indeterminate');
        this._setImage(li, '.image2', listItem.image2);
      }
      break;

    case 'style03':
      // listItem : { text1:String, image1:String, image2:String, checked:Boolean }
      this._setText(li, '.line1', listItem.text1);
      if (listItem.image1 === 'checkbox')
      {
        li.classList.remove('radio');
        li.classList.remove('checkbox');
        li.classList.remove('tick');
        li.classList.add('checkbox');
      }
      else if (listItem.image1 === 'radio')
      {
        li.classList.remove('radio');
        li.classList.remove('checkbox');
        li.classList.remove('tick');
        li.classList.add('radio');
      }
      else if (listItem.image1 === 'tick')
      {
        li.classList.remove('radio');
        li.classList.remove('checkbox');
        li.classList.remove('tick');
        li.classList.add('tick');
      }
      else
      {
        li.classList.remove('checkbox');
        li.classList.remove('radio');
        li.classList.remove('tick');
        this._setImage(li, '.image1', listItem.image1);
      }
      this._setImage(li, '.image2', listItem.image2);
      this._setImage(li, '.image3', listItem.image3);
      if (listItem.checked)
      {
        li.classList.add('checked');
      }
      else
      {
        li.classList.remove('checked');
      }

      // configure text indentation
      if (listItem.indented)
      {li.classList.add('indented');}
      else
      {li.classList.remove('indented');}

      break;

    case 'style03a':
      // listItem : { text1:String, image1:String, label1: String}
      this._setText(li, '.line1', listItem.text1);
      if (listItem.image1 === 'checkbox')
      {
        li.classList.remove('radio');
        li.classList.remove('checkbox');
        li.classList.remove('tick');
        li.classList.add('checkbox');
      }
      else if (listItem.image1 === 'radio')
      {
        li.classList.remove('radio');
        li.classList.remove('checkbox');
        li.classList.remove('tick');
        li.classList.add('radio');
      }
      else if (listItem.image1 === 'tick')
      {
        li.classList.remove('radio');
        li.classList.remove('checkbox');
        li.classList.remove('tick');
        li.classList.add('tick');
      }
      else
      {
        li.classList.remove('checkbox');
        li.classList.remove('radio');
        li.classList.remove('tick');
        this._setImage(li, '.image1', listItem.image1);
      }

      if (listItem.checked)
      {
        li.classList.add('checked');
      }
      else
      {
        li.classList.remove('checked');
      }

      this._setText(li, '.label1', listItem.label1);

      // configure label width
      li.classList.remove('wideLabel');
      li.classList.remove('wideLabel2');
      switch (listItem.labelWidth)
      {
        case 'wide': li.classList.add('wideLabel'); break;
        case 'wide2': li.classList.add('wideLabel2'); break;
      }

      // configure label alignment
      li.classList.remove('label1Right');
      li.classList.remove('label1Left');
      li.classList.remove('label1Center');
      switch (listItem.label1Align)
      {
        case 'right': li.classList.add('label1Right'); break;
        case 'left': li.classList.add('label1Left'); break;
        case 'center': li.classList.add('label1Center'); break;
        default: li.classList.add('label1Right'); break;
      }

      // configure label warning
      if (listItem.label1Warning)
      {li.classList.add('label1Warning');}
      else
      {li.classList.remove('label1Warning');}

      break;

    case 'style04':
      // listItem : { text1:String, text2:String, image1:String }
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.line2', listItem.text2);
      this._setImage(li, '.image1', listItem.image1);
      break;

    case 'style05':
      // listItem : { text1:String, text2:String, image1:String, image2:String }
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.line2', listItem.text2);
      this._setImage(li, '.image1', listItem.image1);
      this._setImage(li, '.image2', listItem.image2);
      break;

    case 'style06':
      // listItem : { text1:String, label1:String, image1:String }
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.label1', listItem.label1);
      this._setImage(li, '.image1', listItem.image1);

      // configure label width
      li.classList.remove('wideLabel');
      li.classList.remove('wideLabel2');
      switch (listItem.labelWidth)
      {
        case 'wide': li.classList.add('wideLabel'); break;
        case 'wide2': li.classList.add('wideLabel2'); break;
      }

      // configure label alignment
      li.classList.remove('label1Right');
      li.classList.remove('label1Left');
      li.classList.remove('label1Center');
      switch (listItem.label1Align)
      {
        case 'right': li.classList.add('label1Right'); break;
        case 'left': li.classList.add('label1Left'); break;
        case 'center': li.classList.add('label1Center'); break;
        default: li.classList.add('label1Right'); break;
      }

      // configure label warning
      if (listItem.label1Warning)
      {li.classList.add('label1Warning');}
      else
      {li.classList.remove('label1Warning');}

      if (listItem.indented)
      {li.classList.add('indented');}
      else
      {li.classList.remove('indented');}

      break;

    case 'style07':
      // listItem : { text1:String, label1:String, label2:String, image1:String }
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.label1', listItem.label1);
      this._setText(li, '.label2', listItem.label2);
      this._setImage(li, '.image1', listItem.image1);

      // configure label width
      li.classList.remove('wideLabel');
      li.classList.remove('wideLabel2');
      switch (listItem.labelWidth)
      {
        case 'wide': li.classList.add('wideLabel'); break;
        case 'wide2': li.classList.add('wideLabel2'); break;
      }

      // configure label alignment
      li.classList.remove('label1Right');
      li.classList.remove('label1Left');
      li.classList.remove('label1Center');
      li.classList.remove('label2Right');
      li.classList.remove('label2Left');
      li.classList.remove('label2Center');
      switch (listItem.label1Align)
      {
        case 'right': li.classList.add('label1Right'); break;
        case 'left': li.classList.add('label1Left'); break;
        case 'center': li.classList.add('label1Center'); break;
        default: li.classList.add('label1Right'); break;
      }
      switch (listItem.label2Align)
      {
        case 'right': li.classList.add('label2Right'); break;
        case 'left': li.classList.add('label2Left'); break;
        case 'center': li.classList.add('label2Center'); break;
        default: li.classList.add('label2Right'); break;
      }

      // configure label warning
      if (listItem.label1Warning)
      {li.classList.add('label1Warning');}
      else
      {li.classList.remove('label1Warning');}
      if (listItem.label2Warning)
      {li.classList.add('label2Warning');}
      else
      {li.classList.remove('label2Warning');}

      break;

    case 'style09':
      // listItem : { text1:String, text2:String, label1:String, label2:String, image1:String }
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.line2', listItem.text2);
      this._setText(li, '.label1', listItem.label1);
      this._setText(li, '.label2', listItem.label2);
      this._setImage(li, '.image1', listItem.image1);

      // configure label width
      li.classList.remove('wideLabel');
      li.classList.remove('wideLabel2');
      switch (listItem.labelWidth)
      {
        case 'wide': li.classList.add('wideLabel'); break;
        case 'wide2': li.classList.add('wideLabel2'); break;
      }

      // configure label alignment
      li.classList.remove('label1Right');
      li.classList.remove('label1Left');
      li.classList.remove('label1Center');
      li.classList.remove('label2Right');
      li.classList.remove('label2Left');
      li.classList.remove('label2Center');
      switch (listItem.label1Align)
      {
        case 'right': li.classList.add('label1Right'); break;
        case 'left': li.classList.add('label1Left'); break;
        case 'center': li.classList.add('label1Center'); break;
        default: li.classList.add('label1Right'); break;
      }
      switch (listItem.label2Align)
      {
        case 'right': li.classList.add('label2Right'); break;
        case 'left': li.classList.add('label2Left'); break;
        case 'center': li.classList.add('label2Center'); break;
        default: li.classList.add('label2Right'); break;
      }

      // configure label warning
      if (listItem.label1Warning)
      {li.classList.add('label1Warning');}
      else
      {li.classList.remove('label1Warning');}
      if (listItem.label2Warning)
      {li.classList.add('label2Warning');}
      else
      {li.classList.remove('label2Warning');}

      break;

    case 'style10':
      // listItem : { text1:String, button1:String, button2:String, value:Integer }
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.button1', listItem.button1);
      this._setText(li, '.button2', listItem.button2);
      this._setToggle(li, '.button', this.m.max(this.m.min(listItem.value, 2), 0) );
      if (listItem.indeterminate)
      {
        li.classList.add('indeterminate');
      }
      else
      {
        li.classList.remove('indeterminate');
      }
      break;

    case 'style11':
      // listItem : { text1:String, button1:String, button2:String, button3:String, value:Integer }
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.button1', listItem.button1);
      this._setText(li, '.button2', listItem.button2);
      this._setText(li, '.button3', listItem.button3);
      this._setToggle(li, '.button', this.m.max(this.m.min(listItem.value, 3), 0) );
      break;

    case 'style12':
      // listItem : { text1:String, image1:String, labelLeft:String, labelRight:String }
      this._setText(li, '.line1', listItem.text1);
      this._setImage(li, '.image1', listItem.image1);

      // extend tickmark object
      if (listItem.tickMarkObject)
      {
        listItem.tickMarkObject.tickMarkStyle = 'List2CtrlSliderTickMark';
        listItem.tickMarkObject.centerMarkTopStyle = 'List2CtrlCenterMarkTop';
        listItem.tickMarkObject.centerMarkBottomStyle = 'List2CtrlCenterMarkBottom';
        listItem.tickMarkObject.numberStyle = 'List2CtrlTickNumber';
      }

      // extend label object
      if (listItem.labelObject)
      {
        listItem.labelObject.leftLabelStyle = 'List2CtrlSliderLeftLabel';
        listItem.labelObject.rightLabelStyle = 'List2CtrlSliderRightLabel';
        listItem.labelObject.centerLabelStyle = 'List2CtrlSliderCenterLabel';
      }

      // instantiate SliderCtrl in the subcontainer
      // TODO: how about a pool of sliders? -> need slider API for setting properties
      let sliderProperties = {
        style: listItem.allowAdjust ? listItem.pivot ? 'pivot' : 'slider' : 'progress',
        slideCallback: this._slideCallback.bind(this, dataListIndex),
        minChangeInterval: listItem.minChangeInterval,
        settleTime: listItem.settleTime,
        rotationIdleDetectTime: listItem.rotationIdleDetectTime,
        min: listItem.min,
        max: listItem.max,
        increment: listItem.increment,
        value: listItem.value,

        // tickmarks, labels and +/-
        showTickMarks: listItem.showTickMarks,
        tickMarkObject: listItem.tickMarkObject,
        showLabels: listItem.showLabels,
        labelObject: listItem.labelObject,
        showPlusMinus: listItem.showPlusMinus,
        plusMinusObject: listItem.showPlusMinus ? {plusSignStyle: 'List2CtrlSliderPlus', minusSignStyle: 'List2CtrlSliderMinus'} : null, // default +/- object

        appData: listItem.appData,
        wrapperClass: 'List2CtrlSliderCtrl', // (CSS Class) CSS Class passed in to define the appearance of the slider wrapper
        fillClass: 'List2CtrlSliderCtrlFill', // (CSS Class) CSS Class passed in to define the appearance of the fill
        handleClass: 'List2CtrlSliderCtrlHandle', // (CSS Class) CSS Class passed in to define the appearance of the handle
        focusedWrapperClass: 'List2CtrlSliderCtrlFocusedWrapper', // (CSS Class) Optional CSS Class to define the appearance of the slider wrapper when the slider has MC focus
        focusedFillClass: 'List2CtrlSliderCtrlFocusedFill', // (CSS Class) Optional CSS Class to define the appearance of the fill when the slider has MC focus
        focusedHandleClass: 'List2CtrlSliderCtrlFocusedHandle', // (CSS Class) Optional CSS Class to define the appearance of the handle when the slider has MC focus

        width: this.properties.sliderWidth,
        handleWidth: this.properties.sliderHandleWidth,
      };
      this._setSlider(li, '.subcontainer', sliderProperties, dataListIndex);

      if (listItem.allowAdjust)
      {
        li.classList.add('adjustable');
        li.classList.remove('notAdjustable');
      }
      else
      {
        li.classList.remove('adjustable');
        li.classList.add('notAdjustable');
      }

      break;

    case 'style13':
      // TODO: style13 has been depricated
      // listItem : { text1:String, labelLeft:String, labelCenter:String, labelRight:String }
      this._setText(li, '.line1', listItem.text1);

      // extend tickmark object
      if (listItem.tickMarkObject)
      {
        listItem.tickMarkObject.tickMarkStyle = 'List2CtrlSliderTickMark';
        listItem.tickMarkObject.centerMarkTopStyle = 'List2CtrlCenterMarkTop';
        listItem.tickMarkObject.centerMarkBottomStyle = 'List2CtrlCenterMarkBottom';
        listItem.tickMarkObject.numberStyle = 'List2CtrlTickNumber';
      }

      // extend label object
      if (listItem.labelObject)
      {
        listItem.labelObject.leftLabelStyle = 'List2CtrlSliderLeftLabel';
        listItem.labelObject.rightLabelStyle = 'List2CtrlSliderRightLabel';
        listItem.labelObject.centerLabelStyle = 'List2CtrlSliderCenterLabel';
      }

      // instantiate SliderCtrl in the subcontainer
      // TODO: how about a pool of sliders? -> need slider API for setting properties
      let sliderProperties = {
        style: listItem.allowAdjust ? listItem.pivot ? 'pivot' : 'slider' : 'progress',
        slideCallback: this._slideCallback.bind(this, dataListIndex),
        minChangeInterval: this.properties.minChangeInterval,
        settleTime: this.properties.settleTime,
        min: listItem.min,
        max: listItem.max,
        increment: listItem.increment,
        value: listItem.value,

        // tickmarks, labels and +/-
        showTickMarks: listItem.showTickMarks,
        tickMarkObject: listItem.tickMarkObject,
        showLabels: listItem.showLabels,
        labelObject: listItem.labelObject,
        showPlusMinus: listItem.showPlusMinus,
        plusMinusObject: listItem.showPlusMinus ? {plusSignStyle: 'List2CtrlSliderPlus', minusSignStyle: 'List2CtrlSliderMinus'} : null, // default +/- object

        appData: listItem.appData,
        wrapperClass: 'List2CtrlSliderCtrl', // (CSS Class) CSS Class passed in to define the appearance of the slider wrapper
        fillClass: 'List2CtrlSliderCtrlFill', // (CSS Class) CSS Class passed in to define the appearance of the fill
        handleClass: 'List2CtrlSliderCtrlHandle', // (CSS Class) CSS Class passed in to define the appearance of the handle
        focusedWrapperClass: 'List2CtrlSliderCtrlFocusedWrapper', // (CSS Class) Optional CSS Class to define the appearance of the slider wrapper when the slider has MC focus
        focusedFillClass: 'List2CtrlSliderCtrlFocusedFill', // (CSS Class) Optional CSS Class to define the appearance of the fill when the slider has MC focus
        focusedHandleClass: 'List2CtrlSliderCtrlFocusedHandle', // (CSS Class) Optional CSS Class to define the appearance of the handle when the slider has MC focus

        width: this.properties.sliderWidth,
        handleWidth: this.properties.sliderHandleWidth,
      };
      this._setSlider(li, '.subcontainer', sliderProperties, dataListIndex);

      if (listItem.allowAdjust)
      {
        li.classList.add('adjustable');
        li.classList.remove('notAdjustable');
      }
      else
      {
        li.classList.remove('adjustable');
        li.classList.add('notAdjustable');
      }

      break;

    case 'style14':
      // listItem : { text1:String, label1:String, image1:String }
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.label1', listItem.label1);
      this._setImage(li, '.image1', listItem.image1);

      if ('right' == listItem.text1Align)
      {
        li.classList.add('text1AlignRight');
      }
      else
      {
        li.classList.remove('text1AlignRight');
      }

      break;

    case 'style17':
      // listItem : { text1:String, label1:String, image1:String }
      li.querySelector('.line1').innerText = '';
      const label1 = document.createElement('span');
      label1.className = 'label1';
      label1.appendChild(document.createTextNode(listItem.label1));
      li.querySelector('.line1').appendChild(label1);
      li.querySelector('.line1').appendChild(document.createTextNode(listItem.text1));
      this._setImage(li, '.image1', listItem.image1);
      break;

    case 'style18':
      // listItem : { text1:String, label1:String, label2:String, image1:String }
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.label1', listItem.label1);
      this._setText(li, '.label2', listItem.label2);
      this._setImage(li, '.image1', listItem.image1);
      break;

    case 'style19':
      // listItem : { text1:String, image1:String }
      this._setText(li, '.line1', listItem.text1);
      this._setImage(li, '.image1', listItem.image1);
      break;

    case 'style20':
      // listItem : { text1:String }
      this._setText(li, '.button1', listItem.text1);
      break;

    case 'style21':
      // listItem : { text1:String, text2:String, label1:String, image1:String, image2:String }
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.line2', listItem.text2);
      this._setText(li, '.label1', listItem.label1);
      this._setImage(li, '.image1', listItem.image1);
      this._setImage(li, '.image2', listItem.image2);

      // configure label alignment
      li.classList.remove('label1Right');
      li.classList.remove('label1Left');
      li.classList.remove('label1Center');
      switch (listItem.label1Align)
      {
        case 'right': li.classList.add('label1Right'); break;
        case 'left': li.classList.add('label1Left'); break;
        case 'center': li.classList.add('label1Center'); break;
        default: li.classList.add('label1Right'); break;
      }

      // configure label warning
      if (listItem.label1Warning)
      {li.classList.add('label1Warning');}
      else
      {li.classList.remove('label1Warning');}

      break;

    case 'style22':
      // listItem : { text1:String, label1:String, image1:String, image2:String }
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.label1', listItem.label1);
      this._setImage(li, '.image1', listItem.image1);
      this._setImage(li, '.image2', listItem.image2);

      // configure label alignment
      li.classList.remove('label1Right');
      li.classList.remove('label1Left');
      li.classList.remove('label1Center');
      switch (listItem.label1Align)
      {
        case 'right': li.classList.add('label1Right'); break;
        case 'left': li.classList.add('label1Left'); break;
        case 'center': li.classList.add('label1Center'); break;
        default: li.classList.add('label1Right'); break;
      }

      // configure label warning
      if (listItem.label1Warning)
      {li.classList.add('label1Warning');}
      else
      {li.classList.remove('label1Warning');}

      // configure text indentation
      if (listItem.indented)
      {li.classList.add('indented');}
      else
      {li.classList.remove('indented');}

      break;

    case 'style25':
      // listItem : { text1:String, text2:String, image1:String, image2:String, image3:String }
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.line2', listItem.text2);
      this._setImage(li, '.image1', listItem.image1);
      this._setImage(li, '.image2', listItem.image2);
      this._setImage(li, '.image3', listItem.image3);
      break;

    case 'styleOnOff':
      // listItem : { text1:String, image1:String }
      this._setText(li, '.line1', listItem.text1);
      this._setImage(li, '.image1', listItem.image1);
      if (listItem.value === 1)
      {
        li.classList.add('checked');
      }
      else
      {
        li.classList.remove('checked');
      }
      break;

    case 'styleStep':
      // listItem : { text1:String, label1:String, label2:String, image1:String }
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.label1', listItem.label1);
      this._setText(li, '.label2', listItem.label2);
      this._setImage(li, '.image1', listItem.image1);
      li.classList.remove('maxReached');
      li.classList.remove('minReached');
      if (listItem.value === listItem.max)
      {
        li.classList.add('maxReached');
      }
      else if (listItem.value === listItem.min)
      {
        li.classList.add('minReached');
      }

      // configure label warning
      if (listItem.warning)
      {li.classList.add('warning');}
      else
      {li.classList.remove('warning');}

      break;

    case 'styleLock':
      // listItem : { text1:String, text2:String, image1:String }
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.line2', listItem.text2);
      this._setImage(li, '.image1', listItem.image1);
      if (listItem.locked)
      {
        li.classList.add('locked');
      }
      else
      {
        li.classList.remove('locked');
      }
      break;

    case 'style28':
      // listItem : { text1:String, image1:String, labelLeft:String, labelRight:String }
      this._setImage(li, '.image1', listItem.image1);

      if (listItem.indented)
      {li.classList.add('indented');}
      else
      {li.classList.remove('indented');}
      // instantiate SliderCtrl in the subcontainer
      // TODO: how about a pool of sliders? -> need slider API for setting properties
      let sliderProperties = {
        style: listItem.allowAdjust ? listItem.pivot ? 'pivot' : 'slider' : 'progress',
        slideCallback: this._slideCallback.bind(this, dataListIndex),
        minChangeInterval: listItem.minChangeInterval,
        settleTime: listItem.settleTime,
        rotationIdleDetectTime: listItem.rotationIdleDetectTime,
        min: listItem.min,
        max: listItem.max,
        increment: listItem.increment,
        value: listItem.value,

        // tickmarks, labels and +/-
        showTickMarks: listItem.showTickMarks,
        tickMarkObject: listItem.tickMarkObject,
        showLabels: listItem.showLabels,
        labelObject: listItem.labelObject,
        showPlusMinus: listItem.showPlusMinus,
        plusMinusObject: listItem.showPlusMinus ? {plusSignStyle: 'List2CtrlSliderPlus', minusSignStyle: 'List2CtrlSliderMinus'} : null, // default +/- object

        appData: listItem.appData,
        wrapperClass: 'List2CtrlSliderCtrl', // (CSS Class) CSS Class passed in to define the appearance of the slider wrapper
        fillClass: 'List2CtrlSliderCtrlFill', // (CSS Class) CSS Class passed in to define the appearance of the fill
        handleClass: 'List2CtrlSliderCtrlHandle', // (CSS Class) CSS Class passed in to define the appearance of the handle
        focusedWrapperClass: 'List2CtrlSliderCtrlFocusedWrapper', // (CSS Class) Optional CSS Class to define the appearance of the slider wrapper when the slider has MC focus
        focusedFillClass: 'List2CtrlSliderCtrlFocusedFill', // (CSS Class) Optional CSS Class to define the appearance of the fill when the slider has MC focus
        focusedHandleClass: 'List2CtrlSliderCtrlFocusedHandle', // (CSS Class) Optional CSS Class to define the appearance of the handle when the slider has MC focus

        width: this.properties.sliderWidth,
        handleWidth: this.properties.sliderHandleWidth,
      };


      this._setSlider(li, '.subcontainer', sliderProperties, dataListIndex);

      if (listItem.allowAdjust)
      {
        li.classList.add('adjustable');
        li.classList.remove('notAdjustable');
      }
      else
      {
        li.classList.remove('adjustable');
        li.classList.add('notAdjustable');
      }

      break;

    case 'style29':

      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.label1', listItem.label1);
      this._setText(li, '.label2', listItem.label2);
      this._setImage(li, '.image1', listItem.image1);
      break;

    case 'style30a':

      this._setImage(li, '.image1', listItem.image1);
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.label1', listItem.label1);
      this._setText(li, '.label2', listItem.label2);
      this._setText(li, '.label3', listItem.label3);

      if (listItem.isLabel2Disabled)
      {
        li.querySelector('.label2').classList.add('disabled');
      }
      else
      {
        li.querySelector('.label2').classList.remove('disabled');
      }
      break;

    case 'style35':

      this._setImage(li, '.image1', listItem.image1);
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.label1', listItem.label1);
      this._setText(li, '.label2', listItem.label2);
      break;

    case 'style36':

      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.label1', listItem.label1);
      this._setImage(li, '.image1', listItem.image1);
      this._setText(li, '.label2', listItem.label2);
      break;

    case 'style37':
      this._setImage(li, '.image1', listItem.image1);
      this._setText(li, '.line1', listItem.text1);
      this._setImage(li, '.image2', listItem.image2);
      this._setText(li, '.label1', listItem.label1);
      break;

    case 'style37a':
      this._setImage(li, '.image1', listItem.image1);
      this._setText(li, '.line1', listItem.text1);
      this._setText(li, '.label1', listItem.label1);
      this._setText(li, '.label2', listItem.label2);

      if (listItem.isLabel1Disabled)
      {
        li.querySelector('.label1').classList.add('disabled');
      }
      else
      {
        li.querySelector('.label1').classList.remove('disabled');
      }
      break;

    case 'style38':

      if (listItem.text1)
      {
        this._setImage(li, '.image1', listItem.image1);
        this._setText(li, '.line1', listItem.text1);
        this._setText(li, '.label1', listItem.label1);
        this._setText(li, '.label2', listItem.label2);
        this._setImage(li, '.image2', listItem.image2);
      }
      else
      {
        this._setImage(li, '.image1', listItem.image1);
        this._setText(li, '.line1', '');
        this._setText(li, '.label1', '');
        this._setText(li, '.label2', '');
        this._setImage(li, '.image2', listItem.image2);
      }
      break;
  }

  /* ITEM MODIFICATORS */
  // add/remove hasCaret class
  if (listItem.hasCaret)
  {
    li.classList.add('hasCaret');
  }
  else
  {
    li.classList.remove('hasCaret');
  }

  if ('thick'== listItem.separator)
  {
    li.classList.add('thickSeparator');
  }
  else
  {
    li.classList.remove('thickSeparator');
  }
  // add/remove disabled class
  if (listItem.disabled)
  {
    li.classList.add('disabled');
  }
  else
  {
    li.classList.remove('disabled');
  }

  // add/remove styleMod class (hint/bold/'')
  if ('hint' == listItem.styleMod)
  {
    li.classList.remove('bold');
    li.classList.add('hint');
  }
  else if ('bold' == listItem.styleMod)
  {
    li.classList.remove('hint');
    li.classList.add('bold');
  }
  else if ('both' == listItem.styleMod)
  {
    li.classList.add('hint');
    li.classList.add('bold');
  }
  else
  {
    li.classList.remove('hint');
    li.classList.remove('bold');
  }

  // add/remove background modifier class (normal/grey)
  if ('grey' == listItem.background)
  {
    li.classList.remove('bgLightGrey');
    li.classList.add('bgGrey');
  }
  else if ('lightGrey' == listItem.background)
  {
    li.classList.remove('bgGrey');
    li.classList.add('bgLightGrey');
  }
  else
  {
    li.classList.remove('bgLightGrey');
    li.classList.remove('bgGrey');
  }

  // add disabled style mod
  if ('white' === listItem.disabledStyleMod)
  {
    li.classList.add('disabledWhite');
  }

  // CRI-1000 start
  const currentUiaId = framework.getCurrentApp(); // Get current app name
  if ('schedmaint' === currentUiaId)
  {
    const currentContextId = framework.getCurrCtxtId(); // Get current screen name

    if ( ('OilChangeDetail' === currentContextId ) &&
             ('normal' === listItem.disabledStyleMod ) )
    {
      li.classList.remove('disabledWhite'); // Remove disabledWhite from classlist
    } else {
      // do noting
    }
  } else {
    // do noting
  }
  // CRI-1000 end

  // return it
  return li;
};

/**
 * Return list item to the pool
 * This will result in increasing the pool contents
 * with one item. The returned item will be removed from the DOM.
 * However, its content will not be reset as this is done in the
 * process of any subsequent pool extraction (see _getListItem() above)
 * TAG: internal
 * =========================
 * @param {HTML element} - <li> element from the DOM
 * @return {void}
 */
List2Ctrl.prototype._returnListItem = function(li)
{
  // get the style
  const itemStyle = li.getAttribute('data-itemStyle');
  // reset it
  li.style.top = '0px';
  // remove it
  li.parentNode.removeChild(li);

  // put it back to the pool
  this.pool[itemStyle].push(li);
};

/**
 * Put a list item to the scroller
 * TAG: internal
 * =========================
 * @param {HTML element} - <li> element from the DOM
 * @param {integer}
 * @param {string}
 * @return {void}
 */
List2Ctrl.prototype._putToScroller = function(li, index, operation)
{
  li.style.top = index * this.properties.itemHeight + 'px';
  li.setAttribute('data-ref', index);


  if (operation == 'prepend')
  {
    this.items.unshift({ref: index, domElt: li});
    this.scroller.insertBefore(li, this.scroller.firstChild);

    this._wrapInlineElement(li);
  }
  else if (operation == 'append')
  {
    this.items.push({ref: index, domElt: li});
    this.scroller.appendChild(li);

    this._wrapInlineElement(li);
  }
  else if (!isNaN(operation))
  {
    this.items.splice(operation, 0, {ref: index, domElt: li});

    // insertBefore breaks in Opera - use appendChild instead
    // this.scroller.insertBefore(li, this.items[operation+1]);
    this.scroller.appendChild(li);

    this._wrapInlineElement(li);
  }
  else
  {
    log.error('Lis2: unknown _putToScroller() operation: ' + li + ' ' + index + ' ' + operation);
  }
};

/**
 * Return everything into the pool and empty the scroller
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._emptyScroller = function()
{
  for (let i=0, l=this.items.length; i<l; i++)
  {
    const item = this.items.shift();
    this._returnListItem(item.domElt);
  }
};

/**
 * Set the scroller's pixel height, based on the number of items currently in the list.
 * Set the scroller DOM element's height, and update the _scrollerHeight internal variable.
 * Use the _scrollerHeight variable to avoid having to extract the scroller height from the
 * scroller DOM element's 'offsetHeight' attribute (which may not yet be updated by Opera).
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._setScrollerHeight = function()
{
  const additionalSpace = this._getAdditionalSpace();
  this._scrollerHeight = this.dataList.itemCount * this.properties.itemHeight + additionalSpace;
  this.scroller.style.height = this._scrollerHeight + 'px';

  // NOTE: Used to be this.scroller.offsetHeight.  We're assuming there's no border and/or padding on the scroller DOM element.
  this._scrollerH = this._scrollerHeight;
};

/**
 * Set the scroll indicator's pixel height, based on the current scroller height.  Set the
 * scroll indicator DOM element's height, and update the _scrollIndicatorHeight internal variable.
 * Use the _scrollIndicatorHeight variable to avoid having to extract the scroll indicator height
 * from the scroll indicator DOM element's 'offsetHeight' attribute (which may not yet be updated
 * by Opera).
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._setScrollIndicatorHeight = function()
{
  const indicatorSize = Math.round(this.mask.offsetHeight * (this.mask.offsetHeight / this._scrollerHeight));
  this._scrollIndicatorHeight = this.m.max(indicatorSize, this.properties.scrollIndicatorMinSize);
  this.scrollIndicator.style.height = this._scrollIndicatorHeight + 'px';
};

/** 5. DYNAMIC LIST ITEMS **/

/**
 * Update range
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._updateRange = function()
{
  const itemsBefore = this.properties.itemsBefore;
  const itemsAfter = this.properties.itemsAfter;
  const topItem = this._topItem;
  const numOfScrolledElements = topItem - this._prevTopItem;
  const itemsOnScreen = itemsBefore + itemsAfter + 1;

  if (this.m.abs(numOfScrolledElements) > itemsOnScreen)
  {
    // return everything into the pool
    const itemsLength = this.items.length;
    for (let i=0; i < itemsLength; i++)
    {
      const item = this.items.shift();
      this._returnListItem(item.domElt);
    }

    let dataListIndex = 0;

    if (topItem < this.dataList.items.length - Math.round(itemsOnScreen / 2) &&
            topItem > Math.round((itemsOnScreen / 2)) )
    {
      // WE ARE IN THE MIDDLE

      for (let i=0; i < itemsLength; i++)
      {
        dataListIndex = (topItem - itemsBefore) + i;

        // we've reached the end of the dataList. No more items to add -> break
        if (dataListIndex >= this.dataList.items.length)
        {
          break;
        }

        // request it if it is empty
        if (this.dataList.items[dataListIndex].text1 == '' && this._displayWithoutText(this.dataList.items[dataListIndex]))
        {
          this._requestMore(dataListIndex, 'middle');
        }

        // get it from pool
        const li = this._getListItem(this.dataList.items[dataListIndex], dataListIndex);

        // put it to scroller
        this._putToScroller(li, dataListIndex, 'append');
      }
    }
    else
    {
      if (numOfScrolledElements > 0)
      {
        // PRESSED END BUTTON

        for (let i=0; i < itemsLength; i++)
        {
          dataListIndex = (this.dataList.items.length - itemsLength) + i;

          // request it if it is empty
          if (this.dataList.items[dataListIndex].text1 == '' && this._displayWithoutText(this.dataList.items[dataListIndex]))
          {
            this._requestMore(dataListIndex, 'down');
          }

          // get it from pool
          const li = this._getListItem(this.dataList.items[dataListIndex], dataListIndex);

          // put it to scroller
          this._putToScroller(li, dataListIndex, 'append');
        }
      }
      else if (numOfScrolledElements < 0)
      {
        // PRESSED HOME BUTTON

        for (let i=0; i < itemsLength; i++)
        {
          dataListIndex = i;


          // request it if it is empty
          if (this.dataList.items[dataListIndex].itemStyle === 'empty' || (this.dataList.items[dataListIndex].text1 == '' && this._displayWithoutText(this.dataList.items[dataListIndex])))
          {
            this._requestMore(dataListIndex, 'down');
            log.debug('Requesting items ' + dataListIndex);
          }

          // get it from pool
          const li = this._getListItem(this.dataList.items[dataListIndex], dataListIndex);

          // put it to scroller
          this._putToScroller(li, dataListIndex, 'append');
        }
      }
    }
  }
  else
  {
    if (numOfScrolledElements > 0)
    {
      /* SCROLL DOWN BOF */

      // return to pool
      const firstItemRef = this.items[0].ref;
      const bottomDifference = topItem - firstItemRef;
      let extraEls = bottomDifference - itemsBefore;

      // extraEls cannot be more than the poolsize - NOTE: this breaks the items array
      // extraEls = this.m.min(extraEls, this.properties.poolsize-1);
      // extraEls cannot be more than the items array - NOTE: introduced not to break the items array
      extraEls = this.m.min(extraEls, this.items.length-1);

      log.debug('    Scroll Down - extraEls ' + extraEls);

      if (extraEls > 0)
      {
        for (let i=0; i < extraEls; i++)
        {
          const item = this.items.shift();
          this._returnListItem(item.domElt);
        }
      }

      // lastItemRef = this.items[this.items.length-1].ref;
      // Note: this is not defined as a separate variable because the
      // this.items array is being modified in the below cycle

      // get from pool
      const topDifference = this.items[this.items.length-1].ref - ( topItem - 1 );
      let newEls = ( itemsAfter + 1 ) - topDifference;

      // newEls cannot be more than the poolsize
      newEls = this.m.min(newEls, this.properties.poolsize-1);

      log.debug('    Scroll Down - newEls ' + newEls);

      if (newEls > 0)
      {
        for (let i=0; i<newEls; i++)
        {
          // index in the dataList
          const dataListIndex = this.items[this.items.length-1].ref + 1;

          if (dataListIndex <= this.dataList.items.length-1)
          {
            // if empty item is encountered, request more data
            if (this.dataList.items[dataListIndex].itemStyle === 'empty' || (this.dataList.items[dataListIndex].text1 == '' && this._displayWithoutText(this.dataList.items[dataListIndex])))
            {
              this._requestMore(dataListIndex, 'down');
            }

            // get it from pool
            const li = this._getListItem(this.dataList.items[dataListIndex], dataListIndex);

            // put it to scroller
            this._putToScroller(li, dataListIndex, 'append');
          }
          else
          {
            // we've reached the end of the dataList array => break
            log.debug('end of list');
            break;
          }
        }
      }

      /* SCROLL DOWN EOF */
    }
    else if (numOfScrolledElements < 0)
    {
      /* SCROLL UP BOF */

      // return to pool
      const topDifference = this.items[this.items.length-1].ref - topItem + 1;
      let extraEls = topDifference - ( itemsAfter + 1 );

      // extraEls cannot be more than the poolsize - NOTE: this breaks the items array
      // extraEls = this.m.min(extraEls, this.properties.poolsize-1);
      // extraEls cannot be more than the items array - NOTE: introduced not to break the items array
      extraEls = this.m.min(extraEls, this.items.length-1);

      log.debug('    Scroll Up - extraEls ' + extraEls);

      if ( extraEls > 0 )
      {
        for (let i=0; i < extraEls; i++)
        {
          const item = this.items.pop();
          this._returnListItem(item.domElt);
        }
      }


      // firstItemRef = this.items[0].ref;
      // Note: this is not defined as a separate variable because the
      // this.items array is being modified in the below cycle

      // get from pool
      const bottomDifference = topItem - this.items[0].ref;
      let newEls = itemsBefore - bottomDifference;

      // newEls cannot be more than the poolsize
      newEls = this.m.min(newEls, this.properties.poolsize-1);

      log.debug('    Scroll Up - newEls ' + newEls);

      if (newEls > 0)
      {
        for (let i=0; i<newEls; i++)
        {
          // index in the dataList
          const dataListIndex = this.items[0].ref - 1;

          if (dataListIndex >= 0)
          {
            // if empty item is encountered, request more data
            if (this.dataList.items[dataListIndex].text1 == '' && this._displayWithoutText(this.dataList.items[dataListIndex]))
            {
              this._requestMore(dataListIndex, 'up');
            }

            // get it from pool
            const li = this._getListItem(this.dataList.items[dataListIndex], dataListIndex);

            // put it to scroller
            this._putToScroller(li, dataListIndex, 'prepend');
          }
          else
          {
            // we've reached the beginning of the dataList array => break
            log.debug('beginning of list');
            break;
          }
        } // for
      }
      else
      {
        log.debug('no new elements');
      }

      /* SCROLL UP EOF */
    }
    else
    {
      // there's no scroll => do nothing
    }
  } // closes if (this.m.abs(numOfScrolledElements) > itemsOnScreen)
};


/**
 * Redraw updated items that are currently visible
 * TAG: internal
 * =========================
 * @param {integer}
 * @param {integer}
 * @return {void}
 */
List2Ctrl.prototype._updateDisplay = function(firstItem, lastItem)
{
  const firstItemRef = this.items[0].ref;
  const lastItemRef = this.items[this.items.length-1].ref;

  // update only when the updated items overlap with the visible items
  if ( (firstItem >= firstItemRef && firstItem <= lastItemRef) ||
        (firstItem <= firstItemRef && lastItem >= firstItemRef) )
  {
    const firstToUpdate = this.m.max(firstItem, firstItemRef);
    const lastToUpdate = this.m.min(lastItem, lastItemRef);
    const firstToUpdateIndex = firstToUpdate - firstItemRef;
    const lastToUpdateIndex = (lastToUpdate - firstToUpdate) + firstToUpdateIndex;

    for (let i=firstToUpdateIndex; i<=lastToUpdateIndex; i++ )
    {
      const returnItem = this.items.splice(i, 1);
      const dataListIndex = returnItem[0].ref;

      // return to pool
      this._returnListItem(returnItem[0].domElt);

      // get it from pool
      const li = this._getListItem(this.dataList.items[dataListIndex], dataListIndex);

      // recover secondary focus
      if (this._inSecondaryMulticontroller && this._currentSecondaryMulticontrollerItem === dataListIndex)
      {
        li.classList.add('focus');
        li.classList.add('secondaryFocus');
      }

      // put it to scroller
      this._putToScroller(li, dataListIndex, i);
    }
  }

  // update _isScrollable flag
  this._checkScrollable();
};

/**
 * Request more list items
 * TAG: internal
 * =========================
 * @param {integer}
 * @param {string}
 * @return {void}
 */
List2Ctrl.prototype._requestMore = function(index, direction)
{
  // do not request more if a previous request is pending
  if (!this._inLoading)
  {
    if (this._appIsAtSpeed)
    {
      return; // do not do anything if the list gets this._appIsAtSpeed
    }
    else
    {
      // indicate loading is in progress
      this._setLoading(true);

      if (direction == 'up')
      {
        // we add 1 to the requestSize to include the last element in the way up
        index = this.m.max(index - this.properties.requestSize + 1, 0);
      }
      else if (direction == 'middle')
      {
        // we request 25 items on each direction from the topItem
        index = this.m.max(index, 0);
      }

      // build additional data
      const additionalParams = {
        topItem: this._topItem,
        visibleItems: this.properties.visibleItems,
        ranges: this.getEmptyRange(),
      };

      log.debug('Request items from ' + index + ' to ' + index+this.properties.requestSize + ' ' + direction);

      // call needDataCallback if it is defined. The first empty item is
      if (typeof this.properties.needDataCallback == 'function')
      {
        this.properties.needDataCallback(index, additionalParams);
      }

      // set timeout for data population
      clearTimeout(this._needDataTimeoutId);
      this._needDataTimeoutId = setTimeout(this._needDataTimeoutCallback.bind(this, index), this.properties.needDataTimeout);
    }
  }
};

List2Ctrl.prototype._needDataTimeoutCallback = function(index)
{
  log.warn('Lis2: control has requested items from index ' + index + ' but has not receieved them yet. Enabling the list.');
  this._setLoading(false);
};

/**
 * Initial pool operation
 * TAG: internal
 * =========================
 * @param {integer}
 * @param {integer}
 * @return {void}
 */
List2Ctrl.prototype._fill = function(firstItem, lastItem)
{
  log.debug('Start pool operation');
  log.debug('POOL  |   ITEMS');

  // get items from the pool
  for (let i=firstItem; i<=lastItem; i++)
  {
    // get it from the pool
    const li = this._getListItem(this.dataList.items[i], i);

    // put it to scroller
    this._putToScroller(li, i, 'append');

    log.debug(this.pool[this.dataList.items[i].itemStyle].length + ' ->  ' + this.items.length);
  }

  this._hasFill = true;

  // update _isScrollable flag
  const scrollable = this._checkScrollable();

  // show/hide scroll indicator
  if (!scrollable || (scrollable && this.properties.hasLetterIndex))
  {
    this._hideScrollIndicator();
  }
  else
  {
    this._showScrollIndicator();
  }

  log.debug('End pool operation');
};

/** SET INTERNAL PROPERTIES **/

/**
 * Update _isScrollable flag
 * TAG: internal
 * =========================
 * @return {boolean} - returns _isScrollable
 */
List2Ctrl.prototype._checkScrollable = function()
{
  if (this.dataList.items.length > this.properties.visibleItems)
  {
    this._isScrollable = true;
  }
  else
  {
    this._isScrollable = false;
  }

  return this._isScrollable;
};

/**
 * Update _topItem property
 * TAG: internal
 * =========================
 * @param {integer} - top item index
 * @return {integer} - returns _topItem
 */
List2Ctrl.prototype._setTopListItem = function(pos)
{
  // pos should be number for proper topItem calculation
  if (!isNaN(pos))
  {
    this._prevTopItem = this._topItem;
    this._topItem = -(Math.round(pos / this.properties.itemHeight));

    // throw out of bounds exception
    if (this._topItem < 0 || this._topItem > this.dataList.items.length - 1)
    {
      log.error('Lis2: _topItem is out of bounds');
    }
  }

  if (this.properties.enableItemRequestOnScroll)
  {
    // check for empty items in DOM
    const emptyDOMItem = this._getEmptyDOMElement();
    if (null != emptyDOMItem)
    {
      // fire needDataCallback() if an empty item is found in the DOM
      this._requestMore(emptyDOMItem);
    }
  }

  return this._topItem;
};

/**
 * Indicate loading activity in the list
 * and update _inLoading property
 * TAG: internal
 * =========================
 * @param {boolean} - show or hide loading activity
 * @return {boolean} - returns _inLoading
 */
List2Ctrl.prototype._setLoading = function(show)
{
  if (show)
  {
    // check whether loading overlay is enabled
    if (this.properties.loadingOverlayEnabled)
    {
      // update start time
      this._loadingData.timeStarted = new Date().getTime();

      if (this.properties.showLoadingOverlayTimeout > 0)
      {
        // delayed show overlay
        this._loadingData.startTimeoutId = setTimeout(this._setLoadingOverlay.bind(this, true), this.properties.showLoadingOverlayTimeout);
      }
      else
      {
        // show overlay immediately
        this._setLoadingOverlay(true);
      }
    }

    // update flag
    this._inLoading = true;
  }
  else
  {
    // check whether loading overlay is enabled
    if (this.properties.loadingOverlayEnabled)
    {
      if (this.properties.hideLoadingOverlayTimeout > 0)
      {
        // delayed hide overlay
        const now = new Date().getTime();
        if (now - this._loadingData.timeStarted < this.properties.showLoadingOverlayTimeout)
        {
          // no overlay has been shown -> reset everything
          this._setLoadingOverlay(false);
        }
        else if (now - this._loadingData.timeShown < this.properties.hideLoadingOverlayTimeout)
        {
          // the overlay has been visible less than the hideLoadingOverlayTimeout -> hide it in hideLoadingOverlayTimeout ms after it has been made visible
          this._loadingData.endTimeoutId = setTimeout(this._setLoadingOverlay.bind(this, false), this.properties.hideLoadingOverlayTimeout - (now - this._loadingData.timeShown));
        }
        else
        {
          // the overlay has been visible long enough -> hide it immediately
          this._setLoadingOverlay(false);
        }
      }
      else
      {
        // hide overlay immediately
        this._setLoadingOverlay(false);
      }
    }

    // update flag
    this._inLoading = false;
  }

  return this._inLoading;
};

List2Ctrl.prototype._setLoadingOverlay = function(show)
{
  if (show)
  {
    // show loading
    this.mask.appendChild(this.loading);

    this._loadingData.timeShown = new Date().getTime();
  }
  else
  {
    // hide loading
    if (null != this.loading.parentElement)
    {
      this.loading.parentElement.removeChild(this.loading);
    }

    // reset loading data
    clearTimeout(this._loadingData.startTimeoutId);
    clearTimeout(this._loadingData.endTimeoutId);
    this._loadingData.timeStarted = 0;
    this._loadingData.timeShown = 0;
    this._loadingData.startTimeoutId = null;
    this._loadingData.endTimeoutId = null;
  }
};

/** 7. DEFAULT TITLE CONFIGURATION **/

/**
 * Prepare title
 * A list title can be defined with minimal set of properties
 * that are needed for its proper display. This function sets
 * default configuration for a valid title and merge it with the
 * custom configuration passed to the title.
 * TAG: internal
 * =========================
 * @param {object} - the title object that will be set a default set of properties and will be returned
 * @return {object} - the complete title object
 */
List2Ctrl.prototype._prepareTitle = function(titleObj)
{
  // The itemStyle property is required
  if (!titleObj.hasOwnProperty('titleStyle'))
  {
    log.error('Lis2: title should have titleStyle property: ' + titleObj);
    return;
  }

  // default properties
  let title = {};
  switch (titleObj.titleStyle)
  {
    case 'style02':
      title = {text1: '', text1Id: null, text1SubMap: null, styleMod: ''};
      break;
    case 'style02a':
      title = {text1: '', text1Id: null, text1SubMap: null, image1: '', styleMod: ''};
      break;
    case 'style03':
      title = {text1: '', text1Id: null, text1SubMap: null, image1: ''};
      break;
    case 'style05':
      title = {text1: '', text1Id: null, text1SubMap: null, text2: '', text2Id: null, text2SubMap: null, image1: ''};
      break;
    case 'style06':
      title = {image1: ''};
      break;
    case 'style07':
      title = {text1: '', text1Id: null, text1SubMap: null, text2: '', text2Id: null, text2SubMap: null};
      break;
    case 'style08':
      title = {text1: '', text1Id: null, text1SubMap: null, image1: '', styleMod: ''};
      break;
    case 'style12':
      title = {text1: '', text1Id: null, text1SubMap: null, styleMod: '', countlabel: '', countlabelId: null, countlabelSubMap: null};
      break;
    default:
      log.error('Lis2: unknown title style: ' + titleObj.titleStyle);
      break;
  }

  // Extend default structure with the supplied item
  for (const i in titleObj)
  {
    title[i] = titleObj[i];
  }

  // Perform localization
  switch (title.titleStyle)
  {
    case 'style02':
    case 'style02a':
    case 'style03':
    case 'style08':
    case 'style12':
      if (title.text1Id)
      {
        title.text1 = this._getLocalizedString(title.text1Id, title.text1SubMap);
      }
      break;
    case 'style05':
    case 'style07':
      if (title.text1Id)
      {
        title.text1 = this._getLocalizedString(title.text1Id, title.text1SubMap);
      }
      if (title.text2Id)
      {
        title.text2 = this._getLocalizedString(title.text2Id, title.text2SubMap);
      }
      break;
  }

  return title;
};


/**
 * =========================
 * SCROLL INDICATOR
 * - reset
 * - create
 * - visual update
 * =========================
 */

/**
 * Remove any scroll indicator
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._scrollIndicatorReset = function()
{
  // check for scroll indicator configuration
  if (!this.properties.showScrollIndicator)
  {
    return;
  }

  // remove any scroll indicator
  if (this.scrollIndicatorWrapper)
  {
    // remove wrapper (and scroll indicator)
    this.scrollIndicatorWrapper.parentElement.removeChild(this.scrollIndicatorWrapper);

    // nullify elements
    this.scrollIndicatorWrapper = null;
    this.scrollIndicator = null;

    // reset scroll indicator boundaries
    this._indicatorMin = 0;
    this._indicatorMax = 0;
  }
};

/**
 * Create scroll indicator
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._scrollIndicatorBuild = function(visible)
{
  // check for scroll indicator configuration
  if (!this.properties.showScrollIndicator)
  {
    return;
  }

  // determine scroll indicator size
  const indicatorSize = Math.round(this.mask.offsetHeight * (this.mask.offsetHeight / this.scroller.offsetHeight));

  // add scroll indicator wrapper, if needed
  if (this.scrollIndicatorWrapper === null)
  {
    this.scrollIndicatorWrapper = document.createElement('div');
    this.scrollIndicatorWrapper.className = 'List2CtrlScrollIndicatorWrapper';
    this.divElt.appendChild(this.scrollIndicatorWrapper);
  }

  // set scroll indicator wrapper visibility
  if (!visible)
  {
    this.scrollIndicatorWrapper.style.visibility = 'hidden';
  }
  else
  {
    this.scrollIndicatorWrapper.style.visibility = 'visible';
  }

  // create scroll indicator, if needed
  const addScrollIndicator = (this.scrollIndicator === null);
  if (addScrollIndicator)
  {
    this.scrollIndicator = document.createElement('div');
    this.scrollIndicator.className = 'List2CtrlScrollIndicator';
  }

  // determine scroll indicator size
  this._setScrollIndicatorHeight();

  // finish adding scroll indicator
  if (addScrollIndicator)
  {
    // determine scroll indicator position
    this.scrollIndicator.style.height = this.m.max(indicatorSize, this.properties.scrollIndicatorMinSize) + 'px';
    this.scrollIndicator.style.top = '0px';
    this.scrollIndicatorWrapper.appendChild(this.scrollIndicator);
  }

  // set scroll indicator boundaries
  this._indicatorMin = 0;
  this._indicatorMax = this.mask.offsetHeight - this._scrollIndicatorHeight;

  if (this.properties.hasLetterIndex)
  {
    // hide scroll indicator when letterIndex is enabled
    this._hideScrollIndicator();
  }
  else
  {
    // fade out scroll indicator
    this._fadeOutScrollIndicator();
  }
};

/**
 * Update scroll indicator position on drag
 * This is fired on _USER_EVENT_MOVE when the
 * list is being dragged by touch.
 * TAG: touch-only, internal
 * =========================
 * @return {integer} scroll indicator position
 */
List2Ctrl.prototype._dragUpdateScrollIndicator = function()
{
  // check for scroll indicator configuration
  if (!this.properties.showScrollIndicator)
  {
    return;
  }

  // determine scroll indicator position
  let indicatorPos = Math.round(this._indicatorMax * (this.scroller.offsetTop / this._maxScrollY));

  // constrain position
  indicatorPos = this.m.max(indicatorPos, this._indicatorMin);

  // set new position
  this.scrollIndicator.style.top = indicatorPos + 'px';

  // fade in scroll indicator
  this._fadeInScrollIndicator();

  return indicatorPos;
};

/**
 * Update scroll indicator position on drag
 * Called on scroll animation (flick or scroll ad-hoc)
 * TAG: internal
 * =========================
 * @param {integer} the new position of the scroller
 * @param {integer} the time for animation to the new position
 * @return {integer} the new scroll indicator position
 */
List2Ctrl.prototype._updateScrollIndicator = function(pos, time)
{
  // check for time
  if (time == undefined || time == null)
  {
    // get default time
    time = this.properties.swipeAnimationDuration;
  }

  // determine scroll indicator new position
  const newRelativePos = pos / this._maxScrollY;
  const newPos = Math.round(newRelativePos * (this._indicatorMax - this._indicatorMin));

  // start animation
  this.scrollIndicator.style[this._VENDOR + 'TransitionDuration'] = time + 'ms';
  this.scrollIndicatorAnimationEndCallback = this._scrollIndicatorAnimationEnd.bind(this);
  this.scrollIndicator.addEventListener(this._VENDOR + 'TransitionEnd', this.scrollIndicatorAnimationEndCallback, false);
  this.scrollIndicator.style.top = newPos + 'px';

  // clear any previously scheduled scroll indicator fade out
  clearTimeout(this._scrollIndicatorTimeoutId);
  this._scrollIndicatorTimeoutId = null;

  // fade in scroll indicator
  this._fadeInScrollIndicator();

  return newPos;
};


List2Ctrl.prototype._fadeInScrollIndicator = function()
{
  // check whether scroll indicator needs to fade
  if (this.properties.scrollIndicatorFadeTimeout <= 0)
  {
    return;
  }

  this.scrollIndicatorWrapper.style[this._VENDOR + 'TransitionDuration'] = this.properties.scrollIndicatorFadeInDuration + 'ms';
  this.scrollIndicatorWrapper.style.opacity = 1;
};

List2Ctrl.prototype._fadeOutScrollIndicator = function()
{
  // check whether scroll indicator needs to fade
  if (this.properties.scrollIndicatorFadeTimeout <= 0)
  {
    return;
  }

  // clear any previously-scheduled hiding
  clearTimeout(this._scrollIndicatorTimeoutId);

  // schedule hide
  this._scrollIndicatorTimeoutId = setTimeout(function() {
    this.scrollIndicatorWrapper.style[this._VENDOR + 'TransitionDuration'] = this.properties.scrollIndicatorFadeOutDuration + 'ms';
    this.scrollIndicatorWrapper.style.opacity = 0;
    this._scrollIndicatorTimeoutId = null;
  }.bind(this), this.properties.scrollIndicatorFadeTimeout);
};

List2Ctrl.prototype._hideScrollIndicator = function()
{
  this.scrollIndicatorWrapper.style.opacity = 0;
};

List2Ctrl.prototype._showScrollIndicator = function()
{
  this.scrollIndicatorWrapper.style.opacity = 1;
};

/**
 * =========================
 * TOUCH EVENT HANDLERS
 * - Event detection and custom event dispatching
 * - Start/Move/End/Out event handling
 * - Hit state control
 * =========================
 */

/**
 * Handle any touch event and dispatch appropriate
 * custom event. Actual event processing is done in the
 * respective handlers of the custom events. The original
 * event object is attached to the custom event in its
 * event property.
 * =========================
 * @param {event} - any touch event
 * @return {Boolean} - True if event was processed
 */
List2Ctrl.prototype._touch = function(e)
{
  let touchResult = false;

  switch (e.type)
  {
    case this._USER_EVENT_START:
      // route to letter index first, otherwise route to list
      touchResult = this._startIndex(e) || this._start(e);
      /*
             * Attach temporary listeners to document if we have a positive start.
             * These listeners will be removed on _USER_EVENT_END
             */
      if (touchResult)
      {
        document.addEventListener(this._USER_EVENT_MOVE, this.touchHandler, false);
        document.addEventListener(this._USER_EVENT_END, this.touchHandler, false);
        document.addEventListener(this._USER_EVENT_OUT, this.touchHandler, false);
      }
      break;

    case this._USER_EVENT_MOVE:
      // route to letter index first, otherwise route to list
      touchResult = this._moveIndex(e) || this._move(e);
      break;

    case this._USER_EVENT_END:
      /*
             * Remove the document event listeners no matter of these have been
             * attached or not. This will prevent any non-existent callbacks firing.
             */
      document.removeEventListener(this._USER_EVENT_MOVE, this.touchHandler, false);
      document.removeEventListener(this._USER_EVENT_END, this.touchHandler, false);
      document.removeEventListener(this._USER_EVENT_OUT, this.touchHandler, false);
      // route to letter index first, otherwise route to list
      touchResult = this._endIndex(e) || this._end(e);
      break;

    case this._USER_EVENT_OUT:
      this._out(e);
      break;
  }

  return touchResult;
};

/**
 * Start Touch on list
 * TAG: touch-only, internal
 * =========================
 * @param {event} - raw touch/mouse event
 * @return {Boolean} - True if list is touched
 */
List2Ctrl.prototype._start = function(e)
{
  // abort any ongoing scroll
  this._abortScroll(e);

  // get mask position and dimensions
  this._maskPositionY = this.getPosition(this.mask)[1];
  this._maskPositionX = this.getPosition(this.mask)[0];
  this._maskH = this.mask.offsetHeight;
  this._maskW = this.mask.offsetWidth;

  // get relative mouse position
  const relativeY = e.pageY - this._maskPositionY;
  const relativeX = e.pageX - this._maskPositionX;

  // reset letter index multicontroller
  this._focusStolen = false;
  if (relativeY >= 0)
  {
    this._setLetterIndexMulticontroller(false, true);

    // steal focus
    const canGainFocus = this._canGainFocus(e);
    if (!this._hasFocus && -1 !== canGainFocus)
    {
      framework.common.stealFocus();
      this._hasFocus = true;
      this._focusStolen = true;
    }
  }

  // handle list reorder cases first
  if (this._inListReorder)
  {
    // route event to be handled by start reorder rather than regular start
    this._startReorder(e);
    return true;
  }
  else if (!this._inListReorder && this._appIsAtSpeed)
  {
    this._startReorder(e);
    return true;
  }

  this._startItem = this._getTargetItem(e);
  this._startDOMItem = this._getDOMItem(this._startItem);

  // make hit
  if (this.properties.hitTimeout > 0)
  {
    // after some time
    this._makeHitTimeoutId = setTimeout(this._itemMakeHit.bind(this, e), this.properties.hitTimeout);
  }
  else
  {
    // immediately
    this._itemMakeHit(e);
  }

  // Place focus on the reported available item when focus is stolen
  if (this._focusStolen)
  {
    this._showFocus(canGainFocus, true);
  }

  // make toggles hit
  this._buttonMakeHit(e);

  // make locks hit
  this._lockMakeHit(e);

  // if scrolling during loading is not allowed
  if (!this.properties.scrollingDuringLoading && this._inLoading)
  {
    return false;
  }

  // check relative mouse position
  if (relativeY < 0)
  {
    return false;
  }

  // check for a valid target item
  if (this._startItem == -1)
  {
    return false;
  }

  // get current y
  this._y = this.scroller.offsetTop;
  this._startY = relativeY;
  this._startX = relativeX;
  this._startTime = new Date().getTime();

  // start longpress countdown
  this._longPressTimeoutId = setTimeout(this._itemLongPress.bind(this, e), this.properties.longPressTimeout);

  // raise _inDrag
  this._inDrag = true;

  // Release secondary MC mode
  if (this._inSecondaryMulticontroller && null != this._currentSecondaryMulticontrollerItem && this._startItem != this._currentSecondaryMulticontrollerItem)
  {
    const temp = this._currentSecondaryMulticontrollerItem;

    // if we are in secondary multicontroller mode, touching outside the item will exit it
    this._setSecondaryMulticontroller(false, this._currentSecondaryMulticontrollerItem);

    // Commit the value
    if (!this._isLock(temp)) // locks do not commit the value
    {
      this._triggerFocus(temp);
    }
    else
    {
      // remove focus from lock buttons
      this._lockShowFocus(temp, 'clear');
    }
  }

  // dispatch scroll start event
  this._listEvent(this._EVENTS.SCROLL_START, {scrollPosition: this._topItem});

  // user touched the list -> return True
  return true;
};

/**
 * Touch move on list
 * TAG: touch-only, internal
 * =========================
 * @param {event} - raw touch/mouse event
 * @return {Boolean} - True if list is touched
 */
List2Ctrl.prototype._move = function(e)
{
  // handle list reorder cases first
  if (this._inListReorder)
  {
    // route event to be handled by move reorder rather than regular move
    this._moveReorder(e);
    return true;
  }

  if (!this._inDrag)
  {
    return false;
  }

  // perform event filtering
  if (this.properties.eventFilterThreshold > 0)
  {
    // skip event
    if (e.timeStamp-this._lastEventTime <= this.properties.eventFilterThreshold)
    {
      return false;
    }

    // record time
    this._lastEventTime = e.timeStamp;
  }

  // get relative mouse position
  const relativeY = e.pageY - this._maskPositionY;
  const relativeX = e.pageX - this._maskPositionX;

  if (relativeY < -this._maskPositionY)
  {
    // we are out of bounds
    this._end(e);
    return true;
  }

  // calculate travelled distance
  const deltaY = relativeY - this._startY;
  const deltaX = relativeX - this._startX;

  if (this._inLongPress)
  {
    return false;
  }

  /*
     * DRAG DETECTION
     * determine whether this is a horizontal or vertical drag
     * and raise the horizontal flag
     */
  if (null == this._inHorizontalDrag) {
    const alpha = Math.atan2(this.m.abs(deltaX), this.m.abs(deltaY));
    if (alpha < this.properties.hvThreshold)
    {
      // vertical
      this._inHorizontalDrag = false;
    }
    else
    {
      // horizontal
      this._inHorizontalDrag = true;
      this._hDragItem = this._getTargetItem(e);

      // set slideStart
      this._slideStart(e);
    }
  }

  // drag slider
  if (this._inHorizontalDrag == true)
  {
    // we have a horizontal drag -> move sliders
    this._slideMove(e);
  }
  // drag list if scrollable
  else if (false == this._inHorizontalDrag && this._isScrollable)
  {
    // we have a vertical drag and the list can be scrolled
    // calculate the scroller's new position and constrain it into bounds
    const newPos = this.m.max(this._maxScrollY, this.m.min(this._y + deltaY, this._minScrollY));

    // drag the scroller if in bounds
    this.scroller.style.top = newPos + 'px';

    // update scroll indicator
    this._dragUpdateScrollIndicator();

    // raise _stopClick flag and remove hit and long press
    if (this.m.abs(deltaY) > this.properties.selectThreshold)
    {
      this._stopSelect = true;

      // remove hit and prevent delayed hit
      this._itemRemoveHit(e);
      clearTimeout(this._makeHitTimeoutId);

      // remove long press and prevent long press
      this._itemRemoveLongPress(e);
      clearTimeout(this._longPressTimeoutId);
    }
  }
  // control hit state when not scrollable or when no scrolling occurs (e.g. when we are one of the list extremities)
  if (!this._isScrollable || this.m.abs(deltaY) > this.properties.selectThreshold)
  {
    const targetTop = this._startDOMItem.offsetTop;
    if (relativeY < targetTop || relativeY > targetTop + this.properties.itemHeight)
    {
      // remove hit
      this._itemRemoveHit(e);

      // prevent select only on non-scrollable lists
      // the scrollable lists are handled in the above case
      if (!this._isScrollable)
      {
        this._stopSelect = true;
      }
    }
    else
    {
      // make hit
      if (this._stopSelect && !this._isScrollable)
      {
        this._itemMakeHit(e);
      }

      // enable select only on non-scrollable lists
      // the scrollable lists are handled in the above case
      if (!this._isScrollable)
      {
        this._stopSelect = false;
      }
    }
  }

  // user touched the list -> return True
  return true;
};

/**
 * Touch end on list
 * TAG: touch-only, internal
 * =========================
 * @param {event} - raw touch/mouse event
 * @return {Boolean} - True if list is touched
 */
List2Ctrl.prototype._end = function(e)
{
  // handle list reorder cases first
  if (this._inListReorder)
  {
    // route event to be handled by end reorder rather than regular end
    this._endReorder(e);
    return true;
  }
  else if (!this._inListReorder && this._appIsAtSpeed)
  {
    this._endReorder(e);
    return true;
  }


  // remove hit
  this._itemRemoveHit(e);
  clearTimeout(this._makeHitTimeoutId); // clear hit timeout
  // remove long press
  this._itemRemoveLongPress(e);
  clearTimeout(this._longPressTimeoutId); // clear longpress timeout

  this._startItem = null;
  this._startDOMItem = null;

  // reset drag flag and hDrag item
  this._inHorizontalDrag = null;
  this._hDragItem = null;

  if (!this._inDrag)
  {
    // this is called without having a drag
    return false;
  }

  // end any drag of sliders
  this._slideEnd(e);

  // set scroll nature
  this._scrollNature = 'touch';

  // detect swipe motion
  const endTime = e.timeStamp || new Date().getTime();
  const velocity = endTime - this._startTime;
  if (this._focusStolen && !this._stopSelect)
  {
    // slight drag -> scroll to show focus on the available item when stealing focus
    // decide whether to allow offscrean
    const focussedIndex = this._getFocussedIndex();
    const allowOffScreen = (focussedIndex > this._topItem && focussedIndex < this._topItem + this.properties.visibleItems);
    this._showFocus(focussedIndex, allowOffScreen);
    this._focusStolen = false;
  }
  else if (velocity < this.properties.swipeThreshold && velocity > 0)
  {
    // get relative mouse position and calculate travelled distance
    const relativeY = e.pageY - this._maskPositionY;
    const deltaY = relativeY - this._startY;

    // swipte detected
    this._startSwipe(deltaY, velocity);
  }
  else
  {
    // regular drag -> snap to item bounds
    this._snap(this.scroller.offsetTop);
  }

  // call touch select logic
  this._touchSelectItem(e);

  // reset any previously set flags
  this._inDrag = false;
  this._stopSelect = false;
  this._startTime = 0;

  // user touched the list -> return True
  return true;
};

/**
 * Touch leave on list
 * TAG: touch-only, internal
 * =========================
 * @param {event} - raw touch/mouse event
 * @return {Boolean} - True if list is touched
 */
List2Ctrl.prototype._out = function(e)
{
  return this._end(e);
};


/**
 * Start Touch on letter index
 * TAG: touch-only, internal
 * =========================
 * @param {event} - raw touch/mouse event
 * @return {boolean} - True if letter index is touched
 */
List2Ctrl.prototype._startIndex = function(e)
{
  // check for letter index
  if (!this.properties.hasLetterIndex)
  {
    return false;
  }

  // get mask position
  this._maskPositionY = this.getPosition(this.mask)[1];
  this._maskPositionX = this.getPosition(this.mask)[0];

  // get relative mouse position
  const relativeY = e.pageY - this._maskPositionY;
  const relativeX = e.pageX - this._maskPositionX;
  if (relativeY < 0)
  {
    return false;
  }

  // hit test letter index
  if (relativeX <= this.letterIndexWrapper.offsetLeft)
  {
    return false;
  }

  // steal focus
  if (!this._hasFocus)
  {
    framework.common.stealFocus();
    this._hasFocus = true;
  }

  // Enter into letter index multicontroller mode if not already
  if (!this._inLetterIndexMulticontroller)
  {
    this._setLetterIndexMulticontroller(true);
  }

  // clear any scheduled letter index select
  this._scheduleLetterIndexSelect(null, true);

  // make hit
  this._indexMakeHit(e);

  // get start coordinates and time
  this._yIndex = this.letterIndex.offsetTop;
  this._startIndexY = relativeY;
  this._startIndexX = relativeX;
  this._startTimeIndex = new Date().getTime();

  this._inDragIndex = true;

  return true;
};


List2Ctrl.prototype._moveIndex = function(e)
{
  // check for letter index
  if (!this.properties.hasLetterIndex)
  {
    return false;
  }

  if (!this._inDragIndex)
  {
    return false;
  }

  // perform event filtering
  if (this.properties.eventFilterThreshold > 0)
  {
    // skip event
    if (e.timeStamp-this._lastEventTime <= this.properties.eventFilterThreshold)
    {
      return false;
    }

    // record time
    this._lastEventTime = e.timeStamp;
  }

  // get relative mouse position
  const relativeY = e.pageY - this._maskPositionY;
  const relativeX = e.pageX - this._maskPositionX;

  if (relativeY < -this._maskPositionY)
  {
    // we are out of bounds
    this._endIndex(e);

    return false;
  }

  // calculate travelled distance
  const deltaY = relativeY - this._startIndexY;
  const deltaX = relativeX - this._startIndexX;

  // calculate the letter index's new position and constrain it into bounds
  const newPos = this.m.max(this._maxScrollYIndex, this.m.min(this._yIndex + deltaY, this._minScrollYIndex));

  // drag the letter index if in bounds
  this.letterIndex.style.top = newPos + 'px';

  // raise _stopClick flag
  if (this.m.abs(deltaY) > this.properties.selectThreshold)
  {
    this._stopSelect = true;

    // remove hit
    this._indexRemoveHit(e);
  }

  return true;
};


List2Ctrl.prototype._endIndex = function(e)
{
  // check for letter index
  if (!this.properties.hasLetterIndex)
  {
    return false;
  }

  // remove hit
  this._indexRemoveHit(e);

  if (!this._inDragIndex)
  {
    return false;
  }

  if (!this._stopSelect)
  {
    // snap position
    this._snapIndex(this.letterIndex.offsetTop);

    // select letter index
    const letterIndex = this._getTargetLetterIndex(e);
    this._letterIndexSelect(letterIndex, 'Touch');
  }
  else
  {
    // detect swipe motion
    const endTime = e.timeStamp || new Date().getTime();
    const velocity = endTime - this._startTimeIndex;
    if (velocity < this.properties.swipeThreshold && velocity > 0)
    {
      // get relative mouse position and calculate travelled distance
      const relativeY = e.pageY - this._maskPositionY;
      const deltaY = relativeY - this._startIndexY;

      // swipte detected
      this._startSwipeIndex(deltaY, velocity);
    }
    else
    {
      // snap position
      this._snapIndex(this.letterIndex.offsetTop);

      // schedule letter index select if letter is enabled
      const letterIndex = this._getTargetLetterIndex(e);
      if (!this.letterIndexData[letterIndex].disabled)
      {
        this._scheduleLetterIndexSelect(letterIndex);
      }
    }
  }

  // reset flags
  this._inDragIndex = false;
  this._stopSelect = false;

  return true;
};


/**
 * Select item
 * TAG: touch-only, internal
 * =========================
 * @param {event} - raw touch/mouse event
 * @return {void}
 */
List2Ctrl.prototype._touchSelectItem = function(e)
{
  // clear any hit timeout
  clearTimeout(this._makeHitTimeoutId);

  // if we are not allowed to select (when in drag)
  if (this._stopSelect)
  {
    this._stopSelect = false;
    return;
  }

  // select during loading is not allowed
  if (this._inLoading)
  {
    return;
  }

  let itemIndex;
  let fireSelect = true;
  let additionalModifier = null;
  let params = {};

  // determine target item
  itemIndex = this._getTargetItem(e);

  // only valid list items can fire the select callback
  if (itemIndex == -1)
  {
    return;
  }

  // ensure that we end up on the same item where we started so that the select is valid
  if (itemIndex != this._getFocussedIndex())
  {
    return;
  }

  // perform any additional touch processing for some items before issuing select callback
  if (this._isToggle(itemIndex))
  {
    // the target contains toggle buttons -> select toggle buttons
    const toggleSelected = this._buttonSelect(e);
    if ('cancel' == toggleSelected)
    {
      fireSelect = false;
    }
    else if (null != toggleSelected)
    {
      params = {additionalData: toggleSelected};
      additionalModifier = 'preventSimpleSelect';
    }
  }

  if (this._isSlider(itemIndex))
  {
    // the target contains a slider -> disable select only if the slider is adjustable
    if (this.dataList.items[itemIndex].allowAdjust)
    {
      fireSelect = false;
    }
  }

  if (this._isStep(itemIndex) && this._hasSecondaryMulticontroller(itemIndex) && this._inSecondaryMulticontroller)
  {
    // if we are in secondary multicontroller and the item is a step item
    const stepResult = this._stepAdjust(e);
    if ('commit' === stepResult)
    {
      params = {finalAdjust: true, value: this.dataList.items[itemIndex].value};
      additionalModifier = 'exitSecondaryMulticontroller';
    }
    else if (null != stepResult)
    {
      params = {finalAdjust: false, value: stepResult};
    }
    else
    {
      fireSelect = false;
    }
  }
  else if (this._isStep(itemIndex) && this._hasSecondaryMulticontroller(itemIndex) && !this._inSecondaryMulticontroller)
  {
    // if we are not in secondary multicontroller and the item is step item
    this._setSecondaryMulticontroller(true, itemIndex);
    fireSelect = false;

    // produce beep
    this._beep('Short', 'Touch');
  }

  if (this._isLock(itemIndex) && this._hasSecondaryMulticontroller(itemIndex))
  {
    // the target is a lock item
    const lockAction = this._lockSelect(e);
    if (null == lockAction)
    {
      fireSelect = false;
    }
    else
    {
      // prepare params
      params = {additionalData: lockAction};
      additionalModifier = 'exitSecondaryMulticontroller';
    }
  }

  // prevent select on disabled items
  if (this.dataList.items[itemIndex].disabled)
  {
    fireSelect = false;
  }

  // everything looks ok -> call internal _itemSelect() method if the item permits it
  if (fireSelect)
  {
    // fire select only if no long press / hold start has been issued
    if (!this._longPressIssued)
    {
      // produce beep
      this._beep('Short', 'Touch');

      this._itemSelect(itemIndex, params, additionalModifier);
    }
    // otherwise fire holdStop Callback on shortAndHold items
    else if ('shortAndHold' === this.dataList.items[itemIndex].itemBehavior)
    {
      this._itemHoldStop(itemIndex);
    }
  }

  // lower long-press/hold-start flag
  this._longPressIssued = false;
};

/**
 * Exit hit state of the currently hit item
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._itemRemoveHit = function()
{
  const hitItems = this.scroller.querySelectorAll('.hit');

  if (hitItems.length)
  {
    for (let i=0, l=hitItems.length; i<l; i++)
    {
      hitItems[i].classList.remove('hit');
    }
  }
};


/**
 * Enter into hit state of an item
 * TAG: internal
 * =========================
 * @param {event|integer} - raw touch/mouse event or directly the index of the item
 * @return {integer} - index of the hit item
 */
List2Ctrl.prototype._itemMakeHit = function(e)
{
  let itemIndex = -1;

  // exit if we don't have any items (nothing to show the focus)
  if (!this.hasDataList())
  {
    return itemIndex;
  }

  // the parameter is an event
  if (typeof e == 'object')
  {
    // determine target item
    itemIndex = this._getTargetItem(e);

    // do not transfer hit to another item
    if (itemIndex != this._startItem)
    {
      return;
    }

    // do not make hit during loading
    if (this._inLoading)
    {
      return;
    }

    // only valid list items can become 'hit'
    if (itemIndex == -1)
    {
      return;
    }
  }
  // the parameter is an index
  else if (!isNaN(e))
  {
    itemIndex = e;
  }

  // do not make hit disabled items
  if (this.dataList.items[itemIndex].disabled)
  {
    return;
  }

  // certain item types cannot become 'hit' but can have focus
  let focusOnly = false;
  if (this._isSlider(itemIndex) && this.dataList.items[itemIndex].allowAdjust)
  {
    focusOnly = true;
  }
  else if (this._isLock(itemIndex))
  {
    focusOnly = true;
  }

  // get target DOM element
  const target = this._getDOMItem(itemIndex);

  // check for valid DOM element before applying class
  if (target)
  {
    if (!focusOnly)
    {
      target.classList.add('hit');
    }
    this._showFocus(itemIndex, true);
  }

  return itemIndex;
};

/**
 * Exit long-press state of the currently long-pressed item
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._itemRemoveLongPress = function()
{
  const longpressItems = this.scroller.querySelectorAll('.longpress');

  if (longpressItems.length)
  {
    for (let i=0, l=longpressItems.length; i<l; i++)
    {
      longpressItems[i].classList.remove('longpress');
    }
  }

  // lower the long press flag
  this._inLongPress = false;
};

/**
 * Enter into longpress state of a item
 * TAG: touch-only, internal
 * =========================
 * @param {event|integer} - raw touch/mouse event or directly the index of the item
 * @return {integer} - index of the long-pressed item
 */
List2Ctrl.prototype._itemMakeLongPress = function(e)
{
  let itemIndex = -1;

  // the parameter is an event
  if (typeof e == 'object')
  {
    // remove hit state
    this._itemRemoveHit(e);

    // determine target item
    itemIndex = this._getTargetItem(e);
  }
  // the parameter is an index
  else if (!isNaN(e))
  {
    itemIndex = e;
  }

  // do not make hit during loading
  if (this._inLoading)
  {
    return;
  }

  // only valid list items can become 'hit'
  if (itemIndex == -1)
  {
    return;
  }

  // do not make hit disabled items
  if (this.dataList.items[itemIndex].disabled)
  {
    return;
  }

  // get target DOM element
  const target = this._getDOMItem(itemIndex);

  // check for valid DOM element before applying class
  if (target)
  {
    target.classList.add('longpress');
  }

  // raise the long press flag
  this._inLongPress = true;

  return itemIndex;
};

/**
 * Produce simple select behavior on certain items
 * This function is run prior to issuing item select
 * either by touch or by multicontroller
 * TAG: internal
 * =========================
 * @param {integet} - item index
 * @return {integer} - changed value after the simple select
 */
List2Ctrl.prototype._simpleSelect = function(itemIndex)
{
  // validate input
  if (itemIndex == null || itemIndex == undefined || itemIndex < 0 || itemIndex >= this.dataList.itemCount || this.dataList.items[itemIndex].disabled)
  {
    return;
  }

  let returnValue = null;

  switch (this.dataList.items[itemIndex].itemStyle)
  {
    case 'styleOnOff':
      // get and update current value
      let currentValue = this.dataList.items[itemIndex].value;
      const newValue = (1 === currentValue) ? 2 : 1;
      this.dataList.items[itemIndex].value = newValue;

      // get and update DOM item
      const domItem = this._getDOMItem(itemIndex);
      if (domItem)
      {
        if (1 === newValue)
        {
          domItem.classList.add('checked');
        }
        else
        {
          domItem.classList.remove('checked');
        }
      }
      returnValue = newValue;
      break;

    case 'style10':
    case 'style11':
      // Note: settle timeout is registered in this._buttonActivate
      this._buttonSelectRight(itemIndex);
      returnValue = this.dataList.items[itemIndex].value;
      break;

    case 'style03':
    case 'style03a':
      let currentValue = this.dataList.items[itemIndex].checked;
      switch (this.dataList.items[itemIndex].image1)
      {
        case 'tick':
          if (!currentValue)
          {this._setTick(itemIndex, !currentValue);}
          break;
        case 'radio':
          if (!currentValue)
          {this._setRadio(itemIndex, !currentValue);}
          break;
        case 'checkbox':
          this._setCheckBox(itemIndex, !currentValue);
          break;
      }
      returnValue = this.dataList.items[itemIndex].checked;
      break;

    default:
      log.warn('Lis2: No simple select behavior for item style ' + this.dataList.items[itemIndex].itemStyle);
      break;
  }

  return returnValue;
};

/**
 * Fire select callback on an item.
 * This function is called whenever a select event
 * occurs. It is a single call point for all selects
 * and should be invoked whether select event is intended.
 * TAG: internal
 * =========================
 * @param {integet} - item index
 * @return {boolean} - true if there's a valid selectCallback
 */
List2Ctrl.prototype._itemSelect = function(itemIndex, paramsModifier, additionalModifier)
{
  // exit if we don't have any items
  if (!this.hasDataList())
  {
    return false;
  }

  // get paramsModifier
  const paramsModifier = paramsModifier || {};

  // get additionalModifier
  const additionalModifier = additionalModifier || null;

  let appData = null;
  let additionalData = null;
  let params = {};

  // event filtering
  let filterEvent = false;

  if (this._isSlider(itemIndex))
  {
    // the item contains a slider
    additionalData = this.dataList.items[itemIndex].value;
  }

  if (this._isSimpleSelectItem(itemIndex))
  {
    // the item is simple select item
    if ('preventSimpleSelect' != additionalModifier)
    {
      // process simple select behavior before firing the select callback
      additionalData = this._simpleSelect(itemIndex);
    }

    // apply event filter
    const filterType = (this._isToggle(itemIndex) || this._isOnOff(itemIndex)) ? 'toggle' : (this._isCheckBox(itemIndex)) ? 'check' : null;
    filterEvent = this._applyEventFilter(itemIndex, filterType);
  }
  else if (this._isStep(itemIndex) && 'exitSecondaryMulticontroller' === additionalModifier)
  {
    this._setSecondaryMulticontroller(false, itemIndex);
  }
  else if (this._isLock(itemIndex) && 'exitSecondaryMulticontroller' === additionalModifier)
  {
    // restore focus and remove any secondary multicontroler
    this._showFocus(this._lastItemWithFocus);
    this._lockShowFocus(itemIndex, 'clear');
    this._setSecondaryMulticontroller(false, itemIndex);
  }
  else if (this._isStep(itemIndex))
  {
    // apply event filter
    const filterType = 'step';
    filterEvent = this._applyEventFilter(itemIndex, filterType);
  }

  // is this filtered event?
  if (filterEvent)
  {
    return false;
  }

  // get the data
  appData = this.dataList.items[itemIndex].appData;

  // prepare params
  params = {
    itemIndex: itemIndex,
    additionalData: additionalData,
    fromVui: false,
  };
  // merge params with params modifier
  for (const i in paramsModifier)
  {
    params[i] = paramsModifier[i];
  }

  // return value
  let result = false;

  // do not fire select on disabled items but instead fire select disabled
  if (this.dataList.items[itemIndex].disabled)
  {
    // fire select disabled callback
    if (typeof this.properties.selectDisabledCallback == 'function')
    {
      /*
             * Handles touches on disabled list items
             * @param ctrlObj   Object  Reference to the list control that was selected
             * @param btnData   Object  Data that was attached to the selected item
             * @param params    Object  Object containing extra data
            */
      result = this.properties.selectDisabledCallback(this, appData, params);

      // set result to true if nothing is returned from the select callback
      if (undefined == result)
      {
        result = true;
      }
    }
  }
  else
  {
    // fire select callback
    if (typeof this.properties.selectCallback == 'function')
    {
      /*
             * Handles select on list items
             * @param ctrlObj   Object  Reference to the list control that was selected
             * @param btnData   Object  Data that was attached to the selected item
             * @param params    Object  Object containing extra data
            */
      result = this.properties.selectCallback(this, appData, params);

      // set result to true if nothing is returned from the select callback
      if (undefined == result)
      {
        result = true;
      }
    }

    // dispatch select event
    this._listEvent(this._EVENTS.ITEM_SELECT, params);
  }

  if (this._hasData(itemIndex))
  {
    // record this event and clear any timeouts
    this.dataList.items[itemIndex]._data.lastEvent = new Date().getTime();
    clearTimeout(this.dataList.items[itemIndex]._data.eventTimeout);
    this.dataList.items[itemIndex]._data.eventTimeout = null;
  }

  return result;
};

/**
 * Fire long press callback on an item.
 * This function is called whenever a select event
 * occurs. It is a single call point for all selects
 * and should be invoked whether select event is intended.
 * TAG: internal
 * =========================
 * @param {event|integer} - raw touch/mouse event or directly the index of the item
 * @return {boolean} - true if there's a valid longPressCallback
 */
List2Ctrl.prototype._itemLongPress = function(e)
{
  let eventCause = null;
  let itemIndex = -1;

  // the parameter is an event
  if (typeof e == 'object')
  {
    // determine target item
    itemIndex = this._getTargetItem(e); let itemIndex = this._getTargetItem(e);
    eventCause = 'Touch';
  }
  // the parameter is an index
  else if (!isNaN(e))
  {
    itemIndex = e;
    eventCause = 'Multicontroller';
  }

  // if the item is short-press-only -> prevent any longpress activity
  if ('shortPressOnly' === this.dataList.items[itemIndex].itemBehavior)
  {
    return;
  }
  // if the item has itemBehavior other than shortAndLong and shortAndHold -> this is invalid property and prevent any longpress activity
  else if ('shortAndLong' != this.dataList.items[itemIndex].itemBehavior && 'shortAndHold' != this.dataList.items[itemIndex].itemBehavior)
  {
    log.warn('Lis2: Invalid itemBehavior property. Item behavior can be shortPressOnly / shortAndLong / shortAndHold');
    return;
  }

  // make it long-pressed
  this._itemMakeLongPress(e);

  let appData = null;
  let additionalData = null;
  let params = {};

  if (this._isSlider(itemIndex))
  {
    // the target has a slider
    additionalData = this.dataList.items[itemIndex].value;
  }

  // get the data
  appData = this.dataList.items[itemIndex].appData;

  // prepare params
  params = {
    itemIndex: itemIndex,
    additionalData: additionalData,
    fromVui: false,
  };

  // return value
  let result = false;

  // produce beep
  this._beep('Long', eventCause);

  // fire long press callback
  if ('shortAndLong' === this.dataList.items[itemIndex].itemBehavior && typeof this.properties.longPressCallback == 'function')
  {
    /*
         * Handles long press on list items
         * @param ctrlObj   Object  Reference to the list control that was long-pressed
         * @param btnData   Object  Data that was attached to the long-pressed item
         * @param params    Object  Object containing extra data
        */
    this.properties.longPressCallback(this, appData, params);

    result = true;
  }
  // fire hold start callback
  else if ('shortAndHold' === this.dataList.items[itemIndex].itemBehavior && typeof this.properties.holdStartCallback == 'function')
  {
    /*
         * Handles hold start on list items
         * @param ctrlObj   Object  Reference to the list control that was long-held
         * @param btnData   Object  Data that was attached to the long-held item
         * @param params    Object  Object containing extra data
        */
    this.properties.holdStartCallback(this, appData, params);

    result = true;
  }

  // raise the flag for long-press/hold-start issued callback
  this._longPressIssued = true;

  // enter into list reorder on long press if the list supports it
  if (this.properties.listReorder)
  {
    this._enterListReorder();
    this._startReorder(e);
  }

  return result;
};


/**
 * Fire hold stop on an item.
 * This function is called whenever the user ends touch
 * on an item that has itemBehavior = shortAndHold
 * TAG: internal, touch-only
 * =========================
 * @param {integet} - item index
 * @return {boolean} - true if there's a valid holdStopCallback
 */
List2Ctrl.prototype._itemHoldStop = function(itemIndex)
{
  // validate item behavior property
  if ('shortAndHold' != this.dataList.items[itemIndex].itemBehavior)
  {
    return;
  }

  let appData = null;
  let additionalData = null;
  let params = {};

  if (this._isSlider(itemIndex))
  {
    // the target has a slider
    additionalData = this.dataList.items[itemIndex].value;
  }

  // get the data
  appData = this.dataList.items[itemIndex].appData;

  // prepare params
  params = {
    itemIndex: itemIndex,
    additionalData: additionalData,
    fromVui: false,
  };

  // return value
  let result = false;

  // fire hold stop callback
  if (typeof this.properties.holdStopCallback == 'function')
  {
    /*
         * Handles hold stop on list items
         * @param ctrlObj   Object  Reference to the list control that was long-held
         * @param btnData   Object  Data that was attached to the long-held item
         * @param params    Object  Object containing extra data
        */
    this.properties.holdStopCallback(this, appData, params);

    result = true;
  }

  return result;
};

/**
 * Perform outbound event filtering
 * TAG: internal
 * =========================
 * @param {integer} - item index
 * @param {string} - filter type
 * @return {boolean} - whethet to filter the event or not
 */
List2Ctrl.prototype._applyEventFilter = function(itemIndex, filterType)
{
  let filter = false;

  // exit if we don't have _data property
  if (!this._hasData(itemIndex))
  {
    return filter;
  }

  const now = new Date().getTime();

  switch (filterType)
  {
    case 'toggle':
      let difference = now - this.dataList.items[itemIndex]._data.lastEvent;
      if (difference < this.dataList.items[itemIndex].minChangeInterval)
      {
        // too soon -> filter the immediate event and send it later
        log.debug('Event filtered');
        filter = true;

        // schedule callback
        clearTimeout(this.dataList.items[itemIndex]._data.eventTimeout);
        this.dataList.items[itemIndex]._data.eventTimeout = setTimeout(this._filterTimeoutCallback.bind(this, itemIndex, filterType), this.dataList.items[itemIndex].minChangeInterval - difference);
      }
      else
      {
        // timing is ok -> pass the event and clear any scheduled selects
        clearTimeout(this.dataList.items[itemIndex]._data.eventTimeout);

        // register settle timeout
        this._registerSettleTimeout(itemIndex, 'toggle');
      }
      break;

    case 'check':
      let difference = now - this.dataList.items[itemIndex]._data.lastEvent;
      if (difference < this.properties.checkMinChangeInterval)
      {
        // too soon -> filter the immediate event and send it later
        log.debug('Event filtered');
        filter = true;

        // schedule callback
        clearTimeout(this.dataList.items[itemIndex]._data.eventTimeout);
        this.dataList.items[itemIndex]._data.eventTimeout = setTimeout(this._filterTimeoutCallback.bind(this, itemIndex, filterType), this.properties.checkMinChangeInterval - difference);
      }
      else
      {
        // timing is ok -> pass the event and clear any scheduled selects
        clearTimeout(this.dataList.items[itemIndex]._data.eventTimeout);

        // register settle timeout
        if ('radio' === this.dataList.items[itemIndex].image1 ||
                    'tick' === this.dataList.items[itemIndex].image1 ||
                    'checkbox' === this.dataList.items[itemIndex].image1)
        {
          const itemType = this.dataList.items[itemIndex].image1;
          this._registerSettleTimeout(itemIndex, itemType);
        }
      }
      break;

    case 'step':
      let difference = now - this.dataList.items[itemIndex]._data.lastEvent;

      if (this.properties.stepMinChangeInterval !== 0 && difference < this.properties.stepMinChangeInterval)
      {
        // too soon -> filter the immediate event and send it later
        log.debug('Event filtered');
        filter = true;

        // schedule callback
        clearTimeout(this.dataList.items[itemIndex]._data.eventTimeout);
        this.dataList.items[itemIndex]._data.eventTimeout = setTimeout(this._filterTimeoutCallback.bind(this, itemIndex, filterType), this.properties.stepMinChangeInterval - difference);
      }
      else
      {
        // timing is ok -> pass the event and clear any scheduled selects
        clearTimeout(this.dataList.items[itemIndex]._data.eventTimeout);
      }
      break;
  }

  return filter;
};

/**
 * Timeout callback that is run if a select event
 * is scheduled by the outbound filtering mechanism
 * TAG: internal
 * =========================
 * @param {integer} - item index
 * @param {string} - filter type
 * @return {void}
 */
List2Ctrl.prototype._filterTimeoutCallback = function(itemIndex, filterType)
{
  switch (filterType)
  {
    case 'toggle':
      this._itemSelect(itemIndex, {additionalData: this.dataList.items[itemIndex].value}, 'preventSimpleSelect');

      // register settle timeout
      this._registerSettleTimeout(itemIndex, 'toggle');
      break;

    case 'check':
      this._itemSelect(itemIndex, {additionalData: this.dataList.items[itemIndex].checked}, 'preventSimpleSelect');

      // register settle timeout
      if ('radio' === this.dataList.items[itemIndex].image1 ||
                'tick' === this.dataList.items[itemIndex].image1 ||
                'checkbox' === this.dataList.items[itemIndex].image1)
      {
        const itemType = this.dataList.items[itemIndex].image1;
        this._registerSettleTimeout(itemIndex, itemType);
      }
      break;
    case 'step':
      this._itemSelect(itemIndex, {value: this.dataList.items[itemIndex].value}, 'preventSimpleSelect');
      break;
  }
};

/**
 * Register a settle timeout on any new user input.
 * Any previous settle timeout should get cleared
 * before setting a new one. The timeout state should
 * be checked when public API call is made and depending
 * on whether the timeout is running or not, the value
 * will be cached or applied to the item.
 * The settle time acts as an inbound event filtering mechanism.
 * TAG: internal
 * =========================
 * @param {integer} - itemIndex
 * @param {string} - item type - tick | radio | checkbox | toggle
 * @return {void}
 */
List2Ctrl.prototype._registerSettleTimeout = function(itemIndex, itemType)
{
  log.debug('Settle scheduled');
  this._clearSettleTimeout(itemIndex, itemType);

  // schedule settle item
  switch (itemType)
  {
    case 'radio':
      if (this._isCheckBox(itemIndex) && itemType === this.dataList.items[itemIndex].image1)
      {
        this._radioSettleTimeoutId = setTimeout(this._settleItem.bind(this, itemIndex), this.properties.checkSettleTime);
      }
    case 'tick':
      if (this._isCheckBox(itemIndex) && itemType === this.dataList.items[itemIndex].image1)
      {
        this._tickSettleTimeoutId = setTimeout(this._settleItem.bind(this, itemIndex), this.properties.checkSettleTime);
      }
      break;
    case 'checkbox':
      if (this._isCheckBox(itemIndex) && itemType === this.dataList.items[itemIndex].image1)
      {
        // exit if we don't have _data property
        if (!this._hasData(itemIndex))
        {
          return;
        }

        this.dataList.items[itemIndex]._data.settleTimeout = setTimeout(this._settleItem.bind(this, itemIndex), this.properties.checkSettleTime);
      }
      break;
    case 'toggle':
      if (this._isToggle(itemIndex) || this._isOnOff(itemIndex))
      {
        // exit if we don't have _data property
        if (!this._hasData(itemIndex))
        {
          return;
        }

        this.dataList.items[itemIndex]._data.settleTimeout = setTimeout(this._settleItem.bind(this, itemIndex), this.dataList.items[itemIndex].settleTime);
      }
      break;
  }
};

/**
 * Clear any settle timeouts on any user input.
 * TAG: internal
 * =========================
 * @param {integer} - item index
 * @param {string} - item type - tick | radio | checkbox | toggle
 * @return {void}
 */
List2Ctrl.prototype._clearSettleTimeout = function(itemIndex, itemType)
{
  switch (itemType)
  {
    case 'radio':
      if (this._isCheckBox(itemIndex) && itemType === this.dataList.items[itemIndex].image1)
      {
        clearTimeout(this._radioSettleTimeoutId);
        this._radioSettleTimeoutId = null;
      }
    case 'tick':
      if (this._isCheckBox(itemIndex) && itemType === this.dataList.items[itemIndex].image1)
      {
        clearTimeout(this._tickSettleTimeoutId);
        this._tickSettleTimeoutId = null;
      }
      break;

    case 'checkbox':
      if (this._isCheckBox(itemIndex) && itemType === this.dataList.items[itemIndex].image1)
      {
        // exit if we don't have _data property
        if (!this._hasData(itemIndex))
        {
          return;
        }

        clearTimeout(this.dataList.items[itemIndex]._data.settleTimeout);
        this.dataList.items[itemIndex]._data.settleTimeout = null;
      }
      break;

    case 'toggle':
      if (this._isToggle(itemIndex) || this._isOnOff(itemIndex))
      {
        // exit if we don't have _data property
        if (!this._hasData(itemIndex))
        {
          return;
        }

        clearTimeout(this.dataList.items[itemIndex]._data.settleTimeout);
        this.dataList.items[itemIndex]._data.settleTimeout = null;
      }
      break;
  }
};

/**
 * Performs a check whether a settlie timeout
 * is running for a particular item, radio group
 * or tick group.
 * =========================
 * @param {integer} - item index
 * @param {string} - item type - tick | radio | checkbox | toggle
 * @return {Boolean} - True if a settle timeout is running
 */
List2Ctrl.prototype._hasSettleTimeout = function(itemIndex, itemType)
{
  let timeoutRunning = false;

  switch (itemType)
  {
    case 'radio':
      if (null !== this._radioSettleTimeoutId && this._radioSettleTimeoutId >= 0)
      {
        timeoutRunning = true;
      }
      break;

    case 'tick':
      if (null !== this._tickSettleTimeoutId && this._tickSettleTimeoutId >= 0)
      {
        timeoutRunning = true;
      }
      break;

    case 'checkbox':
    case 'toggle':
      // exit if we don't have _data property
      if (!this._hasData(itemIndex))
      {
        return timeoutRunning;
      }

      if (null !== this.dataList.items[itemIndex]._data.settleTimeout && this.dataList.items[itemIndex]._data.settleTimeout >= 0)
      {
        timeoutRunning = true;
      }
      break;
  }

  return timeoutRunning;
};

/**
 * Settle an item after the settle time expires.
 * The cached value (if any) gets assigned as a
 * real value to the item and the item is updated.
 * This is the settleTimeout callback.
 * TAG: internal
 * =========================
 * @param {integer} - item index
 * @return {Boolean} - True if the item is successfully settled
 */
List2Ctrl.prototype._settleItem = function(itemIndex)
{
  // exit if we don't have any items (nothing to show the focus)
  if (!this.hasDataList())
  {
    return false;
  }

  // exit if the item index is out of range
  if (isNaN(itemIndex) || itemIndex < 0 || itemIndex >= this.dataList.items.length)
  {
    return false;
  }

  const item = this.dataList.items[itemIndex];

  // exit if we don't have _data property
  if (!this._hasData(itemIndex))
  {
    return false;
  }

  // get settle value and set it as real value, and update item
  const settleValue = item._data.settleValue;


  if (this._isToggle(itemIndex) || this._isOnOff(itemIndex))
  {
    if (null != item._data.settleValue)
    {
      // set real value
      item.value = settleValue;
      this.updateItems(itemIndex, itemIndex);

      // release settle value
      item._data.settleValue = null;
    }
    // reset timeout
    item._data.settleTimeout = null;
  }
  else if (this._isCheckBox(itemIndex))
  {
    // Note: setting the real value is done in the helpers
    switch (item.image1)
    {
      case 'checkbox':
        if (null != item._data.settleValue)
        {
          // set real value
          this._setCheckBox(itemIndex, settleValue);

          // release settle value
          item._data.settleValue = null;
        }
        // reset timeout
        item._data.settleTimeout = null;
        break;

      case 'radio':
        if (null != item._data.settleValue)
        {
          // set real value
          this._setRadio(itemIndex, settleValue);

          // release settle value
          item._data.settleValue = null;
        }
        // reset timeout
        this._radioSettleTimeoutId = null;
        break;

      case 'tick':
        if (null != item._data.settleValue)
        {
          // set real value
          this._setTick(itemIndex, settleValue);

          // release settle value
          item._data.settleValue = null;
        }
        // reset timeout
        this._tickSettleTimeoutId = null;
        break;
    }
  }
  else
  {
    // item does not support settlement
    return false;
  }

  log.debug('Settle item: ' + itemIndex + ', value: ' + settleValue);

  // return success
  return true;
};


/**
 * =========================
 * MULTICONTROLLER AND VUI
 * =========================
 */

/**
 * Main multicontroller handler
 * TAG: multicontroller-only, public
 * =========================
 * @param {string} - multicontroller event
 * @return {string} - event consumed
 */
List2Ctrl.prototype.handleControllerEvent = function(eventID)
{
  log.debug('handleController() called, eventID: ' + eventID);

  /*
     * eventID
     * - acceptFocusInit (sent on instantiation)
     * - acceptFocusFromLeft
     * - acceptFocusFromRight
     * - acceptFocusFromTop
     * - acceptFocusFromBottom
     * - lostFocus
     * - touchActive
     * ...
     */

  let response;

  // ignore certain MC events when the list is in motion by touch
  if (this._inDrag || (this._inScroll && 'touch' === this._scrollNature))
  {
    switch (eventID)
    {
      case 'acceptFocusInit':
      case 'acceptFocusFromLeft':
      case 'acceptFocusFromRight':
      case 'acceptFocusFromTop':
      case 'acceptFocusFromBottom':
      case 'lostFocus':
      case 'touchActive':
      case 'controllerActive':
        // pass these events
        break;
      default:
        // ignore everything else
        return 'ignored';
        break;
    }
  }

  if (!this._inSecondaryMulticontroller)
  {
    // we are in primary multicontroller mode
    switch (eventID)
    {
      case 'acceptFocusInit':
        // consume event by default
        response = 'consumed';

        // Input mode change to multicontroller
        this._inputMode = 'controller';
        /*
                 * this event is received every time a template is displayed
                 * if we already have preset a focus item, do not set it again
                 */
        // Show focus animation
        this._showFocusAnimation = true;
        if ('restore' != this._initialScrollMode)
        {
          this._hasFocus = true;
          const itemToGainFocus = this._canGainFocus('controllerActive');
          if (-1 !== itemToGainFocus)
          {
            this._showFocus(itemToGainFocus);
          }
          else
          {
            if (this.hasDataList())
            {
              // we have data list and there are no enabled items -> give focus to the left
              response = 'giveFocusLeft';
            }
            else
            {
              // we probably dont't have a data list -> wait untul we get it
              this._showFocus(this.properties.focussedItem);
            }
          }
        }
        else
        {
          this._showFocus(this.properties.focussedItem);
        }
        break;

      case 'acceptFocusFromLeft':
        // Show focus animation
        this._showFocusAnimation = true;
        // Restore focussed element
        let itemToGainFocus = this._canGainFocus();
        if (-1 !== itemToGainFocus)
        {
          this._hasFocus = true;
          this._showFocus(itemToGainFocus);
          response = 'consumed';
        }
        else
        {
          response = 'ignored';
        }
        break;

      case 'acceptFocusFromRight':
        // Restore focussed element
        let itemToGainFocus = this._canGainFocus();
        if (-1 !== itemToGainFocus)
        {
          this._hasFocus = true;
          this._showFocus(itemToGainFocus);
          response = 'consumed';
        }
        else
        {
          response = 'ignored';
        }
        break;

      case 'acceptFocusFromTop':
        // Restore focussed element
        let itemToGainFocus = this._canGainFocus();
        if (-1 !== itemToGainFocus)
        {
          this._hasFocus = true;
          this._showFocus(itemToGainFocus);
          response = 'consumed';
        }
        else
        {
          response = 'ignored';
        }
        break;

      case 'acceptFocusFromBottom':
        // Restore focussed element
        let itemToGainFocus = this._canGainFocus();
        if (-1 !== itemToGainFocus)
        {
          this._hasFocus = true;
          this._showFocus(itemToGainFocus);
          response = 'consumed';
        }
        else
        {
          response = 'ignored';
        }
        break;

      case 'lostFocus':
        this._hideFocus();
        this._hideFocusLetterIndex();
        this._hasFocus = false;
        response = 'consumed';
        break;

      case 'touchActive':
        // Input mode change to touch
        this._inputMode = 'touch';
        this._hideFocus();
        response = 'consumed';
        break;

      case 'controllerActive':
        response = 'consumed';
        break;

      case 'cw':
        // Rotate Right (CW)

        // remove any hit state
        this._itemRemoveHit();
        this._indexRemoveHit();

        // handle event in dedicated handler
        response = this._handleMCCW();
        break;

      case 'ccw':
        // Rotate Left (CCW)

        // remove any hit state
        this._itemRemoveHit();
        this._indexRemoveHit();

        // handle event in dedicated handler
        response = this._handleMCCCW();
        break;

      case 'downStart':
        // Tilt Down Start

        // remove any hit state
        this._itemRemoveHit();
        this._indexRemoveHit();

        // handle event in dedicated handler
        response = this._handleMCDown();

        // schedule autoscroll behavior only if not in list reorder
        if (!this._inListReorder)
        {
          clearTimeout(this._tiltHoldTimeoutId); // clear any redundant timeouts
          this._tiltHoldTimeoutId = null;
          log.debug('Schedule autoscroll tier 1');
          this._tiltHoldTimeoutId = setTimeout(function() { // schedule first autoscroll tier
            this._beep('Long', 'Multicontroller'); // produce beep
            log.debug('Start autoscroll tier 1');
            this._handleMCDown(); // do the first scroll down
            clearInterval(this._tiltHoldIntervalId); // clear any redundand intervals
            this._tiltHoldIntervalId = null;
            log.debug('Schedule autoscroll tier 2');
            this._tiltHoldIntervalId = setInterval(this._handleMCDown.bind(this), this.properties.autoscrollTier1Interval); // schedule auto scroll down for first tier
            if (!this._inLetterIndexMulticontroller)
            {
              this._tiltHoldTimeoutId = setTimeout(function() { // schedule second autoscroll tier only if not in letter index multicontroller
                log.debug('Start autoscroll tier 2');
                this._scrollDownPage(); // do the first scroll down
                clearInterval(this._tiltHoldIntervalId); // clear any redundand intervals from the first tier
                this._tiltHoldIntervalId = null;
                this._tiltHoldIntervalId = setInterval(this._scrollDownPage.bind(this), this.properties.autoscrollTier2Interval); // schedule auto scroll down for second tier
              }.bind(this), this.properties.autoscrollTier2Timeout);
            }
          }.bind(this), this.properties.autoscrollTier1Timeout);
        }

        break;

      case 'down':
        // Tilt Down Stop

        if ('downStart' === this._lastControllerEvent)
        {
          log.debug('Clear any scheduled autoscrolls');
          clearTimeout(this._tiltHoldTimeoutId);
          clearInterval(this._tiltHoldIntervalId);
          this._tiltHoldTimeoutId = null;
          this._tiltHoldIntervalId = null;

          // schedule letter index select
          if (this._inLetterIndexMulticontroller)
          {
            const currentFocussedLetterIndex = this._getFocussedLetterIndex();
            this._scheduleLetterIndexSelect(currentFocussedLetterIndex);
          }

          response = 'consumed';
        }
        else
        {
          // ignore any downs without downStarts
          response = 'ignored';
        }

        break;

      case 'upStart':
        // Tilt Up Start

        // remove any hit state
        this._itemRemoveHit();
        this._indexRemoveHit();

        // handle event in dedicated handler
        response = this._handleMCUp();

        // schedule autoscroll behavior only if not in list reorder
        if (!this._inListReorder)
        {
          clearTimeout(this._tiltHoldTimeoutId); // clear any redundant timeouts
          this._tiltHoldTimeoutId = null;
          log.debug('Schedule autoscroll tier 1');
          this._tiltHoldTimeoutId = setTimeout(function() { // schedule first autoscroll tier
            this._beep('Long', 'Multicontroller'); // produce beep
            log.debug('Start autoscroll tier 1');
            this._handleMCUp(); // do the first scroll up
            clearInterval(this._tiltHoldIntervalId); // clear any redundand intervals
            this._tiltHoldIntervalId = null;
            log.debug('Schedule autoscroll tier 2');
            this._tiltHoldIntervalId = setInterval(this._handleMCUp.bind(this), this.properties.autoscrollTier1Interval); // schedule auto scroll up for first tier
            if (!this._inLetterIndexMulticontroller)
            {
              this._tiltHoldTimeoutId = setTimeout(function() { // schedule second autoscroll tier only if not in letter index multicontroller
                log.debug('Start autoscroll tier 2');
                this._scrollUpPage(); // do the first scroll up
                clearInterval(this._tiltHoldIntervalId); // clear any redundand intervals from the first tier
                this._tiltHoldIntervalId = null;
                this._tiltHoldIntervalId = setInterval(this._scrollUpPage.bind(this), this.properties.autoscrollTier2Interval); // schedule auto scroll up for second tier
              }.bind(this), this.properties.autoscrollTier2Timeout);
            }
          }.bind(this), this.properties.autoscrollTier1Timeout);
        }

        break;

      case 'up':
        // Tilt Up Stop

        if ('upStart' === this._lastControllerEvent)
        {
          log.debug('Clear any scheduled autoscrolls');
          clearTimeout(this._tiltHoldTimeoutId);
          clearInterval(this._tiltHoldIntervalId);
          this._tiltHoldTimeoutId = null;
          this._tiltHoldIntervalId = null;

          // schedule letter index select
          if (this._inLetterIndexMulticontroller)
          {
            const currentFocussedLetterIndex = this._getFocussedLetterIndex();
            this._scheduleLetterIndexSelect(currentFocussedLetterIndex);
          }

          response = 'consumed';
        }
        else
        {
          // ignore any ups without upStarts
          response = 'ignored';
        }

        break;

      case 'leftStart':
        // Tilt Left Start

        // remove any hit state
        this._itemRemoveHit();
        this._indexRemoveHit();

        if (this.tabsCtrl)
        {
          // Pass bump to TabsCtrl
          response = this.tabsCtrl.handleControllerEvent(eventID);
        }
        else if (this.letterIndexData.length && this._inLetterIndexMulticontroller)
        {
          // Exit letter index multicontroller mode
          this._setLetterIndexMulticontroller(false);
        }
        else
        {
          // Return
          log.debug('No TabsCtrl. Return giveFocusLeft...');
          response = 'giveFocusLeft';
        }
        break;

      case 'left':
        // Tilt Left Stop

        if ('leftStart' === this._lastControllerEvent)
        {
          response = 'ignored';

          if (this.tabsCtrl)
          {
            // Pass bump to TabsCtrl
            response = this.tabsCtrl.handleControllerEvent(eventID);
          }
        }
        else
        {
          // ignore any lefts without leftStarts
          response = 'ignored';
        }
        break;

      case 'rightStart':
        // Tilt Right Start

        // remove any hit state
        this._itemRemoveHit();
        this._indexRemoveHit();

        if (this.tabsCtrl)
        {
          // Pass bump to TabsCtrl
          response = this.tabsCtrl.handleControllerEvent(eventID);
        }
        else if (this.letterIndexData.length && !this._inLetterIndexMulticontroller)
        {
          // Enter into letter index multicontroller mode
          this._setLetterIndexMulticontroller(true);
          response = 'consumed';
        }
        else
        {
          // Return
          log.debug('No TabsCtrl. Return giveFocusRight...');
          response = 'giveFocusRight';
        }
        break;


      case 'right':
        // Tilt Right Stop

        if ('rightStart' === this._lastControllerEvent)
        {
          response = 'ignored';
          if (this.tabsCtrl)
          {
            // Pass bump to TabsCtrl
            response = this.tabsCtrl.handleControllerEvent(eventID);
          }
        }
        else
        {
          // ignore any rights without rightStarts
          response = 'ignored';
        }
        break;


      case 'selectStart':
        // SelectStart (press down)

        if (this._inLetterIndexMulticontroller)
        {
          // get the focussed letter index
          const focussedLetterIndex = this._getFocussedLetterIndex();

          // make focussed letter index hit
          this._indexMakeHit(focussedLetterIndex);
        }
        else
        {
          // get the focussed index
          const focussedIndex = this._getFocussedIndex();

          // make focussed index hit
          this._itemMakeHit(focussedIndex);

          // start longpress countdown
          this._longPressTimeoutId = setTimeout(this._itemLongPress.bind(this, focussedIndex), this.properties.longPressTimeout);
        }

        // always consume selectStart
        response = 'consumed';

        break;

      case 'select':
        // Select (press down)

        if ('selectStart' === this._lastControllerEvent)
        {
          // remove any hit state
          this._itemRemoveHit();
          this._indexRemoveHit();

          // remove long press
          this._itemRemoveLongPress();
          clearTimeout(this._longPressTimeoutId); // clear longpress timeout

          // are we in letter index multicontroller mode?
          if (this._inLetterIndexMulticontroller)
          {
            // fire letter index select
            const currentFocussedLetterIndex = this._getFocussedLetterIndex();
            this._letterIndexSelect(currentFocussedLetterIndex, 'Multicontroller');
          }
          else
          {
            if (this.properties.listReorder)
            {
              // if we are reordering lists (hence pressing down does not produce select event)
              if (!this._inListReorder)
              {
                // get focussed index
                const focussedIndex = this._getFocussedIndex();

                // check if focussed index is indeed eligable for list reorder
                if ('shortAndLong' === this.dataList.items[focussedIndex].itemBehavior)
                {
                  // we are about to begin list reorder
                  this._enterListReorder();
                }
              }
              else
              {
                // we finish list reorder
                this._releaseListReorder();
              }
            }
            else
            {
              // if we are in normal mode - not reordering list

              // get the focussed index
              const focussedIndex = this._getFocussedIndex();

              // does the element have secondary multicontroller behavior?
              if (this._hasSecondaryMulticontroller(focussedIndex) && this._isSlider(focussedIndex))
              {
                if (this.dataList.items[focussedIndex].allowAdjust)
                {
                  // this item has secondary select and is adjustable slider -> enter into secondary multicontroller mode
                  this._setSecondaryMulticontroller(true);
                }
                else
                {
                  // this item has secondary select but is not adjustable -> trigger focus
                  this._triggerFocus();
                }
              }
              else if (this._hasSecondaryMulticontroller(focussedIndex))
              {
                // this item has secondary select -> enter into secondary multicontroller mode
                this._setSecondaryMulticontroller(true);
              }
              else
              {
                // this is a regular item -> trigger focus
                this._triggerFocus();
              }
            }
          }

          // consume Select only after selectStart is consumed
          response = 'consumed';
        }
        else
        {
          // ignore any selects without selectStarts
          response = 'ignored';
        }

        break;

      default:
        // No action
        response = 'ignored';
        break;
    }
  }
  else
  {
    // we are in secondary multicontroller mode
    response = this._handleControllerEventSecondary(eventID);
  }

  // keep track of the last consumed event
  if ('consumed' === response)
  {
    this._lastControllerEvent = eventID;
  }

  /*
     * returns
     * - giveFocusLeft (control retains highlight unless it later gets lostFocus event)
     * - giveFocusRight
     * - giveFocusUp
     * - giveFocusDown
     * - consumed (always returned on select event, and if control adjusted highlight)
     * - ignored (returned only if control doesn't know about focus)
     */

  log.debug('Event: ' + eventID + ' -> ' + 'Response: ' + response);

  return response;
};

/**
 * Handle multicontroller clockwise rotation event
 * TAG: multicontroller-only, internal
 * =========================
 * @return {string} - event consumed status
 */
List2Ctrl.prototype._handleMCCW = function()
{
  // are we in letter index multicontroller mode?
  if (this._inLetterIndexMulticontroller)
  {
    // get relative focussed index before moving the focus
    let rfi = this._getRelativeFocussedLetterIndex();

    // define threshold that will serve as a scroll trigger
    const bottomFocusThreshold = this.properties.visibleLetterIndexItems - 2;

    // attempt focus move
    if (rfi <= bottomFocusThreshold)
    {
      // we are free to move the focus down
      this._showFocusLetterIndex('down');
    }
    else if (this._topLetterIndex === this.letterIndexData.length - this.properties.vivisibleLetterIndexItemssibleItems)
    {
      // we are at the end -> move the focus to the last item
      this._showFocusLetterIndex('down');
    }

    // we need to go back to the beginning in order to scroll up
    const currentFocussedLetterIndex = this._getFocussedLetterIndex();

    // schedule letter index select
    this._scheduleLetterIndexSelect(currentFocussedLetterIndex);

    // get relative focussed index after moving the focus
    rfi = this._getRelativeFocussedLetterIndex();

    // attempt scroll if the focus has passed the threshold
    if (rfi > bottomFocusThreshold)
    {
      this._scrollDownOneIndex();
    }
  }
  else
  {
    // define threshold that will serve as a scroll trigger
    const bottomFocusThreshold = this.properties.visibleItems - 2;

    // if we are in list reorder mode - push the draggable item down and set focus on it
    if (this._inListReorder)
    {
      this._reorderItemDown();

      // set focus
      this._showFocus(this._reorderCurrentIndex);

      const rfi = this._getRelativeFocussedIndex();
    }
    // we are not in list reorder mode -> do regular focus scroll
    else
    {
      // get relative focussed index before moving the focus
      let rfi = this._getRelativeFocussedIndex();

      const currentFocussedIndex = this._getFocussedIndex();

      // attempt focus move
      if (rfi <= bottomFocusThreshold)
      {
        // we are free to move the focus down
        this._showFocus('down');
      }
      else if (this._topItem === this.dataList.itemCount - this.properties.visibleItems)
      {
        // we are at the end -> move the focus to the last item
        this._showFocus('down');
      }
      else if (rfi > bottomFocusThreshold)
      {
        // the focus is past the bottom focus threshold -> do not move it any more
        // this._showFocus('up');
      }

      // get relative focussed index after moving the focus
      rfi = this._getRelativeFocussedIndex();

      if (this._getFocussedIndex() == currentFocussedIndex) // didn't move
      {
        if (this.dataList && this.dataList.items)
        {
          let index = 0;
          while (index < this.dataList.items.length && this.dataList.items[index].disabled) index++;
          if (index < this.dataList.items.length)
          {
            this._manageFocus(index);
            return 'consumed';
          }
        }
      }
    }

    // attempt scroll if the focus has passed the threshold
    if (rfi > bottomFocusThreshold)
    {
      this._scrollDownOne();
    }
  }

  return 'consumed';
};

/**
 * Handle multicontroller counter clockwise rotation event
 * TAG: multicontroller-only, internal
 * =========================
 * @return {string} - event consumed status
 */
List2Ctrl.prototype._handleMCCCW = function()
{
  // are we in letter index multicontroller mode?
  if (this._inLetterIndexMulticontroller)
  {
    // get relative focussed index before moving the focus
    let rfi = this._getRelativeFocussedLetterIndex();

    // attempt focus move
    if (rfi >= 1)
    {
      // we are free to move the focus down
      this._showFocusLetterIndex('up');
    }
    else if (this._topLetterIndex === 0)
    {
      // we are at the end -> move the focus to the last item
      this._showFocusLetterIndex('up');
    }

    // we need to go back to the beginning in order to scroll up
    const currentFocussedLetterIndex = this._getFocussedLetterIndex();

    // schedule letter index select
    this._scheduleLetterIndexSelect(currentFocussedLetterIndex);

    // get relative focussed index after moving the focus
    rfi = this._getRelativeFocussedLetterIndex();

    // attempt scroll if the focus has passed the threshold
    if (rfi < 1)
    {
      this._scrollUpOneIndex();
    }
  }
  else
  {
    // if we are in list reorder mode - push the draggable item down and set focus on it
    if (this._inListReorder)
    {
      this._reorderItemUp();

      // set focus
      this._showFocus(this._reorderCurrentIndex);

      const rfi = this._getRelativeFocussedIndex();
    }
    // we are not in list reorder mode -> do regular focus scroll
    else
    {
      // get relative focussed index before moving the focus
      let rfi = this._getRelativeFocussedIndex();

      const currentFocussedIndex = this._getFocussedIndex();

      // attempt focus move
      if (rfi >= 1)
      {
        // we are free to move the focus up
        this._showFocus('up');
      }
      else if (this._topItem === 0)
      {
        // we are at the beginning -> move the focus to the first item
        this._showFocus('up');
      }
      else if (rfi === 0)
      {
        // the focus is on the top item -> do not move it any more
        // this._showFocus('down');
      }

      // get relative focussed index after moving the focus
      rfi = this._getRelativeFocussedIndex();

      if (this._getFocussedIndex() == currentFocussedIndex) // didn't move
      {
        if (this.dataList && this.dataList.items)
        {
          let index = this.dataList.items.length - 1;
          while (index >= 0 && this.dataList.items[index].disabled) index--;
          if (index >= 0)
          {
            this._manageFocus(index);
            return 'consumed';
          }
        }
      }
    }

    // attempt scroll if the focus is at the first item
    if (rfi < 1)
    {
      this._scrollUpOne();
    }
  }

  return 'consumed';
};

/**
 * Handle multicontroller down tilt event
 * TAG: multicontroller-only, internal
 * =========================
 * @return {string} - event consumed status
 */
List2Ctrl.prototype._handleMCDown = function()
{
  // are we in letter index multicontroller mode?
  if (this._inLetterIndexMulticontroller)
  {
    // get relative focussed index before moving the focus
    let rfi = this._getRelativeFocussedLetterIndex();

    // define threshold that will serve as a scroll trigger
    const bottomFocusThreshold = this.properties.visibleLetterIndexItems - 2;

    // attempt focus move
    if (rfi <= bottomFocusThreshold)
    {
      // we are free to move the focus down
      this._showFocusLetterIndex('down');
    }
    else if (this._topLetterIndex === this.letterIndexData.length - this.properties.vivisibleLetterIndexItemssibleItems)
    {
      // we are at the end -> move the focus to the last item
      this._showFocusLetterIndex('down');
    }

    // get relative focussed index after moving the focus
    rfi = this._getRelativeFocussedLetterIndex();

    // attempt scroll if the focus has passed the threshold
    if (rfi > bottomFocusThreshold)
    {
      this._scrollDownOneIndex();
    }
  }
  else
  {
    if (this._inListReorder)
    {
      this._reorderItemDown();

      // set focus
      this._showFocus(this._reorderCurrentIndex);

      const rfi = this._getRelativeFocussedIndex();
    }
    else
    {
      const bottomFocusThreshold = this.properties.visibleItems - 2;

      // get relative focussed index before moving the focus
      let rfi = this._getRelativeFocussedIndex();

      const currentFocussedIndex = this._getFocussedIndex();

      // attempt focus move
      if (rfi <= bottomFocusThreshold)
      {
        // we are free to move the focus down
        this._showFocus('down');
      }
      else if (this._topItem === this.dataList.itemCount - this.properties.visibleItems)
      {
        // we are at the end -> move the focus to the last item
        this._showFocus('down');
      }
      else if (rfi > bottomFocusThreshold)
      {
        // the focus is past the bottom focus threshold -> do not move it any more
        // this._showFocus('up');
      }

      // get relative focussed index after moving the focus
      rfi = this._getRelativeFocussedIndex();

      if (this._getFocussedIndex() == currentFocussedIndex) // didn't move
      {
        if (this.dataList && this.dataList.items)
        {
          let index = 0;
          while (index < this.dataList.items.length && this.dataList.items[index].disabled) index++;
          if (index < this.dataList.items.length)
          {
            this._manageFocus(index);
            return 'consumed';
          }
        }
      }
    }
    // attempt scroll if the focus has passed the threshold
    if (rfi > bottomFocusThreshold)
    {
      this._scrollDownOne();
    }
  }

  return 'consumed';
};


/**
 * Handle multicontroller up tilt event
 * TAG: multicontroller-only, internal
 * =========================
 * @return {string} - event consumed status
 */
List2Ctrl.prototype._handleMCUp = function()
{
  // are we in letter index multicontroller mode?
  if (this._inLetterIndexMulticontroller)
  {
    // get relative focussed index before moving the focus
    let rfi = this._getRelativeFocussedLetterIndex();

    // attempt focus move
    if (rfi >= 1)
    {
      // we are free to move the focus down
      this._showFocusLetterIndex('up');
    }
    else if (this._topLetterIndex === 0)
    {
      // we are at the end -> move the focus to the last item
      this._showFocusLetterIndex('up');
    }

    // get relative focussed index after moving the focus
    rfi = this._getRelativeFocussedLetterIndex();

    // attempt scroll if the focus has passed the threshold
    if (rfi < 1)
    {
      this._scrollUpOneIndex();
    }
  }
  else
  {
    if (this._inListReorder)
    {
      // if we are in list reorder mode - push the draggable item up and set focus on it
      this._reorderItemUp();

      // set focus
      this._showFocus(this._reorderCurrentIndex);
      const rfi = this._getRelativeFocussedIndex();
    }
    else
    {
      // get relative focussed index before moving the focus
      let rfi = this._getRelativeFocussedIndex();

      const currentFocussedIndex = this._getFocussedIndex();

      // attempt focus move
      if (rfi >= 1)
      {
        // we are free to move the focus up
        this._showFocus('up');
      }
      else if (this._topItem === 0)
      {
        // we are at the beginning -> move the focus to the first item
        this._showFocus('up');
      }
      else if (rfi === 0)
      {
        // the focus is on the top item -> do not move it any more
        // this._showFocus('down');
      }

      // get relative focussed index after moving the focus
      rfi = this._getRelativeFocussedIndex();

      if (this._getFocussedIndex() == currentFocussedIndex) // didn't move
      {
        if (this.dataList && this.dataList.items)
        {
          let index = this.dataList.items.length - 1;
          while (index >= 0 && this.dataList.items[index].disabled) index--;
          if (index >= 0)
          {
            this._manageFocus(index);
            return 'consumed';
          }
        }
      }
    }

    // attempt scroll if the focus is at the first item
    if (rfi < 1)
    {
      this._scrollUpOne();
    }
  }

  return 'consumed';
};


/**
 * handle controller event and apply it on items that are in secondary multicontroller mode
 * TAG: multicontroller-only, internal
 * =========================
 * @param {string} - multicontroller event
 * @return {string} - event consumed
 */
List2Ctrl.prototype._handleControllerEventSecondary = function(eventID)
{
  // get the index
  const focussedIndex = this._getFocussedIndex();

  // handle event
  switch (eventID)
  {
    case 'up':
      // leave secondary multicontroller mode
      this._setSecondaryMulticontroller(false);
      if (!this._isLock(focussedIndex))
      {
        // trigger focus only on non-lock items
        this._triggerFocus();
      }
      else
      {
        // remove focus from lock buttons
        this._lockShowFocus(focussedIndex, 'clear');
      }

      // move the focus up
      this._showFocus('up');

      // get relative focussed index after moving the focus
      let rfi = this._getRelativeFocussedIndex();

      // we need to go back to the beginning in order to scroll up
      if (rfi < 1)
      {
        this._scrollUpOne();
      }
      break;


    case 'down':
      // leave secondary multicontroller mode
      this._setSecondaryMulticontroller(false);

      if (!this._isLock(focussedIndex))
      {
        // trigger focus only on non-lock items
        this._triggerFocus();
      }
      else
      {
        // remove focus from lock buttons
        this._lockShowFocus(focussedIndex, 'clear');
      }

      // move the focus down
      this._showFocus('down');

      // define threshold that will serve as a scroll trigger
      const bottomFocusThreshold = this.properties.visibleItems - 2;
      // get relative focussed index after moving the focus
      let rfi = this._getRelativeFocussedIndex();

      // we need to go to the end in order to scroll down
      if (rfi >= bottomFocusThreshold)
      {
        this._scrollDownOne();
      }
      break;

    case 'leftStart':

      if (this._isSlider(focussedIndex) && this._activeSlider)
      {
        // pass event to slider
        this._activeSlider.slider.handleControllerEvent('leftStart');
      }
      else if (this._isStep(focussedIndex))
      {
        // change the value and fire selectCallback informing the app of the change
        const newValue = this._stepDown(focussedIndex);
        // do not fire select if value is the same
        if (null != newValue)
        {
          this._itemSelect(focussedIndex, {value: newValue, finalAdjustment: false});
        }
      }
      else if (this._isLock(focussedIndex))
      {
        // move the focus
        this._lockMoveFocusLeft(focussedIndex);
      }

      break;

    case 'left':

      if (this._isSlider(focussedIndex) && this._activeSlider)
      {
        // pass the event down to the slider
        this._activeSlider.slider.handleControllerEvent('left');
      }
      break;

    case 'ccw':

      if (this._isSlider(focussedIndex) && this._activeSlider)
      {
        // pass the event down to the slider
        this._activeSlider.slider.handleControllerEvent(eventID);
      }
      else if (this._isStep(focussedIndex))
      {
        // change the value and fire selectCallback informing the app of the change
        const itemDOMElement = this._getDOMItem(focussedIndex);
        if (!itemDOMElement.classList.contains('minReached'))
        {
          const newValue = this._stepDown(focussedIndex);

          // do not fire select if value is the same
          if (null != newValue)
          {
            this._itemSelect(focussedIndex, {value: newValue, finalAdjustment: false});
          }
        }
      }
      else if (this._isLock(focussedIndex))
      {
        // move the focus
        this._lockMoveFocusLeft(focussedIndex);
      }

      break;

    case 'rightStart':

      if (this._isSlider(focussedIndex) && this._activeSlider)
      {
        // pass event to slider
        this._activeSlider.slider.handleControllerEvent('rightStart');
      }
      else if (this._isStep(focussedIndex))
      {
        // change the value and fire selectCallback informing the app of the change
        const newValue = this._stepUp(focussedIndex);
        // do not fire select if value is the same
        if (null != newValue)
        {
          this._itemSelect(focussedIndex, {value: newValue, finalAdjustment: false});
        }
      }
      else if (this._isLock(focussedIndex))
      {
        // move the focus
        this._lockMoveFocusRight(focussedIndex);
      }

      break;

    case 'right':

      if (this._isSlider(focussedIndex) && this._activeSlider)
      {
        // pass the event down to the slider
        this._activeSlider.slider.handleControllerEvent('right');
      }

      break;

    case 'cw':

      if (this._isSlider(focussedIndex) && this._activeSlider)
      {
        // pass the event down to the slider
        this._activeSlider.slider.handleControllerEvent(eventID);
      }
      else if (this._isStep(focussedIndex))
      {
        // change the value and fire selectCallback informing the app of the change
        const itemDOMElement = this._getDOMItem(focussedIndex);
        if (!itemDOMElement.classList.contains('maxReached'))
        {
          const newValue = this._stepUp(focussedIndex);

          // do not fire select if value is the same
          if (null != newValue)
          {
            this._itemSelect(focussedIndex, {value: newValue, finalAdjustment: false});
          }
        }
      }
      else if (this._isLock(focussedIndex))
      {
        // move the focus
        this._lockMoveFocusRight(focussedIndex);
      }

      break;

    case 'select':
      // leave secondary multicontroller mode and trigger focus
      this._setSecondaryMulticontroller(false);
      this._showFocus(this._lastItemWithFocus);
      this._triggerFocus();
      break;
  }

  // the secondary multicontroller events are always consumed
  return 'consumed';
};

/**
 * Set secondary multicontroller mode
 * TAG: multicontroller-only, internal
 * =========================
 * @param {string} - multicontroller event
 * @param {integer} - focussed index
 * @return {void}
 */
List2Ctrl.prototype._setSecondaryMulticontroller = function(state, focussedIndex)
{
  // get focussed index
  if (isNaN(focussedIndex))
  {
    const focussedIndex = this._getFocussedIndex();
  }

  // do not set secondary multicontroller to true if the item is disabled
  if (state && this.dataList.items[focussedIndex].disabled)
  {
    return;
  }

  if (state)
  {
    // flag as we are in secondary multicontroller mode
    this._inSecondaryMulticontroller = true;

    // add secondary focus class
    const domItem = this._getDOMItem(focussedIndex);
    if (domItem)
    {
      domItem.classList.add('secondaryFocus');
    }

    /**
         * Fire select callback to notify apps that we are
         * entering into secondary multicontroller mode.
         * In most cases apps will ignore this event.
         * Transition focus to subcontrols.
         */
    if (this._isSlider(focussedIndex))
    {
      // the target is a slider and can be adjusted -> set currently active slider
      this._activeSlider = {
        itemIndex: focussedIndex, // currently active slider index
        slider: this._getSlider(focussedIndex), // currently active slider instance
      };

      // transition focus
      this._activeSlider.slider.handleControllerEvent('acceptFocusFromTop');

      // fire select callback for app notification
      this._itemSelect(focussedIndex);
    }

    /**
         * Place focus highlight on the lock inline button
         * if the target is a lock item
         */
    if (this._isLock(focussedIndex))
    {
      this._lockShowFocus(focussedIndex, 1);
    }

    this._currentSecondaryMulticontrollerItem = focussedIndex;
  }
  else
  {
    this._inSecondaryMulticontroller = false;

    // remove secondary focus class
    const domItem = this._getDOMItem(focussedIndex);
    if (domItem)
    {
      domItem.classList.remove('secondaryFocus');
    }

    /**
         * Transition focus from subcontrols.
         */
    if (this._isSlider(focussedIndex) && this._activeSlider)
    {
      // transition focus
      this._activeSlider.slider.handleControllerEvent('lostFocus');
    }

    this._currentSecondaryMulticontrollerItem = null;
  }
};

/**
 * Set letter index multicontroller mode
 * TAG: multicontroller-only, internal
 * =========================
 * @param {boolean}
 * @return {void}
 */
List2Ctrl.prototype._setLetterIndexMulticontroller = function(state, isTouch)
{
  if (state)
  {
    // hide focus from the main list and show it in the letter index
    this._hideFocus();
    this._showFocusLetterIndex(this._getCurrentLetterIndex());
    this._inLetterIndexMulticontroller = true;
  }
  else
  {
    // hide focus from the letter index and show it in the main list
    if (!isTouch)
    {
      this._showFocus(this._lastItemWithFocus);
    }
    this._inLetterIndexMulticontroller = false;
    this._hideFocusLetterIndex();

    // clear any scheduled letter index select
    this._scheduleLetterIndexSelect(null, true);
  }
};

/**
 * Manage focus highlight
 * This is the single point for managing focus when requested from outside List2.
 * (focusedItem setter, restoreContext) Manages reorder and focus as required.
 * TAG: internal
 * =========================
 * @param {number} - item index
 * @return {integer} - the new focussed index
 */
List2Ctrl.prototype._manageFocus = function(item)
{
  if (this._inListReorder && !isNaN(item))
  {
    this._reorderToIndex(item);
  }
  return this._showFocus(item);
};

/**
 * Show focus highlight
 * This is the single point for showing the
 * focus highlight
 * TAG: internal
 * =========================
 * @param {strig | number} - direction (up|down) or item index
 * @param {boolean} - simulation mode: use to perform check on where the focus will end
 * @return {integer} - the new focussed index
 */
List2Ctrl.prototype._showFocus = function(item, allowOffscreen, simulationMode, abortMode)
{
  log.debug('List2: _showFocus item, allowOffscreen, simulationMode, abortMode ', item, allowOffscreen, simulationMode, abortMode);
  if (!this._hasFocus)
  {
    return;
  }

  if (this._inputMode != 'controller')
  {
    // do not show the focus if the input mode is other than 'controller'
    return;
  }

  // exit if we don't have any items (nothing to show the focus)
  if (!this.hasDataList())
  {
    return;
  }

  // do not show focus when in list reorder by touch
  if (this._reorderTouchElt)
  {
    return;
  }

  let abortMode = (true === abortMode);

  // do not change focussed index when we are in loading and no scrolling is allowed during that time
  if (!this.properties.scrollingDuringLoading && this._inLoading && !abortMode)
  {
    return;
  }

  let simulationMode = (true === simulationMode);

  // get the last focussed index (real and relative)
  let lastFocussedIndex = this._getFocussedIndex();
  const lastRelativeFocussedIndex = this._getRelativeFocussedIndex();

  // if we don't have previous focus, select the topmost
  if (lastFocussedIndex == null)
  {
    lastFocussedIndex = this._topItem;
  }

  // hide the focus only in real mode
  if (!simulationMode)
  {
    this._hideFocus();
  }


  let nextFocussedIndex = -1;
  let useTransition = true;
  let useRelativeIndeces = true;

  // find the next focussed element index
  // NOTE: 'down' and 'up' are ued primarily when focussing with multicontroller
  switch (item)
  {
    case 'down':
      // 'down' uses relative positioning
      // the next one but not exceeding the visible items

      if (!simulationMode)
      {
        let nextRealFocussedIndex = this.m.min(lastFocussedIndex+1, this.dataList.itemCount-1);
        while (this.dataList.items[nextRealFocussedIndex].disabled)
        {
          if (nextRealFocussedIndex >= this.dataList.itemCount-1) {
            // we have reached the end of the list and nothing is found -> exit with current index
            nextRealFocussedIndex = lastFocussedIndex;
            break;
          }
          // hmmm, not enabled -> try the next one
          nextRealFocussedIndex++;
        }
        // convert it to relative index
        nextFocussedIndex = this._realToRelativeIndex(nextRealFocussedIndex);
      }
      else
      {
        nextFocussedIndex = this.m.min(lastRelativeFocussedIndex+1, this.properties.visibleItems-1);
      }
      break;

    case 'up':
      // 'up' uses relative positioning
      // the previous one but not lower than the first one
      if (!simulationMode)
      {
        let nextRealFocussedIndex = this.m.max(lastFocussedIndex-1, 0);
        while (this.dataList.items[nextRealFocussedIndex].disabled)
        {
          if (nextRealFocussedIndex <= 0) {
            // we have reached the beginning of the list and nothing is found -> exit with current index
            nextRealFocussedIndex = lastFocussedIndex;
            break;
          }
          // hmmm, not enabled -> try the previous one
          nextRealFocussedIndex--;
        }
        // convert it to relative index
        nextFocussedIndex = this._realToRelativeIndex(nextRealFocussedIndex);
      }
      else
      {
        nextFocussedIndex = this.m.max(lastRelativeFocussedIndex-1, 0);
      }
      break;

    default:
      // move highlight instantly when jumping to an item
      useTransition = false;
      // absolute indeces use real positioning
      useRelativeIndeces = false;

      if (!isNaN(item))
      {
        // specific one -> make sure it is within the list bounds
        nextFocussedIndex = this.m.max(this.m.min(item, this.dataList.itemCount-1), 0);
      }
      else
      {
        // the top one
        nextFocussedIndex = this._topItem;
      }
  }

  // if we are in simulation -> return the would-be focussed index
  if (simulationMode)
  {
    return nextFocussedIndex;
  }

  // From here on, perform actual focus change
  // -----------------------------------------
  let pos = 0;
  if (useRelativeIndeces)
  {
    // convert relative nextFocussedIndex to position
    pos = nextFocussedIndex * this.properties.itemHeight;
    // convert nextFocussedIndex back to real one
    nextFocussedIndex = this._relativeToRealIndex(nextFocussedIndex);
  }
  else
  {
    // are we allowed to focus off screen?
    if (!allowOffscreen)
    {
      // check if focus is outside the screen and scroll the list so that it is inside
      if (this._realToRelativeIndex(nextFocussedIndex) < 0)
      {
        // scrollt up
        this._scrollTo(nextFocussedIndex, 0);
      }
      else if (this._realToRelativeIndex(nextFocussedIndex) > this.properties.visibleItems - 2)
      {
        // scroll down
        this._scrollTo((nextFocussedIndex + 2) - this.properties.visibleItems, 0);
      }
    }

    // convert absolute nextFocussedIndex to position
    pos = (nextFocussedIndex - this._topItem) * this.properties.itemHeight;
  }


  // find the new focussed element
  const focussedElement = this._getDOMItem(nextFocussedIndex);


  // do we have a focussed element?
  if (focussedElement)
  {
    focussedElement.classList.add('focus');

    // create first focus animation
    if (this._showFocusAnimation)
    {
      this._showFocusAnimation = false;
      this.firstFocusAnimationEndCallback = this._firstFocusAnimationEndCallback.bind(this);
      focussedElement.addEventListener('animationend', this.firstFocusAnimationEndCallback, false);
      focussedElement.classList.add('firstFocus');
    }
  }

  // set letter index position
  this._setLetterIndexPosition(nextFocussedIndex);

  // store focussed item
  this._lastItemWithFocus = nextFocussedIndex;

  return nextFocussedIndex;
};

/**
 * First focus animation end callback that is fired
 * when the first focus animation finishes.
 * It removes the firstFocus class from the event's target
 * and clears any subsequent animation callbacks
 * TAG: internal
 * =========================
 * @param {AnimationEvent}
 * @return {void}
 */
List2Ctrl.prototype._firstFocusAnimationEndCallback = function(e)
{
  e.target.classList.remove('firstFocus');
  e.target.removeEventListener('animationend', this.firstFocusAnimationEndCallback, false);
  this.firstFocusAnimationEndCallback = null;
};

/**
 * Hide focus highlight
 * This is the single point for hiding the
 * focus highlight
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._hideFocus = function()
{
  // Preserve focussed element
  this._lastItemWithFocus = this._getFocussedIndex();

  for (let i=0; i<this.items.length; i++)
  {
    this.items[i].domElt.classList.remove('focus');
  }
};

/**
 * Fire list select callback
 * TAG: multicontroller-only, internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._triggerFocus = function(itemIndex)
{
  // exit if we don't have any items
  if (!this.hasDataList())
  {
    return;
  }

  // get the index
  const focussedIndex = (!isNaN(itemIndex))? itemIndex : this._getFocussedIndex();

  // do we have a focussed element?
  if (focussedIndex != null)
  {
    let params = {};
    let fireSelect = true;

    // check the type of the item and perform additional processing
    if (this._isSlider(focussedIndex))
    {
      // the target has a slider -> disable select only if the slider is adjustable
      if (this.dataList.items[focussedIndex].allowAdjust)
      {
        fireSelect = false;
      }

      // reset currently active slider
      this._activeSlider = null;
    }

    if (this._isStep(focussedIndex))
    {
      params = {
        value: this.dataList.items[focussedIndex].value,
        finalAdjustment: true,
      };
    }

    /**
         * Trigger the currently selected button
         */
    if (this._isLock(focussedIndex))
    {
      const focussedButton = this._lockGetFocus(focussedIndex);
      const actionResult = this._lockActivate(focussedIndex, focussedButton);
      this._lockShowFocus(focussedIndex, 'clear');
      params = {additionalData: actionResult};
    }

    // prevent select on disabled items
    if (this.dataList.items[focussedIndex].disabled)
    {
      fireSelect = false;
    }

    // everything looks ok -> call internal _itemSelect() method if the item permits it
    if (fireSelect)
    {
      // fire select only if no long press / hold start has been issued
      if (!this._longPressIssued)
      {
        // produce beep
        this._beep('Short', 'Multicontroller');

        this._itemSelect(focussedIndex, params);
      }
      // otherwise fire holdStop Callback on shortAndHold items
      else if ('shortAndHold' === this.dataList.items[focussedIndex].itemBehavior)
      {
        this._itemHoldStop(focussedIndex);
      }
    }

    // lower long-press/hold-start flag
    this._longPressIssued = false;
  }
};

/**
 * Check whether the list can gain focus. In certain cases focus cannot be
 * shown (e.g. when there are no items available) or if it can gain it
 * it should be restored on the nearest available item if the one that
 * previously had focus is disabled.
 * TAG: internal
 * =========================
 * @param {MouseEvent|Number} - optional argument. If passed a check will be performed whether the target item is disabled
 * @return {integer} - the item that will have focus. If no item can have focus, return -1
 */
List2Ctrl.prototype._canGainFocus = function(e)
{
  // exit if we don't have any items
  if (!this.hasDataList())
  {
    return -1;
  }

  let itemToGainFocus = -1;

  // check if we are touching the element
  if (typeof e === 'object')
  {
    const targetItem = this._getTargetItem(e);

    // the item is enabled and can gain focus
    if (-1 !== targetItem && !this.dataList.items[targetItem].disabled)
    {
      itemToGainFocus = targetItem;
    }
    // the item is disabled -> find the closest enabled to it
    else
    {
      const nearestItem = this._getNearestEnabledItem(targetItem);
      itemToGainFocus = (null != nearestItem) ? nearestItem : -1;
    }
  }
  else if (typeof e === 'number')
  {
    if (-1 !== e && !this.dataList.items[e].disabled)
    {
      itemToGainFocus = e;
    }
    // the item is disabled -> find the closest enabled to it
    else
    {
      const nearestItem = this._getNearestEnabledItem(e);
      itemToGainFocus = (null != nearestItem) ? nearestItem : -1;
    }
  }
  // check whether this is called from the controllerActive event handler
  else if ('controllerActive' === e && this.properties.focussedItem > 0 && this.dataList.items[this.properties.focussedItem] && !this.dataList.items[this.properties.focussedItem].disabled)
  {
    itemToGainFocus = this.properties.focussedItem;
  }
  // check if last item with focus is disabled
  else if (this.dataList.items[this._lastItemWithFocus] && !this.dataList.items[this._lastItemWithFocus].disabled)
  {
    itemToGainFocus = this._lastItemWithFocus;
  }
  else
  {
    // show focus on the closest available item to the last with focus
    const nearestItem = this._getNearestEnabledItem(this._lastItemWithFocus);
    itemToGainFocus = (null != nearestItem) ? nearestItem : -1;

    // if we have tabs and no enabled items, always show focus on the first line allowing tabs navigation
    if (this.tabsCtrl && -1 === itemToGainFocus)
    {
      itemToGainFocus = this._topItem;
    }
  }

  return itemToGainFocus;
};

/**
 * Get focussed index
 * TAG: internal, helper
 * =========================
 * @return {integer}
 */
List2Ctrl.prototype._getFocussedIndex = function()
{
  let focussedIndex = this._lastItemWithFocus;

  for (let i=0; i<this.items.length; i++)
  {
    if (this.items[i].domElt.classList.contains('focus'))
    {
      focussedIndex = this.items[i].ref;
      break;
    }
  }

  return focussedIndex;
};

/**
 * Get relative focussed index
 * Relative index is what is visible on the screen
 * TAG: internal, helper
 * =========================
 * @return {integer}
 */
List2Ctrl.prototype._getRelativeFocussedIndex = function()
{
  let relativeIndex = null;

  // get real focussed index ...
  const currentFocussedIndex = this._getFocussedIndex();

  // ... and translate it to relative item index (zero-based)
  relativeIndex = currentFocussedIndex - this._topItem;

  // constraint it to the visible items
  relativeIndex = this.m.max(this.m.min(relativeIndex, this.properties.visibleItems), 0);

  return relativeIndex;
};

/**
 * Get focussed element
 * TAG: internal, helper
 * =========================
 * @return {HTML Element} - <LI>
 */
List2Ctrl.prototype._getFocussedElement = function()
{
  let focussedElement = null;
  const focussedIndex = this._getFocussedIndex();
  for (let i=0; i<this.items.length; i++)
  {
    if (this.items[i].ref == focussedIndex)
    {
      focussedElement = this.items[i].domElt;
      break;
    }
  }
  return focussedElement;
};

/**
 * Convert relative index (visible on the screen)
 * to its absolute representation in the dataList
 * TAG: internal, helper
 * =========================
 * @param {integer} - the relative index
 * @return {integer} - the real index
 */
List2Ctrl.prototype._relativeToRealIndex = function(relativeIndex)
{
  return relativeIndex + this._topItem;
};

/**
 * Convert real index of a dataList item to its
 * relative value (visible on the screen)
 * TAG: internal, helper
 * =========================
 * @param {integer} - the real index
 * @return {integer} - the relative index
 */
List2Ctrl.prototype._realToRelativeIndex = function(realIndex)
{
  return realIndex - this._topItem;
};

/**
 * Get nearest enabled item by direction
 * TAG: internal, helper
 * =========================
 * @param {integer} - from which item to search
 * @param {string} - where to look - above (up) or below (down) the item
 * @return {integer} - the next enabled item in the specified direction.
 *                     If nothing is found, return Null
 */
List2Ctrl.prototype._getNearestEnabledItemByDirection = function(fromItem, direction)
{
  const direction = (direction != 'up' && direction != 'down') ? 'down' : direction;
  let currentItem = ('down' === direction) ? fromItem+1 : fromItem-1;
  if (currentItem < 0 || currentItem >= this.dataList.itemCount)
  {
    currentItem = null;
  }
  else
  {
    while (this.dataList.items[currentItem].disabled)
    {
      if (currentItem >= this.dataList.itemCount-1 || currentItem <= 0)
      {
        // this is the end/beginning of the array -> nothing is found so return Null
        currentItem = null;
        break;
      }
      currentItem = ('down' === direction) ? currentItem+1 : currentItem-1;
    }
  }
  return currentItem;
};

/**
 * Get nearest enabled item in all directions
 * If there are two enabled items in both directions that are
 * at equal distances from the reference item, the one below is
 * returned.
 * TAG: internal, helper
 * =========================
 * @param {integer} - from which item to search
 * @return {integer} - the next enabled item.
 *                     If nothing is found, return Null
 */
List2Ctrl.prototype._getNearestEnabledItem = function(fromItem)
{
  let nearestEnabledItem = null;

  const nearestDown = this._getNearestEnabledItemByDirection(fromItem, 'down');
  const nearestUp = this._getNearestEnabledItemByDirection(fromItem, 'up');

  if (null === nearestDown === nearestUp)
  {
    // no enabled item is found
    nearestEnabledItem = null;
  }
  else if (null === nearestDown)
  {
    // nothing is found below -> return the one above
    nearestEnabledItem = nearestUp;
  }
  else if (null === nearestUp)
  {
    // nothing is found above -> return the one below
    nearestEnabledItem = nearestDown;
  }
  else
  {
    const differenceDown = this.m.abs(fromItem - nearestDown);
    const differenceUp = this.m.abs(fromItem - nearestUp);
    if (differenceDown === differenceUp)
    {
      // equally spaced -> return the one below
      nearestEnabledItem = nearestDown;
    }
    else
    {
      // differently spaced -> return the closer one
      nearestEnabledItem = (differenceDown < differenceUp) ? nearestDown : nearestUp;
    }
  }

  return nearestEnabledItem;
};

/**
 * Get secondary select status of an item
 * TAG: internal
 * =========================
 * @param {integer} - item index
 * @return {boolean} - whether the item has secondary multicontroller
 */
List2Ctrl.prototype._hasSecondaryMulticontroller = function(itemIndex)
{
  // exit if we don't have any items
  if (!this.hasDataList())
  {
    return false;
  }

  let hasSecondaryMulticontroller = false;

  const type = this.dataList.items[itemIndex].itemStyle;
  for (let i=0; i<this._secondaryMulticontrollerTypes.length; i++)
  {
    if (this._secondaryMulticontrollerTypes[i] == type)
    {
      hasSecondaryMulticontroller = true;
      break;
    }
  }

  return hasSecondaryMulticontroller;
};


/**
 * BEEP
 * Cause an audible beep to be played
 * TAG: internal
 * =========================
 * @param {String} Indicates a short press or a long press. Valid values are “Short” and “Long”.
 * @param {String} Indicates the user interaction that caused the beep. Valid values are “Touch”, “Multicontroller”, and “Hardkey”.
 * @return {void}
 */
List2Ctrl.prototype._beep = function(pressType, eventCause)
{
  // check for common API
  if (framework.common.beep && null != eventCause)
  {
    // call common Beep API
    return framework.common.beep(pressType, eventCause);
  }
};


/**
 * =========================
 * SCROLLING
 * 1. List scrolling
 * 2. List snapping
 * 3. List swiping and physics
 * =========================
 */

/** 1. LIST SCROLLING **/

/**
 * Scroll to a specific item
 * TAG: internal
 * =========================
 * @param {integer} - index of an item to scroll to
 * @param {integer} - scroll animation duration
 * @return {void}
 */
List2Ctrl.prototype._scrollTo = function(index, duration)
{
  let newPos = -(index) * this.properties.itemHeight; // calculate new position based on the item index
  newPos = this.m.max(this.m.min(newPos, 0), this._maxScrollY); // constrain it to scroll bounds
  this._performScroll(newPos, duration); // do the scroll
};

/**
 * Scroll down by one element
 * If the element that will be placed at the bottom
 * position is diabled, the list will be scrolled to
 * the nearest available enabled item
 * TAG: internal
 * =========================
 * @return {integer} - new position of the scroller in px
 */
List2Ctrl.prototype._scrollDownOne = function()
{
  let newPos = 0;

  // check whether we are in the bottom-most position
  if (this._topItem === this.dataList.itemCount - this.properties.visibleItems)
  {
    // we can't scroll down any more -> return current position
    newPos = this.scroller.offsetTop;
  }
  else
  {
    const bi = this._getNearestEnabledItemByDirection(this._topItem+this.properties.visibleItems-2, 'down');
    // do not scroll if no enabled items are found
    if (null != bi)
    {
      const newTopItem = bi + 2 - this.properties.visibleItems;
      newPos = -newTopItem * this.properties.itemHeight;
      newPos = this.m.max(newPos, this._maxScrollY); // constrain it to the max scroll
      this._performScroll(newPos); // do the scroll
    }
    else
    {
      newPos = this.scroller.offsetTop;
    }
  }

  // set scroll nature
  this._scrollNature = 'item';

  // return the new position
  return newPos;
};

/**
 * Scroll up by one element
 * If the element that will be placed at the top
 * position is disabled, the list will be scrolled to
 * the nearest available enabled item
 * TAG: internal
 * =========================
 * @return {integer} - new position of the scroller in px
 */
List2Ctrl.prototype._scrollUpOne = function()
{
  let newPos = 0;

  // check whether we are in the top-most position
  if (this._topItem === 0)
  {
    // we can't scroll up any more -> return current position
    newPos = this.scroller.offsetTop;
  }
  else
  {
    const bi = this._getNearestEnabledItemByDirection(this._topItem+1, 'up');
    // do not scroll if no enabled items are found
    if (null != bi)
    {
      const newTopItem = bi - 1;
      newPos = -newTopItem * this.properties.itemHeight;
      newPos = this.m.min(newPos, 0); // constrain it to the max scroll
      this._performScroll(newPos); // do the scroll
    }
    else
    {
      newPos = this.scroller.offsetTop;
    }
  }

  // set scroll nature
  this._scrollNature = 'item';

  // return the new position
  return newPos;
};

/**
 * Scroll down by one page (screen)
 * TAG: internal
 * =========================
 * @return {string} - paged | atlimit | onepage
 */
List2Ctrl.prototype._scrollDownPage = function()
{
  // get list position
  const listPosition = this._getListPosition();

  // set return status
  let returnStatus = 'onepage';

  // determine behavior by the list position
  switch (listPosition)
  {
    // we have only one page
    case 'onepage':
      returnStatus = 'onePage';
      break;

      // we are ate the bottom
    case 'bottom':
      // place focus on the last available item
      let nei = this._getNearestEnabledItemByDirection(this._topItem + this.properties.visibleItems, 'up');
      if (null != nei && nei >= this._topItem)
      {
        this._showFocus(nei);
      }

      // set return status
      returnStatus = 'atLimit';
      break;

      // we are close to the bottom
    case 'bottomclose':
      // search for enabled item in the bottom screen
      let nei = this._getNearestEnabledItemByDirection(this.dataList.itemCount - 1, 'up');
      if (null != nei && nei >= this.dataList.itemCount - this.properties.visibleItems)
      {
        // place focus on the last available item and scroll to the bottom
        this._showFocus(nei);
        this._scrollTo(this.dataList.itemCount - this.properties.visibleItems);

        // set scroll nature
        this._scrollNature = 'page';

        // set return status
        returnStatus = 'paged';
      }
      else
      {
        // set return status
        returnStatus = 'atLimit';
      }
      break;

      // we are somewhere else
    default:
      // get current relative focussed index
      const currentRelativeFocussedIndex = this._getRelativeFocussedIndex();

      // get future absolute focussed index
      const futureAbsoluteFocussedIndex = this.m.min(this._topItem + this.properties.visibleItems + currentRelativeFocussedIndex, this.dataList.itemCount-1);

      // check whether the future absolute focussed index is enabled
      if (!this.dataList.items[futureAbsoluteFocussedIndex].disabled)
      {
        // item is enabled -> we can page down
        let newPos = -(this._topItem + this.properties.visibleItems) * this.properties.itemHeight; // calculate new position
        newPos = this.m.max(newPos, this._maxScrollY); // constrain it to the max scroll
        this._performScroll(newPos); // do the scroll

        // place the focus on the future absolute focussed index
        this._showFocus(futureAbsoluteFocussedIndex);

        // set scroll nature
        this._scrollNature = 'page';

        // set return status
        returnStatus = 'paged';
      }
      else
      {
        // item is disabled -> search for nearest enabled item from the future top item down
        const nei = this._getNearestEnabledItemByDirection(this._topItem + this.properties.visibleItems, 'down');
        if (null != nei)
        {
          // we have found such item -> scroll down so it is in the same relative position
          this._scrollTo(nei - currentRelativeFocussedIndex);

          // place the focus on the enabled item
          this._showFocus(nei);

          // set scroll nature
          this._scrollNature = 'page';

          // set return status
          returnStatus = 'paged';
        }
        else
        {
          // no more enabled items -> set return status and do nothing
          returnStatus = 'atLimit';
        }
      }
      break;
  }

  return returnStatus;
};

/**
 * Scroll up by one page (screen)
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._scrollUpPage = function()
{
  // get list position
  const listPosition = this._getListPosition();

  // set return status
  let returnStatus = '';

  // determine behavior by the list position
  switch (listPosition)
  {
    // we have only one page
    case 'onepage':
      returnStatus = 'onePage';
      break;

      // we are ate the top
    case 'top':
      // place focus on the first available item
      let nei = this._getNearestEnabledItemByDirection(-1, 'down');
      if (null != nei && nei <= this.properties.visibleItems-1)
      {
        this._showFocus(nei);
      }

      // set return status
      returnStatus = 'atLimit';
      break;

      // we are close to the top
    case 'topclose':
      // search for enabled item in the top screen
      let nei = this._getNearestEnabledItemByDirection(0, 'down');
      if (null != nei && nei <= this.properties.visibleItems-1)
      {
        // place focus on the last available item and scroll to the top
        this._showFocus(nei);
        this._scrollTo(0);

        // set scroll nature
        this._scrollNature = 'page';

        // set return status
        returnStatus = 'paged';
      }
      else
      {
        // set return status
        returnStatus = 'atLimit';
      }
      break;

      // we are somewhere else
    default:
      // get current relative focussed index
      const currentRelativeFocussedIndex = this._getRelativeFocussedIndex();

      // get future absolute focussed index
      const futureAbsoluteFocussedIndex = this.m.max(this._topItem - this.properties.visibleItems + currentRelativeFocussedIndex, 0);

      // check whether the future absolute focussed index is enabled
      if (!this.dataList.items[futureAbsoluteFocussedIndex].disabled)
      {
        // item is enabled -> we can page down
        let newPos = -(this._topItem - this.properties.visibleItems) * this.properties.itemHeight; // calculate new position
        newPos = this.m.min(newPos, 0); // constrain it to the min scroll
        this._performScroll(newPos); // do the scroll

        // place the focus on the future absolute focussed index
        this._showFocus(futureAbsoluteFocussedIndex);

        // set scroll nature
        this._scrollNature = 'page';

        // set return status
        returnStatus = 'paged';
      }
      else
      {
        // item is disabled -> search for nearest enabled item from the future bottom item up
        const nei = this._getNearestEnabledItemByDirection(this._topItem - this.properties.visibleItems, 'up');
        if (null != nei)
        {
          // we have found such item -> scroll down so it is in the same relative position
          this._scrollTo(nei - currentRelativeFocussedIndex);

          // place the focus on the enabled item
          this._showFocus(nei);

          // set scroll nature
          this._scrollNature = 'page';

          // set return status
          returnStatus = 'paged';
        }
        else
        {
          // no more enabled items -> set return status and do nothing
          returnStatus = 'atlimit';
        }
      }
      break;
  }

  return returnStatus;
};

/**
 * Scroll to the top
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._scrollTop = function()
{
  this._performScroll(0); // do the scroll
};

/**
 * Scroll to the bottom
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._scrollBottom = function()
{
  this._performScroll(this._maxScrollY); // do the scroll
};

/**
 * Do the actual scroll
 * TAG: internal
 * =========================
 * @param {integer} - new position of the scroller in px.
 * @param {duration} - duration of the scrolling animation
 * @return {void}
 */
List2Ctrl.prototype._performScroll = function(pos, duration)
{
  // if scrolling during loading is not allowed
  if (!this.properties.scrollingDuringLoading && this._inLoading)
  {
    return;
  }

  // if menu can be scrolled (it has enough list items)
  if (this._isScrollable)
  {
    // make it snappy
    const newPos = this._getSnapPosition(pos);

    // start animation
    this._animateScroll(pos, duration);
  }
};

/**
 * Animate the scroll
 * TAG: internal
 * =========================
 * @param {integer} - new position of the scroller in px.
 * @param {duration} - duration of the scrolling animation
 * @return {void}
 */
List2Ctrl.prototype._animateScroll = function(pos, time)
{
  if (time == undefined || time == null)
  {
    time = this.properties.swipeAnimationDuration;
  }

  if (null !== this.scrollerAnimationEndCallback)
  {
    // remove any redundant animationEnd listeners
    this.scroller.removeEventListener(this._VENDOR + 'TransitionEnd', this.scrollerAnimationEndCallback, false);
    this.scrollerAnimationEndCallback = null;
  }

  // animate scroller or directly call the animation end callback if the time is 0
  this.scroller.style[this._VENDOR + 'TransitionDuration'] = time + 'ms';
  this.scrollerAnimationEndCallback = this._scrollerAnimationEnd.bind(this);
  this.scroller.addEventListener(this._VENDOR + 'TransitionEnd', this.scrollerAnimationEndCallback, false);
  this.scroller.style.top = pos + 'px';

  this._inScroll = false;
  if (time > 0)
  {
    this._inScroll = true;
  }

  // set top item and update display
  this._updateScrollIndicator(pos, time);
  this._setTopListItem(pos);
  this._updateRange();
};

/**
 * Abort any ongoing scroll and reset any flags
 * TAG: touch-only, internal
 * =========================
 * @param {MouseEvent}
 * @return {void}
 */
List2Ctrl.prototype._abortScroll = function(e)
{
  // aborting scroll is possible only while the list is scrolling
  if (false === this._inScroll)
  {
    return;
  }

  // get target item
  const targetItem = this._getTargetItem(e);

  // check if target item is enabled
  if (this.dataList.items[targetItem] && !this.dataList.items[targetItem].disabled)
  {
    // show focus there
    this._showFocus(targetItem, true, false, true);
  }
  else
  {
    // restore focus
    this._restoreFocus();
  }

  // get current snapped position
  const snapPos = this._getSnapPosition(this.scroller.offsetTop);
  this._animateScroll(snapPos, 0);

  // reset any touch flags
  this._inDrag = false;
  this._inScroll = false;
  this._scrollNature = null;
  this._inHorizontalDrag = null;
  this._hDragItem = null;
  this._stopSelect = false;
  this._startTime = 0;
  this._startItem = null;
  this._startDOMItem = null;
  this._activeSlider = null;
  this._startY = 0;
  this._startX = 0;
};


/** 2. LIST SNAPPING **/

/**
 * Get snap position depending on the new scroller position
 * TAG: internal
 * =========================
 * @param {integer} - new position of the scroller in px.
 * @return {integer} - position snapped to the nearest item edge
 */
List2Ctrl.prototype._getSnapPosition = function(pos)
{
  return this.properties.itemHeight * (Math.round(pos / this.properties.itemHeight));
};

/**
 * Get snap (above) position depending on the new scroller position
 * TAG: internal
 * =========================
 * @param {integer} - new position of the scroller in px.
 * @return {integer} - position snapped to the nearest above item edge
 */
List2Ctrl.prototype._getSnapPositionAbove = function(pos)
{
  return this.properties.itemHeight * (Math.floor(pos / this.properties.itemHeight));
};

/**
 * Scroll list to an even snap position
 * TAG: internal
 * =========================
 * @param {integer} - new position of the scroller in px.
 * @return {void}
 */
List2Ctrl.prototype._snap = function(pos)
{
  // the snap position is the same as the current
  if (pos == this._y)
  {
    return;
  }

  // the user has reached the end of the list and there will be no animation
  if (pos == this._maxScrollY)
  {
    // set top item and bring focus on the screen
    this._setTopListItem(pos);
    const focussedIndex = this._getFocussedIndex();
    if (focussedIndex < this._topItem)
    {
      this._restoreFocus();
    }
    return;
  }
  else if (pos === this._minScrollY)
  {
    // set top item and bring focus on the screen
    this._setTopListItem(pos);
    const focussedIndex = this._getFocussedIndex();
    if (focussedIndex > this._topItem + this.properties.visibleItems - 1)
    {
      this._restoreFocus();
    }
    return;
  }

  const snapPos = this._getSnapPosition(pos);

  // start animation
  this._animateScroll(snapPos);
};

/** 3. LIST SWIPING AND PHYSICS **/

/**
 * Perform swipe based on physics definition
 * TAG: touch-only, internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._startSwipe = function(distance, time)
{
  // physics calculations
  const momentumY = this._momentum(distance, time, -this._y, this._maxScrollY < 0 ? this._scrollerH - this._maskH + this._y - this._minScrollY : 0, 0);

  /* ANIMATE THE SCROLLER */
  let newPos = this.m.min(this.m.max(this._y + momentumY.dist, this._maxScrollY), 0);
  const swipeDuration = momentumY.time;

  // make it snappy
  newPos = this._getSnapPosition(newPos);

  // start animation
  if (!isNaN(newPos) && newPos !== this.scroller.offsetTop) // only if newPos is a number and the list is worth scrolling
  {
    this._animateScroll(newPos, swipeDuration);
  }
  else
  {
    // set top item and bring focus on the screen
    this._setTopListItem(newPos);
    const focussedIndex = this._getFocussedIndex();
    if (focussedIndex < this._topItem)
    {
      this._restoreFocus();
    }
  }
};

/**
 * Perform swipe based on physics definition
 * TAG: touch-only, internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._startSwipeIndex = function(distance, time)
{
  // physics calculations
  const momentumY = this._momentum(distance, time, -this._yIndex, this._maxScrollYIndex < 0 ? this._scrollerHIndex - this._maskH + this._yIndex - this._minScrollYIndex : 0, 0);

  /* ANIMATE THE LETTER INDEX SCROLLER */
  let newPos = this.m.min(this.m.max(this._yIndex + momentumY.dist, this._maxScrollYIndex), 0);
  const swipeDuration = momentumY.time;

  // make it snappy
  newPos = this._getIndexSnapPosition(newPos);

  // start animation
  if (!isNaN(newPos) && newPos !== this.letterIndex.offsetTop) // only if newPos is a number and the letter index is worth scrolling
  {
    // start animation
    this._animateLetterIndex(newPos, swipeDuration);
  }
  else
  {
    // set top letter index and bring focus on the screen
    this._setTopLetterIndex(newPos);
    const focussedLetterIndex = this._getFocussedLetterIndex();
    if (focussedLetterIndex < this._topLetterIndex)
    {
      this._showFocusLetterIndex(this._topLetterIndex);
    }
  }
};

/**
 * @param {integer} - dragged distance
 * @param {time} - time dragged
 * @param {integer} - this._y
 * @param {integer} - this._maxScrollY < 0 ? this._scrollerH - this._maskH + this._y - this._minScrollY : 0
 * @param {integer} - 0
 */
List2Ctrl.prototype._momentum = function(dist, time, maxDistUpper, maxDistLower, size)
{
  const deceleration = this.properties.deceleration;
  let speed = this.m.abs(dist) / time;
  let newDist = (speed * speed) / (2 * deceleration);
  let newTime = 0; let outsideDist = 0;

  // Proportinally reduce speed if we are outside of the boundaries
  if (dist > 0 && newDist > maxDistUpper) {
    outsideDist = size / (6 / (newDist / speed * deceleration));
    maxDistUpper = maxDistUpper + outsideDist;
    speed = speed * maxDistUpper / newDist;
    newDist = maxDistUpper;
  } else if (dist < 0 && newDist > maxDistLower) {
    outsideDist = size / (6 / (newDist / speed * deceleration));
    maxDistLower = maxDistLower + outsideDist;
    speed = speed * maxDistLower / newDist;
    newDist = maxDistLower;
  }

  newDist = newDist * (dist < 0 ? -1 : 1);
  newTime = speed / deceleration;

  return {dist: newDist, time: Math.round(newTime)};
};


/**
 * =========================
 * LETTER INDEX
 * =========================
 */

/**
 * Letter index select
 * scrolls list to letter index
 * TAG: internal
 * =========================
 * @param {integer} - the new position of the scroller in element index.
 * @return {void}
 */
List2Ctrl.prototype._letterIndexSelect = function(letterIndex, eventCause)
{
  // check for letter index and letter index data
  if (!this.properties.hasLetterIndex || !this.letterIndexData.length)
  {
    return;
  }

  // check if if letterIndex is a valid index
  if (letterIndex < 0 || letterIndex >= this.letterIndexData.length)
  {
    return;
  }

  // check for disabled letter index (no valid item index)
  if (this.letterIndexData[letterIndex].disabled)
  {
    return;
  }

  // set scroll nature
  this._scrollNature = 'letterIndex';

  // all seems fine -> scroll
  this._scrollTo(this.letterIndexData[letterIndex].itemIndex - 1);

  // set letter index active position
  this._setLetterIndexPosition(this.letterIndexData[letterIndex].itemIndex);

  // update last item with focus so that focus gets restored in the correct place
  this._lastItemWithFocus = this.letterIndexData[letterIndex].itemIndex;

  // set proper event cause
  const eventCause = ('Multicontroller' != eventCause && 'Touch' != eventCause) ? null : eventCause;
  // produce beep
  this._beep('Short', eventCause);

  // dispatch letter select event
  const eventData = {
    index: letterIndex,
    label: this.letterIndexData[letterIndex].label,
    itemIndex: this.letterIndexData[letterIndex].itemIndex,
  };
  this._listEvent(this._EVENTS.LETTER_SELECT, eventData);
};

/**
 * Schedule letter index select after some time
 * TAG: internal
 * =========================
 * @param {integer} - the letter index
 * @param {boolean} - clear any timeouts without scheduling a new one
 * @return {void}
 */
List2Ctrl.prototype._scheduleLetterIndexSelect = function(letterIndex, clear)
{
  // check for letter index and letter index data
  if (!this.properties.hasLetterIndex || !this.letterIndexData.length)
  {
    return;
  }

  // clear previous timeout
  clearTimeout(this._indexSelectTimeoutId);
  this._indexSelectTimeoutId = null;

  if (!clear)
  {
    // if no letter index is passed, get the currently focussed one
    if (undefined === letterIndex)
    {
      // check whether we already have focussed letter index
      const focussedLetterIndex = this._getFocussedLetterIndex();
      if (null != focussedLetterIndex)
      {
        // if yes, schedule to that one
        letterIndex = focussedLetterIndex;
      }
    }

    // set scroll timeout
    this._indexSelectTimeoutId = setTimeout(function() {
      this._letterIndexSelect(letterIndex);
    }.bind(this), this.properties.letterIndexSelectTimeout);
  }
};

/**
 * Schedule background letter index select after some time.
 * Background select occurs without affecting the letter index
 * scroll position. This is intended to be used only programatically.
 * TAG: internal
 * =========================
 * @param {integer} - the letter index
 * @param {boolean} - clear any timeouts without scheduling a new one
 * @return {void}
 */
List2Ctrl.prototype._scheduleBackgroundLetterIndexSelect = function(letterIndex, clear)
{
  // check for letter index and letter index data
  if (!this.properties.hasLetterIndex || !this.letterIndexData.length)
  {
    return;
  }
  // check for a valid letter index item
  if (letterIndex < 0 || letterIndex >= this.letterIndexData.length)
  {
    log.warn('List2: a valid letter index expected. Letter index passed": ' + letterIndex);
    return;
  }
  // check for disabled letter index (no valid item index)
  if (this.letterIndexData[letterIndex].disabled)
  {
    return;
  }
  // clear previous timeout
  clearTimeout(this._indexSelectTimeoutId);
  this._indexSelectTimeoutId = null;
  if (!clear)
  {
    // activate the new index
    this._setCurrentLetterIndex(letterIndex);
    // set scroll timeout
    this._indexSelectTimeoutId = setTimeout(function() {
      // set scroll nature
      this._scrollNature = 'letterIndex';
      // all seems fine -> scroll
      this._scrollTo(this.letterIndexData[letterIndex].itemIndex - 1);
    }.bind(this), this.properties.letterIndexSelectTimeout);
  }
};
/**
 * Animate the letter index
 * TAG: internal
 * =========================
 * @param {integer} - new position of the letter index in px.
 * @param {integer} - duration of the scrolling animation
 * @return {void}
 */
List2Ctrl.prototype._animateLetterIndex = function(pos, time)
{
  if (time == undefined || time == null)
  {
    time = this.properties.swipeAnimationDuration;
  }

  // animate letter index
  this.letterIndex.style[this._VENDOR + 'TransitionDuration'] = time + 'ms';
  this.letterIndexAnimationEndCallback = this._letterIndexAnimationEnd.bind(this);
  this.letterIndex.addEventListener(this._VENDOR + 'TransitionEnd', this.letterIndexAnimationEndCallback, false);
  this.letterIndex.style.top = pos + 'px';

  // set top letter index
  this._setTopLetterIndex(pos);
};

/**
 * Set top letter index item depending on the position
 * TAG: internal
 * =========================
 * @param {integer} - position in px at which the letter should be
 * @return {void}
 */
List2Ctrl.prototype._setTopLetterIndex = function(pos)
{
  // pos should be number for proper topLetterIndex calculation
  if (!isNaN(pos))
  {
    this._prevTopLetterIndex = this._topLetterIndex;
    this._topLetterIndex = -(Math.round(pos / this.properties.letterIndexHeight));
  }
};

/**
 * Get snap position of letter index
 * depending on the new letter index position
 * TAG: internal
 * =========================
 * @param {integer} - new position of the letter index in px.
 * @return {integer} - position snapped to the nearest item edge
 */
List2Ctrl.prototype._getIndexSnapPosition = function(pos)
{
  return this.properties.letterIndexHeight * (Math.round(pos / this.properties.letterIndexHeight));
};

/**
 * Scroll letter index to an even snap position
 * TAG: internal
 * =========================
 * @param {integer} - new position of the letter index in px.
 * @return {void}
 */
List2Ctrl.prototype._snapIndex = function(pos)
{
  // the snap position is the same as the current
  if (pos == this._yIndex)
  {
    return;
  }

  // the user has reached the end of the list and there will be no animation
  if (pos == this._maxScrollYIndex)
  {
    // set top item and bring focus on the screen
    this._setTopLetterIndex(pos);
    const focussedIndex = this._getFocussedLetterIndex();
    if (focussedIndex < this._topLetterIndex)
    {
      this._restoreLetterIndexFocus();
    }
    return;
  }

  const snapPos = this._getIndexSnapPosition(pos);

  // start animation
  this._animateLetterIndex(snapPos);
};

/**
 * Scroll to a specific index item
 * TAG: internal
 * =========================
 * @param {integer | string} - letter or letter index
 * @return {void}
 */
List2Ctrl.prototype._scrollToIndex = function(letter)
{
  // check for letter index
  if (!this.properties.hasLetterIndex)
  {
    return false;
  }

  let targetIndex = -1;

  if (!isNaN(letter))
  {
    // we are going to a letter index
    targetIndex = this.m.max(this.m.min(letter, this.letterIndexData.length-1), 0); // constrain the index
  }
  else if (typeof letter === 'string');
  {
    // we are searching for the letter index of the letter
    for (let i=0, l=this.letterIndexData.length; i<l; i++)
    {
      if (this.letterIndexData[i].label === letter)
      {
        targetIndex = i;
        break;
      }
    }
  }

  // check where's the new index -> above or below the visible range
  // NOTE: if the letter is within the visible range this should not get called at all
  if (-1 != targetIndex && targetIndex >= this._topLetterIndex + this.properties.visibleLetterIndexItems)
  {
    // look below -> find closest target index so that the focus is visible and apply target index correction
    targetIndex = targetIndex - this.properties.visibleLetterIndexItems + 1;
  }
  else if (-1 != targetIndex && targetIndex <= this._topLetterIndex)
  {
    // look above -> find closest target index so that the focus is visible
    // correction: the taget index is the top item whereas the item in question is the second one
    targetIndex--;
  }
  else
  {
    // we don't scroll if the target is visible
    return;
  }

  // do the scroll
  let newPos = -(targetIndex) * this.properties.letterIndexHeight; // calculate new position
  newPos = this.m.max(this.m.min(newPos, this._minScrollYIndex), this._maxScrollYIndex); // constrain it to scroll bounds
  this._animateLetterIndex(newPos); // start animation
};

/**
 * Scroll down by one or more index elements
 * TAG: internal
 * =========================
 * @return {integer} - new position of the letter index in px
 */
List2Ctrl.prototype._scrollDownOneIndex = function()
{
  let newPos = 0;

  // check whether we are in the bottom-most position
  if (this._topLetterIndex === this.letterIndexData.length - this.properties.visibleLetterIndexItems)
  {
    // we can't scroll down any more -> return current position
    newPos = this.letterIndex.offsetTop;
  }
  else
  {
    const bi = this._getNearestEnabledLetterByDirection(this._topLetterIndex+this.properties.visibleLetterIndexItems-2, 'down');
    // do not scroll if no enabled letters are found
    if (null != bi)
    {
      const newTopLetter = bi + 2 - this.properties.visibleLetterIndexItems;
      newPos = -newTopLetter * this.properties.letterIndexHeight;
      newPos = this.m.max(newPos, this._maxScrollYIndex); // constrain it to the max scroll
      this._animateLetterIndex(newPos); // do the scroll
    }
    else
    {
      newPos = this.letterIndex.offsetTop;
    }
  }

  // return the new position
  return newPos;
};

/**
 * Scroll up by one or more index elements
 * TAG: internal
 * =========================
 * @return {integer} - new position of the letter index in px
 */
List2Ctrl.prototype._scrollUpOneIndex = function()
{
  let newPos = 0;

  // check whether we are in the top-most position
  if (this._topLetterIndex === 0)
  {
    // we can't scroll up any more -> return current position
    newPos = this.letterIndex.offsetTop;
  }
  else
  {
    const bi = this._getNearestEnabledLetterByDirection(this._topLetterIndex+1, 'up');
    // do not scroll if no enabled items are found
    if (null != bi)
    {
      const newTopLetter = bi - 1;
      newPos = -newTopLetter * this.properties.letterIndexHeight;
      newPos = this.m.min(newPos, this._minScrollYIndex); // constrain it to the min scroll
      this._animateLetterIndex(newPos); // do the scroll
    }
    else
    {
      newPos = this.letterIndex.offsetTop;
    }
  }

  // return the new position
  return newPos;
};

/**
 * Set letter index position relative to the
 * focussed item in the scroller
 * TAG: internal
 * =========================
 * @param {integer}
 * @return {void}
 */
List2Ctrl.prototype._setLetterIndexPosition = function(index)
{
  // check for letter index
  if (!this.properties.hasLetterIndex || !this.letterIndexData.length)
  {
    return false;
  }

  // get focussed item
  let focussedIndex;
  if (!isNaN(index))
  {
    focussedIndex = index;
  }
  else
  {
    focussedIndex = this._getFocussedIndex();
  }

  // get the new index
  let targetIndex = -1;
  for (let i=this._letterIndexDataSorted.length-1; i>=0; i--)
  {
    if (focussedIndex >= this._letterIndexDataSorted[i].itemIndex)
    {
      targetIndex = this._letterIndexDataSorted[i].publicIndex;
      break;
    }
  }

  // show focus on target index
  if (targetIndex > -1)
  {
    this._setCurrentLetterIndex(targetIndex);
  }

  // check if letter index scrolling is needed
  if (targetIndex >= this._topLetterIndex && targetIndex < this._topLetterIndex + this.properties.visibleLetterIndexItems)
  {
    return;
  }

  // scroll to target index
  if (targetIndex > -1)
  {
    this._scrollToIndex(targetIndex);
  }
};

/**
 * Set currently active letter index
 * TAG: internal
 * =========================
 * @param {integer} - letter item index
 * @return {integer} - the currently active letter index
 */
List2Ctrl.prototype._setCurrentLetterIndex = function(letter)
{
  // check for letter index
  if (!this.properties.hasLetterIndex)
  {
    return null;
  }

  const targetIndex = this.m.max(this.m.min(letter, this.letterIndexData.length-1), 0); // constrain the index


  // remove any previously active letter index
  for (let i=0, l=this.letterIndexData.length; i<l; i++)
  {
    this.letterIndexData[i].domElt.classList.remove('active');
  }

  // set new active letter index
  this.letterIndexData[targetIndex].domElt.classList.add('active');

  // return the currently active letter index
  return targetIndex;
};


/**
 * Get currently active letter index
 * TAG: internal
 * =========================
 * @return {integer} - the currently active letter index
 */
List2Ctrl.prototype._getCurrentLetterIndex = function()
{
  let activeLetterIndex = null;

  // remove any previously active letter index
  for (let i=0, l=this.letterIndexData.length; i<l; i++)
  {
    if (this.letterIndexData[i].domElt.classList.contains('active'))
    {
      activeLetterIndex = i;
      break;
    }
  }

  return activeLetterIndex;
};


/**
 * Show focus highlight on letter index item
 * TAG: internal
 * =========================
 * @param {integer | string} - letter or letter item index
 * @return {integer} - the focussed letter index
 */
List2Ctrl.prototype._showFocusLetterIndex = function(letter)
{
  // check for letter index
  if (!this.properties.hasLetterIndex)
  {
    return;
  }

  if (!this._hasFocus)
  {
    return;
  }

  // get the last focussed element
  let lastFocussedIndex = this._getFocussedLetterIndex();

  // if we don't have previous focus, select the topmost
  if (lastFocussedIndex == null)
  {
    lastFocussedIndex = this._topLetterIndex;
  }

  let targetIndex = -1;
  if (!isNaN(letter))
  {
    // we are setting focus on a letter index
    targetIndex = this.m.max(this.m.min(letter, this.letterIndexData.length), 0); // constrain the index
  }
  else if (typeof letter === 'string');
  {
    switch (letter)
    {
      case 'down':
        // we are searching for next index
        targetIndex = lastFocussedIndex;
        while (targetIndex < this.letterIndexData.length-1)
        {
          targetIndex++;
          if (-1 != this.letterIndexData[targetIndex].itemIndex)
          {
            break;
          }
          else if (targetIndex >= this.letterIndexData.length-1)
          {
            // nothing is found, return the old one
            targetIndex = lastFocussedIndex;
            break;
          }
        }
        break;

      case 'up':
        // we are searching for the previous
        targetIndex = lastFocussedIndex;
        while (targetIndex > 0)
        {
          targetIndex--;
          if (-1 != this.letterIndexData[targetIndex].itemIndex)
          {
            break;
          }
          else if (targetIndex <= 0)
          {
            // nothing is found, return the old one
            targetIndex = lastFocussedIndex;
            break;
          }
        }
        break;

      default:
        // we are searching for the index of the letter
        for (let i=0, l=this.letterIndexData.length; i<l; i++)
        {
          if (this.letterIndexData[i].label === letter)
          {
            targetIndex = i;
            break;
          }
        }
        break;
    }
  }

  // ensure that target index is within range
  targetIndex = this.m.max(this.m.min(targetIndex, this.letterIndexData.length-1), 0);

  if (-1 != targetIndex)
  {
    // hide previous focus and show the new one
    this._hideFocusLetterIndex();
    this.letterIndexData[targetIndex].domElt.classList.add('focus');

    // clear any scheduled letter index select
    this._scheduleLetterIndexSelect(null, true);
  }

  return targetIndex;
};

/**
 * Hide focus highlight from letter index
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._hideFocusLetterIndex = function()
{
  for (let i=0, l=this.letterIndexData.length; i<l; i++)
  {
    this.letterIndexData[i].domElt.classList.remove('focus');
  }
};

/**
 * Get focussed letter index
 * TAG: internal, helper
 * =========================
 * @return {integer}
 */
List2Ctrl.prototype._getFocussedLetterIndex = function()
{
  let focussedIndex = null;
  for (let i=0, l=this.letterIndexData.length; i<l; i++)
  {
    if (this.letterIndexData[i].domElt.classList.contains('focus'))
    {
      focussedIndex = i;
      break;
    }
  }
  return focussedIndex;
};

/**
 * Get relative focussed index
 * Relative index is what is visible on the screen
 * TAG: internal, helper
 * =========================
 * @return {integer}
 */
List2Ctrl.prototype._getRelativeFocussedLetterIndex = function()
{
  let relativeIndex = null;

  // get real focussed index ...
  const currentFocussedIndex = this._getFocussedLetterIndex();

  // ... and translate it to relative item index (zero-based)
  relativeIndex = currentFocussedIndex - this._topLetterIndex;

  // constraint it to the visible items
  relativeIndex = this.m.min(relativeIndex, this.properties.visibleLetterIndexItems);

  return relativeIndex;
};

/**
 * Get nearest enabled letter by direction
 * TAG: internal, helper
 * =========================
 * @param {integer} - from which letter to search
 * @param {string} - where to look - above (up) or below (down) the letter
 * @return {integer} - the next enabled letter in the specified direction.
 *                     If nothing is found, return Null
 */
List2Ctrl.prototype._getNearestEnabledLetterByDirection = function(fromLetter, direction)
{
  const direction = (direction != 'up' && direction != 'down') ? 'down' : direction;
  let currentLetter = ('down' === direction) ? fromLetter+1 : fromLetter-1;
  const letterIndexCount = this.letterIndexData.length;
  if (currentLetter < 0 || currentLetter >= letterIndexCount)
  {
    currentLetter = null;
  }
  else
  {
    while (this.letterIndexData[currentLetter].disabled)
    {
      if (currentLetter >= letterIndexCount-1 || currentLetter <= 0)
      {
        // this is the end/beginning of the array -> nothing is found so return Null
        currentLetter = null;
        break;
      }
      currentLetter = ('down' === direction) ? currentLetter+1 : currentLetter-1;
    }
  }
  return currentLetter;
};

/**
 * Exit hit state of the currently hit index item
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._indexRemoveHit = function()
{
  for (let i=0, l=this.letterIndexData.length; i<l; i++)
  {
    this.letterIndexData[i].domElt.classList.remove('hit');
  }
};

/**
 * Enter into hit state of an index item
 * TAG: touch-only, internal
 * =========================
 * @param {event} - raw touch/mouse event
 * @return {integer} - index of the hit index item
 */
List2Ctrl.prototype._indexMakeHit = function(e)
{
  let letterIndex = -1;

  // the parameter is an event
  if (typeof e == 'object')
  {
    // determine target item
    letterIndex = this._getTargetLetterIndex(e);
  }
  // the parameter is an index
  else if (!isNaN(e))
  {
    letterIndex = e;
  }

  // do not make hit during loading
  if (this._inLoading)
  {
    return;
  }

  // only valid index items can become 'hit'
  if (letterIndex == -1)
  {
    return;
  }

  // do not make hit disabled items
  if (this.letterIndexData[letterIndex].disabled)
  {
    return;
  }

  // apply 'hit' class
  this.letterIndexData[letterIndex].domElt.classList.add('hit');
  this._showFocusLetterIndex(letterIndex);

  return letterIndex;
};


/**
 * =========================
 * ANIMATION END CALLBACKS
 * =========================
 */

/**
 * Scroller animation end callback
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._scrollerAnimationEnd = function()
{
  this.scroller.style[this._VENDOR + 'TransitionDuration'] = '0ms';
  this.scroller.removeEventListener(this._VENDOR + 'TransitionEnd', this.scrollerAnimationEndCallback, false);
  this.scrollerAnimationEndCallback = null;

  // if we are in list reorder -> bring back reorder item
  if (this._inListReorder && this._reorderTouchElt)
  {
    this._bringReorderItem();
  }

  // Focus adjust after animation ends

  // get list position
  let listPosition = null;
  if (0 === this._topItem)
  {listPosition = 'top';}
  else if (this._topItem === this.dataList.itemCount - this.properties.visibleItems)
  {listPosition = 'bottom';}
  else
  {listPosition = 'middle';}

  // get scroll direction
  let scrollDirection = null;
  if (this._prevTopItem > this._topItem)
  {scrollDirection = 'up';}
  else if (this._prevTopItem < this._topItem)
  {scrollDirection = 'down';}
  else
  {scrollDirection = 'none';}

  // get scroll size
  const scrollSize = this.m.abs(this._prevTopItem - this._topItem);

  if ('page' === this._scrollNature)
  {
    // do not place focus, it should have been done by the paging function
  }
  else if ('item' === this._scrollNature)
  {
    // show focus
    this._showFocus(this._lastItemWithFocus, true);
  }
  else
  {
    // check if focussed index is outside the screen and we actually have a scroll
    if (scrollSize > this.properties.visibleItems-1 && !this._inLetterIndexMulticontroller)
    {
      // restore focus
      this._restoreFocus();
    }
    else if (scrollSize > 0 && !this._inLetterIndexMulticontroller)
    {
      // check if the focus is just slightly outside the visible range
      if (this._lastItemWithFocus < this._topItem || this._lastItemWithFocus >= this._topItem + this.properties.visibleItems)
      {
        // restore focus
        this._restoreFocus();
      }
      else
      {
        // else the focus remains on the screen -> only set letter index position
        this._setLetterIndexPosition(this._getFocussedIndex());
      }
    }
    else
    {
      // we don't have a scroll -> nothing to do here
    }
  }

  // lower _inScroll flag
  this._inScroll = false;

  // reset scroll nature
  this._scrollNature = null;

  // dispatch scroll end event
  this._listEvent(this._EVENTS.SCROLL_END, {scrollPosition: this._topItem});
};

/**
 * Restore focus after it has been left off screen.
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._restoreFocus = function()
{
  // check if the top item is enabled
  if (!this.dataList.items[this._topItem].disabled)
  {
    this._showFocus(this._topItem, false, false, true);
  }
  // top item is disabled, find the nearest enabled item below the top one
  else
  {
    const neiDown = this._getNearestEnabledItem(this._topItem, 'down');
    // check if the item is on screen
    if (null != neiDown && neiDown >= this._topItem && neiDown < this._topItem + this.properties.visibleItems)
    {
      this._showFocus(neiDown, true, false, true);
    }
    // there's no enabled item or it is off screen
    else
    {
      this._showFocus(this._topItem, false, false, true);
    }
  }
};

/**
 * Scroll indicator animation end callback
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._scrollIndicatorAnimationEnd = function()
{
  this.scrollIndicator.style[this._VENDOR + 'TransitionDuration'] = '0ms';
  this.scrollIndicator.removeEventListener(this._VENDOR + 'TransitionEnd', this.scrollIndicatorAnimationEndCallback, false);
  this.scrollIndicatorAnimationEndCallback = null;

  // fadeOut scroll indicator
  this._fadeOutScrollIndicator();
};

/**
 * Letter index animation end callback
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._letterIndexAnimationEnd = function()
{
  // remove animation end callbacks
  this.letterIndex.style[this._VENDOR + 'TransitionDuration'] = '0ms';
  this.letterIndex.removeEventListener(this._VENDOR + 'TransitionEnd', this.letterIndexAnimationEndCallback, false);
  this.letterIndexAnimationEndCallback = null;

  // restore focus
  const focussedLetterIndex = this._getFocussedLetterIndex();
  if (null != focussedLetterIndex && (focussedLetterIndex < this._topLetterIndex || focussedLetterIndex > this._topLetterIndex + this.properties.visibleLetterIndexItems - 1))
  {
    // focus is off screen
    this._restoreLetterIndexFocus();
  }
  else if (null != focussedLetterIndex)
  {
    // schedule letter index select if letter is enabled
    if (!this.letterIndexData[focussedLetterIndex].disabled)
    {
      this._scheduleLetterIndexSelect(focussedLetterIndex);
    }
  }
};

/**
 * Restore letter index focus after it has been left off screen.
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._restoreLetterIndexFocus = function()
{
  // check if the top letter index is enabled
  if (!this.letterIndexData[this._topLetterIndex].disabled)
  {
    // show focus on the top letter
    this._showFocusLetterIndex(this._topLetterIndex);

    // schedule letter index select
    this._scheduleLetterIndexSelect(this._topLetterIndex);
  }
  else
  {
    // look for enabled item down and up
    const neiDown = this._getNearestEnabledLetterByDirection(this._topLetterIndex, 'down');
    const neiUp = this._getNearestEnabledLetterByDirection(this._topLetterIndex, 'up');
    // determine scroll direction
    const scrollDirection = (this._topLetterIndex - this._prevTopLetterIndex < 0) ? 'up' : 'down';

    // check whether we have an enabled item on screen
    if (null != neiDown && neiDown >= this._topLetterIndex && neiDown < this._topLetterIndex + this.properties.visibleLetterIndexItems)
    {
      // there is an enabled item on screen -> place the focus there
      this._showFocusLetterIndex(neiDown);
      // schedule letter index select
      this._scheduleLetterIndexSelect(neiDown);
    }
    else if ('down' === scrollDirection)
    {
      // we are scrolling down -> look for enabled item up
      if (null != neiUp)
      {
        // show focus on the top letter
        this._showFocusLetterIndex(this._topLetterIndex);

        // schedule background letter index select
        this._scheduleBackgroundLetterIndexSelect(neiUp);
      }
      else
      {
        // show focus on the top letter
        this._showFocusLetterIndex(this._topLetterIndex);
      }
    }
    else if ('up' === scrollDirection)
    {
      // we are scrolling up -> look for enabled item down
      if (null != neiDown)
      {
        // show focus on the top letter
        this._showFocusLetterIndex(this._topLetterIndex);
        // schedule background letter index select
        this._scheduleBackgroundLetterIndexSelect(neiDown);
      }
      else
      {
        // show focus on the top letter
        this._showFocusLetterIndex(this._topLetterIndex);
      }
    }
  }
};


/**
 * =========================
 * SLIDERS AND TOGGLE CONTROL
 * =========================
 */

/**
 * Passes START (mousedown) event to the currently
 * targeted slider instance and returns it.
 * TAG: internal
 * =========================
 * @param {MouseEvent}
 * @param {Boolean}
 * @return {SliderCtrl}
 */
List2Ctrl.prototype._slideStart = function(e, skipActiveSlider)
{
  // determine target item
  const itemIndex = this._getTargetItem(e);

  // only valid list items are allowed
  if (itemIndex == -1)
  {
    return;
  }

  // do not slide disabled items
  if (this.dataList.items[itemIndex].disabled)
  {
    return;
  }

  // determine if sliding is reasonable for the target item (i.e. the item is 'slidable')
  if (!this._isSlider(itemIndex))
  {
    // this is not a slider -> exit
    return;
  }

  // check if slider can be adjusted
  if (!this.dataList.items[itemIndex].allowAdjust)
  {
    return;
  }

  // check if we are in the hittable area
  if (!this._hasRightHittableArea(this.dataList.items[itemIndex]))
  {
    const relativeX = e.pageX - this._maskPositionX;
    const inHittable = false;
    const rightBoundary = this.properties.sliderReferencePointRight;
    const leftBoundary = this.properties.sliderReferencePointRight - this.properties.sliderWidth;
  }
  else if (this.dataList.items[itemIndex].indented)
  {
    const relativeX = e.pageX - (Math.ceil(this._maskPositionX / 1.5));
    const inHittable = false;
    const rightBoundary = this.properties.sliderReferencePointRight - (Math.ceil(this.properties.sliderWidth / 1.5)) + (this.properties.indentOffset * 2);
    const leftBoundary = this.properties.sliderReferencePointLeft;
  } else
  {
    const relativeX = e.pageX - (Math.ceil(this._maskPositionX / 1.5));
    const inHittable = false;
    const rightBoundary = this.properties.sliderReferencePointRight - (Math.ceil(this.properties.sliderWidth / 1.5));
    const leftBoundary = this.properties.sliderReferencePointLeft;
  }
  if (relativeX >= leftBoundary && relativeX <= rightBoundary)
  {
    inHittable = true;
  }

  if (!inHittable)
  {
    // we are outside the hittable area -> exit
    return;
  }

  const sliderInstance = this._getSlider(itemIndex);
  const skipActiveSlider = (true === skipActiveSlider);
  if (!skipActiveSlider)
  {
    // set currently active slider
    this._activeSlider = {
      itemIndex: itemIndex, // currently active slider index
      slider: sliderInstance, // currently active slider instance
    };

    // transition focus to slider and hide focus on the item
    this._activeSlider.slider.handleControllerEvent('acceptFocusFromTop');
    this._hideFocus();

    // pass the event to the SliderCtrl
    this._activeSlider.slider._onDownHandler(e);
  }

  return sliderInstance;
};

List2Ctrl.prototype._slideMove = function(e)
{
  // determine if we have an active slider
  if (!this._activeSlider)
  {
    return;
  }

  // determine target item
  const itemIndex = this._activeSlider.itemIndex;

  // do not slide disabled items
  if (this.dataList.items[itemIndex].disabled)
  {
    return;
  }

  // determine if sliding is reasonable for the target item (i.e. the item is 'slidable')
  if (!this._isSlider(itemIndex))
  {
    // this is not a slider -> exit
    return;
  }

  // pass the event to the SliderCtrl
  this._activeSlider.slider._onMoveHandler(e);
};

List2Ctrl.prototype._slideEnd = function(e)
{
  // determine if we have an active slider
  if (!this._activeSlider)
  {
    const sliderInstance = this._slideStart(e, true);
    if (sliderInstance && !this._stopSelect)
    {
      // pass the event to the SliderCtrl
      sliderInstance._onDownHandler(e);
      sliderInstance._onUpHandler(e);
    }
    return;
  }
  else
  {
    const itemIndex = this._activeSlider.itemIndex;

    // do not slide disabled items
    if (this.dataList.items[itemIndex].disabled)
    {
      return;
    }

    // determine if sliding is reasonable for the target item (i.e. the item is 'slidable')
    if (!this._isSlider(itemIndex))
    {
      // this is not a slider -> exit
      return;
    }

    if (this._inSecondaryMulticontroller && itemIndex == this._currentSecondaryMulticontrollerItem)
    {
      // if we are in secondary multicontroller mode, touching outside the item will exit it
      this._setSecondaryMulticontroller(false, this._currentSecondaryMulticontrollerItem);
      this._showFocus(this._lastItemWithFocus, true);
    }
    else
    {
      // pass the event to the SliderCtrl
      this._activeSlider.slider._onUpHandler(e);

      // transition focus back to item and remove it from the slider
      this._activeSlider.slider.handleControllerEvent('lostFocus');
      this._showFocus(this._lastItemWithFocus, true);
    }
  }

  // reset currently active slider
  this._activeSlider = null;
};

List2Ctrl.prototype._slideCallback = function()
{
  // get item index from the first argument
  const itemIndex = arguments[0];

  // get value and final adjustment from fourth argument
  const value = arguments[3].value;
  const finalAdjustment = arguments[3].finalAdjustment;

  // update local value
  this.dataList.items[itemIndex].value = value;

  // Fire slide callback passing forward anything in the arguments
  if (typeof this.properties.slideCallback == 'function')
  {
    // fire callback with original slider params
    // this.properties.slideCallback.apply(null, Array.prototype.slice.call(arguments, 1));

    // fire per-design callback
    const params = {
      itemIndex: itemIndex,
      value: value,
      finalAdjustment: finalAdjustment,
    };
    this.properties.slideCallback(this, this.dataList.items[itemIndex].appData, params);
  }
};


/*
 * =========================
 * TOGGLE BUTTONS
 * When a button is selected it is automatically
 * highlighted (activated) and the value is reported to the
 * button select callback (if defined)
 * =========================
 */


/**
 * Remove hit state from the toggle button
 * TAG: touch-only, internal
 * =========================
 * @param {integer} - index of the currently hit or focussed item
 * @return {void}
 */
List2Ctrl.prototype._buttonRemoveHit = function(itemIndex)
{
  const targetElt = this._getDOMItem(itemIndex);
  if (targetElt)
  {
    const hitItems = targetElt.querySelectorAll('.hit');

    if (hitItems.length)
    {
      for (let i=0, l=hitItems.length; i<l; i++)
      {
        hitItems[i].classList.remove('hit');
      }
    }
  }
};


/**
 * Add hit state to the toggle button
 * TAG: touch-only, internal
 * =========================
 * @param {integer} - index of the currently hit or focussed item
 * @return {boolean} - True if button is hit
 */
List2Ctrl.prototype._buttonMakeHit = function(e)
{
  // reset any previously set _startButton
  this._startButton = null;

  // get relative mouse position
  const relativeX = e.pageX - this._maskPositionX;

  // determine target item
  const itemIndex = this._getTargetItem(e);

  // only valid list items are allowed
  if (itemIndex == -1)
  {
    return false;
  }

  // if the item is disabled -> do not make hit
  if (this.dataList.items[itemIndex].disabled)
  {
    return false;
  }

  // Check if we are in the hittable area
  let inHittable = false;
  const rightBoundary = this.properties.toggleReferencePointRight;
  let leftBoundary = 0;
  switch (this.dataList.items[itemIndex].itemStyle)
  {
    case 'style10': // 2 toggle buttons
      leftBoundary = this.properties.toggleReferencePointRight - (2 * this.properties.toggleButtonWidth);
      if (relativeX >= leftBoundary && relativeX <= rightBoundary)
      {
        inHittable = true;
      }
      break;

    case 'style11': // 3 toggle buttons
      leftBoundary = this.properties.toggleReferencePointRight - (3 * this.properties.toggleButtonWidth);
      if (relativeX >= leftBoundary && relativeX <= rightBoundary)
      {
        inHittable = true;
      }
      break;

    case 'draggable': // 1 toggle buttons
      leftBoundary = this.properties.toggleReferencePointRight - (1 * this.properties.toggleButtonWidth);
      if (relativeX >= leftBoundary && relativeX <= rightBoundary)
      {
        inHittable = true;
      }
      break;
  }

  if (!inHittable)
  {
    // we are outside the hittable area -> return false
    return false;
  }

  // when user hits one of the buttons, the item does not gain hit highlight
  this._itemRemoveHit();

  // Check which button is hit
  const clickedZone = (relativeX - leftBoundary) / (rightBoundary - leftBoundary);
  let buttonId = null;
  switch (this.dataList.items[itemIndex].itemStyle)
  {
    case 'style10':
      buttonId = clickedZone < 0.5 ? 1 : 2;
      break;
    case 'style11':
      buttonId = clickedZone < 0.33 ? 1 :
                clickedZone < 0.66 ? 2 :
                    3;
      break;
    case 'draggable':
      buttonId = 1;
      break;
  }

  // Make that button hit
  if (buttonId)
  {
    // save the button as _startButton
    this._startButton = buttonId;

    const domItem = this._getDOMItem(itemIndex);
    const buttons = domItem.querySelectorAll('.button');
    for (let i=0; i<buttons.length; i++)
    {
      buttons[i].classList.remove('hit');
      if (buttonId === (i+1))
      {
        buttons[i].classList.add('hit');
      }
    }
  }

  return true;
};

/**
 * Select toggle button
 * TAG: touch-only, internal
 * =========================
 * @param {MouseEvent}
 * @return {integer} - selected button id (1,2,3)
 */
List2Ctrl.prototype._buttonSelect = function(e)
{
  // get relative mouse position
  const relativeX = e.pageX - this._maskPositionX;

  // determine target item
  const itemIndex = this._getTargetItem(e);

  // only valid list items are allowed
  if (itemIndex == -1)
  {
    return;
  }

  // if the item is disabled -> do not make active
  if (this.dataList.items[itemIndex].disabled)
  {
    return;
  }

  // Check if we are in the hittable area
  let inHittable = false;
  const rightBoundary = this.properties.toggleReferencePointRight;
  let leftBoundary = 0;
  switch (this.dataList.items[itemIndex].itemStyle)
  {
    case 'style10': // 2 toggle buttons
      leftBoundary = this.properties.toggleReferencePointRight - (2 * this.properties.toggleButtonWidth);
      if (relativeX >= leftBoundary && relativeX <= rightBoundary)
      {
        inHittable = true;
      }
      break;

    case 'style11': // 3 toggle buttons
      leftBoundary = this.properties.toggleReferencePointRight - (3 * this.properties.toggleButtonWidth);
      if (relativeX >= leftBoundary && relativeX <= rightBoundary)
      {
        inHittable = true;
      }
      break;

    case 'draggable': // 1 toggle button
      leftBoundary = this.properties.toggleReferencePointRight - (1 * this.properties.toggleButtonWidth);
      if (relativeX >= leftBoundary && relativeX <= rightBoundary)
      {
        inHittable = true;
      }
      break;
  }

  if (!inHittable && this._startButton)
  {
    // we are outside the hittable area and we have started from a button -> return cancel
    return 'cancel';
  }
  else if (!inHittable)
  {
    // we are outside the hittable area -> return cancel
    return null;
  }

  // Check which button is selected
  const clickedZone = (relativeX - leftBoundary) / (rightBoundary - leftBoundary);
  let buttonId = null;
  switch (this.dataList.items[itemIndex].itemStyle)
  {
    case 'style10':
      buttonId = clickedZone < 0.5 ? 1 : 2;
      break;
    case 'style11':
      buttonId = clickedZone < 0.33 ? 1 :
                clickedZone < 0.66 ? 2 :
                    3;
      break;
    case 'draggable':
      buttonId = 1;
      break;
  }

  // Make that button active
  if (buttonId && buttonId === this._startButton)
  {
    this._startButton = null;

    if (this.dataList.items[itemIndex].value == buttonId)
    {
      // we ended on already selected button -> cancel
      return 'cancel';
    }
    // we ended up on the same button we started -> select that button
    this._buttonActivate(itemIndex, buttonId);
  }
  else if (buttonId && null === this._startButton)
  {
    // we started off the buttons but ended up on a button -> select next button
    this._startButton = null;
    return null;
  }
  else
  {
    // we started from one of the buttons but ended out of them -> cancel
    this._startButton = null;
    return 'cancel';
  }

  // Return the button id
  return buttonId;
};

/**
 * Select the nearest left toggle button to the currently active one
 * TAG: internal
 * =========================
 * @param {integer} - index of the currently focussed item
 * @return {integer} - selected button id (1,2,3)
 */
List2Ctrl.prototype._buttonSelectLeft = function(itemIndex)
{
  // get current active button
  const current = this.dataList.items[itemIndex].value;

  // set new active button
  return this._buttonActivate(itemIndex, current-1);
};

/**
 * Select the nearest right toggle button to the currently active one
 * TAG: internal
 * =========================
 * @param {integer} - index of the currently focussed item
 * @return {integer} - selected button id (1,2,3)
 */
List2Ctrl.prototype._buttonSelectRight = function(itemIndex)
{
  // get current active button
  const current = this.dataList.items[itemIndex].value;

  // set new active button
  return this._buttonActivate(itemIndex, current+1);
};

/**
 * Activate toggle button
 * TAG: internal
 * =========================
 * @param {integer} - index of the currently hit or focussed item
 * @return {integer} - selected button id (1,2,3)
 */
List2Ctrl.prototype._buttonActivate = function(itemIndex, buttonId)
{
  // Ensure that buttonId is valid and wraps in a loop
  if ('style10' === this.dataList.items[itemIndex].itemStyle)
  {
    let buttonId = (!isNaN(buttonId)) ? buttonId : 1;
    if (buttonId > 2)
    {buttonId = 1;}
    else if (buttonId < 1)
    {buttonId = 2;}
  }
  else if ('style11' === this.dataList.items[itemIndex].itemStyle)
  {
    let buttonId = (!isNaN(buttonId)) ? buttonId : 1;
    if (buttonId > 3)
    {buttonId = 1;}
    else if (buttonId < 1)
    {buttonId = 3;}
  }
  else if ('draggable' === this.dataList.items[itemIndex].itemStyle)
  {
    const buttonId = 1;
  }
  else
  {
    log.debug('Unknown item style for itemIndex ' + itemIndex);
    return null;
  }

  if ('draggable' != this.dataList.items[itemIndex].itemStyle)
  {
    // Save the new value in the dataList
    this.dataList.items[itemIndex].value = buttonId;
  }

  // Get the DOM element
  const domItem = this._getDOMItem(itemIndex);

  // Remove any residual hit states
  this._buttonRemoveHit(itemIndex);

  // Activate the button
  if (domItem)
  {
    const buttons = domItem.querySelectorAll('.button');
    for (let i=0; i<buttons.length; i++)
    {
      buttons[i].classList.remove('active');
    }
    buttons[buttonId-1].classList.add('active');
  }

  return buttonId;
};


/*
 * =========================
 * LOCK BUTTONS
 * =========================
 */

/**
 * Remove hit state from the lock button
 * TAG: touch-only, internal
 * =========================
 * @param {integer} - index of the currently hit or focussed item
 * @return {void}
 */
List2Ctrl.prototype._lockRemoveHit = function(itemIndex)
{
  const targetElt = this._getDOMItem(itemIndex);
  if (targetElt)
  {
    const hitItems = targetElt.querySelectorAll('.hit');

    if (hitItems.length)
    {
      for (let i=0, l=hitItems.length; i<l; i++)
      {
        hitItems[i].classList.remove('hit');
      }
    }
  }
};


/**
 * Add hit state to the lock button
 * TAG: touch-only, internal
 * =========================
 * @param {MouseEvent}
 * @return {boolean} - True if button is hit
 */
List2Ctrl.prototype._lockMakeHit = function(e)
{
  // reset any previously set _startLockButton
  this._startLockButton = null;

  // get relative mouse position
  const relativeX = e.pageX - this._maskPositionX;

  // determine target item
  const itemIndex = this._getTargetItem(e);

  // only valid list items are allowed
  if (itemIndex == -1)
  {
    return false;
  }

  // check if this is a lock item
  if (!this._isLock(itemIndex))
  {
    return false;
  }

  // if the item is disabled -> do not make hit
  if (this.dataList.items[itemIndex].disabled)
  {
    return false;
  }

  // Check if we are in the hittable area
  let inHittable = false;
  const domItem = this._getDOMItem(itemIndex);
  const lockButton = domItem.querySelector('.buttonLock');
  const deleteButton = domItem.querySelector('.buttonDelete');
  const leftBoundary = lockButton.offsetLeft;
  let rightBoundary;
  if (this.dataList.items[itemIndex].locked)
  {
    // the delete button is disabled
    rightBoundary = lockButton.offsetLeft + lockButton.clientWidth;
  }
  else
  {
    // the delete button is enabled
    rightBoundary = deleteButton.offsetLeft + deleteButton.clientWidth;
  }

  // hit test
  if (relativeX >= leftBoundary && relativeX <= rightBoundary)
  {
    inHittable = true;
  }

  if (!inHittable)
  {
    // we are outside the hittable area -> return false
    return false;
  }

  // when user hits one of the buttons, the item does not gain hit highlight
  this._itemRemoveHit();

  let buttonId = 1;
  // Check which button is hit is the item is not locked
  if (!this.dataList.items[itemIndex].locked)
  {
    const clickedZone = (relativeX - leftBoundary) / (rightBoundary - leftBoundary);
    buttonId = clickedZone < 0.5 ? 1 : 2;
  }

  // save the button as _startLockButton
  this._startLockButton = buttonId;

  // remove hit
  this._lockRemoveHit(itemIndex);

  // make that button hit
  if (1 === buttonId)
  {
    this._lockShowFocus(itemIndex, 1);
    domItem.querySelector('.buttonLock').classList.add('hit');
  }
  else
  {
    this._lockShowFocus(itemIndex, 2);
    domItem.querySelector('.buttonDelete').classList.add('hit');
  }

  this._hideFocus();

  return true;
};

/**
 * Select lock button
 * TAG: touch-only, internal
 * =========================
 * @param {MouseEvent}
 * @return {string} - performed action (lock, unlock, delete)
 */
List2Ctrl.prototype._lockSelect = function(e)
{
  // get relative mouse position
  const relativeX = e.pageX - this._maskPositionX;

  // determine target item
  const itemIndex = this._getTargetItem(e);

  // only valid list items are allowed
  if (itemIndex == -1)
  {
    return null;
  }

  // if the item is disabled -> do not make active
  if (this.dataList.items[itemIndex].disabled)
  {
    return null;
  }

  // Check if we are in the hittable area
  let inHittable = false;
  const domItem = this._getDOMItem(itemIndex);
  const lockButton = domItem.querySelector('.buttonLock');
  const deleteButton = domItem.querySelector('.buttonDelete');
  const leftBoundary = lockButton.offsetLeft;
  let rightBoundary;
  if (this.dataList.items[itemIndex].locked)
  {
    // the delete button is disabled
    rightBoundary = lockButton.offsetLeft + lockButton.clientWidth;
  }
  else
  {
    // the delete button is enabled
    rightBoundary = deleteButton.offsetLeft + deleteButton.clientWidth;
  }

  // hit test
  if (relativeX >= leftBoundary && relativeX <= rightBoundary)
  {
    inHittable = true;
  }

  if (!inHittable)
  {
    // set secondary multicontroller leaving highlight from where it started
    if (this._startLockButton)
    {
      this._setSecondaryMulticontroller(true, itemIndex);
      this._lockShowFocus(itemIndex, this._startLockButton);
    }

    // we are outside the hittable area -> return null
    return null;
  }

  let action = null;
  let buttonId = 1;
  // Check which button is hit is the item is not locked
  if (!this.dataList.items[itemIndex].locked)
  {
    const clickedZone = (relativeX - leftBoundary) / (rightBoundary - leftBoundary);
    buttonId = clickedZone < 0.5 ? 1 : 2;
  }

  // Make that button active
  if (buttonId === this._startLockButton)
  {
    this._startLockButton = null;
    // we ended up on the same button we started -> select that button
    action = this._lockActivate(itemIndex, buttonId);
  }
  else if (null === this._startButton)
  {
    this._startLockButton = null;
    // we started off the buttons but ended up on a button -> select that button
    action = this._lockActivate(itemIndex, buttonId);
  }
  else
  {
    // we started from one of the buttons but ended out of them -> cancel
    this._startLockButton = null;

    return null;
  }

  // Return the performed action
  return action;
};

/**
 * Select the nearest left toggle button to the currently active one
 * TAG: internal
 * =========================
 * @param {integer} - index of the currently focussed item
 * @return {integer} - selected button id (1,2,3)
 */
List2Ctrl.prototype._lockMoveFocusLeft = function(itemIndex)
{
  // get current focussed lock button
  const current = this._lockGetFocus(itemIndex);

  // set the new focussed lock button
  return this._lockShowFocus(itemIndex, current-1);
};

/**
 * Select the nearest right toggle button to the currently active one
 * TAG: internal
 * =========================
 * @param {integer} - index of the currently focussed item
 * @return {integer} - selected button id (1,2,3)
 */
List2Ctrl.prototype._lockMoveFocusRight = function(itemIndex)
{
  // get current focussed lock button
  const current = this._lockGetFocus(itemIndex);

  // set the new focussed lock button
  return this._lockShowFocus(itemIndex, current+1);
};

/**
 * Activate lock button
 * TAG: internal
 * =========================
 * @param {integer} - index of the currently hit or focussed item
 * @param {integer} - the button that is going to be activated
 * @return {string} - performed action (lock, unlock, delete)
 */
List2Ctrl.prototype._lockActivate = function(itemIndex, buttonId)
{
  let action = null;

  switch (buttonId)
  {
    case 1:
      if (this.dataList.items[itemIndex].locked)
      {
        this.dataList.items[itemIndex].locked = false;
        action = 'unlock';
      }
      else
      {
        this.dataList.items[itemIndex].locked = true;
        action = 'lock';
      }
      break;
    case 2:
      if (!this.dataList.items[itemIndex].locked)
      {
        action = 'delete';
      }
      break;
  }

  // Get the DOM element
  const domItem = this._getDOMItem(itemIndex);

  // Update the item
  if (domItem)
  {
    switch (action)
    {
      case 'lock':
        domItem.classList.add('locked');
        break;
      case 'unlock':
        domItem.classList.remove('locked');
        break;
    }
  }

  return action;
};


/**
 * Show focus highlight on a lock button
 * TAG: internal
 * =========================
 * @param {integer} - index of the currently hit or focussed item
 * @param {integer} - the index of the button that will be focused
 * @return {integer} - id of the focussed lock button
 */
List2Ctrl.prototype._lockShowFocus = function(itemIndex, buttonId)
{
  // check if this is a lock item
  if (!this._isLock(itemIndex))
  {
    return false;
  }

  // if the item is disabled -> do not make hit
  if (this.dataList.items[itemIndex].disabled)
  {
    return false;
  }

  // Get the DOM element
  const domItem = this._getDOMItem(itemIndex);

  if ('clear' === buttonId)
  {
    if (domItem)
    {
      domItem.querySelector('.buttonLock').classList.remove('focus');
      domItem.querySelector('.buttonDelete').classList.remove('focus');
    }
    return null;
  }
  else
  {
    // validate button id
    const buttonId = this.dataList.items[itemIndex].locked ? 1 : this.m.min(this.m.max(buttonId, 1), 2);

    if (domItem)
    {
      // add focus on the respective button
      switch (buttonId)
      {
        case 1:
          domItem.querySelector('.buttonDelete').classList.remove('focus');
          domItem.querySelector('.buttonLock').classList.add('focus');
          break;
        case 2:
          domItem.querySelector('.buttonLock').classList.remove('focus');
          domItem.querySelector('.buttonDelete').classList.add('focus');
          break;
        default:
          domItem.querySelector('.buttonDelete').classList.remove('focus');
          domItem.querySelector('.buttonLock').classList.add('focus');
          break;
      }
    }
    return buttonId;
  }
};


/**
 * Get currently focused lock button
 * TAG: internal
 * =========================
 * @param {integer} - index of the currently hit or focussed item
 * @return {integer} - id of the currently focussed lock button
 */
List2Ctrl.prototype._lockGetFocus = function(itemIndex)
{
  // check if this is a lock item
  if (!this._isLock(itemIndex))
  {
    return false;
  }

  // if the item is disabled -> do not make hit
  if (this.dataList.items[itemIndex].disabled)
  {
    return false;
  }

  let focussedButton = null;

  // Get the DOM element
  const domItem = this._getDOMItem(itemIndex);
  if (domItem)
  {
    if (domItem.querySelector('.buttonLock').classList.contains('focus'))
    {focussedButton = 1;}
    else if (domItem.querySelector('.buttonDelete').classList.contains('focus'))
    {focussedButton = 2;}
  }

  return focussedButton;
};


/*
 * =========================
 * STEP ITEM
 * =========================
 */

/**
 * Increase the value by one step
 * TAG: internal
 * =========================
 * @param {MouseEvent} - raw mouse event
 * @return {integer} - the new value
 */
List2Ctrl.prototype._stepAdjust = function(e)
{
  // get relative mouse position
  const relativeX = e.pageX - this._maskPositionX;

  // determine target item
  const itemIndex = this._getTargetItem(e);

  // only valid list items are allowed
  if (itemIndex == -1)
  {
    return;
  }

  // if the item is disabled -> do not make active
  if (this.dataList.items[itemIndex].disabled)
  {
    return;
  }

  // perform hit test
  const itemDOMElement = this._getDOMItem(itemIndex);
  if (!itemDOMElement)
  {
    return;
  }

  const p = itemDOMElement.querySelector('.plus');
  const m = itemDOMElement.querySelector('.minus');
  const pLayout = {x1: p.offsetLeft, x2: p.offsetLeft + p.clientWidth};
  const mLayout = {x1: m.offsetLeft, x2: m.offsetLeft + m.clientWidth};

  let newValue = null;

  if (relativeX >= pLayout.x1 && relativeX <= pLayout.x2)
  {
    // plus pressed
    if (!itemDOMElement.classList.contains('maxReached'))
    {
      newValue = this._stepUp(itemIndex);
    }
  }
  else if (relativeX >= mLayout.x1 && relativeX <= mLayout.x2)
  {
    // minus pressed
    if (!itemDOMElement.classList.contains('minReached'))
    {
      newValue = this._stepDown(itemIndex);
    }
  }
  else if (relativeX < mLayout.x1)
  {
    newValue = 'commit';
  }


  return newValue;
};

/**
 * Increase the value by one step
 * TAG: internal
 * =========================
 * @param {integer} - index of the step item
 * @return {integer|null} - the new value
 */
List2Ctrl.prototype._stepUp = function(itemIndex)
{
  if (!this._isStep(itemIndex))
  {
    return;
  }

  const oldValue = this.dataList.items[itemIndex].value;
  let newValue = this.m.min(this.dataList.items[itemIndex].value + this.dataList.items[itemIndex].increment, this.dataList.items[itemIndex].max);

  if (newValue != oldValue)
  {
    // value changed -> store it and update item
    this.dataList.items[itemIndex].value = newValue;
    this.updateItems(itemIndex, itemIndex);
  }
  else
  {
    // value is the same -> return null
    newValue = null;
  }

  return newValue;
};

/**
 * Decrease the value by one step
 * TAG: internal
 * =========================
 * @param {integer} - index of the step item
 * @return {integer|null} - the new value
 */
List2Ctrl.prototype._stepDown = function(itemIndex)
{
  if (!this._isStep(itemIndex))
  {
    return;
  }

  const oldValue = this.dataList.items[itemIndex].value;
  let newValue = this.m.max(this.dataList.items[itemIndex].value - this.dataList.items[itemIndex].increment, this.dataList.items[itemIndex].min);

  if (newValue != oldValue)
  {
    // value changed -> store it and update item
    this.dataList.items[itemIndex].value = newValue;
    this.updateItems(itemIndex, itemIndex);
  }
  else
  {
    // value is the same -> return null
    newValue = null;
  }

  return newValue;
};


/**
 * =========================
 * LIST REORDERING
 * =========================
 */

/**
 * Enter into list reorder mode
 * This method stores the original item style of the
 * item that is being reordered and substitutes it with
 * an internal 'draggable' item style.
 * TAG: internal
 * =========================
 * @param {Boolean}
 * @return {void}
 */
List2Ctrl.prototype._enterListReorder = function(fromInit)
{
  // keep a copy of the item before converting it to a draggable item

  let focussedIndex;
  if (fromInit)
  {
    focussedIndex = this.properties.focussedItem;
  }
  else
  {
    focussedIndex = this._getFocussedIndex();
  }

  // check for items in the dataList
  if (!this.dataList || !this.dataList.items || !this.dataList.items[focussedIndex])
  {
    return;
  }

  // do not reorder disabled items
  if (this.dataList.items[focussedIndex].disabled)
  {
    return;
  }

  // enter into List Reordering mode
  this._inListReorder = true;

  this.dataList.items[focussedIndex].itemBehavior = 'shortAndLong'; // make it accept long press (if not already)
  this._reorderItem = this.dataList.items[focussedIndex];
  this._reorderItemIndex = focussedIndex;
  this._reorderCurrentIndex = focussedIndex;

  // convert the item to a draggable item
  const draggableItem = {};
  draggableItem.itemStyle = 'draggable';
  draggableItem.text1 = this._reorderItem.text1;
  if (this._reorderItem.itemStyle === 'style38')
  {
    draggableItem.label1 = (this._reorderItem.hasOwnProperty('label1')) ? this._reorderItem.label1 : '';
    draggableItem.label2 = (this._reorderItem.hasOwnProperty('label2')) ? this._reorderItem.label2 : '';
  }
  draggableItem.image1 = (this._reorderItem.hasOwnProperty('image1')) ? this._reorderItem.image1 : '';
  draggableItem.button1 = this._getLocalizedString('common.Ok');
  draggableItem.hasCaret = false;
  this.dataList.items[focussedIndex] = draggableItem;
  this.updateItems(focussedIndex, focussedIndex);
};

/**
 * Leave list reorder mode
 * The item that is being reordered is restored
 * to it initial style. The select callback is
 * then fired to notify the interested parties of
 * the change and the new position of the item.
 * TAG: internal
 * =========================
 * @param {Boolean} - prevent item selection when releasing the reorder
 * @return {void}
 */
List2Ctrl.prototype._releaseListReorder = function(preventSelect)
{
  // exit list reordering mode
  this._inListReorder = false;
  this._appIsAtSpeed = false;

  // get draggable item index
  const draggableItems = this.getItemsByType('draggable');
  if (!draggableItems.length)
  {
    return;
  }

  const draggableItemIndex = draggableItems[0];

  // convert the draggable item back into the previous item type
  this.dataList.items[draggableItemIndex] = this._reorderItem;
  this.updateItems(draggableItemIndex, draggableItemIndex);

  // cast preventSelect as Boolean
  const preventSelect = Boolean(preventSelect);

  // selection is allowed
  if (!preventSelect)
  {
    // fire item select
    const params = {
      newIndex: draggableItemIndex,
      oldIndex: this._reorderItemIndex,
    };
    this._itemSelect(draggableItemIndex, params);
  }

  // release the copy of the reorder item
  this._reorderItem = null;
  this._reorderItemIndex = null;
  this._reorderTouchElt = null;
};


/**
 * Touch start reorder item
 * TAG: internal, touch-only
 * =========================
 * @param {MouseEvent}
 * @return {void}
 */
List2Ctrl.prototype._startReorder = function(e)
{
  // get target item index
  const itemIndex = this._getTargetItem(e);

  // get draggable item index
  if (itemIndex === this._reorderCurrentIndex)
  {
    this._startY = e.pageY - this._maskPositionY;
    this._startX = e.pageX - this._maskPositionX;

    // do we have hit on the button?
    const positiveButtonHit = this._buttonMakeHit(e);

    if (!positiveButtonHit)
    {
      this._itemMakeLongPress(e);

      // clone draggable item
      const tmp = this._getDOMItem(itemIndex);
      this._reorderTouchElt = tmp.cloneNode(true);
      this.scroller.appendChild(this._reorderTouchElt);

      // convert the draggable item to a ghost item
      const ghostItem = {itemStyle: 'ghost', hasCaret: false};
      this.dataList.items[itemIndex] = ghostItem;
      this.updateItems(itemIndex, itemIndex);

      this._hideFocus();

      // raise _inDrag
      this._inDrag = true;
    }
    else
    {
      // flag the behaviour as release intent
      this._releaseReorderByTouch = true;
    }

    // track event
    this._trackEvent(e);
  }
};

/**
 * Touch move reorder item
 * TAG: internal, touch-only
 * =========================
 * @param {MouseEvent}
 * @return {void}
 */
List2Ctrl.prototype._moveReorder = function(e)
{
  if (this._reorderTouchElt)
  {
    // track event
    this._trackEvent(e);

    // perform event filtering
    if (this.properties.eventFilterThreshold > 0)
    {
      // skip event
      if (e.timeStamp-this._lastEventTime <= this.properties.eventFilterThreshold)
      {
        return;
      }

      // record time
      this._lastEventTime = e.timeStamp;
    }

    // get mouse position relative to scroller corrected with the reorder touch element position
    let newPos = (e.pageY - this._maskPositionY) + this.m.abs(this.scroller.offsetTop) - (this.properties.itemHeight / 2);

    // constrain the new position
    newPos = this.m.max(0, newPos);

    // drag the item
    this._reorderTouchElt.style.top = newPos + 'px';

    // get last move
    const moveDirection = this._getMoveDirection();

    // reset any scheduled scrolling if the user intends cacnelling the scroll
    if (newPos <= (this._topItem * this.properties.itemHeight) + this.properties.itemHeight &&
            newPos > this._topItem * this.properties.itemHeight)
    {
      if (null != this._touchReorderTimeoutId)
      {
        clearTimeout(this._touchReorderTimeoutId);
        this._touchReorderTimeoutId = null;
      }
    }
    else if (newPos >= (this._topItem + this.properties.visibleItems - 2) * this.properties.itemHeight &&
                 newPos < (this._topItem + this.properties.visibleItems - 1) * this.properties.itemHeight)
    {
      if (null != this._touchReorderTimeoutId)
      {
        clearTimeout(this._touchReorderTimeoutId);
        this._touchReorderTimeoutId = null;
      }
    }

    // drag down
    if (1 === moveDirection)
    {
      // have we passed the last item's top border?
      if ( (this._topItem >= this.dataList.itemCount - this.properties.visibleItems) && (newPos >= ((this._topItem + this.properties.visibleItems) * this.properties.itemHeight) - this.properties.itemHeight) )
      {
        this._reorderGhostItemDown();
      }
      else if (newPos >= ((this._topItem + this.properties.visibleItems) * this.properties.itemHeight) - this.properties.itemHeight)
      {
        // do we have a scroll down scheduled? -> if not, schedule one
        if (null === this._touchReorderTimeoutId)
        {
          this._touchReorderTimeoutId = setTimeout(this._scrollDownOne.bind(this), this.properties.listReorderScrollTimeout);
        }
      }
      else if (newPos >= (this._reorderCurrentIndex * this.properties.itemHeight) + this.properties.itemHeight)
      {
        if (null != this._touchReorderTimeoutId)
        {
          clearTimeout(this._touchReorderTimeoutId);
          this._touchReorderTimeoutId = null;
        }
        this._reorderGhostItemDown();
      }
    }
    // drag up
    else if (-1 === moveDirection)
    {
      // have we passed the top item's top border?
      if (0 != this._topItem && newPos <= this._topItem * this.properties.itemHeight)
      {
        // do we have a scroll up scheduled? -> if not, schedule one
        if (null === this._touchReorderTimeoutId)
        {
          this._touchReorderTimeoutId = setTimeout(this._scrollUpOne.bind(this), this.properties.listReorderScrollTimeout);
        }
      }
      else if (newPos <= (this._reorderCurrentIndex * this.properties.itemHeight) - this.properties.itemHeight)
      {
        if (null != this._touchReorderTimeoutId)
        {
          clearTimeout(this._touchReorderTimeoutId);
          this._touchReorderTimeoutId = null;
        }
        this._reorderGhostItemUp();
      }
    }
  } // endif (this._reorderTouchElt)
};

/**
 * Touch end reorder item
 * TAG: internal, touch-only
 * =========================
 * @param {MouseEvent}
 * @return {void}
 */
List2Ctrl.prototype._endReorder = function(e)
{
  if (this._reorderTouchElt)
  {
    // get nearest snap position
    const newSnappedIndex = Math.floor( ( (e.pageY - this._maskPositionY) + this.m.abs(this.scroller.offsetTop) ) / this.properties.itemHeight );

    // get mouse position relative to scroller corrected with the reorder touch element position
    let newPos = newSnappedIndex * this.properties.itemHeight;

    // constrain the new position
    newPos = this.m.max(0, newPos);

    // drag the scroller if in bounds
    this._reorderTouchElt.style.top = newPos + 'px';

    // convert the ghost item back to a draggable item
    const draggableItem = {};
    draggableItem.itemStyle = 'draggable';
    draggableItem.text1 = this._reorderItem.text1;
    draggableItem.image1 = (this._reorderItem.hasOwnProperty('image1')) ? this._reorderItem.image1 : '';
    if (this._reorderItem.itemStyle === 'style38')
    {
      draggableItem.label1 = (this._reorderItem.hasOwnProperty('label1')) ? this._reorderItem.label1 : '';
      draggableItem.label2 = (this._reorderItem.hasOwnProperty('label2')) ? this._reorderItem.label2 : '';
    }
    draggableItem.button1 = this._getLocalizedString('common.Ok');
    draggableItem.hasCaret = false;
    this.dataList.items[this._reorderCurrentIndex] = draggableItem;
    this.updateItems(this._reorderCurrentIndex, this._reorderCurrentIndex);

    // remove the cloned element
    this._reorderTouchElt.parentElement.removeChild(this._reorderTouchElt);
  }

  this._itemRemoveLongPress();
  this._reorderTouchElt = null;

  // reset flags
  this._inHorizontalDrag = null;
  this._hDragItem = null;
  this._inDrag = false;
  this._stopSelect = false;

  // restore focus
  this._showFocus(this._reorderCurrentIndex);

  // clear any scroll timeout
  clearTimeout(this._touchReorderTimeoutId);
  this._touchReorderTimeoutId = null;

  // are we about to release reorder
  if (this._releaseReorderByTouch && this._isToggle(this._reorderCurrentIndex))
  {
    // remove hit state of button and release list reorder
    this._buttonRemoveHit(this._reorderCurrentIndex);
    this._releaseListReorder();
    this._releaseReorderByTouch = false;
  }
};

/**
 * After the list has scrolled due to touch reorder action,
 * upon animation end, the touch reorder item is brought under the
 * user's finger and if the possition requires it, a new scroll
 * is scheduled.
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._bringReorderItem = function()
{
  if (this._trackedEvents.length && this._reorderTouchElt)
  {
    // get last event
    const lastEvent = this._trackedEvents[this._trackedEvents.length-1];

    // get mouse position relative to scroller corrected with the reorder touch element position
    let newPos = (lastEvent.y - this._maskPositionY) + this.m.abs(this.scroller.offsetTop) - (this.properties.itemHeight / 2);

    // constrain the new position
    newPos = this.m.max(0, newPos);

    // drag the item
    this._reorderTouchElt.style.top = newPos + 'px';

    // we are past the top item's top boundary
    if (0 != this._topItem && newPos <= this._topItem * this.properties.itemHeight)
    {
      // update blank spot
      this._reorderGhostItemUp();

      // reschedule list scroll
      clearTimeout(this._touchReorderTimeoutId);
      this._touchReorderTimeoutId = setTimeout(this._scrollUpOne.bind(this), this.properties.listReorderScrollTimeout);
    }
    else if (0 == this._topItem)
    {
      // update blank spot
      this._reorderGhostItemUp();
    }
    else if (this._topItem != this.dataList.itemCount - this.properties.visibleItems &&
                 newPos >= (this._topItem + this.properties.visibleItems - 1) * this.properties.itemHeight)
    {
      // update blank spot
      this._reorderGhostItemDown();

      // reschedule list scroll
      clearTimeout(this._touchReorderTimeoutId);
      this._touchReorderTimeoutId = setTimeout(this._scrollDownOne.bind(this), this.properties.listReorderScrollTimeout);
    }
    else if (this._topItem >= this.dataList.itemCount - this.properties.visibleItems)
    {
      // update blank spot
      this._reorderGhostItemDown();
    }
  }
};
/**
 * Reorder the item to the index
 * TAG: internal
 * =========================
 * @param {integer} - item index
 * @return {void}
 */
List2Ctrl.prototype._reorderToIndex = function(itemIndex)
{
  if (!this._inListReorder || isNaN(itemIndex))
  {
    log.error('list1 _reorderToIndex : Invalid arguments - inListReorder, itemIndex', this._inListReorder, itemIndex);
    return;
  }

  if (itemIndex != this._reorderItemIndex)
  {
    if (itemIndex < this._reorderItemIndex)
    {
      this._reorderItemUp(this._reorderItemIndex - itemIndex);
    }
    else
    {
      this._reorderItemDown(itemIndex - this._reorderItemIndex);
    }
  }
};

/**
 * Reorder the item down
 * TAG: internal
 * =========================
 * @param {integer} -number of items
 * @return {void}
 */
List2Ctrl.prototype._reorderItemDown = function(reorderCount)
{
  // ensure that we are in list reorder mode
  if (!this._inListReorder)
  {
    return;
  }

  // prevent list scrolling while we're loading
  if (this._inLoading)
  {
    return;
  }

  if (!reorderCount)
  {
    reorderCount = 1;
  }

  for (let count = 1; count <= reorderCount; count++)
  {
    // get draggable item index
    const draggableItemIndex = this.getItemsByType('draggable')[0];

    // get new index not exceeding the list count
    const targetItemIndex = this.m.min(draggableItemIndex + 1, this.dataList.itemCount - 1);

    // reorder the dataList.items array
    const tempCopy = this.dataList.items[targetItemIndex];
    this.dataList.items[targetItemIndex] = this.dataList.items[draggableItemIndex];
    this.dataList.items[draggableItemIndex] = tempCopy;

    // update display
    this.updateItems(draggableItemIndex, targetItemIndex);

    // store current temporary index
    this._reorderCurrentIndex = targetItemIndex;
  }
};
/**
 * Reorder the item up
 * TAG: internal
 * =========================
 * @param {integer} -number of items
 * @return {void}
 */
List2Ctrl.prototype._reorderItemUp = function(reorderCount)
{
  // ensure that we are in list reorder mode
  if (!this._inListReorder)
  {
    return;
  }

  // prevent list scrolling while we're loading
  if (this._inLoading)
  {
    return;
  }

  if (!reorderCount)
  {
    reorderCount = 1;
  }

  for (let count = 1; count <= reorderCount; count++)
  {
    // get draggable item index
    const draggableItemIndex = this.getItemsByType('draggable')[0];

    // get new index not exceeding the list count
    const targetItemIndex = this.m.max(draggableItemIndex - 1, 0);

    // reorder the dataList.items array
    const tempCopy = this.dataList.items[targetItemIndex];
    this.dataList.items[targetItemIndex] = this.dataList.items[draggableItemIndex];
    this.dataList.items[draggableItemIndex] = tempCopy;

    // update display
    this.updateItems(targetItemIndex, draggableItemIndex);

    // store current temporary index
    this._reorderCurrentIndex = targetItemIndex;
  }
};

/**
 * Reorder ghost item one position down
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._reorderGhostItemDown = function()
{
  // ensure that we are in list reorder mode
  if (!this._inListReorder)
  {
    return;
  }

  // get draggable item index
  const ghostItemIndex = this.getItemsByType('ghost')[0];

  // get new index not exceeding the list count
  const targetItemIndex = this.m.min(ghostItemIndex + 1, this.dataList.itemCount - 1);

  // reorder the dataList.items array
  const tempCopy = this.dataList.items[targetItemIndex];
  this.dataList.items[targetItemIndex] = this.dataList.items[ghostItemIndex];
  this.dataList.items[ghostItemIndex] = tempCopy;

  // update display
  this.updateItems(ghostItemIndex, targetItemIndex);

  // store current temporary index
  this._reorderCurrentIndex = targetItemIndex;

  this._hideFocus();
};

/**
 * Reorder ghost item one position up
 * TAG: internal
 * =========================
 * @return {void}
 */
List2Ctrl.prototype._reorderGhostItemUp = function()
{
  // ensure that we are in list reorder mode
  if (!this._inListReorder)
  {
    return;
  }

  // get draggable item index
  const ghostItemIndex = this.getItemsByType('ghost')[0];

  // get new index not exceeding the list count
  const targetItemIndex = this.m.max(ghostItemIndex - 1, 0);

  // reorder the dataList.items array
  const tempCopy = this.dataList.items[targetItemIndex];
  this.dataList.items[targetItemIndex] = this.dataList.items[ghostItemIndex];
  this.dataList.items[ghostItemIndex] = tempCopy;

  // update display
  this.updateItems(targetItemIndex, ghostItemIndex);

  // store current temporary index
  this._reorderCurrentIndex = targetItemIndex;

  this._hideFocus();
};


/**
 * =========================
 * LIST EVENTS API
 * =========================
 */

/**
 * List event
 * TAG: internal
 * =========================
 * @param {string} - Event name
 * @param {*} - Event data
 * @return {void}
 */
List2Ctrl.prototype._listEvent = function(type, data)
{
  const data = data || null;
  switch (type)
  {
    case this._EVENTS.ITEM_SELECT:
      this._dispatch(this._EVENTS.ITEM_SELECT, data);
      break;
    case this._EVENTS.LETTER_SELECT:
      this._dispatch(this._EVENTS.LETTER_SELECT, data);
      break;
    case this._EVENTS.DATALIST_CHANGE:
      this._dispatch(this._EVENTS.DATALIST_CHANGE, null);
      break;
    case this._EVENTS.SCROLL_START:
      this._dispatch(this._EVENTS.SCROLL_START, data);
      break;
    case this._EVENTS.SCROLL_END:
      this._dispatch(this._EVENTS.SCROLL_END, data);
      break;
    case this._EVENTS.CLEAN_UP:
      this._dispatch(this._EVENTS.CLEAN_UP, data);
      break;
    default:
      // nothing to do
      break;
  }
};

/**
 * Get listeners array for an event
 * TAG: internal
 * =========================
 * @param {string} - Event name
 * @return {array}
 */
List2Ctrl.prototype._getListeners = function(type, useCapture)
{
  const captype = (useCapture ? '1' : '0') + type;
  if (!(captype in this._eventListeners))
  {this._eventListeners[captype] = [];}
  return this._eventListeners[captype];
};

/**
 * Dispatch custom event
 * TAG: internal
 * =========================
 * @param {string} - Event name
 * @return {void}
 */
List2Ctrl.prototype._dispatch = function(type, data)
{
  if (!type || '' == type)
  {return;}
  const evt = new CustomEvent( type, {detail: {data: data, bubbles: true, cancelable: true}} );
  this.dispatchEvent(evt);
};

/**
 * Add event listener to custom list event
 * TAG: public
 * =========================
 * @param {string} - event name
 * @param {function} - event listener
 * @param {boolean} - use capture
 * @return {void}
 */
List2Ctrl.prototype.addEventListener = function(type, listener, useCapture)
{
  const listeners = this._getListeners(type, useCapture);
  const ix = listeners.indexOf(listener);
  if (-1 === ix)
  {listeners.push(listener);}
};

/**
 * Remove event listener to custom list event
 * TAG: public
 * =========================
 * @param {string} - event name
 * @param {function} - event listener
 * @param {boolean} - use capture
 * @return {void}
 */
List2Ctrl.prototype.removeEventListener = function(type, listener, useCapture)
{
  const listeners = this._getListeners(type, useCapture);
  const ix = listeners.indexOf(listener);
  if (-1 !== ix)
  {listeners.splice(ix, 1);}
};

/**
 * Displatch custom list event
 * TAG: public
 * =========================
 * @param {object} - event object
 * @return {boolean}
 */
List2Ctrl.prototype.dispatchEvent = function(evt)
{
  const listeners = this._getListeners(evt.type, false).slice();
  for (let i= 0; i<listeners.length; i++)
  {listeners[i].call(this, evt);}
  return !evt.defaultPrevented;
};


/**
 * =========================
 * PUBLIC API
 * 1. Data List API (setDataList, hasDataList, updateItems, setDataListAndUpdateItems)
 * 2. Letter Index API (setLetterIndexData)
 * 3. Voice API (selectLine, pageDown, pageUp)
 * 4. Slider / Toggle API (setSliderValue, setToggleValue, setCheckBox, setRadio)
 * 5. Focus API (hideFocus, restoreFocus)
 * 6. Reporting API (getTitleCanvas, getItemByData, getItemsByType, getEmptyRange, getFilledRange)
 * 7. Other (setTitle)
 * 8. Context capture & restore
 * 9. Background API
 * =========================
 */


/** 1. DATA LIST API **/

/**
 * Binds dataList to the list control. It must be a dataList object.
 * When the list control has previous dataList set, it gets cleared and
 * replaced with the new one. The currently displayed items gets removed from
 * the DOM and data from the new dataList is taken to be displayed on the screen.
 * The list gets scrolled to the position it was immediately prior to the
 * invoking of the method and the focus gets restored. If the new dataList has
 * fewer items than the old one, the list is scrolled to the
 * top and the focus is restored at the top.
 * =========================
 * @param {object} - dataList object
 * @return {void}
 */

List2Ctrl.prototype.setDataList = function(dataList)
{
  /*
     * Sample data-list structure:
     * {
     *   itemCountKnown : true,
     *   itemCount : 10,
     *   items : []
     * }
     */

  // validate dataList
  if (null === dataList || undefined === dataList || typeof dataList !== 'object')
  {
    log.warn(this.uiaId + ': dataList cannot be null, undefined or not an object. "' + dataList + '" passed to setDataList() API.');
    return;
  }

  // scroll to the top if possible
  if (this.hasDataList())
  {
    this.topItem = 0;
  }

  // ensure correct config
  if (!dataList.hasOwnProperty('itemCountKnown') && !dataList.hasOwnProperty('itemCount') && !dataList.hasOwnProperty('items'))
  {
    dataList.itemCountKnown = true;
    dataList.itemCount = 0;
    dataList.items = [];
    dataList.vuiSupport = true;
  }

  // protect data list items by cloning the items array
  if (this.properties.protectDataList && dataList.hasOwnProperty('items') && dataList.items instanceof Array)
  {
    // rebuild dataList object from scratch
    const tmpDataList = {};
    tmpDataList.itemCountKnown = dataList.hasOwnProperty('itemCountKnown') ? dataList.itemCountKnown : true;
    tmpDataList.itemCount = dataList.hasOwnProperty('itemCount') ? dataList.itemCount : 0;
    tmpDataList.items = dataList.hasOwnProperty('items') ? dataList.items.slice() : [];
    tmpDataList.vuiSupport = dataList.hasOwnProperty('vuiSupport') ? dataList.vuiSupport : true;
    dataList = tmpDataList;
  }

  // show loading if itemCountKnown == false
  if (!dataList.itemCountKnown)
  {
    this._setLoading(true);
  }

  // truncate dataList if itemCount is less than the items length
  if (dataList.itemCountKnown && dataList.itemCount < dataList.items.length)
  {
    dataList.items = dataList.items.slice(0, dataList.itemCount);
    console.assert(dataList.itemCount == dataList.items.length, 'dataList.itemCount is not equal to dataList.items.length');
  }

  // add additional empty items if the number is not enough to reach the itemCount
  if (dataList && dataList.itemCountKnown && dataList.itemCount > dataList.items.length)
  {
    for (let i=dataList.items.length; i<dataList.itemCount; i++)
    {
      dataList.items[i] = {itemStyle: 'empty'};
    }
  }

  // save dataList into the local dataList property
  this.dataList = dataList;

  // dispatch dataList change event
  this._listEvent(this._EVENTS.DATALIST_CHANGE);

  // reset _hasFill property
  this._hasFill = false;

  // prepare scroller to accomodate all list items
  if (this.dataList.itemCountKnown && this.dataList.itemCount >= 0)
  {
    // force exit secondary multicontroller
    this._inSecondaryMulticontroller = false;

    this._setScrollerHeight();
    this._emptyScroller();
    this._scrollIndicatorReset();
    if (0 === this.dataList.itemCount)
    {
      this._scrollIndicatorBuild(false);
    }
    else
    {
      this._scrollIndicatorBuild(true);
    }

    // set line numbers
    this.setLineNumbers();
  }
};

List2Ctrl.prototype.hasDataList = function()
{
  if (this.dataList == null)
  {
    return false;
  }

  if (!this.dataList.hasOwnProperty('itemCountKnown') && !this.dataList.hasOwnProperty('itemCount') && !this.dataList.hasOwnProperty('items'))
  {
    return false;
  }

  if (this.dataList.itemCountKnown && this.dataList.itemCount == 0)
  {
    return false;
  }

  if (!this.dataList.itemCountKnown && this.dataList.itemCount <= 0)
  {
    return false;
  }

  return true;
};

/**
 * Update Items
 *
 * This is intended to be used whenever the bound data is changed programmatically by the app. In other words,
 * it informs the control that bound data has changed … and if the range of changed items overlaps with items
 * rendered into HTML objects, then the ListMenu must update those elements. There are several use cases for this:
 *
 * 1. For the case where the dataList is fetched asynchronously in the background after ListMenu is displayed,
 * the updateItems() API will be called as new data arrives. I think this use case is described fairly completely
 * in section 2.2.4 of the ListMenu SDD. Note that these updates may correspond to the user scrolling, or may simply
 * occur in the background as the list is loaded into GUI while the user is still looking at the first N list items.
 * Also note that the listCount can change and the ListMenu control must adapt appropriately, including handling
 * reduction of the list count.
 *
 * 2. To allow the application to update menu text dynamically, e.g. to display the name of the connected USB
 * Audio device instead of “USB”, or to change the displayed image(s).
 *
 * 3. To allow the application to enable/disable menu items or to set/clear the “selected” indicator.
 *
 * =========================
 * @param {integer}
 * @param {integer}
 * @return {void}
 */
List2Ctrl.prototype.updateItems = function(firstItem, lastItem)
{
  log.debug('List2 updateItems() firstItem, lastItem', firstItem, lastItem);
  // update _maxScrollY
  this._maxScrollY = this.mask.offsetHeight - this.scroller.offsetHeight;

  let emptyDOMItem = null;

  // clear _needDataTimeoutId
  clearTimeout(this._needDataTimeoutId);
  this._needDataTimeoutId = null;

  this._prepareItems(firstItem, lastItem);
  this._localizeItems(firstItem, lastItem);

  // trim dataList.items if it is larger than dataList.itemCount
  if (this.dataList &&
        this.dataList.itemCountKnown &&
        this.dataList.items &&
        this.dataList.itemCount < this.dataList.items.length)
  {
    this.dataList.items = this.dataList.items.slice(0, this.dataList.itemCount);
    console.assert(this.dataList.itemCount == this.dataList.items.length, 'dataList.itemCount is not equal to dataList.items.length');
  }

  // validate first item
  if (this.dataList.itemCountKnown && firstItem < -1)
  {
    log.warn('List2: firstItem is less than -1: ' + firstItem + ' passed. Setting it to -1.');
    firstItem = -1;
  }

  // validate last item
  if (this.dataList.itemCountKnown && lastItem >= this.dataList.itemCount)
  {
    log.warn('List2: lastItem is more than or equals dataList.itemCount(' + (this.dataList.itemCount-1) + '): ' + lastItem + ' passed. Setting it to ' + (this.dataList.itemCount - 1) + '. ' + this.uiaId + ' check your variable validation!?');
    lastItem = this.dataList.itemCount - 1;
  }


  // check for invalid items (e.g. firstItem=0, lastItem=-1) -> set loading
  if (firstItem > lastItem)
  {
    firstItem = lastItem = -1;
  }

  if (firstItem == -1 && lastItem == -1)
  {
    // we have dataList but no list items => show loading
    this._setLoading(true);
  }
  else if (firstItem >= 0 && lastItem >= 0 && lastItem >= firstItem && !this._hasFill)
  {
    // we have dataList and we have list items but we do not have fill => do initial fill
    const lastFillItem = this.m.min(lastItem, this.properties.itemsBefore + this.properties.itemsAfter);

    this._fill(firstItem, lastFillItem);
    this._setLoading(false);

    // update modified timestamps
    this._updateModifiedTimestamps(firstItem, lastItem);

    if (this.properties.focussedItem < this.dataList.itemCount)
    {
      this.properties.focussedItem = this._canGainFocus(this.properties.focussedItem);
    }
    else
    {
      this.properties.focussedItem = this.dataList.itemCount - 1;
      this.properties.focussedItem = this._canGainFocus(this.properties.focussedItem);
    }
    /*
         * Immediately scroll to a preset location and
         * show focus on preset item if this is specified
         * in the control's config. Focus placement needs to be done
         * after the DOM is refreshed. This is done only the
         * first time after a fresh setDataList() call.
         * Focussed item has precedence over scroll location.
         */
    if (null === this._initialScrollMode)
    {
      // first check if the focussed item and the scroll position are all on the same screen
      // scroll to that position and show the focus according to the config
      if ( (this.properties.focussedItem >= 0 || this.properties.scrollTo >= 0) &&
                 (this.m.abs(this.properties.focussedItem - this.properties.scrollTo) <= (this.properties.visibleItems - 1)) )
      {
        log.debug('Focus is visible on screen');
        this._scrollTo(this.properties.scrollTo, 0);
        setTimeout(function() {
          this._showFocus(this.properties.focussedItem);
        }.bind(this), 0);
        this._initialScrollMode = 'config';
      }
      // set initial focus to a particular item if this is set in the config
      // the list will be scrolled so that this item is visible
      else if (this.properties.focussedItem >= 0)
      {
        log.debug('Focus is not visible and has priority');
        setTimeout(function() {
          this._showFocus(this.properties.focussedItem);
        }.bind(this), 0);
        this._initialScrollMode = 'config';
      }
      // scroll (no animation) to a particular item if this is set in the config
      // the focus will be placed on the top item
      else if (this.properties.scrollTo >= 0)
      {
        log.debug('Focus is 0 and scrollTo has priority');
        this._scrollTo(this.properties.scrollTo, 0);
        setTimeout(function() {
          this._topItem = this._canGainFocus(this._topItem);
          this._showFocus(this._topItem);
        }.bind(this), 0);
        this._initialScrollMode = 'config';
      }
    }
    // sync the top item with focus if not in initial mode any more
    // enter in this case usualy when a new data list is set
    else
    {
      const focussedItem = this.focussedItem;
      const topInFocusRange = focussedItem >= this.topItem && focussedItem < this.topItem + this.properties.visibleItems - 1;
      const prevTopInFocusRange = focussedItem >= this._prevTopItem && focussedItem < this._prevTopItem + this.properties.visibleItems - 1;
      if (!topInFocusRange && !prevTopInFocusRange)
      {
        this.topItem = focussedItem;
      }
      else if (!topInFocusRange && prevTopInFocusRange)
      {
        this.topItem = this._prevTopItem;
      }
    }

    // check for empty items in DOM
    emptyDOMItem = this._getEmptyDOMElement();
  }
  else if (firstItem >= 0 && lastItem >= 0 && lastItem >= firstItem)
  {
    // preserve focussed element
    const lastFocussedIndex = this._getFocussedIndex();

    // we have dataList and we have list items, and we have fill => perform update
    this._updateDisplay(firstItem, lastItem);
    this._setLoading(false);

    // update modified timestamps
    this._updateModifiedTimestamps(firstItem, lastItem);

    // restore focussed element
    if (!this._inLetterIndexMulticontroller && !this._inSecondaryMulticontroller)
    {
      this._showFocus(lastFocussedIndex, true);
    }
    else if (this._inSecondaryMulticontroller)
    {
      // treat disabling the secondary multicontroller item as interrupt -> commit value and exit
      const smi = this._currentSecondaryMulticontrollerItem;
      if (this.dataList.items[smi] && this.dataList.items[smi].disabled)
      {
        this._setSecondaryMulticontroller(false, smi);
        this._showFocus(smi, true);
      }
      else if (this.dataList.items[smi])
      {
        this._setSecondaryMulticontroller(true, smi);
      }
    }

    // check for empty items in DOM
    emptyDOMItem = this._getEmptyDOMElement();
  }
  else
  {
    log.error(this.uiaId + ' called List2 updateItems() with invalid arguments: firstItem = ' + firstItem + ', lastItem = ' + lastItem);
  }

  // suppress secondary item request when the list is in reorder mode
  if (this.properties.enableSecondaryItemRequest && !this._inListReorder)
  {
    // do we have empty DOM items?
    if (null == emptyDOMItem)
    {
      // clear _secondaryRequestCount
      this._secondaryRequestCount = 0;
    }
    else if (this._secondaryRequestCount <= this.properties.secondaryRequestLimit)
    {
      // fire needDataCallback() if an empty item is found in the DOM
      this._requestMore(emptyDOMItem);
      // increment _secondaryRequestCount
      this._secondaryRequestCount++;
    }
    else
    {
      log.warn('Lis2: control has reached the secondary request count limit. Enabling the list');
      // we have reached secondaryRequestLimit -> set loading to False
      this._setLoading(false);
    }
  }

  // restore the focus to the last focussed element
  if (!this._inLetterIndexMulticontroller && !this._inSecondaryMulticontroller)
  {
    this._showFocus(this._lastItemWithFocus, true);
  }
};

/**
 * SW00174004
 * Combines both the data binding & scroller/scroll indicator initialization of setDataList()
 * with the effects of updateItems() on the displayed list items.  Why is this API needed?
 * 1)  updateItems() does not properly handle lists whose length is different than the list
 *     used in a prior setDataList() call.  Therefore, applications wishing to repeatedly
 *     update lists of varying lengths (e.g. fuel stations in a certain radius) must use both
 *     setDataList() (to set the length of the list properly) and updateItems() (to actually
 *     apply the updated data to the control).
 * 2)  setDataList() destroys & re-creates/re-sizes the scroll indicator; a side effect of this
 *     processing is to position the scroll indicator at the top of the list.  When the sequence
 *     outlined in 1) above occurs, an undesirable visual "flicker" appears as updateItems()
 *     repositions the scroll indicator in its original position.  This API streamlines the
 *     processing to avoid the unnecessary scroll indicator positioning, eliminating the flicker.
 * 3)  Rather than perform surgery on setDataList() and updateItems(), affecting every list in
 *     the GUI and requiring a large regression effort, a new API (used only in required
 *     circumstances) is far less risky.
 * =========================
 * @param {object} - dataList object (as required by setDataList())
 * @return {void}
 */

List2Ctrl.prototype.setDataListAndUpdateItems = function(dataList)
{
  log.info('List2Ctrl.setDataListAndUpdateItems(dataList): ', dataList);
  // validate dataList
  if (null === dataList || undefined === dataList || typeof dataList !== 'object')
  {
    log.warn(this.uiaId + ': dataList cannot be null, undefined or not an object. "' + dataList + '" passed to setDataListAndUpdateItems() API.');
    return;
  }

  // ensure correct config
  if (!dataList.hasOwnProperty('itemCountKnown') &&
        !dataList.hasOwnProperty('itemCount') &&
        !dataList.hasOwnProperty('items'))
  {
    dataList.itemCountKnown = true;
    dataList.itemCount = 0;
    dataList.items = [];
    dataList.vuiSupport = true;
  }

  // protect data list items by cloning the items array
  if (this.properties.protectDataList &&
        dataList.hasOwnProperty('items') &&
        dataList.items instanceof Array)
  {
    // rebuild dataList object from scratch
    const tmpDataList = {};
    tmpDataList.itemCountKnown = dataList.hasOwnProperty('itemCountKnown') ? dataList.itemCountKnown : true;
    tmpDataList.itemCount = dataList.hasOwnProperty('itemCount') ? dataList.itemCount : 0;
    tmpDataList.items = dataList.hasOwnProperty('items') ? dataList.items.slice() : [];
    tmpDataList.vuiSupport = dataList.hasOwnProperty('vuiSupport') ? dataList.vuiSupport : true;
    dataList = tmpDataList;
  }

  // show loading if itemCountKnown == false
  if (!dataList.itemCountKnown)
  {
    this._setLoading(true);
  }

  // truncate dataList if itemCount is less than the items length
  if (dataList.itemCountKnown && dataList.itemCount < dataList.items.length)
  {
    dataList.items = dataList.items.slice(0, dataList.itemCount);
    console.assert(dataList.itemCount == dataList.items.length, 'dataList.itemCount is not equal to dataList.items.length');
  }

  // add additional empty items if the number is not enough to reach the itemCount
  if (dataList && dataList.itemCountKnown && dataList.itemCount > dataList.items.length)
  {
    for (let i=dataList.items.length; i<dataList.itemCount; i++)
    {
      dataList.items[i] = {itemStyle: 'empty'};
    }
  }

  // save dataList into the local dataList property
  this.dataList = dataList;

  // scroll to the top if possible
  if (this.hasDataList())
  {
    if (this.dataList.items.length > this.properties.visibleItems)
    {
      // Set the top list item to zero, but don't actually perform the scroll.
      // We do it this way to make the math come out right later, without a
      // visible "flicker" in the scroll indicator position (SW00174004)
      this._setTopListItem(0);
    }
    else
    {
      this.topItem = 0;
    }
  }

  // dispatch dataList change event
  this._listEvent(this._EVENTS.DATALIST_CHANGE);

  // reset _hasFill property
  this._hasFill = false;

  // prepare scroller to accomodate all list items
  if (dataList.itemCountKnown && dataList.itemCount >= 0)
  {
    // force exit secondary multicontroller
    this._inSecondaryMulticontroller = false;

    this._setScrollerHeight();
    this._emptyScroller();
    if (this._prevItemIdx > dataList.itemCount)
    {
      this._scrollIndicatorReset();
    }
    if (0 === dataList.itemCount)
    {
      this._scrollIndicatorBuild(false);
    }
    else
    {
      this._scrollIndicatorBuild(true);
    }

    // set line numbers
    this.setLineNumbers();

    // Immediately update all of the items
    this.updateItems(0, dataList.itemCount - 1);
  }

  log.info('end List2Ctrl.setDataListAndUpdateItems()');
};

/** 2. LETTER INDEX API **/

/**
 * Set letter index data on demand, filling letters in the letter index area
 * and assigning jump indices to them, so that when touched or selected
 * by multicontroller, the list jumps to the respective index.
 * TAG: public
 * =========================
 * @param {data} - letter index data object
 * @return {boolean} - True if letter index binding operation is a success
 */
List2Ctrl.prototype.setLetterIndexData = function(data)
{
  // validate input
  if (!(data instanceof Array))
  {
    log.error('Lis2: letter index data should be a valid array');
    return false;
  }

  // validate control support
  if (!this.properties.hasLetterIndex)
  {
    log.error('Lis2: list2 does not support letter index');
    return false;
  }

  // reset any previous letter index data
  this._letterIndexDataSorted = [];
  this.letterIndexData = [];
  this.letterIndex.innerText = '';

  let letterIndexItem;
  let label;
  for (let i=0, l=data.length; i<l; i++)
  {
    // skip improper items
    if (!data[i].hasOwnProperty('label') || null == data[i].label || '' == data[i].label)
    {
      log.warn('Lis2: wrong letter index item. Skipping to next one');
      continue;
    }

    // create DOM item
    letterIndexItem = document.createElement('li');
    letterIndexItem.classList.add('letter');
    if (data[i].itemIndex < 0)
    {
      letterIndexItem.classList.add('disabled');
    }
    letterIndexItem.setAttribute('data-index', data[i].itemIndex);
    letterIndexItem.appendChild(document.createTextNode(data[i].label));
    this.letterIndex.appendChild(letterIndexItem);

    // add to letterIndexData
    this.letterIndexData[this.letterIndexData.length] = {
      domElt: letterIndexItem,
      itemIndex: data[i].itemIndex,
      label: data[i].label.toString(),
      disabled: (data[i].itemIndex < 0),
    };

    // also add to private letter index that will later be sorted, keeping reference to the public letter index key
    if (data[i].itemIndex >= 0)
    {
      this._letterIndexDataSorted[this._letterIndexDataSorted.length] = {
        publicIndex: this.letterIndexData.length-1,
        itemIndex: data[i].itemIndex,
      };
    }
  }

  // sort private and filtered letter index by the itemIndex in ASC order
  this._letterIndexDataSorted.sort(function(a, b) {
    let compRes = 0;
    if (a.itemIndex < b.itemIndex)
    {compRes = -1;}
    else if (a.itemIndex > b.itemIndex)
    {compRes = 1;}
    else
    {compRes = 0;}
    return compRes;
  });

  // set letter index scroller height
  const additionalSpace = Math.ceil(this.properties.letterIndexHeight / 2) - 5; // adjusting factor
  this.letterIndex.style.height = i * this.properties.letterIndexHeight + additionalSpace + 'px';
  this._scrollerHIndex = this.letterIndex.offsetHeight;

  // update _maxScrollYIndex
  this._maxScrollYIndex = this.letterIndexWrapper.offsetHeight - this.letterIndex.offsetHeight;

  // set initial active letter index if there are any available
  if (this.hasDataList() && this._letterIndexDataSorted.length)
  {
    // get current focus index and first letter index
    const focussedIndex = this._getFocussedIndex();
    const firstIndex = this._letterIndexDataSorted[0].itemIndex;

    if (firstIndex > 0 && focussedIndex < firstIndex)
    {
      this._setLetterIndexPosition(firstIndex);
    }
    else
    {
      this._setLetterIndexPosition(focussedIndex);
    }
  }
  else if (this._letterIndexDataSorted.length)
  {
    this._setLetterIndexPosition(this._letterIndexDataSorted[0].itemIndex);
  }
};


/** 3. VOICE API **/

/**
 * Set left button configuration depending on current list configuration:
 * title style, visible items, item count, item thickness
 * TAG: public, VUI
 * =========================
 * @return {void}
 */
List2Ctrl.prototype.setLineNumbers = function()
{
  // check if we need to show numbers
  if (!this.properties.numberedList)
  {
    return;
  }

  // check if we have some items to number
  if (!this.dataList.hasOwnProperty('itemCount') || this.dataList.itemCount <= 0)
  {
    return;
  }


  let style = '';
  let maxItemCount = 0;

  // determine max item count and style
  switch (this.properties.titleConfiguration)
  {
    case 'noTitle':
      maxItemCount = this.properties.thickItems ? 5 : 6;
      style = this.properties.thickItems ? 'Style02' : 'Style04';
      break;
    case 'tabsTitle':
      maxItemCount = this.properties.thickItems ? 4 : 5;
      style = this.properties.thickItems ? 'Style01' : 'Style03';
      break;
    case 'listTitle':
      switch (this._currentTitle.titleStyle)
      {
        case 'style02':
        case 'style02a':
        case 'style03':
        case 'style03a':
        case 'style12':
          maxItemCount = this.properties.thickItems ? 4 : 5;
          style = this.properties.thickItems ? 'Style01' : 'Style03';
          break;
        case 'style05':
        case 'style08':
          maxItemCount = 4;
          style = this.properties.thickItems ? 'Style07' : 'Style06';
          break;
        case 'style06':
        case 'style07':
          maxItemCount = 3;
          style = this.properties.thickItems ? 'Style09' : 'Style08';
          break;
        default:
          log.warn('Lis2: unknown title style: ' + this._currentTitle.titleStyle);
          return;
          break;
      }
      break;
    default:
      log.warn('Lis2: unknown title configuration: ' + this.properties.titleConfiguration);
      return;
      break;
  }

  // get actual item count
  const itemCount = this.m.min(this.dataList.itemCount, maxItemCount);

  // check for common API
  if (framework.common.setLineNumbers)
  {
    // call LeftBtnCtrl to show list numbers
    return framework.common.setLineNumbers(itemCount, style);
  }
};

/**
 * Performs select on the specified line number. When the select callback is fired,
 * fromVui parameter is set to true. The function can return several possible
 * statuses depending on the output of the operation.
 * TAG: public, VUI
 * =========================
 * @param {integer} - the line number that needs to be selected
 * @return {string} - 'selected', 'outOfRange', 'disabled', 'sendAck', 'noList'
 */
List2Ctrl.prototype.selectLine = function(lineNumber)
{
  // get target item
  const targetIndex = this._topItem + (lineNumber - 1);

  // decide what to return depending on what's visible
  let status;

  // check if the list supports line numbers
  if (!this.hasDataList())
  {
    status = 'noList';
    log.debug('Lis2: selectLine() called with no list on the screen');
  }
  else if (!this.dataList.vuiSupport)
  {
    status = 'noList';
    log.debug('Lis2: no VUI support for this list');
  }
  else if (targetIndex > this.dataList.itemCount - 1 || targetIndex < 0)
  {
    status = 'outOfRange';
    log.debug('Lis2: line number out of range');
  }
  else if (targetIndex < this._topItem || targetIndex > this._topItem + this.properties.visibleItems)
  {
    status = 'outOfRange';
    log.debug('Lis2: line number out of range');
  }
  else if (!this.dataList.items[targetIndex].vuiSelectable)
  {
    status = 'notSelectable';
    log.debug('Lis2: list item is not VUI selectable');
  }
  else if (this.dataList.items[targetIndex].disabled)
  {
    status = 'disabled';
    log.debug('Lis2: list item is disabled');
    this._itemSelect(targetIndex, {fromVui: true, vuiStatus: status});
  }
  else
  {
    // default status is 'selected' -> if the item is not selectable, the callback will not be fired
    const selectResult = this._itemSelect(targetIndex, {fromVui: true, vuiStatus: 'selected'});
    if (true === selectResult)
    {
      // normal enabled status
      status = 'selected';
    }
    else if (false === selectResult)
    {
      // status if no select callback is attached
      status = 'sendAck';
    }
    else
    {
      // returned status from the select callback in the app
      status = selectResult;
    }
  }

  return status;
};

/**
 * Scrolls the list one page down. A page is the number of visible items on the screen.
 * Depending on the output of the function, several return values are possible.
 * TAG: public, VUI
 * =========================
 * @return {string} - 'paged', 'atLimit', 'onePage'
 */
List2Ctrl.prototype.pageDown = function()
{
  const status = this._scrollDownPage();
  return status;
};

/**
 * Scrolls the list one page up. A page is the number of visible items on the screen.
 * Depending on the output of the function, several return values are possible.
 * TAG: public, VUI
 * =========================
 * @return {string} - 'paged', 'atLimit', 'onePage'
 */
List2Ctrl.prototype.pageUp = function()
{
  const status = this._scrollUpPage();
  return status;
};


/** 4. SLIDER / TOGGLE API **/

/**
 * Set slider to a specific value
 * TAG: public
 * =========================
 * @param {integer} - the index of the slider/pivot item
 * @param {number} - the new value of the slider/pivot
 * @return {void}
 */
List2Ctrl.prototype.setSliderValue = function(itemIndex, value)
{
  // validate index
  if (itemIndex < 0 || itemIndex >= this.dataList.itemCount)
  {
    log.warn('Lis2: item index out of bounds');
    return;
  }

  // get item
  const item = this.dataList.items[itemIndex];

  // validate item
  if (!this._isSlider(itemIndex))
  {
    log.warn(this.uiaId + ': Lis2: only sliders/pivots can be used in the Slider API. Item style ' + item.itemStyle + ' passed');
    return;
  }

  const slider = this._getSlider(itemIndex);
  if (slider)
  {
    slider.setValue(value);
  }
  else
  {
    log.error(this.uiaId + ': Lis2: could not get slider instance for itemIndex ' + itemIndex);
  }
};


/**
 * Set toggle to a specific value
 * TAG: public
 * =========================
 * @param {integer} - the index of the toggle item
 * @param {number} - the new value of the toggle
 * @return {void}
 */
List2Ctrl.prototype.setToggleValue = function(itemIndex, value)
{
  // validate index
  if (itemIndex < 0 || itemIndex >= this.dataList.itemCount)
  {
    log.debug('Item index out of bounds');
    return;
  }

  // get item
  const item = this.dataList.items[itemIndex];

  // validate item
  if (!this._isToggle(itemIndex) && item.itemStyle != 'styleOnOff')
  {
    log.warn('Lis2: only toggle items can be used in the Toggle API');
    return;
  }

  // exit if we don't have _data property
  if (!this._hasData(itemIndex))
  {
    return;
  }

  // normalize value
  if (item.itemStyle == 'style10')
  {
    const value = this.m.max(this.m.min(value, 2), 1);
  }
  else if (item.itemStyle == 'style11')
  {
    const value = this.m.max(this.m.min(value, 3), 1);
  }
  else if (item.itemStyle == 'styleOnOff')
  {
    const value = this.m.max(this.m.min(value, 2), 1);
  }

  // cache value
  item._data.settleValue = value;

  // perform inbound event filtering
  if (!this._hasSettleTimeout(itemIndex, 'toggle'))
  {
    // settle item immediately
    this._settleItem(itemIndex);
  }
};


/**
 * Set checked state for a checkbox item (style03 and style03a)
 * TAG: public
 * =========================
 * @param {integer} - the index of the checkbox item
 * @param {boolean} - TRUE for checked
 * @return {void}
 */
List2Ctrl.prototype.setCheckBox = function(itemIndex, value)
{
  // validate index
  if (itemIndex < 0 || itemIndex >= this.dataList.itemCount)
  {
    log.warn('Lis2: item index out of bounds');
    return;
  }

  // get item
  const item = this.dataList.items[itemIndex];

  // validate item
  if (!this._isCheckBox(itemIndex))
  {
    log.warn('Lis2: only checkbox or radio items can be used in the CheckBox API');
    return;
  }

  // exit if we don't have _data property
  if (!this._hasData(itemIndex))
  {
    return;
  }

  // cast as boolean
  const value = Boolean(value);

  // cache value
  item._data.settleValue = value;

  // perform inbound event filtering
  if (!this._hasSettleTimeout(itemIndex, 'checkbox'))
  {
    // settle item immediately
    this._settleItem(itemIndex);
  }
};


/**
 * Set checked state for a checkbox item (style03 and style03a)
 * TAG: private
 * =========================
 * @param {integer} - the index of the checkbox item
 * @param {boolean} - TRUE for checked
 * @return {void}
 */
List2Ctrl.prototype._setCheckBox = function(itemIndex, value)
{
  // validate index
  if (itemIndex < 0 || itemIndex >= this.dataList.itemCount)
  {
    log.warn('Lis2: item index out of bounds');
    return;
  }

  // get item
  const item = this.dataList.items[itemIndex];

  // validate item
  if (!this._isCheckBox(itemIndex))
  {
    log.warn('Lis2: only checkbox or radio items can be used in the CheckBox API');
    return;
  }

  // cast as boolean
  const value = Boolean(value);

  // set value
  item.checked = value;

  // update item
  this.updateItems(itemIndex, itemIndex);
};


/**
 * Set checked state for a radio item (style03 and style03a)
 * TAG: public
 * =========================
 * @param {integer} - the index of the radio item
 * @param {boolean} - TRUE for checked
 * @return {void}
 */
List2Ctrl.prototype.setRadio = function(itemIndex, value)
{
  // validate index
  if (itemIndex < 0 || itemIndex >= this.dataList.itemCount)
  {
    log.warn('Lis2: item index out of bounds');
    return;
  }

  // get item
  const item = this.dataList.items[itemIndex];

  // validate item
  if (!this._isCheckBox(itemIndex))
  {
    log.warn('Lis2: only checkbox or radio items can be used in the CheckBox API');
    return;
  }

  // exit if we don't have _data property
  if (!this._hasData(itemIndex))
  {
    return;
  }

  // cast as boolean
  const value = Boolean(value);

  // cache value
  item._data.settleValue = value;

  // perform inbound event filtering
  if (!this._hasSettleTimeout(itemIndex, 'radio'))
  {
    // settle item immediately
    this._settleItem(itemIndex);
  }
};

/**
 * Set checked state for a radio item (style03 and style03a)
 * TAG: private
 * =========================
 * @param {integer} - the index of the radio item
 * @param {boolean} - TRUE for checked
 * @return {void}
 */
List2Ctrl.prototype._setRadio = function(itemIndex, value)
{
  // cast as boolean
  const value = Boolean(value);

  // remove checked state of all radio items
  for (let i=0; i<this.dataList.itemCount; i++)
  {
    if (this._isCheckBox(i) && 'radio' === this.dataList.items[i].image1)
    {
      if (i === itemIndex)
      {
        // set to value
        this.dataList.items[i].checked = value;

        // update item
        this.updateItems(i, i);
      }
      else if (false != this.dataList.items[i].checked)
      {
        // set to false the previous TRUE item
        this.dataList.items[i].checked = false;

        // update item
        this.updateItems(i, i);
      }
    }
  }
};

/**
 * Set checked state for a tick item (style03 and style03a)
 * TAG: public
 * =========================
 * @param {integer} - the index of the tick item
 * @param {boolean} - TRUE for checked
 * @return {void}
 */
List2Ctrl.prototype.setTick = function(itemIndex, value)
{
  // validate index
  if (itemIndex < 0 || itemIndex >= this.dataList.itemCount)
  {
    log.warn('Lis2: item index out of bounds');
    return;
  }

  // get item
  const item = this.dataList.items[itemIndex];

  // validate item
  if (!this._isCheckBox(itemIndex))
  {
    log.warn('Lis2: only checkbox or radio items can be used in the CheckBox API');
    return;
  }

  // exit if we don't have _data property
  if (!this._hasData(itemIndex))
  {
    return;
  }

  // cast as boolean
  const value = Boolean(value);

  // cache value
  item._data.settleValue = value;

  // perform inbound event filtering
  if (!this._hasSettleTimeout(itemIndex, 'tick'))
  {
    // settle item immediately
    this._settleItem(itemIndex);
  }
};

/**
 * Set checked state for a tick item (style03 and style03a)
 * TAG: private
 * =========================
 * @param {integer} - the index of the tick item
 * @param {boolean} - TRUE for checked
 * @return {void}
 */
List2Ctrl.prototype._setTick = function(itemIndex, value)
{
  // cast as boolean
  const value = Boolean(value);

  // remove checked state of all radio items
  for (let i=0; i<this.dataList.itemCount; i++)
  {
    if (this._isCheckBox(i) && 'tick' === this.dataList.items[i].image1)
    {
      if (i === itemIndex)
      {
        // set to value
        this.dataList.items[i].checked = value;

        // update item
        this.updateItems(i, i);
      }
      else if (false != this.dataList.items[i].checked)
      {
        // set to false the previous TRUE item
        this.dataList.items[i].checked = false;

        // update item
        this.updateItems(i, i);
      }
    }
  }
};


/** 5. FOCUS API **/

/**
 * Hide focus
 * Forces the list control to lose focus.
 * The last focused item can be restored by
 * using the restoreFocus() method
 * TAG: public
 * =========================
 * @return {integer} - Last focussed item
 */
List2Ctrl.prototype.hideFocus = function()
{
  // hide the focus
  this._hideFocus();
  this._hasFocus = false;

  // return last focussed item
  return this._lastItemWithFocus;
};

/**
 * Restore focus
 * Restores the focus to the last focused item
 * before the list control looses focus
 * TAG: public
 * =========================
 * @return {integer} - currently focussed item
 */
List2Ctrl.prototype.restoreFocus = function()
{
  // restore the focus to the last focussed element
  this._showFocus(this._lastItemWithFocus);

  // return currently focussed item
  return this._getFocussedIndex();
};


/** 6. REPORTING API **/

/**
 * Get title canvas
 * If the title has a configuration allowing canvas element,
 * this method returns it so that it can be drawn onto.
 * TAG: public
 * =========================
 * @return {HTML Canvas element}
 */
List2Ctrl.prototype.getTitleCanvas = function()
{
  return this.titleCanvas;
};

/**
 * Get item by data
 * search the data list for an item containing certain data
 * TAG: public
 * =========================
 * @param {string} - the data string to look for
 * @return {object} - { itemId:Number, item:Object }
 */
List2Ctrl.prototype.getItemByData = function(data)
{
  let item = null;
  const data = (typeof data === 'object' && data != null) ? JSON.stringify(data) : data;

  for (let i=0, l=this.dataList.items.length; i<l; i++)
  {
    const currentAppData = (typeof this.dataList.items[i].appData === 'object' && this.dataList.items[i].appData != null) ? JSON.stringify(this.dataList.items[i].appData) : this.dataList.items[i].appData;
    if (data === currentAppData)
    {
      item = {
        itemId: i,
        item: this.dataList.items[i],
      };
      break;
    }
  }
  return item;
};

/**
 * Get items by type
 * search the data list for items of a particular type
 * TAG: public
 * =========================
 * @param {string} - the type of the items to look for
 * @return {array} - [index1, index2]
 */
List2Ctrl.prototype.getItemsByType = function(itemType)
{
  const items = [];

  for (let i=0, l=this.dataList.items.length; i<l; i++)
  {
    if (this.dataList.items[i].itemStyle === itemType)
    {
      items[items.length] = i;
    }
  }

  return items;
};

/**
 * Get empty range
 * traverse the dataList.items for empty items and returns
 * an array of empty-item ranges
 * TAG: public
 * =========================
 * @return {array} - Array([firstEmpty, lastEmpty], [firstEmpty, lastEmpty])
 */
List2Ctrl.prototype.getEmptyRange = function()
{
  const ranges = [];
  const currentRange = [];

  for (let i=0, l=this.dataList.items.length; i<l; i++)
  {
    // check if the item is empty
    if (this.dataList.items[i].text1 == '' && this._displayWithoutText(this.dataList.items[i]))
    {
      // empty item encountered -> start the range if not already started
      if (currentRange.length == 0)
      {
        // set first index to the range start
        currentRange[0] = i;
      }

      // if this is the last iteration and we are still in an empty range -> close currentRange
      if (i == l-1 && currentRange.length == 1)
      {
        // set second index to the range end
        currentRange[1] = i;

        // push currentRange to the ranges
        ranges[ranges.length] = [currentRange[0], currentRange[1]];

        // reset current range
        currentRange.length = 0;
      }
    }
    else
    {
      // filled item encountered -> end the range if started
      if (currentRange.length == 1)
      {
        // set second index to the range end
        currentRange[1] = i-1;

        // push currentRange to the ranges
        ranges[ranges.length] = [currentRange[0], currentRange[1]];

        // reset current range
        currentRange.length = 0;
      }
    }
  }

  return (ranges.length) ? ranges : null;
};

/**
 * Get filled range
 * traverse the dataList.items for filled items and returns
 * an array of filled-item ranges
 * TAG: public
 * =========================
 * @return {array} - Array([firstFilled, lastFilled], [firstFilled, lastFilled])
 */
List2Ctrl.prototype.getFilledRange = function()
{
  const ranges = [];
  const currentRange = [];

  for (let i=0, l=this.dataList.items.length; i<l; i++)
  {
    // check if the item is filled
    if (this.dataList.items[i].text1 != '' && this._displayWithoutText(this.dataList.item[i]))
    {
      // filled item encountered -> start the range if not already started
      if (currentRange.length == 0)
      {
        // set first index to the range start
        currentRange[0] = i;
      }

      // if this is the last iteration and we are still in an filled range -> close currentRange
      if (i == l-1 && currentRange.length == 1)
      {
        // set second index to the range end
        currentRange[1] = i;

        // push currentRange to the ranges
        ranges[ranges.length] = [currentRange[0], currentRange[1]];

        // reset current range
        currentRange.length = 0;
      }
    }
    else
    {
      // empty item encountered -> end the range if started
      if (currentRange.length == 1)
      {
        // set second index to the range end
        currentRange[1] = i-1;

        // push currentRange to the ranges
        ranges[ranges.length] = [currentRange[0], currentRange[1]];

        // reset current range
        currentRange.length = 0;
      }
    }
  }

  return (ranges.length) ? ranges : null;
};

/**
 * Get current focus mode
 * TAG: public
 * =========================
 * @return {string} - 'mainList' | 'letterIndex' | 'noFocus'
 */
List2Ctrl.prototype.getFocusMode = function()
{
  let currentFocusMode = 'mainList';
  if (!this._hasFocus)
  {
    currentFocusMode = 'noFocus';
  }
  else if (this._inLetterIndexMulticontroller)
  {
    currentFocusMode = 'letterIndex';
  }

  return currentFocusMode;
};


/** 7. OTHER **/

/**
 * Set loading state of the list
 * TAG: public
 * =========================
 * @param {boolean} - enable or disable loading state
 * @return {void}
 */
List2Ctrl.prototype.setLoading = function(state)
{
  // cast as boolean
  const state = Boolean(state);
  this._setLoading(state);
};


/**
 * Public API that changes the loading configuration
 * =========================
 * @param {Object} - object that will set loading item configuration
 * @return {Object} - retuns the loading configuration object
 */
List2Ctrl.prototype.setLoadingConfig = function(config)
{
  for (const i in config)
  {
    this.properties.loadingConfig[i] = config[i];
  }

  if (null !== this.properties.loadingConfig.loadingTextId && undefined !== this.properties.loadingConfig.loadingTextId && '' !== this.properties.loadingConfig.loadingTextId)
  {
    this.properties.loadingConfig.loadingText = this._getLocalizedString(this.properties.loadingConfig.loadingTextId, this.properties.loadingConfig.loadingSubMap);
  }
  this.loading.querySelector('.loadingText').innerText = '';
  this.loading.querySelector('.loadingText').appendChild(document.createTextNode(this.properties.loadingConfig.loadingText));
  this.loading.querySelector('.loadingImage1').style.backgroundImage = 'url(' + this.properties.loadingConfig.loadingImage1 + ')';

  return this.properties.loadingConfig;
};

/**
 * Enter or release reorder mode
 * TAG: public
 * =========================
 * @param {boolean} - enter or release list reorder
 * @param {boolean} - prevent item select on releasing reorder
 * @return {void}
 */
List2Ctrl.prototype.setReorder = function(state, preventSelect)
{
  // cast as boolean
  const state = Boolean(state);
  const preventSelect = Boolean(preventSelect);

  if (state && !this._inListReorder)
  {
    // if user has lost the reorder item
    if (null != this._reorderCurrentIndex && (this._reorderCurrentIndex < this._topItem || this._reorderCurrentIndex > this._topItem + this.properties.visibleItems-1))
    {
      if (this.dataList.items[this._reorderCurrentIndex] && !this.dataList.items[this._reorderCurrentIndex].disabled)
      {
        // reorder item is outside screen. Bring it back in and show focus on it
        this._showFocus(this._reorderCurrentIndex);
      }
    }

    // enter into reorder
    this._enterListReorder();
  }
  else if (!state && this._inListReorder)
  {
    // release reorder
    this._releaseListReorder(preventSelect);
  }
};

/**
 * Enter or release reorder mode
 * TAG: public
 * =========================
 * @param {boolean} - enter or release list reorder
 * @return {void}
 */
List2Ctrl.prototype.setReorderAtSpeed = function(AtSpeed)
{
  if (AtSpeed)
  {
    this._inListReorder = false;
    this._appIsAtSpeed = AtSpeed;
    this.properties.listReorder = false;
  }
  else
  {
    this._inListReorder = true;
    this._appIsAtSpeed = AtSpeed;
    this.properties.listReorder = true;
  }
};

/**
 * Set fixed title for the list
 * TAG: public
 * =========================
 * @param {object} - title properties
 * @return {void}
 */
List2Ctrl.prototype.setTitle = function(titleStructure)
{
  // validate titleStructure
  if (!titleStructure || !titleStructure.hasOwnProperty('titleStyle'))
  {
    return;
  }

  /*
     * title structure:
     * {
     *   titleStyle : 'style02',
     *   text1Id : null,
     *   text1SubMap : null,
     *   text1 : '',
     *   image1 : 'path/to/image.png'
     * }
     */

  // prepare title
  let titleStructure = titleStructure || {};
  titleStructure = this._prepareTitle(titleStructure);

  if (this._currentTitle)
  {
    // we already have a title -> update it

    // validate new title
    switch (titleStructure.titleStyle)
    {
      case 'style02':
      case 'style02a':
      case 'style03':
      case 'style12':
        // thin
        if ('style02' != this._currentTitle.titleStyle &&
                    'style02a' != this._currentTitle.titleStyle &&
                    'style03' != this._currentTitle.titleStyle &&
                    'style12' != this._currentTitle.titleStyle)
        {
          log.warn('Lis2: changing title style with a different height is not possible');
          return;
        }
        break;

      case 'style05':
      case 'style08':
        // medium
        if ('style05' != this._currentTitle.titleStyle &&
                    'style08' != this._currentTitle.titleStyle)
        {
          log.warn('Lis2: changing title style with a different height is not possible');
          return;
        }
        break;

      case 'style06':
      case 'style07':
        // thick
        if ('style06' != this._currentTitle.titleStyle &&
                    'style07' != this._currentTitle.titleStyle)
        {
          log.warn('Lis2: changing title style with a different height is not possible');
          return;
        }
        break;
    }
  }

  // empty title element
  this.title.innerText = '';
  // remove old title style class
  if (this._currentTitle)
  {
    this.title.classList.remove('warning');
    this.title.classList.remove('bold');
    this.title.classList.remove(this._currentTitle.titleStyle);
  }
  // add title style as a class
  this.title.classList.add(titleStructure.titleStyle);

  // fill it
  let line1; let line2; let image1;

  switch (titleStructure.titleStyle)
  {
    case 'style02':
      line1 = document.createElement('span');
      line1.className = 'line1';
      line1.appendChild(document.createTextNode(titleStructure.text1));
      this.title.appendChild(line1);

      // add/remove styleMod class (warning/bold/both/'')
      if ('warning' == titleStructure.styleMod)
      {
        this.title.classList.add('warning');
      }
      else if ('bold' == titleStructure.styleMod)
      {
        this.title.classList.add('bold');
      }
      else if ('both' == titleStructure.styleMod)
      {
        this.title.classList.add('warning');
        this.title.classList.add('bold');
      }
      else
      {
        this.title.classList.remove('warning');
        this.title.classList.remove('bold');
      }

      this.divElt.classList.add('listTitleNormal');

      break;

    case 'style02a':
      image1 = document.createElement('span');
      image1.className = 'image1';
      image1.style.backgroundImage = 'url(' + titleStructure.image1 + ')';
      this.title.appendChild(image1);

      line1 = document.createElement('span');
      line1.className = 'line1';
      line1.appendChild(document.createTextNode(titleStructure.text1));
      this.title.appendChild(line1);

      // add/remove styleMod class (warning/bold/both/'')
      if ('warning' == titleStructure.styleMod)
      {
        this.title.classList.add('warning');
      }
      else if ('bold' == titleStructure.styleMod)
      {
        this.title.classList.add('bold');
      }
      else if ('both' == titleStructure.styleMod)
      {
        this.title.classList.add('warning');
        this.title.classList.add('bold');
      }
      else
      {
        this.title.classList.remove('warning');
        this.title.classList.remove('bold');
      }

      this.divElt.classList.add('listTitleNormal');

      break;

    case 'style03':
      line1 = document.createElement('span');
      line1.className = 'line1';
      line1.appendChild(document.createTextNode(titleStructure.text1));
      this.title.appendChild(line1);

      image1 = document.createElement('span');
      image1.className = 'image1';
      image1.style.backgroundImage = 'url(' + titleStructure.image1 + ')';
      this.title.appendChild(image1);

      this.divElt.classList.add('listTitleNormal');

      break;

    case 'style05':
      line1 = document.createElement('span');
      line1.className = 'line1';
      line1.appendChild(document.createTextNode(titleStructure.text1));
      this.title.appendChild(line1);

      line2 = document.createElement('span');
      line2.className = 'line2';
      line2.appendChild(document.createTextNode(titleStructure.text2));
      this.title.appendChild(line2);

      image1 = document.createElement('span');
      image1.className = 'image1';
      image1.style.backgroundImage = 'url(' + titleStructure.image1 + ')';
      this.title.appendChild(image1);

      this.divElt.classList.add('listTitleMedium');

      break;

    case 'style06':

      if (titleStructure.image1 === 'canvas')
      {
        // preview image is a canvas
        image1 = document.createElement('canvas');
        image1.className = 'image1';
        // store canvas for public API call
        this.titleCanvas = image1;
        this.title.appendChild(image1);
      }
      else
      {
        // preview image is an image
        image1 = document.createElement('span');
        image1.className = 'image1';
        image1.style.backgroundImage = 'url(' + titleStructure.image1 + ')';
        this.title.appendChild(image1);
      }

      this.divElt.classList.add('listTitleThick');

      break;

    case 'style07':
      line1 = document.createElement('span');
      line1.className = 'line1';
      line1.appendChild(document.createTextNode(titleStructure.text1));
      this.title.appendChild(line1);

      line2 = document.createElement('span');
      line2.className = 'line2';
      line2.appendChild(document.createTextNode(titleStructure.text2));
      this.title.appendChild(line2);

      this.divElt.classList.add('listTitleThick');

      break;

    case 'style08':
      line1 = document.createElement('span');
      line1.className = 'line1';
      line1.appendChild(document.createTextNode(titleStructure.text1));
      this.title.appendChild(line1);

      image1 = document.createElement('span');
      image1.className = 'image1';
      image1.style.backgroundImage = 'url(' + titleStructure.image1 + ')';
      this.title.appendChild(image1);

      // add/remove styleMod class (warning/bold/both/'')
      if ('warning' == titleStructure.styleMod)
      {
        this.title.classList.add('warning');
      }
      else if ('bold' == titleStructure.styleMod)
      {
        this.title.classList.add('bold');
      }
      else if ('both' == titleStructure.styleMod)
      {
        this.title.classList.add('warning');
        this.title.classList.add('bold');
      }
      else
      {
        this.title.classList.remove('warning');
        this.title.classList.remove('bold');
      }

      this.divElt.classList.add('listTitleMedium');

      break;

    case 'style12':
      line1 = document.createElement('span');
      line1.className = 'line1';
      line1.appendChild(document.createTextNode(titleStructure.text1));
      this.title.appendChild(line1);

      countlabel = document.createElement('span');
      countlabel.className = 'count';
      countlabel.appendChild(document.createTextNode(titleStructure.countlabel));
      this.title.appendChild(countlabel);

      this.divElt.classList.add('listTitleNormal');

      break;
    default:
      log.error('Lis2: unknown title style: ' + titleStructure.titleStyle);
  }

  // save the title structure
  this._currentTitle = titleStructure;
};


/**
 * Sets the count label text for title style 12
 * @param labelText String Text to be displayed on label
 *
 */
List2Ctrl.prototype.setCountLabel = function(labelText)
{
  if (this._currentTitle && this._currentTitle.titleStyle == 'style12')
  {
    const countLabel = document.getElementsByClassName('count')[0];
    countLabel.innerHTML = labelText;
  }
};

/** 8. CONTEXT CAPTURE AND RESTORE **/

/**
 * Context capture
 * TAG: framework, public
 * =========================
 * @return {object} - capture data
 */
List2Ctrl.prototype.getContextCapture = function()
{
  const obj = {
    hasFocus: this._hasFocus,
    topItem: this._topItem,
    focussedItem: this._getFocussedIndex(),
    itemCount: this.dataList ? this.dataList.itemCount : 0,
  };

  log.debug('Lis2: getContextCapture obj ', obj);
  return obj;
};

/**
 * Context restore
 * TAG: framework, public
 * =========================
 * @return {object} - capture data
 */
List2Ctrl.prototype.restoreContext = function(restoreData)
{
  log.debug('Lis2: restoreContext restoreData ', restoreData);
  // validate input
  if (!restoreData.hasOwnProperty('topItem') || !restoreData.hasOwnProperty('focussedItem'))
  {
    log.info('No data to restore');
    return;
  }


  // restore hasFocus flag
  if (restoreData.hasFocus)
  {
    this._hasFocus = true;
  }

  if (this.hasDataList())
  {
    // scroll to previous position and show previous focus
    // no checks for value conflicts are necessary. These ought to be correct.
    this._scrollTo(restoreData.topItem);

    // NOTE: actual focus placement happens in controllerActive event handling

    // mark the list as data-restored preventing any subsequent auto-scrolls
    this._initialScrollMode = 'restore';

    this._manageFocus(restoreData.focussedItem);
  }
  else
  {
    log.info('List has no dataList to restore');
  }

  // overwrite control properties
  this.properties.scrollTo = restoreData.topItem;
  this.properties.focussedItem = restoreData.focussedItem;
  this._lastItemWithFocus = restoreData.focussedItem;
};


/** 9. BACKGROUND API **/

/**
 * Set a custom background on the list control
 * TAG: public
 * =========================
 * @return {void}
 */
List2Ctrl.prototype.setListBackground = function(img, position)
{
  this.clearListBackground();
  this.listBackground = document.createElement('div');
  this.listBackground.className = 'List2CtrlCustomBackground';
  this.listBackground.style.backgroundImage = 'url('+img+')';

  // set background position
  if (position && typeof position == 'object' && position['left'] != undefined && position['top'] != undefined)
  {
    const left = (!isNaN(position['left'])) ? position.left + 'px' : position.left.toString();
    const top = (!isNaN(position['top'])) ? position.top + 'px' : position.top.toString();
    this.listBackground.style.backgroundPosition = left + ' ' + top;
  }

  this.divElt.appendChild(this.listBackground);
};

/**
 * Clear any custom background image
 * TAG: public
 * =========================
 * @return {void}
 */
List2Ctrl.prototype.clearListBackground = function()
{
  if (this.listBackground)
  {
    this.listBackground.parentElement.removeChild(this.listBackground);
    this.listBackground = null;
  }
};


/**
 * =========================
 * HELPERS AND UTILITIES
 * =========================
 */

/**
  * Create Tabs control
  * =========================
  * @return The TabsCtrl instance.
  */
List2Ctrl.prototype._createTabsControl = function()
{
  log.debug('  Instantiating TabsCtrl');
  if (this.properties.tabsButtonConfig.tiltStartCallback)
  {
    log.warn('Lis2: the tabsButtonConfig.tiltStartCallback property was defined outside of the list control but should only be used by the list.');
  }
  this.properties.tabsButtonConfig.tiltStartCallback = this._tabsCtrlTiltStartCallback.bind(this);
  return framework.instantiateControl(this.uiaId, this.divElt, 'TabsCtrl', this.properties.tabsButtonConfig);
};

/**
 * Clear the list contents when the user starts tilting to a new tab.
 */
List2Ctrl.prototype._tabsCtrlTiltStartCallback = function(controlRef, appData, params)
{
  if (this.title)
  {
    this.title.style.opacity = 0;
  }
  this.setDataList({});
  this._hideScrollIndicator();
};


/**
 * Tracks touch position properties of the last two events.
 * TAG: touch-only, internal
 * =========================
 * @param {MouseEvent} - MouseMove event
 * @return {void}
 */
List2Ctrl.prototype._trackEvent = function(e)
{
  // use shallow copy
  const trackedEvents = this._trackedEvents;
  trackedEvents[0] = trackedEvents[1];
  trackedEvents[1] = {y: e.pageY, x: e.pageX};
};

/**
 * Get touch direction upon touch move
 * TAG: touch-only, internal
 * =========================
 * @return {integer} - 1 for 'down', -1 for 'uo'
 */
List2Ctrl.prototype._getMoveDirection = function()
{
  const trackedEvents = this._trackedEvents;
  const event0 = trackedEvents[0];
  const event1 = trackedEvents[1];

  if (!event0) return 1;

  return (event1.y - event0.y < 0) ? -1 : 1;
};

/**
 * Get current list position (or specific position relative to supplied item index)
 * TAG: internal
 * =========================
 * @param {integer} - optional, item index from which to calculate position
 * @return {string} - onepage | top | bottom | bottomclose | topclose | middle
 */
List2Ctrl.prototype._getListPosition = function(itemIndex)
{
  // get item index
  const itemIndex = (undefined === itemIndex) ? this._topItem : itemIndex;

  // get list position
  let listPosition = null;

  // determine list position
  if (this.dataList.itemCount <= this.properties.visibleItems)
  {listPosition = 'onepage';}
  else if (0 === itemIndex)
  {listPosition = 'top';} // list is at the top
  else if (itemIndex === this.dataList.itemCount - this.properties.visibleItems)
  {listPosition = 'bottom';} // list is at the bottom
  else if (itemIndex > this.dataList.itemCount - (2 * this.properties.visibleItems))
  {listPosition = 'bottomclose';} // list is less than a screen to the bottom
  else if (itemIndex < 2 * this.properties.visibleItems)
  {listPosition = 'topclose';} // list is less than a screen to the top
  else
  {listPosition = 'middle';} // list is somewhere in the middle

  // return list position
  return listPosition;
};


/**
 * Get additional space that needs to be added to the scroller
 * height in order to satisfy the 'half-line' requirements.
 * Correction is needed because there's a difference between
 * visual style guide and actual item heights. The values are
 * fixed and depend on the style.
 * TAG: helper
 * =========================
 * @return {integer}
 */
List2Ctrl.prototype._getAdditionalSpace = function()
{
  // determine additional space
  let additionalSpace = 0;
  switch (this.properties.titleConfiguration)
  {
    case 'noTitle':
      additionalSpace = this.properties.thickItems ? 6 : 32;
      break;
    case 'tabsTitle':
      additionalSpace = this.properties.thickItems ? 19 : 27;
      break;
    case 'listTitle':
      switch (this._currentTitle.titleStyle)
      {
        case 'style02':
        case 'style03':
        case 'style12':
          additionalSpace = this.properties.thickItems ? 19 : 27;
          break;
        case 'style05':
        case 'style08':
          additionalSpace = this.properties.thickItems ? 52 : 42;
          break;
        case 'style06':
        case 'style07':
          additionalSpace = this.properties.thickItems ? 60 : 32;
          break;
        default:
          // nothing to do
          break;
      }
      break;
    default:
      // nothing to do
      break;
  }


  return additionalSpace;
};

/**
 * Get empty DOM elements
 * Return the first element in the DOM that doesn't
 * have data associated with it in the dataList
 */
List2Ctrl.prototype._getEmptyDOMElement = function()
{
  let emptyItem = null;
  const items = [];

  // get item indeces and sort them in ascending order
  for (let i=0; i<this.items.length; i++)
  {
    items[items.length] = this.items[i].ref;
  }
  items.sort();

  // check whether any of them is empty
  for (let i=0, l=items.length; i<l; i++)
  {
    if ('' === this.dataList.items[items[i]].text1 && this._displayWithoutText(this.dataList.items[items[i]]))
    {
      // empty item found
      emptyItem = items[i];
      break;
    }
  }

  return emptyItem;
};


/**
 * Get Touched Item
 * Returns the index of touched item (under the mouse pointer)
 * TAG: touch-only, internal, helper
 * =========================
 * @param {MouseEvent} - the mouse event from the handler
 * @return {integer} - index of the touched item
 */
List2Ctrl.prototype._getTargetItem = function(e)
{
  // exit if we don't have any items
  if (!this.hasDataList())
  {
    return -1;
  }

  // determine touched item
  const relativeY = (e.pageY - this._maskPositionY) - this.scroller.offsetTop;

  // if we are not in the list -> return -1
  if (relativeY < 0 || e.pageY - this._maskPositionY < 0)
  {
    return -1;
  }

  let itemIndex = Math.floor(relativeY / this.properties.itemHeight);

  // if we are in the active area but below the last item -> return -1
  if (itemIndex > this.dataList.itemCount - 1)
  {
    return -1;
  }

  // constrain itemIndex to the max possible index
  itemIndex = this.m.min(itemIndex, this.dataList.itemCount - 1);

  return itemIndex;
};

/**
 * Get DOM Element by itemIndex
 * Returns a DOM element (or null) for a particular
 * item after performing a search for its item index
 * TAG: internal, helper
 * =========================
 * @param {integer} - index of the list item
 * @return {HTML Element} - <li> element
 */
List2Ctrl.prototype._getDOMItem = function(itemIndex)
{
  let domItem = null;

  for (let i=0, l=this.items.length; i<l; i++)
  {
    if (this.items[i].ref == itemIndex)
    {
      domItem = this.items[i].domElt;
      break;
    }
  }

  return domItem;
};

/**
 * Get touched letter in the letter index
 * Returns the index of the touched letter (under the mouse pointer)
 * TAG: touch-only, internal, helper
 * =========================
 * @param {MouseEvent} - the mouse event from the handler
 * @return {integer} - index of the touched letter
 */
List2Ctrl.prototype._getTargetLetterIndex = function(e)
{
  // determine touched item
  const relativeY = (e.pageY - this._maskPositionY) - this.letterIndex.offsetTop;

  // if we are not in the list -> return -1
  if (relativeY < 0 || e.pageY - this._maskPositionY < 0)
  {
    return -1;
  }

  let letterIndex = Math.floor(relativeY / this.properties.letterIndexHeight);

  // if we are in the active area but below the last letter index item -> return -1
  if (letterIndex > this.letterIndexData.length - 1)
  {
    return -1;
  }

  // constrain letterIndex to the max possible index
  letterIndex = this.m.min(letterIndex, this.letterIndexData.length - 1);

  return letterIndex;
};

/**
 * Get Slider instance by itemIndex
 * TAG: internal, helper
 * =========================
 * @param {integer} - index of the list item
 * @return {SliderCtrl} - slider instance
 */
List2Ctrl.prototype._getSlider = function(itemIndex)
{
  let sliderCtrl = null;

  let index;
  if (utility.toType(itemIndex) === 'number')
  {
    index = itemIndex;
  }
  else
  {
    index = this._getFocussedIndex();
  }

  const domElt = this._getDOMItem(index);
  if (domElt)
  {
    const poolId = domElt.getAttribute('data-poolid');
    const hashKey = 'slider_'+index+'_'+poolId;

    // check whether a slider exists
    if (this._sliders.hasOwnProperty(hashKey) && this._sliders[hashKey].slider)
    {
      sliderCtrl = this._sliders[hashKey].slider;
    }
  }

  return sliderCtrl;
};

/**
 * Checks whether the supplied itemIndex contains a slider
 * TAG: internal, helper
 * =========================
 * @param {integer|string} - index of the list item | item style
 * @return {boolean} - true if the item contains a slider
 */
List2Ctrl.prototype._isSlider = function(itemIndex)
{
  // exit if we don't have any items
  if (!this.hasDataList())
  {
    return false;
  }

  let isSlider = false;

  if (!isNaN(itemIndex))
  {
    isSlider = ('style12' === this.dataList.items[itemIndex].itemStyle || 'style13' === this.dataList.items[itemIndex].itemStyle || 'style28' == this.dataList.items[itemIndex].itemStyle);
  }
  else if (typeof itemIndex === 'string')
  {
    isSlider = ('style12' === itemIndex || 'style13' === itemIndex|| 'style28' === itemIndex);
  }

  return isSlider;
};

/**
 * Checks whether the supplied itemIndex is a lock item
 * TAG: internal, helper
 * =========================
 * @param {integer|string} - index of the list item | item style
 * @return {boolean} - true if the item is a lock item
 */
List2Ctrl.prototype._isLock = function(itemIndex)
{
  // exit if we don't have any items
  if (!this.hasDataList())
  {
    return false;
  }

  let isLock = false;

  if (!isNaN(itemIndex))
  {
    isLock = ('styleLock' === this.dataList.items[itemIndex].itemStyle);
  }
  else if (typeof itemIndex === 'string')
  {
    isLock = ('styleLock' === itemIndex);
  }

  return isLock;
};

/**
 * Checks whether the supplied itemIndex contains toggle buttons
 * TAG: internal, helper
 * =========================
 * @param {integer|string} - index of the list item | item style
 * @return {boolean} - true if the item contains toggle buttons
 */
List2Ctrl.prototype._isToggle = function(itemIndex)
{
  // exit if we don't have any items
  if (!this.hasDataList())
  {
    return false;
  }

  let isToggle = false;

  if (!isNaN(itemIndex))
  {
    isToggle = ('style10' === this.dataList.items[itemIndex].itemStyle || 'style11' === this.dataList.items[itemIndex].itemStyle || 'draggable' === this.dataList.items[itemIndex].itemStyle);
  }
  else if (typeof itemIndex === 'string')
  {
    isToggle = ('style10' === itemIndex || 'style11' === itemIndex || 'draggable' === itemIndex);
  }

  return isToggle;
};

/**
 * Checks whether the supplied itemIndex is On/Off item
 * TAG: internal, helper
 * =========================
 * @param {integer|string} - index of the list item | item style
 * @return {boolean} - true if the item is On/Off
 */
List2Ctrl.prototype._isOnOff = function(itemIndex)
{
  // exit if we don't have any items
  if (!this.hasDataList())
  {
    return false;
  }

  let isOnOff = false;

  if (!isNaN(itemIndex))
  {
    isOnOff = ('styleOnOff' === this.dataList.items[itemIndex].itemStyle);
  }
  else if (typeof itemIndex === 'string')
  {
    isOnOff = ('styleOnOff' === itemIndex);
  }

  return isOnOff;
};

/**
 * Checks whether the supplied itemIndex is a step item
 * TAG: internal, helper
 * =========================
 * @param {integer|string} - index of the list item | item style
 * @return {boolean} - true if the item is a step item
 */
List2Ctrl.prototype._isStep = function(itemIndex)
{
  // exit if we don't have any items
  if (!this.hasDataList())
  {
    return false;
  }

  let isStep = false;

  if (!isNaN(itemIndex))
  {
    isStep = ('styleStep' === this.dataList.items[itemIndex].itemStyle);
  }
  else if (typeof itemIndex === 'string')
  {
    isStep = ('styleStep' === itemIndex);
  }

  return isStep;
};

/**
 * Checks whether the supplied itemIndex is a checkbox
 * TAG: internal, helper
 * =========================
 * @param {integer|string} - index of the list item | item style
 * @return {boolean} - true if the item is a checkbox/tick/radio item
 */
List2Ctrl.prototype._isCheckBox = function(itemIndex)
{
  // exit if we don't have any items
  if (!this.hasDataList())
  {
    return false;
  }

  let isCheckbox = false;

  if (!isNaN(itemIndex))
  {
    isCheckbox = ('style03' === this.dataList.items[itemIndex].itemStyle || 'style03a' === this.dataList.items[itemIndex].itemStyle);
  }
  else if (typeof itemIndex === 'string')
  {
    isCheckbox = ('style03' === itemIndex || 'style03a' === itemIndex);
  }

  return isCheckbox;
};

/**
 * Checks whether the supplied itemIndex is a simple select item
 * TAG: internal, helper
 * =========================
 * @param {integer|string} - index of the list item | item style
 * @return {boolean} - true if the item is simple select item
 */
List2Ctrl.prototype._isSimpleSelectItem = function(itemIndex)
{
  // exit if we don't have any items
  if (!this.hasDataList())
  {
    return false;
  }

  let isSimpleSelect = false;

  if (!isNaN(itemIndex))
  {
    isSimpleSelect = ('style03' === this.dataList.items[itemIndex].itemStyle || 'style03a' === this.dataList.items[itemIndex].itemStyle || 'styleOnOff' === this.dataList.items[itemIndex].itemStyle || 'style10' === this.dataList.items[itemIndex].itemStyle || 'style11' === this.dataList.items[itemIndex].itemStyle);
  }
  else if (typeof itemIndex === 'string')
  {
    isSimpleSelect = ('styleOnOff' === itemIndex || 'style10' === itemIndex || 'style11' === itemIndex);
  }

  return isSimpleSelect;
};

/**
 * Checks whether the item contains _data property
 * TAG: internal, helper
 * =========================
 * @param {integer} - item index
 * @return {Boolean} - True if the item contains _data property
 */
List2Ctrl.prototype._hasData = function(itemIndex)
{
  let containsData = false;
  if (this.dataList && this.dataList.items && this.dataList.items[itemIndex])
  {
    containsData = this.dataList.items[itemIndex].hasOwnProperty('_data');
  }
  return containsData;
};

/**
 * Wraps inline text element if the width exceeds certain
 * max width that depends on the item style.
 * TAG: internal, helper
 * =========================
 * @param {HTML Li Element} - the LI element that will be searched for overflowing text
 * @return {HTML Li Element} - the modified LI element
 */
List2Ctrl.prototype._wrapInlineElement = function(li)
{
  let searchClass = null;
  let maxWidth = 0;

  if (li.classList.contains('style17'))
  {
    searchClass = 'line1';
    maxWidth = this.properties.wrapTextThreshold;
  }
  else
  {
    return li;
  }

  let line1 = li.getElementsByClassName(searchClass);
  if (!line1 || 0 === line1.length)
  {
    return li;
  }
  else
  {
    line1 = line1[0];
  }

  if (line1.clientWidth > maxWidth)
  {
    line1.classList.add('wrap');
  }
  else
  {
    line1.classList.remove('wrap');
  }

  return li;
};

/**
 * Checks if the item can be displayed, even if it has no text field.
 * TAG: internal, helper
 * =====================================================
 * @param {Object}
 * @return {Boolean}
 */
List2Ctrl.prototype._displayWithoutText = function(item)
{
  let returnValue = true;
  for (let i =0; i < this._itemsWithNoText.length; i++)
  {
    if (item.itemStyle === this._itemsWithNoText[i])
    {
      returnValue = false;
      break;
    }
  }
  return returnValue;
};

/**
 * Checks if the item is a slider with full hittable area
 * TAG: internal, helper
 * ===================================================
 * @param {Object}
 * @return {Boolean}
 */
List2Ctrl.prototype._hasRightHittableArea = function(item)
{
  let returnValue = false;

  for (let i =0; i < this._rightHittableArea.length; i++)
  {
    if (item.itemStyle === this._rightHittableArea[i])
    {
      returnValue = true;
      break;
    }
  }
  return returnValue;
};


/**
 * Show bounding boxes of some elements in the list.
 * This should be used for debugging purposes only
 * TAG: internal, utility
 * =========================
 * @param {Boolean}
 * @return {void}
 */
List2Ctrl.prototype.showBoundingBoxes = function(state)
{
  if (state)
  {
    this.divElt.classList.add('showBoundingBoxes');
  }
  else
  {
    this.divElt.classList.remove('showBoundingBoxes');
  }
};


/**
 * Searches an array for a value
 * TAG: internal, utility
 * =========================
 * @param {string|number}
 * @param {array}
 * @return {object} - copy of the source object
 */
List2Ctrl.prototype.inArray = function(needle, haystack)
{
  if (!needle || !haystack)
  {
    log.warn('Lis2: 2 arguments expected');
    return;
  }

  for (let i=0, l=haystack.length; i<l; i++)
  {
    if (needle === haystack[i])
    {
      return true;
    }
  }

  return false;
};

/**
 * Create deep copy of an object
 * TAG: internal, utility
 * =========================
 * @param {object} - source object
 * @param {object} - object to contain the copy
 * @return {object} - copy of the source object
 */
List2Ctrl.prototype.deepCopy = function(p, c)
{
  const c = c||{};
  for (const i in p)
  {
    if (typeof p[i] === 'object' && p[i] != null)
    {
      c[i] = (p[i].constructor === Array) ? [] : {};
      this.deepCopy(p[i], c[i]);
    }
    else
    {
      c[i] = p[i];
    }
  }
  return c;
};

/**
 * Get the position of an element
 * TAG: internal, utility
 * =========================
 * @param {HTML Element} - should be added to the DOM
 * @return {array} - [left, top]
 */
List2Ctrl.prototype.getPosition = function(obj)
{
  let currentLeft = 0; let currentTop = 0;
  if (obj.offsetParent)
  {
    do {
      currentLeft += obj.offsetLeft;
      currentTop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return [currentLeft, currentTop];
  }
};

/**
 * Local Math implementation
 * TAG: internal, utility
 * =========================
 */
List2Ctrl.prototype.m = {
  min: function(a, b)
  {
    return (!isNaN(a) && !isNaN(b)) ? // if both arguments are numbers
                    a < b ? a : b : // return the lower
                NaN; // else return NaN (just like the Math class)
  },
  max: function(a, b)
  {
    return (!isNaN(a) && !isNaN(b)) ? // if both arguments are numbers
                    a > b ? a : b : // return the higher
                NaN; // else return NaN (just like the Math class)
  },
  abs: function(a)
  {
    return (!isNaN(a)) ? // if the argument is a number
                    a < 0 ? -a : a : // return the abs
                NaN; // else return NaN (just like the Math class)
  },
};

/**
 * Finish partial activity.
 * @return {void}
 */
List2Ctrl.prototype.finishPartialActivity = function()
{
  // route finish partial activity to sub controls

  // tabs ctrl
  if (this.tabsCtrl)
  {
    // delete the assigned callback reference so that it's not stored in the App's context table
    delete this.properties.tabsButtonConfig.tiltStartCallback;
    this.tabsCtrl.finishPartialActivity();
  }

  // slider
  if (this._activeSlider && this._activeSlider.slider)
  {
    this._activeSlider.slider.finishPartialActivity();
  }

  // list -> exit any items in secondary MC mode
  if (this._inSecondaryMulticontroller)
  {
    const smi = this._currentSecondaryMulticontrollerItem;
    if (this.dataList.items[smi] && this._isStep(smi))
    {
      this._setSecondaryMulticontroller(false);
      this._triggerFocus();
    }
  }
};

List2Ctrl.prototype.getStationAndRelay = function(stationName, RelayName)
{
  let stationRelay = '';
  if (stationName && RelayName)
  {
    stationRelay = stationName+' ('+RelayName+')';
  }
  else if (stationName && ((RelayName=='')||(RelayName==null)))
  {
    stationRelay = stationName;
  }
  else {
    log.debug('Station name and relay not defined');
  }

  return stationRelay;
};


/**
 * =========================
 * GARBAGE COLLECTION
 * - Clear listeners
 * - Clean up subcontrols
 * - Clear timeouts
 * TAG: framework
 * =========================
 * @return {void}
 */
List2Ctrl.prototype.cleanUp = function()
{
  // remove event callbacks
  this.divElt.removeEventListener(this._USER_EVENT_START, this.touchHandler, false);
  document.removeEventListener(this._USER_EVENT_MOVE, this.touchHandler, false);
  document.removeEventListener(this._USER_EVENT_END, this.touchHandler, false);
  document.removeEventListener(this._USER_EVENT_OUT, this.touchHandler, false);

  // remove animation callbacks
  this.scroller.removeEventListener(this._VENDOR + 'TransitionEnd', this.scrollerAnimationEndCallback, false);
  if (this.scrollIndicator)
  {
    this.scrollIndicator.removeEventListener(this._VENDOR + 'TransitionEnd', this.scrollIndicatorAnimationEndCallback, false);
  }
  if (this.letterIndex)
  {
    this.letterIndex.removeEventListener(this._VENDOR + 'TransitionEnd', this.letterIndexAnimationEndCallback, false);
  }

  // clean up subcontrols
  if (this.tabsCtrl)
  {
    this.tabsCtrl.cleanUp();
  }
  for (const i in this._sliders)
  {
    this._sliders[i]['slider'].cleanUp();
  }

  // clear timeouts
  clearTimeout(this._makeHitTimeoutId);
  clearTimeout(this._longPressTimeoutId);
  clearTimeout(this._touchReorderTimeoutId);
  clearTimeout(this._scrollIndicatorTimeoutId);
  clearTimeout(this._indexSelectTimeoutId);
  clearTimeout(this._tiltHoldTimeoutId);
  clearInterval(this._tiltHoldIntervalId);
  clearTimeout(this._needDataTimeoutId);
  clearTimeout(this._loadingData.startTimeoutId);
  clearTimeout(this._loadingData.endTimeoutId);
  clearTimeout(this._radioSettleTimeoutId);
  clearTimeout(this._tickSettleTimeoutId);
  if (this.hasDataList())
  {
    for (let i=0, l=this.dataList.items.length; i<l; i++)
    {
      if (this._hasData(i))
      {
        clearTimeout(this.dataList.items[i]._data.eventTimeout);
        this.dataList.items[i]._data.eventTimeout = null;
        clearTimeout(this.dataList.items[i]._data.settleTimeout);
        this.dataList.items[i]._data.settleTimeout = null;

        delete this.dataList.items[i]._data;
      }
    }
  }

  // dispatch clean up event, reporting last focussed index
  const params = {scrollTo: this._topItem, focussedItem: this._lastItemWithFocus};
  this._listEvent(this._EVENTS.CLEAN_UP, params);
};

// Register Loaded with Framework
framework.registerCtrlLoaded('List2Ctrl');
