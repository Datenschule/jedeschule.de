app.controller('MapController', function($scope, $location, schools) {

    var infoBox = {
        visible: false,
        loading: false,
        markerSchool: null,
        school: null
    };

    var filter = {
        legal: {
            selected: [],
            match: function(school, selected) {
                if (selected.length == 0) return true;
                for (var i = 0; i < selected.length; i++) {
                    if (selected.value === school.legal_status) {
                        return true;
                    }
                }
                return false;
            },
            defs: [
                {name: 'Private', value: true},
                {name: 'Öffentlich', value: false},
                {name: 'Unbekannt', value: null}
            ]
        },
        fulltime: {
            selected: false,
            match: function(school, selected) {
                if (!selected) return true;
                return (selected && school.full_time_school)
            }
        },
        profile: {
            selected: false,
            match: function(school, selected) {
                if (!selected) return true;
                return (selected && school.profile);
            }
        },
        types: {
            selected: [],
            match: function(school, selected) {
                if (selected.length == 0) return true;
                for (var i = 0; i < selected.length; i++) {
                    if (selected.value === school.school_type) {
                        return true;
                    }
                }
                return false;
            },
            defs: [] // filled by data from server
        },
        partner: {
            selected: [],
            match: function(school, selected) {
                if (selected.length == 0) return true;
                for (var i = 0; i < selected.length; i++) {
                    for (var j = 0; j < school.partner.length; j++) {
                        if (school.partner[j] === selected[i]) {
                            return true;
                        }
                    }
                }
                return false;
            },
            defs: [] // filled by data from server
        },
        category: {
            selected: [],
            match: function(school, selected) {
                if (selected.length == 0) return true;
                for (var i = 0; i < selected.length; i++) {
                    for (var j = 0; j < school.working_groups.length; j++) {
                        if (school.working_groups[j].category === selected[i]) {
                            return true;
                        }
                    }
                }
                return false;
            },
            defs: [] // filled by data from server
        },
        entity: {
            selected: [],
            match: function(school, selected) {
                if (selected.length == 0) return true;
                for (var i = 0; i < selected.length; i++) {
                    for (var j = 0; j < school.working_groups.length; j++) {
                        if (school.working_groups[j].entity === selected[i]) {
                            return true;
                        }
                    }
                }
                return false;
            },
            defs: [] // filled by data from server
        },
        text: {
            selected: '',
            match: function(school, selected) {
                if (!selected || selected.length == 0) return true;
                var searchText = selected.toLowerCase();
                var addressMatches = _.includes(school.address.toLowerCase(), searchText);
                if (addressMatches) {
                    foundAddress = true;
                    return true;
                }
                return _.includes(school.name.toLowerCase(), searchText) || _.includes(school.id.toLowerCase(), searchText);
            }
        }
    };

    $scope.filter = filter;
    $scope.infoBox = infoBox;
    $scope.progress = {};

    var allSchools;

    var map;
    var tilesLayer;

    var isLimitedToState = false;
    var markersGroup;
    var markersGroupState;
    var markers;
    var markersState;

    var foundAddress = false;
    var searchedForText = false;

    function init() {
        var searchParams = $location.search();
        initMap(searchParams.lat, searchParams.lng, searchParams.zoom);
        restoreFilters();
        load();
    }

    function load() {
        console.time("loading");
        schools.overview(function(err, _schools) {
            console.timeEnd("loading");

            allSchools = _schools.filter(function(school) {
                return school.lat && school.lon;
            });

            var laender = {
                "BY": {"lat": 49.109837, "lng": 11.359863},
                "HE": {"lat": 50.597186, "lng": 8.948364},
                "NRW": {"lat": 51.536085, "lng": 7.498168},
                "BB": {"lat": 51.815406, "lng": 13.969116},
                "HH": {"lat": 53.556728, "lng": 10.054931},
                "MV": {"lat": 53.761701, "lng": 12.485961},
                "NI": {"lat": 52.506191, "lng": 10.044250},
                "TH": {"lat": 50.903032, "lng": 11.005554},
                "SH": {"lat": 54.098060, "lng": 9.9536132},
                "HB": {"lat": 53.090258, "lng": 8.807364},
                "BW": {"lat": 48.574789, "lng": 9.028015136718752},
                "BE": {"lat": 52.515803, "lng": 13.39061737060547},
                "RP": {"lat": 50.095917, "lng": 7.286682128906251},
                "SN": {"lat": 50.993014, "lng": 13.265991210937502},
                "SL": {"lat": 49.371643, "lng": 6.92962646484375},
                "ST": {"lat": 51.984880, "lng": 11.672973632812502}
            };

            _.forEach(allSchools, function(school) {
                school.coord = L.latLng(school.lat, school.lon);
                school.coord_state = L.latLng(laender[school.state]);
            });

            console.time("making markers");
            var mapIcon = L.icon({
                iconUrl: '/assets/img/map_pin.png',
                iconSize: [40, 53] // size of the icon
            });
            markers = allSchools.map(function(school) {
                var marker = L.marker(school.coord, {icon: mapIcon});
                marker.school = school;
                return marker;
            });
            markersState = allSchools.map(function(school) {
                var marker = L.marker(school.coord_state, {icon: mapIcon});
                marker.school = school;
                return marker;
            });
            console.timeEnd("making markers");

            console.time("display");
            display();
            console.timeEnd("display");
        });
    }

    function initMap(lat, lng, zoom) {
        lat = lat || 51.0;
        lng = lng || 9.00;
        zoom = zoom || 6;

        var limit = {"_southWest": {"lat": 46.76996843356982, "lng": -0.06591796875000001}, "_northEast": {"lat": 55.15376626853556, "lng": 22.434082031250004}};
        map = L.map('map', {
            maxBounds: L.latLngBounds(limit._southWest, limit._northEast)
        }).setView([lat, lng], zoom);


        map.on('click', onMapClick);
        map.on('dragend', persistState);
        map.on('zoom', onZoomChange);
        map.on('zoomend', persistState);

        tilesLayer = L.tileLayer('https://api.mapbox.com/styles/v1/okfde/ciwxo7szj00052pnx7xgwdl1d/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib2tmZGUiLCJhIjoiY2lpOHhvMnNhMDAyNnZla280ZWhmMm96NyJ9.IvGz74dvvukg19B4Npsm1g', {
            attribution: '&copy; <a href="https://www.mapbox.com">Map Box</a> contributors',
            minZoom: 6
        }).addTo(map);

        markersGroupState = L.markerClusterGroup({
            chunkedLoading: true,
            singleMarkerMode: false,
            spiderfyOnMaxZoom: false,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false,
            maxClusterRadius: 40
        });

        markersGroup = L.markerClusterGroup({
            chunkedLoading: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            singleMarkerMode: false,
            chunkProgress: function(current, total) {
                $scope.loading = current < total;
                $scope.progress.total = total;
                $scope.progress.current = current;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        });
        markersGroup.on('click', onMarkerClick);
        isLimitedToState = zoom <= 7;
        var layer = isLimitedToState ? markersGroupState : markersGroup;
        map.addLayer(layer);
    }

    function persistState() {
        var center = map.getCenter();
        var zoom = map.getZoom();
        $location.search('lat', center.lat);
        $location.search('lng', center.lng);
        $location.search('zoom', zoom);
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    function onMarkerClick(marker) {
        infoBox.markerSchool = marker.layer.school;
        infoBox.school = schools.getSchool(infoBox.markerSchool.id, function(err, school) {
            if (infoBox.markerSchool == marker.layer.school) {
                infoBox.school = school;
                infoBox.loading = false;
            }
        });
        infoBox.loading = (!infoBox.school);
        infoBox.visible = true;
        $scope.$apply();
    }

    function onMapClick() {
        infoBox.visible = false;
        $scope.$apply();
    }

    function onZoomChange() {
        var z = map.getZoom();
        if (z <= 7) {
            if (!isLimitedToState) {
                isLimitedToState = true;
                map.removeLayer(markersGroup);
                map.addLayer(markersGroupState);
            }
        } else {
            if (isLimitedToState) {
                isLimitedToState = false;
                map.removeLayer(markersGroupState);
                map.addLayer(markersGroup);
            }
        }
    }

    function restoreFilters() {
        var searchParams = $location.search();
        if (searchParams.fulltime && searchParams.fulltime !== "false") {
            filter.fulltime.selected = true;
        }
        if (searchParams.profile && searchParams.profile !== "false") {
            filter.profile.selected = true;
        }
        if (searchParams.search_text) {
            filter.text.selected = searchParams.search_text;
        }
        _.each(['legal', 'partner', 'entity', 'category'], function(key) {
            var val = searchParams[key];
            if (val) {
                if (_.isString(val)) {
                    filter[key].selected = [val]
                } else {
                    filter[key].selected = val;
                }
            }
        });

    }

    function persistFilters() {
        $location.search('search_text', (filter.text.selected.length > 0) ? filter.text.selected : null);
        $location.search('fulltime', (filter.fulltime.selected) ? true : null);
        $location.search('profile', (filter.profile.selected) ? true : null);
        _.each(['legal', 'partner', 'entity', 'category'], function(key) {
            var list_filter = filter[key];
            $location.search(key, (list_filter.selected.length > 0) ? list_filter.selected : null);
        });
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    function doFilter() {
        foundAddress = false;
        var newFilters = {
            types: [],
            partner: [],
            category: [],
            entity: []
        };
        _.each(allSchools, function(school) {
            school.visible =
                filter.legal.match(school, filter.legal.selected) &&
                filter.fulltime.match(school, filter.fulltime.selected) &&
                filter.profile.match(school, filter.profile.selected) &&
                filter.types.match(school, filter.types.selected) &&
                filter.partner.match(school, filter.partner.selected) &&
                filter.category.match(school, filter.category.selected) &&
                filter.text.match(school, filter.text.selected) &&
                filter.entity.match(school, filter.entity.selected);
            if (school.visible) {
                if (newFilters.types.indexOf(school.school_type) < 0)
                    newFilters.types.push(school.school_type);
                _.each(school.partner, function(p) {
                    if (p.length > 0 && newFilters.partner.indexOf(p) < 0)
                        newFilters.partner.push(p);
                });
                _.each(school.working_groups, function(g) {
                    if (newFilters.category.indexOf(g.category) < 0)
                        newFilters.category.push(g.category);
                    if (newFilters.entity.indexOf(g.entity) < 0)
                        newFilters.entity.push(g.entity);
                });
            }
        });
        filter.entity.defs = newFilters.entity.sort();
        filter.category.defs = newFilters.category.sort();
        filter.partner.defs = newFilters.partner.sort();
        filter.types.defs = newFilters.types.sort();
    }

    var display = function() {
        if (!allSchools) {
            return;
        }
        persistFilters();

        console.time("filter");
        doFilter();
        console.timeEnd("filter");

        console.time("fillLayers");
        markersGroup.clearLayers();
        markersGroupState.clearLayers();
        markersGroup.addLayers(markers.filter(function(marker) {
            return marker.school.visible;
        }));
        markersGroupState.addLayers(markersState.filter(function(marker) {
            return marker.school.visible;
        }));
        console.timeEnd("fillLayers");

        if (foundAddress && searchedForText) {
            isLimitedToState = map.getZoom() <= 7;
            var layer = isLimitedToState ? markersGroupState : markersGroup;
            map.fitBounds(layer.getBounds());
        }
        searchedForText = false;
    };

    $scope.closeSlider = function() {
        infoBox.visible = false;
    };

    $scope.$watch('filter.text.selected', function(newVal) {
        if (newVal !== '') {
            searchedForText = true;
        }
    });

    $scope.$watchGroup([
        'filter.legal.selected',
        'filter.fulltime.selected',
        'filter.profile.selected',
        'filter.types.selected',
        'filter.partner.selected',
        'filter.category.selected',
        'filter.entity.selected',
        'filter.text.selected'
    ], function() {
        setTimeout(display, 200);
    });

    $scope.$watchCollection('selected', display);

    init();

});