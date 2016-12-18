'use strict';

//script to compile all those little svg sprites into one and generate a scss sprite map to use via css background

var SVGSpriter = require('svg-sprite'),
	path = require('path'),
	mkdirp = require('mkdirp'),
	fs = require('fs');

var counter = 0;
var config = {
		"log": "info",
		shape: {
			id: {
				generator: function (name) {
					return (++counter).toString();// path.basename(name, '.svg').toLowerCase();
				}
			},
			spacing             : {                         // Spacing related options
				padding         : 10,                        // Padding around all shapes
				box             : 'content'                 // Padding strategy (similar to CSS `box-sizing`)
			}
			, dimension           : {                         // Dimension related options
				maxWidth        : 100,                     // Max. shape width
				maxHeight       : 100,                     // Max. shape height
				precision       : 2,                        // Floating point precision
				attributes      : false                    // Width and height attributes on embedded shapes
			}
		},
		mode: {
			css: {
				render: {
					scss: {
						dest: '_sprites.scss',
						template: './scss.template'
					}
				},
				mixin: 'svg-sprite',
				bust: false,
				prefix: ".svg-%s",
				sprite: "sprites.svg",
				example: false,
				dest: "../assets/style/svg/"
			}
		}
	},
	spriter = new SVGSpriter(config);

var files = fs.readdirSync('./svg/');
files.forEach(function (file, i) {
	file = '../assets/svg/' + file;
	spriter.add(path.resolve(file), file, fs.readFileSync(path.resolve(file), {encoding: 'utf-8'}));
});

spriter.compile(function (error, result, cssData) {
	for (var mode in result) {
		if (mode == 'css') {
			for (var type in result[mode]) {
				console.log('writing', result[mode][type].path);
				mkdirp.sync(path.dirname(result[mode][type].path));
				fs.writeFileSync(result[mode][type].path, result[mode][type].contents);
			}
		}
	}
});
