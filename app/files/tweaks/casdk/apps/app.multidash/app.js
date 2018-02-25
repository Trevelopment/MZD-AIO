/**
 * [multidash]
 *
 * @version: 0.0.1
 * @author: [author]
 * @description [description]
 *
 * [license]
 */

/**
 * DataTransformation
 */

var MyDataTransform = {

	/**
	 * (toFeet) returns the Meters coverted to Feet
	 */

	toFeet: function(value) {
		return Math.round(value * 3.28084);
	},

	toCelsius: function(value) {
		return Math.round((value - 32) * 5 / 9);
	},

};

/**
 * Custom Application
 */

CustomApplicationsHandler.register("app.multidash", new CustomApplication({

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

		title: 'MultiDash',

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
		 * (statusbarHideHomeButton) hides the home button in the statusbar
		 */

		 statusbarHideHomeButton: false,

		/**
		 * (hasLeftButton) indicates if the UI left button / return button should be shown
		 */

		hasLeftButton: false,

		/**
		 * (hasMenuCaret) indicates if the menu item should be displayed with an caret
		 */

		hasMenuCaret: false,

		/**
		 * (hasRightArc) indicates if the standard right arc should be displayed
		 */

		hasRightArc: false,

	},


	/**
     * (regions)
     *
     * A object that allows us to manage the different regions
     */

    regions: {

        /**
         * North America (na)
         */

        na: {
        	speedUnit: 'MPH',
			speedTransform: DataTransform.toMPH,
			fuelConsUnit: 'Avg MPG',
			fuelConsTransform: DataTransform.toMPG,
        	temperatureUnit: 'f',
			temperatureTransform: false, // DataTransform.toFahrenheit,
			altitudeUnit: 'ft',
			altitudeTransform: MyDataTransform.toFeet
        },

        /**
         * Europe (eu)
         */

        eu: {
			speedUnit: 'KM/H',
			speedTransform: false,
			fuelConsUnit: 'Avg L/100km',
			fuelConsTransform: false,
        	temperatureUnit: 'c',
			temperatureTransform: MyDataTransform.toCelsius,
			altitudeUnit: 'm',
			altitudeTransform: false
        },
    },


	/**
	 * (config)
	 *
	 * An object that holds tweakable config values
	 */
	config: {
 		"theme": 0,
 		"fuelLevelMaxValue": 186,
 		"timezoneOffset": -5,
		"brightness": 100
 	},



	/***
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

	created: function() {

		// load config and update where necessary

		// this.getDefaultConfig();
		// this.getConfig();


		// helper data

		this.daysArray = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
		this.monthsArray = ['Jan','Feb','March','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
		this.headingsArray = ['N','NNE','NE','ENE','E','ESE', 'SE', 'SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
		this.themes = ['white', 'blue', 'green', 'red', 'purple', 'orange', 'yellow', 'pink', 'black'];


		this.totalSpeed = 0;
		this.totalSpeedTicks = 0;

		this.topSpeed = 0;
		this.avgSpeed = 0;

		this.timeTicks = 0;
		this.timeUpdated = false;

		this.fuelLevelQueue = [];
		this.fuelLevelQueueMax = 60; // max fuel level queue size
		this.fuelLevelTicks = 0;
		this.fuelLevelMod = 10; // when to recalculate the fuel level avg

		this.tripStartTime = new Date();
		this.updateTripTimerInterval = 1000;


		region = this.regions[this.getRegion()];


		// html elements

		this.mainContainer = $('<div/>').attr('id', 'main-container');
		this.topLeftCon = $("<div/>").attr('id', 'top-left-con');
		this.topRightCon = $("<div/>").attr('id', 'top-right-con');
		this.bottomCon = $("<div/>").attr('id', 'bottom-con');


		this.statusMessage = $("<div/>").attr('id', 'status-message');

		this.speedometer = $("<div/>").attr('id', 'speedometer').appendTo(this.topLeftCon);
		this.speedometerValue = $("<div/>").addClass('value').html('0').appendTo(this.speedometer);
		this.speedometerLabel = $("<label/>").addClass('label').html(region.speedUnit).appendTo(this.speedometer);

		this.topSpeedCon = $("<div/>").attr('id', 'top-speed').appendTo(this.topLeftCon);
		this.topSpeedConLabel = $("<label/>").addClass('label').html('Top Speed').appendTo(this.topSpeedCon);
		this.topSpeedConValue = $("<div/>").addClass('value').html('0').appendTo(this.topSpeedCon);

		this.avgSpeedCon = $("<div/>").attr('id', 'avg-speed').appendTo(this.topLeftCon);
		this.avgSpeedConLabel = $("<label/>").addClass('label').html('Avg Speed').appendTo(this.avgSpeedCon);
		this.avgSpeedConValue = $("<div/>").addClass('value').html('&nbsp;').appendTo(this.avgSpeedCon);



		this.timeCon = $("<div/>").attr('id', 'time-con').html('&nbsp;').appendTo(this.topRightCon);
		this.dateCon = $("<div/>").attr('id', 'date-con').html('&nbsp;').appendTo(this.topRightCon);

		this.temperature = $("<div/>").attr('id', 'temperature').appendTo(this.topRightCon);
		this.temperatureValue = $("<div/>").addClass('value').html('&nbsp;').appendTo(this.temperature);
		this.temperatureLabel = $("<label/>").addClass('label').html(region.temperatureUnit).appendTo(this.temperature);


		this.additionalStats = $('<div/>').attr('id', 'additional-stats').appendTo(this.topRightCon);

		this.heading = $('<div/>').attr('id', 'heading').appendTo(this.additionalStats);
		this.headingValue = $("<div/>").addClass('value').html('N').appendTo(this.heading);
		this.headingLabel = $("<label/>").addClass('label').html('Heading').appendTo(this.heading);

		this.avgFuelCons = $('<div/>').attr('id', 'avg-fuel-cons').appendTo(this.additionalStats);
		this.avgFuelConsValue = $("<div/>").addClass('value').html('&nbsp;').appendTo(this.avgFuelCons);
		this.avgFuelConsLabel = $("<label/>").addClass('label').html(region.fuelConsUnit).appendTo(this.avgFuelCons);

		this.altitude = $("<div/>").attr('id', 'altitude').appendTo(this.additionalStats);
		this.altitudeValue = $("<div/>").addClass('value').html('&nbsp;').appendTo(this.altitude);
		this.altitudeLabel = $("<label/>").addClass('label').html('Altitude').appendTo(this.altitude);

		this.tripTime = $("<div/>").attr('id', 'altitude').appendTo(this.additionalStats);
		this.tripTimeValue = $("<div/>").addClass('value').html('0s').appendTo(this.tripTime);
		this.tripTimeLabel = $("<label/>").addClass('label').html('Trip Time').appendTo(this.tripTime);


		this.fuelLevel = $('<div/>').addClass('fuel-level').appendTo(this.bottomCon);
		this.fuelPercentage = $('<div/>').addClass('fuel-percentage').appendTo(this.bottomCon);
		this.fuelIcon = $('<div/>').addClass('fuel-icon').appendTo(this.bottomCon);


		this.statusMessage.appendTo(this.mainContainer);
		this.topLeftCon.appendTo(this.mainContainer);
		this.topRightCon.appendTo(this.mainContainer);
		this.bottomCon.appendTo(this.mainContainer);
		this.mainContainer.appendTo(this.canvas);

		this.adjustBrightness(0);
		this.mainContainer.addClass('theme-'+this.themes[this.config.theme]);


		this.createSections();


		this.updateTripTime();
		this.updateTripTimer = setInterval(function() { this.updateTripTime(); }.bind(this), this.updateTripTimerInterval);
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

	focused: function() {
		this.updateTripTime();
		clearInterval(this.updateTripTimer);
		this.updateTripTimer = setInterval(function() { this.updateTripTime(); }.bind(this), this.updateTripTimerInterval);

		// this.mainContainer.addClass('shown');
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

	lost: function() {
		clearInterval(this.updateTripTimer);
		// this.mainContainer.removeClass('shown');
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

	terminated: function() {

	},


	/***
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

        switch(eventId) {

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
     * (event) onRegionChange
     *
     * Called when the region is changed
     */

    onRegionChange: function(region) {
		var curRegion = this.regions[region];

		this.speedometerLabel[0].innerHTML = curRegion.speedUnit;
		this.avgFuelConsLabel[0].innerHTML = curRegion.fuelConsUnit;
		this.temperatureLabel[0].innerHTML = curRegion.temperatureUnit;

		this.updateSection(0);
		this.updateSection(4);
		this.updateSection(5);
		this.updateSection(7);
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
		var tempVar;

		switch(eventId) {

			/*
			 * MultiController was moved to the left
			 */
			case this.LEFT:
				this.adjustBrightness(-10);
				break;

			/*
			 * MultiController was moved to the right
			 */
			case this.RIGHT:
				this.adjustBrightness(10);
				break;

			/*
			 * MultiController was moved up
			 */
			case this.UP:
				break;

			/*
			 * MultiController was moved down
			 */
			case this.DOWN:
				break;

			/*
			 * MultiController Wheel was turned clockwise
			 */
			case this.CW:
				tempVar = this.themes[this.config.theme];
				this.config.theme++;
				if (this.config.theme >= this.themes.length) {
					this.config.theme = 0;
				}

				this.mainContainer.removeClass('theme-'+tempVar).addClass('theme-'+this.themes[this.config.theme]);
				this.saveConfig();
				break;

			/*
			 * MultiController Wheel was turned counter-clockwise
			 */
			case this.CCW:
				tempVar = this.themes[this.config.theme];
				this.config.theme--;
				if (this.config.theme < 0) {
					this.config.theme = this.themes.length - 1;
				}

				this.mainContainer.removeClass('theme-'+tempVar).addClass('theme-'+this.themes[this.config.theme]);
				this.saveConfig();
				break;

			/*
			 * MultiController's center was pushed down
			 */
			case this.SELECT:
				tempVar	= (this.getRegion() == 'na') ? 'eu' : 'na';
				this.setRegion(tempVar);
				break;

			/*
			 * MultiController hot key "back" was pushed
			 */
			case this.BACK:
				break;
		}

	},


	adjustBrightness: function(adjust) {
		var newVal = this.config.brightness+adjust;

		if (newVal >= 20 && newVal <= 100) {
			this.config.brightness = newVal;
			this.mainContainer.css('opacity', this.config.brightness/100);
		}
	},

	transformHeading: function(heading) {
		var val = parseInt((heading/22.5)+0.5);

		return this.headingsArray[(val % 16)];
	},


	getDefaultConfig: function() {
		var fs = require('fs'),
			string;

		try {
			string = fs.readFileSync(this.location+'config.json', 'utf8');
		} catch (err) {
			if (err.code === 'ENOENT') {
				this.log.error('config file not found');
			} else {
				this.log.error('config file load error');
			}
		}

		if (string !== undefined) {
			$.extend(this.config, JSON.parse);
		}
	},


	getConfig: function() {
		var string = this.get('AppMultiDashConfig');

		if (string !== undefined) {
			$.extend(this.config, string);
		}
	},


	saveConfig: function() {
		this.set('AppMultiDashConfig', this.config);
	},


	updateTripTime: function() {
		var now = new Date(),
			diff = now - this.tripStartTime,
			diffH = Math.floor((diff % 86400000) / 3600000),
			diffM = Math.floor(((diff % 86400000) % 3600000) / 60000),
			diffS = Math.floor((((diff % 86400000) % 3600000) % 60000) / 1000),
			text;

		if (diffM === 0 && diffH === 0) {
			text = diffS+'s';
		} else {
			text = diffM+'m';

			if (this.updateTripTimerInterval === 1000) {
				// after done displaying seconds, set the trip timer to only run every minute
				clearInterval(this.updateTripTimer);
				this.updateTripTimerInterval = 60000;
				this.updateTripTimer = setInterval(function() { this.updateTripTime(); }.bind(this), this.updateTripTimerInterval);
			}

			if (diffH > 0) {
				text = diffH+'h '+text;
			}
		}

		this.tripTimeValue[0].innerHTML = text;
	},


	updateDateTime: function(timestamp) {
		var objDate = new Date(timestamp*1000),
			dotw, month, d, h, m, ap;

		// hack for my timezone atm
		objDate.setHours(objDate.getHours()+this.config.timezoneOffset);

		if (objDate.getFullYear() >= 2016) {
			if (this.timeTicks++ % 15 === 0 || !this.timeUpdated) {
				dotw = this.daysArray[objDate.getDay()];
				month = this.monthsArray[objDate.getMonth()];
				d = objDate.getDate();
				h = objDate.getHours();
	    		m = objDate.getMinutes();
				ap = (h <= 11) ? 'AM' : 'PM';

				if (h === 0) {
					h = 12;
				} else if (h > 12) {
					h -= 12;
				}

				if (m < 10) {
					m = '0'+m;
				}

				this.dateCon[0].innerHTML = dotw+', '+month+' '+this.ordinal_suffix_of(d);
				this.timeCon[0].innerHTML = h+':'+m+'<span class="ampm">'+ap+'</span>';

				if (!this.timeUpdated) {
					this.timeUpdated = true;
					this.dateCon.add(this.timeCon).addClass('shown');
				}
			}
		}
	},


	/*
	getFuelLevel: function() {
		var sum = this.fuelLevelQueue.reduce(function(a, b) { return a + b; }),
			avg = sum / this.fuelLevelQueue.length;

		return Math.round(DataTransform.scaleValue(avg, [0,this.config.fuelLevelMaxValue], [0,100]));
	},
	*/

	/*
	* http://stackoverflow.com/a/3783970/867676
	*/
	getFuelLevel: function() {
		var store = this.fuelLevelQueue.slice(), // clone the array
			frequency = {}, // array of frequency.
			max = 0, // holds the max frequency.
			result, // holds the max frequency element.
			use_mode = false,
			trim_range = 15,
			weight = 2,
			sum, avg, i, retval;

		// for easy testing
		// store = [186, 186, 173, 161, 173, 186, 180, 186, 186, 173, 161, 173, 186, 180, 186, 186, 173, 161, 173, 186, 180, 186, 186, 173, 161, 173, 186, 180, 186, 186, 173, 161, 173, 186, 180];

		for (var v in store) {
		    frequency[store[v]] = (frequency[store[v]] || 0) + 1; // increment frequency.
		    if (frequency[store[v]] > max) { // is this frequency > max so far ?
		        max = frequency[store[v]];  // update max.
		        result = store[v];          // update result.
		    }
		}

		if (use_mode) {
			retval = Math.round(DataTransform.scaleValue(result, [0,this.config.fuelLevelMaxValue], [0,100]));
		} else {
			// remove values that aren't within the trim_range of the result
			i = store.length;
			while (i--) {
				if (Math.abs(result - store[i]) > trim_range) {
					store.splice(i, 1);
				}
			}

			// give additional weight to the result value by essentially adding it 2 times as many
			sum = store.reduce(function(a, b) { return a + b; }) + (result*max*weight);

			retval =  sum / (store.length+(max*weight));
		}

		return Math.min(100, Math.round(DataTransform.scaleValue(retval, [0,this.config.fuelLevelMaxValue], [0,100])));
	},


	updateFuelLevel: function(value) {
		this.fuelLevel.css('width', value+'%');
		this.fuelPercentage[0].innerHTML = value+'%';
		this.fuelLevel.toggleClass('warning', value <= 10);
	},


	/*
	* http://stackoverflow.com/a/13627586/867676
	*/
	ordinal_suffix_of: function(i) {
	    var j = i % 10,
	        k = i % 100;
	    if (j == 1 && k != 11) {
	        return i + "st";
	    }
	    if (j == 2 && k != 12) {
	        return i + "nd";
	    }
	    if (j == 3 && k != 13) {
	        return i + "rd";
	    }
	    return i + "th";
	},


	/**
     * (createSections)
     *
     * This method registers all the sections we want to display
     */

    createSections: function() {

        // Here we define our sections

        this.sections = [

            // Vehicle speed
            {field: VehicleData.vehicle.speed, name: 'Speed'},

            // Vehicle RPM
            {field: VehicleData.vehicle.rpm, name: 'RPM'},

            // GPS Heading
            {field: VehicleData.gps.heading, name: 'Heading'},

            // Fuel Level
            {field: VehicleData.fuel.position, name: 'Fuel Level'},

            // Average Consumption
            {field: VehicleData.fuel.averageconsumption, name: 'Average Consumption'},

            // Temperature: Outside
            {field: VehicleData.temperature.outside, name: 'Temperature Outside'},

			// GPS Timestamp
            {field: VehicleData.gps.timestamp, name: 'GPS Timezone'},

			// GPS Altitude
            {field: VehicleData.gps.altitude, name: 'GPS Altitude'},

        ];




        // let's actually execute the subscriptions

        this.sections.forEach(function(section, sectionIndex) {

            this.subscribe(section.field, function(value) {

                // we got a new value for this subscription, let's update it
                this.updateSection(sectionIndex, value);

            }.bind(this));

        }.bind(this));

		// update speedometer label for region
		// this.log.debug('region '+this.regions[this.getRegion()].unit);
		// this.speedometerLabel.html(this.regions[this.getRegion()].unit);

    },


	/**
     * (updateSection)
     *
     * This method updates a value and also updates the display if necessary
     */

    updateSection: function(sectionIndex, value) {

        // just in case, let's do some sanity check
        if (sectionIndex < 0 || sectionIndex >= this.sections.length) return false;

		var section = this.sections[sectionIndex],
            name = section.name,
			curRegion = this.regions[this.getRegion()],
			refreshOnly = (value === undefined),
			displayVal;


		if (value === undefined) {
			value = section.value;
		}

		section.value = value;


		switch (sectionIndex) {
			// MPH
			case 0:
				displayVal = value;
				if (curRegion.speedTransform) {
					displayVal = curRegion.speedTransform(value);
				}

				if (isNaN(displayVal)) {
					this.speedometerValue[0].innerHTML = '&nbsp;';
				} else {
					this.speedometerValue[0].innerHTML = displayVal;

					if (!refreshOnly) {
						this.totalSpeed += value;

						if (this.totalSpeedTicks++ % 10 === 0) {
							// update average speed
							this.avgSpeed = Math.round(this.totalSpeed/this.totalSpeedTicks);
							if (curRegion.speedTransform) {
								this.avgSpeedConValue[0].innerHTML = curRegion.speedTransform(this.avgSpeed);
							} else {
								this.avgSpeedConValue[0].innerHTML = this.avgSpeed;
							}
						}

						if (value > this.topSpeed) {
							this.topSpeed = value;
							if (curRegion.speedTransform) {
								this.topSpeedConValue[0].innerHTML = curRegion.speedTransform(value);
							} else {
								this.topSpeedConValue[0].innerHTML = value;
							}
						}
					} else {
						if (curRegion.speedTransform) {
							this.avgSpeedConValue[0].innerHTML = curRegion.speedTransform(this.avgSpeed);
							this.topSpeedConValue[0].innerHTML = curRegion.speedTransform(this.topSpeed);
						} else {
							this.avgSpeedConValue[0].innerHTML = this.avgSpeed;
							this.topSpeedConValue[0].innerHTML = this.topSpeed;
						}
					}
				}
				break;

			// Heading
			case 2:
				displayVal	= this.transformHeading(value);
				this.headingValue[0].innerHTML = displayVal;
				break;

			// fuel level
			case 3:
				this.fuelLevelQueue.push(value);
				if (this.fuelLevelQueue.length > this.fuelLevelQueueMax) {
					this.fuelLevelQueue.shift();
				}

				// this.fuelLevelTicks = this.fuelLevelMod;
				if (this.fuelLevelTicks >= this.fuelLevelMod && this.fuelLevelTicks % this.fuelLevelMod === 0) {
					displayVal = this.getFuelLevel();
					this.updateFuelLevel(displayVal);
				}

				this.fuelLevelTicks++;
				break;

			// fuel consumption average
			case 4:
				displayVal = value;
				if (isNaN(displayVal) || displayVal === 0) {
					displayVal = '&nbsp;';
				} else {
					if (curRegion.fuelConsTransform) {
						displayVal = curRegion.fuelConsTransform(displayVal);
					}
					displayVal = displayVal/10;
				}
				this.avgFuelConsValue[0].innerHTML = displayVal;
				break;

			// Temperature
			case 5:
				if (value === 255) {
					displayVal =  '&nbsp;';
					this.temperature.removeClass('shown');
				} else {
					displayVal =  value;
					if (curRegion.temperatureTransform) {
						displayVal = curRegion.temperatureTransform(displayVal);
					}
					this.temperature.addClass('shown');
				}

				this.temperatureValue[0].innerHTML = displayVal;
				break;

			// GPS Timezone
			case 6:
				this.updateDateTime(value);
				break;

			// GPS Altitude
			case 7:
				displayVal = value;
				if (isNaN(displayVal)) {
					displayVal = '&nbsp;';
				} else {
					if (curRegion.altitudeTransform) {
						displayVal = curRegion.altitudeTransform(displayVal);
					}
					displayVal += '<span class="unit">'+curRegion.altitudeUnit+'</span>';
				}

				this.altitudeValue[0].innerHTML = displayVal;
				break;

			default:
				break;
		}
    },



})); /** EOF **/
