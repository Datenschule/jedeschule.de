app.controller('schoolProfileController', function($scope, $window, $location, schools) {
    $scope.chartType = 'Line';

    $scope.students_data = {};
    $scope.teacher_data = {};

    $scope.options_students = {
        height: '300px',
        chartPadding: {
            top: 20,
            right: 0,
            bottom: 55,
            left: 40
        },
        axisY: {
            onlyInteger: true
        },
        low: 0,
        plugins: [
            Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: 'Jahr',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 50
                    },
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: 'Anzahl Schüler',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: -50,
                        y: -5
                    },
                    flipTitle: false
                }
            }),
            Chartist.plugins.tooltip(
                {
                    appendToBody: true,
                    anchorToPoint: true,
                    transformTooltipTextFnc: function(value) {
                        return value + ' Schüler*innen';
                    }
                })
        ]
    };

    $scope.teacher_options = {
        height: '300px',
        chartPadding: {
            top: 20,
            right: 0,
            bottom: 55,
            left: 40
        },
        axisY: {
            onlyInteger: true
        },
        low: 0,
        plugins: [
            Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: 'Jahr',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 50
                    },
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: 'Anzahl Lehrer',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: -50,
                        y: -5
                    },
                    flipTitle: false
                }
            }),
            Chartist.plugins.tooltip(
                {
                    appendToBody: true,
                    anchorToPoint: true,
                    transformTooltipTextFnc: function(value) {
                        return value + ' Lehrer*innen';
                    }
                })
        ]
    };

    $scope.categoryRessources = {
        Umwelt: {
            color: '#57CF9A',
            image: '/assets/img/wg-icons/umwelt.png'
        },
        Sport: {
            color: '#D55879',
            image: '/assets/img/wg-icons/sport.png'
        },
        'Musik / Tanz': {
            color: '#EB8E24',
            image: '/assets/img/wg-icons/musik.png'
        },
        'Gesellschaft / Partizipation': {
            color: '#AD4561',
            image: '/assets/img/wg-icons/gesellschaft.png'
        },
        'Literatur / Medien': {
            color: '#FF9817',
            image: '/assets/img/wg-icons/literatur.png'
        },
        Handwerk: {
            color: '#199B5D',
            image: '/assets/img/wg-icons/handwerk.png'
        },
        'Kunst / Kultur': {
            color: '#FD7526',
            image: '/assets/img/wg-icons/kunst.png'
        },
        'Naturwissenschaft / Technik': {
            color: '#3dd7ff',
            image: '/assets/img/wg-icons/mint.png'
        },
        Berufsorientierung: {
            color: '#CC3D63',
            image: '/assets/img/wg-icons/berufsorientierung.png'
        },
        Sprachen: {
            color: '#30C5E2',
            image: '/assets/img/wg-icons/sprachen.png'
        }

    };

    $scope.partnerRessources = {
        'Gemeinnütziger Akteur': {
            color: '#57CF9A'
        },
        'Öffentliche Infrastruktur': {
            color: '#D55879'
        },
        'Wirtschaftsakteur': {
            color: '#EB8E24'
        },
        'Partnerschule': {
            color: '#AD4561'
        },
        'Modell/Förderprogramm/Projekt': {
            color: '#FF9817'
        },
        'kirchliche Einrichtung': {
            color: '#199B5D'
        },
        'Verband / Kammer / Innung / Gewerkschaft': {
            color: '#30C5E2'
        }
    }

    var school_id = $location.absUrl().split('?')[1].split('=')[1];
    schools.getSchool(school_id, function(err, data) {
        $scope.school = data;
        $window.document.title = $scope.school.name + ' - Schulprofil - JedeSchule.de';
        $scope.working_groups = _.groupBy(data.programs.working_groups, 'category');
        delete $scope.working_groups['no category'];
        $scope.partner = _.groupBy(data.partner, function(o) {
            return o.type.grob
        });
        var number_of_partners = data.partner.length;
        $scope.partner_stat = [];
        for (var partner in $scope.partner) {
            $scope.partner_stat.push({name: partner, value: $scope.partner[partner].length * 100 / number_of_partners})
        }
        $scope.students_data = Object.keys(data.profile.students).map(function(o) {
            var current = data.profile.students[o];
            return {
                amount: _.sumBy(current, function(n) {
                    return n.male + n.female
                }),
                year: o
            }
        });

        $scope.students_data = _.sortBy($scope.students_data, ['name'])
        $scope.students_data = {
            labels: _.map($scope.students_data, 'year'),
            series: [_.map($scope.students_data, 'amount')]
        };

        $scope.teacher_data = _.map(data.profile.teacher, function(o) {
            return {amount: o.female + o.male, year: o.year}
        });
        $scope.teacher_data = {
            labels: _.map($scope.teacher_data, 'year'),
            series: [_.map($scope.teacher_data, 'amount')]
        };

        $scope.coordinates = [$scope.school.lat, $scope.school.lon];

        L.marker([$scope.school.lat, $scope.school.lon], {icon: mapIcon}).addTo($scope.map);
        $scope.map.setView([$scope.school.lat, $scope.school.lon], 15);
    });

    $scope.map = L.map('map-profile', {zoomControl: false}).setView([51.505, -0.09], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/okfde/ciwxo7szj00052pnx7xgwdl1d/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib2tmZGUiLCJhIjoiY2lpOHhvMnNhMDAyNnZla280ZWhmMm96NyJ9.IvGz74dvvukg19B4Npsm1g', {
        attribution: '&copy; <a href="https://www.mapbox.com">Map Box</a> contributors'
    }).addTo($scope.map);
    var mapIcon = L.icon({
        iconUrl: '/assets/img/map_pin.png',
        iconSize: [40, 53] // size of the icon
    });

    $scope.map.dragging.disable();
    $scope.map.touchZoom.disable();
    $scope.map.doubleClickZoom.disable();
    $scope.map.scrollWheelZoom.disable();
    $scope.map.boxZoom.disable();
    $scope.map.keyboard.disable();
    if ($scope.map.tap) $scope.map.tap.disable();
});