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
(function() {
  'use strict'
  angular.module('AIO', ['checklist-model', 'ngSanitize', 'ngRoute']) // 'angular-electron'
    .controller('JoinerCtrl', ['$scope', '$http', JoinerCtrl])
    .controller('TranslatorCtrl', ['$scope', '$http', TranslatorCtrl])
    .controller('helpCtrl', ['$scope', '$http', helpCtrl])
    .controller('CasdkCtrl', ['$scope', '$http', CasdkCtrl])
    .controller('MainCtrl', function($scope, $http, $route, $location, $filter) {
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
        mainOps: [0, 4, 7],
        disclaimOps: 0,
        fuelOps: 0,
        colors: 1,
        aaVer: 1,
        d2sbOps: 3,
        replyMsgLang: 0,
        zipbackup: false,
        forcessh: false,
        useColorBG: false,
        customTheme: false,
        keepSpeedRestrict: false,
        listbeep: false,
        advancedOps: false,
        dataDump: false,
        aaBetaVer: false,
        aaWifi: true,
        autosort: true,
        barautosort: true,
        runsh: false,
        screenOffBoot: false,
        gracenoteText: 'Powered By Gracenote®',
        altLayout: settings.get('altLayout') || false,
        darkMode: settings.get('darkMode') || false,
        flipOption: settings.get('flipOption') || '',
        transMsg: settings.get('transMsg') || false,
        copydir: persistantData.get('copyFolderLocation'),
        spdValues: speedoSave.get('spdValues') || spdValues,
        multictrl: speedoSave.get('multictrl') || multictrl,
        fuelBarColors: speedoSave.get('fuelBarColors') || fuelBarColors,
        barThemeColors: speedoSave.get('barColors') || barThemeColors,
        classicSpeed: speedoSave.get('clscSpdTmp') || classicSpeedoTmplt,
        spdExtra: speedoSave.get('spdExtra') || spdExtraValues,
        speedoOps: speedoSave.get('speedoOps') || speedoOps,
        entertainmentItems: entertainmentItems,
      }

      $scope.user.autorun = {
        installer: false,
        id7recovery: false,
        autoWIFI: false,
        autoADB: false,
        dryrun: false,
        serial: false
      }
      $scope.user.mzdmeter = {
        show: persistantData.get('showMeter') || false,
        check: persistantData.get('checkMeter') || false,
        inst: false,
        uninst: false
      }
      $scope.user.restore = {
        full: false,
        delBackups: false
      }
      $scope.user.casdk = {
        inst: false,
        uninst: false,
        region: 'na'
      }
      $scope.user.backups = {
        org: settings.get('keepBackups') || false,
        test: settings.get('testBackups') || true,
        skipconfirm: settings.get('skipConfirm') || false,
        apps2resources: settings.get('apps2resources') || false
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
      $scope.user.vpOps = {
        shuffle: true,
        repeat: 2,
        fullscreen: 1
      }
      $scope.vpOpsRepeat = {
        None: 0,
        One: 1,
        All: 2
      }
      $scope.vpOpsFullscreen = {
        Windowed: 0,
        "Keep Aspect Ratio": 1,
        Full: 2
      }
      $scope.vpOpsShuffle = {
        On: true,
        Off: false
      }
      $scope.user.rmvallbg = function() {
        $scope.user.uistyle.nobtnbg = true
        $scope.user.uistyle.nonpbg = true
        $scope.user.uistyle.nolistbg = true
        $scope.user.uistyle.nocallbg = true
        $scope.user.uistyle.notextbg = true
        $scope.$apply()
      }
      if ($scope.loc.toLowerCase().includes('en-us')) {
        // console.log('ENGLISH')
        $scope.user.speedoOps.lang.id = 0
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
      } else if ($scope.loc.includes('nl')) {
        // console.log('ITALIAN')
        $scope.user.speedoOps.lang.id = 8
      }
      $scope.bootOps1 = langObj.bootOps1 || [
        { bootLogo: 'LoopLogo (default)', logo: 0 },
        { bootLogo: 'Matrix', logo: 1 },
        { bootLogo: 'Large Mazda Logo', logo: 2 },
        { bootLogo: 'Fiat Logo', logo: 3 },
        { bootLogo: 'MaZda-Z Logo', logo: 4 },
        { bootLogo: 'Cinema Loop', logo: 5 },
        { bootLogo: 'Criss Cross Loop', logo: 6 },
        { bootLogo: 'MZD Race Loop', logo: 7 }
      ]
      $scope.bootOps2 = langObj.bootOps2 || [
        { bootLogo: 'LoopLogo', logo: 0 },
        { bootLogo: 'Matrix', logo: 1 },
        { bootLogo: 'Large Mazda Logo', logo: 2 },
        { bootLogo: 'Spider 124 Trans', logo: 3 },
        { bootLogo: 'MaZda-Z Logo', logo: 4 },
        { bootLogo: 'Cinema Loop', logo: 5 },
        { bootLogo: 'Criss Cross Loop', logo: 6 },
        { bootLogo: 'MZD Race Loop', logo: 7 },
        { bootLogo: 'Mazda Trans (Default)', logo: 8 }
      ]
      $scope.bootOps3 = langObj.bootOps3 || [
        { bootLogo: 'LoopLogo', logo: 0 },
        { bootLogo: 'Matrix', logo: 1 },
        { bootLogo: 'Car Flash', logo: 2 },
        { bootLogo: 'MaZda-Z Logo', logo: 4 },
        //{bootLogo: 'Cinema', logo: 5},
        //{bootLogo: 'Criss Cross', logo: 6},
        { bootLogo: 'MZD Race', logo: 7 },
        { bootLogo: 'MZD Space', logo: 8 },
        { bootLogo: 'Race Large', logo: 9 },
        { bootLogo: 'MZD Title Slam', logo: 10 },
        { bootLogo: 'Trans End (Default)', logo: 11 }
      ]
      $scope.replyLangs = msgLangs
      $scope.getMsgsForLang = function() {
        getMsgsForLang($scope.user.replyMsgLang)
        $scope.replyMsgs = currLangMsgs
        if ($scope.replyMsgs.length > 0) {
          $('#presetMessageEditor').show()
        }
      }
      $scope.savePresetMsgs = function() {
        rebuildMessageXml($scope.user.replyMsgLang, $scope.replyMsgs)
      }
      $scope.checkDuplicatePos = function(inputArray) {
        var lastSeenDuplicate,
          seenDuplicate = [],
          testObject = {},
          propertyName = 'pos',
          elmntName = 'elmnt';

        inputArray.map(function(item) {
          var itemPosition = item[propertyName]
          // Don't count hidden values
          if (itemPosition[0] !== '2') {
            var itemName = item[elmntName]
            if (itemPosition in testObject) {
              testObject[itemPosition].duplicate = true
              item.duplicate = true
              seenDuplicate.push(itemName, testObject[itemPosition].elmnt)
            } else {
              lastSeenDuplicate = itemName
              testObject[itemPosition] = item
              delete item.duplicate
            }
          }
        });
        return seenDuplicate;
      }
      $scope.colorDuplicates = function() {
        var duplicates = $scope.checkDuplicatePos($scope.user.spdValues)
        $('.spdOps span~select').removeClass("ng-invalid")
        for (var x in duplicates) {
          $('#spdOp-' + duplicates[x] + '~select').addClass("ng-invalid")
        }
      }
      $scope.checkForMain = function(value) {
        var valIndex = $scope.user.spdValues.indexOf(value)
        if (value.pos[0] === '2') {
          $scope.user.spdValues[valIndex].pos[1] = '1'
          $scope.user.spdValues[valIndex].pos[2] = '0'
        } else if (value.pos[1] === '0') {
          $scope.user.spdValues[valIndex].pos[2] = '0'
        } else if (value.pos[2] === '0') {
          $scope.user.spdValues[valIndex].pos[2] = '1'
        }
        if (value.pos[0] === '1') {
          if (value.pos[1] < 1) {
            $scope.user.spdValues[valIndex].pos[1] = '1'
          }
          if (value.pos[2] < 1) {
            $scope.user.spdValues[valIndex].pos[2] = '1'
          }
        } else if (value.pos[0] === '0') {
          if (value.pos[1] > 1) {
            $scope.user.spdValues[valIndex].pos[1] = '1'
          }
          if (value.pos[2] > 4) {
            $scope.user.spdValues[valIndex].pos[2] = '4'
          }
        }
        $scope.barAutoSortBy()
        $scope.colorDuplicates()
      }
      $scope.toggleAutoSortBy = function() {
        $scope.user.autosort = !$scope.user.autosort
        $scope.autoSortBy()
      }
      $scope.autoSortBy = function() {
        if ($scope.user.autosort) {
          $scope.user.classicSpeed = $filter('orderBy')($scope.user.classicSpeed, 'pos')
        } else {
          $scope.user.classicSpeed = $filter('orderBy')($scope.user.classicSpeed, 'name')
        }
      }
      $scope.toggleBarAutoSortBy = function() {
        $scope.user.barautosort = !$scope.user.barautosort
        $scope.barAutoSortBy()
      }
      $scope.barAutoSortBy = function() {
        if ($scope.user.barautosort) {
          $scope.user.spdValues = $filter('orderBy')($scope.user.spdValues, ['pos[0]', 'pos[1]', 'pos[2]'])
        } else {
          $scope.user.spdValues = $filter('orderBy')($scope.user.spdValues, 'label')
        }
      }
      $scope.reset_speedoOps = function() {
        $scope.user.speedoOps = speedoOps
      }
      $scope.reset_entertainmentItems = function() {
        $scope.userentertainmentItems = entertainmentItems
      }
      $scope.reset_spdValues = function() {
        $scope.user.spdValues = spdValues
        $scope.user.spdExtra.barSpeedoRows = "4"
      }
      $scope.reset_classicSpeed = function() {
        $scope.user.classicSpeed = classicSpeedoTmplt
        $scope.user.speedoOps.classicLargeText = false
      }
      $scope.reset_fuelBarColors = function() {
        $scope.user.fuelBarColors = fuelBarColors
        $scope.user.speedoOps.sbreverse = false
        $scope.user.speedoOps.sbreverse = true
        $scope.user.speedoOps.digiclock = false
        $scope.user.speedoOps.sbint = 2
        $scope.user.speedoOps.sbfuel = 'disable'
        $scope.user.speedoOps.sbmain = 'gpsSpeedValue'
        $scope.user.speedoOps.sbval1 = 'gpsHeading'
        $scope.user.speedoOps.sbval2 = 'gpsAltitudeValue'
      }
      $scope.reset_multictrl = function() {
        $scope.user.multictrl = multictrl
      }
      $scope.reset_barThemeColors = function() {
        $scope.user.barThemeColors = barThemeColors
      }
      $scope.reset_spdExtra = function() {
        $scope.user.spdExtra = spdExtraValues
      }
      $scope.reset_allSpd = function() {
        $scope.reset_multictrl()
        $scope.reset_fuelBarColors()
        $scope.reset_barThemeColors()
        $scope.reset_classicSpeed()
        $scope.reset_spdValues()
        $scope.reset_spdExtra()
        $scope.reset_speedoOps()
        $scope.reset_entertainmentItems()
      }

      $scope.$on('$routeChangeSuccess', function() {
        $scope.getLanguage()
        if ($location.path().includes('translate')) {
          $scope.getScript('assets/js/translator.js')
          $scope.getScript('assets/vendor/bootstrap.min.js')
        } else if ($location.path().includes('joiner')) {
          $scope.getScript('PhotoJoiner_files/jquery-1.8.3.min.js')
          $scope.getScript('PhotoJoiner_files/jquery-ui.js')
          $scope.getScript('PhotoJoiner_files/jquery.fineuploader-3.0.min.js')
          $scope.getScript('PhotoJoiner_files/PhotoJoin.js')
          $(function() {
            $scope.getScript('../assets/vendor/jquery.mousewheel.min.js')
            setTimeout(function() {
              $('#thumbs').mousewheel(function(event, delta) {
                this.scrollLeft -= (delta * 200)
                event.preventDefault()
              })
            }, 5000)
          })
        } else {
          $scope.getScript('assets/js/tour.js')
          $scope.getScript('assets/vendor/featherlight.min.js')
          // Handy litle jQuery script for Inner Help Menu Togglers
          $(function() {
            $('#IN13').click(function() { $('#bootLogoMazda').click() })
            $(`.troubleshootingToggler, .revertToggler, .warnToggler, .faqToggler, .kiToggler, .ttToggler`).click(function() {
              $(this).siblings().not(`.troubleshootingToggler, .revertToggler, .warnToggler, .faqToggler, .kiToggler, .ttToggler`).not($(this).next()).slideUp(`fast`)
              $(this).next().slideToggle(`fast`)
              $('.w3-bottombar[class*=Toggler]').css(`position`, `absolute`).addClass('w3-black')
            })
            $('.w3-bottombar[class*="Toggler"]').click(function() {
              $(this).css(`position`, `static`).removeClass('w3-black')
            })
            $('.draggable').draggable({ scroll: false, distance: 10 })

            $('#ctxt-title').on('click', function() {
              $(this).fadeOut(500)
              $('#ctxt-notif').fadeIn(500)
            })
            $('#ctxt-notif').on('click', function() {
              $(this).fadeOut(500)
              $('#ctxt-title').fadeIn(500)
            })
            $('#background').on('click', function() { $('#infotnmtBG,#modalimg').attr('src', `${varDir}/background.png`) })
            $('[data-toggle="tooltip"]').tooltip({ html: true, delay: { show: 1200, hide: 200 } })
            $('[data-toggle="popover"]').popover({ html: true })
            $('.imgframe').mousewheel(function(event, delta) {
              this.scrollLeft -= (delta * 400)
              event.preventDefault()
            })
            $('.twkfltr input').on('focus', function() {
              if (window.innerWidth > 1000 && window.innerWidth < 1300) {
                $('#compileButton').addClass('left')
              }
            })
            $('.twkfltr input').on('blur', function() {
              $('#compileButton').removeClass('left')
            })
            startTime()
          })
        }
        if (persistantData.get('visits') > 10) {
          $scope.user.mainOps = [7]
        }
        if (persistantData.get('menuLock')) {
          $('body, .hideNav, .w3-overlay').addClass('showNav')
        }
        if (persistantData.has('FW')) {
          ipc.emit('aio-info')
        }
      })
      $(function() {
        if ($scope.user.darkMode) {
          $('html, body, #sidePanel').addClass('w3-black')
        } else {
          $('html, body, #sidePanel').removeClass('w3-black')
        }
        $scope.user.classicSpeed = $filter('orderBy')($scope.user.classicSpeed, 'pos')
      })
      $scope.miniSpeedo = function() {
        if ($scope.user.options.indexOf(20) === -1) {
          //$scope.user.options.push(20)
          //$scope.user.statusbar.d2sbinst = true
          snackbar('Date-to-StatusBar Mod is now optional With Statusbar Speedometer')
        }
      }

      $scope.saveSpeedoOps = function() {
        speedoSave.set('multictrl', $scope.user.multictrl)
        speedoSave.set('fuelBarColors', $scope.user.fuelBarColors)
        speedoSave.set('barColors', $scope.user.barThemeColors)
        speedoSave.set('clscSpdTmp', $scope.user.classicSpeed)
        speedoSave.set('spdValues', $scope.user.spdValues)
        speedoSave.set('spdExtra', $scope.user.spdExtra)
        speedoSave.set('speedoOps', $scope.user.speedoOps)
      }

      // TODO: More saving options. Save different settings by name.
      // $scope.$storage = $localStorage
      $scope.saveOps = function() {
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
      $scope.miniSave = function() {
        settings.set(`darkMode`, $scope.user.darkMode)
        settings.set(`flipOption`, $scope.user.flipOption)
        bootbox.alert({
          message: 'Saved!',
          size: 'small'
        })
        closeHelpDrop()
      }
      $scope.loadOps = function() {
        if ($location.path().includes('translate')) {
          $('#import').click()
        } else {
          if (!settings.has('multictrl') || settings.get('reset')) {
            settings.set($scope.user)
            settings.delete('reset')
          }
          $scope.user = settings.store
          closeHelpDrop()
          setTimeout(function() {
            snackbar('Options Loaded!')
            $scope.$apply()
          }, 500)
        }
      }
      $scope.loadLast = function() {
        if (!lastView.has('multictrl') || lastView.get('reset')) {
          lastView.set($scope.user)
          lastView.delete('reset')
        }
        $scope.user = lastView.store
        closeHelpDrop()
        setTimeout(function() {
          snackbar('Loaded Last Compiled Options!')
          $scope.$apply()
        }, 500)
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
      ipc.on('load-last', () => {
        $scope.loadLast()
      })
      ipc.on('rmCpDir', (op) => {
        $scope.rmCpDir = op
      })
      ipc.on('set-copy-loc', (loc) => {
        $scope.user.copydir = loc
      })
      $scope.instAll = function() {
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
      $scope.uncheckAll = function() {
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
        $scope.reset_allSpd()
      }
      $scope.uninstAll = function() {
        /* $scope.user.options.splice(0, $scope.user.options.length)
        $scope.user.options.push(1) */
        $scope.user.options = $scope.options.map(function(item) { if (Number(item.id) !== 21) { return Number(item.id) + 100 } })
        $scope.user.mainOps = [0, 2, 3, 5, 7, 8, 9, 106, 110]
        // $scope.user.mainOps = $scope.mainOps.map(function (item) { if (Number(item.id)==1||Number(item.id)==3) {return Number(item.id)}})
        $scope.user.colors = 0
        $scope.user.uistyle.uninst = true
        $scope.user.uistyle.uninstmain = true
        $('#defaultBgBtn').click()
      }
      $scope.startTour = function() {
        closeHelpDrop()
        startTour($scope.tourMsgs)
      }
      $scope.randomColorGenerator = function() {
        return '#' + '0123456789abcdef'.split('').map(function(v, i, a) { return i > 5 ? null : a[Math.floor(Math.random() * 16)] }).join('');
        //return '#' + Math.floor(Math.random() * 16777215).toString(16)
      }

      $scope.randomColorMap = function() {
        for (var theme in $scope.user.barThemeColors) {
          $scope.user.barThemeColors[theme].main = $scope.randomColorGenerator()
          $scope.user.barThemeColors[theme].secondary = $scope.randomColorGenerator()
          $scope.user.barThemeColors[theme].border = $scope.randomColorGenerator()
        }
      }
      $scope.getLanguage = function() {
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
      $scope.getScript = function(url) {
        $.getScript(url, function(data, textStatus, jqxhr) {
          // console.log( data ) // Data returned
          // console.log( textStatus ) // Success
          // console.log( jqxhr.status ) // 200
          // console.log( `Load was performed.` )
        })
      }
      ipc.on('start-compile', function() {
        $scope.startCompile()
      })
      $scope.startRestoreCompile = function() {
        closeHelpDrop()
        remote.BrowserWindow.fromId(1).focus()
        if (!$scope.user.restore.full) { return }
        var msg = '<center>This script will completely remove all tweaks installed by AIO.\n'
        if ($scope.user.restore.delBackups) { msg += `<h3 style='width:100%;text-align:center;'>*** YOU HAVE CHOSEN TO DELETE ALL BACKUP FILES. ***</h3><br><h4>BY CONTINUING, YOU ARE ACKNOWLEDGING THAT YOU UNDERSTAND THE IMPLICATIONS OF PERFORMING THIS ACTION.</h4>` }
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
          callback: function(result) {
            if (result) {
              setTimeout(function() {
                $('.bootbox.modal').animate({ 'top': '+=20', 'opacity': '1' }, 10000)
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
      $scope.startAutorunCompile = function() {
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
          inputOptions: [{
              text: 'Install ID7_Recovery Scripts Pack',
              value: 'id7'
            },
            {
              text: 'Install Automatic WiFi AP',
              value: 'autow'
            },
            {
              text: 'Install SSH Over ADB',
              value: 'autoa'
            },
            {
              text: 'Dryrun Script (To Test Installation)',
              value: 'dryrun'
            },
            {
              text: `Recover Via Serial Connection <div class="serial-warning" style="color:red;font-weight:bolder;">(NO INSTALLER! FILES WILL NEED TO BE MANUALLY COPIED FROM THE USB DRIVE/XX FOLDER TO THE CMU <a onclick="externalLink('serial')" href class="link">INSTRUCTIONS</a>)</div>`,
              value: 'serial'
            }
          ],
          callback: function(results) {
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
            if (results.indexOf('serial') !== -1) {
              $scope.user.autorun.serial = true
            }
            $('#confirmAutorunCompile').hide()
            $scope.compileTweaks()
          }
        })
      }
      $scope.startCompile = function() {
        closeHelpDrop()
        if ($('.ng-invalid').length > 0) {
          bootbox.alert({
            title: '<center>Error</center>',
            message: `<center>An invalid value ${$('.ng-invalid').val()} has been entered for ${$('.ng-invalid').prev().text()}</center>`
          })
          return
        }
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
      $scope.ConfirmCompile = function() {
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
        msg += $scope.options.map(function(item) { if ($scope.user.options.indexOf(Number(item.id)) !== -1) { return `<li class='inst-list'>${item.INST}</li>` } })
        msg += $scope.options.map(function(item) { if ($scope.user.options.indexOf(Number(item.id) + 100) !== -1) { return `<li class='uninst-list'>${item.DEINST}</li>` } })
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
          callback: function(result) {
            if (result) {
              $('button.btn.btn-success').prop('disabled', true)
              if ($scope.user.mainOps.indexOf(2) !== -1) {
                $('#imgframe').click()
                $('#slideShowBtn').click()
              }
              if ($scope.user.mainOps.indexOf(6) !== -1) {
                $('#imgmodal').addClass('slideshow')
              }
              setTimeout(function() {
                $('.bootbox.modal').animate({ 'top': '+=150', 'opacity': '.85' }, 1000)
              }, 3000)
              setTimeout(function() {
                introJs().setOption('hintButtonLabel', 'COOL!')
                introJs().addHints()
              }, 2400)
              setTimeout(function() {
                introJs().hideHints()
              }, 4000)
              $scope.compileTweaks()
            }
          }
        })
        compileTweaksDialog.on('shown.bs.modal', function() {
          $(".btn-success").focus();
        })
      }

      $scope.compileTweaks = function() {
        if ($scope.user.options.indexOf(19) !== -1) {
          $scope.saveSpeedoOps()
        }
        lastView.set($scope.user)
        $('#compileButton, #compileAutorun, .btn-group, .btn-group~*, .checkAutorun, .handle').hide()
        buildTweakFile($scope.user)
      }
    })
    .config(function($routeProvider, $locationProvider) {
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
        .when('/background', {
          templateUrl: 'views/background.html',
          controller: 'JoinerCtrl'
        })
        .otherwise({
          template: `<h1>MZD-AIO-TI</h1>`
        })
    })
    .directive('compile', ['$compile', function($compile) {
      return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
            // watch the 'compile' expression for changes
            return scope.$eval(attrs.compile)
          },
          function(value) {
            // when the 'compile' expression changes assign it into the current DOM
            element.html(value)
            // compile the new DOM and link it to the current scope.
            // NOTE: we only compile .childNodes so that we don't get into infinite loop compiling ourselves
            $compile(element.contents())(scope)
          }
        )
      }
    }])
    .filter('htmlToPlaintext', function() {
      return function(text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : ''
      }
    })
    .filter('markdown', function($sce) {
      var Converter = new Showdown.converter()
      return function(value) {
        var html = Converter.makeHtml(value || '')
        return $sce.trustAsHtml(html)
      }
    })

  function helpCtrl($scope, $http) {
    $scope.helpMsgs = langObj.helpMsgs
  }

  function JoinerCtrl($scope, $http) {
    $scope.imgOps = langObj.imgOps
  }

  function TranslatorCtrl($scope, $http) {
    $scope.trans = langObj.translatorWindow
  }

  function CasdkCtrl($scope, $http) {
    // $scope.casdk = langObj.casdk
    $scope.casdk = {
      install: false,
      uninstall: false
    }
    $scope.apps = {
      simpledashboard: false,
      clock: false,
      multidash: false,
      vdd: false,
      terminal: false,
      gpsspeed: false,
      aio: false,
      speedometer: false,
      simplespeedo: false,
      tetris: false,
      snake: false,
      breakout: false,
      background: false,
      multicontroller: false,
      devtools: false,
      sdcard: false
    }
    $scope.visibleApps = {
      simpledashboard: casdkApps.get('simpledashboard') || true,
      clock: casdkApps.get('clock') || false,
      multidash: casdkApps.get('multidash') || false,
      vdd: casdkApps.get('vdd') || true,
      terminal: casdkApps.get('terminal') || false,
      gpsspeed: casdkApps.get('gpsspeed') || false,
      aio: casdkApps.get('aio') || false,
      speedometer: casdkApps.get('speedometer') || false,
      simplespeedo: casdkApps.get('simplespeedo') || false,
      tetris: casdkApps.get('tetris') || false,
      snake: casdkApps.get('snake') || false,
      breakout: casdkApps.get('breakout') || false,
      background: casdkApps.get('background') || false,
      multicontroller: casdkApps.get('multicontroller') || false,
      devtools: casdkApps.get('devtools') || false
    }
    $scope.secretCodes = function(code) {
      switch (code.replace(/(\(.*\)|[\ \(\)\\\/\_\-])/g, '').toLowerCase()) {
        case "vdvda":
          $scope.visibleApps.vdd = true
          casdkApps.set('vdd', true)
          snackbar("Unlocked: Vehicle Data Diagnostic (VDD)")
          break
        case "dultimash":
          $scope.visibleApps.multidash = true
          casdkApps.set('multidash', true)
          snackbar("Unlocked: MultiDash Speedometer")
          break
        case "terminator":
          $scope.visibleApps.terminal = true
          casdkApps.set('terminal', true)
          snackbar("Unlocked: Terminal")
          break
        case "gpspeed":
          $scope.visibleApps.gpsspeed = true
          casdkApps.set('gpsspeed', true)
          snackbar("Unlocked: GPS Speedometer")
          break
        case "trevelop":
          $scope.visibleApps.devtools = true
          casdkApps.set('devtools', true)
          snackbar("Unlocked: Dev Tools")
          break
        case "frontsky":
          $scope.visibleApps.background = true
          casdkApps.set('background', true)
          snackbar("Unlocked: Background")
          break
        case "dropblocks":
          $scope.visibleApps.tetris = true
          casdkApps.set('tetris', true)
          snackbar("Unlocked: Tetris")
          break
        case "trousersnake":
          $scope.visibleApps.snake = true
          casdkApps.set('snake', true)
          snackbar("Unlocked: Snake")
          break
        case "outbreak":
          $scope.visibleApps.breakout = true
          casdkApps.set('breakout', true)
          snackbar("Unlocked: Breakout")
          break
        case "ticktock":
          $scope.visibleApps.clock = true
          casdkApps.set('clock', true)
          snackbar("Unlocked: Clock")
          break
        case "ss":
          $scope.visibleApps.simplespeedo = true
          casdkApps.set('simplespeedo', true)
          snackbar("Unlocked: Simple Speedometer")
          break
        case "reset":
          casdkApps.set('clock', false)
          casdkApps.set('multidash', false)
          casdkApps.set('vdd', true)
          casdkApps.set('terminal', false)
          casdkApps.set('gpsspeed', false)
          casdkApps.set('aio', false)
          casdkApps.set('simplespeedo', false)
          casdkApps.set('tetris', false)
          casdkApps.set('snake', false)
          casdkApps.set('breakout', false)
          casdkApps.set('background', false)
          casdkApps.set('multicontroller', false)
          casdkApps.set('devtools', false)
          snackbar("CASDK APPS RESET")
          setTimeout(() => { location.reload() }, 5000)
          break
        default:
          snackbar("Invalid Code...")
      }
    }
    $scope.compileCASDK = function(user, appsOnly) {
      if (user.casdk.inst && !appsOnly) {
        var compileTweaksDialog = bootbox.confirm({
          title: `<center><h3 class="tweak-inst-title">*************** CASDK ***************</h3></center>`,
          message: "Choose Region - Available Regions:<br><ul><li>North America - NA - mph, ft, °F</li><li>Europe - EU - Km/h, m, °C</li></ul>",
          className: 'confirmCompile',
          buttons: {
            confirm: {
              label: 'NA - mph, ft, °F',
              className: 'w3-btn w3-blue w3-half'
            },
            cancel: {
              label: 'EU - Km/h, m, °C',
              className: 'w3-btn w3-green w3-half'
            }
          },
          callback: function(result) {
            if (!result) {
              user.casdk.region = 'eu'
            }
            buildTweakFile(user, $scope.apps)
          }
        })
      } else {
        user.casdkAppsOnly = appsOnly
        buildTweakFile(user, $scope.apps)
      }
    }
  }
})()
