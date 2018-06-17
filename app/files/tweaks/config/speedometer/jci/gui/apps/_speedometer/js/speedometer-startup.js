// See speedometer-config.js for user config
var enableSmallSbSpeedo = true;
var isMPH = false;
var language = 'DE';
var fuelEffunit_kml = false;
var noNavSD = false;
var hideSbSpeedoSBN = false;
var black_background_opacity = 0.0;
var original_background_image = false;
var startAnalog = false;
var barSpeedometerMod = false;
var speedMod = false;
var engineSpeedBar = false;
var hideSpeedBar = false;
var speedAnimation = false;
var tempIsF = false;
var spdLrgTxt = false;
var analogColor = 'Red';
var speedometerTheme = 0;
var sbFuelBar = false;
var sbHideInApp = true;
var sbfbPos = '';
var SbMain = 'gpsSpeedValue';
var SbVal1 = 'gpsHeading';
var SbVal2 = 'gpsAltitudeValue';
var sbInterval = 5000;
var fuelBarColor_80to100 = 'rgb(0, 255, 0)';
var fuelBarColor_60to80 = 'rgb(0, 255, 255)';
var fuelBarColor_40to60 = 'rgb(0, 0, 255)';
var fuelBarColor_20to40 = 'rgb(255, 0, 255)';
var fuelBarColor_0to20 = 'rgb(255, 0, 0)';
var fuelGaugeFactor = 100;
var fuelGaugeValueSuffix = "%";
if (fuelGaugeValueSuffix === "%" || fuelGaugeFactor === undefined) {
  fuelGaugeFactor = 100;
  fuelGaugeValueSuffix = "%";
}
// try not to make changes to the lines below
if (!window.jQuery) {
  utility.loadScript("addon-common/jquery.min.js");
}
framework.transitionsObj._genObj._TEMPLATE_CATEGORIES_TABLE.SpeedoMeterTmplt = "Detail with UMP";
framework.transitionsObj._genObj._TEMPLATE_CATEGORIES_TABLE.SpeedBarTmplt = "Detail with UMP";
framework.transitionsObj._genObj._TEMPLATE_CATEGORIES_TABLE.StartTmplt = "Detail with Back";

function SbSpeedo() {
  $('head').prepend($('<link rel="stylesheet" type="text/css" />').attr('href', 'apps/_speedometer/css/StatusBarSpeedometer.css'));
  $('<div id="SbSpeedo"><div class="' + SbVal1 + ' SbVal1"></div><div class="' + SbVal2 + ' SbVal2"></div><div class="' + SbMain + ' SbMain">0</div><div class="speedUnit SbUnit"></div></div>').appendTo('body');
  if (sbFuelBar) {
    $('<div id="Sbfuel-bar-wrapper" class="fuel-bar-wrapper ' + sbfbPos + '"><div id="Sbfuel-bar-container" class="fuel-bar-container"><span id="Sbfuel-bar" class="fuel-bar" style="width: 100%;"></span></div></div>').appendTo('body');
  }
  if (isMPH) {
    $('.speedUnit').text('mph');
  } else if (language === 'TR') {
    $('.speedUnit').text('km/s');
  } else {
    $('.speedUnit').text('km/h');
  }
  $('.StatusBarCtrlClock, #SbSpeedo').click(function() {
    var sbVis = $('#SbSpeedo').is(':visible');
    $('#SbSpeedo, #Sbfuel-bar-wrapper').fadeToggle();
    sbVis ? $('#SbSpeedo').addClass('stayHidden') : $('#SbSpeedo').removeClass('stayHidden');
  });
  setInterval(function() {
    if (framework.getCurrentApp() === 'backupparking') {
      $('#SbSpeedo, #Sbfuel-bar-wrapper').addClass('parking');
      $('#SbSpeedo .SbVal1, #SbSpeedo .SbVal2').fadeIn();
    } else {
      $('#SbSpeedo, #Sbfuel-bar-wrapper').removeClass('parking');
    }
  }, 1000);
}
setTimeout(function() {
  $.getScript("apps/_speedometer/js/speedometer.js", function() {
    LoadSpeedoTemplate();
    if (enableSmallSbSpeedo) {
      SbSpeedo();
    }
  });
}, 5000);
if (enableSmallSbSpeedo && StatusBarCtrl) {
  StatusBarCtrl.prototype.setSbnDisplayed = function(flag) {
    log.debug("StatusBarCtrl.setSbnDisplayed(" + flag + ")");
    var SbSpeedo = document.getElementById('SbSpeedo');
    if (flag === true) {
      // Hide app name and icons
      this._domainIconDiv.style.opacity = 0;
      this._appNameDiv.style.opacity = 0;
      // hide Statusbar speedometer
      if (hideSbSpeedoSBN) $('#SbSpeedo').fadeOut(100);
    } else {
      // Restore app name and icons
      this._domainIconDiv.style.opacity = 1;
      this._appNameDiv.style.opacity = 1;
      // and Statusbar speedometer
      if (hideSbSpeedoSBN && !$(SbSpeedo).hasClass('stayHidden')) $('#SbSpeedo').fadeIn(400);
    }
  };
}
