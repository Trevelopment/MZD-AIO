/* jshint esversion:6, -W117 */
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
window.saveAs = window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs;

export const saveCanvas = (canvas, filename, fileformat) => {
  if (navigator.msSaveBlob || window.URL || window.saveAs) {
    if (canvas.toBlob) {
      canvas.toBlob(function(blob) {
        saveBlob(blob, filename);
      }, fileformat);
    } else {
      saveBlob(dataURLToBlob(canvas.toDataURL(fileformat)), filename);
    }
  } else {
    saveUrl(canvas.toDataURL(fileformat), filename);
  }
};

function dataURLToBlob(dataURL: string) {
  const index = dataURL.indexOf(',');
  const meta = dataURL.substring(0, index);
  let data = dataURL.substring(index + 1);
  let contentType = meta.substring(meta.indexOf(':') + 1);

  if (/;base64$/.test(contentType)) {
    contentType = contentType.substring(0, contentType.length - 7);
    const strdata = atob(data);

    data = new Uint8Array(strdata.length);

    for (let i = 0; i < strdata.length; ++i) {
      data[i] = strdata.charCodeAt(i);
    }
  } else {
    data = decodeURIComponent(data);
  }

  return new Blob([data], {type: contentType});
}

function saveBlob(blob, filename: string) {
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else if (window.saveAs) {
    window.saveAs(blob, filename);
  } else {
    const url = window.URL.createObjectURL(blob);

    saveUrl(url, filename);

    setTimeout(function() {
      window.URL.revokeObjectURL(url);
    }, 250);
  }
}

function saveUrl(url: string, filename: string) {
  const link = document.createElement('a');
  if ('download' in link) {
    link.download = filename;
    link.href = url;
    link.style.position = 'absolute';
    link.style.left = '0';
    link.style.top = '0';
    // some browsers need it to be in the document
    document.body.appendChild(link);
    link.click();
    setTimeout(function() {
      document.body.removeChild(link);
    }, 250);
  } else {
    // async callback -> window.open() will fail
    window.location = url;
  }
}
