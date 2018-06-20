fui.parse();

var url = fui.contextPath + "/supervisor/user/add";
var form = new fui.Form("user-state");

function doSaveUser() {
    var data = form.getData();
    form.validate();
    if (form.isValid() == false) return;
    data.roles = fui.get("rolesCombo").getValue();
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        cache: false,
        success: function (text) {
            text = fui.decode(text);
            if (text.message != null && text.message != undefined) {
                fui.alert(text.message, "提示信息", function (action) {
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
        fui.get("ename").setAllowInput(false);
        form.setChanged(false);
        $.ajax({
            url: fui.contextPath + '/supervisor/user/roleList?userId=' + data.id,
            type: 'post',
            cache: false,
            async: false,
            success: function (text) {
                text = fui.decode(text);
                if (text) {
                    var roles = "";
                    $.each(text, function (i, role) {
                        roles += role.id + ",";
                    });
                    if (roles != "") {
                        roles = roles.substr(0, roles.length - 1);
                    }
                    fui.get("rolesCombo").setValue(roles);
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
        url = fui.contextPath + "/supervisor/user/update";
    } else {
        fui.get("ename").setAllowInput(true);
    }
}

function onOk(e) {
    doSaveUser();
}

function onCancel(e) {
    CloseWindow("cancel");
}

function onCloseClick(e) {
    var obj = e.sender;
    obj.setText("");
    obj.setValue("");
}