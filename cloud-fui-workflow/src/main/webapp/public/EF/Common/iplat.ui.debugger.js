/**
 * JS调试类.
 * 
 * @author wuyicang
 */

/**
 * @class JS调试类.
 * @constructor 
 */
efdebugger = function()
{
	
}

/**
 * 是否调试标志.
 * @member efdebugger
 * @final
 * @type boolean
 */
__DEBUG = true;

/**
 * 显示调试信息窗口.
 * 
 * @return void.
 */
efdebugger.show = function(value)
{
	var div_node = efdebugger.getDebuggerDiv();
	
	var show_value = (!value)? __DEBUG_MSG.join( "\n" ):value;
	var inner_html = "";
	inner_html += "<TABLE cellspacing='0' cellpadding='1' style='width:280px;'>";
	inner_html += "<TR>";
	inner_html += "<TD align='left' id='containerOuter' style='width:240px;'>&nbsp;Debug&nbsp;</TD>";
	inner_html += "<TD align='right' id='containerOuter' style='width:40px;' class='ef-state-default'>" +
	  "<span class='ef-icon ef-icon-close' onclick='efwindow.hide();' style='float:right'></span>" + 
	  "<span class='ef-icon ef-icon-clear' onclick='efdebugger.clearAll();' style='float:right'></span>" + 
	  "</TD>";
	inner_html += "</TR>";
	inner_html += "<TR onmouseover='efform.nullfunction();' onclick='efform.nullfunction();' onmousemove='efform.nullfunction();' ><TD colspan=2>";
	inner_html += "<textarea wrap=\"hard\" style='width:100%;' rows=25 cols=50 id=\"subwindow_textarea\" >"+show_value+"</textarea>";
	inner_html += "</TD></TR>";
	inner_html += "</TABLE>";
	div_node.innerHTML = inner_html;
	//div_node.style.width = 300;
	//div_node.style.height = 400;
	efwindow.show( document.forms[0], div_node.id );
}

/**
 * 清除调试信息.
 * 
 * @return void.
 */
efdebugger.clearAll = function()
{
	__DEBUG_MSG = [];
	efdebugger.show();
}

/**
 * 获取调试窗口对应的Div层.
 * 
 * @return {Object} 对应id的Div层，若不存在将新建.
 */
efdebugger.getDebuggerDiv = function()
{
	var div_id = "ef_debugger";
	var div_node = $('#'+ div_id)[0];
	if( !div_node )
	{
		div_node = efform.createDivWindow( div_id, "efwindow" );
	}
	return div_node;
}