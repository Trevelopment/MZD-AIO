/* jshint esversion:6, -W117 */
// Open all external links *with class="link"* outside the app
// Credit: Electron API Demos app
var links = document.querySelectorAll('a.link')

Array.prototype.forEach.call(links, function (link) {
  var url = link.getAttribute('href')
  if (url.indexOf('http') === 0) {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      shell.openExternal(url)
    })
  }
})
