app.controller('profileSchoolsController', function($scope, $window, $location, schools) {

    $scope.itemsByPage = 50;

    var states = {
        'BE': {name: 'Berlin'},
        'SN': {name: 'Sachsen'}
    };

    schools.profileSchools(function(err, schools) {
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

app.directive('stFilteredCollection', function () {
    return {
        require: '^stTable',
        link: function (scope, element, attr, ctrl) {
            scope.$watch(ctrl.getFilteredCollection, function(val) {
                scope.filteredCollection = val;
            })
        }
    }
});