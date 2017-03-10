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
                    if (selected[i].value === school.legal_status) {
                        return true;
                    }
                }
                return false;
            },
            defs: [
                {name: 'Privat', value: false},
                {name: 'Öffentlich', value: true},
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
                    if (selected[i] === school.school_type) {
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
        state: {
            selected: [],
            match: function(school, selected) {
                if (selected.length == 0) return true;
                for (var i = 0; i < selected.length; i++) {
                    if (school.state === selected[i].value) {
                        return true;
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
    var laender = {
        "BY": {
            "name": "Bayern",
            "lat": 49.109837, "lng": 11.359863,
            "bounds": [[48.011975126709956, 8.486938476562502], [50.190967765585604, 14.100952148437502]],
            "zoom": 8
        },
        "BB": {
            "name": "Brandenburg",
            "lat": 51.815406, "lng": 13.969116,
            "bounds": [[51.39577839266317, 10.491943359375002], [53.42590083926602, 16.105957031250004]],
            "zoom": 8
        },
        "HH": {
            "name": "Hamburg",
            "lat": 53.556728, "lng": 10.054931,
            "bounds": [[53.42303672152822, 9.6514892578125], [53.670273405189185, 10.353240966796877]],
            "zoom": 11
        },
        "MV": {
            "name": "Mecklenburg-Vorpommern",
            "lat": 53.761701, "lng": 12.485961,
            "bounds": [[52.75624323962823, 9.689941406250002], [54.7246201949245, 15.303955078125002]],
            "zoom": 8
        },
        "SH": {
            "name": "Schleswig-Holstein",
            "lat": 54.098060, "lng": 9.9536132,
            "bounds": [[53.19616119954287, 6.987304687500001], [55.14434917097695, 12.601318359375002]],
            "zoom": 8
        },
        "HB": {
            "name": "Bremen",
            "lat": 53.090258, "lng": 8.807364,
            "bounds": [[52.972213782326875, 8.44230651855469], [53.22206865008093, 9.144058227539064]],
            "zoom": 11
        },
        "BE": {
            "name": "Berlin",
            "lat": 52.515803, "lng": 13.39061737060547,
            "bounds": [[52.387334799335896, 13.057250976562502], [52.64056351447151, 13.759002685546877]],
            "zoom": 11
        },
        "NI": {
            "name": "Niedersachsen",
            "lat": 52.506191, "lng": 10.044250,
            "bounds": [[51.73723454645786, 6.328125000000001], [53.751958931916384, 11.942138671875]],
            "zoom": 8
        },
        "HE": {
            "name": "Hessen",
            "lat": 50.597186, "lng": 8.948364,
            "bounds": [[49.49667452747045, 6.009521484375], [51.61119461048402, 11.62353515625]],
            "zoom": 8
        },
        "SL": {
            "name": "Saarland",
            "lat": 49.371643, "lng": 6.92962646484375,
            "bounds": [[49.119725490868085, 6.248474121093751], [49.661405669242086, 7.651977539062501]],
            "zoom": 10
        },
        "NRW": {
            "name": "Nordrhein-Westfalen",
            "lat": 51.536085, "lng": 7.498168,
            "bounds": [[50.38050, 4.64172], [52.45600, 10.25573]],
            "zoom": 8
        },
        "TH": {
            "name": "Thüringen",
            "lat": 50.903032, "lng": 11.005554,
            "bounds": [[50.448760, 9.54162], [51.49677, 12.34863]],
            "zoom": 9
        },
        "BW": {
            "name": "Baden-Württemberg",
            "lat": 48.574789, "lng": 9.028015136718752,
            "bounds": [[47.546871, 6.11938], [49.74578, 11.73339]],
            "zoom": 8
        },
        "RP": {
            "name": "Rheinland-Pfalz",
            "lat": 50.095917, "lng": 7.286682,
            "bounds": [[48.90444, 4.53186], [51.044847, 10.14587]],
            "zoom": 8
        },
        "SN": {
            "name": "Sachsen",
            "lat": 50.993014, "lng": 13.26599,
            "bounds": [[50.028916, 10.41503], [52.11999, 16.029052]],
            "zoom": 8
        },
        "ST": {
            "name": "Sachsen-Anhalt",
            "lat": 51.984880, "lng": 11.672973,
            "bounds": [[50.96880, 8.87695], [53.01808, 14.49096]],
            "zoom": 8
        }
    };

    function init() {
        var searchParams = $location.search();
        initMap(searchParams.lat, searchParams.lng, searchParams.zoom);
        restoreFilters();
        load();
    }

    function load() {
        schools.overview(function(err, _schools) {

            allSchools = _schools.filter(function(school) {
                return school.lat && school.lon;
            });

            _.forEach(allSchools, function(school) {
                school.coord = L.latLng(school.lat, school.lon);
                school.coord_state = L.latLng(laender[school.state]);
            });

            var mapIcon = L.icon({
                iconUrl: '/assets/img/map_pin.png',
                iconSize: [40, 53] // size of the icon
            });
            // var popup = L.popup();
            markers = allSchools.map(function(school) {
                var marker = L.marker(school.coord, {icon: mapIcon});
                marker.school = school;
                var popup = L.popup({
                    closeButton: false
                }).setContent(school.name);
                marker.bindPopup(popup);
                marker.on('mouseover', function(e) {
                    this.openPopup();
                });
                marker.on('mouseout', function(e) {
                    this.closePopup();
                });
                return marker;
            });
            markersState = allSchools.map(function(school) {
                var marker = L.marker(school.coord_state, {icon: mapIcon});
                marker.school = school;
                return marker;
            });

            display();
        });
    }

    function initMap(lat, lng, zoom) {
        lat = lat || 51.3168;
        lng = lng || 10.5688;
        zoom = zoom || 6;

        var limit = {"_southWest": {"lat": 45, "lng": -1}, "_northEast": {"lat": 56, "lng": 23}};
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
        markersGroupState.on('clusterclick', onMarkerStateClick);

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

    function onMarkerStateClick(clusterMarker) {
        var marker = clusterMarker.layer.getAllChildMarkers()[0];
        var land = laender[marker.school.state];
        map.setZoom(land.zoom);
        map.fitBounds(land.bounds);
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

    function onMapClick(event) {
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
        if (searchParams.legal) {
            var val = searchParams.legal;
            if (val) {
                val = _.isString(val) ? [val] : val;
                filter.legal.selected = [];
                _.each(val, function(v) {
                    return _.find(filter.legal.defs, function(def) {
                        return def.name == v
                    });
                })
            }
        }
        _.each(['types', 'partner', 'entity', 'category'], function(key) {
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
        _.each(['types', 'partner', 'entity', 'category'], function(key) {
            var list_filter = filter[key];
            $location.search(key, (list_filter.selected.length > 0) ? list_filter.selected : null);
        });
        $location.search('legal', (filter.legal.selected.length > 0) ? _.map(filter.legal.selected, function(item) {
                return item.name;
            }) : null);
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    function doFilter() {
        function ignoreCase(a,b){
            return a.localeCompare(b, 'de', {'sensitivity': 'base'})
        }
        foundAddress = false;
        var newFilters = {
            types: [],
            partner: [],
            category: [],
            state: [],
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
                filter.state.match(school, filter.state.selected) &&
                filter.text.match(school, filter.text.selected) &&
                filter.entity.match(school, filter.entity.selected);
            if (school.visible) {
                if (newFilters.types.indexOf(school.school_type) < 0)
                    newFilters.types.push(school.school_type);
                if (newFilters.state.indexOf(school.state) < 0)
                    newFilters.state.push(school.state);
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
        filter.state.defs = newFilters.state.map(function(state) {
            return {name: laender[state].name, value: state};
        }).sort(function(a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
        filter.entity.defs = newFilters.entity.sort(ignoreCase);
        filter.category.defs = newFilters.category.sort(ignoreCase);
        filter.partner.defs = newFilters.partner.sort(ignoreCase);
        filter.types.defs = newFilters.types.sort(ignoreCase);
    }

    var display = function() {
        if (!allSchools) {
            return;
        }
        persistFilters();

        doFilter();

        markersGroup.clearLayers();
        markersGroupState.clearLayers();
        markersGroup.addLayers(markers.filter(function(marker) {
            return marker.school.visible;
        }));
        markersGroupState.addLayers(markersState.filter(function(marker) {
            return marker.school.visible;
        }));

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
        'filter.state.selected',
        'filter.text.selected'
    ], function() {
        setTimeout(display, 200);
    });

    $scope.$watchCollection('selected', display);

    $scope.getLegalStatus = function(status){
        switch (status){
            case 0:
                return "Privat";
            case 1:
                return "Öffentlich";
            default:
                return "Unbekannt";
        }
    };

    init();

});