// Open all external links *with class="link"* outside the app
// Credit: Electron API Demos app
const links = document.querySelectorAll('a.link')

Array.prototype.forEach.call(links, function (link) {
  const url = link.getAttribute('href')
  if (url.indexOf('http') === 0) {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      shell.openExternal(url)
    })
  }
})
