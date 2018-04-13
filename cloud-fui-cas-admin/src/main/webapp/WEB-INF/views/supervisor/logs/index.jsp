<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <%@include file="/public/include/layui-common.jsp" %>
    <title>日志管理</title>
</head>
<body>
<table id="logsTable" class="layui-table" lay-data="{url:'${path}/supervisor/logs/list', page:true, id:'logsTable'}" lay-filter="logsTable">
    <thead>
        <tr>
            <th lay-data="{type:'numbers', fixed: 'left'}"></th>
            <th lay-data="{field:'name', width:'10%', align:'center'}">操作人</th>
            <th lay-data="{field:'logDate', width:'13%', align:'center',templet: '#logDateTpl'}">操作时间</th>
            <th lay-data="{field:'ip', width:'10%', align:'center'}">IP</th>
            <th lay-data="{field:'description', width:'23%', align:'center'}">描述</th>
        </tr>
    </thead>
</table>
<script src="${path}/public/scripts/supervisor/logs.js?v=<%=System.currentTimeMillis()%>"></script>
<script type="text/html" id="logDateTpl">
    {{ logDateRender(d.logDate) }}
</script>
</body>
</html>
