function JSON2String(obj){
	if (typeof obj == "number"){
		return isFinite(obj) ? String(obj) : "null";
	}
	if (typeof obj == "boolean"){
		return String(obj);
	}
	if (typeof obj == "date"){
		function f(n) {
            return n < 10 ? '0' + n : n;
        }
        return '"' + obj.getFullYear() + '-' +
                f(obj.getMonth() + 1) + '-' +
                f(obj.getDate()) + 'T' +
                f(obj.getHours()) + ':' +
                f(obj.getMinutes()) + ':' +
                f(obj.getSeconds()) + '"';
	}
	if (typeof obj == "array" || obj instanceof Array){
		var a = ['['],  // The array holding the text fragments.
            b,          // A boolean indicating that a comma is required.
            i,          // Loop counter.
            l = obj.length,
            v;          // The value to be stringified.

        function pa(s) {
            if (b) {
                a.push(',');
            }
            a.push(s);
            b = true;
        }
        for (i = 0; i < l; i += 1) {
            v = obj[i];
            switch (typeof v) {
            case 'undefined':
            case 'function':
            case 'unknown':
                break;
            case 'object':
            default:
                pa(JSON2String(v));
            }
        }
        a.push(']');
        return a.join('');
	}
	if (typeof obj == "string" || obj instanceof String){
		var m = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
		if (/["\\\x00-\x1f]/.test(obj)) {
	        return '"' + obj.replace(/([\x00-\x1f\\"])/g, function(a, b) {
	            var c = m[b];
	            if (c) {
	                return c;
	            }
	            c = b.charCodeAt();
	            return '\\u00' +
	                Math.floor(c / 16).toString(16) +
	                (c % 16).toString(16);
	        }) + '"';
	    }
	    return '"' + obj + '"';
	}
	if (typeof obj == "object"){
		var a = ['{'],  // The array holding the text fragments.
            b,          // A boolean indicating that a comma is required.
            k,          // The current key.
            v;          // The current value.

        function p(s) {
            if (b) {
                a.push(',');
            }
            a.push(JSON2String(k), ':', s);
            b = true;
        }
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                v = obj[k];
                switch (typeof v) {
                case 'undefined':
                case 'function':
                case 'unknown':
                    break;
                case 'object':
                default:
                    p(JSON2String(v));
                }
            }
        }
        a.push('}');
        return a.join('');
	}
}

function  IsInteger(strInteger)  {  
	var   newPar =/^(-|\+)?\d+$/;   
	return   newPar.test(strInteger);  
}

function GetServiceUrl(tar){
	return "/POR/" + tar;
}

//function AjaxJsonPost(target,service,method,json,callback){
//	var u = GetServiceUrl(target);
//	$.ajax({
//		type: "POST",
//		async: false,
//		url: u,
//		data: "service="+service+"&method="+method+"&param=" + json,
//		dataType: json,
//		success: function(msg){
//			callback.onSuccess(msg);
//		},
//		error: function(msg){
//			callback.onFail(msg);
//		}
//	});
//}

function GetJSONBlock(eiinfo,name){
	return eiinfo.getBlock(name);
}

function GetJSONData(eiinfo,name){
	return GetJSONBlock(eiinfo,name).getRows();
}

function GetJSONColDefine(eiinfo,name){
	var metas = eiinfo.getBlock(name).getBlockMeta().getMetas();
	columns = [];
	for (var key in metas ){
		var eiCol = metas[key];
		var col = {};
		col.key = key;
		col.name = eiCol.getName();
		col.descName = eiCol.getDescName();
		col.primaryKey = eiCol.isPrimaryKey();
		col.isNotNull = eiCol.isNotNull();
		col.maxLength = eiCol.getMaxLength();
		col.editor = eiCol.getEditor();
		col.regex = eiCol.getRegex();
		col.formatter = eiCol.getFormatter();
		col.type = eiCol.getType();
		col.multiService = eiCol.get("multiselectservice");
		col.multiCol = eiCol.get("multiselectcol");
		col.list = eiCol.get("list");
		col.helpMessage = eiCol.get("HELP");
		this.columns.push(col);
	}
	return columns;
	
//	return GetJSONBlock(eiinfo,name).blockMeta.metas;
//	var col = getJSONBlock(json,name).columns;
//	var colDef = col.columnList;
//	var pos = col.columnPos;
//	var defs = [];
//	for(var i=0;i<colDef.length;i++){
//		var def = {};
//		def = colDef[i]
//		for(var j=0;j<pos.length;j++){
//			var idx = pos[j][def.name];
//			if (idx){
//				defs[idx] = def;
//			}
//		}
//	}
//	return defs;
}

function GetJSONParam(eiinfo,name){
	return GetJSONBlock(eiinfo,name).attributes;
}