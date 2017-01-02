app.directive('stackedbarchart', function() {

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
        template: '<div class="ds-stacked-bar-chart"></div>',
        replace: true,
        link: function (scope, element, attrs) {

            var data = [
                { A: 50, B: 9, C: 7, D: 8, E: 5},
                { A: 2, B: 1, C: 3.5, D: 7, E: 3},
                { A: 1, B: 3, C: 4, D: 5, E: 6}
            ];

            var labels = ['Monday', 'Tuesday', 'Wednesday'];
            var categories = ['A', 'B', 'C', 'D', 'E'];

            var svg = d3.select(".ds-stacked-bar-chart").append("svg").attr("width", "900").attr("height", 500),
                margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom,
                g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
                maxVal = d3.max(data, function (array) {
                    return d3.max(array);
                });

            var x = d3.scaleBand()
                .rangeRound([0, width])
                .paddingInner(0.05)
                .align(0.1);

            var y = d3.scaleLinear()
                .rangeRound([height, 0]);

            var z = d3.scaleOrdinal()
                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c"]);

            data.sort(function (a, b) {
                return b - a;
            });
            x.domain(labels);
            y.domain([0, 50]);
            z.domain(labels);

            g.append("g")
                .selectAll("g")
                .data(d3.stack().keys(categories)(data))
                .enter()
                .append("g")
                .attr("fill", function (d) {
                    return z(d);
                })
                .selectAll("rect")
                .data(function (d) {
                    return d;
                })
                .enter().append("rect")
                .attr("x", function (d,i) {
                    console.log(i);
                    return x(labels[i]);
                })
                .attr("y", function (d) {
                    return y(d[1]);
                })
                .attr("height", function (d) {
                    return y(d[0]) - y(d[1]);
                })
                .attr("width", x.bandwidth());

            g.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            g.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y).ticks(null, "s"))
                .append("text")
                .attr("x", 2)
                .attr("y", y(y.ticks().pop()) + 0.5)
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start")
                .text("Population");

            //     var legend = g.append("g")
            //         .attr("font-family", "sans-serif")
            //         .attr("font-size", 10)
            //         .attr("text-anchor", "end")
            //         .selectAll("g")
            //         .data(keys.slice().reverse())
            //         .enter().append("g")
            //         .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
            //
            //     legend.append("rect")
            //         .attr("x", width - 19)
            //         .attr("width", 19)
            //         .attr("height", 19)
            //         .attr("fill", z);
            //
            //     legend.append("text")
            //         .attr("x", width - 24)
            //         .attr("y", 9.5)
            //         .attr("dy", "0.32em")
            //         .text(function(d) { return d; });
            // }
        }
    }
});