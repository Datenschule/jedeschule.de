app.factory('schools', function($http) {
    var loaded_overview = null;
    var loaded_profile_overview = null;
    var schools = {};

    function expandOverview(c) {
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

    function expandProfileOverview(c) {
        var data = c.data;
        var items = c.items;

        items = items.split('|').map(function (row) {
            row = row.split(',');
            return row.map(function (cell) {
                if (cell === '') return 0;
                if (cell === '-') return [];
                var parts = cell.split(';');
                if (parts.length > 1) {
                    return parts.map(function (p) {
                        if (p === '') return 0;
                        return p;
                    });
                }
                return cell;
            });
        });

        data.school_type = data.school_type.split(',');
        data.text = data.text.split(',');
        data.plz = data.plz.split(',');

        var unpackId = function (v, state) {
            return state + '-' + v.toString();
        };

        var indexGet = function (array, v) {
            return array[parseInt(v, 10)];
        };

        var unpackTristateBoolean = function (v) {
            if (v == 2) return null;
            return v == 1;
        };

        var unpackText = function (v) {
            if (typeof v !== 'object') {
                v = [v];
            }
            return v.map(function (i) {
                return data.text[i];
            }).join(' ');
        };

        var unpackPLZ = function (v) {
            return indexGet(data.plz, v);
        };

        var result = items.map(function (row, i) {
            var school = {programs: {}};
            school.state = indexGet(data.state, row[0]);
            school.id = unpackId(row[1], school.state);
            school.full_time_school = unpackTristateBoolean(row[2]);
            school.legal_status = unpackTristateBoolean(row[3]);
            school.school_type = indexGet(data.school_type, row[4]);
            school.name = unpackText(row[5]);
            school.address = unpackPLZ(row[6]);
            return school;
        });

        return result;
    }

    return {
        overview: function(cb) {
            if (!loaded_overview) {
                $http({
                    url: '/assets/data/all_schools_compact.json',
                    method: "GET"
                })
                .then(function(response) {
                    loaded_overview = expandOverview(response.data);
                    cb(null, loaded_overview)
                })
            } else {
                return loaded_overview;
            }
        },
        profileSchools: function(cb) {
            if (!loaded_profile_overview) {
                $http({
                    url: '/assets/data/profile_schools_compact.json',
                    method: "GET"
                })
                .then(function(response) {
                    loaded_profile_overview = expandProfileOverview(response.data);
                    cb(null, loaded_profile_overview)
                })
            } else {
                return loaded_profile_overview;
            }
        },
        getSchool: function(school_id, cb) {
            if (!schools[school_id]) {
                $http({
                    url: '/assets/data/schools/' + school_id + '.json',
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
