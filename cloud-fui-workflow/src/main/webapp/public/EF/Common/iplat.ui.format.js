/**
 * JS 格式化类.
 * 
 * @author wuyicang
 * @updater wangyuqiu update xmldom create only one instance object 
 */

/**
 * @constructor
 */
efformat = function() {
}

/**
 * 格式化数字.以下说明中,小数点后的"00"代表必须保留小数位数，小数点后的“##”代表可扩展小数位数
 * 1."#,###" 对于整数，3位一组分开;如1234567格式化后为1,234,567
 * 2."#,##,###"  对于整数，按最后一组"#"号为分隔组单位;如1234567，格式化后为:1,234,567
 * 3.".000"保留3位置小数，最后一位四舍五入;如1.2格式化后为1.200, 1.123456格式化为1.234;1.1245格式化后为1.235
 * 4."￥#,###.00",格式化后带前缀，如1234.56格式化后为￥1,234.56
 * 5."人民币  #,###.00",格式化后带前缀，如1234.56格式化后为"人民币  1,234.56"
 * 6. "#,###.00 元",格式化后带后缀，如1234.56格式化后为"1,234.56 元"
 * 7. "￥#,###.00 元"，格式化后带前后缀，如1234.56格式化后为"￥1,234.56 元"
 * 8."#,###.00%"，百分号支持，如0.123格式化后为"12.30%"
 * 9. "#,##.00##":最少保留2位小数，最多保留4位小数，如0.123格式化后为0.123; 0.1格式化后为0.10, 0.123格式化后为0.123, 0.12356格式化后为0.1236
 * @param {Object} number	: 需要格式化的数字;
 * @param {String} rawformat		: 格式化字符串;
 * @return {String} 格式化后的字符串.
 * @exception 无异常抛出
 */
efformat.formatFloat = function(number,formatStr) {
	//@author shaohuan 2013-08-21
	//去除原生格式化字符串中的货币符号，中文字符，空格等 ，留下逗号，点号，#号，百分号
	var rawformat = formatStr;

    // add by yiyong  渲染是或否   0--否  1--是
    if(formatStr.indexOf("yesOrNo")>=0){
        if(number==0) return "否";
        if(number==1) return "是";
    }
	/*===========此处为兼容特殊的老的格式化用法---START---=======================*/
	//处理1) ".00"  2)"#.00"  3)".###" 4)"#.000"等老格式
	var comma = /,/,  compatibleMode = !comma.test(formatStr);
	if (compatibleMode === true) {rawformat = "#,#"+rawformat;};
	
    /*===========此处为兼容特殊的老的格式化用法---END---=======================*/
	
	
	//格式化字符串须为"#,###"或"#,##0.00"或"$##0.00美元"或"#,##0.00%"等诸如此类的格式
	var reg = /^[#0]+(,[#0]+)+((\.[#0]+)|([#0]*))%?$/;
	var format = rawformat.replace(/[^#\.,0\s]/g, '');
	
	//JS的浮点数相乘不精确，故自定义浮点数相乘运算
    var multiply = function(arg1,arg2) {
    	var m = 0,s1 = arg1.toString(),s2 = arg2.toString(); 
    	try { m += s1.split(".")[1].length; } catch (e) {} 
    	try { m += s2.split(".")[1].length; } catch (e) {} 
    	return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
    };
    
	if (!reg.test(format)) return number;  //当经过处理得格式串不符合函数前约定的格式时，不对number进行格式化
	
	var percent_reg = /%$/g, isPercent = percent_reg.test(formatStr);
	if (isPercent) { //说明带有百分号
		number = multiply(number,100);
		format = format.replace('%','');
	}
	
	var isNegative = (number < 0),
		dot_pos = format.indexOf('.'),
		//几个'#'号为一组，如'#,##'代表两个'#'号为一组
	    group_len = 0;            
	
	if (isNegative) {
		number = - number;
	}
	
	if (dot_pos == -1) {  //格式化后不带小数点
		//只格式化整数部分，小数部分
		number = Math.round(number).toString();
		group_len = format.length - format.lastIndexOf(',') - 1;         
	} else {               //格式化带小数点
		//Decimal digits
		var dec_dig = format.length - format.indexOf('.') - 1;    //格式化后欲保留小数点的位数
		var dec_format = format.substr(format.lastIndexOf('.')+1);   //小数部分格式化串
		
		number = Math.round(number * Math.pow(10,dec_dig))/Math.pow(10,dec_dig);
		
		//对于整数10，上边的四舍五入操作并没有使其成为10.00，故而需要调用toFixed函数对数值进行二次格式化
		number = number.toFixed(dec_dig);
		
		//对于小数部分".00##"或"###"的老格式，数字保留到非零部分
		var dec_reg = /(^##*#$) |(^00*#*#)/;
		if (dec_reg.test(dec_format)){
			var need_dec_num = dec_format.match(/0/gi).length;  //必须保留的小数位
			var ext_dec_num = dec_format.match(/#/gi).length;    //可扩展保留的小数位
			//数字小数部分扩展位上的连续零的个数
			var temp = number.toString();
			var zero_str = temp.slice(-ext_dec_num).match(/0*0$/gi);
			var  zero_len = 0;
			if (zero_str != null){
				zero_len = zero_str.toString().split('').length;
			}
			number = number.substr(0,number.length-zero_len);
		}
		
		group_len = format.lastIndexOf('.') - format.lastIndexOf(',') - 1;         
	}
	
	//此时，不管number有没有小数部分，都只对其整数部分进行添加逗号进行格式化
   	var number_arr = number.split('').reverse();
	if  (compatibleMode !== true) {
	   	var step = group_len; 
	   	var i = (-1 == number_arr .indexOf('.'))? step : 
	   				number_arr.indexOf('.') + step + 1;
	   	while (step>0 && i<number_arr.length) {
	   		number_arr.splice(i , 0 , ',');
	   		i += (step + 1);
	   	}
	}
   	var retv = number_arr.reverse().join('');
   	
   	//处理货币符号，负号，百分号和单位
   	
	//如果是负数
	if (isNegative) {
		var sign = '-';
		retv = sign.concat(retv);
	}
	
	//如果带有百分号，那按照约定，是不会出现货币符号和单位的
	if (isPercent) {
		retv = retv.concat('%');
		return retv;
	}
	
	//接着处理货币符号和单位符号
   	  var first_formatchar_pos = rawformat.search(/[#0]/);
   	      last_formatchar_pos = rawformat.length - rawformat.split("").reverse().join("").search(/[#0]/);
   	retv = rawformat.substring(0, first_formatchar_pos) + retv + 
   			rawformat.substring(last_formatchar_pos);

   	return retv;
}

efformat.IsDateFormatter = function(format) {
	return (format.indexOf("yy")>-1) ||
			(format.indexOf("MM")>-1) ||
			(format.indexOf("dd")>-1) ||
			(format.indexOf("HH")>-1) ||
			(format.indexOf("mm")>-1) ||
			(format.indexOf("ss")>-1) ||
			(format.indexOf("SSS")>-1);
}

//just like a joke
efformat.formatDate = function (number,format) {
	return efform._dateParseToString(efform._stringParseToDate(number),format);
}

efform._stringParseToDate = function(num,rawFormat) {
	if(num ==  undefined) return null;

	var raw_format = "";
	if(rawFormat)
		raw_format = rawFormat;
	else {
		if (num.length==14 && ef_validator_regexes["number"].test(num))
			raw_format ="yyyyMMddhhmmss";
		else if (num.length==17 && ef_validator_regexes["number"].test(num))
			raw_format ="yyyyMMddhhmmssSSS";
		else if (num.length==8 && ef_validator_regexes["number"].test(num))
			raw_format ="yyyyMMdd";
		else if (num.length>=8 && num.length<=10) {
			if (num.indexOf("-")>0)
				raw_format = "yyyy-MM-dd";
			else if (num.indexOf("/")>0)
				raw_format = "yyyy/MM/dd";
		}
	}
	if (raw_format == "") {return num;}

	var date = new Object();
	var y_index = raw_format.indexOf("yyyy");
	var M_index = raw_format.indexOf("MM");
	var d_index = raw_format.indexOf("dd");
	var h_index = raw_format.indexOf("hh");
	var m_index = raw_format.indexOf("mm");
	var s_index = raw_format.indexOf("ss");
	var ss_index = raw_format.indexOf("SSS");
	
	if (y_index>-1)
		date["yyyy"] = num.substring(y_index,y_index+4);
	else 
		date["yyyy"] = "0000";
	if (M_index>-1)
		date["MM"] = num.substring(M_index,M_index+2);
	else 
		date["MM"] = "00";
	if (d_index>-1)
		date["dd"] = num.substring(d_index,d_index+2);
	else 
		date["dd"] = "00";
	if (h_index>-1)
		date["hh"] = num.substring(h_index,h_index+2);
	else 
		date["hh"] = "00";
	if (m_index>-1)
		date["mm"] = num.substring(m_index,m_index+2);
	else 
		date["mm"] = "00";
	if (s_index>-1)
		date["ss"] = num.substring(s_index,s_index+2);
	else 
		date["ss"] = "00";
	if (ss_index>-1)
		date["SSS"] = num.substring(ss_index,ss_index+3);
	else 
		date["SSS"] = "000";
	return date;
}

efform._dateParseToString = function(date,format) {
	if (date == undefined || format== undefined ) return "";
	if (typeof date == "string") return date;
	format = format.toLocaleLowerCase();
	
	//在页面中格式化串可能是的“天”和“分”对应的都是"mm"，所以要加个计时器处理一下
	var mm_count = 0;
	var retDateString = new Array(); 
	for(var i=0;i< format.length; i++) {
		if (format.charAt(i)=="y" && format.charAt(i+1)=="y" && 
				format.charAt(i+2)=="y" && format.charAt(i+3)=="y" ) {
			retDateString.push(date["yyyy"]);
			i=i+3;
		} else if (format.charAt(i)=="y" && format.charAt(i+1)=="y") {
			retDateString.push(date["yyyy"].substr(2));
			i++;
		} else if (format.charAt(i)=="m" && format.charAt(i+1)=="m") {
			mm_count++;
			if (mm_count === 1){
				retDateString.push(date["MM"]);
			}else{
				retDateString.push(date["mm"]);
			}
			i++;
		} else if (format.charAt(i)=="d" && format.charAt(i+1)=="d") {
			retDateString.push(date["dd"]);
			i++;
		} else if (format.charAt(i)=="h" && format.charAt(i+1)=="h") {
			retDateString.push(date["hh"]);
			i++;
		}  else if (format.charAt(i)=="s" && format.charAt(i+1)=="s") {
			retDateString.push(date["ss"]);
			i++;
		} else if (format.charAt(i)=="S" && format.charAt(i+1)=="S"&&
					format.charAt(i+2)=="S") {
			retDateString.push(date["SSS"]);
			i =i+ 2;
		} else
			retDateString.push(format.charAt(i));
	}
	
	return retDateString.join("");
}

//huangke add new format
efformat.formatDate1 = (function(){
	function parseFormat(format,defaultValue) {
		var year = format.match(/y+/i)? format.match(/y+/i)[0] : defaultValue || '';
		var month = format.match(/M+/)? format.match(/M+/)[0] : defaultValue || '';
		var day = format.match(/d+/i)? format.match(/d+/i)[0] : defaultValue || '';
		var hour = format.match(/h+/i)? format.match(/h+/i)[0] : defaultValue || '';
		var minute = format.match(/m+/)? format.match(/m+/)[0] : defaultValue || '';
		var second = format.match(/s+/)? format.match(/s+/)[0] : defaultValue || '';
		var millisecond = format.match(/S+/)? format.match(/S+/)[0] : defaultValue || '';
		
		return {
				year: year,
				month: month,
				day: day,
				hour: hour,
				minute: minute,
				second: second,
				millisecond: millisecond
		};
	}


	function handleRawFormat(dateString,rawFormat) {
		var RAWFORMAT = parseFormat(rawFormat);
		var DATEVALUE = parseFormat('','0');
		//set date value
		for(var key in RAWFORMAT) {
			var value = RAWFORMAT[key];
			var length = value.length;
			if(length > 0) {
				DATEVALUE[key] = dateString.substr(rawFormat.indexOf(value),length) || '0';
			}
		}
		return DATEVALUE;
	}
	
	function isDateFormat (format) {
		var isValiad = true;
		var valiateRules = [/[^ymdhs\s\/,:-]+/i,
							/y[^y]+y/i,
							/M[^M]+M/,
							/d[^d]+d/i,
							/h[^h]+h/i,
                            /m[^m]+m/,
							/s[^s]+s/,
                            /S[^S]+S/
			];
		for (var i = 0; i < valiateRules.length; i++) {
			if (valiateRules[i].test(format)) {
				isValiad =false;
				break;
			}
		}
        return isValiad;
    }

	// try  another way
	function formatDate (dateString , format , rawFormat) {
		
		//validate format
		if (!isDateFormat(format)) {
			
			return dateString;
		}
			
		var FORMAT = parseFormat(format);
		var DATEVALUE = {};
		if (/^\d+$/.test(dateString)){ //number
			var fullTimeFormat = 'yyyyMMddHHmmssSSS';
			rawFormat = rawFormat || fullTimeFormat;
			DATEVALUE = handleRawFormat(dateString,rawFormat);
		} else { //string
			if (!rawFormat) {
				var date = new Date(dateString);
			
				if (isNaN(date.getTime())){
					//invalid date 
					return dateString;
				}
				DATEVALUE.year = date.getFullYear() + ""; 
				DATEVALUE.month = date.getMonth() + 1 + ""; 
				DATEVALUE.day = date.getDate() + ""; 
				DATEVALUE.hour = date.getHours() + ""; 
				DATEVALUE.minute = date.getMinutes() + ""; 
				DATEVALUE.second = date.getSeconds() + ""; 
				DATEVALUE.millisecond = date.getMilliseconds() + ""; 
			} else {
				DATEVALUE = handleRawFormat(dateString,rawFormat);
			}
		}
		
		//format
		var formatted = format;
		for(var key in FORMAT) { 
			var value = FORMAT[key];
			var length = value.length;
			if (length > 0) {
				//substr  & fix with 0 // y M d H m s SSS
				var dateValue = DATEVALUE[key];
				var dateValuelength = dateValue.length;
				if (dateValuelength > length){
					switch (value[0]) {
						case 'y': case 'Y': 
							dateValue = dateValuelength > 2 ?
									    dateValue.substr(2) : dateValue; break;
						case 'M': case 'd': case 'm': case 'h': case'H':
						case 's': case 'S':  //remove 0
							dateValue = dateValue * 1 + ""; break;
					}
				} else if (dateValuelength < length){
					dateValue = dateValue || "";
					//fix with 0
					switch (value[0]) {
					case 'y': case 'Y': 
						dateValue = '20'+ dateValue; break;
					case 'M': case 'd': case 'm': case 'h': case'H': case 's':
						dateValue = ('0' + dateValue).slice(-2); break;
					case 'S':
						dateValue = ('00' + dateValue).slice(-3); break;
					}
				}
				formatted = formatted.replace(value,dateValue);
			}
		} //end of for FORMAT
		return formatted;
	}
	//export new dateFormat
	return formatDate;
}());


/**
 * 格式化Input 统一formatter和dateFormat
 * @param {DOM} element1 input DOM节点
 * @return
 */
 efformat._formatInput = function(element1)
 {
 	var value = element1.value || "";
 	if(value){ //value 不是null,undefined,""
 		var format = element1.formatter || element1.dateFormat;
 		if(efformat.IsDateFormatter(format))
			return efformat.formatDate( value, format );
		return ef_validator_regexes["number"].test( value ) ? efformat.formatFloat( value, format ) : value;
 	}
 	return value;
 }
/**
 * 更改input的display 有改进的空间
 * @param element1
 * @param element2
 * @param needFormat
 * @return
 */
efformat._changeStatus = function(element1,element2,needFormat)
{
	element1.style.display = "none";
	element2.style.display = "inline";
	if(needFormat)
		$(element2).val(efformat._formatInput(element1));
	else
		element2.focus();
}
/**
 * TagEFInput Format调用
 * @param inputId Input的Id
 * @param format_str 文本格式化串
 * @param dateFormat_str 日期格式化串
 * @return
 */
 efformat.initFormatDiv = function(inputId,format_str,dateFormat_str)
 {
	var element =  $('#'+inputId)[0];
	
	element.style.display = "none";  //隐藏实际的Input,显示格式化结果
	//$(element).prop('formatter')  //OK
	//$(element).attr('formatter')  //undefined
	element.formatter = format_str;  
	element.dateFormat = dateFormat_str;
	
	var format_input  = $('#'+inputId+"_formatInput")[0]; //格式化的Input
	if(!element.readOnly) {
		$(format_input).click(function(){efformat._changeStatus(format_input,element,false);});
		//date 选择日期的时候就blur了,选中的值还没传回去,造成数据不同步,暂时在calendar.js中处理格式化
		$(element).blur(function(){efformat._changeStatus(element,format_input,true);}); 
	}
	
	//copy && paste 更改了input
	$(element).bind('input propertychange', function() {
		format_input.value = efformat._formatInput(element);
	});
	format_input.readOnly = true;
	if(!element.readOnly) format_input.style.background = "#F5F6F8";
	format_input.value = efformat._formatInput(element);
	format_input.className = efformat.IsDateFormatter(format_str || dateFormat_str)?"inputField ef-input-append" : "inputField";
 }


/**
 * 基本格式化函数，使用XLS功能格式化各种字符串.
 * @private
 * @param {Object} value	: 需要格式化的数字;
 * @param {Object} mask		: 格式化字符串;
 * @param {Object} action	: 格式化的动作;
 * @param {Object} param	: 其他参数;
 * 
 * @return {String} 格式化后的字符串.
 */
efformat._basicFormat = function(value,mask,action,param)
{
	/*
     var xmlDoc;
     var xslDoc;
     var v='<formats><format><value>'+value+'</value><mask>'+mask+'</mask></format></formats>';
     xmlDoc = efformat.parseXML(v);

     var x='<xsl:stylesheet xmlns:xsl="uri:xsl">';
     x+='<xsl:template match="/">';
     x+='<xsl:eval>'+action+'('+value+',"'+mask+'"';
     if(param)
     	x+=','+param;
     x+=')</xsl:eval>';
     x+='</xsl:template></xsl:stylesheet>';
     xslDoc = efformat.parseXML(x);
     var s= xmlDoc.transformNode(xslDoc);     
     return s;
     */
	
	var xmlDoc;
	var xslDoc;
	var v = '<formats><format><value>' + value + '</value><mask>' + mask
		+'</mask></format></formats>';
	xmlDoc = efformat._parseXML(v);

	var x; 
	if(isIE)
		x='<xsl:stylesheet xmlns:xsl="uri:xsl">'
	else
		x='<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">';
		
	x+='<xsl:template match="/">';
	if(isIE) 
	{
		x+='<xsl:eval>'+action+'('+value+',"'+mask+'"';
		if(param)x+=','+param;
		x+=')</xsl:eval>';
	}
	else
		x+='<xsl:value-of select="format-number('+value+',\''+mask+'\')" />';

	x+='</xsl:template></xsl:stylesheet>';
	xslDoc = efformat._parseXML(x);
	var s;
	if(isIE)
	 s= xmlDoc.transformNode(xslDoc)
	else
	{
		//for mozilla/netscape 
        var processor = new XSLTProcessor(); 
		processor.importStylesheet(xslDoc);
		var result = processor.transformToFragment(xmlDoc, xmlDoc);
        var xmls = new XMLSerializer(); 
        s = xmls.serializeToString(result);
	}
	return s;
}



//乘法函数，用来得到精确的乘法结果      
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。      
//调用：multiply(arg1,arg2)      
//返回值：arg1乘以arg2的精确结果      
efformat._multiply = function(arg1,arg2)
{   
  arg1=String(arg1);var i=arg1.length-arg1.indexOf(".")-1;i=(i>=arg1.length)?0:i;   
  arg2=String(arg2);var j=arg2.length-arg2.indexOf(".")-1;j=(j>=arg2.length)?0:j;   
  return arg1.replace(".","")*arg2.replace(".","")/Math.pow(10,i+j);   
}    

/**
 * @private
 */
efformat._getXMLDOM = function () 
{
	//return new ActiveXObject("Microsoft.XMLDOM"); 
	//@update by wangyuqiu@2009-04-14 return the only one instance
	if(null == efformat._XMLDOM)
		efformat._XMLDOM = new ActiveXObject("Microsoft.XMLDOM"); 	
	return 	efformat._XMLDOM;
}

/**
 * @private varient of xmldom for keep only one instance in the memory, who's default value is null;
 * @update by wangyuqiu@2009-04-14
 */
efformat._XMLDOM = null;
/**
 * @private
 * @param {Object} st
 */
efformat._parseXML = function(st)
{
	var result;
    if(isIE)
	{
        result = efformat._getXMLDOM();
        result.loadXML(st);
    }
	else
	{
        var parser = new DOMParser();
        result = parser.parseFromString(st, "text/xml");
    }
    return result;
}
