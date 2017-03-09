app.controller('foreignLanguagesController', function ($scope, states) {

    $scope.bardata = {};

    $scope.langdata = {};
    $scope.show_lang = false;
    $scope.showed_lang = '';

    $scope.langoptions = {
        height: '200px',
        chartPadding: {top: 20, right: 0, bottom: 55, left: 40},
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
            Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: '',
                    axisClass: 'ct-axis-title',
                    offset: {x: 0, y: 0},
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: 'Anzahl',
                    axisClass: 'ct-axis-title',
                    offset: {x: -50, y: -5},
                    flipTitle: true
                }
            }),
            Chartist.plugins.ctBarLabels({
                position: {
                    y: function (data) {
                        console.log(data);
                        return data.y2 - 10
                    }
                }
            })
        ]
    };

    $scope.baroptions = {
        height: '200px',
        distributeSeries: true,
        chartPadding: { top: 20, right: 0, bottom: 55, left: 40},
        axisX: {
            showLabel: true,
            showGrid: false
        },
        axisY: {
            showLabel: true,
            showGrid: true
        },
        plugins: [
            Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: '',
                    axisClass: 'ct-axis-title',
                    offset: {x: 0, y: 0},
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: 'Anzahl',
                    axisClass: 'ct-axis-title',
                    offset: {x: -50, y: -5},
                    flipTitle: true
                }
            }),
            Chartist.plugins.ctBarLabels({
                position: {
                    y: function (data) {
                        console.log(data);
                        return data.y2 - 10
                    }
                }
            })
        ]
    };

    $scope.barevents = {
        draw: function(data) {
            console.log('draw called');
            console.log(data);
            angular.element(data.element).addClass('test');
        }
    }

    $scope.init = function(state) {
        $scope.state = state;
        console.log(state);
        states.get($scope.state, function(err, statedata) {
            var lang_sum = _.groupBy(statedata.fremdsprachen, 'language')
            console.log(lang_sum);

            var sum_series = _.map(Object.values(lang_sum), function(lang) { return _.sumBy(lang, 'amount') });
            console.log(sum_series);

            $scope.bardata = {
                labels: Object.keys(lang_sum),
                series: sum_series
            };

            $scope.lang_schooltype = _.groupBy(statedata.fremdsprachen, 'language');
            var lang_english = $scope.lang_schooltype['Russisch'];

            $scope.langdata = {
                labels: _.map(lang_english, 'schooltype'),
                series: _.map(lang_english, 'amount')
            };

            console.log(lang_english);
        });
    };

    $('.ct-chart').on('click', '.ct-chart-bar .ct-series', function(evt) {
        var index = $(this).index();
        var label = $(this).find('span.ct-label').text();
        graphClicked(index, label, null);
    });

    function graphClicked(index, label, value) {
        console.log('---');
        console.log('language:', $scope.bardata.labels[index]);
        showDataForLanguge($scope.bardata.labels[index])
    }

    function showDataForLanguge(lang) {
        $scope.show_lang = true;
        $scope.$apply();
        console.log('show for lang called');
        var lang_type = $scope.lang_schooltype[lang];
        console.log(lang_type);
        $scope.showed_lang = lang;
        $scope.langdata.labels = _.map(lang_type, 'schooltype');
        $scope.langdata.series = _.map(lang_type, 'amount');
        $scope.$apply();
    }

});