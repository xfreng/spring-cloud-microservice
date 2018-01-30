
function EFTreeTemplate( sModel, sLabel, sText ) {
  this._model = sModel;
  this._label = sLabel;
  this._text = sText;
  this._depth = null;
}

EFTreeTemplate.prototype.depth = function(v){
  if (v === undefined) {	return this._depth;	}
  this._depth = v;
}

EFTreeTemplate.prototype.getNode = function(lb){
  var l = new Array();  
  var tlb = lb;
  l.push(tlb);
  do{
    var p = this._model.getParent(tlb);
	if ( p != null ) {
	  tlb = p.label;
  	  l.push(p.label);
	}
  }while( p != null )

  var nd = l.pop();
  var node = this._rootNode;
  while( nd != undefined ){
    node = node.getChildNode( nd );
    nd = l.pop();   
  }  
  return node;
}

EFTreeTemplate.prototype.render = function(){   
   
}


/* treeNode constructed with parnet node, label, text, isLeaf, and related data */
function EFTTNode( sTree, sParent, sLabel, sText, sLeaf, sData ) {
  this._tree = sTree;
  this._parent = sParent;

  this._label = sLabel; // if _label is null, this node is a virtual root node
  this._text = sText;
  this._leaf = sLeaf;
  this._data = sData;

  this._opened = false;
  this._childNodes  = [];
  this._status = -1; // -1: not loaded, 0: loading, 1: loaded    
}

EFTTNode.prototype.label = function(v){
  if (v === undefined) {	return this._label;	}
  this._label = v;
}

EFTTNode.prototype.text = function(v){
  if (v === undefined) {	return this._text;	}
  this._text = v;
}

EFTTNode.prototype.leaf = function(v){
  if (v === undefined) {	return this._leaf;	}
  this._leaf = v;
}

EFTTNode.prototype.data = function(v){
  if (v === undefined) {	return this._data;	}
  this._data = v;
}

EFTTNode.prototype.open = function(v){
  if (v === undefined) {	return this._opened;	}
  this._opened = v;
}

EFTTNode.prototype.status = function(){
  return this._status;  
}

EFTTNode.prototype.parent = function(){
  return this._parent;
}

EFTTNode.prototype.tree = function(){
  return this._tree;
}

EFTTNode.prototype.top = function(){
  return ( this._parent == null );
}

EFTTNode.prototype.virtual = function(){
  return ( this._label == null );
}

EFTTNode.prototype.depth = function(){
	var depth = 0;
	var treeItem = this;
	while( !treeItem.top() ){
		depth++;
		treeItem = treeItem._parent;
	}
	return depth;
}

EFTTNode.prototype.addChild = function( sNode ){
  this._childNodes.push(sNode);
}

EFTTNode.prototype.getChildNodes = function(){
  var td = this._tree.depth();
  if ( td!=null && td < this.depth()+1 ) {  
    return new Array();
  }
  this.load();
  return this._childNodes;
}

EFTTNode.prototype.getChildNode = function(lb){
   var children = this.getChildNodes();
   for (  var i = 0; i < children.length; i++ ) {
     var child = children[i];
	 if ( child.label() === lb ) {
       return child;
	 }
   }
   return null;
}

EFTTNode.prototype.load = function(force){
  //debugger;

  if ( force || this._status === -1 ) {
    this._status = 0;
	this._childNodes = new Array();
    var children = new Array();
    if ( this._label === null ) {
      children = this.tree()._model.getTopNodes(this.tree());
    } else {
      children = this.tree()._model.getChildren(this._label,this.tree());
    }

    for( var i=0; i<children.length; i++ ){
	  var sub = this._createChildNode(children[i]); 
	  this._childNodes.push(sub);
    }
    this._status = 1;
  } 
}

EFTTNode.prototype._createChildNode = function(child){
  alert("_createChildNode NOT implemented");
}

EFTTNode.prototype.expand = function() {  
  this._opened = true;
  this.load();
  this.render();
}

EFTTNode.prototype.collapse = function(){
  this._opened = false;   
  this.render();
}

EFTTNode.prototype.render = function(){
   alert("render NOT implemented");
}

