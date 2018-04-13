<%@ page language="java" pageEncoding="UTF-8" isELIgnored="false" %>
<%@ page import="com.alibaba.fastjson.JSONObject" %>
<%@ page import="com.fui.cloud.common.UserUtils" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
<c:set value="${pageContext.request.contextPath}" var="path" scope="page"/>
<script src="${path}/public/scripts/jquery-1.11.1.min.js" type="text/javascript"></script>
<link href="${path}/public/layui/css/layui.css" rel="stylesheet" type="text/css" media="all"/>
<script src="${path}/public/layui/layui.js" type="text/javascript"></script>
<%
    JSONObject user = UserUtils.getCurrent();
    request.setAttribute("user", user);
%>
<script type="text/javascript">
    var fui = {};
    fui.treeRootId="root";
    fui.contextPath="${path}";

    /**
     * 日期转换（支持cst -6时区时间格式）
     *
     * @param val
     *         要转换的日期值
     * @param size
     *         转换的日期格式
     *            (支持8-yyyyMMdd、10-yyyy-MM-dd、14-yyyyMMddHHmmss、19-yyyy-MM-dd HH:mm:ss)
     * @param iscst
     *         是否是cst格式
     *
     */
    function formatterDate(val, size, iscst) {
        if (typeof(val) == "undefined" && val.trim() != "") {
            return "";
        }
        var date = new Date(val);
        if (!(iscst === false)) {
            var localTime = date.getTime();
            var localOffset = date.getTimezoneOffset() * 60000;
            var utc = localTime + localOffset;
            var offset = -6;
            var cst = utc + (3600000 * offset);
            date = new Date(cst);
        }
        var formaterDataStr = "";
        var year = date.getFullYear();
        if (date.getFullYear() < 1900) {
            return "";
        }
        var month = date.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        var day = date.getDate();
        day = day < 10 ? ("0" + day) : day;
        var hours = date.getHours();
        hours = hours < 10 ? ("0" + hours) : hours;
        var minutes = date.getMinutes();
        minutes = minutes < 10 ? ("0" + minutes) : minutes;
        var seconds = date.getSeconds();
        seconds = seconds < 10 ? ("0" + seconds) : seconds;
        if (size == 8) {
            formaterDataStr = year + "" + month + day;
        } else if (size == 10) {
            formaterDataStr = year + "-" + month + "-" + day;
        } else if (size == 14) {
            formaterDataStr = year + "" + month + day + hours + minutes + seconds;
        } else if (size == 19) {
            formaterDataStr = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        }
        return formaterDataStr;
    }
</script>