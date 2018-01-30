/**
 * 在页面加载完成后，进行用户自定义的初始化	
 * @member efform
 * @return void
 */
function efform_onload(){}

/**
 * 在数据列单元格生成或刷新时调用，用于自定义单元格的显示。
 * @param {Object} div_html	:	单元格默认生成的html字符串
 * @param {Object} row_index	:	单元格所处行号，从0开始
 * @param {Object} col_index	:	单元格所处行号，从0开始
 * @param {Object} col_value	:	单元格数据值
 * @param {Object} display_value	:	单元格的显示字符串
 * @param {Object} grid_id	:	单元格所在表格id
 * @return 返回值	应为用户自定义处理过后的html字符串
 * @member efgrid
 */
function efgrid_onCellDisplayReady( div_html, row_index,
	col_index, col_value, display_value, grid_id ){
		
	}
/**
 * 在固定列单元格生成或刷新时调用，用于自定义单元格的显示
 * @param {Object} div_html		:	单元格默认生成的html字符串
 * @param {Object} row_index	:	单元格所处行号，从0开始
 * @param {Object} col_index	:	单元格所处行号，从0开始
 * @param {Object} col_value	:	单元格数据值
 * @param {Object} display_value	:	单元格的显示字符串
 * @param {Object} grid_id		:	单元格所在表格id
 * @return 返回值应为用户自定义处理过后的html字符串
 * @member efgrid
 */
function efgrid_onFixCellDisplayReady( div_html, row_index,
	col_index, col_value, display_value, grid_id ){
		
	}	

/**
 * 在表格显示完成后，进行用户自定义的操作
 * @param {Object} paintDivElement	:	表格对应的div层DOM结点对象
 * @return null
 * @member efgrid
 */	
function efgrid_onGridDisplayReady( paintDivElement ){
}	
/**
 * 数据列中指定显示为链接或按钮的单元格，点击后的回调函数
 * @param {Object} grid_id		:	表格id
 * @param {Object} row_index	:	单元格所处行号，从0开始
 * @param {Object} col_index	:	单元格所处行号，从0开始
 * @param {Object} cell_value	:	单元格的数据值
 * @return null
 * @member efgrid
 */
function efgrid_onDataCellClick( grid_id, row_index, col_index,
 	cell_value ){
}

/**
 * 固定列中指定显示为链接或按钮的单元格，点击后的回调函数
 * @param {Object} grid_id		:	表格id
 * @param {Object} row_index	:	单元格所处行号，从0开始
 * @param {Object} col_index	:	单元格所处行号，从0开始
 * @param {Object} cell_value	:	单元格的数据值
 * @return null
 * @member efgrid
 */
function efgrid_onFixCellClick( grid_id, row_index, col_index,
 	cell_value ){
}
/**
 * 每一行左侧复选框点击时的回调（选中和取消选中均触发）
 * @param {Object} grid_id		:	对应的表格id
 * @param {Object} row_index	:	复选框所处行号，从0开始
 * @param {Object} div_node		:	包含该复选框的div层DOM节点对象
 * @return 无返回值，但可通过操作div_node改变选中状态
 * @member efgrid
 */
function efgrid_onRowCheckboxClicked( grid_id, row_index,
div_node ){
	
}
/**
 * 每一行左侧复选框点击后的回调（选中和取消选中均触发）
 * @param {Object} grid_id		:	对应的表格id
 * @param {Object} row_index	:	复选框所处行号，从0开始
 * @param {Object} div_node		:	包含该复选框的div层DOM节点对象
 * @return 无返回值，但可通过操作div_node改变选中状态
 * @member efgrid
 */
function efgrid_afterRowCheckboxClicked( grid_id, row_index,
div_node ){
	
}
/**
 * 全选复选框点击时的回调（选中和取消选中均触发）
 * @param {Object} grid_id	:	对应的表格id
 * @param {Object} div_node	:	包含该复选框的div层DOM节点对象
 * @return 返回值为true表示允许改变状态，返回值为false表示不允许改变，并可通过操作div_node改变选中状态
 * @member efgrid
 */
function efgrid_onSelectAllClicked( grid_id, div_node ){
	
}

/**
 * 表格创建新行按钮被点击后进行的回调
 * @member efgrid
 * @param {Object} grid_id	:	对应的表格id
 * @return 返回值为true表示允许增加新行，返回值为false表示不允许增加
 */
function efgrid_onAddNewRow( grid_id ){
	
}

/**
 * 表格创建新行按钮被点击,新增行数据之后进行的回调
 * @param {Object} grid_id : 对应的表格ID 
 */ 
function efgrid_afterAddNewRow( grid_id){

}

/**
 * 表格行被点击时的回调函数（当前行改变）
 * @member efgrid
 * @param {Object} grid_id	:	对应的表格id
 * @param {Object} row_index	:	行号
 * @return null
 */
function efgrid_onRowClicked( grid_id, row_index ){}

/**
 * 表格数据渲染前的回调函数
 * @member efgrid
 * @param {Object} grid_id	:	对应的表格id
 * @return null
 */
function efgrid_onBeforeGridDisplay( grid_id ){
	
}

/**
 * 表格单元格进入编辑状态时的回调函数
 * @member efgrid
 * @param {Object} grid_id		:	表格id
 * @param {Object} row_index	:	行号
 * @param {Object} col_index	:	列号
 * @param {Object} data_type	:	数据类型，为TYPE_DATA或TYPE_FIX
 * @return null
 */
function efgrid_onBeforeCellEditNodeDisplay(grid_id, row_index, col_index, data_type ){
	
}
/**
 * 表格单元格编辑状态渲染完毕后的回调函数
 * @member efgrid
 * @param {Object} grid_id		:	表格id
 * @param {Object} row_index	:	行号
 * @param {Object} col_index	:	列号
 * @param {Object} cell_value	:	对应单元格的值
 * @param {Object} data_type	:	数据类型，为TYPE_DATA或TYPE_FIX
 * @param {Object} div_node		:	生成的单元格编辑状态的dom节点
 * @return null
 */
function efgrid_onCellEditNodeDisplayReady(grid_id, row_index, col_index, cell_value, data_type, div_node ){
	
}

/**
 * 表格数据列单元格数据存储时的回调函数
 * @member efgrid
 * @param {Object} grid_id		:	表格id
 * @param {Object} row_index	:	行号
 * @param {Object} col_index	:	列号
 * @param {Object} cell_value	:	对应单元格的值
 * @return null
 */
function efgrid_onDataCellSaved(grid_id, row_index, col_index, cell_value ){
	
}

/**
 * 表格固定列单元格数据存储时的回调函数
 * @member efgrid
 * @param {Object} grid_id		:	表格id
 * @param {Object} row_index	:	行号
 * @param {Object} col_index	:	列号
 * @param {Object} cell_value	:	对应单元格的值
 * @return null
 */
function efgrid_onFixCellSaved(grid_id, row_index, col_index, cell_value ){
	
}

/**
 * 表格数据提交(包括翻页，设置显示记录数，调用efgrid.submitForm提交数据)时的回调
 * @member efgrid
 * @return true表示继续表格数据的提交，false表示不对表格数据进行提交
 */
function efgrid_onGridSubmit(){
	
}
/**
 * grid以ajax方式提交成功后的回调函数
 * @member efgrid
 * @param {Object} grid_id		:	表格id
 * @param {Object} service_name	:	serivce名
 * @param {Object} method_name	:	方法名
 * @param {Object} eiInfo		:	grid以ajax方式提交成功后返回的eiinfo
 * @return void
 */
function efgrid_onAjaxSubmitSuccess(gridId, service_name, method_name, eiInfo){
}

/**
 * 表格行被双击时的回调函数（当前行改变）
 * @member efgrid
 * @param {Object} grid_id	:	对应的表格id
 * @param {Object} row_index	:	行号
 * @return null
 */
function efgrid_onRowDblClicked(gridId,row_index){
	if(gridId == "_ef_grid_subgrid" ){
			alert(gridId);
			var sub_grid = efform.getGrid( "_ef_grid_subgrid" );
			var index = sub_grid.getCurrentRowIndex();
			if( index < 0 ) {
				alert( "未选择记录" );
				return;
			}
		      
			var div_node = efform.getSubGridDiv();
			var column = div_node.efDisplayingCol;
			var cell_value = sub_grid.getBlockData().getCell( index, column.getValueProperty() );
			efwindow.setValue( cell_value );
	}
		
}

function efgrid_onExport_modleXls (gridId){
	alert(gridId);
}
	