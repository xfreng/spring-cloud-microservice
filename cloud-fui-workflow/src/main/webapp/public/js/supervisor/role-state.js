fui.parse();

var form = new fui.Form("role-state");
var url = fui.contextPath + "/supervisor/role/add";
var treeUrl = fui.contextPath + "/supervisor/right/selectByKey";
var rightTree = fui.get("rightTree");

function doSaveRole() {
    var data = form.getData();
    form.validate();
    if (form.isValid() == false) return;
    data.permissions = getCheckedRights();
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        cache: false,
        success: function (text) {
            text = fui.decode(text);
            if (text.message != null && text.message != undefined) {
                fui.confirm(text.message, "提示信息", function () {
                    if (action == "ok") {
                        if (text.result == "0") {
                            return;
                        }
                        CloseWindow("ok");
                    }
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            fui.showMessageBox({
                showModal: false,
                width: 260,
                title: "提示信息",
                iconCls: "fui-messagebox-info",
                message: jqXHR.responseText,
                timeout: 3000,
                x: "right",
                y: "bottom"
            });
        }
    });
}

//标准方法接口定义
function setData(data) {
    data = fui.clone(data);
    var action = data.action;
    form.setData(data);
    if (action == "edit") {
        fui.get("roleCode").setAllowInput(false);
        form.setChanged(false);
        url = fui.contextPath + "/supervisor/role/update";
        treeUrl = fui.contextPath + "/supervisor/right/selectByKey?roleCode=" + data.roleCode;
    } else if (action == "add") {
        fui.get("roleCode").setAllowInput(true);
    } else {
        treeUrl = fui.contextPath + "/supervisor/role/showRights?roleCode=" + data.roleCode;
    }
    rightTree.load(treeUrl);
}

function onOk(e) {
    doSaveRole();
}

function onCancel(e) {
    CloseWindow("cancel");
}

/**
 * 树加载前
 * @param e
 */
function onBeforeTreeLoad(e) {
    var node = e.node;
    if (!node.id) {
        e.params.id = -1;
    }
}

/**
 * 获取选中的权限
 * @returns {string}
 */
function getCheckedRights() {
    var nodes = rightTree.getCheckedNodes();
    var ids = [];
    for (var i = 0, l = nodes.length; i < l; i++) {
        var node = nodes[i];
        ids.push(node.id);
    }
    return ids.join(",");
}