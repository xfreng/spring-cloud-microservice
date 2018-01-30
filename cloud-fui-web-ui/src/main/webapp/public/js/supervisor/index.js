var openTypes = [{id: "true", text: "新窗口"}, {id: "false", text: "当前窗口"}];
fui.parse();
var tabs = fui.get("mainTabs");
var editPassTemplateWindow = fui.get("editPassTemplate");
var editPassForm = new fui.Form("editPassForm");
var currentTab = null;

function changeOpenWindow(e) {
    var changeWindowTemplateWindow = fui.get("changeWindowTemplate");
    if (e && e.value != undefined) {
        __newForm = e.value;
        changeWindowTemplateWindow.hide();
    } else {
        fui.get("rbl").setValue(__newForm);
        changeWindowTemplateWindow.show();
    }
}

if (window.attachEvent) {
    window.attachEvent('onunload', function () {
        closeSonWindow();
    });
}

function changePwdWindow() {
    editPassForm.clear();
    editPassTemplateWindow.show();
}

function onPasswordValidation(e) {
    if (e.isValid) {
        var pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
        if (pattern.test(e.value) == false) {
            e.errorText = "密码必须是6-12位字母(区分大小写)和数字的组合";
            e.isValid = false;
        }
    }
}

function onNewPassword1Validation(e) {
    onPasswordValidation(e);
    if (e.isValid) {
        if (fui.get("oldPassword").getValue() == e.value) {
            e.errorText = "新密码不能与原始密码相同";
            e.isValid = false;
        }
    }
}

function onNewPassword2Validation(e) {
    onPasswordValidation(e);
    if (e.isValid) {
        if (fui.get("newPassword1").getValue() != e.value) {
            e.errorText = "两次输入的新密码不一致";
            e.isValid = false;
        }
    }
}

function onBeforeOpen(e) {
    currentTab = tabs.getTabByEvent(e.htmlEvent);
    if (!currentTab) {
        e.cancel = true;
    }
}

function closeTab() {
    if (currentTab.showCloseButton) {
        tabs.removeTab(currentTab);
    }
}

function closeAllBut() {
    var but = [currentTab];
    but.push(tabs.getTab("first"));
    tabs.removeAll(but);
}

function closeAll() {
    var but = [tabs.getTab("first")];
    tabs.removeAll(but);
}

function showTab(node) {
    var id = "tab$" + node.id;
    var tab = tabs.getTab(id);
    if (!tab) {
        tab = {};
        tab._nodeid = node.id;
        tab.name = id;
        tab.title = node.text;
        tab.url = fui.contextPath + (node.url && $.trim(node.url) != "" ? node.url : node.id);
        tab.showCloseButton = true;
        tabs.addTab(tab);
    }
    tabs.activeTab(tab);
}

function onTabsActiveChanged(e) {
    var tabs = e.sender;
    var tab = tabs.getActiveTab();
    if (tab && tab._nodeid) {
        // do something
    }
}

function updateStyle(type, style) {
    var data = {
        menuType: type,
        pageStyle: style
    };
    $.ajax({
        url: fui.contextPath + "/supervisor/style/updateMenuTypeAndStyle",
        type: 'POST',
        data: data,
        success: function (text) {
            var result = text.result;
            if (result == "1") {
                window.location.href = fui.contextPath + text.url;
            } else {
                fui.showMessageBox({
                    showModal: false,
                    width: 260,
                    title: "提示信息",
                    iconCls: "fui-messagebox-info",
                    message: "更换失败!",
                    timeout: 3000,
                    x: "right",
                    y: "bottom"
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            fui.showMessageBox({
                showModal: false,
                width: 260,
                title: "提示信息",
                iconCls: "fui-messagebox-info",
                message: "更换失败!",
                timeout: 3000,
                x: "right",
                y: "bottom"
            });
        }
    });
}

function save() {
    var data = editPassForm.getData();
    editPassForm.validate();
    if (editPassForm.isValid() == false) return;
    $.ajax({
        url: fui.contextPath + "/supervisor/user/updatePwd",
        type: "post",
        data: data,
        success: function (text) {
            fui.confirm(text.message, "提示信息", function () {
                if (text.result == "1") {
                    window.location.href = fui.contextPath + "/supervisor/login/logout";
                }
            });
        }
    });
}

function cancel() {
    editPassTemplateWindow.hide();
}