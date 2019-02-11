/* jshint esversion:6, -W117 */
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL
window.saveAs = window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs

function saveCanvas (canvas, filename, fileformat) {
  if (navigator.msSaveBlob || window.URL || window.saveAs) {
    if (canvas.toBlob) {
      canvas.toBlob(function (blob) {
        saveBlob(blob, filename)
      }, fileformat)
    } else {
      saveBlob(dataURLToBlob(canvas.toDataURL(fileformat)), filename)
    }
  } else {
    saveUrl(canvas.toDataURL(fileformat), filename)
  }
}

function dataURLToBlob (dataURL) {
  var index = dataURL.indexOf(',')
  var meta = dataURL.substring(0, index)
  var data = dataURL.substring(index + 1)
  var contentType = meta.substring(meta.indexOf(':') + 1)

  if (/;base64$/.test(contentType)) {
    contentType = contentType.substring(0, contentType.length - 7)
    var strdata = atob(data)

    data = new Uint8Array(strdata.length)

    for (var i = 0; i < strdata.length; ++i) {
      data[i] = strdata.charCodeAt(i)
    }
  } else {
    data = decodeURIComponent(data)
  }

  return new Blob([data], { type: contentType })
}

function saveBlob (blob, filename) {
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename)
  } else if (window.saveAs) {
    window.saveAs(blob, filename)
  } else {
    var url = window.URL.createObjectURL(blob)

    saveUrl(url, filename)

    setTimeout(function () {
      window.URL.revokeObjectURL(url)
    }, 250)
  }
}

function saveUrl (url, filename) {
  var link = document.createElement('a')
  if ('download' in link) {
    link.download = filename
    link.href = url
    link.style.position = 'absolute'
    link.style.left = '0'
    link.style.top = '0'
    // some browsers need it to be in the document
    document.body.appendChild(link)
    link.click()
    setTimeout(function () {
      document.body.removeChild(link)
    }, 250)
  } else {
    // async callback -> window.open() will fail
    window.location = url
  }
}
