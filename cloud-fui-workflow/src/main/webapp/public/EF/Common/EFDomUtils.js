


var domLayout = {	
        
  _isIE : navigator.appName == "Microsoft Internet Explorer",
  _isFF : navigator.appName == "Netscape",	
	
  getBorderLeft : function(el) {
    if ( domLayout._isIE ){ return el.clientLeft  };
	return parseInt(window.getComputedStyle(el, null).getPropertyValue("border-left-width"));
  },  
	
  getInnerLeft : function(el) {
	if (el == null) return 0;
	if ( domLayout._isIE && el == document.body || domLayout._isFF && el == document.documentElement) return 0;
	return domLayout.getLeft(el) + domLayout.getBorderLeft(el);
  },

  getLeft : function(el) {
	if (el == null) return 0;
	return el.offsetLeft + domLayout.getInnerLeft(el.offsetParent);
  },
  
  getBorderTop : function(el) {
	if ( domLayout._isIE ){ return el.clientTop  };
	return parseInt(window.getComputedStyle(el, null).getPropertyValue("border-top-width"));
  },

   getInnerTop : function(el) {
	if (el == null) return 0;
	if ( domLayout._isIE && el == document.body ||  domLayout._isFF && el == document.documentElement) return 0;
	return domLayout.getTop(el) + domLayout.getBorderTop(el);
  },

   getTop : function(el) {
	if (el == null) return 0;
	return el.offsetTop + domLayout.getInnerTop(el.offsetParent);
  },


  /* Rectangle Getters */
  getOuterRect : function(el) {	
	return {
		left:	domLayout.getLeft(el),
		top:	domLayout.getTop(el),
		width:	el.offsetWidth,
		height:	el.offsetHeight
	};
  },

  getDocumentRect : function() {
    var _width = 0;
	var _height = 0;
    if ( domLayout._isIE ){ 
	  _width = document.body.clientWidth;
	  _height = document.body.clientHeight;
	} else {
	  _width = window.innerWidth;
	  _height = window.innerHeight;
	};
	return {
		left:	0,
		top:	0,
		width:	_width,
		height:	_height
	};
  },

  getScrollPos : function(el) {
    var _left = 0;
	var _top = 0;
    if ( domLayout._isIE ){
	  _left = document.body.scrollLeft;
	  _top = document.body.scrollTop;
	} else {
	  _left = window.pageXOffset;
	  _top = window.pageYOffset;
	};
	return {
		left:	_left,
		top:	_top
	};
  },
  
  _border  : {
    borderLeft    : 1,
    borderRight   : 1,
    borderTop     : 1,
    borderBottom  : 1
  },

  _padding : {
    paddingLeft		: -5,
    paddingRight	: -6,
    paddingTop		: -2,
    paddingBottom	: -2
  },

  _shaddow : {
    shadowLeft		: 0,
    shadowRight		: 0,
    shadowTop		: 0,
    shadowBottom	: 0
  },

  postionWithRel : function( el, relEl, hor, sBorder, sPadding, sShaddow ) {
    var border = ( sBorder == undefined )?domLayout._border:sBorder;
	var padding = ( sPadding == undefined )?domLayout._padding:sPadding;
    var shaddow = ( sShaddow == undefined )?domLayout._shaddow:sShaddow;
    var _left = 0;
	var _top = 0;

    var piRect = relEl;
    if (relEl.left == null || relEl.top == null || relEl.width == null || relEl.height == null) {
      piRect = domLayout.getOuterRect(relEl);	
    }      
	
    var menuRect = domLayout.getOuterRect(el);
    var docRect = domLayout.getDocumentRect();
    var scrollPos = domLayout.getScrollPos();
	
    if ( !hor ) {
      if (piRect.left + menuRect.width - scrollPos.left <= docRect.width)
        _left = piRect.left;
      else if (docRect.width >= menuRect.width)
        _left = docRect.width + scrollPos.left - menuRect.width;
      else
        _left = scrollPos.left;
			
      if (piRect.top + piRect.height + menuRect.height <= docRect.height + scrollPos.top)
        _top = piRect.top + piRect.height;	
      else if (piRect.top - menuRect.height >= scrollPos.top)
        _top = piRect.top - menuRect.height;
      else if (docRect.height >= menuRect.height)
        _top = docRect.height + scrollPos.top - menuRect.height;
      else
        _top = scrollPos.top;
	  
    } else {
     
     if (piRect.top + menuRect.height - border.borderTop - padding.paddingTop <= docRect.height + scrollPos.top)
        _top = piRect.top - border.borderTop - padding.paddingTop;
      else  if (piRect.top + piRect.height - menuRect.height + border.borderTop + padding.paddingTop >= 0)
        _top = piRect.top + piRect.height - menuRect.height + border.borderBottom + padding.paddingBottom + shaddow.shadowBottom;	
      else if (docRect.height >= menuRect.height)	
        _top = docRect.height + scrollPos.top - menuRect.height;
      else
        _top = scrollPos.top;

     	  
      if (piRect.left + piRect.width + menuRect.width + padding.paddingRight +	border.borderRight - border.borderLeft + shaddow.shadowRight <= docRect.width + scrollPos.left)
        _left = piRect.left + piRect.width + padding.paddingRight + border.borderRight - border.borderLeft;
      else if (piRect.left - menuRect.width - padding.paddingLeft - border.borderLeft + border.borderRight + shaddow.shadowRight >= 0)
        _left = piRect.left - menuRect.width - padding.paddingLeft - border.borderLeft + border.borderRight + shaddow.shadowRight;
      else if (docRect.width >= menuRect.width)
        _left = docRect.width  + scrollPos.left - menuRect.width;
      else	
        _left = scrollPos.left;
    }
	el.style.left = _left + "px";
	el.style.top = _top + "px";
    return {
		left:	_left,
		top:	_top
	};
  }  

}






            
	