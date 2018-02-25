// See speedometer-config.js for user config

var enableSmallSbSpeedo = true;
var isMPH = false;
var language = "DE";
var fuelEffunit_kml = false;
var noNavSD = false;
var black_background_opacity = 0.0;
var original_background_image = false;
var startAnalog = false;
var sbTemp = false;
var barSpeedometerMod = false;
var speedMod = false;
var engineSpeedBar = false;
var hideSpeedBar = false;
var tempIsF = false;
var speedAnimation = false;

// try not to make changes to the lines below
if (!window.jQuery) {
  utility.loadScript("addon-common/jquery.min.js");
}

framework.transitionsObj._genObj._TEMPLATE_CATEGORIES_TABLE.SpeedoMeterTmplt = "Detail with UMP";
framework.transitionsObj._genObj._TEMPLATE_CATEGORIES_TABLE.SpeedBarTmplt = "Detail with UMP";
framework.transitionsObj._genObj._TEMPLATE_CATEGORIES_TABLE.StartTmplt = "Detail with UMP";

function SbSpeedo() {
  $('head').prepend($('<link rel="stylesheet" type="text/css" />').attr('href', 'apps/_speedometer/css/StatusBarSpeedometer.css'));
  $('<div id="SbSpeedo"><div class="gpsAltitudeValue"></div><div class="gpsHeading"></div><div class="gpsSpeedValue">0</div><div class="speedUnit"></div></div>').appendTo('body');
  if (isMPH) {
    $('.speedUnit').text('mph');
  } else if (language === 'TR') {
    $('.speedUnit').text('km/s');
  } else {
    $('.speedUnit').text('km/h');
  }

  $('.StatusBarCtrlClock').click(function () {
    $('#SbSpeedo').fadeToggle();
  });

  setInterval(function () {
    if (framework.getCurrentApp() === 'backupparking') {
      $('#SbSpeedo').addClass('parking');
    } else {
      $('#SbSpeedo').removeClass('parking');
    }
  }, 1000);
  $('#SbSpeedo').on('click', toggleSbSpeedoExtra);
  if (sbTemp) {
    sbTemp = !sbTemp;
    toggleSbSpeedoExtra();
  }
}

function toggleSbSpeedoExtra() {
  if (sbTemp) {
    $('#SbSpeedo .Drv1AvlFuelEValue').addClass('gpsAltitudeValue').removeClass('Drv1AvlFuelEValue');
    $('#SbSpeedo .outsideTempValue').addClass('gpsHeading').removeClass('outsideTempValue').fadeIn();
  } else {
    $('#SbSpeedo .gpsHeading').addClass('outsideTempValue').removeClass('gpsHeading').fadeIn();
    $('#SbSpeedo .gpsAltitudeValue').addClass('Drv1AvlFuelEValue').removeClass('gpsAltitudeValue');
  }
  sbTemp = !sbTemp;
}


//addonInit();
setTimeout(function () {
  $.getScript("apps/_speedometer/js/speedometer.js", function () {
    loadSpeedoTemplate();
    if (enableSmallSbSpeedo) {
      SbSpeedo();
    }
  });
}, 5000);
