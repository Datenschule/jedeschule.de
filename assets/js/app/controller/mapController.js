app.controller('MapController', function($scope, $location, schools, $timeout, $http) {

    var infoBox = {
        visible: false,
        loading: false,
        markerSchool: null,
        school: null
    };

    var filter = {
        legal: {
            selected: [],
            no_selection: [],
            hasSelected: function(selected) {
                return selected && selected.length > 0;
            },
            match: function(school, selected) {
                if (!selected || selected.length == 0) return true;
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
            no_selection: false,
            hasSelected: function(selected) {
                return selected;
            },
            match: function(school, selected) {
                if (!selected) return true;
                return (selected && school.full_time_school)
            }
        },
        profile: {
            selected: false,
            no_selection: false,
            hasSelected: function(selected) {
                return selected;
            },
            match: function(school, selected) {
                if (!selected) return true;
                return (selected && school.profile);
            }
        },
        types: {
            selected: [],
            no_selection: [],
            hasSelected: function(selected) {
                return selected && selected.length > 0;
            },
            match: function(school, selected) {
                if (!selected || selected.length == 0) return true;
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
            no_selection: [],
            hasSelected: function(selected) {
                return selected && selected.length > 0;
            },
            match: function(school, selected) {
                if (!selected || selected.length == 0) return true;
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
            no_selection: [],
            hasSelected: function(selected) {
                return selected && selected.length > 0;
            },
            match: function(school, selected) {
                if (!selected || selected.length == 0) return true;
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
            no_selection: [],
            hasSelected: function(selected) {
                return selected && selected.length > 0;
            },
            match: function(school, selected) {
                if (!selected || selected.length == 0) return true;
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
            no_selection: [],
            hasSelected: function(selected) {
                return selected && selected.length > 0;
            },
            match: function(school, selected) {
                if (!selected || selected.length == 0) return true;
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
            no_selection: '',
            hasSelected: function(selected) {
                return selected && selected.length > 0;
            },
            match: function(school, selected) {
                if (!selected || selected.length == 0) return true;
                var searchText = selected.toLowerCase();
                var addressMatches = _.includes(school.address.toLowerCase(), searchText);
                if (addressMatches) {
                    foundAddress = true;
                    return true;
                }
                return _.includes(school.name.toLowerCase(), searchText);// no more id-search (finds some if plz is searched) // || _.includes(school.id.toLowerCase(), searchText);
            }
        }
    };

    $scope.filter = filter;
    $scope.hasFilter = false;
    $scope.infoBox = infoBox;
    $scope.totalCount = 0;
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
            "lat": 49.109837,
            "lng": 11.359863,
            "zoom": 8,
            "center": [
                49.101471446147784,
                11.293945312500002
            ]
        },
        "BB": {
            "name": "Brandenburg",
            "lat": 51.815406,
            "lng": 13.969116,
            "zoom": 8,
            "center": [
                52.41083961596459,
                13.298950195312504
            ]
        },
        "HH": {
            "name": "Hamburg",
            "lat": 53.556728,
            "lng": 10.054931,
            "zoom": 11,
            "center": [
                53.5466550633587,
                10.002365112304688
            ]
        },
        "MV": {
            "name": "Mecklenburg-Vorpommern",
            "lat": 53.761701,
            "lng": 12.485961,
            "zoom": 8,
            "center": [
                53.740431717276365,
                12.496948242187502
            ]
        },
        "SH": {
            "name": "Schleswig-Holstein",
            "lat": 54.09806,
            "lng": 9.9536132,
            "zoom": 8,
            "center": [
                54.17025518525991,
                9.794311523437502
            ]
        },
        "HB": {
            "name": "Bremen",
            "lat": 53.090258,
            "lng": 8.807364,
            "zoom": 11,
            "center": [
                53.0971412162039,
                8.793182373046877
            ]
        },
        "BE": {
            "name": "Berlin",
            "lat": 52.515803,
            "lng": 13.39061737060547,
            "zoom": 11,
            "center": [
                52.513949156903706,
                13.40812683105469
            ]
        },
        "NI": {
            "name": "Niedersachsen",
            "lat": 52.506191,
            "lng": 10.04425,
            "zoom": 8,
            "center": [
                52.74459673918712,
                9.1351318359375
            ]
        },
        "HE": {
            "name": "Hessen",
            "lat": 50.597186,
            "lng": 8.948364,
            "zoom": 8,
            "center": [
                50.5539345,
                8.8165283203125
            ]
        },
        "SL": {
            "name": "Saarland",
            "lat": 49.371643,
            "lng": 6.9296264,
            "zoom": 10,
            "center": [
                49.3905655,
                6.9502258
            ]
        },
        "NRW": {
            "name": "Nordrhein-Westfalen",
            "lat": 51.536085,
            "lng": 7.498168,
            "zoom": 8,
            "center": [
                51.41825,
                7.448725
            ]
        },
        "TH": {
            "name": "Thüringen",
            "lat": 50.903032,
            "lng": 11.005554,
            "zoom": 9,
            "center": [
                50.972764,
                10.945125
            ]
        },
        "BW": {
            "name": "Baden-Württemberg",
            "lat": 48.574789,
            "lng": 9.0280151,
            "zoom": 8,
            "center": [
                48.64632,
                8.926385
            ]
        },
        "RP": {
            "name": "Rheinland-Pfalz",
            "lat": 50.095917,
            "lng": 7.286682,
            "zoom": 8,
            "center": [
                49.97464,
                7.338865
            ]
        },
        "SN": {
            "name": "Sachsen",
            "lat": 50.993014,
            "lng": 13.26599,
            "zoom": 8,
            "center": [
                51.074453,
                13.222041
            ]
        },
        "ST": {
            "name": "Sachsen-Anhalt",
            "lat": 51.98488,
            "lng": 11.672973,
            "zoom": 8,
            "center": [
                51.99344,
                11.683955
            ]
        }
    };

    function init() {
        var searchParams = $location.search();
        initMap(searchParams.lat, searchParams.lng, searchParams.zoom);
        restoreFilters();
        load();
    }

    function loadHessen() {
        $http.get("/assets/data/hessen.geojson").then(function(result) {
            function onEachFeature(feature, layer) {
                layer.bindPopup("Daten aus Hessen sind leider nicht dargestellt, da wir keine Nutzungserlaubnis vom Statistischen Landesamt Hessen erhalten haben.", {autoPan: false});
                layer.on('mouseover', function(e) {
                    this.openPopup();
                });
                layer.on('mouseout', function(e) {
                    this.closePopup();
                });
            }

            var myStyle = {
                "color": "#CFCFCF",
                "weight": 2,
                "opacity": 0.3
            };
            L.geoJSON(result.data.features, {
                style: myStyle,
                onEachFeature: onEachFeature
            }).addTo(map);
        });
    }

    function load() {
        schools.overview(function(err, _schools) {

            // deprecated: schools in hesen are displayed now
            // loadHessen();

            allSchools = _schools.filter(function(school) {
                return school.lat && school.lon;
            });

            var newFilters = {
                types: [],
                partner: [],
                category: [],
                state: [],
                entity: []
            };
            _.forEach(allSchools, function(school) {
                school.coord = L.latLng(school.lat, school.lon);
                school.coord_state = L.latLng(laender[school.state]);

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
            });
            applyNewFilterDefs(newFilters, true);

            var mapIcon = L.icon({
                iconUrl: '/assets/img/map_pin.png',
                popupAnchor: [0, -55],
                iconAnchor: [20, 53],
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

    function applyNewFilterDefs(newFilters, force) {
        function ignoreCase(a, b) {
            return a.localeCompare(b, 'de', {'sensitivity': 'base'})
        }

        if (force || !filter.state.hasSelected(filter.state.selected)) {
            filter.state.defs = newFilters.state.map(function(state) {
                return {name: laender[state].name, value: state};
            }).sort(function(a, b) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
        }
        if (force || !filter.entity.hasSelected(filter.entity.selected)) {
            filter.entity.defs = newFilters.entity.sort(ignoreCase);
        }
        if (force || !filter.category.hasSelected(filter.category.selected)) {
            filter.category.defs = newFilters.category.sort(ignoreCase);
        }
        if (force || !filter.partner.hasSelected(filter.partner.selected)) {
            filter.partner.defs = newFilters.partner.sort(ignoreCase);
        }
        if (force || !filter.types.hasSelected(filter.types.selected)) {
            filter.types.defs = newFilters.types.sort(ignoreCase);
        }
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
            attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
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
        markersGroupState.on('clustermouseover', function(event) {
            event.layer.my_popup = event.layer.bindPopup("Klicken um auf das Bundesland zu zoomen", {closeButton: false, autoPan: false});
            event.layer.my_popup.openPopup();
        });
        markersGroupState.on('clustermouseout', function(event) {
            if (event.layer.my_popup) {
                event.layer.my_popup.closePopup();
            }
        });
        markersGroupState.on('click', onMarkerClick);

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
        markersGroup.on('clustermouseover', function(event) {
            event.layer.my_popup = event.layer.bindPopup("Klicken um auf die Schulen zu zoomen", {closeButton: false, autoPan: false});
            event.layer.my_popup.openPopup();
        });
        markersGroup.on('clustermouseout', function(event) {
            if (event.layer.my_popup) {
                event.layer.my_popup.closePopup();
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
        map.setView(land.center, land.zoom);
    }

    function onMarkerClick(marker) {
        infoBox.markerSchool = marker.layer.school;
        infoBox.loading = true;
        infoBox.visible = true;
        schools.getSchool(infoBox.markerSchool.id, function(err, school) {
            if (infoBox.markerSchool == marker.layer.school) {
                infoBox.school = school;
                infoBox.loading = false;
            }
        });
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

    function removeHash() {
        var scrollV, scrollH, loc = window.location;
        if ("pushState" in history)
            history.pushState("", document.title, loc.pathname + loc.search);
        else {
            // Prevent scrolling by storing the page's current scroll offset
            scrollV = document.body.scrollTop;
            scrollH = document.body.scrollLeft;

            loc.hash = "";

            // Restore the scroll offset, should be flicker free
            document.body.scrollTop = scrollV;
            document.body.scrollLeft = scrollH;
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
        if (searchParams.state) {
            var val = searchParams.state;
            if (val) {
                val = _.isString(val) ? [val] : val;
                filter.state.selected = [];
                _.each(val, function(v) {
                    var key = Object.keys(laender).filter(function(key) {
                        return laender[key].name == v;
                    })[0];
                    if (key) {
                        filter.state.selected.push({name: v, value: key});
                    }
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
        $location.search('state', (filter.state.selected.length > 0) ? _.map(filter.state.selected, function(item) {
                return item.name;
            }) : null);
        if (Object.keys($location.search()).length === 0) {
            //removing all search parameters leads to "/schulen/#", this is causing an unwanted page scroll, so remove the hash
            removeHash();
        }
    }

    function doFilter() {
        foundAddress = false;
        var newFilters = {
            types: [],
            partner: [],
            category: [],
            state: [],
            entity: []
        };
        var count = 0;
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
                count++;
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
        $scope.hasFilter = _.values(filter).filter(function(f) {
                return f.hasSelected(f.selected);
            }).length > 0;
        $scope.totalCount = count;
        applyNewFilterDefs(newFilters, false);

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

        if (!$scope.$$phase) {
            $scope.$apply();
        }
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
        $timeout(display, 200);
    });

    // $scope.$watchCollection('selected', display);

    $scope.clearFilters = function() {
        _.values(filter).forEach(function(f) {
            f.selected = f.no_selection;
        })
    };
    $scope.getLegalStatus = function(status) {
        switch (status) {
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