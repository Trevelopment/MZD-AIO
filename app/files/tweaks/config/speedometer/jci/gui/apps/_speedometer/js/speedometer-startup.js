//// user config begin ////

// set it false if you don't want the small speedometer in statusbar
var enableSmallSbSpeedo = true;

// isMPH is used for metric/US english conversion flag (C/F, KPH/MPH, Meter/Feet, L per 100km/MPG)
// Set isMPH = true for MPH, Feet, MPG
// Set isMPH = false for KPH, Meter
var isMPH = false;

// set the language for the speedometer
// available EN, ES, DE, PL, SK, TR, FR
var language = "DE";

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

// set to true for Outside Temperature & Fuel Efficiency in the statusbar
// false for Compass & Altitude
var sbTemp = false;

// flag for bar SpeedoMeter
// Set This to true if using the Bar Speedometer Mod
var barSpeedometerMod = false;

// set this to true for Fahrenheit false for Celsius
var tempIsF = false;

//// user config end ////

// try not to make changes to the lines below
if (!window.jQuery) {
  utility.loadScript("addon-common/jquery.min.js");
}

framework.transitionsObj._genObj._TEMPLATE_CATEGORIES_TABLE.SpeedoMeterTmplt = "Detail with UMP";

function SbSpeedo(){
     $('head').prepend($('<link rel="stylesheet" type="text/css" />').attr('href', 'apps/_speedometer/css/StatusBarSpeedometer.css'));
     $('<div id="SbSpeedo"><div class="gpsAltitudeValue"></div><div class="gpsHeading"></div><div class="gpsSpeedValue">0</div><div class="speedUnit"></div></div>').appendTo('body');
    if(isMPH){
        $('.speedUnit').text('mph');
    } else if(language === 'TR'){
        $('.speedUnit').text('km/s');
    } else {
        $('.speedUnit').text('km/h');
    }

    $('.StatusBarCtrlClock').click(function (){
        $('#SbSpeedo').fadeToggle();
    });

    setInterval(function (){
      if(framework.getCurrentApp() === 'backupparking'){
        $('#SbSpeedo').addClass('parking');
      } else {
        $('#SbSpeedo').removeClass('parking');
      }
    }, 1000);
    $('#SbSpeedo').on('click',toggleSbSpeedoExtra);
    if(sbTemp) {
      sbTemp = !sbTemp;
      toggleSbSpeedoExtra();
    }
}
function toggleSbSpeedoExtra() {
  if(sbTemp) {
    $('#SbSpeedo .Drv1AvlFuelEValue').addClass('gpsAltitudeValue').removeClass('Drv1AvlFuelEValue');
    $('#SbSpeedo .outsideTempValue').addClass('gpsHeading').removeClass('outsideTempValue').fadeIn();
  } else {
    $('#SbSpeedo .gpsHeading').addClass('outsideTempValue').removeClass('gpsHeading').fadeIn();
    $('#SbSpeedo .gpsAltitudeValue').addClass('Drv1AvlFuelEValue').removeClass('gpsAltitudeValue');
  }
  sbTemp = !sbTemp;
}
function loadSpeedoTemplate() {
  if(barSpeedometerMod) {
    $.getScript('apps/_speedometer/js/speedometer-config.js', function(data){
      $('body').prepend("<script>"+data+"</script>");
    });
  }
}

//addonInit();
setTimeout(function(){
  $.getScript("apps/_speedometer/js/speedometer.js",function(){
    if(enableSmallSbSpeedo){
      SbSpeedo();
    }
    loadSpeedoTemplate();
  });
}, 5000);
