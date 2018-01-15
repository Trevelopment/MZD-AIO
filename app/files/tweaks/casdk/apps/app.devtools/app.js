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
 * Vehicle Data Diagnostic
 *
 * This is a the frameworks internal application to monitor the data values
 *
 */


CustomApplicationsHandler.register("app.devtools", new CustomApplication({

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

        title: 'Dev Tools',

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

        // create log buffer
        this.localLogBuffer = {
            INFO: [],
            DEBUG: [],
            ERROR: []
        };

        // set local ref
        var that = this;

        // create global logger
        window.DevLogger = {

            defaultId: 'console',

            error: function(message, id) {
                DevLogger.log('ERROR', id ? id : DevLogger.defaultId, message);
            },

            info: function(message, id) {
                DevLogger.log('INFO', id ? id : DevLogger.defaultId, message);
            },

            debug: function(message, id) {
                DevLogger.log('DEBUG', id ? id : DevLogger.defaultId, message);
            },

            log: function(level, id, message, color) {
                that.receiveLog(level, id, message, color);
            }
        };

        /**
         * Global Error
         */
        window.error = function(message, url, line) {
            DevLogger.log("ERROR", DevLogger.defaultId + ":" + url.replace(/^.*[\\\/]/, '') +":" + line, message);
        };

        // create interface
        this.createInterface();
    },

    focused: function() {
        
        console.log(JSON.stringify(framework._sharedDataAttributes));
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

        var itemHeight = this.canvas.find(".panel.active div").outerHeight(true) * 2;

        switch(eventId) {

            /**
             * Scroll Down
             */

            case "cw":

                this.scrollElement(this.canvas.find(".panel.active"), itemHeight);

                break;

            /**
             * Scroll Up
             */

            case "ccw":

                this.scrollElement(this.canvas.find(".panel.active"), -1 * itemHeight);

                break;

        }

    },

    /**
     * (event) onContextEvent
     *
     * Called when the context of an element was changed
     */

    onContextEvent: function(eventId, context, element) {

        // remember the scrolling position
        var active = this.canvas.find(".panel.active");
        if(active.length) {
            this.panelScrollPositions[active.attr("index")] = active.scrollTop();
        }

        // show new panel
        var active = this.showPanel(element.attr("index"));

        // set position
        var scrollTop = active.get(0).scrollHeight;
        if(this.panelScrollPositions[element.attr("index")]) {
            scrollTop = this.panelScrollPositions[element.attr("index")];
        }
        active.scrollTop(scrollTop);
    },



    /***
     *** Applicaton specific methods
     ***/

    /**
     * (createInterface)
     *
     * This method creates the interface
     */

    createInterface: function() {

        this.menu = $("<div/>").addClass("tabs").appendTo(this.canvas);

        // create tabs
        this.panelScrollPositions = [];
        this.panelData = [
            {name: 'Info', target: 'output', level: 'INFO'},
            {name: 'Error', target: 'output', level: 'ERROR'},
            {name: 'Debug', target: 'output', level: 'DEBUG'},
            {name: 'Storages', storage: true},
        ],
        this.panels = [];

        this.panelData.forEach(function(panel, index) {

            // add to menu
            this.menu.append(this.addContext($("<span/>").attr({index: index}).addClass("tab").append(panel.name)));

            // add divider
            this.menu.append($("<span/>").addClass("divider"));

            // add positions
            this.panelScrollPositions.push(0);

            // create panel
            this.panels.push($("<div/>").addClass("panel").addClass(panel.target).attr({
                index: index,
                level: panel.level,
            }).appendTo(this.canvas));


        }.bind(this));

        // calculate size
        var tabWidth = Math.round((800 - this.panelData.length) / this.panelData.length);

        this.menu.find("span.tab").css("width", tabWidth);

        // remove last divider
        this.menu.find("span.divider:last").remove();
    },

    /**
     * (show/clear Panel)
     */

    showPanel: function(index) {

        this.canvas.find(".panel").removeClass("active").hide();

        return this.canvas.find(".panel[index=" + index + "]").addClass("active").show();
    },


    /**
     * (receiveLog)
     *
     * This method adds items to the panel
     */

    receiveLog: function(level, id, message, color) {

        // prevent own app
        if(id == this.getId()) return false;

        // go ahead
        var item = $("<div/>").attr("level", level);

        var d = new Date(),
            h = Math.abs(d.getHours()),
            m = Math.abs(d.getMinutes()),
            s = Math.abs(d.getSeconds());

        item.append($("<span/>").append(
            (h > 9 ? "" : "0") + h,
            ':',
            (m > 9 ? "" : "0") + m,
            ':',
            (s > 9 ? "" : "0") + s
        ));
        item.append($("<span/>").addClass(level).append(level));
        item.append($("<span/>").append(id));
        item.append($("<span/>").append(message));

        // add to output
        this.localLogBuffer[level].push(item);

        if(this.localLogBuffer[level].length > 50) {
            while(this.localLogBuffer[level].length > 50) this.localLogBuffer[level].shift();
        }

        // update
        this.canvas.find(".panel[level=" + level + "]").empty().append(this.localLogBuffer[level]);

    },



}));