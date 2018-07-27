<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <%@include file="/public/include/iplat-common.jsp"%>
	<%@include file="/public/include/fui-iplat-common.jsp"%>
	<title>欢迎使用 ${projectName}[${dev}]</title>
	<link rel="stylesheet" type="text/css" href="webjars/fui/public/EP/indexReal-${iPlatStyle}-3.0.css">
    <link rel="stylesheet" type="text/css" href="webjars/fui/public/EU/Font-Awesome/css/font-awesome.css">
    <link rel="stylesheet" type="text/css" href="webjars/fui/public/EU/Font-Awesome/css/font-awesome-${menuStyle}.css">
	<link rel="stylesheet" type="text/css" href="webjars/fui/public/EU/Font-Awesome/css/font-awesome.jquery.css">
    <style type="text/css">
		html, body {
			margin: 0;
			padding: 0;
			border: 0;
			width: 100%;
			height: 100%;
			overflow: hidden;
		}
		.selected{
			background: #ddd;
		}
		.color_a{
			color:#595959;
		}
		.searchbox .fui-buttonedit-icon{
	        background:url('webjars/fui/public/mainframe/images/search.gif') no-repeat 50% 50%;
	    }
	</style>
	<script type="text/javascript" src="${path}/public/scripts/supervisor/pact-index.js?v=<%=java.lang.System.currentTimeMillis()%>"></script>
</head>
<body id="indexRealBody" onload="setCurTime('cy','');">
<div class="fui-layout" style="width:100%;height:100%;">
    <div showHeader="false" region="north" class="app-header" bodyStyle="overflow:hidden;" height="89" showSplit="false">
        <!--head 开始-->
		<div class="head">
	    	<!--top-->
	    	<div class="top">
	        	<!--logo-->
	            <div class="logo">
	                <a href="${path}/index" class="bak_logo mg_b-4"></a>
	                <a href="javascript:void(0)" class="title-line mg_t_15 mg_l_10"></a>
	                <span class="white font_18 font_b pd_l_10" style="position:absolute;top:20px;">
						${projectName}&nbsp;<span style="font-size:12px;">${dev} </span>
					</span>
	            </div>
	            <!--menu-->
	            <div class="nav_menu">
	                <ul>
	                	<li style="margin-top:18px;">
	               			<span class="mg_l_10 font_14" style="top:50px;">欢迎您！${user.ename}&nbsp;&nbsp;&nbsp;</span>
	                	</li>
	                	<li>
	                        <a href="${path}/index"><img src="webjars/fui/public/mainframe/images/login/home.png" /><span class="mg_l_10 font_14">首页</span></a>
	                    </li>
	                	<li>
	                        <a href="javascript:void(0)" onclick="changeOpenWindow()"><img src="webjars/fui/public/mainframe/images/login/pop_up_window.png" /><span class="mg_l_10 font_14">窗口切换</span></a>
	                    </li>
						<li>
							<a href="javascript:void(0)" onclick="changePwdWindow()"><img src="webjars/fui/public/mainframe/images/login/change_password.png" /><span class="mg_l_10 font_14">修改密码</span></a>
						</li>
	                    <li>
	                    	<a href="javascript:logout()"><img src="webjars/fui/public/mainframe/images/login/logout.png" /><span class="mg_l_10 font_14">注销</span></a>
	                    </li>
	                    <li id="dropdown">
	                    	<a href="javascript:void(0)"><img src="webjars/fui/public/mainframe/images/login/skin.png" /><span class="mg_l_10 font_14">皮肤&nbsp;&nbsp;&nbsp;&nbsp;</span></a>
	                        <ul class="dropdownMenu">
	                    		<li onclick="updateStyle('default','default')" ${"default" eq menuStyle?"class'selected'":""}><span class="default color"></span><span class="pd_l_15">默认</span></li>
	                    		<li onclick="updateStyle('pact','red')" ${"red" eq menuStyle?"class'selected'":""}><span class="red color"></span><span class="pd_l_15">红色</span></li>
	                    		<li onclick="updateStyle('pact','black')" ${"black" eq menuStyle?"class'selected'":""}><span class="black color"></span><span class="pd_l_15">黑色</span></li>
	                            <li onclick="updateStyle('pact','pact')" ${"pact" eq menuStyle?"class'selected'":""}><span class="blue color"></span><span class="pd_l_15">蓝色</span></li>
	                            <li onclick="updateStyle('pact','skyblue')" ${"skyblue" eq menuStyle?"class'selected'":""}><span class="skyblue color"></span><span class="pd_l_15">青色</span></li>
	                        </ul>
	                    </li>
	                </ul>
	            </div>
	            <div class="clear"></div>
	         </div>
	         <!--顶部菜单-->
			 <div id="mainMenuBar" class="ef-menu-bar-div">
			 	<EF:EFMenu model="topMenuModel" id="nMenu" configFunc="configMenu"></EF:EFMenu>
			 </div>
	    </div>
	    <!--head 结束-->
    </div>
    <div showHeader="false" region="south" style="border:0;text-align:center;" height="35" showSplit="false">
        <%@include file="/public/include/footer.jsp"%>
    </div>
    <div showHeader="false" region="west" style="margin-top:11px;" bodyStyle="padding-left:1px;" showSplitIcon="true" width="230" minWidth="100" maxWidth="350">
        <!--左侧菜单-->
        <div id="menu" class="">
	         <div id="indexRealLeftTreeDiv" class="slim-scroll">
	           <EF:EFTree model="leftMenuModel" id="nTree" text="" configFunc="configTree" type="menuTree"/>
	         </div>
    	</div>
    </div>
    <div showHeader="false" region="center" style="border:0;margin-top:10px;">
        <div id="mainTabs" class="fui-tabs" activeIndex="0" style="width:100%;height:100%;"
            onactivechanged="onTabsActiveChanged" contextMenu="#tabsMenu">
            <div name="first" title="每日记事" url="${path}/supervisor/calendar"></div>
        </div>
    </div>
    <div showHeader="false" region="east" width="195" showCollapseButton="false" showCloseButton="false" showSplitIcon="true">
    	<div class="business">
			<div class="mg_b_10"><strong><a href="javascript:void(0)" class="font_14 color_595959 icon-favorite" onclick="activeForm('','','/supervisor/menu/shortcut')"><span class="mg_l_7">我的收藏</span></a></strong></div>
            <div class="bd_t_e4">
              	<ul id="shortcut_item">
                  	<li><a href="javascript:void(0)" title="我的风格" class="icon_wodefengge" onclick="activeForm('','','/supervisor/style/index')"></a>
                          <br><br>
                          <span>我的风格</span>
				  	</li>
                  	<li><a href="javascript:void(0)" title="密码设置" class="icon_mimashezhi" onclick="changePwdWindow()"></a>
                          <br><br>
                          <span>密码设置</span>
				  	</li>
			  	</ul>
            </div>
         </div>
    </div>
</div>
<ul id="tabsMenu" class="fui-contextmenu" onbeforeopen="onBeforeOpen">
    <li onclick="closeTab">关闭</li>
    <li onclick="closeAllBut">关闭其他</li>
    <li class="separator"></li>
    <li onclick="closeAll">关闭所有</li>
</ul>
<div id="changeWindowTemplate" class="fui-window" title="窗口切换" closed="true" style="width:auto;"
	 showModal="true" allowDrag="true">
	<input id="rbl" class="fui-radiobuttonlist" repeatItems="2" repeatLayout="table" repeatDirection="horizontal"
		 textField="text" valueField="id" onvaluechanged="changeOpenWindow"
		 data="openTypes" style="text-align:center"/>
</div>
<div id="editPassTemplate" class="fui-window" title="修改密码" closed="true" style="width:400px;"
	 showModal="true" allowDrag="true">
	<form id="editPassForm" style="padding:10px 20px 10px 40px;" method="post">
		<table width="100%">
			<tr>
				<td>
					<label for="oldPassword">原始密码：</label>
				</td>
				<td>
					<input id="oldPassword" name="oldPassword" class="fui-password" style="width:100%" required="true"/>
				</td>
			</tr>
			<tr>
				<td>
					<label for="newPassword1">新密码：</label>
				</td>
				<td>
					<input id="newPassword1" name="newPassword1" class="fui-password" style="width:100%" required="true" onvalidation="onNewPassword1Validation"/>
				</td>
			</tr>
			<tr>
				<td>
					<label for="newPassword2">确认新密码：</label>
				</td>
				<td>
					<input id="newPassword2" name="newPassword2" class="fui-password" style="width:100%" required="true" onvalidation="onNewPassword2Validation"/>
				</td>
			</tr>
		</table>
		<div style="padding:5px;text-align:center;">
			<a class="fui-button" onclick="save" style="width:60px;margin-right:20px;">保存</a>
			<a class="fui-button" onclick="cancel" style="width:60px;">取消</a>
        </div>
	</form>
</div>
</body>
<script type="text/javascript">
    $(function () {
        pageRenderer();
        loadShortcut();
    });
    function pageRenderer() {
        $("#dropdown").toggle(function() {
            $("#dropdown .dropdownMenu").css("display", "block");
            $("#dropdown a").addClass("hover");
        }, function() {
            $("#dropdown .dropdownMenu").css("display", "none");
            $("#dropdown a").removeClass("hover");
        });
    }
</script>
<script type="text/javascript" src="${path}/public/scripts/supervisor/index.js?v=<%=java.lang.System.currentTimeMillis()%>"></script>
</html>