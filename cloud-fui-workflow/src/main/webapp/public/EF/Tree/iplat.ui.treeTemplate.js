/**
 * @constructor  EFTree的基类
 * @param {treeModel} sModel 构造树所需要的数据
 * @param {String} sLabel    树节点的Key
 * @param {String} sText     树节点的显示内容 Value
 * @return
 */
function EFTreeTemplate( sModel, sLabel, sText ) {
  this._model = sModel;
  this._label = sLabel;
  this._text = sText;
  this._depth = null;
}

/**
 * 设置或者获取树的深度
 * @param {Number} v 树的深度    (传参数时设置树的深度)
 * @return {Number} this._depth (不传参数时返回树的深度)
 */
EFTreeTemplate.prototype.depth = function(v){
  if (v === undefined) {	return this._depth;	}
  this._depth = v;
};

/**
 * 根据label从整个树中查找节点
 * @param {String} lb 节点的label
 * @return {EFTTNode} 查找的节点
 */
EFTreeTemplate.prototype.getNode = function(lb){
  var l = new Array();  
  var tlb = lb;
  l.push(tlb);
  
  //循环向上至根节点  存储每层的label
  do{
    var p = this._model.getParent(tlb);
	if ( p != null ) {
	  tlb = p.label;
  	  l.push(p.label);
	}
  }while( p != null );

  var nd = l.pop();
  var node = this._rootNode;
  
  //因为EFTTNode.getChildNode方法只能查找一层节点 (有必要回溯至根??)
  //由根节点循环向下查找标签为lb的节点
  while( nd != undefined ){
    node = node.getChildNode( nd );
    nd = l.pop();   
  }  
  return node;
};

//声明接口,在子类具体实现  渲染Tree的DOM结构
EFTreeTemplate.prototype.render = function(){   
   
};

/**
 * @constructor  树节点Node的基类
 *  treeNode constructed with parnet node, label, text, isLeaf, and related data 
 *  @param {EFTreeTemplate} sTree 节点Node所在的树对象EFTree
 *  @param {EFTTNode} sParent     节点Node的父节点
 *  @param {sLabel} sLabel        节点的Key
 *  @param {sText} sText          节点的显示内容 Value
 *  @param {bool} sLeaf           是否为叶子节点
 *  @param {treeModel} sTree      构造节点的数据
 *  
 *  */
function EFTTNode( sTree, sParent, sLabel, sText, sLeaf, sData ) {
  this._tree = sTree;
  this._parent = sParent;

  this._label = sLabel; // if _label is null, this node is a virtual root node
  this._text = sText;
  this._leaf = sLeaf;
  this._data = sData;
  this._opened = false; //节点默认非展开
  this._childNodes  = [];
  this._status = -1; // -1: not loaded, 0: loading, 1: loaded    
}

/**
 * 设置或者获取节点的label (Key 键)
 * @param {string} v  节点的label值    (传参数时设置节点的label)
 * @return {string}  this._label (不传参数时返回节点的label)
 */
EFTTNode.prototype.label = function(v){
  if (v === undefined) {	return this._label;	}
  this._label = v;
};

/**
 * 设置或者获取节点的text (Value 显示内容)
 * @param {string} v  节点的text值    (传参数时设置节点的text)
 * @return {string}  this._text (不传参数时返回节点的text)
 */
EFTTNode.prototype.text = function(v){
  if (v === undefined) {	return this._text;	}
  this._text = v;
};

/**
 * 设置或者获取节点的leaf (是否为叶子节点)
 * @param {bool} v  节点的leaf值    (传参数时设置节点是否为叶子节点)
 * @return {bool}  this._leaf (不传参数时返回节点的leaf,判断是否为叶子节点)
 */
EFTTNode.prototype.leaf = function(v){
  if (v === undefined) {	return this._leaf;	}
  this._leaf = v;
};

/**
 * 设置或者获取节点的data 
 * @param {treeModel} v  节点的data值    (传参数时设置节点的data)
 * @return {treeModel}  this._data (不传参数时返回节点的data)
 */
EFTTNode.prototype.data = function(v){
  if (v === undefined) {	return this._data;	}
  this._data = v;
};

/**
 * 设置或者获取节点的open (是否展开子节点)
 * @param {bool} v  节点的open值    (传参数时设置节点是否展开子节点)
 * @return {bool}  this._open (不传参数时返回节点的open,判断节点是否展开子节点)
 */
EFTTNode.prototype.open = function(v){
  if (v === undefined) {	return this._opened;	}
  this._opened = v;
};
/**
 * 获取节点的加载状态
 * @return {number} -1 not loaded, 0: loading, 1: loaded    
 */
EFTTNode.prototype.status = function(){
  return this._status;  
};

/**
 * 获取节点的父节点
 * @return {EFTTNode} 返回父节点
 */
EFTTNode.prototype.parent = function(){
  return this._parent;
};

/**
 * 获取节点所处的树对象 EFTree
 * @return {EFTTNode} 返回节点所处的树对象
 */
EFTTNode.prototype.tree = function(){
  return this._tree;
};

/**
 * 判断节点是否为根节点
 * @return {Boolean} 返回节点是否为根节点
 */
EFTTNode.prototype.top = function(){
  return ( this._parent == null );
};

/**
 * 设置节点为虚根
 */
EFTTNode.prototype.virtual = function(){
  return ( this._label == null );
};

/**
 * 获取节点在树中的高度(depth)
 * @return {number} 返回节点的高度(depth)
 */
EFTTNode.prototype.depth = function(){
	var depth = 0;
	var treeItem = this;
	while( !treeItem.top() ){
		depth++;
		treeItem = treeItem._parent;
	}
	return depth;
};

/**
 * 为当前节点添加子节点
 * @param {EFTTNode} sNode 添加的子节点
 */
EFTTNode.prototype.addChild = function( sNode ){
  this._childNodes.push(sNode);
};

/**
 * 获取节点的子节点(第一层)
 * @return {Array} 返回节点的子节点数组
 */
EFTTNode.prototype.getChildNodes = function(){
  var td = this._tree.depth();
  if ( td!=null && td < this.depth()+1 ) { 
	  //节点的深度超过树的深度 返回空数组
    return new Array();
  }
  //加载节点
  this.load();
  return this._childNodes;
};

/**
 * 根据子节点的label获取节点的子节点
 * @param {String} lb  子节点的label
 * @return {EFTTNode} 返回指定的子节点或者null
 */
EFTTNode.prototype.getChildNode = function(lb){
   var children = this.getChildNodes();
   for (  var i = 0; i < children.length; i++ ) {
     var child = children[i];
	 if ( child.label() === lb ) {
       return child;
	 }
   }
   return null;
};

/**
 * 加载树节点
 * @param {Boolean} force 是否强制加载节点
 */
EFTTNode.prototype.load = function(force){

  //树是否动态加载有几种情况 1.通过force传递 && force是布尔值true或false 2.通过tree.dynamic参数传递  
  //3.树的状态是否为-1，若为-1，则需要动态加载  优先级:1 == 3 && 1>2
	var dynamic = false, 
		  tdynamic = this.tree().dynamic;
	if (typeof force === 'boolean'){
		dynamic = force;
	}else if (typeof tdynamic === 'boolean' ){
		dynamic = tdynamic;
	}
	
  //节点需要强制加载或者未加载时	
  if ( dynamic || this._status === -1 ) {
	//不管以什么情况进来，强行加载要置位，否则每次都要进行强行加载
    this._status = 0;
	this._childNodes = new Array();
    var children = new Array();
    
    var model = this.tree()._model;
    if ( this._label === null ) {
      //根节点情形	
    	if (typeof model.nodeLabel === 'string' ){
    		children = model.getChildren(model.nodeLabel,this.tree());
    	}
    	else{
    		 children = model.getTopNodes(this.tree());
    	}
    } else {
      //非根节点	情形
      children = model.getChildren(this._label,this.tree());
    }

    for( var i=0; i<children.length; i++ ){
	  var sub = this._createChildNode(children[i]); //EFTreeNode 具体实现
	  this._childNodes.push(sub);
    }
    this._status = 1;
  } 
};

/**
 * 根据数据创建树节点
 * @param {Object} child 构造树节点所需的数据,一般为后台block的row
 * @return
 */
EFTTNode.prototype._createChildNode = function(child){
  alert("_createChildNode NOT implemented");
};

/**
 * 展开节点的子节点
 */
EFTTNode.prototype.expand = function() {  
  this._opened = true;
  this.load();
  this.render();
};

/**
 * 折叠节点的子节点
 */
EFTTNode.prototype.collapse = function(){
  this._opened = false;   
  this.render();
};

/**
 * 声明节点的渲染接口
 */
EFTTNode.prototype.render = function(){
   alert("render NOT implemented");
};

