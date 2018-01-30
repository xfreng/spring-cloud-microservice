EFTreeImagePath = EF_IMAGES_PATH;
/* 页面树节点Map对象 */
var ef_treeIds = new Object();

var EFTreeConfig = {
    rootIcon: efico.get("eftree.folderIcon"),
    openRootIcon: efico.get("eftree.openFolderIcon"),
    folderIcon: efico.get("eftree.folderIcon"),
    openFolderIcon: efico.get("eftree.openFolderIcon"),
    fileIcon: efico.get("eftree.file"),
    iIcon: efico.get("eftree.blank"),
    lIcon: efico.get("eftree.blank"),
    lMinusIcon: efico.get("eftree.treeImgLminus"),
    lPlusIcon: efico.get("eftree.treeImgLplus"),
    tIcon: efico.get("eftree.blank"),
    tMinusIcon: efico.get("eftree.treeImgLminus"),
    tPlusIcon: efico.get("eftree.treeImgLplus"),
    blankIcon: efico.get("eftree.blank")
};

/**
Tree constructor with treeModel, label and text. 
**/
function EFTree(sModel, sLabel, sText,sRightMenuDiv,sMenuDepth) {

    //debugger;	
    //debugger;	
	
	//base不是一个特殊的东西，只是EFTree本身的一个属性，调用时名称方便
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
    this.initialExpandDepth = null; //用来配置树展开的深度。
    this.clickableNodeNames = true;//默认点击树节点的文字能够展开和收起子树。
	this.param = null;
	    
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

    // 解决IE8下树高度自适应问题
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

//EFTree将EFTreeTemplate克隆一份作为自身的一部分
EFTree.prototype = new EFTreeTemplate();



/**
 * EFTree渲染根DOM节点
 * @method render
 * @class EFTree类
 */
EFTree.prototype.render = function () {
    //debugger;
    this._jTreeDiv.innerHMTL = '';
    this._target.needRender(true);
    //为了给虚根节点一个ID
    var rootDom = this._target.render(this._label);
    if (this.hideRoot) {
        this._rootNode.expand();
        this._jTreeDiv.appendChild(this._target._jTreeChildrenDiv);
    } else {
        this._jTreeDiv.appendChild(rootDom);
    }

    if (this.initialExpandDepth != null && this.initialExpandDepth > 0)
        this.autoExpandTree();

    return this._jTreeDiv;
}

/**
 * 自动展开树到特定的层
 * @method autoExpandTree
 * @class EFTree类
 */
EFTree.prototype.autoExpandTree = function () {
//    if (!this.hideRoot) {
//        this._rootNode.expand(); //展开根节点。
//    }
    if (this.initialExpandDepth >=1) {
        //迭代展开深度以内的所有节点。
    	this._rootNode.expandIterative();
    }
}

EFTree.prototype.target = function (t) {
    if (t === undefined) { return this._target; }
    this._target = t;
}

EFTree.prototype.forward = function (lb) {
    var t = this._rootNode.getChildNode(lb);
    if (t != null) {
        this._target = t;
        this.render();
    }
}

EFTree.prototype.backward = function () {
    var p = this._target.parent();
    if (p != null) {
        this._target = p;
        this.render();
    }
}

EFTree.prototype.status = function (v) {
    if (v === undefined) { return this._status; }
    this._status = v;
}


/**
 * 重新加载数据，渲染整棵树。
 * @param {eiTreeModel}
 *         m:重绘树的数据模型
 * @param {String}
 *         id:需要渲染树的容器DIV的id，通常是页面上标签<EFTree id=''.../>中的标签中的id，当然
 *         也可以是其它任何DIV的id.
 * @method reload
 * @class EFTree类
 */
EFTree.prototype.reload = function (m,id) {
    this._model = m;
	if (isAvailable(m.nodeLabel))
	{
		this._rootNode._label = m.nodeLabel;
	}
    this._rootNode.reload();
    $('#'+id).append(this._rootNode._jTreeNodeDIV);
}

EFTree.prototype.rootNode = function () {
    return this._rootNode;
}

/**
 * 展开根节点
 * @method expand
 * @class EFTree类
 */
EFTree.prototype.expand = function () {
    this._rootNode.expand();
}

/**
 * 折叠根节点
 * @method collapse
 * @class EFTree类
 */
EFTree.prototype.collapse = function () {
    this._rootNode.collapse();
}

/**
 * 展开指定的子树节点
 * @method expandNode
 * @class EFTree类
 */
EFTree.prototype.expandNode = function (lb) {
    var _n = this.getNode(lb);
    var _t = _n;
    while (_t != null) {
        _t.expand();
        _t = _t.parent();
    }
    return _n;
}


EFTree.prototype.getChildNode = function (lb) {
    return this._rootNode.getChildNode(lb);
}

EFTree.prototype.getChildNodes = function () {
    return this._rootNode.getChildNodes();
}

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
}

EFTree.prototype.getCurrent = function () {
    return this._current;
}

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
}

EFTree.prototype.getSeleted = function () {
    var ar = new Array();
    for (var k in this._selected) {
        ar.push(this._selected[k]);
    }
    return ar;
}

/**
 * 树节点
 * @constructor
 * @class EFTreeNode类
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
    


}

EFTreeNode.prototype = new EFTTNode();

/**
 * @param {EFTreeNode} sNode 新增的节点
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
 *  @param {EFTreeNode} sNode 删除的节点
 */
EFTreeNode.prototype.removeNode=function(sNode)
{
	this.expand(false);
	var index=$.inArray(sNode,this._childNodes);
	if(index>=0)
	{
		this._childNodes.splice(index,1);
	}
	
	//最后的子节点删不掉 2013/02/21 huangke 工作流树 子节点删除问题 
	if(this._childNodes.length==0)
	{
		$(this._jTreeChildrenDiv).empty();
	}
	
	this.needRender(true);
	this._hasRendered = false;
	this.render();
};
/**
 * 自动展开指定深度内的所有子树节点。
 * @constructor
 * @class EFTreeNode类
 */
EFTreeNode.prototype.expandIterative = function () {
	
	this.expand();
    if (this.depth() < this.tree().initialExpandDepth-1) {
    	var subItems = this._childNodes;
        for (var k = 0; k < subItems.length; k++) {
            subItems[k].expandIterative();
        }
    }
}

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
}

/**
* 树的右键生成菜单
**/

EFTreeNode.RightMenuData = {
    MenuName: "treeRightMenu"

}

EFTreeNode.prototype.genMenuName = function (menuName) {
    this.menuName = "eftree_" + EFTreeNode.RightMenuData.MenuName + "_div";
    return this.menuName;
}

EFTreeNode.prototype.rightMenuShow = function (event) {
		
	var tree = this.tree();
	
	if (!this.menuData && !isAvailable(tree._rightMenuDiv))
	{		
		 return;
	}
	else if (isAvailable(tree._rightMenuDiv))
	{
		//新的菜单方式
		
		//如果配置了菜单深度
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
		
	    //iframe上也响应click事件，隐藏右键菜单
	    $(getElem('iframe')).each(function(i,o){
	    	     o.contents().find('body').click(function(){
	    	    	rMenu.hide();
	    	     });
			});
		
		$("body").click(function(){
		 	rMenu.hide();
		});
		 
	}else {
        	var x = event.clientX;
			var y = event.clientY;

		    var host = this;
		    var nMenu = new EFMenu(this.menuData, EFTreeNode.RightMenuData.MenuName, EFTreeNode.RightMenuData.MenuName);
		    //configMenu(nMenu);
		    nMenu.hoverExpand = function (n) { return true; }
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
		    
		    //iframe上也响应click事件，隐藏右键菜单
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
}

EFTreeNode.prototype.show = function (v) {
    if (v === undefined) { return this._show; }
    this._show = v;
}

EFTreeNode.prototype.type = function (v) {
    if (v === undefined) { return this._type; }
    this._type = v;
    if (this._type != null) {
        this._type.item = this;
    }
}

EFTreeNode.prototype.active = function (v) {
    if (v === undefined) { return this._; }
    this._active = v;
}



EFTreeNode.prototype.needRender = function (v) {
    if (v === undefined) { return true; }
    if (v === undefined) { return this._needRender; }
    this._needRender = v;
}

EFTreeNode.prototype.icon = function (v) {
    if (v === undefined) { return this._cIcon; }
    this._cIcon = v;
}

EFTreeNode.prototype.openIcon = function (v) {
    if (v === undefined) { return this._oIcon; }
    this._oIcon = v;
}

/**
 * 自动展开指定深度内的所有子树节点。
 * @constructor
 * @class EFTreeNode类
 */
EFTreeNode.prototype.expand = function (force) {
    //debugger;
    this._needRender = this._opened ? false : true;
    this._opened = true;
    
//    this.load(true);
    if(typeof force=='undefined')
    {
    	 this.load(true);
    }
    else
    {
    	this.load(force);
    }
    if (this.tree()._model.status() == -1)
    {
    	this._opened = false;
    	return;
    }
    this.render();
    

}

EFTreeNode.prototype.collapse = function () {

    this._needRender = this._opened;
    this._opened = false;
    this.render();
}

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
}

/**
 * 点击子树节点后执行的函数。
 * @method onArchClicked
 * @class EFTreeNode类
 */
EFTreeNode.prototype.onArchClicked = function () {
    //debugger;	

    if (this._opened) {
        this.collapse();
    } else {
        this.expand(this.tree().dynamic);
    }
}

/**
 * 树节点中的图片后执行的函数。
 * @method onImageClicked
 * @class EFTreeNode类
 */
EFTreeNode.prototype.onImageClicked = function () {
    this.onArchClicked();
}

EFTreeNode.prototype.textClicked = function () {
}
/**
 * 树节点中的文本后执行的函数。
 * @method onTextClicked
 * @class EFTreeNode类
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
}

EFTreeNode.prototype.textContextMenu = function (node, event) {
    this.rightMenuShow(event);
}

EFTreeNode.prototype.onTextContextMenu = function (event) {
    this.textContextMenu(this, event);
}
i=0;
EFTreeNode.prototype._createChildNode = function (child) {
    var node = new EFTreeNode(this.tree(), this, child['label'], child['text'], child['leaf'] == "1", child);
    //alert(child['label']+i++);
    return node;
}

EFTreeNode.prototype.textDom = function () {
    return this._jNodeTextDiv;
}

/**
 * 重新加载并刷新子树。
 * @method reload
 * @class EFTreeNode类
 */
EFTreeNode.prototype.reload = function () {
    this.load(true);
    this.needRender(true);
    this._hasRendered = false;
    this.render();
}

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
}

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
            this._jTreeNodeDIV.style.height = "100%";
        }
        this._jTreeNodeDIV.nowrap = "yes";
        this._jBlankDiv = document.createElement("span");
        this._jNodeArchDiv = document.createElement("img");
        this._jNodeImgDiv = document.createElement("img");
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
}

EFTreeNode.prototype._renderType = function () {
    //debugger;
    if (!!this._jTypeDiv) {
        this._jTypeDiv.innerHTML = '';
        if (this.type() != null) {
            var typeDom = this.type().render();
            this._jTypeDiv.appendChild(typeDom);
        }
    }
}


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
}

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
}

EFTreeNode.prototype._renderChildren = function (opened) {
    this._jTreeChildrenDiv.style.display = "none";

    if (opened) {
        this._jTreeChildrenDiv.style.display = "block";
        if (!this._hasRendered) {

            if (!!this._jTreeChildrenDiv.parentNode) {
                this._jTreeChildrenDiv.parentNode.removeChild(this._jTreeChildrenDiv);
                this._jTreeChildrenDiv = document.createElement("div");
                this._jTreeNodeDIV.appendChild(this._jTreeChildrenDiv);
                //this._jTreeChildrenDiv.innerHTML = '';
            }
            var children = this.getChildNodes();
            this._hasRendered = true;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var cDom = child.render();
                if (child._show) {
                    this._jTreeChildrenDiv.appendChild(cDom);
                }
            }
        }
    }
};

EFTreeNode.prototype._renderIconText = function (asLeaf) {
    var closedIcon = this._cIcon;
    var openIcon = this._oIcon;

    this._jNodeTextDiv.innerHTML = " " + this._text + "";

    if (asLeaf) {
        if (this._hasnext()) {
            this._jNodeArchDiv.src = EFTreeConfig.tIcon;
        } else {
            this._jNodeArchDiv.src = EFTreeConfig.lIcon;
        }
        this._jNodeImgDiv.src = closedIcon;
    } else {
        if (this._opened) {
            if (this._hasnext()) {
                this._jNodeArchDiv.src = EFTreeConfig.tMinusIcon;
            } else {
                this._jNodeArchDiv.src = EFTreeConfig.lMinusIcon;
            }
            this._jNodeImgDiv.src = openIcon;
        } else {
            if (this._hasnext()) {
                this._jNodeArchDiv.src = EFTreeConfig.tPlusIcon;
            } else {
                this._jNodeArchDiv.src = EFTreeConfig.lPlusIcon;
            }
            this._jNodeImgDiv.src = closedIcon;
        }
    }
}

/**
 * 渲染子树节点对应的页面元素。
 * @method render
 * @class EFTreeNode类
 */
EFTreeNode.prototype.render = function (rootLabel) {
    this._renderSkeleton(rootLabel);
    this._renderType();
    var asLeaf = this._asLeaf();
    if (this.needRender() || this._cascadeRender) {
        this.needRender(false);
        this._cascadeRender = false;
    } else {
        this._jTreeNodeDIV.appendChild(this._jBlankDiv);
        this._jTreeNodeDIV.appendChild(this._jNodeArchDiv);
        this._jTreeNodeDIV.appendChild(this._jTypeDiv);

        this._jTreeNodeDIV.appendChild(this._jNodeImgDiv);
        this._jTreeNodeDIV.appendChild(this._jNodeTextDiv);
        this._jTreeNodeDIV.appendChild(this._jTreeChildrenDiv);
        this._renderChildrenType();

        return this._jTreeNodeDIV;
    }


    this._renderIndent();
    
    this._renderIconText(asLeaf);

    if (!asLeaf) {
        this._renderChildren(this._opened);
    }
    this._jTreeNodeDIV.appendChild(this._jBlankDiv);
    if (!asLeaf)
    {
    	if (this.tree().hideRoot && this.depth()>1) 
    	{
    	    this._jTreeNodeDIV.appendChild(this._jNodeArchDiv);
    	}
    }
    else
    {
//        this._jTreeNodeDIV.appendChild(this._jNodeArchDiv);
    }
    
    this._jTreeNodeDIV.appendChild(this._jTypeDiv);
    
    if (!asLeaf)
    {
    	if (this.tree().hideRoot && this.depth()==1)
    	{
    	    this._jTreeNodeDIV.appendChild(this._jNodeImgDiv);
    	}
    }
    else
    {
    	 this._jTreeNodeDIV.appendChild(this._jNodeImgDiv);
    }

    this._jTreeNodeDIV.appendChild(this._jNodeTextDiv);
    this._jTreeNodeDIV.appendChild(this._jTreeChildrenDiv);
    this._renderChildrenType();

    return this._jTreeNodeDIV;
}

/**
 * 树节点类型
 */
function treeItemType() {
    this.item = null;
}

/**
 *  树节点checkBox类型。
 * @method render
 * @class EFTreeNode类
 * 
 * @param 是否默认勾中
 * @param 是否级联
 */
function checkItemType(pChecked, pCascade) {
    this.checked = false;
    this.cascade = true;
    if (pChecked != null) { this.checked = pChecked };
    if (pCascade != null) { this.cascade = pCascade };
    this._jqDom = null;
}
checkItemType.prototype = new treeItemType;

/**
 *  渲染checkBox类型的树节点
 * @method render
 * @class checkItemType类
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
}

/**
 * 用户自定义的checkBox点击回调事件。
 * @method checkboxClicked
 * @class checkItemType类
 * 
 */
checkItemType.prototype.checkboxClicked = function (cked) {

}

/**
 * 在checkBox被点击时调用的函数
 * @method onCheckBoxClicked
 * @class checkItemType类
 * 
 */
checkItemType.prototype.onCheckBoxClicked = function (c) {
    var bChecked = !this.checked;
    this.checkItem(bChecked);
    var toCheck = this.checkboxClicked(bChecked);
};

/**
 * 设置某个树节点的checkBox为checked状态，以及在cascade状态下，同时设置其子树的checkbox为checked状态。
 * @method checkItem
 * @class checkItemType类
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
}

/**
 * 设置某个树节点对应的DOM节点的checked属性标识为bChecked。
 * @method checkDom
 * @class checkItemType类
 * 
 * @param bChecked 是否勾选。
 */
checkItemType.prototype.checkDom = function (bChecked) {

    this.checked = bChecked;
    this._jqDom.attr("checked", this.checked);
    //this._jqDom.checked = this.checked;	  
};

/**
 * 获取或者递归获取某个节点下的所有勾选子节点。
 * @method getCheckedChildren
 * @class EFTreeNode类
 * 
 * @param bChecked 是否递归获取。
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
}
/**
 * 获取或者递归获取某个节点下的所有未勾选的子节点。
 * @method getUncheckedChildren
 * @class EFTreeNode类
 * 
 * @param bChecked 是否递归获取。
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
}

/**
 * 递归获取某个节点下的所有勾选子节点。
 * @method getCheckedNods
 * @class EFTreeNode类
 * 
 */
EFTree.prototype.getCheckedNods = function () {
    return this._rootNode.getCheckedChildren(true);
}

/**
 * 递归获取某个节点下的所有勾选子节点的名称列表。
 * @method getChecked
 * @class EFTreeNode类
 * 
 */
EFTree.prototype.getChecked = function () {
    var _selected = [];
    var nodes = this.getCheckedNods();
    for (var i = 0; i < nodes.length; i++) {
        _selected[_selected.length] = nodes[i].label();
    }
    return _selected;
}

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
 * radioButton树节点类型
 * @class radioItemType类
 * 
 */
function radioItemType(pChecked) {
    this.checked = false;
    if (pChecked != null) { this.checked = pChecked };
    this._jqDom = null;

}
radioItemType.prototype = new treeItemType;

/**
 * 渲染radioButton类型的子节点
 * @method render
 * @class radioItemType类
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
}


/**
 * 用户自定义的树节点上radioButton被点击的函数
 * @method radioboxClicked
 * @class radioItemType类
 * 
 */
radioItemType.prototype.radioboxClicked = function (cked) {

};


/**
 * radioButton被点击时调用的函数
 * @method onRadioClicked
 * @class radioItemType类
 * 
 */
radioItemType.prototype.onRadioClicked = function () {
    var bChecked = !this.checked;
    this.checkItem(bChecked);
    this.radioboxClicked(bChecked);

}

/**
 * 设置选中某节点
 * @method onRadioClicked
 * @class radioItemType类
 * 
 * @param bChecked 
 */
radioItemType.prototype.checkItem = function (bChecked) {
    var tree = this.item.tree();

    if (tree.option && tree.option._label == this.item._label) {
        this.checkDom(false);
        tree.option = null;
    } else {
        if (tree.option) { tree.option._type.checkDom(false);};
        this.checkDom(true);
        tree.option = this.item;
    }
};

radioItemType.prototype.checkDom = function (bChecked) {
    this.checked = bChecked;
    this._jqDom.attr("checked", this.checked);
}

EFTree.prototype.getOption = function () {
    if (this.option == null) { return "" };
    return this.option._label;
}