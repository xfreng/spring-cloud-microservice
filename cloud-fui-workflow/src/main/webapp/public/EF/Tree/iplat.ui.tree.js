EFTreeImagePath = EF_IMAGES_PATH;
/* 页面树节点Map对象 */
var ef_treeIds = new Object();

var EFTreeConfig = {
    rootIcon: efico.get("eftree.folderIcon"),
    openRootIcon: efico.get("eftree.openFolderIcon"),
    
    //folderIcon: efico.get("eftree.folderIcon"),
    folderIcon: "css : ui-icon ui-icon-folder-collapsed",
    //openFolderIcon: efico.get("eftree.openFolderIcon"),
    openFolderIcon: "css : ui-icon ui-icon-folder-open",
    
    fileIcon: efico.get("eftree.file"),
    iIcon: efico.get("eftree.blank"),
    
    lIcon: efico.get("eftree.blank"),
    //lMinusIcon: efico.get("eftree.treeImgLminus"),
    lMinusIcon: "css:ui-icon  ui-theme-icon-minus ui-icon-triangle-1-s",
    //lPlusIcon: efico.get("eftree.treeImgLplus"),
    lPlusIcon: "css:ui-icon  ui-theme-icon-plus ui-icon-triangle-1-e",
    
    tIcon: efico.get("eftree.blank"),
    //tMinusIcon: efico.get("eftree.treeImgLminus"),
    tMinusIcon: "css:ui-icon  ui-theme-icon-minus ui-icon-triangle-1-s",
   // tPlusIcon: efico.get("eftree.treeImgLplus"),
    tPlusIcon: "css:ui-icon  ui-theme-icon-plus ui-icon-triangle-1-e",
    
    blankIcon: efico.get("eftree.blank")
};

/**
Tree constructor with treeModel, label and text. 
**/
function EFTree(sModel, sLabel, sText,sRightMenuDiv,sMenuDepth) {
    this.base = EFTreeTemplate;
    this.base(sModel, sLabel, sText);
    this._status = 0; //0-current, 1-selected
    this._current = null;
    this._selected = new Object();

    //debugger;
    this.hideRoot = false;
    this.emptyNodeAsLeaf = false;
    this.activeEmptyJudger = false;
    this.nodeInitializer = null;
    this.initialExpandDepth = null; //用来配置树展开的深度 
    this.clickableNodeNames = true;//默认点击树节点的文字能够展开和收起子树 
	this.param = null;
	this._useSearch = false;
	this._searchField = null;
	this._useCache = false;
	this._searchTarget = null;
	this.ancestorLbSet = null;
	    
	var nodeLabel = null;
	if (isAvailable(sModel) && isAvailable(sModel.nodeLabel))
	{
		nodeLabel = sModel.nodeLabel;
	}

	this._rootNode = new EFTreeNode(this, null, nodeLabel, this._text, false, null);
    
    this._rootNode.active(false);
    
    //右键菜单
    this._rightMenuDiv = sRightMenuDiv;
    this._menuDepth = parseInt(sMenuDepth);


    this._target = this._rootNode;
    this._jTreeDiv = document.createElement("div");    

    // 解决IE8下树高度自 应问 
    if($.browser.msie){
   		if(!!sLabel)
    		ef_treeIds[sLabel] = sLabel;
    	window.attachEvent("onload", function(){
    		for(var key in ef_treeIds){
        		var tree = $("#"+key);
        		if(tree.length == 0) return;
    			var parentDiv = tree.parent().filter('div');
    			if(parentDiv.length == 0) return;
    			var dHeight = 0;
    			var tmpObj = parentDiv;
    			while(tmpObj != null && dHeight == 0)
    			{
    				tmpObj = tmpObj.parent();
    				if(tmpObj.length == 0 || tmpObj.children().length > 1)
    					return;
    				dHeight = tmpObj.height();
    			}
    			parentDiv.height(dHeight);
    		}    	
     	});
    }
}

//EFTree.prototype.rightMenu = function (v) {
//    this._rightMenuDiv = v;
//}

EFTree.prototype = new EFTreeTemplate();

/**
 * EFTree渲染根DOM节点
 * @method render
 * @class EFTree 
 */
EFTree.prototype.render = function () {
    //debugger;
    this._jTreeDiv.innerHMTL = '';
    this._target.needRender(true);
    //为了给虚根节点一个ID
    var rootDom = this._target.render(this._label);
    
    if (this.initialExpandDepth != null && this.initialExpandDepth > 0)
        this.autoExpandTree();
    
    if (this.hideRoot) {
        this._rootNode.expand();
        this._jTreeDiv.appendChild(this._target._jTreeChildrenDiv);
    } else {
        this._jTreeDiv.appendChild(rootDom);
    }

    return this._jTreeDiv;
};

/**
 * 自动展开树到特定的层
 * @method autoExpandTree
 * @class EFTree 
 */
EFTree.prototype.autoExpandTree = function () {
//    if (!this.hideRoot) {
//        this._rootNode.expand(); //展开根节点 
//    }
    if (this.initialExpandDepth >=1) {
        //迭代展开深度以内的所有节点 
    	this._rootNode.expandIterative();
    }
};

EFTree.prototype.target = function (t) {
    if (t === undefined) { return this._target; }
    this._target = t;
};

EFTree.prototype.forward = function (lb) {
    var t = this._rootNode.getChildNode(lb);
    if (t != null) {
        this._target = t;
        this.render();
    }
};

EFTree.prototype.backward = function () {
    var p = this._target.parent();
    if (p != null) {
        this._target = p;
        this.render();
    }
};

EFTree.prototype.status = function (v) {
    if (v === undefined) { return this._status; }
    this._status = v;
};


/**
 * 重新加载数据，渲染整棵树 
 * @param {eiTreeModel}
 *         m:重绘树的数据模型
 * @method reload
 * @class EFTree 
 */
EFTree.prototype.reload = function (m) {
	   if (typeof m !== 'undefined'){
		   this._model = m;
	   }
	   
		if (isAvailable(this._model.nodeLabel))
		{
			this._rootNode._label = this._model.nodeLabel;
		}
		
		$(this._jTreeDiv).empty();
		
		this.reloadStatus = true;
		this._rootNode._jTreeNodeDIV = null;
	    this._rootNode.reload();
	    if (!!this.hideRoot){
	    	$(this._jTreeDiv).append(this._rootNode._jTreeChildrenDiv);
	    }else{
	    	$(this._jTreeDiv).append(this._rootNode._jTreeNodeDIV);
	    }
	    
	    this.reloadStatus = false;

	    if (this.initialExpandDepth != null && this.initialExpandDepth > 0){
	    	 this.autoExpandTree();
	    }
};

EFTree.prototype.rootNode = function () {
    return this._rootNode;
};

/**
 * 展开根节 
 * @method expand
 * @class EFTree 
 */
EFTree.prototype.expand = function () {
    this._rootNode.expand();
};

/**
 * 折叠根节 
 * @method collapse
 * @class EFTree 
 */
EFTree.prototype.collapse = function () {
    this._rootNode.collapse();
};

/**
 * 展开指定的子树节 
 * @method expandNode
 * @class EFTree 
 */
EFTree.prototype.expandNode = function (lb) {
    var _n = this.getNode(lb);
    var _t = _n;
    while (_t != null) {
        _t.expand();
        _t = _t.parent();
    }
    return _n;
};

EFTree.prototype.getChildNode = function (lb) {
    return this._rootNode.getChildNode(lb);
};

EFTree.prototype.getChildNodes = function () {
    return this._rootNode.getChildNodes();
};

EFTree.prototype.setCurrent = function (node) {
    for (var k in this._selected) {
        $(this._selected[k]._jNodeTextDiv).removeClass("ef-tree-item-current");
    }
    this._selected = new Object();
    if (this._current != null) {
        $(this._current._jNodeTextDiv).removeClass("ef-tree-item-current");
    }
    if (node._jNodeTextDiv != null) {
        $(node._jNodeTextDiv).addClass("ef-tree-item-current");
    }
    this._current = node;
};

EFTree.prototype.getCurrent = function () {
    return this._current;
};

EFTree.prototype._setSelected = function (node) {
    if (this._current != null && (this._current.label() == node.label())) {
        alert("return");
        return;
    }
    var _lb = node.label();
    if (this._selected[_lb]) {
        $(node._jNodeTextDiv).removeClass("ef-tree-item-current");
        delete this._selected[_lb];
    } else {
        this._selected[_lb] = node;
        $(node._jNodeTextDiv).addClass("ef-tree-item-current");
    }
};

EFTree.prototype.getSeleted = function () {
    var ar = new Array();
    for (var k in this._selected) {
        ar.push(this._selected[k]);
    }
    return ar;
};

EFTree.prototype.getOption = function () {
    if (this.option == null) { return "" ;};
    return this.option._label;
};

/**
 * 树结构中搜索的Input的监听事件
 * @param event
 */
EFTree.prototype.listenSearch  = function(event){
	if (event.which==13 || event.keyCode==13){
		//默认搜索text
		var field = 'text';
		var key = $('div#'+this._label).find('input#searchVal').val();
		
		this.search(field,key);
	}
};

/**
 * 渲染树搜索栏
 * @param v
 */
EFTree.prototype.renderSearchBar = function(){
	this._useSearch = true;
	var host = this;
	$('#'+this._label).append("<div id='_treeSearchDiv' class='treeSearchDiv'>" +
			"<input id='searchVal' class='treeSearchInputField'  />" +
			"<div id='_searchBarBtn' class='treeSearchButton'  style='float:right'><span class='ui-icon ui-icon-search'></span></div>" +
			"<div id= '_searchBarClear' class='searchBarClear'> <span class='ui-icon ui-icon-circle-close'></span></div>" +
			"</div>");
	$("#searchVal").focus(function(){
		  $("#_searchBarClear").css("display", "inline");
	}).blur(function(event){
		  $("#_searchBarClear").css("display", "none");
	}).keypress(function(event){
		host.listenSearch(event);
	});
	
	$('#_searchBarBtn').on('click',function(e){
		var field = 'text';
		var key = $('div#'+host._label).find('input#searchVal').val();
		host.search(field,key);
	});

	 $("#_searchBarClear").mousedown(function() {
			$("#searchVal").val('').focus();
	 });
};

/**
 * 搜索结果
 * @param v{string} 节点的label
 */
EFTree.prototype.searchTarget = function(v){
	if (v === undefined) { return this._searchTarget; }
	this._searchTarget.push(v);
};


/**
 * 是否启用缓存模式
 * @param v
 */
EFTree.prototype.useCache = function(v){
	if (v === undefined) { return this._useCache; }
	this._useCache = v;
};


/**
 * 设定树搜索的字段
 * @param v
 */
EFTree.prototype.searchField = function(v){
	if (v === undefined) { return this._searchField; }
	this._searchField = v;
};

/**
 * 根据label得到树祖先节点的label链
 * @param {String} lb  要搜索的值
 * @return {EFTTNode} 查找的节点
 */
EFTree.prototype.getAncestorChain = function(lb){
  var l = new Array();  
  var tlb = lb;
//  l.push(tlb);
  //循环向上至根节点  存储每层的label
  do{
    var p = this._model.getParent(tlb);
	if ( p != null && p!=this._model.nodeLabel) {
	  tlb = p.label;
  	  l.push(p.label);
	}
  }while( p!=null &&  p!=this._model.nodeLabel );
  return l;
};

/**
 * 树节点的搜索功能
 * @param field {String}:搜索字段
 * @param key  {String}:搜索关键字
 * Note:这个版本暂时只支持按label搜索
 */
EFTree.prototype.search = function(field,key){
	if (typeof field !=='string' || (field!=='text' && field!=='label')) {
		return;
	}
	if (key.trim().length == 0) {
		this.reload();
		return;
	}
	
	this.searchField(field);
	this._searchTarget = new Array();
	this.ancestorLbSet = new Array();
	
	//先获取和key匹配的节点的label
	this.targetLbs = new Array();
	var ret = this._model.getNodes(field,key);
	if (ret == null){
		return;
	}
	for (var i=0; i<ret.length; i++){
		this.targetLbs.push(ret[i].label);
	}
	
	this.targetLbs = $.unique(this.targetLbs);
	
	//构造祖先节点链
	var expandDepth = 0;
	for (var i=0; i<ret.length; i++){
	
		var chain = this.getAncestorChain(ret[i].label);
		if (chain.length  > expandDepth){
			expandDepth = this.hideRoot===true?chain.length:chain.length+1 ;
		}
		
		this.ancestorLbSet = $.merge(this.ancestorLbSet,chain);
	}
	
	this.ancestorLbSet = $.unique(this.ancestorLbSet);
	this.initialExpandDepth = expandDepth>=1?expandDepth:1;
 
   this._rootNode.needRender(true);
   this._rootNode._hasRendered = false;
   this._rootNode._jTreeNodeDIV = null;
    //迭代展开深度以内的所有节点 
   this._rootNode.expandIterativeForSearch(key);
    
    var target = this.searchTarget();
    if (target.length > 0){
	    	$(this._jTreeDiv).empty();
	    	for (var i=0; i<target.length; i++){
	  		  //将搜索到的节点展开
	  		target[i].expand();
	  		  //为搜索的节点添加Class
	  		  $(target[i]._jTreeNodeDIV).find(">.ef-tree-item-node").addClass('treeSearch');
	  		  
	  	    if (!!this.hideRoot == true){
	  	    	$(this._jTreeDiv).append(this._rootNode._jTreeChildrenDiv);
	  	    }else{
	  	    	$(this._jTreeDiv).append(this._rootNode._jTreeNodeDIV);
	  	    }
	  	}
   }else{
	   this.reload();
   }
};

/**
 * 树节 
 * @constructor
 * @class EFTreeNode 
 */
function EFTreeNode(sTree, sParent, sLabel, sText, sLeaf, sData) {
    this.base = EFTTNode;
    this.base(sTree, sParent, sLabel, sText, sLeaf, sData);
    this._jTreeNodeDIV = null;
    this._jBlankDiv = null;
    this._jNodeArchDiv = null;
    this._jNodeImgDiv = null;
    this._jTypeDiv = null;
    this._jNodeTextDiv = null;
    this._jTreeChildrenDiv = null;

    this._active = true;
    this._type = null;
    this._cIcon = null;
    this._oIcon = null;
    this._init = false;
    this._show = true;

    this._needRender = true;
    this._cascadeRender = false;

    this.menuData = null; //new absTreeModel();
    this._iconSrc = null;
    if (isAvailable(sTree) && isAvailable(sTree._model) && (typeof sTree._model.eiIcon=='function') && isAvailable(sData))
    {
    	if ($.trim(sData[sTree._model.eiIcon()]) != "")
    	{
    		this._iconSrc = sData[sTree._model.eiIcon()];
    	}
    }
}

EFTreeNode.prototype = new EFTTNode();

/**
 * 展开所有子节点
 */
EFTreeNode.prototype.expandAll = function () {
	this.expand();
	var subItems = this._childNodes;
    for (var k = 0; k < subItems.length; k++) {
        subItems[k].expandIterative();
    }
};

/**
 * @param {EFTreeNode} sNode 新增的节 
 */
EFTreeNode.prototype.addNode=function(sNode)
{
	this.expand(false);
	this._childNodes.push(sNode);
    this.needRender(true);
    this._hasRendered = false;
    this.render();
};

/**
 *  @param {EFTreeNode} sNode 删除的节 
 */
EFTreeNode.prototype.removeNode=function(sNode)
{
	this.expand(false);
	var index=$.inArray(sNode,this._childNodes);
	if(index>=0)
	{
		this._childNodes.splice(index,1);
	}
	
	// ��的子节点删不 2013/02/21 huangke 工作流树 子节点删除问 
	if(this._childNodes.length==0)
	{
		$(this._jTreeChildrenDiv).empty();
	}
	
	this.needRender(true);
	this._hasRendered = false;
	this.render();
};
/**
 * 自动展开指定深度内的 ��子树节点 
 * @constructor
 * @class EFTreeNode 
 */
EFTreeNode.prototype.expandIterative = function () {
	this.expand();
    if (this.depth() < this.tree().initialExpandDepth-1) {
    	var subItems = this._childNodes;
        for (var k = 0; k < subItems.length; k++) {
            subItems[k].expandIterative();
        }
    }
};

EFTreeNode.prototype.addMenuItem = function (parent, data, func) {

    if (!this.menuData)
    {
        this.menuData = new absTreeModel();
    }
    var flage = false;
    for (var key in data) {
        if (key == "imgSrc")
            flage = true;
    }
    if (!flage) {
        data["imgSrc"] = efico.get("efgrid.frontBlank");
    }
    this.menuData.addChild(parent, data);

    if (!!func) this.rightMenuFunc = func;
};

/**
* 树的右键生成菜单
**/

EFTreeNode.RightMenuData = {
    MenuName: "treeRightMenu"

};

EFTreeNode.prototype.genMenuName = function (menuName) {
    this.menuName = "eftree_" + EFTreeNode.RightMenuData.MenuName + "_div";
    return this.menuName;
};

EFTreeNode.prototype.rightMenuShow = function (event) {
		
	var tree = this.tree();
	
	if (!this.menuData && !isAvailable(tree._rightMenuDiv))
	{		
		 return;
	}
	else if (isAvailable(tree._rightMenuDiv))
	{
		//新的菜单方式
		
		//如果配置了菜单深 
		if (isAvailable(tree._rightMenuDiv))
		{
			if (this.depth() != tree._menuDepth)
				return;
		}
		var rMenu = $("#"+tree._rightMenuDiv);

		var leftPos = event.clientX;
		var topPos = event.clientY;
		
	    var redge = document.body.clientWidth - event.clientX;
	    var bedge = document.body.clientHeight - event.clientY;
	    if (redge < rMenu[0].offsetWidth) {
	    	leftPos = ($(document).scrollLeft() + event.clientX - rMenu[0].offsetWidth)+"px";
	    }
	    else {
	    	leftPos = ($(document).scrollLeft() + event.clientX)+"px";
	    }
	    if (bedge < rMenu[0].offsetHeight) {
	    	topPos = ($(document).scrollTop()+ event.clientY - rMenu[0].offsetHeight)+"px";
	    }
	    else {
	    	topPos = ($(document).scrollTop() + event.clientY)+"px";
	    }

	    rMenu.show();
        
		rMenu.css({"top":topPos, "left":leftPos, "visibility":"visible"});
		
	    //iframe上也响应click事件，隐藏右键菜 
	    $(getElem('iframe')).each(function(i,o){
	    	     o.contents().find('body').click(function(){
	    	    	rMenu.hide();
	    	     });
			});
		
		$("body").click(function(){
		 	rMenu.hide();
		});
		 
	}else {
		    var host = this;
		    var nMenu = new EFMenu(this.menuData, EFTreeNode.RightMenuData.MenuName, EFTreeNode.RightMenuData.MenuName);
		    //configMenu(nMenu);
		    nMenu.hoverExpand = function (n) { return true; };
		    nMenu.textClicked = function (node) {
		        //alert(node._jItemDIV.html());
		        var data = node.data();
		        try {
		            if (typeof data.func == "function")
		                data.func(host._label, node._label);
		        } catch (e) {
		            alert("函数名定义有误！");
		        }
		    };

		    nMenu._horizental = false;

		    nMenu.render();

		    var menu = nMenu._rootNode._jMenuDIV.get(0);
		    menu.id = this.genMenuName(EFTreeNode.RightMenuData.MenuName);

		    tNode = ef.get(menu.id);
		    if (!!tNode) {
		        tNode.parentNode.removeChild(tNode);
		    }	
		    
		    
		    document.body.appendChild(menu);

		    var redge = document.body.clientWidth - event.clientX;
		    var bedge = document.body.clientHeight - event.clientY;
		    if (redge < menu.offsetWidth) {
		        menu.style.left = ($(document).scrollLeft() + event.clientX - menu.offsetWidth)+"px";
		    }
		    else {
		        menu.style.left = ($(document).scrollLeft() + event.clientX)+"px";
		        menu.style.display = "block";
		    }
		    if (bedge < menu.offsetHeight) {
		        menu.style.top = ($(document).scrollTop() + event.clientY - menu.offsetHeight)+"px";
		    }
		    else {
		        menu.style.top = ($(document).scrollTop() + event.clientY)+"px";
		        menu.style.display = "block";
		    }
		    
		    //iframe上也响应click事件，隐藏右键菜 
		    $(getElem('iframe')).each(function(i,o){
		    	     o.contents().find('body').click(function(){
		    	    	 !!ef.get(host.menuName) ? ef.get(host.menuName).style.display = "none" : "";
		    	     });
				});
		    
		    document.body.onclick = function () {
		        !!ef.get(host.menuName) ? ef.get(host.menuName).style.display = "none" : "";
		    };
	}
	

};


/**
 * 查找嵌套的iframe中所有selector 元素，返回数 
 */
function getElem(selector, $root, $collection) {
    if (!$root) $root = $(document);
    if (!$collection) $collection = [];
    // Select all elements matching the selector under the root
    try{
    	$root.find(selector).contents();//解决IE下iframe中无内容时跨域异常问 
    }catch(e){
    	return $collection;
    }
    
    $root.find(selector).each(function()
    {
    	$collection.push($(this));
    });
    
//    if (!$collection) $collection = $();
//    // Select all elements matching the selector under the root
//    $collection.add($root.find(selector));
    
    
    // Loop through all frames
    $root.find('iframe,frame').each(function() {
        // Recursively call the function, setting "$root" to the frame's document
        getElem(selector, $(this).contents(), $collection);
        
    });
    
    return $collection;
   
}


EFTreeNode.prototype._initialize = function () {
    if (this.leaf()) {
        this._oIcon = EFTreeConfig.fileIcon;
        this._cIcon = EFTreeConfig.fileIcon;
    } else {
        this._oIcon = EFTreeConfig.openFolderIcon;
        this._cIcon = EFTreeConfig.folderIcon;
    }
    var _t = this.tree();
    var d = this.data();
    for (var key in d) {
        if (typeof this[key] == "undefined") {
            this[key] = d[key];
        }
    }
    if (_t.nodeInitializer != null) {
        _t.nodeInitializer(this);
    }

    this._init = true;
};

EFTreeNode.prototype.show = function (v) {
    if (v === undefined) { return this._show; }
    this._show = v;
};

EFTreeNode.prototype.type = function (v) {
    if (v === undefined) { return this._type; }
    this._type = v;
    if (this._type != null) {
        this._type.item = this;
    }
};

EFTreeNode.prototype.active = function (v) {
    if (v === undefined) { return this._; }
    this._active = v;
};

EFTreeNode.prototype.needRender = function (v) {
    if (v === undefined) { return true; }
    if (v === undefined) { return this._needRender; }
    this._needRender = v;
};

EFTreeNode.prototype.icon = function (v) {
    if (v === undefined) { return this._cIcon; }
    this._cIcon = v;
};

EFTreeNode.prototype.openIcon = function (v) {
    if (v === undefined) { return this._oIcon; }
    this._oIcon = v;
};

/**
 * 自动展开指定深度内的子树节点 
 * @constructor
 * @class EFTreeNode 
 */
EFTreeNode.prototype.expand = function (force) {
    //debugger;
    this._needRender = this._opened ? false : true;
    this._opened = true;
    
    //是否动态加载树的优先级：1级：局部，以force传入 2级.动态||静态树的全局配置tree.dynamic
   //3级：如果force和tree.dynamic都没有配置，则默认按动态树    
    if(typeof force === 'boolean')
    {
    	this.load(force);
    }
    else
    {
    	var tdynamic = this.tree().dynamic;
    	if (typeof  tdynamic === 'boolean'){
    		this.load(tdynamic);
    	}
    	else{
    		this.load(true);
    	}
    }
    if (this.tree()._model.status() == -1)
    {
    	this._opened = false;
    	return;
    }
    this.render();
};

EFTreeNode.prototype.collapse = function () {

    this._needRender = this._opened;
    this._opened = false;
    this.render();
};

EFTreeNode.prototype._hasnext = function () {
    if (this.top()) {
        return false;
    }
    var parentItem = this._parent;
    var subItems = parentItem._childNodes;
    for (var k = 0; k < subItems.length; k++) {
        if (this == subItems[k]) {
            if (k != subItems.length - 1) {
                return true;
            } else {
                return false;
            }
        }
    }
    return false;
};

/**
 * 点击子树节点后执行的函数 
 * @method onArchClicked
 * @class EFTreeNode 
 */
EFTreeNode.prototype.onArchClicked = function () {
    //debugger;	

    if (this._opened) {
        this.collapse();
    } else {
        this.expand();
    }
};

/**
 * 树节点中的图片后执行的函数 
 * @method onImageClicked
 * @class EFTreeNode 
 */
EFTreeNode.prototype.onImageClicked = function () {
    //debugger;
	
	//判断是否为叶子结点
	if (this._leaf !== true) {
	  this.onArchClicked();
    }
};

EFTreeNode.prototype.textClicked = function () {
};

/**
 * 树节点中的文本后执行的函数 
 * @method onTextClicked
 * @class EFTreeNode 
 */
EFTreeNode.prototype.onTextClicked = function () {
    var tr = this.tree();
    
    if(this.tree().clickableNodeNames && !this.leaf())
    	this.onArchClicked();
    
    switch (tr._status) {
        case 0:
            tr.setCurrent(this);
            this.textClicked();
            break;
        case 1:
            tr._setSelected(this);
            break;
    }
};

EFTreeNode.prototype.textContextMenu = function (node, event) {
    this.rightMenuShow(event);
};

EFTreeNode.prototype.onTextContextMenu = function (event) {
    this.textContextMenu(this, event);
};

EFTreeNode.prototype._createChildNode = function (child) {
    var node = new EFTreeNode(this.tree(), this, child['label'], child['text'], child['leaf'] == "1", child);
    //alert(child['label']+i++);
    return node;
};

EFTreeNode.prototype.textDom = function () {
    return this._jNodeTextDiv;
};

/**
 * 重新加载并刷新子树 
 * @method reload
 * @class EFTreeNode 
 */
EFTreeNode.prototype.reload = function () {
    this.load(true);
    this.needRender(true);
    this._hasRendered = false;
    this.render();
};

EFTreeNode.prototype._asLeaf = function () {
    var renderAsLeaf = this._leaf;
    if (!this._leaf) {
        if (this._status == 1 || this._opened) {
            if (this.tree().emptyNodeAsLeaf && this.getChildNodes().length == 0) {
                renderAsLeaf = true;
            }
        } else if (this.tree().activeEmptyJudger && this.getChildNodes().length == 0) {
            renderAsLeaf = true;
        }
    }
    return renderAsLeaf;
};

EFTreeNode.prototype._renderSkeleton = function (rootLabel) {
    var tree = this.tree();
    if (this._jTreeNodeDIV == null) {

        this._jTreeNodeDIV = document.createElement("div");
        
        //虚根节点的页面指定ID
        if (isAvailable(rootLabel)){
        	this.id = rootLabel;
        }else if (isAvailable(this._label))
        {
        	this.id = this._label;
        }
        
        this._jTreeNodeDIV.className = "ef-tree-item";

        if ($.browser.msie) {
            //this._jTreeNodeDIV.style.height = "100%";
        }
        this._jTreeNodeDIV.nowrap = "yes";
        this._jBlankDiv = document.createElement("span");
        
        //换成jQuery样式
        //this._jNodeArchDiv = document.createElement("img");
        this._jNodeArchDiv = document.createElement("div");

        this._jNodeImgDiv = document.createElement("div");
        this._jNodeImgDiv.style.display = "inline-block";
        if ($.browser.msie && $.browser.version == 6)
        {
            this._jNodeImgDiv.style.display = "inline";
            
        }
        this._jNodeTextDiv = document.createElement("a");
        this._jNodeTextDiv.innerHTML = " " + this._text + "";

        if (!this._init) {
            this._initialize();
        }
        if (this._active) {
            this._jNodeTextDiv.href = "javascript:void(0)";
        }
        this._jTypeDiv = document.createElement("span");
        this._jTreeChildrenDiv = document.createElement("div");

        var instance = this;
        /* onclick should return false in order to prevent IE trigger onbeforeunload unnecessarily */
        this._jNodeArchDiv.onclick = function () { instance.onArchClicked(); return false; };
        if (this._active) {
            this._jNodeTextDiv.onclick = function () { instance.onTextClicked(); return false; };
//            this._jNodeTextDiv.onblur= function () { alert(1);};
            
        }
        this._jNodeImgDiv.onclick = function () { instance.onImageClicked(); return false; };
        //this._jNodeTextDiv.bind( "contextmenu", function(){ instance.onTextContextMenu(); return false;	});	

        var _jqueryNodeTextDiv = $(this._jNodeTextDiv);
        //在ie下右键菜单可以safari下有问题
        _jqueryNodeTextDiv.bind("contextmenu", function (event) { instance.onTextContextMenu(event); return false; });
        //this._jNodeTextDiv.attachEvent( "oncontextmenu", function(event){ instance.onTextContextMenu(event); return false;	});	
        //$(this._jNodeTextDiv).bind( "contextmenu", function(){ instance.onTextContextMenu(); return false;	});	
    }
};

EFTreeNode.prototype._renderType = function () {
    //debugger;
    if (!!this._jTypeDiv) {
        this._jTypeDiv.innerHTML = '';
        if (this.type() != null) {
            var typeDom = this.type().render();
            this._jTypeDiv.appendChild(typeDom);
        }
    }
};


EFTreeNode.prototype._renderChildrenType = function () {
    //debugger;
    var children = this._childNodes;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var childType = child._type;
        if (!!child._jTypeDiv && (childType instanceof checkItemType || childType instanceof radioItemType))
            child._renderType();
        child._renderChildrenType();
    }
};

EFTreeNode.prototype._renderIndent = function () {
    var tree = this.tree();
    this._jBlankDiv.innerHTML = '';
    var tmpItem = this;
    var depth = this.depth();
    if (this.tree().hideRoot)
    	depth = depth-1;
    for (var j = depth; j > tree._target.depth(); j--) {
        if (tmpItem._parent != tree._target && tmpItem._parent._hasnext()) {
            //this._jBlankDiv.prepend( $("<img/>").attr( "src", EFTreeConfig.iIcon ) );
            this._jBlankDiv.innerHTML = "<img src=" + EFTreeConfig.iIcon + " />" + this._jBlankDiv.innerHTML;
        } else {
            //this._jBlankDiv.prepend( $("<img/>").attr( "src", EFTreeConfig.blankIcon ) );	
            this._jBlankDiv.innerHTML = "<img src=" + EFTreeConfig.blankIcon + " />" + this._jBlankDiv.innerHTML;
        }
        tmpItem = tmpItem._parent;
    }
    
    //增加样式
    $(this._jBlankDiv).addClass("ef-node-blank");

};

EFTreeNode.prototype._renderChildren = function (opened) {
    this._jTreeChildrenDiv.style.display = "none";

    if (opened) {
        this._jTreeChildrenDiv.style.display = "block";
//      if (!this._hasRendered) {
        //如果是动态树的话，由于数据children的数据有可能变了，所以DOM结构也要重绘。
        //PS:平台树在dynamic属性没有做配置的情况下，缺省为动态树
        if (this.tree().dynamic  !== false || !this._hasRendered){
            if (!!this._jTreeChildrenDiv.parentNode) {
                this._jTreeChildrenDiv.parentNode.removeChild(this._jTreeChildrenDiv);
                this._jTreeChildrenDiv = document.createElement("div");
                $(this._jTreeChildrenDiv).addClass("ef-tree-item-child");
                this._jTreeNodeDIV.appendChild(this._jTreeChildrenDiv);
                //this._jTreeChildrenDiv.innerHTML = '';
            }
            var children = this.getChildNodes();
            this._hasRendered = true;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var cDom = child.render();
                
                //增加头尾样式定义
                if (i == 0) {
                	cDom.className = cDom.className + " " + "first";
                }
                if (i == (children.length - 1)) {
                	cDom.className = cDom.className + " " + "last";
                }
                
                if (child._show) {
                    this._jTreeChildrenDiv.appendChild(cDom);
                }
            }
        }
    }
};

/**
* 从eiInfo中的图标字段信息构 树图 
* @private
* @return {string} 树图标_jNodeImgDiv的innerHTML的内容
*/
/*
//迁移至efico中 改用efico.buildIconHTML(this._iconSrc)代替
EFTreeNode.prototype.buildIconHTML = function () {
	if (null == this._iconSrc)
		return "";
	var _iconSrc = $.trim(this._iconSrc).toLowerCase();
	if (_iconSrc.indexOf('filename') != -1){     //指定的图标字段内容为图片路径，如：filename:./EF/Images/ef-tree-icon1.png
		return '<img src="' + $.trim(this._iconSrc).substr(9) + '"/>';
	}else if (_iconSrc.indexOf('css') != -1){    //指定的图标字段内容为CSS样式，如：css:ef-icon-query
		return '<span style="float:left" class= "' + $.trim(this._iconSrc).substr(5) + '"></span>';
	}else if (_iconSrc.indexOf('style') != -1){  //指定的图标字段内容为style,如：style:background:url(./EF/Images/ef_logo_iplat.png); background-repeat: no-repeat;
		return '<span style="float:left;' + $.trim(this._iconSrc).substr(6) + '"></span>';
	}
	return "";
}
*/

EFTreeNode.prototype._renderIconText = function (asLeaf) {
    var closedIcon = this._cIcon;
    var openIcon  = this._oIcon;
    
    this._jNodeTextDiv.innerHTML = " " + this._text + "";

    if (asLeaf) {
        if (this._hasnext()) {
            //this._jNodeArchDiv.src = EFTreeConfig.tIcon;
        } else {
            //this._jNodeArchDiv.src = EFTreeConfig.lIcon;
        }

        //如果指定了树节点的图 
     	if (null != this._iconSrc)
    	{
			this._jNodeImgDiv.innerHTML = efico.buildIconHTML(this._iconSrc);
    	}
        else
        {
			//改用buildIconHTML渲染 扩展可显示的图标种类
        	this._jNodeImgDiv.innerHTML = efico.buildIconHTML(closedIcon);
        	//this._jNodeImgDiv.innerHTML = "<img src='" + closedIcon + "' />";
        }
    } else {
        if (this._opened) {
            if (this._hasnext()) {
                //this._jNodeArchDiv.src = EFTreeConfig.tMinusIcon;
                this._jNodeArchDiv.innerHTML = efico.buildIconHTML(EFTreeConfig.tMinusIcon);
            } else {
                //this._jNodeArchDiv.src = EFTreeConfig.lMinusIcon;
                this._jNodeArchDiv.innerHTML = efico.buildIconHTML(EFTreeConfig.lMinusIcon);
            }
            //如果指定了树节点的图 
        	if (null != this._iconSrc)
        	{
        		this._jNodeImgDiv.innerHTML = efico.buildIconHTML(this._iconSrc);
        	}
            else{
            	//this._jNodeImgDiv.innerHTML = "<img src='" + openIcon + "' />";
        		this._jNodeImgDiv.innerHTML = efico.buildIconHTML(openIcon);
            }
        } else {
            if (this._hasnext()) {
                //this._jNodeArchDiv.src = EFTreeConfig.tPlusIcon;
                this._jNodeArchDiv.innerHTML = efico.buildIconHTML(EFTreeConfig.tPlusIcon);
            } else {
                //this._jNodeArchDiv.src = EFTreeConfig.lPlusIcon;
                this._jNodeArchDiv.innerHTML = efico.buildIconHTML(EFTreeConfig.lPlusIcon);
            }
            //如果指定了树节点的图 
        	if (null != this._iconSrc)
        	{
        		this._jNodeImgDiv.innerHTML =  efico.buildIconHTML(this._iconSrc);
        	}
            else
            {
                //this._jNodeImgDiv.innerHTML = "<img src='" + closedIcon + "' />";
        		this._jNodeImgDiv.innerHTML = efico.buildIconHTML(closedIcon);
            }
        }
    }
    
    $(this._jNodeImgDiv).addClass("ui-theme");
    $(this._jNodeArchDiv).addClass("ef-node-arch");
};


/**
 * 渲染子树节点对应的页面元素 
 * @method render
 * @class EFTreeNode 
 */
EFTreeNode.prototype.render = function (rootLabel) {
    this._renderSkeleton(rootLabel);
    this._renderType();

    //debugger;
    if (this.needRender() || this._cascadeRender) {
        this.needRender(false);
        this._cascadeRender = false;
    } else {
        //以下代码走不到 先注释 20131015
    	/*
    	var _nodeBody = document.createElement("div");
        $(_nodeBody).addClass("ef-tree-item-node");
        _nodeBody.appendChild(this._jBlankDiv);
        _nodeBody.appendChild(this._jNodeArchDiv);
        _nodeBody.appendChild(this._jTypeDiv);
        _nodeBody.appendChild(this._jNodeImgDiv);
        _nodeBody.appendChild(this._jNodeTextDiv);

        this._jTreeNodeDIV.appendChild(_nodeBody);
        this._jTreeNodeDIV.appendChild(this._jTreeChildrenDiv);
        this._renderChildrenType();

        return this._jTreeNodeDIV;
        */
    }


    this._renderIndent();
    var asLeaf = this._asLeaf();
    this._renderIconText(asLeaf);

    if (this._hasRendered !== true) { 
    	//避免重复渲染
    	if ($(this._jTreeNodeDIV).find(">.ef-tree-item-node").length == 0) {
	    	var _nodeBody = document.createElement("div");
	    	var _nodeUrl = this.url;
	    	var _nodeLabel = this._label;
	    	var _nodeItem = $(_nodeBody).addClass("ef-tree-item-node");
		    _nodeItem.data("label", _nodeLabel);
		    _nodeItem.data("text", this._text);
		    _nodeItem.data("url", _nodeUrl);
		    if (asLeaf) $(_nodeBody).addClass("leaf");
		    
		    _nodeBody.appendChild(this._jBlankDiv);
		    _nodeBody.appendChild(this._jNodeArchDiv);
		    _nodeBody.appendChild(this._jTypeDiv);
		    _nodeBody.appendChild(this._jNodeImgDiv);
		    _nodeBody.appendChild(this._jNodeTextDiv);	
		    this._jTreeNodeDIV.appendChild(_nodeBody);

		    //触发自定义事件 
		    //树节点渲染事件 可以个性化绑定
		    var _treeNode = this;
		    while (_treeNode._parent != null) _treeNode = _treeNode._parent;
		    $("#" + _treeNode.id).trigger("eftree_onRenderNode",  $(_nodeBody));
	    }
	    
	    this._jTreeNodeDIV.appendChild(this._jTreeChildrenDiv);
	    this._renderChildrenType();
    }
    
    //此部分代码与上部分调换顺序是为了解决reload时根节点的_jTreeNodeDIV没有append其_jTreeChildrenDiv的缺陷
    if (!asLeaf) {
        this._renderChildren(this._opened);
    }
    
    return this._jTreeNodeDIV;
};

/**
 * 迭代展开到和搜索关键字匹配的树节点
 * key {String} 搜索关键字
 */
EFTreeNode.prototype.expandIterativeForSearch = function (key) {
	this.expand();
    if (this.depth() <= this.tree().initialExpandDepth) {
    	var subItems = this._childNodes;
        for (var k = 0; k < subItems.length; k++) {
        	if ($.inArray(subItems[k].label(), this.tree().ancestorLbSet) != -1){
        		subItems[k].expandIterativeForSearch(key);
        	}else if ($.inArray(subItems[k].label(), this.tree().targetLbs) != -1){
        		this.tree().searchTarget(subItems[k]);
        	}
        }
    }
};

/**
 * 树节点类 
 */
function treeItemType() {
    this.item = null;
}

/**
 *  树节点checkBox类型 
 * @method render
 * @class EFTreeNode 
 * 
 * @param 是否默认勾中
 * @param 是否级联
 */
function checkItemType(pChecked, pCascade) {
    this.checked = false;
    this.cascade = true;
    if (pChecked != null) { this.checked = pChecked; };
    if (pCascade != null) { this.cascade = pCascade; };
    this._jqDom = null;
}
checkItemType.prototype = new treeItemType;

/**
 *  渲染checkBox类型的树节点
 * @method render
 * @class checkItemType 
 * 
 */
checkItemType.prototype.render = function () {
    var host = this;
    var ck = "";
    if (this.checked) {
        ck = "checked";
    }
    var t = "<input type='checkbox' " + ck + ">";
    var check = $(t);
    check.click(function () { host.onCheckBoxClicked(); });
    this._jqDom = check;
    return check.get(0);
};

/**
 * 用户自定义的checkBox点击回调事件 
 * @method checkboxClicked
 * @class checkItemType 
 * 
 */
checkItemType.prototype.checkboxClicked = function (cked) {

};

/**
 * 在checkBox被点击时调用的函 
 * @method onCheckBoxClicked
 * @class checkItemType 
 * 
 */
checkItemType.prototype.onCheckBoxClicked = function (c) {
    var bChecked = !this.checked;
    this.checkItem(bChecked);
    this.checkboxClicked(bChecked);
};

/**
 * 设置某个树节点的checkBox为checked状 ，以及在cascade状 下，同时设置其子树的checkbox为checked状  
 * @method checkItem
 * @class checkItemType 
 * 
 * @param bChecked checkBox对象
 */
checkItemType.prototype.checkItem = function (bChecked) {
    this.checked = bChecked;
    this.checkDom(bChecked);
    var node = this.item;
    if (this.cascade && node.open()) {
        for (var i = 0; i < node._childNodes.length; i++) {
            var sub = node._childNodes[i];
            if (sub._type instanceof checkItemType) { sub._type.checkItem(bChecked); }
        }
    }
};

/**
 * 设置某个树节点对应的DOM节点的checked属 标识为bChecked 
 * @method checkDom
 * @class checkItemType 
 * 
 * @param bChecked 是否勾  
 */
checkItemType.prototype.checkDom = function (bChecked) {

    this.checked = bChecked;
    this._jqDom.attr("checked", this.checked);
    //this._jqDom.checked = this.checked;	  
};

/**
 * 获取或 递归获取某个节点下的勾选的子节点 
 * @method getCheckedChildren
 * @class EFTreeNode 
 * 
 * @param bChecked 是否递归获取 
 */
EFTreeNode.prototype.getCheckedChildren = function (recursive) {
    var _selectedItems = [];

    for (var i = 0; i < this.getChildNodes().length; i++) {
        var node = this.getChildNodes()[i];
        var nodeType = node._type;

        if (nodeType instanceof checkItemType && nodeType.checked) {
            _selectedItems[_selectedItems.length] = node;
        }

        if (recursive)
            _addSelectedItems(node, _selectedItems, true);
    }

    return _selectedItems;
};

/**
 * 获取或 递归获取某个节点下的未勾选的子节点 
 * @method getUncheckedChildren
 * @class EFTreeNode 
 * 
 * @param bChecked 是否递归获取 
 */
EFTreeNode.prototype.getUncheckedChildren = function (recursive) {
    var _selectedItems = [];

    for (var i = 0; i < this.getChildNodes().length; i++) {
        var node = this.getChildNodes()[i];
        var nodeType = node._type;

        if (nodeType instanceof checkItemType && (!nodeType.checked)) {
            _selectedItems[_selectedItems.length] = node;
        }

        if (recursive)
            _addSelectedItems(node, _selectedItems, false);
    }

    return _selectedItems;
};

/**
 * 递归获取某个节点下勾选的子节点 
 * @method getCheckedNods
 * @class EFTreeNode 
 * 
 */
EFTree.prototype.getCheckedNods = function () {
    return this._rootNode.getCheckedChildren(true);
};

/**
 * 递归获取某个节点下的勾选子节点的名称列表 
 * @method getChecked
 * @class EFTreeNode 
 * 
 */
EFTree.prototype.getChecked = function () {
    var _selected = [];
    var nodes = this.getCheckedNods();
    for (var i = 0; i < nodes.length; i++) {
        _selected[_selected.length] = nodes[i].label();
    }
    return _selected;
};

function _addSelectedItems(item, _selectedItems, checked) {
    for (var i = 0; i < item._childNodes.length; i++) {
        var sub = item._childNodes[i];
        var subType = sub._type;
        if (subType instanceof checkItemType && (subType.checked === checked)) {
            _selectedItems[_selectedItems.length] = sub;
        }
        _addSelectedItems(sub, _selectedItems, checked);
    }
}

/**
 * radioButton树节点类 
 * @class radioItemType 
 * 
 */
function radioItemType(pChecked) {
    this.checked = false;
    if (pChecked != null) { this.checked = pChecked; };
    this._jqDom = null;

};


radioItemType.prototype = new treeItemType;

/**
 * 渲染radioButton类型的子节点
 * @method render
 * @class radioItemType 
 * 
 */
radioItemType.prototype.render = function () {
    var host = this;
    var ck = "";
    if (this.checked) {
        ck = "checked";
        this.item.tree().option = this.item;
    }
    var t = "<input type='radio' " + ck + ">";
    var check = $(t);
    check.click(function () { host.onRadioClicked(); });



    this._jqDom = check;
    return check.get(0);
};


/**
 * 用户自定义的树节点上radioButton被点击的函数
 * @method radioboxClicked
 * @class radioItemType 
 * 
 */
radioItemType.prototype.radioboxClicked = function (cked) {

};


/**
 * radioButton被点击时调用的函 
 * @method onRadioClicked
 * @class radioItemType 
 * 
 */
radioItemType.prototype.onRadioClicked = function () {
    var bChecked = !this.checked;
    this.checkItem(bChecked);
    this.radioboxClicked(bChecked);

};

/**
 * 设置选中某节 
 * @method onRadioClicked
 * @class radioItemType 
 * 
 * @param bChecked 
 */
radioItemType.prototype.checkItem = function (bChecked) {
    var tree = this.item.tree();

    if (!!tree.option && tree.option._label == this.item._label) {
        this.checkDom(false);
        tree.option = null;
    } else {
        if (!!tree.option) { tree.option._type.checkDom(false);};
        this.checkDom(true);
        tree.option = this.item;
    }
};

radioItemType.prototype.checkDom = function (bChecked) {
    this.checked = bChecked;
    this._jqDom.attr("checked", this.checked);
};

