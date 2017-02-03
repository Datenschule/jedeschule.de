app.controller('schoolProfileController', function ($scope, $http,$location, schools) {
    var school_id = $location.absUrl().split('?')[1].split('=')[1];
    schools.getSchool(school_id, function(err, data) {
        $scope.school = data;
        var coordinates = [$scope.school.lat, $scope.school.lon];
        var marker = L.marker([$scope.school.lat, $scope.school.lon]).addTo(map);
        map.setView(coordinates, 8);
        $scope.students.year = Object.keys(data.profile.students)[0];
        $scope.students.data = data.profile.students[$scope.students.year];
    });
    $scope.students = {
        year: '2014',
        data: {}
    };
    $scope.specialValue = {
        "id": "12345",
        "value": "green"
    };

    $scope.$watch('students.year', function() {
        if ($scope.school)
            $scope.students.data = $scope.school.profile.students[$scope.students.year];
    });

    var map = L.map('map-profile', { zoomControl:false }).setView([51.505, -0.09], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/okfde/ciwxo7szj00052pnx7xgwdl1d/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib2tmZGUiLCJhIjoiY2lpOHhvMnNhMDAyNnZla280ZWhmMm96NyJ9.IvGz74dvvukg19B4Npsm1g', {
        attribution: '&copy; <a href="https://www.mapbox.com">Map Box</a> contributors'
    }).addTo(map);
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
});