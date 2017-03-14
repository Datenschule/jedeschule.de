var app = angular.module('App', ['angular-chartist', 'ngSanitize']);
app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(true);
}]);
