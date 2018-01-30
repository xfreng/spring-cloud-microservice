/*
 * efCookie class
 */
/**
 * @class efCookie类
 * @param {Object} ctx
 * @constructor
 */
function cookie(ctx) {
  this.context = ctx;
  if (document.cookie.length) {
    this.cookies = ' ' + document.cookie;
  }
}
/**
 * 
 * @param {String} key	:	cookie键
 * @param {Object} value	：cookie键对应的值
 */
cookie.prototype.setCookie = function (key, value) {
	var uKey = this.context + key;
	document.cookie = uKey + "=" + escape(value);
}
/**
 * 
 * @param {String} key	：	cookie键
 * @return {String}	:	cookie键对应的值
 */
cookie.prototype.getCookie = function (key) {
	var uKey = this.context + key;
	if (this.cookies) {
		var start = this.cookies.indexOf(' ' + uKey + '=');
		if (start == -1) { return null; }
		var end = this.cookies.indexOf(";", start);
		if (end == -1) { end = this.cookies.length; }
		end -= start;
		var cookie = this.cookies.substr(start,end);
		return unescape(cookie.substr(cookie.indexOf('=') + 1, cookie.length - cookie.indexOf('=') + 1));
	}
	else { return null; }
}