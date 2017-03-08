app.controller('PartnerController', function($scope, partnershipsService) {

    $scope.init = function(name) {
        $scope.name = name;
        $scope.label = 'Partnerschaften';
        partnershipsService.get(function(err, data) {
            $scope.data = data;
        });
    };

});
