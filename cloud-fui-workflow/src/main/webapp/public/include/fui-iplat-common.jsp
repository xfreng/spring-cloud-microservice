<%@ page language="java" pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
<script type="text/javascript" src="${path}/public/common/fui/fui.js"></script>
<script type="text/javascript" src="${path}/public/common/fui/fui-ext.js"></script>
<script type="text/javascript" src="${path}/public/common/fui/common.js"></script>
<script type="text/javascript" src="${path}/public/common/fui/json2.js"></script>
<script type="text/javascript" src="${path}/public/common/fui/swfupload/swfupload.js"></script>
<script type="text/javascript" src="${path}/public/common/fui/jquery/jquery.cookies.js"></script>
<c:choose>
	<c:when test="${'pact' eq menuType}">
		<link rel="stylesheet" type="text/css" href="${path}/public/common/fui/themes/pact/fui.css"/>
		<link rel="stylesheet" type="text/css" href="${path}/public/common/fui/themes/${menuStyle}/common.css"/>
		<link rel="stylesheet" type="text/css" href="${path}/public/common/fui/themes/${menuStyle}/skin.css"/>
		<link rel="stylesheet" type="text/css" href="${path}/public/common/fui/themes/${menuStyle}/icons.css"/>
	</c:when>
	<c:otherwise>
		<link rel="stylesheet" type="text/css" href="${path}/public/common/fui/themes/default/fui.css"/>
		<link rel="stylesheet" type="text/css" href="${path}/public/common/fui/themes/icons.css"/>
		<link rel="stylesheet" type="text/css" href="${path}/public/common/fui/themes/${menuStyle}/skin.css"/>
	</c:otherwise>
</c:choose>

<link rel="stylesheet" type="text/css" href="${path}/public/common/fui/themes/pact/demo.css"/>
<link rel="stylesheet" type="text/css" href="${path}/public/common/fui/themes/default/fui-ext-style.css"/>

<script type="text/javascript">
    fui.treeRootId="root";
	fui.contextPath="${path}";
	fui.menuType="${menuType}";
	fui.menuStyle="${menuStyle}";
	fui.DataTree.prototype.dataField="data";//兼容改造
</script>