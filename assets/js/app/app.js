var app = angular.module('App', ['ngAnimate', 'ngSanitize', 'ui.select', 'nvd3', 'angular-chartist']);

app.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
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

app.filter('isEmpty', [function() {
    return function(object) {
        return angular.equals({}, object);
    }
}]);

app.factory('schools', function($http) {
    var loaded_overview = null;
    var schools = {};

    function expand(c) {
        var data = c.data;
        var items = c.items;

        items = items.split('|').map(function(row) {
            row = row.split(',');
            return row.map(function(cell) {
                if (cell === '') return 0;
                if (cell === '-') return [];
                var parts = cell.split(';');
                if (parts.length > 1) {
                    return parts.map(function(p) {
                        if (p === '') return 0;
                        return p;
                    });
                }
                return cell;
            });
        });

        data.school_type = data.school_type.split(',');
        data.text = data.text.split(',');
        data.partner = data.partner.split(',');
        data.working_groups = data.working_groups.split(',');
        data.plz = data.plz.split(',');
        data.lng = data.lng.map(function(v) {
            return v + data.minlng;
        });
        data.lat = data.lat.map(function(v) {
            return v + data.minlat;
        });

        var unpackId = function(v, state) {
            return state + '-' + v.toString();
        };

        var indexGet = function(array, v) {
            return array[parseInt(v, 10)];
        };

        var unpackLat = function(v) {
            return parseInt(v, 10) / 1000;
        };

        var unpackLng = function(v) {
            return parseInt(v, 10) / 1000;
        };

        var unpackTristateBoolean = function(v) {
            if (v == 2) return null;
            return v == 1;
        };

        var unpackText = function(v) {
            if (typeof v !== 'object') {
                v = [v];
            }
            return v.map(function(i) {
                return data.text[i];
            }).join(' ');
        };

        var unpackWorkingGroups = function(school, v) {
            school.working_groups = [];
            if (typeof v !== 'object') {
                v = [v];
            }
            school.working_groups = v.map(function(c) {
                var val = indexGet(data.working_groups, c).split('|');
                return {category: val[0], entity: val[1]};
            });
        };

        var unpackPartner = function(school, v) {
            school.partner = [];
            if (typeof v !== 'object') {
                v = [v];
            }
            school.partner = v.map(function(c) {
                return indexGet(data.partner, c);
            });
        };

        var unpackPLZ = function(v) {
            return indexGet(data.plz, v);
        };

        var result = items.map(function(row, i) {
            var school = {programs: {}};
            school.state = indexGet(data.state, row[0]);
            school.id = unpackId(row[1], school.state);
            school.lat = unpackLat(row[2]);
            school.lon = unpackLng(row[3]);
            school.full_time_school = unpackTristateBoolean(row[4]);
            school.legal_status = unpackTristateBoolean(row[5]);
            school.school_type = indexGet(data.school_type, row[6]);
            school.name = unpackText(row[7]);
            unpackWorkingGroups(school, row[8]);
            unpackPartner(school, row[9]);
            school.address = unpackPLZ(row[10]);
            school.profile = row[11] == '1';
            return school;
        });

        return result;
    }

    return {
        overview: function(cb) {
            if (!loaded_overview) {
                $http({
                    url: 'https://lab.okfn.de/jedeschule/all_schools_compact.json',
                    method: "GET"
                })
                .then(function(response) {
                    loaded_overview = expand(response.data);
                    cb(null, loaded_overview)
                })
            } else {
                return loaded_overview;
            }
        },
        getSchool: function(school_id, cb) {
            if (!schools[school_id]) {
                $http({
                    url: 'https://lab.okfn.de/jedeschule/schools/' + school_id + '.json',
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
                    url: '/assets/js/app/data/' + state + '.json',
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

app.factory('ag', function($http) {
    var ags = undefined;
    return {
        get: function(cb) {
            if (!ags) {
                $http({
                    url: '/assets/js/app/data/activities.json',
                    method: "GET"
                })
                .then(function(response) {
                    ags = response.data;
                    cb(null, response.data);
                })
            } else {
                return ags
            }
        }
    }
});

app.factory('partnershipsService', function($http) {
    var partnerships = {};
    return {
        get: function(name, cb) {
            if (!partnerships[name]) {
                $http({
                    url: '/assets/js/app/data/partnerships-' + name + '.json',
                    method: "GET"
                })
                .then(function(response) {
                    partnerships[name] = response.data;
                    cb(null, response.data);
                })
            } else {
                return partnerships[name]
            }
        }
    }
});

app.factory('programs', function($http) {
    var programs = undefined;
    return {
        get: function(cb) {
            console.log('programs');
            if (!programs) {
                $http({
                    url: '/assets/js/app/data/programs.json',
                    method: "GET"
                })
                .then(function(response) {
                    console.log('programs called');
                    programs = response.data;
                    cb(null, response.data);
                })
            } else {
                return programs;
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
