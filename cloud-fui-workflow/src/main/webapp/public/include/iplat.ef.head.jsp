<%@page contentType="text/html;charset=UTF-8"%>
<%
	String help = "帮助";
	String favorites = "收藏";
	String print = "打印当前页面";
	String close = "关闭当前页面";
	String fullScreen = "全屏显示当前页面";
%>
<script type="text/javascript" src="${pageContext.request.contextPath}/webjars/fui/public/EF/Form/iplat.ef.head.js"></script>

<input type="hidden" id="efFormEname" name="efFormEname" value="${efFormEname}">
<input type="hidden" id="efFormCname" name="efFormCname" value="${efFormCname}">

<div id="ef_form_head" class="ef-form-head">
    <script type="text/javascript">	  
		$("#ef_form_head").find("span.ui-icon-circle-close").click(function() {
			efform.hideOverlay();
		});
	</script>
	<div id="efFormHead">
	  <table cellspacing="0" cellpadding="0" border="0">
		<colgroup><col align="right" width="30">
		<col align="left" width="100%">
		<col align="right" width="30">
		</colgroup><tbody>
			<tr>
				<td class="ef-state-default ef-cornerredius-all ef-iconbutton-noborder">
					<div style="margin:2px;" id="iplat_efformDev_id" title="${efFormEname}" class="ef-icon ef-icon-dev"></div>
				</td>
				<td id="pageTitle" class="ef-form-head-title">${efFormEname}/${efFormCname}&nbsp;</td>
				<!-- 配置按钮图标 -->
				<td><div style="margin:2px;"><a id="_efFormConfig" href="#" class="ef-state-default ef-form-configDiv ui-button ui-widget ui-state-default ui-corner-all ui-button-icons-only" role="button" aria-disabled="false" title="" style="height: 20px; margin: 0px; border: none;"><span class="ui-button-icon-primary ui-icon ef-icon ef-icon-gear"></span><span class="ui-button-text"></span><span class="ui-button-icon-secondary ui-icon ef-icon ef-icon-expand"></span></a></div></td>
			</tr>
			<tr></tr>
		</tbody>
	  </table>
	</div>
</div>
<div id="_efFormConfigMenu">
    <!-- efform配置按钮下拉菜单 -->
	<div id="efFormConfigMenu" class="ef-form-config-menu ef-right-top-arrow ui-widget ui-widget-content ui-corner-all ef-widget-shadow"  style="width:170px;padding:5px;display:none;z-index:100;">
	  <div class="ef-arrow"></div>
      <div id="efFormConfigMenuTitle" class="ef-form-config-menu-title ui-widget-header ui-corner-all">页面配置菜单<a href="#" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only" role="button" aria-disabled="false" title="关闭配置菜单" style="border: none;"><span class="ui-button-icon-primary ui-icon ui-icon-close"></span><span class="ui-button-text">关闭配置菜单</span></a></div>      
      <div class="ef-form-config-menu-content">
      	<div><a id='_efFormMenu_close' href="#"><%=close%></a></div>
        <div><a id='_efFormMenu_showMode' href="#"><%=fullScreen%></a></div>
        
        <div class='ef-menuconfig-sep'></div>        
        
        <div><a id='_efFormMenu_print' href="#"><%=print%></a></div>
        
        <div class='ef-menuconfig-sep'></div>        

        <div><a id='_efFormMenu_help' href="#"><%=help%></a></div>
        
        <div class='ef-menuconfig-sep'></div>        

        <div><a id='_efFormMenu_favorites' href="#"><%=favorites%></a></div>
      </div>  
      <iframe id="efFormConfigMenu_cover" frameborder="0" style="display:none;z-index:-1;border:none; "></iframe>
        
	</div>
</div>