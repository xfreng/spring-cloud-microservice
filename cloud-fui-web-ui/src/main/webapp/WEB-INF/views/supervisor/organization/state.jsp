<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <%@include file="/public/include/fui-common.jsp" %>
    <title>组织机构面板</title>
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
<form id="organization-state" method="post">
    <fieldset style="border:solid 1px #aaa;">
        <legend>组织机构信息</legend>
        <div style="padding:5px;">
            <table>
                <tr>
                    <td>组织机构ID：</td>
                    <td><input class="fui-textbox" id="id" name="id" required="true"/></td>
                    <td>上级组织机构ID：</td>
                    <td><input class="fui-textbox" id="parentId" name="parentId" readonly="true"/></td>
                </tr>
                <tr>
                    <td>组织机构编码：</td>
                    <td><input class="fui-textbox" id="code" name="code" required="true"/></td>
                    <td>组织机构名称：</td>
                    <td><input class="fui-textbox" id="name" name="name" required="true"/></td>
                </tr>
                <tr>
                    <td>添加机构人员：</td>
                    <td colspan="3"><input class="fui-buttonedit" id="users" name="users" allowInput="false" onbuttonclick="onButtonEdit" style="width: 100%;"/></td>
                </tr>
            </table>
        </div>
    </fieldset>
    <div style="text-align:center;padding:10px;">
        <a class="fui-button" onclick="onOk" style="width:60px;margin-right:20px;">确定</a>
        <a class="fui-button" onclick="onCancel" style="width:60px;">取消</a>
    </div>
</form>
</body>
<script type="text/javascript" src="${path}/public/scripts/supervisor/organization-state.js?v=<%=System.currentTimeMillis()%>"></script>
</html>