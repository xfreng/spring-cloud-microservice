$(function () {
    doQuery();
});

function doQuery() {
    layui.use('table', function () {

    });
    layui.use('util', function () {

    });
}

/**
 * 操作时间列渲染
 * @param val
 * @returns {string|*}
 */
function logDateRender(val) {
    return layui.util.toDateString(val, "yyyy-MM-dd HH:mm:ss");
}