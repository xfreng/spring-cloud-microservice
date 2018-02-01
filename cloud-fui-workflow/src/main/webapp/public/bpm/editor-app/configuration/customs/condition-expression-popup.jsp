<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh_CN">
<head>
	<%@ include file="/bpm/easyui/easyui-common.jsp"%>
</head>
<body>
	<div id="layout" class="easyui-layout" style="width:100%;">
	    <div data-options="region:'west',split:true" style="width:50%;overflow:hidden;">
	    	<textarea id="formula" style="width:99%;height:99%;"></textarea>
	    </div>
	    <div data-options="region:'center'" style="width:50%;overflow:hidden;">
	    	<ul id="tree" class="easyui-tree" style="height:35%;overflow:auto;"
	    		data-options="url:'${ctx }/bpm/tree_data.json',
				method:'get',
				animate:true,
				lines:true,
				onDblClick:onNodeDblClick">
			</ul>
			<div class="easyui-tabs" style="height:65%;">
        		<div title="全局变量" style="padding:2px;overflow:hidden;">
        			<table id="globalCondition" class="easyui-datagrid" style="width:100%;height:100%;" 
	        	   		   data-options="singleSelect:true,onDblClickRow:onRowDblClick">
						<thead>
							<tr>
								<th data-options="field:'name',width:85">变量名</th>
								<th data-options="field:'type',width:135">变量类型</th>
								<th data-options="field:'desc',width:200">变量描述</th>
							</tr>
						</thead>
					</table>
        		</div>
        		<div title="步骤输出变量" style="padding:2px;overflow:hidden;">
        			<table id="itemCondition" class="easyui-datagrid" style="width:100%;height:100%;" 
	        	   		   data-options="singleSelect:true,onDblClickRow:onRowDblClick">
						<thead>
							<tr>
								<th data-options="field:'itemName',width:105">活动名称</th>
								<th data-options="field:'name',width:85">变量名</th>
								<th data-options="field:'type',width:105">变量类型</th>
								<th data-options="field:'desc',width:130">变量描述</th>
							</tr>
						</thead>
					</table>
        		</div>
			</div>        		
	    </div>
	</div>
</body>
<script type="text/javascript">
	var tree = $("#tree");
	var globalDatagrid = $("#globalCondition");
	var itemDatagrid = $("#itemCondition");
	$(function() {
		var layout = $("#layout");
		layout.layout("resize",{
            height: ($(window).height() - 10)
        });
		$(window).resize(function(){
			layout.layout("resize",{
	            height: ($(window).height() - 10)
	        });
		});
		// 初始化值
		var formula = window.parent.formula;
		var conditionRows = window.parent.conditionRows;
		var itemConditionRows = window.parent.itemConditionRows;
		if(typeof(formula) == "undefined"){
			try {
				var jsonObject = eval("("+window.parent.parent.jsonStr+")");
				var jsonEiInfo = window.parent.Json2EiInfo.prototype.parseJsonObject(jsonObject);
				var expression = jsonEiInfo.get("inqu_status-0-formula");
				formula = expression;
			} catch (e) {
				formula = typeof(formula) == "undefined" ? "" : formula;
			}
		}
		if(typeof(conditionRows) == "undefined"){
			conditionRows = window.parent.parent.conditionRows;
		}
		if(typeof(itemConditionRows) == "undefined"){
			itemConditionRows = window.parent.parent.itemConditionRows;
		}
		$("#formula").val(formula);
		globalDatagrid.datagrid("loadData",conditionRows);
		itemDatagrid.datagrid("loadData",itemConditionRows);
	});
	
	// 树节点双击事件
	function onNodeDblClick(node){
		var text = node.text;
		var isLeaf = tree.tree("isLeaf",node.target);
		if(isLeaf){
			document.getElementById("formula").value += text;
		}else{
			if(node.state == "closed"){
				tree.tree("expand",node.target);
			}else{
				tree.tree("collapse",node.target);
			}
		}
	}
	
	// datagrid双击行事件
	function onRowDblClick(index,row){
		if(typeof((row.itemName)) == "undefined"){
			document.getElementById("formula").value += row.name;
		}else{
			document.getElementById("formula").value += row.itemName + "_" + row.name;
		}
	}
</script>
</html>