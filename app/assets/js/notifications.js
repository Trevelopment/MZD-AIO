// Display a notification message when a new version is ready for install
ipc.on('update-available-alert', (event) => {
  $('#update-available, #update-available a').removeClass('w3-hide')
  var updots = 0
  var dll = setInterval(function () {
	if (updots !== 5) { $('#update-available a').append('.'); updots++ }
	else{ $('#update-available').html('<a>Update Downloading.</a>'); updots=0 }
  }, 2000)
})
ipc.on('update-downloaded', (event) => {
  snackbarstay(`<span id="restart">An Update Is Available:  <a href="" class="w3-btn w3-deep-purple w3-hover-light-blue">UPDATE</a></span>`)
  $('#update-available').text('Update Available')
  setTimeout(function () { document.getElementById('update-ready').className = '' }, 7500)
  // showNotification('Update', 'An updated application package will be installed on next restart, <a id="restart" href="">click here to update now</a>.', 30, function () { ipc.send('update-and-restart') })
  document.getElementById('restart').addEventListener('click', (e) => {
    e.preventDefault()
    ipc.send('update-and-restart')
  })
})
ipc.on('dl-progress', (event, megaBytes, fileName, totalSize) => {
  if ((megaBytes / totalSize) < 1) {
    if ($('#progress').length) {
      //document.getElementById('progress').innerHTML = '<div class="w3-progress-container"><div id="progBar" class="w3-progressbar w3-green" style="width:' + parseInt((megaBytes / totalSize) * 100) + '%"><span class="w3-center w3-text-black color-progress">' + megaBytes.toFixed(2) + 'MB | ' + parseInt((megaBytes / totalSize) * 100) + '%</span></div>'
    } else {
      showNotification('Downloading Please wait <img src="./files/img/load-1.gif" alt="...">', `<div id="dl-notif"><h5>Downloading ${fileName}: </h5><span id="progress"></span></div>`, 0)
    }
  } else {
    document.getElementById('progress').innerHTML = `${fileName} Download Complete.`
    snackbar(`${fileName} Download Complete.`)
    $('#progress').parent().fadeOut('1000')
  }
})
ipc.on('notif-progress', (event, message) => {
  if ($('#progress').length) {
    document.getElementById('dl-notif').innerHTML = message
    $('#dl-notif').parent().hide(1000)
    snackbar(message)
  } else {
    showNotification('Download', `<div id="dl-notif">${message}</div>`, 10)
  }
})
ipc.on('notif-bg-saved', (event, message) => {
  showNotification('Background', `<div id="dl-notif">${message}</div>`, 10)
})
function showNotification (title, message, fadeouttime, callback) {
  $('#notices').show()
  var notice = document.createElement('div')
  notice.setAttribute('class', 'notice')
  notice.innerHTML = `<span class="w3-closebtn w3-display-topright" onclick="$(this).parent().hide((${fadeouttime}+1)*1000)">&times;</span><div class="w3-hover-text-indigo">${message}</div>`
  document.getElementById('notices').appendChild(notice)
  if (fadeouttime !== 0) {
    setTimeout(function () {
      $('#notices *').fadeOut(fadeouttime * 1000)
    }, 3000)
  }
  // document.body.appendChild(notice)
  var nohtml = message ? String(message).replace(/<[^>]+>/gm, '') : ''
  snackbar(`<img src='icon.ico' onerror='$(this).hide()'> ${nohtml}`)
  let myNotification = new Notification(title, {
    body: nohtml,
    icon: 'icon.ico',
    silent: true
  })
  if (callback) {
    myNotification.onclick = () => {
      callback()
    }
  } else {
    myNotification.onclick = () => {
      remote.BrowserWindow.getChildWindows().close()
      remote.BrowserWindow.fromId(1).focus()
      console.log('Notification clicked: ' + myNotification.timestamp)
    }
  }
}
ipc.on('snackbar-msg', (event, message) => {
  snackbar(message)
})
function snackbar (message) {
  $('#snackbar').append('body')
  var x = document.getElementById('snackbar')
  x.innerHTML = message
  x.className = 'show w3-card-12'
  setTimeout(function () { x.className = x.className.replace('show', '') }, 9500)
}
function snackbarstay (message) {
  $('#snackbar').append('body')
  var x = document.getElementById('snackbar')
  x.innerHTML = message + '<div onclick="$(this).parent().removeClass(\'stay\')" class="w3-xxlarge w3-display-topright w3-close-btn w3-hover-text-red" style="margin-top:-15px;cursor:pointer;">&times;</div>'
  x.className = 'stay w3-card-12'
}
