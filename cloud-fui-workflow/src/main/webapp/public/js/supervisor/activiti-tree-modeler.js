fui.parse();
var tree = fui.get("tree");
var currentNode = null;
var tabName = "designer";
var tabs = fui.get("tabs");

$(function () {
    expandRootNode();
});

function expandRootNode() {
    tree.setValue(tree.getChildNodes(tree.getRootNode())[0].id);
    var node = tree.getSelectedNode();
    if (node) {
        currentNode = node;
    }
}

this.getCurrentNode = function () {
    return currentNode;
}

this.getSelectedNode = function () {
    return tree.getSelectedNode();
}

this.getParentNode = function (node) {
    node = node || getCurrentNode();
    return tree.getParentNode(node);
}

this.refreshNode = function (node) {
    tree.loadNode(node);
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

// 树节点点击事件
function onNodeClick(e) {
    currentNode = e.node;
    changeIFrameSrc(e.node);
    changeHighlightNode(e.node.id);
}

// 点击同一个节点不刷新
function iFrameLoading(url) {
    var designerTab = tabs.getTab(tabName);
    var tabUrl = designerTab.url;
    if (tabUrl.indexOf(url) == -1) {
        var options = {url: url};
        tabs.updateTab(designerTab, options);
    }
}

// 点击显示相应流程图
function changeIFrameSrc(node) {
    var modelId = node.resourceId;
    $.ajax({
        url: fui.contextPath + "/supervisor/workflow/treeModel/checkModelByModelId",
        type: "post",
        dataType: "json",
        async: false,
        data: {"modelId": modelId},
        success: function (data) {
            var state = data.state;
            if (state != 1) {
                var parentNode = getParentNode(node);
                if (parentNode != null) {
                    modelId = parentNode.resourceId;
                }
            }
            iFrameLoading(fui.contextPath + "/public/bpm/modeler.html?modelId=" + modelId);
        }
    });
}

// 点击节点设置对应节点颜色高亮显示
function changeHighlightNode(highlightId) {
    var designerTab = tabs.getTab(tabName);
    var iFrame = tabs.getTabIFrameEl(designerTab);
    var iFrameBody = iFrame.contentWindow.document.body;
    var id = "svg-" + highlightId;
    var highlightNodes = $(iFrameBody).find("g[id='" + id + "']").parent().children();
    if (highlightNodes.length > 0) {
        highlightNodes.each(function () {
            var _id = $(this).attr("id");
            if (_id == id) {
                var rects = $(this).find("rect");
                var editor = $(this).find("g[class='me']").get(0);
                rects.each(function () {
                    var strokeWidth = $(this).attr("stroke-width");
                    if (strokeWidth == 1) {//改变边框厚度和颜色
                        $(this).attr("stroke", "#ff0000");
                        $(this).attr("stroke-width", 3.5);
                        triggerMouseEvents(editor);
                    }
                });
            } else {
                var rects = $(this).find("rect");
                rects.each(function () {
                    var strokeWidth = $(this).attr("stroke-width");
                    if (strokeWidth == 3.5) {//改变边框厚度和颜色
                        $(this).attr("stroke", "#bbbbbb");
                        $(this).attr("stroke-width", 1);
                    }
                });
            }
        });
    } else {
        var rects = $(iFrameBody).find("rect");
        rects.each(function () {
            var strokeWidth = $(this).attr("stroke-width");
            if (strokeWidth == 3.5) {//改变边框厚度和颜色
                $(this).attr("stroke", "#bbbbbb");
                $(this).attr("stroke-width", 1);
                var editor = $(iFrameBody).find("#canvasSection").find(".ORYX_Editor").get(0);
                triggerMouseEvents(editor);
            }
        });
    }
}

// 触发鼠标点击事件
function triggerMouseEvents(editor) {
    var mousedownEvt = document.createEvent("MouseEvents");
    mousedownEvt.initEvent("mousedown", false, true);
    editor.dispatchEvent(mousedownEvt);
    var mouseupEvt = document.createEvent("MouseEvents");
    mouseupEvt.initEvent("mouseup", false, true);
    editor.dispatchEvent(mouseupEvt);
}