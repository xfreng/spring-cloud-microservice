/**
 * 打开弹出框(适用于tree和grid联动时)
 * @param params
 */
function openDialog(params, grid) {
    var openParams = fui.clone(params);

    openParams.onload || (openParams.onload = function () {
        var iframe = this.getIFrameEl();
        var contentWindow = iframe.contentWindow;

        if (contentWindow.setData) {
            contentWindow.setData(openParams.data);
        }
    });
    openParams.ondestroy || (openParams.ondestroy = function (action) {
        if (action == "ok") {
            grid.reload();
            refreshNode(getSelectedNode());
        }
    });
    fui.open(openParams);
}

/**
 * 关闭弹出窗口
 * @param action 关闭标记(close,cancel)
 * @param validateForm 表单数据变更验证
 * @returns {*}
 * @constructor
 */
function CloseWindow(action, validateForm) {
    if (action == "close" && validateForm != undefined && validateForm.isChanged()) {
        if (confirm("数据被修改了，是否先保存？")) {
            return false;
        }
    }
    if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
    else window.close();
}

/**
 * 检测是否已经安装flash，检测flash的版本
 * @returns {string}
 */
function checkAgentInstalledFlash() {
    var url = "";
    var flashVersion = (function () {
            var version;

            try {
                version = navigator.plugins['Shockwave Flash'];
                version = version.description;
            } catch (ex) {
                try {
                    version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                        .GetVariable('$version');
                } catch (ex2) {
                    version = '0.0';
                }
            }
            version = version.match(/\d+/g);
            return parseFloat(version[0] + '.' + version[1], 10);
        })(),

        supportTransition = (function () {
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
            s = null;
            return r;
        })();
    // flash 安装了但是版本过低。
    if (flashVersion) {
        (function (container) {
            window['expressinstallcallback'] = function (state) {
                switch (state) {
                    case 'Download.Cancelled':
                        alert('您取消了更新！')
                        break;

                    case 'Download.Failed':
                        alert('安装失败')
                        break;

                    default:
                        alert('安装已成功，请刷新！');
                        break;
                }
                delete window['expressinstallcallback'];
            };
        })();
    } else {// 压根就没有安转。
        url = "https://www.adobe.com/go/getflashplayer";
    }
    return url;
}