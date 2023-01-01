import {CustomApplication, CustomApplicationsHandler} from '../../resources/aio';
/**
 * [Custom clock for car]
 *
 * @version: 1.1.0
 * @author: JF Blouin & Trezdog44
 * @description Displays a clock
 *
 * Note:
 *   Clock inspired by http://www.javascriptkit.com/script/script2/css3analogclock.shtml
 *   Background image taken from SDK Speedometer app
 */

CustomApplicationsHandler.register('app.clock', new CustomApplication({

  /**
   * (require) Dependencies for the application
   */
  require: {
    js: [],
    css: ['app.css'],
    images: {},
  },

  /**
   * (settings) Settings for application
   */
  settings: {
    // terminateOnLost: false,
    title: 'Clock',
    statusbar: false,
    statusbarIcon: true,
    // statusbarTitle: false,
    // statusbarHideHomeButton: true,
    hasLeftButton: false,
    hasMenuCaret: false,
    hasRightArc: false,

  },

  /**
   * (created) Creates the UI
   */
  created: () => {
    const div = document.createElement('div');
    div.setAttribute('id', 'liveclock');
    div.setAttribute('class', 'outer_face');
    div.innerHTML = '';
    div.innerHTML += '<div class=\'marker oneseven\'></div>';
    div.innerHTML += '<div class=\'marker twoeight\'></div>';
    div.innerHTML += '<div class=\'marker fourten\'></div>';
    div.innerHTML += '<div class=\'marker fiveeleven\'></div>';
    div.innerHTML += '<div class=\'inner_face\'>';
    div.innerHTML += '<div class=\'timedigital\'></div>';
    div.innerHTML += '<div class=\'hand hour\'></div>';
    div.innerHTML += '<div class=\'hand minute\'></div>';
    div.innerHTML += '<div class=\'hand second\'></div>';
    div.innerHTML += '</div>';
    this.canvas.get(0).appendChild(div);

    const divTop = document.createElement('div');
    divTop.setAttribute('id', 'lighting');
    divTop.setAttribute('class', 'lighting');
    this.canvas.get(0).appendChild(divTop);

    // Defaults
    this.screenOff = false;
    this.screenOpacity = 0;
    this.showBG = true;
    this.showSB = false;
  },

  /**
   * (focused) When application is put into focus
   */
  focused: () => {
    this.timerClock = setInterval(() => {
      const hands = $('#liveclock div.hand');
      const curdate = new Date(framework.common.getCurrentTime());
      const hour_as_degree = (curdate.getHours() + curdate.getMinutes() / 60) / 12 * 360;
      const minute_as_degree = (curdate.getMinutes() + curdate.getSeconds() / 60) / 60 * 360;
      const second_as_degree = (curdate.getSeconds() + curdate.getMilliseconds() / 1000) / 60 * 360;
      hands.filter('.hour').css({transform: 'rotate(' + hour_as_degree + 'deg)'});
      hands.filter('.minute').css({transform: 'rotate(' + minute_as_degree + 'deg)'});
      hands.filter('.second').css({transform: 'rotate(' + second_as_degree + 'deg)'});
      const timeText = (curdate.getHours()) + ':' + (curdate.getMinutes() < 10 ? '0' + curdate.getMinutes() : curdate.getMinutes());
      $('.timedigital').text(timeText);
    }, 1000);
  },


  /**
   * (lost) When application loses focus
   */
  lost: () => {
    clearInterval(this.timerClock);
  },

  /**
   * (event) When a controller key is pressed
   */
  onControllerEvent: function(eventId) {
    switch (eventId) {
      case this.SELECT:
        if (this.screenOff) {
          $('#lighting').css({opacity: this.screenOpacity, zIndex: ''});
        } else {
          $('#lighting').css({opacity: 1, zIndex: '2000'});
        }
        this.screenOff = !this.screenOff;
        break;
      case this.CW:
        this.screenOpacity = this.screenOpacity - 0.1;
        if (this.screenOpacity < 0) {
          this.screenOpacity = 0;
        }
        $('#lighting').css({opacity: this.screenOpacity});
        break;
      case this.CCW:
        this.screenOpacity = this.screenOpacity + 0.1;
        if (this.screenOpacity > 1) {
          this.screenOpacity = 1;
        }
        $('#lighting').css({opacity: this.screenOpacity});
        break;
      case this.UP:
        this.showSB = !this.showSB;
        framework.common.statusBar.setVisible('slide', this.showSB);
        $('.StatusBarCtrlAppName').text('Clock');
        $('.StatusBarCtrlDomainIcon').css({'backgroundImage': 'url(apps/custom/apps/app.clock/app.png)'});
        framework.common.statusBar.divElt.style.visibility = this.showSB;
        break;
      case this.DOWN:
        this.showBG = !this.showBG;
        $('[app="app.clock"]').css({background: (this.showBG ? '' : 'none')});
        break;
      default:
    }
  },


})); /** EOF **/
