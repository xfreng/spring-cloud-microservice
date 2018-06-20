<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <%@include file="/public/include/iplat-common.jsp"%>
    <%@include file="/public/include/fui-iplat-common.jsp"%>
</head>
<body>
<jsp:include flush="false" page="/public/include/iplat.ef.head.jsp"></jsp:include>
<div id="layout" class="fui-layout" style="width:100%;">
    <div region="north" showHeader="false" bodyStyle="overflow:hidden;" showSplit="false" showCollapseButton="false">
        <div class="fui-panel" title="查询条件" bodyStyle="overflow:hidden;" style="padding: 10px;width: 100%;">
            <form id="queryForm">
                <label style="margin-left:20px;" for="roleCode">角色编码：</label>
                <input class="fui-textbox" id="roleCode" name="roleCode" placeholder="支持模糊查询"/>
                <label style="margin-left:20px;" for="roleName">角色名称：</label>
                <input class="fui-textbox" id="roleName" name="roleName" placeholder="支持模糊查询"/>
            </form>
        </div>
    </div>
    <div showHeader="false" region="center" bodyStyle="overflow:hidden;" style="border:0;">
        <div class="fui-toolbar" style="border-top:0;border-left:0;border-right:0;">
            <a class="fui-button" iconCls="icon-search" onclick="doQuery()">查询</a>
            <a class="fui-button" iconCls="icon-addnew" onclick="doAdd_update('A')">新增</a>
            <a class="fui-button" iconCls="icon-edit" onclick="doAdd_update('U')">修改</a>
        </div>
        <div id="roleManagerGrid" class="fui-datagrid" style="width:100%;height:95%;" multiSelect="true"
             url="${path}/supervisor/role/list" idField="id" pageSize="20"
             dataField="roleList" showFilterRow="false" allowCellSelect="true"
             allowCellEdit="true">
            <div property="columns">
                <div type="checkcolumn" ></div>
                <div field="roleCode" width="100" headerAlign="center" align="center">角色编码</div>
                <div field="roleName" width="130" headerAlign="center" align="center">角色名称</div>
                <div field="operate" width="160" headerAlign="center" align="center" renderer="operateRender">操作</div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${path}/public/scripts/supervisor/role.js?v=<%=System.currentTimeMillis()%>"></script>
</body>
</html>