/**
 * Chartist.js plugin to display a data label left or right to a bar chart column.
 *
 */
/* global Chartist */
(function(window, document, Chartist) {
  'use strict';

    var defaultOptions = {
        labelClass: 'ct-label',
        labelOffset: {
            x: 20,
            y: -4
        },
        barAnchor: 'left',
        labelPrefix: '',
        labelSuffix: ''
    };

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.ctBarLabels = function(options) {

    options = Chartist.extend({}, defaultOptions, options);

    return function ctBarLabels(chart) {
        // bar labels
        if(chart instanceof Chartist.Bar) {
            chart.on('draw', function(data) {
                var centerPos = (data.y1 + data.y2)/2;
                if(data.type === 'bar') {
                    data.group.elem('text', {
                        x: data.x1 + options.labelOffset.x,
                        y: centerPos - options.labelOffset.y,
                        style: 'text-anchor: ' + options.barAnchor
                    }, options.labelClass).text(options.labelPrefix + data.value + options.labelSuffix);
                }
            });
        }
    };
  };

}(window, document, Chartist));