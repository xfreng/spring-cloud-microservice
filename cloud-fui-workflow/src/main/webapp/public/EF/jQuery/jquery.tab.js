$.fn.Tab = function(opt) {
    var cfg = {
        items: [{id: 1, title: tab, tooltip: null, closed: true, icon: '', html:'', load: '', domNode: '', share: false, callback: function(){}}],
        //宽度
        width: 540,
        //高度
        //height:500,
        //内容宽度
        tabcontentWidth: 538,
        //sheet标题宽度
        tabWidth: 80,
        //sheet标题高度
        tabHeight: 35,
        //是否有导航栏
        tabScroll: false,
        //导航栏宽度,标题item左右移动按钮)
        tabScrollWidth: 19,
        tabClassDiv: 'benma_ui_tab',
        tabClass: 'benma_ui_tab_div',
        tabClassClose: 'tab_close',
        tabClassOn: 'tab_item',
        tabClassInner: 'tab_item',
        tabClassInnerLeft: 'tab_item1',
        tabClassInnerMiddle: 'tab_item2',
        tabClassInnerRight: 'tab_item3',
        tabClassText: 'text',
        tabClassScrollLeft: 'scroll-left',
        tabClassScrollRight: 'scroll-right',
        tabContentClass: 'tab-div-content',
        tabClassHtmlDiv: 'tab-div-html',
        tabHtml: '',
        //sheet标题宽度是否相同
        tabWidthSame: false
    };
    
    var newIframe = function() {      
        var iframe = $("<iframe />").addClass("benma_ui_tab_iframe").attr({
            'scrolling': 'no', 'marginHeight': 0, 'marginWidth': 0, 'frameBorder': 0});
        return iframe[0];    
    };
    
    var tabDiv = null;
    var sharedIframe = newIframe();
    
    //默认显示第一个li(tab标题)
    var displayLINum = 0;
    
    $.extend(cfg, opt);
    
    //判断是不是有隐藏的tab
    var tW = cfg.tabWidth * cfg.items.length;
    cfg.tabScroll ? tW -= cfg.tabScrollWidth * 2 : null;
    
    //tabDiv,该div是自动增加的
    //var tab=$('<div />').attr('id','jquery_tab_div').height(cfg.tabHeight).addClass(cfg.tabClass).append('<ul />');
    //2013-1-3 去除tabHeight的样式设置
    var tab = $('<div />').attr('id', 'jquery_tab_div').addClass(cfg.tabClass).append('<ul />');
    
    //tab target content，将width减border宽度2px
    var tabContent = $('<div />').attr('id', 'jquery_tab_div_content').
        width(cfg.tabcontentWidth - 2).height("auto").addClass(cfg.tabContentClass);
    
    for (var i = 0; i < cfg.items.length; i++) {
        //item是页面的各个子div
        var item = cfg.items[i];
        //判断是显示html代码还是ajax请求内容
        addContentDiv(item, i);
    }
    
    var ccW = (cfg.items.length * cfg.tabWidth) - cfg.width;
    var tabH = '';
    
    //增加�?��tab下的li得模�?tab的标�?
    var tabHeadItem = $("<table />").addClass(cfg.tabClassInner).attr({ 'id':'{0}', 'border':'0','cellpadding':'0','cellspacing':'0'}).
        append($("<tr />").
        append($("<td />").addClass(cfg.tabClassInnerLeft)).
        append($("<td />").addClass(cfg.tabClassInnerMiddle).
        append($("<span title=\"{2}\"/>").addClass(cfg.tabClassText).addClass('tabTitleText').html('{1}'))).
        append($("<td />").addClass(cfg.tabClassInnerMiddle).
        append($("<div />").addClass(cfg.tabClassClose +' ' + cfg.tabClassClose + '_noselected'))).
        append($("<td />").addClass(cfg.tabClassInnerRight)));
    var tabTemplate=$("<div />").append(tabHeadItem).html();
    
    var scrollTab = function(o, flag) {
        var tabchildren = tab.find('li');
        for (var ch = 0; ch < tabchildren.length; ch++) {
            if (tabchildren.eq(ch).css('display') != "none") {
                displayLINum = ch;
                break;
            }
        }
        //向左边移动一个tab
        if (flag) {
            if(displayLINum <= 0) return;
            
            var firstshowli = tabchildren.eq(displayLINum - 1);
            firstshowli.css('display','block');
            displayLINum--;
        } else {//向右边移动一个tab
            if(displayLINum >= tabchildren.length - 1) return;
            var lastli = tab.find('li:last');
            if(lastli.offset().top == tab.offset().top) return;
            var firstshowli = tabchildren.eq(displayLINum);
            firstshowli.css('display','none');
            displayLINum++;
        }
        //showItem(displayLINum);
    };
    
    function getContentPanel() {
        return tabContent;
    }
    
    function removeTab(item, force) {
        if (!force) {
            var ifr = $('#' + item.id + ' iframe');
            var subwin = null;
            if (ifr.length > 0) {
                subwin = ifr[0].contentWindow;
                if (subwin.onbeforeunload) {
                    var msg = subwin.onbeforeunload();
                    if (msg && !confirm(msg + '\n确定关闭？'))
                        return false;
                }
            }
        }
        
        //2012-11-29 HuangKe add 
        if (!item.index) {
            // item.index=$.inArray(item,cfg.items);
            item.index = item.dom.index();
        }
        //if (!obj.data('NowNode')) {
        //cfg.items[0].index = 0;
        //obj.data('NowNode',cfg.items[0]);
        //}
        
        var objli = item.dom;
        tabliWidth -= objli.width() - 3;
        if (tabliWidth <= tab.width() && cfg.tabScroll) {
            cfg.tabScroll = false;
            container.children('.div,.scroll-left').remove();
            container.children('.div,.scroll-right').remove();
            tab.find('li').each(function() {
                if ($(this).css('display')=='none')
                    $(this).css('display','block');
            });
            tabContenter.css('width','100%');
            obj.css('width','100%');
        }
        //var _self = $(this);
        //if (tab.find('li').length<2) {
        //    _self.remove();
        //} else {
        //    liObj.remove();
        //}
        item.dom.remove();
        $('#' + item.id).remove();
        //item.index, NowNode .NowNode index undefined
        if (item.index == obj.data('NowNode').index) {
            var idx = item.index-1;
            if (idx < 0 && cfg.items.length > 1)
                idx = 0;
            obj.data('NowNode',cfg.items[idx]);
            var showTd = tab.find('li:eq(' + (idx) + ') td:eq(1)');
            showTd.closest('li').css('display', 'block');
            showTd.click();
       }
        
       //更新 item //2012-11-29 HuangKe add 
       for (var i = item.index + 1; i < cfg.items.length; i++) {
        cfg.items[i].index-=1;
       }
       //删除关闭的item
       cfg.items.splice(item.index,1);
       
       if (subwin && subwin.onunload)
           subwin.onunload();
       return true;
    }
    
    //add tab item标题
    function addTab(item) {
        var innerString = tabTemplate.replace("{0}", 'eftab_title_' + item.id).replace("{1}", item.title).
            replace('{2}', item.tooltip ? item.tooltip:'');
        
        var liObj = $('<li />');
        item.dom = liObj;
        liObj.append(innerString).appendTo(tab.find('ul')).find('table td:eq(1)').click(function() {
        
        //2012-11-29 HuangKe add 
        if (typeof(item.index) == "undefined") {
            item.index = item.dom.index();
        }
        //obj.data('NowNode',item);
        
        //判断当前是不是处于激活状�?
        var _self = liObj;
        if (_self.hasClass(cfg.tabClassOn)) return;
        //回调函数是什�?
        if (item.callback) {
            if (item.callback(item) == false) return;
            
        }
        //改变内部得css
        _self.find('td:first').addClass(cfg.tabClassInnerLeft + '_selected');
        _self.find('td:last').addClass(cfg.tabClassInnerRight + '_selected');
        _self.find('td:eq(1)').addClass(cfg.tabClassInnerMiddle + '_selected');
        _self.find('td:eq(2)').addClass(cfg.tabClassInnerMiddle + '_selected');
        
        var activeLi = _self.parent().find('li.' + cfg.tabClassOn);
        activeLi.find('td:first').removeClass().addClass(cfg.tabClassInnerLeft);
        activeLi.find('td:first').style = "background-image:url(" + efico.get("eftab.tab1") + ")";
        
        activeLi.find('td:last').removeClass().addClass(cfg.tabClassInnerRight);
        activeLi.find('td:last').style="background-image:url(" + efico.get("eftab.tab3") + ")";
        
        activeLi.find('td:eq(1)').removeClass().addClass(cfg.tabClassInnerMiddle);
        activeLi.find('td:eq(1)').style = "background-image:url(" + efico.get("eftab.tab2") + ")";
        activeLi.find('td:eq(2)').removeClass().addClass(cfg.tabClassInnerMiddle).find('div').addClass(cfg.tabClassClose + '_noselected');
        activeLi.find('td:eq(2)').style = "background-image:url(" + efico.get("eftab.tab2") + ")";
        
        activeLi.removeClass().addClass(cfg.tabClassOff);
        
        $(this).next().find('div').removeClass().addClass(cfg.tabClassClose);
        _self.removeClass().addClass(cfg.tabClassOn);
        //判断是显示html代码还是ajax请求内容
            setAlldisplayNone(tabContent,item);    
        }).hover(function() {
            var _self=liObj;
            if(_self.hasClass(cfg.tabClassOn)) return;
            _self.find('td:first').addClass(cfg.tabClassInnerLeft+'_mouseover');
            _self.find('td:last').addClass(cfg.tabClassInnerRight+'_mouseover');
            _self.find('td:eq(1)').addClass(cfg.tabClassInnerMiddle+'_mouseover');
            _self.find('td:eq(2)').addClass(cfg.tabClassInnerMiddle+'_mouseover');
        }, function() {
            var _self = liObj;
            if(_self.hasClass(cfg.tabClassOn)) return;
            _self.find('td:first').removeClass(cfg.tabClassInnerLeft+'_mouseover');
            _self.find('td:last').removeClass(cfg.tabClassInnerRight+'_mouseover');
            _self.find('td:eq(1)').removeClass(cfg.tabClassInnerMiddle+'_mouseover');
            _self.find('td:eq(2)').removeClass(cfg.tabClassInnerMiddle+'_mouseover');
        });
        if (item.closed) {
            liObj.find('td:eq(2)').find('div').click(function() {
                removeTab(item);
            }).hover(function() {
                if(liObj.hasClass(cfg.tabClassOn)) return;
                var _self = $(this);
                _self.removeClass().addClass(cfg.tabClassClose);
            }, function() {
                if(liObj.hasClass(cfg.tabClassOn)) return;
                var _self = $(this);
                _self.addClass(cfg.tabClassClose+'_noselected');
            });
        } else {
            liObj.find('td:eq(2)').html('');
        }
        return liObj;
    }
      
    function getItemWithId(_id) {
        for( var i = 0; i < cfg.items.length; i++ ) {
            var _item = cfg.items[i];
            if(_item.id == _id) {
                return _item;
            }
        }
    }
    
    function getItemWithNum(_num) {
        return cfg.items[_num];
    }
    
    function setAlldisplayNone( jqTab,_item) {
        // 修改tab项继续嵌套tab，导致内tab切换不显示问题
        var tabDivs = jqTab.children().filter('div');
        for( var i = 0; i < tabDivs.length; i++ ) {
            var tabDiv = tabDivs[i];
            if (tabDiv.id != _item.id) {
                tabDiv.style.display = "none";
            } else {
                tabDiv.style.display = "block";
                if (!(_item.load == null || _item.load == '') && !_item.share) {
                    _item.iframe = newIframe();
                    if (_item.height == null) {
                        _item.height = "100%";
                    }

                    $(_item.iframe).height(_item.height);
                    _item.iframe.src = _item.load;

                    if ($(">iframe", tabDiv).length > 0) {
                        $(tabDiv).empty();
                    }

                    tabDiv.appendChild(_item.iframe);
                }

                //2013-1-23 huangke
                //解决统计div在tab中显示问题
                //iframe.share=true 使用缓存的iframe,此iframe如果不是初始显示的iframe,并且带有统计信息
                //统计信息的div offset计算会出错(iframe并没有真正加载);
                //临时解决方案 在切换tab到此iframe时,仅仅重绘一次grid.
                if (_item.share && !$(tabDiv).data('ONCE')) {
                    $(tabDiv).data('ONCE', true);
                    try {
                        $(_item.iframe).contents().find('div[id*=sumDataDivForFloat]').each(function () {
                            var end = $(this).attr('id').indexOf('sumDataDivForFloat');
                            var gridId = $(this).attr('id').substr(0, end);
                            var grid = $(this).parent().find('#' + gridId + '__grid_table')[0].efgrid;
                            grid.paint();
                        });
                    } catch (e) {
                        //Error Log: Cross Domain iframe contents prevent
                    }
                }

                if (!!_item.switchAffterCallBack) {
                    eval(_item.switchAffterCallBack)(_item);
                }
            }
        }
    }
    
    //item是json对象 包含tabItem的属性和DOM信息
    //此方法绘制tab具体内容
    function addContentDiv(item,i)
    {
        //兼容以前没有id
        if(!item.id) item.id = "ef_tab_"+i;
        
        //div内容是iframe
        if(item.load){    
          var iframediv=$("<div />").attr({'id': item.id,'title':item.title,'eftabsrc':item.load,
                         'eftabheight':item.height,'efRemember':(item.share?"yes":"no")}).css('display','none');
          tabContent.append(iframediv);
                
          if ( item.share ){
               if (item.iframe == null){
                        item.iframe = newIframe();
                    }
                if (item.height == null ){
                          item.height = "100%";
                    }else{
                        //DOCTYPE �?iframe内页面高度无滚动�?
                        $(document).ready(function() { 
                            $(item.iframe).load(function() { 
                                $(this).contents().find("form").height('100%');//parseInt(item.height)*0.96
                            
                            });
                        });
                    }
                    
                $(item.iframe).height(item.height);
                item.iframe.src = item.load;
                iframediv.append(item.iframe);
                }  //end if of 'if(item.iframe == null)'
          
            }else if(item.domNode){
            //div内容是普通的DOM
                if ( item.height == null ){
                         item.height = "100%";
                }
                
                item.domNode.style.height = item.height;
                tabContent.get(0).appendChild(item.domNode);
//                $(item.domNode).height(item.height);
//                $(item.domNode).css('padding','3px');
//                tabContent.append(item.domNode);
            }else {
             //tabDiv内容是一般的HTML    
                var htmldiv=$("<div  id= "+item.id +" />" ).css( "display","none").append(item.html);        
                tabContent.append(htmldiv);
            }
    }
    
    function setDivNode(nd){
        tabDiv = nd;
    }
    
    function getIframe(idx){

        var item = cfg.items[idx];
        if ( item == null )
            return null;
        if(item.load){
                if ( item.iframe == null ){
                    item.iframe = newIframe();
                }
                return item.iframe;    
        }
        return null;
    }
    
    function hideItem(idx){
        //debugger;
        var item = cfg.items[idx];
        var itemDom = item.dom;
        itemDom.hide();
        total = cfg.items.length;
        indexI = idx;
        indexT = idx;
        
        var ifChange = false;
        if ( itemDom.hasClass(cfg.tabClassOn) ){
            
            //NowNode兼容新旧tab实现
            if(!!tabDiv && (tabDiv.data("NowNode").index==idx||tabDiv.get(0).NowNode.index==idx)){
                    for(indexI=indexI+1;indexI<total;indexI++){    
                       if(cfg.items[indexI].dom.get(0).style.display !="none"){
                        clickTab(indexI);
                        ifChange = true;
                        break;
                        }
                        }
                    if(!ifChange)    
                        for(indexT=indexT-1;0<=indexT;indexT--){
                           if(cfg.items[indexT].dom.get(0).style.display != "none"){
                            clickTab(indexT);  
                            ifChange = true;
                            break;    
                            }                
                        }    
                    if(!ifChange){
                        tabDiv.hide();
                    }
            }
        }    
        
    }
    
    function showItem(idx){
        var item = cfg.items[idx];
        var itemDom = item.dom;
        itemDom.show();    
        clickTab(idx);
    }
    
    function clickTab(idx,_noCallback){
             var item = cfg.items[idx];
            if(!_noCallback)
            {
                //clickTab回调
                if(item.callback)
               {    
                    if(item.callback(item) == false)
                    return;
               }
               }
            
            var _self = item.dom;
            if(!_self.hasClass(cfg.tabClassOn)) 
            {
            //改变内部得css
            _self.find('td:first').addClass(cfg.tabClassInnerLeft+'_selected');
            _self.find('td:last').addClass(cfg.tabClassInnerRight+'_selected');
            _self.find('td:eq(1)').addClass(cfg.tabClassInnerMiddle+'_selected');
            _self.find('td:eq(2)').addClass(cfg.tabClassInnerMiddle+'_selected');
            
            var activeLi=_self.parent().find('li.'+cfg.tabClassOn);
            activeLi.find('td:first').removeClass().addClass(cfg.tabClassInnerLeft);
            activeLi.find('td:first').style="background-image:url("+efico.get("eftab.tab1")+")";
            activeLi.find('td:last').removeClass().addClass(cfg.tabClassInnerRight);
            activeLi.find('td:last').style="background-image:url("+efico.get("eftab.tab3")+")";
            activeLi.find('td:eq(1)').removeClass().addClass(cfg.tabClassInnerMiddle);
            activeLi.find('td:eq(1)').style = "background-image:url("+efico.get("eftab.tab2")+")";

            activeLi.find('td:eq(2)').removeClass().addClass(cfg.tabClassInnerMiddle).find('div').addClass(cfg.tabClassClose+'_noselected');
            activeLi.find('td:eq(2)').style = "background-image:url("+efico.get("eftab.tab2")+")";
            activeLi.removeClass().addClass(cfg.tabClassOff);
            
            $(this).next().find('div').removeClass().addClass(cfg.tabClassClose);
            _self.removeClass().addClass(cfg.tabClassOn);
            }
            //判断是显示html代码还是ajax请求内容
            setAlldisplayNone(tabContent,item);    
    }
    
    function newTab(item){
        //创建新的tab
        addContentDiv(item,cfg.items.length);
        
        var liLength=tab.find('li').length;
        if (liLength > 0) {
            var showli = tab.find('li').eq(liLength - 1);
            while(showli.offset().top!=tab.offset().top){
                scrollTab("newTab",false);
                showli = tab.find('li').eq(liLength - 1);
            }
        }
//        var nW = showli.offset().left+showli.width()+cfg.tabWidth;
//
//        ccW+=cfg.tabWidth;
//
//        if(nW>cfg.width){
//
//            if(!cfg.tabScroll){
//                cfg.tabScroll=true;
//        
//                scrollLeft=$('<div class="'+cfg.tabClassScrollLeft+'"></div>').click(function(){
//                    //////log.debug("左导航栏");
//                    scrollTab(scrollLeft,true);
//                });
//            
//                srcollRight=$('<div class="'+cfg.tabClassScrollRight+'"></div>').click(function(){
//                   //////log.debug("右导航栏");
//                    scrollTab($(this),false);
//                });
//                cW-=cfg.tabScrollWidth*2;
//        
//                tabContenter.width(cW);
//        
//                scrollLeft.insertBefore(tabContenter);
//
//                srcollRight.insertBefore(tabContenter);
//            }
//        
//            addTab(item);
//            scrollTab("newTab",false);
//        }
//        else{
//            addTab(item);
//        }
        var newObjli = addTab(item);
        tabliWidth += newObjli.width() + 3;

        if(tabliWidth > tab.width() && !cfg.tabScroll){
            cfg.tabScroll = true;
            scrollLeft=$('<div class="'+cfg.tabClassScrollLeft+'"></div>').click(function(){
                scrollTab(scrollLeft,true);
            });
            srcollRight=$('<div class="'+cfg.tabClassScrollRight+'"></div>').click(function(){
                scrollTab(srcollRight,false);
            });
            cW = tabContenter.width() - cfg.tabScrollWidth*2;
            container.prepend(srcollRight).prepend(scrollLeft);
            tabContenter.css('width',cW);
            //obj.width(obj.width());
        }
        scrollTab("newTab",false);
        cfg.items.push(item);
    }
    
    function forEachTab(tabHandler) {
        for (var i=0; i<cfg.items.length; i++) {
            if (!tabHandler(cfg.items[i]))
                return false;
        }
        return true;
    }
    
    function updateTitle(item, title, tooltip) {
        item.title = title;
        item.tooltip = tooltip;
        var $dom = $(item.dom);
        $('.tabTitleText', $dom).text(title).attr('title', tooltip ? tooltip : '');
    }

    function updateTabId(item, id) {
        var $dom = $(item.dom);
        $('table', $dom).attr('id', 'eftab_title_' + id);
        $('#' + item.id).attr('id', id);
        item.id = id;
    }
    
    //items是tab的所有子div
    $.each(cfg.items,function(i,o){
        addTab(o);
    });
    
    var cW=cfg.width;
    
    //tab标题左右两侧的游�?移动tab的按�?
//    var scrollLeft,srcollRight;
//
//    if(cfg.tabScroll){
//        scrollLeft=$('<div class="'+cfg.tabClassScrollLeft+'"></div>').click(function(){
//                scrollTab($(this),true);
//        });
//            srcollRight=$('<div class="'+cfg.tabClassScrollRight+'"></div>').click(function(){
//    
//                scrollTab($(this),false);
//            });
//        cW-=cfg.tabScrollWidth*2;
//    }
    
    // Download by http://www.codefans.net
    var container=$('<div />').css({
        'overflow':'hidden',
        'position':'relative',
        'width':cfg.width,
        'height':cfg.tabHeight
    }).addClass(cfg.tabClassDiv);

    //包裹tab标题的DIV
    var tabContenter=$('<div />').css({
        'overflow':'hidden',
        'width':cW,
        'height':cfg.tabHeight,
        'float':'left'
    }).append(tab);
    
    
    //.append('<br>').append(tabH)
//    var obj=$(this).append(container.append(tabContenter));
//    obj.append(tabContent);
    var obj=$(this).append(tabH).append(container.append(tabContenter));
    obj.get(0).appendChild(tabContent.get(0));
    
    // 2012/08/23 wxp调整滚动条�?�?
    //tab标题左右两侧的游�?移动tab的按�?
    var scrollLeft,srcollRight;
    var tablis = tab.find('li'); 

    // 当tab父节点存在隐藏节点时，不控制tab项width
    var pstatus = true;
    tab.parents().each(function(){
        if($(this).css('display')=='none'){
            pstatus = false;
            return false;//中止循环
        }});

    if(pstatus){
    var tabliWidth = 0;
    for( var i=0; i<tablis.length; i++ ){
        tabliWidth += tablis.eq(i).width() + 3;//3为每个li的paddin、margin�?
    }
    if(tabliWidth > tab.width()){
        cfg.tabScroll = true;
        scrollLeft=$('<div class="'+cfg.tabClassScrollLeft+'"></div>').click(function(){
                scrollTab($(this),true);
        });
        srcollRight=$('<div class="'+cfg.tabClassScrollRight+'"></div>').click(function(){
                scrollTab($(this),false);
        });
        cW = tabContenter.width() - cfg.tabScrollWidth*2;
        container.prepend(srcollRight).prepend(scrollLeft);
        tabContenter.css('width',cW);
        //obj.width(obj.width());
    }
    }
    //绑定tab对应div自适应事件
    obj.resize(function(){
        if(tabliWidth > obj.width() && !cfg.tabScroll){
            cfg.tabScroll = true;
            scrollLeft=$('<div class="'+cfg.tabClassScrollLeft+'"></div>').click(function(){
                scrollTab($(this),true);
                });
            srcollRight=$('<div class="'+cfg.tabClassScrollRight+'"></div>').click(function(){
                scrollTab($(this),false);
                });
            cW = obj.width() - cfg.tabScrollWidth*2;
            container.prepend(srcollRight).prepend(scrollLeft);
            tabContenter.css('width',cW);
        }
        else if(tabliWidth <= obj.width() && cfg.tabScroll){
            cfg.tabScroll = false;
            container.children('.div,.scroll-left').remove();
            container.children('.div,.scroll-right').remove();
            tab.find('li').each(function(){
                if($(this).css('display')=='none')
                    $(this).css('display','block');
            });
            tabContenter.css('width','100%');
            obj.css('width','100%');
        }
        if(cfg.tabScroll){
            cW = obj.width() - cfg.tabScrollWidth*2;
            tabContenter.css('width',cW);
        }
    });
    //点击第一
    tab.find('li:first td:eq(1)').click();
    return obj.extend({
            'addTab':addTab,
            'newTab':newTab, 
            'getContentPanel':getContentPanel, 
            'getIframe':getIframe, 
            'hideItem':hideItem, 
            'showItem':showItem, 
            'setDivNode':setDivNode, 
            'clickTab':clickTab,
            'getItemWithNum':getItemWithNum,
            'getItemWithId': getItemWithId,
            forEachTab: forEachTab,
            removeTab: removeTab,
            updateTitle: updateTitle,
            updateTabId: updateTabId
        });
};
