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
