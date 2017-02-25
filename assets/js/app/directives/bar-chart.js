app.directive('barchart', function() {

    var margin = 20;
    var width = 960;
    var height = 500 - .5 - margin;

    return {
        restrict: 'E',
        scope: {
            data: '=',
            caption: '=',
            color: '='
        },
        template: '<div class="ds-barchart"></div>',
        replace: true,
        link: function (scope, element, attrs) {
            //scope.color = 'steelblue';

            scope.$watch('caption', function (newVal, oldVal) {
                scope.caption = newVal;
                update(scope.data);
            });

            scope.$watch('data', function (newVal, oldVal) {
                //newVal = newVal || [];
                scope.data = newVal;
                update(scope.data);
            });

            scope.$watch('color', function (newVal, oldVal) {
                //newVal = newVal || [];
                scope.color = newVal;
                console.log('switch color');
                update(scope.data);
            });

            var data = [1, 2, 3, 4, 5, 6, 7, 8];

            var margin = {top: 20, right: 20, bottom: 70, left: 40},
                width = 200 - margin.left - margin.right,
                height = 150 - margin.top - margin.bottom;

            var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

            var y = d3.scale.linear().range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .innerTickSize(-height);

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(3)
                .innerTickSize(-width);

            var svg = d3.select(element[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            function update(data) {
                console.log('update called');
                x.domain(data.map(function (d, i) {
                    return i
                }));
                y.domain([0, d3.max(data, function (d) {
                    return d;
                })]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", "-.55em")
                    .attr("transform", "rotate(-90)");

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Value ($)");

                svg.selectAll("bar")
                    .data(data)
                    .enter().append("rect")
                    .style("fill", scope.color)
                    .attr("x", function (d, i) {
                        return x(i);
                    })
                    .attr("width", x.rangeBand())
                    .attr("y", function (d) {
                        return y(d);
                    })
                    .attr("height", function (d) {
                        return height - y(d);
                    });

                //});
            }

        }
    }
});
