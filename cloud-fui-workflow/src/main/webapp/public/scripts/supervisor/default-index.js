var __newForm = "true";
var __clickNode = null;
var leftMenuModel = new eiTreeModel();

function configTree(tree) {
    tree.depth(9);
    tree.emptyNodeAsLeaf = true;
    tree.activeEmptyJudger = false;
    tree.nodeInitializer = treeNodeInitializer;
    tree.hideRoot = true;
}

function treeNodeInitializer(node) {
    node.textClicked = function () {
        activeFormByNode(node);
    };
}

function activeFormByNode(node) {
    loadMenuUrl(node);
}

function activeFormByMenu(node) {
    __clickNode = node;
    loadMenuUrl(node);
}

// 新增以下js函数
loadMenuUrl = function (node) {
    var label = node.label();
    var text = node.text();
    var url = node._data.url;
    if (url && ($.trim(url) != "")) {
        activeForm(label, text, url);
        return;
    }
    if (node.leaf()) {
        activeForm(label, text, url);
    }
}

function activeForm(label, text, url) {
    if (__newForm == "true") {
        newForm(label, text, url);
    } else {
        openForm(label, text, url);
    }
}

function newForm(label, text, url) {
    label = (url && $.trim(url) != "") ? url : label;
    window.open(fui.contextPath + label);
}

function openForm(label, text, url) {
    var node = {};
    if (__clickNode != null) {
        node.id = __clickNode._data.label;
        node.text = __clickNode._data.text;
    } else {
        node.id = label;
        node.text = text;
    }
    node.url = url;
    showTab(node);
}