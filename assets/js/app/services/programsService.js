app.factory('programs', function($http) {
    var programs = undefined;
    return {
        get: function(cb) {
            if (!programs) {
                $http({
                    url: '/assets/data/programs.json',
                    method: "GET"
                })
                .then(function(response) {
                    programs = response.data;
                    cb(null, response.data);
                })
            } else {
                return programs;
            }
        }
    }
});
