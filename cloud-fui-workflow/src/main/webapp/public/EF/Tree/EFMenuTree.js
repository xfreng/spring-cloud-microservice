/**
  Tree constructor with treeModel, label and text. 
**/
function EFMenuTree( sModel, sLabel, sText) {
  this.base = EFTree;
  this.base( sModel, sLabel, sText );
  this.hideRoot = true;
  this._rootNode = new EFMenuTreeNode(this, null, null, this._text, false, null);
  this._rootNode.active(false);
  this._target = this._rootNode;  
  this._jTreeDiv = document.createElement("div");  
}

EFMenuTree.prototype = new EFTree();

EFMenuTree.prototype.setCurrent = function(node){  
  for( var k in this._selected ){
    $(this._selected[k]._jNodeTextDiv).removeClass("ef-outLookTree-current");
  }
  this._selected = new Object();
  if ( this._current != null ){

    $(this._current._jNodeTextDiv).removeClass("ef-outLookTree-current");
  }
  if ( node._jNodeTextDiv != null){

    $(node._jNodeTextDiv).addClass("ef-outLookTree-current");
  }
  this._current = node;
}

EFMenuTree.prototype._setSelected = function(node){  
  if ( this._current != null && (this._current.label()==node.label()) ){
	  alert("return");
	  return;
  }
  var _lb = node.label();
  if ( this._selected[_lb] ){	
    $(node._jNodeTextDiv).removeClass("ef-outLookTree-current");
    delete this._selected[_lb];    
  } else {
    this._selected[_lb] = node;
     $(node._jNodeTextDiv).addClass("ef-outLookTree-current");
  }
}

function EFMenuTreeNode( sTree, sParent, sLabel, sText, sLeaf, sData ) {
  this.base = EFTreeNode;
  this.base( sTree, sParent, sLabel, sText, sLeaf, sData );    

}

EFMenuTreeNode.prototype = new EFTreeNode();

EFMenuTreeNode.prototype.onArchClicked = function( ){
	//点击单个OutLookTab
	
  	if(this != this.tree()._mycurrent && !!this.tree()._mycurrent){
		this.tree()._mycurrent = null;
	}
	if ( this._opened ) {
		this.collapse();
		this.tree()._mycurrent = null;
		this._jNodeTextDiv.innerHTML = " <div class='ef-outLookTree'><img style='float:right' src='" + efico.get("eftree.padDown")+ "' /><span >"+this._text + "</span></div>";
	} else {
		this.expandOutLookTab();
		this.tree()._mycurrent = this;
		this._jNodeTextDiv.innerHTML = " <div class='ef-outLookTree'><img style='float:right' src='" + efico.get("eftree.padUp")+ "' /><span >"+this._text + "</span></div>";
	}
}

EFMenuTreeNode.prototype.expandOutLookTab = function(){
	//展开单个OutLookTab
	
	this._needRender = this._opened?false:true;
	this._opened = true;
	
	this.renderSubTree();
}

EFMenuTreeNode.prototype.renderSubTree = function(){
	//渲染单个OutLookTab下的子树
	if (this._opened){
		this._jTreeChildrenDiv.style.display="block";
		this._jTreeChildrenDiv.style.overflow ="hidden";
		
		if(!this._hasRendered){
			var xTree=new EFTree(this.tree()._model,this._label+"_tree","");
			this.configFun(xTree);
			xTree._rootNode._label=this._label
			xTree.hideRoot=true;
            var tNode=xTree.render()
            
			this._jTreeChildrenDiv.appendChild(xTree.render());
		    this._hasRendered = true;
    	}
  	}
	return this._jTreeNodeDIV;
}

EFMenuTreeNode.prototype.configFun=function(nTree){
	nTree.nodeInitializer=this.tree().nodeInitializer;
	nTree.depth(this.tree().depth());
  	nTree.emptyNodeAsLeaf = this.tree().emptyNodeAsLeaf;
  	nTree.activeEmptyJudger = this.tree().activeEmptyJudger;
  	nTree.clickableNodeNames = this.tree().clickableNodeNames;
  	nTree.textClicked = this.tree().textClicked;
  	nTree.hoverExpand = this.tree().hoverExpand;
  	nTree.initialExpandDepth = this.tree().initialExpandDepth-1;
}

EFMenuTreeNode.prototype.onTextClicked = function( ){
  var tr = this.tree();
  switch( tr._status ){
    case 0:
		tr.setCurrent(this);
        this.textClicked(this);
		break;
	case 1:
		tr._setSelected(this);
		break;
  }  
}

EFMenuTreeNode.prototype._createChildNode = function(child){
  	var node = new EFMenuTreeNode( this.tree(), this, child['label'], child['text'], child['leaf']=="1", child );
  	return node;
}


EFMenuTreeNode.prototype._renderSkeleton = function(){
  
  var tree = this.tree();
  if ( this._jTreeNodeDIV == null ) {  
    this._jTreeNodeDIV = document.createElement("div");
    this._jTreeNodeDIV.nowrap = "yes";    
	this._jNodeTextDiv = document.createElement("div");
	this._jTreeChildrenDiv = document.createElement("div");
	var instance = this;
	if(this.depth()==1)
	{
		this._jNodeTextDiv.nowrap = "yes";
		this._jNodeTextDiv.width = "100%";
		this._jNodeTextDiv.innerHTML = " <div class='ef-outLookTree'><img style='float:right'  src='" + efico.get("eftree.padDown")+ "' /><span >"+this._text + "</span></div>";

	}
	if (tree.nodeInitializer != null) {
        tree.nodeInitializer(this);
    }
    this._jNodeTextDiv.onclick = function(){ 
		if( instance.leaf()==false)
		{
			instance.onArchClicked();
		}
		else if( instance.leaf()==true)
			instance.onTextClicked( );
   	};
  }
}	


EFMenuTreeNode.prototype.render = function(){
	
    this._renderSkeleton();  
    if ( this.needRender() || this._cascadeRender ){
    	this.needRender(false);
  	    this._cascadeRender = false; 
    } else {  
	    this._jTreeNodeDIV.appendChild(this._jNodeTextDiv);
	    this._jTreeNodeDIV.appendChild(this._jTreeChildrenDiv);  
        return this._jTreeNodeDIV;	
    }
    var asLeaf = this._asLeaf();  
    if (!asLeaf){
      	this._renderChildren(this._opened);
    }  
    this._jTreeNodeDIV.appendChild(this._jNodeTextDiv);
    this._jTreeNodeDIV.appendChild(this._jTreeChildrenDiv); 
    
    return this._jTreeNodeDIV;
}



































