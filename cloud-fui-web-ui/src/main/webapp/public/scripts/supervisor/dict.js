fui.parse();
var queryForm = new fui.Form("queryForm");
var dictTypeGrid = fui.get("dictTypeGrid");
var dictEntryGrid = fui.get("dictEntryGrid");
var tree = fui.get("tree1");

dictTypeGrid.load();

tree.load();

dictEntryGrid.load();

$(function () {
    autoLayoutSize('layout', 10);
});

function onCellBeginEdit(e) {
    var editor = dictTypeGrid.getCellEditor(e.column, e.record);
    if (editor) {
        if (e.field == 'dictCode' && e.record._state != 'added') {
            editor.disable();
        } else {
            editor.enable();
        }
    }
}

function onSelectionChanged(e) {
    var grid = e.sender;
    var record = grid.getSelected();
    if (record) {
        tree.load({dictCode: record.dictCode});
        dictEntryGrid.load({dictCode: record.dictCode});
    }
}

function search() {
    var data = queryForm.getData(false, false);      //获取表单多个控件的数据
    dictTypeGrid.load(data);
}

function onKeyEnter(e) {
    search();
}

function addRow() {
    var newRow = {};
    dictTypeGrid.addRow(newRow, -1);
    dictTypeGrid.setSelected(newRow);
}

function addEntryRow() {
    var row = dictTypeGrid.getSelected();
    var newRow = {id: row.id};
    dictEntryGrid.addRow(newRow, -1);
    dictEntryGrid.setSelected(newRow);
}

function removeRow() {
    fui.confirm("确定删除选中行吗？", "提示信息", function callback(action) {
        if (action == "ok") {
            var rows = dictTypeGrid.getSelecteds();
            if (rows.length > 0) {
                dictTypeGrid.removeRows(rows, true);
                saveData();
            }
        }
    });
}

function removeEntryRow() {
    fui.confirm("确定删除选中行吗？", "提示信息", function callback(action) {
        if (action == "ok") {
            var rows = dictEntryGrid.getSelecteds();
            if (rows.length > 0) {
                dictEntryGrid.removeRows(rows, true);
                saveEntryData();
            }
        }
    });
}

function saveData() {
    var data = dictTypeGrid.getChanges();
    var len = data.length;
    if (len == 0) {
        fui.showMessageBox({
            showModal: false,
            width: 260,
            title: "提示信息",
            iconCls: "fui-messagebox-info",
            message: "请填写一条信息!",
            timeout: 3000,
            x: "right",
            y: "bottom"
        });
        return;
    }
    for (var i = 0; i < len; i++) {
        var item = data[i];
        var dictCode = item.dictCode;
        var dictDesc = item.dictDesc;
        if (!dictCode || !dictDesc) {
            fui.showMessageBox({
                showModal: false,
                width: 260,
                title: "提示信息",
                iconCls: "fui-messagebox-info",
                message: "请将信息填写完整!",
                timeout: 3000,
                x: "right",
                y: "bottom"
            });
            return;
        }
    }
    var json = fui.encode(data);
    dictTypeGrid.loading("保存中，请稍后......");
    fui.ajax({
        url: fui.contextPath + "/supervisor/dict/saveDictType",
        type: 'POST',
        data: {data: json},
        success: function (text) {
            dictTypeGrid.reload();
            tree.reload();
            dictEntryGrid.reload();
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

function saveEntryData() {
    var record = dictTypeGrid.getSelected();
    var data = dictEntryGrid.getChanges();
    var len = data.length;
    if (len == 0) {
        fui.showMessageBox({
            showModal: false,
            width: 260,
            title: "提示信息",
            iconCls: "fui-messagebox-info",
            message: "请填写一条信息",
            timeout: 3000,
            x: "right",
            y: "bottom"
        });
        return;
    }
    for (var i = 0; i < len; i++) {
        var item = data[i];
        var dictEntryCode = item.dictEntryCode;
        var dictEntryDesc = item.dictEntryDesc;
        if (!dictEntryCode || !dictEntryDesc) {
            fui.showMessageBox({
                showModal: false,
                width: 260,
                title: "提示信息",
                iconCls: "fui-messagebox-info",
                message: "请将信息填写完整",
                timeout: 3000,
                x: "right",
                y: "bottom"
            });
            return;
        }
    }
    var json = fui.encode(data);
    dictEntryGrid.loading("保存中，请稍后......");
    fui.ajax({
        url: fui.contextPath + "/supervisor/dict/saveDictEntry",
        type: 'POST',
        data: {data: json, dictCode: record.dictCode},
        success: function (text) {
            tree.reload();
            dictEntryGrid.reload();
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

function reset() {//重置
    queryForm.reset();
}

/**
 *导出数据字典
 */
function exportDict() {
    var frm = document.getElementById("form1");
    frm.submit();
}