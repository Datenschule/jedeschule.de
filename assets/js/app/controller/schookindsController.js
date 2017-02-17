app.controller('SchoolkindsController', function ($scope, $http, $location, schools, states) {

    var locationParts = $location.absUrl().split('/');
    $scope.state = locationParts[locationParts.length - 2];

    $scope.active_lines = [true,true];
    $scope.data = [];
    $scope.categories = [];
    $scope.linedata = [];

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
                "key": "2005"
            },{
                "key": "2016"
            }]
        }
    };

    $scope.nvd3data = [
        {
            "2005": 0,
            "2016": 0,
            "key": "Vorklassen"
        },
        {
            "2005": 428,
            "2016": 428,
            "key": "Grundschulen"
        },
        {
            "2005": 417,
            "2016": 422,
            "key": "Schulartunabhängige Orientierungsstufe"
        },
        {
            "2005": 56,
            "2016": 0,
            "key": "Hauptschulen"
        },
        {
            "2005": 74,
            "2016": 0,
            "key": "Realschulen"
        },
        {
            "2005": 111,
            "2016": 113,
            "key": "Gymnasien"
        },
        {
            "2005": 52,
            "2016": 171,
            "key": "Integrierte Gesamtschulen"
        },
        {
            "2005": 7,
            "2016": 10,
            "key": "Freie Waldorfschulen"
        },
        {
            "2005": 93,
            "2016": 71,
            "key": "Förderschulen"
        },
        {
            "2005": 8,
            "2016": 10,
            "key": "Abendhauptschulen"
        },
        {
            "2005": 9,
            "2016": 8,
            "key": "Abendrealschulen"
        },
        {
            "2005": 2,
            "2016": 2,
            "key": "Abendgymnasien"
        },
        {
            "2005": 5,
            "2016": 5,
            "key": "Kollegs"
        }
    ];

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