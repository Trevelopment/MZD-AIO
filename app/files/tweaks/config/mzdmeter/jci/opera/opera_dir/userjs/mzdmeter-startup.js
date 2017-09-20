//// user config begin ////

// set it false if you don't want the small speedometer in statusbar
var enableSmallSbSpeedo = true;

// isMPH is used for metric/US english conversion flag (C/F, KPH/MPH, Meter/Feet, L per 100km/MPG)
// Set isMPH = true for MPH, Feet, MPG
// Set isMPH = false for KPH, Meter
var isMPH = false;

// set the language for the speedometer
// available EN, ES, DE, PL, SK, TR, FR
var language = "EN";

// set unit for fuel efficiency to km/L instead of L/100km
var fuelEffunit_kml = false;

// set true if you have no Mazda navigation SD card (important for the compass)
var noNavSD = false;

// set the opacity of black background color for speedometer, to reduce the visibility of custom MZD background images
// possible values 0.0 (full transparent) until 1.0 (complete black background)
var black_background_opacity = 0.0;

// set true if you want the original speedometer background image as in version 4.2 or below
// if "true" the opacity above will be ignored
var original_background_image = false;

// set to true to start in analog mode (only for digital speedometer mod)
// false to start in digital mode
var startAnalog = false;

//// user config end ////

// try not to make changes to the lines below

function addonInit(){  
	$.ajax({
      method: "GET",
      url: "apps/_mzdmeter/js/mzdmeter.js",
      dataType: "script"
    });
}

(function (){
    window.opera.addEventListener("AfterEvent.load", function (e){
        if(!document.getElementById("jquery1-script")){
            var docBody = document.getElementsByTagName("body")[0];
            if(docBody){
                var script1 = document.createElement("script");
                script1.setAttribute("id", "jquery1-script");
                script1.setAttribute("src", "addon-common/jquery.min.js");
                script1.addEventListener('load', function (){
                    addonInit();
                }, false);
                docBody.appendChild(script1);
            }
        }
    });
})();
