<%@page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<style type="text/css">
	    html, body{
	        margin:0;padding:0;border:0;width:100%;height:100%;overflow:hidden;
	    }
	
	    .logo{
	        font-family:"微软雅黑","Helvetica Neue",Helvetica,Arial,sans-serif;
	        font-size:28px;
	        font-weight:bold;        
	        cursor:default;
	        position:absolute;
            top:16px;
            left:14px;
	        line-height:28px;
	        color:#444;
	    }    
	    .topNav{
	        position:absolute;right:8px;top:12px;        
	        font-size:12px;
	        line-height:25px;
	    }
	    .topNav a{
	        text-decoration:none;        
	        font-weight:normal;
	        font-size:12px;
	        line-height:25px;
	        margin-left:3px;
	        margin-right:3px;
	        color:#333;        
	    }
	    .topNav a:hover{
	        text-decoration:underline;        
	    }   
        .fui-layout-region-south img{
	        vertical-align:top;
	    }
    </style>
</head>
<body>
	<div class="logo">
        <a href="${path}/supervisor/login/default"><img src="${path}/public/mainframe/images/${logo}"></a>&nbsp;
        <span class="separator"></span>
        ${projectName}&nbsp;<span style="font-size:12px;">${dev} </span>
    </div>
    <div class="topNav">
        <span class="mg_l_10 font_14" style="top:50px;">欢迎您！${user.ename}&nbsp;&nbsp;&nbsp;</span>
        <a class="fui-button fui-button-iconLeft" iconCls="icon-home" onclick="toIndex" plain="true" >&nbsp;首&nbsp;页</a>
        <a class="fui-button fui-button-iconLeft" iconCls="icon-pop_up_window" onclick="changeOpenWindow" plain="true" >窗口切换</a>
        <a class="fui-button fui-button-iconLeft" iconCls="icon-change_password" onclick="changePwdWindow" plain="true" >修改密码</a> |
        <a class="fui-button fui-button-iconLeft" iconCls="icon-power-off" onclick="logout" plain="true" target="_parent">&nbsp;注&nbsp;销</a>
    </div>

    <div style="position:absolute;right:12px;bottom:8px;font-size:12px;line-height:25px;font-weight:normal;">
      	  皮肤：
        <select onchange="updateStyle(this.value == 'pact' ? 'pact' : 'default',this.value)" style="width:100px;margin-right:10px;">
            <option value="default" ${("default" eq menuStyle) ? "selected" : ""}>Default</option>
            <option value="bootstrap" ${("bootstrap" eq menuStyle) ? "selected" : ""}>Bootstrap</option>
            <option value="pact" ${("pact" eq menuStyle) ? "selected" : ""}>Pact</option>
        </select>
    </div>
</body>
<script type="text/javascript">
	function logout(e) {
	    fui.confirm("确定注销吗？","提示信息",function (action) {
            if(action == "ok"){
                window.location.href = fui.contextPath + "/logout";
            }
        })
	}
	
	function toIndex(e) {
		window.location.href = fui.contextPath + "/index";
	}
</script>
</html>