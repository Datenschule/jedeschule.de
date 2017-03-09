d3.eesur = {};

app.controller('Schoolkinds2Controller', function ($scope,  $location, states) {

    var relevantYears = ['2007', '2015'];
    var colors = d3.scale.category10();
    $scope.init = function(state) {
        $scope.state = state;
        states.get($scope.state, function(err, statedata) {
            var data = relevantYears.map(function(year) {return statedata.schularten[year]});
            var keys = Object.keys(data[0]);
            var nvd3data = keys.map(function(key) {
                var result = {key: key};
                for (var i = 0; i < data.length; i++) {
                    result[relevantYears[i]] = data[i][key];
                }
                return result;
            });

            $scope.nvd3data = _.filter(nvd3data, function(elem) {
                var delta = Math.abs(elem[relevantYears[0]] - elem[relevantYears[1]]);
                return (delta / elem[relevantYears[0]] > 0.08 && delta > 10) &&
                    elem.key !== "Keine Zuordung zu einer Schulart möglich";
            });
            // render chart
            d3.select('#slopegraph')
                .datum($scope.nvd3data)
                .call(slopegraph);

            // alternative navigation
            navAlt($scope.nvd3data);
        });
    };
    // create chart
    var slopegraph = d3.eesur.slopegraph()
    // .margin({top: 20, bottom: 20, left: 100, right:100})
        .strokeColour('#130C0E')
        .keyName('key')
        .keyValueStart('2007')
        .keyValueEnd('2015')
        .h(400)
        .w(400)
        // .format(d3.format('04d'))
        // .on('mouseleave', function() {
        //     d3.selectAll('.elm').transition().style('opacity', 1);
        //     d3.selectAll('.s-line').style('stroke', function(d,i) { return colors(i)});
        // })
        .on('_leave', function (d, i) {
            d3.selectAll('.elm').transition().style('opacity', 1);
            d3.selectAll('.s-line').style('stroke', function(d,i) { return colors(i); });
        })
        .on('_hover', function (d, i) {
            highlightLine(d, i);
        });

    // reset button listener
    d3.select('#reset')
        .on('click', function () {

        });

    // navigation
    function navAlt(data) {
        d3.select('#nav-alt').append('ul')
            .selectAll('li')
            .data(data)
            .enter().append('li')
            .on('click', function (d, i) {
                highlightLine(d, i);
            })
            .text(function (d) { return d['key']; });
    }

    // highlight line and fade other lines
    function highlightLine(d, i) {
        d3.selectAll('.elm').transition().style('opacity', 0.2);
        d3.selectAll('.sel-' + i).transition().style('opacity', 1);
        d3.selectAll('.s-line').style('stroke', colors(i));
        d3.selectAll('.s-line.sel-' + i).style('stroke', colors(i));
    }

    // just for blocks viewer size
    d3.select(self.frameElement).style('height', '800px');
});

(function() {
    'use strict';

    d3.eesur.slopegraph = function module() {

        // input vars for getter setters
        var w = 600,
            h = 800,
            margin = {top: 40, bottom: 40, left: 120, right: 120},
            strokeColour = 'black',
            colors = d3.scale.category10(),
            // key data values start for left(axis) and end for right(axis)
            keyValueStart = '',
            keyValueEnd = '',
            // key value (used for ref/titles)
            keyName = '',
            format = d3.format('');

        var dispatch = d3.dispatch('_hover', '_leave');

        function wrap(text, width) {
            text.each(function (node) {
                var text = d3.select(this),
                    words = text[0][0].innerHTML.split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    x = text.attr("x"),
                    y = text.attr("y"),
                    dy = 0, //parseFloat(text.attr("dy")),
                    tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
                    }
                }
            });
        }


        function exports(_selection) {
            _selection.each(function(data) {

                // format/clean data
                data.forEach(function(d) {
                    d[keyValueStart] = +d[keyValueStart];
                    d[keyValueEnd] = +d[keyValueEnd];
                });

                // get max value(s) for y scale
                var keyValueStartMax = d3.max(data, function (d) { return d[keyValueStart]; } );
                var keyValueEndMax = d3.max(data, function (d) { return d[keyValueEnd]; } );

                // use same scale for both sides
                var yScale = d3.scale.linear()
                    .domain([0, d3.max([keyValueStartMax, keyValueEndMax])])
                    .range([h - margin.top, margin.bottom]);

                var svg = d3.select(this).append('svg')
                    .attr({
                        width: w,
                        height: h
                    })
                    .on('mouseleave', dispatch._leave);

                var lines = svg.selectAll('line')
                    .data(data);

                lines.enter().append('line')
                    .attr({
                        x1: margin.left,
                        x2: w - margin.right,
                        y1: function(d) { return yScale(d[keyValueStart]); },
                        y2: function(d) { return yScale(d[keyValueEnd]); },
                        stroke: /*strokeColour*/function(d,i) { return colors(i)},
                        'stroke-width': 1,
                        class: function (d, i) { return 's-line elm ' + 'sel-' + i; }
                    })
                    .on('mouseover', dispatch._hover);

                var rightLabels = svg.selectAll('.labels')
                    .data(data);

                rightLabels.enter().append('text')
                    .attr({
                        class: function (d, i) { return 'r-labels elm ' + 'sel-' + i; },
                        x: w - margin.right,
                        y: function(d) { return yScale(d[keyValueEnd]) + 4; },
                    })
                    .text(function (d) {
                        return /*d[keyName] + ' '*/ + format(d[keyValueEnd]);
                    })
                    .style('text-anchor','start')
                    .on('mouseover', dispatch._hover)
                    .call(wrap, 100);

                var leftLabels = svg.selectAll('.left-labels')
                    .data(data);

                leftLabels.enter().append('text')
                    .attr({
                        class: function (d, i) { return 'l-labels elm ' + 'sel-' + i; },
                        x: margin.left - 3,
                        y: function(d) { return yScale(d[keyValueStart]) + 4; }
                    })
                    .text(function (d) {
                        return d[keyName] + ' ' + format(d[keyValueStart]);
                    })
                    .style('text-anchor','end')
                    .on('mouseover', dispatch._hover)
                    .call(wrap, 100);

                var leftTitle = svg.append('text')
                    .attr({
                        class: 's-title',
                        x: margin.left - 3,
                        y: margin.top/2
                    })
                    .text(keyValueStart + ' ↓')
                    .style('text-anchor','end');

                var rightTitle = svg.append('text')
                    .attr({
                        class: 's-title',
                        x: w - margin.right,
                        y: margin.top/2
                    })
                    .text('↓ ' + keyValueEnd)
                    .style('text-anchor','start');

            });
        }

        // getter/setters for overrides
        exports.w = function(value) {
            if (!arguments.length) return w;
            w = value;
            return this;
        };
        exports.h = function(value) {
            if (!arguments.length) return h;
            h = value;
            return this;
        };
        exports.margin = function(value) {
            if (!arguments.length) return margin;
            margin = value;
            return this;
        };
        exports.strokeColour = function(value) {
            if (!arguments.length) return strokeColour;
            strokeColour = value;
            return this;
        };
        exports.keyValueStart = function(value) {
            if (!arguments.length) return keyValueStart;
            keyValueStart = value;
            return this;
        };
        exports.keyValueEnd = function(value) {
            if (!arguments.length) return keyValueEnd;
            keyValueEnd = value;
            return this;
        };
        exports.keyName = function(value) {
            if (!arguments.length) return keyName;
            keyName = value;
            return this;
        };
        exports.format = function(value) {
            if (!arguments.length) return format;
            format = value;
            return this;
        };

        d3.rebind(exports, dispatch, 'on');
        return exports;

    };

}());