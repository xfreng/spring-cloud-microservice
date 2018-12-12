var types = [{id: "6", text: "一般工作流"}];
fui.parse();
var process = fui.get("process");
var deployForm = new fui.Form("deployForm");
var deployWindow = fui.get("deployWindow");

$(function () {
    autoLayoutSize('layout');
    query();
});

/**
 * 按条件查询
 */
function query() {
    var form = new fui.Form("queryForm");
    var data = form.getData(true, false);
    process.load(data);
}

/**
 * 是否挂起列渲染
 * @param e
 * @returns {string}
 */
function suspendedRenderer(e) {
    var row = e.record;
    var id = row.id;
    var suspended = row.suspended;
    var url = '<a href="javascript:void(0)" onclick="operate(\'/supervisor/workflow/process/processdefinition/update/active/' + id + '\')">激活</a>';
    if (!suspended) {
        url = '<a href="javascript:void(0)" onclick="operate(\'/supervisor/workflow/process/processdefinition/update/suspend/' + id + '\')">挂起</a>';
    }
    return url;
}

/**
 * 执行是否挂起操作
 * @param url
 */
function operate(url) {
    $.ajax({
        url: fui.contextPath + url,
        type: "POST",
        dataType: "json",
        success: function (data) {
            fui.showMessageBox({
                showModal: false,
                width: 260,
                title: "提示信息",
                iconCls: "fui-messagebox-info",
                message: data.message,
                timeout: 3000,
                x: "right",
                y: "bottom"
            });
            process.reload();
            process.clearSelect(true);
        }
    });
}

/**
 * xml、图片列渲染
 * @param e
 */
function resourceRenderer(e) {
    var row = e.record;
    var id = row.id;
    var showValue = e.value;
    var url = '<a target="_blank" href="' + fui.contextPath + '/supervisor/workflow/process/resource/read?processDefinitionId=' + id + '&resourceType=xml">' + showValue + '</a>';
    if (e.field === 'diagramResourceName') {
        url = '<a target="_blank" href="javascript:void(0);" onclick="openDiagramResourceDialog(\'' + id + '\');">' + showValue + '</a>';
    }
    return url;
}

function openDiagramResourceDialog(id) {
    var imageUrl = fui.contextPath + '/supervisor/workflow/process/resource/read?processDefinitionId=' + id + '&resourceType=image';
    if ($('#diagramResourceDialog').length === 0) {
        $('<div/>', {
            id: 'workflowTraceDialog',
            title: '查看图片',
            html: "<div><img src='" + imageUrl + "' style='position:absolute; left:10px; top:10px;' /></div>"
        }).appendTo('body').dialog({
            modal: true,
            resizable: false,
            dragable: false,
            width: document.documentElement.clientWidth * 0.95,
            height: document.documentElement.clientHeight * 0.95
        });
    } else {
        $('#diagramResourceDialog img').attr('src', imageUrl);
    }
}

/**
 * 部署选择的流程
 */
function deploy() {
    var getFlashPlayer = checkAgentInstalledFlash();
    if (getFlashPlayer != "") {
        fui.confirm("您的浏览器没有安装flash，选择确定将跳转到flash安装页面", "提示信息", function (action) {
            if (action == "ok") {
                window.open(getFlashPlayer);
            }
        });
        return;
    }
    deployForm.clear();
    fui.get("category").setValue("6");
    deployWindow.show();
}

/**
 * 转换为模型
 */
function convertToModel() {
    var row = process.getSelected();
    if (row == null) {
        fui.showMessageBox({
            showModal: false,
            width: 260,
            title: "提示信息",
            iconCls: "fui-messagebox-info",
            message: "请先选择数据!",
            timeout: 3000,
            x: "right",
            y: "bottom"
        });
        return;
    }
    var rows = process.getSelecteds();
    if (rows.length > 1) {
        fui.showMessageBox({
            showModal: false,
            width: 260,
            title: "提示信息",
            iconCls: "fui-messagebox-info",
            message: "请选择一条数据!",
            timeout: 3000,
            x: "right",
            y: "bottom"
        });
        return;
    }
    var id = row.id;
    $.ajax({
        url: fui.contextPath + "/supervisor/workflow/process/convert-to-model/" + id,
        type: "POST",
        dataType: "json",
        success: function (data) {
            fui.showMessageBox({
                showModal: false,
                width: 260,
                title: "提示信息",
                iconCls: "fui-messagebox-info",
                message: data.message,
                timeout: 3000,
                x: "right",
                y: "bottom"
            });
            process.reload();
            process.clearSelect(true);
        }
    });
}

/**
 * 启动流程
 */
function startRunning() {
    var row = process.getSelected();
    if (row == null) {
        fui.showMessageBox({
            showModal: false,
            width: 260,
            title: "提示信息",
            iconCls: "fui-messagebox-info",
            message: "请先选择数据!",
            timeout: 3000,
            x: "right",
            y: "bottom"
        });
        return;
    }
    var rows = process.getSelecteds();
    if (rows.length > 1) {
        fui.showMessageBox({
            showModal: false,
            width: 260,
            title: "提示信息",
            iconCls: "fui-messagebox-info",
            message: "请选择一条数据!",
            timeout: 3000,
            x: "right",
            y: "bottom"
        });
        return;
    }
    var key = row.key;
    $.ajax({
        url: fui.contextPath + "/supervisor/workflow/process/start-running/" + key,
        type: "POST",
        dataType: "json",
        success: function (data) {
            fui.showMessageBox({
                showModal: false,
                width: 260,
                title: "提示信息",
                iconCls: "fui-messagebox-info",
                message: data.message,
                timeout: 3000,
                x: "right",
                y: "bottom"
            });
            process.reload();
            process.clearSelect(true);
        }
    });
}

/**
 * 删除已部署的流程
 */
function remove() {
    var row = process.getSelected();
    if (row == null) {
        fui.showMessageBox({
            showModal: false,
            width: 260,
            title: "提示信息",
            iconCls: "fui-messagebox-info",
            message: "请先选择数据!",
            timeout: 3000,
            x: "right",
            y: "bottom"
        });
        return;
    }
    var rows = process.getSelecteds();
    if (rows.length > 1) {
        fui.showMessageBox({
            showModal: false,
            width: 260,
            title: "提示信息",
            iconCls: "fui-messagebox-info",
            message: "请选择一条数据!",
            timeout: 3000,
            x: "right",
            y: "bottom"
        });
        return;
    }
    fui.confirm("确认要删除选中的数据吗?", '提示信息', function (action) {
        if (action == "ok") {
            var deploymentId = row.deploymentId;
            $.ajax({
                url: fui.contextPath + "/supervisor/workflow/process/delete",
                data: {"deploymentId": deploymentId},
                type: "POST",
                dataType: "json",
                success: function (data) {
                    fui.showMessageBox({
                        showModal: false,
                        width: 260,
                        title: "提示信息",
                        iconCls: "fui-messagebox-info",
                        message: data.message,
                        timeout: 3000,
                        x: "right",
                        y: "bottom"
                    });
                    process.reload();
                    process.clearSelect(true);
                }
            });
        }
    });
}

/**
 * 文件选择后
 * @param e
 */
function onFileSelect(e) {

}

/**
 * 文件上传成功后
 * @param e
 */
function onUploadSuccess(e) {
    fui.showMessageBox({
        showModal: false,
        width: 260,
        title: "提示信息",
        iconCls: "fui-messagebox-info",
        message: fui.decode(e.serverData).message,
        timeout: 3000,
        x: "right",
        y: "bottom"
    });
    process.reload();
    deployWindow.hide();
}

/**
 * 文件上传出错
 * @param e
 */
function onUploadError(e) {

}

/**
 * 开始上传
 */
function startUpload() {
    var deployFile = fui.get("deployFile");
    var postParam = {category: fui.get("category").getValue()};
    deployFile.setPostParam(postParam);
    deployFile.startUpload();
}