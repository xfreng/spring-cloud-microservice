function treeModel() {  
  this.listerners = [];
}
treeModel.prototype.getTopNodes = function(){
}
treeModel.prototype.getChildren = function(p){
}
treeModel.prototype.getParent = function(p){
	alert('getParent NOT implemented');
}  
treeModel.prototype.addListener = function(l){
  this.listerners.push(l);
}
treeModel.prototype.notify = function(e, param){
  for( var i in this.listerners ){
	  var l = this.listerners[i];
	  l.accept(e, param);
  }
}

function eiTreeModel(s) {
	this.queryBlockName = "inqu_status";
    this.resultBlockName = "result";
    this.methodQuery = "query";    

    this.keyOffset = "offset";
	this.keyCount = "limit";
	
	this.base = treeModel;
	this.base();
	this.service = s;  
	
	this._cache = {};
	
}
eiTreeModel.prototype = new treeModel();

eiTreeModel.prototype.getTopNodes = function(tree){
  return this.getChildren("$",tree);
}
eiTreeModel.prototype.getChildren = function(p,tree){
	var cached = this._cache[p];
    if ( isAvailable( cached ) ){ return cached;  }

    var host = this;
    var queryCallBack = { 
		 onSuccess: function(ei){			 
			 var blocks = ei.getBlocks();
			 for( var name in blocks ){
			   var _block = blocks[name];
			   var rows = _block.getMappedRows();
			   host._cache[name] = rows;
			 }
		 },
         onFail: function(xmlR, status, e){ alert("ERROR"); }
    }; 
	
    var queryMeta = new EiBlockMeta(this.queryBlockName);
	var column = new EiColumn("node");   
    column.pos = 0;
    queryMeta.addMeta(column);
	
	var queryBlock = new EiBlock(queryMeta);
	queryBlock.addRow([p+""]);

	var blocka = new EiBlock(this.resultBlockName);
    var eiinfo = new EiInfo();
    if(tree && tree.param!=null)
    {
    	eiinfo.extAttr.param = tree.param;
    }
    
    eiinfo.addBlock(queryBlock);
    eiinfo.addBlock(blocka);
    EiCommunicator.send( this.service, this.methodQuery, eiinfo, queryCallBack, false  );	
	var ret = this._cache[p];
	if ( isAvailable(ret) ){
	  delete this._cache[p];
	  return ret;
	} else {
	  return new Array();
	}
}
eiTreeModel.prototype.getParent = function(p){
    var ret = null;
    var host = this;
    var queryCallBack = { 
		 onSuccess: function(ei){			 
			 var block = ei.getBlock(p);
			 if ( block != null ){
			   var rows = block.getMappedRows();			    
			   ret = rows[0];
			 }
		 },
         onFail: function(msg){ alert("ERROR"); }
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
    EiCommunicator.send( this.service, "queryParent", eiinfo, queryCallBack, false  );	
	return ret;	
}

eiTreeModel.prototype.eiIcon = function(v){ 
};

function tagTreeModel(loc) {
	this.resultBlockName = "result";
	this.base = treeModel;
	this.base();
	this._loc = loc;	
	this.idK = "label";
	this.parentK = "parent";
	this._parentC = {};
}
tagTreeModel.prototype = new treeModel();
tagTreeModel.prototype.getTopNodes = function(){
  return this.getChildren("$");
}
tagTreeModel.prototype.getChildren = function(p){
    var ret = new Array();
	var host = this;
    var queryCallBack = {
		 onSuccess: function(ei){						 			 
			 var _block = ei.getBlock(p);
			 if( _block != null ){			   
			   ret = _block.getMappedRows();
			 }			 
		 },
         onFail: function(msg){ alert("ERROR");}
    }; 
    EiCommunicator.$send( this._loc + "&PARTNUMBER=" + p, "", queryCallBack  );	
    return ret;
}
tagTreeModel.prototype.getParent = function(p){
    var host = this;
    var cached = this._parentC[p];
    if ( isAvailable( cached ) ){ return cached;  }    
	
    var queryCallBack = { 
		 onSuccess: function(ei){
		     var blocks = ei.getBlocks();
			 for( var _n in blocks ){
			   var _block = blocks[_n];
			   var rows = _block.getMappedRows();
			   if ( isAvailable( rows[0] ) ){
			     host._parentC[_n] = rows[0];
			   }
			 }			 
		 },
         onFail: function(msg){ alert("ERROR");}
    }; 
    EiCommunicator.$send( this._loc + "&PARENT=true&PARTNUMBER=" + p, "", queryCallBack  );	
    return this._parentC[p];
}

function xmlTreeModel(s) {
	this.base = treeModel;
	this.base();
    this.nodes = {};
	this.parseXML(s);
}
xmlTreeModel.prototype = new treeModel();
xmlTreeModel.prototype.getTopNodes = function(){
  return this.getChildren("");
}
xmlTreeModel.prototype.getChildren = function(p){
  var cached = this.nodes[p];
  if ( isAvailable( cached ) ){ return cached;  }
  var em = new Array();
  return em;
}
xmlTreeModel.prototype.addChild = function(p, node){
  var children = this.getChildren( p );
  children.push(node);
  this.nodes[p] = children;
}
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
}
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
}

function absTreeModel() {
	this.base = treeModel;
	this.base();
    this.childs = {};
	this.nodes = {};
}
absTreeModel.prototype = new treeModel();
absTreeModel.prototype.getTopNodes = function(){
  return this.getChildren("");
}
absTreeModel.prototype.getChildren = function(p){
  var cached = this.childs[p];
  if ( isAvailable( cached ) ){ return cached;  }
  var em = new Array();
  return em;
}
absTreeModel.prototype.getParent = function(m){
  var nd = this.nodes[m];
  if ( nd != null ){
	  var p = this.nodes[nd.parent];
	  return p;
  }
  return null;
}
absTreeModel.prototype.addChild = function(p, node){
  var children = this.getChildren( p );
  children.push(node);
  this.childs[p] = children;
  this.nodes[node.label] = node;
}