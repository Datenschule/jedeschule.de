app.controller('SchoolkindsController', function ($scope, $http, schools) {
    $scope.data = {
        labels: [
            "Schulkindergärten",
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
            "Kollegs"
        ],
        series: [430,2460,4,1291,445,411,3,34,539,50,18,8]
    };
});