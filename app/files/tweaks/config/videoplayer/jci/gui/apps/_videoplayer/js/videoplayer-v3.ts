/* jshint -W116, -W117 */
/*
 * v2.0 Initial Version
 * v2.1 Included more video types
 * v2.2 Enabled the fullscreen Option
 * v2.3 Included the status bar and adjusts to play in a window
 * v2.4 Included a shuffle option
 *        fixed the problem of pressing the next button rapidly
 *        The list updates automaticaly at start
 * v2.5 It can now logs the steps (have to enable it on the videoplayer-v2.js & videoplayer.sh files)
 *        closes the app if is not the current (first attempt)
 *        fixes the issue of pressing mutiple times the search video button
 *        fixes the application not showing the controls again when a video play fails
 *        fixes playing the same video when shuffle is active
 *        starts using a swap file on start of the app if not running (still have to create the swap with theAIO)
 * v2.6 Change gst-launch for gplay, incorporing pause, resume, rw, ff
 *        Direct send of commands to sh (Better control)
 *        Close of WebSocket as it should be (saves memory)
 *        Change of port 55555 to 9998 in order to avoid problems with some cmu processes
 *        Bugfix for files with more than one consecutive white space
 *        Most of the times it stops the video when you put reverse with no problems
 * v2.7 Include pause when touching the video in the center, rewind when touching the left side and Fast Forward when touching the right side. (15% of the screen each)
 *            Correct problem when stopping a paused video (the icon shows an incorrect image at the beginning of the next video)
 * v2.8 |----------------------------------------------------------------------------------------------|
 *        |- Multicontroller support ----- [In Video List] ------------ [During Playback] ---------------|
 *        |----------------------------------------------------------------------------------------------|
 *        |- Press command knob ---------- [Select video] ------------- [Play/pause] --------------------|
 *        |- Tilt up --------------------- [Video list pgup] ---------- [Toggle fullscreen] -------------|
 *        |- Tilt down ------------------- [Video list pgdn] ---------- [Stop] --------------------------|
 *        |- Tilt Right ------------------ [Toggle shuffle mode] ------ [Next] --------------------------|
 *        |- Tilt left ------------------- [Toggle repeat all] -------- [Previous] ----------------------|
 *        |- Rotate command knob CCW/CW -- [Scroll video list up/dn] -- [RW/FF (10 seconds)] ------------|
 *        |----------------------------------------------------------------------------------------------|
 *        Lowered RW/FF time from 30s => 10s for beter control with command knob rotation
 *        Change method of managing the video list to jquery instead of bash
 *        Avoid problems when using files with ', " or other special characters. You must remove this character from your video name
 *        Use of the command knob to control the playback and to select the videos
 *        Use of the websocketd file provided by diginix
 *        Previous video option
 *        Option to select the playback option with the commander (tilt left or right)
 * v2.9 Repeat All option: Keep track of recently played videos so videos aren't repeated until the entire list is played.
 *        Toggling repeat 1/all or shuffle OFF resets recentlyPlayed list; shuffle ON, stopping playback, and rebooting do not.
 *        After last video in the list is played, jumps to the first video in the list.
 *        User variables are saved to localStorage: shuffle, repeat 1, repeat all, fullscreen, and recently played list.
 *        Option to select the playback option with the commander (tilt left or right)
 * v3.2 Sort order now is case insensitive (only for no unicode)
 *        You can choose the color of the interface (Red, Orange, Green and Blue only). You have to change the name of the variable in the JS
 *        You start the selecting the last played video
 *        Small fixes on the FF / RW in order to make only one call
 *        Added a plugin to the cmu in order to allow fullscreen toggle (commander up while playing). It allows to resize and rotate also (not available on the GUI yet)
 *        Delete the gstreamer registry on start in order to fix the plugin repository (Resets to the one without the codecs at car restart)
 * v3.3 Fixes the unicode list retrieve and removes the "only unicode" method
 *        Now it takes the time from gplay app
 *        Adds the flac codec to the gstreamer libs
 *        It has the option to play flac files (from the Music folder un the usb stick). More formats will be supported (They need to be tested)
 *        It shows the metadata of the files when playing music
 * v3.4 Has aspect ratio and 2 fullscreen modes. One of them preserving the video size ratio
 *        Doesn't show the FullScreen button when playing music
 *        Fixed a problem while selecting the options with the commander
 *   Fixed issues with random stopping in random
 *   Fixed issues with trying to go back with no previous track
 * v3.5 Changed this filename to videoplayer-v3.js
 *   Created starting method StartVideoPlayerApp to kick off Player faster instead of using the document 'ready' event
 *   Video title filters out the extension and turns underscores to spaces
 *   Repeat now one button toggles: none - 1 - all
 *   StatusBarNotifications for toggles
 *   Added Multicontroller 'hold' actions
 *   Shows gplay error in error message
 *   After hitting an error will make up to 3 attempts to re-start the video in 10 second intervals
 *   Video Resumes where it left off when shifting out of reverse
 *   Added to option "Resume Play" - when checked:
 *   - Resumes the video where you left off if it was interrupted or the app was exited while playing.
 *   - Saves video list to reopen and resume quickly (reloads if switch to music or press reload button)
 *   - If the video is stopped and you are in the list when you exit you will return to the list when reopened.
 *   Added "Black Out Background" option - Will overlay all other GUI layers leaving only the video and solid black background
 *   - Video Title will show centered above video and time below in the lower left corner for about 5 seconds and fade out
 *   - If "Title to Statusbar" is checked, title and time will stay visible (but can be toggled with the multicontroller).
 *   - This is ON TOP of all layers including the statusbar and bottom controls while the video player background is ON THE BOTTOM of all the other layers
 *   - Pausing the video temporarily hides the overlay
 * TODO:
 *        Change the audio input and stop the music player. If just mutes the player the system lags when playing
 *        Complete the plugins in the cmu in order to allow more file types (mkv / ogg / ac3)
 */
/*
 *  Video Player App preload file
 */
export const enableLog = false;
let vpColor = 'Red';
let vphColor = 'darkred';
let vpColorClass = 'selectedItem' + vpColor;

// let folderPath='/home/victor/Videos1';
const folderPath = '/tmp/mnt';
let currentVideoTrack = null;
let Repeat = JSON.parse(localStorage.getItem('videoplayer.repeat')) || 0; // 0 = norepeat 1 = repeat1 2 = repeatAll
let FullScreen = JSON.parse(localStorage.getItem('videoplayer.fullscreen')) || 0; // 0 no FS - 1 FS - 2 Stretch
let Shuffle = JSON.parse(localStorage.getItem('videoplayer.shuffle')) || false;
let PlayMusic = JSON.parse(localStorage.getItem('videoplayer.playmusic')) || false;
let ResumePlay = false;
let currentVideoListContainer = 0;
let totalVideoListContainer = 0;
let waitingWS = false;
let waitingForClose = true;
let totalVideos = 0;
let intervalVideoPlayer = null;
let VideoPaused = false;
let CurrentVideoPlayTime = null;
let TotalVideoTime = null;
let intervalPlaytime = null;
// let waitingNext = false;
const useisink = true;
let selectedItem = 0;
let recentlyPlayed = JSON.parse(localStorage.getItem('videoplayer.recentlyplayed')) || [];
let statusbarTitleVideo = JSON.parse(localStorage.getItem('videoplayer.statusbartitle')) || false;
let BlackOut = JSON.parse(localStorage.getItem('videoplayer.blackout')) || false;
let selectedOptionItem = -1; // 6 ??
// const vpWaitingForShutdown = null;
let retryCountdown = null;
let retryAttempts = 0;
// hold function while video is playing can be customized
// id of toggle button ex: Repeat Button - myVideoRepeatBtn
const holdFnPlySel = 'myVideoRepeatBtn'; // hold action for "select"
const holdFnPlyUp = 'optionStatusbarTitle'; // hold action for "up"
const holdFnPlyDn = 'myVideoShuffleBtn'; // hold action for "down"
const holdFnPlyLt = 'toggleBgBtn'; // hold action for "left"
const holdFnPlyRt = 'optionBlackOut'; // hold action for "right"
const clickFnPlySel = 'myVideoPausePlayBtn';
const clickFnPlyUp = 'myVideoFullScrBtn';
const clickFnPlyDn = 'myVideoStopBtn';

// let logFile = "/tmp/mnt/sd_nav/video-log.txt";
// const logFile = '/jci/gui/apps/_videoplayer/videoplayer_log.txt';
const boxChecked = 'url(apps/_videoplayer/templates/VideoPlayer/images/myVideoCheckedBox.png)';
const boxUncheck = 'url(apps/_videoplayer/templates/VideoPlayer/images/myVideoUncheckBox.png)';
const videoPlayerIcon = 'apps/_videoplayer/templates/VideoPlayer/images/icon.png';
let optionsPanelOpen = false;

let metadataTitle;
let metadataAlbum;
let metadataComposer;
let metadataAlbumArtist;
let metadataArtist;
let metadataTrackNumber;
let metadataGenre;
let metadataComment;
let metadataAudioCodec;
let metadataVideoRatio;
let videoHeight = null;
let videoWidth = null;

let player;
let src = '';

let wsVideo = null;
const videoTitleFilter = function(title) {
  return title.replace(/\.(mp3|mp4|avi|wmv|flv|3gp|flac)$/g, '').replace(/\_/g, ' ');
};

if (!window.jQuery) {
  utility.loadScript('addon-common/jquery.min.js');
}

export const StartVideoPlayerApp = () => {
  player = framework.getAppInstance('_videoplayer');
  currentVideoTrack = player.currentVideoTrack || currentVideoTrack;
  ResumePlay = player.resumeVideo || ResumePlay;
  waitingForClose = true;
  try {
    $('#SbSpeedo, #Sbfuel-bar-wrapper').fadeOut();
    $('#SbSpeedo').addClass('stayHidden');
    if (localStorage.getItem('videoplayer.colortheme')) {
      const colorPick = JSON.parse(localStorage.getItem('videoplayer.colortheme')) || null;
      if (utility.toType(colorPick) === 'array') {
        vpColor = colorPick[0].charAt(0).toUpperCase() + colorPick[0].slice(1);
        vphColor = colorPick[1];
      } else if (utility.toType(colorPick) === 'string') {
        vpColor = colorPick.charAt(0).toUpperCase() + colorPick.slice(1);
        vphColor = colorPick;
      }
      vpColorClass = 'selectedItem' + vpColor;
    }

    if (JSON.parse(localStorage.getItem('videoplayer.background'))) {
      $('#myVideoContainer').addClass('noBg');
    }
  } catch (err) {

  }

  $('#myVideoFullScrBtn').css('background-image', 'url(apps/_videoplayer/templates/VideoPlayer/images/myFullScreen' + FullScreen + '.png)');
  $('#myVideoRepeatBtn').css('background-image', 'url(apps/_videoplayer/templates/VideoPlayer/images/myRepeat' + Repeat + '.png)');
  $('#myVideoShuffleBtn').css('background-image', 'url(apps/_videoplayer/templates/VideoPlayer/images/myShuffle' + (Shuffle ? '' : '0') + '.png)');
  setCheckBoxes('#myResumePlay', ResumePlay);
  setCheckBoxes('#myPlayMusicBtn', PlayMusic);

  function setCheckBoxes(opId, checkIt) {
    const check = (checkIt) ? boxChecked : boxUncheck;
    $(opId).css({'background-image': check});
  }
  $('#colorThemes a').click(function(e) {
    const colorPick = $(this).html();
    $('#colorThemes a').css('background', '').removeClass(vpColorClass);
    vpColor = colorPick.charAt(0).toUpperCase() + colorPick.slice(1);
    vphColor = $(this).attr('class');
    vpColorClass = 'selectedItem' + vpColor;
    $(this).css('background', vphColor);
    const themeColors = [vpColor, vphColor];
    localStorage.setItem('videoplayer.colortheme', JSON.stringify(themeColors));
  });


  /*  src = 'USBDRV=$(ls /mnt | grep sd); ' +

      'for USB in $USBDRV; ' +
      'do ' +
      'USBPATH=/tmp/mnt/${USB}; ' +
      'SWAPFILE="${USBPATH}"/swapfile; ' +
      'if [ -e "${SWAPFILE}" ]; ' +
      'then ' +
      'mount -o rw,remount ${USBPATH}; ' +
      'mkswap ${SWAPFILE}; ' +
      'swapon ${SWAPFILE}; ' +
      'break; ' +
      'fi; ' +
      'done; ';*/
  src = 'kill -9 $(ps | grep aap | awk \'${print $1}\'); ';
  src += 'kill -9 $(ps | grep carplay | awk \'${print $1}\'); ';
  src += 'rm -f /tmp/root/.gstreamer-0.10/registry.arm.bin; '; // cleans the gstreamer registry

  src += 'gst-inspect-0.10 > /dev/null 2>&1 '; // Start gstreamer before starting videos

  myVideoWs(src, false);

  /* reboot system
  ==================================================================================*/
  $('#rebootBtnDiv').click(function() {
    myRebootSystem();
  });

  /* retrieve video list
  ==================================================================================*/
  $('#myVideoMovieBtn').click(function() {
    player.savedVideoList = null;
    myVideoListRequest();
  });

  /* scroll up video list
  ==================================================================================*/
  $('#myVideoScrollUp').click(function() {
    myVideoListScrollUpDown('up');
  });

  /* scroll down video list
  ==================================================================================*/
  $('#myVideoScrollDown').click(function() {
    myVideoListScrollUpDown('down');
  });

  /* play pause playback
  ==================================================================================*/
  $('#myVideoPausePlayBtn, #videoPlayBtn').click(function() {
    if (BlackOut) {
      toggleBlackOut(VideoPaused);
    }
    myVideoPausePlayRequest();
  });

  /* stop playback
  ==================================================================================*/
  $('#myVideoStopBtn, #videoStopBtn').click(function() {
    player.resumePlay = null;
    currentVideoTrack = null;
    CurrentVideoPlayTime = null;
    myVideoStopRequest();
  });


  /* next track
  ==================================================================================*/
  $('#myVideoNextBtn, #videoNextBtn').click(function() {
    myVideoNextRequest();
  });

  /* previous track
  ==================================================================================*/
  $('#myVideoPreviousBtn, #videoPrevBtn').click(function() {
    myVideoPreviousRequest();
  });

  /* FF
  ==================================================================================*/
  $('#myVideoFF, #videoPlayFFBtn').click(function() {
    myVideoFFRequest();
  });

  /* RW
  ==================================================================================*/
  $('#myVideoRW, #videoPlayRWBtn').click(function() {
    myVideoRWRequest();
  });


  /* FullScreen playback
  ==================================================================================*/
  $('#myVideoFullScrBtn').click(function() {
    FullScreen > 1 ? FullScreen = 0 : FullScreen++;

    $('#myVideoFullScrBtn').css('background-image', 'url(apps/_videoplayer/templates/VideoPlayer/images/myFullScreen' + FullScreen + '.png)');
    AIO_SBN('FullScreen: ' + (FullScreen ? (FullScreen - 1 ? 'ON' : 'ON (Keep Aspect Ratio)') : 'OFF'), videoPlayerIcon);
    try {
      localStorage.setItem('videoplayer.fullscreen', JSON.stringify(FullScreen));
    } catch (err) {
      framework.common.setSbName(err.message);
    }
    if (currentVideoTrack !== null) fullScreenRequest();
  });

  /* Repeat option (toggle none - looping single track - loop entire video list)
  ==================================================================================*/
  $('#myVideoRepeatBtn, #videoReAllBtn').click(function() {
    Repeat > 1 ? Repeat = 0 : Repeat++;
    $('#myVideoRepeatBtn').css('background-image', 'url(apps/_videoplayer/templates/VideoPlayer/images/myRepeat' + Repeat + '.png)');
    AIO_SBN('Repeat: ' + (Repeat ? (Repeat - 1 ? 'All' : '1') : 'None'), videoPlayerIcon);
    recentlyPlayed = [];
    localStorage.setItem('videoplayer.repeat', JSON.stringify(Repeat));
  });

  /* Shuffle option
  ==================================================================================*/
  $('#myVideoShuffleBtn, #videoShuffleBtn').click(function() {
    Shuffle = !Shuffle;
    $('#myVideoShuffleBtn').css('background-image', 'url(apps/_videoplayer/templates/VideoPlayer/images/myShuffle' + (Shuffle ? '' : '0') + '.png)');
    recentlyPlayed = [];
    AIO_SBN('Shuffle: ' + (Shuffle ? 'ON' : 'OFF'), videoPlayerIcon);
    localStorage.setItem('videoplayer.shuffle', JSON.stringify(Shuffle));
  });

  /* Music
  ==================================================================================*/
  $('#myPlayMusicBtn').click(function() {
    PlayMusic = !PlayMusic;
    $('#myPlayMusicBtn').css({'background-image': (PlayMusic ? boxChecked : boxUncheck)});
    localStorage.setItem('videoplayer.playmusic', JSON.stringify(PlayMusic));
    AIO_SBN((PlayMusic ? 'Music' : 'Video') + ' Player', videoPlayerIcon);
    player.savedVideoList = null;
    recentlyPlayed = [];
    myVideoListRequest();
  });

  /* Toggle Video Player Background Button
  ==================================================================================*/
  $('#toggleBgBtn').click(function() {
    $('#myVideoContainer').toggleClass('noBg');
    AIO_SBN('Video Player Background: ' + ($('#myVideoContainer').hasClass('noBg') ? 'OFF' : 'ON'), videoPlayerIcon);
    localStorage.setItem('videoplayer.background', JSON.stringify($('#myVideoContainer').hasClass('noBg')));
  });

  /* Show Title of Currently Playing in the Statusbar
  ==================================================================================*/
  $('#optionStatusbarTitle').click(function() {
    statusbarTitleVideo = !statusbarTitleVideo;
    $('#optionStatusbarTitle').css({'background-image': (statusbarTitleVideo ? boxChecked : boxUncheck)});
    AIO_SBN('Title In Statusbar: ' + (statusbarTitleVideo ? 'ON' : 'OFF'), videoPlayerIcon);
    (!statusbarTitleVideo) ? framework.common.setSbName('Video Player'): (currentVideoTrack !== null ? framework.common.setSbName(videoTitleFilter($('#myVideoName').text())) : null);
    localStorage.setItem('videoplayer.statusbartitle', JSON.stringify(statusbarTitleVideo));
    $('#blackOutVideoStatus').removeClass('out');
    if (currentVideoTrack !== null && BlackOut) {
      (statusbarTitleVideo) ? $('.VPCtrlAppName, #blackOutVideoStatus').removeClass('out'): $('.VPCtrlAppName, #blackOutVideoStatus').addClass('out');
    }
  });

  /* Black Out the Background when videos are not in FullScreen
  ==================================================================================*/
  $('#optionBlackOut').click(function() {
    BlackOut = !BlackOut;
    $('#optionBlackOut').css({'background-image': (BlackOut ? boxChecked : boxUncheck)});
    AIO_SBN('Black Out Background: ' + (BlackOut ? 'ON' : 'OFF'), videoPlayerIcon);
    localStorage.setItem('videoplayer.blackout', JSON.stringify(BlackOut));
    if (currentVideoTrack !== null) {toggleBlackOut(BlackOut);}
  });

  /* Resume Last Playing Video Option
  ==================================================================================*/
  $('#myResumePlay').click(function() {
    ResumePlay = !ResumePlay;
    $('#myResumePlay').css({'background-image': (ResumePlay ? boxChecked : boxUncheck)});
    player.resumeVideo = ResumePlay;
    AIO_SBN('Resume Media: ' + (ResumePlay ? 'ON' : 'OFF'), videoPlayerIcon);
    localStorage.setItem('videoplayer.resumevideo', JSON.stringify(ResumePlay));
  });

  /* Video information / options panel
  ==================================================================================*/
  $('#myVideoInfo, #myVideoInfoClose').click(function() {
    $('#videoInfoPanel').toggleClass('showInfo');
    optionsPanelOpen = $('#videoInfoPanel').hasClass('showInfo');
    if (optionsPanelOpen) {
      $('#popInfoTab').css('background', vpColor);
      setCheckBoxes('#optionStatusbarTitle', statusbarTitleVideo);
      setCheckBoxes('#optionBlackOut', BlackOut);
    } else {
      SelectCurrentTrack();
    }
  });

  $('#popInfoTab').click(function() {
    $('#videoInfoPanel').removeClass('state');
    $('#popInfoTab').css('background', vphColor);
    $('#popOptionsTab').css('background', '');
  });
  $('#popOptionsTab').click(function() {
    $('#unmountMsg').html('');
    myVideoWs('cat /proc/meminfo | grep Swap', true);
    $('#videoInfoPanel').addClass('state');
    $('#popOptionsTab').css('background', vphColor);
    $('#popInfoTab').css('background', '');
  });
  $('#unmountSwapVP').click(unmountSwap);

  // Load cached Video List
  if (player.savedVideoList && (ResumePlay || player.resumePlay)) {
    try {
      $('#myVideoContainer').append(JSONtoDOM(player.savedVideoList));
      totalVideos = $('#myVideoList li').length;
      totalVideoListContainer = $('.videoListContainer').length;
      SelectCurrentTrack();
    } catch (e) {
      AIO_SBN(e.message, videoPlayerIcon);
      player.savedVideoList = null;
      myVideoListRequest();
    }
  } else {
    $('#myVideoContainer').append('<div id="myVideoList">');
    // Initial List Request
    setTimeout(function() {
      myVideoListRequest();
    }, 200);
  }

  /* start playback (had to move this after #myVideoList is created)
  ==================================================================================*/
  $('#myVideoList').on('click', 'li', function() {
    myVideoStartRequest($(this));
  });

  // add blackOut class to overlay
  if (BlackOut) {
    $('.VPControlOverlay').addClass('blackOut');
  }

  // try to close the video if the videoplayer is not the current app
  intervalVideoPlayer = setInterval(function() {
    if (framework.getCurrentApp() !== '_videoplayer') {
      CloseVideoFrame();
    }
  }, 10); // some performance issues ??
  setTimeout(function() {
    myVideoWs('[ -e ' + folderPath + '/sd*/swapfile ] && echo VP_SWAP || echo VP_NOSWAP', true);
  }, 1000);
};

// try not to make changes to the lines below

// Start of Video Player
// #############################################################################################


/* reboot system
==========================================================================================================*/
function myRebootSystem() {
  myVideoWs('reboot', false); // reboot
}


/* video list request / response
==========================================================================================================*/
function myVideoListRequest() {
  if (!waitingWS) {
    waitingWS = true;
    currentVideoListContainer = 0;
    $('#myVideoScrollUp, #myVideoScrollDown').css({'visibility': ''});
    $('#myVideoList').html('<img id=\'ajaxLoader\' src=\'apps/_videoplayer/templates/VideoPlayer/images/ajax-loader.gif\'>');
    src = '';
    src += 'FILES=""; ';
    if (!PlayMusic) {
      src += 'V=$(find /tmp/mnt/sd*/Movies -type f -name "*.mp4" -o -name "*.avi" -o -name "*.flv" -o -name "*.wmv" -o -name "*.3gp" -o -name "*.mkv");';
      $('#myVideoFullScrBtn').css({'visibility': ''});
      $('#myVideoFullScrBtn').addClass('playbackOption');
    } else {
      src += 'V=$(find /tmp/mnt/sd*/Music -type f -name "*.mp3" -o -name "*.ogg" -o -name "*.flac" -o -name "*.mp4" );';
      $('#myVideoFullScrBtn').css({'visibility': 'hidden'});
      $('#myVideoFullScrBtn').removeClass('playbackOption');
    }
    src += 'IFS=\$\'\n\';';
    src += 'for VIDEO in \$V;';
    src += 'do ' +
      'FILES="${FILES}${VIDEO}|"; ' +
      'done; ' +
      'FILES=$(echo "${FILES}" | tr \'|\' \'\n\' | sort -f -t \/ -k 6 | tr \'\n\' \'|\'); ' +
      'echo playback-list//#"${FILES}"';
    myVideoWs(src, true); // playback-list
  }
}

function myVideoListResponse(data) {
  waitingWS = false;

  $('#myVideoList').html('');

  data = data.replace(folderPath + '/sd*/Movies/*.mp4|', '');
  data = data.replace(folderPath + '/sd*/Movies/*.avi|', '');
  data = data.replace(folderPath + '/sd*/Movies/*.flv|', '');
  data = data.replace(folderPath + '/sd*/Movies/*.wmv|', '');
  data = data.replace(folderPath + '/sd*/Movies/*.3gp|', '');
  data = data.replace(folderPath + '/sd*/Movies/*.mkv|', '');
  data = data.replace(folderPath + '/sd*/Music/*.mp3|', '');
  data = data.replace(folderPath + '/sd*/Music/*.flac|', '');
  data = data.replace(folderPath + '/resources/Movies/*.mp4|', '');

  data = data.substring(1);

  const videos = data.split('|');
  videos.splice(videos.length - 1);
  totalVideoListContainer = 1;


  if ((!videos[0]) || (videos[0] === '')) {
    let txt;

    if (!PlayMusic) {
      txt = 'No videos found<br><br>Tap <img src="apps/_videoplayer/templates/VideoPlayer/images/myVideoMovieBtn.png" style="margin-left:8px; margin-right:8px" /> to search again<br><br>Make sure your avi/mp4/flv/wmv/3gp files are in the "Movies" folder';
    } else {
      txt = 'No music found<br><br>Tap <img src="apps/_videoplayer/templates/VideoPlayer/images/myVideoMovieBtn.png" style="margin-left:8px; margin-right:8px" /> to search again<br><br>Make sure your flac/mp3 files are in the "Music" folder';
    }

    $('#myVideoList').html(txt);

    currentVideoTrack = null;

    $('.playbackOption').css('background-image', function(i, val) {return val.substring(0, val.indexOf(')') + 1);});

    selectedOptionItem = 8;

    $('.playbackOption').eq(selectedOptionItem).css('background-image', function(i, val) {return val + ', -o-linear-gradient(top,' + vphColor + ', rgba(0,0,0,0))';});
  } else {
    $('.playbackOption').css('background-image', function(i, val) {return val.substring(0, val.indexOf(')') + 1);});
    $('#myVideoList').append($('<ul id="ul' + totalVideoListContainer + '"></ul>')
        .addClass('videoListContainer'));
    let videoListUl = $('#ul' + totalVideoListContainer);
    let videoString = '';
    videos.forEach(function(item, index) {
      if ((index > 0) && (index) % 8 === 0) {
        totalVideoListContainer++;
        $('#myVideoList').append($('<ul id="ul' + totalVideoListContainer + '"></ul>')
            .addClass('videoListContainer'));
        videoListUl = $('#ul' + totalVideoListContainer);
      }

      videoString = '';
      const videoPath = item.replace(/[a-z0-9\/]*\/(movies|music)\//i, '').split('/');
      let videoName = videoPath.pop();
      if (PlayMusic) {videoName = videoName.replace(/^[0-9]{2} /, '');} // Music track file names often start with the track number
      if (videoPath.length > 0) {videoString = '<div class=\'videoPath\'>/' + videoPath.join('/') + '</div>';} // File is in a subdirectory
      videoString += '<div class=\'videoLine\'>' + (++index) + '. ' + videoName.replace(/  /g, ' &nbsp;') + '</div>';

      videoListUl.append($('<li></li>')
          .attr({
            'video-name': videoName,
            'video-data': item,
          })
          .addClass('videoTrack' + (videoPath.length > 0 ? ' hasPath': ''))
          .html(videoString));
    });

    totalVideos = videos.length;
    player.savedVideoList = DOMtoJSON(document.getElementById('myVideoList'));
    SelectCurrentTrack();

    if (totalVideoListContainer > 1) {
      $('#myVideoScrollDown').css({'visibility': 'visible'});
    }
  }
}

/* video list scroll up / down
==========================================================================================================*/
function myVideoListScrollUpDown(action) {
  switch (action) {
    case 'up':
      currentVideoListContainer--;
      break;
    case 'down':
      currentVideoListContainer++;
      break;
    case 'top':
      currentVideoListContainer = 0;
      break;
    case 'bottom':
      currentVideoListContainer = totalVideoListContainer - 1;
      break;
  }

  if (currentVideoListContainer === 0) {
    $('#myVideoScrollUp').css({'visibility': ''});
  } else { // if(currentVideoListContainer > 0)
    $('#myVideoScrollUp').css({'visibility': 'visible'});
  }

  if (currentVideoListContainer === totalVideoListContainer - 1) {
    $('#myVideoScrollDown').css({'visibility': ''});
  } else { // if(currentVideoListContainer < totalVideoListContainer - 1)
    $('#myVideoScrollDown').css({'visibility': 'visible'});
  }

  $('.videoListContainer').each(function(index) {
    $(this).css({'display': 'none'});
  });

  $('.videoListContainer:eq(' + currentVideoListContainer + ')').css('display', '');
}


/* start playback request / response
==========================================================================================================*/
function myVideoStartRequest(obj) {
  $('#videoInfoPanel').removeClass('showInfo');
  clearInterval(retryCountdown);
  retryCountdown = null;
  optionsPanelOpen = false;
  player.musicIsPaused = true;
  currentVideoTrack = $('.videoTrack').index(obj);
  CurrentVideoPlayTime = player.resumePlay || 0;
  const videoToPlay = obj.attr('video-data');
  $('#myVideoName').html('Preparing to play...');
  $('#myVideoStatus, #blackOutVideoStatus, #myMusicMetadata').html('');
  $('#myVideoScrollUp, #myVideoScrollDown').css({'visibility': ''});

  $('.memErrorMessage').remove();
  // $('#widgetContent').prepend($('</div>').addClass('recentPlayedItem').text(currentVideoTrack + ": " + videoToPlay));
  $('.VPControlOverlay').removeClass('blackOut');
  $('#blackOutVideoStatus').removeClass('out');

  metadataAlbum = null;
  metadataAlbumArtist = null;
  metadataArtist = null;
  metadataComposer = null;
  metadataTitle = null;
  metadataTrackNumber = null;
  metadataComment = null;
  metadataGenre = null;
  metadataAudioCodec = null;
  metadataVideoRatio = null;
  videoHeight = null;
  videoWidth = null;

  localStorage.setItem('videoplayer.currentvideo', JSON.stringify(currentVideoTrack));
  player.currentVideoTrack = currentVideoTrack;

  TotalVideoTime = null;
  // waitingNext = false;

  if (recentlyPlayed.indexOf(currentVideoTrack) === -1) {
    recentlyPlayed.push(currentVideoTrack);
  } else {
    recentlyPlayed.push(recentlyPlayed.splice(recentlyPlayed.indexOf(currentVideoTrack), 1)[0]);
  }
  // myVideoWs('killall -9 gplay', false); //start-playback

  // myVideoWs('sync; for n in 0 1 2 3; do echo $n > /proc/sys/vm/drop_caches; done;', false);
  // let prePlayVp = 'sync; for n in 0 1 2 3; do echo $n > /proc/sys/vm/drop_caches; done; ';
  // prePlayVp += 'echo 1 > /proc/sys/vm/overcommit_memory; ';
  // prePlayVp += 'free -k >> /tmp/root/casdk-error.log; ';
  // prePlayVp += 'sleep 0.3; ';
  // myVideoWs(prePlayVp, false);

  $('.VideoPlayerTmplt').addClass('videoPlaying');
  $('#myVideoName').html(obj.attr('video-name').replace(/ /g, '&nbsp;'));

  // $('.videoTouchControls').show();
  // $('.VPControlOverlay').css('cssText', 'display: block !important');
  $('.VPControlOverlay').css('height', '480px');
  $('#videoPlayBtn').css({'background-image': ''});
  $('.VPControlOverlay').removeClass('wideVideo');


  (BlackOut && statusbarTitleVideo) ? $('.VPCtrlAppName, #blackOutVideoStatus').removeClass('out'): $('.VPCtrlAppName, #blackOutVideoStatus').addClass('out');

  $('.VPCtrlAppName').text(videoTitleFilter($('#myVideoName').text()));
  if (statusbarTitleVideo) {
    framework.common.setSbName(videoTitleFilter($('#myVideoName').text()));
  }
  AIO_SBN(videoTitleFilter($('#myVideoName').text()), videoPlayerIcon);

  try {
    src = 'sync; for n in 0 1 2 3; do echo $n > /proc/sys/vm/drop_caches; done; ';
    src += 'killall -9 gplay; ';
    src += 'sleep 0.3; ';


    // Screen size 800w*480h
    // Small screen player 700w*367h

    src += 'VSALPHA=1 /usr/bin/gplay ';

    if (useisink) {
      src += '--video-sink="mfw_isink';

      if (!FullScreen) {
        src += ' disp-width=700 disp-height=367 axis-left=50 axis-top=64';
        // src += '--video-sink="mfw_v4lsink disp-width=800 disp-height=480 axis-left=0 axis-top=0" ';
      }
      src += '" --audio-sink=alsasink ';
    }
    // Trying to asign to specific alsa device or card to take audio focus
    // src += '" --audio-sink="alsasink device=entertainmentBtsa" ';
    src += '"' + videoToPlay + '" 2>&1 ';

    wsVideo = new WebSocket('ws://127.0.0.1:9998/');

    wsVideo.onopen = function() {
      try {
        // if (PlayMusic)
        // {
        wsVideo.send('/usr/bin/gst-discoverer-0.10 -v "' + videoToPlay + '"');
        // }
        wsVideo.send(src);
        if (CurrentVideoPlayTime > 1) {
          setTimeout(function() {
            wsVideo.send('e 0 t' + (CurrentVideoPlayTime--));
            wsVideo.send('h');
          }, 900);
        }
      } catch (e) {
        myVideoStopRequest();
      }
    };

    wsVideo.onmessage = function(event) {
      checkStatus(event.data);
    };
  } catch (err) {
    myVideoStopRequest();
  }
}


/* playback next track request
==========================================================================================================*/
function myVideoNextRequest() {
  clearInterval(intervalPlaytime);

  $('#myVideoStatus, #blackOutVideoStatus, #myVideoName, .VPCtrlAppName').html('');

  if (!waitingWS) {
    waitingWS = true;

    let nextVideoTrack = 0;

    //        previousVideoTrack = currentVideoTrack;

    if (currentVideoTrack !== null) {
      nextVideoTrack = currentVideoTrack;
    }
    if (Repeat !== 1 && totalVideos > 1) {
      if (recentlyPlayed.length >= totalVideos) {
        recentlyPlayed = [];
        if (Repeat !== 2) {
          myVideoStopRequest();
          waitingWS = false;
          return;
        }
      }

      if (Shuffle) {
        while (recentlyPlayed.indexOf(nextVideoTrack) !== -1 || nextVideoTrack === currentVideoTrack) {
          nextVideoTrack = Math.floor(Math.random() * totalVideos);
        }
      } else {
        nextVideoTrack++;
        if (nextVideoTrack >= totalVideos) {
          nextVideoTrack = 0;
        }
      }
    }

    localStorage.setItem('videoplayer.recentlyplayed', JSON.stringify(recentlyPlayed));

    const nextVideoObject = $('.videoTrack:eq(' + nextVideoTrack + ')');

    if (nextVideoObject.length !== 0) {
      try {
        wsVideo.send('x');
        myVideoWs('killall -9 gplay', false);
        wsVideo.close();
        wsVideo = null;
      } catch (e) {}
      myVideoStartRequest(nextVideoObject);
    } else {
      myVideoStopRequest();
    }
    waitingWS = false;
  }
}


/* playback previous track request
==========================================================================================================*/
function myVideoPreviousRequest() {
  clearInterval(intervalPlaytime);

  $('#myVideoStatus, #blackOutVideoStatus, #myVideoName, .VPCtrlAppName').html('');

  let previousVideoTrack;
  if (!(previousVideoTrack = recentlyPlayed.pop())) {
    myVideoStopRequest();
  } else {
    while (previousVideoTrack === currentVideoTrack) {
      if (!(previousVideoTrack = recentlyPlayed.pop())) {
        previousVideoTrack = currentVideoTrack;
        break;
      }
    }
  }

  if (!waitingWS) {
    waitingWS = true;
    try {
      wsVideo.send('x');
      wsVideo.close();
      wsVideo = null;
    } catch (e) {}

    let previousVideoObject = $('.videoTrack:eq(' + previousVideoTrack + ')');
    if (!previousVideoObject) {
      previousVideoObject = $('.videoTrack:eq(0)');
    }
    myVideoStartRequest(previousVideoObject);

    waitingWS = false;
  }
}


/* stop playback request / response
==========================================================================================================*/
function myVideoStopRequest() {
  if (statusbarTitleVideo && framework.getCurrentApp() === '_videoplayer') {
    framework.common.setSbName('Video Player');
  }
  clearInterval(retryCountdown);
  retryCountdown = null;

  if (wsVideo !== null) {
    try {
      wsVideo.send('x');
      wsVideo.close();
      wsVideo = null;
    } catch (e) {}
  }

  clearInterval(intervalPlaytime);

  $('.memErrorMessage').remove();

  $('#myVideoStatus, #blackOutVideoStatus, #myVideoName, .VPCtrlAppName').html('');
  $('.VPControlOverlay').removeClass('blackOut');
  VideoPaused = false;
  $('#myVideoPausePlayBtn').css({'background-image': 'url(apps/_videoplayer/templates/VideoPlayer/images/myVideoPauseBtn.png)'});

  SelectCurrentTrack();

  $('.VPControlOverlay').css('height', '');
  $('.VideoPlayerTmplt').removeClass('videoPlaying');
  myVideoListScrollUpDown('other');
}


/* Play/Pause playback request / response
==========================================================================================================*/
function myVideoPausePlayRequest() {
  if (!waitingWS) {
    waitingWS = true;

    wsVideo.send('a');

    if (VideoPaused) {
      VideoPaused = false;
      $('#myVideoPausePlayBtn').css({'background-image': 'url(apps/_videoplayer/templates/VideoPlayer/images/myVideoPauseBtn.png)'});
      $('#videoPlayBtn').css({'background-image': ''});
    } else {
      VideoPaused = true;
      $('#myVideoPausePlayBtn').css({'background-image': 'url(apps/_videoplayer/templates/VideoPlayer/images/myVideoPlayBtn.png)'});
      $('#videoPlayBtn').css({'background-image': 'url(apps/_videoplayer/templates/VideoPlayer/images/video-play.png)'});
    }

    waitingWS = false;
  }
}

/* FF playback request / response
==========================================================================================================*/
function myVideoFFRequest() {
  if (BlackOut && !statusbarTitleVideo) {
    $('#blackOutVideoStatus').show();
    $('#blackOutVideoStatus').removeClass('out');
  }
  if ((!waitingWS) && (CurrentVideoPlayTime)) {
    waitingWS = true;

    if (CurrentVideoPlayTime > 0 && CurrentVideoPlayTime + 11 < TotalVideoTime) {
      CurrentVideoPlayTime = CurrentVideoPlayTime + 10;
    } else {
      CurrentVideoPlayTime = TotalVideoTime - 1;
    }

    wsVideo.send('e 1 t' + CurrentVideoPlayTime);
    wsVideo.send('h');
    waitingWS = false;
  }
  if (BlackOut && !statusbarTitleVideo) {
    setTimeout(function() {$('#blackOutVideoStatus').addClass('out');}, 1000);
  }
}

/* RW playback request / response
==========================================================================================================*/
function myVideoRWRequest() {
  if (BlackOut && !statusbarTitleVideo) {
    $('#blackOutVideoStatus').show();
    $('#blackOutVideoStatus').removeClass('out');
  }
  if ((!waitingWS) && (CurrentVideoPlayTime)) {
    waitingWS = true;

    CurrentVideoPlayTime = CurrentVideoPlayTime - 10;

    if (CurrentVideoPlayTime < 0) {
      CurrentVideoPlayTime = 0;
    }

    wsVideo.send('e 1 t' + CurrentVideoPlayTime);
    wsVideo.send('h');
    waitingWS = false;
  }
  if (BlackOut && !statusbarTitleVideo) {
    setTimeout(function() {$('#blackOutVideoStatus').addClass('out');}, 1000);
  }
}


/* toggles fullscreen during playback
==========================================================================================================*/
function fullScreenRequest() {
  if (!waitingWS) {
    waitingWS = true;

    if (!metadataVideoRatio) {
      metadataVideoRatio = (800 / 480);
    }

    let videoPosy; let videoPosx;

    if (FullScreen === 0) {
      if (metadataVideoRatio > (800 / 368)) { // wider and taller than 367/ width fixed to 800
        videoHeight = Math.round(800 / metadataVideoRatio);
        videoPosy = Math.round((480 - videoHeight) / 2);
        wsVideo.send('z 0 ' + videoPosy + ' 800 ' + videoHeight);
      } else {
        videoWidth = Math.round(368 * metadataVideoRatio);
        videoPosx = Math.round((800 - videoWidth) / 2);
        wsVideo.send('z ' + videoPosx + ' 64 ' + videoWidth + ' 368');
      }
    } else if (FullScreen === 1) {
      $('#myVideoControlDiv ul').css('background-color', 'black');
      if (metadataVideoRatio > (800 / 480)) { // wider / width fixed to 800
        videoHeight = Math.round(800 / metadataVideoRatio);
        videoPosy = Math.round((480 - videoHeight) / 2);
        wsVideo.send('z 0 ' + videoPosy + ' 800 ' + videoHeight);
        $('.VPControlOverlay').addClass('wideVideo');
      } else { // height fixed to 480
        videoWidth = Math.round(480 * metadataVideoRatio);
        videoPosx = Math.round((800 - videoWidth) / 2);
        wsVideo.send('z ' + videoPosx + ' 0 ' + videoWidth + ' 480');
      }
    } else {
      wsVideo.send('z 0 0 800 480');
      setTimeout(function() {$('#myVideoControlDiv ul').css({'background-color': ''});}, 1000);
    }
  }

  localStorage.setItem('videoplayer.fullscreen', JSON.stringify(FullScreen));
  waitingWS = false;
}

/* toggles black out mode during playback
==========================================================================================================*/
function toggleBlackOut(black) {
  if (black) {
    $('.VPControlOverlay').addClass('blackOut');
    if (statusbarTitleVideo) {
      $('.VPCtrlAppName, #blackOutVideoStatus').removeClass('out');
    }
  } else {
    $('.VPControlOverlay').removeClass('blackOut');
    $('.VPCtrlAppName, #blackOutVideoStatus').addClass('out');
  }
}

/* check Status
============================================================================================= */
function checkStatus(state) {
  let res = state.trim();

  if (res.indexOf('Playing  ]') !== -1) {
    res = res.substring(res.indexOf('Vol=') + 8, res.indexOf('Vol=') + 25);
    (BlackOut) ? $('#blackOutVideoStatus').html(res.replace(/(.*)\/(.*)/, '<div>$1</div><div>$2</div>')): $('#myVideoStatus').html(res);
  } else if (res.indexOf('fsl_player_play') !== -1) {
    $('.memErrorMessage').remove();
    clearInterval(retryCountdown);
    retryCountdown = null;
    CurrentVideoPlayTime = player.resumePlay || 0;
    if (!PlayMusic) {
      if (FullScreen !== 2) {
        fullScreenRequest();
      }
      toggleBlackOut(BlackOut);
    }
    if (CurrentVideoPlayTime > 1) {
      setTimeout(function() {
        wsVideo.send('e 0 t' + CurrentVideoPlayTime--);
        wsVideo.send('h');
      }, 900);
    }
    player.resumePlay = null;
    retryAttempts = 0;
    startPlayTimeInterval();
  } else if (res.indexOf('try to play failed') !== -1 || res.indexOf('ERR]') !== -1) {
    showMemErrorMessage(res);
  } else if ((!videoHeight) && (res.indexOf('Height: ') !== -1)) {
    videoHeight = res.substring(8);
    metadataVideoRatio = videoWidth / videoHeight; // ratio W/H
  } else if ((!videoHeight) && (res.indexOf('Width: ') !== -1)) {
    videoWidth = res.substring(7);
  } else if (res.indexOf('fsl_player_stop') !== -1) {
    myVideoNextRequest();
  } else if ((!metadataTitle) && (res.indexOf('title: ') !== -1)) {
    metadataTitle = res.substring(7);
    DisplayMetadata();
  } else if ((!metadataAlbumArtist) && (res.indexOf('album artist: ') !== -1)) {
    metadataAlbumArtist = res.substring(14);
    DisplayMetadata();
  } else if ((!metadataAlbum) && (res.indexOf('album: ') !== -1)) {
    metadataAlbum = res.substring(7);
    DisplayMetadata();
  } else if ((!metadataArtist) && (res.indexOf('artist: ') !== -1)) {
    metadataArtist = res.substring(8);
    DisplayMetadata();
  } else if ((!metadataComposer) && (res.indexOf('composer: ') !== -1)) {
    metadataComposer = res.substring(10);
    DisplayMetadata();
  } else if ((!metadataTrackNumber) && (res.indexOf('track number: ') !== -1)) {
    metadataTrackNumber = res.substring(13);
    DisplayMetadata();
  } else if ((!metadataGenre) && (res.indexOf('genre: ') !== -1)) {
    metadataGenre = res.substring(7);
    DisplayMetadata();
  } else if ((PlayMusic) && (!metadataAudioCodec) && (res.indexOf('audio codec: ') !== -1)) {
    metadataAudioCodec = res.substring(13);
    DisplayMetadata();
  } else if ((!metadataComment) && (res.indexOf('comment: ') !== -1)) {
    metadataComment = res.substring(9);
    DisplayMetadata();
  } else if ((!TotalVideoTime) && ((res.indexOf('Duration: ') !== -1) || (res.indexOf('Duration  : ') !== -1))) {
    res = res.split(':');
    TotalVideoTime = Number(res[1] * 3600) + Number(res[2] * 60) + Number(res[3].substring(0, 2));
  }
}


/* Display Metadata
============================================================================================= */
function DisplayMetadata() {
  let txt = '<table>';
  if (metadataTitle) {
    txt += '<tr><td>Title</td><td>' + metadataTitle + '</td></tr>';
  }
  if (metadataArtist) {
    txt += '<tr><td>Artist</td><td>' + metadataArtist + '</td></tr>';
  }
  if (metadataAlbumArtist) {
    txt += '<tr><td>Album Artist</td><td>' + metadataAlbumArtist + '</td></tr>';
  }
  if (metadataComposer) {
    txt += '<tr><td>Composer</td><td>' + metadataComposer + '</td></tr>';
  }
  if (metadataAlbum) {
    txt += '<tr><td>Album</td><td>' + metadataAlbum + '</td></tr>';
  }
  if (metadataGenre) {
    txt += '<tr><td>Genre</td><td>' + metadataGenre + '</td></tr>';
  }
  if (metadataTrackNumber) {
    txt += '<tr><td>Track Number</td><td>' + metadataTrackNumber + '</td></tr>';
  }
  if (metadataAudioCodec) {
    txt += '<tr><td>Audio Codec</td><td>' + metadataAudioCodec + '</td></tr>';
  }
  if (metadataComment) {
    txt += '<tr><td>Comment</td><td>' + metadataComment + '</td></tr>';
  }

  txt += '</table>';

  $('#myMusicMetadata').html(txt);
}


/* Select Current Track
============================================================================================= */
function SelectCurrentTrack() {
  $('.videoTrack').removeClass(vpColorClass);
  if ((currentVideoTrack === null) || (currentVideoTrack > totalVideos - 1)) {
    currentVideoTrack = player.currentVideoTrack < totalVideos ? player.currentVideoTrack: 0;
  }
  selectedItem = currentVideoTrack;
  currentVideoTrack = null;
  if (player.resumePlay && framework.getCurrentApp() === '_videoplayer') {
    myVideoStartRequest($('.videoTrack').eq(selectedItem));
  } else {
    $('.videoListContainer:eq(' + currentVideoListContainer + ')').css('display', 'none');
    currentVideoListContainer = ((selectedItem) / 8) >> 0;
    $('.videoListContainer:eq(' + currentVideoListContainer + ')').css('display', '');
    $('.videoTrack').eq(selectedItem).addClass(vpColorClass);
    myVideoListScrollUpDown('other'); // moved from 4 lines above
  }
}

/* Show memory error message
============================================================================================= */
function showMemErrorMessage(res) {
  if (framework.getCurrentApp() === '_videoplayer' && currentVideoTrack !== null && retryCountdown === null) {
    const failedToPlay = res.indexOf('try to play failed') !== -1;
    let sec = 9;
    $('.VPControlOverlay ul').hide();
    $('#myVideoName').css({'font-size': '16px', 'padding': '2px'}).html('Memory Error.- ' + res);
    $('.VPControlOverlay').append('<div id="memErrorMessage" class="memErrorMessage"><b>***************&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VIDEO PLAYER ERROR.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;***************</b><br>' + (failedToPlay ? 'VIDEO PLAYER FAILED TO START... <br>' : 'MEMORY ERROR: ' + res.substring(res.indexOf('[ERR]')) + '<br>PLAYER WILL RETRY PLAYING VIDEO IN <span class="countdown-sec">10</span> SECONDS<br>TO AVOID THIS ERROR REMOVE NAV SD CARD BEFORE PLAYING VIDEOS.<br><br>IF ERRORS CONTINUE ') + 'TAP THIS MESSAGE TO REBOOT<br><br>BEST VIDEO FORMAT TO MINIMIZE MEMORY ERRORS: <br><div style="font-size:30px;font-weight:bold;">MP4 H264 AAC 360P</div><br><ul></ul></div>');
    if (!failedToPlay) {
      if (retryAttempts < 3) {
        retryCountdown = setInterval(function() {
          if (sec < 0) {
            clearInterval(retryCountdown);
            retryCountdown = null;
            retryAttempts++;
            if (framework.getCurrentApp() === '_videoplayer' && currentVideoTrack !== null && !CurrentVideoPlayTime) {
              myVideoStartRequest($('.videoTrack').eq(selectedItem));
            }
            $('.memErrorMessage').remove();
          } else {
            $('.countdown-sec').text(sec);
          }
          sec--;
        }, 1000);
      } else {
        retryAttempts = 1;
        $('.countdown-sec').text('0');
        myVideoStopRequest();
        clearInterval(retryCountdown);
      }
    }
    $('.memErrorMessage').click(function() {
      $('.memErrorMessage').html('<div style=\'font-size:40px\'>REBOOTING</div>');
      myRebootSystem();
    });
  }
}


/* Control Playback
============================================================================================= */
function startPlayTimeInterval() {
  intervalPlaytime = setInterval(function() {
    if (!VideoPaused) {
      CurrentVideoPlayTime++;
      try {
        wsVideo.send('h');
      } catch (e) {}
    }
  }, 1000);
}

/* Stop and close the video frame
============================================================================================= */
function CloseVideoFrame() {
  if (waitingForClose) {
    waitingForClose = false;
    myVideoStopRequest();
    clearInterval(intervalVideoPlayer);
    clearInterval(intervalPlaytime);
    clearInterval(retryCountdown);
  }
}

/* Unmount Swapfile
============================================================================================= */
/* function unmountSwap() {
  //let unmount = 'swapoff -a';
  let unmount = 'export XDG_RUNTIME_DIR=/tmp/root; ' +
    'USBDRV="$(ls /mnt | grep sd)"; ' +
    'for USB in ${USBDRV}; ' +
    'do ' +
    'USBPATH=/tmp/mnt/${USB}; ' +
    'SWAPFILE="${USBPATH}"/swapfile; ' +
    'if [ -e "${SWAPFILE}" ]; ' +
    'then ' +
    'mount -o rw,remount ${USBPATH}; ' +
    '/jci/tools/jci-dialog --info --title="VIDEO PLAYER" --text="UNMOUNTING SWAPFILE... " --no-cancel & ' +
    'swapoff ${SWAPFILE}; ' +
    'break; ' +
    'fi; ' +
    'done; ' +
    'sleep 5 && killall -q jci-dialog; ' +
    '/jci/tools/jci-dialog --info --title="VIDEO PLAYER" --text="SWAPFILE UNMOUNTED!... " --no-cancel & ' +
    'sleep 5 && killall -q jci-dialog ';
  myVideoWs(unmount, false);
}*/

/* mount/unmount swapfile
==================================================================================*/
function mountSwap() {
  myVideoWs('sh /jci/gui/apps/_videoplayer/sh/resource_swap.sh 2>&1', false);
}

function unmountSwap() {
  myVideoWs('sh /jci/gui/apps/_videoplayer/sh/resource_swap.sh unmount 2>&1', false);
}
/* ==================================================================================*/

/* function to handle the commander
============================================================================================= */
function handleCommander(eventID) {
  switch (eventID) {
    case 'down':
      if (optionsPanelOpen) {
        $('#myVideoInfoClose').click();
        SelectCurrentTrack();
      } else if (currentVideoTrack === null) {
        if ((currentVideoListContainer + 1) < totalVideoListContainer) {
          $('#myVideoScrollDown').click();
          $('.playbackOption').css('background-image', function(i, val) {return val.substring(0, val.indexOf(')') + 1);});
          $('.videoTrack').removeClass(vpColorClass);
          selectedItem += 8;
          if (selectedItem >= totalVideos) {
            selectedItem = totalVideos - 1;
          }
          $('.videoTrack').eq(selectedItem).addClass(vpColorClass);
        } else if ((currentVideoListContainer + 1) === totalVideoListContainer) {
          $('.videoTrack').removeClass(vpColorClass);
          selectedItem = totalVideos - 1;
          $('.videoTrack').eq(selectedItem).addClass(vpColorClass);
        }
      } else {
        $('#' + clickFnPlyDn).click();
      }
      break;

    case 'up':
      if (optionsPanelOpen) {
        $('#myVideoInfoClose').click();
        SelectCurrentTrack();
      } else if (currentVideoTrack === null) {
        if (currentVideoListContainer > 0) {
          $('#myVideoScrollUp').click();
          $('.playbackOption').css('background-image', function(i, val) {return val.substring(0, val.indexOf(')') + 1);});
          $('.videoTrack').removeClass(vpColorClass);
          selectedItem -= 8;
          $('.videoTrack').eq(selectedItem).addClass(vpColorClass);
        } else if (currentVideoListContainer === 0) {
          $('.videoTrack').removeClass(vpColorClass);
          selectedItem = 0;
          $('.videoTrack').eq(selectedItem).addClass(vpColorClass);
        }
      } else {
        $('#' + clickFnPlyUp).click();
      }
      break;

    case 'ccw':
      if (optionsPanelOpen) {
        $('#colorThemes a').css({'background': ''});
        $('.panelOptions a').removeClass(vpColorClass);
        (selectedItem < 0) ? selectedItem = $('.panelOptions a').length - 1: selectedItem--;
        $('.panelOptions a').eq(selectedItem).addClass(vpColorClass);
      } else if (currentVideoTrack !== null) {
        $('#myVideoRW').click();
      } else {
        $('.playbackOption').css('background-image', function(i, val) {return val.substring(0, val.indexOf(')') + 1);});
        if (selectedItem > 0) {
          $('.videoTrack').removeClass(vpColorClass);
          if ((selectedItem % 8) === 0) {
            $('#myVideoScrollUp').click();
          }
          selectedItem--;
          $('.videoTrack').eq(selectedItem).addClass(vpColorClass);
        } else { // if (selectedItem < 0)
          $('.videoTrack').removeClass(vpColorClass);
          selectedItem = totalVideos - 1;
          myVideoListScrollUpDown('bottom');
          $('.videoTrack').eq(selectedItem).addClass(vpColorClass);
        }
      }
      break;

    case 'cw':
      if (optionsPanelOpen) {
        $('#colorThemes a').css({'background': ''});
        $('.panelOptions a').removeClass(vpColorClass);
        (selectedItem >= $('.panelOptions a').length) ? selectedItem = 0: selectedItem++;
        $('.panelOptions a').eq(selectedItem).addClass(vpColorClass);
      } else if (currentVideoTrack !== null) {
        $('#myVideoFF').click();
      } else {
        $('.playbackOption').css('background-image', function(i, val) {return val.substring(0, val.indexOf(')') + 1);});
        if (selectedItem < totalVideos - 1) {
          $('.videoTrack').removeClass(vpColorClass);
          selectedItem++;
          $('.videoTrack').eq(selectedItem).addClass(vpColorClass);
          if ((selectedItem > 0) && ((selectedItem % 8) === 0)) {
            $('#myVideoScrollDown').click();
          }
        } else { // if (selectedItem >= totalVideos)
          $('.videoTrack').removeClass(vpColorClass);
          selectedItem = 0;
          myVideoListScrollUpDown('top');
          $('.videoTrack').eq(selectedItem).addClass(vpColorClass);
        }
      }
      break;

    case 'left':
      if (currentVideoTrack !== null) {
        $('#myVideoPreviousBtn').click();
      } else if (optionsPanelOpen) {
        $('#popInfoTab').click();
      } else {
        $('.videoTrack').removeClass(vpColorClass);
        $('.playbackOption').css('background-image', function(i, val) {return val.substring(0, val.indexOf(')') + 1);});
        selectedOptionItem++;
        if (selectedOptionItem >= $('.playbackOption').length) {
          selectedOptionItem = 0;
        }
        $('.playbackOption').eq(selectedOptionItem).css('background-image', function(i, val) {return val + ', -o-linear-gradient(top,' + vphColor + ', rgba(0,0,0,0))';});
      }
      break;

    case 'select':
      if (currentVideoTrack !== null) {
        $('#' + clickFnPlySel).click();
      } else if (optionsPanelOpen) {
        $('.videoTrack').removeClass(vpColorClass);
        $('.panelOptions .' + vpColorClass).click();
      } else {
        if ($('.videoTrack').eq(selectedItem).hasClass(vpColorClass)) {
          myVideoStartRequest($('.videoTrack').eq(selectedItem));
        } else {
          $('.playbackOption').eq(selectedOptionItem).click();
          $('.playbackOption').eq(selectedOptionItem).css('background-image', function(i, val) {return val + ', -o-linear-gradient(top, rgba(0,0,0,0),' + vphColor + ')';});
        }
      }
      break;

    case 'right':
      if (currentVideoTrack !== null) {
        $('#myVideoNextBtn').click();
      } else if (optionsPanelOpen) {
        $('#popOptionsTab').click();
      } else {
        $('.videoTrack').removeClass(vpColorClass);
        $('.playbackOption').css('background-image', function(i, val) {return val.substring(0, val.indexOf(')') + 1);});
        selectedOptionItem--;
        if (selectedOptionItem < 0) {
          selectedOptionItem = $('.playbackOption').length - 1;
        }
        $('.playbackOption').eq(selectedOptionItem).css('background-image', function(i, val) {return val + ', -o-linear-gradient(top,' + vphColor + ', rgba(0,0,0,0))';});
      }
      break;

    default:
      return 'ignored';
  }
  return 'consumed';
}


/* Multicontroller 'Long Hold' actions
============================================================================================= */
export const handleHoldCommander = (eventID) => {
  // by default all long holds will do the same as the short click
  eventID = eventID.replace('Start', '');
  // Video is Playing
  if (currentVideoTrack !== null) {
    switch (eventID) {
      case 'select': // default:Toggle Repeat
        holdFnPlySel ? $('#' + holdFnPlySel).click() : handleCommander(eventID);
        break;
      case 'up': // default: 'optionStatusbarTitle' Toggle Media title
        holdFnPlyUp ? $('#' + holdFnPlyUp).click() : handleCommander(eventID);
        break;
      case 'down': // default: 'myVideoShuffleBtn'  Playing: Toggle Shuffle
        holdFnPlyDn ? $('#' + holdFnPlyDn).click() : handleCommander(eventID);
        break;
      case 'left': // default: 'toggleBgBtn'  Playing: Toggle VideoPlayer background (*Not* the BlackOut Overlay)
        holdFnPlyLt ? $('#' + holdFnPlyLt).click() : handleCommander(eventID);
        break;
      case 'right': // default: 'optionBlackOut'  Playing: Toggle BlackOut Overlay
        holdFnPlyRt ? $('#' + holdFnPlyRt).click() : handleCommander(eventID);
        break;
      default:
        handleCommander(eventID);
    }
  } else {
    // Video is NOT playing
    switch (eventID) {
      case 'select': // default: holdFn1
        // Not Playing: SelectCurrentTrack
        SelectCurrentTrack();
        break;
      case 'up': // Open/Close Options panel
        $('#myVideoInfo').click();
        $('#popInfoTab').click();
        break;
      case 'down': // Open/Close Info panel
        $('#myVideoInfo').click();
        $('#popOptionsTab').click();
        break;
      case 'left': // Play previous video
        myVideoPreviousRequest();
        break;
      case 'right': // Play next video
        myVideoNextRequest();
        break;
      default:
        handleCommander(eventID);
    }
    return 'consumed';
  }
};

/* websocket
============================================================================================= */
function myVideoWs(action, waitMessage) {
  let ws = new WebSocket('ws://127.0.0.1:9998/');

  ws.onmessage = function(event) {
    let res = event.data.trim();

    if (res.indexOf('Swap') !== -1) {
      $('#unmountMsg').append(res + '<br>');
    }
    if (ws !== null) {
      ws.close();
      ws = null;
    }

    if (res.indexOf('playback-list') !== -1) {
      res = event.data.split('//#');
      myVideoListResponse(res[1]);
    } else if (res.indexOf('VP_SWAP') !== -1) {
      $('#unmountSwapVP').show();
      mountSwap();
      // start unmount swapfile function
      // if (!vpWaitingForShutdown) {
      //   videoPlayerShutdown();
      // }
    } else if (res.indexOf('VP_NOSWAP') !== -1) {
      $('.vpUnmnt').remove();
    }
  };

  ws.onopen = function() {
    ws.send(action);
    if (!waitMessage) {
      ws.close();
      ws = null;
    }
  };
}

/* function videoPlayerShutdown() {
  vpWaitingForShutdown = setInterval(function() {
    if (framework.getCurrCtxtId() === 'WaitForEnding' || framework.getCurrCtxtId() === 'PowerDownAnimation') {
      clearInterval(vpWaitingForShutdown);
      vpWaitingForShutdown = null;
      console.log(framework.getCurrCtxtId() + ": unmountSwap")
      //unmountSwap();
    }
  }, 100);
}*/
// #############################################################################################
// End of Video Player
