app.directive('linechart', function() {

    return {
        restrict: 'E',
        scope: {
            data: '=',
            caption: '=',
            colors: '=',
            labels: '=',
            textx: '='
        },
        template: '<div class="ds-linechart"></div>',
        replace: true,
        link: function (scope, element, attrs) {

            var svg = d3.select(".ds-linechart").append('svg').attr('width', "900").attr('height', '500'),
                margin = {top: 20, right: 80, bottom: 30, left: 50},
                width = 900 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom,
                g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            scope.$watch('data', function(newVal) {
                scope.data = newVal;
                updateChart();
            });

            scope.$watch('labels', function(newVal) {
                scope.labels = newVal;
                updateChart();
            });

            scope.$watch('textx', function(newVal) {
                scope.textx = newVal;
                updateChart();
            });

            function updateChart() {
                var x = d3.scaleOrdinal(scope.data[0].map(function(elem, index, array) { return index * (width / array.length ) })),
                    y = d3.scaleLinear().range([height, 0]),
                    z = d3.scaleOrdinal(d3.schemeCategory10),
                    maxVal = d3.max(scope.data, function(array) {
                        return d3.max(array);
                    });

                var line = d3.line()
                //.curve(d3.curveBasis)
                    .x(function(d,i) { return x(i); })
                    .y(function(d,i) { return y(d); });


                x.domain(scope.labels);

                y.domain([0,maxVal]);

                z.domain([0, 2]);

                g.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                g.append("g")
                    .attr("class", "axis axis--y")
                    .call(d3.axisLeft(y))
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .attr("fill", "#000")
                    .text(scope.textx);

                var paths = g.selectAll(".path")
                    .data(scope.data)
                    .enter()
                    .append("g")
                    .attr("class", "path");

                paths.append("path")
                    .attr("class", "line")
                    .attr("d", function(d) { return line(d); })
                    .style("stroke", function(d,i) { return z(i); })
                    .style("fill", "none");

                // paths.append("text")
                //     .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
                //     .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
                //     .attr("x", 3)
                //     .attr("dy", "0.35em")
                //     .style("font", "10px sans-serif")
                //     .text(function(d) { return d.id; });
            }

        }
    }
});
