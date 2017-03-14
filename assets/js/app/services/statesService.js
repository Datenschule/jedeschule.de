app.factory('states', function($http) {
    var states = {};
    return {
        get: function(state, cb) {
            if (!states[state]) {
                $http({
                    url: '/assets/data/states/' + state + '.json',
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
