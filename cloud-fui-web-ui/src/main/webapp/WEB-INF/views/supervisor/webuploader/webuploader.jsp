<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>webuploader</title>
    <link rel="stylesheet" type="text/css" href="webjars/fui/public/webuploader/css/webuploader.css"/>
    <link rel="stylesheet" type="text/css" href="webjars/fui/public/webuploader/css/style.css"/>
    <link rel="stylesheet" type="text/css" href="webjars/fui/public/webuploader/css/custom.css">
    <script type="text/javascript" src="webjars/fui/public/common/fui/jquery/jquery-1.8.1.min.js" contextPath="${pageContext.request.contextPath}"></script>
    <script type="text/javascript" src="webjars/fui/public/webuploader/js/webuploader.js"></script>
    <script type="text/javascript" src="webjars/fui/public/webuploader/js/upload.js"></script>
</head>
<body>
<div id="wrapper">
    <div id="container">
        <div id="uploader">
            <div class="queueList">
                <div id="dndArea" class="placeholder">
                    <div id="filePicker"></div>
                    <p>或将照片拖到这里，单次最多可选300张</p>
                    <p style="padding: 10px;">温馨提示：若非IE内核下[点击选择图片]按钮失效，请选择将照片拖到这里</p>
                </div>
            </div>
            <div class="statusBar" style="display:none;">
                <div class="progress">
                    <span class="text">0%</span>
                    <span class="percentage"></span>
                </div><div class="info"></div>
                <div class="btns">
                    <div id="filePicker2"></div><div class="uploadBtn">开始上传</div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>