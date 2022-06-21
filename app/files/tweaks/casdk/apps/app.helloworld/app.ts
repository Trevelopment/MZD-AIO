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
 * HelloWorld Application
 *
 * This is the main file of the application and contains the required information
 * to run the application on the mini framework.
 *
 * The filename needs to be app.js in order to be recognized by the loader.
 */



CustomApplicationsHandler.register("app.helloworld", new CustomApplication({

  /**
   * (require)
   *
   * An object array that defines resources to be loaded such as javascript's, css's, images, etc
   *
   * All resources are relative to the applications root path
   */

  require: {

    /**
     * (js) defines javascript includes
     */

    js: ['api.ts'],

    /**
     * (css) defines css includes
     */

    css: ['app.css'],

    /**
     * (images) defines images that are being preloaded
     *
     * Images are assigned to an id
     */

    images: {

      world: 'images/world.png'

    },
  },

  /**
   * (settings)
   *
   * An object that defines application settings
   */

  settings: {

    /**
     * (terminateOnLost)
     *
     * If set to 'true' this will remove the stateless life cycle and always
     * recreate the application once the focus is lost. Otherwise by default
     * the inital created state will stay alive across the systems runtime.
     *
     * Default is false or not set
     * /

    // terminateOnLost: false,

    /**
     * (title) The title of the application in the Application menu
     */

    title: 'YouTube Player',

    /**
     * (statusbar) Defines if the statusbar should be shown
     */

    statusbar: true,

    /**
     * (statusbarIcon) defines the status bar icon
     *
     * Set to true to display the default icon app.png or set a string to display
     * a fully custom icon.
     *
     * Icons need to be 37x37
     */

    statusbarIcon: true,

    /**
     * (statusbarTitle) overrides the statusbar title, otherwise title is used
     */

    statusbarTitle: false,

    /**
     * (statusbarHideHomeButton) hides the home button in the statusbar
     */

    // statusbarHideHomeButton: false,

    /**
     * (hasLeftButton) indicates if the UI left button / return button should be shown
     */

    hasLeftButton: false,

    /**
     * (hasMenuCaret) indicates if the menu item should be displayed with an caret
     */

    hasMenuCaret: false,

    /**
     * (hasRightArc) indicates if the standard right car should be displayed
     */

    hasRightArc: false,

  },


  /***
   *** User Interface Life Cycles
   ***/

  /**
   * (created)
   *
   * Executed when the application gets initialized
   *
   * Add any content that will be static here
   */

  created: function() {
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", "http://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("height", "100%");
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("id", "player");
    this.canvas.get(0).appendChild(iframe);



    /*var tag = document.createElement('script');
  		tag.src = 'https://www.youtube.com/iframe_api';
  		var firstScriptTag = document.getElementsByTagName('script')[0];
  		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);*/

    window.onPlayerReady = function(event) {
      console.log("Player Ready")
    }

    this.playerStarted = false;
    window.onPlayerStateChange = function(event) {
      // YT.PlayerState.ENDED
      // YT.PlayerState.PLAYING
      // YT.PlayerState.PAUSED
      // YT.PlayerState.BUFFERING
      // YT.PlayerState.CUED

      console.log("Player state changed")
      console.log(event);

      switch (event.data) {
        case YT.PlayerState.PLAYING:
          window.playerStarted = true;
          break;
        case YT.PlayerState.ENDED:
          window.playerStarted = false;
          break;
        case YT.PlayerState.PAUSED:
          window.playerStarted = false;
          break;
        case YT.PlayerState.CUED:
          window.playerStarted = false;
          break;

      }
    }
  },

  /**
   * (focused)
   *
   * Executes when the application gets the focus. You can either use this event to
   * build the application or use the created() method to predefine the canvas and use
   * this method to run your logic.
   */

  focused: function() {
    setTimeout(function() {
      window.player = new YT.Player('player', {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
      console.log(window.player);
    }, 3000);
  },


  /**
   * (lost)
   *
   * Lost is executed when the application looses it's context. You can specify any
   * logic that you want to run before the application gets removed from the DOM.
   *
   * If you enabled terminateOnLost you may want to save the state of your app here.
   */

  lost: function() {

  },

  /***
   *** Events
   ***/

  /**
   * (event) onControllerEvent
   *
   * Called when a new (multi)controller event is available
   */

  onControllerEvent: function(eventId) {
    console.log(eventId);
    console.log(this.playerStarted);

    switch (eventId) {
      case this.SELECT:
        {
          if (window.playerStarted) {
            window.player.pauseVideo();
          } else {
            window.player.playVideo();
          }
          break;
        }
    }

  },


})); /** EOF **/
