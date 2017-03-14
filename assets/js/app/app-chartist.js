var app = angular.module('App', ['angular-chartist']);
app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);
