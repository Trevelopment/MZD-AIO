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

CustomApplicationsHandler.register("app.android", new CustomApplication({

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

			world: 'images/icon.png'
	
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

		title: 'Android',

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

		statusbarIcon: false,

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

	logdata: function(s)
	{
		var mincar = 80*40*10;
		var elem = this.logspot.get(0);
		elem.innerHTML += s;
		if (elem.innerHTML.length > 2*mincar) {
			elem.innerHTML = elem.innerHTML.substr(elem.innerHTML.length-mincar);
		}

	  	elem.scrollTop = elem.scrollHeight;
	},

	connect: function ()
	{
		
		this.ws = new WebSocket('ws://localhost:9002');

		this.ws.onopen = function () {
			//document.getElementById('log').innerHTML = "";
			this.enablerun();
			//this.start1();
		}.bind(this);

		this.ws.onclose = function (event) {
			if (event.code === 1000) {
		        reason = null;
		    } else if (event.code === 1001) {
		        reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
		    } else if (event.code === 1002) {
		        reason = "An endpoint is terminating the connection due to a protocol error";
		    } else if (event.code === 1003) {
		        reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
		    } else if (event.code === 1004) {
		        reason = "Reserved. The specific meaning might be defined in the future.";
		    } else if (event.code === 1005) {
		        reason = "No status code was actually present.";
		    } else if (event.code === 1006) {
		        reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
		    } else if (event.code === 1007) {
		        reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
		    } else if (event.code === 1008) {
		        reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
		    } else if (event.code === 1009) {
		        reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
		    } else if (event.code === 1010) { // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
		        reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
		    } else if (event.code === 1011) {
		        reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
		    } else if (event.code === 1015) {
		        reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
		    } else {
		        reason = "Unknown reason";
		    }

		    if (reason !== null ) {
		        this.logdata('<font color="red">'+ reason + '</font>\n');
		    }
			
			setTimeout(function(){ this.connect(); }.bind(this), 1000);
		}.bind(this);

		this.ws.onerror = function (error) {
			//this.logdata('<font color="red">WebSocket Error ' + error+ ' </font>\n');
		}.bind(this);

		this.ws.onmessage = function (e) {
		  	var data = JSON.parse(e.data);
			switch (data.type) {
				case "stdout":
					this.logdata('<font color="black">' + data.message +  "</font>");
					break;
				case "stderr":
					this.logdata('<font color="red">' + data.message +  "</font>");
					break;
				case "event":
					if (data.message === "runend") {
						this.enablerun();	
					}
					break;
			}
		}.bind(this);
	},

	enablerun: function ()
	{
		this.b1.prop('disabled', false); 
		this.b2.prop('disabled', false); 
		this.b3.prop('disabled', false); 
		this.bx.prop('disabled', true); 
		this.logdata(">_");
		this.cursortimer = setInterval(function() {
			var elem = this.logspot.get(0);
			c = "_";
			if (elem.innerHTML.substr(elem.innerHTML.length-1) === '_') {
				c = " ";
			}
			elem.innerHTML = elem.innerHTML.slice(0, -1) + c; 

		}.bind(this), 500);
	},

	disablerun: function ()
	{
		this.b1.prop('disabled', true); 
		this.b2.prop('disabled', true); 
		this.b3.prop('disabled', true); 
		this.bx.prop('disabled', false); 


		var elem = this.logspot.get(0);
		elem.innerHTML = elem.innerHTML.slice(0, -1); 
	},

	run: function (json) {
		if (this.ws.readyState !== this.ws.CLOSED) {
			this.disablerun();
			
			this.logdata('<font color="green">run ' + json.args.join(' ') + ' </font>\n');
			
			var str = JSON.stringify(json);
			this.ws.send(str);
		}
	},

	start1: function () {
		this.run({"command":"run", "args":["/bin/ls", "-ls"], "id":1});
	},

	start2: function () {
		this.run({"command":"run", "args":["./test.sh"], "id":1});
	},

	start3: function () {
		this.run({"command":"run", "args":["./test.sh"], "id":1});
	},

	kill: function() {
		if (this.ws.readyState !== this.ws.CLOSED) {
			this.ws.close();
		}
	},


	created: function() {


		this.ws = null;
		this.cursortimer = null;


		
		this.b1 = this.element("button", false, "b1", false, '<image src="'+this.location+'images/aa.png" height="64" width="64"></image>');
		this.b2 = this.element("button", false, "b2", false, '<image src="'+this.location+'images/ai.png"  height="64" width="64"></image>');
		this.b3 = this.element("button", false, "b2", false, '<image src="'+this.location+'images/usb.png"  height="64" width="64"></image>');
		this.bx = this.element("button", false, "b3", false, '<image src="'+this.location+'images/stop.png" height="64" width="64"></image>');

		this.logspot = this.element("pre", false, "log", false, "");




/*
		this.canvas.append($([
			'<div id="container">',
			'<button id="start1" onclick="this.start1();" disabled="true" style="background-color: Transparent"><image src="'+this.location+'images/aa.png" height="128" width="128"></image></button>',
			'<button id="start2" onclick="this.start2();" disabled="true"  style="background-color: Transparent"><image src="'+this.location+'images/ai.png"  height="128" width="128"></image></button>',
			'<button id="kill" onclick="kill();" disabled="true"  style="background-color: Transparent; float: right;" ><image src="'+this.location+'images/stop.png" height="128" width="128"></image></button>',
			'<pre id="log"></pre>',
			'</div>'].join("")));

*/		

		this.b1.get(0).onmousedown=function() {
			this.start1();
		}.bind(this);

		this.b2.get(0).onmousedown=function() {
			this.start2();
		}.bind(this);

		this.b3.get(0).onmousedown=function() {
			this.start3();
		}.bind(this);

		this.bx.get(0).onmousedown=function() {
			this.kill();
		}.bind(this);
		
		this.connect();


		

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
