<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <%@include file="/public/include/iplat-common.jsp"%>
    <%@include file="/public/include/fui-iplat-common.jsp"%>
</head>
<body>
<jsp:include flush="false" page="/public/include/iplat.ef.head.jsp" />
<div id="layout" class="fui-layout" style="width:100%;">
    <div region="north" showHeader="false" bodyStyle="overflow:hidden;" showSplit="false" showCollapseButton="false" style="border:0;">
        <div class="fui-panel" title="查询条件" bodyStyle="overflow:hidden;" style="width:100%;">
            <form id="queryForm">
                <label style="margin-left:20px;" for="userCode">登录名：</label>
                <input class="fui-textbox" id="userCode" name="userCode"/>
                <label style="margin-left:20px;" for="userName">用户姓名：</label>
                <input class="fui-textbox" id="userName" name="userName" placeholder="支持模糊查询"/>
            </form>
        </div>
    </div>
    <div showHeader="false" region="center" bodyStyle="overflow:hidden;" style="border:0;">
        <div class="fui-toolbar" style="border-top:0;border-left:0;border-right:0;">
            <a class="fui-button" iconCls="icon-search" onclick="doQuery()">查询</a>
            <a class="fui-button" iconCls="icon-addnew" onclick="doAdd_update('A')">新增</a>
            <a class="fui-button" iconCls="icon-edit" onclick="doAdd_update('U')">修改</a>
        </div>
        <div id="userManagerGrid" class="fui-datagrid" style="width:100%;height:95%;" multiSelect="true"
               url="${path}/supervisor/user/list" idField="id" pageSize="20"
               dataField="userList" showFilterRow="false" allowCellSelect="true"
               allowCellEdit="true">
            <div property="columns">
                <div type="checkcolumn" ></div>
                <div field="ename" width="100" headerAlign="center" align="center">登录名</div>
                <div field="cname" width="130" headerAlign="center" align="center">真实姓名</div>
                <div field="createTime" width="150" headerAlign="center" align="center" dateFormat="yyyy-MM-dd HH:mm:ss" renderer="formatJsonDate">创建时间</div>
                <div field="lastLoginTime" width="150" headerAlign="center" align="center" dateFormat="yyyy-MM-dd HH:mm:ss" renderer="formatJsonDate">最后一次登录时间</div>
                <div field="showRoles" width="200" headerAlign="center" align="center" renderer="roleRender">拥有角色</div>
                <div field="operate" width="160" headerAlign="center" align="center" renderer="operateRender">操作</div>
            </div>
        </div>
    </div>
</div>
<div id="roleTemplate" class="fui-window" title="查看拥有角色" style="width:500px;height:600px;"
     showModal="true" allowDrag="true">
    <div id="roleGrid" class="fui-datagrid" style="width:100%;height:100%;" multiSelect="false"
         idField="id" dataField="roleList" showFilterRow="false" allowCellSelect="true"
         showEmptyText="true" emptyText="该用户无角色信息"
         showPager="false" allowCellEdit="true">
        <div property="columns">
            <div field="roleCode" width="100" headerAlign="center" align="center">角色编码</div>
            <div field="roleName" width="130" headerAlign="center" align="center">角色名称</div>
        </div>
    </div>
</div>
</body>
<script type="text/javascript" src="${path}/public/scripts/supervisor/user.js?v=<%=System.currentTimeMillis()%>"></script>
</html>