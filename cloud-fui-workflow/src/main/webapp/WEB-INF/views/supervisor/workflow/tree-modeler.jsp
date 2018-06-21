<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<title>模型设计器</title>
	<%@include file="/public/include/fui-common.jsp"%>
	<style type="text/css">
		body{
	        margin:0;padding:0;border:0;width:100%;height:99%;overflow:hidden;
	    }
	</style>
</head>
<body>
	<div class="fui-splitter" style="width:100%;height:100%;">
		<div size="240" showCollapseButton="true">
			<div class="fui-panel" title="导航" style="width:100%;height:100%;">
				<ul id="tree" class="fui-tree" url="${path}/supervisor/workflow/treeModel/getModel?modelId=${modelId }" style="width:100%;padding:5px;"
					showTreeIcon="true" textField="text" idField="id" onnodeclick="onNodeClick">
				</ul>
	    	</div>
		</div>
        <div showCollapseButton="true">
			<div class="fui-fit" style="width:100%;height:100%;">
	        	<div id="tabs" class="fui-tabs" style="width:100%;height:100%;">
	        		<div name="designer" title="设计" bodyStyle="overflow:hidden;" style="padding:2px;"
	        			 url="${path}/public/bpm/modeler.html?modelId=${modelId }"/>
	        	</div>
	        </div>
	    </div>
	</div>
</body>
<script type="text/javascript" src="${path}/public/scripts/supervisor/activiti-tree-modeler.js?v=<%=System.currentTimeMillis()%>"></script>
</html>