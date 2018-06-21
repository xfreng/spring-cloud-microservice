<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<%@ include file="/public/include/iplat-common.jsp"%>
	<%@ include file="/public/include/fui-iplat-common.jsp"%>
</head>
<body>
<jsp:include flush="false" page="/public/include/iplat.ef.head.jsp"></jsp:include>
<div id="layout" class="fui-layout" style="width:100%;">
	<div region="north" showHeader="false" bodyStyle="overflow:hidden;" showSplit="false" showCollapseButton="false" style="border:0;">
		<div class="fui-panel" title="查询条件" style="width:100%;overflow:hidden;" showCollapseButton="false">
			<form id="queryForm" method="post">
				<table style="width:100%">
					<tr>
						<td align="right" width="5%">
							流程名称:
						</td>
						<td width="10%">
							<input name="flowName" class="fui-textbox" style="width:155px;"/>
						</td>
						<td align="right" width="5%">
							KEY:
						</td>
						<td width="10%">
							<input name="flowKey" class="fui-textbox" style="width:155px;"/>
						</td>
						<td align="right" width="8%">
							流程类型：
						</td>
						<td>
							<select name="flowCategory" class="fui-combobox" style="width:155px;" data="types" value="6"></select>
						</td>
					</tr>
				</table>
			</form>
		</div>
	</div>
	<div showHeader="false" region="center" bodyStyle="overflow:hidden;" style="border:0;">
		<div class="fui-panel" title="模型工作区" style="width:100%;height:99%;" bodyStyle="overflow:hidden;" showCollapseButton="true">
			<div class="fui-toolbar" style="padding:2px;border-top:0;border-left:0;border-right:0;">
				<a class="fui-button" iconCls="icon-search" onclick="query()">查询</a>
				<a class="fui-button" iconCls="icon-addnew" onclick="create()">创建</a>
				<a class="fui-button" iconCls="icon-edit" onclick="edit()">编辑</a>
				<a class="fui-button" iconCls="icon-deploy" onclick="deploy()">部署</a>
				<a class="fui-button" iconCls="icon-download" onclick="exportModel()">导出</a>
				<span class="separator"></span>
				<a class="fui-button" iconCls="icon-save" onclick="copy()">另存为副本</a>
				<a class="fui-button" iconCls="icon-save" onclick="template()">保存为模板</a>
				<a class="fui-button" iconCls="icon-remove" onclick="remove()">删除</a>
			</div>
			<div id="model" class="fui-datagrid" style="width:100%;height:95%;" allowResize="true" onrowdblclick="toEdit"
				 url="${path}/supervisor/workflow/model/list" dataField="modelList" idField="id" multiSelect="true">
				<div property="columns">
					<div type="checkcolumn" ></div>
					<div field="id" width="60" headerAlign="center" allowSort="false">ID</div>
					<div field="key" width="120" headerAlign="center" allowSort="false" align="left">KEY</div>
					<div field="name" width="120" headerAlign="center" allowSort="false" align="center">流程名称</div>
					<div field="version" width="60" headerAlign="center" allowSort="false">Version</div>
					<div field="createTime" width="75" headerAlign="center" dateFormat="yyyy-MM-dd HH:mm:ss" allowSort="false" align="center">创建时间</div>
					<div field="lastUpdateTime" width="75" headerAlign="center" dateFormat="yyyy-MM-dd HH:mm:ss" allowSort="false" align="center">最后更新时间</div>
					<div field="metaInfo" width="190" headerAlign="center" allowSort="false">元数据</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div id="createModelTemplate" class="fui-window" title="创建模型" style="width:500px;"
	 showModal="true" allowDrag="true">
	<form id="modelForm" method="post">
		<table width="100%">
			<tr>
				<td>名称：</td>
				<td>
					<input id="name" name="name" class="fui-textbox" style="width:155px;"/>
					<span style="color:red;">*</span>
				</td>
			</tr>
			<tr>
				<td>KEY：</td>
				<td>
					<input id="key" name="key" class="fui-textbox" style="width:155px;"/>
					<span style="color:red;">*</span>
					<div id="message" class="info" style="display:inline;"><b>提示：</b>部署流程所需要的key(唯一)！</div>
				</td>
			</tr>
			<tr>
				<td>类型：</td>
				<td>
					<select id="category" name="category" class="fui-combobox" style="width:155px;" data="types"></select>
					<span style="color:red;">*</span>
				</td>
			</tr>
			<tr>
				<td>描述：</td>
				<td>
					<textarea id="description" name="description" class="fui-textarea" style="width:100%;height:50px;"></textarea>
				</td>
			</tr>
			<tr>
				<td colspan="2" align="right">
					<a class="fui-button" iconCls="icon-ok" onclick="ok()">确定</a>
				</td>
			</tr>
		</table>
	</form>
</div>
</body>
<script type="text/javascript" src="${path}/public/scripts/supervisor/activiti-model.js?v=<%=System.currentTimeMillis()%>"></script>
</html>