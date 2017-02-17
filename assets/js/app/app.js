var app = angular.module('App', ['ngAnimate', 'ngSanitize', 'ui.select', 'angular-chartist', 'nvd3']);

app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

app.factory('schools', function($http) {
    var loaded_overview = null;
    var schools = {};
    return {
        overview: function(cb) {
            if (!loaded_overview) {
                $http({
                    url: 'https://lab.okfn.de/jedeschule/schools/all_schools_geocoded.json',
                    method: "GET"
                })
                .then(function(response) {
                    loaded_overview = response.data;
                    cb(null, response.data)
                })
            } else {
                return loaded_overview;
            }
        },
        getSchool: function(school_id, cb) {
            if (!schools[school_id]) {
                $http({
                    url: 'http://lab.okfn.de/jedeschule/schools/' + school_id + '.json',
                    method: 'GET'
                })
                    .then(function(response) {
                        schools[school_id] = response.data;
                        cb(null, response.data);
                    });
            }
            else {
                return schools[school_id];
            }
        }
    }
});

app.factory('states', function($http) {
    var states = {};
    return {
        get: function(state, cb) {
            if (!states[state]) {
                $http({
                    url:'/assets/js/app/data/' + state + '.json',
                    method: "GET"
                })
                .then(function(response) {
                    states[state] = response.data;
                    cb(null, response.data);
                })
            } else {
                return states[state]
            }
        }
    }
});

// app.factory('ag_sum', function($http) {
//    var ag_sum = {};
//     return {
//         get: function(cb) {
//             if (!ag_sum) {
//
//             }
//         }
//     }
// });
