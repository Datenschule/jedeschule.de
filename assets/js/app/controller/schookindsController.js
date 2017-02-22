app.controller('SchoolkindsController', function ($scope, $http, $location, schools, states) {

    var relevantYears = ['2007', '2015'];

    $scope.init = function(state) {
        $scope.state = state;
        states.get($scope.state, function(err, statedata) {
            var data = relevantYears.map(function(year) {return statedata.schularten[year]});
            var keys = Object.keys(data[0]);
            var nvd3data = keys.map(function(key) {
                var result = {key: key};
                for (var i = 0; i < data.length; i++) {
                    result[relevantYears[i]] = data[i][key];
                }
                return result;
            });
            $scope.nvd3data = nvd3data;
        });
    };

    $scope.nvd3options = {
        chart: {
            type: 'parallelCoordinates',
            height: 450,
            // width: 600,
            margin: {
                top: 30,
                right: 10,
                bottom: 10,
                left: 10
            },
            dimensionData: [{
                "key": "2007"
            },{
                "key": "2015"
            }]
        }
    };

    // $scope.nvd3data = [
    //     {
    //         "2005": 0,
    //         "2016": 0,
    //         "key": "Vorklassen"
    //     }
    // ];

    $scope.nvd3config = {
        visible: true, // default: true
        extended: false, // default: false
        disabled: false, // default: false
        refreshDataOnly: true, // default: true
        deepWatchOptions: true, // default: true
        deepWatchData: true, // default: true
        deepWatchDataDepth: 2, // default: 2
        debounce: 10 // default: 10
    };

    // states.get($scope.state, function(err, data) {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log('schularten');
    //         console.log(data);
    //         $scope.schularten = data.schularten;
    //         $scope.categories = Object.keys(data.schularten['1992']);
    //         $scope.data = Object.values(data.schularten['1992']);
    //         $scope.schooltypes = data.schularten;
    //         $scope.schooltypesAfterYear = Object.keys(data.schularten).reduce(function(prev, curr) {
    //             var year = data.schularten[curr];
    //             for (var schooltype in year) {
    //                 var entry = prev[schooltype] || [];
    //                 entry.push(year[schooltype]);
    //                 prev[schooltype] = entry;
    //             }
    //             return prev
    //         }, {});
    //         $scope.refreshLineChart();
    //     }
    // });
    //
    // $scope.refreshBarchart = function(year) {
    //     $scope.data = Object.values($scope.schooltypes[year]);
    //     $scope.categories = Object.keys($scope.schooltypes[year]);
    // };
    //
    // $scope.refreshLineChart = function() {
    //     var linedata = Object.values($scope.schooltypesAfterYear).filter(function(elem, index) {
    //         return $scope.active_lines[index] == true;
    //     });
    //     $scope.linedata = linedata;
    //     $scope.labels = Object.keys($scope.schularten);
    // }
    //
    // $scope.colors = ['#0000b4', '#0082ca', '#0094ff', '#0d4bcf', '#0066AE', '#074285', '#00187B', '#285964', '#405F83', '#416545', '#4D7069', '#6E9985', '#7EBC89', '#0283AF', '#79BCBF', '#99C19E'];
    //
    // $scope.textx = 'Schulen'
});