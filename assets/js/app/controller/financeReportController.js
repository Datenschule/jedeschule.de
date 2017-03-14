app.controller('financeReportController', function($scope, statesService) {

    $scope.init = function(state) {
        statesService.get(state, function(err, statedata) {
            var year_dict = ['2000', '2005', '2010', '2015\n vorl. Ist'];
            var entries = _.filter(statedata.finanzbericht, function(o) {
                return year_dict.indexOf(o.jahr) >= 0
            });
            entries = _.groupBy(entries, 'Kategorie');
            var data = [];
            for (var category in entries) {
                var current = entries[category];
                data.push({
                    key: category,
                    values: current.map(function(o) {
                        return [o.jahr, o.wert]
                    })
                })
            }

            year_dict[3] = '2015*';
            $scope.data = data.map(function(cat, index) {
                cat.class = 'chart-color-' + index;
                cat.data = {
                    labels: year_dict,
                    series: cat.values.map(function(value) {
                        return value[1];
                    })
                };
                cat.options = {
                    height: '180px',
                    chartPadding: {
                        top: 0,
                        right: 0,
                        bottom: 10,
                        left: 10
                    },
                    axisY: {
                        labelInterpolationFnc: function(value) {
                            if (value == 0) return 0;
                            return (value / 1000000).toFixed((value < 1000000) ? 2 : 0)
                        }
                    },
                    distributeSeries: true,
                    plugins: [
                        Chartist.plugins.tooltip({
                            appendToBody: true,
                            anchorToPoint: true,
                            currency: '€ ',
                            transformTooltipTextFnc: function(value) {
                                return parseInt(value, 10).toFixed(0) + ' ';
                            }
                        })
                    ]
                };
                return cat;
            }).filter(function(cat) {
                if (cat.key === 'Allgemeinbildende und berufliche Schulen') {
                    $scope.data_special = cat;
                    return false;
                }
                return true;
            })
        });
    };


});