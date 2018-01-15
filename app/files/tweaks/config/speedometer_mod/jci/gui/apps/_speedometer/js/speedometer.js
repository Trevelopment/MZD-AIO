// try not to make changes to the lines below
// if config file is invalid these values can fallback on defaults
var enableSmallSbSpeedo = enableSmallSbSpeedo || false;
var barSpeedometerMod = barSpeedometerMod || false;
var language = language || 'EN';
var tempIsF = tempIsF || false;
var sbTemp = sbTemp || false;
var isMPH = isMPH || false;
var tripDistCurrent = 0;
var prevTripDist = 0;
var tripDistBkp = 0;
var tripDist = 0;
var speedCurrent = 0;
var speedSumTotal = 0;
var speedTop = 0;
var speedAvg = 0;
var GPSspeedCurrent = 0;
var GPSaltCurrent = 0;
var FuelEfficiency = 0;
var AvgFuelEfficiency = 0;
var TotFuelEfficiency = 0;
var idleTimeValue = '0:00';
var engONidleTimeValue = '0:00';
var lastGPSheadingValue = 999;
var GPSlatCurrent = 0;
var GPSlonCurrent = 0;
var altGPSmin = 9999;
var altGPSmax = -9999;
var totalTripSeconds = 0;
var totalIdleSeconds = 0;
var totalEngineOnSeconds = 0;
var totalMoveCount = 0;
var direction = "---";
var engineSpeedCurrent = 0;
var engineSpeedTop = 0;
var outsideTemp = 0;
var intakeTemp = 0;
var coolantTemp = 0;
var currOilTemp = 0;
var gearPos = 0;
var lastGPSspeedValue = 0;
var lastEnginespeedValue = 0;
var lastGearPositionValue = 0;
var lastGearLeverPositionValue = 0;
var lastFuelGaugeValue = 0
var lastAvgFuelValue = 0;
var BatSOC = 0;
var BatSOCmax = 200;
var lastEngineLoadValue = 0;
var carspd = 0;
var currDataBar = 1;
var backgroundColor = '';
var automaticTrans = false;

$.ajax({
  url: 'addon-common/cufon-yui.js',
  dataType: 'script',
  success: function (data) {
    $.ajax({
      url: 'addon-common/jquery.flot.min.js',
      dataType: 'script',
      success: function (data) {
        Cufon.now();
      },
      complete: function(){
      }
    });
  }
});

$(document).ready(function(){

  // websocket
  // --------------------------------------------------------------------------
  function retrievedata(action){
    var speedometerWs = new WebSocket('ws://127.0.0.1:9969/');
    speedometerWs.onmessage = function(event){
      var res = event.data.split('#');
      switch(res[0]){
        case 'vehicleData':   updateVehicleSpeed(res[1]); updateEngineSpeed(res[2]); updateTripDist(res[3]); updateGPSSpeed(res[4]); updateGPSAltitude(res[5]); updateGPSHeading(res[6]); updateGPSLatitude(res[7]); updateGPSLongitude(res[8]); updateEngineLoad(res[9]); updateGearLeverPos(res[10]); break;
        case 'envData':   updateFuelEfficiency(res[1]); updateTotFuelEfficiency(res[2]); updateAvgFuelEfficiency(res[3]);  updateOutsideTemp(res[4]); updateIntakeTemp(res[5]); updateCoolantTemp(res[6]); updateGearPos(res[7]); updateFuelGauge(res[8]); updateBatSOC(res[9]); break;
      }
    };
    speedometerWs.onopen = function(){
      speedometerWs.send(action);
    };
  }
  // --------------------------------------------------------------------------
  // websocket end

  // update trip time
  // --------------------------------------------------------------------------
  function updateTripTime(){
    totalTripSeconds++;
    var hours   = Math.floor(totalTripSeconds / 3600);
    var minutes = Math.floor((totalTripSeconds - (hours * 3600)) / 60);
    var seconds = totalTripSeconds - (hours * 3600) - (minutes * 60);

    if(hours > 0 && minutes < 10){minutes = "0"+minutes;}
    if(seconds < 10){seconds = "0"+seconds;}
    if(hours > 0){
      $('.tripTimeValue').html(hours+':'+minutes+':'+seconds);
    } else {
      $('.tripTimeValue').html(minutes+':'+seconds);
    }
    if(!barSpeedometerMod) {
      if(totalIdleSeconds > 0){
        IdlePercent = Math.round(totalIdleSeconds / totalTripSeconds * 100);
        $('.idleTimeValue').html('<span>('+IdlePercent+'%)</span>'+idleTimeValue);
      }
      if(totalEngineOnSeconds > 0){
        engONidlePercent = Math.round(totalEngineOnSeconds / totalTripSeconds * 100);
        $('.engineIdleTimeValue').html('<span>('+engONidlePercent+'%)</span>'+engONidleTimeValue);
      }
    }
  }
  // --------------------------------------------------------------------------

  // update idle times
  // --------------------------------------------------------------------------
  function updateIdleTime(speed){
    // update stop time
    // --------------------------------------------------------------------------
    if(speed === 0 && totalTripSeconds > 10){
      totalIdleSeconds++;
      var hours   = Math.floor(totalIdleSeconds / 3600);
      var minutes = Math.floor((totalIdleSeconds - (hours * 3600)) / 60);
      var seconds = totalIdleSeconds - (hours * 3600) - (minutes * 60);

      if(hours > 0 && minutes < 10){minutes = "0"+minutes;}
      if(seconds < 10){seconds = "0"+seconds;}
      if(hours > 0){
        idleTimeValue = (hours+':'+minutes+':'+seconds);
      } else {
        idleTimeValue = (minutes+':'+seconds);
      }
    }

    // update engine idle time
    // --------------------------------------------------------------------------
    if(speed === 0 && engineSpeedCurrent > 0 && totalTripSeconds > 35){
      totalEngineOnSeconds++;
      var hoursE   = Math.floor(totalEngineOnSeconds / 3600);
      var minutesE = Math.floor((totalEngineOnSeconds - (hoursE * 3600)) / 60);
      var secondsE = totalEngineOnSeconds - (hoursE * 3600) - (minutesE * 60);

      if(hoursE > 0 && minutesE < 10){minutesE = "0"+minutesE;}
      if(secondsE < 10){secondsE = "0"+secondsE;}
      if(hoursE > 0){
        engONidleTimeValue = (hoursE+':'+minutesE+':'+secondsE);
      } else {
        engONidleTimeValue = (minutesE+':'+secondsE);
      }
    }
    if(barSpeedometerMod){
      $('.idleTimeValue').html(idleTimeValue);
      $('.engineIdleTimeValue').html(engONidleTimeValue);
    } else {
      $('.idleTimeValue').html('<span>('+engONidleTimeValue+')</span>'+idleTimeValue);
    }
  }
  // --------------------------------------------------------------------------

  // update vehicle speed
  // --------------------------------------------------------------------------
  function updateVehicleSpeed(currentSpeed){
    currentSpeed = $.trim(currentSpeed);
    if($.isNumeric(currentSpeed)){
      if(isMPH){
        speedCurrent = Math.ceil(currentSpeed * 0.006213712);
      } else {
        speedCurrent = Math.ceil(currentSpeed * 0.01);
      }

      // update vehicle top speed
      // --------------------------------------------------------------------------
      if(speedCurrent > speedTop){
        speedTop = speedCurrent;
        if(barSpeedometerMod) {
          $('.speedTopValue').html(speedTop);
          $('.engineSpeedTopValue').html(engineSpeedTop);
        } else {
          $('.speedTopValue').html('<span>('+engineSpeedTop+')</span>'+speedTop);
          if(isMPH){
            $('.topSpeedIndicator').css("transform","rotate("+(-120+speedCurrent*2)+"deg)");
          } else {
            $('.topSpeedIndicator').css("transform","rotate("+(-120+speedCurrent)+"deg)");
          }
        }
      }
      // --------------------------------------------------------------------------

      // update vehicle average speed
      // --------------------------------------------------------------------------
      if(speedCurrent > 0){
        totalMoveCount++;
        speedSumTotal += speedCurrent;
        var avgSpeed = Math.ceil(speedSumTotal / totalMoveCount);
        if(speedAvg !== avgSpeed){
          speedAvg = avgSpeed;
          $('.speedAvgValue').html(speedAvg);
        }
      }
      // --------------------------------------------------------------------------

      // update vehicle current speed
      // --------------------------------------------------------------------------
      if(!barSpeedometerMod) {
        if(isMPH){
          $('.speedIndicator').css("transform","rotate("+(-120+speedCurrent*2)+"deg)");
        } else {
          $('.speedIndicator').css("transform","rotate("+(-120+speedCurrent)+"deg)");
        }
      }
      $('.vehicleSpeed').each(function () {
        var $this = $(this);
         $(this).prop('Counter', $this.text()).animate({Counter: speedCurrent}, {
        //$({Counter: $this.text()}).animate({Counter: speedCurrent}, {
          duration: 950,
          easing: 'linear',
          step: function (now) {
            $this.text(Math.ceil(now));
            if(!engineSpeedBar) {
              speedCurrent = $this.text();
              var speedBar = (isMPH) ? speedCurrent * 1.6 : speedCurrent;
              updateSpeedBar(Math.ceil(speedBar));
            }
          },
          complete: function () {
          }
        });
      });
      // cufon stuff
      // --------------------------------------------------------------------------
      Cufon.replace('#digital .vehicleSpeed');
      // --------------------------------------------------------------------------
    }
  }
  // --------------------------------------------------------------------------

  // update total fuel efficiency
  // --------------------------------------------------------------------------
  function updateTotFuelEfficiency(totfuelEff){
    totfuelEff = $.trim(totfuelEff);
    if($.isNumeric(totfuelEff) && totfuelEff !== 0){
      if(isMPH){
        // 1 km/L = 2.3521458 US MPG
        TotFuelEfficiency = (Math.round(totfuelEff * 2.3521458)/10);
      } else {
        if(fuelEffunit_kml){
          TotFuelEfficiency = parseFloat((Math.round(totfuelEff)/10).toFixed(1));
        } else {
          // converts km/L to L/100km
          TotFuelEfficiency = parseFloat((Math.round(10000 / totfuelEff)/10).toFixed(1));
        }
      }
      if(language === 'DE' || language === 'FR'){
        TotFuelEfficiency = TotFuelEfficiency.toString().replace(".",",");
      }
      if(barSpeedometerMod) {
        $('.TotFuelEfficiency').html(TotFuelEfficiency);
      }
    }
  }
  // --------------------------------------------------------------------------

  // update fuel efficiency
  // --------------------------------------------------------------------------
  function updateFuelEfficiency(currentfuelEff){
    currentfuelEff = $.trim(currentfuelEff);
    if($.isNumeric(currentfuelEff) && currentfuelEff !== 0){
      if(isMPH){
        // 1 km/L = 2.3521458 US MPG
        FuelEfficiency = (Math.round(currentfuelEff * 2.3521458)/10);
      } else {
        if(fuelEffunit_kml){
          FuelEfficiency = parseFloat((Math.round(currentfuelEff)/10).toFixed(1));
        } else {
          // converts km/L to L/100km
          FuelEfficiency = parseFloat((Math.round(10000 / currentfuelEff)/10).toFixed(1));
        }
      }
      if(language === 'DE' || language === 'FR'){
        FuelEfficiency = FuelEfficiency.toString().replace(".",",");
      }
      if(barSpeedometerMod) {
        $('.Drv1AvlFuelEValue').html(FuelEfficiency);
      } else {
        $('.Drv1AvlFuelEValue').html('<span>('+TotFuelEfficiency+')</span>'+FuelEfficiency);
      }
    }
  }
  // --------------------------------------------------------------------------

  // update average fuel efficiency
  // --------------------------------------------------------------------------
  function updateAvgFuelEfficiency(avgfuelEff){
    avgfuelEff = $.trim(avgfuelEff);
    if($.isNumeric(avgfuelEff) && avgfuelEff !== 0){
      if(isMPH){
        // 1 km/L = 2.3521458 US MPG
        AvgFuelEfficiency = (Math.round(avgfuelEff * 2.3521458)/100);
      } else {
        if(fuelEffunit_kml){
          AvgFuelEfficiency = parseFloat((Math.round(avgfuelEff)/100).toFixed(1));
        } else {
          // converts km/L to L/100km
          AvgFuelEfficiency = parseFloat(Math.round(10000 / avgfuelEff).toFixed(1));
        }
      }
      if(language === 'DE' || language === 'FR'){
        AvgFuelEfficiency = AvgFuelEfficiency.toString().replace(".",",");
      }
      $('.avgFuelValue').html(AvgFuelEfficiency);
    }
  }
  // --------------------------------------------------------------------------

  // update trip distance
  // --------------------------------------------------------------------------
  function updateTripDist(currtripDist){
    currtripDist = $.trim(currtripDist);
    if($.isNumeric(currtripDist)){
      if(currtripDist > 0){
        tripDistCurrent = parseFloat(currtripDist)+parseFloat(tripDistBkp);
        if(currtripDist > 2){
          prevTripDist = tripDistCurrent;
        }
      }
      if(currtripDist >= 0 && currtripDist <= 2 && prevTripDist > 0){
        tripDistBkp = prevTripDist;
      }

      if(isMPH){
        tripDist = parseFloat((tripDistCurrent * 0.02 * 0.6213712).toFixed(2));
      } else {
        tripDist = parseFloat((tripDistCurrent * 0.02).toFixed(2));
      }
      if(language === 'DE' || language === 'FR'){
        tripDist = tripDist.toString().replace(".",",");
      }
      $('.tripDistance').html(tripDist);
    }
  }
  // --------------------------------------------------------------------------

  // update GPS speed
  // --------------------------------------------------------------------------
  function updateGPSSpeed(currentGPSSpeed){
    currentGPSSpeed = $.trim(currentGPSSpeed);
    if($.isNumeric(currentGPSSpeed)){
      if(isMPH){
        GPSspeedCurrent = Math.floor(currentGPSSpeed * 0.6213712);
      } else {
        GPSspeedCurrent = Math.floor(currentGPSSpeed);
      }
      $('.gpsSpeedValue').each(function () {
        var $this = $(this);
        $({Counter: $this.text()}).animate({Counter: GPSspeedCurrent}, {
          duration: 950,
          easing: 'linear',
          step: function (now) {
            $this.text(Math.ceil(now));
          },
          complete: function () {
          }
        });
      });
    }
  }
  // --------------------------------------------------------------------------

  // update GPS altitude
  // --------------------------------------------------------------------------
  function updateGPSAltitude(currentGPSalt){
    currentGPSalt = $.trim(currentGPSalt);
    if($.isNumeric(currentGPSalt) && currentGPSalt !== GPSaltCurrent){
      if(isMPH){
        GPSaltCurrent = Math.round(currentGPSalt * 3.28084);
      } else {
        GPSaltCurrent = Math.round(currentGPSalt);
      }

      // update max altitude
      // --------------------------------------------------------------------------
      if(GPSaltCurrent > altGPSmax){
        altGPSmax = GPSaltCurrent;
        // $('.gpsAltitudeMax').html(altGPSmax);
      }
      // --------------------------------------------------------------------------

      // update min altitude
      // --------------------------------------------------------------------------
      if(GPSaltCurrent < altGPSmin && GPSaltCurrent !== 0){
        altGPSmin = GPSaltCurrent;
        // $('.gpsAltitudeMin').html(altGPSmin);
      }
      // --------------------------------------------------------------------------

      if(altGPSmin !== 9999){
        $('.gpsAltitudeMinMax').html(altGPSmin+' / '+altGPSmax);
      }

      // update current altitude
      // --------------------------------------------------------------------------
      $('.gpsAltitudeValue').html(GPSaltCurrent);
      // --------------------------------------------------------------------------
    }
  }
  // --------------------------------------------------------------------------

  // update GPS Heading
  // --------------------------------------------------------------------------
  function updateGPSHeading(currentGPShead){
    currentGPShead = $.trim(currentGPShead);
    if($.isNumeric(currentGPShead) && currentGPShead !== lastGPSheadingValue){
      // without NavSD
      if(noNavSD){
        if(speedCurrent > 0){
          $('.gpsCompassBG').css("transform","rotate("+(-Math.round(currentGPShead))+"deg)");
          // Mazda Infotainment System GPS heading is S = 0/360 degrees even though docs say otherwise, YMMV
          headingSwitchValue = Math.round(currentGPShead / 22.5);
          // Close enough
          switch(headingSwitchValue){
            case 1:     direction = "NNE";  break;
            case 2:     direction = "NE";   break;
            case 3:     direction = "ENE";  break;
            case 4:     direction = "E";    break;
            case 5:     direction = "ESE";  break;
            case 6:     direction = "SE";   break;
            case 7:     direction = "SSE";  break;
            case 8:     direction = "S";    break;
            case 9:     direction = "SSW";  break;
            case 10:    direction = "SW";   break;
            case 11:    direction = "WSW";  break;
            case 12:    direction = "W";    break;
            case 13:    direction = "WNW";  break;
            case 14:    direction = "NW";   break;
            case 15:    direction = "NNW";  break;
            default:    direction = "N";
          }
          if(language === 'DE'){
            direction = direction.replace(/E/g, "O");
          }
          if(language === 'FR'){
            direction = direction.replace(/W/g, "O");
          }
          if(language === 'TR'){
            direction = direction.replace(/N/g, "K");
            direction = direction.replace(/S/g, "G");
            direction = direction.replace(/E/g, "D");
            direction = direction.replace(/W/g, "B");
          }
          $('.gpsHeading').html(direction);
          lastGPSheadingValue = currentGPShead;
        }
        // with NavSD
      } else {
        $('.gpsCompassBG').css("transform","rotate("+(-Math.abs(currentGPShead)+180)+"deg)");
        // Mazda Infotainment System GPS heading is S = 0/360 degrees even though docs say otherwise, YMMV
        headingSwitchValue = Math.round(currentGPShead / 22.5);
        // Close enough
        switch(headingSwitchValue){
          case 1:     direction = "SSW";  break;
          case 2:     direction = "SW";   break;
          case 3:     direction = "WSW";  break;
          case 4:     direction = "W";    break;
          case 5:     direction = "WNW";  break;
          case 6:     direction = "NW";   break;
          case 7:     direction = "NNW";  break;
          case 8:     direction = "N";    break;
          case 9:     direction = "NNE";  break;
          case 10:    direction = "NE";   break;
          case 11:    direction = "ENE";  break;
          case 12:    direction = "E";    break;
          case 13:    direction = "ESE";  break;
          case 14:    direction = "SE";   break;
          case 15:    direction = "SSE";  break;
          default:    direction = "S";
        }
        if(language === 'DE'){
          direction = direction.replace(/E/g, "O");
        }
        if(language === 'FR'){
          direction = direction.replace(/W/g, "O");
        }
        if(language === 'TR'){
          direction = direction.replace(/N/g, "K");
          direction = direction.replace(/S/g, "G");
          direction = direction.replace(/E/g, "D");
          direction = direction.replace(/W/g, "B");
        }
        $('.gpsHeading').html(direction);
        lastGPSheadingValue = currentGPShead;
      }
    }
  }
  // --------------------------------------------------------------------------

  // update GPS latitude
  // --------------------------------------------------------------------------
  function updateGPSLatitude(currentGPSlat){
    currentGPSlat = $.trim(currentGPSlat);
    if($.isNumeric(currentGPSlat)){
      GPSlatCurrent = parseFloat(currentGPSlat).toFixed(4);
      // North
      if(GPSlatCurrent > 0){
        $('.gpsLatitudeValue').html(GPSlatCurrent+'&deg;').removeClass("lat_s").addClass("lat_n");
        // South
      } else {
        $('.gpsLatitudeValue').html(Math.abs(GPSlatCurrent)+'&deg;').removeClass("lat_n").addClass("lat_s");
      }
      if(language === 'TR'){
        $('.gpsLatitudeValue').addClass("tr");
      }
    }
  }
  // --------------------------------------------------------------------------

  // update GPS longitude
  // --------------------------------------------------------------------------
  function updateGPSLongitude(currentGPSlon){
    currentGPSlon = $.trim(currentGPSlon);
    if($.isNumeric(currentGPSlon)){
      GPSlonCurrent = parseFloat(currentGPSlon).toFixed(4);
      // East
      if(GPSlonCurrent > 0){
        $('.gpsLongitudeValue').html(GPSlonCurrent+'&deg;').removeClass("lon_w").addClass("lon_e");
        // West
      } else {
        $('.gpsLongitudeValue').html(Math.abs(GPSlonCurrent)+'&deg;').removeClass("lon_e").addClass("lon_w");
      }
      if(language === 'DE'){
        $('.gpsLongitudeValue').addClass("de");
      }
      if(language === 'FR'){
        $('.gpsLongitudeValue').addClass("fr");
      }
      if(language === 'TR'){
        $('.gpsLongitudeValue').addClass("tr");
      }
    }
  }
  // --------------------------------------------------------------------------

  // Update Engine Speed
  // --------------------------------------------------------------------------
  function updateEngineSpeed(currentEngineSpeed){
    currentEngineSpeed = $.trim(currentEngineSpeed);
    if($.isNumeric(currentEngineSpeed)){
      engineSpeedCurrent = Math.round(currentEngineSpeed * 2);
      if(engineSpeedCurrent <= 8000){

        // update engine top speed
        // --------------------------------------------------------------------------
        if(engineSpeedCurrent > engineSpeedTop) {
          engineSpeedTop = engineSpeedCurrent;
          if(barSpeedometerMod) {
            $('.engineSpeedTopValue').html(engineSpeedTop);
          } else {
            $('.topRPMIndicator').css("transform","rotate("+(-145-engineSpeedCurrent*0.01)+"deg)");
            $('.speedTopValue').html('<span>('+engineSpeedTop+')</span>'+speedTop);
          }
        }

        // update engine speed
        // --------------------------------------------------------------------------
        if(!barSpeedometerMod) {
          $('.RPMIndicator').css("transform","rotate("+(-145-engineSpeedCurrent*0.01)+"deg)");
        }
        $('.engineSpeedValue').each(function () {
          var $this = $(this);
          $({Counter: $this.text()}).animate({Counter: engineSpeedCurrent}, {
            duration: 950,
            easing: 'linear',
            step: function (now) {
              $this.text(Math.ceil(now));
              if(engineSpeedBar) {
                engineSpeedCurrent = $this.text();
                updateSpeedBar(Math.ceil(engineSpeedCurrent/50));
              }
            },
            complete: function () {
              // do nothing
            }
          });
        });
        // --------------------------------------------------------------------------
      }
    }
  }
  // --------------------------------------------------------------------------

  // Update Outside Temperature
  // --------------------------------------------------------------------------
  function updateOutsideTemp(outTemp) {
    outTemp = $.trim(outTemp);
    if ($.isNumeric(outTemp)) {
      outsideTemp = outTemp -= 40;
      if(tempIsF) {
        outTemp = outTemp * 1.8 + 32;
        outsideTemp = parseFloat(outTemp.toFixed(1));
      }
      $('.outsideTempValue').html(outsideTemp + "&deg;");
    }
  }
  // --------------------------------------------------------------------------

  // Update Intake Temperature
  // --------------------------------------------------------------------------
  function updateIntakeTemp(inTemp) {
    inTemp = $.trim(inTemp);
    if ($.isNumeric(inTemp)) {
      intakeTemp = inTemp -= 40;
      if(tempIsF) {
        inTemp = inTemp * 1.8 + 32;
        intakeTemp = parseFloat(inTemp.toFixed(1));
      }
      $('.intakeTempValue').html(intakeTemp + "&deg;");
    }
  }
  // --------------------------------------------------------------------------

  // Update Coolant Temperature
  // --------------------------------------------------------------------------
  function updateCoolantTemp(coolTemp) {
    coolTemp = $.trim(coolTemp);
    if ($.isNumeric(coolTemp)) {
      coolantTemp = coolTemp -= 40;
      if(tempIsF) {
        coolTemp = coolTemp * 1.8 + 32;
        coolantTemp = parseFloat(coolTemp.toFixed(1));
      }
      $('.coolantTempValue').html(coolantTemp + "&deg;");
    }
  }
  // --------------------------------------------------------------------------
  // Update Gear Position
  // --------------------------------------------------------------------------
  function updateGearPos(gearPos) {
    gearPos = $.trim(gearPos);
    if ($.isNumeric(gearPos)) {
      // gearPos is always zero for manual transmission so
      // If we see anything above 0 we know it is automatic
      if(gearPos > 0) {
        automaticTrans = true;
      }
      if(automaticTrans) {
        lastGearPositionValue = gearPos;
      } else {
        lastGearPositionValue = lastGearLeverPositionValue;
      }
      $('.gearPositionValue').html(lastGearPositionValue);
    }
  }
  // --------------------------------------------------------------------------
  // Update Gear Lever Position
  // --------------------------------------------------------------------------
  function updateGearLeverPos(gearLeverPos) {
    gearLeverPos = $.trim(gearLeverPos);
    if ($.isNumeric(gearLeverPos) && gearLeverPos !== lastGearLeverPositionValue) {
      lastGearLeverPositionValue = gearLeverPos;
      $('.gearLeverPositionValue').html(lastGearLeverPositionValue);
    }
  }
  // --------------------------------------------------------------------------

  // Update Fuel Gauge
  // --------------------------------------------------------------------------
  function updateFuelGauge(fuelGaugeVal) {
    fuelGaugeVal = $.trim(fuelGaugeVal);
    if ($.isNumeric(fuelGaugeVal)) {
      lastFuelGaugeValue = Math.round((fuelGaugeVal/184)*100);
      $('.fuelGaugeValue').html(lastFuelGaugeValue+"%");
    }
  }
  // --------------------------------------------------------------------------

  // Update Battery Charge
  // --------------------------------------------------------------------------
  function updateBatSOC(currBatSOC) {
    currBatSOC = $.trim(currBatSOC);
    if ($.isNumeric(currBatSOC)) {
      BatSOC = ((currBatSOC / BatSOCmax * 100).toFixed(1)).toString();
      if(language === 'DE' || language === 'FR'){
        BatSOC = BatSOC.replace(".",",");
      }
      $('.batSOCValue').html(BatSOC);
    }
  }
  // --------------------------------------------------------------------------

  // Update Engine Load
  // --------------------------------------------------------------------------
  function updateEngineLoad(engineLoadVal) {
    engineLoadVal = $.trim(engineLoadVal);
    if ($.isNumeric(engineLoadVal)) {
      lastEngineLoadValue = engineLoadVal;
      $('.engineLoadValue').html(lastEngineLoadValue);
    }
  }
  // --------------------------------------------------------------------------

  setInterval(function (){
    updateTripTime();
    if(speedCurrent === 0){
      updateIdleTime(speedCurrent);
    }
    if ((enableSmallSbSpeedo) && (!$('#SbSpeedo').hasClass('parking'))) {
      var visibleIcons = 0;
      $('.StatusBarCtrlIconContainer .StatusBarCtrlIcon').each(function(index) {
        if($(this).is(':visible')){
          visibleIcons++;
        }
      });
      if(visibleIcons > 3){
        $('#SbSpeedo').addClass('morespace');
      } else {
        $('#SbSpeedo').removeClass('morespace');
      }
    }
  }, 1000);
  setInterval(function (){
    var sbSpeedoVal1 = (sbTemp) ? $('#SbSpeedo .outsideTempValue') : $('#SbSpeedo .gpsHeading');
    var sbSpeedoVal2 = (sbTemp) ? $('#SbSpeedo .Drv1AvlFuelEValue') : $('#SbSpeedo .gpsAltitudeValue');
    if((enableSmallSbSpeedo) && (!$('#SbSpeedo').hasClass('parking'))){
      sbSpeedoVal1.fadeOut();
      sbSpeedoVal2.fadeIn();
      setTimeout(function(){
        sbSpeedoVal2.fadeOut();
        sbSpeedoVal1.fadeIn();
      }, 2000);
    }
  }, 4000);

  setTimeout(function(){
    retrievedata('vehicleData');
    retrievedata('envData');
  }, 15000);

  function updateSpeedBar(speed){
    if(barSpeedometerMod) {
      for(var i = 150; i >= 105; i -= 5){
        var barClassName = '.speedBar_' + i;
        if(speed >= i){
          switch(i){
            case 150:	backgroundColor = '#FF0000';	break;
            case 145:	backgroundColor = '#FF0000';	break;
            case 140:	backgroundColor = '#FF0000';	break;
            case 135:	backgroundColor = '#FF0000';	break;
            case 130:	backgroundColor = '#FF0000';	break;
            case 125:	backgroundColor = '#FE2E2E';	break;
            case 120:	backgroundColor = '#FF451C';	break;
            case 115:	backgroundColor = '#FF6932';	break;
            case 110:	backgroundColor = '#FE9A2E';	break;
            case 105:	backgroundColor = '#FECC20';	break;
          }
          $(barClassName).css({'background-color' : backgroundColor});
        } else {
          $(barClassName).css({'background-color' : 'transparent'});
        }
      }
      for(var j = 100; j >= 55; j -= 5){
        var barClassName2 = '.speedBar_' + j;
        if(speed >= j){
          switch(j){
            case 100:	backgroundColor = '#FFED2E';	break;
            case 95:	backgroundColor = '#FFF430';	break;
            case 90:	backgroundColor = '#F7FE2E';	break;
            case 85:	backgroundColor = '#C8FE2E';	break;
            case 80:	backgroundColor = '#9AFE2E';	break;
            case 75:	backgroundColor = '#64FE2E';	break;
            case 70:	backgroundColor = '#2EFE2E'; 	break;
            case 65:	backgroundColor = '#2EFE64'; 	break;
            case 60:	backgroundColor = '#2EFE9A';	break;
            case 55:	backgroundColor = '#58FAD0';	break;
          }
          $(barClassName2).css({'background-color' : backgroundColor});
        } else {
          $(barClassName2).css({'background-color' : 'transparent'});
        }
      }
      for(var k = 50; k >= 5; k -= 5){
        var barClassName3 = '.speedBar_' + k;
        if(speed >= k){
          switch(k){
            case 50:	backgroundColor = '#58FAD0';	break;
            case 45:	backgroundColor = '#58FAD0';	break;
            case 40:	backgroundColor = '#58FAD0';	break;
            case 35:	backgroundColor = '#58FAD0';	break;
            case 30:	backgroundColor = '#58FAD0';	break;
            case 25:	backgroundColor = '#81F7D8';	break;
            case 20:	backgroundColor = '#A9F5E1';	break;
            case 15:	backgroundColor = '#CEF6EC';	break;
            case 10:	backgroundColor = '#E0F8F1';	break;
            case 5:		backgroundColor = '#EFFBF8';	break;
          }
          $(barClassName3).css({'background-color' : backgroundColor});
        } else {
          $(barClassName3).css({'background-color' : 'transparent'});
        }
      }
    }
  }
});
