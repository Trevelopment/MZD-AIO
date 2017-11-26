function applyTweaks(){
  var head = document.querySelector("head");
  var body = document.getElementsByTagName("body")[0];
  if (!window.jQuery) {
    utility.loadScript("addon-common/jquery.min.js");
  }
  var tweaks = localStorage.aiotweaks;
  if(tweaks && tweaks.length > 0) {
    var AIOcss = document.createElement("link");
    AIOcss.href = "apps/_aiotweaks/css/_aiotweaksApp.css";
    AIOcss.rel = "stylesheet";
    AIOcss.type = "text/css";
    body.insertBefore(AIOcss, body.firstChild);
    var savedTweaks = JSON.parse(tweaks) || "";
    body.className = savedTweaks;
  }
}

applyTweaks();
