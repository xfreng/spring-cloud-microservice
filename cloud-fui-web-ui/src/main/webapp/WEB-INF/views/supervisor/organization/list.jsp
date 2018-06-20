<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <%@include file="/public/include/iplat-common.jsp"%>
    <%@include file="/public/include/fui-iplat-common.jsp"%>
    <style type="text/css">
        html, body{
            margin:0;padding:0;border:0;width:100%;height:100%;overflow:hidden;
        }
        #tree .fui-grid-viewport{
            background-color:transparent !important;
        }
        #tree .fui-panel-viewport{
            background-color:transparent !important;
        }
    </style>
</head>
<body>
<jsp:include flush="false" page="/public/include/iplat.ef.head.jsp"></jsp:include>
<div id="layout" class="fui-layout" style="width:100%;">
    <div region="west" title="组织机构树" showHeader="false" style="cursor:hand;" bodyStyle="padding-left:0px;" showSplitIcon="true" width="230" maxWidth="530">
        <ul id="leftTree" class="fui-tree" url="${path}/supervisor/organization/selectByKey" style="width:100%;margin-top:5px;"
            showTreeIcon="true" textField="name" onbeforeload="onBeforeTreeLoad" dataField="organizationNodes"
            idField="id" parentField="parentId" resultAsTree="false" onnodeclick="onNodeClick"
            contextMenu="#treeMenu">
        </ul>
    </div>
    <div showHeader="false" region="center" bodyStyle="overflow:hidden;" style="border:0;">
        <div class="fui-fit" style="width:100%;height:100%;">
            <div class="fui-panel" title="查询条件" bodyStyle="overflow:hidden;" style="width:100%;">
                <form id="queryForm">
                    <label style="margin-left:20px;" for="userCode">用户工号：</label>
                    <input class="fui-textbox" id="userCode" name="userCode" emptyText="精确查询"/>
                    <label style="margin-left:20px;" for="userName">用户姓名：</label>
                    <input class="fui-textbox" id="userName" name="userName" emptyText="支持模糊查询"/>
                </form>
            </div>
            <div class="fui-panel" showHeader="false" bodyStyle="overflow:hidden;" style="width:100%;height:92%;">
                <div class="fui-toolbar" style="border-top:0;border-left:0;border-:0;">
                    <a class="fui-button" iconCls="icon-search" onclick="doQuery()">查询</a>
                </div>
                <div id="userManagerGrid" class="fui-datagrid" style="width:100%;height:96%;" multiSelect="true"
                     url="${path}/supervisor/user/list" idField="id" pageSize="20"
                     dataField="userList" showFilterRow="false" allowCellSelect="true"
                     allowCellEdit="true">
                    <div property="columns">
                        <div type="checkcolumn" ></div>
                        <div field="ename" width="100" headerAlign="center" align="center">用户工号</div>
                        <div field="cname" width="160" headerAlign="center">用户姓名</div>
                        <div field="createTime" width="150" headerAlign="center" align="center" dateFormat="yyyy-MM-dd HH:mm:ss">创建时间</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<ul id="treeMenu" class="fui-contextmenu" onbeforeopen="onBeforeOpen"></ul>
</body>
<script type="text/javascript" src="${path}/public/scripts/supervisor/organization.js?v=<%=System.currentTimeMillis()%>"></script>
</html>