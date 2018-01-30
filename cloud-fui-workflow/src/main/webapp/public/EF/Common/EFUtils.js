/**
 * 通用方法.
 * 
 * @author wuyicang
 */

/**
 * @class efutils对象 该对象包含公用的js函数
 * @constructor
 */
efutils = function() {}

/**
 * 根据键值获取Map对象中的值.
 * @param {Object} obj	: Map对象;
 * @param {String} key	: 键值;
 * @return {Object} 键对应的值.
 * 
efutils.getObject = function( obj, key ) {
	if( !obj ) return null;
	return obj[key];
}
 */

/**
 * 向Map对象中存放键值对.
 * @param {Object} obj	: Map对象;
 * @param {String} key	: 键值;
 * @param {Object} v	: 对象值;
 * @return void.
 * 
efutils.putObject = function( obj, key, v ) {
	if( !obj ) throw new Error( "Object map is null");
	obj[key] = v; 
}
 */

/**
 * 根据名称获取系统内置校验类型正则表达式.
 * @private
 * @param {String} name	: 验证类型名称;
 * @return {Object} 校验类型正则表达式.
 */
efutils.getValidateRegex = function( name ) {
	return ef_validator_regexes[name];
}

/**
 * 获取字符串的字节长度.
 * @param {String} str	: 目标字符串;
 * @return {Number} :返回字符串的byte长度，其中一个中文或其他双字节字符长度为2。
 * 参数为空对象或空字符串时返回0。
 * @exception 无异常抛出
 */
efutils.getTotalBytes = function( str ) {
	if( str == null || str ==  "" ) return 0;
	var totalCount = 0;
	for (i = 0; i< str.length; i++) {
		if (str.charCodeAt(i) > 127) 
			totalCount += 2;
		else
			totalCount++ ;
	}
	
	return totalCount;
}

/**
 * 截取字符串首尾的空格.
 * @param {String} str	: 目标字符串;
 * @return {String} 截取首尾空格后的字符串，参数为空返回空字符串"".
 * @exception 无异常抛出
 */
efutils.trimString = function( str ) {
		

	if(str instanceof Array || str instanceof Object){
		return JSON2String(str);
	}
	
	return (str == null) ? "" : str.trim();	//str.replace(/(^\s*)|(\s*$)/g, "");
	
}

/**
 * 替换字符串中的HTML特殊字符.
 * @private
 * @param {String} str	: 目标字符串;
 * @return {String} 截取首尾空格后的字符串，参数为空返回空字符串"".
 */
efutils.formatHtmlCharacter = function( str ) {
	str = efutils.trimString( str );
	str = str.replace( /\#/g, "&#35;");
    str = str.replace( /\&/g, "&#38;");
    str = str.replace( /\</g, "&#60;");
   	str = str.replace( /\>/g, "&#62;");
    str = str.replace( /\?/g, "&#63;");
    
    return str;	
}

/**
 * 替换字符串中的两个子串.
 * @param {String} str		: 目标字符串;
 * @param {Object} regx1	: 子串1的正则表达式;
 * @param {String} value1	: 所要替换的子串1;
 * @param {Object} regx2	: 子串2的正则表达式;
 * @param {String} value2	: 所要替换的子串2;
 * @return {String} 替换后的字符串.
 */
efutils.replaceString = function( str, regx1, value1, regx2, value2 ) {
	var temp = str.split( regx1 );
	for( var i=0; i< temp.length; i++ )
		temp[i] = temp[i].replace( regx2, value2 );

	return temp.join( value1 );
}

/**
 * 判断Map对象是否为空.
 * @param {Object} m	: JS Map对象;
 * @return {boolean} true表示Map中无任何值,false表示非空.
 */
efutils.isEmpty = function( m ) {
	for (var key in m)
		return false;
		
	return true;
}	

/**
 * 根据名称获得图片的实际URL.
 * @private
 * @param {String} name	: 图片名称;
 * 
 * @return {String} 图片的实际URL.
 */
efutils.getImageUrl = function( name ) {
	return EF_IMAGES_PATH + name;
	//return efico.get(name);
}

/**
 * 复制数组.
 * 
 * @param {Array} a	: 需要复制的数组;
 * 
 * @return {Array} 复制完成的数组.
 */
efutils.copyArray = function( a ) {
	var copy = [];
	for( var i=0; i<a.length; i++ )
		copy.push( a[i] );

	return copy;
}
/**
 * @private
 * @param {String} str_value	：	欲替换的字符串
 * @param {String} replace_str	：	回车换行代替的字符串，默认为EF_CR_IDENTIFIER
 * @return {String} str_value	:	返回替换后的值
 */
efutils.replaceCR = function( str_value, replace_str ) {
	if( !isAvailable(replace_str) ) 
		replace_str = EF_CR_IDENTIFIER;

	str_value = efutils.trimString( str_value );
	var	index=str_value.indexOf( "\r\n" );   
  	while(index != -1) {	   
  		str_value = str_value.substring(0, index) + replace_str + str_value.substring(index + 2);   
  		index=str_value.indexOf( "\r\n" );   
  	} 
	
	return str_value;
}

 
 /**
  * 获取Grid中的指定列的最大值
  * @param (String) gridID		:	grid的id
  * @param (String) columnName	: 	获取最大值的列名
  * @return (String)			:	该列最大值
  */
efutils.maxInGrid = function(gridID, columnName){
 	
 	var grid = efgrid.getGridObject(gridID);
 	var length = grid.blockData.rows.length;
 	var t = grid.blockData.getBlockMeta().getMeta(columnName).type;
 	
 	var max = grid.blockData.getCell(0,columnName);
 	var current;
 	
 	for(var i=1; i<length; i++){
 		current = grid.blockData.getCell(i,columnName);
 		if(efutils.compareContent(current, max, t) > 0){
 			max = current;
 		}
 	}
 	
 	return max;
}


/**
 * 获取Grid中的指定列的最小值
 * @param (String) gridID		:	grid的id
 * @param (String) columnName	: 	获取最小值的列名
 * @return (String)				:	该列最小值
 */
efutils.minInGrid = function(gridID, columnName){
	
	var grid = efgrid.getGridObject(gridID);
	var length = grid.blockData.rows.length;
	var t = grid.blockData.getBlockMeta().getMeta(columnName).type;
	
	var min = grid.blockData.getCell(0,columnName);
	var current;
	
	for(var i=1; i<length; i++){
		current = grid.blockData.getCell(i,columnName);
		if(efutils.compareContent(current, min, t) < 0){
			min = current;
		}
	}
	
	return min;
}

 
/**
 * 依据Grid中的指定列进行排序
 * @param (String) gridID		:	要排序grid的id
 * @param (String) columnName	: 	排序所依据的列
 * @param (String) isAsceding	:	是否升序
 * @return undefined			:	无返回值
 */
efutils.sortGird = function(gridID, columnName, isAsceding){

	var grid = efgrid.getGridObject(gridID);
	var length = grid.blockData.rows.length;
	isAsceding = (isAsceding.toLowerCase() === 'true');
	var t = grid.blockData.getBlockMeta().getMeta(columnName).type;
	
	efutils.quicksort(grid,columnName,t,0,length-1,isAsceding);

	grid.refresh();
}

/**
 * @private
 * @param (Object) grid			:	要排序的grid
 * @param (String) columnName	:	排序所依据的列
 * @param (String) columnType	:	所依据列的类型，有'N'（数字）和'C'（字符串）两种
 * @param (Number) start		:	排序的起始行
 * @param (Number) end			:	排序的结束行
 * @param (Boolean) isAsceding	:	是否升序
 * @return undefined			: 	无返回值
 */
efutils.quicksort = function(grid,columnName,columnType,start,end,isAsceding){
    if(start<end){  
        var pos=efutils.partition(grid,columnName,columnType,start,end,isAsceding);  
        efutils.quicksort(grid,columnName,columnType,start,pos-1,isAsceding);  
        efutils.quicksort(grid,columnName,columnType,pos+1,end,isAsceding);  
    }  
}

/**
* @private
* @param (Object) grid			:	要排序的grid
* @param (String) columnName	:	排序所依据的列
* @param (String) columnType	:	所依据列的类型，有'N'（数字）和'C'（字符串）两种
* @param (Number) start			:	排序的起始行
* @param (Number) end			:	排序的结束行
* @param (Boolean) isAsceding	:	是否升序
* @return (Number)				: 	划分后的分割行行号
*/
efutils.partition = function(grid,columnName,columnType,start,end,isAsceding)  {  
	//take the first element as pivot
	var pivot=grid.blockData.getCell(start, columnName); 	

	var j = start;
	var iTemp;
	var compareTemp;
	for(var i = start+1; i <=end; i++){
		iTemp = grid.blockData.getCell(i,columnName);
		compareTemp = efutils.compareContent(iTemp, pivot, columnType);
		if(compareTemp<0&&isAsceding || compareTemp>0&&(!isAsceding))
			efutils.swapLine(grid,++j,i);
	}

	efutils.swapLine(grid,j,start);
	
	return j;  
}

/**
 * @private
 * @param (Object) grid		:	要交换行的grid对象
 * @param (Number) i		:	要交换的行	
 * @param (Number) j		:	要交换的行
 * @return undefined		: 	无返回值
 */
efutils.swapLine = function(grid,i,j){
	var temp = grid.blockData.rows[i];
		grid.blockData.rows[i] = grid.blockData.rows[j];
		grid.blockData.rows[j] = temp;
		
		var tempStatus = grid.rowStatus[i];
		grid.rowStatus[i] = grid.rowStatus[j];
		grid.rowStatus[j] = tempStatus;
}

/**
 * @private
 * @param (String) i	:	要比较的值
 * @param (String) j	:	要比较的值
 * @param (String) t	:	值的类型
 * @return (Number)		:	表示两个值的比较关系：负数代表i小于j，0代表两者相等，正数代表i大于j,undefined表示二者无法比较
 */
efutils.compareContent = function(i,j,t){
	if (typeof i == 'undefined' || typeof j == 'undefined')
		return undefined;
	if(t.toLowerCase() === 'c'){
		return i.localeCompare(j);
	}else if(t.toLowerCase() === 'n'){
		i = parseFloat(i);
		j = parseFloat(j);
		return i - j;
	} else{
		alert('Comparison not support this type: ' + t);
		return undefined;
	}
}


efutils.getCssStyle = function(rulsName) { 
	for (var i=document.styleSheets.length-1;i>=0;i--) { 
		var rules; 
		if (document.styleSheets[i].cssRules) { 
			rules = document.styleSheets[i].cssRules; 
		} else { 
 				rules = document.styleSheets[i].rules; 
		} 
		for (var j=0;j<rules.length;j++) { 
			if (rules[j].selectorText == rulsName) { 
				return rules[j].style; 
			} 
		} 
	} 
}

/**
 * // 对应用例ID：137492
 * 在页面上根据按钮数据自动渲染按钮
 * @param {} buttonData
 *  buttonData 格式为：[[按钮英文名，按钮中文名，按钮状态],[按钮英文名，按钮中文名，按钮状态]]
 */
efutils.showPageButton = function(buttonData){
	for(i=0;t=buttonData[i];i++){
		button_ename = t[0];
		button_cname = t[1];
		button_status = t[2];

		button_node = ef.get("button_"+button_ename);	
		

		if(!button_node)
			continue;
		//button_div = document.createElement("div");
		var _cname = button_node.getAttribute("cname");
		if(!!_cname && _cname!="")
			button_cname = _cname;
		

		
		button_node.setAttribute("buttonStatus",button_status);
		efbutton.newButton(button_node, button_ename, button_cname, null);
		
		//button_node.appendChild(button_div);
	}
	
}
