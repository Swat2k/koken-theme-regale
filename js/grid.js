$(function() {

	var kLazyLoad = $K.lazy.load,
		kLazyLoadInit = $K.lazy.init,
		kPageLoading = false,
		kColNext = 0,
		kColLength = parseInt( $('#grid').attr('class').replace('col-',''), 10 ),
		regaleLazyLoad = function(override) {
			if (override) { kLazyLoad(); }
		},
		regaleLazyLoadInit = function(override) {
			$K.lazy.init();
			setTimeout( function() { $K.lazy.load(true); }, 100);
		},
		condensed = $('<div/>').css('width','100%').addClass('column condensed');

	$K.lazy.load = regaleLazyLoad;
	$K.lazy.init = kLazyLoadInit;

	(function() {
		var colContainer = '';
		for ( var i = 0, len = kColLength; i < len; i++ ) {
			colContainer += $('#grid').html();
		}
		$('#grid').html(colContainer);
	})();

	var updateGrid = function() {
		kPageLoading = false;
		$('#container > .item').each(function(i,item) {
			var _col = $('.column:eq('+kColNext+')');
			$(item).appendTo(_col);
			_col.find('.item:last').clone().appendTo(condensed);
			kColNext = (kColNext+1 >= kColLength) ? 0 : kColNext+1;
		});
		window.setTimeout(function() {
			var longestCol, shortestCol;
			$('.column').each(function(i,column) {
				if (!longestCol || $(column).outerHeight(true) > longestCol.outerHeight(true)) {
					longestCol = $(column);
				}
				if (!shortestCol || $(column).outerHeight(true) < shortestCol.outerHeight(true)) {
					shortestCol = $(column);
				}
			});
			var lastItem = longestCol.find('.item:last');
			lastItem.css('display','none');
			window.setTimeout(function() {
				if (longestCol.outerHeight(true) - shortestCol.outerHeight(true) > shortestCol.outerHeight(true)/3) {
					lastItem.appendTo(shortestCol);
				}
				lastItem.css('display','block');
				regaleLazyLoad(true);
			},1);
		},50);
	}

	$(window).off('.rjs').on('k-scroll.rjs', function() {
		regaleLazyLoad(true);
		if (kPageLoading) { return false; }
		if ( $(document).scrollTop() + $('#grid').offset().top > ($('#grid').offset().top + $('#grid').height()) - $(window).height()*3 || $('.k-lazy-loading').length < 15 ) {
			kPageLoading = true;
			$K.infinity.next();
		}
	});

	$K.infinity.check = $.noop;

	var timer;
	var afterResize = function() {
		clearTimeout(timer);
		if (window.matchMedia('(min-width: 767px)').matches) {
			$('.column').show();
			$('.column.condensed').hide();
		} else {
			if (!$('.column.condensed').length) {
				$('.column').parent().append(condensed);
			} else {
				$('.column.condensed').show();
			}
			$('.column:not(".condensed")').hide();
		}
		regaleLazyLoadInit();
		$K.responsiveImages();
	}

	$(window).on('k-infinite-loaded', updateGrid).trigger('k-infinite-loaded');
	$(window).on('resize', function() {
		clearTimeout(timer);
		timer = window.setTimeout(afterResize, 200);
	}).trigger('resize');

	regaleLazyLoadInit();

});