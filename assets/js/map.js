var base_url = "https://lab.okfn.de/jedeschule/data";

var app = angular.module('App', ['ngAnimate', 'ngSanitize', 'ui.select']);

app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

app.controller('AppController', function ($scope, $http, schools) {

    $scope.infoboxHidden = true;
    $scope.school = {};
    $scope.filter = {};
    $scope.selected = {};
    $scope.active_filters = [];

    var filter_keys = ['school_type', 'legal_status'];
    var layer = undefined;

    schools.overview(function(err, schools) {
        console.log('loaded schools');
        initMap(schools);
        initFilters(schools);
        $scope.all_schools = schools.map(function(school) { school.filtered = false; return school;});
        console.log('finished adding markers')
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

        for (var i = 0; i < schools.length; i++) {
            var curr = schools[i];
            if (curr.location) {
                var marker = L.marker([parseFloat(curr.location.lat),parseFloat(curr.location.lon)]);
                marker.school = curr;
                markers.addLayer(marker);
            }
            layer = markers;
            map.addLayer(markers);
        }
        //display();
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

    var display = function() {
        if ($scope.all_schools)
            $scope.all_schools = $scope.all_schools.map(function(school) { school.displayed = true; return school;});
        console.log('display called');
        //apply filters
        for (var filter in $scope.selected) {
            var entries = $scope.selected[filter];
            $scope.all_schools.map(function(school) {
                if (entries.length > 0) {
                    var displayed = false;
                    for (var i = 0; i < entries.length && displayed === false; i++) {
                        if (school[filter] === entries[i].name) {
                            displayed = true;
                        }
                    }
                    school.displayed = displayed;
                }
            });
        }

        console.log('filtered schools');
        console.log($scope.all_schools.filter(function(school) {return school.displayed == true;}));
        if (layer) {
            map.removeLayer(layer);
        }

        var markers = L.markerClusterGroup({
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false,
            singleMarkerMode: true});
        markers.on('click', onMarkerClick);

        for (var i = 0; i < $scope.all_schools.length; i++) {
            var curr = $scope.all_schools[i];
            if (curr.location && curr.displayed == true) {
                var marker = L.marker([parseFloat(curr.location.lat),parseFloat(curr.location.lon)]);
                marker.school = curr;
                markers.addLayer(marker);
            }
        }
        layer = markers;
        map.addLayer(layer);
    };

    filter_keys.forEach(function(key) {
        $scope.selected[key] = [];
        $scope.$watch('selected.' + key, function(o) {
            display();
        })
    })

});

app.factory('schools', function($http) {
    var loaded_overview = null;
   return {
       overview: function(cb) {
           if (!loaded_overview) {
               $http({
                   url: 'https://lab.okfn.de/jedeschule/data/all_schools_geocoded.json',
                   method: "GET"
               })
                   .then(function(response) {
                       loaded_overview = response.data;
                       cb(null, response.data)
                   })
           } else {
               return loaded_overview;
           }
       }
   }
});