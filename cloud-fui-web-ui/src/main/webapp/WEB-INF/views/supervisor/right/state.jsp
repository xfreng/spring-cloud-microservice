<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <%@include file="/public/include/fui-common.jsp" %>
    <title>权限面板</title>
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
<form id="right-state" method="post">
    <fieldset style="border:solid 1px #aaa;">
        <legend>权限信息</legend>
        <div style="padding:5px;">
            <table>
                <tr>
                    <td>权限ID：</td>
                    <td><input class="fui-textbox" id="id" name="id" required="true"/></td>
                    <td>上级权限ID：</td>
                    <td><input class="fui-textbox" id="parentId" name="parentId" readonly="true"/></td>
                </tr>
                <tr>
                    <td>权限编码：</td>
                    <td><input class="fui-buttonedit" id="code" name="code" onbuttonclick="onButtonEdit"/></td>
                    <td>权限名称：</td>
                    <td><input class="fui-textbox" id="text" name="text"/></td>
                </tr>
                <tr>
                    <td>权限配置URL：</td>
                    <td colspan="3"><input class="fui-textbox" id="url" name="url" style="width: 100%;"/></td>
                </tr>
                <tr>
                    <td>权限类型：</td>
                    <td colspan="3">
                        <div id="rbl" name="nodeType" class="fui-radiobuttonlist" repeatItems="2" repeatLayout="table" repeatDirection="horizontal"
                             textField="text" valueField="id" value="0"
                             data="[{'id':'0','text':'菜单'},{'id':'1','text':'权限'}]" ></div>
                    </td>
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
<script type="text/javascript" src="${path}/public/scripts/supervisor/right-state.js?v=<%=System.currentTimeMillis()%>"></script>
</html>