function updateSpeedoApp(){
  $('#vehdataMainDiv fieldset[class*="vehDataBar"].pos0').remove();
	if(enableSmallSbSpeedo){
		$('#SbSpeedo').fadeIn();
	}
  if(barSpeedometerMod){
    $('.vehDataMain.pos0').click(function(){
      (currDataBar > 2) ? currDataBar = 1 : currDataBar++;
      $('[class*="vehDataBar"]').removeClass('activeDataBar');
      $('.vehDataBar' + currDataBar).addClass('activeDataBar');
    })
  } else {
    // touch to toggle Analog / Digital
    // --------------------------------------------------------------------------
    $('#analog').click(function(){
      $('#analog').hide();
      $('#digital').show();
    });

    $('#digital').click(function(){
      $('#digital').hide();
      $('#analog').show();
    });
    // Hide Idle Values and enlarge the fonts of the other values
    // --------------------------------------------------------------------------
    $('#speedTopFieldSet').click(function(){
      $('#valuetable').toggleClass('alt1');
    });
    // Show alternate values
    // --------------------------------------------------------------------------
    $('#speedAvgFieldSet').click(function(){
      $('#valuetable').toggleClass('alt0');
    });
    // Reset Values to 0  values are updated right away
    // --------------------------------------------------------------------------
  }
  $('#tripTimeFieldSet').click(function(){
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
  });
  // Toggle Fuel Efficiency or Temperature
  // --------------------------------------------------------------------------
  var fuelToggler = (barSpeedometerMod) ? $('.vehDataMain.pos3') : $('#Drv1AvlFuelEFieldSet');
    fuelToggler.click(function(){
    (isMPH) ? toggleTempUnit() : toggleFuelEffUnit();
  });
  // Toggle km/L - L/100km
  // --------------------------------------------------------------------------
  function  toggleFuelEffUnit() {
    fuelEffunit_kml = !fuelEffunit_kml;
    $('legend .fuelEffUnit').html((fuelEffunit_kml) ? 'km/L &empty;' : 'L/100 km &empty;');
  }
  // Toggle Temperature (C & F)
  // --------------------------------------------------------------------------
  function toggleTempUnit(){
    tempIsF = !tempIsF;
    if(tempIsF) {
      $('.tempUnit').html('F');
      $('.intakeTempValue').html(C_2_F(intakeTemp)+'&deg;');
      $('.coolantTempValue').html(C_2_F(coolantTemp)+'&deg;');
      $('.outsideTempValue').html(C_2_F(outsideTemp)+'&deg;');
    } else {
      $('.tempUnit').html('C');
      $('.intakeTempValue').html(F_2_C(intakeTemp)+'&deg;');
      $('.coolantTempValue').html(F_2_C(coolantTemp)+'&deg;');
      $('.outsideTempValue').html(F_2_C(outsideTemp)+'&deg;');
    }
  }
  /** Fahrenheit to Celsius ** T(°C) = (T(°F) - 32) / 1.8 **/
  function F_2_C(temp) {
    return parseFloat(((temp-32)/1.8).toFixed(2));
  }
  /** Celsius to Fahrenheit ** T(°F) = T(°C) × 1.8 + 32  **/
  function C_2_F(temp) {
    return parseFloat((temp*1.8+32).toFixed(2));
  }
	// Toggle kmh / MPH
	// --------------------------------------------------------------------------
	var typeToggler = (barSpeedometerMod) ? $('.vehDataMain.pos1') : $('#tripDistFieldSet');
  typeToggler.click(ToggleSpeedoType);

  function ToggleSpeedoType() {
		if(isMPH){
			isMPH = false;
			speedSumTotal = Math.round(speedSumTotal * 1.609344);
			speedTop = Math.round(speedTop * 1.609344);
			speedAvg = Math.round(speedAvg * 1.609344);
      $('.speedTopValue').html('<span>('+engineSpeedTop+')</span>'+speedTop);
			$('.speedAvgValue').text(speedAvg);
			$('.speedUnit').text('km/h');
			$('#tripDistFieldSet').removeClass('mphbu');
			$('legend .distUnit').text('km');
			$('legend .altUnit').text('m');
			if(fuelEffunit_kml){
				$('legend .fuelEffUnit').html('km/L &empty;');
			} else {
				$('legend .fuelEffUnit').html('L/100 km &empty;');
			}
      if(!barSpeedometerMod) {
        $('#speedometerDial').removeClass('mph');
        $('#speedometerContainer .vehicleSpeed').css("background","url('apps/_speedometer/templates/SpeedoMeter/images/currentSpeed.png') no-repeat scroll center center transparent");
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
        $('.topSpeedIndicator').css("transform","rotate("+(-120+speedTop)+"deg)");
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
      if(barSpeedometerMod) {
        $('.speedTopValue').html(speedTop);
        $('.engineSpeedTopValue').html(engineSpeedTop);
      } else {
        $('.speedTopValue').html('<span>('+engineSpeedTop+')</span>'+speedTop);
        $('#speedometerContainer .vehicleSpeed').css("background","url('apps/_speedometer/templates/SpeedoMeter/images/currentSpeed_mpg.png') no-repeat scroll center center transparent");
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
        $('.topSpeedIndicator').css("transform","rotate("+(-120+speedTop*2)+"deg)");
      }
		}
	}
  // Toggle Background
  // --------------------------------------------------------------------------
  var bgToggler = (barSpeedometerMod) ? $('.vehDataMain.pos4') : $('#UnitValue');
  bgToggler.click(toggleSpeedometerBackground);

  function toggleSpeedometerBackground() {
    if ($('#speedometerContainer').css('background-image').indexOf('speedometer_background') !== -1) {
      $('#speedometerContainer').css("background-image","");
    } else {
      $('#speedometerContainer').css("background-image","url(apps/_speedometer/templates/SpeedoMeter/images/speedometer_background.jpg)");
    }
  }
  // *********************************************************************************************************************
  // *********************************************************************************************************************
	// language specific labels
  // *********************************************************************************************************************
  // *********************************************************************************************************************
	// Español
	if(language === 'ES'){
		// $('#gpsSpeedFieldSet legend').html('Vel. GPS');
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
	}

	// Polskie
  else if(language === 'PL'){
    // $('#gpsSpeedFieldSet legend').html('PrÄ™dkoÅ›Ä‡ GPS');
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
	}

	// Slovenský
	else if(language === 'SK'){
		$('#tripDistFieldSet legend').html('Vzdialenosť <span class="spunit">(<span class="distUnit">km</span>)</span>');
		$('#speedTopFieldSet legend').html('Najvyššia rých.');
		$('#speedAvgFieldSet legend').html('Priemerná rýchlosť');
		$('#gpsAltitudeFieldSet legend').html('Nadmorská výška <span class="spunit">(<span class="altUnit">m</span>)</span>');
		$('#gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
		$('#gpsLatitudeFieldSet legend').html('Zem. šírka');
		$('#gpsLongitudeFieldSet legend').html('Zem. dĺžka');
		$('#tripTimeFieldSet legend').html('Celkový čas');
		$('#idleTimeFieldSet legend').html('Doba <span>nečinn.</span>');
		$('#engIdleTimeFieldSet legend').html('Engine Idle');
    $('#fuelGaugeFieldSet legend').html('Fuel Gauge');
    $('#gearPositionFieldSet legend').html('Gear Position');
    $('#outsideTempFieldSet legend').html('Outside  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#intakeTempFieldSet legend').html('Intake  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#coolantTempFieldSet legend').html('Coolant  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
	}

	// Deutsch
  else if(language === 'DE'){
		// $('#gpsSpeedFieldSet legend').html('Geschw. GPS');
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
    $('#fuelGaugeFieldSet legend').html('Fuel Gauge');
    $('#gearPositionFieldSet legend').html('Gear Position');
    $('#outsideTempFieldSet legend').html('Outside  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#intakeTempFieldSet legend').html('Intake  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#coolantTempFieldSet legend').html('Coolant  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
	}

	// Türk
	else if(language === 'TR'){
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
    $('#gearPositionFieldSet legend').html('Gear Position');
    $('#outsideTempFieldSet legend').html('Outside  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#intakeTempFieldSet legend').html('Intake  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#coolantTempFieldSet legend').html('Coolant  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
		$('.North').html('K');
		$('.NorthEast').html('KD');
		$('.East').html('D');
		$('.SouthEast').html('GD');
		$('.South').html('G');
		$('.SouthWest').html('GB');
		$('.West').html('B');
		$('.NorthWest').html('KB');
		$('.speedUnit').text('km/s');
	}

	// Français
	else if(language === 'FR'){
		// $('#gpsSpeedFieldSet legend').html('Vit. GPS');
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
    $('#outsideTempFieldSet legend').html('Outside  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#intakeTempFieldSet legend').html('Intake  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#coolantTempFieldSet legend').html('Coolant  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
		$('.SouthWest').html('SO');
		$('.West').html('O');
		$('.NorthWest').html('NO');
		$('legend .fuelEffUnit').html('L/100 km <span>Moy.</span>');
	}
  // Italiano
  else if(language === 'IT'){
    // $('#gpsSpeedFieldSet legend').html('Vel. GPS');
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
    $('#fuelGaugeFieldSet legend').html('Fuel Gauge');
    $('#gearPositionFieldSet legend').html('Gear Position');
    $('#outsideTempFieldSet legend').html('Outside  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#intakeTempFieldSet legend').html('Intake  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
    $('#coolantTempFieldSet legend').html('Coolant  <span class="spunit">(&deg;<span class="tempUnit"></span>)</span>');
  }

	// unit specific changes

	if(isMPH){
    $('.speedUnit').text('mph');
    $('#speedometerDial').addClass('mph');
    $('legend .distUnit').text('mi');
    $('legend .altUnit').text('ft');
    $('legend .fuelEffUnit').html('MPG &empty;');
    if(!barSpeedometerMod) {
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
      $('.topSpeedIndicator').css("transform","rotate("+(-120+speedTop*2)+"deg)");
    }
  } else {
		$('.speedUnit').text('km/h');
    $('legend .fuelEffUnit').html('L/100 km &empty;');
    if(!barSpeedometerMod) {
      $('.topSpeedIndicator').css("transform","rotate("+(-120+speedTop)+"deg)");
    }
	}

	if(fuelEffunit_kml) {
		$('legend .fuelEffUnit').html('km/L &empty;');
	}

	// custom background

	if(!original_background_image && black_background_opacity > 0.0 && black_background_opacity <= 1.0) {
		$('#speedometerContainer').css("background-color","rgba(0,0,0,"+black_background_opacity+")");
	}
	if(original_background_image) {
		$('#speedometerContainer').css("background-image","url(apps/_speedometer/templates/SpeedoMeter/images/speedometer_background.jpg)");
	}


	// restore values after app restart
  (tempIsF) ? $('.tempUnit').html('F') : $('.tempUnit').html('C');
	$('.tripDistance').html(tripDist);
	$('.speedAvgValue').html(speedAvg);
	$('.gpsAltitudeValue').html(GPSaltCurrent);
	$('.coolantTempValue').html(coolantTemp+"&deg;");
	$('.intakeTempValue').html(intakeTemp+"&deg;");
	$('.outsideTempValue').html(outsideTemp+"&deg;");
  $('.gearPositionValue').html(lastGearPositionValue);
  $('.fuelGaugeValue').html(lastFuelGaugeValue+"%");

	if(altGPSmin != 9999){
		$('.gpsAltitudeMinMax').html(altGPSmin+' / '+altGPSmax);
	}
  if(barSpeedometerMod) {
    $('.vehDataBar1').addClass('activeDataBar');
    $('.speedTopValue').html(speedTop);
    $('.TotFuelEfficiency').html(TotFuelEfficiency);
    $('.Drv1AvlFuelEValue').html(FuelEfficiency);
    $('.avgFuelValue').html(AvgFuelEfficiency);
  } else {
    $('.speedTopValue').html('<span>('+engineSpeedTop+')</span>'+speedTop);
    $('.Drv1AvlFuelEValue').html('<span>('+TotFuelEfficiency+')</span>'+FuelEfficiency);
    $('.topRPMIndicator').css("transform","rotate("+(-145-engineSpeedTop*0.01)+"deg)");
    if (startAnalog) {
      $('#digital').hide();
      $('#analog').show();
    }
    // fix layout if average symbol is used
    $('fieldset legend:contains("∅")').css("margin-top","2px");
  }
}
