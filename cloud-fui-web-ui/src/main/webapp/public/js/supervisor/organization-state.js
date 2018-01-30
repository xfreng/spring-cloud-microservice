fui.parse();

var url = fui.contextPath + "/supervisor/organization/add";
var form = new fui.Form("organization-state");

function doSaveOrganization() {
    var data = form.getData();
    form.validate();
    if (form.isValid() == false) return;
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        cache: false,
        success: function (text) {
            text = fui.decode(text);
            if (text.message != null && text.message != undefined) {
                fui.confirm(text.message, "提示信息", function (action) {
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
        fui.get("id").setAllowInput(false);
        fui.get("users").setText(data.users);
        form.setChanged(false);
        url = fui.contextPath + "/supervisor/organization/update";
    } else {
        fui.get("id").setAllowInput(true);
    }
}

function onOk(e) {
    doSaveOrganization();
}

function onCancel(e) {
    CloseWindow("cancel");
}

/**
 * 弹出选择人员窗口
 * @param e
 */
function onButtonEdit(e) {
    var btnEdit = this;
    fui.open({
        url: fui.contextPath + "/supervisor/organization/selectUserWindow",
        showMaxButton: false,
        title: "选择人员",
        width: 350,
        height: 350,
        onload: function () {
            var iframe = this.getIFrameEl();
            iframe.contentWindow.setData(fui.get("users").getValue());
        },
        ondestroy: function (action) {
            if (action == "ok") {
                var iframe = this.getIFrameEl();
                var data = iframe.contentWindow.getData();
                data = fui.clone(data);
                if (data) {
                    var code = data.id;
                    btnEdit.setValue(code);
                    btnEdit.setText(code);
                }
            }
        }
    });
}