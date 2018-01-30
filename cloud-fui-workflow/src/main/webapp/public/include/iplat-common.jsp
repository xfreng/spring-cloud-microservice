<%@ page language="java" pageEncoding="UTF-8" isELIgnored="false" %>
<%@ page import="com.fui.cloud.common.UserUtils" %>
<%@ page import="com.fui.cloud.core.FrameworkInfo" %>
<%@ page import="com.alibaba.fastjson.JSONObject" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="EF" uri="http://jcoffee.fui.com/jsp/ef" %>
<c:set value="${pageContext.request.contextPath}" var="path" scope="page"/>
<script type="text/javascript" src="${path}/public/EF/jQuery/jquery-1.7.2.min.js" contextPath="${path}"></script>
<script type="text/javascript" src="${path}/public/EF/iplat-ui-2.0.js"></script>
<script type="text/javascript" src="${path}/public/EF/jQuery/iplat.ui.accordionx.js"></script>
<script type="text/javascript" src="${path}/public/EP/index.menuTree.js"></script>

<link rel="stylesheet" type="text/css" href="${path}/public/EF/iplat-ui-2.0.css"/>
<%
    JSONObject user = UserUtils.getCurrent();
    String menuType = "pact";
    String menuStyle = "red";
    String iPlatStyle = "Blue";

    if (user != null) {
        menuType = user.getString("menuType");
        menuStyle = user.getString("style");
    }

    if ("red".equals(menuStyle)) {
        iPlatStyle = "Red";
    } else if ("black".equals(menuStyle)) {
        iPlatStyle = "ModernBlack";
    }
    Object projectName = FrameworkInfo.getProjectName();
    Object background = FrameworkInfo.getLoginBackground();
    Object logo = FrameworkInfo.getLogo();
    Object dev = FrameworkInfo.getDev();
    request.setAttribute("menuType", menuType);
    request.setAttribute("menuStyle", menuStyle);
    request.setAttribute("iPlatStyle", iPlatStyle);
    request.setAttribute("user", user);
    request.setAttribute("projectName", projectName);
    request.setAttribute("background", background);
    request.setAttribute("logo", logo);
    request.setAttribute("dev", dev);
%>
<link rel="stylesheet" type="text/css" href="${path}/public/EF/Themes/styleApple/${iPlatStyle}/jquery-ui.custom.css"/>
<link rel="stylesheet" type="text/css" href="${path}/public/EF/Themes/styleApple/${iPlatStyle}/iplat-ui-theme-2.0.css"/>
<link rel="stylesheet" type="text/css" href="${path}/public/EP/indexReal-${iPlatStyle}-3.0.css"/>
<script type="text/javascript">
    /** Ajax请求异常处理全局设置 */
    $(document).ajaxComplete(function (evt, request, settings) {
        var text = request.responseText;
        if(text.indexOf("权限不足") != -1){
            alert("权限不足!");
        } else if (text == "timeout") { //判断返回的数据内容，如果是超时，则跳转到登陆页面
            alert("未登录或登录超时!");
            var win = window.parent || window;
            win.location.href = fui.contextPath + '/supervisor/login/index';
        }
    });
    /**
     * 自动layout高度
     * @param layoutId
     */
    function autoLayoutSize(layoutId, minus) {
        var layout = fui.get(layoutId);
        var pageHeadHeight = $("#ef_form_head").outerHeight();
        if (self != top) {
            pageHeadHeight = 0;
        }
        var minusHeight = 0;
        if (minus != undefined) {
            minusHeight = minus;
        }
        layout.setHeight($(window).height() - pageHeadHeight - minusHeight);
        $(window).resize(function () {
            layout.setHeight($(window).height() - pageHeadHeight - minusHeight);
        });
    };
    /**
     * 关闭所有子窗口(IE下有效)
     */
    function closeSonWindow() {
        var win = window.winMap;
        for (var index = 0; index < winCount; index++) {
            //如果窗口已关闭
            if (win[index].closed) {
                continue;
            }
            //如果窗口没有可以打开的子窗口
            if (typeof(win[index].openedWindow) == "undefined") {
                win[index].close();
                continue;
            }
            if (win[index].openedWindow.length == 0) {
                win[index].close();
            } else {
                win[index].close();
                closeSonWindow();
            }
        }
    };
</script>