app.factory('statesService', function($http) {
    var states = {};
    var requests = {};
    return {
        get: function(state, cb) {
            if (!states[state]) {
                if (!requests[state]) {
                    requests[state] = [cb];
                    $http({
                        url: '/assets/data/states/' + state + '.json',
                        method: "GET"
                    })
                    .then(function(response) {
                        states[state] = response.data;
                        requests[state].forEach(function(callback) {
                            callback(null, response.data);
                        });
                        requests[state] = null;
                    })
                } else {
                    requests[state].push(cb);
                }
            } else {
                cb(null, states[state]);
            }
        }
    }
});
