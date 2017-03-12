var app = angular.module('App', ['smart-table']);
app.run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/smart-table/pagination.html',
        '<div class="pagination" ng-if="pages.length >= 2"><ul class="pagination">' +
        '<li ng-if="1!==pages[0]"><a ng-click="selectPage(1)">1 …</a></li>' +
        '<li ng-repeat="page in pages" ng-class="{active: page==currentPage}"><a ng-click="selectPage(page)">{{page}}</a></li>' +
        '<li ng-if="numPages!==pages[pages.length - 1]"><a ng-click="selectPage(numPages)">… {{numPages}}</a></li>' +
        '</ul></div>');
}]);

