/**
 * 垫片类，用于页面div窗口的显示辅助.
 * 
 * @author wuyicang
 */

/**
 * @class efShim 垫片类，用于页面div窗口的显示辅助
 * @constructor
 */
efShim = function(){}

/**
 * 显示垫片.
 * 
 * @param {Object} div_node	: 垫片关联的div结点对象;
 * 
 * @return void.
 */
efShim.openShim = function( div_node )
{
	//debugger;
    if (div_node == null) return;
    var shim = efShim.getShim(div_node);
    if (shim==null) shim = efShim.createMenuShim(div_node,efShim.getShimId(div_node));    
    var div_style = div_node.style; 
    div_style.zIndex = 200;
   	var style_obj = shim.style; 
    style_obj.width = div_node.offsetWidth;
    style_obj.height = div_node.offsetHeight;
    style_obj.top = div_style.top;
    style_obj.left = div_style.left;
    style_obj.zIndex = div_style.zIndex - 1;
    style_obj.position = "absolute";
    style_obj.display = "block";
}

/**
 * 关闭垫片.
 * 
 * @param {Object} div_node	: 垫片关联的div结点对象;
 * 
 * @return void.
 */
efShim.closeShim = function(div_node)
{
    if (div_node==null) return;
    var shim = efShim.getShim(div_node);
    if (shim) shim.style.display = "none";
}

/**
 * 创建垫片.
 * 
 * @param {Object} div_node	: 垫片关联的div结点对象;
 * 
 * @return {Object} 垫片对应div结点.
 */
efShim.createMenuShim = function(div_node)
{
    if (div_node==null) return null;
    var shim = $("<iframe scrolling='no' frameborder='0' style='position:absolute;top:0px;left:0px;display:none'></iframe>").get(0); 
    shim.name = efShim.getShimId(div_node);
    shim.id = efShim.getShimId(div_node);
   
    if (div_node.offsetParent==null || div_node.offsetParent.id=="") 
        window.document.body.appendChild(shim);
    else 
        div_node.offsetParent.appendChild(shim); 
	
    return shim;
}

/**
 * 获得垫片对应div的id.
 * 
 * @param {Object} div_node
 * 
 * @return {String} 垫片对应div的id.
 */
efShim.getShimId = function(div_node)
{
   	return "ef_shim";
}

/**
 * 移动垫片.
 * 
 * @param {Number} left	: 移动到的顶点横坐标;
 * @param {Number} top	: 移动到的顶点纵坐标;
 * 
 * @return void.
 */
efShim.moveTo = function( left, top )
{
	var shim = efShim.getShim( null );
	if( shim == null ) return;
	shim.style.top = top;
    shim.style.left = left;
}

/**
 * 获得垫片对应div结点.
 * 
 * @param {Object} div_node	: 垫片关联的div结点对象;
 * 
 * @return {Object} 垫片对应div结点.
 */
efShim.getShim = function(div_node)
{
    return document.getElementById(efShim.getShimId(div_node));
}