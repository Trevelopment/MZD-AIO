export const openSideNav = () => {
  document.getElementById('mainSidenav').style.width = '250px';
  document.getElementById('CommonBgImg1').style.marginLeft = '250px';
  $('#StatusBar_ButtonCtrl1').addClass('hidden');
  $('#StatusBar_ButtonCtrl1').hide();
  $('#mainOpenNav').css({'opacity': '.5'});
};
export const closeSideNav = () => {
  document.getElementById('mainSidenav').style.width = '0';
  document.getElementById('CommonBgImg1').style.marginLeft= '0';
  $('#mainOpenNav').css({'opacity': '1'});
};
export const navReboot = () =>{
  mzdWs('reboot', false); // reboot
};
export const messageTest = (msg) => {
  mzdWs('sh /tmp/mnt/sd_nav/msg/message.sh "'+msg+'"', false);
};
export const mzdWs = (action, waitMessage) => {
  const ws = new WebSocket('ws://127.0.0.1:9969/');

  ws.onmessage = function(event) {
    // const res = event.data.split('#');
    ws.close();
  };

  ws.onopen = () => {
    ws.send(action);
    if (!waitMessage) {
      ws.close();
    }
  };
};
/*
// create the div for template
this.divElt = document.createElement('div');
this.divElt.id = templateID;
this.divElt.className = "TemplateFull MzdAIOTmplt";

parentDiv.appendChild(this.divElt);

// Build The Environment
this.divElt.innerHTML = '<ul class="tab" style="margin-top:60px">' +
'<li><a href="javascript:void(0)" class="tablinks" id="Main">Main Menu</a></li>' +
'<li><a href="javascript:void(0)" class="tablinks" id="Twk">Tweaks</a></li>' +
'<li><a href="javascript:void(0)" class="tablinks" id="Opt">Options</a></li>' +
'</ul>' +
'<div id="MainMenu" class="tabcontent animate-zoom">' +
'<h3 style="padding:10px">Main Menu Stuff</h3>'+
'</div>'+
'<div id="Tweaks" class="tabcontent animate-zoom">'+
'<h3 style="padding:10px">Tweak Stuff</h3>'+
'<button class="rebootBtnDiv" style="background-image: url(apps/custom/apps/_videoplayer/templates/VideoPlayer/images/rebootSys.png)"></button>'+
'</div>'+
'<div id="Options" class="tabcontent animate-zoom">'+
'<h3 style="padding:10px">Options & Stuff</h3>'+
'</div>'+
'<script src="apps/custom/apps/_mzdaio/js/mzd.js" type="text/javascript"></script>';

// Tab Openers
$("#Main").on('click',function(){$('.tabcontent').hide();$('#MainMenu').show()})
$("#Twk").on('click',function(){$('.tabcontent').hide();$('#Tweaks').show()})
$("#Opt").on('click',function(){$('.tabcontent').hide();$('#Options').show()})

// Buttons
this.button1 =  $("<button/>").attr("id", "Star1").text('Star 1').appendTo($('#MainMenu'));
this.button1.on('click',function(){changeLayout('star1');$('#MainMenuMsg').text('Star 1')});
this.button2 =  $("<button/>").attr("id", "Star2").text('Star 2').appendTo($('#MainMenu'));
this.button2.on('click',function(){changeLayout('star3');$('#MainMenuMsg').text('Star 2')});
this.button11 =  $("<button/>").attr("id", "inverted").text('Inverted').appendTo($('#MainMenu'));
this.button11.on('click',function(){changeLayout('star2');$('#MainMenuMsg').text('Inverted')});
this.button3 =  $("<button/>").attr("id", "ellipse").text('Ellipse').appendTo($('#MainMenu'));
this.button3.on('click',function(){$('body').toggleClass('ellipse');$('#MainMenuMsg').text('Ellipse')});
this.button4 =  $("<button/>").attr("id", "minicoins").text('Mini Coins').appendTo($('#MainMenu'));
this.button4.on('click',function(){$('body').toggleClass('minicoins');$('#MainMenuMsg').text('Mini Coins');localStorage.mainMenuLayout += " minicoins";});
this.button5 =  $("<button/>").attr("id", "label3d").text('3D Label').appendTo($('#MainMenu'));
this.button5.on('click',function(){$('body').toggleClass('label3d');$('#MainMenuMsg').text('3D Label');localStorage.mainMenuLayout += " label3d";});
this.button6 =  $("<button/>").attr("id", "noBgBtn").text('Remove Button Background').appendTo($('#MainMenu'));
this.button6.on('click',function(){$('body').toggleClass('no-btn-bg');$('#MainMenuMsg').text('Button Backgrounds');localStorage.mainMenuLayout += " no-btn-bg";});
this.button7=  $("<button/>").attr("id", "bgrAlbmArt").text('Bigger Albm Art').appendTo($('#MainMenu'));
this.button7.on('click',function(){$('body').toggleClass('bgrAlbmArt');$('#MainMenuMsg').text('Bigger Albm Art');localStorage.mainMenuLayout += " bgrAlbmArt";});
this.button8=  $("<button/>").attr("id", "txtShadow").text('Text Shadow').appendTo($('#MainMenu'));
this.button8.on('click',function(){$('body').toggleClass('txtShadow');$('#MainMenuMsg').text('Text Shadow');localStorage.mainMenuLayout += " txtShadow";});
this.button8=  $("<button/>").attr("id", "hideStatus").text('Hide StatusBar').appendTo($('#MainMenu'));
this.button8.on('click',function(){$('body').toggleClass('hideStatus');$('#MainMenuMsg').text('Hide StatusBar');localStorage.mainMenuLayout += " hideStatus";});
this.button8=  $("<button/>").attr("id", "hideSbn").text('Hide Notification Outline').appendTo($('#MainMenu'));
this.button8.on('click',function(){$('body').toggleClass('hideSbn');$('#MainMenuMsg').text('Hide Notification Outline');localStorage.mainMenuLayout += " hideSbn";});
this.mainMsg =  $("<div/>").attr("id", "MainMenuMsg").css({"padding":"10px"}).appendTo($('#MainMenu'));
this.button9 =  $("<button/>").attr("id", "clear").text('Reset Main Menu Layout').insertAfter($('#MainMenuMsg'));
this.button9.on('click',function(){$('body').attr('class','');$('#MainMenuMsg').text('Main Menu Restored');localStorage.removeItem(mainMenuLayout);});

this.button10 =  $("<button/>").attr("id", "twkOut").text('Home').appendTo($('#Tweaks'));
this.button10.on('click',function(){framework.sendEventToMmui("common", "Global.IntentHome")});
this.button11 =  $("<button/>").attr("id", "test").text('Test').appendTo($('#Tweaks'));
this.button11.on('click',function(){setMainMenuLoop()});

$('.tablinks').click(function(){$('.tablinks').removeClass('active');$(this).addClass('active');});
$('#Main').click();


}
function setMainMenuLoop() {
  _MainMenuLoop = function(direction)
  {
    let index = this._getFocus();
    index += direction;

    if (index < 0)
    {
      index = 4;
    }
    if (index > 4)
    {
      index = 0;
    }

    if (index !== this._getFocus())
    {
      this._setFocus(index);
      this._setHighlight(index);
    }
  }

  MainMenuCtrl.prototype._offsetFocus =  _MainMenuLoop
}
*/
