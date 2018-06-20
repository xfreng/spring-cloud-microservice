fui.parse();
var form = new fui.Form("#form1");
$(function () {
    var type = fui.menuType;
    var style = fui.menuStyle;
    fui.get("menuType").setValue(type);
    var com = fui.get("pageStyle");
    var dictEntryCodeArgs = "";
    if (type == "default") {
        dictEntryCodeArgs = "('default','bootstrap')";
    } else if (type == "pact") {
        dictEntryCodeArgs = "('pact','black','red','skyblue')";
    }
    com.setUrl(fui.contextPath + "/supervisor/dict/getDictData?dictCode=SKINSTYLE&dictEntryCodeArgs=" + dictEntryCodeArgs);
    fui.get("menuType").setValue(type);
    fui.get("pageStyle").setValue(style);
    preview();//预览
});

function btnUpdate_onClick() {
    var formData = form.getData(true, true);
    $.ajax({
        url: fui.contextPath + "/supervisor/style/updateMenuTypeAndStyle",
        type: 'POST',
        data: formData,
        success: function (text) {
            if (text.result == "1") {
                fui.confirm("保存成功,是否立即生效设置的新皮肤?", "提示信息", function (action) {
                    if (action == "ok") {
                        window.location.href = fui.contextPath + text.url;
                    }
                })
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
                message: "保存失败!",
                timeout: 3000,
                x: "right",
                y: "bottom"
            });
        }
    });
}

function changed(e) {
    var com = fui.get("pageStyle");
    var type = e.value;
    var dictEntryCodeArgs = "";
    if (type == "default") {
        dictEntryCodeArgs = "('default','bootstrap')";
    } else if (type == "pact") {
        dictEntryCodeArgs = "('pact','black','red','skyblue')";
    }
    com.setUrl(fui.contextPath + "/supervisor/dict/getDictData?dictCode=SKINSTYLE&dictEntryCodeArgs=" + dictEntryCodeArgs);
    com.select(0);
    preview();
}


function preview() {
    var menuType = fui.get("menuType").getValue();
    var pageStyle = fui.get("pageStyle").getValue();
    var path = fui.contextPath + "/public/mainframe/images/preview/" + menuType + "_" + pageStyle + ".jpg";
    document.getElementById("layoutSkin").src = path;
}


var pageStyleCheck = fui.get("pageStyle").getValue();
var menuTypeCheck = fui.get("menuType").getValue();
var pageStyle = fui.get("pageStyle").getValue();
var menuType = fui.get("menuType").getValue();
//皮肤
jQuery("#pageStyle").bind('click', function (event) {
    if ($(event.target).is('input')) {
        pageStyle = $(event.target).val();
        if (pageStyleCheck == pageStyle) {
            return;
        } else {
            pageStyleCheck = pageStyle;
        }
        var menuType = fui.get("menuType").getValue();
        var path = fui.contextPath + "/public/mainframe/images/preview/" + menuType + "_" + pageStyle + ".jpg";
        document.getElementById("layoutSkin").src = path;
    }
    if ($(event.target).is('label')) {
        var checklabel = 0;
        for (var i = 0; i < document.getElementsByTagName("label").length; i++) {
            if (document.getElementsByTagName("label")[i] == $(event.target)[0]) {
                checklabel = i;
                break;
            }
        }
        pageStyle = document.getElementsByTagName("input")[checklabel + 2].value;
        if (pageStyleCheck == pageStyle) {
            return;
        } else {
            pageStyleCheck = pageStyle;
        }
        var menuType = fui.get("menuType").getValue();
        var path = fui.contextPath + "/public/mainframe/images/preview/" + menuType + "_" + pageStyle + ".jpg";
        document.getElementById("layoutSkin").src = path;
    }
});
//布局
jQuery("#menuType").bind('click', function (event) {
    if ($(event.target).is('input')) {
        menuType = $(event.target).val();
        if (menuTypeCheck == menuType) {
            return;
        } else {
            menuTypeCheck = menuType;
        }
        pageStyle = fui.get("pageStyle").getValue();
        var path = fui.contextPath + "/public/mainframe/images/preview/" + menuType + "_" + pageStyle + ".jpg";
        document.getElementById("layoutSkin").src = path;
    }

    if ($(event.target).is('label')) {
        var checklabel = 0;
        for (var i = 0; i < document.getElementsByTagName("label").length; i++) {
            if (document.getElementsByTagName("label")[i] == $(event.target)[0]) {
                checklabel = i;
                break;
            }
        }
        menuType = document.getElementsByTagName("input")[checklabel].value;
        if (menuTypeCheck == menuType) {
            return;
        } else {
            menuTypeCheck = menuType;
        }
        pageStyle = fui.get("pageStyle").getValue();
        var path = fui.contextPath + "/public/mainframe/images/preview/" + menuType + "_" + pageStyle + ".jpg";
        document.getElementById("layoutSkin").src = path;
    }
});