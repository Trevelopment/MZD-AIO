/* ************************************************************************** *\
** ************************************************************************** **
** MZD-AIO-TI                                                                 **
** By: Trezdog44 - Trevor Martin                                              **
** http://mazdatweaks.com                                                     **
** ©2017 Trevelopment                                                         **
**                                                                            **
** home.js - The main AngularJS module & controller used to connect the main  **
** process and in the build process.                                          **
**                                                                            **
** ************************************************************************** **
\* ************************************************************************** */
/* jshint -W117 */
(function () {
  'use strict'
  angular.module('AIO', ['checklist-model', 'ngSanitize', 'ngRoute'])// 'angular-electron'
  .controller('JoinerCtrl', ['$scope', '$http', JoinerCtrl])
  .controller('TranslatorCtrl', ['$scope', '$http', TranslatorCtrl])
  .controller('helpCtrl', ['$scope', '$http', helpCtrl])
  .controller('CasdkCtrl', ['$scope', '$http', CasdkCtrl])
  .controller('MainCtrl', function ($scope, $http, $route, $location) {
    // All scoped variables for labels come from launguage files in the '/lang' folder
    $scope.appName = app.getName()
    $scope.appVer = app.getVersion()
    $scope.newLanguage = 'NewLanguage'
    $scope.menu = langObj.menu
    $scope.mainOps = langObj.mainOps
    $scope.languages = langObj.languages
    $scope.tourMsgs = langObj.tourMsgs
    $scope.options = langObj.tweakOps
    $scope.disclaimOps = langObj.disclaimOps
    $scope.statusbar = langObj.statusbar
    $scope.uistyle = langObj.uistyle
    $scope.d2sbOps = langObj.d2sbOps
    $scope.speedoOps = langObj.speedoOps
    $scope.fuelOps = langObj.fuelOps
    $scope.faqs = langObj.FAQs
    $scope.popupMsgs = langObj.popupMsgs
    $scope.colors = langObj.colors
    $scope.rmCpDir = settings.get('delCopyFolder') || false
    $scope.loc = persistantData.get('locale') || 'en-US'
    $scope.twkfltr = ''
    $scope.bgSec = 60
    $scope.bgimg = null
    $scope.user = {
      twkfltr: '',
      lang: lang,
      options: [],
      menu: [9],
      mainOps: [0, 4, 5, 7],
      disclaimOps: 0,
      fuelOps: 0,
      colors: 1,
      aaVer: 1,
      d2sbOps: 3,
      zipbackup: false,
      forcessh: false,
      useColorBG: false,
      customTheme: false,
      keepSpeedRestrict: false,
      listbeep: false,
      advancedOps: false,
      dataDump: false,
      aaBetaVer: false,
      vpUnicode: false,
      darkMode: settings.get('darkMode') || false,
      flipOption: settings.get('flipOption') || '',
      transMsg: settings.get('transMsg') || false,
      copydir: persistantData.get('copyFolderLocation')
    }
    $scope.user.autorun = {
      installer: false,
      id7recovery: false,
      autoWIFI: false,
      autoADB: false,
      dryrun: false
    }
    $scope.user.mzdmeter = {
      show: persistantData.get('showMeter') || false,
      inst: false,
      uninst: false
    }
    $scope.user.restore = {
      full: false,
      delBackups: false
    }
    $scope.user.casdk = {
      inst: false,
      uninst: false
    }
    $scope.user.backups = {
      org: settings.get('keepBackups') || false,
      test: settings.get('testBackups') || false,
      skipconfirm: settings.get('skipConfirm') || false
    }
    $scope.user.boot = {
      logo1: 0,
      logo2: 0,
      logo3: 0
    }
    $scope.logoBoot = {
      logo1: 0,
      logo2: 0,
      logo3: 0
    }
    $scope.matrixBoot = {
      logo1: 1,
      logo2: 1,
      logo3: 1
    }
    $scope.bootCustom = {
      logo1: null,
      logo2: null,
      logo3: null
    }
    $scope.user.speedoOps = {
      lang: {id: 0},
      xph: {id: 11},
      sml: {id: 22},
      bg: {id: 30},
      effic: {id: 40},
      temperature: {id: 42},
      startbar: {id:45},
      color: null,
      mod: false,
      modAlt: false,
      simpmod: false,
      sbtemp: false,
      digiclock: false,
      opac: 0
    }
    $scope.user.statusbar = {
      main: false,
      app: '#ffffff',
      clock: '#ffffff',
      notif: '#ffffff',
      opacity: 0,
      uninst: false,
      d2sbinst: false,
      d2sbuninst: false
    }
    $scope.user.uistyle = {
      body: '#ffffff',
      listitem: '#ffffff',
      listitemdisabled: '#929497',
      title: '#ffffff',
      radio: '#ffffff',
      labelcolor: '#ffffff',
      mainlabel: 0,
      layout: 0,
      ellipse: false,
      shadow: false,
      minicoins: false,
      minifocus: false,
      hideglow: false,
      uninstmain: false,
      uninst: false,
      nobtnbg: false,
      nonpbg: false,
      nolistbg: false,
      nocallbg: false,
      notextbg: false,
      noalbm: false,
      fulltitles: false
    }
    $scope.user.swapOps = {
      mount: true,
      resources: false
    }
    $scope.user.rmvallbg = function(){
      $scope.user.uistyle.nobtnbg = true
      $scope.user.uistyle.nonpbg = true
      $scope.user.uistyle.nolistbg = true
      $scope.user.uistyle.nocallbg = true
      $scope.user.uistyle.notextbg = true
      $scope.$apply()
    }
    if ($scope.loc.toLowerCase().includes('en-us')) {
      // console.log('ENGLISH')
      $scope.user.speedoOps.xph.id = 10
      $scope.user.fuelOps = 1
    } else if ($scope.loc.includes('de')) {
      // console.log('GERMAN')
      $scope.user.speedoOps.lang.id = 1
    } else if ($scope.loc.includes('es')) {
      // console.log('SPANISH')
      $scope.user.speedoOps.lang.id = 2
    } else if ($scope.loc.includes('pl')) {
      // console.log('POLISH')
      $scope.user.speedoOps.lang.id = 3
    } else if ($scope.loc.includes('sl')) {
      // console.log('SLOVIC')
      $scope.user.speedoOps.lang.id = 4
    } else if ($scope.loc.includes('tk')) {
      // console.log('TURKISH')
      $scope.user.speedoOps.lang.id = 5
    } else if ($scope.loc.includes('fr')) {
      // console.log('FRENCH')
      $scope.user.speedoOps.lang.id = 6
    } else if ($scope.loc.includes('it')) {
      // console.log('ITALIAN')
      $scope.user.speedoOps.lang.id = 7
    }
    $scope.bootOps1 = langObj.bootOps1 || [
      {bootLogo: 'LoopLogo (default)', logo: 0},
      {bootLogo: 'Matrix', logo: 1},
      {bootLogo: 'Large Mazda Logo', logo: 2},
      {bootLogo: 'Fiat Logo', logo: 3},
      {bootLogo: 'MaZda-Z Logo', logo: 4},
      {bootLogo: 'Cinema Loop', logo: 5},
      {bootLogo: 'Criss Cross Loop', logo: 6},
      {bootLogo: 'MZD Race Loop', logo: 7}
    ]
    $scope.bootOps2 = langObj.bootOps2 || [
      {bootLogo: 'LoopLogo', logo: 0},
      {bootLogo: 'Matrix', logo: 1},
      {bootLogo: 'Large Mazda Logo', logo: 2},
      {bootLogo: 'Spider 124 Trans', logo: 3},
      {bootLogo: 'MaZda-Z Logo', logo: 4},
      {bootLogo: 'Cinema Loop', logo: 5},
      {bootLogo: 'Criss Cross Loop', logo: 6},
      {bootLogo: 'MZD Race Loop', logo: 7},
      {bootLogo: 'Mazda Trans (Default)', logo: 8}
    ]
    $scope.bootOps3 = langObj.bootOps3 || [
      {bootLogo: 'LoopLogo', logo: 0},
      {bootLogo: 'Matrix', logo: 1},
      {bootLogo: 'Car Flash', logo: 2},
      {bootLogo: 'MaZda-Z Logo', logo: 4},
      //{bootLogo: 'Cinema', logo: 5},
      //{bootLogo: 'Criss Cross', logo: 6},
      {bootLogo: 'MZD Race', logo: 7},
      {bootLogo: 'MZD Space', logo: 8},
      {bootLogo: 'Race Large', logo: 9},
      {bootLogo: 'MZD Title Slam', logo: 10},
      {bootLogo: 'Trans End (Default)', logo: 11}
    ]
    $scope.$on('$routeChangeSuccess', function () {
      $scope.getLanguage()
      if ($location.path().includes('translate')) {
        $scope.getScript('assets/js/translator.js')
        $scope.getScript('assets/vendor/bootstrap.min.js')
      } else if ($location.path().includes('joiner')) {
        $scope.getScript('PhotoJoiner_files/jquery-1.8.3.min.js')
        $scope.getScript('PhotoJoiner_files/jquery-ui.js')
        $scope.getScript('PhotoJoiner_files/jquery.fineuploader-3.0.min.js')
        $scope.getScript('PhotoJoiner_files/PhotoJoin.js')
        $(function () {
          $scope.getScript('../assets/vendor/jquery.mousewheel.min.js')
          setTimeout(function () {
            $('#thumbs').mousewheel(function (event, delta) {
              this.scrollLeft -= (delta * 200)
              event.preventDefault()
            })
          }, 5000)
        })
      } else {
        $scope.getScript('assets/js/tour.js')
        $scope.getScript('assets/vendor/featherlight.min.js')
        // Handy litle jQuery script for Inner Help Menu Togglers
        $(function () {
          $('#IN13').click(function(){$('#bootLogoMazda').click()})
          $(`.troubleshootingToggler, .revertToggler, .warnToggler, .faqToggler, .kiToggler, .ttToggler`).click(function () {
            $(this).siblings().not(`.troubleshootingToggler, .revertToggler, .warnToggler, .faqToggler, .kiToggler, .ttToggler`).not($(this).next()).slideUp(`fast`)
            $(this).next().slideToggle(`fast`)
            $('.w3-bottombar[class*=Toggler]').css(`position`, `absolute`).addClass('w3-black')
          })
          $('.w3-bottombar[class*="Toggler"]').click(function () {
            $(this).css(`position`, `static`).removeClass('w3-black')
          })
          $('.draggable').draggable()
          $('#ctxt-title').on('click', function () { $(this).fadeOut(500); $('#ctxt-notif').fadeIn(500) })
          $('#ctxt-notif').on('click', function () { $(this).fadeOut(500); $('#ctxt-title').fadeIn(500) })
          $('#background').on('click', function () { $('#infotnmtBG,#modalimg').attr('src',`${tempDir}/background.png`) })
          $('[data-toggle="tooltip"]').tooltip({html: true, delay: {show: 1400, hide: 200}})
          $('[data-toggle="popover"]').popover({html: true})
          $('.imgframe').mousewheel(function (event, delta) {
            this.scrollLeft -= (delta * 400)
            event.preventDefault()
          })
          $('.twkfltr input').on('focus', function () {
            if (window.innerWidth > 1000 && window.innerWidth < 1300) {
              $('#compileButton').addClass('left')
            }
          })
          $('.twkfltr input').on('blur', function () {
            $('#compileButton').removeClass('left')
          })
          $('.slide-out-div').tabSlideOut({
            tabHandle: '.handle',                     // class of the element that will become your tab
            // pathToTabImage: 'files/img/tab.png', //path to the image for the tab //Optionally can be set using css
            imageHeight: '40px',                     // height of tab image           //Optionally can be set using css
            imageWidth: '90px',                       // width of tab image            //Optionally can be set using css
            tabLocation: 'left',                      // side of screen where tab lives, top, right, bottom, or left
            speed: 300,                               // speed of animation
            action: 'click',                          // options: 'click' or 'hover', action to trigger animation
            topPos: '90px',                          // position from the top/ use if tabLocation is left or right
            leftPos: '50px',                          // position from left/ use if tabLocation is bottom or top
            fixedPosition: false                     // options: true makes it stick(fixed position) on scroll
          })
          startTime()
        })
      }
      if (persistantData.get('visits') > 20) {
        $scope.user.mainOps = [7]
      }
      if (persistantData.get('menuLock')) {
        $('body, .hideNav, .w3-overlay').addClass('showNav')
      }
      if (persistantData.has('FW')) {
        ipc.emit('aio-info')
      }
    })
    $(function () {
      if ($scope.user.darkMode) {
        $('html, body, #sidePanel').addClass('w3-black')
      } else {
        $('html, body, #sidePanel').removeClass('w3-black')
      }
    })
    $scope.miniSpeedo = function () {
      if($scope.user.options.indexOf(20) === -1) {
        $scope.user.options.push(20)
        $scope.user.statusbar.d2sbinst = true
      }
      snackbar('Date-to-StatusBar Mod is Auto-Selected with Speedometer-in-StatusBar Mod')
    }

    // TODO: More saving options. Save different settings by name.
    // $scope.$storage = $localStorage
    $scope.saveOps = function () {
      if ($location.path().includes('translate')) {
        $('#submit').click()
      } else {
        settings.set($scope.user)
        bootbox.alert({
          message: 'Options Saved!',
          size: 'small'
        })
        closeHelpDrop()
      }
    }
    $scope.miniSave = function () {
      settings.set(`darkMode`, $scope.user.darkMode)
      settings.set(`flipOption`, $scope.user.flipOption)
      bootbox.alert({
        message: 'Saved!',
        size: 'small'
      })
      closeHelpDrop()
    }
    $scope.loadOps = function () {
      if ($location.path().includes('translate')) {
        $('#import').click()
      } else {
        $scope.user = settings.store
        bootbox.alert({
          message: 'Options Loaded!',
          size: 'small',
          callback: function () {
            $scope.$apply()
          }
        })
        closeHelpDrop()
      }
    }
    ipc.on('custom-theme', (event, theme) => {
      $scope.user.customTheme = theme
      $scope.$apply()
    })
    ipc.on('save-options', () => {
      $scope.saveOps()
    })
    ipc.on('load-options', () => {
      $scope.loadOps()
    })
    ipc.on('rmCpDir', (op) => {
      $scope.rmCpDir = op
    })
    ipc.on('set-copy-loc', (loc) => {
      $scope.user.copydir = loc
    })
    $scope.instAll = function () {
      $scope.user.mainOps = [0, 2, 3, 4, 5, 7, 8, 9]
      $scope.user.options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 22, 26]
      $scope.user.colors = 2
      $scope.user.speedoOps.lang.id = 0
      $scope.user.speedoOps.xph.id = 10
      $scope.user.speedoOps.sml.id = 20
      $scope.user.speedoOps.bg.id = 30
      $scope.user.speedoOps.opac = 0
      $scope.user.uistyle.shadow = true
      $scope.user.uistyle.minicoins = true
      $scope.user.uistyle.ellipse = true
      $scope.user.uistyle.main3d = true
      $scope.user.uistyle.nobtnbg = true
      $scope.user.uistyle.nonpbg = true
      $scope.user.listbeep = true
      $scope.user.statusbar.d2sbinst = true
    }
    $scope.uncheckAll = function () {
      $scope.user.options = []
      $scope.user.mainOps = [7]
      $scope.user.speedoOps.lang.id = 0
      $scope.user.speedoOps.xph.id = 10
      $scope.user.speedoOps.sml.id = 20
      $scope.user.speedoOps.bg.id = 30
      $scope.user.speedoOps.opac = 0
      $scope.user.colors = 1
      $scope.user.disclaimOps = 0
      $scope.user.d2sbOps = 2
      $scope.user.uistyle.shadow = false
      $scope.user.uistyle.minicoins = false
      $scope.user.uistyle.ellipse = false
      $scope.user.uistyle.main3d = false
      $scope.user.uistyle.nobtnbg = false
      $scope.user.uistyle.nonpbg = false
      $scope.user.listbeep = false
      $scope.user.statusbar.d2sbinst = false
    }
    $scope.uninstAll = function () {
      /* $scope.user.options.splice(0, $scope.user.options.length)
      $scope.user.options.push(1) */
      $scope.user.options = $scope.options.map(function (item) { if (Number(item.id) !== 21) { return Number(item.id) + 100 } })
      $scope.user.mainOps = [0, 2, 3, 5, 7, 8, 9, 106, 110]
      // $scope.user.mainOps = $scope.mainOps.map(function (item) { if (Number(item.id)==1||Number(item.id)==3) {return Number(item.id)}})
      $scope.user.colors = 0
      $scope.user.uistyle.uninst = true
      $scope.user.uistyle.uninstmain = true
      $('#defaultBgBtn').click()
    }
    $scope.startTour = function () {
      closeHelpDrop()
      startTour($scope.tourMsgs)
    }
    $scope.getLanguage = function () {
      var langURL = getParameterByName('lang') || persistantData.get('lang') || 'english'
      if (langURL) {
        persistantData.set('lang', langURL)
      }
      langURL = `./lang/${langURL}.aio.json`
      if ($location.path().includes('joiner')) {
        langURL = `../${langURL}`
      }
      $.getJSON(langURL)
    }
    $scope.getScript = function (url) {
      $.getScript(url, function (data, textStatus, jqxhr) {
        // console.log( data ) // Data returned
        // console.log( textStatus ) // Success
        // console.log( jqxhr.status ) // 200
        // console.log( `Load was performed.` )
      })
    }
    ipc.on('start-compile', function () {
      $scope.startCompile()
    })
    $scope.startRestoreCompile = function () {
      closeHelpDrop()
      remote.BrowserWindow.fromId(1).focus()
      if (!$scope.user.restore.full) { return }
      var msg = '<center>This script will completely remove all tweaks installed by AIO.\n'
      if ($scope.user.restore.delBackups) { msg += `<h3 style='width:100%;text-align:center;'>*** YOU HAVE CHOSEN TO DELETE ALL BACKUP FILES. ***</h3><br><h4>BY CONTINUING, YOU ARE ACKNOWLEDGING THAT YOU UNDERSTAND THE IMPLECATIONS OF PERFORMING THIS ACTION.</h4>` }
      msg += '\nCONTINUE?</center>'
      bootbox.confirm({
        title: `AIO Full Restore Script`,
        message: msg,
        className: 'compileRestore',
        buttons: {
          confirm: {
            label: 'Start',
            className: 'btn-success'
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-danger'
          }
        },
        callback: function (result) {
          if (result) {
            setTimeout(function () {
              $('.bootbox.modal').animate({'top': '+=20', 'opacity': '1'}, 10000)
            }, 3000)
            $('#compileRestore').hide()
            $scope.compileTweaks()
          }
        }
      })
    }
    /**
    * start the autorun compile
    */
    $scope.startAutorunCompile = function () {
      closeHelpDrop()
      remote.BrowserWindow.fromId(1).focus()
      var armsg = '<center>CMU-Autorun Scripts<br>Installer/Uninstaller For Autorun Scripts.<br>'
      armsg += '</center>'
      armsg += '<a href class="autorunHelp" onclick="autoHelp()"><span class="icon-question2"></span></a>'
      bootbox.prompt({
        title: armsg,
        className: 'confirmAutorunCompile',
        inputType: 'checkbox',
        value: 'id7',
        inputOptions: [
          {
            text: 'Install ID7_Recovery Scripts Pack',
            value: 'id7'
          },
          {
            text: 'Install Automatic Wifi App',
            value: 'autow'
          },
          {
            text: 'Install SSH Over ADB',
            value: 'autoa'
          },
          {
            text: 'Dryrun Script (To Test Installation)',
            value: 'dryrun'
          }
        ],
        callback: function (results) {
          if (results === null) { return }
          if (results.indexOf('autow') !== -1) {
            $scope.user.autorun.autoWIFI = true
          }
          if (results.indexOf('autoa') !== -1) {
            $scope.user.autorun.autoADB = true
          }
          if (results.indexOf('id7') !== -1) {
            $scope.user.autorun.id7recovery = true
          }
          if (results.indexOf('dryrun') !== -1) {
            $scope.user.autorun.dryrun = true
          }
          $('#confirmAutorunCompile').hide()
          $scope.compileTweaks()
        }
      })
    }
    $scope.startCompile = function () {
      closeHelpDrop()
      if ($scope.user.options.length === 0 && $scope.user.mainOps.length <= 1) {
        bootbox.alert({
          title: '<center>Select tweaks before starting the compilation</center>',
          message: '<center>Try choosing some tweaks first!</center>'
        })
        return
      }
      // check for downloaded files
      var spfiles = fs.existsSync(`${app.getPath('userData')}/speedcam-patch/`)
      var csfiles = fs.existsSync(`${app.getPath('userData')}/color-schemes/`)
      if ($scope.user.mainOps.indexOf(3) !== -1) {
        if (!csfiles) {
          bootbox.alert({
            title: `Please Download Color Scheme Files Before Compiling`,
            message: `<a href="" class="w3-btn" onclick="ipc.send('download-aio-files','color-schemes')">Download Color Scheme Files</a>`
          })
          return
        }
      }
      if ($scope.user.options.indexOf(23) !== -1) {
      $('#refreshBtn').click() // Speedcam Patch has been removed
      return
    }
    $scope.ConfirmCompile()
  }
  $scope.ConfirmCompile = function () {
    var msg = `<div id="tweak-install-list" style='font-size:12px;text-align:center;'><ul style="list-style:none;">`
    if ($scope.user.mainOps.indexOf(4) !== -1) { msg += `<li style='width:100%'>****** ${$scope.mainOps.sshbringback.label} ******</li>` }
    if ($scope.user.mainOps.indexOf(1) !== -1) { msg += `<li>****** ${$scope.mainOps.backup.label} ******</li>` }
    if ($scope.user.mainOps.indexOf(0) !== -1) { msg += `<li>****** ${$scope.mainOps.wifi.label} ******</li>` }
    if ($scope.user.mainOps.indexOf(2) !== -1) { msg += `<li>****** ${$scope.mainOps.background.label} ******</li>` }
    if ($scope.user.mainOps.indexOf(6) !== -1) { msg += `<li>****** ${$scope.mainOps.backgroundrotator.label} ******</li>` }
    if ($scope.user.mainOps.indexOf(10) !== -1) { msg += `<li>****** ${$scope.mainOps.offscreenbg.label} ******</li>` }
    if ($scope.user.mainOps.indexOf(3) !== -1) { msg += `<li>****** ${$scope.mainOps.colors.label} ******</li>` }
    if ($scope.user.mainOps.indexOf(8) !== -1) { msg += `<li>****** ${$scope.mainOps.mainmenu.label} ******</li>` }
    if ($scope.user.mainOps.indexOf(9) !== -1) { msg += `<li>****** ${$scope.mainOps.uistyle.label} ******</li>` }
    if ($scope.user.mainOps.indexOf(5) !== -1) { msg += `<li>****** ${$scope.mainOps.sdcid.label} ******</li>` }
    if ($scope.user.mainOps.indexOf(110) !== -1) { msg += `<li>****** ${$scope.menu.uninstall.label} ${$scope.mainOps.offscreenbg.label} ******</li>` }
    if ($scope.user.mainOps.indexOf(106) !== -1) { msg += `<li>****** ${$scope.menu.uninstall.label} ${$scope.mainOps.backgroundrotator.label} ******</li>` }
    msg += $scope.options.map(function (item) { if ($scope.user.options.indexOf(Number(item.id)) !== -1) { return `<li class='inst-list'>${item.INST}</li>` } })
    msg += $scope.options.map(function (item) { if ($scope.user.options.indexOf(Number(item.id) + 100) !== -1) { return `<li class='uninst-list'>${item.DEINST}</li>` } })
    msg += '</ul></div>'
    msg = msg.split(`,`).join(``)
    var compileTweaksDialog = bootbox.confirm({
      title: `<center><h3 class="tweak-inst-title">*************** ${$scope.menu.tweakstoinstall.label}: ***************</h3></center>`,
      message: msg,
      className: 'confirmCompile',
      buttons: {
        confirm: {
          label: 'Start',
          className: 'btn-success'
        },
        cancel: {
          label: 'Cancel',
          className: 'btn-danger'
        }
      },
      callback: function (result) {
        if (result) {
          if ($scope.user.mainOps.indexOf(2) !== -1) {
            $('#imgframe').click()
            $('#slideShowBtn').click()
          }
          if ($scope.user.mainOps.indexOf(6) !== -1) {
            $('#imgmodal').addClass('slideshow')
          }
          setTimeout(function () {
            $('.bootbox.modal').animate({'top': '+=150', 'opacity': '.85'}, 1000)
          }, 3000)
          setTimeout(function () {
            introJs().setOption('hintButtonLabel', 'COOL!')
            introJs().addHints()
          }, 2400)
          setTimeout(function () {
            introJs().hideHints()
          }, 4000)
          $scope.compileTweaks()
        }
      }
    })
    compileTweaksDialog.on('shown.bs.modal',function(){
      $(".btn-success").focus();
    })
  }
  $scope.compileTweaks = function () {
    $('#compileButton, #compileAutorun, .checkAutorun').hide()
    buildTweakFile($scope.user)
  }
})
.config(function ($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.htm'
  })
  .when('/translate', {
    templateUrl: 'views/translate.html',
    controller: 'TranslatorCtrl'
  })
  .when('/joiner', {
    templateUrl: 'PhotoJoiner/PhotoJoiner.html',
    controller: 'JoinerCtrl'
  })
  .when('/casdk', {
    templateUrl: 'views/casdk.htm',
    controller: 'CasdkCtrl'
  })
  .otherwise({
    template: `<h1>MZD-AIO-TI</h1>`
  })
})
.directive('compile', ['$compile', function ($compile) {
  return function (scope, element, attrs) {
    scope.$watch(
      function (scope) {
        // watch the 'compile' expression for changes
        return scope.$eval(attrs.compile)
      },
      function (value) {
        // when the 'compile' expression changes
        // assign it into the current DOM
        element.html(value)
        // compile the new DOM and link it to the current
        // scope.
        // NOTE: we only compile .childNodes so that
        // we don't get into infinite loop compiling ourselves
        $compile(element.contents())(scope)
      }
    )
  }
}])
.filter('htmlToPlaintext', function () {
  return function (text) {
    return text ? String(text).replace(/<[^>]+>/gm, '') : ''
  }
})
.filter('markdown', function ($sce) {
  var Converter = new Showdown.converter()
  return function (value) {
    var html = Converter.makeHtml(value || '')
    return $sce.trustAsHtml(html)
  }
})
function helpCtrl ($scope, $http) {
  $scope.helpMsgs = langObj.helpMsgs
}
function JoinerCtrl ($scope, $http) {
  $scope.imgOps = langObj.imgOps
}
function TranslatorCtrl ($scope, $http) {
  $scope.trans = langObj.translatorWindow
}
function CasdkCtrl ($scope, $http) {
  // $scope.casdk = langObj.casdk
}
})()
