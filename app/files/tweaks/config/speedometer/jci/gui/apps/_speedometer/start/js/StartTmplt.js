/*
    __________________________________________________________________________

    Filename: StartTmplt.js
    __________________________________________________________________________

    Description: Start Template For Speedometer App
    __________________________________________________________________________

*/

log.addSrcFile("StartTmplt.js", "common");

// StartTmplt constructor
function StartTmplt(uiaId, parentDiv, templateId, controlProperties) {
  this.divElt = null;
  this.offScreenCtrl = null;
  this.templateName = "StartTmplt";

  this.onScreenClass = "TemplateFull";

  log.debug("  templateId in StartTmplt constructor: " + templateId);

  //@formatter:off
  //set the template properties
  this.properties = {
    "statusBarVisible": false,
    "leftButtonVisible": false,
    "hasActivePanel": false,
    "isDialog": false,
  };
  //@formatter:on

  // create the div for template
  this.divElt = document.createElement('div');
  this.divElt.id = templateId;
  this.divElt.className = "TemplateFull";

  parentDiv.appendChild(this.divElt);
}


/*
 * =========================
 * Standard Template API functions
 * =========================
 */

/* (internal - called by the framework)
 * Handles multicontroller events.
 * @param	eventID	(string) any of the “Internal event name” values in IHU_GUI_MulticontrollerSimulation.docx (e.g. 'cw',
 * 'ccw', 'select')
 */
StartTmplt.prototype.handleControllerEvent = function(eventID) {

};

/*
 * Called by the app during templateNoLongerDisplayed. Used to perform garbage collection procedures on the template and
 * its controls.
 */
StartTmplt.prototype.cleanUp = function() {

};

framework.registerTmpltLoaded("StartTmplt");
