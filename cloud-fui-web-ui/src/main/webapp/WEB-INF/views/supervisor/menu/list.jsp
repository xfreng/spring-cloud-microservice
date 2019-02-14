<%@page contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<%@include file="/public/include/iplat-common.jsp"%>
	<%@include file="/public/include/fui-iplat-common.jsp"%>
	<style type="text/css">
		#tree .fui-grid-viewport{
			background-color:transparent !important;
		}
		#tree .fui-panel-viewport{
			background-color:transparent !important;
		}
	</style>
</head>
<body>
<jsp:include flush="false" page="/public/include/iplat.ef.head.jsp" />
<div id="layout" class="fui-layout" style="width:100%;">
	<div region="west" showHeader="false" style="cursor:hand;" bodyStyle="padding-left:0px;" showSplitIcon="true" width="230" maxWidth="530">
	    <ul id="tree" class="fui-tree" url="${path}/supervisor/menu/loadMenuNodes" style="width:100%;margin-top:5px;"
		    showTreeIcon="true" textField="text" onbeforeload="onBeforeTreeLoad" dataField="treeNodes"
		    idField="id" parentField="pid" resultAsTree="false" onnodeclick="onNodeClick" 
		    contextMenu="#treeMenu">       
		</ul>
	</div>
	<div showHeader="false" region="center" bodyStyle="overflow:hidden;" style="border:0;">
		<div class="fui-toolbar" style="border-top:0;border-left:0;border-right:0;">
	    	<a class="fui-button" iconCls="icon-add" onclick="addRow()">添加一行</a>
	    	<span class="separator"></span>             
	        <a class="fui-button" iconCls="icon-addnew" onclick="add()">新增</a>
	        <a class="fui-button" iconCls="icon-edit" onclick="edit()">修改</a>
	        <a class="fui-button" iconCls="icon-remove" onclick="remove()">删除</a>     
	        <a class="fui-button" iconCls="icon-download" onclick="exportExcel()">导出</a>     
	    </div>
	    <div id="grid" class="fui-datagrid" style="width:100%;height:95%;" multiSelect="true"
	       	url="${path}/supervisor/menu/loadMenuNodePage" idField="id" parentField="pid" pageSize="20"
	        textField="text" dataField="treeNodes" showFilterRow="false" allowCellSelect="true" 
	        allowCellEdit="true" onrowdblclick="toEdit" oncellmousedown="onCellBeginEdit">
	        <div property="columns">
				<div type="checkcolumn" ></div>    
	            <div field="pid" width="85" headerAlign="center" allowSort="false" visible="true">上级菜单编号</div>      
	            <div field="id" width="100" headerAlign="center" allowSort="false">菜单编号 
	            	<input property="editor" class="fui-textbox" style="width:100%;"/>
	            </div>
	            <div field="text" width="120" headerAlign="center" allowSort="false" align="left">菜单名称                        
	                <input property="editor" class="fui-textbox" style="width:100%;"/>
	            </div>
	            <div type="comboboxcolumn" autoShowPopup="true" name="type" field="type" width="100" headerAlign="center" allowSort="false" align="center">节点类型                        
	                <input property="editor" class="fui-combobox" style="width:100%;" data="types"/>
	            </div>
	            <div field="sortId" width="95" headerAlign="center" allowSort="false" align="center">排序标识                        
	                <input property="editor" class="fui-textbox" style="width:100%;"/>
	            </div>        
	            <div field="url" width="120" headerAlign="center" allowSort="false">菜单URL                        
	                <input property="editor" class="fui-textbox" style="width:100%;"/>
	            </div>
				<div field="param" width="120" headerAlign="center" allowSort="false" align="center">（样式）参数
					<input property="editor" class="fui-textbox" style="width:100%;"/>
				</div>
	            <div field="image" width="120" headerAlign="center" allowSort="false" align="center">自定义图标样式                        
	                <input property="editor" class="fui-textbox" style="width:100%;"/>
	            </div>
				<div field="recCreator" width="100" headerAlign="center" allowSort="false" align="center">创建人</div>           
				<div field="recCreateTime" width="140" headerAlign="center" renderer="formatDate" allowSort="false" align="center">创建日期</div>
				<div field="recRevisor" width="100" headerAlign="center" allowSort="false" align="center">修改人</div>              
				<div field="recReviseTime" width="140" headerAlign="center" renderer="formatDate" allowSort="false" align="center">修改日期</div>              
	        </div>
	    </div>
    </div>
</div>
<ul id="treeMenu" class="fui-contextmenu" onbeforeopen="onBeforeOpen"></ul>
</body>
<script type="text/javascript" src="${path}/public/scripts/supervisor/menu.js?v=<%=System.currentTimeMillis()%>"></script>
</html>