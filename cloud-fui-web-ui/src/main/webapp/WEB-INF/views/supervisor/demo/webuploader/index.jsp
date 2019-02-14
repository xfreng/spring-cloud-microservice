<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <title>webuploader demo</title>
</head>
<body>
    <%--<input type="hidden" id="server_url" value="${pageContext.request.contextPath }/supervisor/uploadImages"/>--%>
    <input type="hidden" id="server_url" value="http://192.168.52.106:8034/interface/app/upload"/>
    <iframe id="webuploaderFrame" src="${pageContext.request.contextPath }/supervisor/webuploader?v=<%=System.currentTimeMillis()%>" width="100%" height="365" scrolling="no" frameborder="0"></iframe>
    <div id="imagesUrlDiv"></div>
</body>
</html>