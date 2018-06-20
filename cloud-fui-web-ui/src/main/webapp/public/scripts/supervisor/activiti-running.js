var types = [{id: "6", text: "一般工作流"}];
fui.parse();
var running = fui.get("running");
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
    running.load(data);
}

function didRenderer(e) {
    var row = e.record;
    var id = row.id;
    var processDefinitionId = row.processDefinitionId;
    var url = '<a class="trace" title="点击查看流程图" href="javascript:void(0)" pid="' + id + '" pdid="' + processDefinitionId + '">' + e.value + '</a>';
    return url;
}

/**
 * 是否挂起列渲染
 * @param e
 * @returns {string}
 */
function suspendedRenderer(e) {
    var row = e.record;
    var processInstanceId = row.processInstanceId;
    var suspended = row.suspended;
    var url = '<a href="javascript:void(0)" onclick="operate(\'/supervisor/workflow/processinstance/update/active/' + processInstanceId + '\')">激活</a>';
    if (!suspended) {
        url = '<a href="javascript:void(0)" onclick="operate(\'/supervisor/workflow/processinstance/update/suspend/' + processInstanceId + '\')">挂起</a>';
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
            running.reload();
            running.clearSelect(true);
        }
    });
}