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
						<td align="right" width="8%">
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
		<div class="fui-panel" title="流程定义及部署管理" style="width:100%;height:100%;" bodyStyle="overflow:hidden;" showCollapseButton="true">
			<div class="fui-toolbar" style="padding:2px;border-top:0;border-left:0;border-right:0;">
				<a class="fui-button" iconCls="icon-search" onclick="query()">查询</a>
				<a class="fui-button" iconCls="icon-remove" onclick="remove()">删除</a>
				<a class="fui-button" iconCls="icon-deploy" onclick="deploy()">部署流程</a>
				<a class="fui-button" iconCls="icon-reverse" onclick="convertToModel()">转换为Model</a>
				<a class="fui-button" iconCls="icon-run" onclick="startRunning()">启动</a>
				<div style="float:right;display:inline;color:#cc0000"><b>提示：</b>点击xml或者png链接可以查看具体内容！</div>
			</div>
			<div id="process" class="fui-datagrid" style="width:100%;height:95%;" allowResize="true"
				 url="${path}/supervisor/workflow/process/list" dataField="processList" idField="id" multiSelect="true">
				<div property="columns">
					<div type="checkcolumn" ></div>
					<div field="id" width="185" headerAlign="center" allowSort="false">ProcessDefinitionId</div>
					<div field="deploymentId" width="185" headerAlign="center" allowSort="false" align="left">DeploymentId</div>
					<div field="name" width="120" headerAlign="center" allowSort="false">流程名称</div>
					<div field="key" width="120" headerAlign="center" allowSort="false" align="left">KEY</div>
					<div field="version" width="60" headerAlign="center" allowSort="false" align="center">Version</div>
					<div field="resourceName" width="190" headerAlign="center" renderer="resourceRenderer" allowSort="false" align="center">XML</div>
					<div field="diagramResourceName" width="190" headerAlign="center" renderer="resourceRenderer" allowSort="false" align="center">图片</div>
					<div field="deploymentTime" width="135" headerAlign="center" dateFormat="yyyy-MM-dd HH:mm:ss" allowSort="false" align="center">部署时间</div>
					<div field="suspended" width="65" headerAlign="center" renderer="suspendedRenderer" allowSort="false" align="center">是否挂起</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div id="deployWindow" class="fui-window" title="部署流程" style="width:auto;padding:2px 0em 2px;display:none;"
	 showModal="true" allowDrag="true">
	<form id="deployForm" method="post">
		<fieldset style="-moz-border-radius:8px;">
			<legend>部署新流程</legend>
			<div style="font-size: 13px;"><b>支持文件格式：</b>zip、bar、bpmn、bpmn20.xml</div>
			<table width="100%">
				<tr>
					<td>类型：</td>
					<td>
						<select id="category" name="category" class="fui-combobox" style="width:155px;" data="types" value="6"></select>
						<span style="color:red;">*</span>
					</td>
				</tr>
				<tr>
					<td colspan="2">
						<input id="deployFile" class="fui-fileupload" name="file" limitType="*.zip;*.bar;*.xml" style="width: 350px;"
							   flashUrl="${path}/public/common/fui/swfupload/swfupload.swf"
							   uploadUrl="${path}/supervisor/workflow/process/deploy"
							   onuploadsuccess="onUploadSuccess"
							   onuploaderror="onUploadError"
							   onfileselect="onFileSelect"/>
					</td>
				</tr>
				<tr>
					<td colspan="2" align="right">
						<a class="fui-button" iconCls="icon-ok" onclick="startUpload()">确定</a>
					</td>
				</tr>
			</table>
		</fieldset>
	</form>
</div>
</body>
<script type="text/javascript" src="${path}/public/scripts/supervisor/activiti-process.js?v=<%=System.currentTimeMillis()%>"></script>
</html>