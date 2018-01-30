
/**
 *  图标文件url指定
 *
 */



efico = function() {
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

	var node=document.getElementById(node_id);
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
 * EFRegion控件的图片定义
 * @type
 */
efico.efregion = {
	"expand": 	[EF_IMAGES_PATH, "efregion_expand.gif"],
	"collapse": [EF_IMAGES_PATH, "efregion_collapse.gif"],
	"clear":	[EF_IMAGES_PATH,"efregion_clear.gif"],
	"save":		[EF_IMAGES_PATH,"efregion_save.gif"],
	"load":		[EF_IMAGES_PATH,"efregion_load.gif"],
	"delete":   [EF_IMAGES_PATH,"ef_pop_up_delete.gif"]
}


/**
 * 页面的图片定义
 * @type
 */
efico.efpage = {
    "divHeadLine":	[EF_IMAGES_PATH,"bgline01.gif"],
    "menuDivBgImg":	[EF_IMAGES_PATH,"bgline02.gif"],
    "topDivBgImg":	[EF_IMAGES_PATH,"ef_top_bg.gif"],
    //修改口令图标
    "changePwd":	[EF_IMAGES_PATH,"ChangePwd.png"],
    "changePwdOn":	[EF_IMAGES_PATH,"ChangePwd-on.png"],
    //注销图标
    "logOut":		[EF_IMAGES_PATH,"LogOut.png"],
    "logOutOn":		[EF_IMAGES_PATH,"LogOut-on.png"],
    //切换窗口图标
    "popUpWinInact":	[EF_IMAGES_PATH,"pop_up_win_inact.gif"],
    "popUpWindow":	[EF_IMAGES_PATH,"pop_up_window.gif"],
    "popUpWinInactOn":	[EF_IMAGES_PATH,"pop_up_win_inact-on.gif"],
    "popUpWindowOn":	[EF_IMAGES_PATH,"pop_up_window-on.gif"],
    //splitter
    "middleSplitter":	[EF_IMAGES_PATH,"splitter_bg.jpg"]
}

/**
 * EFGrid控件的图片定义
 * @type
 */
efico.efgrid = {
	"pageSum":[EF_IMAGES_PATH,"efgrid_sum_page.png"],
	"totalSum":[EF_IMAGES_PATH,"efgrid_sum_total.png"],
	"pagingCount":[EF_IMAGES_PATH,"efgrid_paging_count.gif"],
	"addRow":[EF_IMAGES_PATH,"efgrid_add_row.gif"],
	"jumpPage":[EF_IMAGES_PATH,"efgrid_jump_page.gif"],
	"pageFirst":[EF_IMAGES_PATH,"efgrid_page_first.gif"],
	"pagePrevious":[EF_IMAGES_PATH,"efgrid_page_previous.gif"],
	"pageNext":[EF_IMAGES_PATH,"efgrid_page_next.gif"],
	"pageLast":[EF_IMAGES_PATH,"efgrid_page_last.gif"],
	"pageFirstDisabled":[EF_IMAGES_PATH,"efgrid_page_first_disabled.gif"],
	"pagePreviousDisabled":[EF_IMAGES_PATH,"efgrid_page_previous_disabled.gif"],
	"pageNextDisabled":[EF_IMAGES_PATH,"efgrid_page_next_disabled.gif"],
	"pageLastDisabled":[EF_IMAGES_PATH,"efgrid_page_last_disabled.gif"],
	"newForm":[EF_IMAGES_PATH,"ef_new_form.gif"],
	"blueDivider":[EF_IMAGES_PATH,"efbuttonbar_blue_divider.gif"],
	"gridBlueDivider":[EF_IMAGES_PATH,"efgrid_blue_divider.gif"],
	"gridBlueDivider2":[EF_IMAGES_PATH,"efgrid_blue_divider2.gif"],

	"columnSortAscend":[EF_IMAGES_PATH,"efcolumn_sort_ascend.gif"],
	"columnSortDecend":[EF_IMAGES_PATH,"efcolumn_sort_decend.gif"],
	"columnSortFlage":[EF_IMAGES_PATH,"efcolumn_sort_flage.gif"],
	"customColumn":[EF_IMAGES_PATH,"efgrid_custom_column.gif"],
	"frontAsc":[EF_IMAGES_PATH,"efgrid_front_asc.gif"],
	"frontBlank":[EF_IMAGES_PATH,"efgrid_front_blank.gif"],
	"frontDesc":[EF_IMAGES_PATH,"efgrid_front_desc.gif"],
	"pageJump":[EF_IMAGES_PATH,"efgrid_page_jump.jpg"]



}

/**
 * EFTab控件的图片定义
 * @type
 */
efico.eftab = {
	"tab1" 	: 		[EF_IMAGES_PATH,"tab1.gif"],
	"tab1Bottom" : 	[EF_IMAGES_PATH,"tab1_bottom.gif"],
	"tab2" : 		[EF_IMAGES_PATH,"tab2.gif"],
	"tab2Bottom": 	[EF_IMAGES_PATH,"tab2_bottom.gif"],
	"tab3" : 		[EF_IMAGES_PATH,"tab3.gif"],
	"tab3Bottom": 	[EF_IMAGES_PATH,"tab3_bottom.gif"],

	//"cornerLeftGrey": 	[EF_IMAGES_PATH,"eftab_corner_left_grey.gif"],
	//"cornerRightGrey": 	[EF_IMAGES_PATH,"eftab_corner_right_grey.gif"],

	"tabLeft": 	[EF_IMAGES_PATH,"tab-left.gif"],
	"tabRight": 	[EF_IMAGES_PATH,"tab-right.gif"],
	"tabHouseBg": 	[EF_IMAGES_PATH,"tag_house_bg.gif"],
	"tabHouseOff": 	[EF_IMAGES_PATH,"tag_house_off.gif"],
	"tabHouseOn": 	[EF_IMAGES_PATH,"tag_house_on.gif"],

	"tabBtn":	[EF_IMAGES_PATH,"btn.gif"],
	"tabClose":	[EF_IMAGES_PATH,"tab-close.gif"],
    "tabBtnLeft":		[EF_IMAGES_PATH,"btnleft.gif"],
    "tabBtnRight":		[EF_IMAGES_PATH,"btnright.gif"],
    "efformClose":		[EF_IMAGES_PATH,"close.gif"]

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
	"treeImgLminus"	:	[EF_IMAGES_PATH,"eftree_lminus.jpg"],
	"treeImgLplus"	:	[EF_IMAGES_PATH,"eftree_lplus.jpg"],
	"openFolderIcon"	:	[EF_IMAGES_PATH,"eftree_openfoldericon.png"],
	"treeImgT"	:	[EF_IMAGES_PATH,"eftree_t.png"],
	"treeImgTminus"	:	[EF_IMAGES_PATH,"eftree_tminus.png"],
	"treeImgTplus"	:	[EF_IMAGES_PATH,"eftree_tplus.png"],
	"treeImgForum"	:	[EF_IMAGES_PATH,"forum.gif"],
	"treeImgGroup"	:	[EF_IMAGES_PATH,"group.gif"],
	"treeImgActv"	:	[EF_IMAGES_PATH,"shw_tree_actv.gif"],
	"treeImgInActv"	:	[EF_IMAGES_PATH,"shw_tree_inactv.gif"],
	"padUp"	:	[EF_IMAGES_PATH,"eftree_padUp.gif"],
	"padDown"	:	[EF_IMAGES_PATH,"eftree_padDown.gif"]

}

/**
 * EFPortlet控件的图片定义
 * @type
 */
efico.efportlet = {
	"close"	:	[EF_IMAGES_PATH,"eview_close.gif"],
	"closeHover"	:	[EF_IMAGES_PATH,"eview_close_hover.gif"],
	"config"	:	[EF_IMAGES_PATH,"eview_config.gif"],
	"configHover"	:	[EF_IMAGES_PATH,"eview_config_hover.gif"],
	"expand"	:	[EF_IMAGES_PATH,"eview_expand.gif"],
	"expandHover"	:	[EF_IMAGES_PATH,"eview_expand_hover.gif"],
	"maximize"	:	[EF_IMAGES_PATH,"eview_maximize.gif"],
	"maximizeHover"	:	[EF_IMAGES_PATH,"eview_maximize_hover.gif"],
	"minimize"	:	[EF_IMAGES_PATH,"eview_minimize.gif"],
	"minimizeHover"	:	[EF_IMAGES_PATH,"eview_minimize_hover.gif"],
	"noexpand"	:	[EF_IMAGES_PATH,"eview_noexpand.gif"],
	"noexpandHover"	:	[EF_IMAGES_PATH,"eview_noexpand_hover.gif"]


}

/**
 * EFCalendar控件的图片定义
 * @type
 */
efico.efcalendar = {
	"closeImg": 	[EF_IMAGES_PATH,"efcalendar_close.gif"],
	"dividerImg": 	[EF_IMAGES_PATH,"efcalendar_divider.gif"],
	"drop1Img": 	[EF_IMAGES_PATH,"efcalendar_drop1.gif"],
	"drop2Img": 	[EF_IMAGES_PATH,"efcalendar_drop2.gif"],
	"iconImg": 	[EF_IMAGES_PATH,"efcalendar_icon.gif"],
	"left1Img": 	[EF_IMAGES_PATH,"efcalendar_left1.gif"],
	"left2Img": 	[EF_IMAGES_PATH,"efcalendar_left2.gif"],
	"right1Img": 	[EF_IMAGES_PATH,"efcalendar_right1.gif"],
	"right2Img": 	[EF_IMAGES_PATH,"efcalendar_right2.gif"]


}

/**
 * EFCalendarSpan控件的图片定义
 * @type
 */
efico.efcalendarSpan = {
	"closeImg": 	[EF_IMAGES_PATH,"efcalendar_close.gif"],
	"dividerImg": 	[EF_IMAGES_PATH,"efcalendar_divider.gif"],
	"drop1Img": 	[EF_IMAGES_PATH,"efcalendar_drop1.gif"],
	"drop2Img": 	[EF_IMAGES_PATH,"efcalendar_drop2.gif"],
	"iconImg": 	[EF_IMAGES_PATH,"efcalendar_icon.gif"],
	"left1Img": 	[EF_IMAGES_PATH,"efcalendar_left1.gif"],
	"left2Img": 	[EF_IMAGES_PATH,"efcalendar_left2.gif"],
	"right1Img": 	[EF_IMAGES_PATH,"efcalendar_right1.gif"],
	"right2Img": 	[EF_IMAGES_PATH,"efcalendar_right2.gif"]


}

/**
 * EFFrom的图片定义
 * @type
 */
efico.efform = {
        "normal":  [EF_IMAGES_PATH, "efform_status_green.gif"],
        "alert":   [EF_IMAGES_PATH, "efform_status_yellow.gif"],
        "error":   [EF_IMAGES_PATH, "efform_status_red.gif"],
        "loading": [EF_IMAGES_PATH, "efform_status_loading.gif"],
        "close":   [EF_IMAGES_PATH, "efform_close.gif"],
        "help":	   [EF_IMAGES_PATH,"efform_help.gif"],
        "print":   [EF_IMAGES_PATH,"efform_prnt_avail.gif"],
        "full":    [EF_IMAGES_PATH,"efform_full_screen.gif"],
        "tofull":    [EF_IMAGES_PATH,"efform_tofull_screen.gif"],
        "dev":	   [EF_IMAGES_PATH,"efform_ico_dev.gif"],
        "run":	[EF_IMAGES_PATH,"efform_ico_run.gif"],

        "ajaxLoader":	[EF_IMAGES_PATH,"ajax-loader.gif"],
        "ajaxLoading":	[EF_IMAGES_PATH,"ajax-loading.gif"],
        "bg01":			[EF_IMAGES_PATH,"bg01.jpg"],
        "btn":			[EF_IMAGES_PATH,"btn.gif"],
        "btnAfresh":	[EF_IMAGES_PATH,"btn_afresh.gif"],
        "btnLogin":		[EF_IMAGES_PATH,"btn_login.gif"],



        "closeDialog":	[EF_IMAGES_PATH,"close_dialog.gif"],
        "closeWindow":	[EF_IMAGES_PATH,"close_window.jpg"],
        "efBbgline01":	[EF_IMAGES_PATH,"ef_b_bgline01.jpg"],
        "efCascadeSelectDown":	[EF_IMAGES_PATH,"ef_cascade_select_down.jpg"],
        "efCascadeSelectOn":	[EF_IMAGES_PATH,"ef_cascade_select_on.jpg"],



        "efExportPdf":	[EF_IMAGES_PATH,"ef_export_pdf.jpg"],
        "efExportXls":	[EF_IMAGES_PATH,"ef_export_xls.jpg"],



        "efImgList":	[EF_IMAGES_PATH,"ef_list.gif"],
        "efLogoCommon":	[EF_IMAGES_PATH,"ef_logo_common.jpg"],
        "efLogoIplat":	[EF_IMAGES_PATH,"ef_logo_iplat.jpg"],

        "efPopupWindow":	[EF_IMAGES_PATH,"ef_pop_up_window.gif"],

        //动态查询
        "efQueryDy":	[EF_IMAGES_PATH,"ef_query_dy.gif"],
        "efQueryDynamic":	[EF_IMAGES_PATH,"ef_query_dynamic.gif"],
        "efQuerySimple":	[EF_IMAGES_PATH,"ef_query_simple.gif"],


        "efImgTemp":	[EF_IMAGES_PATH,"ef_temp.gif"],
        "efImgTopbg":	[EF_IMAGES_PATH,"ef_top_bg.jpg"],
        "efImgTopRightbg":	[EF_IMAGES_PATH,"ef_top_rightbg.jpg"],

        "return":	[EF_IMAGES_PATH,"efform_return.gif"],
        "statusLoading":	[EF_IMAGES_PATH,"efform_status_loading.gif"],

        "bottomLeft":	[EF_IMAGES_PATH,"efframe_bottom_left.jpg"],
        "templateBottom":	[EF_IMAGES_PATH,"template-bottom.jpg"],
        "efframeLeft":	[EF_IMAGES_PATH,"efframe_left.jpg"],
        "efframeRight":	[EF_IMAGES_PATH,"efframe_right.jpg"],
        "efframeBottomMiddle":	[EF_IMAGES_PATH,"efframe_bottom_middle.jpg"],
        "efframeBottomRight":	[EF_IMAGES_PATH,"efframe_bottom_right.jpg"],
        "efframeMainMenuBg":	[EF_IMAGES_PATH,"efframe_mainmenubg.gif"],
        "efframeMenuDown":	[EF_IMAGES_PATH,"efframe_menudown.gif"],
        "efframeMenuUp":	[EF_IMAGES_PATH,"efframe_menuup.gif"],

        "imgImax":	[EF_IMAGES_PATH,"i_max.gif"],
        "imgImin":	[EF_IMAGES_PATH,"i_min.gif"],
        "imgInormal":	[EF_IMAGES_PATH,"i_normal.gif"],
        "imgIcoDown":	[EF_IMAGES_PATH,"ico_down.gif"],
        "imgIcoUp":	[EF_IMAGES_PATH,"ico_up.gif"],
        "imgKey":	[EF_IMAGES_PATH,"key.gif"],
        "imgRole":	[EF_IMAGES_PATH,"role.gif"],

        "imgSpacer":	[EF_IMAGES_PATH,"spacer.gif"],
        "imgSplitterBg":	[EF_IMAGES_PATH,"splitter_bg.gif"],

        "templateBottom":	[EF_IMAGES_PATH,"template-bottom.gif"],
        "templateTop":	[EF_IMAGES_PATH,"template-top.gif"],
        "imgUser":	[EF_IMAGES_PATH,"user.gif"],

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

/**
 * 个性化需要用到的图片定义
 * @type
 */
efico.personalStyle = {
	"imgFootBg07":	[EF_IMAGES_PATH,"foot_bg07.gif"],
	"imgBtnBg":	[EF_IMAGES_PATH,"btn_bg.gif"],
	"imgMainBg07":	[EF_IMAGES_PATH,"main_bg07.gif"],
	"imgThbg07":	[EF_IMAGES_PATH,"thbg07.gif"],
	"imgTitBg07":	[EF_IMAGES_PATH,"tit_bg07.gif"]

}

