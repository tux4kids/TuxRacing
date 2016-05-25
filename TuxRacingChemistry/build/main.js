(function(){var requirejs,require,define;(function(e){function a(e,t){var n=t&&t.split("/"),i=r.map,s=i&&i["*"]||{},o,u,a,f,l,c,h;if(e&&e.charAt(0)==="."&&t){n=n.slice(0,n.length-1),e=n.concat(e.split("/"));for(l=0;h=e[l];l++)if(h===".")e.splice(l,1),l-=1;else if(h===".."){if(l===1&&(e[2]===".."||e[0]===".."))return!0;l>0&&(e.splice(l-1,2),l-=2)}e=e.join("/")}if((n||s)&&i){o=e.split("/");for(l=o.length;l>0;l-=1){u=o.slice(0,l).join("/");if(n)for(c=n.length;c>0;c-=1){a=i[n.slice(0,c).join("/")];if(a){a=a[u];if(a){f=a;break}}}f=f||s[u];if(f){o.splice(0,l,f),e=o.join("/");break}}}return e}function f(t,n){return function(){return u.apply(e,s.call(arguments,0).concat([t,n]))}}function l(e){return function(t){return a(t,e)}}function c(e){return function(n){t[e]=n}}function h(r){if(n.hasOwnProperty(r)){var s=n[r];delete n[r],i[r]=!0,o.apply(e,s)}if(!t.hasOwnProperty(r))throw new Error("No "+r);return t[r]}function p(e,t){var n,r,i=e.indexOf("!");return i!==-1?(n=a(e.slice(0,i),t),e=e.slice(i+1),r=h(n),r&&r.normalize?e=r.normalize(e,l(t)):e=a(e,t)):e=a(e,t),{f:n?n+"!"+e:e,n:e,p:r}}function d(e){return function(){return r&&r.config&&r.config[e]||{}}}var t={},n={},r={},i={},s=[].slice,o,u;o=function(r,s,o,u){var a=[],l,v,m,g,y,b;u=u||r;if(typeof o=="function"){s=!s.length&&o.length?["require","exports","module"]:s;for(b=0;b<s.length;b++){y=p(s[b],u),m=y.f;if(m==="require")a[b]=f(r);else if(m==="exports")a[b]=t[r]={},l=!0;else if(m==="module")v=a[b]={id:r,uri:"",exports:t[r],config:d(r)};else if(t.hasOwnProperty(m)||n.hasOwnProperty(m))a[b]=h(m);else if(y.p)y.p.load(y.n,f(u,!0),c(m),{}),a[b]=t[m];else if(!i[m])throw new Error(r+" missing "+m)}g=o.apply(t[r],a);if(r)if(v&&v.exports!==e&&v.exports!==t[r])t[r]=v.exports;else if(g!==e||!l)t[r]=g}else r&&(t[r]=o)},requirejs=require=u=function(t,n,i,s){return typeof t=="string"?h(p(t,n).f):(t.splice||(r=t,n.splice?(t=n,n=i,i=null):t=e),n=n||function(){},s?o(e,t,n,i):setTimeout(function(){o(e,t,n,i)},15),u)},u.config=function(e){return r=e,u},define=function(e,t,r){t.splice||(r=t,t=[]),n[e]=[e,t,r]},define.amd={jQuery:!0}})(),define("almond",function(){}),define("utilities",[],function(){var e={};return e.randomInRange=function(e,t){return e+Math.random()*(t-e)|0},e.fisherYates=function(e){var t,n,r;for(n=e.length-1;n>0;--n)r=Math.random()*(n+1)|0,temp=e[r],e[r]=e[n],e[n]=temp;return e},e.jsonLoad=function(e,t,n){var r=new XMLHttpRequest;r.open(e,t,!0),r.onreadystatechange=function(){if(r.readyState===4){var e=JSON.parse(r.responseText);n(e)}},r.send(null)},e}),define("problem",[],function(){var e={};return e.problem=function(e,t){return{question:e,choices:t}},e.problem}),define("question",[],function(){var e={};return e.question=function(e,t){var n={};return n.toString=function(){return e},n.checkAnswer=function(e){return t==e},n},e.question}),define("problemGenerator",["utilities","problem","question"],function(e,t,n){var r={};return r.problemGenerator=function(r){var i={},s=function(t){var n=t.shift();return e.fisherYates(t),t=t.splice(0,r.info.choices),t.length<r.info.choices?t.splice(e.randomInRange(0,t.length),0,n):t[e.randomInRange(0,t.length)]=n,t};return i.targetRates=function(){return[r.info.firstPlace,r.info.secondPlace]},i.bgConstants=function(){return{c1:r.info.c1,c2:r.info.c2}},i.maximumRate=function(){return r.info.maxRate},i.duration=function(){return r.info.duration},i.generate=function(){var i=r.problems[e.randomInRange(0,r.problems.length)],o=n(i.question,i.choices[0]),u=s(i.choices.slice(0));return t(o,u)},i},r.problemGenerator}),define("text",["module"],function(e){var t=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],n=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,r=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,i=typeof location!="undefined"&&location.href,s=i&&location.protocol&&location.protocol.replace(/\:/,""),o=i&&location.hostname,u=i&&(location.port||undefined),a=[],f=e.config(),l,c;return l={version:"2.0.0",strip:function(e){if(e){e=e.replace(n,"");var t=e.match(r);t&&(e=t[1])}else e="";return e},jsEscape:function(e){return e.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r")},createXhr:function(){var e,n,r;if(typeof XMLHttpRequest!="undefined")return new XMLHttpRequest;if(typeof ActiveXObject!="undefined")for(n=0;n<3;n++){r=t[n];try{e=new ActiveXObject(r)}catch(i){}if(e){t=[r];break}}return e},parseName:function(e){var t=!1,n=e.indexOf("."),r=e.substring(0,n),i=e.substring(n+1,e.length);return n=i.indexOf("!"),n!==-1&&(t=i.substring(n+1,i.length),t=t==="strip",i=i.substring(0,n)),{moduleName:r,ext:i,strip:t}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/,useXhr:function(e,t,n,r){var i=l.xdRegExp.exec(e),s,o,u;return i?(s=i[2],o=i[3],o=o.split(":"),u=o[1],o=o[0],(!s||s===t)&&(!o||o===n)&&(!u&&!o||u===r)):!0},finishLoad:function(e,t,n,r){n=t?l.strip(n):n,f.isBuild&&(a[e]=n),r(n)},load:function(e,t,n,r){if(r.isBuild&&!r.inlineText){n();return}f.isBuild=r.isBuild;var a=l.parseName(e),c=a.moduleName+"."+a.ext,h=t.toUrl(c),p=f.useXhr||l.useXhr;!i||p(h,s,o,u)?l.get(h,function(t){l.finishLoad(e,a.strip,t,n)},function(e){n.error&&n.error(e)}):t([c],function(e){l.finishLoad(a.moduleName+"."+a.ext,a.strip,e,n)})},write:function(e,t,n,r){if(a.hasOwnProperty(t)){var i=l.jsEscape(a[t]);n.asModule(e+"!"+t,"define(function () { return '"+i+"';});\n")}},writeFile:function(e,t,n,r,i){var s=l.parseName(t),o=s.moduleName+"."+s.ext,u=n.toUrl(s.moduleName+"."+s.ext)+".js";l.load(o,n,function(t){var n=function(e){return r(u,e)};n.asModule=function(e,t){return r.asModule(e,u,t)},l.write(e,o,n,i)},i)}},typeof process!="undefined"&&process.versions&&!!process.versions.node?(c=require.nodeRequire("fs"),l.get=function(e,t){var n=c.readFileSync(e,"utf8");n.indexOf("﻿")===0&&(n=n.substring(1)),t(n)}):l.createXhr()?l.get=function(e,t,n){var r=l.createXhr();r.open("GET",e,!0),f.onXhr&&f.onXhr(r,e),r.onreadystatechange=function(i){var s,o;r.readyState===4&&(s=r.status,s>399&&s<600?(o=new Error(e+" HTTP status: "+s),o.xhr=r,n(o)):t(r.responseText))},r.send(null)}:typeof Packages!="undefined"&&(l.get=function(e,t){var n="utf-8",r=new java.io.File(e),i=java.lang.System.getProperty("line.separator"),s=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(r),n)),o,u,a="";try{o=new java.lang.StringBuffer,u=s.readLine(),u&&u.length()&&u.charAt(0)===65279&&(u=u.substring(1)),o.append(u);while((u=s.readLine())!==null)o.append(i),o.append(u);a=String(o.toString())}finally{s.close()}t(a)}),l}),define("json",["text"],function(text){function cacheBust(e){return e=e.replace(CACHE_BUST_FLAG,""),e+=e.indexOf("?")<0?"?":"&",e+CACHE_BUST_QUERY_PARAM+"="+Math.round(2147483647*Math.random())}var CACHE_BUST_QUERY_PARAM="bust",CACHE_BUST_FLAG="!bust",jsonParse=typeof JSON!="undefined"&&typeof JSON.parse=="function"?JSON.parse:function(val){return eval("("+val+")")},buildMap={};return{load:function(e,t,n,r){!r.isBuild||r.inlineJSON!==!1&&e.indexOf(CACHE_BUST_QUERY_PARAM+"=")===-1?text.get(t.toUrl(e),function(t){r.isBuild?(buildMap[e]=t,n(t)):n(jsonParse(t))}):n(null)},normalize:function(e,t){return e.indexOf(CACHE_BUST_FLAG)===-1?e:cacheBust(e)},write:function(e,t,n){if(t in buildMap){var r=buildMap[t];n('define("'+e+"!"+t+'", function(){ return '+r+";});\n")}}}}),define("json!master.json",function(){return[{title:"Significant Figures",path:"lessons/lesson01.json",id:"sigfigs"},{title:"Density",path:"lessons/lesson02.json",id:"density"}]}),function(){function r(e,t,n,r,i,s){t[e]&&(n.push(e),(t[e]===!0||t[e]===1)&&r.push(i+e+"/"+s))}function i(e,t,n,r,i){var s=r+t+"/"+i;require._fileExists(e.toUrl(s))&&n.push(s)}function s(e,t,n){var r;for(r in t)t.hasOwnProperty(r)&&(!e.hasOwnProperty(r)||n)?e[r]=t[r]:typeof t[r]=="object"&&s(e[r],t[r],n)}function o(e){var t=e.userAgent&&e.userAgent.match(/Android/),n;return t?(n=e.userAgent.match(/Android \d+(?:\.\d+){1,2}; ([a-z]{2}-[a-z]{2})/),n&&(n=n[1])):e.language?n=e.language:e.userLanguage?n=e.userLanguage:e.browserLanguage?n=e.browserLanguage:e.systemLanguage&&(n=e.systemLanguage),n}var e=/(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/,t,n;typeof process!="undefined"&&process.versions&&!!process.versions.node?(t=require.nodeRequire("fs"),n=function(e){var n=t.readFileSync(e,"utf8");return n.indexOf("﻿")===0&&(n=n.substring(1)),n}):typeof Packages!="undefined"&&(n=function(e){var t="utf-8",r=new java.io.File(e),i=java.lang.System.getProperty("line.separator"),s=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(r),t)),o,u,a="";try{o=new java.lang.StringBuffer,u=s.readLine(),u&&u.length()&&u.charAt(0)===65279&&(u=u.substring(1)),o.append(u);while((u=s.readLine())!==null)o.append(i),o.append(u);a=String(o.toString())}finally{s.close()}return n}),define("i18n",["module"],function(t){var u=t.config();return{version:"2.0.1",load:function(t,a,f,l){l=l||{},l.locale&&(u.locale=l.locale);var c,h=e.exec(t),p=h[1],d=h[4],v=h[5],m=d.split("-"),g=[],y={},b,w,E,S,x="";h[5]?(p=h[1],c=p+v):(c=t,v=h[4],d=u.locale,d||(d=u.locale=typeof navigator=="undefined"?"root":(o(navigator)||"root").toLowerCase()),m=d.split("-"));if(l.isBuild){g.push(c);if(l.inlinei18n!==!0||l.locale){i(a,"root",g,p,v);for(b=0;b<m.length;b++)w=m[b],x+=(x?"-":"")+w,i(a,x,g,p,v);a(g,function(){f()})}else E=n(a.toUrl(c)),S=Math.random().toString(36),f.fromText(S,E),a([S],function(e){var t;for(t in e)e.hasOwnProperty(t)&&e[t]===!0&&i(a,t,g,p,v);a(g,function(){f()})})}else a([c],function(e){var t=[],n;r("root",e,t,g,p,v);for(b=0;b<m.length;b++)n=m[b],x+=(x?"-":"")+n,r(x,e,t,g,p,v);a(g,function(){var n,r,i;for(n=t.length-1;n>-1&&t[n];n--){i=t[n],r=e[i];if(r===!0||r===1)r=a(p+i+"/"+v);s(y,r)}f(y)})})}}})}(),define("nls/info.js",{root:{name:"Chemistry (Demo)",description:"Demonstration of a static test-bank",refName:"chemdem"},defaultLocale:"en"}),define("main",["problemGenerator","json!master.json","i18n!nls/info.js","nls/info.js"],function(e,t,n,r){var i={},s=TR.modulePath(n.refName);i.description=function(){return n.description},i.name=function(){return n.name},i.ref=function(){return n.refName},i.exercises=function(){var e=[],n;for(n=0;n<t.length;n++)e[n]={title:t[n].title,path:t[n].path,id:t[n].id};return e},i.exercise=function(n,r){var i,o;for(o=0;o<t.length;o++)if(t[o].id===n){i=t[o];break}if(!i)throw"Error: no matching id in chemistry lesson module";TR.getJSON(s+i.path,function(t){r(e(t))})},i.supportsLocale=function(){var e=TR.getLocale(),t=e.split("-");return e===r.defaultLocale||r[e]?!0:t[0]===r.defaultLocale||r[t[0]]?!0:!1},i.iconPath=function(){return s+"icon.png"},TR.moduleLoaded.dispatch(n.refName,i)}),require(["main"])})()