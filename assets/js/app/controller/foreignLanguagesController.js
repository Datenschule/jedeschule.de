app.controller('foreignLanguagesController', function($scope, statesService, chartistUtilsService) {

    var chart_langs = {
        data: {},
        options: {
            height: '200px',
            distributeSeries: true,
            chartPadding: {
                top: 20,
                right: 10,
                bottom: 20,
                left: 40
            },
            axisX: {
                showLabel: true,
                showGrid: false
            },
            axisY: {
                showLabel: true,
                showGrid: true
            },
            plugins: [
                Chartist.plugins.ctBarLabels({
                    position: {
                        y: function(data) {
                            return data.y2 - 10
                        }
                    }
                })
            ]
        },
        responsive: [
            ['screen and (max-width: 768px)', {
                height: '320px',
                chartPadding: {
                    top: 20,
                    right: 10,
                    bottom: 80,
                    left: 40
                }
            }
            ]
        ],
        events: {
            created: function(event) {
                var gs = angular.element(event.svg._node).find('g');
                angular.forEach(gs, function(element, index) {
                    var el = angular.element(element);
                    if (el.hasClass('ct-series')) {
                        el.on('mouseover', function() {
                            showLanguage(el.attr('ct:meta'));
                        });
                    }
                });
            },
            draw: chartistUtilsService.rotateLabelAwareDraw
        }
    };

    var chart_schools = {
        current: null,
        color_index: 0,
        data: {},
        options: {
            height: '200px',
            chartPadding: {
                top: 20,
                right: 10,
                bottom: 20,
                left: 40
            },
            distributeSeries: true,
            axisX: {
                showLabel: true,
                showGrid: false
            },
            axisY: {
                showLabel: true,
                showGrid: true
            },
            plugins: [
                Chartist.plugins.ctBarLabels({
                    position: {
                        y: function(data) {
                            return data.y2 - 10
                        }
                    }
                })
            ]
        },
        responsive: [
            ['screen and (max-width: 768px)', {
                height: '400px',
                chartPadding: {
                    top: 20,
                    right: 10,
                    bottom: 180,
                    left: 40
                }
            }
            ]
        ],
        events: {
            draw: chartistUtilsService.rotateLabelAwareDraw
        }
    };

    $scope.chart_schools = chart_schools;
    $scope.chart_langs = chart_langs;

    $scope.init = function(state) {
        $scope.state = state;
        statesService.get($scope.state, function(err, statedata) {
            var lang_sum = _.groupBy(statedata.fremdsprachen, 'language');
            var items = Object.keys(lang_sum).map(function(key) {
                var lang = lang_sum[key];
                return {
                    meta: key,
                    value: _.sumBy(lang, 'amount')
                };
            }).filter(function(item) {
                return item.value > 0;
            }).sort(function(a, b) {
                return b.value - a.value;
            });
            chart_langs.data = {
                labels: items.map(function(item) {
                    return item.meta;
                }),
                series: items
            };
            chart_langs.all_data = _.groupBy(statedata.fremdsprachen, 'language');
            setTimeout(function() {
                showLanguage('Englisch');
            }, 0);
        });
    };

    function showLanguage(lang) {
        if (lang !== chart_schools.current) {
            chart_schools.color_index = chart_langs.data.labels.indexOf(lang);
            chart_schools.class = 'chartist-foreign-languages-select-' + chart_schools.color_index;
            if (!chart_schools.current) {
                chart_schools.current = lang;
                $scope.$apply();
            }
            chart_schools.current = lang;
            var lang_type = chart_langs.all_data[lang];
            var items = lang_type.map(function(o) {
                return {
                    meta: o.schooltype,
                    value: o.amount
                };
            }).filter(function(o) {
                return o.value > 0;
            }).sort(function(a, b) {
                return b.value - a.value;
            });
            chart_schools.data = {
                labels: items.map(function(item) {
                    return chartistUtilsService.breakSchooltype(item.meta);
                }),
                series: items
            };
            $scope.$apply();
        }
    }

});