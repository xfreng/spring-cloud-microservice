<%@page language="java" contentType="text/html; charset=UTF-8" %>
<style type="text/css">
    .container-fluid {
        padding-right: 0;
        padding-left: 0;
    }
    .layui-tab ul.layui-tab-title li:nth-child(1) i {
        display: none;
    }
</style>
<div class="layui-tab layui-tab-card" lay-filter="tab" lay-allowclose="true">
    <ul class="layui-tab-title">
        <li class="layui-this" lay-id="11">首页</li>
    </ul>
    <div class="layui-tab-content">
        <div name="first" class="layui-tab-item layui-show">
            <!---title----->
            <div class="info-title">
                <div class="pull-left">
                    <h4><strong>${user.ename}，</strong></h4>
                    <p>欢迎登录统一认证管理系统！</p>
                </div>
                <div class="time-title pull-right">
                    <div class="year-month pull-left">
                        <p>星期${dayOfWeek}</p>
                        <p><span>${year}</span>年${month}月${date}日</p>
                    </div>
                    <div class="hour-minute pull-right">
                        <strong id="timerHMS">9:00</strong>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <!----content-list---->
            <div class="content-list">
                <div class="row">
                    <div class="col-md-3">
                        <div class="content">
                            <div class="w30 left-icon pull-left">
                                <span class="glyphicon glyphicon-file blue"></span>
                            </div>
                            <div class="w70 right-title pull-right">
                                <div class="title-content">
                                    <p>待办事项</p>
                                    <h3 class="number">90</h3>
                                    <button class="btn btn-default">待我处理<span style="color:red;">12</span></button>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="content">
                            <div class="w30 left-icon pull-left">
                                <span class="glyphicon glyphicon-file violet"></span>
                            </div>
                            <div class="w70 right-title pull-right">
                                <div class="title-content">
                                    <p>待办事项</p>
                                    <h3 class="number">90</h3>
                                    <button class="btn btn-default">待我处理<span style="color:red;">12</span></button>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="content">
                            <div class="w30 left-icon pull-left">
                                <span class="glyphicon glyphicon-file orange"></span>
                            </div>
                            <div class="w70 right-title pull-right">
                                <div class="title-content">
                                    <p>待办事项</p>
                                    <h3 class="number">90</h3>
                                    <button class="btn btn-default">待我处理<span style="color:red;">12</span></button>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="content">
                            <div class="w30 left-icon pull-left">
                                <span class="glyphicon glyphicon-file green"></span>
                            </div>
                            <div class="w70 right-title pull-right">
                                <div class="title-content">
                                    <p>待办事项</p>
                                    <h3 class="number">90</h3>
                                    <button class="btn btn-default">待我处理<span style="color:red;">12</span></button>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </div>
                </div>
                <!-------信息列表------->
                <div class="row newslist" style="margin-top:20px;">
                    <div class="col-md-8">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                我的事务<div class="caret"></div>
                                <a href="javascript:void(0);" class="pull-right"><span class="glyphicon glyphicon-refresh"></span></a>
                            </div>
                            <div class="panel-body">
                                <div class="w15 pull-left">
                                    <img src="${path}/public/img/noavatar_middle.gif" width="25" height="25" alt="图片" class="img-circle">
                                    安妮
                                </div>
                                <div class="w55 pull-left">系统需要升级</div>
                                <div class="w20 pull-left text-center">2016年8月23日</div>
                                <div class="w10 pull-left text-center"><span class="text-green-main">处理中</span></div>
                            </div>

                            <div class="panel-body">
                                <div class="w15 pull-left">
                                    <img src="${path}/public/img/noavatar_middle.gif" width="25" height="25" alt="图片" class="img-circle">
                                    安妮
                                </div>
                                <div class="w55 pull-left">系统需要升级</div>
                                <div class="w20 pull-left text-center">2016年8月23日</div>
                                <div class="w10 pull-left text-center"><span class="text-green-main">处理中</span></div>
                            </div>

                            <div class="panel-body">
                                <div class="w15 pull-left">
                                    <img src="${path}/public/img/noavatar_middle.gif" width="25" height="25" alt="图片" class="img-circle">
                                    安妮
                                </div>
                                <div class="w55 pull-left">系统需要升级</div>
                                <div class="w20 pull-left text-center">2016年8月23日</div>
                                <div class="w10 pull-left text-center"><span class="text-gray">已关闭</span></div>
                            </div>

                            <div class="panel-body">
                                <div class="w15 pull-left">
                                    <img src="${path}/public/img/noavatar_middle.gif" width="25" height="25" alt="图片" class="img-circle">
                                    安妮
                                </div>
                                <div class="w55 pull-left">系统需要升级</div>
                                <div class="w20 pull-left text-center">2016年8月23日</div>
                                <div class="w10 pull-left text-center"><span>处理中</span></div>
                            </div>
                            <div class="panel-body">
                                <div class="w15 pull-left">
                                    <img src="${path}/public/img/noavatar_middle.gif" width="25" height="25" alt="图片" class="img-circle">
                                    安妮
                                </div>
                                <div class="w55 pull-left">系统需要升级</div>
                                <div class="w20 pull-left text-center">2016年8月23日</div>
                                <div class="w10 pull-left text-center"><span>处理中</span></div>
                            </div>
                            <div class="panel-body">
                                <div class="w15 pull-left">
                                    <img src="${path}/public/img/noavatar_middle.gif" width="25" height="25" alt="图片" class="img-circle">
                                    安妮
                                </div>
                                <div class="w55 pull-left">系统需要升级</div>
                                <div class="w20 pull-left text-center">2016年8月23日</div>
                                <div class="w10 pull-left text-center"><span>处理中</span></div>
                            </div>

                            <div class="panel-body text-center">
                                <a href="javascript:void(0);" style="color:#5297d6;">查看全部</a>
                            </div>

                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                我的事务统计
                                <a href="javascript:void(0);" class="pull-right"><span class="glyphicon glyphicon-refresh"></span></a>
                            </div>
                            <div class="panel-body">

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
    layui.use('element', function () {
        var $ = layui.jquery
            , element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块

        //触发事件
        var active = {
            tabAdd: function () {
                //新增一个Tab项
                element.tabAdd('demo', {
                    title: '新选项' + (Math.random() * 1000 | 0) //用于演示
                    , content: '内容' + (Math.random() * 1000 | 0)
                    , id: new Date().getTime() //实际使用一般是规定好的id，这里以时间戳模拟下
                })
            }
            , tabDelete: function (othis) {
                //删除指定Tab项
                element.tabDelete('demo', '44'); //删除：“商品管理”


                othis.addClass('layui-btn-disabled');
            }
            , tabChange: function () {
                //切换到指定Tab项
                element.tabChange('demo', '22'); //切换到：用户管理
            }
        };

        $('.site-demo-active').on('click', function () {
            var othis = $(this), type = othis.data('type');
            active[type] ? active[type].call(this, othis) : '';
        });

        //Hash地址的定位
        var layid = location.hash.replace(/^#test=/, '');
        element.tabChange('test', layid);

        element.on('tab(test)', function (elem) {
            location.hash = 'test=' + $(this).attr('lay-id');
        });

    });
</script>