let YT: any;
let YTConfig: any;
if (!window['YT']) {
  YT = {loading: 0, loaded: 0};
}
if (!window['YTConfig']) {
  YTConfig = {'host': 'http://www.youtube.com'};
}
if (!YT.loading) {
  YT.loading = 1;
  (function() {
    const l = [];
    YT.ready = function(f) {if (YT.loaded) {f();} else {l.push(f);}};
    window.onYTReady = function() {YT.loaded = 1; for (let i = 0; i < l.length; i++) {try {l[i]();} catch (e) {}}};
    YT.setConfig = function(c) {for (const k in c) {if (c.hasOwnProperty(k)) {YTConfig[k] = c[k];}}};
    const a = document.createElement('script');
    a.type = 'text/javascript';
    a.id = 'www-widgetapi-script';
    a.src = 'https://s.ytimg.com/yts/jsbin/www-widgetapi-vflQSvpsZ/www-widgetapi.js';
    a.async = true;
    const c = document.currentScript;
    if (c) {const n = c.nonce || c.getAttribute('nonce'); if (n) {a.setAttribute('nonce', n);}}
    const b = document.getElementsByTagName('script')[0];
    b.parentNode.insertBefore(a, b);
  })();
}
