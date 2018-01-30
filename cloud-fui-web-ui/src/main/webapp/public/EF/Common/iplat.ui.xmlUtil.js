( function (window) {	

    var   platXml= jQuery ;
    platXml.extend(
    {
     doc: function (rootTagName, namespaceURL)  {
     	if (!rootTagName) rootTagName = "";
	    if (!namespaceURL) namespaceURL = "";

	    if (document.implementation && document.implementation.createDocument) {
	        // This is the W3C standard way to do it
	        return $(document.implementation.createDocument(namespaceURL,rootTagName, null));
	    }
	    else { // This is the IE way to do it
	        // Create an empty document as an ActiveX object
	        // If there is no root element, this is all we have to do
	        var doc = new ActiveXObject("MSXML2.DOMDocument");

	        // If there is a root tag, initialize the document
	        if (rootTagName) {
	            // Look for a namespace prefix
	            var prefix = "";
	            var tagname = rootTagName;
	            var p = rootTagName.indexOf(':');
	            if (p != -1) {
	                prefix = rootTagName.substring(0, p);
	                tagname = rootTagName.substring(p+1);
	            }

	            // If we have a namespace, we must have a namespace prefix
	            // If we don't have a namespace, we discard any prefix
	            if (namespaceURL) {
	                if (!prefix) prefix = "a0"; // What Firefox uses
	            }
	            else prefix = "";

	            // Create the root element (with optional namespace) as a
	            // string of text
	            var text = "<" + (prefix?(prefix+":"):"") +  tagname +
	                (namespaceURL
	                 ?(" xmlns:" + prefix + '="' + namespaceURL +'"')
	                 :"") +
	                "/>";
	            // And parse that text into the empty document
	            doc.loadXML(text);
	        }
	        return $(doc);
	    }
     }   ,
     node: function(tag)  { return $($.doc('root')[0].createElement(tag));} ,
     formatXml:function(xml){ var formatted = '';
     var reg = /(>)(<)(\/*)/g;
     xml = xml.replace(reg, '$1\r\n$2$3');
     var pad = 0;
     jQuery.each(xml.split('\r\n'), function(index, node) {
         var indent = 0;
         if (node.match( /.+<\/\w[^>]*>$/ )) {
             indent = 0;
         } else if (node.match( /^<\/\w/ )) {
             if (pad != 0) {
                 pad -= 1;
             }
         } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
             indent = 1;
         } else {
             indent = 0;
         }

         var padding = '';
         for (var i = 0; i < pad; i++) {
             padding += '  ';
         }

         formatted += padding + node + '\r\n';
         pad += indent;
     });

     return formatted;
     }
    });
    
    platXml.fn.extend({
    	     appends: function(child)  
    	     {
    	    	 this[0].appendChild(child[0]) ;
    	    	 return this;
    	     },
    	    
    	     attrs:function(key,value)
    	     {
    	    	this[0].setAttribute(key,value);
    	    	return this;
    	     }     ,
    	     toXml:function()
    	     {
    	      if (typeof XMLSerializer != "undefined")
    		        return (new XMLSerializer( )).serializeToString(this[0]);
    		    else if (this[0].xml) return this[0].xml;
    		    else throw "XML.serialize is not supported or can't serialize " + this[0];
    	     }
    	
    });
	
})(window);
	


