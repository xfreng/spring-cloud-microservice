//切换显示模式
var fullScreenStatus = "inline";

// 切换显示模式
function toggleFullScreen() {
    if (fullScreenStatus == "inline") {
        fullScreenStatus = "none";

        if (parent.document.getElementById("leftTree") != null) {
            parent.document.getElementById("leftTree").style.display = "none";
        }
        if (parent.document.getElementById("middleSplitter") != null) {
            parent.document.getElementById("middleSplitter").style.display = "none";
        }
        if (parent.document.getElementById("frameHeadLine") != null) {
            parent.document.getElementById("frameHeadLine").style.display = "none";
        }
        if (parent.document.getElementById("frameMenuLine") != null) {
            parent.document.getElementById("frameMenuLine").style.display = "none";
        }

        $('#' + '_efFormMenu_showMode').button("option", "icons", {
            primary: 'ef-icon ef-icon-normalscreen'
        });
    } else {
        fullScreenStatus = "inline";
        if (parent.document.getElementById("leftTree") != null) {
            parent.document.getElementById("leftTree").style.display = "inline";
        }
        if (parent.document.getElementById("middleSplitter") != null) {
            parent.document.getElementById("middleSplitter").style.display = "inline";
        }
        if (parent.document.getElementById("frameHeadLine") != null) {
            parent.document.getElementById("frameHeadLine").style.display = "inline";
        }

        if (parent.document.getElementById("frameMenuLine") != null) {
            parent.document.getElementById("frameMenuLine").style.display = "inline";
        }

        $('#' + '_efFormMenu_showMode').button("option", "icons", {
            primary: 'ef-icon ef-icon-fullscreen'
        });

    }
}

//初始化页面的配置下拉菜单
function _initFormConfigMenu() {

    if ($('#' + 'efFormConfigMenu').attr("_init") === "true") return;

    // 关闭图标
    var _close_config_menu = $("<a href='#'>关闭配置菜单</a>").button({
        icons: {
            primary: "ui-icon-close"
        },
        text: false
    }).click(function (event) {
        $('#' + 'efFormConfigMenu').fadeOut(250);
    });
    $('#' + 'efFormConfigMenuTitle').append(_close_config_menu);

    // 配置下拉菜单
    var icon_css = "ef-icon ef-icon-close";
    $('#' + '_efFormMenu_close').addClass("ef-state-default").button({
        icons: {
            primary: icon_css
        },
        disabled: true
    }).click(function (event) {
        $('#efFormConfigMenu').hide();
        window.close();
    });

    $('#' + '_efFormMenu_showMode').addClass("ef-state-default")
        .button({
            icons: {
                primary: "ef-icon ef-icon-fullscreen"
            },
            disabled: true
        }).click(function (event) {
        $('#efFormConfigMenu').hide();
        toggleFullScreen();
    });

    var newform = window.parent.__newForm;
    if (newform === false) {
        $('#' + '_efFormMenu_showMode').button("enable");
    } else {
        $('#' + '_efFormMenu_close').button("enable");
    }

    $('#' + '_efFormMenu_print').addClass("ef-state-default").button({
        icons: {
            primary: "ef-icon ef-icon-print"
        }
    }).click(function (event) {
        $('#efFormConfigMenu').hide();
        window.print();
    });
    // 帮助
    $('#' + '_efFormMenu_help').addClass("ef-state-default").button({
        icons: {
            primary: "ef-icon ef-icon-help"
        }
    }).click(function (event) {
        $('#efFormConfigMenu').hide();
        window.open(_helpFilePath);
    });

    // 收藏
    $('#' + '_efFormMenu_favorites').addClass("ef-state-default").button({
        icons: {
            primary: "ef-icon ef-icon-favorites"
        }
    }).click(function (event) {
        favorites();
    });

    // 去除下拉菜单中图标的背景色
    $("#efFormConfigMenu").find("a").css("border", "none");
    $("#efFormConfigMenu").find("span");

    $('#' + 'efFormConfigMenu').attr("_init", "true");
}

function favorites() {
    var inInfo = new EiInfo();
    inInfo.set("efFormEname", $("#efFormEname").val());
    EiCommunicator.send("ES10", "favorites", inInfo, {
        onSuccess: function (eiinfo) {
            var status = eiinfo.getStatus();
            if (status != -1)
                alert('收藏页面成功!');
            else
                alert('收藏夹已存在该页面!');
        },
        onFail: function (eMsg) {
            alert(eMsg);
        }
    }, false);
}

//初始化状态提示
function _initFormStatusDiv() {

    if ($('#' + 'efFormStatus').attr("_init") === "true") return;

    // 状态行提示图标
    $('#' + '_eiStatusImg').click(function (event) {
        ef.toggleDivDisplay('efFormDetailDiv');
        return false;
    });

    // 关闭状态行图标
    $('#' + '_closeStatus').click(function (event) {
        $('#efFormStatus').dialog('close');
        return false;
    });

    // 固定状态行图标
    $('#' + '_stickStatus').attr("stickStatus", "w").click(function () {
        if ($('#' + '_stickStatus').attr("stickStatus") == "w") {
            $('#' + '_stickStatus').addClass('ui-icon-pin-s').removeClass("ui-icon-pin-w").attr("stickStatus", "s");
            clearTimeout($("#efFormStatus").attr("timeId"));
        } else {
            $('#' + '_stickStatus').addClass('ui-icon-pin-w').removeClass("ui-icon-pin-s").attr("stickStatus", "w");
        }
        return false;
    });

    $('#' + 'efFormStatus').attr("_init", "true");
}

//初始化页面首部DIV
function _initFormHeadDiv() {
    if ($('#' + 'efFormHead').attr("_init") === "true") return;

    // 页面配置图标
    $('#' + '_efFormConfig').addClass("ef-state-default ef-form-configDiv").button({
        icons: {
            primary: "ef-icon ef-icon-gear",
            secondary: "ef-icon ef-icon-expand"
        },
        text: false
    }).css({'height': '20px', 'margin': '0px'}).click(function (event) {

        //关闭所有配置菜单 20130714
        $('.ef-form-config-menu').each(function () {
            $(this).hide();
        });

        if ($('#' + 'efFormConfigMenu').attr("_init") !== "true") {
            _initFormConfigMenu();
        }

        var configMenuObj = $('#efFormConfigMenu');

        configMenuObj.fadeIn(250).position({
            my: "right top",
            at: "right bottom",
            of: '#' + '_efFormConfig',
            offset: "0" + " 12",
            collision: "fit"
        });
        var configMenuiFrame = $('#efFormConfigMenu_cover');

        if ($.browser.msie && $.browser.version == 6) {
            configMenuiFrame.css({'display': 'block', 'position': 'absolute'});
            configMenuiFrame.height(configMenuObj.height() + 11);
            configMenuiFrame.width(configMenuObj.width() + 11);
            configMenuiFrame.fadeIn(250).position({
                my: "right top",
                at: "right bottom",
                of: '#' + '_efFormConfig',
                offset: "0" + " 12",
                collision: "fit"
            });
        }

        $("body").click(function () {
            configMenuObj.fadeOut(250);
        });
        return false;
    });

    // 去除首行图标按钮的背景色
    $("#efFormHead").find("a").css("border", "none");

    $('#' + 'efFormHead').attr("_init", "true");
}

$(document).ready(function () {
    //判断是否在iFrame中
    //如果是，将head和tail隐藏，同时添加样式ef-form-iframe-body
    if (self.frameElement != null && (self.frameElement.tagName == "IFRAME" || self.frameElement.tagName == "iframe")) {

        $(document.body).addClass("ef-form-iframe-body");
    }

    _initFormHeadDiv();
    _initFormStatusDiv();

});

$(document).ready(function () {
    setTitle();
    addButtonEffect();
    $(window).bind("load resize", function () {
        // 圆角样式
        $(".benma_ui_tab li").addClass("ef-cornerredius-top");
        $(".tab_item .tab_item1").addClass("ef-cornerredius-tl");
        $(".tab_item .tab_item3").addClass("ef-cornerredius-tr");

        // 标题栏/工具栏类样式
        $(".ef-grid-func").addClass("ef-header");
        $(".ef-grid-tableHeader").addClass("ef-header");
    });
});

function setTitle() {
    var page_title = "<title>" + $("#efFormCname").val() + "</title>";
    document.getElementsByTagName("head")[0].appendChild($(page_title).get(0));
}