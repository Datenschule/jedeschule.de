$(document).ready(function () {

	var parallaxElements = [];

	function parallax(scrollTop) {
		parallaxElements.forEach(function (pe) {
			pe.elm.css('marginTop', ((pe.initialOffsetY - scrollTop) / pe.speed) + 'px');
		});
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function scrollTop() {
		var doc = document.documentElement;
		return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
	}

	function init() {
		// touch event check stolen from Modernizr
		var touchSupported = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
		// if touch events are supported, tie our animation to the position to these events as well
		if (touchSupported) {
			$(window).on('touchmove', function (e) {
				parallax(e.currentTarget.scrollY);
			});
		}
		$(window).on('scroll', function (e) {
			parallax(scrollTop());
		});

		$('.parallax').each(function () {
			var $elm = $(this);
			parallaxElements.push({
				speed: $elm.data('speed') || getRandomInt(3, 6),
				elm: $elm,
				initialOffsetY: $elm.offset().top
			});
		});

		parallax(scrollTop());
	}

	init();
});
