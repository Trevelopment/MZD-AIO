const videoPlayer = document.getElementById('videoPlayer');
const vidlinks = videoPlayer.getElementsByTagName('a');
for (let i = 0; i < vidlinks.length; i++) {
  vidlinks[i].onclick = vidhandler;
}

function vidhandler(e) {
  e.preventDefault();
  const videotarget = this.getAttribute('href');
  const filename = videotarget.substr(0, videotarget.lastIndexOf('.')) || videotarget;
  const video = document.querySelector('#videoPlayer video');
  if (this.hasAttribute('loop')) {video.setAttribute('loop', true);} else {video.removeAttribute('loop');}
  video.removeAttribute('poster');
  const source = document.querySelectorAll('#videoPlayer video source');
  source[0].src = filename + '.webm';
  video.load();
  video.play();
}
