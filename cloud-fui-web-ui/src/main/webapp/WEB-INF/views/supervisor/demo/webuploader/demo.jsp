<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>webuploader demo</title>
</head>
<body>
    <input type="hidden" id="server_url" value="${pageContext.request.contextPath }/supervisor/uploadImages"/>
    <iframe id="webuploaderFrame" src="${pageContext.request.contextPath }/supervisor/webuploader?v=<%=System.currentTimeMillis()%>" width="100%" height="365" scrolling="no" frameborder="0"></iframe>
    <div id="imagesUrlDiv"></div>
</body>
</html>