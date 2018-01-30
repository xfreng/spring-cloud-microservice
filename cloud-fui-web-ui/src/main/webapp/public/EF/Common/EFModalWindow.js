/**
 * 
 * Used for displaying DHTML only efModalWindows instead of using buggy modal windows.
 *
 * @author wangyuqiu@2008-4-10
 * @author wuzhanqing@2009-6-29
 *
 * borrow ideas from SUBMODAL v1.6 which can be found at http://submodal.googlecode.com
 * 
 */



/**
 * Initializes efModalWindow code on load.	
 */
function EFModalWindow(windowID) {
	// Add the HTML to the body
	// need to verify whether the windowID is in use
	this.winID = windowID;
	
	theBody = document.getElementsByTagName('body')[0];
	popmask = document.createElement('iframe');
	popmask.id = this.winID + '_efModalWindowMask';
	popmask.className = 'efModalWindowMask';
	popmask.scrolling = 'no';
	popmask.frameborder = '0';
	popcont = document.createElement('div');
	popcont.id = this.winID + '_efModalWindowContainer';
	popcont.className = 'efModalWindowContainer';
    

	theBody.appendChild(popmask);
	theBody.appendChild(popcont);
	
	this.popupMask = document.getElementById(this.winID + "_efModalWindowMask");
	this.popupContainer = document.getElementById(this.winID + "_efModalWindowContainer");
	
	this.popupIsShown = false;
	
	// If using Mozilla or Firefox, use Tab-key trap.
	if (!document.all) {
		document.onkeypress = this.keyDownHandler;
	}

}

/**
* Sets the content of modal window.
*/
EFModalWindow.prototype.setContent = function(content){
	// set the content
	//this.popupContainer.innerHTML = content;
	
	
	    if(typeof content == "string"){
			this.popupContainer.innerHTML = content;
		}else if(typeof content == "object"){
				this.popupContainer.innerHTML = "";
				this.popupContainer.appendChild(content);
		}else{
				alert(getI18nMessages("ef.ParamInvalid","非法参数"));
	    }	
	
}


 /**
	* @argument width - int in pixels
	* @argument height - int in pixels
	*/
EFModalWindow.prototype.show = function(width, height) {
	
	thisobj = this;
	
	this.popupIsShown = true;
	EFModalWindow.disableTabIndexes();
	this.popupMask.style.display = "block";
	this.popupContainer.style.display = "block";
	// calculate where to place the window on screen
	this.centerPopWin(width, height);

	this.popupContainer.style.width = width + "px";
	this.popupContainer.style.height = height + "px";
	
	this.setMaskSize();

	var obj = this;
	function centerMethodClosure (){
		obj.centerPopWin();
    };
	
    EFModalWindow.addEvent(window, "resize", centerMethodClosure);
    EFModalWindow.addEvent(window, "scroll", centerMethodClosure);
	window.onscroll = centerMethodClosure;
}
	
	
EFModalWindow.prototype.showProgressBar = function(){
	this.setContent('<img src='+ efico.get("efform.ajaxLoader") +' >');
	this.show(30, 30);
}


EFModalWindow.prototype.centerPopWin = function(width, height) {

	if (this.popupIsShown == true) {

		if (width == null || isNaN(width)) {
			width = this.popupContainer.offsetWidth;
		}
		if (height == null) {
			height = this.popupContainer.offsetHeight;
		}
		
		var theBody = document.getElementsByTagName("body")[0];
		var scTop = parseInt(EFModalWindow.getScrollTop(),10);
		var scLeft = parseInt(theBody.scrollLeft,10);
	
		this.setMaskSize();
		
		var fullHeight = EFModalWindow.getViewportHeight();
		var fullWidth = EFModalWindow.getViewportWidth();
		
		this.popupContainer.style.top = (scTop + ((fullHeight - (height)) / 2)) + "px";
		this.popupContainer.style.left =  (scLeft + ((fullWidth - width) / 2)) + "px";
	}
}



/**
 * Sets the size of the popup mask.
 *
 */
EFModalWindow.prototype.setMaskSize = function() {
	var theBody = document.getElementsByTagName("body")[0];
			
	var fullHeight = EFModalWindow.getViewportHeight();
	var fullWidth = EFModalWindow.getViewportWidth();
	
	// Determine what's bigger, scrollHeight or fullHeight / width
	if (fullHeight > theBody.scrollHeight) {
		popHeight = fullHeight;
	} else {
		popHeight = theBody.scrollHeight;
	}
	
	if (fullWidth > theBody.scrollWidth) {
		popWidth = fullWidth;
	} else {
		popWidth = theBody.scrollWidth;
	}
	
	this.popupMask.style.height = popHeight + "px";
	this.popupMask.style.width = popWidth + "px";
}

/**
 * @argument callReturnFunc - bool - determines if we call the return function specified
 * @argument returnVal - anything - return value 
 */
EFModalWindow.prototype.hide = function() {
	this.popupIsShown = false;
	var theBody = document.getElementsByTagName("body")[0];
	theBody.style.overflow = "";
	EFModalWindow.restoreTabIndexes();

	this.popupContainer.style.display = "none";
	this.popupMask.style.display = "none";
}


// Tab key trap. iff popup is shown and key was [TAB], suppress it.
// @argument e - event - keyboard event that caused this function to be called.
EFModalWindow.prototype.keyDownHandler = function(e) {
    if (this.popupIsShown && e.keyCode == 9)  
    	return false;
  
    return true;
}




/**
 * COMMON DHTML FUNCTIONS
 * By Seth Banks (webmaster at subimage dot com)
 * http://www.subimage.com/
 *
 * Up to date code can be found at http://www.subimage.com/dhtml/
 *
 * This code is free for you to use anywhere, just keep this comment block.
 */

 
var gTabIndexes = new Array();
//Pre-defined list of tags we want to disable/enable tabbing into
var gTabbableTags = new Array("A","BUTTON","TEXTAREA","INPUT","IFRAME");	

 
// For IE.  Go through predefined tags and disable tabbing into them.
EFModalWindow.disableTabIndexes = function() {
	if (document.all) {
		var i = 0;
		for (var j = 0; j < gTabbableTags.length; j++) {
			var tagElements = document.getElementsByTagName(gTabbableTags[j]);
			for (var k = 0 ; k < tagElements.length; k++) {
				gTabIndexes[i] = tagElements[k].tabIndex;
				tagElements[k].tabIndex="-1";
				i++;
			}
		}
	}
}

// For IE. Restore tab-indexes.
EFModalWindow.restoreTabIndexes = function() {
	if (document.all) {
		var i = 0;
		for (var j = 0; j < gTabbableTags.length; j++) {
			var tagElements = document.getElementsByTagName(gTabbableTags[j]);
			for (var k = 0 ; k < tagElements.length; k++) {
				tagElements[k].tabIndex = gTabIndexes[i];
				tagElements[k].tabEnabled = true;
				i++;
			}
		}
	}
}

 /**
  * X-browser event handler attachment and detachment
  * TH: Switched first true to false per http://www.onlinetools.org/articles/unobtrusivejavascript/chapter4.html
  *
  * @argument obj - the object to attach event to
  * @argument evType - name of the event - DONT ADD "on", pass only "mouseover", etc
  * @argument fn - function to call
  */
EFModalWindow.addEvent = function(obj, evType, fn){
  if (obj.addEventListener){
     obj.addEventListener(evType, fn, false);
     return true;
  } else if (obj.attachEvent){
     var r = obj.attachEvent("on"+evType, fn);
     return r;
  } else {
     return false;
  }
 }

EFModalWindow.removeEvent = function(obj, evType, fn, useCapture){
   if (obj.removeEventListener){
     obj.removeEventListener(evType, fn, useCapture);
     return true;
   } else if (obj.detachEvent){
     var r = obj.detachEvent("on"+evType, fn);
     return r;
   } else {
     alert("Handler could not be removed");
     return false;
   }
 }

 /**
  * Code below taken from - http://www.evolt.org/article/document_body_doctype_switching_and_more/17/30655/
  *
  * Modified 4/22/04 to work with Opera/Moz (by webmaster at subimage dot com)
  *
  * Gets the full width/height because it's different for most browsers.
  */
EFModalWindow.getViewportHeight = function() {
 	if (window.innerHeight!=window.undefined) return window.innerHeight;
 	if (document.compatMode=='CSS1Compat') return document.documentElement.clientHeight;
 	if (document.body) return document.body.clientHeight; 
 	return undefined; 
}
 
EFModalWindow.getViewportWidth = function() {
 	if (window.innerWidth!=window.undefined) return window.innerWidth; 
 	if (document.compatMode=='CSS1Compat') return document.documentElement.clientWidth; 
 	if (document.body) return document.body.clientWidth; 
 	return undefined; 
 }

 /**
  * Gets the real scroll top
  */
  EFModalWindow.getScrollTop = function() {
 	if (self.pageYOffset) // all except Explorer
 	{
 		return self.pageYOffset;
 	}
 	else if (document.documentElement && document.documentElement.scrollTop)
 		// Explorer 6 Strict
 	{
 		return document.documentElement.scrollTop;
 	}
 	else if (document.body) // all other Explorers
 	{
 		return document.body.scrollTop;
 	}
 	return -1;
 }
  
  EFModalWindow.getScrollLeft = function() {
 	if (self.pageXOffset) // all except Explorer
 	{
 		return self.pageXOffset;
 	}
 	else if (document.documentElement && document.documentElement.scrollLeft)
 		// Explorer 6 Strict
 	{
 		return document.documentElement.scrollLeft;
 	}
 	else if (document.body) // all other Explorers
 	{
 		return document.body.scrollLeft;
 	}
 	return -1;
 }
