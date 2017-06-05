/*
 Copyright 2011 by Johnson Controls
 __________________________________________________________________________

 Filename: Utility.js
 __________________________________________________________________________

 Project: JCI-IHU
 Language: EN
 Author: agohsmbr
 Date: 10.11.2011
 __________________________________________________________________________

 Description:

 Revisions:
 __________________________________________________________________________

 */

log.addSrcFile("Utility.js", "framework");
//log.addSrcFile("Utility.js", "Utility");
//log.setLogLevel("Utility", "debug");

function Utility()
{
    this._toTypeRegex = /\s([a-zA-Z]+)/;    // regular expression for utility.toType()

    // List of locale month names for utility.formatDate(), indexed for compatibility
    // with Javascript Date.getMonth() values (0-11).
    this._localeMonthNames = [
                                "MonthNameJan",
                                "MonthNameFeb",
                                "MonthNameMar",
                                "MonthNameApr",
                                "MonthNameMay",
                                "MonthNameJun",
                                "MonthNameJul",
                                "MonthNameAug",
                                "MonthNameSep",
                                "MonthNameOct",
                                "MonthNameNov",
                                "MonthNameDec"
                             ];

    // Create an instance of Wayland Manager plugin if available
    this._waylandManager = null;
    if (window["WaylandManager"])
    {
        this._waylandManager = new WaylandManager(); // (Object) Used to store instance of JCILogger plugin when logging in target hardware
    }
}

Utility.prototype.emptyHTMLContent = function(elementId)
{
    var targetElt = document.getElementById(elementId);
    targetElt.innerHTML = "";
}

/*
 * Helper function to add a script to the head tag of the DOM.
 * @tparam  String      url     path from index.html to the js file to append (e.g. "common/controls/[*].js")
 * @tparam  String      attributes    Optional parameter: Object containing additional attributes to add to the tag
 * @tparam  Function    callback    Optional parameter: function to call when the script finishes loading
 */
Utility.prototype.loadScript = function(url, attributes, callback)
{
    log.debug("Utility.loadScript called for url: " + url);
    var startTime = Date.now();

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    if (attributes)
    {
        for (var key in attributes)
        {
            script[key] = attributes[key];
        }
    }
    script.onload = function()
    {
        var time = Date.now() - startTime;
        log.debug("Finished loadScript " + url + " time " + time + "ms");
        if (callback != null)
        {
            callback(arguments);
        }
    }


    var head = document.querySelector("head");
    head.appendChild(script);
}

Utility.prototype.removeScript = function(url)
{
    log.debug("Utility.removeScript called for url: " + url);
    var head = document.querySelector("head");
    var scriptTags = head.querySelectorAll("script");
    for(var i = 0; i < scriptTags.length; i++)
    {
        if(scriptTags[i].src.indexOf(url) !== -1)
        {
            scriptTags[i].parentNode.removeChild(scriptTags[i]);
        }
    }
}

/*
 * Helper function to add a css link to the head tag of the DOM. This should be called BEFORE the corresponding .js file
 * @tparam  String  url     path from index.html to the css file to append (e.g. "common/controls/[*].css")
 */
Utility.prototype.loadCss = function(url)
{
    log.debug("Utility.loadCss called for url: " + url);
    var startTime = Date.now();

    var cssNode = document.createElement("link");
    cssNode.type = "text/css";
    cssNode.rel = "stylesheet";
    cssNode.href = url;
    cssNode.onload = function()
    {
        var time = Date.now() - startTime;
        log.debug("Finished loadCss " + url + " time " + time + "ms");
    };

    var head = document.querySelector("head");
    head.appendChild(cssNode);
}

Utility.prototype.removeCss = function(url)
{
    var head = document.querySelector("head");
    var linkTags = head.querySelectorAll("link");

    for(var i = 0; i < linkTags.length; i++)
    {
        if(linkTags[i].href == url)
        {
            linkTags[i].parentNode.removeChild(linkTags[i]);
        }
    }
}

/*
 * Pass in a string element ID or an actual HTMLElement object.
 */
Utility.prototype.removeHTMLElement = function(idOrObj)
{
    if (idOrObj)
    {
        var toRemove = null;
        if (typeof idOrObj === "string")
        {
            toRemove = document.getElementById(idOrObj);
        }
        else if (idOrObj.parentNode)
        {
            // Assume we have an html element object
            toRemove = idOrObj;
        }

        if (toRemove != null)
        {
            toRemove.parentNode.removeChild(toRemove);
        }
    }
}

//Returns a string representation of the supplied object's type (e.g. string, array, date). More accurate than typeOf
Utility.prototype.toType = function(obj)
{
    return ({}).toString.call(obj).match(this._toTypeRegex)[1].toLowerCase();
}

/*
 * Returns a string stripped of HTML and C escape sequences that is safe to dispaly in MessagingCtrl (and others)
 * @param String str - the unformatted string
 * @param Boolean convertEscapeChars - if true, \n and \t C escape sequences are converted to HTML <br/> and &nbsp;&nbsp;
 * @return String - ready to be displayed string
 */
Utility.prototype.sanitizeHtml = function(str, convertEscapeChars)
{
    str = str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    if (convertEscapeChars)
    {
       str = str.replace(/\n/g, "<br/>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    }
    return str;
}

/*
 * get array item by property value
 * search the data list for an item containing certain data
 * @param String data - the data string to look for
 * @return Object { itemId:Number, item:Object }
 */
Utility.prototype.getArrayItemByPropertyValue = function(array, property, value)
{
    var item = null;

    for (var i=0; i<array.length; i++)
    {
        if (value === array[i][property])
        {
            item = {
                index : i,
                item : array[i]
            };
            break;
        }
    }
    return item;
};

/*
 * hide wayland surface
 * send wayland request to hide a surface by its id
 * @param String - the ID of the surface to hide
 * @param Integer - the time for the fadeOut animation. Default is 0.
 * @return void
 */
Utility.prototype.hideSurface = function(surfaceId, time)
{
    log.warn("utility.hideSurface() FUNCTION DEPRECATED. GUI apps should set properties.visibleSurfaces in the context table instead.");
};

/*
 * show wayland surface
 * send wayland request to show a surface by its id
 * @param String - the ID of the surface to show
 * @param Integer - the time for the fadeIn animation. Default is 0.
 * @return void
 */
Utility.prototype.showSurface = function(surfaceId, time)
{
    log.warn("utility.showSurface() FUNCTION DEPRECATED. GUI apps should set properties.visibleSurfaces in the context table instead.");
};

/*
 * Set the list of surfaces of surfaces to show. Surfaces not listed will be hidden.
 * @param surfaces (Array) Array of string naming surfaces.
 * @param fadeOpera (Boolean) Set to true to fade Opera.
 */
Utility.prototype.setRequiredSurfaces = function(surfaces, fadeOpera)
{
    if (!this._waylandManager)
        return;

    // surface request must be done with atleast one surface (mostly opera), else black screen will be shown on screen
    if (!surfaces || surfaces.length <= 0)
        return;

    var arr = surfaces.join(",");
    var fade = (fadeOpera) ? 1 : 0;
    log.info('Calling Wayland Manager to set required surfaces "' + arr + '", with Opera fade ' + fade);
    this._waylandManager.SetRequiredSurfaces(arr, fade);
}

/*
 * hide all wayland surfaces
 * send wayland request to hide all surfaces
 * @return void
 */
Utility.prototype.hideAllSurfaces = function()
{
    log.warn("utility.hideAllSurfaces() FUNCTION DEPRECATED. GUI apps should set properties.visibleSurfaces in the context table instead.");
};

/*
 * move a wayland surface
 * send wayland request to move a surface
 * @param surfaceId - String data - the ID of the surface to move
 * @param x - Number data - the X coordinate of the surface
 * @param y - Number data - the Y coordinate of the surface
 * @return void
 */
Utility.prototype.moveSurface = function(surfaceId, x, y)
{
    log.warn("utility.moveSurface() FUNCTION DEPRECATED.");
};


/*
 * Sets the surface that can receive keyboard inputs
 * @param String - the ID of the surface to show
 * @return void
 */
Utility.prototype.setInputSurface = function(surfaceId)
{
    if (!this._waylandManager)
        return;


    log.debug('Calling Wayland Manager to set input surface for surface ' + surfaceId);

    this._waylandManager.SetKeyboardFocus(surfaceId);
};

/*
 * @author Mike Petersen (apeter9)
 * @date   8/6/2013
 * @desc
 * Generate a formatted string for a time value (either 12-hour or 24-hour clock, based on system settings)
 * showing hours and minutes, with optional seconds.  This function conforms to the specification outlined
 * in "IHU HMI Date Format Truncation Strategy.doc", by awoodhc.
 *
 * NOTE: "AM" and "PM" strings for 12-hour clocks are NOT localized!
 *
 * @param  timeSeconds  Integer  # of seconds since 01/01/1970 00:00:00 UTC
 * @param  showSeconds  Boolean  If true, seconds will be included in the output time string
 * @return String Time value
 */
Utility.prototype.formatTime = function(timeSeconds, showSeconds) {
    log.debug("Utility.prototype.formatTime(" + timeSeconds + ", " + showSeconds + ") called");
    var timeStr = null;

    if ((this.toType(timeSeconds) === "number") &&
            (timeSeconds > 0)) {
        // Convert milliseconds to Date & dissect hours/minutes/seconds time components
        var timeObj = new Date(timeSeconds*1000);
        var hours   = timeObj.getHours();
        var mins    = timeObj.getMinutes();
        var secs    = timeObj.getSeconds();

        // Check the system for the current clock setting (12-hour or 24-hour clock)
        var format = framework.localize.getTimeFormat();
        if (format == "12hrs") {
            // Get the AM/PM string from the unmodified hours
            var ampm = (hours >= 12) ? "PM" : "AM";

            // Truncate the hours for a 12-hour clock (if needed)
            hours = hours % 12;
            hours = (hours) ? hours : 12;   // the hour '0' should be '12'

            // Get the base time string (hours & minutes, zero-padded)
            timeStr = ((hours < 10) ? ('0' + hours) : hours) + ':' + ((mins < 10) ? ('0' + mins) : mins );

            // Append seconds (zero-padded) to time string (if needed)
            if (showSeconds) {
                timeStr = timeStr + ":" + ((secs < 10) ? ('0' + secs) : secs);
            }

            // Append the AM/PM string
            timeStr = timeStr + " " + ampm;
        } else if (format == "24hrs") {
            // Get the base time string (hours & minutes)
            timeStr = ((hours < 10) ? ('0' + hours) : hours) + ':' + ((mins < 10) ? ('0' + mins) : mins );

            // Append seconds to time string (if needed)
            if (showSeconds) {
                timeStr = timeStr + ":" + ((secs < 10) ? ('0' + secs) : secs);
            }
        }
    } else {
        log.warn("utility.formatTime() called with unknown timeSeconds argument");
        timeStr = "Unknown";
    }

    log.debug("formatTime(): time string returned: \"" + timeStr + "\"");
    return timeStr;
};

/*
 * Returns time string formatted per the input parameters
 *
 * @param  Integer Value in milliseconds
 * @param  Integer Value in milliseconds (should be greater than first param)
 * @return String Time value difference in # of hours, minutes and seconds
 */
Utility.prototype.findTimeDuration = function(date1, date2)
{
    log.debug ("Utility.prototype.findTimeDuration called");

    if (date1 >= date2)
    {
        log.warn("First date value is passed either greater or equal to second date value, Cannot find difference ");
        return 0;
    }
    else
    {
        var date1 = new Date (date1*1000);
        var date2 = new Date (date2*1000);

        log.debug("Date1 " + date1);
        log.debug("Date2 " + date2);

        var delta = Math.abs(date2 - date1);
        //delta = date2 - date1;
        log.debug("Delta " + delta);

        var hours = Math.round(delta / (1000*60*60));
        var mins = Math.round((delta % (1000*60*60)) / (1000*60));
        var secs = Math.round(((delta % (1000*60*60)) / (1000*60)) / 1000);
        var timeStr = null;

        timeStr = (hours > 9 ? hours : '0' + hours) + ":" + (mins > 9 ? mins : '0' + mins) +  ":" + (secs > 9 ? secs : '0' + secs);

        log.debug ("timeStr = " + timeStr);
    }
    log.debug ("Time string returned " + timeStr);
    return timeStr;
}


Utility.prototype.formatDateCustom = function(currentTime) {
    var dateStr = null;

    // Dissect month (0-11) & day (1-31)
    // var month   = currentTime.getMonth();
    var month   = currentTime.getMonth();
    var day     = currentTime.getDate();

    // gives date as DD.MM. back (comment the next 4 lines for standard)
    var month   = (currentTime.getMonth()+1);
    var dayStr = ((day < 10) ? ('0' + day) : day);
    var monthStr = ((month < 10) ? ('0' + month) : month);
    return dayStr + "." + monthStr + ".";

    // Localize the month.  Includes the month/moon glyph for Oriental languages.
    var localeMonthName = this._localeMonthNames[month];
    var monthStr = framework.localize.getLocStr("common", localeMonthName, null);

    // Zero-pad the days
    // MPP 8/8/2013
    // Don't zero-pad the days, per wireframe pics from document
    //var dayStr = ((day < 10) ? ('0' + day) : day);

    // Create a submap for further localization of the date format
    var subMap = {
        "month" : monthStr,
        "day" : day
    };

    // Localize the date format (with replaceable month/day parameters in submap).
    // Includes the day/sun glyph for Oriental languages.
    dateStr = framework.localize.getLocStr("common", "DateFormat", subMap);

    return dateStr;
}


/*
 * @author Mike Petersen (apeter9)
 * @date   8/6/2013
 * @desc
 * Generate a formatted date string for a time value, showing numeric day and localized month.  This
 * function conforms to the specification outlined in "IHU HMI Date Format Truncation Strategy.doc",
 * by awoodhc.
 *
 * @param  timeSeconds      Integer  # of seconds since 01/01/1970 00:00:00 UTC
 * @return String Date value
 */
Utility.prototype.formatDate = function(timeSeconds) {
    log.debug("Utility.prototype.formatDate(" + timeSeconds + ") called");
    var dateStr = null;

    if ((this.toType(timeSeconds) === "number") &&
            (timeSeconds > 0)) {
        // Convert milliseconds to Date & dissect month (0-11) & day (1-31)
        var timeObj = new Date(timeSeconds*1000);
        var month   = timeObj.getMonth();
        var day     = timeObj.getDate();

        // Localize the month.  Includes the month/moon glyph for Oriental languages.
        var localeMonthName = this._localeMonthNames[month];
        var monthStr = framework.localize.getLocStr("common", localeMonthName, null);

        // Zero-pad the days
        // MPP 8/8/2013
        // Don't zero-pad the days, per wireframe pics from document
        //var dayStr = ((day < 10) ? ('0' + day) : day);

        // Create a submap for further localization of the date format
        var subMap = {
            "month" : monthStr,
            "day" : day
        };

        // Localize the date format (with replaceable month/day parameters in submap).
        // Includes the day/sun glyph for Oriental languages.
        dateStr = framework.localize.getLocStr("common", "DateFormat", subMap);
    }
    else
    {
        log.warn("utility.formatDate() called with unknown timeSeconds argument");
        dateStr = "Unknown";
    }

    log.debug("formatDate(): date string returned: \"" + dateStr + "\"");
    return dateStr;
};

/*
 * @author Mike Petersen (apeter9)
 * @date   8/6/2013
 * @desc
 * Generate a formatted date/time string for a time value.  See formatDate() and formatTime() above for
 * details about the formatted strings returned for each date/time component.
 * This function conforms to the specification outlined in "IHU HMI Date Format Truncation Strategy.doc",
 * by awoodhc.
 *
 * @param  timeSeconds  Integer  # of seconds since 01/01/1970 00:00:00 UTC
 * @param  showSeconds  Boolean  If true, seconds will be included in the output date/time string
 * @return String Date/time value
 */
Utility.prototype.formatDateTime = function(timeSeconds, showSeconds) {
    log.debug ("Utility.prototype.formatDateTime(" + timeSeconds + ", " + showSeconds + ") called");
    var dateTimeStr = null;

    if ((this.toType(timeSeconds) === "number") &&
            (timeSeconds > 0)) {
        // Delegate date & time components to subfunctions
        var dateStr = this.formatDate(timeSeconds);
        var timeStr = this.formatTime(timeSeconds, showSeconds);

        // Join components together for final date/time string
        dateTimeStr = dateStr + " " + timeStr;
    } else {
        log.warn("utility.formatDateTime() called with unknown timeSeconds argument");
        dateTimeStr = "Unknown";
    }

    log.debug ("formatDateTime(): date/time string returned: \"" + dateTimeStr + "\"");
    return dateTimeStr;
}

/*
 * @author Mike Petersen (apeter9)
 * @date   8/6/2013
 * @desc
 * Generate a formatted date or time string for a time value, depending on whether the time value
 * corresponds to "today" (time-only) or not (date-only).  See formatDate() and formatTime() above
 * for details about the formatted strings returned for each date/time component.
 * This function conforms to the specification outlined in "IHU HMI Date Format Truncation Strategy.doc",
 * by awoodhc.
 *
 * @param  timeSeconds  Integer  # of seconds since 01/01/1970 00:00:00 UTC
 * @param  showSeconds  Boolean  If true, seconds will be included in the output date/time string
 * @return String Date/time value
 */
Utility.prototype.formatSmartDateTime = function(timeSeconds, showSeconds) {
    log.debug ("Utility.prototype.formatSmartDateTime(" + timeSeconds + ", " + showSeconds + ") called");
    var dateTimeStr = null;

    if ((this.toType(timeSeconds) === "number") &&
            (timeSeconds > 0)) {

        if (framework.common.getCurrentTime()) {
            // Get today's date
            var todayDate = new Date(framework.common.getCurrentTime());
            // Get date of timeSeconds timestamp
            var timeSecondsDate = new Date(timeSeconds*1000);
            // If they're the same, ...
            if (todayDate.getFullYear() == timeSecondsDate.getFullYear() &&
                todayDate.getMonth() == timeSecondsDate.getMonth() &&
                todayDate.getDate() == timeSecondsDate.getDate()) {
                // The given time value corresponds to today, so return the time string instead
                dateTimeStr = this.formatTime(timeSeconds, showSeconds);
            }
        }

        if (dateTimeStr == null) {
            // Otherwise, return the date string as-is
            dateTimeStr = this.formatDate(timeSeconds);
        }
    } else {
        log.warn("utility.formatSmartDateTime() called with unknown timeSeconds argument");
        dateTimeStr = "Unknown";
    }

    log.debug ("formatSmartDateTime(): date/time string returned: \"" + dateTimeStr + "\"");
    return dateTimeStr;
};

/*
 * Returns the string label for the current unit for distance in the CMU
 * @param  Boolean When True, unit label will not be localized.
 * @return String
 */
Utility.prototype.getDistanceUnitLabel = function(dontLocalize)
{
    var distUnit = framework.localize.getDistanceUnit();

    if (distUnit == "Miles")
    {
        if (dontLocalize)
        {
            distUnit = "mi";
        }
        else
        {
            distUnit = framework.localize.getLocStr("common","distanceUnitsMiles");
        }
    }
    else if (distUnit == "Kilometers")
    {
        if (dontLocalize)
        {
            distUnit = "km";
        }
        else
        {
            distUnit = framework.localize.getLocStr("common","distanceUnitsKms");
        }
    }

    return distUnit;
}


/*
 * Returns the string label for the current unit for temperature in the CMU
 * @param  Boolean When True, unit label will not be localized.
 * @return String
 */
Utility.prototype.getTemperatureUnitLabel = function(dontLocalize)
{
    var tempUnit = framework.localize.getTemperatureUnit();

    if (tempUnit == "Fahrenheit")
    {
        if (dontLocalize)
        {
            tempUnit = "F";
        }
        else
        {
            tempUnit = framework.localize.getLocStr("common","tempUnitsFahrenheit");
        }
    }
    else if (tempUnit == "Celsius")
    {
        if (dontLocalize)
        {
            tempUnit = "C";
        }
        else
        {
            tempUnit = framework.localize.getLocStr("common","tempUnitsCelsius");
        }
    }

    return tempUnit;
}


/*
 * Returns the string label for the current unit for volume in the CMU
 * @param  Boolean When True, unit label will not be localized.
 * @return String
 */
Utility.prototype.getVolumeUnitLabel = function(dontLocalize)
{
    var volUnit = framework.localize.getVolumeUnit();

    if (volUnit == "Gallons")
    {
        if (dontLocalize)
        {
            volUnit = "gallons";
        }
        else
        {
            volUnit = framework.localize.getLocStr("common","volUnitsGallons");
        }
    }
    else if (volUnit == "Liters")
    {
        if (dontLocalize)
        {
            volUnit = "liters";
        }
        else
        {
            volUnit = framework.localize.getLocStr("common","volUnitsLiters");
        }
    }

    return volUnit;
}

/*
 * Returns a deep copy of the given object.
 * @param p (Object) - the original source object
 * @param c (Object) - optional object to copy p into
 * @return (Object) - returns the copied object.
 */
Utility.prototype.deepCopy = function(p, c)
{
    var c = c||{};
    for (var i in p)
    {
        if (typeof p[i] === 'object' && p[i] != null)
        {
            c[i] = (p[i].constructor === Array) ? [] : {};
            this.deepCopy(p[i], c[i]);
        }
        else
        {
            c[i] = p[i];
        }
    }
    return c;
}
