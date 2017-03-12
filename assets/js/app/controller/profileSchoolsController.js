app.controller('profileSchoolsController', function($scope, $window, $location, schools) {

    $scope.itemsByPage = '50'; //needs to be string, because of <select>

    var states = {
        'BE': {name: 'Berlin'},
        'SN': {name: 'Sachsen'}
    };

    $scope.schools = schools.profileSchools(function(err, schools) {
        schools.forEach(function(school) {
            school.state = states[school.state].name;
        });
        schools = schools.sort(function(a, b) {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
        });
        $scope.schools = schools;
    });

});