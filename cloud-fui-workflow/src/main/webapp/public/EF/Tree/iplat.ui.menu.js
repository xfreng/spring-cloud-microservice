EFMenuImagePath				= EF_IMAGES_PATH;

var EFMenuConfig = {       
	nextIcon                : efico.get("efmenu.arrowRight"),
	disabledNextIcon        : efico.get("efmenu.arrowRight2"),
	downIcon                : efico.get("efmenu.arrowDown"),
	delay                   : 50000,
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


/**
 * 查找嵌套的iframe中所有selector 元素，返回数组
 */
function getElem(selector, $root, $collection) {
    if (!$root) $root = $(document);
    if (!$collection) $collection = [];
    // Select all elements matching the selector under the root
    try{
    	$root.find(selector).contents();//解决IE下iframe中无内容时跨域异常问题
    }catch(e){
    	return $collection;
    }
    
    $root.find(selector).each(function()
    {
    	$collection.push($(this));
    });

    $root.find('iframe,frame').each(function() {
        getElem(selector, $(this).contents(), $collection);
        
    });
    
    return $collection;
   
}

EFMenu.prototype.render = function(){
   if ( this._rootNode == null ){
     this._rootNode = new EFMenuItem(this, null, null, this._text, false, null);
	 this._rootNode._opened = true;
   }
   
   var host = this._rootNode;
   
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
  var host = this;
  if(this._parent._parent == null)	//root node
  { 
	  if(menu.menuItemClicked != null){
	  	menu.menuItemClicked.removeClass('ef-menu-bar-onTextClicked');
	  }
	  $('div.ef-menu a.ef-menu-item-onclick').removeClass('ef-menu-item-onclick');
	  $(this).removeClass();
	  $(this._jItemDIV).addClass('ef-menu-bar-onTextClicked');
	  menu.menuItemClicked = this._jItemDIV;
	  
	  $(getElem('iframe')).each(function(i,o){
	  	     o.contents().find('body').click(function(){
	  	    	 $('div.ef-menu a.ef-menu-item-onclick').removeClass('ef-menu-item-onclick');
	  	    	 host.collapse();
	  	     });
	  });

	  $('body').click(function(event){
		  //body的click事件触发源要判断是不是自身点击
		  if (!$(event.target).parent().hasClass('ef-menu') && !$(event.target).parent().hasClass('ef-menu-bar') )
		  {
	    	  $('div.ef-menu a.ef-menu-item-onclick').removeClass('ef-menu-item-onclick');
			  host.collapse();
		  }
	  });
  }
  else if(this.leaf()){
	var rootNode = this._parent;
	while(rootNode._parent._parent != null){
		rootNode = rootNode._parent;
	}

	if(menu.menuItemClicked != null){
	  	menu.menuItemClicked.removeClass('ef-menu-bar-onTextClicked');
	}
	$(rootNode).removeClass();
	$(rootNode._jItemDIV).addClass('ef-menu-bar-onTextClicked');
	menu.menuItemClicked = rootNode._jItemDIV;
    
  }
    if ( this._opened ) {
      if (this._parent!= null && this._parent._parent==null){
    	  $('div.ef-menu a.ef-menu-item-onclick').removeClass('ef-menu-item-onclick');
      }
      this.collapse();
    } else {
      this.expand();
      if (this._parent._parent != null)
      {
    	  $('div.ef-menu a.ef-menu-item-onclick').removeClass('ef-menu-item-onclick');
    	  $(this._jItemDIV).addClass('ef-menu-item-onclick');
    	  var parent = this._parent;
    	  while (parent!=null && parent._parent!=null && parent._parent.label()!=null)  //保证是二级节点，排除掉根节点的情况
    	  {
    		  $(parent._jItemDIV).addClass('ef-menu-item-onclick');
    		  parent = parent._parent;
    	  }
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
	  if (menu._showTimeout != null)	window.clearTimeout(menu._showTimeout);
	  if (menu._hideTimeout != null)	window.clearTimeout(menu._hideTimeout);
	  
	  var parent = this._parent;
	  while (parent!=null && parent._parent!=null && parent._parent.label()!=null)
	  {
		  $(parent._jItemDIV).addClass('ef-menu-hover');
		  parent = parent._parent;
	  }
//    this.expand();
//    add by yiyong 解决鼠标移动上去后菜单在50秒后自动消失bug；
//    EFMenuConfig.delay=5000;
  } 
}

EFMenuItem.prototype.onMouseOut = function( ){
  var menu = this.tree();
  //add by yiyong 解决鼠标移动上去后菜单在50秒后自动消失bug；
  //EFMenuConfig.delay=1000;
  if ( this._userHover ){   
	  var host = menu._rootNode;
      menu._hideTimeout = window.setTimeout( function(){ host.collapse(); } , EFMenuConfig.delay);
	  var parent = this._parent;
	  while (parent!=null && parent._parent!=null && parent._parent.label()!=null)
	  {
		  $(parent._jItemDIV).removeClass('ef-menu-hover');
		  parent = parent._parent;
	  }
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
        var instance = this;	
    	this._jMenuDIV.mouseover( function(){ instance.menuOnMouseOver(); });
        this._jMenuDIV.mouseout( function(){ instance.menuOnMouseOut();	});   
	  } else {
        this._jMenuDIV.toggleClass( "ef-menu" );  
      }
	  this._jMenuDIV.css("visibility","visible");
	  //this._jMenuDIV.css("width", menu._width);
      for( var i=0; i<children.length; i++ ){
        var child = children[i];
		child._horizental = horizental;
		
        var cDom = child.render();       
        //增加头尾样式定义
        if (i == 0) {
        	cDom.className = cDom.className + " " + "first";
        }
        if (i == (children.length - 1)) {
        	cDom.className = cDom.className + " " + "last";
        }

	    this._jMenuDIV.append( cDom );
      }
    }
	
	return this._jMenuDIV.get(0);
  } else {
	  return null;
  }
}

//菜单根节点的DIV在鼠标悬浮时的状态
EFMenuItem.prototype.menuOnMouseOver = function( ){
	this._jMenuDIV.addClass("ef-menu-hover");
}

//菜单根节点的DIV在鼠标离开时的样式
EFMenuItem.prototype.menuOnMouseOut = function( ){
	this._jMenuDIV.removeClass("ef-menu-hover");
//	this._jMenuDIV.addClass("ef-menu-bar");
}


EFMenuItem.prototype.render = function(){
  var renderAsLeaf = this._leaf;
  if ( this._jItemDIV == null ) {
	this._jItemDIV = $("<a href='#' style=''/>");	
	var instance = this;	
	this._jItemDIV.click( function(){ instance.onTextClicked(); } );
	this._jItemDIV.mouseover( function(){ instance.onMouseOver(); });
    this._jItemDIV.mouseout( function(){ instance.onMouseOut();	});   
	   
    var imgSrc;
    if(!!this.data() && !!this.data()["imagePath"]) {
    	//imgSrc = "<img style='border:0 ' src="+this.data()["imgSrc"]+">&nbsp;&nbsp;";
    	imgSrc = efico.buildIconHTML(this.data()["imagePath"]);
    }
    if ( renderAsLeaf ){
      	this._jItemDIV.html((!!imgSrc?imgSrc:"")+ this._text );
    } else {
      if ( this._horizental ){
        var _h = this._text + "&nbsp;&nbsp;<img class='arrow' src=\"" + EFMenuConfig.downIcon + "\" align='absmiddle'>";
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
        if ( this._horizental ){
        	$(divElement).position({
        		  my: "left top",
        		  at: "left bottom",
        		  of: this._jItemDIV.get(0)
        		});
        } else {
        	domLayout.postionWithRel( divElement, this._jItemDIV.get(0), !this._horizental );
        }
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
