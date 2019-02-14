<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="com.fui.cloud.common.UserUtils" %>
<%@ page import="com.fui.cloud.core.FrameworkInfo" %>
<%@ page import="com.fui.cloud.model.fui.Users" %>
<meta charset="utf-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
<c:set value="${pageContext.request.contextPath}" var="path" scope="page"/>
<link rel="icon" href="${path}/webjars/fui/app.ico" type="image/x-icon"/>
<link rel="stylesheet" href="${path}/webjars/fui/public/fuiAdmin/layui/css/layui.css" media="all">
<link rel="stylesheet" href="${path}/webjars/fui/public/fuiAdmin/style/admin.css" media="all">

<script src="${path}/webjars/fui/public/fuiAdmin/layui/layui.js"></script>
<%
    Users user = UserUtils.getCurrent();
    request.setAttribute("user", user);

    Object projectName = FrameworkInfo.getProjectName();
    Object dev = FrameworkInfo.getDev();

    request.setAttribute("projectName", projectName);
    request.setAttribute("dev", dev);
%>

<script type="text/javascript">
    let fuiAdmin = {};
    fuiAdmin.contextPath = "${path}";
</script>