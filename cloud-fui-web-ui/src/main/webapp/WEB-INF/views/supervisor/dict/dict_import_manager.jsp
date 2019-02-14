<%@page contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<%@include file="/public/include/iplat-common.jsp"%>
	<%@include file="/public/include/fui-iplat-common.jsp"%>
	<title>文件上传控件（HTML）</title>
</head>
<body>
<br />
<form id="form1" action="dictTypeServlet?method=importDictExcel" method="post" enctype="multipart/form-data">
	<table align="center" border="0" width="100%" class="form_table">
		<tr>
			<td align="center" width="30%">
		       	请选择您要导入的Excel文件！<input class="fui-htmlfile" id="Fdata" name="Fdata" limitType="*.xls" />
		    </td>
		</tr>
		<tr>
			<td>&nbsp;</td>
		</tr>
		<tr>
			<td align="center">
		    	<a class="fui-button" iconCls="icon-upload" onclick="dictAllImport();" >上传</a>
		    </td>
		</tr>
		<tr>
			<td>&nbsp;</td>
		</tr>
	</table>
</form>
<%
	Object ret = request.getAttribute("retCode");
	if(ret != null){
		if(ret.equals("-1")){
			out.println("<div align='center' class='description'><h3><font color='red'>数据字典导入失败！</font></h3></div>");
		}else{
			out.println("<div align='center' class='description'><h3><font color='green'>数据字典导入成功！</font></h3></div>");
		}
	}
%>
</body>
<script language="JavaScript" type="text/javascript">
	fui.parse();
	var form = new fui.Form("#form1");
	function dictAllImport(){
		var path = fui.get("Fdata").getValue();
		if(path && path != ""){
			var frm = document.getElementById("form1");
			frm.action += "&path="+path; 
			frm.submit();
		}else{
			fui.alert("请选择要导入的Excel文件！");
		}
	}
</script>	
</html>