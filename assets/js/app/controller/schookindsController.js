app.controller('SchoolkindsController', function ($scope, $http, $location, schools, states) {

    var locationParts = $location.absUrl().split('/');
    $scope.state = locationParts[locationParts.length - 2];

    $scope.active_lines = [true,true];
    $scope.data = [];
    $scope.categories = [];
    $scope.linedata = [];

    states.get($scope.state, function(err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log('schularten');
            console.log(data);
            $scope.schularten = data.schularten;
            $scope.categories = Object.keys(data.schularten['1992']);
            $scope.data = Object.values(data.schularten['1992']);
            $scope.schooltypes = data.schularten;
            $scope.schooltypesAfterYear = Object.keys(data.schularten).reduce(function(prev, curr) {
                var year = data.schularten[curr];
                for (var schooltype in year) {
                    var entry = prev[schooltype] || [];
                    entry.push(year[schooltype]);
                    prev[schooltype] = entry;
                }
                return prev
            }, {});
            $scope.refreshLineChart();
        }
    });

    $scope.refreshBarchart = function(year) {
        $scope.data = Object.values($scope.schooltypes[year]);
        $scope.categories = Object.keys($scope.schooltypes[year]);
    };

    $scope.refreshLineChart = function() {
        var linedata = Object.values($scope.schooltypesAfterYear).filter(function(elem, index) {
            return $scope.active_lines[index] == true;
        });
        $scope.linedata = linedata;
        $scope.labels = Object.keys($scope.schularten);
    }

    $scope.colors = ['#0000b4', '#0082ca', '#0094ff', '#0d4bcf', '#0066AE', '#074285', '#00187B', '#285964', '#405F83', '#416545', '#4D7069', '#6E9985', '#7EBC89', '#0283AF', '#79BCBF', '#99C19E'];

    $scope.textx = 'Schulen'
});