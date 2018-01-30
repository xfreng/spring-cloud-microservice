getRootPath = function () {
    var pathName = window.document.location.pathname;
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return projectName;
}

__CreateJSPath = function (js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
}
//fui bootPath
var bootPATH = __CreateJSPath("fui.js");

//debugger,此变量用来区别ajax请求是否弹出alert来提示交互错误
fui_debugger = false;

document.write('<link rel="icon"  href="/app.ico"  type="image/x-icon"/>');
document.write('<link rel="SHORTCUT ICON"  href="/app.ico"  type="image/x-icon"/>');
//默认加载min
document.write('<script src="' + bootPATH + 'fui-min.js" type="text/javascript" ></script>');
document.write('<script src="' + bootPATH + 'locale/zh_CN.js" type="text/javascript" ></script>');
//默认样式
document.write('<link href="' + bootPATH + 'themes/default/fui.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'themes/icons.css" rel="stylesheet" type="text/css" />');
