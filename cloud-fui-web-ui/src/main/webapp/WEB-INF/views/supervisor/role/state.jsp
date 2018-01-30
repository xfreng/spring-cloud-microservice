<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <%@include file="/public/include/fui-common.jsp" %>
    <title>角色面板</title>
    <style type="text/css">
        html, body {
            font-size: 12px;
            padding: 0;
            margin: 0;
            border: 0;
            height: 100%;
            overflow: hidden;
        }
    </style>
</head>
<body>
<form id="role-state" method="post">
    <fieldset style="border:solid 1px #aaa;">
        <legend>角色信息</legend>
        <div style="padding:5px;">
            <input name="id" class="fui-hidden"/>
            <table width="100%">
                <tr>
                    <td>角色编码：</td>
                    <td><input id="roleCode" name="roleCode" class="fui-textbox" required="true" allowInput="${showCheckBox}" style="width:100%"/></td>
                </tr>
                <tr>
                    <td>角色名称：</td>
                    <td><input name="roleName" class="fui-textbox" required="true" allowInput="${showCheckBox}" style="width:100%"/></td>
                </tr>
                <tr>
                    <td valign="top">权限选择：</td>
                    <td>
                        <div class="fui-panel" showHeader="false" style="width:100%;height:400px;">
                            <ul id="rightTree" class="fui-tree" style="width:100%;margin-top:5px;"
                                showTreeIcon="true" textField="text" onbeforeload="onBeforeTreeLoad" dataField="rightNodes"
                                showCheckBox="${showCheckBox}" checkRecursive="true" allowSelect="false" enableHotTrack="false"
                                idField="id" parentField="parentId" resultAsTree="false">
                            </ul>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </fieldset>
    <c:if test="${showCheckBox}">
        <div style="text-align:center;padding:10px;">
            <a class="fui-button" onclick="onOk" style="width:60px;margin-right:20px;">确定</a>
            <a class="fui-button" onclick="onCancel" style="width:60px;">取消</a>
        </div>
    </c:if>
</form>
</body>
<script type="text/javascript" src="${path}/public/js/supervisor/role-state.js?v=<%=System.currentTimeMillis()%>"></script>
</html>