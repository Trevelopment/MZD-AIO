import {CustomApplication, CustomApplicationsHandler} from '../../casdk/resources/aio';
/**
 * Trez's First CASDK App
 *
 * @version: 1.0.0
 * @author: Trevelopment
 * @description First App Using CASDK
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * http://www.gnu.org/licenses/
 *
 */


/**
 * Custom Application
 */

CustomApplicationsHandler.register('app.myapp', new CustomApplication({

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

    js: [],

    /**
         * (css) defines css includes
         */

    css: ['app.css'],

    /**
         * (images) defines images that are being preloaded
         *
         * Images are assigned to an id, e.g. {coolBackground: 'images/cool-background.png'}
         */

    images: {

      appBackground: 'images/background.png',

    },
  },

  /**
     * (settings)
     *
     * An object that defines application settings
     */

  settings: {

    /**
         * (title) The title of the application in the Application menu
         */

    title: 'Trez Says',

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

    hasLeftButton: true,

    /**
         * (hasMenuCaret) indicates if the menu item should be displayed with an caret
         */

    hasMenuCaret: false,

    /**
         * (hasRightArc) indicates if the standard right arc should be displayed
         */

    hasRightArc: false,

  },


  /** *
     *** Application Life Cycles
     ***/

  /**
     * (created)
     *
     * Executed when the application is initialized for the first time. Once an application is
     * initialized it always keeps it's current state even the application is not displayed.
     *
     * Usually you want to initialize your user interface here and generate all required DOM Elements.
     *
     *
     * @event
     * @return {void}
     */

  created: () => {
    this.aiopanel = $('</div>').attr('id', 'appPanel').appendTo(this.canvas);
    $('<div class="accordion aio-panel">    <ul>            <li>                <input type="radio" name="select" class="accordion-select" checked />                <div class="accordion-title">                    <span>Title</span>                </div>                <div class="accordion-content">                    Content                </div>                <div class="accordion-separator"></div>            </li>            <li>                <input type="radio" name="select" class="accordion-select" />                <div class="accordion-title">                    <span>Title</span>                </div>                <div class="accordion-content">                    Content                </div>                <div class="accordion-separator"></div>            </li>            <li>                <input type="radio" name="select" class="accordion-select" />                <div class="accordion-title">                    <span>Title</span>                </div>                <div class="accordion-content">                    Content                </div>                <div class="accordion-separator"></div>            </li>            <li>                <input type="radio" name="select" class="accordion-select" />                <div class="accordion-title">                    <span>Title</span>                </div>                <div class="accordion-content">                    Content                </div>                <div class="accordion-separator"></div>            </li>    </ul>    </div>').appendTo(this.aiopanel);
    this.button1 = $('<button onclick=\'$(\'.CommonBgImg\').toggleClass(\'toggler\');\'>Toggler<button/>').appendTo(this.aiopanel);
  },

  /**
     * (focused)
     *
     * Executes when the application gets displayed on the Infotainment display.
     *
     * You normally want to start your application workflow from here and also recover the app from any
     * previous state.
     *
     * @event
     * @return {void}
     */

  focused: () => {

  },


  /**
     * (lost)
     *
     * Lost is executed when the application is being hidden.
     *
     * Usually you want to add logic here that stops your application workflow and save any values that
     * your application may require once the focus is regained.
     *
     * @event
     * @return {void}
     */

  lost: () => {

  },


  /**
     * (terminated)
     *
     * Usually you never implement this lifecycle event. Your custom application stays alive and keeps it's
     * state during the entire runtime of when you turn on your Infotainment until you turn it off.
     *
     * This has two advantages: First all of your resources (images, css, videos, etc) all need to be loaded only
     * once and second while you wander through different applications like the audio player, your application
     * never needs to be reinitialized and is just effectivily paused when it doesn't have the focus.
     *
     * However there are reasons, which I can't think any off, that your application might need to be
     * terminated after each lost lifecyle. You need to add {terminateOnLost: true} to your application settings
     * to enable this feature.
     *
     * @event
     * @return {void}
     */

  terminated: () => {

  },


  /** *
     *** Application Events
     ***/


  /**
     * (event) onContextEvent
     *
     * Called when the context of an element was changed
     *
     * The eventId might be either FOCUSED or LOST. If FOCUSED, the element has received the
     * current context and if LOST, the element's context was removed.
     *
     * @event
     * @param {string} eventId - The eventId of this event
     * @param {object} context - The context of this element which defines the behavior and bounding box
     * @param {JQueryElement} element - The JQuery DOM node that was assigned to this context
     * @return {void}
     */

  onContextEvent: function(eventId, context, element) {
    switch (eventId) {
      /**
             * The element received the focus of the current context
             */

      case this.FOCUSED:

        break;

        /**
             * The element lost the focus
             */

      case this.LOST:

        break;
    }
  },

  /**
     * (event) onControllerEvent
     *
     * Called when a new (multi)controller event is available
     *
     * @event
     * @param {string} eventId - The Multicontroller event id
     * @return {void}
     */

  onControllerEvent: function(eventId) {
    switch (eventId) {
      /*
             * MultiController was moved to the left
             */
      case this.LEFT:
        return 'giveFocusLeft';
        break;

        /*
             * MultiController was moved to the right
             */
      case this.RIGHT:
        this.label2 = $('<div/>').html('What up?<br>').appendTo(this.canvas);
        this.label2.css('left', '0%');
        break;

        /*
             * MultiController was moved up
             */
      case this.UP:
        this.label3 = $('<div/>').html('Hey<br>').appendTo(this.canvas);
        this.label3.css('left', '50%');
        $('[app="app.myapp"]').css({'opacity': '1'});
        break;

        /*
             * MultiController was moved down
             */
      case this.DOWN:
        this.label4 = $('<div/>').html('Fosho!<br>').appendTo(this.canvas);
        this.label4.css('bottom', '100%');
        $('[app="app.myapp"]').css({'opacity': '0.3'});
        break;

        /*
             * MultiController Wheel was turned clockwise
             */
      case this.CW:
        $('[app="app.myapp"]').css({'background-image': 'none', 'background-color': 'transparent'});

        break;

        /*
             * MultiController Wheel was turned counter-clockwise
             */
      case this.CCW:
        $('[app="app.myapp"]').css({'background-image': 'images/backgroud3.png', 'background-color': '#000'});
        break;

        /*
             * MultiController's center was pushed down
             */
      case this.SELECT:
        this.label.css('color', ['red', 'green', 'blue', 'yellow'][(Math.floor(Math.random() * 4))]);
        this.label2.css('color', ['red', 'green', 'blue', 'yellow'][(Math.floor(Math.random() * 4))]);
        this.label3.css('color', ['red', 'green', 'blue', 'yellow'][(Math.floor(Math.random() * 4))]);
        this.label4.css('color', ['red', 'green', 'blue', 'yellow'][(Math.floor(Math.random() * 4))]);
        this.label5.css('color', ['red', 'green', 'blue', 'yellow'][(Math.floor(Math.random() * 4))]);

        break;

        /*
             * MultiController hot key "back" was pushed
             */
      case this.BACK:
        this.back();
        break;
    }
  },


})); /** EOF **/
