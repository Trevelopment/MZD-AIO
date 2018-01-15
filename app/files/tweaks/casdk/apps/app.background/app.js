/**
 * [{APP_NAME}]
 *
 * @version: 0.0.1
 * @author: [author]
 * @description [description]
 *
 * [license]
 */


/**
 * Custom Application
 */

CustomApplicationsHandler.register("app.background", new CustomApplication({

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

		js: ["background/list.js"],

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

		title: 'Background',

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
		 * (hasRightArc) indicates if the standard right arc should be displayed
		 */

		hasRightArc: false,

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

		this.select = 0;
		this.max = 0;
		this.position = 0;
		this.oldselect = 0;

		this.image_slider = this.element("dv", false, "panel" , {
			position:'absolute',
			left:'0px',
			top:'0px'
		}, "" );

		this.table = [];

		for (var i = 0; i < backgroundlist.length ; i++) {
			var elem = $("<image src='" + this.location + iconlist[i] + "' width='225' height='135' />");
			this.image_slider.append(elem);
			this.table.push({elem:elem,link:this.location + backgroundlist[i]});
		}
		this.max = backgroundlist.length;
		this.updatepos();

		if ( localStorage.background !== undefined ) {
			var bg = $('#CommonBgImg1').css('background-image').replace('url("','').replace('")','');
			if (bg.slice(-framework.common._defaultBgPath.length) === framework.common._defaultBgPath ) {
	    		$('#CommonBgImg1').css('background-image',"url('" + localStorage.background  + "')");
	    	}
			framework.common._defaultBgPath = localStorage.background;
		}
	},

	updatepos: function() {


		this.table[this.oldselect].elem.removeClass('selectimage');
		this.oldselect = this.select;
		this.table[this.select].elem.addClass('selectimage');

		var min = this.table[this.select].elem.offset().top - this.image_slider.offset().top;
		var max = min + this.table[this.select].elem.height();
		var minvisible = this.position;
		var maxvisible = minvisible + 410;
		
		if (min < minvisible) {
			this.position = min;
			console.log("lower");
		}
		
		if (max > maxvisible ) {
			this.position = max - 410;
			console.log("high");
		}

		this.image_slider.get(0).style.top = -this.position + "px";
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
	 * (event) onControllerEvent
	 *
	 * Called when a new (multi)controller event is available
	 *
	 * @event
	 * @param {string} eventId - The Multicontroller event id
	 * @return {void}
	 */

	onControllerEvent: function(eventId) {

		switch(eventId) {

			/*
			 * MultiController was moved to the left
			 */
			case this.LEFT:
				if  (this.select > 0) this.select--;
				this.updatepos();
				break;

			/*
			 * MultiController was moved to the right
			 */
			case this.RIGHT:
				if  (this.select < (this.max-1)) this.select++;
				this.updatepos();
				break;

			/*
			 * MultiController was moved up
			 */
			case this.UP:
				if  (this.select >= 3) this.select-=3;
				this.updatepos();
				break;

			/*
			 * MultiController was moved down
			 */
			case this.DOWN:
				this.select += 3;
				if  (this.select > (this.max-1)) this.select = (this.max-1)
				this.updatepos();
				break;

			/*
			 * MultiController Wheel was turned clockwise
			 */
			case this.CW:
				if  (this.select < (this.max-1)) this.select++;
				this.updatepos();
				break;

			/*
			 * MultiController Wheel was turned counter-clockwise
			 */
			case this.CCW:
				if  (this.select > 0) this.select--;
				this.updatepos();
				break;

			/*
			 * MultiController's center was pushed down
			 */
			case this.SELECT:
				$('#CommonBgImg1').css('background',"url('" + this.table[this.select].link  + "')");
				framework.common._defaultBgPath = this.table[this.select].link;
				localStorage.setItem("background", this.table[this.select].link);
				framework.sendEventToMmui("common", "Global.GoBack");
				break;

			/*
			 * MultiController hot key "back" was pushed
			 */
			case this.BACK:

				break;
		}

	},


})); 



/** EOF **/

