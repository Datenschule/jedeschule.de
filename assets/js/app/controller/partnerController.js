app.controller('PartnerController', function($scope, partnershipsService) {

    $scope.init = function(name) {
        $scope.name = name;
        $scope.label = 'Partnerschaften';
        $scope.data = partnershipsService.get(name.toLowerCase(), function(err, data) {
            $scope.data = data;
        });
    };

});
