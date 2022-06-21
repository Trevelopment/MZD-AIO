
log.addSrcFile('MZDMeterTmplt.js', 'mzdmeter');

/*
 * =========================
 * Constructor
 * =========================
 */
function MZDMeterTmplt(uiaId, parentDiv, templateID, controlProperties)
{
  this.divElt = null;
  this.templateName = 'MZDMeterTmplt';

  this.onScreenClass = 'MZDMeterTmplt';

  log.debug('  templateID in MZDMeterTmplt constructor: ' + templateID);

  // @formatter:off
  // set the template properties
  this.properties = {
    'statusBarVisible': true,
    'leftButtonVisible': false,
    'rightChromeVisible': false,
    'hasActivePanel': false,
    'isDialog': false,
  };
  // @formatter:on

  // create the div for template
  this.divElt = document.createElement('div');
  this.divElt.id = templateID;
  this.divElt.className = 'TemplateWithStatus';
  // this.divElt.className = "TemplateFull MZDMeterTmplt";
  // Framwork support as below
  //* ** TrasitionsGen.css
  /* Detail of each display
        .TemplateFull {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 800px;
      height: 480px;
      opacity: 1;
    }

    .TemplateWithStatus {
      position: absolute;
      top: 64px;
      left: 0px;
      width: 800px;
      height: 416px;
      opacity: 1;
    }

    .TemplateWithStatusLeft {
      position: absolute;
      top: 64px;
      left: 60px;
      width: 740px;
      height: 416px;
      opacity: 1;
    }*/

  parentDiv.appendChild(this.divElt);

  // do whatever you want here
  this.divElt.innerHTML = '<script language="javascript" type="text/javascript" src="/jci/gui/apps/_mzdmeter/js/mzdmeterUpdate.js"></script>'+
'<div id="mzdContainer">'+
'    <div id="rpmLimitAlarmDiv" class="swirlAura"></div>'+
'    <div id="rpmLimitAlarmDiv2" class="swirlAura2"></div>'+
'    <div id="mzdMainDiv">'+
'    <div id="mzdIndividualLogoDiv" class="defaultPicture"></div>'+
'        <div id="mzdMainDialBG">'+
'            <div class="mzdBGLightAura pulseAura"></div>'+
// '            <div class="txtSpeedUnit">*****</div>'+
'            <div class="topSpeedNeedle"></div>'+
'            <div class="topRPMNeedle"></div>'+
'            <div class="rpmNeedle"></div>'+
'            <div class="speedNeedle"></div>'+
'            <div class="txtSpeed">0</div>'+
'            <div id="speedLimitDiv120"></div>'+
// '            <div id="speedLimit120IndicatorDiv" class="speedLimit120IndicatorTransition hidden visuallyhidden"></div>'+
'            <div id="speedLimit120IndicatorDiv"></div>'+
'            <div class="OutSideRing"></div>'+
'        </div>'+
'        <div id="mzdMainDialBorder"></div>'+
'        <div id="gearBGDiv" class="gearN"></div>'+
'        <div id="gearBorderDiv"></div>' +
'        <div class="compassBGInnerDiv">'+
'            <div class="compassGpsLatV">-</div>'+
'            <div class="compassDegree">-</div>'+
'            <div class="compassGpsLongV">-</div>'+
'        </div>'+
'        <div class="compassBGDiv"></div>'+
'        <div id="compassDivBorder"></div>'+
'        <div class="guageDiv"></div>'+
'        <div class="IATDial"></div>'+
'        <div class="IATNeedle"></div>'+
'        <div class="IATCenterDial"></div>'+
'       <div id="IATCover"></div>' +
'        <div class="EGTDial"></div>'+
'        <div class="EGTAlarm"></div>'+
'        <div class="EGTNeedle"></div>'+
'        <div class="EGTCenterDial"></div>'+
'        <div id="guageDivBorder"></div>'+
'        <div id="IATBorderRing"></div>'+
'        <div id="EGTBorderRing"></div>'+
// '        <div id="markerPoint"></div>'+
'    </div>'+
'    <div id="mzdInfoDiv" class="mzdInfoDiv hidden visuallyhidden" >'+
'        <div id="segment_1">'+
'        <div id="tripDistFieldSet">Distance <div id="tripBDistanceValue" class="DistUnit">Km <span class="tripBDistance">&nbsp;-&nbsp;</span></div></div>'+
'        <div id="costTripFieldSet">Cost <div id="tripBMoneyValue" class="CostUnit">Baht <span class="tripBMoney">&nbsp;-&nbsp;</span></div></div>'+
'        <div id="tripTimeA">Trip time</div>'+
'        <div id="idleTimeA">Stop time</div>'+
'        <div id="Drv1AvlFuelEFieldSet">Km/L</div>'+
'        <div id="bahtPerKmFieldSet">Baht/Km</div>'+
'        <div id="FuelPriceFieldSet">Baht/Lite</div>'+
'        <div class="tripTimeValue">0:00<span class="tripTimeBValue">&nbsp;0:00&nbsp;</span></div>'+
'        <div class="idleTimeValue">0:00<span class="idleTimeBValue">&nbsp;0:00&nbsp;</span></div>'+
'        <div class="tripDistance">-</div>'+
'        <div class="tripMoney">-</div>'+
'        <div class="Drv1AvlFuelEValue">-</div>'+
'        <div class="bahtPerKm">-</div>'+
'        <div class="bathPerLite">-</div>'+
'        </div>'+
'        <div id="segment_2">'+
'        <div id="speedTopFieldSet">Top Speed  <div class="DistUnit">Km/H</div></div>'+
'        <div id="gpsLatitude">Latitude</div>'+
'        <div id="gpsLongitude">Longitude</div>'+
'        <div id="gpsAltitude">Altitude</div>'+
'        <div class="speedTopValue">-</div>'+
'        <div class="gpsLatitudeValue">-</div>'+
'        <div class="gpsLongitudeValue">-</div>'+
'        <div class="gpsAltitudeValue">-</div>'+
'        </div>'+
'        <div id="infoPageBtn"></div>'+
'        <div id="border_infoPageBtn"></div>'+
'    </div>'+
'    <div id="mzdwheelSetBGDiv" class="mzdwheelSetBGDiv hidden visuallyhidden" >'+
'         <div id="wheelSetTireDiv" class="tireSet" ></div>'+
'        <div id="engineDiv"></div>'+
'         <div id="mzdwheelSetDiv"></div>'+
'    </div>'+
'   <div id="SteeringWheelBGDiv" class="SteeringNotDetect" ></div>'+
'   <div class="SteeringWheelDiv"></div>'+
'</div>'+


'<div id="myControlButton">'+
'        <div id="infoBtnDiv"></div>'+
'        <div id="refreshFuelBtnDiv"></div>'+
'        <div id="resetDistanceBtnDiv"></div>'+
'        <div id="border_button1"></div>'+
'        <div id="border_button2"></div>'+
'        <div id="border_button3"></div>'+
'</div>'+


'<div id="dialogMainDiv">'+
'    <div id="dialogMainMenuDiv">'+
'        <div class="messageText">Configuration</div>'+
'          <div class="actionFormField2">'+
'                <div id="mainmenu_1">Fuel Price Adjustment</div>'+
'                <div id="mainmenu_2">Shift Alarm Adjustment</div>'+
'                <div id="mainmenu_3div">'+
'                <ul>'+
'                    <li id="mainmenu_3" class="checked">&nbsp; &nbsp;Speed Restriction at 120 km/h</li>'+
'                </ul>'+
'                </div>'+
'          </div>'+
'        <div class="monitorText"></div>' +
'    </div>'+
'    <div id="dialog1MainDiv">'+
'        <div class="messageText">Fuel Price on Internet</div>'+
'          <div id="choiceList1">'+
'              <ul>'+
'                <li><img id="gas_diesel" src="/jci/gui/apps/_mzdmeter/templates/MZDMeter/images/gas_diesel.png" height="32" width="140" /></li>'+
'                <li><img id="gas_s95" src="/jci/gui/apps/_mzdmeter/templates/MZDMeter/images/gas_95.png" height="32" width="140" /></li>'+
'              </ul>'+
'          </div>'+
'          <div id="choiceList2">'+
'              <ul>'+
'                <li><img id="gas_g95" src="/jci/gui/apps/_mzdmeter/templates/MZDMeter/images/gas_g95.png" height="32" width="140" /></li>'+
'                <li><img id="gas_e20" src="/jci/gui/apps/_mzdmeter/templates/MZDMeter/images/gas_e20.png" height="32" width="140" /></li>'+
'                <li><img id="gas_e85" src="/jci/gui/apps/_mzdmeter/templates/MZDMeter/images/gas_e85.png" height="32" width="140" /></li>'+
'              </ul>'+
'          </div>'+
'          <div class="actionFormField">'+
'                <div id="custom_fuel_button">Custom Fuel Price Adjustment</div>'+
'                <div class="cancle_button">Cancel</div>'+
'        </div>'+
'    </div>'+
'    <div id="dialog2MainDiv">'+
'        <div class="messageText">Custom Fuel Price Adjustment</div>'+
'        <div class="display1Dialog2">'+
'            <div id="B_digit10" class="fuel_manual_show">0</div>'+
'            <div id="B_digit1" class="fuel_manual_show">0</div>'+
'            <div id="S_digit1" class="fuel_manual_show">0</div>'+
'            <div id="S_digit10" class="fuel_manual_show">0</div>'+
'        </div>'+
'        <div class="actionDialog2Field">'+
'            <div id="B_digit10_inc_button" class="inc_button"></div>'+
'            <div id="B_digit10_dec_button" class="dec_button"></div>'+
'            <div id="B_digit1_inc_button" class="inc_button"></div>'+
'            <div id="B_digit1_dec_button" class="dec_button"></div>'+
'            <div id="S_digit1_inc_button" class="inc_button"></div>'+
'            <div id="S_digit1_dec_button" class="dec_button"></div>'+
'            <div id="S_digit10_inc_button" class="inc_button"></div>'+
'            <div id="S_digit10_dec_button" class="dec_button"></div>'+
'        </div>'+
'        <div class="actionFormField">'+
'                <div id="ok_button">Ok</div>'+
'                <div class="cancle_button">Cancel</div>'+
'        </div>'+
'    </div>'+
'    <div id="dialogRPMDiv">'+
'        <div class="messageText">Shift Alarm Adjustment</div>'+
'        <div class="display1Dialog2">'+
'            <div id="RPM_digit1000" class="fuel_manual_show">0</div>'+
'            <div id="RPM_digit100" class="fuel_manual_show">0</div>'+
'            <div id="RPM_digit10" class="fuel_manual_show">0</div>'+
'            <div id="RPM_digit1" class="fuel_manual_show">0</div>'+
'        </div>'+
'        <div class="actionDialog2Field">'+
'            <div id="RPM_digit1000_inc_button" class="inc_button"></div>'+
'            <div id="RPM_digit1000_dec_button" class="dec_button"></div>'+
'            <div id="RPM_digit100_inc_button" class="inc_button"></div>'+
'            <div id="RPM_digit100_dec_button" class="dec_button"></div>'+
'            <div id="RPM_digit10_inc_button" class="inc_button"></div>'+
'            <div id="RPM_digit10_dec_button" class="dec_button"></div>'+
'            <div id="RPM_digit1_inc_button" class="inc_button"></div>'+
'            <div id="RPM_digit1_dec_button" class="dec_button"></div>'+
'        </div>'+
'        <div class="actionFormField">'+
'                <div id="rpm_ok_button">Ok</div>'+
'                <div class="cancle_button">Cancel</div>'+
'        </div>'+
'    </div>'+
'</div>'+
'<div id="dialogWarningDiv">'+
'    <div id="warnSubject" class="messageText">Subject</div>'+
'    <div id="messageBody">message</div>'+
'    <div class="actionFormField">'+
'        <div id="warning_ok_button">Ok</div>'+
'        <div id="warning_cancle_button">Cancel</div>'+
'    </div>'+
'</div>'+

'<script language="javascript" type="text/javascript">$(function(){setTimeout(function() {updateMZDApp();}, 1500);'+
' $("#infoBtnDiv").click(function(){' +
'              if (showInfo == 0) {'+
'                    showInfo = 1;'+
'                    $("#mzdInfoDiv").removeClass("hidden");'+
'                    setTimeout(function () { $("#mzdInfoDiv").removeClass("visuallyhidden");}, 20);'+
'              } else {'+
'                    showInfo = 0;'+
'                    $("#mzdInfoDiv").addClass("visuallyhidden");'+
'                    $("#mzdInfoDiv").one("transitionend", function(e) {'+
'                        $("#mzdInfoDiv").addClass("hidden");'+
'                    });'+
'              }'+
'});'+
'$("#IATBorderRing").click(function(){'+
'    showSpeed = false;'+
'    $("#mzdMainDialBG .txtSpeed").css("font-size","30px");'+
'   $(".txtSpeed").text(IntakeAirTempC+"°C");'+
'    vehicleSpeedLock = false;'+
'});'+
'$("#IATCover").click(function(){'+
'    showSpeed = false;'+
'    $("#mzdMainDialBG .txtSpeed").css("font-size","30px");'+
'    $(".txtSpeed").text(speedTop);'+
'    vehicleSpeedLock = false;'+
'});'+
'$("#EGTBorderRing").click(function(){'+
'    showSpeed = false;'+
'    $("#mzdMainDialBG .txtSpeed").css("font-size","30px");'+
'    $(".txtSpeed").text(engineTempGauge+"°C");'+
'    vehicleSpeedLock = false;'+
'});'+
'$("#infoPageBtn").click(function(){'+
'    if (pageInfo == 1) {'+
'        pageInfo = 2;'+
'        $("#segment_1").css("visibility","hidden");'+
'        $("#segment_2").css("visibility","visible");'+
'    } else {'+
'        pageInfo = 1;'+
'        $("#segment_2").css("visibility","hidden");'+
'        $("#segment_1").css("visibility","visible");'+
'    }'+
'});'+
'$("#resetDistanceBtnDiv").click(function(){'+
'    warningShow(1,"Reset Trip A", "Do you want to reset Trip A values?<BR><BR> The value of Distance, Cost, Trip time(A), Stop time(A) will be reset.");'+
'    $("#dialogWarningDiv").css("visibility","visible");'+
'});'+

'$("#refreshFuelBtnDiv").click(function(){'+
'    if(fuelDialogShow == 0) {'+
'        speedRestrict120Manual = speedRestrict120;'+
'        $("#dialogMainDiv").css("visibility","visible");'+
'        $("#dialogMainMenuDiv").css("visibility","visible");'+
'        $("#dialog1MainDiv").css("visibility","hidden");'+
'        $("#dialog2MainDiv").css("visibility","hidden");'+
'        $("#dialogRPMDiv").css("visibility","hidden");'+
'        fuelDialogShow = 1;'+
'        fuelDialogPage = 1;'+
'    } else {'+
'        $("#dialogMainDiv").css("visibility","hidden");'+
'        $("#dialogMainMenuDiv").css("visibility","hidden");'+
'        $("#dialog1MainDiv").css("visibility","hidden");'+
'        $("#dialog2MainDiv").css("visibility","hidden");'+
'        $("#dialogRPMDiv").css("visibility","hidden");'+
'        fuelDialogShow = 0;'+
'        fuelDialogPage = 1;'+
'    }'+
'});'+

'$("#gas_diesel").click(function(){'+
'    gasType = "Diesel";'+
'    bRefreshFuel = true;'+
'    $("#dialogMainDiv").css("visibility","hidden");'+
'    $("#dialog1MainDiv").css("visibility","hidden");'+
'    $("#dialog2MainDiv").css("visibility","hidden");'+
'    fuelDialogShow = 0;'+
'    fuelDialogPage = 1;'+
'});'+
'$("#gas_s95").click(function(){'+
'    gasType = "s95";'+
'    bRefreshFuel = true;'+
'    $("#dialogMainDiv").css("visibility","hidden");'+
'    $("#dialog1MainDiv").css("visibility","hidden");'+
'    $("#dialog2MainDiv").css("visibility","hidden");'+
'    fuelDialogShow = 0;'+
'    fuelDialogPage = 1;'+
'});'+
'$("#gas_g95").click(function(){'+
'    gasType = "g95";'+
'    bRefreshFuel = true;'+
'    $("#dialogMainDiv").css("visibility","hidden");'+
'    $("#dialog1MainDiv").css("visibility","hidden");'+
'    $("#dialog2MainDiv").css("visibility","hidden");'+
'    fuelDialogShow = 0;'+
'    fuelDialogPage = 1;'+
'});'+
'$("#gas_e20").click(function(){'+
'    gasType = "e20";'+
'    bRefreshFuel = true;'+
'    $("#dialogMainDiv").css("visibility","hidden");'+
'    $("#dialog1MainDiv").css("visibility","hidden");'+
'    $("#dialog2MainDiv").css("visibility","hidden");'+
'    fuelDialogShow = 0;'+
'    fuelDialogPage = 1;'+
'});'+
'$("#gas_e85").click(function(){'+
'    gasType = "e85";'+
'    bRefreshFuel = true;'+
'    $("#dialogMainDiv").css("visibility","hidden");'+
'    $("#dialog1MainDiv").css("visibility","hidden");'+
'    $("#dialog2MainDiv").css("visibility","hidden");'+
'    fuelDialogShow = 0;'+
'    fuelDialogPage = 1;'+
'});'+
'$("#custom_fuel_button").click(function(){'+
'    updateFuelManual();'+
'    $("#dialogMainMenuDiv").css("visibility","hidden");'+
'    $("#dialogRPMDiv").css("visibility","hidden");'+
'    $("#dialog1MainDiv").css("visibility","hidden");'+
'    $("#dialog2MainDiv").css("visibility","visible");'+
'    fuelDialogPage = 2;'+
'});'+
'$("#ok_button").click(function(){'+
'    $("#dialogMainDiv").css("visibility","hidden");'+
'    $("#dialog1MainDiv").css("visibility","hidden");'+
'    $("#dialog2MainDiv").css("visibility","hidden");'+
'    $("#dialogMainMenuDiv").css("visibility","hidden");'+
'    $("#dialogRPMDiv").css("visibility","hidden");'+
'    fuelDialogShow = 0;'+
'    fuelDialogPage = 1;'+
'   bRefreshFuelManual = true;'+
'});'+
'$(".cancle_button").click(function(){'+
'    $("#dialogMainDiv").css("visibility","hidden");'+
'    $("#dialog1MainDiv").css("visibility","hidden");'+
'    $("#dialog2MainDiv").css("visibility","hidden");'+
'    $("#dialogMainMenuDiv").css("visibility","hidden");'+
'    $("#dialogRPMDiv").css("visibility","hidden");'+
'    fuelDialogShow = 0;'+
'    fuelDialogPage = 1;'+
'});'+


'$("#rpm_ok_button").click(function(){'+
'    $("#dialogMainDiv").css("visibility","hidden");'+
'    $("#dialogMainMenuDiv").css("visibility","hidden");'+
'    $("#dialog1MainDiv").css("visibility","hidden");'+
'    $("#dialog2MainDiv").css("visibility","hidden");'+
'    $("#dialogRPMDiv").css("visibility","hidden");'+
'    fuelDialogShow = 0;'+
'    fuelDialogPage = 1;'+
'    bRefreshRPMManual = true;'+
'});'+
'$("#mainmenu_1").click(function(){'+
'    $("#dialogMainMenuDiv").css("visibility","hidden");'+
'    $("#dialogRPMDiv").css("visibility","hidden");'+
'    $("#dialog2MainDiv").css("visibility","hidden");'+
'    $("#dialog1MainDiv").css("visibility","visible");'+
'    fuelDialogPage = 2;'+
'});'+


'$("#mainmenu_2").click(function(){'+
'    updateRPMAlarmManual();'+
'    $("#dialogMainMenuDiv").css("visibility","hidden");'+
'    $("#dialog1MainDiv").css("visibility","hidden");'+
'    $("#dialog2MainDiv").css("visibility","hidden");'+
'    $("#dialogRPMDiv").css("visibility","visible");'+
'    fuelDialogPage = 4;'+
'});'+

'function updateRPMAlarmManual() {'+
'    rpmValue = rpmAlarmLimitValue.toString();'+
'    rpmDigit1000 = parseInt(rpmValue[0]);'+
'    rpmDigit100 = parseInt(rpmValue[1]);'+
'    rpmDigit10 = parseInt(rpmValue[2]);'+
'    rpmDigit1 = parseInt(rpmValue[3]);'+
'    $("#RPM_digit1000").text(rpmDigit1000.toString());'+
'    $("#RPM_digit100").text(rpmDigit100.toString());'+
'    $("#RPM_digit10").text(rpmDigit10.toString());'+
'    $("#RPM_digit1").text(rpmDigit1.toString());'+
'}'+

'$("#RPM_digit1000_inc_button").click(function(){'+
'    if(rpmDigit1000 < 8) {'+
'        rpmDigit1000 = rpmDigit1000 + 1;'+
'        if(rpmDigit1000 == 8) {'+
'            rpmDigit100 = 0;'+
'            rpmDigit10 = 0;'+
'            rpmDigit1 = 0;'+
'            $("#RPM_digit100").text("0");'+
'            $("#RPM_digit10").text("0");'+
'            $("#RPM_digit1").text("0");'+
'        }'+
'    }'+
'    rpmValue = rpmDigit1000.toString() + rpmDigit100.toString() + rpmDigit10.toString() + rpmDigit1.toString();'+
'    $("#RPM_digit1000").text(rpmDigit1000);'+
'});'+

'$("#RPM_digit100_inc_button").click(function(){'+
'    if(rpmDigit1000 < 8) {'+
'        if(rpmDigit100 < 9) {'+
'            rpmDigit100 = rpmDigit100 + 1;'+
'        }'+
'    }'+
'    rpmValue = rpmDigit1000.toString() + rpmDigit100.toString() + rpmDigit10.toString() + rpmDigit1.toString();'+
'    $("#RPM_digit100").text(rpmDigit100);'+
'});'+

'$("#RPM_digit10_inc_button").click(function(){'+
'    if(rpmDigit1000 < 8) {'+
'        if(rpmDigit10 < 9) {'+
'            rpmDigit10 = rpmDigit10 + 1;'+
'        }'+
'    }'+
'    rpmValue = rpmDigit1000.toString() + rpmDigit100.toString() + rpmDigit10.toString() + rpmDigit1.toString();'+
'    $("#RPM_digit10").text(rpmDigit10);'+
'});'+

'$("#RPM_digit1_inc_button").click(function(){'+
'    if(rpmDigit1000 < 8) {'+
'        if(rpmDigit1 < 9) {'+
'            rpmDigit1 = rpmDigit1 + 1;'+
'        }'+
'    }'+
'    rpmValue = rpmDigit1000.toString() + rpmDigit100.toString() + rpmDigit10.toString() + rpmDigit1.toString();'+
'    $("#RPM_digit1").text(rpmDigit1);'+
'});'+

'$("#RPM_digit1000_dec_button").click(function(){'+
'    if(rpmDigit1000 > 1) {'+
'        rpmDigit1000 = rpmDigit1000 - 1;'+
'    }'+
'    rpmValue = rpmDigit1000.toString() + rpmDigit100.toString() + rpmDigit10.toString() + rpmDigit1.toString();'+
'    $("#RPM_digit1000").text(rpmDigit1000);'+
'});'+

'$("#RPM_digit100_dec_button").click(function(){'+
'    if(rpmDigit100 > 0) {'+
'        rpmDigit100 = rpmDigit100 - 1;'+
'    }'+
'    rpmValue = rpmDigit1000.toString() + rpmDigit100.toString() + rpmDigit10.toString() + rpmDigit1.toString();'+
'    $("#RPM_digit100").text(rpmDigit100);'+
'});'+

'$("#RPM_digit10_dec_button").click(function(){'+
'    if(rpmDigit10 > 0) {'+
'        rpmDigit10 = rpmDigit10 - 1;'+
'    }'+
'    rpmValue = rpmDigit1000.toString() + rpmDigit100.toString() + rpmDigit10.toString() + rpmDigit1.toString();'+
'    $("#RPM_digit10").text(rpmDigit10);'+
'});'+

'$("#RPM_digit1_dec_button").click(function(){'+
'    if(rpmDigit1 > 0) {'+
'        rpmDigit1 = rpmDigit1 - 1;'+
'    }'+
'    rpmValue = rpmDigit1000.toString() + rpmDigit100.toString() + rpmDigit10.toString() + rpmDigit1.toString();'+
'    $("#RPM_digit1").text(rpmDigit1);'+
'});'+


'function updateFuelManual() {'+
'    bathPerLiteManual = bathPerLiteActual;'+
'    let pos = bathPerLiteManual.indexOf(".");'+
'    let bahtValue = bathPerLiteManual.slice(0,pos);'+
'    let satangValue = bathPerLiteManual.slice(pos+1);'+
'    if(bahtValue.length == 1) {'+
'        bathPerLiteB1 = parseInt(bahtValue);'+
'        bathPerLiteB10 = 0;'+
'    } else {'+
'        bathPerLiteB1 = parseInt(bahtValue[1]);'+
'        bathPerLiteB10 = parseInt(bahtValue[0]);'+
'    }'+
'    if(satangValue.length == 1) {'+
'        bathPerLiteS1 = parseInt(satangValue);'+
'        bathPerLiteS10 = 0;'+
'    } else {'+
'        bathPerLiteS1 = parseInt(satangValue[0]);'+
'        bathPerLiteS10 = parseInt(satangValue[1]);'+
'    }'+
'    $("#B_digit10").text(bathPerLiteB10);'+
'    $("#B_digit1").text(bathPerLiteB1);'+
'    $("#S_digit1").text(bathPerLiteS1);'+
'    $("#S_digit10").text(bathPerLiteS10);'+
'}'+
'$("#B_digit10_inc_button").click(function(){'+
'    if(bathPerLiteB10 < 9) {'+
'        bathPerLiteB10 = bathPerLiteB10 + 1;'+
'    }'+
'    bathPerLiteManual = bathPerLiteB10.toString() + bathPerLiteB1.toString() +"." + bathPerLiteS1.toString() + bathPerLiteS10.toString();'+
'    $("#B_digit10").text(bathPerLiteB10);'+
'});'+
'$("#B_digit1_inc_button").click(function(){'+
'    if(bathPerLiteB1 < 9) {'+
'        bathPerLiteB1 = bathPerLiteB1 + 1;'+
'    }'+
'    bathPerLiteManual = bathPerLiteB10.toString() + bathPerLiteB1.toString() +"." + bathPerLiteS1.toString() + bathPerLiteS10.toString();'+
'    $("#B_digit1").text(bathPerLiteB1);'+
'});'+
'$("#S_digit10_inc_button").click(function(){'+
'    if(bathPerLiteS10 < 9) {'+
'        bathPerLiteS10 = bathPerLiteS10 + 1;'+
'    }'+
'    bathPerLiteManual = bathPerLiteB10.toString() + bathPerLiteB1.toString() +"." + bathPerLiteS1.toString() + bathPerLiteS10.toString();'+
'    $("#S_digit10").text(bathPerLiteS10);'+
'});'+
'$("#S_digit1_inc_button").click(function(){'+
'    if(bathPerLiteS1 < 9) {'+
'        bathPerLiteS1 = bathPerLiteS1 + 1;'+
'    }'+
'    bathPerLiteManual = bathPerLiteB10.toString() + bathPerLiteB1.toString() +"." + bathPerLiteS1.toString() + bathPerLiteS10.toString();'+
'    $("#S_digit1").text(bathPerLiteS1);'+
'});'+

'$("#B_digit10_dec_button").click(function(){'+
'    if(bathPerLiteB10 > 0) {'+
'        bathPerLiteB10 = bathPerLiteB10 - 1;'+
'    }'+
'    bathPerLiteManual = bathPerLiteB10.toString() + bathPerLiteB1.toString() +"." + bathPerLiteS1.toString() + bathPerLiteS10.toString();'+
'    $("#B_digit10").text(bathPerLiteB10);'+
'});'+
'$("#B_digit1_dec_button").click(function(){'+
'    if(bathPerLiteB1 > 0) {'+
'        bathPerLiteB1 = bathPerLiteB1 - 1;'+
'    }'+
'    bathPerLiteManual = bathPerLiteB10.toString() + bathPerLiteB1.toString() +"." + bathPerLiteS1.toString() + bathPerLiteS10.toString();'+
'    $("#B_digit1").text(bathPerLiteB1);'+
'});'+
'$("#S_digit10_dec_button").click(function(){'+
'    if(bathPerLiteS10 > 0) {'+
'        bathPerLiteS10 = bathPerLiteS10 - 1;'+
'    }'+
'    bathPerLiteManual = bathPerLiteB10.toString() + bathPerLiteB1.toString() +"." + bathPerLiteS1.toString() + bathPerLiteS10.toString();'+
'    $("#S_digit10").text(bathPerLiteS10);'+
'});'+
'$("#S_digit1_dec_button").click(function(){'+
'    if(bathPerLiteS1 > 0) {'+
'        bathPerLiteS1 = bathPerLiteS1 - 1;'+
'    }'+
'    bathPerLiteManual = bathPerLiteB10.toString() + bathPerLiteB1.toString() +"." + bathPerLiteS1.toString() + bathPerLiteS10.toString();'+
'    $("#S_digit1").text(bathPerLiteS1);'+
'});'+


'function warningShow(typeW,subjectTxt,bodyTxt){'+
'    if(typeW == 1) {'+
'        $("#warnSubject").text(subjectTxt);'+
'        $("#messageBody").html(bodyTxt);'+
'        warning_type = 1;'+
'    }'+
'}'+
'$("#warning_ok_button").click(function(){'+
'    if(warning_type == 1) {'+
'        bResetDistance = true;'+
'    }'+
'    $("#dialogWarningDiv").css("visibility","hidden");'+
'});'+
'$("#warning_cancle_button").click(function(){'+
'    $("#dialogWarningDiv").css("visibility","hidden");'+
'});'+


'$("#mainmenu_3").click(function(){'+
'    if(speedRestrict120Manual) {'+
'        speedRestrict120Manual = false;'+
'    } else {'+
'        speedRestrict120Manual = true;'+
'    }'+
'    bRefreshSpeedRestrict120 = true;'+
'});'+
'function updateSpeedRestrictFlag(speedRestrict120ManualFG) {'+
'    if(speedRestrict120ManualFG) {'+
'        $("#mainmenu_3").removeClass("uncheck");'+
'        $("#speedLimit120IndicatorDiv").css("visibility","visible");'+
'        $("#mainmenu_3").addClass("checked");'+
'    } else {'+
'        $("#mainmenu_3").removeClass("checked");'+
'        $("#speedLimit120IndicatorDiv").css("visibility","hidden");'+
'        $("#mainmenu_3").addClass("uncheck");'+
'    }'+
'}'+
'});'+
'</script>';
}

/*
 * =========================
 * Standard Template API functions
 * =========================
 */

/* (internal - called by the framework)
 * Handles multicontroller events.
 * @param   eventID (string) any of the “Internal event name” values in IHU_GUI_MulticontrollerSimulation.docx (e.g. 'cw',
 * 'ccw', 'select')
 */
MZDMeterTmplt.prototype.handleControllerEvent = function(eventID)
{
  log.debug('handleController() called, eventID: ' + eventID);

  const retValue = 'giveFocusLeft';
  return retValue;
};
/*
 * Called by the app during templateNoLongerDisplayed. Used to perform garbage collection procedures on the template and
 * its controls.
 */
MZDMeterTmplt.prototype.cleanUp = function()
{

};

framework.registerTmpltLoaded('MZDMeterTmplt', null);
