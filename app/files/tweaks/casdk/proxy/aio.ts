// aio.js - global helper functions for aio apps (for use with CASDK)
//console.log("initialize aioMagicRoute - aio.js");
var aioContextCount = 1;

// The magic router from Debug.js - Fakes a context change message
// Switch to any context from any other context
// **Note: Works in the emulator but DOES NOT ALWAYS WORK IN THE CAR
// Example: Switching to speedometer from main menu automatically on boot
// Will flash the speedometer for only a second then switch back.
// ** Needs further investigation **
function aioMagicRoute(uiaId, ctxtId, params, contextSeq) {
  var currAppId = framework.getCurrentApp();
  var transitionTrue = JSON.stringify({ 'msgType': 'transition', 'enabled': true });
  var transitionFalse = JSON.stringify({ 'msgType': 'transition', 'enabled': false });

  if (!contextSeq) {
    contextSeq = aioContextCount;
    aioContextCount++;
  }

  var ctxtChgMsg = JSON.stringify({ "msgType": "ctxtChg", "ctxtId": ctxtId, "uiaId": uiaId, "params": params, "contextSeq": contextSeq });
  var focusStackMsg = JSON.stringify({ "msgType": "focusStack", "appIdList": [{ "id": uiaId }, { "id": currAppId }] });

  aioMagicMsg(transitionTrue, ctxtChgMsg, focusStackMsg, transitionFalse);
}
// Change from any context to any other context
// NOTE: this does not always work in the car system
function aioMagicMsg(data) {
  if (arguments.length > 1) {
    //is the data a list of objects?
    for (var i = 0; i < arguments.length; i++) {
      log.debug("aioMagicMsg arguments passed as: ", arguments[i]);
      framework.routeMmuiMsg(JSON.parse(arguments[i]));
    }
    return;
  }

  if (Object.prototype.toString.call(data) == '[object Array]') {
    //is the data an array?
    for (var j = 0; j < data.length; j++) {
      framework.routeMmuiMsg(JSON.parse(data[j]));
    }
    return;
  }
  //otherwise we have 1 object to send
  framework.routeMmuiMsg(JSON.parse(data));
}
// StatusBar Notifications
function AIO_SBN(message, pathToIcon) {
  framework.common.startTimedSbn(framework.getCurrentApp(), "MzdAioSbn", "typeE", {
    sbnStyle: "Style02",
    imagePath1: pathToIcon,
    text1: message
  });
}
// Turns a DOM element into JSON for saving
function DOMtoJSON(node) {
  node = node || this;
  var obj = {
    nodeType: node.nodeType
  };
  if (node.tagName) {
    obj.tagName = node.tagName.toLowerCase();
  } else
  if (node.nodeName) {
    obj.nodeName = node.nodeName;
  }
  if (node.nodeValue) {
    obj.nodeValue = node.nodeValue;
  }
  var attrs = node.attributes;
  if (attrs) {
    var length = attrs.length;
    var arr = obj.attributes = new Array(length);
    for (var i = 0; i < length; i++) {
      var attr = attrs[i];
      arr[i] = [attr.nodeName, attr.nodeValue];
    }
  }
  var childNodes = node.childNodes;
  if (childNodes) {
    var lengthc = childNodes.length;
    var arrc = obj.childNodes = new Array(lengthc);
    for (var j = 0; j < lengthc; j++) {
      arrc[j] = DOMtoJSON(childNodes[j]);
    }
  }
  return obj;
}
// Creates DOM out of JSON created by DOMtoJSON
function JSONtoDOM(obj) {
  if (typeof obj === 'string') {
    obj = JSON.parse(obj);
  }
  var node, nodeType = obj.nodeType;
  switch (nodeType) {
    case 1: //ELEMENT_NODE
      node = document.createElement(obj.tagName);
      var attributes = obj.attributes || [];
      for (var i = 0, len = attributes.length; i < len; i++) {
        var attr = attributes[i];
        node.setAttribute(attr[0], attr[1]);
      }
      break;
    case 3: //TEXT_NODE
      node = document.createTextNode(obj.nodeValue);
      break;
    case 8: //COMMENT_NODE
      node = document.createComment(obj.nodeValue);
      break;
    case 9: //DOCUMENT_NODE
      node = document.implementation.createDocument();
      break;
    case 10: //DOCUMENT_TYPE_NODE
      node = document.implementation.createDocumentType(obj.nodeName);
      break;
    case 11: //DOCUMENT_FRAGMENT_NODE
      node = document.createDocumentFragment();
      break;
    default:
      return node;
  }
  if (nodeType === 1 || nodeType === 11) {
    var childNodes = obj.childNodes || [];
    for (i = 0, len = childNodes.length; i < len; i++) {
      node.appendChild(JSONtoDOM(childNodes[i]));
    }
  }
  return node;
}

/* Attempt to unmount swapfile on shutdown */
var UMswap = null;

function swapfileShutdownUnmount() {
  console.log('swapfileShutdownUnmount');
  UMswap = setInterval(function() {
    if (typeof unmounmtSwap !== 'undefined' && (framework.getCurrCtxtId() === 'WaitForEnding' || framework.getCurrCtxtId() === 'PowerDownAnimation')) {
      clearInterval(UMswap);
      UMswap = null;
      unmountSwap();
    }
  }, 1000)
}
