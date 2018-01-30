var EFWindowInterval = null;
var EFWindow = null;
var EFWindows = [];
self.onError = null;
var currentX = 0;
var currentY = 0;
var whichIt = null;
var lastScrollX = 0;
var lastScrollY = 0;
var showComponent = null;
var efwindow_first_show = true;
/**
 * efwindow 弹出窗口对象构造函数
 * 
 * @class efwindow 弹出窗口对象
 * @constructor
 */
efwindow = function() {
}

efwindow._onmousedown = null;
efwindow._onmousemove = null;
efwindow._onmouseup = null;
/**
 * 该函数使efwindow弹出窗口显示出来
 * 
 * @param {Object}
 *            obj: 触发efwindow弹出窗口的DOM节点
 * @param {Object}
 *            div_id: efwindow弹出窗口对应DIV的ID
 * @param {String}
 *            center： efwindow弹出窗口是否在中央显示,为"center"时在中央显示，默认为不在中央显示
 * @param {boolean}
 *            no_move： efwindow弹出窗口是否可以移动
 */
efwindow.show = function(obj, div_id, center, no_move) {

	// debugger;
	showComponent = obj;
	EFWindow = div_id;
	var flage = true;
	for (i = 0; c = EFWindows[i]; i++) {
		if (c == div_id)
			flage = false;
	}
	if (flage)
		EFWindows.push(div_id);
	var window_obj = document.getElementById(EFWindow);
	window_obj.style.display = 'block';
	if (center == "center") {
		window_obj.style.pixelLeft = (document.body.clientWidth - window_obj.clientWidth)
				/ 2;
		window_obj.style.pixelTop = (document.body.clientHeight - window_obj.clientHeight)
				/ 2;
	} else {
		var leftpos = 0, toppos = 0;
		scrollTopValue = 0;
		aTag = obj;
		do {
			aTag = aTag.offsetParent;
			// 解决不同浏览器下(如chrome)下，window位置问题
			if(aTag == null && obj.style.display=="none" && obj.nextSibling!=null)
				aTag = obj.nextSibling.offsetParent;

			// leftpos += aTag.offsetLeft;
			// toppos+= (aTag.offsetTop%screen.availHeight );
			scrollTopValue = aTag.scrollTop;
			leftpos += (aTag.offsetLeft - aTag.scrollLeft);
			toppos += (aTag.offsetTop - aTag.scrollTop);
		} while (aTag.tagName != "BODY");

		if (efwindow_first_show == true) {
			efwindow_first_show = false;
		} else
			toppos += scrollTopValue;

		window_obj.style.pixelLeft = obj.offsetLeft + leftpos;// +
																// obj.offsetWidth;
		window_obj.style.pixelTop = obj.offsetTop + toppos + 20;// +
																// obj.offsetHeight;

		if (window_obj.style.pixelLeft + window_obj.offsetWidth > aTag.offsetWidth) {
			window_obj.style.pixelLeft -= window_obj.style.pixelLeft
					+ window_obj.offsetWidth - aTag.offsetWidth + 20;
		}

		// if( window_obj.style.pixelLeft > 400 )
		// {
		// window_obj.style.pixelLeft = 400;
		// }
		// if( window_obj.style.pixelTop > 300 )
		// {
		// window_obj.style.pixelTop = 300;
		// }
	}

	efShim.openShim(window_obj);

	if (isNS&&!isIE) {
		window.captureEvents(Event.MOUSEUP | Event.MOUSEDOWN);
		window.onmousedown = efwindow.grabIt;
		window.onmousemove = efwindow.moveIt;
		window.onmouseup = efwindow.dropIt;
	} else if (isIE) {
		efwindow._onmousedown = document.onmousedown;

		document.onmousedown = efwindow.grabIt;
		if (center != "fixed") {
			efwindow._onmousemove = document.onmousemove;
			document.onmousemove = efwindow.moveIt;
		}
		efwindow._onmouseup = document.onmouseup;
		document.onmouseup = efwindow.dropIt;
	}

	if (center != "fixed" && (isNS || isIE))
		EFWindowInterval = window.setInterval("efwindow.heartBeat()", 1);

}
/**
 * efwindow弹出窗口隐藏函数
 */
efwindow.hide = function() {
	// debugger;
	clearInterval(EFWindowInterval);
	var window_obj = document.getElementById(EFWindow);
	if (window_obj) {
		window_obj.style.display = 'none';
		efShim.closeShim(window_obj);
	}
	if (EFWindows.length > 1) {
		var _temp = [];
		for (i = 0; c = EFWindows[i++];) {
			if (EFWindow != c)
				_temp.push(c);
		}
		EFWindows = _temp;
		// EFWindows.pop(EFWindow);
		EFWindow = EFWindows[EFWindows.length - 1];
	} else {
		document.onmousedown = efwindow._onmousedown;
		document.onmouseup = efwindow._onmouseup;
		if (null != efwindow._onmousemove)
			document.onmousemove = efwindow._onmousemove;
	}
    //add by tcg 弹出框隐藏时 滚动位置坐标参照点清0
    lastScrollY = lastScrollX = 0;
}

/**
 * efwindow移动时的触发函数
 * 
 * @private
 * @param {Object}
 *            x
 * @param {Object}
 *            y
 */
efwindow.moveToPostion = function(x, y) {
	var window_obj = document.getElementById(EFWindow);
	if (isIE) {
		window_obj.style.pixelLeft = x;
		window_obj.style.pixelTop = y;
	} else if (isNS) {
		window_obj.left = x;
		window_obj.top = y;
	}
}
/**
 * @private
 */
efwindow.heartBeat = function() {
	if (isIE) {
		diffY = document.body.scrollTop;
		diffX = document.body.scrollLeft;
	} else if (isNS) {
		diffY = self.pageYOffset;
		diffX = self.pageXOffset;
	}

	var window_obj = document.getElementById(EFWindow);
	if (diffY != lastScrollY) {
		percent = .1 * (diffY - lastScrollY);
		if (percent > 0)
			percent = Math.ceil(percent);
		else
			percent = Math.floor(percent);

		if (isIE)
			window_obj.style.pixelTop += percent;
		else if (isNS)
			window_obj.top += percent;

		lastScrollY = lastScrollY + percent;
	}

	if (diffX != lastScrollX) {
		percent = .1 * (diffX - lastScrollX);
		if (percent > 0)
			percent = Math.ceil(percent);
		else
			percent = Math.floor(percent);

		if (isIE)
			window_obj.style.pixelLeft += percent;
		else if (isNS)
			window_obj.left += percent;

		lastScrollX = lastScrollX + percent;
	}

	efShim.moveTo(window_obj.style.pixelLeft, window_obj.style.pixelTop);
}
/**
 * @private
 * @param {Object}
 *            x
 * @param {Object}
 *            y
 */
efwindow.checkFocus = function(x, y) {
	stalkerx = document.getElementById(EFWindow).pageX;
	stalkery = document.getElementById(EFWindow).pageY;
	stalkerwidth = 5;// document.getElementById(EFWindow).clip.width;
	stalkerheight = 5;// document.getElementById(EFWindow).clip.height;

	return ((x > stalkerx && x < (stalkerx + stalkerwidth)) && (y > stalkery && y < (stalkery + stalkerheight)));
}
/**
 * @private
 * @param {Object}
 *            e
 */
efwindow.grabIt = function(e) {
	var event = window.event || e;
	// 添加判断如果点击ie滚动条则窗口不自动隐藏
	if (event.clientY > document.body.clientHeight
			|| event.clientX > document.body.clientWidth) {
		return true;
	}
	// if(isIE) {
	whichIt = event.srcElement || event.target;
	if (whichIt == null)
		return true;

	while (whichIt.id == undefined || whichIt.id.indexOf(EFWindow) == -1) {
		if ("ef_calendar" == whichIt.id)
			break;
		whichIt = whichIt.parentElement || whichIt.parentNode;

		if (whichIt == null) {
			clearInterval(EFWindowInterval);
			efwindow.hide();
			return true;
		}
	}

	if (event.clientY + document.body.scrollTop - whichIt.offsetTop < 20) {
		whichIt.style.pixelLeft = whichIt.offsetLeft;
		whichIt.style.pixelTop = whichIt.offsetTop;
		efShim.moveTo(whichIt.style.pixelLeft, whichIt.style.pixelTop);
		currentX = (event.clientX + document.body.scrollLeft);
		currentY = (event.clientY + document.body.scrollTop);
	} else {
		whichIt = null;
	}

	/*
	 * } else { window.captureEvents(Event.MOUSEMOVE); if(efwindow.checkFocus
	 * (e.pageX,e.pageY)) { whichIt = document.getElementById(EFWindow);
	 * stalkerTouchedX = e.pageX-document.getElementById(EFWindow).pageX;
	 * StalkerTouchedY = e.pageY-document.getElementById(EFWindow).pageY; } }
	 */

	return true;
}
/**
 * @private
 * @param {Object}
 *            e
 */
efwindow.moveIt = function(e) {
	var event = window.event || e;
	if (whichIt == null)
		return true;

	// if(isIE) {
	newX = (event.clientX + document.body.scrollLeft);
	newY = (event.clientY + document.body.scrollTop);
	distanceX = (newX - currentX);
	distanceY = (newY - currentY);
	currentX = newX;
	currentY = newY;
	whichIt.style.pixelLeft += distanceX;
	whichIt.style.pixelTop += distanceY;
	efShim.moveTo(whichIt.style.pixelLeft, whichIt.style.pixelTop);

	if (whichIt.style.pixelTop < document.body.scrollTop)
		whichIt.style.pixelTop = document.body.scrollTop;
	if (whichIt.style.pixelLeft < document.body.scrollLeft)
		whichIt.style.pixelLeft = document.body.scrollLeft;
	if (whichIt.style.pixelLeft > document.body.offsetWidth
			- document.body.scrollLeft - whichIt.style.pixelWidth - 20)
		whichIt.style.pixelLeft = document.body.offsetWidth
				- whichIt.style.pixelWidth - 20;
	if (whichIt.style.pixelTop > document.body.offsetHeight
			+ document.body.scrollTop - whichIt.style.pixelHeight - 5)
		whichIt.style.pixelTop = document.body.offsetHeight
				+ document.body.scrollTop - whichIt.style.pixelHeight - 5;
	event.returnValue = false;
	/*
	 * } else { whichIt.moveTo(e.pageX-StalkerTouchedX,e.pageY-StalkerTouchedY);
	 * if(whichIt.left < 0+self.pageXOffset) whichIt.left = 0+self.pageXOffset;
	 * if(whichIt.top < 0+self.pageYOffset) whichIt.top = 0+self.pageYOffset;
	 * if( (whichIt.left + whichIt.clip.width) >=
	 * (window.innerWidth+self.pageXOffset-17)) whichIt.left =
	 * ((window.innerWidth+self.pageXOffset)-whichIt.clip.width)-17; if(
	 * (whichIt.top + whichIt.clip.height) >=
	 * (window.innerHeight+self.pageYOffset-17)) whichIt.top =
	 * ((window.innerHeight+self.pageYOffset)-whichIt.clip.height)-17; return
	 * false; }
	 */

	return false;
}
/**
 * @private
 */
efwindow.dropIt = function() {
	whichIt = null;
	if (isNS&&!isIE)
		window.releaseEvents(Event.MOUSEMOVE);

	return true;
}
/**
 * efwindow弹出窗口返回时的设值函数
 * 
 * @param {String}
 *            cell_value:弹出窗口隐藏时设置的值
 */
efwindow.setValue = function(cell_value) {
	if (showComponent.tagName == 'INPUT') {
		var index = cell_value.indexOf("\r\n");
		while (index != -1) {
			cell_value = cell_value.substring(0, index) + EF_CR_IDENTIFIER
					+ cell_value.substring(index + 2);
			index = cell_value.indexOf("\r\n");
		}

		showComponent.value = cell_value;

		if (showComponent.callback) {
			try {
				eval(showComponent.callback + "\"" + cell_value + "\" )");
			} catch (exception) {
			}
		}
	}

	efwindow.hide();
}