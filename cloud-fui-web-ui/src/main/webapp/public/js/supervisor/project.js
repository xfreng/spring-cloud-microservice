fui.parse();

var projectManagerGrid = fui.get("projectManagerGrid");

$(function () {
    doQuery();
});

/**
 * 查询
 */
function doQuery() {
    projectManagerGrid.load();
}

function save() {
    var rows = projectManagerGrid.getSelecteds();
    if (rows.length == 0) {
        fui.showMessageBox({
            showModal: false,
            width: 260,
            title: "提示信息",
            iconCls: "fui-messagebox-info",
            message: "请选择要修改的数据!",
            timeout: 3000,
            x: "right",
            y: "bottom"
        });
        return;
    }
    $.ajax({
        url: fui.contextPath + "/supervisor/project/save",
        type: 'post',
        data: {data: fui.encode(rows)},
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
            doQuery();
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