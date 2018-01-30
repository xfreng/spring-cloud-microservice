
/**
 *  图标文件url指定
 *
 */
efico = function() {
}

/* 返回某个图标CSS名称 */
efico.getCss = function (ico_name)
{

	str=ico_name.split(".");
	model=str[0];
	name=str[1];
	return efico[model][name][2];
}

/* 返回某个图标的路径+名称 */
efico.get = function (ico_name)
{

	str=ico_name.split(".");
	model=str[0];
	name=str[1];
	return efico[model][name][0]+efico[model][name][1];
}

/* 返回某个图标的名称 */
efico.getName = function(ico_name) {
	str=ico_name.split(".");
	model=str[0];
	name=str[1];
    return efico[model][name][1];
}

/**
 * 设定dom节点的背景图片
 * @param {} node_id
 * @param {} ico_name
 */
efico.setNodeIcoUrl = function(node_id,ico_name){

	var node=$('#'+node_id)[0];
	node.style.background = 'url('+efico.get(ico_name)+')';

}

/**
 * 设定dom节点的图片地址
 * @param {} node_id
 * @param {} ico_name
 */
efico.setImageSrc = function(node_id,ico_name){
	var node ;
	if(typeof node_id == "object")
		node= node_id;
	else
		node = window.document.getElementById(node_id);
	node.onload = null;
	node.src = efico.get(ico_name);
}

/**
 * 设定dom节点的图片地址(添加类形式)
 * @param {} node_id
 * @param {} ico_class
 */
efico.addImgClass = function(node_id,ico_class){
	var node ;
	if(typeof node_id == "object")
		node= node_id;
	else
		node = window.document.getElementById(node_id);
	node.onload = null;
	
	$(node).addClass(ico_class);
};

/**
* 根据图标描述字符串的内容解析出HTML内容
* @private
* @return {string} 树图标_jNodeImgDiv的innerHTML的内容
*/
efico.buildIconHTML = function (iconSrc) {

    var image_name_info = $.trim(iconSrc);
    if (image_name_info =="") return "";
    
//    image_name_info= image_name_info.toLowerCase().split(":");
    /*由于路径对大小写敏感，所以toLowerCase可能会导致文件路径出错*/
    image_name_info= image_name_info.split(":");
    
    if (image_name_info.length == 0) {
    	return "";
    } 
	if (image_name_info.length == 1) {
	    	return "<img src='" + image_name_info[0] + "'/>";
	} 
	
	//支持"CSS","STYLE"以及"FILENAME"的大小写以及混写（"fileName","FileName"等）的形式
	var _iconType = image_name_info[0].toLowerCase().trim();
	
   	switch (_iconType) {
    	//指定的图标字段内容为CSS样式，如：css:ef-icon-query
    	case "css":
			return "<span class='ef-node-icon " + image_name_info[1] + "'></span>";
    		break;
		//指定的图标字段内容为style,如：style:background:url(./EF/Images/ef_logo_iplat.png); background-repeat: no-repeat;	    	
		case "style":
			return "<span style='" + image_name_info[1] + "'></span>";
    		break;
    	//指定的图标字段内容为图片路径，如：filename:./EF/Images/ef-tree-icon1.png
    	case "filename":
	    	return "<img src='" + image_name_info[1] + "'/>";
    		break;
    	}

};

/**
 * EFPage控件的图片定义
 * @type
 */
efico.efpage = {
        
        "changeStyle":	[EF_IMAGES_PATH,"changeStyle.png"],
        "changeStyleOn":	[EF_IMAGES_PATH,"changeStyleOn.png"],

	    "changePwd":	[EF_IMAGES_PATH,"ChangePwd.png"],
	    "changePwdOn":	[EF_IMAGES_PATH,"ChangePwd-on.png"],

	    "logOut":		[EF_IMAGES_PATH,"LogOut.png"],
	    "logOutOn":		[EF_IMAGES_PATH,"LogOut-on.png"],

	    "popUpWinInact":	[EF_IMAGES_PATH,"pop_up_win_inact.gif"],
	    "popUpWindow":	[EF_IMAGES_PATH,"pop_up_window.gif"],
	    "popUpWinInactOn":	[EF_IMAGES_PATH,"pop_up_win_inact-on.gif"],
	    "popUpWindowOn":	[EF_IMAGES_PATH,"pop_up_window-on.gif"]
	                     	 
}


/**
 * EFGrid控件的图片定义
 * @type
 */
efico.efgrid = {
	"addRow":[EF_IMAGES_PATH,"efgrid_add_row.png"],
	"pageFirst":[EF_IMAGES_PATH,"efgrid_page_first_normal.png"],
	"pagePrevious":[EF_IMAGES_PATH,"efgrid_page_previous_normal.png"],
	"pageNext":[EF_IMAGES_PATH,"efgrid_page_next_normal.png"],
	"pageLast":[EF_IMAGES_PATH,"efgrid_page_last_normal.png"],
	"newForm":[EF_IMAGES_PATH,"ef_new_form.png"],

	"frontAsc":[EF_IMAGES_PATH,"efgrid_front_asc.gif"],
	"frontBlank":[EF_IMAGES_PATH,"efgrid_front_blank.gif"],
	"frontDesc":[EF_IMAGES_PATH,"efgrid_front_desc.gif"],

	//添加css定义 20130507
	"columnSortAscend":[EF_IMAGES_PATH, "efcolumn_sort_ascend.gif",  "ui-icon ui-icon-arrow-1-n"],
	"columnSortDecend":[EF_IMAGES_PATH, "efcolumn_sort_decend.gif",  "ui-icon ui-icon-arrow-1-s"]

}

/**
 * EFTab控件的图片定义
 * @type
 */
efico.eftab = {
	"tab1" 	: 		[EF_IMAGES_PATH,""],
	"tab2" : 		[EF_IMAGES_PATH,""],
	"tab3" : 		[EF_IMAGES_PATH,""]

}

/**
 * EFMenu控件的图片定义
 * @type
 */
efico.efmenu = {
	"arrowDown"	:	[EF_IMAGES_PATH,"efmenu_arrowdown.png"],
	"arrowRight"	:	[EF_IMAGES_PATH,"efmenu_arrowright.png"],
	"arrowRight2"	:	[EF_IMAGES_PATH,"efmenu_arrowright2.png"]


}

/**
 * EFTree控件的图片定义
 * @type
 */
efico.eftree = {
	"blank"	:	[EF_IMAGES_PATH,"eftree_blank.png"],
	"cu"	:	[EF_IMAGES_PATH,"eftree_cu.gif"],
	"file"	:	[EF_IMAGES_PATH,"eftree_file.png"],
	"folderIcon"	:	[EF_IMAGES_PATH,"eftree_foldericon.png"],
	"treeImgI"	:	[EF_IMAGES_PATH,"eftree_i.png"],
	"treeImgL"	:	[EF_IMAGES_PATH,"eftree_l.png"],
	"treeImgLminus"	:	[EF_IMAGES_PATH,"eftree_lminus.png"],
	"treeImgLplus"	:	[EF_IMAGES_PATH,"eftree_lplus.png"],
	"openFolderIcon"	:	[EF_IMAGES_PATH,"eftree_openfoldericon.png"],
	"treeImgT"	:	[EF_IMAGES_PATH,"eftree_t.png"],
	"treeImgTminus"	:	[EF_IMAGES_PATH,"eftree_tminus.png"],
	"treeImgTplus"	:	[EF_IMAGES_PATH,"eftree_tplus.png"],
	"treeImgForum"	:	[EF_IMAGES_PATH,"forum.gif"],
	"treeImgGroup"	:	[EF_IMAGES_PATH,"group.gif"],
	"treeImgActv"	:	[EF_IMAGES_PATH,"shw_tree_actv.gif"],
	"treeImgInActv"	:	[EF_IMAGES_PATH,"shw_tree_inactv.gif"],
	"padUp"	:	[EF_IMAGES_PATH,"eftree_padUp.png"],
	"padDown"	:	[EF_IMAGES_PATH,"eftree_padDown.png"],
	"menuBarLeft":  [EF_IMAGES_PATH,"eftree_menuBarLeft.png"]
}


/**
 * EFCalendar控件的图片定义
 * @type
 */
efico.efcalendar = {
	"iconImg": 	[EF_IMAGES_PATH,"efcalendar_icon.png"]
}

/**
 * EFFrom的图片定义
 * @type
 */
efico.efform = {
        "dev":	   [EF_IMAGES_PATH,"efform_ico_dev.png"],
        "ajaxLoader":	[EF_IMAGES_PATH,"ajax-loader.gif"],
        "statusLoading":	[EF_IMAGES_PATH,"efform_status_loading.gif"],
        "efImgList":	[EF_IMAGES_PATH,"ef_list.png"],
        "efPopupWindow":	[EF_IMAGES_PATH,"ef_pop_up_window.png"],
        
        "efQueryDynamic":	[EF_IMAGES_PATH,"ef_query_dynamic.gif"],
        "efQuerySimple":	[EF_IMAGES_PATH,"ef_query_simple.gif"],
        "efframeMenuDown":	[EF_IMAGES_PATH,"efframe_menudown.gif"],
        "efframeMenuUp":	[EF_IMAGES_PATH,"efframe_menuup.gif"],
        
        "imgVgrabber":	[EF_IMAGES_PATH,"vgrabber.gif"]
}

/**
 * 报表模块的图片定义
 * @type
 */
efico.efreport = {

        "efFalseClear":	[EF_IMAGES_PATH,"ef_false.png"],
        "efImgFunction":	[EF_IMAGES_PATH,"ef_function.png"],
        "efDetail":	[EF_IMAGES_PATH,"ef_detail.png"],
        "efImgFind":	[EF_IMAGES_PATH,"ef_find.png"],
        "efImgHelp":	[EF_IMAGES_PATH,"ef_help.png"],
        "efCommand":	[EF_IMAGES_PATH,"ef_command.png"],
        "efDefine":	[EF_IMAGES_PATH,"ef_define.png"],
        "efPageDistanceDown":	[EF_IMAGES_PATH,"ef_pageDistance_down.jpg"],
        "efPageDistanceTop":	[EF_IMAGES_PATH,"ef_pageDistance_top.jpg"],
        "efImgPrint":	[EF_IMAGES_PATH,"ef_print.png"],
        "efImgPrintConfig":	[EF_IMAGES_PATH,"ef_print_config.png"],
        "efImgPrintHorizontal":	[EF_IMAGES_PATH,"ef_print_horizontal.jpg"],
        "efImgPrintVertical":	[EF_IMAGES_PATH,"ef_print_vertical.jpg"],
        "efImgRight":	[EF_IMAGES_PATH,"ef_right.png"],
        "efImgSave":	[EF_IMAGES_PATH,"ef_save.png"]
}
