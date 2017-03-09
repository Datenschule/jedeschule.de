app.filter('isEmpty', [function() {
    return function(object) {
        return angular.equals({}, object);
    }
}]);
