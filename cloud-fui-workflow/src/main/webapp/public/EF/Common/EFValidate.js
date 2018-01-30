/**
 * JS 验证对象.
 * 
 * @author wuyicang
 */

/**
 * efvalidator对象构造函数
 * @class efvalidator校验对象 该对象提供基本的校验方法 
 * @constructor
 */
efvalidator = function()
{
	/**
	 * @private
	 * 验证类型 
	 */
	this.regexType = "";
	/**
	 * @private
	 * 验证正则表达式 
	 */
	this.regex = null;
	/**
	 * @private
	 * 是否允许空 
	 * */
	this.nullable = true;
	/**
	 * @private
	 * 最大长度 
	 */
	this.maxLength = Number.MAX_VALUE;
	/**
	 * @private
	 * 最小长度 
	 * */
	this.minLength = 0;
	/**
	 * @private
	 * 错误提示信息 
	 */
	this.errorPrompt = "";
}

/**
 * 设置验证类型.
 * @private
 * @param {String} t	: 验证类型;
 * 
 * @return void.
 */
efvalidator.prototype.setRegexType = function( t )
{
	if( isAvailable(t))
	{
		this.regexType = t;
	}
}

/**
 * 设置验证正则表达式.
 * @private
 * @param {Object} ex	: 验证正则表达式;
 * 
 * @return void.
 */
efvalidator.prototype.setRegex = function( ex )
{
	if( isAvailable(ex))
	{
		this.regex = eval(ex);
	}
}

/**
 * 获得验证正则表达式.
 * @private
 * @return {Object} 正则表达式.
 */
efvalidator.prototype.getRegex = function()
{
	if( !isAvailable(this.regex) && isAvailable(this.regexType) )
	{
		return ef_validator_regexes[this.regexType];
	}
	else
	{
		return this.regex;
	}
}

/**
 * 设置是否允许为空.
 * @private
 * @param {boolean} v	: true表示允许为空，false表示不允许为空;
 * 
 * @return void.
 */
efvalidator.prototype.setNullable = function( v )
{
	if( isAvailable(v))
	{
		this.nullable = eval(v);
	}
}

/**
 * 设置最大长度;
 * @private
 * @param {Number} v	: 最大长度;
 * 
 * @return void.
 */
efvalidator.prototype.setMaxLength = function( v )
{
	if( isAvailable(v) && eval(v)>0 )
	{
		this.maxLength = eval(v);
	}
}

/**
 * 设置最小长度;
 * @private
 * @param {Number} v	: 最小长度;
 * 
 * @return void.
 */
efvalidator.prototype.setMinLength = function( v )
{
	if( isAvailable(v) && eval(v)>=0 )
	{
		this.minLength = eval(v);
	}
}

/**
 * 设置提示信息;
 * @private
 * @param {String} v	: 提示信息;
 * 
 * @return void.
 */
efvalidator.prototype.setErrorPrompt = function( v )
{
	if( isAvailable(v) )
	{
		this.errorPrompt = efutils.trimString( v );
	}
}

/**
 * 获取提示信息;
 * @private
 * @return {String} 提示信息.
 */
efvalidator.prototype.getErrorMessage = function()
{
	var message = efutils.trimString( this.errorPrompt );
	if( message != "" ) return message;
		
	if( isAvailable( this.regexType ) ) 
	{
		message = ef_validator_errormsg[this.regexType];
	}		
	if( !isAvailable( message ) )
	{
		message = getI18nMessages("ef.IllegalImportation","输入非法!");
	}
	return message;					
}

/**
 * 进行校验.
 * @private
 * @param {String} str	: 需要校验的值;
 * 
 * @return void.
 * 
 * @exception 验证不通过时将有Error抛出.
 */
efvalidator.prototype.validate = function( str )
{
	var error_message = this.getErrorMessage();
	
	var err_msg_list = "";
	
	if( this.nullable && efutils.trimString( str ) == "" )
	{
		return;
	}
	if( !this.nullable && efutils.trimString( str ) == "" )
	{
		//throw new Error( error_message + "\n" +getI18nMessages("ef.NotNull","数据不能为空!"));
		err_msg_list += getI18nMessages("ef.NotNull","数据不能为空!")+"\n";
	}
	var str_length = efutils.getTotalBytes( str );
	if( str_length > this.maxLength || str_length < this.minLength )
	{
		//throw new Error( error_message + "\n"+ getI18nMessages("ef.DataMin","数据至少") + " "+this.minLength 
		//		+ " "+getI18nMessages("ef.DataMax","数据至多") + " "+this.maxLength + " "+getI18nMessages("ef.DataByte","位"));
		
		err_msg_list += getI18nMessages("ef.DataMin","数据至少") + " "+this.minLength + " "+getI18nMessages("ef.DataMax","数据至多") 
				+ " "+this.maxLength + " "+getI18nMessages("ef.DataByte","位")+"\n";
	}
	var regex = this.getRegex();
	if( regex != null && !regex.test(str))
	{
		var msg =this.errorPrompt;
		if(this.regexType!="")
			var msg = isAvailable( this.errorPrompt )? ef_validator_errormsg[this.regexType]:"";
		
		//throw new Error( error_message + "\n" + efutils.trimString( msg ) );
		err_msg_list += efutils.trimString( msg )+"\n";
		
	}
	
	if(this.regexs!=null)
	{
		for(var i=0;i<this.regexs.length;i++)
		{
			if( this.regexs[i] != null && ! eval(this.regexs[i]).test(str))
			{
				var msgs = (this.errorPrompts!=null && this.errorPrompts.length>i)? this.errorPrompts[i]:""; 
				err_msg_list += efutils.trimString( msgs )+"\n"
			}
		}
		if(err_msg_list.length>0) err_msg_list = "\n"+err_msg_list;
	}
	else
	{
		if(err_msg_list.length>0) err_msg_list = "\n"+ error_message +"\n"+err_msg_list;
	}
	
	if(err_msg_list.length>0) throw new Error(efutils.trimString( err_msg_list ) );
}


/**
 * 创建验证对象.
 * @private
 * @param {Object} customed	: 特殊设定;
 * @param {Object} eicol	: 元信息;
 *
 * @return {efvalidator} 新的验证对象.
 */
efvalidator.build = function( customed, eicol )
{
	var validator = new efvalidator();
	validator.setRegexType( $(customed).attr("validateType")!=null?
		$(customed).attr("validateType") : eicol.validateType );
	validator.setRegex( $(customed).attr("regex")!=null?
		$(customed).attr("regex"):eicol.regex );
	validator.setNullable( $(customed).attr("nullable")!=null?
		$(customed).attr("nullable"): eicol.nullable );
	validator.setMaxLength( $(customed).attr("maxLength")!=null?
		$(customed).attr("maxLength"): eicol.maxLength );
	validator.setMinLength( $(customed).attr("minLength")!=null?
		$(customed).attr("minLength"): eicol.minLength );
	validator.setErrorPrompt( $(customed).attr("errorPrompt")!=null?
		$(customed).attr("errorPrompt"):eicol.errorPrompt );
	return validator;
}

/**
 * 添加系统缺省验证类型. 
 *
 * @param {String} name		: 验证类型名称;
 * @param {Object} reg		: 验证类型正则表达式;
 * @param {String} errormsg : 验证的提示信息;
 *
 * @return void.
 */
efvalidator.addSystemRegex = function( name, reg, errormsg )
{
	ef_validator_regexes[name] = reg;
	ef_validator_errormsg[name] = errormsg;
}

/**
 * 初始化添加系统缺省验证类型.
 * 
 * @return void.
 */
efvalidator.init = function()
{
    efvalidator.addSystemRegex("email", /^([_a-z0-9]|[\.]|[\-])+@(([_a-z0-9]|[\-])+\.)+[a-z0-9]+$/i, getI18nMessages("ef.ValidateEmail", "非法电子邮件地址"));
    efvalidator.addSystemRegex("mobile_phone", /^1[358](\d{9})$/, getI18nMessages("ef.ValidateMobilePhone", "非法手机号码"));
    efvalidator.addSystemRegex("postcode", /^(\d{6})$/, getI18nMessages("ef.ValidatePost", "非法邮政编码"));
    efvalidator.addSystemRegex("phone_with_area_code", /^[0-9]{3,4}-[0-9]{3,11}(-[0-9]{0,}){0,1}$/, getI18nMessages("ef.ValidatePhone", "非法电话号码"));
    efvalidator.addSystemRegex("phone_without_area_code", /^[1-9]{1}[0-9]{2,10}$/, getI18nMessages("ef.ValidatePhone", "非法电话号码"));
    efvalidator.addSystemRegex("integer", /^[-]{0,1}[1-9]+[0-9]{0,}$|^[0]{1,1}$/, getI18nMessages("ef.ValidateInt", "必须输入整数"));
    efvalidator.addSystemRegex("positive_integer", /^[1-9]+[0-9]{0,}$/, getI18nMessages("ef.ValidatePositiveInt", "必须输入正整数"));
    efvalidator.addSystemRegex("nonnegative_integer", /^[1-9]+[0-9]{0,}$|^[0]{1,1}$/, getI18nMessages("ef.ValidateNonnegtiveInt", "必须输入非负整数"));
    efvalidator.addSystemRegex("negative_integer", /^-[1-9]+[0-9]{0,}$/, getI18nMessages("ef.ValidateNegtiveInt", "必须输入负整数"));
    efvalidator.addSystemRegex("http_url", /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i, getI18nMessages("ef.ValidateHttp", "非法http地址"));
    efvalidator.addSystemRegex("number", /^[-]{0,1}[1-9]+[0-9]{0,}$|^[-]{0,1}[1-9]+[0-9]{0,}[\.][0-9]+$|^[-]{0,1}[0]{0,1}[\.][0-9]+$|^[0]{1,1}$/, getI18nMessages("ef.ValidateNumber", "必须输入数字"));
    efvalidator.addSystemRegex("nonnegative_number", /^[1-9]+[0-9]{0,}$|^[1-9]+[0-9]{0,}[\.][0-9]+$|^[0]{0,1}[\.][0-9]+$|^[0]{1,1}$/, getI18nMessages("ef.ValidateNonnegtiveNumber", "必须输入非负数字"));
    efvalidator.addSystemRegex("positive_number", /^[1-9]+[0-9]{0,}$|^[1-9]+[0-9]{0,}[\.][0-9]+$|^[0]{0,1}[\.][0-9]+$/, getI18nMessages("ef.ValidatePositiveNumber", "必须输入正数字"));
    efvalidator.addSystemRegex("decimal", /^[-]{0,1}[0]{0,1}[\.][0-9]+$/, getI18nMessages("ef.ValidateDecimal", "必须输入小数"));
    efvalidator.addSystemRegex("label", /^[a-z]{1}([a-z0-9]|[_])+$/i, getI18nMessages("ef.ValidateTag", "非法的标签名"));
    efvalidator.addSystemRegex("string", /^([a-z0-9]|[_])+$/i, getI18nMessages("ef.ValidateEnglishString", "非法的英文字符串"));
    efvalidator.addSystemRegex("chinese_string", /^([a-z0-9]|[_]|[\u4E00-\u9FA5])+$/i, getI18nMessages("ef.ValidateChineseString", "非法的中文字符串"));
    efvalidator.addSystemRegex("not_chinese_string", /^[^\u4E00-\u9FA5]*$/i, getI18nMessages("ef.ValidateNonChineseString", "包含非法的中文字符串"));
    efvalidator.addSystemRegex("ip_address", /^([0-9]|[1-9][0-9]|[1][0-9]{2}|[2][0-4][0-9]|25[0-5])([\.]([0-9]|[1-9][0-9]|[1][0-9]{2}|[2][0-4][0-9]|25[0-5])){3}$/, getI18nMessages("ef.ValidateIP", "非法的IP地址"));
    efvalidator.addSystemRegex("text", /^([\w]|[\W])*$/i, getI18nMessages("ef.ValidateString", "非法的字符串"));
    efvalidator.addSystemRegex("mac", /^[0-9a-f]{2}([:][0-9a-f]{2}){5}$|^[0-9a-f]{2}([\-][0-9a-f]{2}){5}$/i, getI18nMessages("ef.ValidateMac", "非法的MAC地址"));	
}

/**
 * 验证一个DOM结点下所有输入域的合法性.
 * @member efvalidator
 * @param {Object} node		: 需验证的DOM结点;
 *
 * @return {boolean} 若结点下所有输入域都校验合法，返回true;否则返回false.
 */
function efvalidateForm( node, needAlert )
{
	if(node == null)
	{ 
		alert(getI18nMessages("ef.AssignNode", "需指定一个节点"));
		return false;
	}
	var len = node.elements.length;
	var mark = true;
	for(var j = 0; j<len; j++ )
	{
		if(!efvalidateObj(node.elements[j], needAlert))
			mark =  false;
	}
	
	if(mark==false) alert(getI18nMessages("ef.Invalid", "校验出错，请检查输入框内的值！"));
	return mark;
}

/**
 * 验证一个DOM结点下所有输入域的合法性.
 * @member efvalidator
 * @param {Object} node		: 需验证的DOM结点;
 *
 * @return {boolean} 若结点下所有输入域都校验合法，返回true;否则返回false.
 */
function efvalidateObj(node, needAlert,notNeedFocus)
{
	if(node == null)
	{ 
		alert(getI18nMessages("ef.AssignNode", "需指定一个节点"));
		return false;
	}
	var currentObj = node;
	if(currentObj.type=="textarea" || currentObj.type=="text" ||currentObj.type=="select-one")
	{
		var validate = new efvalidator();
		validate.setRegexType( $(currentObj).attr("validateType")!=null?
			$(currentObj).attr("validateType") : "" );
		validate.setRegex( $(currentObj).attr("regex")!=null?
			$(currentObj).attr("regex"):null );
		validate.setNullable( $(currentObj).attr("nullable")!=null?
			$(currentObj).attr("nullable"): true );
		validate.setMaxLength( $(currentObj).attr("maxLength")!=null?
			$(currentObj).attr("maxLength"): Number.MAX_VALUE );
		validate.setMinLength( $(currentObj).attr("minLength")!=null?
			$(currentObj).attr("minLength"): 0 );
		validate.setErrorPrompt( $(currentObj).attr("errorPrompt")!=null?
			$(currentObj).attr("errorPrompt"):"" );	
			
		//增加对多个regex的支持	
		if($(currentObj).attr("regex0")!=null)
		{
			var regexs = [];
			for(var i=0;true;i++)
			{
				if($(currentObj).attr("regex"+i)!=null)
					regexs[i]=$(currentObj).attr("regex"+i);
				else
					break;
			}
			validate.regexs = regexs;
		}
		if($(currentObj).attr("errorPrompt0")!=null)
		{
			var errorPrompts = [];
			for(var i=0;true;i++)
			{
				if($(currentObj).attr("errorPrompt"+i)!=null)
					errorPrompts[i]=$(currentObj).attr("errorPrompt"+i);
				else
					break;
			}
			validate.errorPrompts = errorPrompts;
		}
			
		try
		{		

			if(currentObj.style.display == "none" || currentObj.style.visibility =="hidden")
		   		return true;
		   	else 
		   		validate.validate(currentObj.value);
		} 
		catch(ex)
		{
			efform.setErrorStyle (node,getI18nMessages("ef.InvalidReason", "校验出错，原因为")+"[" + ex.message + "]",false);
			
		    if(!needAlert == false)
		      alert(getI18nMessages("ef.InvalidReason", "校验出错，原因为")+"[" + ex.message + "]");
		    if(!!notNeedFocus == false)  {
			    	currentObj.focus();
		    		if(currentObj.type=="textarea" || currentObj.type=="text")
			    		currentObj.select();
		    	}
		    return false;
		}
		efform.setErrorStyle (node,"",true);
	}
	return true ;
}	

/**
 * 验证一个DIV层下所有输入域的合法性.
 * @member efvalidator
 * @param {String} div_id	: 需验证的DIV层id;
 *
 * @return {boolean} 若结点下所有输入域都校验合法，返回true;否则返回false.
 */
function efvalidateDiv(div_id, needAlert,notNeedFocus)
{
	var flage = true;
	
	try
	{
		var div_node = document.getElementById(div_id);
		flage = efvalidateInputField(div_node, needAlert,notNeedFocus);
	} 
	catch(exception)
	{
		alert(exception.message);
		return false;
	}
	if(flage==false) alert(getI18nMessages("ef.Invalid", "校验出错，请检查输入框内的值！"));
	return flage;
}

/**
 * 校验单个输入框的合法性，输入框可以是input,textarea,select
 * @member efvalidator
 * @param {Object} node	：输入框的DOM节点
 * @return void
 */
function efvalidateInputField(node, needAlert,notNeedFocus)
{
	var flage = true;
	if((node.tagName == "INPUT" && node.type !="button") || node.tagName=="TEXTAREA" || node.type=="select-one")
	{
		flage = efvalidateObj(node, needAlert,notNeedFocus);
	} 
	else
	{
		for(var i = 0;i<node.childNodes.length;i++)
		{
			try
			{
				flage = efvalidateInputField(node.childNodes[i], needAlert,notNeedFocus) && flage ;
			}
			catch(exception)
			{				
			}
		}
	}
	
	return flage;
}

/**
 * 验证一个DOM结点下，所有属于指定组的输入域的合法性.
 * @member efvalidator
 * @param {Object} node		: 需验证的DOM结点;
 * @param {String} validateGroupName	: 验证分组名，node不属于当前验证组时，不参加本次验证;
 *
 * @return {boolean} 若结点下输入域都校验合法，返回true;否则返回false.
 */
function efvalidateFormInGroup( node, validateGroupName , needAlert )
{
	if(node == null)
	{ 
		alert(getI18nMessages("ef.AssignNode", "需指定一个节点"));
		return false;
	}
	var len = node.elements.length;
	for(var j = 0; j<len; j++ )
	{
		if(!efvalidateObjInGroup(node.elements[j], validateGroupName , needAlert))
		{
			return false;
		}
	}
	return true;
}

/**
 * 验证属于指定组的输入域的合法性.
 * @member efvalidator
 * @param {Object} node					: 需验证的DOM结点;
 * @param {String} validateGroupName	: 验证分组名，node不属于当前验证组时，不参加本次验证,返回ture;
 *
 * @return {boolean} 若结点下所有输入域都校验合法，返回true;否则返回false.
 */
function efvalidateObjInGroup(node, validateGroupName , needAlert,notNeedFocus)
{
	if(node==null || node.validateGroupName== null ||
		node.validateGroupName == undefined || node.validateGroupName== "" ||
		node.validateGroupName != validateGroupName ) return true;
	
	return efvalidateObj(node,  needAlert,notNeedFocus);
}

/**
 * 验证一个DIV层下所有属于指定组输入域的合法性.
 * @member efvalidator
 * @param {String} div_id	: 需验证的DIV层id;
 * @param {String} validateGroupName	: 验证分组名，node不属于当前验证组时，不参加本次验证;
 *
 * @return {boolean} 若结点下所有输入域都校验合法，返回true;否则返回false.
 */
function efvalidateDivInGroup(div_id, validateGroupName, needAlert,notNeedFocus)
{
	var flage = true;
	
	try
	{
		var div_node = document.getElementById(div_id);
		flage = efvalidateInputFieldInGroup(div_node, validateGroupName, needAlert,notNeedFocus);
	} 
	catch(exception)
	{
		alert(exception.message);
		return false;
	}

	return flage;
}

/**
 * 校验单个属于指定组的输入框的合法性，输入框可以是input,textarea,select
 * @member efvalidator
 * @param {Object} node	：输入框的DOM节点
 * @param {String} validateGroupName	: 验证分组名，node不属于当前验证组时，不参加本次验证;
 * @return void
 */
function efvalidateInputFieldInGroup(node, validateGroupName, needAlert,notNeedFocus)
{
	var flage = true;
	if((node.tagName == "INPUT" && node.type !="button") || node.tagName=="TEXTAREA" || node.type=="select-one")
	{
		flage = efvalidateObjInGroup(node, validateGroupName, needAlert,notNeedFocus);
		if(flage == false)
			return false;		
	} 
	else
	{
		for(var i = 0;i<node.childNodes.length;i++)
		{
			try
			{
				flage = efvalidateInputFieldInGroup(node.childNodes[i], validateGroupName, needAlert,notNeedFocus);
				if(flage == false)
					return false;
			}
			catch(exception)
			{				
			}
		}
	}
	return flage;
}

