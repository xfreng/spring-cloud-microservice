fui.parse();

var taskManagerGrid = fui.get("taskManagerGrid");
var deptLeaderAudit = fui.get("deptLeaderAudit");
var hrAudit = fui.get("hrAudit");
var modifyApply = fui.get("modifyApply");
var reportBack = fui.get("reportBack");
var deptLeaderRejectWindow = fui.get("deptLeaderRejectWindow");
var hrRejectWindow = fui.get("hrRejectWindow");

$(function () {
    autoLayoutSize('layout');
    doQuery();
});

/**
 * 查询
 */
function doQuery() {
    taskManagerGrid.load();
}

function operateRender(e) {
    var html = '<a href="javascript:void(0);" onclick="claim();">签收</a>';
    if (e.row.assignee) {
        html = '<a href="javascript:void(0);" onclick="todo();">办理</a>';
    }
    return html;
}

function statusRender(e) {
    var suspended = e.row.suspended;
    var version = e.row.version;
    var html = suspended ? "已挂起" : "正常";
    html += '；<b title="流程版本号">V: ' + version + '</b>';
    return html;
}

function taskNameRender(e) {
    return '<a class="trace" href="javascript:void(0);" pid="' + e.row.processInstanceId + '" pdid="' + e.row.processDefinitionId + '" title="点击查看流程图">' + e.row.taskName + '</a>';
}

function claim() {
    var row = taskManagerGrid.getSelected();
    var taskId = row.taskId;
    fui.confirm("是否签收任务？", "提示信息", function (action) {
        if (action == "ok") {
            $.ajax({
                url: fui.contextPath + "/supervisor/oa/leave/task/claim/" + taskId,
                type: 'post',
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
    });
}

function todo() {
    var ajaxFlag = 1;
    var row = taskManagerGrid.getSelected();
    var leaveId = row.id;
    var taskId = row.taskId;
    var taskDefinitionKey = row.taskDefinitionKey;
    switch (taskDefinitionKey) {
        case 'deptLeaderAudit':
            deptLeaderAudit.show();
            ajaxFlag = 1;
            break;
        case 'hrAudit':
            hrAudit.show();
            ajaxFlag = 1;
            break;
        case 'modifyApply':
            modifyApply.show();
            ajaxFlag = 2;
            break;
        case 'reportBack':
            reportBack.show();
            ajaxFlag = 1;
            break;
        default:
            break;
    }
    if (ajaxFlag == 1) {
        $.ajax({
            url: fui.contextPath + "/supervisor/oa/leave/detail/" + leaveId,
            type: 'post',
            cache: false,
            success: function (text) {
                var data = fui.decode(text);
                $.each(data, function (k, v) {
                    // 格式化日期
                    if (k == 'applyTime' || k == 'startTime' || k == 'endTime') {
                        $('.view-info td[name=' + k + ']').text(fui.formatDate(v, 'yyyy-MM-dd HH:mm:ss'));
                    } else {
                        $('.view-info td[name=' + k + ']').text(v);
                    }
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
    } else {
        $.ajax({
            url: fui.contextPath + "/supervisor/oa/leave/detail-with-vars/" + leaveId + "/" + taskId,
            type: 'post',
            cache: false,
            success: function (text) {
                var data = fui.decode(text);
                var leaveModifyForm = new fui.Form('leaveModifyForm');
                leaveModifyForm.setData(data);
                $('.info').show().html("<b>领导：</b>" + (data.variables.leaderBackReason || "") + "<br/><b>HR：</b>" + (data.variables.hrBackReason || ""));
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
}

function complete(flag) {
    var variables;
    var message = '同意';
    var row = taskManagerGrid.getSelected();
    var taskId = row.taskId;
    var taskDefinitionKey = row.taskDefinitionKey;
    switch (taskDefinitionKey) {
        case 'deptLeaderAudit':
            if (flag == 'N') {
                message = '驳回';
                var backReason = fui.get("leaderBackReason").getValue();
                variables = [{
                    key: 'deptLeaderPass',
                    value: false,
                    type: 'B'
                }, {
                    key: 'leaderBackReason',
                    value: backReason,
                    type: 'S'
                }];
            } else {
                variables = [{
                    key: 'deptLeaderPass',
                    value: true,
                    type: 'B'
                }];
            }
            break;
        case 'hrAudit':
            if (flag == 'N') {
                message = '驳回';
                var backReason = fui.get("hrBackReason").getValue();
                variables = [{
                    key: 'hrPass',
                    value: false,
                    type: 'B'
                }, {
                    key: 'hrBackReason',
                    value: backReason,
                    type: 'S'
                }];
            } else {
                variables = [{
                    key: 'hrPass',
                    value: true,
                    type: 'B'
                }];
            }
            break;
        case 'modifyApply':
            var reApply = fui.get('reApply').getValue();
            var leaveType = fui.get('leaveType').getValue();
            var startTime = fui.get('startTime').getValue();
            var endTime = fui.get('endTime').getValue();
            var reason = fui.get('reason').getValue();
            variables = [{
                key: 'reApply',
                value: reApply,
                type: 'B'
            }, {
                key: 'leaveType',
                value: leaveType,
                type: 'S'
            }, {
                key: 'startTime',
                value: startTime,
                type: 'D'
            }, {
                key: 'endTime',
                value: endTime,
                type: 'D'
            }, {
                key: 'reason',
                value: reason,
                type: 'S'
            }];
            break;
        case 'reportBack':
            var realityStartTime = fui.get('realityStartTime').getValue();
            var realityEndTime = fui.get('realityEndTime').getValue();
            variables = [{
                key: 'realityStartTime',
                value: realityStartTime,
                type: 'D'
            }, {
                key: 'realityEndTime',
                value: realityEndTime,
                type: 'D'
            }];
            break;
        default:
            break;
    }
    fui.confirm("确定" + message + "吗？", "提示信息", function (action) {
        if (action == "ok") {
            var messageid = fui.loading("操作中，请稍后......");
            $.ajax({
                url: fui.contextPath + "/supervisor/oa/leave/task/complete/" + taskId,
                type: 'post',
                data: {vars: fui.encode(variables)},
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
                    deptLeaderRejectWindow.hide();
                    hrRejectWindow.hide();
                    deptLeaderAudit.hide();
                    hrAudit.hide();
                    modifyApply.hide();
                    reportBack.hide();
                    doQuery();
                    fui.hideMessageBox(messageid);
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
    });
}

function reject(windowId) {
    fui.get(windowId).show();
}

function cancel(windowId) {
    fui.get(windowId).hide();
}

function changed(e) {
    var reApply = e.value;
    if (reApply == 'true') {
        $('#modifyApplyContent').show();
    } else {
        $('#modifyApplyContent').hide();
    }
}