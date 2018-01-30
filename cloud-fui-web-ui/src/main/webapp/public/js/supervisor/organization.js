fui.parse();

var userManagerGrid = fui.get("userManagerGrid");
var leftTree = fui.get("leftTree");
var currentNode = null; // 当前点击权限树节点
$(function () {
    autoLayoutSize('layout');
    expandRootNode();
    doQuery();
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

var menu_add = {title: '新增机构', url: fui.contextPath + '/supervisor/organization/state'};
var menu_edit = {title: '修改机构', url: fui.contextPath + '/supervisor/organization/state'};

var menuTypeFlag = (fui.menuType == "default");
var iconAdd = menuTypeFlag ? "icon-add" : "icon-and";
var iconRemove = menuTypeFlag ? "icon-remove" : "icon-removenew";
var iconReload = menuTypeFlag ? "icon-reload" : "icon-reloadnew";
var iconEdit = menuTypeFlag ? "icon-edit" : "icon-editnew";

var rootMenu = [
    {text: "增加顶级机构", onclick: "onAddRootMenu", iconCls: iconAdd},
    {text: "增加下级机构", onclick: "onAddMenuOfMenu", iconCls: iconAdd},
    {text: "修改本级机构", onclick: "onEditMenuOfMenu", iconCls: iconEdit},
    {text: "刷新", onclick: "onRefreshNode", iconCls: iconReload}
];

var menu = [
    {text: "增加下级机构", onclick: "onAddMenuOfMenu", iconCls: iconAdd},
    {text: "修改本级机构", onclick: "onEditMenuOfMenu", iconCls: iconEdit},
    {text: "删除本级机构", onclick: "onRemoveMenu", iconCls: iconRemove},
    {text: "刷新", onclick: "onRefreshNode", iconCls: iconReload}
];

var menu_map = {
    root: rootMenu,
    menu: menu
};

function onAddRootMenu(e) {
    openDialog({
        title: menu_add.title,
        url: menu_add.url,
        data: {parentId: -1},
        width: 540,
        height: 215
    }, userManagerGrid);
}

function onAddMenuOfMenu(e) {
    var selectedNode = getSelectedNode();
    openDialog({
        title: menu_add.title,
        url: menu_add.url,
        data: {parentId: selectedNode.id},
        width: 540,
        height: 215
    }, userManagerGrid);
}

function onEditMenuOfMenu(e) {
    var selectedNode = getSelectedNode();
    $.ajax({
        url: fui.contextPath + "/supervisor/organization/selectByPrimaryKey",
        type: "POST",
        data: {id: selectedNode.id},
        dataType: "json",
        success: function (text) {
            text.action = "edit";
            openDialog({
                title: menu_edit.title,
                url: menu_edit.url,
                data: text,
                width: 540,
                height: 215
            }, userManagerGrid);
        }
    });
}

function onRemoveMenu(e) {
    var selectedNode = getSelectedNode();
    fui.confirm("确定删除选中记录？", "提示信息", function (action) {
        if (action == "ok") {
            var json = {parentId: selectedNode.parentId, id: selectedNode.id};
            var messageid = fui.loading("操作中，请稍后......");
            $.ajax({
                url: fui.contextPath + "/supervisor/organization/delete",
                data: json,
                type: "post",
                success: function (text) {
                    text = fui.decode(text);
                    var count = text.count;
                    if (count && parseInt(count) > 0) {
                        fui.showMessageBox({
                            showModal: false,
                            width: 260,
                            title: "提示信息",
                            iconCls: "fui-messagebox-info",
                            message: "选择的机构中有子机构,不可删除!",
                            timeout: 3000,
                            x: "right",
                            y: "bottom"
                        });
                    } else {
                        refreshParentNode();
                    }
                    fui.hideMessageBox(messageid);
                },
                error: function () {
                }
            });
        }
    });
}

function onBeforeOpen(e) {
    var node = leftTree.getSelectedNode();
    var menu = e.sender;
    var menuList = {};
    if (node && node.id && node.code != "root") {
        menuList = menu_map["menu"];
    } else {
        menuList = menu_map["root"];
    }

    if (!menuList || menuList.length == 0) {
        e.cancel = true;
        return;
    }
    menu.loadList(fui.clone(menuList));
}

/**
 * 加载机构人员
 */
function loadGridData() {
    var form = new fui.Form("queryForm");
    var data = form.getData(true, false);
    if (currentNode != null) {
        data.orgId = currentNode.id;
    } else {
        data.orgId = -1;
    }
    userManagerGrid.load(data);
}

/**
 * 查询
 */
function doQuery() {
    loadGridData();
}