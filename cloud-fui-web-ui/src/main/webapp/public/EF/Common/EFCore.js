/*
 * EF常量定义. 
 */
/** JS版本号. */
var ef_version = "2.0.10";

/** Netscape浏览器标志. */
var isNS = (typeof document.implementation != 'undefined') && (typeof document.implementation.createDocument != 'undefined');   
/** IE浏览器标志. */                          
var isIE = (typeof window.ActiveXObject != 'undefined');
/** JS对象ID分隔标志. */
var EF_SPLIT = "__";
/** 组织数据提交时各ID的分隔符. */
var EF_FORMDATA_SPLIT = "-";
/** 回车的标识符. */
var EF_CR_IDENTIFIER = "??";
/** 回车的HTML标识符. */
var EF_CR_HTML_IDENTIFIER = "&para;&para;";
/** 图片存放目录. */
var EF_IMAGES_PATH = "/public/EF/Images/";





/**
 * 	存放验证类型对应正则表达式的Map对象;
 *  Key 为验证类型;
 *  Value 为验证类型对应正则表达式;
 */
var ef_validator_regexes = new Object();

/**
 * 	存放验证类型对应提示信息的Map对象;
 *  Key 为验证类型;
 *  Value 为验证类型对应提示信息;
 */
var ef_validator_errormsg = new Object();

/**
 * 字符串常量.
 */
var EF_MSG = {
	ROW					: "ef.Row" ,
	COL					: "ef.Col" ,
	FIX_COLUMN			: "ef.FixColumn" ,
	DATA_COLUMN			: "ef.DataColumn" ,
	SUBMIT_CONFIRM		: "ef.SubmitConfirm" ,
	FROM				: "ef.From" ,
	TO					: "ef.To" ,
	TOGETHER			: "ef.Together" 
};

/**
 * 错误信息常量.
 */
var EF_ERROR_MSG = {
	VALIDATE_ERROR		: "ef.DataCheckError",
	GRID_DIV_NOT_FOUND	: "ef.GridDivNotFound" ,
	CELL_NOT_EDITABLE	: "ef.UnitNotEdited"
};

/**
 * 维护窗口列表.
 */
var winMap = new Object();

/**
 * 子窗口数目.
 */
var winCount = 0;

/**
 * JS异常类.
 * @author wuyicang 
 * @constructor
 * @param {Number} c	: 异常代码;
 * @param {String} m	: 异常消息;
 */
efError = function( c, m ) {
	Error( m );
	this.errorCode = c;
	this.errorMsg = m;
}

/**
 * @extends Error
 */
efError.prototype = new Error;

/**
 * 获取异常代码.
 * 
 * @return {Number} 异常代码.
 */
efError.prototype.getCode = function() {
	return this.errorCode;
}

/**
 * 获取异常消息.
 * 
 * @return {String} 异常消息.
 */
efError.prototype.getMessage = function() {
	return this.errorMsg;
}

//document.write('<link href="./EF/EF.css" rel="stylesheet" type="text/css"/>');
//document.write('<link href="./EF/Images/tab.css" rel="stylesheet" type="text/css"/>');

//=============================================================================
/**
 * 为IE添加数组的indexOf函数.
 */
if (![].indexOf) {
	Array.prototype.indexOf = function(obj) {
		for (var i = this.length; i-- && this[i] !== obj; );
		return i;
	}
}

if (!"".trim) {
	String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	}	
}
