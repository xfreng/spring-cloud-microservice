<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <%@include file="/public/include/iplat-common.jsp"%>
    <%@include file="/public/include/fui-iplat-common.jsp"%>
</head>
<body style="overflow-x:hidden;">
<jsp:include flush="false" page="/public/include/iplat.ef.head.jsp"></jsp:include>
<div id="form1" class="fui-panel" title="布局样式设置" width="100%" height="100%">
    <table border="0" width="100%" >
      <tr>
      	<td align="right" width="15%" nowrap>
         	 选择布局：
        </td>
        <td>
	  		<div id="menuType" name="menuType" align="center" class="fui-radiobuttonlist" dataField="dictList" valueField="dictEntryCode" textField="dictEntryDesc" url="${path}/supervisor/dict/getDictData?dictCode=LAYOUTSTYLE" onvaluechanged="changed"></div>
        </td>
      </tr>
      <tr>
      	<td align="right" nowrap>
         	 选择皮肤：
        </td>
        <td>
        	<div id="pageStyle" name="pageStyle" align="center" class="fui-radiobuttonlist" dataField="dictList" valueField="dictEntryCode" textField="dictEntryDesc"></div>
        </td>
      </tr>
    </table>
    <div class="fui-panel" title="预览效果" headerStyle="background:transparent;color:gray;" height="63%" width="90%" style="left:100px;" allowResize="true">
		<img id="layoutSkin" width="100%" height="100%" src=""/>
    </div>
    <table border="0" width="100%" >
      <tr>
      	<td colspan="2" align="center">
      	  <span style="color:red;">注意：若不选择立即生效，则以上设置需要重新登录后才能生效。</span>
      	</td>
      </tr>
      <tr>
      	<td colspan="2" align="center">
      	  <a class="fui-button" iconCls="icon-save" onclick="btnUpdate_onClick()" >保存</a>
      	</td>
      </tr>
    </table>
</div>
<script type="text/javascript" src="${path}/public/scripts/supervisor/style.js?v=<%=System.currentTimeMillis()%>"></script>
</body>
</html>