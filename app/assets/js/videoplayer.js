var videoPlayer = document.getElementById('videoPlayer')
var vidlinks = videoPlayer.getElementsByTagName('a')
for (var i = 0; i < vidlinks.length; i++) {
  vidlinks[i].onclick = vidhandler
}

function vidhandler(e) {
  e.preventDefault()
  var videotarget = this.getAttribute('href')
  var filename = videotarget.substr(0, videotarget.lastIndexOf('.')) || videotarget
  var video = document.querySelector('#videoPlayer video')
  if (this.hasAttribute('loop')) { video.setAttribute('loop', true) } else { video.removeAttribute('loop') }
  video.removeAttribute('poster')
  var source = document.querySelectorAll('#videoPlayer video source')
  source[0].src = filename + '.webm'
  video.load()
  video.play()
}
