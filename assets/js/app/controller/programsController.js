app.controller('ProgramsController', function($scope, $http, $location, programs) {
    $scope.chart = {
        data: {
            series: [],
            labels: []
        },
        options: {
            distributeSeries: true,
            horizontalBars: true,
            height: '450px',
            axisY: {
                offset: 140
            },
            chartPadding: {
                top: 20,
                right: 0,
                bottom: 4,
                left: 0
            },
            plugins:[
                Chartist.plugins.tooltip({
                    appendToBody: true,
                    anchorToPoint: true,
                    currency: 'Anzahl der teilnehmenden Schulen: ',
                    transformTooltipTextFnc: function(value) {
                        return parseInt(value, 10).toFixed(0) + ' ';
                    }
                })
            ]
        }
    };

    programs.get(function(err, data) {
        data.sort(function(a, b) {
            return a.amount - b.amount;
        });
        $scope.chart.data.series = data.map(function(d) {
            return d.amount;
        });
        $scope.chart.data.labels = data.map(function(d) {
            return d.name;
        });
    });
});
