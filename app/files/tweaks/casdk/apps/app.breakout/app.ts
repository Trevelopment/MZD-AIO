import {CustomApplication, CustomApplicationsHandler} from '../../resources/aio';
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
 * breakout
 *
 * ?? game ever written for the Mazda Infotainment System
 *
 */


CustomApplicationsHandler.register('app.breakout', new CustomApplication({

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

    js: ['breakout.ts'],

    /**
     * (css) defines css includes
     */

    css: ['app.css'],

    /**
     * (images) defines images that are being preloaded
     *
     * Images are assigned to an id
     */

    images: {},

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

    title: 'Breakout',

    /**
     * (statusbar) Defines if the statusbar should be shown
     */

    statusbar: false,

    /**
     * (statusbarIcon) defines the status bar icon
     *
     * Set to true to display the default icon app.png or set a string to display
     * a fully custom icon.
     *
     * Icons need to be 37x37
     */

    statusbarIcon: false,

    /**
     * (statusbarTitle) overrides the statusbar title, otherwise title is used
     */

    statusbarTitle: false,


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


  /** *
   *** User Interface Life Cycles
   ***/

  /**
   * (created)
   *
   * Executed when the application gets initialized
   *
   * Add any content that will be static here
   */

  created: () => {
    // speed restriction
    this.speedRestrict = true;

    // score for this drive
    this.__highscore = 0; // this.get("highscore");

    // init breakout
    this.initializeGameBoard();

    // vehicle speed
    this.subscribe(VehicleData.vehicle.speed, function(value) {
      if (this.speedRestrict && value > 15) {
        this.gamelabel.html('Driving').fadeIn();
        this.breakout.pause();
      } else {
        this.gamelabel.fadeOut();
        this.breakout.start();
      }
    }.bind(this));
  },

  /**
   * (focused)
   */

  focused: () => {
    this.breakout.start();
  },

  /**
   * (lost)
   */

  lost: () => {
    this.breakout.pause();
  },

  /** *
   *** Events
   ***/

  /**
   * (event) onControllerEvent
   *
   * Called when a new (multi)controller event is available
   */

  onControllerEvent: function(eventId) {
    this.breakout.handle(eventId);
  },


  /** *
   *** Applicaton specific methods
   ***/

  initializeGameBoard: () => {
    this.gameBoard = $('<canvas/>').addClass('gameBoard').appendTo(this.canvas);

    $('<label/>').addClass('score').append('This Drive').appendTo(this.canvas);
    this.score = $('<span/>').addClass('score').append('0').appendTo(this.canvas);

    $('<label/>').addClass('highScore').append('High Score').appendTo(this.canvas);
    this.highScore = $('<span/>').addClass('highScore').append(this.__highscore || '0').appendTo(this.canvas);

    $('<label/>').addClass('lives').append('Lives').appendTo(this.canvas);
    this.lives = $('<span/>').addClass('lives').append('0').appendTo(this.canvas);

    this.gamelabel = $('<label/>').addClass('gamelabel').append('GAME OVER').appendTo(this.canvas);

    this.highScore.html(this.__highscore);
    this.breakout = new breakoutboard(this.gameBoard.get(0), function(_score, _lives) {
      this.score.html(_score);
      this.lives.html(_lives);

      if (_score > this.__highscore) {
        this.__highscore = _score;

        this.highScore.html(_score);

        // this.set("highscore", _score);
      }
    }.bind(this));

    this.score.on('click', () => {
      this.gamelabel.html('Speed Restriction ' + (this.speedRestrict ? 'Disabled': 'Enabled')).fadeIn(100).delay(1000).fadeOut(1000);
      return this.speedRestrict = !this.speedRestrict;
    });
  },


}));
