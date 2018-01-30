/**
 * splitter对象
 * @constructor
 * @param {Object} leftTdId	:	splitter左边TD的ID
 * @param {Object} leftDivId:	splitter左边TD内的DIV的ID
 * @param {Object} splitterDivId：splliter图片放置的DIV的ID
 */
efsplitter= function (leftTdId, leftDivId, splitterDivId){
    return new splitter(leftTdId, leftDivId, splitterDivId);
}
/**
 * splitter对象
 * @private
 * @param {Object} leftTdId	:	splitter左边TD的ID
 * @param {Object} leftDivId	:	splitter左边TD内的DIV的ID
 * @param {Object} splitterDivId	：splliter图片放置的DIV的ID
 * @param {Object} onResize	：  事件
 */
splitter = function (leftTdId, leftDivId, splitterDivId) {

    this._splitterDiv = splitterDivId;
    this.dbClickCount = 0;

    var host = this;

    if (leftTdId == null) {
        this._leftTd=$("#"+this._splitterDiv).prev("td").attr("id");
    } else {
        this._leftTd = leftTdId;
    }
    if(leftDivId == null) {
        this._leftDiv=$("#"+this._leftTd).children("div").eq(0).attr("id");
    } else {
        this._leftDiv = leftDivId;
    }

    $("#" + splitterDivId).html("<div class='ef-splitter-vertical'><div class='ef-splitter-stick ui-icon ui-icon-grip-dotted-vertical'></div></div>");

    $("#" + splitterDivId + "> DIV").height($("#" + splitterDivId).height());
    //绑定reszie事件
    $(window).resize(function() {
        $("#" + splitterDivId + "> DIV").height($("#" + splitterDivId).height());
    });

    $("#" + splitterDivId  + "> DIV").draggable({
        //只允许X轴横向拖动
        axis: "x",
        iframeFix: true,
        zIndex: 100,
        //拖动开始
        start: function( event, ui ) {
            $("#" + splitterDivId).attr("_colOriginPosX", event.screenX);
        },
        //拖动停止
        stop: function( event, ui ) {
            var pos_x = event.screenX;
            var minus_px = pos_x -  $("#" + splitterDivId).attr("_colOriginPosX");
            //if (Math.abs(minus_px) < 2) return;

            var _leftDiv =  host._leftDiv;
            var _leftTd =  host._leftTd;

            var divResizeWidth = $("#" + _leftDiv).width();
            var tdResizeWidth = $("#" + _leftTd).width()+ minus_px;
            divResizeWidth = divResizeWidth + minus_px;
            tdResizeWidth = tdResizeWidth>divResizeWidth?tdResizeWidth:divResizeWidth;
            if(divResizeWidth <0)divResizeWidth=1;
            ef.get(_leftDiv).style.pixelWidth = divResizeWidth;
            ef.get(_leftTd).style.pixelWidth = tdResizeWidth;

            //重新恢复位置
            efsplitter(_leftTd, _leftDiv, splitterDivId);

            if(onResize){
                onResize.call(this);
            }
        }
    });

    $("#" + splitterDivId).dblclick(function() {
        host.dbClickCount++;

        if(host.dbClickCount%2 == 1)
            ef.get(host._leftDiv).style.display = "none";
        else
            ef.get(host._leftDiv).style.display = "block";

        if(onResize){
            onResize.call(this);
        }
    });

}
