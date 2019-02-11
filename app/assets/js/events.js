/* jshint esversion:6, -W033, -W117, -W097, -W116 */
/* Automatically Open Background Dialog, Color DL and Speedcam DL On First Checkbox Click Only */
const selectBgDir = $('.menuCheck.bg input')
const selectColorsDL = $('.menuCheck.colors input')
$(function () {
  /* Attempt to download color scheme files if they don't exist */
  selectColorsDL.on('click', function () {
    if (selectColorsDL.hasClass('ng-pristine') && !hasColorFiles) {
      bootbox.confirm({
        title: 'The Color Scheme Tweak Requires Additional Files.',
        message: 'Download Color Scheme Files?',
        buttons: {
          confirm: {
            label: 'Download'
          },
          cancel: {
            label: 'Cancel'
          }
        },
        callback: function (result) {
          if (result) {
            ipc.send('download-aio-files', 'color-schemes.zip')
          } else {
            angular.element(selectColorsDL).scope().checked = false
            window.alert('You Must Download Color Files To Apply Color Scheme Tweak')
          }
        }
      })
    }
  })
  /* Attempt to download speedcam patch files if they don't exist */
  angular.element($('.install-check input#IN23')).on('click', function () {
    if ($('.install-check input#IN23, .uninstall-check input#UN23').hasClass('ng-pristine') && !hasSpeedCamFiles) {
      bootbox.confirm({
        title: 'The Color Scheme Tweak Requires Additional Files.',
        message: 'Download Speedcam Patch Files?',
        buttons: {
          confirm: {
            label: 'Download'
          },
          cancel: {
            label: 'Cancel'
          }
        },
        callback: function (result) {
          if (result) {
            ipc.send('download-aio-files', 'speedcam-patch.zip')
          } else {
            angular.element($('.install-check input#IN23')).scope().checked = false
            window.alert('You Must Download Speedcam Patch Files To Apply Speedcam Tweak')
          }
        }
      })
    }
  })
})
ipc.on('already-downloaded', function (event, filename) {
  bootbox.confirm({
    message: 'You have already downloaded these files! Would you like to redownload and overwrite files?',
    buttons: {
      cancel: {
        label: 'No - Use The Files I already Have',
        className: 'btn-success'
      },
      confirm: {
        label: 'Yes - Redownload Files',
        className: 'btn-danger'
      }
    },
    callback: function (result) {
      if (result) {
        ipc.send('resume-dl')
      } else {
        ipc.send('cancel-dl')
      }
    }
  })
})
ipc.on('selected-joined-bg', function (event, filepath) {
  var outFile = `${getBackground}`
  clipboard.writeImage(filepath[0])
  joinedPhoto(filepath[0])
  let bgNotification = new Notification('Background', {
    body: `Your Infotainment Background Will Be Changed To: ${filepath}`,
    icon: 'favicon.ico',
    silent: true
  })
  bgNotification.onclick = () => {}
})
ipc.on('selected-bg', function (event, filepath) {
  var outFile = `${getBackground}`
  document.getElementById('selected-file').innerHTML = `Your Selected Background Image: ${filepath}`
  var warnMsg = '{{mainOps.retain.toolTip}}'
  fs.writeFileSync(`${outFile}`, nativeImage.createFromPath(`${filepath}`).resize({ 'width': 800, 'height': 480 }).toPNG())
  let bgNotification = new Notification('Background', {
    body: `Your Infotainment Background Will Be Changed To: ${filepath}`,
    icon: 'favicon.ico',
    silent: true
  })
  bgNotification.onclick = () => {
    $('#imgframe').click()
  }
  ipc.emit('set-bg')
})
ipc.on('selected-offscreen-bg', function (event, filepath) {
  var outFile = `${varDir}/OffScreenBackground.png`
  fs.writeFileSync(`${outFile}`, nativeImage.createFromPath(`${filepath}`).resize({ 'width': 800, 'height': 480 }).toPNG())
  let bgNotification = new Notification('Background', {
    body: `Your Off Screen Background Will Be Changed To: ${filepath}`,
    icon: 'favicon.ico',
    silent: true
  })
  bgNotification.onclick = () => {}
})
ipc.on('set-bg', (prev) => {
  var bgNoCache = `${getBackground}?` + new Date().getTime()
  document.getElementById('imgframe').innerHTML = `<img src='${bgNoCache}' />`
  document.getElementById('imgmodal').innerHTML = `<img src='${bgNoCache}' />`
  if (`${prev}` === true) {
    $('#imgframe').click()
  }
})
ipc.on('selected-album-art', function (event, filepath) {
  var outFile = `${varDir}/no_artwork_icon.png`
  $('.blnk-albm-art').hide()
  $('#blnk-albm-img').show()
  settings.set('blank-album-art', `${filepath}`)
  fs.writeFileSync(`${outFile}`, nativeImage.createFromPath(`${filepath}`).resize({ 'width': 146, 'height': 146 }).toPNG())
  setTimeout(function () {
    var bgNoCache = `${varDir}/no_artwork_icon.png?` + new Date().getTime()
    $('#blnk-albm-img').html(`<img src="${bgNoCache}">`)
  }, 2000)
})
ipc.on('aio-info', function (event) {
  $('#FW_VER').attr('data-content', `FW_VERSION: ${persistantData.get('FW')}`)
  $('#FW_VER').show()
})
ipc.on('close-featherlight', function (event) {
  $.featherlight.current().close()
})
ipc.on('open-translator', function () {
  remote.BrowserWindow.fromId(1).focus()
  $('#openTranslator').click()
})
ipc.on('go-home', function () {
  remote.BrowserWindow.fromId(1).focus()
  $('#goHome').click()
})
/*
$(function(){
/* Drag & Drop Functionality * /
const holder = document.getElementById('dropimg')
//const qholder = $('#dropimg > .w3-center')
var backgrounds = []
holder.ondragover = (e) => {
holder.innerHTML = '<h1 style="color:red">DROP!</h1>' + e.dataTransfer.files.path
return false
}
holder.ondragleave = holder.ondragend = (e) => {
for (let f of e.dataTransfer.files) {
console.log('File(s) you dragged here: ', f.path)
backgrounds.push(f.path)
}
console.log(backgrounds)
return false
}
holder.ondrop = (e) => {
e.preventDefault()
for (let f of e.dataTransfer.files) {
console.log('File(s) you dragged here: ', f.path)
backgrounds.push(f.path)
}
console.log(backgrounds)
return false
}
})

*/
