<%@page contentType="text/html; charset=UTF-8"%>
<%@page import="com.fui.cloud.common.DateUtils"%>
<%@page import="com.fui.cloud.common.StringUtils"%>
<%@page import="java.util.Date"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.util.Map"%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>日历——增删改数据操作</title>
	<%
		String id = request.getParameter("id");
		String action = request.getParameter("action");
		String date = request.getParameter("date");
		String end_date = request.getParameter("end");
		String h3_title = "add".equals(action)?"新建事件":"编辑事件";

		boolean isStartDefault = false;
		Object title = "";
		String starttime = "";
		Object start_d = "";
		Object start_h = "";
		Object start_m = "";
		Object display = "";
		String endtime = "";
		Object end_d = "";
		Object end_h = "";
		Object end_m = "";
		Object end_chk = "";
		Object end_display = "";
		Object allday = "";
		Object allday_chk = "";
		Object color = "";
		if(StringUtils.isNotEmpty(id)){
			Map param = (Map)request.getAttribute("param");
			id = String.valueOf(param.get("id"));
			title = param.get("title");
			starttime = (String)param.get("start");
			color = param.get("color");
			int start_end_index = starttime.lastIndexOf(" ");
			Calendar cal = Calendar.getInstance();
			if(start_end_index != -1){
				Date startdate = DateUtils.getDate19(starttime);
				cal.setTime(startdate);
				start_d = StringUtils.isNotEmpty(starttime) ? starttime.substring(0,start_end_index) : "";
				start_h = cal.get(Calendar.HOUR_OF_DAY);
				start_m = cal.get(Calendar.MINUTE);
			}else{
				start_d = starttime;
			}
			endtime = (String)param.get("end");
			if(StringUtils.isNullOrEmpty(endtime)){
				end_d = start_d;
				end_chk = "";
				end_display = "style='display:none'";
				isStartDefault = true;
			}else{
				int end_end_index = endtime.lastIndexOf(" ");
				if(end_end_index != -1){
					Date enddate = DateUtils.getDate19(endtime);
					cal.setTime(enddate);
					end_d = StringUtils.isNotEmpty(endtime) ? endtime.substring(0,end_end_index) : "";
					end_h = cal.get(Calendar.HOUR_OF_DAY);
					end_m = cal.get(Calendar.MINUTE);
				}else{
					end_d = endtime;
				}
				end_chk = "checked";
				end_display = "style=''";
			}

			allday = param.get("allday");
			if("true".equals(allday)){
				display = "style='display:none'";
				allday_chk = "checked";
			}else{
				display = "style=''";
				allday_chk = "";
			}
		}else{
			display = "style='display:none'";
			allday_chk = "checked";
		}
		if(StringUtils.isNotEmpty(date) && date.equals(end_date)){
			end_date = "";
		}
		if(StringUtils.isNullOrEmpty(end_date) && (StringUtils.isNullOrEmpty(end_d) || isStartDefault)){
			end_display = "style='display:none'";
			end_date = date;
			end_chk = "";
		}else{
			end_display = "style=''";
			end_chk = "checked";
		}
	%>
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/webjars/fui/public/css/jquery-ui.css">
</head>
<body>
<div class="fancy">
	<h3><%=h3_title %></h3>
    <form id="add_form" action="${pageContext.request.contextPath}/supervisor/event" method="post">
    <input type="hidden" name="id" id="eventid" value="<%=id %>"> 
    <input type="hidden" name="action" value="<%=action %>">
    <p>日程内容：<input type="text" class="input" name="event" id="event" style="width:320px" placeholder="记录你将要做的一件事..." value="<%=title %>"></p>
    <p>开始时间：<input type="text" class="input datepicker" name="startdate" id="startdate" value="<%=StringUtils.isNullOrEmpty(start_d)?date:start_d %>">
    <span id="sel_start" <%=display %>><select name="s_hour" class="select">
    	<%
    		for(int i=0;i<24;i++){
    			if(StringUtils.isNotEmpty(start_h.toString()) && i == Integer.valueOf(start_h.toString()).intValue()){
    	%>
    				<option value="<%=Integer.valueOf(start_h.toString())<10?("0"+start_h):start_h %>" selected><%=Integer.valueOf(start_h.toString())<10?("0"+start_h):start_h %></option>
    	<%
    			}else{
    	%>
    				<option value="<%=i<10?("0"+i):i %>" <%="add".equals(action) && (i==8)?"selected":"" %>><%=i<10?("0"+i):i %></option>
    	<%			
    			}
    		}
    	%>
    </select>:
    <select name="s_minute" class="select">
    	<%
    		for(int i=0;i<60;i+=10){
    			if(StringUtils.isNotEmpty(start_m.toString()) && i == Integer.valueOf(start_m.toString()).intValue()){
    	%>
    				<option value="<%=i==0?("0"+start_m):start_m %>" selected><%=i==0?("0"+start_m):start_m %></option>
    	<%
    			}else{
    	%>
    				<option value="<%=i == 0?("0"+i):i %>"><%=i == 0?("0"+i):i %></option>
    	<%			
    			}
    		}
    	%>
    </select>
    </span>
    </p>
    <p id="p_endtime" <%=end_display %>>结束时间：<input type="text" class="input datepicker" name="enddate" id="enddate" value="<%=StringUtils.isNullOrEmpty(end_d)?end_date:end_d %>">
    <span id="sel_end" <%=display %>><select name="e_hour" class="select">
    	<%
    		for(int i=0;i<24;i++){
    			if(StringUtils.isNotEmpty(end_h.toString()) && i == Integer.valueOf(end_h.toString()).intValue()){
    	%>
    				<option value="<%=Integer.valueOf(end_h.toString())<10?("0"+end_h):end_h %>" selected><%=Integer.valueOf(end_h.toString())<10?("0"+end_h):end_h %></option>
    	<%
    			}else{
    	%>
    				<option value="<%=i<10?("0"+i):i %>" <%="add".equals(action) && (i==12)?"selected":"" %>><%=i<10?("0"+i):i %></option>
    	<%			
    			}
    		}
    	%>
    </select>:
    <select name="e_minute" class="select">
    	<%
    		for(int i=0;i<60;i+=10){
    			if(StringUtils.isNotEmpty(end_m.toString()) && i == Integer.valueOf(end_m.toString()).intValue()){
    	%>
    				<option value="<%=i==0?("0"+end_m):end_m %>" selected><%=i==0?("0"+end_m):end_m %></option>
    	<%
    			}else{
    	%>
    				<option value="<%=i == 0?("0"+i):i %>"><%=i == 0?("0"+i):i %></option>
    	<%			
    			}
    		}
    	%>
    </select>
    </span>
    </p>
    <p>颜色标记：<input type="text" class="input" name="color" id="color" value="<%=color %>">
    <p>
    <label><input type="checkbox" value="1" id="isallday" name="isallday" <%=allday_chk %>> 全天</label>
    <label><input type="checkbox" value="1" id="isend" name="isend" <%=end_chk %>> 结束时间</label>
    </p>
    <div class="sub_btn">
    <%
    	if("edit".equals(action)){
    %>
    <span class="del"><input type="button" class="btn btn_del" id="del_event" value="删除"></span>
    <%	
    	}
    %>
    <input type="submit" class="btn btn_ok" value="确定">
    <input type="button" class="btn btn_cancel" value="取消" onClick="$.fancybox.close()">
    </div>
    </form>
</div>
<script type="text/javascript" src="${pageContext.request.contextPath}/webjars/fui/public/scripts/jquery.form.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/webjars/fui/public/common/fui/common.js"></script>
<script type="text/javascript">
	$(function(){
		$(".datepicker").datepicker({minDate: -3,maxDate: 3,dateFormat: 'yy-mm-dd'});
		$("#isallday").click(function(){
			if($("#sel_start").css("display")=="none"){
				$("#sel_start,#sel_end").show();
			}else{
				$("#sel_start,#sel_end").hide();
			}
		});

		$("#isend").click(function(){
			if($("#p_endtime").css("display")=="none"){
				$("#p_endtime").show();
			}else{
				$("#p_endtime").hide();
			}
		});

		//提交表单
		$('#add_form').ajaxForm({
			beforeSubmit: showRequest, //表单验证
			success: showResponse //成功返回
		});

		$("#del_event").click(function(){
			if(confirm("您确定要删除吗？")){
				var eventid = $("#eventid").val();
				$.post("${pageContext.request.contextPath}/supervisor/event?action=del",{id:eventid},function(result){
					if(result.message == 1){//删除成功
						$.fancybox.close();
						$('#calendar').fullCalendar('refetchEvents'); //重新获取所有事件数据
					}else{
						alert(result.message);
					}
				});
			}
		});
	});

	function showRequest(){
		var events = $("#event").val();
		if(events == ''){
			alert("请输入日程内容！");
			$("#event").focus();
			return false;
		}
	}

	function showResponse(responseText, statusText, xhr, $form){
		if(statusText == "success"){
			if(responseText.message == 1){
				$.fancybox.close();
				$('#calendar').fullCalendar('refetchEvents'); //重新获取所有事件数据
			}else{
				alert(responseText.message);
			}
		}else{
			alert(statusText);
		}
	}

	$("#color").colorpicker({
		fillcolor:true,
		success:function(o,color){
			$(o).css("color",color);
		}
	})
</script>
</body>
</html>