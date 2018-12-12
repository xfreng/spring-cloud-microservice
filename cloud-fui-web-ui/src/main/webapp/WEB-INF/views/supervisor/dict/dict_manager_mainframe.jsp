<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<%@include file="/public/include/iplat-common.jsp"%>
	<%@include file="/public/include/fui-iplat-common.jsp"%>
</head>
<body>
<jsp:include flush="false" page="/public/include/iplat.ef.head.jsp" />
<div id="fuiTabsBody" class="fui-tabs-body">
	<div id="mainTabs" class="fui-tabs" activeIndex="0" style="width:100%;height:100%;">
		<div title="业务字典管理" url="${path}/supervisor/dict/dictManager"></div>
		<div title="业务字典导入管理" url="${path}/supervisor/dict/dictImportManager"></div>
	</div>
</div>
</body>
<script type="text/javascript">
	$(function() {
		var fuiTabsBody = $("#fuiTabsBody");
		var pageHeadHeight = $("#ef_form_head").outerHeight();
		if(self != top){
			pageHeadHeight = 0;
		}
		fuiTabsBody.height($(window).height() - pageHeadHeight);
		$(window).resize(function(){
			fuiTabsBody.height($(window).height() - pageHeadHeight);
		});
	});
</script>
</html>