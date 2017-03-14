app.controller('foreignLanguagesController', function($scope, states,breakwordService) {

    var chart_langs = {
        data: {},
        options: {
            height: '200px',
            distributeSeries: true,
            chartPadding: {
                top: 20,
                right: 0,
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
            }
        }
    };

    var chart_schools = {
        current: null,
        color_index: 0,
        data: {},
        options: {
            height: '200px',
            chartPadding: {top: 20, right: 0, bottom: 20, left: 40},
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
        }
    };

    $scope.chart_schools = chart_schools;
    $scope.chart_langs = chart_langs;

    $scope.init = function(state) {
        $scope.state = state;
        states.get($scope.state, function(err, statedata) {
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
                    return breakwordService.breakSchooltype(item.meta);
                }),
                series: items
            };
            $scope.$apply();
        }
    }

});