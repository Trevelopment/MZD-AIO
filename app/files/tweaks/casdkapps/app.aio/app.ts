import {CustomApplication, CustomApplicationsHandler} from '../../casdk/resources/aio';
/**
* Custom Applications SDK for Mazda Connect Infotainment System
*
* A mini framework that allows to write custom applications for the Mazda Connect Infotainment System
* that includes an easy to use abstraction layer to the JCI system.
*
* Written by Andreas Schwarz (http://github.com/flyandi/mazda-custom-applications-sdk)
* Copyright (c) 2016. All rights reserved.
*
* WARNING: The installation of this application requires modifications to your Mazda Connect system.
* If you don't feel comfortable performing these changes, please do not attempt to install this. You might
* be ending up with an unusuable system that requires reset by your Dealer. You were warned!
*
* This program is free software: you can redistribute it and/or modify it under the terms of the
* GNU General Public License as published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
* the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
* License for more details.
*
* You should have received a copy of the GNU General Public License along with this program.
* If not, see http://www.gnu.org/licenses/
*
*/

/**
* Multicontroller Example Applicatiom
*
* This is a tutorial example application showing and testing the built-in Multicontroller context
* aware methods.
*
*/


CustomApplicationsHandler.register('app.aio', new CustomApplication({

  /**
  * (require)
  *
  * An object array that defines resources to be loaded such as javascript's, css's, images, etc
  *
  * All resources are relative to the applications root path
  */

  require: {

    /**
    * (js) defines javascript includes
    */

    js: ['aio.js'],

    /**
    * (css) defines css includes
    */

    css: ['app.css'],

    /**
    * (images) defines images that are being preloaded
    *
    * Images are assigned to an id
    */

    images: {},

  },

  /**
  * (settings)
  *
  * An object that defines application settings
  */

  settings: {

    /**
    * (terminateOnLost)
    *
    * If set to 'true' this will remove the stateless life cycle and always
    * recreate the application once the focus is lost. Otherwise by default
    * the inital created state will stay alive across the systems runtime.
    *
    * Default is false or not set
    * /

    // terminateOnLost: false,

    /**
    * (title) The title of the application in the Application menu
    */

    title: 'AIO CASDK',

    /**
    * (statusbar) Defines if the statusbar should be shown
    */

    statusbar: true,

    /**
    * (statusbarIcon) defines the status bar icon
    *
    * Set to true to display the default icon app.png or set a string to display
    * a fully custom icon.
    *
    * Icons need to be 37x37
    */

    statusbarIcon: true,

    /**
    * (statusbarTitle) overrides the statusbar title, otherwise title is used
    */

    statusbarTitle: false,


    /**
    * (hasLeftButton) indicates if the UI left button / return button should be shown
    */

    hasLeftButton: false,

    /**
    * (hasMenuCaret) indicates if the menu item should be displayed with an caret
    */

    hasMenuCaret: false,

    /**
    * (hasRightArc) indicates if the standard right car should be displayed
    */

    hasRightArc: true,

  },


  /** *
  *** User Interface Life Cycles
  ***/

  /**
  * (created)
  *
  * Executed when the application gets initialized
  *
  * Add any content that will be static here
  */

  created: () => {
    // let's build our interface

    // 1) create our context aware sections
    // this.createSections();
    // this.buildAIO();

    // 2) create our statusbar
    $('<div id="mainSidenav" class="sidenav"><a href="javascript:void(0)" class="closebtn" id="mainCloseNav" style="color:#fff;white-space:nowrap;">&times;</a><a id="sideNavHome">Home</a><a id="messageTest">Message</a><a id="playTest">Play</a><a id="shiftTest">Shift</a><a id="sideNavWifi">Wifi Settings</a><a id="sideNavWifi2">Wifi Settings Test</a><a id="sideNavResetTweaks">Reset Tweaks</a><a id="sideNavShowHome">Remove SideNav</a><a id="sideNavReboot">Reboot</a></div>').insertBefore($('#CommonBgImg1'));
    $('<span id="mainOpenNav"><img src="/jci/gui/apps/custom/apps/app.aio/nav.png" style="width:40px;height:40px;padding:5px;" /></span>').insertBefore($('#StatusBarCtrl1'));

    this.statusBar = $('<div/>').addClass('status').appendTo(this.canvas);

    if ( localStorage.mainMenuLayout !== undefined ) {
      $('body').attr('class', localStorage.mainMenuLayout);
    }
    if ( localStorage.mainMenuLoop !== undefined ) {

    }
    $(() => {
      // Hide home button
      $('#StatusBar_ButtonCtrl1').addClass('hidden');
      $('#StatusBar_ButtonCtrl1').hide();
      $('.StatusBarCtrlHomeBtn').css({'background': 'none'});

      $('#mainOpenNav').click(openSideNav);
      $('#mainCloseNav').click(closeSideNav);
      $('#sideNavWifi').click(() => {
        // framework.sendEventToMmui("system", "SelectSettings");

        framework.sendEventToMmui('syssettings', 'SelectDevicesTab');

        framework.sendEventToMmui('syssettings', 'SelectNetworkManagement');
        closeSideNav();
      });
      $('#sideNavWifi2').click(() => {
        framework.sendEventToMmui('syssettings', 'SelectNetworkManagement');
        closeSideNav();
      });
      $('#sideNavHome').click(() => {
        framework.sendEventToMmui('common', 'Global.IntentHome');
        closeSideNav();
      });
      $('#sideNavResetTweaks').click(() => {
        $('body').attr('class', '');
        localStorage.removeItem('mainMenuLayout');
        closeSideNav();
      });
      $('#sideNavReboot').click(() => {
        navReboot();
        closeSideNav();
        $('#mainOpenNav').hide();
      });
      $('#sideNavShowHome').click(() => {
        closeSideNav();
        $('#StatusBar_ButtonCtrl1').removeClass('hidden');
        $('#StatusBar_ButtonCtrl1').show();
        $('#mainOpenNav').hide();
        $('#mainCloseNav').hide();
        $('#mainSidenav').hide();
        $('.StatusBarCtrlHomeBtn').css({'background': 'url("/jci/gui/common/images/icons/IcnSbHome.png") center center no-repeat'});
      });
      $('#messageTest').click(messageTest('TESTYBALLS'));
      $('#playTest').click(() => {
        framework.sendEventToMmui('common', 'Global.Pause');
      });
      $('#shiftTest').click(() => {
        $('.CommonBgImg').animate({'background-position': '-=800px'}, 'slow');
      });
    });
  },

  /** *
  *** Events
  ***/

  /**
  * (event) onControllerEvent
  *
  * Called when a new (multi)controller event is available
  */

  onControllerEvent: function(eventId) {

    // We only get not processed values from the multicontroller here

  },


  /**
  * (event) onContextEvent
  *
  * Called when the context of an element was changed
  */

  onContextEvent: function(eventId, context, element) {

    // We only get not processed values from the multicontroller here

  },


  /** *
  *** Applicaton specific methods
  ***/

  /**
  * (createSections)
  *
  * This method registers all the sections we want to display
  */

  createSections: () => {
    [

      {top: 20, left: 20, title: 'Main Menu'},
      {top: 20, left: 150, title: 'Tweaks'},
      {top: 20, left: 270, title: 'Options'},

    ].forEach(function(item) {
      /**
      * addContext is our main method to make anything a context aware item and expects either
      * a JQUERY or DOM element.
      *
      */
      this.addContext($('<div/>').addClass('section').css(item).append(item.title).appendTo(this.canvas), function(event, element) {

      });
    }.bind(this));
  },
  makeButtons: () => {
    // Buttons
    this.button1 = $('<button/>').attr('id', 'Star1').text('Star 1').appendTo($('#MainMenu'));
    this.button1.on('click', () => {
      changeLayout('star1'); $('#MainMenuMsg').text('Star 1');
    });
    this.button2 = $('<button/>').attr('id', 'Star2').text('Star 2').appendTo($('#MainMenu'));
    this.button2.on('click', () => {
      changeLayout('star3'); $('#MainMenuMsg').text('Star 2');
    });
    this.button11 = $('<button/>').attr('id', 'inverted').text('Inverted').appendTo($('#MainMenu'));
    this.button11.on('click', () => {
      changeLayout('star2'); $('#MainMenuMsg').text('Inverted');
    });
    this.button3 = $('<button/>').attr('id', 'ellipse').text('Ellipse').appendTo($('#MainMenu'));
    this.button3.on('click', () => {
      $('body').toggleClass('ellipse'); $('#MainMenuMsg').text('Ellipse');
    });
    this.button4 = $('<button/>').attr('id', 'minicoins').text('Mini Coins').appendTo($('#MainMenu'));
    this.button4.on('click', () => {
      $('body').toggleClass('minicoins'); $('#MainMenuMsg').text('Mini Coins');
    });
    this.button5 = $('<button/>').attr('id', 'label3d').text('3D Label').appendTo($('#MainMenu'));
    this.button5.on('click', () => {
      $('body').toggleClass('label3d'); $('#MainMenuMsg').text('3D Label');
    });
    this.button6 = $('<button/>').attr('id', 'noBgBtn').text('Remove Button Background').appendTo($('#MainMenu'));
    this.button6.on('click', () => {
      $('body').toggleClass('no-btn-bg'); $('#MainMenuMsg').text('Button Backgrounds');
    });
    this.button7= $('<button/>').attr('id', 'bgrAlbmArt').text('Bigger Albm Art').appendTo($('#MainMenu'));
    this.button7.on('click', () => {
      $('body').toggleClass('bgrAlbmArt'); $('#MainMenuMsg').text('Bigger Albm Art');
    });
    this.button8= $('<button/>').attr('id', 'txtShadow').text('Text Shadow').appendTo($('#MainMenu'));
    this.button8.on('click', () => {
      $('body').toggleClass('txtShadow'); $('#MainMenuMsg').text('Text Shadow');
    });
    this.button8= $('<button/>').attr('id', 'hideStatus').text('Hide StatusBar').appendTo($('#MainMenu'));
    this.button8.on('click', () => {
      $('body').toggleClass('hideStatus'); $('#MainMenuMsg').text('Hide StatusBar');
    });
    this.button8= $('<button/>').attr('id', 'hideSbn').text('Hide Notification Outline').appendTo($('#MainMenu'));
    this.button8.on('click', () => {
      $('body').toggleClass('hideSbn'); $('#MainMenuMsg').text('Hide Notification Outline');
    });
    this.mainMsg = $('<div/>').attr('id', 'MainMenuMsg').css({'padding': '10px'}).appendTo($('#MainMenu'));
    this.button9 = $('<button/>').attr('id', 'clear').text('Reset Main Menu Layout').insertAfter($('#MainMenuMsg'));
    this.button9.on('click', () => {
      $('body').attr('class', ''); $('#MainMenuMsg').text('Main Menu Restored'); localStorage.removeItem('mainMenuLayout');
    });
    this.mmLoopBtn = $('<button/>').attr('id', 'mainMenuLoop').text('Main Menu Loop').appendTo($('#MainMenu'));

    this.button10 = $('<button/>').attr('id', 'twkOut').text('Home').appendTo($('#Tweaks'));
    this.button10.on('click', () => {
      framework.sendEventToMmui('common', 'Global.IntentHome');
    });
    this.button11 = $('<button/>').attr('id', 'usba').text('USB A').appendTo($('#Tweaks'));
    this.button11.on('click', () => {
      framework.sendEventToMmui('system', 'SelectUSBA');
    });
    this.button12 = $('<button/>').attr('id', 'usbb').text('USB B').appendTo($('#Tweaks'));
    this.button12.on('click', () => {
      framework.sendEventToMmui('system', 'SelectUSBB');
    });
    this.button13 = $('<button/>').attr('id', 'BlutoothAudio').text('Blutooth').appendTo($('#Tweaks'));
    this.button13.on('click', () => {
      framework.sendEventToMmui('system', 'SelectBTAudio');
    });
    $('<br>').appendTo($('#Tweaks'));
    this.buttonplay = $('<button/>').attr('id', 'playBtn').text('Play').appendTo($('#Tweaks'));
    this.buttonplay.on('click', () => {
      framework.sendEventToMmui('Common', 'Global.Play');
    });
    this.buttonresume = $('<button/>').attr('id', 'resumeBtn').text('Resume').appendTo($('#Tweaks'));
    this.buttonresume.on('click', () => {
      framework.sendEventToMmui('Common', 'Global.Resume');
    });
    this.buttonpause = $('<button/>').attr('id', 'pauseBtn').text('Pause').appendTo($('#Tweaks'));
    this.buttonpause.on('click', () => {
      framework.sendEventToMmui('Common', 'Global.Pause');
    });
    $('<br>').appendTo($('#Tweaks'));
    this.buttonPrevious = $('<button/>').attr('id', 'previousTrackBtn').text('Previous').appendTo($('#Tweaks'));
    this.buttonPrevious.on('click', () => {
      framework.sendEventToMmui('Common', 'Global.Previous');
    });
    this.buttonNext = $('<button/>').attr('id', 'nextTrackBtn').text('Next').appendTo($('#Tweaks'));
    this.buttonNext.on('click', () => {
      framework.sendEventToMmui('Common', 'Global.Next');
    });

    $('<button/>').attr('id', 'test').text('Test').appendTo($('#Options'));
    $('<button/>').attr('id', 'touchscreenBtn').text('Touchscreen').appendTo($('#Options'));
    $('<br>').appendTo($('#Options'));

    this.rsetbg = $('<button/>').attr('id', 'resetBG').text('Reset Background').appendTo($('#Options'));
    this.rsetbg.on('click', () => {
      localStorage.removeItem('background');
    });
    $('<button/>').attr('id', 'aioReboot').text('Reboot').appendTo($('#Options'));

    $('.tablinks').click(() => {
      $('.tablinks').removeClass('active'); $(this).addClass('active');
    });
    $('#Main').click();
  },

}));
