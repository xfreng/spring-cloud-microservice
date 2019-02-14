<%@page import="java.util.Calendar" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<%
	Calendar cal=Calendar.getInstance();
	int year=cal.get(Calendar.YEAR);
%>
<html>
  <head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  </head>
  <body>
	<div style="text-align: center;padding: 6px;">
		Copyright &copy;  2015&nbsp;-&nbsp;<%=year %>&nbsp;&nbsp;xfreng制作&nbsp;&nbsp;<label id="cy"></label>
	</div>
  </body>
</html>