var speedCurrent = 0;
var speedSumTotal = 0;
var speedTop = 0;
var speedAvg = 0;
var GPSAltitudeCur = 0;
var FuelEfficiency = 0;
var AvgFuelEfficiency = 0;
var TotFuelEfficiency = 0;
var idleTimeValue = '0:00';
var lastGPSheadingValue = 999;
var GPSlatCurrent = 0;
var GPSlonCurrent = 0;
var totalTripSeconds = 0;
var totalIdleSeconds = 0;
var totalTripBSeconds = 0;
var totalIdleBSeconds = 0;
var totalMoveCount = 0;
var bRefreshFuel = false;
var bRefreshFuelManual = false;
var bResetDistance = false;
var sResetDistance = false;
var bRefreshRPMManual = false;
var bRefreshSpeedRestrict120 = false;
var speedRestrictValue = 120;  // set the Speed restrict value here!! (should be set as 120 for thailand legal Mostly is 120 km/h, somewhere is less than)


var gearPos = 0;
var gearPrev = 0;

var egt_temp_lowest = 5;
var egt_temp_normal_start = 50;
var egt_temp_normal_end = 57;  // default = 58  *** , high-sense = 56, dangerous-zone = 65
var egt_temp_lvl1 = 65;  // default = 65 , high-sense = 60, dangerous-zone = 70
var egt_temp_lvl2 = 70;  // default = 75 , high-sense = 65, dangerous-zone = 75


var engineTempC = 0;
var engineTempGauge = 0;
var IntakeAirTempC = 0;
var vehicleSpeedLock = true;
var showSpeed = true;
var gasType='g95';
var refreshFuelDone=false;
var pageInfo=1;
var showInfo=0;

var wheelPos = 0;
var wheelPosPrev = 0;
var disableIAT = 0;
var compassCalibrate = 0;
var showAlarmLayer = 0;
var egtAlarmFg = 0;
var steeringDetect = 0;
var fuelDialogShow = 0;
var fuelDialogPage = 0;
var bathPerLiteActual = "00.00";
var bathPerLiteManual = "00.00";
var bathPerLiteB1  = 0;
var bathPerLiteB10 = 0;
var bathPerLiteS1  = 0;
var bathPerLiteS10 = 0;

var loggingTime = 30; //unit is second : Time value to send data(seconds) to keep in backend, Default is 15 second loop time per updating.
var loggingCount = 0;
var alreadyGetTimeFg = false;
var startTripTime = 0;
var startIdleTime = 0;
var individualLogoDetected = 0;
var newLogoChanged = false;
var defaultLogoChanged = false;
var showTripTimeB = "0:00";
var showIdleTimeB = "0:00";
var showTripTime = "0:00";
var showIdleTime = "0:00";
var warning_type = 0;
var rpmAlarmLimitValue = 9999;
var rpmLimitFg = false;

var rpmDigit1000  = 0;
var rpmDigit100 = 0;
var rpmDigit10  = 0;
var rpmDigit1 = 0;
var rpmValue = "9999"; //default is 8000

var speedRestrict120 = null;


var speedRestrict120Manual = true;
var speedRestrictAlarm = false;
var showRestrict = false;

var proc_1_check = false;
var proc_2_check = false;
var proc_3_check = false;

var msgDebug = "";
//var speed120Set = null;

var rpm_args = {
	"payload" : {
		"pressType" : "Long",     // "Short", "Long"
		"eventCause" : "Multicontroller"    // "Touch", "Multicontroller", "Hardkey"
	}
};
var speedRest_args = {
	"payload" : {
		"pressType" : "Short",     // "Short", "Long"
		"eventCause" : "Touch"    // "Touch", "Multicontroller", "Hardkey"
	}
};
var wheel_args = {
	"payload" : {
		"pressType" : "Long",     // "Short", "Long"
		"eventCause" : "Touch"    // "Touch", "Multicontroller", "Hardkey"
	}
};
var egt_args = {
	"payload" : {
		"pressType" : "Long",     // "Short", "Long"
		"eventCause" : "Hardkey"    // "Touch", "Multicontroller", "Hardkey"
	}
};

$(document).ready(function(){

	// websocket : always on
    // --------------------------------------------------------------------------

	function retrieveValueAll(action){
		/*var speedometerWsValue = new ReconnectingWebSocket('ws://127.0.0.1:9969/', null, {debug: false, timeoutInterval: 5000, reconnectInterval: 500});*/
		var speedometerWsValue = new WebSocket('ws://127.0.0.1:44944/');
        speedometerWsValue.onmessage = function(event){
			if(!proc_3_check) proc_3_check = true;
            var res = event.data.split('#');

			if(sResetDistance) {
				var a = res[2];
				var b = res[4];
				if(res[2] == '0') {
					sResetDistance = false; // the reset process has completed
				} else {
					a = '0';
					b = '0.00';
				}
				updateTripDistance(a, res[6]);
				updateMoneyOfTrip(b, res[7]);
			} else {
				updateTripDistance(res[2], res[6]);
				updateMoneyOfTrip(res[4], res[7]);
			}

			if(!alreadyGetTimeFg) {
				totalTripSeconds = parseInt(res[8]) + totalTripBSeconds;
				totalIdleSeconds = parseInt(res[9]) + totalIdleBSeconds;
				alreadyGetTimeFg = true;
			}

			if(rpmAlarmLimitValue == 9999) { // only force to load new value from backend-process when start, resume app
				rpmAlarmLimitValue = parseInt(res[11]);
				updateRPMLimit();
			}
			if(speedRestrict120 == null) { // only force to load new value from backend-process when start, resume app
				if(res[12] == '1') {
					speedRestrict120 = true;
					/*if (speed120Set == null) {
						//Blink the Text "120"
						speed120Set = setInterval(function () {
							if ($('#speedLimit120IndicatorDiv').hasClass('hidden')) {
								$('#speedLimit120IndicatorDiv').removeClass('hidden');
								setTimeout(function () { $('#speedLimit120IndicatorDiv').removeClass('visuallyhidden');}, 20);
							} else {
								$('#speedLimit120IndicatorDiv').addClass('visuallyhidden');
								$('#speedLimit120IndicatorDiv').one('transitionend', function(e) {
									$('#speedLimit120IndicatorDiv').addClass('hidden');
								});
							}
						}, 1500);
					}*/
				} else {
					speedRestrict120 = false;
					/*clearInterval(speed120Set);
					speed120Set = null;*/
				}
				updateSpeedRestrictFlag(speedRestrict120);
			}


			individualLogoDetected = parseInt(res[10]);

			updateAllFuelEfficiency(res[0],res[1]);
			updateFuelMny(res[3]);
			updateBahtPerKm(res[5]);
			updateMZDLogo();

			updateGPSAltitude(res[13]);
			updateCompassGPS(res[14]);
			updateGPSLatitude(res[15]);
			updateGPSLongitude(res[16]);
			updateIntakeAirTemp(res[17]);
			updateEngineTemp(res[18]);
        }
        speedometerWsValue.onopen = function(){
			speedometerWsValue.send(action);
        }
		speedometerWsValue.onclose = function() {
			proc_3_check = false;
		}
		speedometerWsValue.onerror = function() {
			proc_3_check = false;
		}
    }

	function retrievedataHS(action){
		/*var speedometerWsHS = new ReconnectingWebSocket('ws://127.0.0.1:55544/', null, {debug: false, timeoutInterval: 5000, reconnectInterval: 500});*/
		/*var speedometerWsHS = new WebSocket('ws://127.0.0.1:55544/');*/
		var speedometerWsHS = new WebSocket('ws://127.0.0.1:44944/'); //Try to use same port to utilize the resource on backend process
        speedometerWsHS.onmessage = function(event){
			if(!proc_2_check) proc_2_check = true;
            var res = event.data.split('#');

			gearPos = parseInt(res[0]);
			wheelPos = parseInt(res[1]);
			updateGearPosition();
			updateSteering();
			updateParking();

        }
        speedometerWsHS.onopen = function(){
            speedometerWsHS.send(action);
        }
		speedometerWsHS.onclose = function() {
			proc_2_check = false;
		}
		speedometerWsHS.onerror = function() {
			proc_2_check = false;
		}
    }

	function retrievedataVihicleSpeedAndRPM(action){
		/*var speedometerWsVih = new ReconnectingWebSocket('ws://127.0.0.1:55574/', null, {debug: false, timeoutInterval: 5000, reconnectInterval: 500});*/
		var speedometerWsVih = new WebSocket('ws://127.0.0.1:44944/');
        speedometerWsVih.onmessage = function(event){
			if(!proc_1_check) proc_1_check = true;
            var res = event.data.split('#');

			var speed = res[0];
			var RPM = parseInt(res[1])*2;
			updateEngineRPM(RPM);
			updateVehicleSpeed(speed);

        }
        speedometerWsVih.onopen = function(){
            speedometerWsVih.send(action);
        }
		speedometerWsVih.onclose = function() {
			proc_1_check = false;
		}
		speedometerWsVih.onerror = function() {
			proc_1_check = false;
		}
    }


    // send command only, no wait for reponse from backend service
    function sendOneway(action) {
		var speedometerWssB = new WebSocket('ws://127.0.0.1:44944/'); /*do not use auto reconnect*/
		speedometerWssB.onopen = function(){
            speedometerWssB.send(action);
			setTimeout(function(){
				speedometerWssB.close();
			}, 15000);
        }
	}

	function updateMZDLogo() {
		if(individualLogoDetected == 1) {
			if(!newLogoChanged) {
				$("#mzdIndividualLogoDiv").removeClass("defaultPicture");
				$("#mzdIndividualLogoDiv").addClass("individualPicture");
				newLogoChanged = true;
				defaultLogoChanged = false;
			}
		} else {
			if(!defaultLogoChanged) {
				$("#mzdIndividualLogoDiv").removeClass("individualPicture");
				$("#mzdIndividualLogoDiv").addClass("defaultPicture");
				defaultLogoChanged = true;
				newLogoChanged = false;
			}
		}
	}

	function updateFuelMny(valueIn){
		valueIn = $.trim(valueIn);
		bathPerLiteActual = valueIn;
		$('.bathPerLite').html(parseFloat(valueIn).toFixed(2));

    }

	function updateMoneyOfTrip(valueIn, valueInB){
		valueIn = $.trim(valueIn);
		valueInB = $.trim(valueInB);
		$('.tripMoney').html(parseFloat(valueIn).toFixed(2));
		$('#tripBMoneyValue').html('Baht <span class="tripBMoney">&nbsp;'+parseFloat(valueInB).toFixed(2)+'&nbsp;</span>');

	}

	function updateBahtPerKm(valueIn){
		valueIn = $.trim(valueIn);
		$('.bahtPerKm').html(parseFloat(valueIn).toFixed(2));
	}

	function updateTripDistance(valueIn, valueInB){
        valueIn = $.trim(valueIn);
		valueInB = $.trim(valueInB);
		$('.tripDistance').html(valueIn);
		$('#tripBDistanceValue').html('Km <span class="tripBDistance">&nbsp;'+valueInB+'&nbsp;</span>');

    }

	function updateAllFuelEfficiency(valueIn1, valueIn2){
		 valueIn1 = $.trim(valueIn1);
		 valueIn2 = $.trim(valueIn2);
		 $('.Drv1AvlFuelEValue').html(parseFloat(valueIn1).toFixed(1)+" ("+parseFloat(valueIn2).toFixed(1)+")");
    }

	function updateSteering() {
		if(wheelPosPrev != wheelPos) {
			wheelPosPrev = wheelPos;
			if(wheelPos == 32766) {
				if(steeringDetect == 1) {
					steeringDetect = 0;
					$('#SteeringWheelBGDiv').removeClass('SteeringDetect');
					$('#SteeringWheelBGDiv').addClass('SteeringNotDetect');
				}
			} else {
				if(steeringDetect == 0) {
					steeringDetect = 1;
					$('#SteeringWheelBGDiv').removeClass('SteeringNotDetect');
					$('#SteeringWheelBGDiv').addClass('SteeringDetect');
				}
			}
		}
		if(wheelPos <= 15900) {
			$('.SteeringWheelDiv').css("transform","rotate(45deg)");
		} else if(wheelPos >= 16100) {
			$('.SteeringWheelDiv').css("transform","rotate(-45deg)");
		} else {
			$('.SteeringWheelDiv').css("transform","rotate(0deg)");
		}
	}

	function updateParking() {
		if(gearPos == 1) {
			if(wheelPos == 32766) {
				if(showAlarmLayer == 1) {
					$('#wheelSetTireDiv').removeClass('tireRight');
					$('#wheelSetTireDiv').removeClass('tireLeft');
					$('#wheelSetTireDiv').addClass('tireSet');
					showAlarmLayer = 0;
					updateAlarmLayout();
				}
			} else {
				if(wheelPos <= 15650) {
					$('#wheelSetTireDiv').removeClass('tireLeft');
					$('#wheelSetTireDiv').removeClass('tireSet');
					$('#wheelSetTireDiv').addClass('tireRight');
					if(showAlarmLayer == 0) {
						showAlarmLayer = 1;
						updateAlarmLayout();
					}
					//framework.common.beep("Long", "Multicontroller");
					framework.sendEventToMmui("audiosettings", "PlayAudioBeep", wheel_args);
				} else if(wheelPos >= 16350) {
					$('#wheelSetTireDiv').removeClass('tireRight');
					$('#wheelSetTireDiv').removeClass('tireSet');
					$('#wheelSetTireDiv').addClass('tireLeft');
					if(showAlarmLayer == 0) {
						showAlarmLayer = 1;
						updateAlarmLayout();
					}
					//framework.common.beep("Long", "Multicontroller");
					framework.sendEventToMmui("audiosettings", "PlayAudioBeep", wheel_args);
				} else {
					if(showAlarmLayer == 1) {
						$('#wheelSetTireDiv').removeClass('tireRight');
						$('#wheelSetTireDiv').removeClass('tireLeft');
						$('#wheelSetTireDiv').addClass('tireSet');
						showAlarmLayer = 0;
						updateAlarmLayout();
					}
				}
			}
		} else {
			if(showAlarmLayer == 1) {
				showAlarmLayer = 0;
				updateAlarmLayout();
			}
		}
	}

	function updateGearPosition() {
		if(gearPrev != gearPos) {
			gearPrev = gearPos;
			if(gearPos == 1) {
				$('#gearBGDiv').removeClass('gearR');
				$('#gearBGDiv').removeClass('gearN');
				$('#gearBGDiv').removeClass('gearD');
				$('#gearBGDiv').addClass('gearP');
			} else if (gearPos == 2) {
				$('#gearBGDiv').removeClass('gearP');
				$('#gearBGDiv').removeClass('gearN');
				$('#gearBGDiv').removeClass('gearD');
				$('#gearBGDiv').addClass('gearR');
			} else if (gearPos == 3) {
				$('#gearBGDiv').removeClass('gearP');
				$('#gearBGDiv').removeClass('gearR');
				$('#gearBGDiv').removeClass('gearD');
				$('#gearBGDiv').addClass('gearN');
			} else if (gearPos == 4) {
				$('#gearBGDiv').removeClass('gearP');
				$('#gearBGDiv').removeClass('gearR');
				$('#gearBGDiv').removeClass('gearN');
				$('#gearBGDiv').addClass('gearD');
			}
		}
	}

	function updateIntakeAirTemp(IntakeAirTempIn) {
		var needPos = 0;
		var IntakeAirTemp = $.trim(IntakeAirTempIn);
		IntakeAirTemp = parseInt(IntakeAirTemp);
		if(IntakeAirTemp == 0) {
			$("#IATCover").css("visibility","visible");
			disableIAT = 1;
		} else {
			IntakeAirTempC = Math.round((IntakeAirTemp - 32) * 0.556).toFixed(0); // convert to degree C
			// **** Unit is Farenhi
			// (F  -  32)  x  5/9 = C
			//-65 - 0 - 65
			// At Idle time warmed up Normally Outdor temp is (30-48): testd on outdoor=36, intake temp=35 : So, M range should be = 35 - 45
			// So,
			// < 5 = L   ( 5 -> 35 ) = 30 step => x1.5 degree/step
			// range 35 <-> 45 = M
			// > 60 = H   (45 - 60) = 15 step => x3 degree/step


			if(IntakeAirTempC < 5) {
				IntakeAirTempC = 5;
			}
			if(IntakeAirTempC > 60) {
				IntakeAirTempC = 60;
			}

			if (IntakeAirTempC < 35) {
				needPos = Math.round((IntakeAirTempC - 35) * 1.5).toFixed(0);
			} else if (IntakeAirTempC > 45) {
				needPos = Math.round((IntakeAirTempC - 45) * 3).toFixed(0);
			}
			$('.IATNeedle').css("transform","rotate("+needPos+"deg)");
		}
	}

	function updateEngineTemp(engineTempIn) {
		var needPos = 0;
		var engineTemp = $.trim(engineTempIn);
		engineTemp = parseInt(engineTemp);
		engineTempC = Math.round((engineTemp - 32) * 0.556).toFixed(0); // c0nvert to degree C
		engineTempGauge = engineTempC;

		// **** Unit is Farenhi
		// (F  -  32)  x  5/9 = C
		//-45 - 0 - 45
		// At Idle time warmed up Normally Outdor temp is (30-48): testd on outdoor=36, engine temp=54.4 : So, M range = 50 - 60
		// So,
		// < 5 = L   ( 5 -> 50 ) = 45 step => x1.44 degree/step
		// range 50 <-> 58 = M
		// > 75 = H   (58 - 75) = 17 step => x2.647degree/step

		if(engineTempC < egt_temp_lowest) {
			engineTempC = egt_temp_lowest;
		}
		if(engineTempC > egt_temp_lvl2) {
			engineTempC = egt_temp_lvl2;
		}

        if (engineTempC < egt_temp_normal_start) {
			needPos = Math.round((engineTempC - egt_temp_normal_start)*1.44).toFixed(0);
        } else if (engineTempC > egt_temp_normal_end) {
            //needPos = Math.round((engineTempC - egt_temp_normal_end)*2.647).toFixed(0);  //this is suit for the normal=58, lvl2=75 (17 step)
			needPos = Math.round((engineTempC - egt_temp_normal_end) * (45/(egt_temp_lvl2 - egt_temp_normal_end))).toFixed(0);
		}
        $('.EGTNeedle').css("transform","rotate("+needPos+"deg)");

		if (engineTempC <= egt_temp_normal_end) {
			$('.EGTAlarm').css('opacity','0');
			egtAlarmFg = 0;
		} else if (engineTempC >= egt_temp_lvl2) {
			$('.EGTAlarm').css('opacity','1');
			egtAlarmFg = 1;
		} else if (engineTempC > egt_temp_lvl1) {
			$('.EGTAlarm').css('opacity','0.8');
			egtAlarmFg = 1;
		} else if (engineTempC > egt_temp_normal_end) {
			$('.EGTAlarm').css('opacity','0.4');
			egtAlarmFg = 0;
		}
		if(egtAlarmFg == 1) {
			$('#engineDiv').css('visibility','visible');
			//framework.common.beep("Long", "Multicontroller");
			framework.sendEventToMmui("audiosettings", "PlayAudioBeep", egt_args);
		} else {
			$('#engineDiv').css('visibility','hidden');
		}
		updateAlarmLayout();
	}

	function updateAlarmLayout() {
		if(showAlarmLayer == 1 || egtAlarmFg == 1) {
			$("#mzdwheelSetBGDiv").removeClass("hidden");
			setTimeout(function () { $("#mzdwheelSetBGDiv").removeClass("visuallyhidden");}, 10);
		} else {
			$("#mzdwheelSetBGDiv").addClass("visuallyhidden");
			$("#mzdwheelSetBGDiv").one("transitionend", function(e) {
				$("#mzdwheelSetBGDiv").addClass("hidden");
			});
		}
	}



    // update drive time
    // --------------------------------------------------------------------------
    function updateTripTime(){
		if (alreadyGetTimeFg){
			totalTripSeconds++;
			loggingCount++;
			if(loggingCount>= loggingTime) {
				loggingCount = 0;
				sendOneway('loggingTime='+totalTripSeconds+":"+totalIdleSeconds);
			}
			var days = Math.floor(totalTripSeconds / 86400);
			var hours   = Math.floor((totalTripSeconds - (days * 86400)) / 3600);
			var minutes = Math.floor((totalTripSeconds - (days * 86400) - (hours * 3600)) / 60);
			var seconds = totalTripSeconds - (days * 86400) - (hours * 3600) - (minutes * 60);
			showTripTime = "";

			if (hours > 0 && minutes < 10) {minutes = "0"+minutes;}
			if (seconds < 10) {seconds = "0"+seconds;}
			if(days > 0) {
				showTripTime = days + "d ";
				if(hours > 0){
					showTripTime = showTripTime + hours+':'+minutes+':'+seconds;
				} else {
					showTripTime = showTripTime + minutes+':'+seconds;
				}
			} else {
				if(hours > 0){
					showTripTime = hours+':'+minutes+':'+seconds;
				} else {
					showTripTime = minutes+':'+seconds;
				}
			}
		}

		totalTripBSeconds++;
		days = Math.floor(totalTripBSeconds / 86400);
		hours   = Math.floor((totalTripBSeconds - (days * 86400)) / 3600);
		minutes = Math.floor((totalTripBSeconds - (days * 86400) - (hours * 3600)) / 60);
		seconds = totalTripBSeconds - (days * 86400) - (hours * 3600) - (minutes * 60);
		showTripTimeB = "";

		if (hours > 0 && minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		if(days > 0) {
			showTripTimeB = days + "d ";
		}
		if(hours > 0){
			showTripTimeB = showTripTimeB + hours+':'+minutes+':'+seconds;
		} else {
			showTripTimeB = showTripTimeB + minutes+':'+seconds;
		}
		$('.tripTimeValue').html(showTripTime + '<span class="tripTimeBValue">&nbsp;'+showTripTimeB+'&nbsp;</span>');
    }
    // --------------------------------------------------------------------------

    // update idle time
    // --------------------------------------------------------------------------
    function updateIdleTime(){
		if (alreadyGetTimeFg){
			var days = Math.floor(totalIdleSeconds / 86400);
			var hours   = Math.floor((totalIdleSeconds - (days * 86400)) / 3600);
			var minutes = Math.floor((totalIdleSeconds - (days * 86400) - (hours * 3600)) / 60);
			var seconds = totalIdleSeconds - (days * 86400) - (hours * 3600) - (minutes * 60);
			showIdleTime = "";

			if (hours > 0 && minutes < 10) {minutes = "0"+minutes;}
			if (seconds < 10) {seconds = "0"+seconds;}
			if(days > 0) {
				showIdleTime = days + "d ";
				if(hours > 0){
					showIdleTime = showIdleTime + hours+':'+minutes+':'+seconds
				} else {
					showIdleTime = showIdleTime + minutes+':'+seconds
				}
			} else {
				if(hours > 0){
					showIdleTime = hours+':'+minutes+':'+seconds
				} else {
					showIdleTime = minutes+':'+seconds
				}
			}
		}

		days = Math.floor(totalIdleBSeconds / 86400);
		hours   = Math.floor((totalIdleBSeconds - (days * 86400)) / 3600);
		minutes = Math.floor((totalIdleBSeconds - (days * 86400) - (hours * 3600)) / 60);
		seconds = totalIdleBSeconds - (days * 86400) - (hours * 3600) - (minutes * 60);
		showIdleTimeB = "";

		if (hours > 0 && minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		if(days > 0) {
			showIdleTimeB = days + "d ";
			if(hours > 0){
				showIdleTimeB = showIdleTimeB + hours+':'+minutes+':'+seconds
			} else {
				showIdleTimeB = showIdleTimeB + minutes+':'+seconds
			}
		} else {
			if(hours > 0){
				showIdleTimeB = hours+':'+minutes+':'+seconds
			} else {
				showIdleTimeB = minutes+':'+seconds
			}
		}
    }

    // --------------------------------------------------------------------------

    // update vehicle speed
    // --------------------------------------------------------------------------
	function updateVehicleSpeed(currentSpeed){
		var currentSpeedUse = $.trim(currentSpeed);
		speedCurrent = Math.ceil(parseInt(currentSpeedUse) * 0.01);

		if(speedCurrent > 120) {
			speedCurrent = speedCurrent + 3;
		} else if (speedCurrent > 90) {
			speedCurrent = speedCurrent + 2;
		} else if (speedCurrent > 30) {
			speedCurrent = speedCurrent + 1;
		}

		if(speedRestrict120) {
			if(speedCurrent >= speedRestrictValue) {
				speedRestrictAlarm = true;
				showRestrict = false;
			} else {
				speedRestrictAlarm = false;
			}
		} else {
			speedRestrictAlarm = false;
		}

        // update vehicle top speed
        if(speedCurrent > speedTop){
			if(speedCurrent > 180) {
				overscale = (speedCurrent-180)/2;
				$('.topSpeedNeedle').css("transform","rotate("+(-120+180+overscale)+"deg)");
			} else {
				$('.topSpeedNeedle').css("transform","rotate("+(-120+speedCurrent)+"deg)");
			}
			speedTop = speedCurrent;
        }
		$('.speedTopValue').text(speedTop.toString());

		// update vehicle speed
		if(speedCurrent > 180) {
			overscale = (speedCurrent-180)/2;
			$('.speedNeedle').css("transform","rotate("+(-120+180+overscale)+"deg)");
		} else {
			$('.speedNeedle').css("transform","rotate("+(-120+speedCurrent)+"deg)");
		}

		if(showSpeed) {
            $('.txtSpeed').text(speedCurrent.toString());
		}
    }
    // --------------------------------------------------------------------------


	function updateEngineRPM(currentRPM){
		var currentRPMShow = -120 + parseInt((currentRPM * 0.03).toFixed(0));
		$('.rpmNeedle').css("transform","rotate("+currentRPMShow+"deg)");

		//*** FOR DEBUG VALUE : Enable html code in MZDMeterTmplt.js before use this
		//$('.txtSpeedUnit').text("rpm = " + currentRPM);

		if(parseInt(currentRPM) > rpmAlarmLimitValue) {
			rpmLimitFg = true;
		} else {
			rpmLimitFg = false;
		}
	}

	function updateRPMLimit(){
		var currentRPMLimitShow = -120 + parseInt((rpmAlarmLimitValue * 0.03).toFixed(0));
		$('.topRPMNeedle').css("transform","rotate("+currentRPMLimitShow+"deg)");
	}

    // --------------------------------------------------------------------------

    // --------------------------------------------------------------------------
    // update GPS altitude
    // --------------------------------------------------------------------------
    function updateGPSAltitude(currentGPSalt){
        var currentGPSalt = $.trim(currentGPSalt);
        if($.isNumeric(currentGPSalt) && currentGPSalt != GPSAltitudeCur){
            GPSAltitudeCur = Math.round(currentGPSalt);
            $('.gpsAltitudeValue').text(GPSAltitudeCur);
        }
    }
    // --------------------------------------------------------------------------
    // update GPS Compass
    // --------------------------------------------------------------------------
    function updateCompassGPS(currentGPCompass){
        var currentGPCompass = $.trim(currentGPCompass);
		var heading = "N";
        if($.isNumeric(currentGPCompass) && currentGPCompass != lastGPSheadingValue){
            $('.compassBGDiv').css("transform","rotate("+(-Math.abs(currentGPCompass)+180+compassCalibrate)+"deg)");
			var degShow = -Math.abs(currentGPCompass)+180+compassCalibrate;
			if (degShow >= 0) {
				degShow = 360 - degShow;
			} else{
				degShow = Math.abs(degShow);
			}
			// 22.5 degree in each step of heading
			if(degShow >= 349) { //348.75 - 360
				heading = "N";
			} else if(degShow >= 326){ //326.25
				heading = "NNW";
			} else if(degShow >= 304){ //303.75
				heading = "NW";
			} else if(degShow >= 281){ //281.25
				heading = "WNW";
			} else if(degShow >= 259){ //258.75
				heading = "W";
			} else if(degShow >= 236){ //236.25
				heading = "WSW";
			} else if(degShow >= 214){ //213.75
				heading = "SW";
			} else if(degShow >= 191){ //191.25
				heading = "SSW";
			} else if(degShow >= 169){ //168.75
				heading = "S";
			} else if(degShow >= 146){ //146.25
				heading = "SSE";
			} else if(degShow >= 124){ //123.75
				heading = "SE";
			} else if(degShow >= 101){ //101.25
				heading = "ESE";
			} else if(degShow >= 79){ //78.75
				heading = "E";
			} else if(degShow >= 56){ //56.25
				heading = "ENE";
			} else if(degShow >= 34){ //33.75
				heading = "NE";
			} else if(degShow >= 11){ //11.25
				heading = "NNE";
			} else if(degShow >= 0){ // 0 - 11.25
				heading = "N";
			}
			$('.compassDegree').html(degShow.toFixed(0)+'&deg; '+heading);
            lastGPSheadingValue = currentGPCompass;
        }
    }
    // --------------------------------------------------------------------------

    // update GPS latitude
    // --------------------------------------------------------------------------
    function updateGPSLatitude(currentGPSlat){
        var currentGPSlat = $.trim(currentGPSlat);
        if($.isNumeric(currentGPSlat)){
            GPSlatCurrent = parseFloat(currentGPSlat).toFixed(4);
            if (GPSlatCurrent > 0) {
                 $('.gpsLatitudeValue').html(GPSlatCurrent+'&deg;N');
				 $('.compassGpsLatV').html(parseFloat(GPSlatCurrent).toFixed(3)+'&deg;N');
            } else {
                $('.gpsLatitudeValue').html(Math.abs(GPSlatCurrent)+'&deg;S');
				$('.compassGpsLatV').html(parseFloat(Math.abs(GPSlatCurrent)).toFixed(3)+'&deg;S');
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
            if (GPSlonCurrent > 0) {
                $('.gpsLongitudeValue').html(GPSlonCurrent+'&deg;E');
				$('.compassGpsLongV').html(parseFloat(GPSlonCurrent).toFixed(3)+'&deg;E');
            } else {
                $('.gpsLongitudeValue').html(Math.abs(GPSlonCurrent)+'&deg;W');
				$('.compassGpsLongV').html(parseFloat(Math.abs(GPSlonCurrent)).toFixed(3)+'&deg;W');
            }
        }
    }
    // --------------------------------------------------------------------------

    	// for Single action (oneway) to backend process
		setInterval(function () {
			if(bRefreshFuel) {
				sendOneway('refreshFuel='+gasType);
				bRefreshFuel = false;
			}
			if(bRefreshFuelManual) {
				sendOneway('refreshFuelManual='+bathPerLiteManual);
				bRefreshFuelManual = false;
			}
			if(bRefreshRPMManual) {
				rpmAlarmLimitValue = parseInt(rpmValue);
				updateRPMLimit();
				sendOneway('rpmConfig='+rpmValue);
				bRefreshRPMManual = false;
			}
			if(bRefreshSpeedRestrict120) {
				speedRestrict120 = speedRestrict120Manual;
				updateSpeedRestrictFlag(speedRestrict120);
				if(speedRestrict120Manual) {
					sendOneway('speedRest=1');
					/*if (speed120Set == null) {
						//Blink the Text "120"
						speed120Set = setInterval(function () {
							if ($('#speedLimit120IndicatorDiv').hasClass('hidden')) {
								$('#speedLimit120IndicatorDiv').removeClass('hidden');
								setTimeout(function () { $('#speedLimit120IndicatorDiv').removeClass('visuallyhidden');}, 20);
							} else {
								$('#speedLimit120IndicatorDiv').addClass('visuallyhidden');
								$('#speedLimit120IndicatorDiv').one('transitionend', function(e) {
									$('#speedLimit120IndicatorDiv').addClass('hidden');
								});
							}
						}, 1500);
					}*/
				} else {
					sendOneway('speedRest=0');
					/*clearInterval(speed120Set);
					speed120Set = null;*/
				}
				bRefreshSpeedRestrict120 = false;
			}

			if(!vehicleSpeedLock) {
				vehicleSpeedLock = true;
				setTimeout(function(){
					$('#mzdMainDialBG .txtSpeed').css('font-size','40px');
					showSpeed = true;
				}, 3000);
			}
			if(bResetDistance) {
				sResetDistance = true;
				sendOneway('resetDistance');
				totalTripSeconds = 0;
				totalIdleSeconds = 0;
				bResetDistance = false;
			}

		}, 500);

	//==================================================================================

    setInterval(function () {
        updateTripTime();
    }, 1000);

	setInterval(function () {
		if(speedCurrent == 0){
			if (alreadyGetTimeFg){
				totalIdleSeconds++;
			}
			totalIdleBSeconds++;
		}
		updateIdleTime();
		$('.idleTimeValue').html(showIdleTime + '<span class="idleTimeBValue">&nbsp;'+showIdleTimeB+'&nbsp;</span>');
    }, 1000);


	setInterval(function () {
		if(rpmLimitFg) {
			$("#rpmLimitAlarmDiv").css("visibility","visible");
			$("#rpmLimitAlarmDiv2").css("visibility","visible");
			if (!$('#rpmLimitAlarmDiv').hasClass('swirlAura')) {
				$('#rpmLimitAlarmDiv').addClass('swirlAura');
				$('#rpmLimitAlarmDiv2').addClass('swirlAura2');
			}
			//framework.common.beep("Long", "Multicontroller");
		    framework.sendEventToMmui("audiosettings", "PlayAudioBeep", rpm_args);
		} else {
			$("#rpmLimitAlarmDiv").css("visibility","hidden");
			$("#rpmLimitAlarmDiv2").css("visibility","hidden");
			if ($('#rpmLimitAlarmDiv').hasClass('swirlAura')) {
				$('#rpmLimitAlarmDiv').removeClass('swirlAura');
				$('#rpmLimitAlarmDiv2').removeClass('swirlAura2');
			}
		}
		if(speedRestrictAlarm) {
			//framework.common.beep("Short", "Touch");
			framework.sendEventToMmui("audiosettings", "PlayAudioBeep", speedRest_args);
			if(!showRestrict) {
				$("#speedLimitDiv120").css("visibility","visible");
				showRestrict = true;
			}
		} else {
			if(showRestrict) {
				$("#speedLimitDiv120").css("visibility","hidden");
				showRestrict = false;
			}
		}
    }, 500);


	setInterval(function () {
		msgDebug = "Daemon-status [ ";
		if(proc_1_check) {
			msgDebug += "1";
		} else {
			msgDebug += "0";
		}
		if(proc_2_check) {
			msgDebug += " 1";
		} else {
			msgDebug += " 0";
		}
		if(proc_3_check) {
			msgDebug += " 1 ]";
		} else {
			msgDebug += " 0 ]";
		}
		$('.monitorText').html(msgDebug);
	}, 2000);

	setTimeout(function(){
		retrievedataVihicleSpeedAndRPM('speed_rpm');
        retrievedataHS('gear_stwhl');
		retrieveValueAll('all_value');
    }, 35000);

	setTimeout(function(){ // auto create connection again in case connection has closed (or connection has failed)
		setInterval(function () {
			if(!proc_1_check) {
				retrievedataVihicleSpeedAndRPM('speed_rpm');
			}
			if(!proc_2_check) {
				retrievedataHS('gear_stwhl');
			}
			if(!proc_3_check) {
				retrieveValueAll('all_value');
			}
		}, 10000);
    }, 60000);

});
