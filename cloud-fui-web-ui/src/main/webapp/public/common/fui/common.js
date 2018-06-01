function reload() {
    window.location.reload();
}

/** Ajax请求异常处理全局设置 */
$(document).ajaxComplete(function (evt, request, settings) {
    var text = request.responseText;
    if (typeof(text) === "undefined") {
        return;
    }
    if (text.indexOf("权限不足") !== -1) {
        alert("权限不足!");
    } else if (text === "timeout") { //判断返回的数据内容，如果是超时，则跳转到登陆页面
        alert("未登录或登录超时!");
        var win = window.parent || window;
        win.location.href = fui.contextPath + '/logout';
    }
});

var timerObj = "";

function setCurTime(objID, color) {
    if (objID) {
        timerObj = objID;
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var day = now.getDay();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();

        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        var arr_week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        var week = arr_week[day];
        var timeString = year + "年" + month + "月" + date + "日 " + week + " " + hours + ":" + minutes + ":" + seconds;
        var oCtl = document.getElementById(timerObj);
        if (color !== "") {
            oCtl.innerHTML = "<span style='color:blue;'>" + timeString + "</span>";
        } else {
            oCtl.innerHTML = timeString;
        }
        setTimeout("setCurTime('" + timerObj + "','" + color + "');", 1000);
    }
}

function setCurTimeTop(objID) {
    if (objID) {
        timerObj = objID;
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var day = now.getDay();

        if (date < 10) date = "0" + date;
        var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
        var week = arr_week[day];
        var timeString = year + "年" + month + "月" + date + "日 " + " " + week;
        var oCtl = document.getElementById(timerObj);
        oCtl.innerHTML = timeString;
    }
}

function selectAllOrNot(flag) {
    var myselect = document.getElementsByTagName("input");
    if (flag == "true") {
        for (var i = 0; i < myselect.length; i++) {
            if (myselect[i].type == "checkbox") {
                myselect[i].checked = true;
            }
        }
    } else if (flag == "false") {
        for (var i = 0; i < myselect.length; i++) {
            if (myselect[i].type == "checkbox") {
                myselect[i].checked = false;
            }
        }
    }
}

var count = 1;

function selectAllOrNotNoFlag() {
    var myselect = document.getElementsByTagName("input");
    for (var i = 0; i < myselect.length; i++) {
        var itemElement = myselect[i];
        if (itemElement.type === "checkbox") {
            if (count % 2 === 0) {
                itemElement.checked = false;
            } else {
                itemElement.checked = true;
            }
        }
    }
    count++;
}

/**
 * 将yyyyMMddHHmmss格式化成yyyy-MM-dd HH:mm:ss
 *
 * @param e
 *         grid列对象
 */
function formatDate(e) {
    var dateString = e.value;
    if (typeof(dateString) !== "undefined" && dateString.trim() !== "") {
        var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        dateString = dateString.replace(pattern, "$1-$2-$3 $4:$5:$6");
    }
    return dateString;
}

/**
 * 转换被JSON格式化后的日期
 *
 * @param e
 *         grid列对象
 */
function formatJsonDate(e) {
    var dateString = e.value;
    if (typeof(dateString) !== "undefined" && dateString.toString().trim() !== "") {
        dateString = fui.formatDate(new Date(dateString), "yyyy-MM-dd HH:mm:ss");
    }
    return dateString;
}

/**
 * 日期转换（支持cst -6时区时间格式）
 *
 * @param val
 *         要转换的日期值
 * @param size
 *         转换的日期格式
 *            (支持8-yyyyMMdd、10-yyyy-MM-dd、14-yyyyMMddHHmmss、19-yyyy-MM-dd HH:mm:ss)
 * @param iscst
 *         是否是cst格式
 *
 */
function formatterDate(val, size, iscst) {
    if (typeof(val) === "undefined" && val.trim() !== "") {
        return "";
    }
    var date = new Date(val);
    if (!(iscst === false)) {
        var localTime = date.getTime();
        var localOffset = date.getTimezoneOffset() * 60000;
        var utc = localTime + localOffset;
        var offset = -6;
        var cst = utc + (3600000 * offset);
        date = new Date(cst);
    }
    var formaterDataStr = "";
    var year = date.getFullYear();
    if (date.getFullYear() < 1900) {
        return "";
    }
    var month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    var day = date.getDate();
    day = day < 10 ? ("0" + day) : day;
    var hours = date.getHours();
    hours = hours < 10 ? ("0" + hours) : hours;
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? ("0" + minutes) : minutes;
    var seconds = date.getSeconds();
    seconds = seconds < 10 ? ("0" + seconds) : seconds;
    if (size === 8) {
        formaterDataStr = year + "" + month + day;
    } else if (size === 10) {
        formaterDataStr = year + "-" + month + "-" + day;
    } else if (size === 14) {
        formaterDataStr = year + "" + month + day + hours + minutes + seconds;
    } else if (size === 19) {
        formaterDataStr = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    }
    return formaterDataStr;
}