/*!
 * iplat.ui.menuTree.js
 * @Copyright Copyright 2013, baosight.com
 * @Description: Replace iplat4j existing menuTree with jQuery accordion style.
 * @Author: shaohuan@baosight.com
 * @Depend: jquery-1.7.js, iplat.ui.treetemplate.js, jquery.ui.accordion.js
 * 
*/

/**
 * Tree constructor with treeModel, label and text. 
 * @constructor
 * @param {Object} sModel: 数据模型.
 * @param {String} sLabel: 树标记.
 * @param {String} sText:  树节点文字.
**/
function EFMenuTree( sModel, sLabel, sText) {
  this.base = EFTreeTemplate;
  this.base(sModel,sLabel,sText);
}

/**
 * 将EFMenuTree构造函数的prototype设为父类EFTreeTemplate的对象实例
 */
EFMenuTree.prototype = new EFTreeTemplate();

/**
* 与accordion整合，生成outLookTree
* @param {String} id:树标签生成时
*/
EFMenuTree.prototype.render = function(id){
  var host = this;
  var treeRoot = $('#'+id);
  var accordion = null;
  if (treeRoot.parent().prop('tagName').toLowerCase() == 'div')
  {
	  accordion = treeRoot.parent();
	  treeRoot.remove();
  }
  else
  {
	  accordion = treeRoot;
  }
  var sModel = this._model;
  var sLabel = sModel.nodeLabel;
  var service = sModel.service;
  
  //拿到第一级节点
  if (!!sLabel)
  {
	 subTrees = sModel.getChildren(sLabel);
  }
  else
  {
	 subTrees = sModel.getChildren('$');
  }
   
  for (var i=0; i<subTrees.length; i++)   {
	var subTree = subTrees[i];
    var _subNode = efico.buildIconHTML(subTree.imagePath);
    _subNode = _subNode + subTree.text;
	
	//叶子结点和树节点区分
	if (subTree.leaf === "1") {
	    accordion.append("<h3 class='leaf' id=" + subTree.label + ">"  + _subNode + '</h3>').attr('label',subTree.label);
	} else  {
		accordion.append("<h3 id=" + subTree.label + ">"  + _subNode + '</h3>').attr('label',subTree.label);
	}

	//默认加载展开第一棵子树
	if (i == 0)
	{
		var subTreeModel =  new eiTreeModel(service,subTree.label);
		subTreeModel.eiIcon(sModel.eiIcon());
        var nTree = new EFTree(subTreeModel, 'nTree_'+subTree.label, "","","1");
        if (typeof host.configFunc == "function" ){
    	  host.configFunc(nTree);	      
        }
		accordion.append("<div id=nTree_" + subTree.label + "></div>");
		$('#nTree_'+subTree.label).append(nTree.render());
		$('nTree_'+subTree.label).data('rendered',true);
	} 	else 	{
		if (subTree.leaf === "0") {
		  accordion.append("<div id=nTree_" + subTree.label + "></div>");
		}
	}
  }
  
	 accordion.accordion({
		header : "h3",
		heightStyle : "fill",
		fillSpace : true,
		beforeActivate : function(event, args) {
			//debugger;
			//判断是否为叶子结点
			if ($(event.srcElement).hasClass("leaf")) {
				//如果为叶子结点 不展开
				return false;
			}
			if (!!args['newHeader'].data('rendered'))
				return;
			var label = args['newHeader'].attr('id');
			var subTreeModel = new eiTreeModel(service, label);
			subTreeModel.eiIcon(sModel.eiIcon());
			var sub_tree = new EFTree(subTreeModel, 'nTree_' + label, "", "",
					"1");
			if (typeof host.configFunc == "function") {
				host.configFunc(sub_tree);
			}
			var dom_tree = sub_tree.render();
			if (subTreeModel.status() != -1) {
				args['newContent'].empty();
				args['newContent'].append(dom_tree);
				args['newHeader'].data('rendered', true);
			} else {
				event.preventDefault();
			}
		}

	});
}



