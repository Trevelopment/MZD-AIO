// try not to make changes to the lines below
/* jshint -W116, -W117 */
let tripDistCurrent = 0;
let prevTripDist = 0;
let tripDistBkp = 0;
let tripDist = 0;
let speedCurrent = 0;
let speedSumTotal = 0;
let speedTop = 0;
let speedAvg = 0;
let GPSspeedCurrent = 0;
let GPSaltCurrent = 0;
let FuelEfficiency = '---';
let AvgFuelEfficiency = '---';
let TotFuelEfficiency = '---';
let idleTimeValue = '0:00';
let engONidleTimeValue = '0:00';
let lastGPSheadingValue = 999;
let GPSlatCurrent = '---';
let GPSlonCurrent = '---';
let altGPSmin = 9999;
let altGPSmax = -9999;
let totalTripSeconds = 0;
let totalIdleSeconds = 0;
let totalEngineOnSeconds = 0;
let totalMoveCount = 0;
let direction = '---';
let engineSpeedCurrent = 0;
let engineSpeedTop = 0;
let outsideTemp = 0;
let intakeTemp = 0;
let coolantTemp = 0;
const gearPos = '---';
const lastGPSspeedValue = 0;
const lastEnginespeedValue = 0;
let lastGearPositionValue = '---';
let lastGearLeverPositionValue = '---';
let fuelGaugeMax = 184;
let lastFuelGaugeValue = 0;
let lastFuelGaugePercent = 0;
let BatSOC = 0;
const BatSOCmax = 200;
let lastEngineLoadValue = 0;
let swapOut = null;
const currDataBar = 1;
let backgroundColor = '';
let automaticTrans = false;
const speedometerLonghold = false;
const hideSpeedFuel = false;
let speedometerLayout = null;
let speedoClassicLayout = null;
const speedometerIcon = 'apps/_speedometer/IcnSbnSpeedometer.png';
let vehicleDataConnected = false;
let gpsDataConnected = false;
let envDataConnected = false;
let speedConnectAttempts = 0;
let speedConnectRetries = 0;
const speedConMaxRetries = 20;

$.ajax({
  url: 'addon-common/cufon-yui.js',
  dataType: 'script',
  success: function(data) {
    $.ajax({
      url: 'addon-common/jquery.flot.min.js',
      dataType: 'script',
      success: function(data) {
        Cufon.now();
      },
      complete: function() {},
    });
  },
});
$(document).ready(function() {
  // websocket
  // --------------------------------------------------------------------------
  function retrievedata(action) {
    const speedometerWs = new WebSocket('ws://127.0.0.1:9969/');
    speedometerWs.onmessage = function(event) {
      const res = event.data.split('#');
      switch (res[0]) {
        case 'vehicleSpeed':
          updateVehicleSpeed(res[1]);
          break;
        case 'vehdata':
          vehicleDataConnected = true;
          updateEngineSpeed(res[1]);
          updateTripDist(res[2]);
          break;
        case 'gpsdata':
          gpsDataConnected = true;
          updateGPSSpeed(res[1]);
          updateGPSAltitude(res[2]);
          updateGPSHeading(res[3]);
          updateGPSLatitude(res[4]);
          updateGPSLongitude(res[5]);
          break;
        case 'envdata':
          envDataConnected = true;
          updateFuelEfficiency(res[1]);
          updateTotFuelEfficiency(res[2]);
          updateAvgFuelEfficiency(res[3]);
          updateOutsideTemp(res[4]);
          updateIntakeTemp(res[5]);
          updateCoolantTemp(res[6]);
          updateGearPos(res[7]);
          updateFuelGauge(res[8]);
          updateBatSOC(res[9]);
          updateGearLeverPos(res[10]);
          updateEngineLoad(res[11]);
          break;
        default:
          break;
      }
    };
    speedometerWs.onopen = function() {
      speedometerWs.send(action);
    };
    speedometerWs.onerror = function(e) {
      if (speedConnectRetries >= speedConMaxRetries) {
        AIO_SBN('Failed To Start Speedometer', speedometerIcon);
        console.log('Speedometer Failed to connect to Websocket');
      } else if (speedConnectRetries < speedConnectAttempts) {
        speedConnectRetries++;
        startDataRetrieval(5000);
      }
    };
  }
  // websocket end
  // --------------------------------------------------------------------------
  // Start Data Retreval
  // --------------------------------------------------------------------------
  function startDataRetrieval(wait) {
    setTimeout(function() {
      speedConnectAttempts++;
      if (!vehicleDataConnected) {
        retrievedata('vehicleSpeed');
        retrievedata('vehicleData');
        envDataConnected || retrievedata('envData');
        gpsDataConnected || retrievedata('gpsData');
      }
    }, wait || 5000);
  }
  // update trip time
  // --------------------------------------------------------------------------
  function updateTripTime() {
    totalTripSeconds++;
    const hours = Math.floor(totalTripSeconds / 3600);
    let minutes = Math.floor((totalTripSeconds - (hours * 3600)) / 60);
    let seconds = totalTripSeconds - (hours * 3600) - (minutes * 60);
    if (hours > 0 && minutes < 10) {minutes = '0' + minutes;}
    if (seconds < 10) {seconds = '0' + seconds;}
    if (hours > 0) {
      $('.tripTimeValue').html(hours + ':' + minutes + ':' + seconds);
    } else {
      $('.tripTimeValue').html(minutes + ':' + seconds);
    }
    if (totalIdleSeconds > 0) {
      const IdlePercent = Math.round(totalIdleSeconds / totalTripSeconds * 100);
      $('.idleTimeValue').html('<span class="idlePercent">(' + IdlePercent + '%)</span>' + idleTimeValue);
    }
    if (totalEngineOnSeconds > 0) {
      const engONidlePercent = Math.round(totalEngineOnSeconds / totalTripSeconds * 100);
      $('.engineIdleTimeValue').html('<span class="idlePercent">(' + engONidlePercent + '%)</span>' + engONidleTimeValue);
    }
  }
  // --------------------------------------------------------------------------
  // update idle times
  // --------------------------------------------------------------------------
  function updateIdleTime(speed) {
    // update stop time
    // --------------------------------------------------------------------------
    if (speed === 0 && totalTripSeconds > 21) {
      totalIdleSeconds++;
      const hours = Math.floor(totalIdleSeconds / 3600);
      let minutes = Math.floor((totalIdleSeconds - (hours * 3600)) / 60);
      let seconds = totalIdleSeconds - (hours * 3600) - (minutes * 60);
      if (hours > 0 && minutes < 10) {minutes = '0' + minutes;}
      if (seconds < 10) {seconds = '0' + seconds;}
      if (hours > 0) {
        idleTimeValue = ('<span class="idleHours">' + hours + ':' + minutes + ':' + seconds + '</span>');
      } else {
        idleTimeValue = (minutes + ':' + seconds);
      }
    }
    // update engine idle time
    // --------------------------------------------------------------------------
    if (speed === 0 && engineSpeedCurrent > 0 && totalTripSeconds > 21) {
      totalEngineOnSeconds++;
      const hoursE = Math.floor(totalEngineOnSeconds / 3600);
      let minutesE = Math.floor((totalEngineOnSeconds - (hoursE * 3600)) / 60);
      let secondsE = totalEngineOnSeconds - (hoursE * 3600) - (minutesE * 60);
      if (hoursE > 0 && minutesE < 10) {minutesE = '0' + minutesE;}
      if (secondsE < 10) {secondsE = '0' + secondsE;}
      if (hoursE > 0) {
        engONidleTimeValue = ('<span class="idleHours">' + hoursE + ':' + minutesE + ':' + secondsE + '</span>');
      } else {
        engONidleTimeValue = (minutesE + ':' + secondsE);
      }
    }
  }
  // --------------------------------------------------------------------------
  // update vehicle speed
  // --------------------------------------------------------------------------
  function updateVehicleSpeed(currentSpeed) {
    currentSpeed = $.trim(currentSpeed);
    if ($.isNumeric(currentSpeed)) {
      if (isMPH) {
        speedCurrent = Math.round(currentSpeed * 0.006213712);
      } else {
        speedCurrent = Math.round(currentSpeed * 0.01);
      }
      // update vehicle top speed
      // --------------------------------------------------------------------------
      if (speedCurrent > speedTop) {
        speedTop = speedCurrent;
        if (barSpeedometerMod) {
          $('.speedTopValue').html(speedTop);
          $('.engineSpeedTopValue').html(engineSpeedTop);
        } else {
          $('.speedTopValue').html('<span>(' + engineSpeedTop + ')</span>' + speedTop);
          if (isMPH) {
            $('.topSpeedIndicator').css('transform', 'rotate(' + (-120 + speedCurrent * 2) + 'deg)');
          } else {
            $('.topSpeedIndicator').css('transform', 'rotate(' + (-120 + speedCurrent) + 'deg)');
          }
        }
      }
      // --------------------------------------------------------------------------
      // update vehicle average speed
      // --------------------------------------------------------------------------
      if (speedCurrent > 0) {
        totalMoveCount++;
        speedSumTotal += speedCurrent;
        const avgSpeed = Math.round(speedSumTotal / totalMoveCount);
        if (speedAvg !== avgSpeed) {
          speedAvg = avgSpeed;
          $('.speedAvgValue').html(speedAvg);
        }
      }
      // --------------------------------------------------------------------------
      // update vehicle current speed
      // --------------------------------------------------------------------------
      if (!barSpeedometerMod) {
        if (isMPH) {
          $('.speedIndicator').css('transform', 'rotate(' + (-120 + speedCurrent * 2) + 'deg)');
        } else {
          $('.speedIndicator').css('transform', 'rotate(' + (-120 + speedCurrent) + 'deg)');
        }
      }
      $('.vehicleSpeed').each(function() {
        const $this = $(this);
        $({Counter: $this.text()}).animate({Counter: speedCurrent}, {
          duration: 950,
          easing: 'linear',
          step: function(now) {
            const speedCurr = Math.round(now);
            if (speedAnimation) {
              $this.text(speedCurr);
            }
            if (!engineSpeedBar) {
              updateSpeedBar(Math.round(isMPH ? speedCurr * 1.6 : speedCurr));
            }
          },
          complete: function() {},
        });
      });
      if (!speedAnimation) {
        $('.vehicleSpeed').text(speedCurrent);
      }
      // cufon stuff
      // --------------------------------------------------------------------------
      Cufon.replace('#digital .vehicleSpeed');
      // --------------------------------------------------------------------------
    }
  }
  // --------------------------------------------------------------------------
  // update total fuel efficiency
  // --------------------------------------------------------------------------
  function updateTotFuelEfficiency(totfuelEff) {
    totfuelEff = $.trim(totfuelEff);
    if ($.isNumeric(totfuelEff) && totfuelEff !== '0') {
      if (isMPH) {
        // 1 km/L = 2.3521458 US MPG
        TotFuelEfficiency = (Math.round(totfuelEff * 2.3521458) / 10);
      } else {
        if (fuelEffunit_kml) {
          TotFuelEfficiency = parseFloat((Math.round(totfuelEff) / 10).toFixed(1));
        } else {
          // converts km/L to L/100km
          TotFuelEfficiency = parseFloat((Math.round(10000 / totfuelEff) / 10).toFixed(1));
        }
      }
      if (language === 'DE' || language === 'FR') {
        TotFuelEfficiency = TotFuelEfficiency.toString().replace('.', ',');
      }
      if (barSpeedometerMod) {
        $('.TotFuelEfficiency').html(TotFuelEfficiency);
      }
    }
  }
  // --------------------------------------------------------------------------
  // update fuel efficiency
  // --------------------------------------------------------------------------
  function updateFuelEfficiency(currentfuelEff) {
    currentfuelEff = $.trim(currentfuelEff);
    if ($.isNumeric(currentfuelEff) && currentfuelEff !== '0') {
      if (isMPH) {
        // 1 km/L = 2.3521458 US MPG
        FuelEfficiency = (Math.round(currentfuelEff * 2.3521458) / 10);
      } else {
        if (fuelEffunit_kml) {
          FuelEfficiency = parseFloat((Math.round(currentfuelEff) / 10).toFixed(1));
        } else {
          // converts km/L to L/100km
          FuelEfficiency = parseFloat((Math.round(10000 / currentfuelEff) / 10).toFixed(1));
        }
      }
      if (language === 'DE' || language === 'FR') {
        FuelEfficiency = FuelEfficiency.toString().replace('.', ',');
      }
      if (barSpeedometerMod) {
        $('.Drv1AvlFuelEValue').html(FuelEfficiency);
      } else {
        $('.Drv1AvlFuelEValue').html('<span>(' + TotFuelEfficiency + ')</span>' + FuelEfficiency);
      }
    } else {
      $('.Drv1AvlFuelEValue').html('---');
    }
  }
  // --------------------------------------------------------------------------
  // update average fuel efficiency
  // --------------------------------------------------------------------------
  function updateAvgFuelEfficiency(avgfuelEff) {
    avgfuelEff = $.trim(avgfuelEff);
    if ($.isNumeric(avgfuelEff) && avgfuelEff !== '0') {
      if (isMPH) {
        // 1 km/L = 2.3521458 US MPG
        AvgFuelEfficiency = (Math.round(avgfuelEff * 2.3521458) / 100);
      } else {
        if (fuelEffunit_kml) {
          AvgFuelEfficiency = parseFloat((Math.round(avgfuelEff) / 100).toFixed(1));
        } else {
          // converts km/L to L/100km
          AvgFuelEfficiency = parseFloat(Math.round(10000 / avgfuelEff).toFixed(1));
        }
      }
      if (language === 'DE' || language === 'FR') {
        AvgFuelEfficiency = AvgFuelEfficiency.toString().replace('.', ',');
      }
      $('.avgFuelValue').html(AvgFuelEfficiency);
    }
  }
  // --------------------------------------------------------------------------
  // update trip distance
  // --------------------------------------------------------------------------
  function updateTripDist(currtripDist) {
    currtripDist = $.trim(currtripDist);
    if ($.isNumeric(currtripDist)) {
      if (currtripDist > 0) {
        tripDistCurrent = parseFloat(currtripDist) + parseFloat(tripDistBkp);
        if (currtripDist > 2) {
          prevTripDist = tripDistCurrent;
        }
      }
      if (currtripDist >= 0 && currtripDist <= 2 && prevTripDist > 0) {
        tripDistBkp = prevTripDist;
      }
      if (isMPH) {
        tripDist = parseFloat((tripDistCurrent * 0.02 * 0.6213712).toFixed(2));
      } else {
        tripDist = parseFloat((tripDistCurrent * 0.02).toFixed(2));
      }
      if (language === 'DE' || language === 'FR') {
        tripDist = tripDist.toString().replace('.', ',');
      }
      $('.tripDistance').html(tripDist);
    }
  }
  // --------------------------------------------------------------------------
  // update GPS speed
  // --------------------------------------------------------------------------
  function updateGPSSpeed(currentGPSSpeed) {
    currentGPSSpeed = $.trim(currentGPSSpeed);
    if ($.isNumeric(currentGPSSpeed)) {
      if (isMPH) {
        GPSspeedCurrent = Math.floor(currentGPSSpeed * 0.6213712);
      } else {
        GPSspeedCurrent = Math.floor(currentGPSSpeed);
      }
      if (speedAnimation) {
        $('.gpsSpeedValue').each(function() {
          const $this = $(this);
          $({Counter: $this.text()}).animate({Counter: GPSspeedCurrent}, {
            duration: 950,
            easing: 'linear',
            step: function(now) {
              $this.text(Math.round(now));
            },
            complete: function() {},
          });
        });
      } else {
        $('.gpsSpeedValue').text(GPSspeedCurrent);
      }
    }
  }
  // --------------------------------------------------------------------------
  // update GPS altitude
  // --------------------------------------------------------------------------
  function updateGPSAltitude(currentGPSalt) {
    currentGPSalt = $.trim(currentGPSalt);
    if ($.isNumeric(currentGPSalt) && currentGPSalt !== GPSaltCurrent) {
      if (isMPH) {
        GPSaltCurrent = Math.round(currentGPSalt * 3.28084);
      } else {
        GPSaltCurrent = Math.round(currentGPSalt);
      }
      // update max altitude
      // --------------------------------------------------------------------------
      if (GPSaltCurrent > altGPSmax) {
        altGPSmax = GPSaltCurrent;
        // $('.gpsAltitudeMax').text(altGPSmax);
      }
      // --------------------------------------------------------------------------
      // update min altitude
      // --------------------------------------------------------------------------
      if (GPSaltCurrent < altGPSmin && GPSaltCurrent !== 0) {
        altGPSmin = GPSaltCurrent;
        // $('.gpsAltitudeMin').text(altGPSmin);
      }
      // --------------------------------------------------------------------------
      if (altGPSmin !== 9999) {
        $('.gpsAltitudeMinMax').html(altGPSmin + ' / ' + altGPSmax);
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
  function updateGPSHeading(currentGPShead) {
    currentGPShead = $.trim(currentGPShead);
    if ($.isNumeric(currentGPShead) && currentGPShead !== lastGPSheadingValue) {
      // without NavSD
      if (noNavSD) {
        if (speedCurrent > 0) {
          $('.gpsCompassBG').css('transform', 'rotate(' + (-Math.round(currentGPShead)) + 'deg)');
          // Mazda Infotainment System GPS heading is S = 0/360 degrees even though docs say otherwise, YMMV
          headingSwitchValue = Math.round(currentGPShead / 22.5);
          // Close enough
          switch (headingSwitchValue) {
            case 1: direction = 'NNE'; break;
            case 2: direction = 'NE'; break;
            case 3: direction = 'ENE'; break;
            case 4: direction = 'E'; break;
            case 5: direction = 'ESE'; break;
            case 6: direction = 'SE'; break;
            case 7: direction = 'SSE'; break;
            case 8: direction = 'S'; break;
            case 9: direction = 'SSW'; break;
            case 10: direction = 'SW'; break;
            case 11: direction = 'WSW'; break;
            case 12: direction = 'W'; break;
            case 13: direction = 'WNW'; break;
            case 14: direction = 'NW'; break;
            case 15: direction = 'NNW'; break;
            default: direction = 'N';
          }
          if (language === 'DE') {
            direction = direction.replace(/E/g, 'O');
          }
          if (language === 'FR') {
            direction = direction.replace(/W/g, 'O');
          }
          if (language === 'TR') {
            direction = direction.replace(/N/g, 'K');
            direction = direction.replace(/S/g, 'G');
            direction = direction.replace(/E/g, 'D');
            direction = direction.replace(/W/g, 'B');
          }
          $('.gpsHeading').html(direction);
          lastGPSheadingValue = currentGPShead;
        }
        // with NavSD
      } else {
        $('.gpsCompassBG').css('transform', 'rotate(' + (-Math.abs(currentGPShead) + 180) + 'deg)');
        // Mazda Infotainment System GPS heading is S = 0/360 degrees even though docs say otherwise, YMMV
        headingSwitchValue = Math.round(currentGPShead / 22.5);
        // Close enough
        switch (headingSwitchValue) {
          case 1: direction = 'SSW'; break;
          case 2: direction = 'SW'; break;
          case 3: direction = 'WSW'; break;
          case 4: direction = 'W'; break;
          case 5: direction = 'WNW'; break;
          case 6: direction = 'NW'; break;
          case 7: direction = 'NNW'; break;
          case 8: direction = 'N'; break;
          case 9: direction = 'NNE'; break;
          case 10: direction = 'NE'; break;
          case 11: direction = 'ENE'; break;
          case 12: direction = 'E'; break;
          case 13: direction = 'ESE'; break;
          case 14: direction = 'SE'; break;
          case 15: direction = 'SSE'; break;
          default: direction = 'S';
        }
        if (language === 'DE') {
          direction = direction.replace(/E/g, 'O');
        }
        if (language === 'FR') {
          direction = direction.replace(/W/g, 'O');
        }
        if (language === 'TR') {
          direction = direction.replace(/N/g, 'K');
          direction = direction.replace(/S/g, 'G');
          direction = direction.replace(/E/g, 'D');
          direction = direction.replace(/W/g, 'B');
        }
        $('.gpsHeading').html(direction);
        lastGPSheadingValue = currentGPShead;
      }
    }
  }
  // --------------------------------------------------------------------------
  // update GPS latitude
  // --------------------------------------------------------------------------
  function updateGPSLatitude(currentGPSlat) {
    currentGPSlat = $.trim(currentGPSlat);
    if ($.isNumeric(currentGPSlat)) {
      GPSlatCurrent = parseFloat(currentGPSlat).toFixed(4);
      // North
      if (GPSlatCurrent > 0) {
        $('.gpsLatitudeValue').html(GPSlatCurrent + '&deg;').removeClass('lat_s').addClass('lat_n');
        // South
      } else {
        $('.gpsLatitudeValue').html(Math.abs(GPSlatCurrent) + '&deg;').removeClass('lat_n').addClass('lat_s');
      }
      if (language === 'TR') {
        $('.gpsLatitudeValue').addClass('tr');
      }
    }
  }
  // --------------------------------------------------------------------------
  // update GPS longitude
  // --------------------------------------------------------------------------
  function updateGPSLongitude(currentGPSlon) {
    currentGPSlon = $.trim(currentGPSlon);
    if ($.isNumeric(currentGPSlon)) {
      GPSlonCurrent = parseFloat(currentGPSlon).toFixed(4);
      // East
      if (GPSlonCurrent > 0) {
        $('.gpsLongitudeValue').html(GPSlonCurrent + '&deg;').removeClass('lon_w').addClass('lon_e');
        // West
      } else {
        $('.gpsLongitudeValue').html(Math.abs(GPSlonCurrent) + '&deg;').removeClass('lon_e').addClass('lon_w');
      }
      if (language === 'DE') {
        $('.gpsLongitudeValue').addClass('de');
      }
      if (language === 'FR') {
        $('.gpsLongitudeValue').addClass('fr');
      }
      if (language === 'TR') {
        $('.gpsLongitudeValue').addClass('tr');
      }
    }
  }
  // --------------------------------------------------------------------------
  // update Engine Speed
  // --------------------------------------------------------------------------
  function updateEngineSpeed(currentEngineSpeed) {
    currentEngineSpeed = $.trim(currentEngineSpeed);
    if ($.isNumeric(currentEngineSpeed)) {
      engineSpeedCurrent = Math.round(currentEngineSpeed * 2);
      if (engineSpeedCurrent <= 8000) {
        // update engine top speed
        // --------------------------------------------------------------------------
        if (engineSpeedCurrent > engineSpeedTop) {
          engineSpeedTop = engineSpeedCurrent;
          if (barSpeedometerMod) {
            $('.engineSpeedTopValue').html(engineSpeedTop);
          } else {
            $('.topRPMIndicator').css('transform', 'rotate(' + (-145 - engineSpeedCurrent * 0.01) + 'deg)');
            $('.speedTopValue').html('<span>(' + engineSpeedTop + ')</span>' + speedTop);
          }
        }
        // update engine speed
        // --------------------------------------------------------------------------
        if (!barSpeedometerMod) {
          $('.RPMIndicator').css('transform', 'rotate(' + (-145 - engineSpeedCurrent * 0.01) + 'deg)');
        }
        $('.engineSpeedValue').each(function() {
          const $this = $(this);
          $({Counter: $this.text()}).animate({Counter: engineSpeedCurrent}, {
            duration: 950,
            easing: 'linear',
            step: function(now) {
              const engineSpeedCurr = Math.round(now);
              if (speedAnimation) {
                $this.text(engineSpeedCurr);
              }
              if (engineSpeedBar) {
                updateSpeedBar(Math.round(engineSpeedCurr / 45));
              }
            },
            complete: function() {
              // do nothing
            },
          });
        });
        if (!speedAnimation) {
          $('.engineSpeedValue').text(engineSpeedCurrent);
        }
      }
    }
  }
  // --------------------------------------------------------------------------
  // Update Outside Temperature
  // --------------------------------------------------------------------------
  function updateOutsideTemp(outTemp) {
    outTemp = $.trim(outTemp);
    if ($.isNumeric(outTemp) && outTemp !== '0') {
      outsideTemp = outTemp -= 40;
      if (tempIsF) {
        outTemp = outTemp * 1.8 + 32;
        outsideTemp = parseFloat(outTemp.toFixed(1));
      }
      outsideTemp += '&deg;';
    } else {
      outsideTemp = '---';
    }
    $('.outsideTempValue').html(outsideTemp);
  }
  // --------------------------------------------------------------------------
  // Update Intake Temperature
  // --------------------------------------------------------------------------
  function updateIntakeTemp(inTemp) {
    inTemp = $.trim(inTemp);
    if ($.isNumeric(inTemp) && inTemp !== '0') {
      intakeTemp = inTemp -= 40;
      if (tempIsF) {
        inTemp = inTemp * 1.8 + 32;
        intakeTemp = parseFloat(inTemp.toFixed(1));
      }
      intakeTemp += '&deg;';
    } else {
      intakeTemp = '---';
    }
    $('.intakeTempValue').html(intakeTemp);
  }
  // --------------------------------------------------------------------------
  // Update Coolant Temperature
  // --------------------------------------------------------------------------
  function updateCoolantTemp(coolTemp) {
    coolTemp = $.trim(coolTemp);
    let tempColor = '';
    if ($.isNumeric(coolTemp) && coolTemp !== '0') {
      coolantTemp = coolTemp -= 40;
      if (coolTemp < 55) tempColor = 'yellow'; // engine cold light threshold
      if (coolTemp < 30) tempColor = 'blue'; // engine too cold for start
      if (tempIsF) {
        coolTemp = coolTemp * 1.8 + 32;
        coolantTemp = parseFloat(coolTemp.toFixed(1));
      }
      coolantTemp += '&deg;';
    } else {
      coolantTemp = '---';
    }
    $('.coolantTempValue').css('color', tempColor);
    $('.coolantTempValue').html(coolantTemp);
  }
  // --------------------------------------------------------------------------
  // Update Gear Position
  // --------------------------------------------------------------------------
  function updateGearPos(gearPos) {
    gearPos = $.trim(gearPos);
    if ($.isNumeric(gearPos) && automaticTrans) {
      lastGearPositionValue = gearPos;
      $('.gearPositionValue').html(lastGearPositionValue);
    }
  }
  // --------------------------------------------------------------------------
  // Update Gear Lever Position
  // --------------------------------------------------------------------------
  function updateGearLeverPos(gearLeverPos) {
    gearLeverPos = $.trim(gearLeverPos);
    if ($.isNumeric(gearLeverPos) && gearLeverPos !== '0') {
      switch (gearLeverPos) {
        case '1': lastGearLeverPositionValue = 'P'; break;
        case '2': lastGearLeverPositionValue = 'R'; break;
        case '3': lastGearLeverPositionValue = 'N'; break;
        case '4': lastGearLeverPositionValue = 'D'; break;
        default: lastGearLeverPositionValue = '---';
      }
      $('.gearLeverPositionValue').html(lastGearLeverPositionValue);
      automaticTrans = true;
    }
  }
  // --------------------------------------------------------------------------
  // Update Fuel Gauge
  // --------------------------------------------------------------------------
  function updateFuelGauge(fuelGaugeVal) {
    fuelGaugeVal = $.trim(fuelGaugeVal);
    if ($.isNumeric(fuelGaugeVal)) {
      if (fuelGaugeVal > fuelGaugeMax) {
        fuelGaugeMax = Math.ceil(fuelGaugeVal);
      }
      const nextFuelPer = Math.round((fuelGaugeVal / fuelGaugeMax) * 100);
      lastFuelGaugePercent = Math.abs(lastFuelGaugePercent - nextFuelPer) < 3 || lastFuelGaugePercent === 0 ? nextFuelPer : (nextFuelPer < lastFuelGaugePercent ? lastFuelGaugePercent - 3 : lastFuelGaugePercent + 3);
      lastFuelGaugeValue = parseFloat((Math.round((fuelGaugeFactor / 10) * lastFuelGaugePercent) / 10).toFixed(1));
      $('.fuelGaugeValue').html(lastFuelGaugeValue + (fuelGaugeValueSuffix === '%' ? '%' : ''));
      $('.fuel-bar').css('width', lastFuelGaugePercent + '%');
      if (lastFuelGaugePercent > 80) {
        $('.fuel-bar').css('background-color', fuelBarColor_80to100);
      } else if (lastFuelGaugePercent > 60) {
        $('.fuel-bar').css('background-color', fuelBarColor_60to80);
      } else if (lastFuelGaugePercent > 40) {
        $('.fuel-bar').css('background-color', fuelBarColor_40to60);
      } else if (lastFuelGaugePercent > 20) {
        $('.fuel-bar').css('background-color', fuelBarColor_20to40);
      } else {
        $('.fuel-bar').css('background-color', fuelBarColor_0to20);
      }
    }
  }


  // --------------------------------------------------------------------------
  // Update Battery Charge
  // --------------------------------------------------------------------------
  function updateBatSOC(currBatSOC) {
    if (currBatSOC === '255') {
      $('.batSOCValue').html('---');
    } else if (currBatSOC === '254') {
      $('.batSOCValue').html('<span class="istoperr">iStop ERR</span>');
    } else {
      currBatSOC = $.trim(currBatSOC);
      if ($.isNumeric(currBatSOC)) {
        BatSOC = ((currBatSOC / BatSOCmax * 100).toFixed(1)).toString();
        if (language === 'DE' || language === 'FR') {
          BatSOC = BatSOC.replace('.', ',');
        }
        $('.batSOCValue').html(BatSOC);
      }
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
  setInterval(function() {
    updateTripTime();
    if (speedCurrent === 0) {
      updateIdleTime(speedCurrent);
    }
    if ((enableSmallSbSpeedo) && (!$('#SbSpeedo').hasClass('parking'))) {
      let visibleIcons = 0;
      $('.StatusBarCtrlIconContainer .StatusBarCtrlIcon').each(function(index) {
        if ($(this).css('display').indexOf('inline-block') !== -1) visibleIcons++;
      });
      if (visibleIcons > 3) {
        $('#SbSpeedo, .StatusBarCtrlIconContainer:nth-child(2)').addClass('morespace');
      } else {
        $('#SbSpeedo, .StatusBarCtrlIconContainer:nth-child(2)').removeClass('morespace');
      }
    }
  }, 1000);
  if (SbVal1 !== 'hidden' && SbVal2 !== 'hidden') {
    setInterval(function() {
      const sbSpeedoVal1 = $('#SbSpeedo .' + SbVal1);
      const sbSpeedoVal2 = $('#SbSpeedo .' + SbVal2);
      if ((enableSmallSbSpeedo) && (!$('#SbSpeedo').hasClass('parking'))) {
        sbSpeedoVal1.fadeOut();
        sbSpeedoVal2.fadeIn();
        setTimeout(function() {
          sbSpeedoVal2.fadeOut();
          sbSpeedoVal1.fadeIn();
        }, sbInterval);
      }
    }, sbInterval * 2);
  }

  function updateSpeedBar(speed) {
    if (barSpeedometerMod) {
      for (let i = 150; i >= 105; i -= 5) {
        const barClassName = '.speedBar_' + i;
        if (speed >= i) {
          switch (i) {
            case 150: backgroundColor = '#FF0000'; break;
            case 145: backgroundColor = '#FF0000'; break;
            case 140: backgroundColor = '#FF0000'; break;
            case 135: backgroundColor = '#FF0000'; break;
            case 130: backgroundColor = '#FF0000'; break;
            case 125: backgroundColor = '#FE2E2E'; break;
            case 120: backgroundColor = '#FF451C'; break;
            case 115: backgroundColor = '#FF6932'; break;
            case 110: backgroundColor = '#FE9A2E'; break;
            case 105: backgroundColor = '#FECC20'; break;
          }
          $(barClassName).css({'background-color': backgroundColor});
        } else {
          $(barClassName).css({'background-color': 'transparent'});
        }
      }
      for (let j = 100; j >= 55; j -= 5) {
        const barClassName2 = '.speedBar_' + j;
        if (speed >= j) {
          switch (j) {
            case 100: backgroundColor = '#FFED2E'; break;
            case 95: backgroundColor = '#FFF430'; break;
            case 90: backgroundColor = '#F7FE2E'; break;
            case 85: backgroundColor = '#C8FE2E'; break;
            case 80: backgroundColor = '#9AFE2E'; break;
            case 75: backgroundColor = '#64FE2E'; break;
            case 70: backgroundColor = '#2EFE2E'; break;
            case 65: backgroundColor = '#2EFE64'; break;
            case 60: backgroundColor = '#2EFE9A'; break;
            case 55: backgroundColor = '#58FAD0'; break;
          }
          $(barClassName2).css({'background-color': backgroundColor});
        } else {
          $(barClassName2).css({'background-color': 'transparent'});
        }
      }
      for (let k = 50; k >= 5; k -= 5) {
        const barClassName3 = '.speedBar_' + k;
        if (speed >= k) {
          switch (k) {
            case 50: backgroundColor = '#58FAD0'; break;
            case 45: backgroundColor = '#58FAD0'; break;
            case 40: backgroundColor = '#58FAD0'; break;
            case 35: backgroundColor = '#58FAD0'; break;
            case 30: backgroundColor = '#58FAD0'; break;
            case 25: backgroundColor = '#81F7D8'; break;
            case 20: backgroundColor = '#A9F5E1'; break;
            case 15: backgroundColor = '#CEF6EC'; break;
            case 10: backgroundColor = '#E0F8F1'; break;
            case 5: backgroundColor = '#EFFBF8'; break;
          }
          $(barClassName3).css({'background-color': backgroundColor});
        } else {
          $(barClassName3).css({'background-color': 'transparent'});
        }
      }
    }
  }

  // Start data retrieval
  startDataRetrieval(15000);
});
// Loads the override values from speedometer-config.js
function SpeedometerOverRide(over) {
  if (over) {
    isMPH = SORV.isMPH;
    language = SORV.language;
    fuelEffunit_kml = SORV.fuelEffunit_kml;
    black_background_opacity = SORV.black_background_opacity;
    original_background_image = SORV.original_background_image;
    startAnalog = SORV.startAnalog;
    sbTemp = SORV.sbTemp;
    barSpeedometerMod = SORV.barSpeedometerMod;
    speedMod = SORV.speedMod;
    engineSpeedBar = SORV.engineSpeedBar;
    hideSpeedBar = SORV.hideSpeedBar;
    tempIsF = SORV.tempIsF;
    speedAnimation = SORV.speedAnimation;
    analogColor = SORV.analogColor;
    speedometerTheme = SORV.barTheme;
    if (!SORV.StatusBarSpeedometer) {
      enableSmallSbSpeedo = false;
      $('#SbSpeedo').remove();
    }
    fuelGaugeFactor = SORV.fuelGaugeFactor;
    fuelGaugeValueSuffix = SORV.fuelGaugeValueSuffix;
  }
}
// Swap FieldSets ~ by Trezdog44
// Tap 2 values in the Bar Speedometer to switch their positions
function SpeedoSwapFieldSets() {
  $('[id*=FieldSet]').click(function(evt) {
    if (swapOut) {
      swapOut.removeClass('swapOut');
      swapOut.children().removeClass('swapOut');
      const temp = $(this);
      const tempClass = temp.attr('class');
      const swapClass = swapOut.attr('class');
      swapOut.removeClass(swapClass).addClass(tempClass);
      temp.removeClass(tempClass).addClass(swapClass);
      if (temp.hasClass('pos0') || swapOut.hasClass('pos0')) {
        AIO_SBN((temp.hasClass('pos0')) ? temp.children('legend').text() : swapOut.children('legend').text(), speedometerIcon);
      }
      // Save the layout
      SaveSpeedBarLayout();
      swapOut = null;
    } else {
      swapOut = $(this);
      swapOut.hasClass('pos0') ? swapOut.children('div').addClass('swapOut') : swapOut.addClass('swapOut');
    }
  });
}

function LoadSpeedoTemplate() {
  // load configuable controls
  if (typeof spdBtn === 'undefined') {
    $.getScript('apps/_speedometer/js/speedometer-controls.js', function(data) {
      $('body').prepend('<script>' + data + '</script>');
    }).fail(function(jqxhr, settings, exception) {
      // in case of failure
      $('body').prepend('<script>let spdBtn={classic:{select:0,up:1,down:2,right:3,left:4,hold:{select:5,up:6,down:7,right:8,left:9}},bar:{select:0,up:1,down:2,right:3,left:4,hold:{select:5,up:6,down:7,right:8,left:9}}};</script>');
    });
  }
  // check that we have loaded our initial template and settings
  if (typeof spdTbl === 'undefined') {
    $.getScript('apps/_speedometer/js/speedometer-config.js', function(data) {
      $('body').prepend('<script>' + data + '</script>');
      SpeedometerOverRide(overRideSpeed);
      classicSpeedoTmplt.sort(function(a, b) {
        return a.pos - b.pos;
      });
    });
  }
}

function SaveSpeedoClassicLayout() {
  speedoClassicLayout = DOMtoJSON(document.getElementById('valuetable'));
}

function SaveSpeedBarLayout() {
  speedometerLayout = DOMtoJSON(document.getElementById('barlayout'));
}

function LoadSpeedoClassicLayout() {
  if (speedoClassicLayout !== null) {
    $('#table_bg').html(JSONtoDOM(speedoClassicLayout));
  }
}

function LoadSpeedBarLayout() {
  if (speedometerLayout !== null) {
    $('#vehdataMainDiv').html(JSONtoDOM(speedometerLayout));
  }
}

function ClearSpeedBarLayout() {
  if (speedometerLayout !== null) {
    speedometerLayout = null;
    $('.activeDataBar').removeClass('activeDataBar');
    AIO_SBN('Layout Reset', speedometerIcon);
    aioMagicRoute('_speedometer', 'Start');
  }
}

utility.loadScript('apps/_speedometer/js/speedometerUpdate.js');
