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

CustomApplicationsHandler.register("app.terminal", new CustomApplication({


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

		title: 'Terminal',

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



  /***
   *** User Interface Life Cycles
   ***/

  keyboard : null,
  screen: null,

  shift : false,
  caps : false,
  ctrl :false,
  alternate : false,

  ws: null,
  fileslist :[],
  path : "",

  command : "",
  buffer : "",
  linecount : 0,
  commandstack : [],
  commandstackcounter : -1,

  //
  // Update the screen
  // 
  update : function ()
  {
    this.screen.get(0).innerHTML = this.buffer + ">" + this.command;
    this.screen.get(0).scrollTop = this.screen.get(0).scrollHeight;
  },

  //
  // Add some text to screen
  //

  AddText : function (text)
  {
      this.linecount = this.linecount + 1;
      this.buffer += text + "\n";

      // At 160 lines, go back to 80 then buffer will alway have between 80 to 160 lines
/*
      if ( this.linecount > 160) {
          var lines = buffer.split('\n');
          lines.splice(0,80);
          this.buffer = lines.join('\n');
      }
*/
      this.update();
  },

  //
  // Folder has maybe changed
  // 
  folderchange : function ()
  {
    /*var c;
    debug.innerHTML = path + "\n"
    for (c=0; c< fileslist.length; c++) {
      debug.innerHTML += fileslist[c] + "\n";
    } */
  },

  help : function ()
  {
    var command = 'echo "Example command : "'
    this.ws.send(command);
    command = 'echo "opkg list"';
    this.ws.send(command);
  },

  asklistnumber : "TERMINAL84723423940147",
  askpwdnumber : "TERMINAL2472323489823",

  askiffolderchanged : function  ()
  {
    var command =  'ls | awk \' BEGIN { ORS = \"\"; print \"'+ this.asklistnumber+'[\"; } { print \"\\\/\\@\"$0\"\\\/\\@\"; } END { print \"]\"; }\' | sed \"s^\\\"^\\\\\\\\\\\"^g;s^\\\/\\@\\\/\\@^\\\", \\\"^g;s^\\\/\\@^\\\"^g\"' 
    this.ws.send(command);
    var command =  'echo ' + this.askpwdnumber + '$(pwd)' 
    this.ws.send(command);
  },

  SetKeyboardButtonValue : function() {
    var c;
    for(c=0;c<this.buttonlist.length;c++) {
      if( ! this.buttonlist[c].hasAttribute('function')) {
        if (this.shift) { 
          if ( this.buttonlist[c].hasAttribute('shiftkey')) {
            this.buttonlist[c].innerHTML = this.buttonlist[c].getAttribute("shiftkey");
          } else {
            this.buttonlist[c].innerHTML = this.buttonlist[c].getAttribute("key").toUpperCase();;
          }
        } else {
          this.buttonlist[c].innerHTML = this.buttonlist[c].getAttribute("key").toLowerCase();
        }
      }
      this.buttonlist[c].color = 'white';
    }

    var capslist =  this.keyboard.get(0).getElementsByClassName('caps');   
    for (c=0; c < capslist.length ; c++) {
      if (this.caps) {
        $(capslist[c]).addClass('stateon');
      } else {
        $(capslist[c]).removeClass('stateon');
      }
    }
    var shiftlist =  this.keyboard.get(0).getElementsByClassName('shift');   
    for (c=0; c < shiftlist.length ; c++) {
      if (this.shift) {
        $(shiftlist[c]).addClass('stateon');
      } else {
        $(shiftlist[c]).removeClass('stateon');
      }
    }
    var alternatelist =  this.keyboard.get(0).getElementsByClassName('alternate');   
    for (c=0; c < alternatelist.length ; c++) {
      alternatelist[c].style.color = this.alternate? '#FF0000':'white';
    }
    var ctrllist =  this.keyboard.get(0).getElementsByClassName('ctrl');   
    for (c=0; c < ctrllist.length ; c++) {
      ctrllist[c].style.color = this.ctrl? '#FF0000':'white';
    }
  },

  HighLevelKeyboard : function (char) {
    switch (char) {
      case  "return":

        switch (this.command) 
        {
          case "clear":
            this.buffer = "";
            this.linecount = 0;
            this.command = "";
            this.update();
            break;

          case "help":
            this.help();
            this.command = "";
            this.update();
            break;

          default:
            this.AddText(">" + this.command);
            this.ws.send(this.command);
            if (this.command.length) this.commandstack.push(this.command);
            this.commandstackcounter = this.commandstack.length;
            this.command = "";
            this.update();
            this.askiffolderchanged ();
            break;

        }
        break;

      case"space":
        this.command += ' ';
        this.update();
        break;

      case "delete":
        if ( this.command.length > 0 ) {
          this.command = this.command.slice(0, -1);
          this.update();
        } 
        break;

      case  "up":
        if (this.commandstack.length != 0) {
          this.commandstackcounter --;
          if ( this.commandstackcounter <  0 ) {
            this.commandstackcounter = 0;
          }
          this.command = this.commandstack[this.commandstackcounter];
          update();          
        }
        break;

      case "down":
        if (this.commandstack.length != 0) {
          this.commandstackcounter ++;
          if ( this.commandstackcounter >=  this.commandstack.length) {
            this.commandstackcounter = this.commandstack.length - 1;
          } 
          this.command = this.commandstack[this.commandstackcounter];
          update();
        }
        break;


      case "left":
      case "right":
        break;

      case "tab":
        this.asklistfunction ();
        
        break;

      default:
        if ( this.ctrl ) {
          if (this.char == 'k' || this.char == 'l' ) {
            this.buffer = "";
            this.linecount = 0;
            this.command = "";
          }

        } else if ( this.alternate ) {

        } else {
          this.command += char;
        }
        this.update();
    } 

  },

  LowLevelKeyboard : function (c) {

    this.buttonlist[c].onmousedown=function() {
   
      if (this.buttonlist[c].hasAttribute('function')) {
        var f = this.buttonlist[c].getAttribute("function");
        switch (f) {

          case "alt":
            this.alternate = !this.alternate;
            this.SetKeyboardButtonValue();
            break;

          case "ctrl":
            this.ctrl = !this.ctrl;
            this.SetKeyboardButtonValue();
            break;

          case "caps":
            this.caps = !this.caps;
            this.shift = this.caps;
            this.SetKeyboardButtonValue();
            break;

          case "shift":
            this.shift = !this.shift;
            this.SetKeyboardButtonValue();
            break;
          case "caps":
            this.shift = !this.shift;
            this.SetKeyboardButtonValue();
            break;
          default:
            
            this.HighLevelKeyboard (f);
            break;
        }
    
      } else {

        this.HighLevelKeyboard (this.buttonlist[c].innerHTML);

        if (!this.caps && this.shift || this.ctrl || this.alternate) {
          this.ctrl = false;
          this.alternate = false;
          this.shift = false;
          this.SetKeyboardButtonValue();

        }
      }
    }.bind(this);
  },



  /** 
   * (created) 
   * 
   * Executed when the application gets initialized
   *
   * Add any content that will be static here
   */

  created: function() {


    this.screen = this.element("pre", false, 'screen' , false,'');
    this.keyboard = this.element("div", false, false , false,'' 
      +'<div>'
      +'<button class="keyboardbutton row1" type="button" key="`"></button>'
      +'<button class="keyboardbutton row1" type="button" key="1" shiftkey="!"></button>'
      +'<button class="keyboardbutton row1" type="button" key="2" shiftkey="@"></button>'
      +'<button class="keyboardbutton row1" type="button" key="3" shiftkey="#"></button>'
      +'<button class="keyboardbutton row1" type="button" key="4" shiftkey="$"></button>'
      +'<button class="keyboardbutton row1" type="button" key="5" shiftkey="%"></button>'
      +'<button class="keyboardbutton row1" type="button" key="6" shiftkey="^"></button>'
      +'<button class="keyboardbutton row1" type="button" key="7" shiftkey="&"></button>'
      +'<button class="keyboardbutton row1" type="button" key="8" shiftkey="*"></button>'
      +'<button class="keyboardbutton row1" type="button" key="9" shiftkey="("></button>'
      +'<button class="keyboardbutton row1" type="button" key="0" shiftkey=")"></button>'
      +'<button class="keyboardbutton row1" type="button" key="-" shiftkey="_"></button>'
      +'<button class="keyboardbutton row1" type="button" key="=" shiftkey="+"></button>'
      +'<button class="keyboardbutton row1 row1add" type="button" function="delete" >del</button>'
      +'</div>'
      +'<div>'
      +'<button class="keyboardbutton row2 row2add" type="button" function = "tab">tab</button>'
      +'<button class="keyboardbutton row2" type="button" key="Q"></button>'
      +'<button class="keyboardbutton row2" type="button" key="W"></button>'
      +'<button class="keyboardbutton row2" type="button" key="E"></button>'
      +'<button class="keyboardbutton row2" type="button" key="R"></button>'
      +'<button class="keyboardbutton row2" type="button" key="T"></button>'
      +'<button class="keyboardbutton row2" type="button" key="Y"></button>'
      +'<button class="keyboardbutton row2" type="button" key="U"></button>'
      +'<button class="keyboardbutton row2" type="button" key="I"></button>'
      +'<button class="keyboardbutton row2" type="button" key="O"></button>'
      +'<button class="keyboardbutton row2" type="button" key="P"></button>'
      +'<button class="keyboardbutton row2" type="button" key="[" shiftkey="{"></button>'
      +'<button class="keyboardbutton row2" type="button" key="]" shiftkey="}"></button>'
      +'<button class="keyboardbutton row2" type="button" key="\\" shiftkey="|"></button>'
      +'</div>'
      +'<div>'
      +'<button class="keyboardbutton row3 row3add " type="button" function="caps" >caps</button>'
      +'<button class="keyboardbutton row3" type="button" key="A"></button>'
      +'<button class="keyboardbutton row3" type="button" key="S"></button>'
      +'<button class="keyboardbutton row3" type="button" key="D"></button>'
      +'<button class="keyboardbutton row3" type="button" key="F"></button>'
      +'<button class="keyboardbutton row3" type="button" key="G"></button>'
      +'<button class="keyboardbutton row3" type="button" key="H"></button>'
      +'<button class="keyboardbutton row3" type="button" key="J"></button>'
      +'<button class="keyboardbutton row3" type="button" key="K"></button>'
      +'<button class="keyboardbutton row3" type="button" key="L"></button>'
      +'<button class="keyboardbutton row3" type="button" key=";" shiftkey=":"></button>'
      +'<button class="keyboardbutton row3" type="button" key="\'" shiftkey=\'"\'></button>'
      +'<button class="keyboardbutton row3 row3add" type="button" function = "return" >ret</button>'
      +'</div>'
      +'<div>'
      +'<button class="keyboardbutton row4 row4add" type="button" function="shift" >shift</button>'
      +'<button class="keyboardbutton row4" type="button" key="Z"></button>'
      +'<button class="keyboardbutton row4" type="button" key="X"></button>'
      +'<button class="keyboardbutton row4" type="button" key="C"></button>'
      +'<button class="keyboardbutton row4" type="button" key="V"></button>'
      +'<button class="keyboardbutton row4" type="button" key="B"></button>'
      +'<button class="keyboardbutton row4" type="button" key="N"></button>'
      +'<button class="keyboardbutton row4" type="button" key="M"></button>'
      +'<button class="keyboardbutton row4" type="button" key="," shiftkey="<"></button>'
      +'<button class="keyboardbutton row4" type="button" key="." shiftkey=">"></button>'
      +'<button class="keyboardbutton row4" type="button" key="/" shiftkey="?"></button>'
      +'<button class="keyboardbutton row4 row4add" type="button" function="shift">shift</button>'
      +'</div>'
      +'<div>'
      +'<button class="keyboardbutton row5" type="button" function="fn" >fn</button>'
      +'<button class="keyboardbutton row5" type="button" function="ctrl">ctrl</button>'
      +'<button class="keyboardbutton row5" type="button" function="alt">alt</button>'
      +'<button class="keyboardbutton row5 row5add" type="button" function="space">space</button>'
      +'<button class="keyboardbutton row5" type="button" function="left">&larr;</button>'
      +'<button class="keyboardbutton row5" type="button" function="up">&uarr;</button>'
      +'<button class="keyboardbutton row5" type="button" function="down">&darr;</button>'
      +'<button class="keyboardbutton row5" type="button" function="right">&rarr;</button>'
      +'</div>' 
    );

    this.buttonlist=this.keyboard.get(0).getElementsByClassName('keyboardbutton');
   // Add listener for mouse
    var c, c2;
   
    for(c=0;c<this.buttonlist.length;c++) {
      this.LowLevelKeyboard(c);
    } 
    this.SetKeyboardButtonValue();

      var originalsize=[];
    /*  
      var maxrow = 0;
      for (c2 = 0; c2 < 5; c2++) {
        var row = this.keyboard.get(0).getElementsByClassName('row' + (c2+1));
        var rowsize = 0;
        for (c=0;c < row.length; c++)
        {
          rowsize += row[c].offsetWidth;
        }
        // Adjust for the margin
        rowsize += (row.length +1) * 4;
        originalsize.push(rowsize);
        if ( rowsize > maxrow) maxrow = rowsize;
      }   for (c2 = 0; c2 < 5; c2++) {
        var rowadd = this.keyboard.get(0).getElementsByClassName('row' +(c2+1) + 'add');
        var rowaddsize = (maxrow - originalsize[c2]) / rowadd.length;
        for (c = 0;c < rowadd.length; c ++) {
          rowadd[c].style.width = rowadd[c].offsetWidth + rowaddsize + "px";
        }
      } 
*/



    this.wsonopen = function() {
        this.AddText("[connect]\nhelp=Help");
        this.askiffolderchanged ();
        this.ws.send("cd /tmp/root\n");
    }.bind(this);
    this.wsonclose = function() {
        this.AddText("[unconnect]");
        window.setTimeout (function() { 

          this.ws = new WebSocket('ws://localhost:9997');
          this.ws.onopen = this.wsonopen;
          this.ws.onclose = this.wsonclose;
          this.ws.onmessage = this.wsonmessage;

        }.bind(this), 5000);
    }.bind(this);
    this.wsonmessage = function(event) {
      if (event.data.substr(0,this.asklistnumber.length) == this.asklistnumber) {
        this.fileslist = JSON.parse(event.data.substr(this.asklistnumber.length));
        //fileslist = event.data.substr(asklistnumber.length).split("\n");
        this.folderchange();
      } else if (event.data.substr(0,this.askpwdnumber.length) == this.askpwdnumber) {
        this.path = event.data.substr(this.askpwdnumber.length);
        this.folderchange();
      } else { 
        this.AddText(event.data);
      } 
    }.bind(this);

    this.ws = new WebSocket('ws://localhost:9997');
    this.ws.onopen = this.wsonopen;
    this.ws.onclose = this.wsonclose;
    this.ws.onmessage = this.wsonmessage;

    this.update();
    
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

    //this.label.html(eventId);

  },


})); /** EOF **/
