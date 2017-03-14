var app = angular.module('App', ['ngAnimate', 'ngSanitize', 'ui.select']);
app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);