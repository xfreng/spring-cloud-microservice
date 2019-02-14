<%@ page pageEncoding="UTF-8" isELIgnored="false"%>
<!DOCTYPE html>
<html>
<head>
	<%@include file="/public/include/fui-common.jsp"%>
   	<title>菜单面板</title>
   	<style type="text/css">
		html, body{
			font-size:12px;
			padding:0;
			margin:0;
			border:0;
			height:100%;
			overflow:hidden;
		}
   	</style>
</head>
<body>
<form id="menu-state" method="post">
    <fieldset style="border:solid 1px #aaa;">
        <legend >菜单信息</legend>
        <div style="padding:5px;">
	        <table width="100%">
	            <tr>
	                <td width="15%" align="right">菜单编号：</td>
	                <td width="20%">    
	                    <input id="id" name="id" class="fui-textbox" required="true"/>
	                </td>
	                <td width="25%" align="right">菜单名称：</td>
	                <td >                        
	                    <input name="text" class="fui-textbox" required="true"/>
	                </td>
	            </tr>
	            <tr>
	                <td align="right">父节点：</td>
	                <td>    
	                    <input id="pid" name="pid" class="fui-textbox" required="true" allowInput="false"/>
	                </td>
	                <td align="right">菜单URL：</td>
	                <td>    
	                    <input name="url" class="fui-textbox" required="false"/>
	                </td>
	            </tr>
	            <tr>
	                <td align="right">排序标识：</td>
	                <td>    
	                    <input name="sortId" class="fui-textbox" required="false"/>
	                </td>
	                <td align="right">自定义图标样式：</td>
	                <td>    
	                    <input name="image" class="fui-textbox" required="false"/>
	                </td>
	            </tr>
	            <tr>
	                <td width="15%" align="right">菜单类型：</td>
	                <td colspan="3">    
	                    <input name="type" class="fui-combobox" textField="text" valueField="id" emptyText="请选择..."
	                    	   data="[{ id: 1, text: '叶子节点' }, { id: 0, text: '树节点'}]"
    						   required="true" allowInput="true" showNullItem="true" nullItemText="请选择..."/>
	                </td>
	            </tr>         
	        </table>            
        </div>
    </fieldset>
    <div id="saveDiv" style="text-align:center;padding:10px;">               
        <a class="fui-button" onclick="onOk" style="width:60px;margin-right:20px;">确定</a>       
        <a class="fui-button" onclick="onCancel" style="width:60px;">取消</a>       
    </div>        
    <div id="updateDiv" style="text-align:center;padding:10px;display:none;">               
        <a class="fui-button" onclick="onUpdate" style="width:60px;margin-right:20px;">确定</a>       
        <a class="fui-button" onclick="onCancel" style="width:60px;">取消</a>       
    </div>        
</form>
</body>
<script type="text/javascript" src="${path}/public/scripts/supervisor/menu-state.js?v=<%=System.currentTimeMillis()%>"></script>
</html>
