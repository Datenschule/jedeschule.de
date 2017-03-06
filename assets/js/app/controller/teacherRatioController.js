app.controller('TeacherRatioController', function ($scope, $http, $location, schools, states) {

    $scope.init = function(state) {
        $scope.state = state;
        states.get($scope.state, function(err, statedata) {
            console.log(statedata.teacher);
            var entries = _.filter(statedata.teacher, { year:'2015' });
            console.log(entries);
            var amounts = _.groupBy(entries, 'schooltype');
            var sums = {};
            for (var type in amounts) {
                sums[type] = _.sumBy(amounts[type], 'amount');
            }
            entries = _.groupBy(entries, 'volume');
            console.log(entries);
            console.log(sums);
            var data = [];
            for (entry in entries) {
                var curr = entries[entry];
                curr.map(function(item) {
                    item.value = sums[item.schooltype] > 0 ? item.amount * 100 / sums[item.schooltype] : 0;
                    return item;
                })
                data.push({name: entry, data: curr})
            }
            console.log(data);
            $scope.datad3 = data;
            renderChart(data)
        });
    };

    function renderChart(dataset) {

        var margins = { top: 12, left: 250, right: 24, bottom: 24 };
        var legendPanel = { width: 100 };
        var width = 900 - margins.left - margins.right - legendPanel.width;
        var height = 400 - margins.top - margins.bottom;

        var series = dataset.map(function (d) {
            return d.name;
        });

        dataset = dataset.map(function (d) {
            return d.data.map(function (o, i) {
                // Structure it so that your numeric
                // axis (the stacked amount) is y
                return {
                    y: o.value,
                    x: o.schooltype
                };
            });
        });
        var stack = d3.layout.stack();

        stack(dataset);

        dataset = dataset.map(function (group) {
            return group.map(function (d) {
                // Invert the x and y values, and y0 becomes x0
                return {
                    x: d.y,
                    y: d.x,
                    x0: d.y0
                };
            });
        });

        var svg = d3.select('#graph')
            .append('svg')
            .attr('width', width + margins.left + margins.right  + legendPanel.width)
            .attr('height', height + margins.top + margins.bottom)
            .append('g')
            .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

        var xMax = d3.max(dataset, function (group) {
                return d3.max(group, function (d) {
                    return d.x + d.x0;
                });
            });

        var xScale = d3.scale.linear()
            .domain([0, xMax + 2])
            .range([0, width]);

        var months = dataset[0].map(function (d) {
                return d.y;
        });

        var yScale = d3.scale.ordinal()
            .domain(months)
            .rangeRoundBands([0, height], .1);

        // var xAxis = d3.svg.axis()
        //     .scale(xScale)
        //     .orient('bottom')
        //     .outerTickSize(0);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .innerTickSize(-width)
            .outerTickSize(0);

        var colours = ['#61B861', '#FFCC9A', '#C2D5EE'];

        var groups = svg.selectAll('g')
            .data(dataset)
            .enter()
            .append('g')
            .style('fill', function (d, i) {
                return colours[i];
            });

        var rects = groups.selectAll('rect')
            .data(function (d) {
                return d;
            })
            .enter()
            .append('rect')
            .attr('x', function (d) {
                return xScale(d.x0);
            })
            .attr('y', function (d, i) {
                return yScale(d.y);
            })
            .attr('height', function (d) {
                return yScale.rangeBand();
            })
            .attr('width', function (d) {
                return xScale(d.x);
            });

        // svg.append('g')
        //     .attr('class', 'axis')
        //     .attr('transform', 'translate(0,' + height + ')')
        //     .style('stroke-width', 1)
        //     .call(xAxis);

        svg.append('g')
            .attr('class', 'axis yaxis')
            .call(yAxis);

        // svg.append('text')
        //     .attr('x', width + 10)
        //     .attr('y', height + 5)
        //     .style('font-size', '9pt')
        //     .text('%');

        svg.append('rect')
            .attr('fill', 'yellow')
            .attr('width', 160)
            .attr('height', 30 * dataset.length)
            .attr('x', width + margins.left)
            .attr('y', 0);

        series.forEach(function (s, i) {
            svg.append('text')
                .attr('fill', 'black')
                .attr('x', width + 30)
                .attr('y', i * 24 + 24)
                .style('font-size', '9pt')
                .text(s);
            svg.append('rect')
                .attr('fill', colours[i])
                .attr('width', 20)
                .attr('height', 20)
                .attr('x', width)
                .attr('y', i * 24 + 6);
        });
    }
});
