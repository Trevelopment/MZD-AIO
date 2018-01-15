// try not to make changes to the lines below

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

$(document).ready(function(){

  // websocket
  // --------------------------------------------------------------------------
  function retrievedata(action){
    var speedometerWs = new WebSocket('ws://127.0.0.1:9969/');
    speedometerWs.onmessage = function(event){
      var res = event.data.split('#');
      switch(res[0]){
        case 'vehicleData':   updateVehicleSpeed(res[1]); updateEngineSpeed(res[2]); updateTripDist(res[3]); updateGPSSpeed(res[4]); updateGPSAltitude(res[5]); updateGPSHeading(res[6]); updateGPSLatitude(res[7]); updateGPSLongitude(res[8]); break;
        case 'envData':   updateFuelEfficiency(res[1]); updateTotFuelEfficiency(res[2]); break;
        case 'vehicleSpeed':   updateVehicleSpeed(res[1]); break;
        case 'fuelEfficiency': updateFuelEfficiency(res[1]); break;
        case 'totfuelEff':     updateTotFuelEfficiency(res[1]); break;
        case 'drivedist':      updateTripDist(res[1]); break;
        case 'gpsdata':        updateGPSSpeed(res[1]); updateGPSAltitude(res[2]); updateGPSHeading(res[3]); updateGPSLatitude(res[4]); updateGPSLongitude(res[5]); break;
        case 'engineSpeed':    updateEngineSpeed(res[1]); break;
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
      $('.tripTimeValue').text(hours+':'+minutes+':'+seconds);
    } else {
      $('.tripTimeValue').text(minutes+':'+seconds);
    }
    if(totalIdleSeconds > 0){
      IdlePercent = Math.round(totalIdleSeconds / totalTripSeconds * 100);
      $('.idleTimeValue').html('<span>('+IdlePercent+'%)</span>'+idleTimeValue);
    }
    if(totalEngineOnSeconds > 0){
      engONidlePercent = Math.round(totalEngineOnSeconds / totalTripSeconds * 100);
      $('.engineIdleTimeValue').html('<span>('+engONidlePercent+'%)</span>'+engONidleTimeValue);
    }
  }
  // --------------------------------------------------------------------------

  // update idle times
  // --------------------------------------------------------------------------
  function updateIdleTime(speed){
    // update stop time
    // --------------------------------------------------------------------------
    if(speed == 0 && totalTripSeconds > 35){
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
    if(speed == 0 && engineSpeedCurrent > 0 && totalTripSeconds > 35){
      totalEngineOnSeconds++;
      var hours   = Math.floor(totalEngineOnSeconds / 3600);
      var minutes = Math.floor((totalEngineOnSeconds - (hours * 3600)) / 60);
      var seconds = totalEngineOnSeconds - (hours * 3600) - (minutes * 60);

      if(hours > 0 && minutes < 10){minutes = "0"+minutes;}
      if(seconds < 10){seconds = "0"+seconds;}
      if(hours > 0){
        engONidleTimeValue = (hours+':'+minutes+':'+seconds);
      } else {
        engONidleTimeValue = (minutes+':'+seconds);
      }
    }
    // $('.idleTimeValue').html('<span>('+engONidleTimeValue+')</span>'+idleTimeValue);
  }
  // --------------------------------------------------------------------------

  // update vehicle speed
  // --------------------------------------------------------------------------
  function updateVehicleSpeed(currentSpeed){
    var currentSpeed = $.trim(currentSpeed);
    if($.isNumeric(currentSpeed)){
      if(isMPH){
        speedCurrent = Math.ceil(currentSpeed * 0.006213712);
      } else {
        speedCurrent = Math.ceil(currentSpeed * 0.01);
      }

      // update vehicle top speed
      // --------------------------------------------------------------------------
      if(speedCurrent > speedTop){
        if(isMPH){
          $('.topSpeedIndicator').css("transform","rotate("+(-120+speedCurrent*2)+"deg)");
        } else {
          $('.topSpeedIndicator').css("transform","rotate("+(-120+speedCurrent)+"deg)");
        }
        speedTop = speedCurrent;
        $('.speedTopValue').text(speedTop);
      }
      // --------------------------------------------------------------------------

      // update vehicle average speed
      // --------------------------------------------------------------------------
      if(speedCurrent > 0){
        totalMoveCount++;
        speedSumTotal += speedCurrent;
        var avgSpeed = Math.ceil(speedSumTotal / totalMoveCount);
        if(speedAvg != avgSpeed){
          speedAvg = avgSpeed;
          $('.speedAvgValue').text(speedAvg);
        }
      }
      // --------------------------------------------------------------------------

      // update vehicle current speed
      // --------------------------------------------------------------------------
      if(isMPH){
        $('.speedIndicator').css("transform","rotate("+(-120+speedCurrent*2)+"deg)");
      } else {
        $('.speedIndicator').css("transform","rotate("+(-120+speedCurrent)+"deg)");
      }
      $('.vehicleSpeed').text(speedCurrent);
      // --------------------------------------------------------------------------
    }
  }
  // --------------------------------------------------------------------------

  // update total fuel efficiency
  // --------------------------------------------------------------------------
  function updateTotFuelEfficiency(totfuelEff){
    var totfuelEff = $.trim(totfuelEff);
    if($.isNumeric(totfuelEff) && totfuelEff != 0){
      if(isMPH){
        // 1 km/L = 2.3521458 US MPG
        TotFuelEfficiency = (Math.round(totfuelEff * 2.3521458)/10);
      } else {
        if(fuelEffunit_kml){
          TotFuelEfficiency = (Math.round(totfuelEff)/10).toFixed(1);
        } else {
          // converts km/L to L/100km
          TotFuelEfficiency = (Math.round(10000 / totfuelEff)/10).toFixed(1);
        }
      }
      if(language == 'DE' || language == 'FR'){
        TotFuelEfficiency = TotFuelEfficiency.toString().replace(".",",");
      }
      // $('.TotFuelEfficiency').text(TotFuelEfficiency);
    }
  }
  // --------------------------------------------------------------------------

  // update fuel efficiency
  // --------------------------------------------------------------------------
  function updateFuelEfficiency(currentfuelEff){
    var currentfuelEff = $.trim(currentfuelEff);
    if($.isNumeric(currentfuelEff) && currentfuelEff != 0){
      if(isMPH){
        // 1 km/L = 2.3521458 US MPG
        FuelEfficiency = (Math.round(currentfuelEff * 2.3521458)/10);
      } else {
        if(fuelEffunit_kml){
          FuelEfficiency = (Math.round(currentfuelEff)/10).toFixed(1);
        } else {
          // converts km/L to L/100km
          FuelEfficiency = (Math.round(10000 / currentfuelEff)/10).toFixed(1);
        }
      }
      if(language == 'DE' || language == 'FR'){
        FuelEfficiency = FuelEfficiency.toString().replace(".",",");
      }
      $('.Drv1AvlFuelEValue').html('<span>('+TotFuelEfficiency+')</span>'+FuelEfficiency);
    }
  }
  // --------------------------------------------------------------------------

  // update trip distance
  // --------------------------------------------------------------------------
  function updateTripDist(currtripDist){
    var currtripDist = $.trim(currtripDist);
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
        tripDist = (tripDistCurrent * 0.02 * 0.6213712).toFixed(2);
      } else {
        tripDist = (tripDistCurrent * 0.02).toFixed(2);
      }
      if(language == 'DE' || language == 'FR'){
        tripDist = tripDist.toString().replace(".",",");
      }
      $('.tripDistance').text(tripDist);
    }
  }
  // --------------------------------------------------------------------------

  // update GPS speed
  // --------------------------------------------------------------------------
  function updateGPSSpeed(currentGPSSpeed){
    var currentGPSSpeed = $.trim(currentGPSSpeed);
    if($.isNumeric(currentGPSSpeed)){
      if(isMPH){
        GPSspeedCurrent = Math.floor(currentGPSSpeed * 0.6213712);
      } else {
        GPSspeedCurrent = Math.floor(currentGPSSpeed);
      }
      $('.gpsSpeedValue').text(GPSspeedCurrent);
    }
  }
  // --------------------------------------------------------------------------

  // update GPS altitude
  // --------------------------------------------------------------------------
  function updateGPSAltitude(currentGPSalt){
    var currentGPSalt = $.trim(currentGPSalt);
    if($.isNumeric(currentGPSalt) && currentGPSalt != GPSaltCurrent){
      if(isMPH){
        GPSaltCurrent = Math.round(currentGPSalt * 3.28084);
      } else {
        GPSaltCurrent = Math.round(currentGPSalt);
      }

      // update max altitude
      // --------------------------------------------------------------------------
      if(GPSaltCurrent > altGPSmax){
        altGPSmax = GPSaltCurrent;
        // $('.gpsAltitudeMax').text(altGPSmax);
      }
      // --------------------------------------------------------------------------

      // update min altitude
      // --------------------------------------------------------------------------
      if(GPSaltCurrent < altGPSmin && GPSaltCurrent != 0){
        altGPSmin = GPSaltCurrent;
        // $('.gpsAltitudeMin').text(altGPSmin);
      }
      // --------------------------------------------------------------------------

      if(altGPSmin != 9999){
        $('.gpsAltitudeMinMax').html(altGPSmin+' / '+altGPSmax);
      }

      // update current altitude
      // --------------------------------------------------------------------------
      $('.gpsAltitudeValue').text(GPSaltCurrent);
      // --------------------------------------------------------------------------
    }
  }
  // --------------------------------------------------------------------------

  // update GPS Heading
  // --------------------------------------------------------------------------
  function updateGPSHeading(currentGPShead){
    var currentGPShead = $.trim(currentGPShead);
    if($.isNumeric(currentGPShead) && currentGPShead != lastGPSheadingValue){
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
          if(language == 'DE'){
            direction = direction.replace(/E/g, "O");
          }
          if(language == 'FR'){
            direction = direction.replace(/W/g, "O");
          }
          if(language == 'TR'){
            direction = direction.replace(/N/g, "K");
            direction = direction.replace(/S/g, "G");
            direction = direction.replace(/E/g, "D");
            direction = direction.replace(/W/g, "B");
          }
          $('.gpsHeading').text(direction);
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
        if(language == 'DE'){
          direction = direction.replace(/E/g, "O");
        }
        if(language == 'FR'){
          direction = direction.replace(/W/g, "O");
        }
        if(language == 'TR'){
          direction = direction.replace(/N/g, "K");
          direction = direction.replace(/S/g, "G");
          direction = direction.replace(/E/g, "D");
          direction = direction.replace(/W/g, "B");
        }
        $('.gpsHeading').text(direction);
        lastGPSheadingValue = currentGPShead;
      }
    }
  }
  // --------------------------------------------------------------------------

  // update GPS latitude
  // --------------------------------------------------------------------------
  function updateGPSLatitude(currentGPSlat){
    var currentGPSlat = $.trim(currentGPSlat);
    if($.isNumeric(currentGPSlat)){
      GPSlatCurrent = parseFloat(currentGPSlat).toFixed(4);
      // North
      if(GPSlatCurrent > 0){
        $('.gpsLatitudeValue').html(GPSlatCurrent+'&deg;').removeClass("lat_s").addClass("lat_n");
        // South
      } else {
        $('.gpsLatitudeValue').html(Math.abs(GPSlatCurrent)+'&deg;').removeClass("lat_n").addClass("lat_s");
      }
      if(language == 'TR'){
        $('.gpsLatitudeValue').addClass("tr");
      }
    }
  }
  // --------------------------------------------------------------------------

  // update GPS longitude
  // --------------------------------------------------------------------------
  function updateGPSLongitude(currentGPSlon){
    var currentGPSlon = $.trim(currentGPSlon);
    if($.isNumeric(currentGPSlon)){
      GPSlonCurrent = parseFloat(currentGPSlon).toFixed(4);
      // East
      if(GPSlonCurrent > 0){
        $('.gpsLongitudeValue').html(GPSlonCurrent+'&deg;').removeClass("lon_w").addClass("lon_e");
        // West
      } else {
        $('.gpsLongitudeValue').html(Math.abs(GPSlonCurrent)+'&deg;').removeClass("lon_e").addClass("lon_w");
      }
      if(language == 'DE'){
        $('.gpsLongitudeValue').addClass("de");
      }
      if(language == 'TR'){
        $('.gpsLongitudeValue').addClass("tr");
      }
      if(language == 'FR'){
        $('.gpsLongitudeValue').addClass("fr");
      }
    }
  }
  // --------------------------------------------------------------------------

  // update Engine Speed
  // --------------------------------------------------------------------------
  function updateEngineSpeed(currentEngineSpeed){
    var currentEngineSpeed = $.trim(currentEngineSpeed);
    if($.isNumeric(currentEngineSpeed)){
      engineSpeedCurrent = Math.round(currentEngineSpeed * 2);
      if(engineSpeedCurrent <= 8000){

        // update engine top speed
        // --------------------------------------------------------------------------
        if(engineSpeedCurrent > engineSpeedTop){
          $('.topRPMIndicator').css("transform","rotate("+(-145-engineSpeedCurrent*0.01)+"deg)");
          engineSpeedTop = engineSpeedCurrent;
        }
        // --------------------------------------------------------------------------

        // update engine speed
        // --------------------------------------------------------------------------
        $('.RPMIndicator').css("transform","rotate("+(-145-engineSpeedCurrent*0.01)+"deg)");
        // --------------------------------------------------------------------------
      }
    }
  }
  // --------------------------------------------------------------------------

  setInterval(function (){
    updateTripTime();
    if(speedCurrent == 0){
      updateIdleTime(speedCurrent);
    }
    if ((enableSmallSbSpeedo) && (!$('#SbSpeedo').hasClass('parking'))) {
      var visibleIcons = 0;
      $('.StatusBarCtrlIconContainer .StatusBarCtrlIcon').each(function(index) {
        if($(this).is(':visible'))
          visibleIcons++;
      });
      if(visibleIcons > 3){
        $('#SbSpeedo').addClass('morespace');
      } else {
        $('#SbSpeedo').removeClass('morespace');
      }
    }
  }, 1000);

  setInterval(function (){
    if((enableSmallSbSpeedo) && (!$('#SbSpeedo').hasClass('parking'))){
      $('#SbSpeedo .gpsHeading').fadeOut();
      $('#SbSpeedo .gpsAltitudeValue').fadeIn();
    }
    setTimeout(function(){
      if((enableSmallSbSpeedo) && (!$('#SbSpeedo').hasClass('parking'))){
        $('#SbSpeedo .gpsAltitudeValue').fadeOut();
        $('#SbSpeedo .gpsHeading').fadeIn();
      }
    }, 2000);
  }, 4000);

  setTimeout(function(){
    retrievedata('vehicleData');
    retrievedata('envData');
    /*retrievedata('vehicleSpeed');
    retrievedata('gpsdata');
    retrievedata('totfuelEfficiency');
    retrievedata('fuelEfficiency');
    retrievedata('drivedist');
    retrievedata('engineSpeed');*/
  }, 35000);

});
