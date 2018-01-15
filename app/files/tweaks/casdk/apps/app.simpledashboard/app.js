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
 * SimpleDashboard Example Applicatiom
 *
 * This is a tutorial example application showing a simple Dashboard that allows cycling
 * between Vehicle values using the Multicontroller.
 *
 */


CustomApplicationsHandler.register("app.simpledashboard", new CustomApplication({

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

        title: 'Simple Dashboard',

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
     * (regions)
     *
     * A object that allows us to manage the different regions
     */

    regions: {

        /**
         * North America (na)
         */

        na: {
        	unit: 'MPH',
        	transform: DataTransform.toMPH,
        },

        /**
         * Europe (eu)
         */

        eu: {
        	unit: 'KM/H',
        	transform: false
        },
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

        // let's build our interface

        // 1) create a value label that shows the current value of the selected section

        this.valueLabel = $("<div/>").appendTo(this.canvas);

        // 2) create a name label that shows the name of the selected section

        this.nameLabel = $("<span/>").appendTo(this.canvas);


        // now let's get our data in place

        // 1) create our sections by calling our application specific method
        this.createSections();

        // 2) Finally show the first section
        this.showSection(0);

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

        // For this application we are looking at the wheel
        // and the buttons left and right
        switch(eventId) {

            /**
             * Go forward in displaying our sections
             */

            case "cw":
            case "rightStart":

                // we just cyle the sections here

                this.currentSectionIndex++;
                if(this.currentSectionIndex >= this.sections.length) this.currentSectionIndex = 0;

                this.showSection(this.currentSectionIndex);

                break;

            /**
             * Go backwards in displaying our sections
             */

            case "ccw":
            case "leftStart":

                // we just cyle the sections here

                this.currentSectionIndex--;
                if(this.currentSectionIndex < 0) this.currentSectionIndex = this.sections.length -1;

                 this.showSection(this.currentSectionIndex);

                break;

            /**
             * When the middle button is pressed, we will change the region
             * just for this application
             */

            case "selectStart":

                this.setRegion(this.getRegion() == "na" ? "eu" : "na");

                break;
        }

    },

    /**
     * (event) onRegionChange
     *
     * Called when the region is changed
     */

     onRegionChange: function(region) {

        // let's just refresh our current section
        this.showSection(this.currentSectionIndex);

     },


    /***
     *** Applicaton specific methods
     ***/

    /**
     * (createSections)
     *
     * This method registers all the sections we want to display
     */

    createSections: function() {

        // Here we define our sections

        this.sections = [

            // Vehicle speed
            {field: VehicleData.vehicle.speed, transform: function(speed, index) {

                // For speed we need to transform it to the local region
                if(this.regions[this.getRegion()].transform) {
                    speed = this.regions[this.getRegion()].transform(speed);
                }

                // return the new value and name
                return {
                    value: speed,
                    name: this.regions[this.getRegion()].unit
                };

            }.bind(this)},

            // Vehicle RPM
            {field: VehicleData.vehicle.rpm, name: 'RPM'},

            // GPS Altitude
            {field: VehicleData.gps.altitude, name: 'Altitude'},

            // GPS Heading
            {field: VehicleData.gps.heading, name: 'Heading'},

            // GPS Velocity
            {field: VehicleData.gps.velocity, name: 'Velocity'},

            // Odo meter
            {field: VehicleData.vehicle.odometer, name: 'Odometer'},

            // Battery Level
            {field: VehicleData.vehicle.batterylevel, name: 'Battery Level'},

            // Fuel Level
            {field: VehicleData.fuel.position, name: 'Fuel Level'},
            
            // Average Consumption
            {field: VehicleData.fuel.averageconsumption, name: 'Average Fuel Consumption'},
            
            // Temperature: Outside
            {field: VehicleData.temperature.outside, name: 'Temperature Outside'},

            // Temperature Intake
            {field: VehicleData.temperature.intake, name: 'Temperature Intake'},

            // Temperature Coolant
            {field: VehicleData.temperature.coolant, name: 'Temperature Coolant'},

        ];

        // let's actually execute the subscriptions

        this.sections.forEach(function(section, sectionIndex) {

            this.subscribe(section.field, function(value) {

                // we got a new value for this subscription, let's update it
                this.updateSection(sectionIndex, value);

            }.bind(this));

        }.bind(this));

    },

    /**
     * (showSection)
     *
     * This method shows a section specific value / name
     */

    showSection: function(sectionIndex) {

        // just in case, let's do some sanity check
        if(!this.sections || sectionIndex < 0 || sectionIndex >= this.sections.length) return false;

        // let's store the current section in a local variable
        var section = this.sections[sectionIndex],

            // Let's get also the value and name
            value = section.value || 0,
            name = section.name;


        // Let's check if this value requires some transformation.
        // We are using the internal is handler to determinate

        if(this.is.fn(section.transform)) {

            // execute the transform
            var result = section.transform(section.value, sectionIndex);

            // set the updated value
            value = result.value || 0;

            // also set the name if necessary
            name = result.name || name;
        }

        // now let's set the sections value
        this.valueLabel.html(value);

        // and the name
        this.nameLabel.html(name);

        // finally let's update the current section index
        this.currentSectionIndex = sectionIndex;
    },

    /**
     * (updateSection)
     *
     * This method updates a value and also updates the display if necessary
     */

    updateSection: function(sectionIndex, value) {

        // just in case, let's do some sanity check
        if(sectionIndex < 0 || sectionIndex >= this.sections.length) return false;

        // let's update the sections value
        this.sections[sectionIndex].value = value;

        // and finally, update the display if required
        if(sectionIndex == this.currentSectionIndex) {
            this.showSection(this.currentSectionIndex);
        }
    },


}));