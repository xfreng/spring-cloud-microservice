/**
 * @constructor 树绑定的数据结构Model,非实体类，作为接口使用
 * 有具体实现如下：
 * eiTreeModel
 * tagTreeModel
 * xmlTreeModel
 * absTreeModel
 */
function treeModel() {  
  this.listerners = [];
}
/**
 * treeModel定义的接口,获取顶层所有节点
 */
treeModel.prototype.getTopNodes = function(){
};

/**
 * treeModel定义的接口,获取子节点
 * @param {String} p 节点的label
 */
treeModel.prototype.getChildren = function(p){
};

/**
 * treeModel定义的接口,获取父节点
 * @param {String} p 节点的label
 */
treeModel.prototype.getParent = function(p){
	alert('getParent NOT implemented');
};

/**
 * 添加事件
 * @param {} l
 */
treeModel.prototype.addListener = function(l){
  this.listerners.push(l);
};
/**
 * 触发事件
 * @param {} e
 * @param {} param
 */
treeModel.prototype.notify = function(e, param){
  for( var i in this.listerners ){
	  var l = this.listerners[i];
	  l.accept(e, param);
  }
};

/**
 * 构造Tree时所需要的数据  EiInfo返回数据
 * @constructor
 * @param {String} s: 调用后台Service的名称
 * @param {String} n: 展开指定节点下的树，例如展开"ES"(系统授权下得树节点)
 * @return void
 */
function eiTreeModel(s,n) {
	this.queryBlockName = "inqu_status";
    this.resultBlockName = "result";
    this.methodQuery = "query";    

    this.keyOffset = "offset";
	this.keyCount = "limit";
	
	this.base = treeModel;
	this.base();
	this.service = s;  
	this.nodeLabel =  n;
	
	//缓冲的树节点数据
	this._cache = {};
	this._status = 0;
	
};

//eiTreeModel  implements treeModel
eiTreeModel.prototype = new treeModel();

/**
 * 获取eiTreeModel第一层子节点数据
 * @param {EFTreeTemplate} tree 树对象
 * @return {Array} block的rows数组或者空数组
 */
eiTreeModel.prototype.getTopNodes = function(tree){
  return this.getChildren("$",tree);
};

/**
 * treeModel构建模型是否成功的状态。
 * @return {Number} 整数。0:成功 -1:失败
 */
eiTreeModel.prototype.status = function (v) {
    if (v === undefined) { return this._status; }
    this._status = v;
}


/**
 * eiTreeModel 根据标签label,从后台获取节点的子节点数据
 * @param {String} p 节点的标签label
 * @param {EFTreeTemplate} tree 树对象
 * @return {Array} block的rows数组或者空数组
 */
eiTreeModel.prototype.getChildren = function(p,tree){
	//先查看是否有缓存
	var cached = this._cache[p];
	var treeModel = this;
    if ( isAvailable( cached ) ){ return cached;  }

    var host = this;
    var queryCallBack = { 
		 onSuccess: function(ei){		
    	     host.status(0);
			 var blocks = ei.getBlocks();
			 for( var name in blocks ){
			   var _block = blocks[name];
			   var rows = _block.getMappedRows();
			   //cache缓存为  {'blockName':[rows]...}  block名:block的rows(rows是数组)
			   host._cache[name] = rows;
			 }
		 },
         onFail: function(xmlR, status, e){  
			 host.status(-1);
			 if (status != -2)
				 alert("ERROR"); 
			 } //异常处理待改进
    }; 
    
    var queryMeta = new EiBlockMeta(this.queryBlockName);
	var column = new EiColumn("node");   
    column.pos = 0;
    queryMeta.addMeta(column);
	
    //固定的将label传至后台   columnName为 'node'
	var queryBlock = new EiBlock(queryMeta);
	queryBlock.addRow([p+""]);

	var blocka = new EiBlock(this.resultBlockName);
    var eiinfo = new EiInfo();
    if(tree && tree.param!=null)
    {
    	//树上的扩展参数
    	eiinfo.extAttr.param = tree.param;
    }
    
    eiinfo.addBlock(queryBlock);
    eiinfo.addBlock(blocka);
    
    //同步调用  methodQuery默认调用后台Service的query
    EiCommunicator.send(this.service, this.methodQuery, eiinfo, queryCallBack, false, null, true);	
	
    //数据返回后(回调处理),更新缓存
    var ret = this._cache[p];
	if ( isAvailable(ret) ){
	  delete this._cache[p];
	  return ret;
	} else {
	  return new Array();
	}
};

/**
 * eiTreeModel 根据标签label,从后台获取节点的父节点数据
 * @param {String} p 节点的标签 label
 * @return {Object} 返回节点的父节点数据(JSON)或者null
 */
eiTreeModel.prototype.getParent = function(p){
    var ret = null;
    var host = this;
    var queryCallBack = { 
		 onSuccess: function(ei){			
    	     host.status(0);
			 var block = ei.getBlock(p);
			 if ( block != null ){
			   var rows = block.getMappedRows();			    
			   ret = rows[0];
			 }
		 },
         onFail: function(msg){  
			 host.status(-1);
			 if (status != -2)
				 alert("ERROR"); 
			 } 
    }; 
	
    var queryMeta = new EiBlockMeta(this.queryBlockName);
	var column = new EiColumn("node");   
    column.pos = 0;
    queryMeta.addMeta(column);
	
	var queryBlock = new EiBlock(queryMeta);
	queryBlock.addRow([p+""]);

	var blocka = new EiBlock(this.resultBlockName);
    var eiinfo = new EiInfo();
    eiinfo.addBlock(queryBlock);
    eiinfo.addBlock(blocka);
    
    //同步调用 后台Service需要实现queryParent
    EiCommunicator.send(this.service, "queryParent", eiinfo, queryCallBack, false, null, true);	
	return ret;	
};


/**
 * @constructor
 * @param {String} loc 提交的业务URL
 */
function tagTreeModel(loc) {
	this.resultBlockName = "result";
	this.base = treeModel;
	this.base();
	this._loc = loc; //URL	
	this.idK = "label";
	this.parentK = "parent";
	this._parentC = {}; //父节点数据缓存
	this._status = 0;
};

//tagTreeModel implements treeModel
tagTreeModel.prototype = new treeModel();

/**
 * treeModel构建模型是否成功的状态。
 * @return {Number} 整数。0:成功 -1:失败
 */
tagTreeModel.prototype.status = function (v) {
    if (v === undefined) { return this._status; }
    this._status = v;
}

/**
 * 获取tagTreeModel第一层子节点数据
 * @return {Array} block的rows数组或者空数组
 */
tagTreeModel.prototype.getTopNodes = function(){
  return this.getChildren("$");
};

/**
 * tagTreeModel 根据标签label,从后台获取节点的子节点数据
 * @param {String} p 节点的标签label
 * @return {Array} block的rows数组或者空数组
 */
tagTreeModel.prototype.getChildren = function(p){
    var ret = new Array();
	var host = this;
    var queryCallBack = {
		 onSuccess: function(ei){		
    	     host.status(0);
			 var _block = ei.getBlock(p);
			 if( _block != null ){			   
			   ret = _block.getMappedRows();
			 }			 
		 },
         onFail: function(msg){ 
			 host.status(-1);
			 if (status != -2)
				 alert("ERROR"); 
		 }
    }; 
    //URL传参
    EiCommunicator.$send(this._loc + "&PARTNUMBER=" + p, "", queryCallBack  );	
    return ret;
};

/**
 * tagTreeModel 根据标签label,从后台获取节点的父节点数据
 * @param {String} p 节点的标签 label
 * @return {Object} 返回节点的父节点数据(JSON)或者null
 */
tagTreeModel.prototype.getParent = function(p){
    var host = this;
    var cached = this._parentC[p];
    if ( isAvailable( cached ) ){ return cached;  }    
	
    var queryCallBack = { 
		 onSuccess: function(ei){
    	     host.status(0);
		     var blocks = ei.getBlocks();
			 for( var _n in blocks ){
			   var _block = blocks[_n];
			   var rows = _block.getMappedRows();
			   if ( isAvailable( rows[0] ) ){
			     host._parentC[_n] = rows[0];
			   }
			 }			 
		 },
         onFail: function(msg){
			 host.status(-1);
			 if (status != -2)
				 alert("ERROR"); 
		 }
    }; 
    //URL传参
    EiCommunicator.$send( this._loc + "&PARENT=true&PARTNUMBER=" + p, "", queryCallBack  );	
    return this._parentC[p];
};



/**
 * 根据XML 解析成树
 * @constructor
 * @param {String} s 构造树的XML串
 */
function xmlTreeModel(s) {
	this.base = treeModel;
	this.base();
    this.nodes = {};
	this.parseXML(s);
	this._status = 0;
};
xmlTreeModel.prototype = new treeModel();

/**
 * treeModel构建模型是否成功的状态。
 * @return {Number} 整数。0:成功 -1:失败
 */
xmlTreeModel.prototype.status = function (v) {
    if (v === undefined) { return this._status; }
    this._status = v;
}


/**
 * 获取xmlTreeModel的第一层节点
 * @return {Array} 返回第一层节点数据
 */
xmlTreeModel.prototype.getTopNodes = function(){
  return this.getChildren("");
};

/**
 * xmlTreeModel 根据节点的标签label,获取子节点的数据
 * @param {String} p 节点的标签 label
 * @return {Array} 节点的子节点数据数组
 */
xmlTreeModel.prototype.getChildren = function(p){
  //查找构造时的缓存	
  var cached = this.nodes[p];
  if ( isAvailable( cached ) ){ return cached;  }
  var em = new Array();
  return em;
};

/**
 * 解析树时 构造缓存结构
 * @param {String} p 节点的label
 * @param {Object} node  节点的数据(JSON)
 */
xmlTreeModel.prototype.addChild = function(p, node){
  var children = this.getChildren( p );
  children.push(node);
  this.nodes[p] = children;
};

/**
 * 使用内置的XML解析,得到DOM节点
 * @param {String} sSrc 构造树的xml串
 */
xmlTreeModel.prototype.parseXML = function(sSrc){
  var oXmlDoc = null;
  if (window.ActiveXObject) {
    oXmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    oXmlDoc.async="true";
    oXmlDoc.loadXML(sSrc);
  } else {
    var parser=new DOMParser();
    oXmlDoc=parser.parseFromString(sSrc,"text/xml");
  }
 
  var root = oXmlDoc.documentElement;
  this._parseXMLNode( "",root );
};

/**
 * 递归函数 解析DOM 回溯构造xmlTreeModel结构 {nodes}
 * @param {String} p
 * @param {DOM} oNode 解析后的DOM节点
 */
xmlTreeModel.prototype._parseXMLNode = function(p, oNode){
  var cs = oNode.childNodes;
  var len = cs.length;
  for (var i = 0; i < len; i++) {
    var oNode = cs[i];
	if ( oNode.tagName == "tree" ) {      
      var tNode = {};
      for( var k=0; k<oNode.attributes.length; k++ ) {
        var l = oNode.attributes[k].nodeName;
	    var v = oNode.attributes[k].nodeValue;
	    tNode[l] = v;
      }
      this.addChild(p, tNode);
      this._parseXMLNode( tNode["label"], oNode );
	}
  }
};



/**
 * 抽象树结构
 * @constructor
 */
function absTreeModel() {
	this.base = treeModel;
	this.base();
    this.childs = {}; //子节点数据结构 JSON  节点label 对应节点的数据数组
	this.nodes = {};  //节点的数据结构JSON  节点label 对应数据
};

absTreeModel.prototype = new treeModel();

/**
 * absTreeModel获取第一层节点数据
 * @return  {Array}第一层节点数据数组
 */
absTreeModel.prototype.getTopNodes = function(){
  return this.getChildren("");
};

/**
 * absTreeModel根据节点的label获取子节点数据
 * @param {String} p 节点的label
 * @return {Array} 节点的子节点数据数组
 */
absTreeModel.prototype.getChildren = function(p){
  var cached = this.childs[p];
  if ( isAvailable( cached ) ){ return cached;  }
  var em = new Array();
  return em;
};

/**
 * absTreeModel 根据节点的label获取父节点的数据
 * @param {String} m 节点的标签
 * @return {Object} 节点的父节点数据
 */
absTreeModel.prototype.getParent = function(m){
  var nd = this.nodes[m];
  if ( nd != null ){
	  var p = this.nodes[nd.parent];
	  return p;
  }
  return null;
};

/**
 * absTreeModel 添加节点数据
 * @param {String} p  节点的label
 * @param {Object} node 节点的数据JSON
 */ 
absTreeModel.prototype.addChild = function(p, node){
  var children = this.getChildren( p );
  children.push(node);
  this.childs[p] = children;
  this.nodes[node.label] = node;
};