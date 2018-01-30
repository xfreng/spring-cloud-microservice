EFMenuImagePath				= EF_IMAGES_PATH;

var EFMenuConfig = {       
	nextIcon                : efico.get("efmenu.arrowRight"),
	disabledNextIcon        : efico.get("efmenu.arrowRight2"),
	downIcon                : efico.get("efmenu.arrowDown"),
	delay                   : 200,
	useHover                : false,
	onTextClick				: false
};

/**
  Tree constructor with treeModel, label and text. 
**/
function EFMenu( sModel, sLabel, sText ) {
  	

  this.base = EFTreeTemplate;
  this.base( sModel, sLabel, sText );  
	
  this._horizental = true;
  this._width = 100;

  this._rootNode = null;  
  this._selected = null;    

  this._showTimeout = null;
  this._hideTimeout = null;

  this.textClicked = null;
  this.hoverExpand = null;  
  this.menuItemClicked = null;
}

EFMenu.prototype = new EFTreeTemplate();

EFMenu.prototype.width = function(v){
  if (v == undefined) {	return this._width;	}
  this._width = v;
}

/* render as a dom  */
EFMenu.prototype.render = function(){
   if ( this._rootNode == null ){
     this._rootNode = new EFMenuItem(this, null, null, this._text, false, null);
	 this._rootNode._opened = true;
   }
   return this._rootNode._renderSubMenu(this._horizental);
}

EFMenu.prototype.setSelected = function(node){
  
  this._selected = node;
}

/* treeNode constructed with parnet node, label, text, isLeaf, and related data */
function EFMenuItem( sTree, sParent, sLabel, sText, sLeaf, sData ) {
  this.base = EFTTNode;
  this.base( sTree, sParent, sLabel, sText, sLeaf, sData );
 
  this._horizental = false;

  this._userHover = this._getUserHover();

  this._jItemDIV = null;
  this._jMenuDIV = null;
  this._needRender = true;
}

EFMenuItem.prototype = new EFTTNode();

EFMenuItem.prototype._getUserHover = function(){
	var menu = this.tree();
	if ( menu.hoverExpand != null ){
		var u = menu.hoverExpand(this);
		if ( isAvailable(u) ){ return u; }
	}
	return EFMenuConfig.useHover;
}


EFMenuItem.prototype._onTextClick = function(){
	var menu = this.tree();
	if ( menu.menuItemClicked != null ){
		var c = menu.menuItemClicked(this);
		if ( isAvailable(c) ){ return c; }
	}
	return EFMenuConfig.onTextClick;
}

EFMenuItem.prototype.onTextClicked = function( ){
  var menu = this.tree();
  
  if(this._parent._parent == null)	//root node
  { 
	  if(menu.menuItemClicked != null){
	  	menu.menuItemClicked.removeClass('ef-munu-bar-onTextClicked');
	  }
	  $(this).removeClass();
	  $(this._jItemDIV).addClass('ef-munu-bar-onTextClicked');
	  menu.menuItemClicked = this._jItemDIV;
  }
  else if(this.leaf()){
	var rootNode = this._parent;
	while(rootNode._parent._parent != null){
		rootNode = rootNode._parent;}

	if(menu.menuItemClicked != null){
	  	menu.menuItemClicked.removeClass('ef-munu-bar-onTextClicked');
	}
	$(rootNode).removeClass();
	$(rootNode._jItemDIV).addClass('ef-munu-bar-onTextClicked');
	menu.menuItemClicked = rootNode._jItemDIV;
    
  }
  
  if ( !this._userHover ){
    if ( this._opened ) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  if ( menu.textClicked != null ) {
    menu.textClicked(this);   
  }
}

EFMenuItem.prototype.onMouseOver = function( ){

  var menu = this.tree();
  menu.setSelected( this );
  if ( this._userHover ){
    this.expand();	
  } 
}

EFMenuItem.prototype.onMouseOut = function( ){
  var menu = this.tree();
  if ( this._userHover ){
    var host = menu._rootNode;
    menu._hideTimeout = window.setTimeout( function(){ host.collapse(); } , EFMenuConfig.delay);
  }  
}

EFMenuItem.prototype.collapse = function() {
  this._needRender = this._opened;
  this._hidesubs();
  if ( this._label != null ){	
    this._opened = false;
    this.render();
  }  
}

EFMenuItem.prototype.expand = function() {  

  var menu = this.tree();
  if (menu._showTimeout != null)	window.clearTimeout(menu._showTimeout);
  if (menu._hideTimeout != null)	window.clearTimeout(menu._hideTimeout);
  this.load();    
   
  if (  this._label != null ) {
    if(this._parent instanceof EFMenuItem)
    	this._parent._hidesubs();
	this._needRender = this._opened?false:true;
    this._opened = true; 
    this.render();
  } 
}

EFMenuItem.prototype._hidesubs = function() { 
  for (var i = 0; i < this._childNodes.length; i++) {
    var _node = this._childNodes[i];
	_node.collapse();		
  }
}

EFMenuItem.prototype._createChildNode = function(child){
  return new EFMenuItem( this.tree(), this, child['label'], child['text'], child['leaf']=="1", child );
}

EFMenuItem.prototype._renderSubMenu = function(hor){
  var horizental = hor | false;
  var menu = this.tree();
  var children = this.getChildNodes();
  if ( children.length > 0 ) {
    if ( this._jMenuDIV == null ) {
      this._jMenuDIV = $("<div>");
	  if ( horizental ) {
        this._jMenuDIV.toggleClass( "ef-menu-bar" );  
	  } else {
        this._jMenuDIV.toggleClass( "ef-menu" );  
      }
	  this._jMenuDIV.css("visibility","visible");
	  //this._jMenuDIV.css("width", menu._width);
      for( var i=0; i<children.length; i++ ){
        var child = children[i];
		child._horizental = horizental;
	    this._jMenuDIV.append( child.render() );
      }
//	  if($.browser.msie){
//	  	var jqIframe = $("<iframe src='javascript:false' style='position:absolute;visibility:inherit;top:0px;left:0px;width:180px;height:600px;z-index:-1;filter=\"progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\";'></iframe>");
//      	this._jMenuDIV.append(jqIframe);
//      }
    }
	
	return this._jMenuDIV.get(0);
  } else {
	  return null;
  }
}

EFMenuItem.prototype.render = function(){
  var renderAsLeaf = this._leaf;
  if ( this._jItemDIV == null ) {
	this._jItemDIV = $("<a href='#'/>");	
	var instance = this;	
	this._jItemDIV.click( function(){ instance.onTextClicked(); } );
	this._jItemDIV.mouseover( function(){ instance.onMouseOver(); });
    this._jItemDIV.mouseout( function(){ instance.onMouseOut();	});   
	   
    var imgSrc;
    if(!!this.data() && !!this.data()["imgSrc"])
    	imgSrc = "<img style='border:0' src="+this.data()["imgSrc"]+">&nbsp;&nbsp;";
    if ( renderAsLeaf ){
      	this._jItemDIV.html((!!imgSrc?imgSrc:"")+ this._text );
    } else {
      if ( this._horizental ){
        var _h = this._text + "<img class='arrow' src=\"" + EFMenuConfig.downIcon + "\" align='absmiddle'>";
	    this._jItemDIV.html( _h );
      } else {
        var _h = "<img class='arrow' src=\"" + EFMenuConfig.nextIcon + "\" align='absmiddle'>" +
        (!!imgSrc?imgSrc:"")+this._text;
        this._jItemDIV.html( _h );
      }    
    }
  }
  
  if ( renderAsLeaf || !this._needRender ){
    return this._jItemDIV.get(0);
  }

  if ( this._opened ) {

	  var divElement = this._renderSubMenu();
      if ( divElement != null  ) {
		//this._jMenuDIV.css("visibility","visible");  
        document.body.appendChild( divElement );
	    domLayout.postionWithRel( divElement, this._jItemDIV.get(0), !this._horizental );
      }
    } else {
	  if ( this._jMenuDIV != null ) {
          var divElement = this._jMenuDIV.get(0);
		  //this._jMenuDIV.css("visibility","hidden");
		  if ( divElement.parentNode != null ) {
            divElement.parentNode.removeChild(divElement);
		  }
	  }
    }
  
  return this._jItemDIV.get(0);
}


























