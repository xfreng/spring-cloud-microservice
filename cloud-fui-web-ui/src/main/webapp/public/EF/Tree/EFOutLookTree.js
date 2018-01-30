

/**
  Tree constructor with treeModel, label and text. 
**/
function EFOutLookTree( sModel, sLabel, sText) {
	
  this.base = EFTree;
  this.base( sModel, sLabel, sText );

  this.hideRoot = true;


  this._rootNode = new EFOutLookTreeNode(this, null, null, this._text, false, null);
  this._rootNode.active(false);
  
  this._target = this._rootNode;  
  this._jTreeDiv = document.createElement("div");  
  

}

EFOutLookTree.prototype = new EFTree();



EFOutLookTree.prototype.setCurrent = function(node){  
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



EFOutLookTree.prototype._setSelected = function(node){  
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


function EFOutLookTreeNode( sTree, sParent, sLabel, sText, sLeaf, sData ) {
  this.base = EFTreeNode;
  this.base( sTree, sParent, sLabel, sText, sLeaf, sData );    

}

EFOutLookTreeNode.prototype = new EFTreeNode();



EFOutLookTreeNode.prototype.onArchClicked = function( ){
	
  if(this != this.tree()._mycurrent && !!this.tree()._mycurrent){
     this.tree()._mycurrent.collapse();
     this.tree()._mycurrent = null;
   }
  if ( this._opened ) {
    this.collapse();
    this.tree()._mycurrent = null;
  } else {
    this.expand();
    this.tree()._mycurrent = this;
  }
}

EFOutLookTreeNode.prototype.onTextClicked = function( ){
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



EFOutLookTreeNode.prototype._createChildNode = function(child){
  var node = new EFOutLookTreeNode( this.tree(), this, child['label'], child['text'], child['leaf']=="1", child );
  return node;
}


EFOutLookTreeNode.prototype.onMouseOver = function(){
	if(this.depth() ==2)
		this._jNodeTextDiv.childNodes[0].className = "ef-outLookTree-hover";
		
	//展示菜单信息

    var instance = this;
	if(!this.leaf()){
	
				var divNode = ef.get("efgrid_showMenu_div");
				if(!!divNode ){
					//delete node
					divNode.parentNode.removeChild(divNode);
				}
					
	
				var nMenu = new EFMenu(this.tree()._model, "showMenu", "showMenu");
				nMenu._rootNode= new EFMenuItem( nMenu, null, this.data()['label'], this.data()['text'], this.data()['leaf']=="1", this.data() );
				nMenu._rootNode._opened = true;
				
				//configMenu(nMenu);
				nMenu.hoverExpand = function(n){  return true; }
				
				
				nMenu.textClicked = instance.textClicked;
	
				
				nMenu._horizental = false;
				
				nMenu.render();
				
				var menu = nMenu._rootNode._jMenuDIV.get(0);
				//var menu = node.get(0);
				menu.id = "efgrid_showMenu_div";
				
				document.body.appendChild(menu);
		
				var iframe = $("#efgrid_showMenu_div").find("iframe").get(0);
				iframe.style.width=menu.offsetWidth;
				iframe.style.height=menu.offsetHeight;

				domLayout.postionWithRel( menu, $(this._jNodeTextDiv).find("img").get(0), false );
				
				
	
	}

	    

}


EFOutLookTreeNode.prototype.onMouseOut = function(){
	if(this.depth() ==2)
		this._jNodeTextDiv.childNodes[0].className = "ef-outLookTree-item";
	if(!this.leaf()){
				var divNode = ef.get("efgrid_showMenu_div");
				if(!!divNode ){

				}
	}
}

EFOutLookTreeNode.prototype._renderSkeleton = function(){
  var tree = this.tree();
  if ( this._jTreeNodeDIV == null ) {
  
    this._jTreeNodeDIV = document.createElement("div");
    this._jTreeNodeDIV.nowrap = "yes";
    
    
	this._jNodeTextDiv = document.createElement("div");
	if(this.depth()==1)
		this._jNodeTextDiv.innerHTML = " <div class='ef-outLookTree' ><span>"+this._text + "</span></div>";
	else{
		this._jNodeTextDiv.innerHTML = " <div class='ef-outLookTree-item' >"+this._text 
		
		+(this.leaf()==false?"&nbsp;<img class='arrow' src=\"" + EFMenuConfig.nextIcon + "\" align='absmiddle'>":"") 
		
		+"</div>";
	}
	instance = this;
	if(this.depth()==2){
		$(this._jNodeTextDiv).mouseover( function(){ instance.onMouseOver(); });
	    $(this._jNodeTextDiv).mouseout( function(){ instance.onMouseOut();	}); 	
    }

   
    if ( !this._init ){
	  this._initialize();
    }
	
    if ( this._active ){
      this._jNodeTextDiv.href="javascript:void(0)";
    } 

    //this._jTypeDiv = document.createElement("span");
    this._jTreeChildrenDiv = document.createElement("div");
    
    //debugger;
	
		
	var instance = this;
      this._jNodeTextDiv.onclick = function(){ 
      			if(instance.depth() <2 && instance.leaf()==false){ 
      			    var divNode = ef.get("efgrid_showMenu_div");
      			    if(!!divNode)
      			    	divNode.style.display="none";
      				instance.onArchClicked();
      			}
      			else if(instance.depth() ==2 && instance.leaf()==true)
      				instance.onTextClicked( );

      	};
  }
}	


EFOutLookTreeNode.prototype.render = function(){    	

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



































