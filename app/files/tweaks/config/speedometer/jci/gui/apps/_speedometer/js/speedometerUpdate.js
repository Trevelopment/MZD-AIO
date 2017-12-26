function updateSpeedoApp(){
  if(enableSmallSbSpeedo){
    $('#SbSpeedo').fadeIn();
  }

  // language specific labels

  // Español
  if(language === 'ES'){
    // $('.gpsSpeedFieldSet legend').html('Vel. GPS');
    $('.tripDistFieldSet legend').html('Dist. de viaje <span>(km)</span>');
    $('.speedTopFieldSet legend').html('Vel. Max');
    $('.speedAvgFieldSet legend').html('Vel. &empty;');
    $('.gpsAltitudeFieldSet legend').html('Altitud <span>(m)</span>');
    // $('.gpsAltitudeMinFieldSet legend').html('Altitud <span>min</span>');
    // $('.gpsAltitudeMaxFieldSet legend').html('Altitud <span>max</span>');
    $('.gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
    $('.gpsHeadingFieldSet legend').html('Direcci&oacute;n');
    $('.gpsLatitudeFieldSet legend').html('Lat.');
    $('.gpsLongitudeFieldSet legend').html('Lon.');
    $('.tripTimeFieldSet legend').html('T. Total');
    $('.idleTimeFieldSet legend').html('T. Descanso');
    $('.engIdleTimeFieldSet legend').html('Engine Idle');
  }

  // Polskie
  else if(language === 'PL'){
    // $('.gpsSpeedFieldSet legend').html('Prędkość GPS');
    $('.tripDistFieldSet legend').html('Dystans <span>(km)</span>');
    $('.speedTopFieldSet legend').html('Prędkość maks.');
    $('.speedAvgFieldSet legend').html('Prędkość śr.');
    $('.gpsAltitudeFieldSet legend').html('Wysokość n.p.m. <span>(m)</span>');
    // $('.gpsAltitudeMinFieldSet legend').html('Wysokość <span>min.</span>');
    // $('.gpsAltitudeMaxFieldSet legend').html('Wysokość <span>maks.</span>');
    $('.gpsAltitudeMinMaxFieldSet legend').html('<span>min./maks.</span>');
    $('.gpsLatitudeFieldSet legend').html('Szer. <span>geogr.</span>');
    $('.gpsLongitudeFieldSet legend').html('Dł. <span>geogr.</span>');
    $('.tripTimeFieldSet legend').html('Czas całk.');
    $('.idleTimeFieldSet legend').html('Czas bezcz.');
    $('.engIdleTimeFieldSet legend').html('Engine Idle');
  }

  // Slovenský
  else if(language === 'SK'){
    $('.tripDistFieldSet legend').html('Vzdialenosť <span>(km)</span>');
    $('.speedTopFieldSet legend').html('Najvyššia rýchlosť');
    $('.speedAvgFieldSet legend').html('Priemerná rýchlosť');
    $('.gpsAltitudeFieldSet legend').html('Nadmorská výška <span>(m)</span>');
    // $('.gpsAltitudeMinFieldSet legend').html('Nadm. výška <span>min</span>');
    // $('.gpsAltitudeMaxFieldSet legend').html('Nadm. výška <span>max</span>');
    $('.gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
    $('.gpsLatitudeFieldSet legend').html('Zem. šírka');
    $('.gpsLongitudeFieldSet legend').html('Zem. dĺžka');
    $('.tripTimeFieldSet legend').html('Celkový čas');
    // $('.idleTimeFieldSet legend').html('Doba nečinnosti');
    $('.idleTimeFieldSet legend').html('Doba <span>nečinn.</span>');
    $('.engIdleTimeFieldSet legend').html('Engine Idle');
  }

  // Deutsch
  else if(language === 'DE'){
    // $('.gpsSpeedFieldSet legend').html('Geschw. GPS');
    $('.tripDistFieldSet legend').html('Strecke <span>(km)</span>');
    $('.speedTopFieldSet legend').html('Geschw. max');
    $('.speedAvgFieldSet legend').html('Geschw. &empty;');
    $('.gpsAltitudeFieldSet legend').html('H&ouml;he &uuml;. NN <span>(m)</span>');
    // $('.gpsAltitudeMinFieldSet legend').html('H&ouml;he <span>min</span>');
    // $('.gpsAltitudeMaxFieldSet legend').html('H&ouml;he <span>max</span>');
    $('.gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
    $('.gpsHeadingFieldSet legend').html('Fahrtrichtung');
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
  else if(language === 'TR'){
    $('.tripDistFieldSet legend').html('Gidilen Yol <span>(km)</span>');
    $('.speedTopFieldSet legend').html('Maksimum Hız');
    $('.speedAvgFieldSet legend').html('Ortalama Hız');
    $('.gpsAltitudeFieldSet legend').html('Yükseklik anlık <span>(m)</span>');
    // $('.gpsAltitudeMinFieldSet legend').html('Yükseklik <span>en az</span>');
    // $('.gpsAltitudeMaxFieldSet legend').html('Yükseklik <span>en çok</span>');
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
  else if(language === 'FR'){
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
  // Italiano
  else if(language === 'IT'){
    // $('.gpsSpeedFieldSet legend').html('Vel. GPS');
    $('.tripDistFieldSet legend').html('Dist. tragitto <span>(km)</span>');
    $('.speedTopFieldSet legend').html('Vel. max');
    $('.speedAvgFieldSet legend').html('Vel. media');
    $('.gpsAltitudeFieldSet legend').html('Altitudine <span>(m)</span>');
    // $('.gpsAltitudeMinFieldSet legend').html('Altitudine <span>min</span>');
    // $('.gpsAltitudeMaxFieldSet legend').html('Altitudine <span>max</span>');
    $('.gpsAltitudeMinMaxFieldSet legend').html('<span>min/max</span>');
    $('.gpsHeadingFieldSet legend').html('Direzione');
    $('.gpsLatitudeFieldSet legend').html('Lat.');
    $('.gpsLongitudeFieldSet legend').html('Lon.');
    $('.tripTimeFieldSet legend').html('Tempo tot.');
    $('.idleTimeFieldSet legend').html('T. d\'arresto');
    $('.engIdleTimeFieldSet legend').html('T. di inattivit&agrave;');
    $('.SouthWest').html('SO');
    $('.West').html('O');
    $('.NorthWest').html('NO');
    $('.Drv1AvlFuelEFieldSet legend').html('L/100 km <span>media</span>');
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

  // restore values after app restart

  $('.tripDistance').text(tripDist);
  // $('.tripDistance').html('<span>('+currtripDist+'/'+tripDistCurrent+')</span>'+tripDist);
  $('.speedTopValue').html('<span>('+engineSpeedTop+')</span>'+speedTop);
  $('.speedAvgValue').text(speedAvg);
  $('.gpsAltitudeValue').text(GPSaltCurrent);

  if(altGPSmin != 9999){
    $('.gpsAltitudeMinMax').html(altGPSmin+' / '+altGPSmax);
  }

  $('.Drv1AvlFuelEValue').html('<span>('+TotFuelEfficiency+')</span>'+FuelEfficiency);
  $('.topRPMIndicator').css("transform","rotate("+(-145-engineSpeedTop*0.01)+"deg)");
}
