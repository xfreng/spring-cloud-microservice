<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<%@include file="/public/include/iplat-common.jsp"%>
	<%@include file="/public/include/fui-iplat-common.jsp"%>
    <title>数据字典管理</title>
</head>
<body>
<div id="layout" class="fui-layout" style="width:100%;">
	<div region="west" showHeader="false" style="cursor:hand;" bodyStyle="padding-left:0px;overflow:hidden;" showSplitIcon="false" width="550">
         <!-- 业务字典类型 -->
         <table align="center" border="0" style="width:100%;height:100%" cellSpacing=0 cellPadding=0>
             <tr>
                 <td style="width:100%;height:20%">
                 	<fieldset style="border:solid 1px #aaa;padding:3px;">
						<div class="search-condition">
							<div class="list">
								<form id="queryForm" name="queryForm" action="dictTypeServlet?method=dictExport" method="post">
									<table class="table">
										<tr>
											<td class="tit">类型代码：</td>
											<td>
												<input name="dictCode" class="fui-textbox"/>
											</td>
											<td class="tit">类型名称：</td>
											<td>
												<input name="dictDesc" class="fui-textbox"/>
											</td>
										</tr>
										<tr>
											<td class="btn-wrap" colspan="4">
												<a class="fui-button"  iconCls="icon-download" type="submit" onclick="exportDict();" />导 出</a>&nbsp;&nbsp;
												<a class="fui-button"  iconCls="icon-search" onclick="search()">查 询</a>&nbsp;&nbsp;
												<a class="fui-button"  iconCls="icon-reset" onclick="reset()">重 置</a>
											</td>
										</tr>
									</table>
								</form>
							</div>
						</div>
					</fieldset>
                 </td>
             </tr>
             <tr>
				 <td style="width:100%;height:100%" align="left" valign="top" colspan="2">
					 <div style="width:100%;">
						<div class="fui-toolbar" style="border-bottom:0;padding:0px;width:100%;">
							<table style="width:100%;">
								<tr>
									<td style="width:100%;">
										<a class="fui-button" iconCls="icon-add" onclick="addRow()">添加一行</a>
										<span class="separator"></span>
										<a class="fui-button" iconCls="icon-save" onclick="saveData()">保存</a>
										<a class="fui-button" iconCls="icon-remove" onclick="removeRow()">删除</a>
									</td>
								</tr>
							</table>
						</div>
					</div>
					<div id="dictTypeGrid" class="fui-datagrid" style="width:100%;height:auto;"
						url="${path}/supervisor/dict/queryDictType" idField="id" selectOnLoad="true"
						allowResize="true" pageSize="20" oncellmousedown="onCellBeginEdit"
						allowCellEdit="true" allowCellSelect="true" multiSelect="true" editNextOnEnterKey="true"
						onselectionchanged="onSelectionChanged">
						<div property="columns">
							<div type="checkcolumn" ></div>
							<div field="dictCode" headerAlign="center" >类型代码
								<input property="editor" class="fui-textbox" style="width:100%;" />
							</div>
							<div field="dictDesc" headerAlign="center" >类型名称
								<input property="editor" class="fui-textbox" style="width:100%;" />
							</div>
						</div>
					</div>
				 <td>
             <tr>
         </table>
	</div>
    <div region="center" showHeader="false" style="cursor:hand;" bodyStyle="padding-left:0px;overflow:hidden;" showSplitIcon="false">
		 <TABLE style="width:100%;height:100%" cellSpacing="0" cellPadding="0" border="0">
			 <TR>
				 <TD style="width:64%;height:38%" align="left" valign="top">
					 <div id="layout1" class="fui-layout" style="width:100%;height:100%">
						<div title="数据字典项" width="100%" class="panel" allowResize="false">
							<ul id="tree1" class="fui-tree" url="${path}/supervisor/dict/queryDictForTree"
								style="width:100%;height:100%;padding:5px;" expandOnLoad="0"
								showTreeIcon="true" textField="text" dataField="data"
								idField="id" parentField="pid" resultAsTree="false">
							</ul>
						</div>
					</div>
				 </TD>
			 </TR>
			 <TR>
				 <TD style="width:100%;height:62%" align="left" valign="top" >
					 <!-- 业务字典类型项 -->
					 <div style="width:100%;">
						<div class="fui-toolbar" style="border-bottom:0;padding:0px;">
							<table style="width:100%;height:100%;">
								<tr>
									<td style="width:100%;">
										<a class="fui-button" iconCls="icon-add" onclick="addEntryRow()">添加一行</a>
										<span class="separator"></span>
										<a class="fui-button" iconCls="icon-save" onclick="saveEntryData()">保存</a>
										<a class="fui-button" iconCls="icon-remove" onclick="removeEntryRow()">删除</a>
									</td>
								</tr>
							</table>
						</div>
					</div>
					<div id="dictEntryGrid" class="fui-datagrid" style="width:100%;height:auto;"
						url="${path}/supervisor/dict/getLayout" idField="id" allowResize="true" pageSize="20"
						allowCellEdit="true" allowCellSelect="true" multiSelect="true" editNextOnEnterKey="true">
						<div property="columns">
							<div type="checkcolumn" ></div>
							<div field="dictEntryCode" headerAlign="center" allowSort="false">类型代码
								<input property="editor" class="fui-textbox" style="width:100%;" />
							</div>
							<div field="dictEntryDesc" headerAlign="center" allowSort="false">类型项名称
								<input property="editor" class="fui-textbox" style="width:100%;" />
							</div>
							<div field="dictEntrySort" headerAlign="center" allowSort="false">排序
								<input property="editor" class="fui-textbox" style="width:100%;" />
							</div>
						</div>
					</div>
				 </TD>
			 </TR>
		</TABLE>
	</div>
</div>
</body>
<script type="text/javascript" src="${path}/public/scripts/supervisor/dict.js?v=<%=System.currentTimeMillis()%>"></script>
</html>