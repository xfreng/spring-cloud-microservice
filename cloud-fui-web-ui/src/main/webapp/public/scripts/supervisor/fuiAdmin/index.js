layui.config({
    base: fuiAdmin.contextPath + '/webjars/fui/public/fuiAdmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use('index', function () {
    let requestUrl = fuiAdmin.contextPath + '/supervisor/menu/fuiAdminNodes';
    let method = 'post';
    let data = {'id': 'root'};
    layui.admin.ajaxRequest(requestUrl, method, data, function (res) {
        // let html = '<li data-name="home" class="layui-nav-item">';
        // html += '<a href="javascript:;" lay-tips="系统监控" lay-direction="2">';
        // html += '<i class="layui-icon layui-icon-app"></i>';
        // html += '<cite>系统监控</cite>';
        // html += '</a>';
        // html += '<dl class="layui-nav-child">';
        // html += '<dd data-name="console">';
        // html += '<a lay-href="home/console.html">控制台</a>';
        // html += '</dd>';
        // html += '</dl>';
        // html += '</li>';
        // let treeNodes = res.treeNodes;
        // layui.jquery.each(treeNodes, function (i, item) {
        //     let name = item.id;
        //     let text = item.text;
        //     let image = item.image;
        //     html += '<li data-name="' + name + '" class="layui-nav-item">';
        //     html += '<a href="javascript:;" lay-tips="' + text + '" lay-direction="2">';
        //     if (layui.jquery.trim(image)) {
        //         html += '<i class="layui-icon ' + image + '"></i>';
        //     }
        //     html += '<cite>' + text + '</cite>';
        //     html += '</a>';
        //     html += appendChildNodes(name);
        //     html += '</li>';
        // });
        layui.jquery('#LAY-system-side-menu').html(res.html);
        layui.element.init();
    });

    function appendChildNodes(id) {
        let html = '';
        let data = {'id': id};
        layui.admin.ajaxRequest(requestUrl, method, data, function (res) {
            let treeNodes = res.treeNodes;
            layui.jquery.each(treeNodes, function (i, item) {
                let name = item.id;
                let url = item.url;
                let text = item.text;
                let param = item.param;
                html += '<dl class="layui-nav-child">';
                html += '<dd ' + param + ' data-name="' + name + '">';
                if (layui.jquery.trim(url)) {
                    html += '<a lay-href="' + url + '">' + text + '</a>';
                } else {
                    html += '<a href="javascript:;">' + text + '</a>';
                }
                html += appendChildNodes(name);
                html += '</dd>';
                html += '</dl>';
            });
        }, false);
        return html;
    }
});