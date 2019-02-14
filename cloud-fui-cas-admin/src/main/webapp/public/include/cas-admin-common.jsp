<%@ page pageEncoding="UTF-8" isELIgnored="false" %>
<%@ page import="com.alibaba.fastjson.JSONObject" %>
<%@ page import="com.fui.cloud.common.UserUtils" %>
<%@ page import="java.util.Calendar" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
<c:set value="${pageContext.request.contextPath}" var="path" scope="page"/>
<link href="${path}/public/bootstrap-3.3.5-dist/css/bootstrap.min.css" title="" rel="stylesheet"/>
<link title="" href="${path}/public/css/style.css" rel="stylesheet" type="text/css"/>
<link title="blue" href="${path}/public/css/dermadefault.css" rel="stylesheet" type="text/css" disabled="disabled"/>
<link title="green" href="${path}/public/css/dermagreen.css" rel="stylesheet" type="text/css" disabled="disabled"/>
<link title="orange" href="${path}/public/css/dermaorange.css" rel="stylesheet" type="text/css" disabled="disabled"/>
<link title="black" href="${path}/public/css/dermablack.css" rel="stylesheet" type="text/css"/>
<link href="${path}/public/css/templatecss.css" rel="stylesheet" title="" type="text/css"/>
<link href="${path}/public/layui/css/layui.css" rel="stylesheet" type="text/css" media="all"/>
<script src="${path}/public/scripts/jquery-1.11.1.min.js" type="text/javascript"></script>
<script src="${path}/public/scripts/jquery.cookie.js" type="text/javascript"></script>
<script src="${path}/public/bootstrap-3.3.5-dist/js/bootstrap.min.js" type="text/javascript"></script>
<script src="${path}/public/layui/layui.js" type="text/javascript"></script>
<%
    JSONObject user = UserUtils.getCurrent();
    Calendar cal = Calendar.getInstance();
    int year = cal.get(Calendar.YEAR);
    int month = cal.get(Calendar.MONTH) + 1;
    int date = cal.get(Calendar.DATE);
    int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
    String week = "日";
    if (dayOfWeek == 1) {
        week = "日";
    } else if (dayOfWeek == 2) {
        week = "一";
    } else if (dayOfWeek == 3) {
        week = "二";
    } else if (dayOfWeek == 4) {
        week = "三";
    } else if (dayOfWeek == 5) {
        week = "四";
    } else if (dayOfWeek == 6) {
        week = "五";
    } else if (dayOfWeek == 7) {
        week = "六";
    }

    request.setAttribute("user", user);
    request.setAttribute("year", year);
    request.setAttribute("month", month);
    request.setAttribute("date", date);
    request.setAttribute("dayOfWeek", week);
%>
<script type="text/javascript">
    function setCurTime(timerObjId, color) {
        if (timerObjId) {
            var now = new Date();
            var hours = now.getHours();
            var minutes = now.getMinutes();
            var seconds = now.getSeconds();

            if (hours < 10) hours = "0" + hours;
            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;
            var timeString = hours + ":" + minutes + ":" + seconds;
            var oCtl = document.getElementById(timerObjId);
            if (typeof(color) === "undefined" || color === "") {
                oCtl.innerHTML = "<span style='color:blue'>" + timeString + "</span>";
            } else {
                oCtl.innerHTML = "<span style='color:" + color + "'>" + timeString + "</span>";
            }
            setTimeout("setCurTime('" + timerObjId + "','" + color + "');", 1000);
        }
    }

    function doSearch(keyObj) {
        window.open("https://www.baidu.com/s?wd=" + $(keyObj).val());
    }
</script>