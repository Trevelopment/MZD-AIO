function updateSpeedoApp(){

	if(enableSmallSbSpeedo){
		$('#SbSpeedo').fadeIn();
	}

	$('.StatusBarCtrlDomainIcon').css("background-image", "url('/jci/gui/apps/_speedometer/IcnSbnSpeedometer.png')");

	// touch to togle Analog / Digital
	// --------------------------------------------------------------------------
	$('#analog').click(function(){
		$('#analog').hide();
		$('#digital').show();
	});

	$('#digital').click(function(){
		$('#digital').hide();
		$('#analog').show();
	});

	// touch to togle kmh / MPH
	// --------------------------------------------------------------------------
	$('#valuetable .tripDistFieldSet').click(function(){
		if(isMPH){
			isMPH = false;
			speedSumTotal = Math.round(speedSumTotal * 1.609344);
			speedTop = Math.round(speedTop * 1.609344);
			speedAvg = Math.round(speedAvg * 1.609344);
			$('#speedometerContainer .vehicleSpeed').css("background","url('/jci/gui/apps/_speedometer/templates/SpeedoMeter/images/currentSpeed.png') no-repeat scroll center center transparent");
			$('.speedTopValue').html('<span>('+engineSpeedTop+')</span>'+speedTop);
			$('.speedAvgValue').text(speedAvg);
			$('.speedUnit').text('km/h');
			$('#speedometerDial').removeClass('mph');
			$('.tripDistFieldSet').removeClass('mphbu');
			$('.tripDistFieldSet legend span').text('(km)');
			$('.gpsAltitudeFieldSet legend span').text('(m)');
			if(fuelEffunit_kml){
				$('.Drv1AvlFuelEFieldSet legend').html('km/L &empty;');
			} else {
				$('.Drv1AvlFuelEFieldSet legend').html('L/100 km &empty;');
			}
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
		} else {
			isMPH = true;
			speedSumTotal = Math.round(speedSumTotal * 0.6213712);
			speedTop = Math.round(speedTop * 0.6213712);
			speedAvg = Math.round(speedAvg * 0.6213712);
			$('#speedometerContainer .vehicleSpeed').css("background","url('/jci/gui/apps/_speedometer/templates/SpeedoMeter/images/currentSpeed_mpg.png') no-repeat scroll center center transparent");
			$('.speedTopValue').html('<span>('+engineSpeedTop+')</span>'+speedTop);
			$('.speedAvgValue').text(speedAvg);
			$('.speedUnit').text('mph');
			$('#speedometerDial').addClass('mph');
			$('.tripDistFieldSet').addClass('mphbu');
			$('.tripDistFieldSet legend span').text('(mi)');
			$('.gpsAltitudeFieldSet legend span').text('(ft)');
			$('.Drv1AvlFuelEFieldSet legend').html('MPG &empty;');
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
	});

	// language specific labels

	// Español
	if(language == 'ES'){
		// $('.gpsSpeedFieldSet legend').html('Vel. GPS');
		$('.tripDistFieldSet legend').html('Dist. de viaje <span>(km)</span>');
		$('.speedTopFieldSet legend').html('Vel. Max');
		$('.speedAvgFieldSet legend').html('Vel. &empty;');
		$('.gpsAltitudeFieldSet legend').html('Altitud <span>(m)</span>');
		$('.gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
		$('.gpsLatitudeFieldSet legend').html('Lat.');
		$('.gpsLongitudeFieldSet legend').html('Lon.');
		$('.tripTimeFieldSet legend').html('T. Total');
		$('.idleTimeFieldSet legend').html('T. Descanso');
		$('.engIdleTimeFieldSet legend').html('Engine Idle');
	}

	// Polskie
	if(language == 'PL'){
		// $('.gpsSpeedFieldSet legend').html('Prędkość GPS');
		$('.tripDistFieldSet legend').html('Dystans <span>(km)</span>');
		$('.speedTopFieldSet legend').html('Prędkość maks.');
		$('.speedAvgFieldSet legend').html('Prędkość śr.');
		$('.gpsAltitudeFieldSet legend').html('Wysokość n.p.m. <span>(m)</span>');
		$('.gpsAltitudeMinMaxFieldSet legend').html('<span>min./maks.</span>');
		$('.gpsLatitudeFieldSet legend').html('Szer. <span>geogr.</span>');
		$('.gpsLongitudeFieldSet legend').html('Dł. <span>geogr.</span>');
		$('.tripTimeFieldSet legend').html('Czas całk.');
		$('.idleTimeFieldSet legend').html('Czas bezcz.');
		$('.engIdleTimeFieldSet legend').html('Engine Idle');
	}

	// Slovenský
	if(language == 'SK'){
		$('.tripDistFieldSet legend').html('Vzdialenosť <span>(km)</span>');
		$('.speedTopFieldSet legend').html('Najvyššia rých.');
		$('.speedAvgFieldSet legend').html('Priemerná rýchlosť');
		$('.gpsAltitudeFieldSet legend').html('Nadmorská výška <span>(m)</span>');
		$('.gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
		$('.gpsLatitudeFieldSet legend').html('Zem. šírka');
		$('.gpsLongitudeFieldSet legend').html('Zem. dĺžka');
		$('.tripTimeFieldSet legend').html('Celkový čas');
		$('.idleTimeFieldSet legend').html('Doba <span>nečinn.</span>');
		$('.engIdleTimeFieldSet legend').html('Engine Idle');
	}

	// Deutsch
	if(language == 'DE'){
		// $('.gpsSpeedFieldSet legend').html('Geschw. GPS');
		$('.tripDistFieldSet legend').html('Strecke <span>(km)</span>');
		$('.speedTopFieldSet legend').html('Geschw. max');
		$('.speedAvgFieldSet legend').html('Geschw. &empty;');
		$('.gpsAltitudeFieldSet legend').html('H&ouml;he &uuml;. NN <span>(m)</span>');
		$('.gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
		$('.gpsLatitudeFieldSet legend').html('Breite');
		$('.gpsLongitudeFieldSet legend').html('L&auml;nge');
		$('.tripTimeFieldSet legend').html('Gesamtzeit');
		$('.idleTimeFieldSet legend').html('Standzeit');
		$('.engIdleTimeFieldSet legend').html('Leerlaufzeit');
		$('.NorthEast').html('NO');
		$('.East').html('O');
		$('.SouthEast').html('SO');
		$('#rpmDial .unit').text('U/min');
	}

	// Türk
	if(language == 'TR'){
		$('.tripDistFieldSet legend').html('Gidilen Yol <span>(km)</span>');
		$('.speedTopFieldSet legend').html('Maksimum Hız');
		$('.speedAvgFieldSet legend').html('Ortalama Hız');
		$('.gpsAltitudeFieldSet legend').html('Yükseklik anlık <span>(m)</span>');
		$('.gpsAltitudeMinMaxFieldSet legend').html('<span>en az/en çok</span>');
		$('.gpsLatitudeFieldSet legend').html('Enlem');
		$('.gpsLongitudeFieldSet legend').html('Boylam');
		$('.tripTimeFieldSet legend').html('Toplam Süre');
		$('.idleTimeFieldSet legend').html('Durma Süresi');
		$('.engIdleTimeFieldSet legend').html('Engine Idle');
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
	if(language == 'FR'){
		// $('.gpsSpeedFieldSet legend').html('Vit. GPS');
		$('.tripDistFieldSet legend').html('Trajet Dist. <span>(km)</span>');
		$('.speedTopFieldSet legend').html('V. max');
		$('.speedAvgFieldSet legend').html('V. Moyenne');
		$('.gpsAltitudeFieldSet legend').html('Altitude <span>(m)</span>');
		$('.gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
		$('.gpsLatitudeFieldSet legend').html('Lat.');
		$('.gpsLongitudeFieldSet legend').html('Lon.');
		$('.tripTimeFieldSet legend').html('T. total');
		$('.idleTimeFieldSet legend').html('T. d\'arr&ecirc;t');
		$('.engIdleTimeFieldSet legend').html('T. au ralenti');
		$('.SouthWest').html('SO');
		$('.West').html('O');
		$('.NorthWest').html('NO');
		$('.Drv1AvlFuelEFieldSet legend').html('L/100 km <span>Moy.</span>');
	}

	// unit specific changes

	if(isMPH){
		$('.speedUnit').text('mph');
		$('#speedometerDial').addClass('mph');
		$('.tripDistFieldSet legend span').text('(mi)');
		$('.gpsAltitudeFieldSet legend span').text('(ft)');
		$('.Drv1AvlFuelEFieldSet legend').html('MPG &empty;');
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
	} else {
		$('.speedUnit').text('km/h');
		$('.topSpeedIndicator').css("transform","rotate("+(-120+speedTop)+"deg)");
	}

	if(fuelEffunit_kml){
		$('.Drv1AvlFuelEFieldSet legend').html('km/L &empty;');
	}

	// custom background

	if(!original_background_image && black_background_opacity > 0.0 && black_background_opacity <= 1.0) {
		$('#speedometerContainer').css("background-color","rgba(0,0,0,"+black_background_opacity+")");
	}
	if(original_background_image) {
		$('#speedometerContainer').css("background-image","url(apps/_speedometer/templates/SpeedoMeter/images/speedometer_background.jpg)");
	}

	// fix layout if average symbol is used

	$('fieldset legend:contains("∅")').css("margin-top","2px");

	// restore values after app restart

	$('.tripDistance').text(tripDist);
	$('.speedTopValue').html('<span>('+engineSpeedTop+')</span>'+speedTop);
	$('.speedAvgValue').text(speedAvg);
	$('.gpsAltitudeValue').text(GPSaltCurrent);

	if(altGPSmin != 9999){
		$('.gpsAltitudeMinMax').html(altGPSmin+' / '+altGPSmax);
	}

	$('.Drv1AvlFuelEValue').html('<span>('+TotFuelEfficiency+')</span>'+FuelEfficiency);
	$('.topRPMIndicator').css("transform","rotate("+(-145-engineSpeedTop*0.01)+"deg)");

	if (startAnalog) {
		$('#digital').hide();
		$('#analog').show();
	}
}
