<%@ page contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html lang="zh_CN">
<head>
	<%@ include file="/public/include/iplat-common.jsp"%>
	<%@ include file="/public/include/fui-iplat-common.jsp"%>
</head>
<body>
<jsp:include flush="false" page="/public/include/iplat.ef.head.jsp" />
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
		<div class="fui-panel" title="运行中的流程" style="width:100%;height:99%;" bodyStyle="overflow:hidden;" showCollapseButton="true">
			<div class="fui-toolbar" style="padding:2px;border-top:0;border-left:0;border-right:0;">
				<a class="fui-button" iconCls="icon-search" onclick="query()">查询</a>
			</div>
			<div id="running" class="fui-datagrid" style="width:100%;height:95%;" allowResize="true"
				 url="${path}/supervisor/workflow/processinstance/list" dataField="runningList" idField="id" multiSelect="true">
				<div property="columns">
					<div type="checkcolumn" ></div>
					<div field="id" width="185" headerAlign="center" allowSort="false">执行ID</div>
					<div field="processInstanceId" width="185" headerAlign="center" allowSort="false">流程实例ID</div>
					<div field="processDefinitionId" width="185" headerAlign="center" allowSort="false">流程定义ID</div>
					<div field="processDefinitionKey" width="120" headerAlign="center" allowSort="false" align="left">KEY</div>
					<div field="processDefinitionName" width="120" headerAlign="center" allowSort="false">流程名称</div>
					<div field="did" width="120" headerAlign="center" renderer="didRenderer" allowSort="false">当前节点</div>
					<div field="suspended" width="65" headerAlign="center" renderer="suspendedRenderer" allowSort="false" align="center">是否挂起</div>
				</div>
			</div>
		</div>
	</div>
</div>
</body>
<link href="${path}/public/bpm/module/qtip/jquery.qtip.min.css" type="text/css" rel="stylesheet" />
<script type="text/javascript" src="${path}/public/scripts/supervisor/activiti-running.js?v=<%=System.currentTimeMillis()%>"></script>
<script type="text/javascript" src="${path}/public/bpm/module/qtip/jquery.qtip.pack.js"></script>
<script type="text/javascript" src="${path}/public/bpm/module/activiti/workflow.js"></script>
</html>