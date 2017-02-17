app.controller('MapController', function ($scope, $http, $location, schools) {

    $scope.infoboxHidden = true;
    $scope.school = {};
    $scope.filter = {};
    $scope.selected = {};
    $scope.active_filters = [];
    $scope.schoolProfileFilter = false;
    $scope.fullTimeSchoolFilter = false;

    var filter_keys = ['school_type', 'legal_status'];
    var layer;
    var allSchools;
    var map;

    schools.overview(function(err, schools) {
        console.time("mapSchools");
        allSchools = schools;
        console.timeEnd("mapSchools");

        console.time("initFilters");
        initFilters(schools);
        console.timeEnd("initFilters");

        init();
    });

    function init(){
        var searchParams = $location.search();
        if (searchParams.full_time_schools && searchParams.full_time_schools !== "false"){
            $scope.fullTimeSchoolFilter = true;
        }
        if (searchParams.school_profiles && searchParams.school_profiles !== "false"){
            $scope.schoolProfileFilter = true;
        }

        filter_keys.forEach(function(key){
            var selected = searchParams[key];
            $scope.selected[key] = _.map(selected, function(value){return {name: value}});
        });

        initMap(searchParams.lat, searchParams.lng, searchParams.zoom)
    }

    function initMap(lat, lng, zoom){
        lat = lat || 51.0;
        lng = lng || 9.00;
        zoom = zoom || 6;
        map = L.map('map').setView([lat, lng], zoom);
        map.on('click', onMapClick);
        map.on('dragend', persistState)
        map.on('zoomend', persistState)

        L.tileLayer('https://api.mapbox.com/styles/v1/okfde/ciwxo7szj00052pnx7xgwdl1d/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib2tmZGUiLCJhIjoiY2lpOHhvMnNhMDAyNnZla280ZWhmMm96NyJ9.IvGz74dvvukg19B4Npsm1g', {
            attribution: '&copy; <a href="https://www.mapbox.com">Map Box</a> contributors'
        }).addTo(map);



        console.time("display");
        display();
        console.timeEnd("display");
    }

    function persistState(){
        var center = map.getCenter();
        var zoom = map.getZoom();
        $location.search('lat', center.lat);
        $location.search('lng', center.lng);
        $location.search('zoom', zoom);
        $scope.$apply();
    }

    function initFilters(schools) {
        filter_keys.forEach(function(key) {
            var filterEntries = _.chain(schools)
                                 .map(key)
                                 .uniq()
                                 .filter(function (x){ return x })
                                 .map(function(x){
                                     return {name: x};
                                 })
                                 .value();
            $scope.filter[key] = filterEntries;
        })
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

    function onClusterClick(cluster){
        $scope.singleSchool = false;
        // cluster.layer is actually a cluster
        $scope.schools = _.countBy(cluster.layer.getAllChildMarkers(), "school.school_type");
        $scope.infoboxHidden = false;
        $scope.$apply();
    }

    function persistFilters(){
        _.forEach($scope.selected, function(values, key){
            $location.search(key, values.map(function(value){return value.name}));
        });
        if ($scope.fullTimeSchoolFilter){
            $location.search('full_time_schools', true);
        } else {
            $location.search('full_time_schools', false);
        }

        if ($scope.schoolProfileFilter){
            $location.search('school_profiles', true);
        } else {
            $location.search('school_profiles', null);
        }
    }

    $scope.closeSlider = function(){
        $scope.infoboxHidden = true;
    };

    function filterSchools(schools){
        persistFilters();
        var filtered = schools.map(function(school) { school.displayed = true; return school;});

        _.forEach($scope.selected, function(filter, key){
            var entries = filter.map(function (x){ return x.name });
            if (entries.length) {
                filtered.forEach(function (school) {
                    if (school.displayed && entries.indexOf(school[key]) < 0) {
                        school.displayed = false;
                    }
                })
            }
        });

        if ($scope.schoolProfileFilter){
            filtered.forEach(function(school){
                if (school.displayed && !school.profile){
                    school.displayed = false;
                }
            })
        }

        if ($scope.fullTimeSchoolFilter){
            filtered.forEach(function(school){
                if (school.displayed && !school.full_time_school){
                    school.displayed = false;
                }
            })
        }

        return filtered;
    }

    var display = function() {
        if (!allSchools) {
            return;
        }
        var filtered = filterSchools(allSchools);

        if (layer) {
            map.removeLayer(layer);
        }

        var markers = L.markerClusterGroup({
            chunkedLoading: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false,
            singleMarkerMode: true});
        markers.on('click', onMarkerClick);
        markers.on('clusterclick', onClusterClick);

        console.time("making markers")
        var filteredMarkers = filtered
            .filter(function(school){
                return school.lat && school.lon && school.displayed;
            })
            .map(function(school) {
                var marker = L.marker(L.latLng(school.lat, school.lon));
                marker.school = school;
                return marker;
            });
        console.timeEnd("making markers");

        console.time("addLayers");
        markers.addLayers(filteredMarkers);
        console.timeEnd("addLayers");

        layer = markers;
        console.time('addLayer');
        map.addLayer(layer);
        console.timeEnd('addLayer')

    };

    $scope.$watchGroup(['schoolProfileFilter', 'fullTimeSchoolFilter'], display);
    $scope.$watchCollection('selected', display);
});