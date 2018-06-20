fui.parse();

var form = new fui.Form("leaveForm");

/**
 * 启动请假流程
 */
function start() {
    var data = form.getData();
    form.validate();
    if (form.isValid() == false) return;
    $.ajax({
        url: fui.contextPath + "/supervisor/oa/leave/start",
        type: 'post',
        data: {submitData: fui.encode(data)},
        cache: false,
        success: function (text) {
            text = fui.decode(text);
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
            form.clear();
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