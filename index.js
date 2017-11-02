var ce = document.createElement.bind(document);
var s = ce('script');
s.type = 'text/javascript';
s.src = chrome.extension.getURL("script.js");
document.head.appendChild(s);
