fui.parse();

var rightManagerGrid = fui.get("rightManagerGrid");
var leftTree = fui.get("leftTree");
var currentNode = null; // 当前点击权限树节点
$(function () {
    autoLayoutSize('layout');
    expandRootNode();
    doQuery();
    $("#leftTree").parent().bind("contextmenu", function (e) {
        var menu = fui.get("contextMenu");
        menu.showAtPos(e.pageX, e.pageY);
        return false;
    });
});

/**
 * 页面加载展开根目录
 */
function expandRootNode() {
    leftTree.setValue(leftTree.getChildNodes(leftTree.getRootNode())[0].id);
    var node = leftTree.getSelectedNode();
    if (node) {
        currentNode = node;
        refreshNode(node);
    }
}

function onNodeClick(e) {
    currentNode = e.node;
    loadGridData();
}

this.getCurrentNode = function () {
    return currentNode;
}

this.getSelectedNode = function () {
    return leftTree.getSelectedNode();
}

this.getParentNode = function (node) {
    node = node || getCurrentNode();
    return leftTree.getParentNode(node);
}

this.refreshNode = function (node) {
    leftTree.loadNode(node);
}

this.refreshCurrentNode = function () {
    refreshNode(getCurrentNode());
}

this.refreshParentNode = function (node) {
    node = node || getCurrentNode();
    refreshNode(getParentNode(node));
}

function onRefreshNode(e) {
    refreshNode(getSelectedNode());
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
 * 加载子节点
 */
function loadGridData() {
    var form = new fui.Form("queryForm");
    var data = form.getData(true, false);
    if (currentNode != null) {
        data.id = currentNode.id;
    } else {
        data.id = -1;
    }
    rightManagerGrid.load(data);
}

/**
 * 查询
 */
function doQuery() {
    loadGridData();
}

function onRefreshNode(e) {
    if (currentNode != null) {
        refreshParentNode(currentNode);
    } else {
        leftTree.load();
    }
    rightManagerGrid.reload();
}

/**
 * 新增顶级权限
 */
function doAddRoot() {
    var data = {};
    data.action = "add";
    data.parentId = "-1";
    fui.open({
        url: fui.contextPath + "/supervisor/right/state",
        showMaxButton: true,
        title: "新增顶级权限",
        width: 510,
        height: 255,
        onload: function () {
            var iframe = this.getIFrameEl();
            iframe.contentWindow.setData(data);
        },
        ondestroy: function (action) {
            if (action == "ok") {
                rightManagerGrid.reload();
                rightManagerGrid.clearSelect(true);
                if (currentNode != null) {
                    refreshParentNode(currentNode);
                } else {
                    leftTree.load();
                }
            }
        }
    });
}

/**
 * 弹出新增/修改权限面板
 */
function doAdd_update(flag) {
    var action = flag == 'A' ? 'add' : 'edit';
    var title = flag == 'A' ? '新增权限' : '修改权限';
    var row = rightManagerGrid.getSelected();
    var data = {};
    if (flag == 'U') {
        if (row == null) {
            fui.showMessageBox({
                showModal: false,
                width: 260,
                title: "提示信息",
                iconCls: "fui-messagebox-info",
                message: "请先选中需要修改的权限!",
                timeout: 3000,
                x: "right",
                y: "bottom"
            });
            return;
        }
        var rows = rightManagerGrid.getSelecteds();
        if (rows.length > 1) {
            fui.showMessageBox({
                showModal: false,
                width: 260,
                title: "提示信息",
                iconCls: "fui-messagebox-info",
                message: "请选中一条需要修改的权限!",
                timeout: 3000,
                x: "right",
                y: "bottom"
            });
            return;
        }
        data = row;
    } else {
        if (currentNode != null) {
            data.parentId = currentNode.id;
        } else {
            data.parentId = "-1";
        }
    }
    data.action = action;
    fui.open({
        url: fui.contextPath + "/supervisor/right/state",
        showMaxButton: true,
        title: title,
        width: 510,
        height: 255,
        onload: function () {
            var iframe = this.getIFrameEl();
            iframe.contentWindow.setData(data);
        },
        ondestroy: function (action) {
            if (action == "ok") {
                rightManagerGrid.reload();
                rightManagerGrid.clearSelect(true);
                refreshCurrentNode();
            }
        }
    });
}

/**
 * 导出选中数据到sql文件
 */
function doExport() {
    var selectRows = rightManagerGrid.getSelecteds();
    if (selectRows.length == 0) {
        fui.showMessageBox({
            showModal: false,
            width: 260,
            title: "提示信息",
            iconCls: "fui-messagebox-info",
            message: "请选择要导出的权限!",
            timeout: 3000,
            x: "right",
            y: "bottom"
        });
        return;
    }
    $.ajax({
        type: "POST",  //提交方式
        url: fui.contextPath + "/supervisor/permissions/createSqlFile",//路径
        data: {
            selectRows: JSON.stringify(selectRows)
        },
        success: function (result) {//返回数据根据结果进行相应的处理
            var outputPath = result.outputPath;
            var filePath = result.filePath;
            window.location.href = fui.contextPath + "/supervisor/permissions/exportSqlFile?outputPath=" + outputPath + "&filePath=" + filePath;
        }
    });
}

/**
 * 权限类型列渲染
 * @param e
 * @returns {*}
 */
function nodeTypeRender(e) {
    var val = e.row.nodeType;
    if (typeof(val) == "undefined") {
        return val;
    }
    return val == "0" ? "菜单" : "权限";
}