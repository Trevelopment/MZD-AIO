function updateMZDApp() {
  // speedTop = 0;
  $('.StatusBarCtrlDomainIcon').css('background-image', 'url(\'/jci/gui/apps/_mzdmeter/mazda_logo.png\')');
  $('.topSpeedNeedle').css('transform', 'rotate('+(-120+speedTop)+'deg)');
  $('.idleTimeValue').text(idleTimeValue);
  $('#mzdInfoDiv').addClass('visuallyhidden');
  $('#mzdInfoDiv').addClass('hidden');
  $('#mzdwheelSetBGDiv').addClass('visuallyhidden');
  $('#mzdwheelSetBGDiv').addClass('hidden');

  GPSAltitudeCur = 99999;
  rpmAlarmLimitValue = 9999;
  speedRestrict120 = null;
  showInfo = 0;
  gearPrev = 0;
  showAlarmLayer = 0;
  egtAlarmFg = 0;
  steeringDetect = 0;
  fuelDialogShow = 0;
  fuelDialogPage = 1;
  wheelPosPrev = 0;
  newLogoChanged = false;
  defaultLogoChanged = false;
  updateGearPosition();
  updateSteering();
  updateParking();
}
