<%@page contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<%@include file="/public/include/iplat-common.jsp"%>
	<%@include file="/public/include/fui-iplat-common.jsp"%>
</head>
<body style="overflow-x:hidden;">
<jsp:include flush="false" page="/public/include/iplat.ef.head.jsp" />
<div id="layout" class="fui-layout" style="width:100%;">
	<div showHeader="false" region="center" bodyStyle="overflow:hidden;" style="border:0;">
		<div class="fui-toolbar" style="border-bottom:0;">
			<a class="fui-button" iconCls="icon-add" onclick="add()">增加</a>
			<a class="fui-button" iconCls="icon-remove" onclick="remove()">删除</a>
			<a class="fui-button"  iconCls="icon-save" onclick="save()">保存</a>
		</div>
		<div id="grid1" class="fui-datagrid" style="width:100%;height:95%;" multiSelect="true"
			 url="${path}/supervisor/menu/queryShortcut" idField="id" pageSize="20"
			 dataField="items" showFilterRow="false" allowCellSelect="true"
			 allowCellEdit="true">
			<div property="columns">
				<div type="checkcolumn" width="5%"></div>
				<div field="orderNo" headerAlign="center" width="5%">顺序号
					<input property="editor" class="fui-textbox" style="width:100%;" onvalidation="checkNum" required="true"/>
				</div>
				<div field="funcName" headerAlign="center" width="55%">功能名称
					<input property="editor" class="fui-buttonedit" allowInput="false" onbuttonclick="onButtonEdit" style="width:100%;"/>
				</div>
				<div field="menuImagePath" headerAlign="center" width="35%">功能图标css样式名
					<input property="editor" class="fui-textbox" style="width:100%;"/>
				</div>
			</div>
		</div>
	</div>
</div>
<script type="text/javascript" src="${path}/public/scripts/supervisor/shortcut.js?v=<%=System.currentTimeMillis()%>"></script>
</body>
</html>