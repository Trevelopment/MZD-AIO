function applyTweaks(){
  var body = document.getElementsByTagName('body')[0];
  var head = document.querySelector("head");
  if(!document.getElementById("jquery-script") && !document.getElementById("jquery1-script"))
  {
    var JQscript = document.createElement("script");
    JQscript.setAttribute("id", "jquery-script");
    JQscript.setAttribute("src", "addon-common/jquery.min.js");
    body.appendChild(JQscript);
  }
  var savedTweaks = JSON.parse(localStorage.getItem('aiotweaks'));
  if(savedTweaks !== null)
  {
    if (!document.getElementById('aiocss'))
    {
      var link  = document.createElement('link');
      link.id   = 'aiocss';
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = '/jci/gui/apps/_aiotweaks/css/_aiotweaksApp.css';
      link.media = 'all';
      head.appendChild(link);
    }
    body.className = savedTweaks;
  }
}

(function (){
  window.opera.addEventListener("AfterEvent.load", function (e){
    setTimeout(applyTweaks, 5000);
  });
})();
