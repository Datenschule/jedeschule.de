app.directive('barchart', function() {

    var margin = 20;
    var width = 960;
    var height = 500 - .5 - margin;

    return {
        restrict: 'E',
        scope: {
            data: '=',
            caption: '=',
            colors: '='
        },
        template: '<div class="ds-barchart"></div>',
        replace: true,
        link: function (scope, element, attrs) {

            var grid = d3.range(25).map(function (i) {
                return {'x1': 0, 'y1': 0, 'x2': 0, 'y2': 480};
            });

            var canvas = d3.select(element[0])
                .append("svg")
                .attr("width", width)
                .attr("height", height + margin + 100);

            var tickVals = grid.map(function (d, i) {
                if (i > 0) {
                    return i * 10;
                }
                else if (i === 0) {
                    return "100";
                }
            });

            var chart_background = canvas.append('g')
                .attr("transform", "translate(0,0)")
                .attr('id', 'bars-background');
            var chart_description = canvas.append('g')
                .attr("transform", "translate(0,0)")
                .attr('id', 'bars-background');
            var chart_background_sep = canvas.append('g')
                .attr("transform", "translate(0,0)")
                .attr('id', 'bars-background');
            var chart = canvas.append('g')
                .attr("transform", "translate(0,0)")
                .attr('id', 'bars');

            scope.$watch('caption', function (newVal, oldVal) {
                scope.caption = newVal;
                updateChart();
            });

            scope.$watch('data', function (newVal, oldVal) {
                //newVal = newVal || [];
                scope.data = newVal;
                updateChart();
            });

            scope.$watch('colors', function (newVal, oldVal) {
                //newVal = newVal || [];
                scope.colors = newVal;
                updateChart();
            });

            function updateChart() {
                console.log(scope.caption);
                console.log(scope.data);
                console.log(scope);

                if (scope.data.length == 0) {
                    return;
                }

                scope.caption = scope.caption || [];

                var xscale = d3.scaleLinear()
                    .domain([0, 2800])
                    .range([0, 622]);

                var yscale = d3.scaleLinear()
                    .domain([0, scope.caption.length])
                    .range([0, 480]);

                var colorScale = d3.scaleQuantize()
                    .domain([0, scope.caption.length])
                    .range(scope.colors);

                chart_background
                    .selectAll('rect-background')
                    .data(scope.data)
                    .enter()
                    .append('rect')
                    .attr('class', 'rect-background')
                    .attr('height', 26)
                    .attr('x', 0)
                    .attr('y', function (d, i) {
                        return yscale(i);
                    })
                    .style('fill', '#e9eaee')
                    .attr('width', xscale(2800));

               chart_description
                    .selectAll('rect-background')
                    .data(scope.data)
                    .enter()
                    // .append('a')
                    // .attr({"xlink:href": "#"})
                    .append('text')
                    .attr('x', xscale(2800) + 10)
                    .attr('y', function (d, i) {
                        return yscale(i) + 19
                    })
                    .text(function (d, i) {
                        return scope.caption[i];
                    })
                    .style('fill', '#112233')
                    .style('font-size', '14px');

                chart_background_sep
                    .selectAll('rect-background')
                    .data(scope.data)
                    .enter()
                    .append('rect')
                    .attr('height', 26)
                    .attr('class', 'bars-backround-sep')
                    .attr('x', xscale(2800) - 2)
                    .attr('y', function (d, i) {
                        return yscale(i);
                    })
                    .style('fill', '#9aa9b8')
                    .attr('width', 2)
                    .text('test');

                var chartGroup = chart
                    .selectAll('.bar')
                    .data(scope.data)
                    .enter()
                    .append('g')
                    .attr('class', 'bar');

                chartGroup.append('rect')
                    .attr('height', 26)
                    .attr('class', 'rect-value')
                    .attr('x', 0)
                    .attr('y', function (d, i) {
                        return yscale(i);
                    })
                    .style('fill', function (d, i) {
                        return scope.colors[i]
                    })
                    .attr('width', function (d) {
                        return xscale(d);
                    });

                chartGroup.append('text')
                    .attr('class', 'bar-text')
                    .attr('x', function (d) {
                        return xscale(d) + 10.5
                    })
                    .attr('y', function (d, i) {
                        return yscale(i) + 19
                    })
                    .text(function (d) {
                        return d;
                    })
                    .style('fill', '#000')
                    .style('font-size', '14px');


                var transit = canvas.selectAll(".rect-value")
                    .data(scope.data)
                    .transition()
                    .duration(1000)
                    .attr("width", function (d) {
                        return xscale(d);
                    });
                var transittext = canvas.selectAll(".bar-text")
                    .data(scope.data)
                    .transition()
                    .duration(1000)
                    .attr('x', function (d) {
                        return xscale(d) + 10.5
                    })
                    .attr('y', function (d, i) {
                        return yscale(i) + 19
                    })
                    .text(function (d) {
                        return d;
                    });
            }
        }
    }
});
