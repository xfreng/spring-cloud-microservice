<%@page language="java" contentType="text/html; charset=UTF-8" %>
<nav class="nav navbar-default navbar-mystyle navbar-fixed-top">
    <div class="navbar-header">
        <button class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand mystyle-brand"><span class="glyphicon glyphicon-home"></span></a> </div>
    <div class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
            <li class="li-border"><a class="mystyle-color" href="javascript:void(0);">管理控制台</a></li>
            <li class="dropdown li-border"><a href="javascript:void(0);" class="dropdown-toggle mystyle-color" data-toggle="dropdown">产品与服务<span class="caret"></span></a>
                <!----下拉框选项---->
                <div class="dropdown-menu topbar-nav-list">
                    <div class="topbar-nav-col">
                        <div class="topbar-nav-item">
                            <p class="topbar-nav-item-title">弹性计算</p>
                            <ul>
                                <li><a href="javascript:void(0);">
                                    <span class="glyphicon glyphicon-road"></span>
                                    <span class="">云服务器 ECS</span>
                                </a>
                                </li>
                                <li><a href="javascript:void(0);">
                                    <span class="glyphicon glyphicon-picture"></span>
                                    <span class="">云服务器 ECS</span>
                                </a>
                                </li>
                                <li><a href="javascript:void(0);">
                                    <span class="glyphicon glyphicon-gift"></span>
                                    <span class="">云服务器 ECS</span>
                                </a>
                                </li>
                            </ul>
                        </div>

                        <div class="">
                            <p class="topbar-nav-item-title">弹性计算</p>
                            <ul>
                                <li><a href="javascript:void(0);">
                                    <span class="glyphicon glyphicon-road"></span>
                                    <span class="">云服务器 ECS</span>
                                </a>
                                </li>
                                <li><a href="javascript:void(0);">
                                    <span class="glyphicon glyphicon-picture"></span>
                                    <span class="">云服务器 ECS</span>
                                </a>
                                </li>
                                <li><a href="javascript:void(0);">
                                    <span class="glyphicon glyphicon-gift"></span>
                                    <span class="">云服务器 ECS</span>
                                </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="topbar-nav-col">
                        <div class="topbar-nav-item">
                            <p class="topbar-nav-item-title">弹性计算</p>
                            <ul>
                                <li><a href="javascript:void(0);">
                                    <span class="glyphicon glyphicon-road"></span>
                                    <span class="">云服务器 ECS</span>
                                </a>
                                </li>
                                <li><a href="javascript:void(0);">
                                    <span class="glyphicon glyphicon-picture"></span>
                                    <span class="">云服务器 ECS</span>
                                </a>
                                </li>
                                <li><a href="javascript:void(0);">
                                    <span class="glyphicon glyphicon-gift"></span>
                                    <span class="">云服务器 ECS</span>
                                </a>
                                </li>
                            </ul>
                        </div>

                        <div class="">
                            <p class="topbar-nav-item-title">弹性计算</p>
                            <ul>
                                <li><a href="javascript:void(0);">
                                    <span class="glyphicon glyphicon-road"></span>
                                    <span class="">云服务器 ECS</span>
                                </a>
                                </li>
                                <li><a href="javascript:void(0);">
                                    <span class="glyphicon glyphicon-picture"></span>
                                    <span class="">云服务器 ECS</span>
                                </a>
                                </li>
                                <li><a href="javascript:void(0);">
                                    <span class="glyphicon glyphicon-gift"></span>
                                    <span class="">云服务器 ECS</span>
                                </a>
                                </li>
                            </ul>
                        </div>

                    </div>

                </div>
            </li>
        </ul>

        <ul class="nav navbar-nav pull-right">
            <li class="li-border">
                <a href="javascript:void(0);" class="mystyle-color">
                    <span class="glyphicon glyphicon-bell"></span>
                    <span class="topbar-num">0</span>
                </a>
            </li>
            <li class="li-border dropdown"><a href="javascript:void(0);" class="mystyle-color" data-toggle="dropdown">
                <span class="glyphicon glyphicon-search"></span> 搜索</a>
                <div class="dropdown-menu search-dropdown">
                    <div class="input-group">
                        <input id="bd-s" type="text" class="form-control">
                        <span class="input-group-btn">
                           <button type="button" class="btn btn-default" onclick="doSearch('#bd-s')">搜索</button>
                        </span>
                    </div>
                </div>
            </li>
            <li class="dropdown li-border"><a href="javascript:void(0);" class="dropdown-toggle mystyle-color" data-toggle="dropdown">帮助与文档<span class="caret"></span></a>
                <ul class="dropdown-menu">
                    <li><a href="javascript:void(0);">帮助与文档</a></li>
                    <li class="divider"></li>
                    <li><a href="javascript:void(0);">论坛</a></li>
                    <li class="divider"></li>
                    <li><a href="javascript:void(0);">博客</a></li>
                </ul>
            </li>
            <li class="dropdown li-border"><a href="javascript:void(0);" class="dropdown-toggle mystyle-color" data-toggle="dropdown">${user.cname}<span class="caret"></span></a>
                <ul class="dropdown-menu">
                    <li><a href="${path}/logout">退出</a></li>
                </ul>
            </li>
            <li class="dropdown"><a href="javascript:void(0);" class="dropdown-toggle mystyle-color" data-toggle="dropdown">换肤<span class="caret"></span></a>
                <ul class="dropdown-menu changecolor">
                    <li id="blue"><a href="javascript:void(0);">蓝色</a></li>
                    <li class="divider"></li>
                    <li id="green"><a href="javascript:void(0);">绿色</a></li>
                    <li class="divider"></li>
                    <li id="orange"><a href="javascript:void(0);">橙色</a></li>
                    <li class="divider"></li>
                    <li id="black"><a href="javascript:void(0);">黑色</a></li>
                </ul>
            </li>
        </ul>
    </div>
</nav>
<div class="down-main">
    <div class="left-main left-full">
        <div class="sidebar-fold"><span class="glyphicon glyphicon-menu-hamburger"></span></div>
        <div class="subNavBox">
            <div class="sBox">
                <div class="subNav sublist-down"><span class="title-icon glyphicon glyphicon-chevron-down"></span><span class="sublist-title">用户中心</span>
                </div>
                <ul class="navContent" style="display:block">
                    <li class="active">
                        <div class="showtitle" style="width:100px;"><img src="${path}/public/img/leftimg.png" />账号管理</div>
                        <a href="userInfo.html"><span class="sublist-icon glyphicon glyphicon-user"></span><span class="sub-title">账号管理</span></a> </li>
                    <li>
                        <div class="showtitle" style="width:100px;"><img src="${path}/public/img/leftimg.png" />消息中心</div>
                        <a href="message.html"><span class="sublist-icon glyphicon glyphicon-envelope"></span><span class="sub-title">消息中心</span></a> </li>
                    <li>
                        <div class="showtitle" style="width:100px;"><img src="${path}/public/img/leftimg.png" />短信</div>
                        <a href="smsInfo.html"><span class="sublist-icon glyphicon glyphicon-bullhorn"></span><span class="sub-title">短信</span></a></li>
                    <li>
                        <div class="showtitle" style="width:100px;"><img src="${path}/public/img/leftimg.png" />实名认证</div>
                        <a href="identify.html"><span class="sublist-icon glyphicon glyphicon-credit-card"></span><span class="sub-title">实名认证</span></a></li>
                </ul>
            </div>
            <div class="sBox">
                <div class="subNav sublist-up"><span class="title-icon glyphicon glyphicon-chevron-up"></span><span class="sublist-title">关于我们</span></div>
                <ul class="navContent" style="display:none">
                    <li>
                        <div class="showtitle" style="width:100px;"><img src="${path}/public/img/leftimg.png" />添加新闻</div>
                        <a href="javascript:void(0);"><span class="sublist-icon glyphicon glyphicon-user"></span><span class="sub-title">添加新闻</span></a></li>
                    <li>
                        <div class="showtitle" style="width:100px;"><img src="${path}/public/img/leftimg.png" />添加新闻</div>
                        <a href="javascript:void(0);"><span class="sublist-icon glyphicon glyphicon-user"></span><span class="sub-title">新闻管理</span></a></li>
                    <li>
                        <div class="showtitle" style="width:100px;"><img src="${path}/public/img/leftimg.png" />添加新闻</div>
                        <a href="javascript:void(0);"><span class="sublist-icon glyphicon glyphicon-user"></span><span class="sub-title">添加新闻</span></a></li>
                    <li>
                        <div class="showtitle" style="width:100px;"><img src="${path}/public/img/leftimg.png" />新闻管理</div>
                        <a href="javascript:void(0);"><span class="sublist-icon glyphicon glyphicon-user"></span><span class="sub-title">新闻管理</span></a></li>
                </ul>
            </div>
        </div>
    </div>
    <div class="right-product my-index right-full">
        <div class="container-fluid">
            <div class="info-center">
                <%@include file="/public/include/layui-home.jsp" %>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
    $(function(){
        setCurTime("timerHMS","#293038");
        /*换肤*/
        $(".dropdown .changecolor li").click(function(){
            var style = $(this).attr("id");console.log("style:"+style);
            $("link[title!='']").attr("disabled","disabled");
            $("link[title='"+style+"']").removeAttr("disabled");

            $.cookie('mystyle', style, { expires: 7 }); // 存储一个带7天期限的 cookie
        })
        var cookie_style = $.cookie("mystyle");
        if(cookie_style!=null){
            $("link[title!='']").attr("disabled","disabled");
            $("link[title='"+cookie_style+"']").removeAttr("disabled");
        }
        /*左侧导航栏显示隐藏功能*/
        $(".subNav").click(function(){
            /*显示*/
            if($(this).find("span:first-child").attr('class')=="title-icon glyphicon glyphicon-chevron-down")
            {
                $(this).find("span:first-child").removeClass("glyphicon-chevron-down");
                $(this).find("span:first-child").addClass("glyphicon-chevron-up");
                $(this).removeClass("sublist-down");
                $(this).addClass("sublist-up");
            }
            /*隐藏*/
            else
            {
                $(this).find("span:first-child").removeClass("glyphicon-chevron-up");
                $(this).find("span:first-child").addClass("glyphicon-chevron-down");
                $(this).removeClass("sublist-up");
                $(this).addClass("sublist-down");
            }
            // 修改数字控制速度， slideUp(500)控制卷起速度
            $(this).next(".navContent").slideToggle(300).siblings(".navContent").slideUp(300);
        })
        /*左侧导航栏缩进功能*/
        $(".left-main .sidebar-fold").click(function(){

            if($(this).parent().attr('class')=="left-main left-full")
            {
                $(this).parent().removeClass("left-full");
                $(this).parent().addClass("left-off");

                $(this).parent().parent().find(".right-product").removeClass("right-full");
                $(this).parent().parent().find(".right-product").addClass("right-off");

            }
            else
            {
                $(this).parent().removeClass("left-off");
                $(this).parent().addClass("left-full");

                $(this).parent().parent().find(".right-product").removeClass("right-off");
                $(this).parent().parent().find(".right-product").addClass("right-full");

            }
        })

        /*左侧鼠标移入提示功能*/
        $(".sBox ul li").mouseenter(function(){
            if($(this).find("span:last-child").css("display")=="none")
            {$(this).find("div").show();}
        }).mouseleave(function(){$(this).find("div").hide();})
    })
</script>