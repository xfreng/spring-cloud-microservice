<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<%@include file="/public/include/iplat-common.jsp"%>
	<%@include file="/public/include/fui-iplat-common.jsp"%>
	<style type="text/css">
		body{
	        margin:0;padding:0;border:0;width:100%;height:100%;overflow:hidden;
	    }
	</style>
</head>
<body>
<jsp:include flush="false" page="/public/include/iplat.ef.head.jsp"></jsp:include>
<div class="fui-fit" style="width:100%;height:100%;">
	<div class="fui-panel" title="项目配置信息列表" style="width:100%;height:99%;" bodyStyle="overflow:hidden;" showCollapseButton="false">
		<div class="fui-toolbar" style="padding:2px;border-top:0;border-left:0;border-right:0;">
			<a class="fui-button" iconCls="icon-reload" onclick="doQuery()">刷新</a>
			<a class="fui-button" iconCls="icon-save" onclick="save()">保存</a>
		</div>
		<div id="projectManagerGrid" class="fui-datagrid" style="width:100%;height:95%;" allowResize="true"
			showPager="false" allowCellEdit="true" allowCellSelect="true" editNextRowCell="true"
			url="${path}/supervisor/project/list" dataField="projectList" idField="id" multiSelect="true">
			<div property="columns">
				<div type="checkcolumn" ></div>
				<div field="name" width="60" headerAlign="center" allowSort="false">配置项名</div>
				<div field="nameDesc" width="160" headerAlign="center" allowSort="false">配置内容
					<input property="editor" class="fui-textbox" style="width:100%;"/>
				</div>
				<div field="remark" width="260" headerAlign="center" allowSort="false">配置说明</div>
			</div>
		</div>
	</div>
</div>
</body>
<script type="text/javascript" src="${path}/public/js/supervisor/project.js?v=<%=System.currentTimeMillis()%>"></script>
</html>