app.controller('activitiesController', function($scope, activitiesService) {

    $scope.data = [];

    var display = function(data) {
        if (!data) return;
        $scope.amount_schools = data[$scope.name].ag.amount;
        $scope.data = data[$scope.name].ag.entries.sort(function(a, b) {
            return b.amount - a.amount;
        }).map(function(item) {
            item.data = {
                labels: [(Math.round(item.amount * 100 / $scope.amount_schools) + '%'), ' '],
                series: [item.amount, $scope.amount_schools - item.amount]
            };
            item.options = {
                plugins: [
                    Chartist.plugins.tooltip(
                        {
                            appendToBody: true,
                            anchorToPoint: false,
                            transformTooltipTextFnc: function(value, d) {
                                return value + ' der Schulen bieten ' + item.name + ' '
                                    + (value == item.amount ? ' ' : 'nicht ')
                                    + 'an';
                            }
                        })
                ]
            };
            item.amount_pc = Math.floor(item.amount * 100 / $scope.amount_schools);
            return item;
        });
    };

    $scope.init = function(name) {
        $scope.name = name;
        var data = activitiesService.get(function(err, data) {
            display(data);
        });
        display(data);
    };

});