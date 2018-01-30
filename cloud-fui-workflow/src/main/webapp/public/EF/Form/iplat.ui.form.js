/**
 * 页面控制
 * @author wuyicang.
 */

/* */
var ef_form_init_time = new Date();
/* 页面校验信息Map对象 */
var ef_form_validate_message = new Object();
/* 页面表格Map对象 */
var ef_grids = new Object();
/* 页面配置Map对象 */
var ef_config = new Object();
/* 页面调试标志 */
var __DEBUG = false;
/* 页面调试信息 */
var __DEBUG_MSG = [];
/* 隐藏头时消息隐藏标志 */
var hidemsg = false;


/**
 * @class ef 该类提供对DOM的基本操作方法
 * @constructor
 */
ef = function () {
};

/**
 * 根据id获得DOM结点对象.
 * @param {String} node_id : 结点id;
 * @return {Object} DOM结点对象.
 */
ef.getNodeById = function (node_id) {
    var node_get = ef.get(node_id);
    if (!node_get)
        alert("ID[" + node_id + "] not exist");

    return node_get;
};

/**
 * 根据id获得DOM结点对象.
 * @param {String} node_id : 结点id;
 * @return {Object} DOM结点对象.
 */
ef.get = function (node_id) {
    var node_get = document.getElementById(node_id);
    if (!node_get) {
        var nodelist = document.getElementsByName(node_id);
        if (nodelist.length > 0)
            node_get = nodelist[0];
    }
    return node_get;
};

/**
 * 增加DEBUG调试信息.
 * @param {String} msg 调试信息;
 * @return void.
 */
ef.debug = function (msg) {
    ef.log("[DEBUG] - " + msg);
};

/**
 * 显示或隐藏DIV
 * @param {String} divId : DIV层对应的id;
 * @return void.
 */
ef.toggleDivDisplay = function (divId) {
    var node = ef.get(divId);
    if (node.style.display == "none")
        node.style.display = "block";
    else
        node.style.display = "none";
};

/**
 * 增加INFO调试信息.
 * @param {String} msg 调试信息;
 * @return void.
 */
ef.info = function (msg) {
    ef.log("[INFO] - " + msg);
};

/**
 * 增加一般调试信息
 * @param {String}  msg 调试信息;
 * @return void.
 */
ef.log = function (msg) {
    if (__DEBUG)
        __DEBUG_MSG.push(msg);
};

/**
 * @class efform 该类提供对页面数据的基本操作函数
 * @constructor
 */
efform = function () {
};

/**
 * 页面提交标志.
 * @type boolean
 * @final
 */
var efform_submit_flag = false;

/**
 * 弹出页面遮盖层
 * @private
 * @return void
 */
efform.showOverlay = function () {
    $("#efFormLoadingDiv").height('108px').width("200px").css('z-index', "9992").animate({
        opacity: 1
    }, 250);
    ;
    $("#efFormLoadingOverLay").height('100%').animate({
        opacity: 0.5
    }, 250);
    ;
}

/**
 * 关闭页面遮盖层
 * @private
 * @return void
 */
efform.hideOverlay = function () {
    $("#efFormLoadingDiv").animate({
        opacity: 0
    }, 250, function () {
        // Animation complete.
        $("#efFormLoadingDiv").height(0);
        $("#efFormLoadingDiv").width(0);
        $("#efFormLoadingDiv").css('z-index', "-1");

    });
    ;
    $("#efFormLoadingOverLay").animate({
        opacity: 0
    }, 250, function () {
        // Animation complete.
        $("#efFormLoadingOverLay").height(0);
    });
    ;
}

/**
 * 该方法用户提交当前页面
 * @private
 * @param {Object} formSubmit
 * @return void
 */
efform.submit = function (formSubmit) {
    //检查是否超时
    if (efgrid.config != undefined
        && efgrid.config.SESSION_TIMEOUT != undefined) {
        if (checkTimeOut()) {
            return;
        }
    }
    efform_submit_flag = true;

    // 后台导出服务会修改返回的url，使得前台不刷新，弹出层会一直存在；
    // 碰到导出方法，不加载弹出层。先临时解决吧，待完善啊！
    if ($("#methodName").val().indexOf("export") < 0) {
        //提交前弹出遮盖层
        $('#efFormStatus').dialog('close');
        efform.showOverlay();
    }
    formSubmit.submit();
};

/**
 * 页面加载后的初始化处理函数
 * @private
 * @return void.
 */
efform.onload = function () {

    var ef_form_load_time = new Date();

    ef.debug("ef("
        + ef_version
        + ") form took: "
        + (ef_form_load_time.getTime() - ef_form_init_time.getTime())
            .toString() + "ms to load");

    /* 设置统一的页面标题 */
    efform.setFormTitle();

    /* 禁用右键 */
    //document.oncontextmenu = new Function("return false");

    efform._clientWidth = document.body.clientWidth;

    efform.__loadSuccessFlag = true;
    /* 调用指定回调函数 */
    if (typeof efform_onload == "function") {
        try {
            efform_onload();
        } catch (ex) {
            efform.__loadSuccessFlag = false;
            var showErrorException = true;
            if (__eiInfo) {
                //判断是否处于自动化测试状态 如果是 就不显式报错
                var runAutoTestFlag = __eiInfo.get("efRunAutoTestFlag");

                if (runAutoTestFlag == "1")
                    showErrorException = false;
            }
            if (showErrorException)
                efgrid.processException(ex, "Callback to efform_onload failed");
        }
    }
    try {
        if (__eiInfo != undefined && __eiInfo.status < 0
            && efform.msgDisplayStyle == "alert")
            EFAlert("status_code:" + $("#_eiMsgKey")[0].innerHTML + "\nmsg:"
                + $("#_eiMsg")[0].innerHTML);
    } catch (ex) {
    }

    //关闭遮盖层 20130709
    efform.hideOverlay();
};

/**
 * 如果页面没有设置标题，置为统一的标题
 * @private
 * @return void.
 */
efform.setFormTitle = function () {
    try {
        if (efutils.trimString(window.document.title) == "") {
            window.document.title = ef.get("efFormEname").value + "/"
                + ef.get("efFormCname").value + "[" + window.location.host
                + "]";
        }
    } catch (ex) {
    }
};

/**
 * 设置页面标题.
 * @return void.
 */
efform.setPageTitle = function (title) {
    ef.get("pageTitle").innerText = title;
};

/**
 * 隐藏标题栏.
 * @return void.
 */
efform.hideFormHead = function (hide) {
    ef.get("ef_form_head").style.display = 'none';
    if (hide == undefined) {
        hidemsg = true;
    }
    else {
        hidemsg = hide;
    }

};

/**
 * 重绘页面的全部表单
 * @private
 * @return void.
 */
efform.repaint = function () {
    ef_form_init_time = new Date();
    for (var key in ef_grids) {
        if (key != "_ef_grid_subgrid"
            && (typeof ef_grids[key].paint != 'undefined'))
            ef_grids[key].paint();
    }

    var ef_form_load_time = new Date();
    ef.debug("ef(" + ef_version + ") form took: "
        + (ef_form_load_time.getTime() - ef_form_init_time.getTime())
        + "ms to load");

};

/**
 * 增加运行时间和调试信息
 * @private
 * @param {String} msg_info : 调试信息.
 * @return void.
 */
efform.alertTime = function (msg_info) {
    var ef_form_load_time = new Date();

    ef.debug(msg_info
        + (ef_form_load_time.getTime() - ef_form_init_time.getTime()));
};

if (isIE) {
    /**
     * @private
     */
    efform.RESIZE_INTERVAL = 300;
    /**
     * @private
     */
//	efform.RESIZE_SCALE = 1;
}

efform.RESIZE_SCALE = 1;

/**
 * 初始化方法
 *
 * @private
 * @return void.
 */
efform.init = function () {
    window.onload = efform.onload;

    window.onresize = function () {
        if (!efform._clientWidth || Math.abs(document.body.clientWidth - efform._clientWidth) < efform.RESIZE_SCALE)
            return;

        efform._clientWidth = document.body.clientWidth;
        efform.repaint();
    };
};

/**
 * efform处理window.resize的实现for IE)
 *
 * @private
 * @return void
 */
efform._resize = function () {
    // if not resize more than RESIZE_INTERVAL
    if (new Date() - efform._resizeTime > efform.RESIZE_INTERVAL) {
        clearInterval(efform._resizeInterval); // clear resize interval
        efform._resizeInterval = undefined;
        efform.repaint();
    }
};

//如果初始值不变表明这段时间内没有新的信息提示
efform._statusInfoCount = 0;
/**
 * 设置页面状态
 *
 * @param {Number}
 *            status_code : 状态代码
 * @param {String}
 *            msg : 状态消息
 * @param {String}
 *            msgKey : 消息键值
 * @param {String}
 *            ef_form_ename : 显示的页面名
 * @return void.
 */
efform.setStatus = function (status_code, msg, msgKey, ef_form_ename) {
    //如果消息为空 则返回
    msg = efutils.trimString(msg);
    if (msg == "") {
        return;
    }

    //如果是iframe内的窗口，判断是否能转给主窗口
    if ($(document.body).hasClass("ef-form-iframe-body")) {
        var msgBody = $('#efFormStatus', window.parent.parent.document);
        //判断父窗口的消息窗口是否提供showMsg事件，如果有就调用父窗口消息提示函数
        if (msgBody.length > 0 && parent.efform) {
            parent.efform.setStatus(status_code, msg, msgKey, ef.get("efFormEname").value);
            return;
        }
        ;
    }

    var status_img = $("#_eiStatusImg");
    if (!status_img || status_img.length == 0) {
        return;
    }

    var old_status_code = $("#efFormStatus").attr("statusCode");
    var exist_time_id = $("#efFormStatus").attr("timeId");
    efform._statusInfoCount++;

    if (!old_status_code) {
        //$("#efFormStatus").addClass("ui-corner-all");
    } else {
        if (old_status_code == 0) {
            $("#efFormStatus").removeClass("ui-state-default");
        } else if (old_status_code < 0) {
            $("#efFormStatus").removeClass("ui-state-error");
        } else if (old_status_code > 0) {
            $("#efFormStatus").removeClass("ui-state-highlight");
        }
    }

    if (status_code == 0) {
        $("#efFormStatus").addClass("ui-state-default");
        status_img.removeClass().addClass('ui-icon  ui-icon-info');
    } else if (status_code < 0) {
        $("#efFormStatus").addClass("ui-state-error");
        status_img.removeClass().addClass('ui-icon  ui-icon-alert');
    } else if (status_code > 0) {
        $("#efFormStatus").addClass("ui-state-highlight");
        status_img.removeClass().addClass('ui-icon  ui-icon-notice');
    }

    if (status_code < 0 && efform.msgDisplayStyle == "alert")
        EFAlert("status_code:" + status_code + "\n msg:" + msg);

    if (!msgKey)    msgKey = "";
    ef.get("_eiMsgKey").innerText = msgKey;

    if (ef_form_ename != null) {
        ef.get("_efFormEname").innerText = ef_form_ename;
    } else {
        if (ef.get("efFormEname") != null) {
            ef.get("_efFormEname").innerText = ef.get("efFormEname").value;
        }
    }

    var msgAcc = "false";
    if (efform.config != undefined && efform.config.MSG_ACCUMULATE != undefined) {
        msgAcc = efform.config.MSG_ACCUMULATE;
    }
    if (msgAcc == "false" ||                                          // 设置消息为不累加模式
        typeof($("#efFormStatus").attr("statusCode")) == 'undefined' || // 页面初次加载
        $("#efFormStatus").attr("statusCode") >= 0 ||         //正常消息或警告消息(含平台消息999)
        !$("#efFormStatus").dialog('isOpen'))    // 消息框关闭状态
    {
        ef.get("_eiMsg").innerHTML = msg;
        $("#efFormStatus").attr("statusCode", status_code);
    }
    else {
        ef.get("_eiMsg").innerHTML = ef.get("_eiMsg").innerHTML + "<br/>" + msg;
        status_code = $("#efFormStatus").attr("statusCode");
    }

    if (!hidemsg) {
        //隐藏详细信息区
        $("#efFormDetailDiv").hide();

        //弹出消息区
        $("#efFormStatus").//attr("statusCode", status_code).
            css('overflow', 'hidden').dialog({
                // 不要标题栏
                create: function (event, ui) {
                    //$("#efFormStatus").find(".ui-widget-header").hide();
                    $(this).parent().find('.ui-dialog-titlebar').remove();
                },
                //不显示focus状态
                open: function () {
                    $('#efFormStatus a').blur();
                },
                dialogClass: "ef-form-status-bar",
                position: ["auto", 0],
                width: "500",
                minHeight: "auto",
                resizable: false
            }).parent().attr("id", "efFormStatusDialog");

        //$("#efFormStatus").show();
    }

    // 设置定时关闭计时器
    if (exist_time_id) {
        clearTimeout(exist_time_id);
    }
    if (status_code == 0) {
        var showtime = "3000";
        if (efform.config != undefined
            && efform.config.MSG_SHOWTIME != undefined) {
            showtime = efform.config.MSG_SHOWTIME;
        }
        if ($('#' + '_stickStatus').attr("stickStatus") == "w") {
            //var new_time_id = setTimeout("$('#efFormStatus').dialog('close')", 	showtime);
            var new_time_id = setTimeout("$('#efFormStatus').slideUp()", showtime);
            $("#efFormStatus").attr("timeId", new_time_id);
        }
    }

};

/**
 * 获得页面上所有表格对象的id.
 * @private
 * @return {Array} 页面上所有表格对象的id.
 */
efform.getAllGridIDs = function () {
    var grid_ids = [];
    for (var key in ef_grids) {
        if (key != "_ef_grid_subgrid")
            grid_ids.push(key);
    }

    return grid_ids;
};

/**
 * 向页面中添加一个表格对象
 * @private
 * @param {efgrid} grid : 表格对象;
 * @return void.
 */
efform.addGrid = function (grid) {
    ef_grids[grid.gridId] = grid;
};

/**
 * 根据id在页面范围获取表格对象
 * @private
 * @param {String} grid_id 表格对象id;
 * @return {efgrid} 对应的表格对象
 * @exception 当对应的表格对象不存在时，抛出Error.
 */
efform.getGrid = function (grid_id) {
    var grid = ef_grids[grid_id];
    if (!isAvailable(grid))
        throw new Error("Grid with id [" + grid_id + "] not exists!");

    return grid;
};

/**
 * 删除页面中的一个表格对象
 * @private
 * @param {String}  grid_id : 表格对象的id;
 * @return void.
 */
efform._removeGrid = function (grid_id) {
    delete ef_grids[grid_id];
};

/**
 * 清除DIV层中所有输入域的内容
 * @param {String} div_id : DIV层的id;
 * @return void.
 */
efform.clearDiv = function (div_id) {
    try {
        var div_node = $("#" + div_id)[0];
        efform.clearInputField(div_node);
    } catch (exception) {
        alert(exception.message);
    }
};

/**
 * 清除一个DOM结点中所有输入域的内容
 * @private
 * @param {Object} node : DOM结点对象;
 * @return void.
 */
efform.clearInputField = function (node) {
    if (node.tagName == "SELECT")
        node.selectedIndex = node.options.length > 0 ? 0 : -1;

    switch (node.tagName) {
        case "INPUT":
            switch (node.type) {
                case "text":
                case "file":
                case "password":
                    break; // ->case "TEXTAREA": node.value = ""

                case "checkbox":
                case "radio":
                    node.checked = false; // ->default: return
                case "hidden":            //对flexbox要进行特别处理
                    if ($(node).data('spec') != undefined && $(node).data('spec') == 'flexbox') {
                        node.value = "";
                    }
                default: // hidden, button, submit, reset, image
                    return;
            }
        case "TEXTAREA":
            node.value = "";
            break;
        case "SELECT":
            node.selectedIndex = (node.options.length > 0) ? 0 : -1;
            break;
        default:
            for (var i = 0; i < node.childNodes.length; i++)
                efform.clearInputField(node.childNodes[i]);
    }
};

/**
 * 判断页面校验是否有错误发生
 * @private
 * @return {boolean} true表示校验有错误，false表示无错误
 */
efform.hasErrorMessage = function () {
    for (var key in ef_form_validate_message)
        return true;

    return false;
};

/**
 * 显示校验错误信息.
 * @private
 * @return void.
 */
efform.showErrorMessage = function () {

    if (efform.hasErrorMessage()) {
        var message = [];

        for (var key in ef_form_validate_message) {
            message.push("* " + ef_form_validate_message[key]);
        }

        efform.setStatus(-1, message.join('\t'));
    }
};

/**
 * 设置下拉多选框所在DIV的宽度.
 * @private
 * @return
 */
efform.setSelectDiv = function (selectID) {

    if ($.browser.msie) {
        try {
            //为解决自定义表单中下拉框后面的必填星号换行，暂时给下拉框所在div增加25px的宽度
            //var selectWidth = document.getElementById(selectID).style.width + 25;
            //去掉默认的25px ,以解决当下拉框未定义宽度后宽度固定为25px,当小于下拉框内容实际宽度而被压缩问题
            var selectWidth = document.getElementById(selectID).style.width;
            var containedDivID = "div_" + selectID;
            //将下拉框的宽度和下拉框所在DIV的宽度设置成相同
            $('#' + containedDivID).css('width', selectWidth.toString());
        } catch (ex) {

        }
    }
};

/**
 * 设置元素的出错样式.
 * @private
 * @return
 * @argument node 当前元素。
 * @argument 出错信息。
 * @argument 校验状态 true:正确;false:出错
 */
efform.setErrorStyle = function (node, msg, status) {
    if (node instanceof Array)
        for (var i = 0; i < node.length; i++)
            efform.setErrorStyleSingleElement(node[i], msg, status);
    else
        efform.setErrorStyleSingleElement(node, msg, status);
};

efform.setErrorStyleSingleElement = function (node, msg, status) {
    if (node == null)
        return;

    if (!status) {
        //由于下拉框比较特殊，所以需要特殊处理
        if (node.type == "select-one") {
            //下拉框的特殊性是由于IE不支持Select的Border属性引起的，所以需要判断下是否是IE浏览器
            if ($.browser.msie) {
                var selectDivId = "div_" + node.id;
                var selectDiv = $("#" + selectDivId);
                var width = node.style.width;

                selectDiv.css({'border': 'red solid 1px', 'width': width.toString()});

                //不仅SELECT的颜色要改变，下拉选项的颜色也要变
//				jQuery(node).css("color", jQuery(node).children("option:selected").css("color","red")); 
            }
            else {
                //不清除原有样式 但可将ef-state-error中样式设为important
                //$(node).removeClass();
                $(node).addClass('ef-state-error');

            }

        }
        else if (node.type == "radio" || node.type == "checkbox") {
            $('label[for="' + node.id + '"]').addClass('ef-state-error');
        }
        else//如果不是下拉框，直接设置样式
        {
            //不清除原有样式 但可将ef-state-error中样式设为important
            //$(node).removeClass();
            $(node).addClass('ef-state-error');

        }

        //不管是下拉框还是非下拉框控件，都要设置title的
        node.title = msg;
    }
    else  //如果状态完好
    {
        if (node.type == "select-one") {
            if ($.browser.msie) {
                //只要是下拉框，不关是IE还是其他浏览器，总是要置位的
                var selectDivId = "div_" + node.id;
                var selectDiv = $("#" + selectDivId);
                var width = node.style.width;
                selectDiv.css({'borderColor': '', 'borderStyle': ''});
                node.style.backgroundColor = "";
            }
            else {
//				node.style.borderColor = "";
//				node.style.borderStyle = "";
//				node.style.backgroundColor = "";

                $(node).removeClass('ef-state-error');

            }

        }
        else if (node.type == "radio" || node.type == "checkbox") {
            $('label[for="' + node.id + '"]').removeClass('ef-state-error');
        }
        else {
//			node.style.borderColor = "";
//			node.style.borderStyle = "";
//			node.style.backgroundColor = "";

            $(node).removeClass('ef-state-error');

        }
        node.title = msg;
    }

};


/**
 * 获取出错信息.
 * @private
 * @return 出错信息
 */
efform.getErrorMessage = function () {

    if (efform.hasErrorMessage()) {
        var message = [];
        var i = 0;
        for (var key in ef_form_validate_message) {
            if (i != 0)
                message.push("\n");
            else
                i = 1;
            message.push("* " + ef_form_validate_message[key]);
        }
        return message.join('');
    }
    return "";
};

/**
 * 清空校验错误信息.
 * @private
 * @return void.
 */
efform.clearErrorMessage = function () {
    for (var key in ef_form_validate_message)
        delete ef_form_validate_message[key];

    //关闭提示
    //$('#efFormStatus').dialog('close');
};

/**
 * 页面异常处理函数.
 * @private
 * @param {String} msg : 异常消息;
 * @param {String} url : 异常发生的页面url;
 * @param {String} line : 异常发生的代码位置
 * @return void.
 */
efform.windowOnError = function (msg, url, line) {
    if (__DEBUG) {
        throw new Error(msg);
    } else {
        alert("javascript exception: " + msg);
        return true;
    }
};

/**
 * @private
 * @param {Object} nav
 */
efform.togglenav = function (nav) {
    try {
        if (isAvailable(__DEBUG))
            efdebugger.show();
    } catch (ex) {
        // TODO
    }
};

/**
 * 刷新页面.
 * @private
 * @return void.
 */
efform.formRefresh = function () {
};

/**
 * 打印页面.
 * @private
 * @return void.
 */
efform.formPrint = function () {
};

/**
 * 获得渲染子表格的DIV层对象
 * @private
 * @return {Object} : 子表格的DIV层对象
 */
efform.getSubGridDiv = function (title, divid) {
    var div_id = "ef_subgrid";
    if (!!divid) div_id = divid;
    var div_node = $("#" + div_id);
    if (div_node.length == 0) {
        div_node = efform.createDivWindow(div_id, "efwindow", title);
        return div_node;
    }

    // 防止jsp页面自定义弹出框重复渲染
    div_node.find("script").remove();
    return div_node[0];
};

/**
 * 获得渲染子表格的DIV层对象
 * @private
 * @return {Object} : 子表格的DIV层对象
 */
efform.getSubDiv = function (div_id, title) {

    if (div_id == null || div_id == undefined || div_id == "")
        return;

    var div_node = $("#" + div_id);
    if (div_node.length == 0) {
        div_node = efform.createDivWindow(div_id, "efwindow", title);
        return div_node;
    }

    // 防止jsp页面自定义弹出框重复渲染
    div_node.find("script").remove();
    return div_node[0];
};

/**
 * 创建DIV层窗口
 * @private
 * @param {String} div_id : div层的id;
 * @param {String} styleClassName : div层的样式名称;
 * @return {Object} : DIV层对象
 */
efform.createDivWindow = function (div_id, styleClassName, title) {
    var ef_subwindow = $("#" + div_id)[0];
    if (ef_subwindow)
        throw new Error("Element with id [" + div_id + "] already exists!");

    //改成jquery样式构造
    ef_subwindow = $("<div>&nbsp;</div>").attr("id", div_id).attr("title", getI18nMessages("ef.Select", "请选择"));

    //为避免页面中没有form导致出错的情况，改成jquery写法 20140104
    $("body").append(ef_subwindow);
    ef_subwindow.dialog({
        autoOpen: false,
        height: 200,
        width: 300
    });

    return ef.get(div_id);
};

/**
 * 显示子表格DIV窗口.
 * @private
 * @param {String} component_id : 对应的页面DOM对象id;
 * @param {EIInfo} eiInfo : Grid显示的数据源;
 * @return void.
 */
efform.showSubGridWindow = function (component_id, eiInfo) {
    var component = $("#" + component_id)[0];

    if (!component)
        return;
    var div_node = efform.getSubGridDiv();
    var column_new = div_node.efDisplayCol;
    var column_old = div_node.efDisplayingCol;

    // 当subgrid框隐藏时，查找其兄弟节点，与subgridcolumn保持一致
//	var siblingNode = null;
// 	if (component.style.display == "none"){
// 		siblingNode = component.nextSibling;
// 		while(siblingNode != null && siblingNode.nodeType != 1){
// 			siblingNode = siblingNode.nextSibling;
// 		};
// 	}
    if (column_old != null && column_old == column_new) {
        // 添加fixed参数保证滚动时subgrid也跟着移动
//		if (siblingNode != null)
//			efwindow.show(siblingNode, div_node.id, "fixed");
//		else
        efwindow.show(component, div_node.id, "fixed");
        return;
    }

    if (!(column_new instanceof efSubgridColumn))
        return;

    div_node.efDisplayingCol = column_new;

    var title = getI18nMessages("ef.Select", "请选择");
    var inner_html = [];
    inner_html.push("<div id='_ef_grid_subgrid' title='"
        + column_new.getCname()
        + "' style='overflow:hidden;width:500px;height:280px;'></div>");

    var button_json = [
        {
            text: getI18nMessages("ef.Save", "保存"),
            click: function () {
                efform.subgrid_save_onclick();
            }
        }
    ];

    div_node.innerHTML = inner_html.join("");

    var style_config = new Object();
    style_config["operationBar"] = "false";

    var sub_grid = new efgrid(column_new.getBlockName(), "_ef_grid_subgrid");
    var custom_cols = {
        "index": {},
        "metas": []
    };
    sub_grid.setEnable(false);
    sub_grid.setReadonly(false);
    sub_grid.setAjax(true);
    sub_grid.setAutoDraw(true);
    sub_grid.setServiceName(column_new.getServiceName());
    sub_grid.setQueryMethod(column_new.getQueryMethod());
    sub_grid.setCustomColumns(custom_cols);

    // 设置subGrid标识
    sub_grid.setIsSubGrid(true);

    // 在此添加方法，替代grid双击行回调
    sub_grid.onRowDblClicked = function () {
        efform.subgrid_save_onclick();
    };

    // 20080805增加判断是否有传入eiInfo,如没有再从页面中取
    if (typeof (eiInfo) == "undefined") {
        sub_grid.setData(_getEi());
    } else {
        sub_grid.setData(eiInfo);
    }
    sub_grid.setStyle(style_config);
    sub_grid.paint();
    // 添加fixed参数保证滚动时subgrid也跟着移动
//	 if(siblingNode!=null)
//	 	efwindow.show( siblingNode, div_node.id, "fixed", title, button_json);
//	 else
    efwindow.show(component, div_node.id, "fixed", title, button_json);
};

/**
 * 显示input框的子表格DIV窗口.
 * @private
 * @param {String} bindId : 对应的input框的数据绑定ID；
 * @return void.
 */
efform.showInputSubGridWindow = function (bindId) {

    //兼容性检查，看看是否单独定义了处理函数
    if (typeof openSubGrid == "function") {
        openSubGrid();
        return;
    }

    var _input = $("#" + bindId)[0];
    if (!_input) return;

    var bindingInputId = "inqu_status-0-form_ename";
    var inInfo = new EiInfo();
    //设置查询条件
    inInfo.setById(bindId);

    var serviceName = $(_input).attr("serviceName");
    var queryMethod = $(_input).attr("queryMethod");
    EiCommunicator.send(serviceName, queryMethod, inInfo);
    if (ajaxEi == null) return;

    var subGridColumn = new efSubgridColumn();

    var eiColumn = new EiColumn();
    //指定数据返回块
    eiColumn.blockName = $(_input).attr("blockName");
    subGridColumn.setEiMeta({}, eiColumn);

    subGridColumn.set("serviceName", serviceName);
    subGridColumn.set("queryMethod", queryMethod);

    //预选定的列名称
    subGridColumn.set("valueProperty", $(_input).attr("ename"));

    var div = efform.getSubGridDiv();
    div.efDisplayCol = subGridColumn;
    efform.showSubGridWindow(bindingInputId, ajaxEi);
};

/**
 * 显示长文本编辑DIV窗口.
 * @private
 * @param {String} component_id : 对应的页面DOM对象id;
 * @return void.
 */
efform.showTextAreaWindow = function (component_id) {
    var component = $("#" + component_id)[0];
    if (!component)
        return;

    var title = getI18nMessages("ef.Detail", "详情");
    var div_node = efform.getSubGridDiv(title);

    var show_value = component.value;
    var index = show_value.indexOf(EF_CR_IDENTIFIER);
    while (index != -1) {
        show_value = show_value.substring(0, index) + "\r\n"
            + show_value.substring(index + 2);
        index = show_value.indexOf(EF_CR_IDENTIFIER);
    }

    var inner_html = [];
    inner_html.push("<div style='width:320px;text-align:center'>");
    inner_html
        .push("<textarea wrap=\"hard\" rows=10 cols=50 style='width:100%;height:140px;margin-top:1px;margin-bottom:0px' id=\"subwindow_textarea\" >"
            + show_value + "</textarea>");
    //inner_html.push("<a type=\"button\" onclick='efform.textarea_save_onclick();' >"
    //		+ getI18nMessages("ef.Save", "保存") + "</a>");
    inner_html.push("</div>");
    div_node.innerHTML = inner_html.join("");
    var button_json = [
        {
            text: getI18nMessages("ef.Save", "保存"),
            click: function () {
                efform.textarea_save_onclick();
            }}
    ];
    // 添加fixed参数保证滚动时subgrid也跟着移动
    efwindow.show(component, div_node.id, "fixed", title, button_json);
};

/**
 * 显示长文本编辑DIV窗口.
 * @private
 * @param {String} component_id : 对应的页面DOM对象id，或者对应的Dom对象。
 * @param {String} treeModel : 树的treeModel。
 * @param {String} treeDivId : 树的treeDivId。
 * @param {String} sText : 树的sText。
 * @param {String} refresh : 弹出框中的内容是否每次弹出时都需要重新刷新（true：刷新）。
 * @return void.
 */
efform.showSubTreeWindow = function (component_id, treeModel, treeDivId, sText, refresh, configFunc) {

    if ((typeof component_id) == "string")
    // component_id为string时，处理为Dom对象的Id。
        var component = $("#" + component_id)[0];
    else
        component = component_id;// component_id为string时，处理为Dom对象。
    if (!component)
        return;
    var title = getI18nMessages("ef.Detail", "详情");
    var div_node = efform.getSubDiv("ef_subTree" + treeDivId, title);

    if ((refresh == true) || (div_node.innerHTML == "&nbsp;")) {
        var inner_html = [];
        inner_html.push("<TABLE cellspacing='0'  cellpadding='1'>");
        //inner_html.push("<TR>");
        //inner_html.push("<TD align='left' id='containerOuter'>&nbsp;"
        //		+ getI18nMessages("ef.Detail", "详情") + "&nbsp;</TD>");
        //inner_html.push("<TD align='right' id='containerOuter'><IMG src='"
        //		+ efico.get('efcalendar.closeImg')
        //		+ "' onclick='efwindow.hide();'/></TD>");
        //inner_html.push("</TR>");
        inner_html.push("<TR><TD colspan=2>");
        inner_html
            .push("<DIV style='overflow:auto;height:280px;width:250px;'id='"
                + treeDivId + "'/>");
        inner_html.push("</TD></TR>");
        inner_html.push("</TABLE>");
        div_node.innerHTML = inner_html.join("");
        var tree = new EFTree(treeModel, treeDivId, sText);
        eval(configFunc + "(tree)");
        var skeleton = tree.render();
        if (treeModel.status() == -1) {
            return;
        }
        $('#' + treeDivId).append(skeleton);
    }
    // 添加fixed参数保证滚动时subgrid也跟着移动
    efwindow.show(component, div_node.id, "fixed", title);
};

/**
 * 显示长文本编辑DIV窗口.
 * @private
 * @param {String} component_id : 对应的页面DOM对象id，或者对应的Dom对象。
 * @param {String} treeModel : 树的treeModel。
 * @param {String} treeDivId : 树的treeDivId。
 * @param {String} sText : 树的sText。
 * @param {String} refresh : 弹出框中的内容是否每次弹出时都需要重新刷新（true：刷新）。
 * @return void.
 */
efform.showPopupWindow = function (popupContentId, input_id, title) {
    var component = $("#" + input_id)[0];
    if (!component)
        return;
    var div_node = efform.getSubDiv(popupContentId);

    div_node.relativePopupParent = component;
//	if (component.nextSibling != null 
//			&& component.nextSibling.style.display != 'none')
//		efwindow.show(component.nextSibling, div_node.id, "fixed");
//	else
    efwindow.show(component, div_node.id, "fixed", title);

    addButtonEffect();
};

efform.showPopupGridWindow = function (popupContentId, input_id, visibleColumnNames, visibleColumnDisplayNames, valueProperty, labelProperty, popType, backFillColumnIds, backFillFieldIds) {

    var component = $("#" + input_id)[0];
    if (!component)
        return;
    var div_node = efform.getSubDiv(popupContentId);
    var fieldId = popupContentId.substring(9);
    var button_json = [
        {
            text: getI18nMessages("ef.Save", "保存"),
            click: function () {
                efform.popGrid_save_onclick('ef_grid_' + fieldId, valueProperty, labelProperty,
                    popType, backFillColumnIds, backFillFieldIds);
            }
        }
    ];

    var ajax_callback = {
        onSuccess: function (eiInfo) {
            var currentEiinfo = _getEi();
            currentEiinfo.addBlock(eiInfo.getBlock(fieldId));
            sub_grid.setData(currentEiinfo);

            sub_grid.paint();
            div_node.relativePopupParent = component;

//			if (component.nextSibling != null)
//				efwindow.show(component.nextSibling, div_node.id, "fixed");
//			else
            efwindow.show(component, div_node.id, "fixed", null, button_json);

            showComponent = component;
        },
        onFail: function (eMsg) {
            alert("failure：" + eMsg);
        }
    };

    var sub_grid;
    if (div_node.innerHTML == "&nbsp;") {
        var inner_html = [];
        inner_html.push("<TABLE cellspacing='0' cellpadding='1'>");
        inner_html
            .push("<TR onmouseover='efform.nullfunction();' onclick='efform.nullfunction();' onmousemove='efform.nullfunction();'><TD colspan=2>");
        inner_html.push("<div id=ef_grid_" + fieldId
            + " style='overflow:hidden;width:400px;height:280px;'></div>");
        inner_html.push("</TD></TR>");
        inner_html.push("</TABLE>");
        div_node.innerHTML = inner_html.join("");

        var style_config = new Object();
        // style_config["navigationBar"] = "false";
        sub_grid = new efgrid(fieldId, "ef_grid_" + fieldId);
        div_node.gridObject = sub_grid;
        var custom_cols = {
            "index": {},
            "metas": []
        };
        var columns = visibleColumnNames.split(",");
        var columndescs = visibleColumnDisplayNames.split(",");
        for (var i = 0; i < columns.length; i++) {
            custom_cols["index"][columns[i]] = i;
            custom_cols["metas"][i] = new Object();
            custom_cols["metas"][i]["name"] = columns[i];
            custom_cols["metas"][i]["descName"] = columns[i];
            if (columndescs != null && columndescs != ""
                && columndescs.length > i)
                custom_cols["metas"][i]["descName"] = columndescs[i];
            custom_cols["metas"][i]["primaryKey"] = false;
            custom_cols["metas"][i]["sort"] = false;
            custom_cols["metas"][i]["pos"] = i;
        }

        sub_grid.setEnable(false);
        sub_grid.setReadonly(false);
        sub_grid.setAjax(true);
        sub_grid.setAutoDraw(false);
        sub_grid.setCustomColumns(custom_cols);
        sub_grid.setStyle(style_config);
        sub_grid.setServiceName("EDCMUtils");
        sub_grid.setQueryMethod("getCodesetEiInfo");
        sub_grid.onGridSubmit = function (info) {
            info.set("codesetCode", fieldId);
            if (typeof (popupGrid_beforeDisplay) == "function")
                popupGrid_beforeDisplay(fieldId, popType, info, sub_grid);
        };

        sub_grid.onRowDblClicked = function () {
            efform
                .popGrid_save_onclick("ef_grid_" + fieldId, valueProperty,
                labelProperty, popType, backFillColumnIds,
                backFillFieldIds);
        };

        var ei_info = new EiInfo();
        ei_info.set("codesetCode", fieldId);
        if (typeof (popupGrid_beforeDisplay) == "function")
            popupGrid_beforeDisplay(fieldId, popType, ei_info, sub_grid);

        EiCommunicator.send("EDCMUtils", "getCodesetEiInfo", ei_info,
            ajax_callback);
    } else {
        sub_grid = div_node.gridObject;

        sub_grid.onRowDblClicked = function () {

            efform
                .popGrid_save_onclick("ef_grid_" + fieldId, valueProperty,
                labelProperty, popType, backFillColumnIds,
                backFillFieldIds);
        };

        var ei_info = new EiInfo();
        ei_info.set("codesetCode", fieldId);
        var needRefresh = false;
        if (typeof (popupGrid_beforeDisplay) == "function")
            needRefresh = popupGrid_beforeDisplay(fieldId, popType, ei_info,
                sub_grid);

        if (needRefresh)
            EiCommunicator.send("EDCMUtils", "getCodesetEiInfo", ei_info,
                ajax_callback);
        else {
//			if (component.nextSibling != null)
//				efwindow.show(component.nextSibling, div_node.id, "fixed");
//			else
            efwindow.show(component, div_node.id, "fixed", null, button_json);
        }
    }

    addButtonEffect();
};

efform.popGrid_save_onclick = function (gridId, valueProperty, labelProperty, popType, backFillColumnIds, backFillFieldIds) {
    var sub_grid = efform.getGrid(gridId);
    var index = sub_grid.getCurrentRowIndex();
    if (index < 0) {
        alert(getI18nMessages("ef.NotSelect", "未选择记录"));
        return;
    }

    var row = sub_grid.getBlockData().getRows()[index];

    //var div_node = efform.getSubGridDiv(gridId);

    // var column = div_node.efDisplayingCol;
    var cell_value = sub_grid.getBlockData().getCell(index, valueProperty);

    if (labelProperty != undefined || labelProperty != ""
        && showComponent.tagName == 'INPUT') {
        var cell_label = sub_grid.getBlockData().getCell(index, labelProperty);
        showComponent.nextSibling.value = cell_label;
        showComponent.value = cell_value;
        // showComponent.value = cell_label;
    }
    var columnIds = backFillColumnIds.split(",");
    var fieldIds = backFillFieldIds.split(",");
    if (columnIds.length > 0 && fieldIds.length > 0) {
        var ef_grid = null;
        var block = null;
        row_index = null;
        if (popType == "popupGrid") {
            var ef_grid = efgrid.getEfGridNode(showComponent).efgrid;
            var block = ef_grid.blockData;

            var pos = efgrid.getCellPos(showComponent);
            var row_index = pos.row;
//			var row_index = showComponent.parentNode.parentNode.parentNode.rowIndex;
        }

        for (var i = 0; i < fieldIds.length; i++) {
            if (columnIds.length < i + 1)
                continue;

            if (popType == "popupInput") {
                var field = $("#" + fieldIds[i])[0];
                if (field != null) {
                    field.value = sub_grid.getBlockData().getCell(index,
                        columnIds[i]);
                }
            } else if (popType == "popupGrid") {
                var sValue = sub_grid.getBlockData().getCell(index,
                    columnIds[i]);
                block.setCell(row_index, fieldIds[i], sValue);
            }
        }
        if (popType == "popupGrid") {
            // 刷新对应的CEll
            for (var i = 1; i < ef_grid.getColCount(TYPE_FIX); i++) {
                var column = ef_grid.getColumn(i, TYPE_DATA);
                for (var j = 0; j < fieldIds.length; j++) {
                    if (fieldIds[j].equals(column.customSetting.name))
                        ef_grid.refreshCell(row_index, i, TYPE_FIX);
                }
            }
            for (var i = 0; i < ef_grid.getColCount(TYPE_DATA); i++) {
                var column = ef_grid.getColumn(i, TYPE_DATA);
                for (var j = 0; j < fieldIds.length; j++) {
                    if (fieldIds[j] == column.customSetting.name)
                        ef_grid.refreshCell(row_index, i, TYPE_DATA);
                }
            }
        }
    }

    //efwindow.hide();

    if (typeof (popupGrid_afterDisplay) == "function")
        popupGrid_afterDisplay(gridId.substring(8), popType, sub_grid);

    var dlgId = "#ef_Popup_" + gridId.substring(8);
    $(dlgId).dialog("close");
};

/**
 * 子表格鼠标移动的处理函数.
 * @private
 * @return void.
 */
efform.subgrid_onmouseover = function () {
    if (event.srcElement.tagName != 'TD')
        return;

    var td_node = event.srcElement;
    if (td_node && efgrid.getRowIndex(td_node.parentNode) > 0)
        td_node.parentNode.className = 'ef-grid-tableRow-Highlight';
};

/**
 * 子表格鼠标离开的处理函数
 * @private
 * @return void.
 */
efform.subgrid_onmouseout = function () {
    if (event.srcElement.tagName != 'TD')
        return;

    var td_node = event.srcElement;
    if (td_node && efgrid.getRowIndex(td_node.parentNode) > 0)
        td_node.parentNode.className = 'tableRow'
            + (efgrid.getRowIndex(td_node.parentNode) & 1);
};

/**
 * 子表格保存点击时的处理函数
 * @private
 * @return void. efform.subgrid_onclick = function() { if(
 *         event.srcElement.tagName != 'TD' ) return;
 * var td_node = event.srcElement; if ( !td_node ) return; var row_index =
 * efgrid.getRowIndex(td_node.parentNode); if( row_index <=0 ) return; var
 * column_obj = efform.getSubGridDiv().efDisplayingCol; var cell_value = ""; if(
 * column_obj ) cell_value = column_obj.columnListValue[row_index-1][0];
 * 
 * efwindow.setValue( cell_value ); }
 */

/**
 * 长文本编辑窗口保存的处理函数.
 *
 * @private
 * @return void.
 */
efform.textarea_save_onclick = function () {
    var text_area = $("#subwindow_textarea");
    var cell_value = "";
    if (text_area.length != 0)
        cell_value = text_area.val();

    efwindow.setValue(cell_value);
};

/**
 * 子表格窗口保存的处理函数.
 * @private
 * @return void.
 */
efform.subgrid_save_onclick = function () {
    var sub_grid = efform.getGrid("_ef_grid_subgrid");
    var index = sub_grid.getCurrentRowIndex();
    if (index < 0) {
        alert(getI18nMessages("ef.NotSelect", "未选择记录"));
        return;
    }

    var div_node = efform.getSubGridDiv();
    var column = div_node.efDisplayingCol;
    var cell_value = sub_grid.getBlockData().getCell(index,
        column.getValueProperty());

    var labelProperty = column.getLabelProperty();
    if (labelProperty != undefined && labelProperty != ""
        && showComponent.tagName == 'INPUT') {
        var cell_label = sub_grid.getBlockData().getCell(index, labelProperty);
        showComponent.nextSibling.value = cell_label;

//		var row_index = showComponent.parentNode.parentNode.parentNode.rowIndex;
        var pos = efgrid.getCellPos(showComponent);
        var row_index = pos.row;

        var block = efgrid.getEfGridNode(showComponent).efgrid.blockData;
        if (block.meta.metas[labelProperty] != undefined)
            block.rows[row_index][block.meta.metas[labelProperty].pos] = cell_label;
    }

    efwindow.setValue(cell_value);

    if (typeof subgrid_save_onclick == "function") {
        try {
            subgrid_save_onclick(sub_grid.gridId, cell_value);
        } catch (ex) {
            efgrid.processException(ex,
                "Callback to subgrid_save_onclick failed");
        }
    }
    $("#ef_subgrid").dialog("close");
};

/**
 * 重绘子表格窗口
 * @private
 * @return void.
 */
efform.subgrid_rebuild = function () {
    var div_node = efform.getSubGridDiv();
    div_node.efDisplayingCol = null;
};

/**
 * 显示多选框编辑DIV窗口.
 * @private
 * @param {String} component_id : 对应的页面DOM对象id;
 * @param {String} columnEname : 对应列的英文名;
 * @return void.
 */
efform.showMultiselectWindow = function (component_id, columnEname) {

    var component = $("#" + component_id)[0];

    var grid_node = efgrid.getEfGridNode(component);

    var ef_grid = grid_node.efgrid;

    var column = ef_grid.getColumnByName(columnEname);

    if (!isAvailable(component))
        return;

    var title = getI18nMessages("ef.Detail", "详情");
    var div_node = efform.getSubGridDiv(title);

    var show_value = component.value;

    /**
     * 已选的项
     */
    var selectedItems = show_value.split(",");
    for (var i = 0; i < selectedItems.length; i++) {
        selectedItems[i] = selectedItems[i].trim();
    }

    var index = show_value.indexOf(EF_CR_IDENTIFIER);
    while (index != -1) {
        show_value = show_value.substring(0, index) + "\r\n"
            + show_value.substring(index + 2);
        index = show_value.indexOf(EF_CR_IDENTIFIER);
    }

    // 组装多选框
    var labels = [];

    var columnListValue = column.columnListValue;
    var columnListLabel = column.columnListLabel;
    if (columnListValue && columnListValue.length > 0) {
        for (var i = 0; i < columnListValue.length; i++) {
            var checked = " ";

            var label = columnListLabel[i];
            var value = columnListValue[i];
            var display_value = getDisplayValue(column, label, value);

            if (contains(selectedItems, columnListValue[i])) {
                checked = "checked";
            }

            labels
                .push("<li style='list-style:none;border-bottom:1px solid #EEE;'><label><input rel='"
                    + columnListValue[i]
                    + "' type='checkbox' "
                    + checked + "/>" + display_value + "</label></li>");
        }
    } else {
        for (var i = 0; i < selectedItems.length; i++) {
            labels.push("<li style='list-style:none;'><label><input rel='"
                + selectedItems[i] + "' type='checkbox' checked/>"
                + selectedItems[i] + "</label></li>");
        }

    }

    var inner_html = [];
    inner_html.push("<TABLE cellspacing='0' cellpadding='1' width='300px'>");
    inner_html
        .push("<TR onmouseover='efform.nullfunction();' onclick='efform.nullfunction();' onmousemove='efform.nullfunction();' ><TD colspan=2>");
    var multiSelectOption = "<ul id='gridCellMultiSelectUl' style='margin:0;padding-left:0;border-bottom:1px solid #DDD;height:150px;overflow:auto;'>"
        + labels.join("") + "</ul>";
    inner_html.push(multiSelectOption);
    inner_html.push("</TD></TR>");
    inner_html.push("</TABLE>");

    div_node.innerHTML = inner_html.join("");
    var button_json = [
        {
            text: getI18nMessages("ef.Save", "保存"),
            click: function () {
                efform.multiselect_save_onclick();
            }
        }
    ];
    // 添加fixed参数保证滚动时subgrid也跟着移动
    efwindow.show(component, div_node.id, "fixed", title, button_json);
};

/**
 * 根据列定义获取单元格的显示值
 */
function getDisplayValue(column, label, value) {
    var format_str = column.getFormatString();
    if (isAvailable(format_str)) {
        if (!isAvailable(label)) {
            for (var i = 0; i < columnListValue.length; i++) {
                if (columnListValue[i] == value) {
                    label = columnListLabel[i];
                    break;
                }
            }

            if (i >= columnListValue.length) {
                value = columnListValue[0];
                label = columnListLabel[0];
            }
        }

        return efutils.replaceString(format_str, "#valueString#", value,
            /\#labelString#/g, label);
    } else {

        if (label == null) {
            for (var i = 0; i < columnListValue.length; i++) {
                if (columnListValue[i] == value) {
                    label = columnListLabel[i];
                    break;
                }
            }

            if (i >= columnListValue.length)
                label = columnListLabel[0];
        }
        return label;
    }
}

/**
 * 判断数组中是否包含某个元素
 */
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

/**
 * 多选框编辑窗口保存的处理函数.
 *
 * @private
 * @return void.
 */
efform.multiselect_save_onclick = function () {
    var cell_value = [];

    $("#gridCellMultiSelectUl li label input:checked").each(function () {
        cell_value.push($(this).attr("rel"));
    });

    efwindow.setValue(cell_value.join(","));
};

/**
 * 空函数
 * @private
 * @return void.
 */
efform.nullfunction = function () {
};

/**
 * eval函数调用.
 *
 * @private
 * @param {String}
 *            functionName : 调用的函数名;
 * @return {Object} 函数对应的返回值
 */
efform.evalFunction = function (functionName) {
    try {
        var func = eval(functionName);
        if (typeof (func) == "function") {
            var args = [];
            for (var i = 1; i < arguments.length; i++)
                args.push(arguments[i]);

            func.apply(this, args);
        }
    } catch (ex) {
    }
};

/**
 * 设置页面弹出窗口的样�?
 * @param {String} style_string : 窗口的样式
 * @return void.
 */
efform.setNewWindowStyle = function (style_string) {
    ef_config["NEW_WINDOW"] = style_string;
};

/**
 * 设置表格当前行的样式.
 * @param {String} style_string : 样式名称;
 * @return void.
 */
efform.setGridCurrentRowStyle = function (style_string) {
    ef_config["GRID_CURRENT_ROW"] = style_string;
};

/**
 * 获取表格当前行的样式.
 *
 * @private
 * @return {String} : 表格当前行的样式名称.
 */
efform.getGridCurrentRowStyle = function () {
    var style_string = ef_config["GRID_CURRENT_ROW"];
    return isAvailable(style_string) ? style_string : 'ef-grid-tableRow-CurrentRow';
};

/**
 * 在表格编辑页面中弹出模式窗口.
 *
 * @private
 * @param {String}
 *            input_id : 表格编辑状态的输入域id;
 * @param {String}
 *            grid_id : 表格id;
 * @param {Number}
 *            row_index : 编辑单元格行号
 * @param {Number}
 *            col_index : 编辑单元格列号
 * @return void.
 */
efform.newWindow = function (input_id, grid_id, row_index, col_index) {
    var component = $("#" + input_id)[0];
    if (!component)
        return;

    var url = "about:blank";
    try {
        url = efgrid_getNewWindowUrl(grid_id, row_index, col_index,
            component.value);
    } catch (exception) {
        alert("efgrid_getNewWindowUrl"
            + getI18nMessages("ef.FormNotDefineAndInvalid", "未定义或参数错误"));
        return;
    }

    var style_string = isAvailable(ef_config["NEW_WINDOW"]) ? ef_config["NEW_WINDOW"]
        : "dialogWidth:400px; dialogHeight:300px;resizable:yes";
    var returnValue = window.showModalDialog(url, "", style_string);

    if (!returnValue || !returnValue["value"]) {
        alert(getI18nMessages("ef.FormNotDefine", "返回值未定义!"));
        return;
    }

    efgrid.setCellValue(input_id, returnValue["value"], returnValue["label"]);
};

/**
 * 弹出新页面
 *
 * @private
 * @param {String}
 *            form_ename : 新页面ID;
 * @param {String}
 *            para_list : 输入参数;
 * @param {String}
 *            is_maximum : 是否最大化;
 * @return void.
 */
efform.openNewForm = function (form_ename, para_list, is_maximum) {
    var _wnd = window;
    // 判断打开页面是否是分帧页面，如果是分帧页面，则要找到包含分帧页面的顶级页面
    while (isAvailable(_wnd.top) && _wnd != _wnd.top) {
        _wnd = _wnd.top;
    }

    // 打开新页面，并将新页面存入当前window对象的winMap中去
    if (_wnd != null) {
        _wnd.winMap[_wnd.winCount] = efform.openForm(form_ename, para_list,
            is_maximum);
        return _wnd.winMap[_wnd.winCount++];
    }
};

/**
 * 获取父窗口
 * @return {window}.
 */
efform.getParentWindow = function () {
    var _wnd = window;

    try {
        // 是首页，而首页本身的生成不是通过window.open的方式打开的，所以不能用_wnd.opener来判断
        // 这种假定是基于所有平台页面都是通过 window.open方式打开的
        if (isAvailable(_wnd.RootWndID))
            return _wnd;

        if (isAvailable(_wnd.opener) && _wnd != _wnd.opener)
            _wnd = _wnd.opener;

        // 判断打开页面是否是分帧页面，如果是分帧页面，则要找到包含分帧页面的顶级页面
        while (isAvailable(_wnd.top) && _wnd != _wnd.top) {
            _wnd = _wnd.top;
        }
    } catch (ex) {
        _wnd = null;
        return _wnd;
    }

    return _wnd;

};

/**
 * 打开页面
 *
 * @private
 * @param {String}
 *            form_ename : 新页面ID;
 * @param {String}
 *            para_list : 输入参数;
 * @param {String}
 *            is_maximum : 是否最大化;
 * @return void.
 */
efform.openForm = function (form_ename, para_list, is_maximum) {
    var load_time = new Date();
    var load_label = form_ename.trim() + load_time.getTime();

    para_list = efutils.trimString(para_list);
    var url = "/DispatchAction.do?efFormEname=" + form_ename.trim();
    if (para_list != "")
        url += "&" + para_list;

    var openPara = "toolbar=no,location=yes,directories=no,status=yes,menubar=yes,resizable=yes,scrollbars=yes,";
    if (is_maximum == true) {
        openPara += "width=" + (screen.availWidth - 10) + ",height="
            + (screen.availHeight - 30) + ",top=0," + "left=0";
    } else {
        openPara += "width=900,height=600,top="
            + ((screen.availHeight - 600) / 2) + ",left="
            + ((screen.availWidth - 900) / 2);
    }

    if (checkTimeOut())
        return;

    // IE下，open方法中name参数无法含有特殊字符，否则js报错
    var reg = /^\w+$/;
    if (!reg.test(load_label.trim())) {
        alert("输入的页面号中含有无效字符！");
        return false;
    }

    return window.open(url, load_label, openPara);
};

/**
 * 获取消息DIV层窗口
 *
 * @private
 * @return {Object} : DIV层对象
 */
efform._getMessageBoxDiv = function (title) {
    var div_id = "ef_msgbox";
    var div_node = $("#" + div_id)[0];
    if (!div_node)
        div_node = efform.createDivWindow(div_id, "efwindow", title);

    return div_node;
};

/**
 * 显示消息DIV层窗口
 *
 * @private
 * @param {String}
 *            msg : 需要显示的消息.
 * @return void.
 */
efform.showMessageBox = function (msg) {
    var title = getI18nMessages("ef.Error", "错误");
    var div_node = efform._getMessageBoxDiv(title);

    var inner_html = [];
    inner_html.push("<div style='width:120px'>");
    inner_html.push("<textarea wrap='soft' readonly rows=5 cols=21 style='margin:0px;height:74px'>" + msg
        + "</textarea>");
    inner_html.push("</div>");
    div_node.innerHTML = inner_html.join('');

    if (typeof event != "undefined") {
        efwindow.show(event.srcElement, div_node.id, true);
        if (typeof efform_messageBox_endShow == "function") {
            try {
                efform_messageBox_endShow(event.srcElement, div_node);
            } catch (ex) {
                efgrid.processException(ex,
                    "Callback to efform_messageBox_endShow failed");
            }
        }
    }
};

/**
 * 隐藏DIV
 * @param {String} div_id : 层id.
 * @return void.
 */
efform.hideDiv = function (div_id) {
    var div_node = $("#" + div_id)[0];
    if (isAvailable(div_node) && div_node.tagName == "DIV") {
        div_node.style.display = 'none';
    } else {
        efform.showMessageBox("Div with id[" + div_id + "] not found!");
    }
};

/**
 * 显示DIV
 * @param {String} div_id : 层id.
 * @return void.
 */
efform.showDiv = function (div_id) {
    var div_node = $("#" + div_id)[0];
    if (isAvailable(div_node) && div_node.tagName == "DIV") {
        div_node.style.display = 'block';
    } else {
        efform.showMessageBox("Div with id[" + div_id + "] not found!");
    }
};

/**
 * 获取系统提供的ajax回调函数.
 * @param {String} node_id : 层id;
 * @return {Object} 系统提供的ajax回调函数.
 */
efform.getSystemAjaxCallback = function (node_id) {
    return {
        onSuccess: function (eiInfo) {
            efform.fillDiv(node_id, eiInfo);
        },
        onFail: function (eMsg) {
            alert(getI18nMessages("ef.ServiceFailed", "服务调用失败: ") + eMsg);
        }
    };
};

/**
 * 自动填充DIV层各输入域的内容.
 * @private
 * @param {String} div_id : 层id;
 * @param {EiInfo} eiInfo : 数据;
 * @param {String} isAllNode: 是否所有div_id下的节点信息，包括三段式、二段式、一段式
 * @edit by wangyuqiu 2009-03-09
 * @return void.
 */
efform.fillDiv = function (div_id, eiInfo, isAllNode) {
    var node = $("#" + div_id)[0];
    if (!isAvailable(node)) {
        alert("Node with id[" + node_id + "] not found!");
        return;
    }
    efform.fillNode(node, eiInfo, isAllNode);
};

/**
 * 自动填充DOM结点各输入域的内容
 * @private
 * @param {Object} node : DOM结点对象;
 * @param {EiInfo} eiInfo : 数据;
 * @return void.
 */
efform.fillNode = function (node, eiInfo, isAllNode) {
    if (!node.childNodes || node.childNodes.length <= 0) {
        var cell_value = efform._getValue(node, eiInfo, isAllNode);
        if (cell_value === null) {
            return;
        }
        if (node.tagName == "INPUT" && node.type != "button") {
            if (node.type != "checkbox")
                node.value = cell_value;
            else if (cell_value !=  "" && cell_value != null)
                node.checked = true
            else
                node.checked = false;
        }
        if (node.tagName == "TEXTAREA") {
            node.value = cell_value;
        }
        return;
    }
    // 注意这一段必须加，因为在上面叶子节点的处理中对于textarea赋值之后会自动添加子节点导致后面的textarea的值无法更新的bug
    else if (node.tagName == "TEXTAREA") {
        var cell_value = efform._getValue(node, eiInfo, isAllNode);
        if (cell_value === null) {
            return;
        }
        node.value = cell_value;
        return;
    } else if (node.tagName == "SELECT") {
        var cell_value = efform._getValue(node, eiInfo, isAllNode);
        if (cell_value === null) {
            return;
        }
        node.selectedIndex = 0;
        for (var i = 0; i < node.options.length; i++) {
            if (node.options[i].value == cell_value) {
                node.selectedIndex = i;
                break;
            }
        }
    } else {
        for (var i = 0; i < node.childNodes.length; i++) {
            try {
                efform.fillNode(node.childNodes[i], eiInfo, isAllNode);
            } catch (exception) {
            }
        }
    }
};

/**
 * 根据结点名称获取EiInfo中对应的值
 * @private
 * @param {Object} node : 结点对象;
 * @param {EiInfo} eiInfo : 数据;
 * @return {String} EiInfo中对应的值
 */
efform._getValue = function (node, eiInfo, isAllNode) {
    if (!isAvailable(node.name))
        return null;

    var idArray = node.name.split("-");
    if (idArray.length == 3) {
        try {
            var block = eiInfo.getBlock(idArray[0]);
            if (!isAvailable(block))
                return "";
            return efutils.trimString(block.getCell(idArray[1], idArray[2]));
        } catch (exception) {
            return "";
        }
    }

    if (true == isAllNode) {
        if (2 == idArray.length) {
            var block = eiInfo.getBlock(idArray[0]);
            if (!isAvailable(block))
                return "";
            return efutils.trimString(block.get(idArray[1]));

        } else if (1 == idArray.length) {
            return efutils.trimString(eiInfo.get(idArray[0]));
        }
    }
};

/**
 * 根据id获取页面中导航条对象.
 * @param {String} bar_id : 导航条对象id;
 * @return {efNaviBar} 对应的导航条对象.
 */
efform.getNavigationBar = function (bar_id) {
    var bar = ef_nav_bars[bar_id];
    if (!isAvailable(bar))
        throw new Error("Navigation bar with id [" + bar_id + "] not exists!");
    return bar;
};

/**
 * 是否模板导出的回调函数
 * @param {} gridId
 */
function efgrid_onExport_modleXls(gridId) {
    window.showModalDialog("DispatchAction.do?efFormEname=EDFA7002", [ window,
            gridId ],
        "dialogWidth:320px;dialogHeight:393px;resizable:yes;help:no;");
}

/**
 * 根据formhead的状态位.
 * @return {String} :formhead的状态位.
 */
efform.getFormStatus = function () {
    return ef.get("efFormStatus").getAttribute("statuscode");
};

/**
 * 根据formhead的msgKey.
 *
 * @return {String} :formhead的msgKey.
 */
efform.getMsgKey = function () {
    return ef.get("_eiMsgKey").innerText;
};

/**
 * 根据formhead的msg.
 * @return {String} :formhead的msg.
 */
efform.getMsg = function () {
    return ef.get("_eiMsg").innerText;
};

/**
 * 获取formhead的DetailMsg.
 * @return {String} :formhead的DetailMsg.
 */
efform.getDetailMsg = function () {
    return ef.get("_eiDetailMsg").innerText;
};

/**
 * 设置formhead的DetailMsg.
 * @return {String} :formhead的DetailMsg.
 */
efform.setDetailMsg = function (detailMsg) {
    if (!ef.get("_eiDetailMsg"))
        return;
    ef.get("_eiDetailMsg").innerText = detailMsg;
};

/**
 * PopupInput控件删除按钮默认事件.
 * @parameter {String} cellLabelName :PopupInput的显示值.
 * @parameter {String} cellName :PopupInput的隐藏值.
 */
efform.EFPopupInput_onDeleteButtonClick = function (cellLabelName, cellName) {
    if (typeof (popupInput_onClickDeleteButton) == "function") {
        popupInput_onClickDeleteButton(cellLabelName, cellName);
        return;
    }
    ef.get(cellLabelName).value = "";
    ef.get(cellName).value = "";

};

/**
 * 之前重构代码时去掉了，但是在设备中使用该方法进行function得判断，为保证兼容性添加该空方法
 */
function efgrid_onRowDblClicked(gridId, row_index) {
}