const additionalAppsConfig = '/jci/opera/opera_dir/userjs/additionalApps.json';
additionalApps = [];

// load additional app definitions from from
getJSON('file://localhost' + additionalAppsConfig, function(data) {
  additionalApps = JSON.parse(data);
}, function(status) {
  framework.log.error('Unable to load additionalApps from ' + additionalAppsConfig);
});

function getJSON(url, successHandler, errorHandler) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.timeout = 30000;
  xhr.onload = function() {
    const status = xhr.status;
    if (status == 0) {
      successHandler && successHandler(xhr.response);
    } else {
      errorHandler && errorHandler(status);
    }
  };
  xhr.onerror = function() {
    // const status = xhr.status;
  };
  xhr.send();
}
