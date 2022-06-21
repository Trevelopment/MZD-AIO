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
 * WARNING: Thnstallation of this application requires modifications to your Mazda Connect system.
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
 *
 * Heavily modified by Peter-dk
 *
 */

CustomApplicationsHandler.register('app.gpsspeed', new CustomApplication({

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

    title: 'GPS Speed',

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

    statusbarTitle: 'GPS Speed',

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
      scaleMin: 0, // 0  = 0 km/h
      scaleMax: 13, // 12 = 120km/h
      scaleMinSpeed: 0, // km/h
      scaleMaxSpeed: 240, // max speed km/h
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
  scale: 'eu',

  speedMode: 'histogram', // Show speed graph or histogram

  /**
   * Statistics
   */

  statistics: {
    topSpeed: 0,
    speeds: [],
    averageSpeeds: [],
    km_bucket_width: 10,
    mph_bucket_width: 5,
    km_buckets: [24], // for speed histogram (km/h)
    mph_buckets: [24], // for speed histogram (mph)
    dataCount: 0, // number off calls (=entries in historam)
  },

  setSpeed: 0, // reference speed
  Speed: 0,
  startTime: 0, // holds time (count) of engine start in 1/10 secs
  altitude: 0,
  tOut: 0,
  tIn: 0,
  msgVisible: 'false', // indicate if msgBox is visible
  vehicleMoved: 'false', // indicate if buckets should be reset

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
    scale = this.scales['eu'];

    // create speedometer panel
    this.speedoMeter = $('<div/>').attr('id', 'speedometer').appendTo(this.canvas);
    this.speedoUnit = $('<div/>').attr('id', 'speedounit').appendTo(this.speedoMeter);
    this.speedoDial = $('<div/>').attr('id', 'speedodial').appendTo(this.canvas);
    this.speedoRPM = $('<div/>').attr('id', 'speedorpm').appendTo(this.canvas);
    this.speedoRPMIndicator = $('<div/>').addClass('circle').appendTo(this.speedoRPM);

    this.speedoRPMLabel = $('<label/>').css({
      position: 'absolute',
      left: 10,
      top: 0,
    }).appendTo(this.canvas); // }).hide().appendTo(this.canvas);

    this.speedoIndicator = $('<div/>').attr('id', 'speedoindicator').appendTo(this.canvas);
    this.speedoMarker = $('<div/>').attr('id', 'speedomarker').appendTo(this.speedoMeter); // Peter-dk

    this.speedoCurrent = $('<div/>').append('0').attr('id', 'speedocurrent').appendTo(this.canvas);
    this.speedoDialText = $('<div/>').attr('id', 'speedodialtext').appendTo(this.canvas);

    //   Peter-dk added...
    this.speedoGraph = $('<canvas/>').attr({id: 'speedograph', width: 260, height: 150}).appendTo(this.canvas);
    this.maxSpeedText = $('<div/>').attr('id', 'maxSpeedText').appendTo(this.canvas);
    this.headingText = $('<div/>').attr('id', 'headingText').appendTo(this.canvas);
    this.GPStimeText = $('<div/>').attr('id', 'GPStimeText').appendTo(this.canvas);
    this.altitudeText = $('<div/>').attr('id', 'altitudeText').appendTo(this.canvas);
    this.deltaSpeedText = $('<div/>').attr('id', 'deltaSpeedText').appendTo(this.canvas);
    this.tempOutText = $('<div/>').attr('id', 'tempOutText').appendTo(this.canvas);
    // this.tempInText = $('<div/>').attr('id', 'tempInText').appendTo(this.canvas);
    this.rpmText = $('<div/>').attr('id', 'rpmText').appendTo(this.canvas);
    // this.latAccText = $('<div/>').attr('id', 'latAccText').appendTo(this.canvas);
    // this.lonAccText = $('<div/>').attr('id', 'lonAccText').appendTo(this.canvas);
    this.driveTimeText = $('<div/>').attr('id', 'driveTimeText').appendTo(this.canvas);

    // create gps
    this.createGPSPanel();

    // initialize scale
    this.updateSpeedoScale();

    // updates speed    Peter-dk: activated
    this.updateSpeedoGraph();

    // register events
    this.subscribe(VehicleData.vehicle.speed, function(value) {
      this.setSpeedPosition(value);
    }.bind(this));

    this.subscribe(VehicleData.gps.heading, function(value) {
      this.setGPSHeading(value);
    }.bind(this));

    this.subscribe(VehicleData.gps.timestamp, function(value) {
      this.setGPStime(value);
    }.bind(this));

    this.subscribe(VehicleData.vehicle.rpm, function(value, params) {
      this.setRPMPosition(value, params);
    }.bind(this));

    // Peter-dk added ------------
    this.subscribe(VehicleData.gps.altitude, function(value) {
      this.setAltitude(value);
    }.bind(this));

    this.subscribe(VehicleData.temperature.outside, function(value) {
      this.setOutsideTemp(value);
    }.bind(this));

    /*        this.subscribe(VehicleData.temperature.intake, function(value) {
                this.setIntakeTemp(value);
            }.bind(this));

            this.subscribe(VehicleData.vehicle.latAcc, function(value, params) {
                this.setLatAcc(value, params);
            }.bind(this));

            this.subscribe(VehicleData.vehicle.lonAcc, function(value, params) {
                this.setLonAcc(value, params);
            }.bind(this));
    */
    this.subscribe(VehicleData.vehicle.startTime, function(value) {
      this.setStartTime(value);
    }.bind(this));

    this.subscribe(VehicleData.vehicle.curTime, function(value) {
      this.setCurTime(value);
    }.bind(this));

    // create help message box
    this.msgBox = $('<canvas/>').attr({id: 'msg', width: 480, height: 300}).addClass('gpsspeedMsg').appendTo(this.canvas);
    const canvas = this.msgBox.get(0);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; // 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 30px Tipperary, Arial, Helvetica, sans-serif';
    ctx.fillText('Help text', 10, 30);

    ctx.font = '22px Tipperary, Arial, Helvetica, sans-serif';
    ctx.fillText('Push: Toggle Region (eu/na)', 10, 70);
    ctx.fillText('Rotate: Set Local Speed Limit (+- 10)', 10, 100);
    ctx.fillText('Left: Toggle Help (this pop-up)', 10, 130);
    ctx.fillText('Right: Toggle window (graph/histogram)', 10, 160);
    ctx.fillText('Up: TBD', 10, 190);
    ctx.fillText('Down: TBD', 10, 220);

    ctx.font = '18px Tipperary';
    ctx.fillText('NB: This progam is just for fun, all use is at your own risk!', 10, 245);
    ctx.fillText('Modified by Peter-dk', 300, 30);

    ctx.font = '22px Tipperary, Arial, Helvetica, sans-serif';
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(10, 265, 460, 30);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('This window closes after 5 seconds', 10, 290);

    // create our context aware sections
    this.createButtonSections();

    this.setRegion('eu'); // Peter-dk

    // start collection - originally in (focused)   Peter-dk: activated
    this.collectorTimer = setInterval(function() {
      this.collectStatistics();
    }.bind(this), 1000);

    for (let i = 0; i < 24; i++) {
      this.statistics.km_buckets[i] = 0;
      this.statistics.mph_buckets[i] = 0;
    }
    this.statistics.dataCount = 0;
  },

  /**
   * (focused)
   *
   * Executes when the application gets the focus. You can either use this event to
   * build the application or use the created() method to predefine the canvas and use
   * this method to run your logic.
   */

  focused: function() {
    // update graph    Peter-dk: activated
    this.updateSpeedoGraph();
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
    // clearInterval(this.collectorTimer);

  },


  createButtonSections: function() {
    [
      {top: 40, left: 730, title: '?'},
      {top: 270, left: 700, title: ''}, // Right button

    ].forEach(function(item) {
      /**
       * addContext is our main method to make anything a context aware item and expects either
       * a JQUERY or DOM element.
       *
       */

      this.addContext($('<div/>').addClass('button').css(item).append(item.title).appendTo(this.canvas), function(event, element) {

      });
    }.bind(this));
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
      case 'selectStart':
        const region = this.getRegion() == 'na' ? 'eu' : 'na';
        this.setRegion(region);
        break;

      case 'cw':
        if (this.setSpeed < 240) this.setSpeed = this.setSpeed + 10;
        this.updateSetSpeedText();
        break;

      case 'ccw':
        this.updateSetSpeedText();
        if (this.setSpeed > 0) this.setSpeed = this.setSpeed - 10;
        break;

      case 'rightStart':
        if (this.speedMode == 'graph') {
          this.speedMode = 'histogram';
        } else {
          this.speedMode = 'graph';
        }
        this.updateSpeedoGraph();
        break;

      case 'leftStart':
        this.helpOpen = !this.helpOpen;
        if (this.helpOpen) {
          clearTimeout(this.helpTimeout);
          this.showHelp(6);
        } else {
          $('.gpsspeedMsg').hide();
        }
        break;

      case 'upStart':

        break;
    }
  },


  onContextEvent: function(eventId, context, element) {
    // We only get not processed values from the multicontroller here

    switch (eventId) {
      case 'lost':
        // context = Object {index: 0, boundingBox: Object, enabled: true}
        // element = [div.button, prevObject: jQuery.fn.jQuery.init[1], context: undefined, selector: "[contextIndex=0]"
        break;

      case 'focused':
        // context = Object {index: 1, boundingBox: Object, enabled: true}
        // element = [div.button, prevObject: jQuery.fn.jQuery.init[1], context: undefined, selector: "[contextIndex=1]"

        if (context.index == 0) { // Help button
          // this.speedoRPMLabel.html("<div style='font-size:24px; color:blue;'>Button1</div>");
          this.showHelp(4);
        }

        if (context.index == 1) { // Right button
          // this.speedoRPMLabel.html("<div style='font-size:24px; color:red;'>Button2</div>");
          if (this.speedMode == 'graph') {
            this.speedMode = 'histogram';
          } else {
            this.speedMode = 'graph';
          }
          this.updateSpeedoGraph();
        }
        break;

      case 'goBack':
        break;

      case 'selectStart':
        break;
    }
  },


  padLeft: function(nr, n, str) { // add n leading character (str) to number (nr)
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
  },


  showHelp: function(seconds) {
    // $('.gpsspeedMsg').get(0).getContext("2d").fillText("This window closes after " + seconds + " seconds", 10, 290);
    this.helpOpen = true;
    $('.gpsspeedMsg').show();
    const that = this;
    this.helpTimeout = setTimeout(function() {
      $('.gpsspeedMsg').hide();
      return that.helpOpen = false;
    }, seconds * 1000); // delay closing of window
  },

  /**
   * (event) onRegionChange
   *
   * Called when the region changes
   */

  onRegionChange: function(region) {
    this.updateSpeedoScale();
    this.updateSpeedoGraph(); //   Peter-dk: activated
    this.updateOutsideTemp(this.__tOut);
    // this.updateIntakeTemp(this.__tIn);
    this.updateAltitude(this.__altitude);
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
      scaleOffsetX: -11, // 126,
      scaleOffsetY: -11, // 132,
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
    const scale = this.scales[region]; //  || this.scales.eu,
    const canvas = this.speedoGraph.get(0);
    const ctx = canvas.getContext('2d');
    let x; let y; let i;

    // clear
    canvas.width = canvas.width;
    if (this.speedMode == 'graph') { // draw speed graph
      // create divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 3;
      // ctx.setLineDash([2, 2]); // Peter-dk: Dashed lines do work in the car
      ctx.beginPath();
      y = DataTransform.scaleValue(0, [scale.scaleMaxSpeed, scale.scaleMinSpeed], [0, 150]);
      ctx.moveTo(0, y - 1);
      ctx.lineTo(260, y);

      y = DataTransform.scaleValue(100, [scale.scaleMaxSpeed, scale.scaleMinSpeed], [0, 150]);
      ctx.moveTo(0, y);
      ctx.lineTo(260, y);

      y = DataTransform.scaleValue(200, [scale.scaleMaxSpeed, scale.scaleMinSpeed], [0, 150]);
      ctx.moveTo(0, y);
      ctx.lineTo(260, y);
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.beginPath();
      y = DataTransform.scaleValue(50, [scale.scaleMaxSpeed, scale.scaleMinSpeed], [0, 150]);
      ctx.moveTo(0, y);
      ctx.lineTo(260, y);

      y = DataTransform.scaleValue(150, [scale.scaleMaxSpeed, scale.scaleMinSpeed], [0, 150]);
      ctx.moveTo(0, y);
      ctx.lineTo(260, y);
      ctx.stroke();

      // draw graph
      if (this.statistics.averageSpeeds.length) {
        const ds = Math.round(260 / (this.statistics.averageSpeeds.length));

        ctx.strokeStyle = 'rgba(255, 40, 25, 0.9)';
        //     ctx.setLineDash([0, 0]);   // Peter-dk: Dashed lines do work in the car
        ctx.lineWidth = 3;
        ctx.beginPath();

        this.statistics.averageSpeeds.forEach(function(avg, index) {
          if (region == 'na') avg = DataTransform.toMPH(avg); // Convert to mph

          const x = 260 - (index * ds);
          const y = 150 - DataTransform.scaleValue(avg, [0, scale.scaleMaxSpeed], [0, 150]);

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

      if (region == 'eu') { // Peter-dk
        ctx.fillText('200', 5, 20); // scale.scaleMaxSpeed
        ctx.fillText('100', 5, 82);
        ctx.fillText('0 km/h', 5, 143);
      } else {
        ctx.fillText('100', 5, 20); // scale.scaleMaxSpeed
        ctx.fillText('50', 5, 82);
        ctx.fillText('0 mph', 5, 143);
      }
      ctx.fillText('2 min', 210, 20); // Peter-dk


      // create divider
      //    $('<div/>').addClass('divider').appendTo(this.speedoGraph);

      // show
      this.speedoGraph.fadeIn('fast');
    } else { // Peter-dk: Speed histogram
      let stH = 135; // Start height, y = 0

      const xOffset = 5; // x start
      const xScale = 12; // distance btw. vertical bars


      // draw histogram bars
      let maxB = 0;
      let scaleB = 1;

      ctx.strokeStyle = 'rgba(255, 0, 0, 0.75)'; // red
      ctx.lineWidth = 10; // width of bars

      if (this.__speed > 1 && this.vehicleMoved == 'false') { // reset buckets first time the car is moving
        this.vehicleMoved = 'true';
        for (i = 0; i < 24; i++) {
          this.statistics.km_buckets[i] = 0;
          this.statistics.mph_buckets[i] = 0;
        }
        this.statistics.dataCount = 0;
      }


      if (this.getRegion() == 'eu') {
        for (i = 0; i < 24; i++) { // find max value in km/h
          if (this.statistics.km_buckets[i] > maxB) maxB = this.statistics.km_buckets[i];
        }
        scaleB = stH / maxB;

        for (i = 0; i < 24; i++) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.75)'; // red
          if (i == Math.floor(this.__speed / this.statistics.km_bucket_width)) ctx.strokeStyle = 'rgba(0, 255, 0, 0.75)'; // paint active speed
          ctx.moveTo(i * xScale + xOffset + ctx.lineWidth / 2, stH);
          ctx.lineTo(i * xScale + xOffset + ctx.lineWidth / 2, stH - this.statistics.km_buckets[i] * scaleB);
          ctx.stroke();
        }
      } else {
        for (i = 0; i < 24; i++) { // find max value
          if (this.statistics.mph_buckets[i] > maxB) maxB = this.statistics.mph_buckets[i];
        }
        scaleB = stH / maxB;

        for (i = 0; i < 24; i++) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.75)'; // red
          if (i == Math.floor(DataTransform.toMPH(this.__speed) / this.statistics.mph_bucket_width)) ctx.strokeStyle = 'rgba(0, 255, 0, 0.75)'; // paint active speed
          ctx.moveTo(i * xScale + xOffset + ctx.lineWidth / 2, stH);
          ctx.lineTo(i * xScale + xOffset + ctx.lineWidth / 2, stH - this.statistics.mph_buckets[i] * scaleB);
          ctx.stroke();
        }
      }


      // draw lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, stH + 1);
      ctx.lineTo(260, stH + 1); // horizontal line

      x = DataTransform.scaleValue(0, [scale.scaleMinSpeed, scale.scaleMaxSpeed], [xOffset, 292]);
      ctx.moveTo(x - 2, 0);
      ctx.lineTo(x - 2, stH);

      x = DataTransform.scaleValue(100, [scale.scaleMinSpeed, scale.scaleMaxSpeed], [xOffset, 292]);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, stH);

      x = DataTransform.scaleValue(200, [scale.scaleMinSpeed, scale.scaleMaxSpeed], [xOffset, 292]);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, stH);
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.beginPath();
      x = DataTransform.scaleValue(50, [scale.scaleMinSpeed, scale.scaleMaxSpeed], [xOffset, 292]);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, stH);

      x = DataTransform.scaleValue(150, [scale.scaleMinSpeed, scale.scaleMaxSpeed], [xOffset, 292]);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, stH);
      ctx.stroke();


      // draw labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '14px Tipperary, Arial, Helvetica, sans-serif';

      stH = 149;
      if (region == 'eu') { // Peter-dk
        ctx.fillText('0 km/h', 0, stH);
        ctx.fillText('100', 112, stH);
        ctx.fillText('200', 233, stH); // scale.scaleMaxSpeed
      } else {
        ctx.fillText('0 mph', 5, stH);
        ctx.fillText('50', 122, stH);
        ctx.fillText('100', 236, stH); // scale.scaleMaxSpeed
      }
      ctx.font = '17px Tipperary, Arial, Helvetica, sans-serif';
      if (this.statistics.dataCount > 0) ctx.fillText(Math.round(maxB / this.statistics.dataCount * 100) + ' %', 200, 17); // Peter-dk
    }

    // draw right arrow
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.moveTo(206, 36);
    ctx.lineTo(206, 76);
    ctx.lineTo(226, 56);
    ctx.lineTo(206, 36);
    ctx.stroke();
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
    const scale = this.scales[region]; // || this.scales.na,
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
   * (createScaleRadial) creates a radial container. Called by CreateGPSpanel and UpdateSpeedoScale
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
      const x = Math.round(width / 2 + radius * Math.cos(radian) - field.width() / 2);
      const y = Math.round(height / 2 + radius * Math.sin(radian) - field.height() / 2);

      field.css({
        top: oy + y,
        left: ox + x,
      });
      /*
                  if(this.is.fn(scale.scaleHalfAngle)) {   // Peter-dk: Org. rotate text on compass rose

                      let value = scale.scaleHalfAngle(angle, radian, field);

                      if(value !== false) {
                          field.css({
                              transform: 'rotate(' + value + 'deg)'
                          });
                      }

                  }

       */
      if (this.is.fn(scale.scaleHalfAngle)) { // Peter-dk: rotate text on compass rose
        const value = angle + 90;
        field.css({
          transform: 'rotate(' + value + 'deg)',
        });
      }

      radian += step;
      angle = radian * (180 / Math.PI);
    }.bind(this));
  },


  /*
   *  Highlight line if above 10%, 20%, 30% of speed limit
   *  NB: This function only work in km/h and reflects the danish traffic regulation.
   *  It has to be adapted to local laws in other counties
   */

  updateSetSpeedText: function() {
    let percent; let policeSpeed;

    if (this.setSpeed > 0) {
      percent = (this.Speed - this.setSpeed) / this.setSpeed * 100;
      policeSpeed = this.Speed; // DataTransform.toMPH(

      if (this.getRegion() == 'eu') { // in km/h
        // This is specific for DK
        // policeSpeed = this.Speed * 0.97;
        // if (this.Speed - policeSpeed > 3) policeSpeed = this.Speed - 3;
        // policeSpeed = Math.round(policeSpeed + 1); //Just to be sure...

        this.deltaSpeedText.html('Speed limit <b>' + this.setSpeed + '</b> km/h: ' + Math.round(percent) + ' %');

        if (policeSpeed - this.setSpeed > 0) {
          this.deltaSpeedText.html('<b style=\'color:yellow\'>Speed limit ' + this.setSpeed + ' km/h: ' + Math.round(percent) + ' %</b>');
        }
        if ((policeSpeed - this.setSpeed) / this.setSpeed * 100 > 10) {
          this.deltaSpeedText.html('<b style=\'color:red\'>Speed limit ' + this.setSpeed + ' km/h: ' + Math.round(percent) + ' %</b>');
        }
        if ((policeSpeed - this.setSpeed) / this.setSpeed * 100 > 20) {
          this.deltaSpeedText.html('<b style=\'color:red; background:yellow\'>Speed limit ' + this.setSpeed + ' km/h: ' + Math.round(percent) + ' %</b>');
        }
      } else { // in mph
        this.deltaSpeedText.html('Speed limit <b>' + this.setSpeed + '</b> mph: ' + Math.round(percent) + ' %');

        if (policeSpeed - this.setSpeed > 0) {
          this.deltaSpeedText.html('<b style=\'color:yellow\'>Speed limit ' + this.setSpeed + ' mph: ' + Math.round(percent) + ' %</b>');
        }
        if ((policeSpeed - this.setSpeed) / this.setSpeed * 100 > 10) {
          this.deltaSpeedText.html('<b style=\'color:red\'>Speed limit ' + this.setSpeed + ' mph: ' + Math.round(percent) + ' %</b>');
        }
        if ((policeSpeed - this.setSpeed) / this.setSpeed * 100 > 20) {
          this.deltaSpeedText.html('<b style=\'color:red; background:yellow\'>Speed limit ' + this.setSpeed + ' mph: ' + Math.round(percent) + ' %</b>');
        }
      }
    } else {
      this.deltaSpeedText.html('Set speed: Off');
    }
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

    // Peter-dk
    let plotMaxSpeed = this.statistics.topSpeed;

    if (this.getRegion() == 'na') plotMaxSpeed = Math.round(DataTransform.toMPH(plotMaxSpeed));

    this.maxSpeedText.html('Max speed: ' + plotMaxSpeed + ' ' + this.scale.unitLabel);

    this.Speed = refSpeed;

    this.updateSetSpeedText();

    if (this.getRegion() == 'na') plotMaxSpeed = Math.round(plotMaxSpeed * 2);
    const R = 117;
    const xc = 118;
    const yc = -70;
    const alfa = -(plotMaxSpeed + 60) * Math.PI / 180;
    const x2 = xc + R * Math.sin(alfa);
    const y2 = yc + R * Math.cos(alfa);

    //        this.speedoMarker.css({
    //            transform: 'rotate(' + (this.statistics.topSpeed + 60) + 'deg)'
    //            transform: 'translate(' + x2 + 'px, ' + y2 + 'px)'
    //        })

    this.speedoMarker.css({
      transform: 'translate(' + x2 + 'px, ' + y2 + 'px)',
    });

    this.__oldspeed = speed;
  },


  /**
   * (setGPStime)   Peter-dk
   */

  setGPStime: function(timestamp) {
    // NB: The Date function work in the emulator, but does not work in the car!!!
    // NB: This code is not good - if anyone know a better algorithm, please add...
    // ...need correction for time zone, DST and leap year

    const normal = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
    const leap = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
    const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let month; let year;
    let days = Math.floor((timestamp - 1451602800) / 3600 / 24); // subtract epoc of 1/1-2016 and convert to days since 1/1-2016

    day = -1 * 3600; // subtract time zone, -1 hr in DK

    if (days <= 366) { // ie 2016
      year = 2016;
      for (i = 1; i < 12; i++) {
        if (days < leap[i]) break;
      }
      days = days - leap[i - 1] + 1;
      month = i;
    } else {
      year = 2017 + Math.floor((days - 366) / 365);
      days = days - 365 * (year - 2016);
      for (i = 1; i < 12; i++) {
        if (days < normal[i]) break;
      }
      days = days - normal[i - 1];
      month = i;
    }

    if (this.getRegion() == 'eu') { // Peter-dk
      this.GPStimeText.html('GPS date: ' + this.padLeft(days, 2, '0') + '-' + this.padLeft(month, 2, '0') + '-' + year);
    } else {
      this.GPStimeText.html('GPS date: ' + mo[month - 1] + '-' + days + '-' + year);
    }
  },


  /**
   * (setGPSHeading)
   */

  setGPSHeading: function(heading) {
    heading = heading + 180; // Peter-dk: Input is 180 deg off for some reason...
    while (heading > 360) {heading = heading - 360;}
    while (heading < 0) {heading = heading + 360;}

    // 0 = North, 180 = South
    const corrHeading = 360 - heading;
    this.gpsCompass.css({ // Peter-dk: org. gpsPanel
      transform: 'rotate(' + corrHeading + 'deg)',
    });
    this.headingText.html('Heading: ' + Math.round(heading) + ' deg'); // Peter-dk
  },


  /**
   * (setAltitude)
   */

  setAltitude: function(altitude) {
    this.__altitude = altitude;
    this.updateAltitude(altitude);
  },

  updateAltitude: function(altitude) {
    if (this.getRegion() == 'eu') {
      this.altitudeText.html('Altitude: ' + Math.round(altitude) + ' m'); // Peter-dk
    } else {
      this.altitudeText.html('Altitude: ' + Math.round(altitude * 3.28) + ' ft');
    }
  },

  /**
   * (setOutsideTemp)
   */
  setOutsideTemp: function(temp) {
    this.__tOut = temp;
    this.updateOutsideTemp(temp);
  },

  updateOutsideTemp: function(temp) {
    let t = Math.round(temp - 40);

    if (this.getRegion() == 'eu') { // Peter-dk
      if (t < 0) {
        this.tempOutText.html('<b style=\'color:red\'>T<sub>out</sub>= ' + t + ' &degC</b>');
      } else {
        this.tempOutText.html('T<sub>out</sub>= ' + t + ' &degC');
      }
    } else {
      t = DataTransform.toDegF(temp - 40);
      if (t < DataTransform.toDegF(0)) {
        this.tempOutText.html('<b style=\'color:red\'>T<sub>out</sub>= ' + t + ' &degF</b>');
      } else {
        this.tempOutText.html('T<sub>out</sub>= ' + t + ' &degF');
      }
    }
  },


  /**
   * (setIntakeTemp)

  setIntakeTemp: function(temp) {
      this.__tIn = temp;
      this.updateIntakeTemp(temp);
  },

  updateIntakeTemp: function(temp) {
      let t = Math.round(temp - 40);

      if (this.getRegion() == 'eu') { // Peter-dk
          if (t < 0) {
              this.tempInText.html("<b style='color:red'>T<sub>in</sub>= "+ t + ' &degC</b>');
          } else {
              this.tempInText.html('T<sub>in</sub>= '+ t + ' &degC');
          }
      } else {
          t = DataTransform.toDegF(temp-40);
          if (t < DataTransform.toDegF(0)) {
              this.tempInText.html("<b style='color:red'>T<sub>in</sub>= "+ t + ' &degF</b>');
          } else {
              this.tempInText.html('T<sub>in</sub>= '+ t + ' &degF');
          }
      }
  },
  */

  /**
     * (setALatcc)
     *

    setLatAcc: function(latAcc, params) {
        this.latAccText.html('Lat Acc: '+ Math.round(latAcc - 4000)); //Peter-dk
    },

    setLonAcc: function(lonAcc, params) {
        this.lonAccText.html('Lon Acc: '+ Math.round(lonAcc - 4000)); //Peter-dk
    },
    */
  setStartTime: function(stTime) {
    this.startTime = stTime; // Peter-dk
  },

  setCurTime: function(curTime) {
    if (this.startTime == 0) this.startTime = curTime; // if startTime was not set when this is activated

    let mins = Math.round((curTime - this.startTime) / 600);
    const hrs = Math.floor(mins / 60);
    mins = mins - hrs * 60;
    if (hrs < 300) this.driveTimeText.html('Drive time: ' + hrs + ' h ' + mins + ' min'); // Peter-dk: filter for initial value
  },

  /**
   * (setRPMPosition)
   */

  setRPMPosition: function(rpm, params) {
    if (rpm == this.__oldrpm) return; // no update for that

    this.rpmText.html(rpm + ' rpm</div>');

    if (this.getRegion() == 'eu') { // Peter-dk
      rpm = DataTransform.scaleValue(rpm, [params.min, params.max], [0, 80]);
    } else {
      rpm = DataTransform.scaleValue(rpm, [params.min, params.max], [0, 160]);
    }

    // stop current animation
    if (this.speedoRPMIndicatorAnimation) {
      this.speedoRPMIndicatorAnimation.stop();
    }
    this.speedoRPMIndicatorAnimation = $({deg: this.__oldrpm || 0}).stop().animate({deg: rpm}, {
      duration: 600,
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
    // return; Peter-dk removed

    this.statistics.speeds.push(this.__speed);

    if (this.statistics.speeds.length >= 5) {
      // calculate average
      let t = 0;
      this.statistics.speeds.forEach(function(v) {t += v;});

      const avg = Math.round(t / this.statistics.speeds.length);

      // push to average list
      this.statistics.averageSpeeds.unshift(avg);

      if (this.statistics.averageSpeeds.length > 24) { // Peter-dk: org. 15
        this.statistics.averageSpeeds.pop();
      }

      this.statistics.speeds = [];

      // update display
      this.updateSpeedoGraph();
    }

    this.statistics.dataCount++;

    let v;
    // save km values
    v = Math.floor(this.__speed / this.statistics.km_bucket_width); // decide which bucket to put it in
    this.statistics.km_buckets[v]++; // increment count in that bucket
    // save km values
    v = Math.floor(DataTransform.toMPH(this.__speed) / this.statistics.mph_bucket_width); // decide which bucket to put it in
    this.statistics.mph_buckets[v]++; // increment count in that bucket
  },


})); /** EOF **/
