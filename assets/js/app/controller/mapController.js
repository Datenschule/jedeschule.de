app.controller('MapController', function ($scope, $http, schools) {

    $scope.infoboxHidden = true;
    $scope.school = {};
    $scope.filter = {};
    $scope.selected = {};
    $scope.active_filters = [];
    $scope.schoolProfileFilter = false;

    var filter_keys = ['school_type', 'legal_status'];
    var layer = undefined;
    var base_url = "https://lab.okfn.de/jedeschule/data";

    schools.overview(function(err, schools) {
        console.log('loaded schools');
        initMap(schools);
        initFilters(schools);
        $scope.all_schools = schools.map(function(school) { school.filtered = false; return school;});
        console.log('finished adding markers');
        display();
    });

    function initFilters(schools) {
        filter_keys.forEach(function(key) {
            var entries = schools.map(function(school) { return school[key] });
            var unique_entries = entries.filter(function(v, i, a) { return a.indexOf(v) === i });
            var filterEntries = unique_entries.reduce(function(prev,entry) { if (entry) prev.push({name: entry}); return prev }, []);
            $scope.filter[key] = filterEntries;
        })
    }


    var map = L.map('map').setView([51.00, 9.00], 6);
    map.on('click', onMapClick);

    L.tileLayer('https://api.mapbox.com/styles/v1/okfde/ciwxo7szj00052pnx7xgwdl1d/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib2tmZGUiLCJhIjoiY2lpOHhvMnNhMDAyNnZla280ZWhmMm96NyJ9.IvGz74dvvukg19B4Npsm1g', {
        attribution: '&copy; <a href="https://www.mapbox.com">Map Box</a> contributors'
    }).addTo(map);

    function initMap(schools) {
        var markers = L.markerClusterGroup({
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false,
            singleMarkerMode: true});
        markers.on('click', onMarkerClick);

        var theMarkers = schools.filter(function(school){
            return school.lat && school.lon;
        }).map(function(school){
            var marker = L.marker([school.lat, school.lon]);
            marker.school = school;
            return marker
        });
        markers.addLayers(theMarkers);
        layer = markers;
        map.addLayer(markers);
        //display();
    }

    function onMarkerClick(marker) {
        $scope.singleSchool = true;
        $scope.school = marker.layer.school;
        $scope.infoboxHidden = false;
        $scope.$apply();
    }

    function onMapClick() {
        $scope.infoboxHidden = true;
        $scope.$apply();
    }

    var display = function() {
        if (!$scope.all_schools) {
            return;
        }
        var filtered = $scope.all_schools.map(function(school) { school.displayed = true; return school;});
        //apply filters
        for (var filter in $scope.selected) {
            var entries = $scope.selected[filter].map(function (x){ return x.name });
            filtered.forEach(function (school) {
                if (school.displayed) {
                    if (entries.length && entries.indexOf(school[filter]) < 0){
                        school.displayed = false;
                    }
                }
            });
        }
        if ($scope.schoolProfileFilter){
            filtered.forEach(function(school){
                if (school.displayed && !school.profile){
                    school.displayed = false;
                }
            })
        }
        $scope.all_schools = filtered;
        if (layer) {
            map.removeLayer(layer);
        }

        var markers = L.markerClusterGroup({
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false,
            singleMarkerMode: true});
        markers.on('click', onMarkerClick);
        markers.on('clusterclick', function (a) {
            $scope.singleSchool = false;
            // a.layer is actually a cluster
            $scope.schools = _.countBy(a.layer.getAllChildMarkers(), "school.school_type");
            $scope.infoboxHidden = false;
            $scope.$apply();
        });


        var filteredMarkers = $scope.all_schools
            .filter(function(school){
                return school.lat && school.lon && school.displayed;
            })
            .map(function(school) {
                var marker = L.marker([school.lat, school.lon]);
                marker.school = school;
                return marker;
            });
        markers.addLayers(filteredMarkers);
        layer = markers;
        map.addLayer(layer);
    };

    $scope.$watch('schoolProfileFilter',display);

    filter_keys.forEach(function(key) {
        $scope.selected[key] = [];
        $scope.$watch('selected.' + key, function(o) {
            display();
        })
    })

});