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
                schools.forEach(function (school) {
                    if (school.displayed) {
                        var workingGroups = _.get(school, 'programs.working_groups');
                        var selected = _.map($scope.workingGroupsFilter.selected, 'name');
                        if (workingGroups){
                            var thisSchoolOffers = _.flatMap(workingGroups, "entity");
                            if (!_.intersection(selected, thisSchoolOffers).length){
                                school.displayed = false;
                            }
                        }
                        else {
                            school.displayed = false;
                        }
                    }
                })
            }
        },
        filterForSchoolProfiles: function filterForSchoolProfiles(schools){
            if ($scope.schoolProfileFilter){
                schools.forEach(function(school){
                    if (school.displayed && !school.profile){
                        school.displayed = false;
                    }
                })
            }
        },
        filterForFullTime: function filterForFullTime(schools){
            if ($scope.fullTimeSchoolFilter){
                schools.forEach(function(school){
                    if (school.displayed && !school.full_time_school){
                        school.displayed = false;
                    }
                })
            }
        },
        filterForLegalStatus: function filterForLegalStatus(schools){
            if ($scope.legalStatusFilter.selected.length) {
                var selectedValues = _.map($scope.legalStatusFilter.selected, 'value');
                schools.forEach(function(school){
                    if (school.displayed && !_.includes(selectedValues, school.legal_status)){
                        school.displayed = false;
                    }
                })
            }
        },
        filterForName: function filterForName(schools){
            if ($scope.searchText){
                schools.forEach(function(school){
                    var searchText = $scope.searchText.toLowerCase();
                    var nameMatches = _.includes(school.name.toLowerCase(), searchText);
                    var idMatches = _.includes(school.id.toLowerCase(), searchText);
                    if (!nameMatches && !idMatches){
                        school.displayed = false;
                    }
                })
            }
        },
        filterForType: function filterForType(schools){
            _.forEach($scope.selected, function(filter, key){
                var entries = filter.map(function (x){ return x.name });
                if (entries.length) {
                    schools.forEach(function (school) {
                        if (school.displayed && entries.indexOf(school[key]) < 0) {
                            school.displayed = false;
                        }
                    })
                }
            });
        },
    }



    function filterSchools(schools){
        persistFilters();
        var filtered = schools.map(function(school) { school.displayed = true; return school;});

        filters.filterForType(filtered);
        filters.filterForSchoolProfiles(filtered);
        filters.filterForFullTime(filtered);
        filters.filterForLegalStatus(filtered);
        filters.filterForWorkingGroups(filtered);
        filters.filterForName(filtered);
        return filtered;
    }

    function updateFilters(allSchools) {
        function updateWorkingGroups(schools){
            schools = angular.copy(schools);

            filters.filterForType(schools);
            filters.filterForSchoolProfiles(schools);
            filters.filterForFullTime(schools);
            filters.filterForLegalStatus(schools);
            filters.filterForName(schools);
            var entities = _.filter(schools, "displayed").map(function(school){
                return _.chain(school).get("programs.working_groups").map("entity").value();
            });
            var uniqueEntities = _.chain(entities).flatten().uniq().value();
            $scope.workingGroups = uniqueEntities.map(function(group) { return {name: group}});
        }

        function updateSchoolTypes(schools){
            schools = angular.copy(schools);
            console.log(_.filter(schools, "displayed").length);

            filters.filterForWorkingGroups(schools);
            console.log(_.filter(schools, "displayed").length);
            filters.filterForSchoolProfiles(schools);
            console.log(_.filter(schools, "displayed").length);

            filters.filterForFullTime(schools);
            console.log(_.filter(schools, "displayed").length);

            filters.filterForLegalStatus(schools);
            console.log(_.filter(schools, "displayed").length);

            filters.filterForName(schools);
            $scope.filter['school_type'] = _.chain(schools)
                                            .filter("displayed")
                                            .map("school_type")
                                            .uniq()
                                            .filter(function (x){ return x })
                                            .map(function(x){
                                                return {name: x};
                                            })
                                            .value();
            console.log($scope.filter['school_type'])
        }
        // updateWorkingGroups(allSchools);
        updateSchoolTypes(allSchools);
    }

    var display = function() {
        if (!allSchools) {
            return;
        }
        updateFilters(allSchools);

        var filtered = filterSchools(allSchools);
        updateFilters(allSchools);

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

    $scope.closeSlider = function(){
        $scope.infoboxHidden = true;
    };

    $scope.$watchGroup(['schoolProfileFilter', 'fullTimeSchoolFilter', 'workingGroupsFilter.selected', 'searchText', 'legalStatusFilter.selected'], display);
    $scope.$watchCollection('selected', display);
});