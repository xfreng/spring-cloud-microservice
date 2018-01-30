/**
 * 存放按钮对应函数的Map对象; Key 为按钮的英文名(ename); Value 为按钮对应的函数;
 * 
 * @private
 */
var button_functions = new Object();
/**
 * efbutton 对象构造函数
 * @class efbutton 类
 * @constructor
 */
efbutton = function() {
};

/**
 * 在页面的某DOM结点上构造一个按钮;
 * 
 * @param {Object} in_node: 放置该按钮的DOM结点，一般为一个TD;
 * @param {String} button_ename: 按钮英文名;
 * @param {String} button_cname: 按钮中文名;
 * @param {String} image_name: 按钮图片路径;
 * @param {String} layout: 按钮和按钮图标的显示方式;
 * @return         in_node对象的innerHTML将被改写.
 */
efbutton.newButton = function (in_node, button_ename, button_cname, image_name, layout, button_desc) {
    var button_node_id = "button_" + button_ename;

	if(button_desc == null || button_desc.trim() == "")
		button_desc = button_cname;
    var temp_html = "";
    if (button_ename != null) {
        temp_html += "<a id='" + button_node_id + "' title='"+  button_desc + "'>" + button_cname + "</a>";
    }

    var image_name_info = $.trim(image_name).toLowerCase().split(":");
    if (image_name_info.length == 1) {
      if (image_name_info[0] !== "") {
          temp_html += "&nbsp<IMG src='" + efico.get(image_name) + "'>&nbsp";
      }
    }

    $(in_node).append(temp_html);
    $(document).ready(function(){
    	//页面中可能存在id相同的按钮,选择器用$('[id=abc]')
	    $('[id=' +button_node_id+']').each( function () {
	    	var _showText = true;
	    	var _showIcon = { primary: null, secondary: null };
	    	switch (layout) {
	    	    case "1":
	    	    	_showText = true;
	    	    	_showIcon = { primary: null, secondary: null };
	    	    	break;
	    	    case "2":
	    	    	_showText = false;
	    	    	_showIcon =  {primary: image_name_info[1], secondary: null};
	    	    	break;
	    	    case "3":
	    	    	_showText = true;
	    	    	_showIcon =  {primary: image_name_info[1], secondary: null};
	    	    	break;
	    	    default:
	    	    	_showText = true;
    	    	    _showIcon = { primary: null, secondary: null };
	    	    	break;
	    	}
	    	var _button = null;
    		_button = $(this).button({
    		      icons: _showIcon,
    		      text:_showText
    		      });		    		
	    	_button.attr("ename", button_ename).attr("cname", button_cname).attr("desc", button_desc).addClass("ef-widget");
	    });
    });

    if (image_name == null) {
        button_functions[button_ename.toLowerCase()] = $("#" + button_node_id).button().click;
    }

    var buttonAuthStatus = in_node.getAttribute("buttonStatus");
    var bnode = $(in_node).find('a#'+button_node_id)[0];
    bnode.setAttribute("buttonStatus", buttonAuthStatus);
    efbutton.setButtonStatusByNode(bnode, button_ename, true);

};

// 按钮单击事件
/**
 * @param {String} button_ename 按钮英文名
 * @param {String} button_cname 按钮中文名
 * @param {String} path         按钮是否为自定义按钮(efbutton)
 */
efbutton.onClickButton = function(button_ename, button_cname, path) {
	var button_id = path=="efbutton"?button_ename : button_ename.toLowerCase();
	var func_name = "button_" + button_id + "_onclick";

	try {
		ef.get("efCurButtonEname").value = button_id.toUpperCase();
	} catch (ex) {
	}

	if (eval("typeof " + func_name) == "function") {
		// 置按钮状态为不可用状态
		efbutton.setButtonStatus(button_id, false, path);
		// 置页面提示
		efform.setStatus(999, getI18nMessages("ef.RunButton", "执行按钮") + "[" + button_cname + "]...");
		$("#button_" + button_id.toUpperCase()).addClass("loading");

		var preMsg = $('#_eiMsg').text();    //执行业务代码之前的消息栏内容
		eval(func_name + "(); ");
		// 2012/04/28 在dialog中，利用EFbutton来关闭该dialog时，
		// 在执行eval语句后，很多定义的参数会丢失，$、efform均不存在，为什么？
		// 在chrome中下面代码自动不执行，所以没问题，但在IE9、IE10中就会抛异常。
		// 没有找到更准确的原因，先加临时的解决方案
		if(typeof efform == 'undefined')
			return;
		var curMsg = $('#_eiMsg').text();    //执行业务代码之后的消息栏内容

		if (efform_submit_flag == false) {
			//判断在业务代码中有没有对消息栏进行强行注入消息的操作
			var custom_msg = false;
			if (preMsg != curMsg)
			{
				custom_msg = true;
			}
			efbutton.resetButton(button_id, button_cname, path,custom_msg);
		}
		
		$("#button_" + button_id.toUpperCase()).removeClass("loading");
		
	}else {
		alert(getI18nMessages("ef.ButtonNoEvent", "没有为按钮定义事件！"));
	}

};

/**
 * @param {Object} button_ename 按钮的英文名
 * @param {Object} button_cname 按钮的中文名
 * @param {bool} custom_msg   用户定义消息
 */
// 回置按钮状态和提示信息
efbutton.resetButton = function(button_ename, button_cname, path, custom_msg) {
	// 重新置按钮状态为可用状态
	efbutton.setButtonStatus(button_ename, true, path);

	//若用户向消息栏注入消息，则显示用户消息
	if (custom_msg)
	{
		var showtime = "3000";
		if (efform.config != undefined
				&& efform.config.MSG_SHOWTIME != undefined){
			showtime = efform.config.MSG_SHOWTIME;
		}
		if ($('#' + '_stickStatus').attr("stickStatus") == "w") {
			var new_time_id = setTimeout("$('#efFormStatus').slideUp()", 	showtime);
			$("#efFormStatus").attr("timeId", new_time_id);
		}
		return;
	}

	// 回置页面提示
	var msgStatus = $("#efFormStatus");
	if (msgStatus.length==0)
		return;
	
	var efform_status = $("#efFormStatus").attr("statusCode");
	if (efform_status == 999) {
		efform.setStatus(0, getI18nMessages("ef.FinishRunButton", "结束执行按钮")
						+ "[" + button_cname + "]");
	}
};

/**
 * 设置页面上按钮的状态;
 * @param {String} button_id: 按钮的id，对应按钮的英文名;
 * @param {Boolean} button_status: 按钮状态，true表示可用，false表示禁用;
 *            说明：按钮禁用时点击函数使用efform.nullfunction，该函数不做任何操作;
 * @exception 若对应的按钮对象在页面中不存在，将有Error异常抛出
 */
efbutton.setButtonStatus = function(button_id, button_status, path) {
	var button_name = path=="efbutton"? button_id : button_id.toUpperCase();
	var in_node = ef.get("button_" + button_name);
	efbutton.setButtonStatusByNode(in_node, button_id, button_status,path);
};

/**
 * @param {Object} in_node 按钮的DOM对象节点
 * @param {Object} button_id 按钮的id
 * @param {Object} button_status 按钮的状态
 */
efbutton.setButtonStatusByNode = function (in_node, button_id, button_status,path) {
    if (!isAvailable(in_node)) {
    	return;
    }
    
    var buttonAuthStatus = in_node.getAttribute("buttonStatus");
    var jButtonObj = $(in_node);
    
	if (button_status == false) {
		if (efbutton.config != undefined
				&& efbutton.config.HIDE_FORBIDDEN != undefined
				&& efbutton.config.HIDE_FORBIDDEN == "true") {
			jButtonObj.hide();
		} else {
			jButtonObj.button({ disabled: true }).attr("title", getI18nMessages("ef.ButtonForbid", "按钮被禁用！"));
			jButtonObj.unbind("click");
		}
	} else {
		if (buttonAuthStatus == "0") {
			if (efbutton.config != undefined
					&& efbutton.config.HIDE_NOAUTH != undefined
					&& efbutton.config.HIDE_NOAUTH == "true") {
				jButtonObj.hide();
			} else {				
				jButtonObj.button({ disabled: true }).attr("title", getI18nMessages("ef.ButtonNoAuth", "您没有权限使用！"));
				jButtonObj.unbind("click");
			}
		} else {
			jButtonObj.button({ disabled: false }).attr("title", jButtonObj.attr("desc"));
			// 只给有权限且没被禁止的按钮赋予事件
			jButtonObj.unbind("click");
			jButtonObj.click(function () {
				var button_cname = jButtonObj.attr("cname");
	    	    efbutton.onClickButton(button_id, button_cname,path);
	        	return false;
	    	});
		}
	}
    //addButtonEffect();
    
};

/**
 * 新建一个导航按钮，该方法用于grid中导航按钮的创建;
 * @param {efgrid} grid: 表格对象;
 * @param {String} action: 导航按钮点击的回调函数;
 * @param {Object} in_node: 放置该按钮的DOM结点，一般为一个TD;
 * @param {String} image_name: 导航按钮对应的图片名;
 * @return  in_node对象的innerHTML将被改写.
 */
efbutton.newNavButton = function(grid, action, in_node, image_name, image_id) {
	in_node.align = "center";
	in_node.noWrap = true;

	var temp_html = "<IMG id='" + image_id + "' src='"
			+ efico.get(image_name) + "' class='NavButton'";
	temp_html += " onmouseover=\"this.style.cursor='pointer';\" onclick='"
			+ action + "(\"" + grid.gridId + "\");'";
	temp_html += ">";

	in_node.innerHTML = temp_html;
};

/**
 * 新建一个不可用的导航按钮，该方法用于grid中导航按钮的创建;
 * @param {Object} in_node: 放置该按钮的DOM结点，一般为一个TD;
 * @param {String} image_name: 导航按钮对应的图片名;
 * @return  in_node对象的innerHTML将被改写.
 */
efbutton.newDisabledNavButton = function(in_node, image_name, image_id) {
	in_node.align = "center";
	in_node.noWrap = true;

	in_node.innerHTML = "<IMG id='" + image_id + "' src='"
			+ efico.get(image_name) + "' class='disabledNavButton'>";
};

/**
 * 新建一个文字导航按钮，该方法用于grid中导航按钮的创建;
 * @param {efgrid}  grid: 表格对象;
 * @param {String}  action: 按钮点击的回调函数;
 * @param {Object}  in_node: 放置该按钮的DOM结点，一般为一个TD;
 * @param {String}  button_text: 按钮显示文字;
 * @param {boolean} disabled: 指定该按钮是否可用;
 * @return void. in_node对象的innerHTML将被改写.
 */
efbutton.newNavTextButton = function(grid, action, in_node, button_text,
		disabled) {
	in_node.align = "center";
	in_node.noWrap = true;

	if (disabled) {
		in_node.innerHTML = "<span>&nbsp;" + button_text + "&nbsp;</span>";
	} else {
		var temp_html = "<A href='#' onclick='" + action + "(\"" + grid.gridId
				+ "\");'>";
		temp_html += "&nbsp;" + button_text + "&nbsp;</A>";
		in_node.innerHTML = temp_html;
	}
};

/**
 * 新建一个图片按钮;
 * @param {String} img_id: 图片id;
 * @param {String} img_name: 图片文件名;
 * @param {String} img_title: 图片的提示信息;
 * @param {String} action: 按钮点击的回调函数;
 * @param {String} para: 回调函数所用参数;
 * @return void. in_node对象的innerHTML将被改写.
 */
efbutton.newImgButton = function(img_id, img_name, img_title, action, para) {
	var inner_html = "<IMG id=\"" + img_id + "\" title=\"" + img_title
			+ "\" onmouseover=\"this.style.cursor='pointer';\" " + "onclick=\""
			+ action + "('" + para + "')\" " + "src=\"" + efico.get(img_name)
			+ "\" >";
	return inner_html;
};

/**
 * 新建一个图片按钮(大图裁剪);
 * 
 * @param {String}	img_id: 图片id;
 * @param {String}	img_class: 图片所属类;
 * @param {String}	img_title: 图片的提示信息;
 * @param {String}	action: 按钮点击的回调函数;
 * @param {String}	para: 回调函数所用参数;
 * @return	in_node对象的innerHTML将被改写.
 */
efbutton.newIconButton = function(img_id, img_class, img_title, action, para) {
	//jQueryUI模式
	var inner_html = "<span id=\"" + img_id + "\" title=\"" + img_title
			+ "\" onmouseover=\"this.style.cursor='pointer';\" " ;  

	if(action!=null || para!=null){
		//inner_html += "onclick=\"" + action + "('" + para + "')\" ";
		inner_html += "onclick=\"" + "efbutton.onClickIconButton('"
				   +img_title + "','" + action + "','" + para + "')\" ";
	}
	inner_html += "class='ef-icon "+ img_class + " ' >" + "</span>";
	
	return inner_html;
};

efbutton.onClickIconButton = function(img_title, action, para){
	efform.setStatus(999, getI18nMessages("ef.RunButton", "执行按钮") + "["
						+ img_title + "]...");
	eval(action + "('" + para + "');");
	addButtonEffect();
};

/**
 * 用jQuery给页面上的按钮控件添加样式
 */
function addButtonEffect() {
	var lastActive;

//		$('.ef-state-default.ef-icon').addClass('ef-cornerredius-all');
		$('.ef-state-default.ef-grid-funcImgButtonTD').addClass('ef-cornerredius-all');

		
	//普通按钮悬停、按下效果
		$('.ef-button-disabled').addClass('ef-cornerredius-all ef-state-disabled');
		$('.ef-button').addClass('ef-cornerredius-all ef-state-default');
		
	//表头按钮悬停、按下效果
		//$('.ef-grid-tableHeaderColumn').addClass('ef-state-default');
		
		
		$('.ef-grid-functable').addClass('ef-cornerredius-all');
		
		//图片按钮效果
		$('.ef-state-default').bind( "mouseenter.button", function() {
			   if($(this).is(".ef-state-disabled") || ($(this).is(".ui-state-disabled"))) {
				   return;
			   }

			   $( this ).addClass( "ef-state-hover" );
			   if ( this === lastActive ) {
				   $( this ).addClass( "ef-state-active" );
			   }

		   })
		   .bind( "mouseleave.button", function() {

			   $( this ).removeClass("ef-state-hover");
			   $( this ).removeClass("ef-state-active");
		   })
		   .bind( "mousedown.button", function() {
			   if($(this).is(".ef-state-disabled"))
					  return;
			   $( this ).addClass( "ef-state-active" );
			   lastActive  =  this;
			   $( document ).one( "mouseup", function() {
				   lastActive = null;
			   });
		   })
		   .bind( "mouseup.button", function() {

			   $( this ).removeClass( "ef-state-active" );

		   });
		   
		//jQueryUI按钮权限设置
		$('.ef-button-disabled button').button( "option", "disabled", true );
		$('.ef-button button').button( "option", "disabled", false );
		
};