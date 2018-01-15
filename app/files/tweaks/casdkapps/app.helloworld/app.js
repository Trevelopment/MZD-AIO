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

		title: 'Hello World',

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

		/**
		 * HelloWorld Showcase
		 */

		/* The use of 'element'.
		 *
		 * By default the app framework includes the jQuery library.
		 *
		 * The application exposes the 'element' helper which basically creates a simple
		 * jQuery object for you and attaches it to the canvas.
		 *
		 * var newElement = this.element(<tag>, <attr:id>, <classNames>, <styles>, <content>, <preventAutoAppend>)
		 *
		 * See the examples below:
		 */

		// Yeah I gotta do this!
		this.element("div", false, false, false, "Hello World!");

		// This will add a class to the element
		this.element("div", false, "smallerText", false, "This is a showcase of the Custom Application SDK for the Mazda Infotainment System");

		// This item will never appear on the screen because we prevent auto append to the canvas
		this.element("div", false, false, false, "This will never appear", true);

		// Let's try an image with an absolute position on the top/right corner
		this.element("div", false, false, {
			position: 'absolute',
			top: 10,
			right: 10,
		}, this.images.world);

		// Now you can do the same thing with just pure jQuery

		this.canvas.append($("<div/>").append("Generated through pure jQuery"));

		// .. or for the hard core people, pure DOM

		var div = document.createElement("div");
		div.innerHTML = "OMG - This is 1995 all over again";

		this.canvas.get(0).appendChild(div); // yeah canvas is a jQuery object


		/* A word about this.canvas
		 *
		 * this.canvas is the main application screen and the DOM root for the application.
		 *
		 * this.canvas is a jQuery object! Just FYI.
		 *
		 * Any content you want to display needs to be attached to the canvas or any children
		 * below it. Please don't attach it to the 'body' or you will loose all the automatic
		 * context handling of the JCI system which will end up in a bad user experience.
		 */


		/*
		 * Let's move to some more advanced stuff.
		 */

		// Let's create a simple label with an value

		this.label = this.element("span", false, false, false, "No event", true);

		this.element("div", false, "simpleLabel", false, ['Controller Event:', this.label]);

		// Look at the controller event below to see how we use .label


		/**
		 * Now let's do someting really cool.
		 *
		 * It wouldn't be a framework if it wouldn't allow you easy access to the internal
		 * data bus of the car. Yeah, let's get some info directly from the car :-)
		 */

		// Lets create a label
		this.speedLabel = this.element("span", false, false, false, "0", true);

		// lets add it to the canvas
		this.element("div", false, "simpleLabel", false, ['Current Speed', this.speedLabel]);

		// lets get the speed assigned to it
		/*
		this.subscribe(VehicleData.vehicleSpeed, function(speed) {

			// another cool thing is that we can convert our speed from km/h to mp/h very easy

			this.speedLabel = VehicleData.transform(speed, VehicleData.KMHMPH) + " mph/h";
		}.bind(this));*/

	},

	/**
	 * (focused)
	 *
	 * Executes when the application gets the focus. You can either use this event to
	 * build the application or use the created() method to predefine the canvas and use
	 * this method to run your logic.
	 */

	focused: function() {


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

		// Look above where we create this.label
		// Here is where we assign the value!

		this.label.html(eventId);

	},


})); /** EOF **/
