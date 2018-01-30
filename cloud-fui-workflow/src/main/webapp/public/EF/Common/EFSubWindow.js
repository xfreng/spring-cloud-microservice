/**
 * @fileoverview This file is an example of how JSDoc can be used to document
 * JavaScript.
 *
 * @author Xia Hongzhong
 * @version 1.0
 */
/**
 * 返回对象
 *
 * @class EFSubWindow是 <hr/> 在每个页面应用的JS中的efform_onload函数中实例化当前的集合类
 *
 * <pre>
 * 示例代码：
 * var subWindow;//全局变量
 * efform_onload = function ()	{
 * 	subWindow = new EFSubWindow(&quot;subwindow_div&quot;,&quot;title&quot;,400,300);
 * }
 * </pre>
 *
 * <hr/>
 * @param {String}
 *            divId 对应DIV的ID
 * @param {String}
 *            title 标题
 * @param {int}
 *            w 窗口宽度
 * @param {int}
 *            h 窗口高度
 * @constructor
 * @return 返回一个subWindow类对象
 */
function EFSubWindow(divId, title, w, h) {

	this.divId = divId;
	this.div = document.getElementById(divId);
	this.title = title;
	this.w = w;
	this.h = h;
	this.returnValue;

	this.bgObj = newBgObj();
	this.msgObj = newMsgObj(this.div, this.bgObj, this.title, this.w, this.h);

	this.show = function(isShowModel) {
		this.msgObj.style.display = "";
		if (isShowModel) {
			this.bgObj.style.display = "";
		}
	}

	function onpropertychange() {
		if (window.returnValue) {
			alert(this.divId);
			alert(this.returnValue);
			this.returnValue = window.returnValue;
			// window.returnValue = null;
		}
	}

	this.hide = function() {
		this.msgObj.style.display = "none";
		this.bgObj.style.display = "none";
		return this.returnValue;
	}

	function newBgObj() {
		var iWidth = document.body.clientWidth;
		var iHeight = document.body.clientHeight;
		var bgObj = document.createElement("div");
		bgObj.style.cssText = "position:absolute;left:0px;top:0px;width:"
				+ iWidth
				+ "px;height:"
				+ Math.max(document.body.clientHeight, iHeight)
				+ "px;filter:Alpha(Opacity=30);opacity:0.3;background-color:#000000;z-index:101;";
		document.body.appendChild(bgObj);
		bgObj.style.display = "none";
		return bgObj;
	}

	function newMsgObj(div, bgObj, title, w, h) {
		//var titleheight = "0px"; // 提示窗口标题高度
		var bordercolor = "#666699"; // 提示窗口的边框颜色
		//var titlecolor = "#000000"; // 提示窗口的标题颜色
		//var titlebgcolor = "#666699"; // 提示窗口的标题背景色
		var bgcolor = "#FFFFFF"; // 提示内容的背景色

		var iWidth = document.body.clientWidth;
		var iHeight = document.body.clientHeight;

		var msgObj = document.createElement("div");
		msgObj.style.className = "bodyBackground";
		msgObj.style.cssText = "position:absolute;font:11px '宋体';top:"
				+ (iHeight - h) / 2 + "px;left:" + (iWidth - w) / 2
				+ "px;width:" + w + "px;height:" + h
				+ "px;text-align:center;border:1px solid " + bordercolor
				+ ";background-color:" + bgcolor
				+ ";padding:1px;line-height:22px;z-index:102;";
		document.body.appendChild(msgObj);

		var table = document.createElement("table");
		msgObj.appendChild(table);
		table.style.cssText = "margin:0px;border:0px;padding:0px;width:100%;";
		table.cellSpacing = 0;
		var tr = table.insertRow(-1);

		// 窗口标题
		var titleBar = tr.insertCell(-1);
		titleBar.style.cssText = "padding-left:8px;line-height:15px;text-align:left;font:bold 12px '宋体';color: #505050"
				+ ";border:0px solid #B3B3B3;cursor:move;background-image:url('EF/Images/bgline01.gif');";
		titleBar.style.width = "96%";
		titleBar.innerHTML = "- " + title;

		// “关闭”按钮
		var closeBtn = tr.insertCell(-1);
		closeBtn.style.cssText = titleBar.style.cssText;
		closeBtn.style.width = "4%";
		closeBtn.innerHTML = "<span style='cursor:hand;font-size:14pt;'>×</span>";
		closeBtn.onclick = function() {
			msgObj.style.display = "none";
			bgObj.style.display = "none";
		}

		var moveX = 0;
		var moveY = 0;
		var moveTop = 0;
		var moveLeft = 0;
		var moveable = false;
		var docMouseMoveEvent = document.onmousemove;
		var docMouseUpEvent = document.onmouseup;
		titleBar.onmousedown = function() {
			var evt = getEvent();
			moveable = true;
			moveX = evt.clientX;
			moveY = evt.clientY;
			moveTop = parseInt(msgObj.style.top);
			moveLeft = parseInt(msgObj.style.left);

			document.onmousemove = function() {
				if (moveable) {
					var evt = getEvent();
					var x = moveLeft + evt.clientX - moveX;
					var y = moveTop + evt.clientY - moveY;
					if (x > 0 && (x + w < iWidth) && y > 0 && (y + h < iHeight)) {
						msgObj.style.left = x + "px";
						msgObj.style.top = y + "px";
					}
				}
			};
			document.onmouseup = function() {
				if (moveable) {
					document.onmousemove = docMouseMoveEvent;
					document.onmouseup = docMouseUpEvent;
					moveable = false;
					moveX = 0;
					moveY = 0;
					moveTop = 0;
					moveLeft = 0;
				}
			};
		}

		var msgRow = table.insertRow(-1);
		var msgBox = msgRow.insertCell(0);
		msgRow.insertCell(1);
		msgBox.colSpan = "2";
		msgBox.appendChild(div);
		div.style.display = "";

		// 获得事件Event对象，用于兼容IE和FireFox
		function getEvent() {
			return window.event || arguments.callee.caller.arguments[0];
		}
		msgObj.style.display = "none";
		return msgObj;
	}

	this.msgObj.onpropertychange = onpropertychange;
}