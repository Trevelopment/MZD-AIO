/**
 * Custom Application SDK for Mazda Connect Infotainment System
 * 
 * A micro framework that allows to write custom applications for the Mazda Connect Infotainment System
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
 * This is the main mini framework file that contains everything to run the custom application environment
 */

var CUSTOM_APPLICATION_VERSION='0.0.1';/*
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

var CustomApplication = (function(){

	/**
	 * The CustomApplication class is used as base class for all applications and defines the
	 * life cycle events and handles all inbound and outbound communication between the custom
	 * application and the Infotainment system.
	 *
	 * This class is initiated during the registration of an custom application and should never be called
	 * by an custom application directly.
	 *
	 * <pre>
	 *  Custom Applications should never all any method prefixed with __ since these methods are actually called and handled by the micro framework itself.
	 * </pre>
	 *
	 * @class
	 * @name  CustomApplication
	 * @param {object} application - The custom application
	 */

	function CustomApplication(application) {

		Object.keys(application).map(function(key) {
			if(!this[key]) {
				this[key] = application[key];
			}
		}.bind(this));

	}

	CustomApplication.prototype = /** @lends CustomApplication.prototype */{

		/**
		 * Executes the subscription everytime the value is updated
		 * @type {Number}
		 */
		ANY: 0,

		/**
		 * Executes the subscription only if the value is changed
		 * @type {Number}
		 */
		CHANGED: 1,

		/**
		 * Executes the subscription only of the value is greater than the value before
		 * @type {Number}
		 */
		GREATER: 2,

		/**
		 * Executes the subscription only if the value is lesser than the value before
		 * @type {Number}
		 */
		LESSER: 3,

		/**
		 * Executes the subscription only of the value is equal to the value before
		 * @type {Number}
		 */
		EQUAL: 4,

		/**
		 * The context eventId focused
		 * @type {String}
		 */
		FOCUSED: 'focused',

		/**
		 * The context eventId lost
		 * @type {String}
		 */
		LOST: 'lost',

		/**
		 * MultiController Event Left
		 * @type {String}
		 */
		LEFT: 'leftStart',

		/**
		 * MultiController Event Right
		 * @type {String}
		 */
		RIGHT: 'rightStart',

		/**
		 * MultiController Event Up
		 * @type {String}
		 */
		UP: 'upStart',

		/**
		 * MultiController Event Down
		 * @type {String}
		 */
		DOWN: 'downStart',

		/**
		 * MultiController Event Select
		 * @type {String}
		 */
		SELECT: 'selectStart',

		/**
		 * MultiController Event Wheel turned counterwise
		 * @type {String}
		 */
		CW: 'cw',

		/**
		 * MultiController Event Wheel turned counterclockwise
		 * @type {String}
		 */
		CCW: 'ccw',


		/**
		 * Creates the custom application's log object. This method is called during the initialization of the
		 * custom application.
		 *
		 * @protected
		 * @param {void}
		 * @returns {logger} The logger object exposing .debug, .info and .error
		 */

		__log: function() {

			this.log = {

				__logId: this.getId(),

				__toArray: function(args) {
					var result = Array.apply(null, args);

					result.unshift(this.__logId);

					return result;
				},

				debug: function() {
					CustomApplicationLog.debug.apply(CustomApplicationLog, this.__toArray(arguments));
				},

				// info
				info: function() {
					CustomApplicationLog.info.apply(CustomApplicationLog, this.__toArray(arguments));
				},

				// error
				error: function() {
					CustomApplicationLog.error.apply(CustomApplicationLog, this.__toArray(arguments));
				},
			};

		},

		/**
		 * Called when the application is initialized. An custom application implements the lifecycle
		 * event created to run custom code.
		 *
		 * @protected
		 * @param {function} [next] A callback that is executed after the method is completed
		 * @return {void}
		 */

		__initialize: function(next) {

			var that = this;

			// assign version
			this.__version = CUSTOM_APPLICATION_VERSION;

			// data arrays
			this.__subscriptions = {};
			this.__storage = {};
			this.__contextCounter = 0;
			this.__currentContextIndex = false;

			// global specific
			this.is = CustomApplicationHelpers.is();
			this.sprintr = CustomApplicationHelpers.sprintr;

			// initialize log
			this.__log();

			// initialize context
			this.__contexts = [];

			// application specific
			this.settings = this.settings ? this.settings : {};

			// register application subscriptions
			this.subscribe(VehicleData.general.region, function(value, payload) {

				this.setRegion(value);

			}.bind(this), this.CHANGED);

			this.__region = CustomApplicationDataHandler.get(VehicleData.general.region, 'na').value;

			// set loader status
			this.__loaded = false;

			// execute loader
			this.__load(function() {

				// finalize
				this.__loaded = true;

				// get storage
				this.__getstorage();

				// create surface and set some basic properties
				this.canvas = $("<div/>").addClass("CustomApplicationCanvas").attr("app", this.id);

				// assign default event for context fields
				this.canvas.on("click touchend", "[contextIndex]", function() {

					that.__setCurrentContext($(this).attr("contextIndex"));

				});

				// finalize and bootup
				this.__created = true;

				// execute life cycle
				this.__lifecycle("created");

				// all done
				this.__initialized = true;

				// continue
				if(this.is.fn(next)) {
					next();
				}

			}.bind(this));
		},


		/**
		 * Executes the resource loader. The application should define all it's required resources
		 * in the require section.
		 *
		 * @protected
		 * @param {function} [next] A callback that is executed after the method is completed
		 * @return {void}
		 */

		__load: function(next) {

			var loaded = 0, toload = 0, isFinished = function(o) {

				this.log.debug("Status update for loading resources", {loaded:loaded, toload: toload});

				var o = o === true || loaded == toload;

				if(o && this.is.fn(next)) {
					next();
				}

			}.bind(this);

			// loader
			if(this.is.object(this.require) && !this.__loaded) {

				// load javascripts
				if(this.require.js && !this.is.empty(this.require.js)) {
					toload++;
					CustomApplicationResourceLoader.loadJavascript(this.require.js, this.location, function() {
						loaded++;
						isFinished();
					});
				}

				// load css
				if(this.require.css && !this.is.empty(this.require.css)) {
					toload++;
					CustomApplicationResourceLoader.loadCSS(this.require.css, this.location, function() {
						loaded++;
						isFinished();
					});
				}

				// load images
				if(this.require.images && !this.is.empty(this.require.images)) {
					toload++;
					CustomApplicationResourceLoader.loadImages(this.require.images, this.location, function(loadedImages) {

						// assign images
						this.images = loadedImages;

						loaded++;
						isFinished();
					}.bind(this));
				}

				return;
			}

			isFinished(true);

		},


		/**
		 * Called by the CustomApplication Surface when the application receives the focus. It executes
		 * the lifecycle event focused.
		 *
		 * @protected
		 * @param {DOMElement} parent The div container assigned by the surface handler.
		 * @return {void}
		 */

		__wakeup: function(parent) {

			if(!this.__initialized) {

				return this.__initialize(function() {

					this.__wakeup(parent);

				}.bind(this));
			}

			// read storage
			this.__getstorage();

			// execute life cycle
			this.__lifecycle("focused");

			// add to canvas
			this.canvas.appendTo(parent);

			// measure context
			setTimeout(function() {
				this.__measureContext();
			}.bind(this), 25);
		},


		/**
		 * Called by the CustomApplication Surface when the application losses it's focus. It executes
		 * the lifecycle event lost.
		 *
		 * @protected.
		 * @return {void}
		 */

		__sleep: function() {

			// clear canvas
			if(this.canvas) {
				this.canvas.detach();
			}

			// write storage
			this.__setstorage();

			// execute life cycle
			this.__lifecycle("lost");

			// end life cycle if requested
			if(this.getSetting("terminateOnLost") === true) {

				// that's it!
				this.__terminate();
			}

		},

		/**
		 * Terminates the application and removes it completely. This method is never called except maybe
		 * by the Simulator.
		 *
		 * @protected
		 * @return {void}
		 */

		__terminate: function() {

			this.__lifecycle("terminated");

			this.canvas.remove();

			this.canvas = null;

			this.__initialized = false;
		},


		/**
		 * Called by the infotainment when a new multi controller event arrives. An custom application is
		 * exposing the onControllerEvent.
		 *
		 * @protected
		 * @param {string} eventId - The name of the controller event
		 * @return {void}
		 */

	    __handleControllerEvent: function(eventId) {

	    	// log
	    	this.log.info("Received Multicontroller Event", {eventId:eventId});

	    	// process to context
	    	if(this.__processContext(eventId)) return true;

	    	// pass to application
	    	if(this.is.fn(this.onControllerEvent)) {

	    		try {

	    			this.onControllerEvent(eventId);

	    			return true;

	    		} catch(e) {

	    		}
	    	}

	    	return false;
	    },


		/**
		 * This handles the lifecylce events of the custom application
		 *
		 * @protected
		 * @param {string} cycle - The name of the life cycle event
		 * @return {void}
		 */

	    __lifecycle: function(cycle) {

	    	try {

	    		this.log.info("Executing lifecycle", {lifecycle:cycle});

	    		// process internals for this life cycle
	    		switch(cycle) {

	    			case this.FOCUSED:

	    				// feed initial value before focus
	    				$.each(this.__subscriptions, function(id, params) {

	    					// call with current value
							this.__notify(id, CustomApplicationDataHandler.get(id), true);

						}.bind(this));

	    				break;

	    		}

	    		// hand over
	    		if(this.is.fn(this[cycle])) {
	    			this[cycle]();
	    		}


	    	} catch(e) {
	    		this.log.error("Error while executing lifecycle event", {lifecycle:cycle, error: e.message});

	    	}
	    },


		/**
		 * Executed when the CustomApplicationDataHandler has updated it's values
		 *
		 * @protected
		 * @param {string} id - The id of the data value
		 * @param {object} payload - A object containing various attributes of the data value
		 * @param {boolean} always - A overwrite that ignores the subscription.type
		 * @return {void}
		 */

	    __notify: function(id, payload, always) {

	    	id = id.toLowerCase();

	    	if(this.__subscriptions[id] && payload) {

	    		var subscription = this.__subscriptions[id], notify = false;

	    		// parse type
	    		switch(subscription.type) {

	    			case this.CHANGED:
	    				notify = payload.changed;
	    				break;

	    			case this.GREATER:

	    				notify = payload.value > payload.previous;
	    				break;

	    			case this.LESSER:

	    				notify = payload.value < payload.previous;
	    				break;

	    			case this.EQUAL:

	    				notify = payload.value == payload.previous;
	    				break;

	 	    		default:

	    				notify = true;
	    				break;

	    		}

	    		// always
	    		if(always) notify = true;

	    		// execute
	    		if(notify) {
	    			subscription.callback(payload.value, $.extend({},
	    				this.__subscriptions[id],
	    				payload
	    			));
	    		}
	   		}
	    },


		/**
		 * Returns a value from the setting structure of the CustomApplication
		 *
		 * @protected
		 * @param {string} id - The id of the data value
		 * @param {object} payload - A object containing various attributes of the data value
		 * @param {boolean} always - A overwrite that ignores the subscription.type
		 * @return {void}
		 */

		getSetting: function(name, _default) {
			return this.settings[name] ? this.settings[name] : (_default ? _default : false);
		},

		getId: function() {
			return this.id;
		},

		getTitle: function() {
			return this.getSetting('title');
		},

		getStatusbar: function() {
			return this.getSetting('statusbar');
		},

		getStatusbarTitle: function() {
			return this.getSetting('statusbarTitle') || this.getTitle();
		},

		getStatusbarIcon: function() {

			var icon = this.getSetting('statusbarIcon');

			if(icon === true) icon = this.location + "app.png";

			return icon;
		},

		getStatusbarHomeButton: function() {

			return this.getSetting('statusbarHideHomeButton') === true ? false : true;
		},

		getHasLeftButton: function() {
			return this.getSetting('hasLeftButton');
		},

		getHasRightArc: function() {
			return this.getSetting('hasRightArc');
		},

		getHasMenuCaret: function() {
			return this.getSetting('hasMenuCaret');
		},

		getRegion: function() {
			return this.__region || 'eu';  // Peter-dk: previous 'na'
		},

		getStorage: function() {
			return this.__storage;
		},

		/**
		 * (internal) setters
		 */

		setRegion: function(region) {

			if(this.__region != region) {
				this.__region = region;

				if(this.is.fn(this.onRegionChange)) {
					this.onRegionChange(region);
				}
			}
		},

		/**
		 * (internal) storage
		 *
		 * Storage specific methods - this needs to be finalized
		 */

		get: function(name, _default) {
			return this.__storage && this.is.defined(this.__storage[name]) ? this.__storage[name] : _default;
		},

		__getstorage: function() {

			try {
				this.__storage = JSON.parse(localStorage.getItem(this.getId()));
			} catch(e) {
				this.log.error("Could not get storage", {message: e.message});
			}

		},

		set: function(name, value) {
			this.__storage[name] = value;

			this.__setstorage();
		},

		__setstorage: function() {

			try {
				// get default
				if(!this.__storage) this.__storage = {};

				// local storage should work on all mazda systems
				localStorage.setItem(this.getId(), JSON.stringify(this.__storage));
			} catch(e) {
				this.log.error("Could not set storage", {message: e.message});
			}
		},

		/**
		 * (internal) subscribe
		 *
		 * Observes a specific vehicle data point
		 */

		subscribe: function(id, callback, type) {

			if(this.is.fn(callback)) {

				var o = {};
				if(this.is.object(id)) {
					o = id;
					id = o.id || false;
				}

				if(id) {
					// set all lowercase id
					id = id.toLowerCase();

					// register subscription
					this.__subscriptions[id] = $.extend({}, o, {
						id: id,
						type: type || this.CHANGED,
						callback: callback
					});

					// all set
					return true;
				}
			}

			return false;
		},

		/**
		 * (internal) unsubscribe
		 *
		 * Stops the observer for a specific vehicle data point
		 */

		unsubscribe: function(id) {

			id = id.toLowerCase();

			if(this.__subscriptions[id]) {
				this.__subscriptions[id] = false;
			}
		},

		/**
		 * (internal) removeSubscriptions
		 *
		 * Removes all subscriptions
		 */

		removeSubscriptions: function() {

			this.__subscriptions = {} // clear all
		},

		/**
		 * (internal) transformValue
		 *
		 * Calls a DataTransform object
		 */

		transformValue: function(value, transformer) {

			return this.is.fn(transformer) ? transformer(value) : value;

		},



    	/*
    	 * (internal) element
    	 *
    	 * creates a new jquery element and adds to the canvas
    	 */

	   	element: function(tag, id, classNames, styles, content, preventAutoAppend) {

	    	var el = $(document.createElement(tag)).attr(id ? {id: id} : {}).addClass(classNames).css(styles ? styles : {}).append(content);

	    	if(!preventAutoAppend) this.canvas.append(el);

	    	return el;
	    },

	    /**
	     * (internal) addContext
	     *
	     * Adds a new context to the context table
	     */

	    addContext: function(context, callback) {

	    	// format context
	    	switch(true) {

	    		case context.nodeName:

	    			context = $(content);

	    			break;

	    		case (context instanceof jQuery):

	    			break;

	    		default:

	    			return false;
	    	}

	    	// add element
	    	context.attr("contextIndex", this.__contextCounter || 0);

	    	// register into context
	    	this.__contexts.push({
	    		index: this.__contextCounter,
	    		callback: callback
	    	});

	    	// update counter
	    	this.__contextCounter += 1;

	    	// return context which is the actual dom element
	    	return context;
	    },

	    /**
	     * (protected) __measureContext
	     *
	     * Internal function to measure all contextes
	     */

	    __measureContext: function() {

	    	$.each(this.__contexts, function(index, context) {

	    		// get target
	    		var target = this.canvas.find(this.sprintr("[contextIndex={0}]", context.index));

	    		// sanity check
	    		if(!target.length) return false;

	    		// measure
	    		this.__contexts[index] = $.extend({}, this.__contexts[index], {
	    			boundingBox: $.extend({}, target.offset(), {
		    			width: target.outerWidth(),
		    			height: target.outerHeight(),
		    			bottom: target.offset().top + target.outerHeight(),
		    			right: target.offset().left + target.outerWidth()
		    		}),
	    			enabled: true,
	    		});

	    		var bb = this.__contexts[index].boundingBox;

	    		$.each(this.__contexts, function(intersectIndex, intersectContext) {

	    			if(intersectIndex != index && intersectContext.boundingBox) {

	    				var ib = intersectContext.boundingBox;

	    				if(bb.left <= ib.right && ib.left <= bb.right && bb.top <= ib.bottom && ib.top <= bb.bottom) {

	    					this.__contexts[index].enabled = false;

	    					return false;
	    				}
	    			}

	    		}.bind(this));

	    	}.bind(this));

	    	// set initial index
	    	if(this.__currentContextIndex === false && this.__contexts.length) {
	    		this.__setCurrentContext(this.__contexts[0].index); // first item
	    	}

	    },

	    /**
	     * (protected) __processContext
	     *
	     * processes the current context
	     */

	    __processContext: function(eventId, rms) {

	    	// sanity check
	    	if(!this.__contexts.length || this.__currentContextIndex === false) return false;

	    	// log
	    	this.log.debug("Context received new event", {eventId: eventId, index: this.__currentContextIndex});

	    	// process direction
	    	var nextIndex = false,
	    		lastDistance = false,
	    		current = this.__contexts[this.__currentContextIndex],
	    		ba = current.boundingBox,
	    		calc = function(i, o, index, r) {
	    			var d = r ? i - o : o - i;
	    			if(d >= 0 && (lastDistance === false || d < lastDistance)) {
	    				lastDistance = d;
	    				nextIndex = index;
	    			}
	    		};

	    	$.each(this.__contexts, function(index, context) {

	    		// make sure we don't process ourselves
	    		if(index != this.__currentContextIndex) {

	    			var bb = context.boundingBox;

	    			if(ba && bb) {

			    		// process by eventId and find next item
				    	switch(eventId) {

				    		case this.RIGHT:
				    			calc(ba.right, bb.left, index);
				    			break;

				    		case this.LEFT:
				    			calc(ba.left, bb.right, index, true);
				    			break;

				    		case this.UP:
				    			calc(ba.top, bb.bottom, index, true);
				    			break;

				    		case this.DOWN:
				    			calc(ba.bottom, bb.top, index);
				    			break;

				    	}
				    }
			    }

		    }.bind(this));


		    // finalize
		    if(nextIndex !== false) {
		    	this.__setCurrentContext(nextIndex);

		    	return true;
		    }

		    return false;
	    },


	    /**
	     * (protected) __setCurrentContext
	     *
	     * sets the current index
	     */

	    __setCurrentContext: function(index) {

	    	// get generic
	    	var hasEventHandler = this.is.fn(this.onContextEvent);

	    	// execute application event
	    	if(this.__currentContextIndex !== false) {

	    		var last = this.__contexts[this.__currentContextIndex],
	    			target =  this.canvas.find(this.sprintr("[contextIndex={0}]", this.__currentContextIndex));

	    		if(last && target.length) {

	    			var result = false;

		    		// send callback
		    		if(this.is.fn(last.callback)) {
		    			// lost focus
		    			result = last.callback.call(this, this.LOST, last, target);
		    		}

		    		// notify
		    		if(!result && hasEventHandler) {
		    			this.onContextEvent(this.LOST, last, target);
		    		}

		    		// log
		    		this.log.info("Context lost focus", {contextIndex: last.index});
		    	}
		    }

		    // process new context
				this.canvas.find("[context]").attr("context", "lost");

		   	// get new target
		   	var target = this.canvas.find(this.sprintr("[contextIndex={0}]", index)),
		   	    current = this.__contexts[index];

		   	// notify callback
		   	if(current && target.length) {

		   	  	// set target focus
		   		target.attr("context", "focused");

		   		var result  = false;

	    		// send callback
	    		if(this.is.fn(current.callback)) {
	    			// lost focus
	    			result = current.callback.call(this, this.FOCUSED, current, target);

	    		}

	    		// notify
	    		if(!result && hasEventHandler) {
	    			this.onContextEvent(this.FOCUSED, current, target);
	    		}

	    		// log
		    	this.log.info("Context gained focus", {contextIndex: current.index});
	    	}

	    	// set current context
	    	this.__currentContextIndex = index;
	    },


	    /**
	     * (scrollElement)
	     */

	    scrollElement: function(element, distance, animated, callback) {

	        var distance = element.scrollTop() + distance;

	        element.scrollTop(distance);

	        callback(element.scrollTop());

	    },

	    /**
	     * Enables WiFi and tries to obtain an internet connection
	     * 
	     * @param function callback - A callback that is executed once the internet connection is established
	     * @return void
	     */

	    requireInternet: function() {
	    	/* from netmgmtApp.ks
	    	SelectNetworkManagement
	    	
	    	var params = { payload : { offOn : offOn } };
                framework.sendEventToMmui(this.uiaId, 'SetWifiConnection', params);
             */
	    }

	};

	return CustomApplication;

})();
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
 * (Predeterminate data)
 */

var VehicleDataBrand = {
	7: 'Mazda'
};

var VehicleDataVehicleType = {
	3: 'CX-3',
	18: 'MX-5',
	109: '3 Sport',
	110: '3 Touring',
	111: '3 Grand Touring',
	112: '6 Sport',
	113: '6 Touring',  // Maybe right, everythign else is Bogus right now
	114: '6 Grand Touring',
};

var VehicleDataRegion = {
	na: 'North America',
	eu: 'Europe',
	jp: 'Japan',
};


/**
 * (VehicleData) a collection of useful mappings
 */

var VehicleData = {

	/*
	 * General
	 */

	general: {
		brand: {id:'VDTSBrand', friendlyName: 'Vehicle Brand', input: 'list', values: VehicleDataBrand},
		type: {id:'VDTSVehicle_Type', friendlyName: 'Vehicle Type', input: 'list', values: VehicleDataVehicleType},
		region: {id: 'SYSRegion', friendlyName: 'Region', input: 'list', values: VehicleDataRegion},
	},

	/**
	 * Vehicle
	 */

	vehicle: {
		speed: {id: 'VDTVehicleSpeed', friendlyName: 'Vehicle Speed', input: 'range', min: 0, max: 240, factor: 0.01},
		rpm: {id: 'VDTEngineSpeed', friendlyName: 'Engine RPM', input: 'range', min: 0, max: 8000, factor: 2.25},
		odometer: {id: 'VDTCOdocount', friendlyName: 'Odocount'},
		batterylevel: {id: 'VDTCBattery_StateOfCharge', friendlyName: 'Battery Level'},

	//Peter-dk added
	//	latAcc: {id: 'VDTCLateralAcceleration', friendlyName: 'Lateral acceleration', input: 'range', min: 3000, max: 5000, factor: 1},
	//	lonAcc: {id: 'VDTCLongitudinalAccelerometer', friendlyName: 'Longitudinal acceleration', input: 'range', min: 3000, max: 5000, factor: 1},
		startTime: {id: 'PIDGlobalRealTime_Start', friendlyName: 'Start time'},
		curTime: {id: 'PIDCrntReadTm', friendlyName: 'Current time'},
		drv1dstnc: {id: 'VDTPID_Drv1Dstnc_curr', friendlyName: 'Drive Distance'},
	},

	/**
	 * Fuel
	 */

	fuel: {
		position: {id: 'VDTFuelGaugePosition', friendlyName: 'Fuel Gauge Position'},
		averageconsumption: {id: 'VDTDrv1AvlFuelE', friendlyName: 'Average Fuel Consumption'},
	},

	/**
	 * Engine
	 */

	engine: {
		brakefluidpressure: {id: 'PIDBrakeFluidLineHydraulicPressure', friendlyName: 'Brake Fluid Pressure'},
	},

	/**
	 * Temperature
	 */

	temperature: {
		outside: {id: 'VDTCOut-CarTemperature', friendlyName: 'Outside Temperature'},
		intake: {id: 'VDTDR_IntakeAirTemp', friendlyName: 'Intake Air Temperature'},
		coolant: {id: 'PIDEngineCoolantTemperature', friendlyName: 'Engine Coolant Temperature'},
	},


	/**
	 * GPS
	 */

	gps: {
		latitude: {id: 'GPSLatitude', friendlyName: 'Latitude'},
		longitude: {id: 'GPSLongitude', friendlyName: 'Longitude'},
		altitude: {id: 'GPSAltitude', friendlyName: 'Altitude'},
		heading: {id: 'GPSHeading', friendlyName: 'Heading', input: 'range', min: 0, max: 360, step: 5},  // step:45
		velocity: {id: 'GPSVelocity', friendlyName: 'Velocity'},
		timestamp: {id: 'GPSTimestamp', friendlyName: 'Timestamp'},

	},

};


/**
 * (PreProcessors) Data processers
 */

var CustomApplicationDataProcessors = {

	vdtvehiclespeed: function(value) {

		return Math.round(value * 0.01);
	},

	vdtenginespeed: function(value) {

		return Math.round(value * 2.25);
	},

/*Peter-dk added
	LateralAcceleration: function(value) { 
		return Math.round(value * 0.1);
	},

	LongitudinalAccelerometer: function(value) { 
		return Math.round(value * 0.1);
	},
*/
};


/**
 * (CustomApplicationDataHandler)
 *
 * This is the data controller that reads the current vehicle data
 */

var CustomApplicationDataHandler = {

	__name: 'DataHandler',

	/**
	 * (Locals)
	 */

	refreshRate: 1000,
	paused: false,

	/**
	 * (Paths)
	 */

	paths: {
		data: 'apps/custom/data/casdk-',
	},

	/**
	 * (Tables)
	 */

	tables: [

		/**
		 * (internal) non-file tables
		 *
		 * These are internal tables that can be used by the subscription handlers
		 */

		{table: 'sys', prefix: 'SYS', enabled: true, data: {

			region: {type: 'string', value: 'eu'},   // Peter-dk: previously 'na'

		}, update: false},


		/**
		 * (file) file based tables
		 *
		 * Most tables only need to be loaded once when the car is started.
		 */

		/**
		 * Frequent updated tables (1s refresh rate)
		 */

		// VDT - This table contains the most time sensitive values likes speed, rpm, etc
		{table: 'vdt', prefix: 'VDT', enabled: true, file: true, always: true},

		// GPS
		{table: 'gps', prefix: 'GPS', enabled: true, file: true, filter: 'gps', update: 1},


		/**
		 * Less frequent updated tables (60s refresh rate)
		 */

		// Vehicle Data Transfer data
		{table: 'vdtpid', prefix: 'PID', enabled: true, file: true, update: 60},

		// Vehicle Data Transfer data
		{table: 'vdtcurrent', prefix: 'VDTC', enabled: true, file: true, update: 60},  // Peter-dk, "always: true" does not work


		/**
		 * More less frequent updated tables (5min refresh rate)
		 */

		// VDM - ECO and Energy Management data (disabled)
		{table: 'vdm', prefix: 'VDM', enabled: false, file: true, update: 300},

		// VDM History - ECO and Energy Management data (disabled)
		{table: 'vdmhistory', prefix: 'VDMH', enabled: false, file: true, update: 300},


		/**
		 * One time loaded tables
		 */

		// Vehicle Setting
		{table: 'vdtsettings', prefix: 'VDTS', enabled: true, file: true, update: false},

		// Ignition Diagnostic Monitor (disabled)
		{table: 'idm', prefix: 'IDM', enabled: true, file: true, update: false},

		// Ignition Diagnostic Monitor History (disabled)
		{table: 'idmhistory', prefix: 'IDMH', enabled: true, file: true, update: false},

		// Vehicle Data Transfer data (disabled)
		{table: 'vdthistory', prefix: 'VDTH', enabled: false, file: true, update: false},

	],

	/**
	 * (Pools)
	 */

	data: {},

	/**
	 * (initialize) Initializes some of the core objects
	 */

	initialize: function() {

		this.initialized = true;

		this.next();
	},


	/**
	 * (get) returns a data key
	 */

	get: function(id, _default) {

		if(CustomApplicationHelpers.is().object(id)) {
			id = id.id
		}

		var id = id.toLowerCase();

		return this.data[id] ? this.data[id] : {value: (_default ? _default : null)};
	},

	/**
	 * (getTableByPrefix) returns a table by the prefix
	 */

	getTableByPrefix: function(prefix) {

		var result = false;

		this.tables.map(function(table) {

			if(!result && table.prefix == prefix) {
				result = table;
			}

		});

		return result;
	},


	/**
	 * (registerValue) adds a new value
	 */

	registerValue: function(table, params) {

		// check preq
		if(!params.name) return;

		// create id
		var id = ((table.prefix ? table.prefix : "") + params.name).toLowerCase();

		// check id
		if(!this.data[id]) {

			this.data[id] = $.extend({}, params, {
				id: id,
				prefix: table.prefix,
				value: null,
				previous: null,
				changed: false,
			});
		}

		return id;
	},

	/**
	 * (setValue) sets the value of the key
	 */

	setValue: function(id, value) {

		//CustomApplicationLog.debug(this.__name, "Setting new value", {id: id, available: this.data[id] ? true : false, value: value});

		if(this.data[id]) {

			// automatic converter
			if($.isNumeric(value)) {

				if(parseInt(value) == value) {
					value = parseInt(value);
				} else {
					value = parseFloat(value);
				}

			} else {
				value = $.trim(value);
			}

			// check pre processor
			if(CustomApplicationDataProcessors[id]) {
				value = CustomApplicationDataProcessors[id](value);
			}

			// assign`
			this.data[id].changed = this.data[id].value != value;
			this.data[id].previous = this.data[id].value;
			this.data[id].value = value;

			// notify
			CustomApplicationsHandler.notifyDataChange(id, this.data[id]);
		}

	},

	/**
	 * (pause)
	 */

	pause: function() {

		this.paused = true;
	},

	unpause: function() {

		this.paused = false;

		this.next();
	},

	/**
	 * (next)
	 */

	next: function() {

		clearTimeout(this.currentTimer);

		this.currentTimer = setTimeout(function() {

			if(!this.paused) {

				if(CustomApplicationsHandler.currentApplicationId) {

					this.retrieve();

				} else {

					this.next();
				}
			}

		}.bind(this), this.refreshRate)
	},



	/**
	 * (retrieve) updates the data by reparsing the values
	 */

	retrieve: function(callback) {

		//CustomApplicationLog.debug(this.__name, "Retrieving data tables");

		// prepare
		var loaded = 0, toload = 0, finish = function() {

			if(loaded >= toload) {

				// notify the callback
				if(CustomApplicationHelpers.is().fn(callback)) {
					callback(this.data);
				}

				// continue
				this.next();
			}

		}.bind(this);

		// build to load list
		this.tables.map(function(table, tableIndex) {

			// conditional loading
			var enabled = table.enabled && ( (table.always) || (table.update) || (!table.update && !table.__last) );

			// check time
			if(enabled) {

				if(table.update && table.__last && table.update > 1) {

					enabled = (((new Date()) - table.__last) / 1000) > table.update;

				}

			}

			// load
			if(enabled) {

				// update counter
				toload++;

				// loading
				//CustomApplicationLog.debug(this.__name, "Preparing table for parsing", {table: table.table});

				// process table by type
				switch(true) {

					/**
					 * From preparsed
					 */

					case CustomApplicationHelpers.is().object(table.data):

						$.each(table.data, function(name, params) {

							params.name = name;

							var id = this.registerValue(table, params);

							if(params.value) this.setValue(id, params.value);

						}.bind(this));

						// update counter
						loaded++;

						// completed
						this.tables[tableIndex].__last = new Date();

						// continue
						finish();

						break;

					/**
					 * From file
					 */
					case table.file:

						// prepare variables
						var location = this.paths.data + table.table;

						//CustomApplicationLog.debug(this.__name, "Loading table data from file", {table: table.table, location: location});

						// load
						$.ajax(location, {
							timeout: table.always ? null : 250,

							// success handler
							success: function(data) {

								//CustomApplicationLog.debug(this.__name, "Table data loaded", {table: table.table, loaded: loaded, toload: toload});

								// execute parser
								this.__parseFileData(table, data);

								// completed
								this.tables[tableIndex].__last = new Date();

							}.bind(this),

							// all done handler - timeouts will be handled here as well
							complete: function() {

								// just continue
								loaded++;
								finish();

							}.bind(this),

						});


						break;

					default:

						CustomApplicationLog.error(this.__name, "Unsupported table type" , {table: table.table});

						// just finish
						loaded++;

						// continue
						finish();
						break;
				}
			}
		}.bind(this));
	},


	/**
	 * (__parseFileData) parses data loaded from file
	 */

	__parseFileData: function(table, data) {

		// split data
		data = data.split("\n");

		// filter
		if(table.filter) data = this.__filterFileData(data, table.filter);

		// quick process
		data.forEach(function(line, index) {

			var parts = line.split(/[\((,)\).*(:)]/);

			if(parts.length >= 5 && parts[1]) {

				switch(parts[1].toLowerCase()) {

					case "binary":
						break;

					case "double":

						parts[4] = parts[4] + (parts[5] ? "." + parts[5] : "");

					default:

						// register value
						var id = this.registerValue(table, {
							name: $.trim(parts[0]),
							type: $.trim(parts[1]),
						});

						// update value
						this.setValue(id, $.trim(parts[4]));

						break;
				}

			}

		}.bind(this));
	},

	/**
	 * (__filterFileData) filters data
	 */

	__filterFileData: function(data, filter) {

		switch(filter) {

			case "gps":

				var result = [], parser = {
					Timestamp: 2,
					Latitude: 3,
					Longitude: 4,
					Altitude: 5,
					Heading: 6,
					Velocity: 7,
				}

				// assign
				$.each(parser, function(name, index) {

					if(data[index]) {
						// parse data
						var line = $.trim(data[index]).split(" ");
						if(line[1]) {
							var type = line[0] != "double" ? "int" : "double";
							result.push(name + " (" + type + ", 4): " + $.trim(line[1]));
						}
					}

				});

				return result;
				break;
		}

	},
};

/**
 * DataTransformation
 */

var DataTransform = {

	/**
	 * (toMPH) returns the MPH of the KM/h value
	 */

	toMPH: function(value) {

		return Math.round(value * 0.621371);

	},

        /**
         * (toFeet) returns the Feet of the meter value
         */

        toFeet: function(value) {

                return Math.round(value * 3.28084);

        },

	/**
	 * (toMPG) returns the MPG of the L/100km value
	 */

	toMPG: function(value) {

		return Math.round(value * 2.3521458);

	},

        /**
         * (toLP100K) returns the L/100km value of the tenths of a kilometer per liter
         */

        toLP100K: function(value) {

                return Math.round(10000/value);

        },

        /**
         * (toDegC) returns the Degree C of the Degree F value
         */

        toDegC: function(value) {

                return Math.round((value-32) * 5 / 9);

        },

	/**
	 * (toDegF) returns the deg F of the deg C value
	 */

	toDegF: function(value) {

		return Math.round(value * 1.8 + 32);

	},

	/**
	 * (scaleValue) takes two different scale ranges and recalculates the value
	 */


	scaleValue: function( value, r1, r2 ) {
    	return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
	},

};


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
 * (CustomApplicationHelpers)
 *
 * A abstract collection of helpers for the framework
 */

var CustomApplicationHelpers = {

	/**
	 * (is) a implemention of the flyandi:is library
	 */

	is: function() {

		return {

			undefined: 'undefined',

			__toString: function() {
				return Object.prototype.toString.call(arguments[0]);
			},

			/** (iterable) */
			iterable: function() {
				return this.object(arguments[0]) || this.array(arguments[0]);
			},

			/** (fn) */
			fn: function() {
				return typeof(arguments[0]) == "function";
			},

			/** (object) */
			object: function() {
				return typeof(arguments[0]) == "object";
			},

			/** (array) */
			array: function() {
				return this.__toString(arguments[0]) === '[object Array]';
			},

			/** (date) */
			date: function() {
				return this.__toString(arguments[0])  === '[object Date]';
			},

			/** (string) */
			string: function() {
				return typeof(arguments[0]) == "string";
			},

			/** (number) */
			number: function() {
				return typeof(arguments[0]) == "number";
			},

			/** (boolean) */
			boolean: function() {
				return typeof(arguments[0]) == "boolean";
			},

			/** (defined) */
			defined: function() {
				return typeof(arguments[0]) != this.undefined;
			},

			/** (element) */
			element: function() {
				return typeof(HTMLElement) !== this.undefined ? (arguments[0] instanceof HTMLElement) : (arguments[0] && arguments[0].nodeType === 1);
			},

			/** (empty) */
			empty: function(o) {
				switch(true) {
					case this.array(o) || this.string(o):
						return o.length === 0;

					case this.object(o):
						var s = 0;
						for(var key in o)
							if(o.hasOwnProperty(key)) s++;
						return s === 0;

					case this.boolean(o):
						return o === false;

					default:
						return !o;
				}
			},

			/** (same) */
			same: function(a, b) {
				return a == b;
			},
		};
	},

	/**
	 * (iterate) a iterate that supports arrays and objects
	 */

	iterate: function(o, item) {

		if(this.is().object(o)) {
			return Object.keys(o).map(function(key) {
				return item(key, o[key], true);
			});
		} else if (this.is().array(o)) {
			return o.map(function(value, key) {
				return item(key, value);
			});
		}
	},

	/**
	 * (sprintr) (https://gist.github.com/flyandi/395816232c70de327801)
	 */

	sprintr: function() {
		var
			args = Array.prototype.slice.call(arguments),
			subject = arguments[0];

		args.shift();

		for(var i = 0; i < args.length; i++)
			subject = subject.split("{" + i + "}").join(args[i]);

		return subject;
	},

};
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
 * (CustomApplicationLog)
 *
 * A logger
 */

var CustomApplicationLog = {

	levels: {
		debug: 'DEBUG',
		info: 'INFO',
		error: 'ERROR',
	},

	enabledLogger: false,
	enabledConsole: false,

	/**
	 * (enable) enables the log
	 */

	enableLogger: function(value) {

		this.enabledLogger = value;
	},

	/**
	 * (enable) enables the log
	 */

	enableConsole: function(value) {

		this.enabledConsole = value;
	},

	/**
	 * (debug) debug message
	 */

	debug: function() {
		this.__message(this.levels.debug, "#006600", Array.apply(null, arguments));
	},

	/**
	 * (error) error message
	 */

	error: function() {
		this.__message(this.levels.error, "#FF0000", Array.apply(null, arguments));
	},

	/**
	 * (info) info message
	 */

	info: function() {
		this.__message(this.levels.info, "#0000FF", Array.apply(null, arguments));
	},

	/**
	 * (message)
	 */

	__message: function(level, color, values) {

		if(this.enabledLogger || this.enabledConsole || typeof(DevLogger) != "undefined") {

			var msg = [];
			if(values.length > 1) {
				values.forEach(function(value, index) {

					if(index > 0) {

						switch(true) {

							case CustomApplicationHelpers.is().iterable(value):

								CustomApplicationHelpers.iterate(value, function(key, value, obj) {

									msg.push(obj ? CustomApplicationHelpers.sprintr("[{0}={1}]", key, value) : CustomApplicationHelpers.sprintr("[{0}]", value));

								});
								break;

							default:
								msg.push(value);
								break;
						}
					}

				});
			}

			try {
				if(this.enabledLogger && typeof(Logger) != "undefined") {
					Logger.log(level, values[0], msg.join(" "), color);
				}

				if(typeof(DevLogger) != "undefined") {
					DevLogger.log(level, values[0], msg.join(" "), color);
				}
			} catch(e) {
				// do nothing
			}

			try {
				if(this,enabledConsole) {
					console.log(
						CustomApplicationHelpers.sprintr("%c[{0}] [{1}] ", (new Date()).toDateString(), values[0]) +
						CustomApplicationHelpers.sprintr("%c{0}", msg.join(" ")),
						"color:black",
						CustomApplicationHelpers.sprintr("color:{0}", color)
					);
				}
			} catch(e) {
				// do nothing
			}
		}
	}
};
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
 * (CustomApplicationResourceLoader)
 *
 * The resource loader for applications
 */

var CustomApplicationResourceLoader = {

	__name: 'ResourceLoader',

	/**
	 * (loadJavascript)
	 */

	loadJavascript: function(scripts, path, callback, options, async) {

		this.__loadInvoker(scripts, path, function(filename, next) {
			var script = document.createElement('script');
	        script.type = 'text/javascript';
	        script.src = filename;
	        script.onload = next;
	        document.body.appendChild(script);
		}, callback, options, async);
	},

	/**
	 * (loadCSS)
	 */

	loadCSS: function(css, path, callback, options, async) {

		this.__loadInvoker(css, path, function(filename, next) {
			var css = document.createElement('link');
	        css.rel = "stylesheet";
	        css.type = "text/css";
	        css.href = filename
	        css.onload = async ? callback : next;
	        document.body.appendChild(css);
		}, callback, options, async);
	},

	/**
	 * (loadImages)
	 */

	loadImages: function(images, path, callback, options, async) {

		this.__loadInvoker(images, path, function(filename, next, id) {
			var img = document.createElement('img');
			img.onload = function() {

				if(async) {
					var result = false;
					if(id) {
						result = {};
						result[id] = this;
					}
					callback(id ? result : this);
				} else {
					next(this);
				}
			}
			img.src = filename;
		}, callback, options, async);
	},

	/**
	 * (fromFormatted)
	 */

	fromFormatted: function(format, items) {

		items.forEach(function(value, index) {
			items[index] = CustomApplicationHelpers.sprintr(format, value);
		});

		return items;

	},


	/**
	 * (__loadInvoker)
	 */

	__loadInvoker: function(items, path, build, callback, options, async) {

		var ids = false, result = false, options = options ? options : {}, timeout = false;

		// assign default object
		this.logger = CustomApplicationLog;

		// support for arrays and objects
		if(CustomApplicationHelpers.is().object(items)) {

			var idsObject = items, ids = [], items = [];

			Object.keys(idsObject).map(function(key) {
				ids.push(key);
				items.push(idsObject[key]);
			});

			// return as object
			result = {};

		} else {

			if(!CustomApplicationHelpers.is().array(items)) items = [items];
		}

		// loaded handler
		var loaded = 0, next = function(failure) {
			loaded++;
			if(loaded >= items.length) {
				if(CustomApplicationHelpers.is().fn(callback)) {
					callback(result);
				}
			}
		};

		// process items
		items.forEach(function(filename, index) {

			try {

				filename = path + filename;

				this.logger.debug(this.__name, "Attempting to load resource from", filename);

				if(!async && options.timeout) {

					clearTimeout(timeout);
					timeout = setTimeout(function() {

						this.logger.error(this.__name, "Timeout occured while loading resource", filename);

						// just do the next one
						next(true);

					}.bind(this), options.timeout);

				}

				build(filename, function(resource) {

					this.logger.info(this.__name, "Successfully loaded resource", filename);

					if(resource && ids != false) {
						this.logger.debug(this.__name, "Loaded resource assigned to id", {id: ids[index], filename: filename});

						result[ids[index]] = resource;
					}

		        	if(async) {
		        		if(CustomApplicationHelpers.is().fn(callback)) callback();
		        	} else {
		        		next();
		        	}

		        }.bind(this), ids ? ids[index] : false);

			} catch(e) {
				this.logger.error(this.__name, "Failed to load resource", {filename: filename, error: e.message});
			}

	   	}.bind(this));
	}

}

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
 * (CustomApplicationsHandler)
 *
 * This is the custom handler that manages the application between the JCI system and the mini framework
 */

var CustomApplicationsHandler = {

	__name: 'ApplicationsHandler',

	/**
	 * (Applications) storage for applications
	 */

	applications: {},

	/**
	 * (Paths)
	 */

	paths: {
		framework: 'apps/custom/runtime/',
		applications: 'apps/custom/apps/',
		vendor: 'apps/custom/runtime/vendor/',
		surface: 'apps/custom/runtime/surface/',
	},

	/**
	 * (Mapping)
	 */

	mapping: {


	},

	/**
	 * (initialize) Initializes some of the core objects
	 */

	initialize: function() {

		this.initialized = true;

		this.loader = CustomApplicationResourceLoader;

		this.log = CustomApplicationLog;

	},


	/**
	 * (Retrieve) loads the current application list and returns the additional items
	 */

	retrieve: function(callback) {

		try {
			// initialize
			if(!this.initialized) this.initialize();

			// load libraries
			this.loader.loadJavascript("jquery.js", this.paths.vendor, function() {

				this.loader.loadCSS("runtime.css", this.paths.framework, function() {

					this.loader.loadJavascript("apps.js", this.paths.applications, function() {

						// this has been completed
						if(typeof(CustomApplications) != "undefined") {

							// load applications
							this.loader.loadJavascript(
								this.loader.fromFormatted("{0}/app.js", CustomApplications),
								this.paths.applications,
								function() {
									// all applications are loaded, run data
									CustomApplicationDataHandler.initialize();

									// create menu items
									callback(this.getMenuItems());
								}.bind(this)
							);
						}

					}.bind(this)); // apps.js

				}.bind(this)); // bootstrap css

			}.bind(this)); // jquery library

		} catch(e) {

			// error message
			this.log.error(this.__name, "Error while retrieving applications", e);

			// make sure that we notify otherwise we don't get any applications
			callback(this.getMenuItems());
		}
	},

	/**
	 * (get) returns an application by id
	 */

	get: function(id) {

		return this.applications[id] ? this.applications[id] : false;
	},


	/**
	 * (Register) registers all the custom applications
	 */

	register: function(id, application) {

		// unregister previous instance
		if(this.applications[id]) {
			this.applications[id].__terminate();
			this.applications[id] = false;
		}

		// registering
		this.log.info(this.__name, {id:id}, "Registering application");

		application.id = id;

		application.location = this.paths.applications + id + "/";

		application.__initialize();

		this.applications[id] = application;

		return true;
	},

	/**
	 * (launch) launches an application
	 */

	launch: function(id) {

		this.log.info(this.__name, {id: id}, "Launch request for application");

		if(CustomApplicationHelpers.is().object(id)) {

			id = id.appId ? id.appId : false;
		}

		if(this.applications[id]) {

			this.currentApplicationId = id;

			this.log.info(this.__name, {id: id}, "Launching application");

			return true;
		}

		this.log.error(this.__name, {id: id}, "Launch failed because application was not registered");

		return false;
	},

	/**
	 * (sleep) sleeps an application
	 */

	sleep: function(application) {

		if(application.id == this.currentApplicationId) {
			// remember last state
			this.lastApplicationId = this.currentApplicationId;

			// clear current
			this.currentApplicationId = false;
		}

		application.__sleep();
	},


	/**
	 * (getCurrentApplication) returns the current application
	 */

	getCurrentApplication: function(allowLast) {

		var applicationId = this.currentApplicationId || (allowLast ? this.lastApplicationId : false);

		if(applicationId) {

			this.log.debug(this.__name, "Invoking current set application", {id: applicationId});

			if(this.applications[applicationId]) {

				this.currentApplicationId = applicationId;

				return this.applications[applicationId];
			}

			this.log.error(this.__name, "Application was not registered", {id: applicationId});

			return false;
		}

		this.log.error(this.__name, "Missing currentApplicationId");

		return false;
	},

	/**
	 * (notifyDataChange) notifies the active application about a data change
	 */

	notifyDataChange: function(id, payload) {

		if(this.currentApplicationId && this.applications[this.currentApplicationId]) {

			this.applications[this.currentApplicationId].__notify(id, payload);

		}

	},


	/**
	 * (getMenuItems) returns the items for the main application menu
	 */

	getMenuItems: function(callback) {

		return CustomApplicationHelpers.iterate(this.applications, function(id, application) {

			this.log.info(this.__name, {id:id}, "Adding application to menu", {
				title: application.getTitle(),
			});

			// set localized language - for now it's just the title
			return {
				appData : {
					appName : application.getId(),
					appId: application.getId(),
					isVisible : true,
					mmuiEvent : 'SelectCustomApplication',
				},
				title: application.getTitle(),
				text1Id : application.getId().replace(".", "_"),
				disabled : false,
				itemStyle : 'style02',
				hasCaret : application.getHasMenuCaret(),
			};

		}.bind(this));
	},

};
