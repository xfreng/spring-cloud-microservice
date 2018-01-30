fui.parse();

var roleManagerGrid = fui.get("roleManagerGrid");

$(function () {
    autoLayoutSize('layout');
    doQuery();
});

/**
 * 查询
 */
function doQuery() {
    var form = new fui.Form("queryForm");
    var data = form.getData(true, false);
    roleManagerGrid.load(data);
}

/**
 * 弹出新增/修改角色面板
 */
function doAdd_update(flag) {
    var action = flag == 'A' ? 'add' : 'edit';
    var title = flag == 'A' ? '新增角色' : '修改角色';
    var row = roleManagerGrid.getSelected();
    var data = {};
    if (flag == 'U') {
        if (row == null) {
            fui.showMessageBox({
                showModal: false,
                width: 260,
                title: "提示信息",
                iconCls: "fui-messagebox-info",
                message: "请先选中需要修改的角色!",
                timeout: 3000,
                x: "right",
                y: "bottom"
            });
            return;
        }
        var rows = roleManagerGrid.getSelecteds();
        if (rows.length > 1) {
            fui.showMessageBox({
                showModal: false,
                width: 260,
                title: "提示信息",
                iconCls: "fui-messagebox-info",
                message: "请选中一条需要修改的角色!",
                timeout: 3000,
                x: "right",
                y: "bottom"
            });
            return;
        }
        data = row;
    }
    data.action = action;
    fui.open({
        url: fui.contextPath + "/supervisor/role/state",
        showMaxButton: true,
        title: title,
        width: 510,
        height: 600,
        onload: function () {
            var iframe = this.getIFrameEl();
            iframe.contentWindow.setData(data);
        },
        ondestroy: function (action) {
            if (action == "ok") {
                roleManagerGrid.reload();
                roleManagerGrid.clearSelect(true);
            }
        }
    });
}

/**
 * 角色详情列渲染
 * @param e
 * @returns {string}
 */
function operateRender(e) {
    return "<a href='javascript:void(0)' onclick='toDetail(" + fui.encode(e.record) + ")'>查看</a>";
}

/**
 * 查看角色权限
 */
function toDetail(row) {
    fui.open({
        url: fui.contextPath + "/supervisor/role/state?showCheckBox=false",
        showMaxButton: true,
        title: "查看角色",
        width: 510,
        height: 600,
        onload: function () {
            var iframe = this.getIFrameEl();
            iframe.contentWindow.setData(row);
        }
    });
}