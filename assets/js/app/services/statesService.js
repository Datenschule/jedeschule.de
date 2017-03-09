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
