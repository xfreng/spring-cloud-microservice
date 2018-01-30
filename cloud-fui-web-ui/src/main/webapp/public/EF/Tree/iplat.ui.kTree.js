(function ($){

	$.extend({'createGuid':function(){
		var id = "", i, random;

        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;

            if (i == 8 || i == 12 || i == 16 || i == 20) {
                id += "-";
            }
            id += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
        }

        return id;
	}});
    
       var drag=false;
	   var dropHint;
	   var sourceNode;
	   var dragClue;
	   var dropTarget;
	   var beginX=0.0;
	   var beginY=0.0;
	   var endX=0.0;
	   var endY=0.0; 
   
  function _attachEvents(element) {
            var clickableItems = ".k-in:not(.k-state-selected,.k-state-disabled)";

	  $(element.options.container)
            .on("mouseenter", ".k-in.k-state-selected", function(e) { dropTarget=$(this); e.preventDefault(); })
            .on("mouseenter", clickableItems, function () { dropTarget=$(this);$(this).addClass("k-state-hover"); })
            .on("mouseleave", clickableItems, function () { dropTarget=null;$(this).removeClass("k-state-hover"); })
            .on("click", clickableItems, _click)
            .on("dblclick", ".k-in:not(.k-state-disabled)", _toggleButtonClick)
            .on("click", ".k-plus,.k-minus",_toggleButtonClick);
	  
	  if(element.options.dragAndDrop)
	  {
	  
	  $(element.options.dragRange)
            .on("mousedown", '.k-in',_dragStart)
            .on("mousedown", _noDrag)
            .on("mouseup", _dragEnd)
	        .on("mousemove", _drag);
	  }
	  
	  if(element.options.rightMenu)
	  {
		  $(element.options.container).on("contextmenu", '.k-in',function(e){
			  element.options.rightMenu($(this).closest('li'));
			  return false;
			  });
	  }
    }
  
  
  function _hintStatus(newStatus) {
        var statusElement = dragClue.find(".k-drag-status")[0];

        if (newStatus) {
            statusElement.className = "k-icon k-drag-status " + newStatus;
        } else {
            return $.trim(statusElement.className.replace(/k-(icon|drag-status)/g, ""));
        }
    }
  
 
  
  function _dragClue(text)
  {
	  return $("<div class='k-header k-drag-clue'><span class='k-icon k-drag-status'></span>"+text+"</div>");
  }
 
  function _dragStart(e)
  {
	  drag=true;
	  dragClue=_dragClue($(e.target).text());
	  dropHint = $("<div class='k-drop-hint' />")
      .css('visiablity', "hidden")
      .appendTo($(e.target).closest(".k-treeview"));
	  sourceNode = $(e.target).closest('.k-item');
	  beginX=e.pageX;
	  beginY=e.pageY;
	  
	  if($(e.target).closest('.k-treeview').length<1)
	     	 return;
	      var tree=$(e.target).closest('.k-treeview').data('node');
	  if(tree.options.helper)
	  {
		  sourceNode=tree.options.helper(sourceNode);
	  }
  }
  
  
  function _noDrag(e)
  {
	  beginX=e.pageX;
	  beginY=e.pageY;
  }
  
  function _drag(e)
  {
	  if(drag)
	  {
      var statusClass, closestTree = $(e.target).closest(".k-treeview"),
      hoveredItem, hoveredItemPos, itemHeight, itemTop, itemContent, delta,
      insertOnTop, insertOnBottom, addChild;
     
      if($(e.target).closest('.k-treeview').length>=1)
      {
       var tree=$(e.target).closest('.k-treeview').data('node');
       tree.drag=true;
       $(tree.options.dragRange).append(dragClue.offset({left:e.pageX+5,top:e.pageY+5}));
      }
      else
      {
    	  $('body').append(dragClue.offset({left:e.pageX+5,top:e.pageY+5}));
      }

  if (!closestTree.length) {
      // dragging node outside of treeview
      statusClass = "k-denied";
      
  } else if (!dropTarget||$.contains(sourceNode[0], dropTarget[0])||sourceNode[0]==dropTarget[0]) 
  {
      // dragging node within itself
      statusClass = "k-denied";
  } else if(tree.options.dropTarget&&!$.contains($(tree.options.dropTarget)[0], dropTarget[0]))
  {
	  statusClass = "k-denied";
  }
  
  
  else
  {
      // moving or reordering node
      statusClass = "k-insert-middle";
      

      hoveredItem = dropTarget.closest(".k-top,.k-mid,.k-bot");

      if (hoveredItem.length) {
          itemHeight = hoveredItem.outerHeight();
          itemTop = hoveredItem.offset().top;
          itemContent = dropTarget.closest(".k-in");
          delta = itemHeight / (itemContent.length > 0 ? 4 : 2);

          insertOnTop = e.pageY < (itemTop + delta);
          insertOnBottom = (itemTop + itemHeight - delta) < e.pageY;
          addChild = itemContent.length && !insertOnTop && !insertOnBottom;

          dropHint.css("visibility", addChild ? "hidden" : "visible");
          itemContent.toggleClass('k-state-hover', addChild);

          if (addChild) {
              statusClass = "k-add";
          } else {
              hoveredItemPos = hoveredItem.position();
              hoveredItemPos.top += insertOnTop ? 0 : itemHeight;

              dropHint
                  .css(hoveredItemPos)
                  [insertOnTop ? "prependTo" : "appendTo"](dropTarget.closest('.k-item').children("div:first"));

              if (insertOnTop && hoveredItem.hasClass("k-top")) {
                  statusClass = "k-insert-top";
              }

              if (insertOnBottom && hoveredItem.hasClass("k-bot")) {
                  statusClass = "k-insert-bottom";
              }
          }
      } else if (dropTarget[0] != dropHint) {
          statusClass = "k-denied";
      }
  }

  if (statusClass.indexOf("k-insert") !== 0) {
      if(dropHint)dropHint.css('visibility', "hidden");
  }

  _hintStatus(statusClass);
  
	  }
  }
  
  

  
  function _dragEnd(e)
  {
	  drag=false;
	  endX=e.pageX;
	  endY=e.pageY;
	  
	  if(Math.abs(beginX-endX)<2&&Math.abs(beginY-endY)<2||!sourceNode||!dropTarget)
	  {
		  if(dragClue)dragClue.remove();
		  if(dropHint)dropHint.remove();
		  $('.k-drag-clue').remove();
		  $('.k-drop-hint').remove();
		  return;
	  }
	  
	  var toggleButton=$(e.target);
	   //可能是单击 k-plus 或者双击 k-in
	  
	   if(toggleButton.hasClass('k-plus')||toggleButton.hasClass('k-minus'))
		   return;
	  
	  
	  
      var treeview = dropTarget.closest(".k-treeview"),
      dropPosition = "over",
      destinationNode,
      valid;

      if (dropHint.css('visibility') == "visible") {
          dropPosition = dropHint.prevAll(".k-in").length > 0 ? "after" : "before";
          destinationNode = dropHint.closest('.k-item');
      } else if (dropTarget) {
          destinationNode = dropTarget.closest('.k-item');
      }

      valid = _hintStatus() != "k-denied";

      // perform reorder / move
      if(destinationNode&&valid&&destinationNode[0]!=sourceNode[0])
      {
    	 
    	  treeview.find('.k-state-selected').removeClass('k-state-selected');
    	  treeview.find('.k-state-hover').removeClass('k-state-hover');
      if (dropPosition == "over") {
    	  
    	  if(destinationNode.children('ul').length>0)
    	  {
    		  destinationNode.children('ul').append(sourceNode);
    	  }
    	  else
    	  {
    		  destinationNode.children('div').prepend('<span class="k-icon k-minus"/>');
    		  destinationNode.append('<ul class="k-group" role="group" style="display: block;"/>');
    		  destinationNode.children('ul').append(sourceNode);
    		  //sourceNode.children('div').attr('class','k-bot');
    	  }
    	  
    	  
    	  
      } else if (dropPosition == "before") {
          sourceNode = sourceNode.insertBefore(destinationNode);
          
         
          
      } else if (dropPosition == "after") {
          sourceNode = sourceNode.insertAfter(destinationNode);
      }
      
      var size=sourceNode.parent().children('li').length-1;
      var index=sourceNode.index();
      sourceNode.children('div').attr('class',divCSS(index,size));
      
      //查找没有子节点的
      var ul=$('.k-treeview').find('ul:not(:has(li))');
      ul.prev('div').children('span.k-icon').remove();
      ul.remove();
      
      sourceNode=null;
      
      
      }
      if(dragClue)dragClue.remove();
	  if(dropHint)dropHint.remove();
      $('.k-drag-clue').remove();
	  $('.k-drop-hint').remove();
	 
	  
	  dragging=false;
  }
  
  
  function divCSS(index,length)
  {
	  var divClass='';
	  if (index === 0 && index != length) {
        	divClass += "k-top";
        } else if (index == length) {
        	divClass += "k-bot";
        } else {
        	divClass += "k-mid";
        }
	  return divClass;
  }
  
  
  
   function _toggleButtonClick(e) {
	   $(e.target).closest('.k-item').children('.k-group').toggle('blind');
	   var toggleButton=$(e.target);
	   //可能是单击 k-plus 或者双击 k-in
	   if(toggleButton.hasClass('k-in'))
	   {
		   toggleButton=toggleButton.prev();
	   }
	   
	   if(toggleButton.hasClass('k-plus'))
	   {
		   toggleButton.addClass('k-minus');
		   toggleButton.removeClass('k-plus');
	   }
	   else if(toggleButton.hasClass('k-minus'))
	   {
		   toggleButton.addClass('k-plus');
		   toggleButton.removeClass('k-minus');
	   }
	   
    }
   
   function _click(e)
   {
	   $(e.target).closest('.k-treeview').find('.k-state-selected').removeClass('k-state-selected');
	 
	   $(e.target).addClass('k-state-selected').removeClass('k-state-hover');
	   drag=false;
   }
    
   
 
   
   function TreeView(element, options)
   {
	   var defaluts={
			   dragAndDrop:true,
			   dropInSelf:true,
			   dropTarget:'',
			   dragRange:'body'
	   };

	   
    this.options = $.extend({}, defaluts, options);
	this.loadNode(element);
	_attachEvents(this);
	$(this.options.container).data('node',this);
	
	
   }

   TreeView.prototype ={
		loadNode:function (node,root) {
			   
			   var options=this.options;
			   var tree=this;
			   
			   var length=	node.children().length-1;
				
			    node.children().each(function (index,element) {
			    	
			    	//ul list
			        var $ul = $('<ul />').addClass('k-group').attr('role','group');
			        
			        //li guid
			        var li_guid=$.createGuid();
			        
			        //li node  && child node  is div
			        var $li_node = $("<li class='k-item'/>").attr({'data-uid':li_guid,'role':'treeitem'});
			        if($(element).attr('tag')=="HTMLDOCTYPE" || $(element).attr('tag')=="JSPDirectives"){
			        	$li_node.css('display','none');
			        }
			        
			        var divClass='';

			            if (index === 0 && index != length) {
			            	divClass += "k-top";
			            } else if (index == length) {
			            	divClass += "k-bot";
			            } else {
			            	divClass += "k-mid";
			            }

			        var div=$("<div />").addClass(divClass);
			        
			        if ($(element).children().length>0) {
			        	
			        	var toggleButton=$("<span role='presentation'/>");
			        	
			        	if($(element).data('expanded')=="false")
			        	{
			        		toggleButton.addClass('k-icon k-plus');
			        	}
			        	else
			        	{
			        		toggleButton.addClass('k-icon k-minus');
			        	}
			        	div.append(toggleButton);
			        }
			        
			        div.append($("<span class='k-in'/>").append($(element).attr('tag')));
			        $(element).data('guid',li_guid);
			        
			        
			        $li_node.append(div);

			        if (root === undefined) { //arc_node未定义时
			        	//树结构展示的div
			        	if($(options.container).children('ul').length>0)
			        	{
			        		 $(options.container).children("ul").append($li_node);
			        	}
			        	else
			        	{
			        		 $(options.container).append($ul).find("> ul:last").append($li_node);
			        	}
			        } else {
			            var node_operate = $(root).find("> ul");

			            if (node_operate.length == 0) {
			                $(root).append($ul);
			            }

			            $(root).find("> ul").append( $li_node );
			        }
			        
			        tree.loadNode($(this), $li_node);

			    });
			    },
		expandAll:function()
		{
		 var tree=$(this.options.container);
		 tree.find('ul.k-group').css('display','block');
		 tree.find('span.k-plus').removeClass('k-plus').addClass('k-minus');
		},
		collapseAll:function()
		{
			var tree=$(this.options.container);
			tree.find('ul.k-group:gt(0)').css('display','none'); //顶层的根不需要隐藏
			tree.find('span.k-minus').removeClass('k-minus').addClass('k-plus');
		}
		,
		addNode:function(node,parentNode)
		{
	    	  
	    	  if(parentNode.children('ul').length>0)
	    	  {
	    		  parentNode.children('ul').append(node);
	    	  }
	    	  else
	    	  {
	    		  parentNode.children('div').prepend('<span class="k-icon k-minus"/>');
	    		  parentNode.append('<ul class="k-group" role="group" style="display: block;"/>');
	    		  parentNode.children('ul').append(node);
	    	  }
	      
	      var size=node.parent().children('li').length-1;
	      var index=node.index();
	      node.children('div').attr('class',divCSS(index,size));
	      
	      //查找没有子节点的
	      var ul=parentNode.closest('.k-treeview').find('ul:not(:has(li))');
	      ul.prev('div').children('span.k-icon').remove();
	      ul.remove();
	      
		},
		removeNode:function(node)
		{
			var tree=node.closest('.k-treeview');
			node.remove();
			
			//查找没有子节点的
		    var ul=tree.find('ul:not(:has(li))');
		    ul.prev('div').children('span.k-icon').remove();
		    ul.remove();
		}
   };
		

  
    
    $.fn.kTree=function(opts)
    {
    	return  new TreeView(this,opts);
    };

}(jQuery));
   