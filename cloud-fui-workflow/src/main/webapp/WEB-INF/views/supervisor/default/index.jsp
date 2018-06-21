<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<%@include file="/public/include/iplat-common.jsp"%>
    <%@include file="/public/include/fui-iplat-common.jsp"%>
    <title>欢迎使用 ${projectName}[${dev}]</title>
    <link rel="stylesheet" type="text/css" href="${path}/public/EP/indexReal-ModernBlack-3.0.css">
    <link rel="stylesheet" type="text/css" href="${path}/public/EU/Font-Awesome/css/font-awesome.css">
	<link rel="stylesheet" type="text/css" href="${path}/public/EU/Font-Awesome/css/font-awesome.jquery.css">
    <style type="text/css">
	    body{
	        margin:0;padding:0;border:0;width:100%;height:100%;overflow:hidden;
	    }    
	    .header{
	        background: url('${path}/public/mainframe/images/header.gif') repeat-x 0 -1px;
	    }
        #menu .ef-tree-item-node>div.ui-theme>.ui-icon{
            background-image: url('${path}/public/EF/Themes/base/images/ui-icons_222222_256x240.png');
        }
        .ui-widget-content .ui-icon{
            background-image: url('${path}/public/EF/Themes/styleApple/ModernBlack/images/ui-icons_454545_256x240.png');
        }
    </style>
    <script type="text/javascript" src="${path}/public/scripts/supervisor/default-index.js?v=<%=java.lang.System.currentTimeMillis()%>"></script>
</head>
<body id="cache" onload="setCurTime('cy','blue');">
<div class="fui-layout" style="width:100%;height:100%;">
    <div region="north" class="header" bodyStyle="overflow:hidden;" showHeader="false" showSplit="false">
        <%@include file="/public/include/top.jsp"%>
    </div>
    <div showHeader="false" region="south" class="foot" height="39px" style="border:1;text-align:center;" showSplit="false">
        <%@include file="/public/include/footer.jsp"%>
    </div>
    <div region="west" showHeader="false" style="cursor: hand;" showHeader="true" bodyStyle="padding-left:0px;" showSplitIcon="true" width="230" maxWidth="530">
        <!--左侧菜单-->
        <div id="menu" class="">
	         <div id="indexRealLeftTreeDiv" class="slim-scroll">
	           <EF:EFTree model="leftMenuModel" id="nTree" text="" configFunc="configTree" type="menuTree"/>
	         </div>
    	</div>
    </div>
    <div showHeader="false" region="center" bodyStyle="overflow:hidden;" style="border:0;">
    	<div id="mainTabs" class="fui-tabs" activeIndex="0" style="width:100%;height:100%;"      
             plain="false" onactivechanged="onTabsActiveChanged" contextMenu="#tabsMenu">
             <div name="first" title="首页" url="${path}/supervisor/calendar"></div>
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
<script type="text/javascript" src="${path}/public/scripts/supervisor/index.js?v=<%=java.lang.System.currentTimeMillis()%>"></script>
</html>