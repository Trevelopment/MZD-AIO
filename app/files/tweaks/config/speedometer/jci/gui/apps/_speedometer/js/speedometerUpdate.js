/* jshint -W117 */
function updateSpeedoApp() {
  // remove all disabled/unused values from the DOM
  $('[class*="vehDataBar"].pos0').remove();
  for (var i = 5; i > spdBottomRows; i--) {
    $('.vehDataBar' + i).remove();
  }
  $('#speedometerContainer').addClass(analogColor);
  // *********************************************************************************************
  // Set Multicontroller Toggle Actions
  // *********************************************************************************************
  if (barSpeedometerMod) {
    var rows = (typeof spdBottomRows === "undefined") ? 3 : spdBottomRows;
    // Toggle Next Botom Row. Default: Select
    // --------------------------------------------------------------------------
    $('.spdBtn0').click(function() {
      (currDataBar > rows - 1) ? currDataBar = 1: ++currDataBar;
      $('[class*="vehDataBar"]').removeClass('activeDataBar');
      $('.vehDataBar' + currDataBar).addClass('activeDataBar');
    });
    // Default: Up
    $('.spdBtn2').click(function() {
      engineSpeedBar = !engineSpeedBar;
      AIO_SBN(SPDSBN_Speed_Bar + ": " + (engineSpeedBar ? $('#engineSpeedFieldSet legend').text() : $('#speedCurrentFieldSet legend').text()), "apps/_speedometer/IcnSbnSpeedometer.png");
    });
    $('.spdBtn5').click(ClearSpeedBarLayout);
    $('.spdBtn6').click(function() {
      AIO_SBN(SPDSBN_Classic_Speedometer, "apps/_speedometer/templates/SpeedoMeter/images/speed.png");
      aioMagicRoute("_speedometer", "SpeedClassic");
    });
    $('.spdBtn7').click(function() {
      $('[class^=speedBar]').toggle();
      AIO_SBN(($('.speedBar_5').css('display').indexOf('none') !== -1 ? SPDSBN_Hide_Speed_Bar : SPDSBN_Show_Speed_Bar), "apps/_speedometer/IcnSbnSpeedometer.png");
    });
    if (hideSpeedBar) {
      $('[class^=speedBar]').toggle();
    }
    $('.spdBtn9').click(cycleColorThemes);
    $('#speedBarContainer').addClass('theme' + speedometerTheme);
  } else if (speedMod) {
    // touch to pop top value
    // --------------------------------------------------------------------------
    $('#valuetable fieldset:first-child').click(function() { $('.spdBtn5').click() })
    // touch to toggle Analog / Digital
    // --------------------------------------------------------------------------
    $('.spdBtn0').click(function() {
      startAnalog = !$('#analog').is(':visible');
      if (startAnalog) {
        $('#digital').hide();
        $('#analog').show();
      } else {
        $('#digital').show();
        $('#analog').hide();
      }
      AIO_SBN((startAnalog ? SPDSBN_Speed_Analog : SPDSBN_Speed_Digital), "apps/_speedometer/templates/SpeedoMeter/images/digital.png");
    })
    $('#digital, #analog').click(function() {
      $('.spdBtn0').click();
    })
    // Hide Idle Values and enlarge the fonts of the other values
    // --------------------------------------------------------------------------
    $('.spdBtn2').click(function() {
      $('#valuetable').toggleClass('alt1');
      spdLrgTxt = $('#valuetable').hasClass('alt1');
      AIO_SBN((spdLrgTxt ? SPDSBN_Text_Large : SPDSBN_Text_Regular), "apps/_speedometer/templates/SpeedoMeter/images/digital.png");
    });
    // Pop Top Value
    // --------------------------------------------------------------------------
    $('.spdBtn5').click(function() {
      var pop = $('#valuetable fieldset:first-child legend').text();
      $('#valuetable').append($('#valuetable fieldset:first-child'));
      $('#valuetable fieldset').off('click');
      $('#valuetable fieldset:first-child').click(function() { $('.spdBtn5').click() })
      AIO_SBN(SPDSBN_Popped + " " + pop, "apps/_speedometer/templates/SpeedoMeter/images/digital.png");
      SaveSpeedoClassicLayout();
    });
    // Reset Values to 0  values are updated right away
    // --------------------------------------------------------------------------
    $('.spdBtn6').click(function() {
      AIO_SBN(SPDSBN_Digital_Bar_Speedometer, "apps/_speedometer/templates/SpeedoMeter/images/digital.png");
      aioMagicRoute("_speedometer", "SpeedBar");
    });
    $('.spdBtn7').click(toggleBasicSpeedo);
    $('.spdBtn9').click(cycleAnalogThemes);
  }
  // Toggles in both contexts
  if (barSpeedometerMod || speedMod) {
    // Toggle Fuel Efficiency or Temperature
    // --------------------------------------------------------------------------
    $('.spdBtn1').click(ToggleSpeedoType);
    $('.spdBtn4').click(toggleSpeedometerBackground);
    $('.spdBtn3').click(function() {
      (isMPH) ? toggleTempUnit(): toggleFuelEffUnit();
      //speedAnimation = !speedAnimation;
    });
    // Reset Speeds & Times
    // --------------------------------------------------------------------------
    $('.spdBtn8').click(function() {
      tripDistCurrent = 0;
      prevTripDist = 0;
      tripDistBkp = 0;
      tripDist = 0;
      speedCurrent = 0;
      speedSumTotal = 0;
      speedTop = 0;
      speedAvg = 0;
      GPSspeedCurrent = 0;
      GPSaltCurrent = 0;
      idleTimeValue = '0:00';
      engONidleTimeValue = '0:00';
      totalTripSeconds = 0;
      totalIdleSeconds = 0;
      totalEngineOnSeconds = 0;
      totalMoveCount = 0;
      engineSpeedCurrent = 0;
      engineSpeedTop = 0;
      AIO_SBN(SPDSBN_Reset_Times_Speeds, "apps/_speedometer/IcnSbnSpeedometer.png");
    });
    // Toggle StatusBar Speedo (No Default)
    // --------------------------------------------------------------------------
    $('.spdBtn10').click(function() {
      $('.StatusBarCtrlClock').click()
    })
    $('.spdBtn11').click(cycleLanguages);
  }
  // Toggle Helper Functions
  // --------------------------------------------------------------------------
  // Toggle km/L - L/100km
  function toggleFuelEffUnit() {
    fuelEffunit_kml = !fuelEffunit_kml;
    var effUnit = (fuelEffunit_kml ? 'km/L ∅' : 'L/100 km ∅');
    AIO_SBN(SPDSBN_Fuel_Eff_Unit + ": " + effUnit, "apps/_speedometer/IcnSbnSpeedometer.png");
    $('legend .fuelEffUnit').html(effUnit);
  }
  // --------------------------------------------------------------------------
  // Toggle Temperature (C & F)
  function toggleTempUnit() {
    tempIsF = !tempIsF;
    AIO_SBN(SPDSBN_Temperature_Unit + ": " + (tempIsF ? "°F" : "°C"), "apps/_speedometer/IcnSbnSpeedometer.png");
    if (tempIsF) {
      $('.tempUnit').html('F');
      //$('.intakeTempValue').html(C_2_F(intakeTemp)+'&deg;');
      //$('.coolantTempValue').html(C_2_F(coolantTemp)+'&deg;');
      //$('.outsideTempValue').html(C_2_F(outsideTemp)+'&deg;');
    } else {
      $('.tempUnit').html('C');
      //$('.intakeTempValue').html(F_2_C(intakeTemp)+'&deg;');
      //$('.coolantTempValue').html(F_2_C(coolantTemp)+'&deg;');
      //$('.outsideTempValue').html(F_2_C(outsideTemp)+'&deg;');
    }
  }
  /** Fahrenheit to Celsius ** T(°C) = (T(°F) - 32) / 1.8 **/
  function F_2_C(temp) {
    return parseFloat(((temp - 32) / 1.8).toFixed(2));
  }
  /** Celsius to Fahrenheit ** T(°F) = T(°C) × 1.8 + 32  **/
  function C_2_F(temp) {
    return parseFloat((temp * 1.8 + 32).toFixed(2));
  }
  // -------------------------------------------------------------------------
  // Toggle kmh / MPH
  function ToggleSpeedoType() {
    AIO_SBN(SPDSBN_Speed_Unit + ": " + (isMPH ? "KM/H" : "MPH"), "apps/_speedometer/IcnSbnSpeedometer.png");
    if (isMPH) {
      isMPH = false;
      speedSumTotal = Math.round(speedSumTotal * 1.609344);
      speedTop = Math.round(speedTop * 1.609344);
      speedAvg = Math.round(speedAvg * 1.609344);
      $('.speedTopValue').html('<span>(' + engineSpeedTop + ')</span>' + speedTop);
      $('.speedAvgValue').text(speedAvg);
      $('.speedUnit').text('km/h');
      $('#tripDistFieldSet').removeClass('mphbu');
      $('legend .distUnit').text('km');
      $('legend .altUnit').text('m');
      $('legend .fuelEffUnit').html(fuelEffunit_kml ? 'km/L &empty;' : 'L/100 km &empty;');
      if (!barSpeedometerMod) {
        $('#speedometerDial').removeClass('mph');
        $('#speedometerContainer .vehicleSpeed').css("background", "url('apps/_speedometer/templates/SpeedoMeter/images/currentSpeed.png') no-repeat scroll center center transparent");
        $('#textSpeed20').text('20');
        $('#textSpeed40').text('40');
        $('#textSpeed60').text('60');
        $('#textSpeed80').text('80');
        $('#textSpeed100').text('100');
        $('#textSpeed100').removeClass('mph');
        $('#textSpeed120').text('120');
        $('#textSpeed120').removeClass('mph');
        $('#textSpeed140').text('140');
        $('#textSpeed140').removeClass('mph');
        $('#textSpeed160').text('160');
        $('#textSpeed180').text('180');
        $('#textSpeed200').text('200');
        $('#textSpeed220').text('220');
        $('#textSpeed240').text('240');
        $('.topSpeedIndicator').css("transform", "rotate(" + (-120 + speedTop) + "deg)");
      }
    } else {
      isMPH = true;
      speedSumTotal = Math.round(speedSumTotal * 0.6213712);
      speedTop = Math.round(speedTop * 0.6213712);
      speedAvg = Math.round(speedAvg * 0.6213712);
      $('.speedAvgValue').text(speedAvg);
      $('.speedUnit').text('mph');
      $('#speedometerDial').addClass('mph');
      $('#tripDistFieldSet').addClass('mphbu');
      $('legend .distUnit').text('mi');
      $('legend .altUnit').text('ft');
      $('legend .fuelEffUnit').html('MPG &empty;');
      if (barSpeedometerMod) {
        $('.speedTopValue').html(speedTop);
        $('.engineSpeedTopValue').html(engineSpeedTop);
      } else {
        $('.speedTopValue').html('<span>(' + engineSpeedTop + ')</span>' + speedTop);
        $('#speedometerContainer .vehicleSpeed').css("background", "url('apps/_speedometer/templates/SpeedoMeter/images/currentSpeed_mpg.png') no-repeat scroll center center transparent");
        $('#textSpeed20').text('10');
        $('#textSpeed40').text('20');
        $('#textSpeed60').text('30');
        $('#textSpeed80').text('40');
        $('#textSpeed100').text('50');
        $('#textSpeed100').addClass('mph');
        $('#textSpeed120').text('60');
        $('#textSpeed120').addClass('mph');
        $('#textSpeed140').text('70');
        $('#textSpeed140').addClass('mph');
        $('#textSpeed160').text('80');
        $('#textSpeed180').text('90');
        $('#textSpeed200').text('100');
        $('#textSpeed220').text('110');
        $('#textSpeed240').text('120');
        $('.topSpeedIndicator').css("transform", "rotate(" + (-120 + speedTop * 2) + "deg)");
      }
    }
  }
  // --------------------------------------------------------------------------
  // Toggle Background
  function toggleSpeedometerBackground() {
    if (original_background_image) {
      $('#speedometerContainer, #speedBarContainer').css("background-image", "");
      AIO_SBN(SPDSBN_Hide_Speedometer_Background, "apps/_speedometer/IcnSbnSpeedometer.png");
      // } else if ($('#speedometerContainer, #speedBarContainer').css('background-image').indexOf('speedometer_background') !== -1) { // add .png to above conditional
      // $('#speedometerContainer, #speedBarContainer').css("background-image","url(apps/_speedometer/templates/SpeedoMeter/images/speedometer_background.png)");
      // AIO_SBN(SPDSBN_Show_Speedometer_Background, "apps/_speedometer/IcnSbnSpeedometer.png"); SPDSBN_Show_Speedometer_Background
    } else {
      $('#speedometerContainer, #speedBarContainer').css("background-image", "url(apps/_speedometer/templates/SpeedoMeter/images/speedometer_background.jpg)");
      AIO_SBN(SPDSBN_Show_Speedometer_Background, "apps/_speedometer/IcnSbnSpeedometer.png");
    }
    original_background_image = !original_background_image;
  }

  function toggleBasicSpeedo() {
    AIO_SBN((speedMod ? SPDSBN_Basic : SPDSBN_Modded), (speedMod ? "apps/_speedometer/templates/SpeedoMeter/images/speed.png" : "apps/_speedometer/templates/SpeedoMeter/images/digital.png"));
    speedMod = !speedMod;
    updateSpeedoApp();
  }

  function cycleColorThemes() {
    var barThemes = [0, 1, 2, 3, 4, 5];
    (speedometerTheme >= barThemes.length - 1) ? speedometerTheme = 0: speedometerTheme++;
    $('#speedBarContainer').removeClass("theme" + barThemes.join(" theme"));
    $('#speedBarContainer').addClass("theme" + speedometerTheme);
    AIO_SBN(SPDSBN_Theme + " #" + speedometerTheme, "apps/_speedometer/IcnSbnSpeedometer.png");
  }

  function cycleAnalogThemes() {
    var analColors = ["Red", "Green", "Blue", "Orange", "Silver", "Yellow", "Purple", "Pink"];
    var analIndex = analColors.indexOf(analogColor);
    analogColor = (analIndex >= analColors.length - 1 ? analColors[0] : analColors[analIndex + 1]);
    $('#speedometerContainer').removeClass(analColors.join(" "));
    $('#speedometerContainer').addClass(analogColor);
    AIO_SBN(SPDSBN_Speedometer_Color + ": " + analogColor, "apps/_speedometer/IcnSbnSpeedometer.png");
  }

  function cycleLanguages() {
    var langs = ["EN", "DE", "ES", "PL", "SK", "TR", "FR", "IT", "NL"];
    var langIndex = langs.indexOf(language);
    language = (langIndex >= langIndex.length - 1 ? langs[0] : langs[langIndex + 1]);
    AIO_SBN(SPDSBN_Language + ": " + language, "apps/_speedometer/IcnSbnSpeedometer.png");
    aioMagicRoute('_speedometer', 'Start')
  }
  // *********************************************************************************************************************
  // Languages
  // *********************************************************************************************************************
  // Español
  if (language === 'ES') {
    $('#gpsSpeedFieldSet legend').html('Vel. GPS');
    $('#tripDistFieldSet legend').html('Dist. de viaje <span class="spunit">(<span class="distUnit">km</span>)</span>');
    $('#speedTopFieldSet legend').html('Vel. Max');
    $('#speedAvgFieldSet legend').html('Vel. &empty;');
    $('#gpsAltitudeFieldSet legend').html('Altitud <span class="spunit">(<span class="altUnit">m</span>)</span>');
    // $('#gpsAltitudeMinFieldSet legend').html('Altitud <span>min</span>');
    // $('#gpsAltitudeMaxFieldSet legend').html('Altitud <span>max</span>');
    $('#gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
    $('#gpsHeadingFieldSet legend').html('Direcci&oacute;n');
    $('#gpsLatitudeFieldSet legend').html('Lat.');
    $('#gpsLongitudeFieldSet legend').html('Lon.');
    $('#tripTimeFieldSet legend').html('T. Total');
    $('#idleTimeFieldSet legend').html('T. Descanso');
    $('#engIdleTimeFieldSet legend').html('Engine Idle');
    $('#fuelGaugeFieldSet legend').html('Fuel Gauge');
    $('#gearPositionFieldSet legend').html('Gear Position');
    $('#outsideTempFieldSet legend').html('Outside  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#intakeTempFieldSet legend').html('Intake  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#coolantTempFieldSet legend').html('Coolant  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#Drv1AvlFuelEFieldSet legend').html('Drive <span class="fuelEffUnit"></span>');
    $('#TotAvgFuelFieldSet legend').html('Total <span class="fuelEffUnit"></span>');
    $('#AvgFuelFieldSet legend').html('Avg. <span class="fuelEffUnit"></span>');
    $('#batSOCFieldSet legend').html('Battery SOC'); //Battery State of Charge
    $('#engLoadFieldSet legend').html('Engine Load');
  }
  // Polskie
  else if (language === 'PL') {
    $('#gpsSpeedFieldSet legend').html('Prędkość GPS');
    $('#tripDistFieldSet legend').html('Dystans <span class="spunit">(<span class="distUnit">km</span>)</span>');
    $('#speedTopFieldSet legend').html('Prędkość maks.');
    $('#speedAvgFieldSet legend').html('Prędkość śr.');
    $('#gpsAltitudeFieldSet legend').html('Wysokość n.p.m. <span class="spunit">(<span class="altUnit">m</span>)</span>');
    $('#gpsAltitudeMinMaxFieldSet legend').html('<span>min./maks.</span>');
    $('#gpsLatitudeFieldSet legend').html('Szer. <span>geogr.</span>');
    $('#gpsLongitudeFieldSet legend').html('Dł. <span>geogr.</span>');
    $('#tripTimeFieldSet legend').html('Czas całk.');
    $('#idleTimeFieldSet legend').html('Czas bezcz.');
    $('#engIdleTimeFieldSet legend').html('Engine Idle');
    $('#fuelGaugeFieldSet legend').html('Fuel Gauge');
    $('#gearPositionFieldSet legend').html('Gear Position');
    $('#outsideTempFieldSet legend').html('Outside  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#intakeTempFieldSet legend').html('Intake  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#coolantTempFieldSet legend').html('Coolant  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#Drv1AvlFuelEFieldSet legend').html('Drive <span class="fuelEffUnit"></span>');
    $('#TotAvgFuelFieldSet legend').html('Total <span class="fuelEffUnit"></span>');
    $('#AvgFuelFieldSet legend').html('Avg. <span class="fuelEffUnit"></span>');
    $('#batSOCFieldSet legend').html('Battery SOC'); //Battery State of Charge
    $('#engLoadFieldSet legend').html('Engine Load');
  }
  // Slovenský
  else if (language === 'SK') {
    $('#tripDistFieldSet legend').html('Vzdialenosť <span class="spunit">(<span class="distUnit">km</span>)</span>');
    $('#speedTopFieldSet legend').html('Najvyššia rých.');
    $('#speedAvgFieldSet legend').html('Priemerná rýchlosť');
    $('#gpsAltitudeFieldSet legend').html('Nadmorská výška <span class="spunit">(<span class="altUnit">m</span>)</span>');
    $('#gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
    $('#gpsLatitudeFieldSet legend').html('Zem. šírka');
    $('#gpsLongitudeFieldSet legend').html('Zem. dĺžka');
    $('#tripTimeFieldSet legend').html('Celkový čas');
    $('#idleTimeFieldSet legend').html('Doba <span>nečinn.</span>');
    $('#engineSpeedFieldSet legend').html('Engine Speed');
    $('#engIdleTimeFieldSet legend').html('Engine Idle');
    $('#fuelGaugeFieldSet legend').html('Fuel Gauge');
    $('#gearPositionFieldSet legend').html('Gear Position');
    $('#outsideTempFieldSet legend').html('Outside  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#intakeTempFieldSet legend').html('Intake  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#coolantTempFieldSet legend').html('Coolant  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#Drv1AvlFuelEFieldSet legend').html('Drive <span class="fuelEffUnit"></span>');
    $('#TotAvgFuelFieldSet legend').html('Total <span class="fuelEffUnit"></span>');
    $('#AvgFuelFieldSet legend').html('Avg. <span class="fuelEffUnit"></span>');
    $('#batSOCFieldSet legend').html('Battery SOC'); //Battery State of Charge
    $('#engLoadFieldSet legend').html('Engine Load');
  }
  // Deutsch
  else if (language === 'DE') {
    $('#gpsSpeedFieldSet legend').html('Geschw. GPS');
    $('#tripDistFieldSet legend').html('Strecke <span class="spunit">(<span class="distUnit">km</span>)</span>');
    $('#speedTopFieldSet legend').html('Geschw. max');
    $('#speedAvgFieldSet legend').html('Geschw. &empty;');
    $('#gpsAltitudeFieldSet legend').html('H&ouml;he &uuml;. NN <span class="spunit">(<span class="altUnit">m</span>)</span>');
    $('#gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
    $('#gpsLatitudeFieldSet legend').html('Breite');
    $('#gpsLongitudeFieldSet legend').html('L&auml;nge');
    $('#tripTimeFieldSet legend').html('Gesamtzeit');
    $('#idleTimeFieldSet legend').html('Standzeit');
    $('#engIdleTimeFieldSet legend').html('Leerlaufzeit');
    $('.NorthEast').html('NO');
    $('.East').html('O');
    $('.SouthEast').html('SO');
    $('#rpmDial .unit').text('U/min');
    $('#gpsSpeedFieldSet legend').html('GPS Geschw');
    $('#gpsHeadingFieldSet legend').html('Richtung');
    $('#fuelGaugeFieldSet legend').html('Tankfüllung');
    $('#gearPositionFieldSet legend').html('Gangposition');
    $('#engineSpeedFieldSet legend').html('Motordrehzahl');
    $('#outsideTempFieldSet legend').html('Aussen <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#intakeTempFieldSet legend').html('Einlass <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#coolantTempFieldSet legend').html('Kühlmittel <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#Drv1AvlFuelEFieldSet legend').html('Drive <span class="fuelEffUnit"></span>');
    $('#TotAvgFuelFieldSet legend').html('Total <span class="fuelEffUnit"></span>');
    $('#AvgFuelFieldSet legend').html('Avg. <span class="fuelEffUnit"></span>');
    $('#batSOCFieldSet legend').html('Battery SOC'); //Battery State of Charge
    $('#engLoadFieldSet legend').html('Engine Load');
  }
  // Türk
  else if (language === 'TR') {
    $('#tripDistFieldSet legend').html('Gidilen Yol <span class="spunit">(<span class="distUnit">km</span>)</span>');
    $('#speedTopFieldSet legend').html('Maksimum Hız');
    $('#speedAvgFieldSet legend').html('Ortalama Hız');
    $('#gpsAltitudeFieldSet legend').html('Yükseklik anlık <span class="spunit">(<span class="altUnit">m</span>)</span>');
    $('#gpsAltitudeMinMaxFieldSet legend').html('<span>en az/en çok</span>');
    $('#gpsLatitudeFieldSet legend').html('Enlem');
    $('#gpsLongitudeFieldSet legend').html('Boylam');
    $('#tripTimeFieldSet legend').html('Toplam Süre');
    $('#idleTimeFieldSet legend').html('Durma Süresi');
    $('#engIdleTimeFieldSet legend').html('Engine Idle');
    $('#fuelGaugeFieldSet legend').html('Fuel Gauge');
    $('#engineSpeedFieldSet legend').html('Engine Speed');
    $('#gpsHeadingFieldSet legend').html('Heading');
    $('#gearPositionFieldSet legend').html('Gear Position');
    $('#outsideTempFieldSet legend').html('Outside  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#intakeTempFieldSet legend').html('Intake  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#coolantTempFieldSet legend').html('Coolant  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('.North').html('K');
    $('.NorthEast').html('KD');
    $('#Drv1AvlFuelEFieldSet legend').html('Drive <span class="fuelEffUnit"></span>');
    $('#TotAvgFuelFieldSet legend').html('Total <span class="fuelEffUnit"></span>');
    $('#AvgFuelFieldSet legend').html('Avg. <span class="fuelEffUnit"></span>');
    $('.East').html('D');
    $('.SouthEast').html('GD');
    $('.South').html('G');
    $('.SouthWest').html('GB');
    $('.West').html('B');
    $('.NorthWest').html('KB');
    $('#batSOCFieldSet legend').html('Battery SOC'); //Battery State of Charge
    $('#engLoadFieldSet legend').html('Engine Load');
    $('.speedUnit').text('km/s');
  }
  // Français
  else if (language === 'FR') {
    $('#gpsSpeedFieldSet legend').html('Vit. GPS');
    $('#tripDistFieldSet legend').html('Trajet Dist. <span class="spunit">(<span class="distUnit">km</span>)</span>');
    $('#speedTopFieldSet legend').html('V. max');
    $('#speedAvgFieldSet legend').html('V. Moyenne');
    $('#gpsAltitudeFieldSet legend').html('Altitude <span class="spunit">(<span class="altUnit">m</span>)</span>');
    $('#gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
    $('#gpsLatitudeFieldSet legend').html('Lat.');
    $('#gpsLongitudeFieldSet legend').html('Lon.');
    $('#tripTimeFieldSet legend').html('T. total');
    $('#idleTimeFieldSet legend').html('T. d\'arr&ecirc;t');
    $('#engIdleTimeFieldSet legend').html('T. au ralenti');
    $('#fuelGaugeFieldSet legend').html('Fuel Gauge');
    $('#gearPositionFieldSet legend').html('Gear Position');
    $('#engineSpeedFieldSet legend').html('Engine Speed');
    $('#gpsHeadingFieldSet legend').html('Heading');
    $('#outsideTempFieldSet legend').html('Outside  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#intakeTempFieldSet legend').html('Intake  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#coolantTempFieldSet legend').html('Coolant  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('.SouthWest').html('SO');
    $('.West').html('O');
    $('.NorthWest').html('NO');
    $('#batSOCFieldSet legend').html('Battery SOC'); //Battery State of Charge
    $('#engLoadFieldSet legend').html('Engine Load');
    $('legend .fuelEffUnit').html('L/100 km <span>Moy.</span>');
    $('#Drv1AvlFuelEFieldSet legend').html('Drive <span class="fuelEffUnit"></span>');
    $('#TotAvgFuelFieldSet legend').html('Total <span class="fuelEffUnit"></span>');
    $('#AvgFuelFieldSet legend').html('Avg. <span class="fuelEffUnit"></span>');
  }
  // Italiano
  else if (language === 'IT') {
    $('#gpsSpeedFieldSet legend').html('Vel. GPS');
    $('#tripDistFieldSet legend').html('Dist. tragitto <span class="spunit">(<span class="distUnit">km</span>)</span>');
    $('#speedTopFieldSet legend').html('Vel. max');
    $('#speedAvgFieldSet legend').html('Vel. media');
    $('#gpsAltitudeFieldSet legend').html('Altitudine <span class="spunit">(<span class="altUnit">m</span>)</span>');
    // $('#gpsAltitudeMinFieldSet legend').html('Altitudine <span>min</span>');
    // $('#gpsAltitudeMaxFieldSet legend').html('Altitudine <span>max</span>');
    $('#gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
    $('#gpsHeadingFieldSet legend').html('Direzione');
    $('#gpsLatitudeFieldSet legend').html('Lat.');
    $('#gpsLongitudeFieldSet legend').html('Lon.');
    $('#tripTimeFieldSet legend').html('Tempo tot.');
    $('#idleTimeFieldSet legend').html('T. d\'arresto');
    $('#engIdleTimeFieldSet legend').html('T. di inattivit&agrave;');
    $('.SouthWest').html('SO');
    $('.West').html('O');
    $('.NorthWest').html('NO');
    $('legend .fuelEffUnit').html('L/100 km <span>media</span>');
    $('#engineSpeedFieldSet legend').html('Engine Speed');
    $('#gpsHeadingFieldSet legend').html('Heading');
    $('#fuelGaugeFieldSet legend').html('Fuel Gauge');
    $('#gearPositionFieldSet legend').html('Gear Position');
    $('#outsideTempFieldSet legend').html('Outside  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#intakeTempFieldSet legend').html('Intake  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#coolantTempFieldSet legend').html('Coolant  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#oilTempFieldSet legend').html('Oil <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#batSOCFieldSet legend').html('Battery SOC'); //Battery State of Charge
    $('#engLoadFieldSet legend').html('Engine Load');
    $('#Drv1AvlFuelEFieldSet legend').html('Drive <span class="fuelEffUnit"></span>');
    $('#TotAvgFuelFieldSet legend').html('Total <span class="fuelEffUnit"></span>');
    $('#AvgFuelFieldSet legend').html('Avg. <span class="fuelEffUnit"></span>');
  }
  // Nederlands
  else if (language === 'NL') {
    $('#gpsSpeedFieldSet legend').html('GPS Snelheid');
    $('#tripDistFieldSet legend').html('Dagteller <span class="spunit">(<span class="distUnit">km</span>)</span>');
    $('#speedTopFieldSet legend').html('Max. Snelheid');
    $('#speedAvgFieldSet legend').html('Snelheid &empty;');
    $('#gpsAltitudeFieldSet legend').html('Hoogte <span class="spunit">(<span class="altUnit">m</span>)</span>');
    $('#gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
    $('#gpsLatitudeFieldSet legend').html('Breedte');
    $('#gpsLongitudeFieldSet legend').html('Lengte');
    $('#tripTimeFieldSet legend').html('Totale tijd');
    $('#idleTimeFieldSet legend').html('Gestopt');
    $('#engIdleTimeFieldSet legend').html('Motor Gestopt');
    $('#engineSpeedTopFieldSet legend').html('Max. Toeren');
    $('.NorthEast').html('NO');
    $('.East').html('O');
    $('.SouthEast').html('ZO');
    $('.South').html('Z');
    $('.SouthWest').html('ZW');
    $('#rpmDial .unit').text('tpm');
    $('#gpsSpeedFieldSet legend').html('GPS Snelheid');
    $('#gpsHeadingFieldSet legend').html('Richting');
    $('#fuelGaugeFieldSet legend').html('Brandstof');
    $('#gearPositionFieldSet legend').html('Versnelling');
    $('#gearLeverPositionFieldSet legend').html('Hendel')
    $('#engineSpeedFieldSet legend').html('Motortoerental');
    $('#outsideTempFieldSet legend').html('Buiten <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#intakeTempFieldSet legend').html('Inlaat <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#coolantTempFieldSet legend').html('Koelvloeistof <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#Drv1AvlFuelEFieldSet legend').html('<span class="fuelEffUnit"></span>');
    $('#TotAvgFuelFieldSet legend').html('Totaal <span class="fuelEffUnit"></span>');
    $('#AvgFuelFieldSet legend').html('Gem. <span class="fuelEffUnit"></span>');
    $('#batSOCFieldSet legend').html('Accu Lading'); //Battery State of Charge
    $('#engLoadFieldSet legend').html('Motor Belasting');
    $('#speedCurrentFieldSet legend').html('Voertuig Snelh.');
  }
  // *******************************************************************************************************
  // Starting Values
  // *******************************************************************************************************
  // unit specific changes
  if (isMPH) {
    $('.speedUnit').text('mph');
    $('#speedometerDial').addClass('mph');
    $('legend .distUnit').text('mi');
    $('legend .altUnit').text('ft');
    $('legend .fuelEffUnit').html('MPG &empty;');
    if (!barSpeedometerMod) {
      $('#textSpeed20').text('10');
      $('#textSpeed40').text('20');
      $('#textSpeed60').text('30');
      $('#textSpeed80').text('40');
      $('#textSpeed100').text('50');
      $('#textSpeed100').addClass('mph');
      $('#textSpeed120').text('60');
      $('#textSpeed120').addClass('mph');
      $('#textSpeed140').text('70');
      $('#textSpeed140').addClass('mph');
      $('#textSpeed160').text('80');
      $('#textSpeed180').text('90');
      $('#textSpeed200').text('100');
      $('#textSpeed220').text('110');
      $('#textSpeed240').text('120');
      $('.topSpeedIndicator').css("transform", "rotate(" + (-120 + speedTop * 2) + "deg)");
    }
  } else {
    $('.speedUnit').text('km/h');
    $('legend .fuelEffUnit').html(fuelEffunit_kml ? 'km/L &empty;' : 'L/100 km &empty;');
    if (!barSpeedometerMod) {
      $('.topSpeedIndicator').css("transform", "rotate(" + (-120 + speedTop) + "deg)");
    }
  }
  // custom background
  if (!original_background_image && black_background_opacity > 0.0 && black_background_opacity <= 1.0) {
    $('#speedometerContainer, #speedBarContainer').css("background-color", "rgba(0,0,0," + black_background_opacity + ")");
  } else if (original_background_image) {
    $('#speedometerContainer, #speedBarContainer').css("background-image", "url(apps/_speedometer/templates/SpeedoMeter/images/speedometer_background.jpg)");
  }
  if (fuelGaugeFactor === undefined) {
    fuelGaugeFactor = 100;
    fuelGaugeValueSuffix = "%";
  }
  // restore values after app restart
  if (fuelGaugeValueSuffix === "%") {
    $('#fuelGaugeFieldSet legend .spunit').remove();
  } else {
    $('#fuelGaugeFieldSet legend .fuelUnit').text(fuelGaugeValueSuffix);
  }
  $('.fuelGaugeValue').html(lastFuelGaugeValue + (fuelGaugeValueSuffix === "%" ? "%" : ""));
  $('.tempUnit').html(tempIsF ? 'F' : 'C');
  $('.tripDistance').html(tripDist);
  $('.speedAvgValue').html(speedAvg);
  $('.gpsAltitudeValue').html(GPSaltCurrent);
  $('.coolantTempValue').html(coolantTemp);
  $('.intakeTempValue').html(intakeTemp);
  $('.outsideTempValue').html(outsideTemp);
  $('.gearPositionValue').html(lastGearPositionValue);
  $('.gearLeverPositionValue').html(lastGearLeverPositionValue);
  $('.gearPositionValue').html(lastGearPositionValue);
  if (altGPSmin !== 9999) {
    $('.gpsAltitudeMinMax').html(altGPSmin + ' / ' + altGPSmax);
  }
  if (barSpeedometerMod) {
    if ($('.activeDataBar').length === 0) {
      $('.vehDataBar1').addClass('activeDataBar');
    }
    $('.speedTopValue').html(speedTop);
    $('.engineSpeedTopValue').html(engineSpeedTop);
    $('.TotFuelEfficiency').html(TotFuelEfficiency);
    $('.Drv1AvlFuelEValue').html(FuelEfficiency);
    $('.avgFuelValue').html(AvgFuelEfficiency);
    $('.idleTimeValue').html(idleTimeValue);
    $('.engineIdleTimeValue').html(engONidleTimeValue);
    SpeedoSwapFieldSets();
  } else {
    $('.fuel-bar').css('width', lastFuelGaugePercent + "%");
    $('.idleTimeValue').html('<span>(' + engONidleTimeValue + ')</span>' + idleTimeValue);
    $('.speedTopValue').html('<span>(' + engineSpeedTop + ')</span>' + speedTop);
    $('.Drv1AvlFuelEValue').html('<span>(' + TotFuelEfficiency + ')</span>' + FuelEfficiency);
    $('.topRPMIndicator').css("transform", "rotate(" + (-145 - engineSpeedTop * 0.01) + "deg)");
    // fix layout if average symbol is used
    $('fieldset legend:contains("∅")').css("margin-top", "2px");
    if (spdLrgTxt) {
      $('#valuetable').addClass('alt1');
    }
    if (startAnalog || !speedMod) {
      $('#analog').show();
      $('#digital').hide();
    } else {
      $('#digital').show();
      $('#analog').hide();
    }
    if (!speedMod) {
      $('#valuetable').removeClass('alt1');
      $('#speedometerContainer *').off('click');
      $('.spdBtn7').click(toggleBasicSpeedo);
    }
  }
}

var SPDSBN_Show_Speedometer_Background = "Show Speedometer Background";
var SPDSBN_Hide_Speedometer_Background = "Hide Speedometer Background";
var SPDSBN_Speed_Unit = "Speed Unit";
var SPDSBN_Temperature_Unit = "Temperature Unit";
var SPDSBN_Fuel_Eff_Unit = "Fuel Eff Unit";
var SPDSBN_Reset_Times_Speeds = "Reset Times & Speeds";
var SPDSBN_Popped = "Popped";
var SPDSBN_Digital_Bar_Speedometer = "Digital Bar Speedometer";
var SPDSBN_Classic_Speedometer = "Classic Speedometer";
var SPDSBN_Text_Large = "Text Size: Large";
var SPDSBN_Text_Regular = "Text Size: Small";
var SPDSBN_Speed_Analog = "Speed: Analog";
var SPDSBN_Speed_Digital = "Speed: Digital";
var SPDSBN_Speed_Bar = "Speed Bar";
var SPDSBN_Hide_Speed_Bar = "Hide Speed Bar";
var SPDSBN_Show_Speed_Bar = "Show Speed Bar";
var SPDSBN_Speedometer_Color = "Speedometer Color";
var SPDSBN_Theme = "Theme";
var SPDSBN_Basic = "Basic Speedometer"
var SPDSBN_Modded = "Modded Speedometer"
var SPDSBN_Language = "Language";
