var scrolltotop = {
	// startline: Integer. Number of pixels from top of doc scrollbar is
	// scrolled before showing control
	// scrollto: Keyword (Integer, or "Scroll_to_Element_ID"). How far to scroll
	// document up when control is clicked on (0=top).
	setting : {
		startline : 1,
		scrollto : 0,
		scrollduration : 80,
		fadeduration : [ 500, 100 ]
	},
	controlHTML : '<img src="webjars/public/EF/Images/gotop2.png" style="width:31px; height:31px;" />', // HTML
	// for control, which is auto wrapped in DIV w/ ID="topcontrol"
	controlattrs : {
		offsetx : 20,
		offsety : 20
	}, // offset of control relative to
	// right/ bottom of window
	// corner
	anchorkeyword : '#top', // Enter href value of HTML anchors on the page that
	// should also act as "Scroll Up" links

	state : {
		isvisible : false,
		shouldvisible : false
	},

	scrollup : function() {
		if (!this.cssfixedsupport) // if control is positioned using JavaScript
			this.$control.css({
				opacity : 0
			}) // hide control immediately after
			// clicking it
		var dest = isNaN(this.setting.scrollto) ? this.setting.scrollto
				: parseInt(this.setting.scrollto)
		if (typeof dest == "string" && jQuery('#' + dest).length == 1) // check
			// element
			// set by
			// string
			// exists
			dest = jQuery('#' + dest).offset().top
		else
			dest = 0
		this.$body.animate({
			scrollTop : dest
		}, this.setting.scrollduration);
	},

	keepfixed : function() {
		var $window = jQuery(window);
		var controlx = $window.scrollLeft() + $window.width()
				- this.$control.width() - this.controlattrs.offsetx;
		var controly = $window.scrollTop() + $window.height()
				- this.$control.height() - this.controlattrs.offsety;
		this.$control.css({
			left : controlx + 'px',
			top : controly + 'px'
		});
	},

	togglecontrol : function() {
		var scrolltop = jQuery(window).scrollTop();
		if (!this.cssfixedsupport)
			this.keepfixed();
		this.state.shouldvisible = (scrolltop >= this.setting.startline) ? true 	: false;
		if (this.state.shouldvisible && !this.state.isvisible) {
			this.$control.stop().fadeIn();
			this.state.isvisible = true;
		} else if (this.state.shouldvisible == false && this.state.isvisible) {
			this.$control.stop().fadeOut();
			this.state.isvisible = false;
		}
	},
	offset : function(x, y) {
		scrolltotop.controlattrs.offsetx = x;
		scrolltotop.controlattrs.offsety = y;
	},
	init : function() {
		jQuery(document) 	.ready(
						function($) {
							var mainobj = scrolltotop;
							var iebrws = document.all;
							mainobj.cssfixedsupport = !iebrws || iebrws
									&& document.compatMode == "CSS1Compat"
									&& window.XMLHttpRequest; // not
							// IE or IE7+ browsers in standards mode
							mainobj.$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html')
									: $('body'))
									: $('html,body');
							
							//集成到ef-form-guide中 20131225
							var _control;
							//如果存在ef-form-guide，则进行集成
							if ($("#_efFormGuide_gotop").length > 0) {
								$("#_efFormGuide_gotop").click(function() {
									mainobj.scrollup();
									return false;
								});
								_control =  $("#_efFormGuide_gotop");
							} else {
								 _control = $(	'<div id="topcontrol">'	+ mainobj.controlHTML + '</div>')
									.css({
												position : mainobj.cssfixedsupport ? 'fixed' : 'absolute',
												bottom : mainobj.controlattrs.offsety,
												right : mainobj.controlattrs.offsetx,//由于右下角按钮较多，将scrolltop按钮默认配置到左下角
												display : 'none',
												cursor : 'pointer'
											})
									.attr({ title : '回到顶部'	})
									.click(function() {
										mainobj.scrollup();
										return false;
									})
									.appendTo('body');
							}
							mainobj.$control = _control;

							if (document.all && !window.XMLHttpRequest
									&& mainobj.$control.text() != '') // loose
								// check for IE6 and below,plus whether control contains any text
								mainobj.$control.css({
									width : mainobj.$control.width()
								});// IE6- seems to require an explicit width on a DIV containing text
							mainobj.togglecontrol();
							$('a[href="' + mainobj.anchorkeyword + '"]').click(
									function() {
										mainobj.scrollup();
										return false;
									});
							$(window).bind('scroll resize', function(e) {
								mainobj.togglecontrol();
							});
							$("#topcontrol").draggable();
						})
	}
}

//初始化
$(function() {
	scrolltotop.init();
});
