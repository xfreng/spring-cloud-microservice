<%@page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="/public/include/fui-common.jsp" %>
    <title>人员选择</title>
    <style type="text/css">
        html, body {
            padding: 0;
            margin: 0;
            border: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
    </style>
</head>
<body>
<div class="fui-toolbar" style="text-align:center;line-height:30px;" borderStyle="border:0;">
    <label for="key">名称：</label>
    <input id="key" class="fui-textbox" style="width:150px;" onenter="onKeyEnter"/>
    <a class="fui-button" style="width:60px;" onclick="search()">查询</a>
</div>
<div class="fui-fit">
    <div id="user" class="fui-datagrid" style="width:100%;height:100%;"
         url="${path}/supervisor/user/list" dataField="userList"
         idField="id" allowResize="true"
         borderStyle="border-left:0;border-right:0;"
         multiSelect="true">
        <div property="columns">
            <div type="checkcolumn"></div>
            <div field="ename" width="120" headerAlign="center" allowSort="true">员工帐号</div>
            <div field="cname" width="100%" headerAlign="center" allowSort="true">姓名</div>
            <div field="createtime" width="150" headerAlign="center" dateFormat="yyyy-MM-dd HH:mm:ss" allowSort="true">
                创建日期
            </div>
        </div>
    </div>

</div>
<div class="fui-toolbar" style="text-align:center;padding-top:8px;padding-bottom:8px;" borderStyle="border:0;">
    <a class="fui-button" style="width:60px;" onclick="onOk()">确定</a>
    <span style="display:inline-block;width:25px;"></span>
    <a class="fui-button" style="width:60px;" onclick="onCancel()">取消</a>
</div>

</body>
</html>
<script type="text/javascript">
    fui.parse();

    var grid = fui.get("user");

    grid.load();

    grid.on("load", function (e) {
        if (firstLoad) {
            firstLoad = false;
            if (initIds) {
                selectRowsByIds(initIds);
            }
        }
    });

    var firstLoad = true;
    var initIds;

    function selectRowsByIds(ids) {
        if (ids) {
            var rows = [];
            for (var i = 0, l = ids.length; i < l; i++) {
                var o = grid.getRow(ids[i]);
                if (o) rows.push(o);
            }
            grid.selects(rows);
        }
    }

    function setData(ids) {
        if (typeof ids == "string") {
            ids = ids.split(",");
        }
        initIds = ids;
    }

    function getData() {
        var rows = grid.getSelecteds();
        var ids = [], texts = [];
        for (var i = 0, l = rows.length; i < l; i++) {
            var row = rows[i];
            ids.push(row.id);
            texts.push(row.name);
        }
        var data = {};
        data.id = ids.join(",");
        data.text = texts.join(",");
        return data;
    }

    function search() {
        var key = fui.get("key").getValue();
        grid.load({key: key});
    }
    function onKeyEnter(e) {
        search();
    }

    function onOk() {
        CloseWindow("ok");
    }
    function onCancel() {
        CloseWindow("cancel");
    }
</script>