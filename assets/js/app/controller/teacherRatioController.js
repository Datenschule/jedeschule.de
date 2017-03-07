app.controller('TeacherRatioController', function ($scope, $http, $location, schools, states) {

    $scope.data = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        series: [
            [800000, 1200000, 1400000, 1300000],
            [200000, 400000, 500000, 300000],
            [100000, 200000, 400000, 600000]
        ]
    }

    $scope.options = {
        stackBars: true,
        horizontalBars: true,
        height: '500px',
        chartPadding: {
            top: 20,
            right: 0,
            bottom: 55,
            left: 80
        },
    };

    $scope.events = {
        draw: function(data) {
            if (data.type === 'bar') {
                data.element.attr({
                    style: 'stroke-width: 80px'
                });
            }
        }
    };

    $scope.abs_data = {
        labels: ['Vorklassen', 'Grundschulen', 'Schulartunabhängige Orientierungsstufe', 'Hauptschulen', 'Realschulen',
            'Gymnasien', 'Integrierte Gesamtschulen', 'Freie Waldorfschulen', 'Förderschulen', 'Abendhauptschulen',
            'Abendrealschulen', 'Abendgymnasien', 'Kollegs'],
        series: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130]
    };

    $scope.abs_options = {
        distributeSeries: true,
        horizontalBars: true,
        height: '500px',
        chartPadding: {
            top: 20,
            right: 0,
            bottom: 55,
            left: 80
        }
    };

    $scope.init = function(state) {
        $scope.state = state;
        states.get($scope.state, function(err, statedata) {

            $scope.datad3 = getTeacherSeriesBySchooltypeAndEmployment(statedata.teacher);

            $scope.data = $scope.datad3;
            $scope.abs_data = getOverallTeacherSeries(statedata.teacher);
            //renderChart(data)
        });
    };

    //TODO: Refactor
    function getTeacherSeriesBySchooltypeAndEmployment(raw_data) {
        var entries = _.filter(raw_data, { year:'2015' });
        var amounts = _.groupBy(entries, 'schooltype');
        var sums = {};
        for (var type in amounts) {
            sums[type] = _.sumBy(amounts[type], 'amount');
        }

        entries = _.groupBy(entries, 'volume');
        var data = [];
        for (var entry in entries) {
            var curr = entries[entry];
            curr = curr.map(function(item) {
                item.value = sums[item.schooltype] > 0 ? item.amount * 100 / sums[item.schooltype] : 0;
                return item;
            });
            data.push({name: entry, data: curr})
        }
        var series = data.map(function (o) { return o.data });
        var series_data= {
            labels: series[0].map(function(o) { return o.schooltype}),
            series: series.map(function(series) { return series.map(function(elem) { return elem.value }) })

        };
        return series_data;
    }

    function getOverallTeacherSeries(raw_data) {
        var entries =  _.filter(raw_data, { year:'2015' });
        var amount_teacher = _.groupBy(entries, 'schooltype');
        var amount_teacher_series = _.map(Object.values(amount_teacher), function(o) { return _.sumBy(o, 'amount')});
        var amount_teacher_labels = Object.keys(amount_teacher);
        return {
            series: amount_teacher_series,
            labels: amount_teacher_labels
        };
    }

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
            //.attr('width', '100%')//width + margins.left + margins.right  + legendPanel.width)
            //.attr('height', height + margins.top + margins.bottom)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr('viewbox', '0 0 900 400')
            .attr('class', 'responsive-svg')
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
