app.factory('activitiesService', function($http) {
    var ags = undefined;
    return {
        get: function(cb) {
            if (!ags) {
                $http({
                    url: '/assets/data/activities.json',
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
