import {CustomApplication, CustomApplicationsHandler} from '../../casdk/resources/aio';
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
 * Speedometer Application
 *
 * This is an implementation of the famous Speedometer by @serezhka
 */

CustomApplicationsHandler.register('app.speedometer', new CustomApplication({

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
         * Images are assigned to an id
         */

    images: {

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

    title: 'Speedometer',

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

    statusbarTitle: 'Speedometer',

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

  /**
     * Scales
     */

  scales: {

    na: {
      unit: 'mph',
      unitLabel: 'MPH',
      transformSpeed: DataTransform.toMPH,
      scaleMin: 0, // 0  = 0mph
      scaleMax: 13, // 12 = 120mph
      scaleMinSpeed: 0,
      scaleMaxSpeed: 120,
      scaleStep: 10, // every 10 miles / hour
      scaleAngle: 148,
      scaleRadius: 170,
      scaleOffsetStep: 4.8,
      scaleOffsetX: -11,
      scaleOffsetY: 0,
      scaleWidth: 278,
      scaleHeight: 241,
    },

    eu: {
      unit: 'kmh',
      unitLabel: 'km/h',
      scaleMin: 0, // 0  = 0mph
      scaleMax: 13, // 12 = 120km/h
      scaleMinSpeed: 0,
      scaleMaxSpeed: 240,
      scaleStep: 20, // every 20 km/h
      scaleAngle: 148,
      scaleRadius: 170,
      scaleOffsetStep: 4.6,
      scaleOffsetX: -15,
      scaleOffsetY: 0,
      scaleWidth: 278,
      scaleHeight: 241,
    },


  },

  // default scale
  scale: false,


  /**
     * Statistics
     */

  statistics: {
    topSpeed: 0,
    speeds: [],
    averageSpeeds: [],
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

  created: function() {
    // create speedometer panel
    this.speedoMeter = $('<div/>').attr('id', 'speedometer').appendTo(this.canvas);

    this.speedoUnit = $('<div/>').attr('id', 'speedounit').appendTo(this.speedoMeter);

    this.speedoDial = $('<div/>').attr('id', 'speedodial').appendTo(this.canvas);

    this.speedoRPM = $('<div/>').attr('id', 'speedorpm').appendTo(this.canvas);

    this.speedoRPMIndicator = $('<div/>').addClass('circle').appendTo(this.speedoRPM);

    this.speedoRPMLabel = $('<label/>').css({
      position: 'absolute',
      right: 0,
      top: 0,
    }).hide().appendTo(this.canvas);

    this.speedoIndicator = $('<div/>').attr('id', 'speedoindicator').appendTo(this.canvas);

    this.speedoCurrent = $('<div/>').append('0').attr('id', 'speedocurrent').appendTo(this.canvas);

    this.speedoDialText = $('<div/>').attr('id', 'speedodialtext').appendTo(this.canvas);
    this.button1 = $('<button/>').attr('id', 'Star1').text('Star 1').appendTo(this.canvas);
    this.button1.on('click', function() {
      $('body').toggleClass('star1');
    });
    this.button2 = $('<button/>').attr('id', 'Star2').text('Star 2').appendTo(this.canvas);
    this.button2.on('click', function() {
      $('body').toggleClass('star3');
    });
    this.button3 = $('<button/>').attr('id', 'ellipse').text('Ellipse').appendTo(this.canvas);
    this.button3.on('click', function() {
      $('body').toggleClass('ellipse');
    });
    this.button4 = $('<button/>').attr('id', 'minicoins').text('Mini Coins').appendTo(this.canvas);
    this.button4.on('click', function() {
      $('body').toggleClass('minicoins'); framework.sendEventToMmui('common', 'Global.Yes');
    });
    this.button4 = $('<button/>').attr('id', 'label3d').text('3D Label').appendTo(this.canvas);
    this.button4.on('click', function() {
      $('body').toggleClass('3dlabel');
    });
    /*
        this.button3 =  $("<button onclick='$('body').toggleClass('star2');>Invert<button/>").appendTo(this.canvas);
        this.button4 =  $("<button onclick='$('body').toggleClass('ellipse');>Ellipes<button/>").appendTo(this.canvas);
        this.button5 =  $("<button onclick='$('body').toggleClass('minicoins');>Mini Coins<button/>").appendTo(this.canvas);
        this.button5 =  $("<button onclick='$('body').toggleClass('3dlabel');>3d Label<button/>").appendTo(this.canvas);
*/
    // this.speedoGraph = $("<canvas/>").attr({id: "speedograph", width: 260, height: 150}).appendTo(this.canvas);

    // create gps
    this.createGPSPanel();

    // initialize scale
    this.updateSpeedoScale();

    // updates speed
    // this.updateSpeedoGraph();

    // register events
    this.subscribe(VehicleData.vehicle.speed, function(value) {
      this.setSpeedPosition(value);
    }.bind(this));

    this.subscribe(VehicleData.gps.heading, function(value) {
      this.setGPSHeading(value);
    }.bind(this));

    this.subscribe(VehicleData.vehicle.rpm, function(value, params) {
      this.setRPMPosition(value, params);
    }.bind(this));
  },

  /**
     * (focused)
     *
     * Executes when the application gets the focus. You can either use this event to
     * build the application or use the created() method to predefine the canvas and use
     * this method to run your logic.
     */

  focused: function() {

    // start collection
    /* this.collectorTimer = setInterval(function() {

            this.collectStatistics();

        }.bind(this), 1000);*/

    // update graph
    // this.updateSpeedoGraph();

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
    // stop collection
    clearInterval(this.collectorTimer);
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
    switch (eventId) {
      case this.CCW:
        $('button').toggle();
        break;

      case this.LEFT:
        return 'giveFocusLeft';
        break;

      case 'selectStart':

        const region = this.getRegion() == 'na' ? 'eu' : 'na';

        this.setRegion(region);

        break;
    }
  },

  /**
     * (event) onRegionChange
     *
     * Called when the region changes
     */

  onRegionChange: function(region) {
    this.updateSpeedoScale();

    // this.updateSpeedoGraph();
  },


  /**
     * (createGPSPanel)
     */

  createGPSPanel: function() {
    this.gpsPanel = $('<div/>').attr('id', 'gps').appendTo(this.canvas);
    this.gpsCompass = $('<div/>').attr('id', 'gpscompass').appendTo(this.canvas);

    const rose = [];

    // create rose
    ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].forEach(function(direction) {
      rose.push($('<div/>').addClass(direction.length == 2 ? 'small' : '').append(direction).appendTo(this.gpsCompass));
    }.bind(this));

    // apply radial transformation
    this.createScaleRadial(rose, {
      scaleMin: 0,
      scaleMax: 8,
      scaleStep: 45,
      scaleAngle: -90,
      scaleRadius: 78,
      scaleOffsetStep: 0,
      scaleOffsetX: 126,
      scaleOffsetY: 132,
      scaleWidth: 179,
      scaleHeight: 179,
      scaleHalfAngle: function(angle, radian, field) {
        if (angle % 2) {
          return angle < 0 || angle == 135 ? 45 : -45;
        }
      },
    });
  },


  /**
     * (updateSpeedoGraph)
     */

  updateSpeedoGraph: function() {
    // prepare
    const region = this.getRegion();
    const scale = this.scales[region] || this.scales.na;
    const canvas = this.speedoGraph.get(0);
    const ctx = canvas.getContext('2d');

    // clear
    canvas.width = canvas.width;

    // create divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 2;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(0, 75);
    ctx.lineTo(260, 75);
    ctx.stroke();

    // draw graph
    if (this.statistics.averageSpeeds.length) {
      const ds = Math.round(260 / (this.statistics.averageSpeeds.length));

      ctx.strokeStyle = 'rgba(255, 40, 25, 0.9)';
      ctx.setLineDash([0, 0]);
      ctx.lineWidth = 3;
      ctx.beginPath();

      this.statistics.averageSpeeds.forEach(function(avg, index) {
        const x = 260 - (index * ds);
        const y = 120 - DataTransform.scaleValue(avg, [0, 240], [0, 90]);

        if (index == 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }


    // draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '17px Tipperary, Arial, Helvetica, sans-serif';
    ctx.fillText(scale.scaleMaxSpeed, 5, 20);
    ctx.fillText(scale.scaleMinSpeed, 5, 140);

    // draw unit display


    // create divider
    $('<div/>').addClass('divider').appendTo(this.speedoGraph);

    // show
    this.speedoGraph.fadeIn('fast');
  },

  /**
     * (updateSpeedoScale)
     */

  updateSpeedoScale: function() {
    // hide old content
    if (this.hasSpeedoDialText) {
      this.speedoDialText.fadeOut('fast', function() {
        this.hasSpeedoDialText = false;
        this.updateSpeedoScale();
      }.bind(this));
      return;
    }

    // clear main container
    this.speedoDialText.empty().hide();

    // prepare
    const region = this.getRegion();
    const scale = this.scales[region] || this.scales.na;
    const container = $('<div/>').addClass('container').appendTo(this.speedoDialText);
    const fields = [];

    // set scale
    this.scale = scale;

    // create scale
    for (let s = scale.scaleMin; s < scale.scaleMax; s++) {
      // create scale label
      fields.push($('<div/>').addClass('speedotext').append(s * scale.scaleStep).appendTo(container));
    }

    // apply radial transformation
    this.createScaleRadial(fields, scale);

    // also update some other containers
    this.speedoUnit.html(scale.unitLabel);

    this.speedoDialText.fadeIn('fast');

    this.setSpeedPosition(this.__speed);

    // update content
    this.hasSpeedoDialText = true;

    // return the container
    return container;
  },

  /**
     * (createScaleRadial) creates a radial container
     */

  createScaleRadial: function(fields, scale) {
    const radius = scale.scaleRadius;
    const width = scale.scaleWidth;
    const height = scale.scaleHeight;
    const ox = scale.scaleOffsetX;
    const oy = scale.scaleOffsetY;
    let angle = scale.scaleAngle;
    let radian = scale.scaleAngle * (Math.PI / 180);
    const step = (2 * Math.PI) / (scale.scaleMax - scale.scaleMin + scale.scaleOffsetStep);


    fields.forEach(function(field) {
      // calculate positon
      const x = Math.round(width / 2 + radius * Math.cos(radian) - field.width()/2);
      const y = Math.round(height / 2 + radius * Math.sin(radian) - field.height()/2);

      field.css({
        top: oy + y,
        left: ox + x,
      });

      if (this.is.fn(scale.scaleHalfAngle)) {
        const value = scale.scaleHalfAngle(angle, radian, field);

        if (value !== false) {
          field.css({
            transform: 'rotate(' + value + 'deg)',
          });
        }
      }

      radian += step;
      angle = radian * (180 / Math.PI);
    }.bind(this));
  },


  /**
     * (setSpeedPosition)
     */

  setSpeedPosition: function(speed) {
    // prepare
    speed = speed || 0;
    this.__speed = speed;

    // update statistics
    if (speed > this.statistics.topSpeed) {
      this.statistics.topSpeed = speed;
    }

    // get localized reference speed
    let refSpeed = this.transformValue(this.__speed, this.scale.transformSpeed);
    if (refSpeed < this.scale.scaleMinSpeed) refSpeed = this.scale.scaleMinSpeed;
    if (refSpeed > this.scale.scaleMaxSpeed) refSpeed = this.scale.scaleMaxSpeed;

    // calculate speed on scale
    speed = DataTransform.scaleValue(refSpeed, [this.scale.scaleMinSpeed, this.scale.scaleMaxSpeed], [0, 240]);

    // set label
    this.speedoCurrent.html(refSpeed);

    // update dial
    if (speed < 0) speed = 0;
    if (speed > 240) speed = 240;

    speed = -120 + (speed);

    // stop current animation
    if (this.speedoIndicatorAnimation) {
      this.speedoIndicatorAnimation.stop();
    }
    this.speedoIndicatorAnimation = $({deg: this.__oldspeed || 0}).stop().animate({deg: speed}, {
      duration: 1000,
      step: function(d) {
        this.speedoIndicator.css({
          transform: 'rotate(' + d + 'deg)',
        });
      }.bind(this),
    });
    this.__oldspeed = speed;
  },


  /**
     * (setGPSHeading)
     */

  setGPSHeading: function(heading) {
    // 0 = North, 180 = Souths
    this.gpsPanel.css({
      transform: 'rotate(' + heading + 'deg)',
    });
  },

  /**
     * (setRPMPosition)
     */

  setRPMPosition: function(rpm, params) {
    this.speedoRPMLabel.html(rpm);
    // min
    if (rpm < 1000) {
      rpm = 0;
    } else {
      // calculate value
      rpm = 80 + DataTransform.scaleValue(rpm, [params.min, params.max], [0, 100]);
    }

    if (rpm == this.__oldrpm) return; // no update for that

    // stop current animation
    if (this.speedoRPMIndicatorAnimation) {
      this.speedoRPMIndicatorAnimation.stop();
    }
    this.speedoRPMIndicatorAnimation = $({deg: this.__oldrpm || 0}).stop().animate({deg: rpm}, {
      duration: 1000,
      step: function(d) {
        this.speedoRPMIndicator.css({
          transform: 'rotate(' + d + 'deg)',
          opacity: DataTransform.scaleValue(d, [0, 180], [0.5, 1]),
        });
      }.bind(this),
    });

    this.__oldrpm = rpm;
  },


  /**
     * (collectStatistics) starts collecting statistics and redraws the graph
     */

  collectStatistics: function() {
    return;

    this.statistics.speeds.push(this.__speed);

    if (this.statistics.speeds.length >= 5) {
      // calculate average
      let t = 0;
      this.statistics.speeds.forEach(function(v) {
        t += v;
      });

      const avg = Math.round(t / this.statistics.speeds.length);

      // push to average list
      this.statistics.averageSpeeds.unshift(avg);

      if (this.statistics.averageSpeeds.length > 15) {
        this.statistics.averageSpeeds.pop();
      }

      this.statistics.speeds = [];

      // update display
      this.updateSpeedoGraph();
    }
  },


})); /** EOF **/
