// try not to make changes to the lines below

var tripDistCurrent = 0;
var prevTripDist = 0;
var tripDistBkp = 0;
var tripDist = 0;
var speedCurrent = 0;
var speedSumTotal = 0;
var speedTop = 0;
var speedAvg = 0;
var GPSspeedCurrent = 0;
var GPSaltCurrent = 0;
var FuelEfficiency = 0;
var TotFuelEfficiency = 0;
var idleTimeValue = '0:00';
var engONidleTimeValue = '0:00';
var lastGPSheadingValue = 999;
var GPSlatCurrent = 0;
var GPSlonCurrent = 0;
var altGPSmin = 9999;
var altGPSmax = -9999;
var totalTripSeconds = 0;
var totalIdleSeconds = 0;
var totalEngineOnSeconds = 0;
var totalMoveCount = 0;
var direction = "---";
var engineSpeedCurrent = 0;
var engineSpeedTop = 0;

// Credits for JS font: http://www.cufonfonts.com/ &  https://github.com/serezhka/mzd_speedometer
var Cufon=(function(){var m=function(){return m.replace.apply(null,arguments)};var x=m.DOM={ready:(function(){var C=false,E={loaded:1,complete:1};var B=[],D=function(){if(C){return}C=true;for(var F;F=B.shift();F()){}};if(document.addEventListener){document.addEventListener("DOMContentLoaded",D,false);window.addEventListener("pageshow",D,false)}if(!window.opera&&document.readyState){(function(){E[document.readyState]?D():setTimeout(arguments.callee,10)})()}if(document.readyState&&document.createStyleSheet){(function(){try{document.body.doScroll("left");D()}catch(F){setTimeout(arguments.callee,1)}})()}q(window,"load",D);return function(F){if(!arguments.length){D()}else{C?F():B.push(F)}}})(),root:function(){return document.documentElement||document.body}};var n=m.CSS={Size:function(C,B){this.value=parseFloat(C);this.unit=String(C).match(/[a-z%]*$/)[0]||"px";this.convert=function(D){return D/B*this.value};this.convertFrom=function(D){return D/this.value*B};this.toString=function(){return this.value+this.unit}},addClass:function(C,B){var D=C.className;C.className=D+(D&&" ")+B;return C},color:j(function(C){var B={};B.color=C.replace(/^rgba\((.*?),\s*([\d.]+)\)/,function(E,D,F){B.opacity=parseFloat(F);return"rgb("+D+")"});return B}),fontStretch:j(function(B){if(typeof B=="number"){return B}if(/%$/.test(B)){return parseFloat(B)/100}return{"ultra-condensed":0.5,"extra-condensed":0.625,condensed:0.75,"semi-condensed":0.875,"semi-expanded":1.125,expanded:1.25,"extra-expanded":1.5,"ultra-expanded":2}[B]||1}),getStyle:function(C){var B=document.defaultView;if(B&&B.getComputedStyle){return new a(B.getComputedStyle(C,null))}if(C.currentStyle){return new a(C.currentStyle)}return new a(C.style)},gradient:j(function(F){var G={id:F,type:F.match(/^-([a-z]+)-gradient\(/)[1],stops:[]},C=F.substr(F.indexOf("(")).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);for(var E=0,B=C.length,D;E<B;++E){D=C[E].split("=",2).reverse();G.stops.push([D[1]||E/(B-1),D[0]])}return G}),quotedList:j(function(E){var D=[],C=/\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g,B;while(B=C.exec(E)){D.push(B[3]||B[1])}return D}),recognizesMedia:j(function(G){var E=document.createElement("style"),D,C,B;E.type="text/css";E.media=G;try{E.appendChild(document.createTextNode("/**/"))}catch(F){}C=g("head")[0];C.insertBefore(E,C.firstChild);D=(E.sheet||E.styleSheet);B=D&&!D.disabled;C.removeChild(E);return B}),removeClass:function(D,C){var B=RegExp("(?:^|\\s+)"+C+"(?=\\s|$)","g");D.className=D.className.replace(B,"");return D},supports:function(D,C){var B=document.createElement("span").style;if(B[D]===undefined){return false}B[D]=C;return B[D]===C},textAlign:function(E,D,B,C){if(D.get("textAlign")=="right"){if(B>0){E=" "+E}}else{if(B<C-1){E+=" "}}return E},textShadow:j(function(F){if(F=="none"){return null}var E=[],G={},B,C=0;var D=/(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;while(B=D.exec(F)){if(B[0]==","){E.push(G);G={};C=0}else{if(B[1]){G.color=B[1]}else{G[["offX","offY","blur"][C++]]=B[2]}}}E.push(G);return E}),textTransform:(function(){var B={uppercase:function(C){return C.toUpperCase()},lowercase:function(C){return C.toLowerCase()},capitalize:function(C){return C.replace(/\b./g,function(D){return D.toUpperCase()})}};return function(E,D){var C=B[D.get("textTransform")];return C?C(E):E}})(),whiteSpace:(function(){var D={inline:1,"inline-block":1,"run-in":1};var C=/^\s+/,B=/\s+$/;return function(H,F,G,E){if(E){if(E.nodeName.toLowerCase()=="br"){H=H.replace(C,"")}}if(D[F.get("display")]){return H}if(!G.previousSibling){H=H.replace(C,"")}if(!G.nextSibling){H=H.replace(B,"")}return H}})()};n.ready=(function(){var B=!n.recognizesMedia("all"),E=false;var D=[],H=function(){B=true;for(var K;K=D.shift();K()){}};var I=g("link"),J=g("style");function C(K){return K.disabled||G(K.sheet,K.media||"screen")}function G(M,P){if(!n.recognizesMedia(P||"all")){return true}if(!M||M.disabled){return false}try{var Q=M.cssRules,O;if(Q){search:for(var L=0,K=Q.length;O=Q[L],L<K;++L){switch(O.type){case 2:break;case 3:if(!G(O.styleSheet,O.media.mediaText)){return false}break;default:break search}}}}catch(N){}return true}function F(){if(document.createStyleSheet){return true}var L,K;for(K=0;L=I[K];++K){if(L.rel.toLowerCase()=="stylesheet"&&!C(L)){return false}}for(K=0;L=J[K];++K){if(!C(L)){return false}}return true}x.ready(function(){if(!E){E=n.getStyle(document.body).isUsable()}if(B||(E&&F())){H()}else{setTimeout(arguments.callee,10)}});return function(K){if(B){K()}else{D.push(K)}}})();function s(D){var C=this.face=D.face,B={"\u0020":1,"\u00a0":1,"\u3000":1};this.glyphs=D.glyphs;this.w=D.w;this.baseSize=parseInt(C["units-per-em"],10);this.family=C["font-family"].toLowerCase();this.weight=C["font-weight"];this.style=C["font-style"]||"normal";this.viewBox=(function(){var F=C.bbox.split(/\s+/);var E={minX:parseInt(F[0],10),minY:parseInt(F[1],10),maxX:parseInt(F[2],10),maxY:parseInt(F[3],10)};E.width=E.maxX-E.minX;E.height=E.maxY-E.minY;E.toString=function(){return[this.minX,this.minY,this.width,this.height].join(" ")};return E})();this.ascent=-parseInt(C.ascent,10);this.descent=-parseInt(C.descent,10);this.height=-this.ascent+this.descent;this.spacing=function(L,N,E){var O=this.glyphs,M,K,G,P=[],F=0,J=-1,I=-1,H;while(H=L[++J]){M=O[H]||this.missingGlyph;if(!M){continue}if(K){F-=G=K[H]||0;P[I]-=G}F+=P[++I]=~~(M.w||this.w)+N+(B[H]?E:0);K=M.k}P.total=F;return P}}function f(){var C={},B={oblique:"italic",italic:"oblique"};this.add=function(D){(C[D.style]||(C[D.style]={}))[D.weight]=D};this.get=function(H,I){var G=C[H]||C[B[H]]||C.normal||C.italic||C.oblique;if(!G){return null}I={normal:400,bold:700}[I]||parseInt(I,10);if(G[I]){return G[I]}var E={1:1,99:0}[I%100],K=[],F,D;if(E===undefined){E=I>400}if(I==500){I=400}for(var J in G){if(!k(G,J)){continue}J=parseInt(J,10);if(!F||J<F){F=J}if(!D||J>D){D=J}K.push(J)}if(I<F){I=F}if(I>D){I=D}K.sort(function(M,L){return(E?(M>=I&&L>=I)?M<L:M>L:(M<=I&&L<=I)?M>L:M<L)?-1:1});return G[K[0]]}}function r(){function D(F,G){if(F.contains){return F.contains(G)}return F.compareDocumentPosition(G)&16}function B(G){var F=G.relatedTarget;if(!F||D(this,F)){return}C(this,G.type=="mouseover")}function E(F){C(this,F.type=="mouseenter")}function C(F,G){setTimeout(function(){var H=d.get(F).options;m.replace(F,G?h(H,H.hover):H,true)},10)}this.attach=function(F){if(F.onmouseenter===undefined){q(F,"mouseover",B);q(F,"mouseout",B)}else{q(F,"mouseenter",E);q(F,"mouseleave",E)}}}function u(){var C=[],D={};function B(H){var E=[],G;for(var F=0;G=H[F];++F){E[F]=C[D[G]]}return E}this.add=function(F,E){D[F]=C.push(E)-1};this.repeat=function(){var E=arguments.length?B(arguments):C,F;for(var G=0;F=E[G++];){m.replace(F[0],F[1],true)}}}function A(){var D={},B=0;function C(E){return E.cufid||(E.cufid=++B)}this.get=function(E){var F=C(E);return D[F]||(D[F]={})}}function a(B){var D={},C={};this.extend=function(E){for(var F in E){if(k(E,F)){D[F]=E[F]}}return this};this.get=function(E){return D[E]!=undefined?D[E]:B[E]};this.getSize=function(F,E){return C[F]||(C[F]=new n.Size(this.get(F),E))};this.isUsable=function(){return!!B}}function q(C,B,D){if(C.addEventListener){C.addEventListener(B,D,false)}else{if(C.attachEvent){C.attachEvent("on"+B,function(){return D.call(C,window.event)})}}}function v(C,B){var D=d.get(C);if(D.options){return C}if(B.hover&&B.hoverables[C.nodeName.toLowerCase()]){b.attach(C)}D.options=B;return C}function j(B){var C={};return function(D){if(!k(C,D)){C[D]=B.apply(null,arguments)}return C[D]}}function c(F,E){var B=n.quotedList(E.get("fontFamily").toLowerCase()),D;for(var C=0;D=B[C];++C){if(i[D]){return i[D].get(E.get("fontStyle"),E.get("fontWeight"))}}return null}function g(B){return document.getElementsByTagName(B)}function k(C,B){return C.hasOwnProperty(B)}function h(){var C={},B,F;for(var E=0,D=arguments.length;B=arguments[E],E<D;++E){for(F in B){if(k(B,F)){C[F]=B[F]}}}return C}function o(E,M,C,N,F,D){var K=document.createDocumentFragment(),H;if(M===""){return K}var L=N.separate;var I=M.split(p[L]),B=(L=="words");if(B&&t){if(/^\s/.test(M)){I.unshift("")}if(/\s$/.test(M)){I.push("")}}for(var J=0,G=I.length;J<G;++J){H=z[N.engine](E,B?n.textAlign(I[J],C,J,G):I[J],C,N,F,D,J<G-1);if(H){K.appendChild(H)}}return K}function l(D,M){var C=D.nodeName.toLowerCase();if(M.ignore[C]){return}var E=!M.textless[C];var B=n.getStyle(v(D,M)).extend(M);var F=c(D,B),G,K,I,H,L,J;if(!F){return}for(G=D.firstChild;G;G=I){K=G.nodeType;I=G.nextSibling;if(E&&K==3){if(H){H.appendData(G.data);D.removeChild(G)}else{H=G}if(I){continue}}if(H){D.replaceChild(o(F,n.whiteSpace(H.data,B,H,J),B,M,G,D),H);H=null}if(K==1){if(G.firstChild){if(G.nodeName.toLowerCase()=="cufon"){z[M.engine](F,null,B,M,G,D)}else{arguments.callee(G,M)}}J=G}}}var t=" ".split(/\s+/).length==0;var d=new A();var b=new r();var y=new u();var e=false;var z={},i={},w={autoDetect:false,engine:null,forceHitArea:false,hover:false,hoverables:{a:true},ignore:{applet:1,canvas:1,col:1,colgroup:1,head:1,iframe:1,map:1,optgroup:1,option:1,script:1,select:1,style:1,textarea:1,title:1,pre:1},printable:true,selector:(window.Sizzle||(window.jQuery&&function(B){return jQuery(B)})||(window.dojo&&dojo.query)||(window.Ext&&Ext.query)||(window.YAHOO&&YAHOO.util&&YAHOO.util.Selector&&YAHOO.util.Selector.query)||(window.$$&&function(B){return $$(B)})||(window.$&&function(B){return $(B)})||(document.querySelectorAll&&function(B){return document.querySelectorAll(B)})||g),separate:"words",textless:{dl:1,html:1,ol:1,table:1,tbody:1,thead:1,tfoot:1,tr:1,ul:1},textShadow:"none"};var p={words:/\s/.test("\u00a0")?/[^\S\u00a0]+/:/\s+/,characters:"",none:/^/};m.now=function(){x.ready();return m};m.refresh=function(){y.repeat.apply(y,arguments);return m};m.registerEngine=function(C,B){if(!B){return m}z[C]=B;return m.set("engine",C)};m.registerFont=function(D){if(!D){return m}var B=new s(D),C=B.family;if(!i[C]){i[C]=new f()}i[C].add(B);return m.set("fontFamily",'"'+C+'"')};m.replace=function(D,C,B){C=h(w,C);if(!C.engine){return m}if(!e){n.addClass(x.root(),"cufon-active cufon-loading");n.ready(function(){n.addClass(n.removeClass(x.root(),"cufon-loading"),"cufon-ready")});e=true}if(C.hover){C.forceHitArea=true}if(C.autoDetect){delete C.fontFamily}if(typeof C.textShadow=="string"){C.textShadow=n.textShadow(C.textShadow)}if(typeof C.color=="string"&&/^-/.test(C.color)){C.textGradient=n.gradient(C.color)}else{delete C.textGradient}if(!B){y.add(D,arguments)}if(D.nodeType||typeof D=="string"){D=[D]}n.ready(function(){for(var F=0,E=D.length;F<E;++F){var G=D[F];if(typeof G=="string"){m.replace(C.selector(G),C,true)}else{l(G,C)}}});return m};m.set=function(B,C){w[B]=C;return m};return m})();Cufon.registerEngine("vml",(function(){var e=document.namespaces;if(!e){return}e.add("cvml","urn:schemas-microsoft-com:vml");e=null;var b=document.createElement("cvml:shape");b.style.behavior="url(#default#VML)";if(!b.coordsize){return}b=null;var h=(document.documentMode||0)<8;document.write(('<style type="text/css">cufoncanvas{text-indent:0;}@media screen{cvml\\:shape,cvml\\:rect,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}cufoncanvas{position:absolute;text-align:left;}cufon{display:inline-block;position:relative;vertical-align:'+(h?"middle":"text-bottom")+";}cufon cufontext{position:absolute;left:-10000in;font-size:1px;}a cufon{cursor:pointer}}@media print{cufon cufoncanvas{display:none;}}</style>").replace(/;/g,"!important;"));function c(i,j){return a(i,/(?:em|ex|%)$|^[a-z-]+$/i.test(j)?"1em":j)}function a(l,m){if(m==="0"){return 0}if(/px$/i.test(m)){return parseFloat(m)}var k=l.style.left,j=l.runtimeStyle.left;l.runtimeStyle.left=l.currentStyle.left;l.style.left=m.replace("%","em");var i=l.style.pixelLeft;l.style.left=k;l.runtimeStyle.left=j;return i}function f(l,k,j,n){var i="computed"+n,m=k[i];if(isNaN(m)){m=k.get(n);k[i]=m=(m=="normal")?0:~~j.convertFrom(a(l,m))}return m}var g={};function d(p){var q=p.id;if(!g[q]){var n=p.stops,o=document.createElement("cvml:fill"),i=[];o.type="gradient";o.angle=180;o.focus="0";o.method="sigma";o.color=n[0][1];for(var m=1,l=n.length-1;m<l;++m){i.push(n[m][0]*100+"% "+n[m][1])}o.colors=i.join(",");o.color2=n[l][1];g[q]=o}return g[q]}return function(ac,G,Y,C,K,ad,W){var n=(G===null);if(n){G=K.alt}var I=ac.viewBox;var p=Y.computedFontSize||(Y.computedFontSize=new Cufon.CSS.Size(c(ad,Y.get("fontSize"))+"px",ac.baseSize));var y,q;if(n){y=K;q=K.firstChild}else{y=document.createElement("cufon");y.className="cufon cufon-vml";y.alt=G;q=document.createElement("cufoncanvas");y.appendChild(q);if(C.printable){var Z=document.createElement("cufontext");Z.appendChild(document.createTextNode(G));y.appendChild(Z)}if(!W){y.appendChild(document.createElement("cvml:shape"))}}var ai=y.style;var R=q.style;var l=p.convert(I.height),af=Math.ceil(l);var V=af/l;var P=V*Cufon.CSS.fontStretch(Y.get("fontStretch"));var U=I.minX,T=I.minY;R.height=af;R.top=Math.round(p.convert(T-ac.ascent));R.left=Math.round(p.convert(U));ai.height=p.convert(ac.height)+"px";var F=Y.get("color");var ag=Cufon.CSS.textTransform(G,Y).split("");var L=ac.spacing(ag,f(ad,Y,p,"letterSpacing"),f(ad,Y,p,"wordSpacing"));if(!L.length){return null}var k=L.total;var x=-U+k+(I.width-L[L.length-1]);var ah=p.convert(x*P),X=Math.round(ah);var O=x+","+I.height,m;var J="r"+O+"ns";var u=C.textGradient&&d(C.textGradient);var o=ac.glyphs,S=0;var H=C.textShadow;var ab=-1,aa=0,w;while(w=ag[++ab]){var D=o[ag[ab]]||ac.missingGlyph,v;if(!D){continue}if(n){v=q.childNodes[aa];while(v.firstChild){v.removeChild(v.firstChild)}}else{v=document.createElement("cvml:shape");q.appendChild(v)}v.stroked="f";v.coordsize=O;v.coordorigin=m=(U-S)+","+T;v.path=(D.d?"m"+D.d+"xe":"")+"m"+m+J;v.fillcolor=F;if(u){v.appendChild(u.cloneNode(false))}var ae=v.style;ae.width=X;ae.height=af;if(H){var s=H[0],r=H[1];var B=Cufon.CSS.color(s.color),z;var N=document.createElement("cvml:shadow");N.on="t";N.color=B.color;N.offset=s.offX+","+s.offY;if(r){z=Cufon.CSS.color(r.color);N.type="double";N.color2=z.color;N.offset2=r.offX+","+r.offY}N.opacity=B.opacity||(z&&z.opacity)||1;v.appendChild(N)}S+=L[aa++]}var M=v.nextSibling,t,A;if(C.forceHitArea){if(!M){M=document.createElement("cvml:rect");M.stroked="f";M.className="cufon-vml-cover";t=document.createElement("cvml:fill");t.opacity=0;M.appendChild(t);q.appendChild(M)}A=M.style;A.width=X;A.height=af}else{if(M){q.removeChild(M)}}ai.width=Math.max(Math.ceil(p.convert(k*P)),0);if(h){var Q=Y.computedYAdjust;if(Q===undefined){var E=Y.get("lineHeight");if(E=="normal"){E="1em"}else{if(!isNaN(E)){E+="em"}}Y.computedYAdjust=Q=0.5*(a(ad,E)-parseFloat(ai.height))}if(Q){ai.marginTop=Math.ceil(Q)+"px";ai.marginBottom=Q+"px"}}return y}})());Cufon.registerEngine("canvas",(function(){var b=document.createElement("canvas");if(!b||!b.getContext||!b.getContext.apply){return}b=null;var a=Cufon.CSS.supports("display","inline-block");var e=!a&&(document.compatMode=="BackCompat"||/frameset|transitional/i.test(document.doctype.publicId));var f=document.createElement("style");f.type="text/css";f.appendChild(document.createTextNode(("cufon{text-indent:0;}@media screen,projection{cufon{display:inline;display:inline-block;position:relative;vertical-align:middle;"+(e?"":"font-size:1px;line-height:1px;")+"}cufon cufontext{display:inline-block;width:0;height:0;overflow:hidden;text-indent:-10000in;}"+(a?"cufon canvas{position:relative;}":"cufon canvas{position:absolute;}")+"}@media print{cufon{padding:0;}cufon canvas{display:none;}}").replace(/;/g,"!important;")));document.getElementsByTagName("head")[0].appendChild(f);function d(p,h){var n=0,m=0;var g=[],o=/([mrvxe])([^a-z]*)/g,k;generate:for(var j=0;k=o.exec(p);++j){var l=k[2].split(",");switch(k[1]){case"v":g[j]={m:"bezierCurveTo",a:[n+~~l[0],m+~~l[1],n+~~l[2],m+~~l[3],n+=~~l[4],m+=~~l[5]]};break;case"r":g[j]={m:"lineTo",a:[n+=~~l[0],m+=~~l[1]]};break;case"m":g[j]={m:"moveTo",a:[n=~~l[0],m=~~l[1]]};break;case"x":g[j]={m:"closePath"};break;case"e":break generate}h[g[j].m].apply(h,g[j].a)}return g}function c(m,k){for(var j=0,h=m.length;j<h;++j){var g=m[j];k[g.m].apply(k,g.a)}}return function(V,w,P,t,C,W){var k=(w===null);if(k){w=C.getAttribute("alt")}var A=V.viewBox;var m=P.getSize("fontSize",V.baseSize);var B=0,O=0,N=0,u=0;var z=t.textShadow,L=[];if(z){for(var U=z.length;U--;){var F=z[U];var K=m.convertFrom(parseFloat(F.offX));var I=m.convertFrom(parseFloat(F.offY));L[U]=[K,I];if(I<B){B=I}if(K>O){O=K}if(I>N){N=I}if(K<u){u=K}}}var Z=Cufon.CSS.textTransform(w,P).split("");var E=V.spacing(Z,~~m.convertFrom(parseFloat(P.get("letterSpacing"))||0),~~m.convertFrom(parseFloat(P.get("wordSpacing"))||0));if(!E.length){return null}var h=E.total;O+=A.width-E[E.length-1];u+=A.minX;var s,n;if(k){s=C;n=C.firstChild}else{s=document.createElement("cufon");s.className="cufon cufon-canvas";s.setAttribute("alt",w);n=document.createElement("canvas");s.appendChild(n);if(t.printable){var S=document.createElement("cufontext");S.appendChild(document.createTextNode(w));s.appendChild(S)}}var aa=s.style;var H=n.style;var j=m.convert(A.height);var Y=Math.ceil(j);var M=Y/j;var G=M*Cufon.CSS.fontStretch(P.get("fontStretch"));var J=h*G;var Q=Math.ceil(m.convert(J+O-u));var o=Math.ceil(m.convert(A.height-B+N));n.width=Q;n.height=o;H.width=Q+"px";H.height=o+"px";B+=A.minY;H.top=Math.round(m.convert(B-V.ascent))+"px";H.left=Math.round(m.convert(u))+"px";var r=Math.max(Math.ceil(m.convert(J)),0)+"px";if(a){aa.width=r;aa.height=m.convert(V.height)+"px"}else{aa.paddingLeft=r;aa.paddingBottom=(m.convert(V.height)-1)+"px"}var X=n.getContext("2d"),D=j/A.height;X.scale(D,D*M);X.translate(-u,-B);X.save();function T(){var x=V.glyphs,ab,l=-1,g=-1,y;X.scale(G,1);while(y=Z[++l]){var ab=x[Z[l]]||V.missingGlyph;if(!ab){continue}if(ab.d){X.beginPath();if(ab.code){c(ab.code,X)}else{ab.code=d("m"+ab.d,X)}X.fill()}X.translate(E[++g],0)}X.restore()}if(z){for(var U=z.length;U--;){var F=z[U];X.save();X.fillStyle=F.color;X.translate.apply(X,L[U]);T()}}var q=t.textGradient;if(q){var v=q.stops,p=X.createLinearGradient(0,A.minY,0,A.maxY);for(var U=0,R=v.length;U<R;++U){p.addColorStop.apply(p,v[U])}X.fillStyle=p}else{X.fillStyle=P.get("color")}T();return s}})());
Cufon.registerFont({"w":168,"face":{"font-family":"7-Segment","font-weight":500,"font-style":"italic","font-stretch":"normal","units-per-em":"360","panose-1":"0 0 0 0 0 0 0 0 0 0","ascent":"288","descent":"-72","bbox":"-12 -270.775 169.716 17","underline-thickness":"0.351562","underline-position":"0","slope":"-3.57632","unicode-range":"U+0020-U+F065"},"glyphs":{" ":{},"\"":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"\u2033":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"'":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8"},"\uf062":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8"},",":{"d":"127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37"},"\uf063":{"d":"127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37"},"i":{"d":"127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37"},"-":{"d":"60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"\uf067":{"d":"60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},".":{"d":"-12,17r2,-34r22,0r-2,34r-22,0","w":0,"k":{".":-42}},"0":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"O":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"D":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"1":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37"},"I":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37"},"2":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"z":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"Z":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"3":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"4":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"5":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"S":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"6":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"7":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37"},"T":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37"},"8":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"B":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"9":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"g":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},":":{"d":"18,-59r2,-34r34,0r-2,34r-34,0xm26,-177r2,-34r34,0r-3,34r-33,0","w":63},"?":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"A":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"C":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"E":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"F":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"f":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"G":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"H":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"J":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17"},"K":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"L":{"d":"117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"l":{"d":"117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"M":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"m":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"N":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"P":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"p":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"Q":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"R":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"U":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"V":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"v":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"W":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"w":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"X":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"x":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"Y":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"y":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"_":{"d":"117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0"},"\uf064":{"d":"117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0"},"`":{"d":"58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"\uf066":{"d":"58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"\u2032":{"d":"58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"a":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"b":{"d":"127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"c":{"d":"117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"d":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"e":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"h":{"d":"127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"j":{"d":"130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0"},"k":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"n":{"d":"127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"o":{"d":"127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"q":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"r":{"d":"51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"s":{"d":"127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"t":{"d":"117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"u":{"d":"127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17"},"\u00b0":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26xm60,-118r-21,-17r24,-17r62,0r21,17r-23,17r-63,0"},"\u203e":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0"},"\uf061":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0"},"\u231c":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm58,-156r-23,16r-11,-8v6,-36,-2,-83,14,-109r25,26"},"\u231d":{"d":"68,-236r-25,-26v23,-15,67,-6,101,-7r-14,33r-62,0xm130,-156v2,-41,3,-84,20,-111v37,17,10,78,13,119r-12,8"},"\u231e":{"d":"127,-113r23,-17r11,9v-7,43,9,104,-27,119r-12,-37xm117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0"},"\u231f":{"d":"117,-34r10,34v-34,-3,-77,7,-100,-7r28,-27r62,0xm51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17"},"\uf065":{"d":"51,-38r-28,26v-15,-27,1,-73,-1,-109r12,-9r22,17"},"\u00a0":{}}});

$(document).ready(function(){

    // websocket
    // --------------------------------------------------------------------------
    function retrievedata(action){
        var speedometerWs = new WebSocket('ws://127.0.0.1:55554/');
        speedometerWs.onmessage = function(event){
            var res = event.data.split('#');
            switch(res[0]){
                case 'vehicleSpeed':   updateVehicleSpeed(res[1]); break;
                case 'fuelEfficiency': updateFuelEfficiency(res[1]); break;
                case 'totfuelEff':     updateTotFuelEfficiency(res[1]); break;
                case 'drivedist':      updateTripDist(res[1]); break;
                case 'gpsdata':        updateGPSSpeed(res[1]); updateGPSAltitude(res[2]); updateGPSHeading(res[3]); updateGPSLatitude(res[4]); updateGPSLongitude(res[5]); break;
                case 'engineSpeed':    updateEngineSpeed(res[1]); break;
            }
        };
        speedometerWs.onopen = function(){
            speedometerWs.send(action);
        };
    }
    // --------------------------------------------------------------------------
    // websocket end

    // update trip time
    // --------------------------------------------------------------------------
    function updateTripTime(){
        totalTripSeconds++;
        var hours   = Math.floor(totalTripSeconds / 3600);
        var minutes = Math.floor((totalTripSeconds - (hours * 3600)) / 60);
        var seconds = totalTripSeconds - (hours * 3600) - (minutes * 60);

        if(hours > 0 && minutes < 10){minutes = "0"+minutes;}
        if(seconds < 10){seconds = "0"+seconds;}
        if(hours > 0){
            $('.tripTimeValue').text(hours+':'+minutes+':'+seconds);
        } else {
            $('.tripTimeValue').text(minutes+':'+seconds);
        }
        if(totalIdleSeconds > 0){
            IdlePercent = Math.round(totalIdleSeconds / totalTripSeconds * 100);
            $('.idleTimeValue').html('<span>('+IdlePercent+'%)</span>'+idleTimeValue);
        }
        if(totalEngineOnSeconds > 0){
            engONidlePercent = Math.round(totalEngineOnSeconds / totalTripSeconds * 100);
            $('.engineIdleTimeValue').html('<span>('+engONidlePercent+'%)</span>'+engONidleTimeValue);
        }
    }
    // --------------------------------------------------------------------------

    // update idle times
    // --------------------------------------------------------------------------
    function updateIdleTime(speed){
        // update stop time
        // --------------------------------------------------------------------------
        if(speed == 0 && totalTripSeconds > 35){
            totalIdleSeconds++;
            var hours   = Math.floor(totalIdleSeconds / 3600);
            var minutes = Math.floor((totalIdleSeconds - (hours * 3600)) / 60);
            var seconds = totalIdleSeconds - (hours * 3600) - (minutes * 60);

            if(hours > 0 && minutes < 10){minutes = "0"+minutes;}
            if(seconds < 10){seconds = "0"+seconds;}
            if(hours > 0){
                idleTimeValue = (hours+':'+minutes+':'+seconds);
            } else {
                idleTimeValue = (minutes+':'+seconds);
            }
        }

        // update engine idle time
        // --------------------------------------------------------------------------
        if(speed == 0 && engineSpeedCurrent > 0 && totalTripSeconds > 35){
            totalEngineOnSeconds++;
            var hours   = Math.floor(totalEngineOnSeconds / 3600);
            var minutes = Math.floor((totalEngineOnSeconds - (hours * 3600)) / 60);
            var seconds = totalEngineOnSeconds - (hours * 3600) - (minutes * 60);

            if(hours > 0 && minutes < 10){minutes = "0"+minutes;}
            if(seconds < 10){seconds = "0"+seconds;}
            if(hours > 0){
                engONidleTimeValue = (hours+':'+minutes+':'+seconds);
            } else {
                engONidleTimeValue = (minutes+':'+seconds);
            }
        }
        // $('.idleTimeValue').html('<span>('+engONidleTimeValue+')</span>'+idleTimeValue);
    }
    // --------------------------------------------------------------------------

    // update vehicle speed
    // --------------------------------------------------------------------------
    function updateVehicleSpeed(currentSpeed){
        var currentSpeed = $.trim(currentSpeed);
        if($.isNumeric(currentSpeed)){
            if(isMPH){
                speedCurrent = Math.ceil(currentSpeed * 0.006213712);
            } else {
                speedCurrent = Math.ceil(currentSpeed * 0.01);
            }

            // update vehicle top speed
            // --------------------------------------------------------------------------
            if(speedCurrent > speedTop){
                if(isMPH){
                    $('.topSpeedIndicator').css("transform","rotate("+(-120+speedCurrent*2)+"deg)");
                } else {
                    $('.topSpeedIndicator').css("transform","rotate("+(-120+speedCurrent)+"deg)");
                }
                speedTop = speedCurrent;
                $('.speedTopValue').html('<span>('+engineSpeedTop+')</span>'+speedTop);
            }
            // --------------------------------------------------------------------------

            // update vehicle average speed
            // --------------------------------------------------------------------------
            if(speedCurrent > 0){
                totalMoveCount++;
                speedSumTotal += speedCurrent;
                var avgSpeed = Math.ceil(speedSumTotal / totalMoveCount);
                if(speedAvg != avgSpeed){
                    speedAvg = avgSpeed;
                    $('.speedAvgValue').text(speedAvg);
                }
            }
            // --------------------------------------------------------------------------

            // update vehicle current speed
            // --------------------------------------------------------------------------
            if(isMPH){
                $('.speedIndicator').css("transform","rotate("+(-120+speedCurrent*2)+"deg)");
            } else {
                $('.speedIndicator').css("transform","rotate("+(-120+speedCurrent)+"deg)");
            }
            $('.vehicleSpeed').text(speedCurrent);
			// cufon stuff
			// --------------------------------------------------------------------------
			Cufon.replace('#digital .vehicleSpeed');
            // --------------------------------------------------------------------------
        }
    }
    // --------------------------------------------------------------------------

    // update total fuel efficiency
    // --------------------------------------------------------------------------
    function updateTotFuelEfficiency(totfuelEff){
        var totfuelEff = $.trim(totfuelEff);
        if($.isNumeric(totfuelEff) && totfuelEff != 0){
            if(isMPH){
                // 1 km/L = 2.3521458 US MPG
                TotFuelEfficiency = (Math.round(totfuelEff * 2.3521458)/10);
            } else {
                if(fuelEffunit_kml){
                    TotFuelEfficiency = (Math.round(totfuelEff)/10).toFixed(1);
                } else {
                    // converts km/L to L/100km
                    TotFuelEfficiency = (Math.round(10000 / totfuelEff)/10).toFixed(1);
                }
            }
            if(language == 'DE' || language == 'FR'){
                TotFuelEfficiency = TotFuelEfficiency.toString().replace(".",",");
            }
            // $('.TotFuelEfficiency').text(TotFuelEfficiency);
        }
    }
    // --------------------------------------------------------------------------

    // update fuel efficiency
    // --------------------------------------------------------------------------
    function updateFuelEfficiency(currentfuelEff){
        var currentfuelEff = $.trim(currentfuelEff);
        if($.isNumeric(currentfuelEff) && currentfuelEff != 0){
            if(isMPH){
                // 1 km/L = 2.3521458 US MPG
                FuelEfficiency = (Math.round(currentfuelEff * 2.3521458)/10);
            } else {
                if(fuelEffunit_kml){
                    FuelEfficiency = (Math.round(currentfuelEff)/10).toFixed(1);
                } else {
                    // converts km/L to L/100km
                    FuelEfficiency = (Math.round(10000 / currentfuelEff)/10).toFixed(1);
                }
            }
            if(language == 'DE' || language == 'FR'){
                FuelEfficiency = FuelEfficiency.toString().replace(".",",");
            }
            $('.Drv1AvlFuelEValue').html('<span>('+TotFuelEfficiency+')</span>'+FuelEfficiency);
        }
    }
    // --------------------------------------------------------------------------

    // update trip distance
    // --------------------------------------------------------------------------
    function updateTripDist(currtripDist){
        var currtripDist = $.trim(currtripDist);
        if($.isNumeric(currtripDist)){
            if(currtripDist > 0){
                tripDistCurrent = parseFloat(currtripDist)+parseFloat(tripDistBkp);
                if(currtripDist > 2){
                    prevTripDist = tripDistCurrent;
                }
            }
            if(currtripDist >= 0 && currtripDist <= 2 && prevTripDist > 0){
                tripDistBkp = prevTripDist;
            }

            if(isMPH){
                tripDist = (tripDistCurrent * 0.02 * 0.6213712).toFixed(2);
            } else {
                tripDist = (tripDistCurrent * 0.02).toFixed(2);
            }
            if(language == 'DE' || language == 'FR'){
                tripDist = tripDist.toString().replace(".",",");
            }
            $('.tripDistance').text(tripDist);
        }
    }
    // --------------------------------------------------------------------------

    // update GPS speed
    // --------------------------------------------------------------------------
    function updateGPSSpeed(currentGPSSpeed){
        var currentGPSSpeed = $.trim(currentGPSSpeed);
        if($.isNumeric(currentGPSSpeed)){
            if(isMPH){
                GPSspeedCurrent = Math.floor(currentGPSSpeed * 0.6213712);
            } else {
                GPSspeedCurrent = Math.floor(currentGPSSpeed);
            }
            $('.gpsSpeedValue').text(GPSspeedCurrent);
        }
    }
    // --------------------------------------------------------------------------

    // update GPS altitude
    // --------------------------------------------------------------------------
    function updateGPSAltitude(currentGPSalt){
        var currentGPSalt = $.trim(currentGPSalt);
        if($.isNumeric(currentGPSalt) && currentGPSalt != GPSaltCurrent){
            if(isMPH){
                GPSaltCurrent = Math.round(currentGPSalt * 3.28084);
            } else {
                GPSaltCurrent = Math.round(currentGPSalt);
            }

            // update max altitude
            // --------------------------------------------------------------------------
            if(GPSaltCurrent > altGPSmax){
                altGPSmax = GPSaltCurrent;
                // $('.gpsAltitudeMax').text(altGPSmax);
            }
            // --------------------------------------------------------------------------

            // update min altitude
            // --------------------------------------------------------------------------
            if(GPSaltCurrent < altGPSmin && GPSaltCurrent != 0){
                altGPSmin = GPSaltCurrent;
                // $('.gpsAltitudeMin').text(altGPSmin);
            }
            // --------------------------------------------------------------------------

            if(altGPSmin != 9999){
                $('.gpsAltitudeMinMax').html(altGPSmin+' / '+altGPSmax);
            }

            // update current altitude
            // --------------------------------------------------------------------------
            $('.gpsAltitudeValue').text(GPSaltCurrent);
            // --------------------------------------------------------------------------
        }
    }
    // --------------------------------------------------------------------------

    // update GPS Heading
    // --------------------------------------------------------------------------
    function updateGPSHeading(currentGPShead){
        var currentGPShead = $.trim(currentGPShead);
        if($.isNumeric(currentGPShead) && currentGPShead != lastGPSheadingValue){
            // without NavSD
            if(noNavSD){
                if(speedCurrent > 0){
                    $('.gpsCompassBG').css("transform","rotate("+(-Math.round(currentGPShead))+"deg)");
                    // Mazda Infotainment System GPS heading is S = 0/360 degrees even though docs say otherwise, YMMV
                    headingSwitchValue = Math.round(currentGPShead / 22.5);
                    // Close enough
                    switch(headingSwitchValue){
                        case 1:     direction = "NNE";  break;
                        case 2:     direction = "NE";   break;
                        case 3:     direction = "ENE";  break;
                        case 4:     direction = "E";    break;
                        case 5:     direction = "ESE";  break;
                        case 6:     direction = "SE";   break;
                        case 7:     direction = "SSE";  break;
                        case 8:     direction = "S";    break;
                        case 9:     direction = "SSW";  break;
                        case 10:    direction = "SW";   break;
                        case 11:    direction = "WSW";  break;
                        case 12:    direction = "W";    break;
                        case 13:    direction = "WNW";  break;
                        case 14:    direction = "NW";   break;
                        case 15:    direction = "NNW";  break;
                        default:    direction = "N";
                    }
                    if(language == 'DE'){
                        direction = direction.replace(/E/g, "O");
                    }
                    if(language == 'FR'){
                        direction = direction.replace(/W/g, "O");
                    }
                    if(language == 'TR'){
                        direction = direction.replace(/N/g, "K");
                        direction = direction.replace(/S/g, "G");
                        direction = direction.replace(/E/g, "D");
                        direction = direction.replace(/W/g, "B");
                    }
                    $('.gpsHeading').text(direction);
                    lastGPSheadingValue = currentGPShead;
                }
            // with NavSD
            } else {
                $('.gpsCompassBG').css("transform","rotate("+(-Math.abs(currentGPShead)+180)+"deg)");
                // Mazda Infotainment System GPS heading is S = 0/360 degrees even though docs say otherwise, YMMV
                headingSwitchValue = Math.round(currentGPShead / 22.5);
                // Close enough
                switch(headingSwitchValue){
                    case 1:     direction = "SSW";  break;
                    case 2:     direction = "SW";   break;
                    case 3:     direction = "WSW";  break;
                    case 4:     direction = "W";    break;
                    case 5:     direction = "WNW";  break;
                    case 6:     direction = "NW";   break;
                    case 7:     direction = "NNW";  break;
                    case 8:     direction = "N";    break;
                    case 9:     direction = "NNE";  break;
                    case 10:    direction = "NE";   break;
                    case 11:    direction = "ENE";  break;
                    case 12:    direction = "E";    break;
                    case 13:    direction = "ESE";  break;
                    case 14:    direction = "SE";   break;
                    case 15:    direction = "SSE";  break;
                    default:    direction = "S";
                }
                if(language == 'DE'){
                    direction = direction.replace(/E/g, "O");
                }
                if(language == 'FR'){
                    direction = direction.replace(/W/g, "O");
                }
                if(language == 'TR'){
                    direction = direction.replace(/N/g, "K");
                    direction = direction.replace(/S/g, "G");
                    direction = direction.replace(/E/g, "D");
                    direction = direction.replace(/W/g, "B");
                }
                $('.gpsHeading').text(direction);
                lastGPSheadingValue = currentGPShead;
            }
        }
    }
    // --------------------------------------------------------------------------

    // update GPS latitude
    // --------------------------------------------------------------------------
    function updateGPSLatitude(currentGPSlat){
        var currentGPSlat = $.trim(currentGPSlat);
        if($.isNumeric(currentGPSlat)){
            GPSlatCurrent = parseFloat(currentGPSlat).toFixed(4);
            // North
            if(GPSlatCurrent > 0){
                $('.gpsLatitudeValue').html(GPSlatCurrent+'&deg;').removeClass("lat_s").addClass("lat_n");
            // South
            } else {
                $('.gpsLatitudeValue').html(Math.abs(GPSlatCurrent)+'&deg;').removeClass("lat_n").addClass("lat_s");
            }
            if(language == 'TR'){
                $('.gpsLatitudeValue').addClass("tr");
            }
        }
    }
    // --------------------------------------------------------------------------

    // update GPS longitude
    // --------------------------------------------------------------------------
    function updateGPSLongitude(currentGPSlon){
        var currentGPSlon = $.trim(currentGPSlon);
        if($.isNumeric(currentGPSlon)){
            GPSlonCurrent = parseFloat(currentGPSlon).toFixed(4);
            // East
            if(GPSlonCurrent > 0){
                $('.gpsLongitudeValue').html(GPSlonCurrent+'&deg;').removeClass("lon_w").addClass("lon_e");
            // West
            } else {
                $('.gpsLongitudeValue').html(Math.abs(GPSlonCurrent)+'&deg;').removeClass("lon_e").addClass("lon_w");
            }
            if(language == 'DE'){
                $('.gpsLongitudeValue').addClass("de");
            }
            if(language == 'FR'){
                $('.gpsLongitudeValue').addClass("fr");
            }
            if(language == 'TR'){
                $('.gpsLongitudeValue').addClass("tr");
            }
        }
    }
    // --------------------------------------------------------------------------

    // update Engine Speed
    // --------------------------------------------------------------------------
    function updateEngineSpeed(currentEngineSpeed){
        var currentEngineSpeed = $.trim(currentEngineSpeed);
        if($.isNumeric(currentEngineSpeed)){
            engineSpeedCurrent = Math.round(currentEngineSpeed * 2);
            if(engineSpeedCurrent <= 8000){

                // update engine top speed
                // --------------------------------------------------------------------------
                if(engineSpeedCurrent > engineSpeedTop){
                    $('.topRPMIndicator').css("transform","rotate("+(-145-engineSpeedCurrent*0.01)+"deg)");
                    engineSpeedTop = engineSpeedCurrent;
                    $('.speedTopValue').html('<span>('+engineSpeedTop+')</span>'+speedTop);
                }
                // --------------------------------------------------------------------------

                // update engine speed
                // --------------------------------------------------------------------------
                $('.RPMIndicator').css("transform","rotate("+(-145-engineSpeedCurrent*0.01)+"deg)");
                // --------------------------------------------------------------------------
            }
        }
    }
    // --------------------------------------------------------------------------

    setInterval(function (){
      updateTripTime();
      if(speedCurrent == 0){
        updateIdleTime(speedCurrent);
      }
      if ((enableSmallSbSpeedo) && (!$('#SbSpeedo').hasClass('parking'))) {
        var visibleIcons = 0;
        $('.StatusBarCtrlIconContainer .StatusBarCtrlIcon').each(function(index) {
          if($(this).is(':visible'))
            visibleIcons++;
        });
        if(visibleIcons > 3){
          $('#SbSpeedo').addClass('morespace');
        } else {
          $('#SbSpeedo').removeClass('morespace');
        }
      }
    }, 1000);

    setInterval(function (){
        if((enableSmallSbSpeedo) && ($("#speedometerContainer").length == 0) && (!$('#SbSpeedo').hasClass('parking'))){
            $('#SbSpeedo .gpsHeading').fadeOut();
            $('#SbSpeedo .gpsAltitudeValue').fadeIn();
            setTimeout(function(){
                $('#SbSpeedo .gpsAltitudeValue').fadeOut();
                $('#SbSpeedo .gpsHeading').fadeIn();
            }, 2000);
        }
    }, 4000);

    setTimeout(function(){
        retrievedata('vehicleSpeed');
        retrievedata('gpsdata');
        retrievedata('totfuelEfficiency');
        retrievedata('fuelEfficiency');
        retrievedata('drivedist');
        retrievedata('engineSpeed');
    }, 35000);

});
