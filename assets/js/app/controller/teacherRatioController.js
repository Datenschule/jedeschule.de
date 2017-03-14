app.controller('teacherRatioController', function($scope, statesService, chartistUtilsService) {

    $scope.chart_portion = {
        data: {},
        options: {
            stackBars: true,
            horizontalBars: true,
            height: '500px',
            high: 100,
            chartPadding: {
                top: 20,
                right: 0,
                bottom: 55,
                left: 0
            },
            axisY: {
                offset: 140
            },
            plugins: [
                Chartist.plugins.tooltip(
                    {
                        appendToBody: true,
                        anchorToPoint: false,
                        tooltipFnc: function(meta) {
                            return meta;
                        }
                    })
            ]
        }
    };

    $scope.chart_absolute = {
        data: {},
        options: {
            distributeSeries: true,
            horizontalBars: true,
            height: '500px',
            chartPadding: {
                top: 20,
                right: 30,
                bottom: 120,
                left: 10
            },
            axisX: {
                axisOffset: 140
            },
            axisY: {
                offset: 140
            },
            plugins: [
                Chartist.plugins.tooltip(
                    {
                        appendToBody: true,
                        anchorToPoint: false,
                        transformTooltipTextFnc: function(value, d) {
                            return value + ' Lehrer*innen';
                        }
                    })
            ]
        },
        events: {
            draw: chartistUtilsService.rotateOnMinDraw([40, 50])
        }
    };

    $scope.init = function(state) {
        $scope.state = state;
        statesService.get($scope.state, function(err, statedata) {
            $scope.chart_portion.data = getTeacherSeriesBySchooltypeAndEmployment(statedata.teacher);
            $scope.chart_absolute.data = getOverallTeacherSeries(statedata.teacher);
        });
    };

    function getTeacherSeriesBySchooltypeAndEmployment(raw_data) {
        var entries = _.filter(raw_data, {year: '2015'});
        var amounts = _.groupBy(entries, 'schooltype');
        var sums = {};
        for (var type in amounts) {
            sums[type] = _.sumBy(amounts[type], 'amount');
        }
        entries = _.groupBy(entries, 'volume');

        var series = [];
        for (var entry in entries) {
            var curr = entries[entry];
            curr = curr.map(function(item) {
                item.value = sums[item.schooltype] > 0 ? item.amount * 100 / sums[item.schooltype] : 0;
                return item;
            });
            series.push(curr)
        }
        var result = [[], [], []];
        series[0].forEach(function(o, i) {
            if (
                (series[0][i].value +
                series[1][i].value +
                series[2][i].value) > 0
            ) {
                result[0].push(series[0][i]);
                result[1].push(series[1][i]);
                result[2].push(series[2][i]);
            }
        });
        return {
            labels: result[0].map(function(o) {
                return o.schooltype;
            }),
            series: result.map(function(serie) {
                return serie.map(function(elem) {
                    return {value: elem.value, meta: elem.volume + ': ' + elem.value.toFixed(2) + '%'};
                })
            })
        };
    }

    function getOverallTeacherSeries(raw_data) {
        var entries = _.filter(raw_data, {year: '2015'});
        var amount_teacher = _.groupBy(entries, 'schooltype');
        var items = _.map(Object.keys(amount_teacher), function(key) {
            return {value: _.sumBy(amount_teacher[key], 'amount'), key: key}
        }).sort(function(a, b) {
            return a.value - b.value;
        }).filter(function(o) {
            return o.value > 0;
        });
        return {
            series: _.map(items, function(o) {
                return o.value;
            }),
            labels: _.map(items, function(o) {
                return o.key;
            })
        };
    }

});
