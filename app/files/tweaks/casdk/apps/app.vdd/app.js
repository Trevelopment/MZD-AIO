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


CustomApplicationsHandler.register("app.vdd", new CustomApplication({

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

        title: 'Vehicle Data Diagnostic',

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

    /**
     * (DataGroups)
     */

    dataGroups: [
        {name: 'Main', items: [
            {name: 'General', mapping: VehicleData.general},
            {name: 'Vehicle Data', mapping: VehicleData.vehicle},
            {name: 'Vehicle Fuel', mapping: VehicleData.fuel},
            {name: 'Vehicle Temperatures', mapping: VehicleData.temperature},
            {name: 'GPS', mapping: VehicleData.gps},
        ]},
        {prefix: 'VDT', title: 'Vehicle Driving Data' },
        {prefix: 'GPS', title: 'Global Positioning System'},
        {prefix: 'PID', title: 'Vehicle Data PID'},
        {prefix: 'VDTC', title: 'Vehicle Data Current'},
        {prefix: 'VDM', title: 'ECO and Energy Management'},
        {prefix: 'VDMH', title: 'ECO and Energy History'},
        {prefix: 'VDTS', title: 'Vehicle Settings'},
        {prefix: 'IDM', title: 'Ignition Diagnostic Monitor'},
        {prefix: 'IDMH', title: 'Ignition Diagnostic History'},
        {prefix: 'VDTH', title: 'Vehicle Data Transfer History'}
    ],


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

        this.createInterface();

    },

    /**
     * (focused)
     */

    focused: function() {

        //this.update();
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

        var itemHeight = this.canvas.find(".panel div.item").outerHeight(true) * 2;

        switch(eventId) {

            /**
             * Scroll Down
             */

            case "cw":

                this.scrollElement(this.canvas.find(".panel"), itemHeight);

                break;

            /**
             * Scroll Up
             */

            case "ccw":

                this.scrollElement(this.canvas.find(".panel"), -1 * itemHeight);

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

        // continue
        this.canvas.find(".panel").removeClass("active").hide();

        var active = this.canvas.find(".panel[name=" + element.attr("name") + "]").addClass("active").show();

        // create items
        this.createPanel(element.attr("index"));

        // set position
        if(this.panelScrollPositions[active.attr("index")]) {
            active.scrollTop(this.panelScrollPositions[active.attr("index")]);
        }
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
        // create tabbed menu
        this.menu = $("<div/>").addClass("tabs").appendTo(this.canvas);

        // create tabs
        this.panelData = [];
        this.panelScrollPositions = [];
        $.each(this.dataGroups, function(index, group) {

            // set enabled
            var enabled = true;

            // get data table
            if(!group.items) {

                var table = CustomApplicationDataHandler.getTableByPrefix(group.prefix);

                enabled = table && table.enabled || false;
            }

            // set group id
            group.id = group.name || group.prefix

            // add to menu if enabled
            if(enabled) {
                // add to menu
                this.menu.append(this.addContext($("<span/>").attr({name: group.id, index: this.panelData.length}).addClass("tab").append(group.name || group.prefix)));

                // add divider
                this.menu.append($("<span/>").addClass("divider"));

                // add to panel
                this.panelData.push(group);

                this.panelScrollPositions.push(0);

            }

        }.bind(this));

        // calculate size
        var tabWidth = Math.round((800 - this.panelData.length) / this.panelData.length);

        this.menu.find("span.tab").css("width", tabWidth);

        // remove last divider
        this.menu.find("span.divider:last").remove();

    },


    /**
     * createPanel
     */

    createPanel: function(index) {


        // create panels
        if(!this.panelData[index]) return;

        // flush
        this.removeSubscriptions();

        this.canvas.find(".panel").remove();

        // create panel
        var panelDom = $("<div/>").addClass("panel").appendTo(this.canvas),
            panel = this.panelData[index];

        // create items in panel
        switch(true) {

            case this.is.array(panel.items):

                // create sectionalized view
                panel.items.forEach(function(section) {

                    // add header
                    panelDom.append($("<div/>").addClass("section").append(section.name));

                    // add items
                    this.createItems(panelDom, section);

                }.bind(this));

                break;

            default:
                // create description
                panelDom.append($("<div/>").addClass("section").append(panel.title));

                // create items

                this.createItems(panelDom, panel);
                break;


        }

    },

    /**
     * (createItems)
     *
     * This method adds items to the panel
     */

    createItems: function(panelDom, group) {

        // initialize
        var values = [];

        // prepare mapping to value table
        if(group.mapping) {

            // get actual values
            $.each(group.mapping, function(id, params) {

                if(params.id) {
                    var tmp = CustomApplicationDataHandler.get(params.id);
                    if(tmp) {
                        params.value = tmp.value;
                        values.push($.extend(params, tmp));
                    }
                }
            });

        } else {

            // build data array
            values = $.map(CustomApplicationDataHandler.data, function(value) {
                if(value.prefix == group.prefix) {
                    return value;
                }
            });
        }

        // sort by name
        values.sort(function(a, b) {
            return a.name > b.name ? 1 : -1;
        });

        // get data handler
        values.forEach(function(value) {

            // check prefix
            var item = $("<div/>").addClass("item").appendTo(panelDom);

            var typeLabel = value.type;
            switch(typeLabel) {
                case "string": typeLabel= "str"; break;
                case "double": typeLabel = "dbl"; break;
                default: typeLabel = "int"; break;
            }

            // add fields
            $("<span/>").append(value.prefix ? value.prefix : "DATA").addClass(value.prefix).appendTo(item);
            $("<span/>").append(typeLabel).addClass(value.type).appendTo(item);
            $("<span/>").append(value.friendlyName ? value.friendlyName : value.name).appendTo(item);
            $("<span/>").attr("data", value.id).append(value.value).appendTo(item);

            // create subscription
            this.subscribe(value.id, this.valueCallback.bind(this));

        }.bind(this));

    },

    /**
     * (valueCallback)
     */

    valueCallback: function(value, payload) {

        this.canvas.find("span[data=" + payload.id + "]").html(value);

    },


}));