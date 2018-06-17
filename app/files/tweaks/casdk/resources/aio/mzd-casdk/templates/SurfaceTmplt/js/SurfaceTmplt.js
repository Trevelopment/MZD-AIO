/**
 * Custom Applications SDK for Mazda Connect Infotainment System
 *
 * A mini framework that allows to write custom applications for the Mazda Connect Infotainment System
 * that includes an easy to use abstraction layer to the JCI system.
 *
 * Written by Andreas Schwarz (http://github.com/flyandi/mazda-custom-applications-sdk)
 * Copyright (c) 2016. All rights reserved.
 *
 * WARNING: The installation of this application requires modifications to your Mazda Connect system.
 * If you don't feel comfortable performing these changes, please do not attempt to install this. You might
 * be ending up with an unusuable system that requires reset by your Dealer. You were warned!
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
 * License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see http://www.gnu.org/licenses/
 *
 */

/**
 * (CustomApplication) Template Handler for JCI
 *
 * This will create the main surface for a custom application and keeps in line with the
 * focus stack of the JCI system
 */


log.addSrcFile("SurfaceTmplt.js", "SurfaceTmpl");

/**
 * (Constructor)
 */

function SurfaceTmplt(uiaId, parentDiv, templateID, controlProperties) {
  $('#SbSpeedo, #Sbfuel-bar-wrapper').fadeOut();
  $('#SbSpeedo').addClass('stayHidden');
  // create the div for template
  this.divElt = document.createElement('div');
  this.divElt.id = templateID;

  this.templateName = "SurfaceTmplt";

  this.onScreenClass = "TestTemplateWithStatusLeft";
  this.offScreenLeftClass = "TestTemplateWithStatusLeft-OffscreenLeft";
  this.offScreenRightClass = "TestTemplateWithStatusLeft-OffscreenRight";

  this.slideOutLeftClass = "TemplateWithStatusLeft-SlideOutLeftClass";
  this.slideInRightClass = "TemplateWithStatusLeft-SlideInRightClass";
  this.slideInLeftClass = "TemplateWithStatusLeft-SlideInLeftClass";
  this.slideOutRightClass = "TemplateWithStatusLeft-SlideOutRightClass";

  log.debug("templateID in SurfaceTmplt constructor: " + templateID);

  // reset
  this.properties = {};

  // clear app
  this.application = null;

  // get active application
  this.application = CustomApplicationsHandler.getCurrentApplication(true);

  if (!this.application) {

    // todo: show a error message here that no active application launch was launched

    return false;
  }

  //set the template properties
  this.properties = {
    "statusBarVisible": this.application.getStatusbar(),
    "leftButtonVisible": this.application.getHasLeftButton(),
    "rightChromeVisible": this.application.getHasRightArc(),
    "hasActivePanel": false,
    "isDialog": false
  };

  // set the correct template class
  switch (true) {

    case this.properties.leftButtonVisible:
      this.divElt.className = "TemplateWithStatusLeft";
      break;

    case this.properties.statusBarVisible:
      this.divElt.className = "TemplateWithStatus";
      break;

    default:
      this.divElt.className = "TemplateFull";
      break;
  }

  // assign to parent
  parentDiv.appendChild(this.divElt);

  // wakeup
  this.application.__wakeup(this.divElt);

  // set framework specifics
  setTimeout(function() {

    if (this.properties.statusBarVisible) {

      // execute statusbar handler
      framework.common.statusBar.setAppName(this.application.getStatusbarTitle());

      // execute custom icon
      var icon = this.application.getStatusbarIcon();

      if (icon) framework.common.statusBar.setDomainIcon(icon);

      // adjust home button
      framework.common.statusBar.showHomeBtn(this.application.getStatusbarHomeButton());

    }
  }.bind(this), 85);
}


/**
 * CleanUp
 */

SurfaceTmplt.prototype.cleanUp = function() {
  // kill application
  if (this.application) {
    CustomApplicationsHandler.sleep(this.application);
  }

  // clear app
  this.application = null;
  $('#SbSpeedo').removeClass('stayHidden');
  $('#SbSpeedo, #Sbfuel-bar-wrapper').fadeIn();
}

/**
 * MultiController
 */

SurfaceTmplt.prototype.handleControllerEvent = function(eventID) {
  if (this.application) {
    this.application.__handleControllerEvent(eventID);
  }
}


// Finalize
framework.registerTmpltLoaded("SurfaceTmplt");
