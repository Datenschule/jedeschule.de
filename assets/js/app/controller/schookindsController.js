app.controller('SchoolkindsController', function ($scope, $http, schools) {
    $scope.data = [430,2460,4,1291,445,411,3,34,539,50,18,8];

    $scope.test = function() {
        $scope.data = [43,2460,4,1291,445,411,3,34,539,50,18,8];
    };

    $scope.categories = ["Schulkindergärten",
        "Grundschulen",
        "Schulartunabhängige Orientierungsstufe",
        "Hauptschulen",
        "Realschulen",
        "Gymnasien",
        "Integrierte Gesamtschulen",
        "Freie Waldorfschulen",
        "Förderschulen",
        "Abendrealschulen",
        "Abendgymnasien",
        "Kollegs"];

    $scope.colors = ['#0000b4', '#0082ca', '#0094ff', '#0d4bcf', '#0066AE', '#074285', '#00187B', '#285964', '#405F83', '#416545', '#4D7069', '#6E9985', '#7EBC89', '#0283AF', '#79BCBF', '#99C19E'];
    $scope.linedata = [
        [50, 9, 7, 8, 5],
        [2, 1, 3.5, 7, 3],
        [1, 3, 4, 5, 6]
    ];

    $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    $scope.textx = 'Schulen'
});