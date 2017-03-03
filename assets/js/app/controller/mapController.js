app.controller('MapController', function ($scope, $http, $location, schools) {

    $scope.infoboxHidden = true;
    $scope.school = {};
    $scope.filter = {};
    $scope.selected = {};
    $scope.schoolProfileFilter = false;
    $scope.fullTimeSchoolFilter = false;
    $scope.legalStatusFilter = {selected: []};
    $scope.legalStauses = [{'name': 'Privat', value:0}, {'name': 'Öffentlich', value:1}];
    $scope.workingGroupsFilter = {selected: []};

    var filter_keys = ['school_type'];
    var layer;
    var allSchools;
    var map;

    schools.overview(function(err, schools) {
        console.time("mapSchools");
        allSchools = schools;
        console.timeEnd("mapSchools");

        console.time("updateFilters");
        updateFilters(schools);
        console.timeEnd("updateFilters");

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

        if (searchParams.working_groups) {
            if (_.isString(searchParams.working_groups)){
                $scope.workingGroupsFilter.selected = [{name: searchParams.working_groups}]
            } else {
                $scope.workingGroupsFilter.selected = _.map(searchParams.working_groups, function(value){return {name: value}});
            }
        }

        filter_keys.forEach(function(key){
            var selected = searchParams[key];
            if (_.isUndefined(selected)){
                return
            }
            if (_.isString(selected)) {
                $scope.selected[key] = [{name: selected}];
            } else {
                $scope.selected[key] = _.map(selected, function(value){return {name: value}});
            }
        });



        initMap(searchParams.lat, searchParams.lng, searchParams.zoom)
    }

    function initMap(lat, lng, zoom){
        lat = lat || 51.0;
        lng = lng || 9.00;
        zoom = zoom || 6;
        map = L.map('map').setView([lat, lng], zoom);
        map.on('click', onMapClick);
        map.on('dragend', persistState);
        map.on('zoomend', persistState);

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

    function onMarkerClick(marker) {
        $scope.school = marker.layer.school;
        $scope.infoboxHidden = false;
        $scope.$apply();
    }

    function onMapClick() {
        $scope.infoboxHidden = true;
        $scope.$apply();
    }

    function persistFilters(){
        _.forEach($scope.selected, function(values, key){
            $location.search(key, values.map(function(value){return value.name}));
        });

        $location.search('working_groups', _.map($scope.workingGroupsFilter.selected, 'name'));

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

    var filters = {
        filterForWorkingGroups: function filterForWorkingGroups(schools){
            if ($scope.workingGroupsFilter.selected.length){
                var selected = _.map($scope.workingGroupsFilter.selected, 'name');
                return schools.filter(function(school){
                    var workingGroups = _.get(school, 'programs.working_groups');
                    if (workingGroups) {
                        var thisSchoolOffers = _.flatMap(workingGroups, "entity");
                        return _.intersection(selected, thisSchoolOffers).length
                    }
                    return false;
                });
            }
            return schools;
        },
        filterForSchoolProfiles: function filterForSchoolProfiles(schools){
            if ($scope.schoolProfileFilter){
                return schools.filter(s => s.profile);
            }
            return schools;
        },
        filterForFullTime: function filterForFullTime(schools){
            if ($scope.fullTimeSchoolFilter){
                return schools.filter(s => s.full_time_school);
            }
            return schools
        },
        filterForLegalStatus: function filterForLegalStatus(schools){
            if ($scope.legalStatusFilter.selected.length) {
                var selectedValues = _.map($scope.legalStatusFilter.selected, 'value');
                return schools.filter(s => _.includes(selectedValues, s.legal_status));
            }
            return schools
        },
        filterForName: function filterForName(schools){
            if ($scope.searchText){
                return schools.filter(function(school){
                    var searchText = $scope.searchText.toLowerCase();
                    var nameMatches = _.includes(school.name.toLowerCase(), searchText);
                    var idMatches = _.includes(school.id.toLowerCase(), searchText);
                    return nameMatches || idMatches
                })
            }
            return schools;
        },
        filterForType: function filterForType(schools){
            if ($scope.selected['school_type'] && $scope.selected['school_type'].length){
                var entries = _.map($scope.selected['school_type'], 'name');
                return schools.filter(x => _.includes(entries, x['school_type']))
            }
            return schools;
        },
    };

    function updateFilters(allSchools) {
        function updateWorkingGroups(schools){
            var filtered = _.chain(schools)
                            .thru(filters.filterForType)
                            .thru(filters.filterForFullTime)
                            .thru(filters.filterForLegalStatus)
                            .thru(filters.filterForName)
                            .thru(filters.filterForSchoolProfiles)
                            .value();
            var entities = filtered.map(function(school){
                return _.chain(school).get("programs.working_groups").map("entity").value();
            });
            var uniqueEntities = _.chain(entities).flatten().uniq().value();
            $scope.workingGroups = uniqueEntities.map(function(group) { return {name: group}});
        }

        function updateSchoolTypes(schools){
            var filtered = _.chain(schools)
                            .thru(filters.filterForWorkingGroups)
                            .thru(filters.filterForFullTime)
                            .thru(filters.filterForLegalStatus)
                            .thru(filters.filterForName)
                            .thru(filters.filterForSchoolProfiles)
                            .value();
            $scope.filter['school_type'] = _.chain(filtered)
                                            .map("school_type")
                                            .uniq()
                                            .filter(function (x){ return x })
                                            .map(function(x){
                                                return {name: x};
                                            })
                                            .value();
        }
        updateWorkingGroups(allSchools);
        updateSchoolTypes(allSchools);
    }

    var display = function() {
        if (!allSchools) {
            return;
        }
        persistFilters();

        updateFilters(allSchools);
        var filtered = _.chain(allSchools)
            .thru(filters.filterForType)
            .thru(filters.filterForFullTime)
            .thru(filters.filterForLegalStatus)
            .thru(filters.filterForName)
            .thru(filters.filterForSchoolProfiles)
            .thru(filters.filterForWorkingGroups)
            .value();

        if (layer) {
            map.removeLayer(layer);
        }

        var markers = L.markerClusterGroup({
            chunkedLoading: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            singleMarkerMode: true});
        markers.on('click', onMarkerClick);

        console.time("making markers");
        var filteredMarkers = filtered
            .filter(function(school){
                return school.lat && school.lon;
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

    $scope.closeSlider = function(){
        $scope.infoboxHidden = true;
    };

    $scope.$watchGroup(['schoolProfileFilter', 'fullTimeSchoolFilter', 'workingGroupsFilter.selected', 'searchText', 'legalStatusFilter.selected'], display);
    $scope.$watchCollection('selected', display);
});