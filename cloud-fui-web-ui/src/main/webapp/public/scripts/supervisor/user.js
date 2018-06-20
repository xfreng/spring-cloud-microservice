fui.parse();

var userManagerGrid = fui.get("userManagerGrid");

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
    userManagerGrid.load(data);
}

/**
 * 弹出新增/修改用户面板
 */
function doAdd_update(flag) {
    var action = flag == 'A' ? 'add' : 'edit';
    var title = flag == 'A' ? '新增用户' : '修改用户';
    var row = userManagerGrid.getSelected();
    var data = {};
    if (flag == 'U') {
        if (row == null) {
            fui.showMessageBox({
                showModal: false,
                width: 260,
                title: "提示信息",
                iconCls: "fui-messagebox-info",
                message: "请先选中需要修改的用户!",
                timeout: 3000,
                x: "right",
                y: "bottom"
            });
            return;
        }
        var rows = userManagerGrid.getSelecteds();
        if (rows.length > 1) {
            fui.showMessageBox({
                showModal: false,
                width: 260,
                title: "提示信息",
                iconCls: "fui-messagebox-info",
                message: "请选中一条需要修改的用户!",
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
        url: fui.contextPath + "/supervisor/user/state",
        showMaxButton: true,
        title: title,
        width: 510,
        height: 215,
        onload: function () {
            var iframe = this.getIFrameEl();
            iframe.contentWindow.setData(data);
        },
        ondestroy: function (action) {
            if (action == "ok") {
                userManagerGrid.reload();
                userManagerGrid.clearSelect(true);
            }
        }
    });
}

/**
 * 角色查看
 * @param e
 * @returns {string}
 */
function roleRender(e) {
    var userId = e.record.id;
    return "<a href='javascript:void(0)' onclick='openRoleWindow(" + userId + ")'>查看</a>";
}

/**
 * 操作列渲染
 * @param e
 * @returns {string}
 */
function operateRender(e) {
    var status = "启用";
    if (e.row.erased) {
        status = "禁用";
    }
    return "<a href='javascript:void(0)' onclick='resetPwd(" + fui.encode(e.row) + ")'>重置密码</a>&nbsp;&nbsp;<a href='javascript:void(0)' onclick='status(" + fui.encode(e.row) + ")'>" + status + "</a>";
}

/**
 * 重置密码
 * @param row
 */
function resetPwd(row) {
    var msg = "确定重置<span style='color:red;'>" + row.ename + "(" + row.cname + ")</span>的密码？";
    fui.confirm(msg, '提示信息', function (action) {
        if (action == "ok") {
            $.ajax({
                url: fui.contextPath + "/supervisor/user/resetPwd",
                type: "POST",
                data: {
                    id: row.id,
                    ename: row.ename
                },
                dataType: "json",
                success: function (text) {
                    fui.showMessageBox({
                        showModal: false,
                        width: 260,
                        title: "提示信息",
                        iconCls: "fui-messagebox-info",
                        message: text.message,
                        timeout: 3000,
                        x: "right",
                        y: "bottom"
                    });
                }
            });
        }
    });
}

/**
 * 启用/禁用用户
 * @param row
 */
function status(row) {
    var status = "禁用";
    if (row.erased) {
        status = "启用";
    }
    var msg = "确定<span style='color:red;'>" + status + "</span>用户<span style='color:red;'>" + row.ename + "(" + row.cname + ")</span>？";
    fui.confirm(msg, '提示信息', function (action) {
        if (action == "ok") {
            $.ajax({
                url: fui.contextPath + "/supervisor/user/status",
                type: "POST",
                data: {
                    id: row.id,
                    ename: row.ename,
                    erased: row.erased
                },
                dataType: "json",
                success: function (text) {
                    fui.showMessageBox({
                        showModal: false,
                        width: 260,
                        title: "提示信息",
                        iconCls: "fui-messagebox-info",
                        message: text.message,
                        timeout: 3000,
                        x: "right",
                        y: "bottom"
                    });
                    if (text.result == "1") {
                        doQuery();
                    }
                }
            });
        }
    });
}

/**
 * 打开查询角色窗口
 * @param userId
 */
function openRoleWindow(userId) {
    var roleTemplateWindow = fui.get("roleTemplate");
    roleTemplateWindow.show();
    var roleGrid = fui.get("roleGrid");
    roleGrid.setUrl(fui.contextPath + '/supervisor/user/roleList?userId=' + userId);
    roleGrid.load();
}