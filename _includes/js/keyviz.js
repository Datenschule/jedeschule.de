$(document).ready(function () {
	Snap.plugin(function (Snap, Element, Paper, global) {
		Paper.prototype.circlePath = function (cx, cy, r) {
			var p = "M" + cx + "," + cy;
			p += "m" + r + ",0";
			// rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y
			p += "a" + r + "," + r + " 0 1,1 " + -(r * 2) + ",0";
			p += "a" + r + "," + r + " 0 1,1 " + (r * 2) + ",0";
			return this.path(p, cx, cy);
		};
	});

	var speed = 30000;
	var driving = null;
	var paused = false;
	var s = Snap("#keyviz");
	var bus_path = s.circlePath(500, 370, 256).attr({fill: "none", stroke: "none"});
	var bus_pathLength = Snap.path.getTotalLength(bus_path);
	var bus = s.select('.bus');
	var collisioncache = [];
	var SPRITES = {
		HOUSE: 0,
		LANTERN: 1
	};
	//clear this array for new caching to console.log after svg changes
	var static_cache = [
		{"min": 0, "max": 1609, "type": 0, "name": "house house-1"},
		{"min": 163, "max": 220, "type": 0, "name": "house house-2"},
		{"min": 231, "max": 309, "type": 0, "name": "house house-3"},
		{"min": 322, "max": 518, "type": 0, "name": "house house-4"},
		{"min": 490, "max": 682, "type": 1, "name": "lantern lantern-1"},
		{"min": 504, "max": 695, "type": 1, "name": "lantern lantern-2"},
		{"min": 587, "max": 664, "type": 0, "name": "house house-5"},
		{"min": 705, "max": 806, "type": 0, "name": "house house-6"},
		{"min": 821, "max": 902, "type": 0, "name": "house house-7"},
		{"min": 977, "max": 1049, "type": 0, "name": "house house-8"},
		{"min": 981, "max": 1162, "type": 1, "name": "lantern lantern-3"},
		{"min": 1001, "max": 1173, "type": 1, "name": "lantern lantern-4"},
		{"min": 1193, "max": 1288, "type": 0, "name": "house house-9"},
		{"min": 1348, "max": 1538, "type": 1, "name": "lantern lantern-5"},
		{"min": 1371, "max": 1450, "type": 0, "name": "house house-10"},
		{"min": 1371, "max": 1553, "type": 1, "name": "lantern lantern-6"},
		{"min": 1469, "max": 1567, "type": 0, "name": "house house-11"}
	];

	var moveBus = function (movePoint) {
		bus.transform('t' + parseInt(movePoint.x - (760)) + ',' + parseInt(movePoint.y - 344) + 'r' + (movePoint.alpha - 266));
	};

	var fixIE = function () {

		var msie = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
		if (isNaN(msie)) {
			msie = parseInt((/trident\/.*; rv:(\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
		}
		if (!isNaN(msie)) {
			var $keyviz_container = $(".box-keyvisual");
			var $keyviz = $(".box-keyvisual");
			var resizeSVG = function () {
				var ratio = 650 / 565;
				var h = ($keyviz_container.width() / ratio);
				$keyviz.css('height', h + 'px');
			};
			window.addEventListener('resize', resizeSVG);
			resizeSVG();
		}
	};

	var init = function () {

		var houses = s.selectAll('.house');
		var houses_shapes = s.selectAll('.house .shape');
		var lanterns = s.selectAll('.lantern');
		var lanterns_shapes = s.selectAll('.lantern line');

		if (static_cache.length > 0) {
			static_cache.forEach(function (cache) {
				if (cache.type == SPRITES.HOUSE) {
					houses.forEach(function (house) {
						if (house.attr('class') == cache.name) {
							house.cache = cache;
							collisioncache.push(house);
						}
					});
				} else if (cache.type == SPRITES.LANTERN) {
					lanterns.forEach(function (latern) {
						if (latern.attr('class') == cache.name) {
							latern.cache = cache;
							collisioncache.push(latern);
						}
					});
				}
			});
		} else {
			for (var pos = 0; pos <= bus_pathLength; pos += 1) {
				var movePoint = Snap.path.getPointAtLength(bus_path, pos);
				moveBus(movePoint);
				var bus_bbox = bus.getBBox();
				houses.forEach(function (house, i) {
					var shape = houses_shapes[i];
					var intersects = Snap.path.isPointInside(shape, movePoint.x, movePoint.y);
					if (intersects) {
						if (!house.cache) house.cache = {min: pos, max: 0, type: SPRITES.HOUSE};
						house.cache.max = pos;
						if (collisioncache.indexOf(house) < 0)
							collisioncache.push(house);
					}
				});
				lanterns.forEach(function (lantern, i) {
					var shape = lanterns_shapes[i];
					var intersects = Snap.path.isBBoxIntersect(shape.getBBox(), bus_bbox);
					if (intersects) {
						if (!lantern.cache) lantern.cache = {min: pos, max: 0, type: SPRITES.LANTERN};
						lantern.cache.max = pos;
						if (collisioncache.indexOf(lantern) < 0)
							collisioncache.push(lantern);
					}
				});
			}
			static_cache = collisioncache.map(function (obj) {
				obj.cache.name = obj.attr('class');
				return obj.cache;
			});

			console.log('[\n' + static_cache.map(function (o) {
					return JSON.stringify(o)
				}).join(',\n') + '\n]');
		}
		moveBus(Snap.path.getPointAtLength(bus_path, 0));
	};

	var highlight = function (movePoint, pos) {
		collisioncache.forEach(function (obj) {
			if ((pos >= obj.cache.min) && (pos <= obj.cache.max)) {
				if (!obj.highlighted) {
					obj.addClass('highlight');
					obj.highlighted = true;
					obj.cache.count = obj.cache.count || 0;
					obj.cache.count++;
				}
			} else {
				if (obj.highlighted) {
					if ((obj.cache.type !== SPRITES.HOUSE) || (obj.cache.count % 2 === 0))
						obj.removeClass('highlight');
					obj.highlighted = false;
				}
			}
		});
	};

	var drive = function () {
		driving = Snap.animate(0, bus_pathLength, function (value) {
			var movePoint = Snap.path.getPointAtLength(bus_path, value);
			moveBus(movePoint);
			highlight(movePoint, value);
		}, speed, null, function () {
			setTimeout(drive, 0);
		});
	};

	bus.click(function () {
		if (!driving) drive();
		else {
			if (paused) driving.resume();
			else driving.pause();
			paused = !paused;
		}
	});

	moveBus(Snap.path.getPointAtLength(bus_path, 0));
	fixIE();
	setTimeout(function () {
		init();
		if (!driving) drive();
	}, 300);
});

