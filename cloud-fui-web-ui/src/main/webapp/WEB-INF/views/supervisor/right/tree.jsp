<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <%@include file="/public/include/fui-common.jsp" %>
    <title>权限选择</title>
    <style type="text/css">
        html,body
        {
            padding:0;
            margin:0;
            border:0;
            width:100%;
            height:100%;
            overflow:hidden;
        }
    </style>
</head>
<body>
<div class="fui-toolbar" style="text-align:center;line-height:30px;"
     borderStyle="border-left:0;border-top:0;border-right:0;">
    <label >名称：</label>
    <input id="key" class="fui-textbox" style="width:150px;" onenter="onKeyEnter"/>
    <a class="fui-button" style="width:60px;" onclick="search()">查询</a>
</div>
<div class="fui-fit">
    <ul id="tree" class="fui-tree" url="${path}/supervisor/menu/loadMenuNodes" style="width:100%;margin-top:5px;"
        showTreeIcon="true" textField="text" onbeforeload="onBeforeTreeLoad" dataField="treeNodes"
        expandOnLoad="true" onnodedblclick="onNodeDblClick" expandOnDblClick="false"
        idField="id" parentField="pid" resultAsTree="false">
    </ul>
</div>
<div class="fui-toolbar" style="text-align:center;padding-top:8px;padding-bottom:8px;"
     borderStyle="border-left:0;border-bottom:0;border-right:0;">
    <a class="fui-button" style="width:60px;" onclick="onOk()">确定</a>
    <span style="display:inline-block;width:25px;"></span>
    <a class="fui-button" style="width:60px;" onclick="onCancel()">取消</a>
</div>

</body>
</html>
<script type="text/javascript">
    fui.parse();

    var tree = fui.get("tree");

    tree.load();

    function onBeforeTreeLoad(e) {
        var node = e.node;
        if (!node.id) {
            e.params.id = fui.treeRootId;
        }
    }

    function getData() {
        var node = tree.getSelectedNode();
        return node;
    }
    function search() {
        var key = fui.get("key").getValue();
        if(key == ""){
            tree.clearFilter();
        }else{
            key = key.toLowerCase();
            tree.filter(function (node) {
                var text = node.text ? node.text.toLowerCase() : "";
                if (text.indexOf(key) != -1) {
                    return true;
                }
            });
        }
    }
    function onKeyEnter(e) {
        search();
    }
    function onNodeDblClick(e) {
        onOk();
    }
    function onOk() {
        var node = tree.getSelectedNode();
        if (node == null) {
            fui.alert("请选择权限","提示信息");
            return;
        }
        CloseWindow("ok");
    }
    function onCancel() {
        CloseWindow("cancel");
    }
</script>