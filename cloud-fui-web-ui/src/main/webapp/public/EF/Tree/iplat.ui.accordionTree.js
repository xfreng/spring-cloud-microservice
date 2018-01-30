/**
 * @author tcg
 * @date 2014-05-27
 * accordion Tree
 */
(function ($)
{
    $.fn.AccordionTree = function (options){
        this.options = {
            size:10,
            showOnTop:true,
            picPath:null,
            contentPic:"EF/Images/group-by.gif",
            service:"",
            rootLabel:"",
            titlePic:"",
            treeIdPrefix:"nTree_",
            more:"更多>>",
            width:"auto"
        };
        $.extend(this.options,options);

        return $.AccordionTreeConstruct.init(this);
    };

    $.AccordionTreeConstruct = {
        init:function($obj){
            this.obj = $obj;
            var p = this.options = $obj.options;
            var g = this;
            p.height = g.getShowHeight();
            g.getLevelOneData();
            g.createHtml();
            g.bindEvent();
        },
        getLevelOneData:function(){
            var p = this.options ;
            var g = this;
            var MenuModel = new eiTreeModel(p.service, p.rootLabel);
            g.datas = MenuModel.getChildren(p.rootLabel);
            g.sortDatas = [];
            var data;
            for(var i=0;i< g.datas.length;i++){
                data = {};
                data.label = g.datas[i].label;
                data.text = g.datas[i].text;
                g.sortDatas.push(data);
            }
        },
        getShowHeight:function(){
            var p = this.options ;
            var height = p.height|| this.obj.height();
            if(!height){
                this.obj.css("height","100%");
                height = this.obj.height();
            }
            return height;
        },
        createHtml:function(){
            var p = this.options;
            var g = this;
            var needMore = false;
            var htmlArr = [];
            htmlArr.push("<ul class='cls_accordion'>");
//            htmlArr.push(g.createTitle());
            var maxCount = g.datas.length+1;
            if(p.size<g.datas.length){
                maxCount = p.size + 2;
                needMore = true;
            }
            for(var i=0;i< g.datas.length;i++){
                var data = g.datas[i] ;
                htmlArr.push(' <li class="accordContent '+(i>0?"accordContent_hidden":"")+'">');
                htmlArr.push('<div class="accordHeader first" id = "'+ ( data.label) + '_header"> ');
                htmlArr.push('    <div class="image" style="float: left;">');
//                htmlArr.push('       <img height="16px"  src="'+ p.contentPic+'" style="cursor: pointer;"/>');
                htmlArr.push('    </div>');
                htmlArr.push('     <div class="text" style="float: left;vertical-align: middle;height: 100%;overflow:hidden; ">');
                htmlArr.push('        <div>'+data.text+'</div>');
                htmlArr.push('     </div>');
                htmlArr.push('</div> ');
                htmlArr.push('<div class="treeWrap" style="height:'+ (p.height-maxCount*26)+'px;clear: both;"> ');
                htmlArr.push('<div class="tree"  isRender="0"   id= "'+ (p.treeIdPrefix + data.label) + '"></div>');
                htmlArr.push('</div> ');
                htmlArr.push(' </li> ');
            }
            htmlArr.push(g.createNavi());
            //添加更多栏目
            if(needMore){
                htmlArr.push(g.createMore());
            }
            htmlArr.push("</ul>");
            g.obj.html(htmlArr.join(""));

            if(g.datas.length>0){
                var firstLabel = g.datas[0].label;
                var treeId = p.treeIdPrefix + firstLabel;
                g.renderTree(treeId,firstLabel);
            }
            htmlArr = null;
            delete htmlArr;
        },
        createNavi:function(){
            var p = this.options;
            var g = this;
            var htmlArr = [];
            var length =  g.datas.length> p.size? p.size:g.datas.length;
            for(var i=0;i< length;i++){
                var data = g.datas[i] ;
                htmlArr.push(' <li class="accordNavi">');
                htmlArr.push('<div class="accordNaviHeader middle" label = "'+ ( data.label)+'"> ');
                htmlArr.push('    <div class="image" style="float: left;">');
                htmlArr.push('       <img height="16px"  src="'+ p.contentPic+'" style="cursor: pointer;"/>');
                htmlArr.push('    </div>');
                htmlArr.push('     <div class="text" style="float: left;vertical-align: middle;height: 100%;overflow:hidden; ">');
                htmlArr.push('        <div>'+data.text+'</div>');
                htmlArr.push('     </div>');
                htmlArr.push('</div> ');
                htmlArr.push(' </li> ');
            }
            return htmlArr.join("");
        },
        createMore:function(){
            var p = this.options;
            var g = this;
            var htmlArr = [];
            htmlArr.push(' <li class="accordMore">');
            htmlArr.push('<div class="accordMoreHeader last" id = "'+ ( p.treeIdPrefix) + '_more"> ');
            htmlArr.push('    <div class="image" style="float: left;">');
            htmlArr.push('    </div>');
            htmlArr.push('     <div class="text" style="float: right;vertical-align: middle;height: 100%;overflow: hidden;text-align:right;color:blue; ">');
            htmlArr.push(p.more);
            htmlArr.push('     </div>');
            htmlArr.push('</div> ');
            htmlArr.push(' </li> ');
            return htmlArr.join("");
        },
        renderTree:function(treeId,label){
            var p = this.options;
            var subTreeModel =  new eiTreeModel(p.service,label);
            var nTree = new EFTree(subTreeModel, treeId, "","","1");
            if(p.configTree){
                p.configTree.call(this,nTree);
            }
            $('#'+treeId).append(nTree.render());
            $('#'+treeId).attr("isRender",1);
        },
        createTitle:function(){
            var p = this.options;
            var g = this;
            var htmlArr = [];
            htmlArr.push('<li class="title" style="background-color: blue;clear: both;overflow: hidden;'+(p.title?'display:block':'display:none;')+'" >');
            htmlArr.push('<div style="float: left;">');
            htmlArr.push('     <img src="'+ p.titlePic+'" style="cursor: pointer;"/>');
            htmlArr.push('</div>');
            htmlArr.push(' <div style="float: left;vertical-align: middle;height: 100%;overflow: hidden">');
            htmlArr.push('     <span class="text">'+ p.title+'</span>');
            htmlArr.push(' </div>');
            htmlArr.push('</li> ');
            return htmlArr.join("");
            htmlArr = null;
            delete htmlArr;
        },
        createMenu:function(datas,x,y){
            var p = this.options;
            var menuId = p.treeIdPrefix + "menu_";
            if($("#"+menuId).length>0){
                $("#"+menuId).remove();
            }
            var g = this;
            var menuAttr = [];
            menuAttr.push('<div class="ef-menu tree-menu" id="'+menuId+'">');
            for(var i= p.size;i<datas.length;i++){
                menuAttr.push('<a href="#" label="'+datas[i].label+'">'+datas[i].text+'</a>')
            }
            menuAttr.push('</div>');
            $("body").append(menuAttr.join("")) ;

            $("#"+menuId).css({left:x,top:y-$("#"+menuId).height(),visibility:"visible"}).show();
        },
        destroy:function(){
            delete this;
        },
        show:function(label){
            var g = this;
            var p = this.options;
            g.obj.find(".accordContent").hide();
            var contentDiv = $("#"+label+"_header");
            contentDiv.parent().show();

            //树展示
            var treeObj = contentDiv.parent().find(".tree");
            var treeId = treeObj.attr("id");
            if(treeObj.attr("isRender")=="0"){
                g.renderTree(treeId,label);
            }
        },
        bindEvent:function(){
            var g = this;
            var p = this.options;
            $(window).unload(function(){
                g.destroy();
            });

            $(document).bind("click",function(e){
                if (e.stopPropagation) {e.stopPropagation();}
                if(g.obj.find(".accordMore").index(e.target)<0){
                    var menuId = p.treeIdPrefix + "menu_";
                    $("#"+menuId).hide();
                }
            });

            g.obj.find(".accordNaviHeader").bind("click",function(e){
                var label = $(this).attr("label");
                g.show(label);
            });

            g.obj.find(".accordMore").bind("click",function(e){
                if (e.stopPropagation) {e.stopPropagation();}
                e.cancelBubble = true;
                g.createMenu(g.sortDatas, g.obj.offset().left+g.obj.width(), e.pageY);
                var menuId = p.treeIdPrefix + "menu_";
                $("#"+menuId+" a").bind("click",function(e){
                    var label = $(this).attr("label");
                    g.show(label);
                });
            });
        }
    }

})(jQuery);