app.controller('MapController', function ($scope, $http, $location, schools) {

    $scope.infoboxHidden = true;
    $scope.school = {};
    $scope.filter = {};
    $scope.selected = {};
    $scope.schoolProfileFilter = false;
    $scope.fullTimeSchoolFilter = false;
    $scope.workingGroupsFilter = {selected: []};

    var allActivites = ["Ökologie","Tierpflege","Botanik","Schulgarten","Naturlehrpfad","Biotop","Aquaristik","Ornithologie","Rudern","Judo","Badminton","Fußball","Basketball","Rugby","Sport-Club","Fitness","Turnen","Ballsport","Ballspiele","Sport","Fahrrad","Volleyball","Klettern","Sport-AG","Karate","Handball","Tischtennis","sportlich","Schwimmen","Reiten","qwan ki do","Selbstverteidigung","Kung Fu","Bewegung","Schach","Bogenschießen","Federball","Ski","Segeln","Tennis","Mofa","Solarboote","Skaten","Radtouren","Ernährung","Tai Chi","Schlaufit (Fitness)","Musik","Chor","Band","Schulband","Ochester","Instrumentalunterricht","Blechbläser","Bläserensemble","Blasinstrumente","Saiteninstrumente","Schlaginstrumente","Bigband","Gesangunterricht","Instrumentenfindung","Gitarre","Streicher","Musical","Flöten","Gitarrenunterricht","Elektronische Musik","Rockband","Blockflötenensemble","Querflötenensemble","Keyboard","Instrumental-AG","Popband & Jazz-Combo","Improvisationen","Bläsergruppe","Rap","musisch","Musikabend","Singen","Trommeln","Jazz","Chanson","Sambaensemble","Steelband","Gitarren-AG","Streicher-AG","Bläser-AG","Sa1ophon-AG","Klarinetten-AG","Horn-AG","Querflöten-AG","Percussion","Popchor","Cello","Hiphop","Singespatzen","Blockflöte","Lieder","Klavier","Violinenunterricht","Eltern-Lehrer-Chor","Rhythmus","Musizieren","Gospel","Karaoke","Akkordeon","Stimmbildung","Oboe","Tanzen","Farbtanz","Capoeira","Dance for Kids","Orientalischer Tanz","Bauchtanz","Balett","Modern Dance","Break Dance","Streetdance","Darstellendes Spiel","Line Dance","Tanzerziehung","Tanztherapie","Tanztheater","Cheerleading","Musik für Courage und Gerechtigkeit","Jazz Dance","Chor/Singegruppe/ musikalische Erziehung","Dabattierclub","Mediation","Politik","Konfliktlotsen","kulturelle Ausflüge","UNESCO","Ersthelfer","Religion","Philosophie","Streitschlichter","Schulsanitäter","Stolpersteine","Erinnerungskultur","Historiker","Geschichte","Mediatoren","Sozial-AG","Gesellschaftsspiele","Planspiele","Geschichtswerkstatt","Kultur in Berlin","Lebenskunde","Model United Nations","Kinder in anderen Ländern","Psychologie","Schülerparlament","Schule ohne Rassismus","Kinder-Mutmach-Gruppe","Geschichte Plus","Friedens-AG","Ethik","Erkunden anderer Länder","Politische Bildung","Courrage","Schülerfirma","Puppentheater","Theater","Theatergruppe","Schülerclub","Schulhof-AG","Schulhofgestaltung","Buddy-Projekt","Business at School (Wirtschaft)","Sommerfest","Willkommensfest","Schulwegpaten","Ausstellungen","Europa-Schule","Friedenstaube","Voluntees (Flüchtlingsprojekt)","Poetry Slam","Medienecken","Fotografie","Foto","Filmabende","Buchbinden","Schulradio","Animation","Filmclub","Filmschnitt","Design","Schuldruckerei","Medien","Multimedia","Drucktechnik","Bildbearbeitung","Mediengestaltung","Papier","Buchwerkstatt","Comp@ss","Podcast","Modedesign","Kommunikation","Hörspiele","Internetradio","Radio","Medienerziehung","Online-Werkstatt","Video","Grafik","Buchillustrationen","Videoschnitt","Tonstudio","Blog","Tontechnik","Edutainment","Töpfern","Werken","Te1til","Holzwerkstatt","backen","Mode","basteln","kochen","Modellbau","Handwerken","Werkstatt","Nähen","Nadel und Faden","Keramik","Metall","Holzarbeiten","Holzbearbeitung","Knobelkiste","Sticken","Teppichknüpfen","Perlenarbeiten","Perlen","Fliesengestaltung","Filzen","Ton","Kochkurse","handwerklich","Bildhauerei","Schmuck","Wolle","Modellieren","Siebdruck","Plastisches Gestalten","Kochen nach Sarah Wiener","Bildende Kunst","Grafitti","Heilpädagogisches Malen","Atelier","Kunstbau-Wertstatt","Malen und Zeichnen","Kunstwerkstatt","Manga","Comic","Kreativkurse","Kreativ-AG","Malkurse","künstlerisches Gestalten","Aquarellmalerei","künstlerisch","kreatives Gestalten","Seidenmalerei","Wandmalerei","Zirkus","Zaubern","Astronomie","Astrophysik","wissenschaftliches Arbeiten","Chemie","Mathematik","Physik","Nawi-E1perimente","Nawi","Forscher","Naturforscher","Haus der kleinen ForscherMathe","Archäologie","Biologie","E1perimente","Mathe Plus","Geometrie","Jugend forscht","Computer","Elektronik","Informatik","Robotics","Bühnentechnik","Veranstaltungstechnik","Homepage","Internet","hmtl","Algorithmen","Programmierung","Server","Werbsite","Technik","Roboter","Robocup","Netzwerke","Computerspiele","Computerkurse","Theatertechnik","Hardware","IT","PC","Informationstechnik","Roberta","Tastaturlehrgang","Energie","Computerführerschein","Schülerzeitung","Literatur","Leseprofis","Lyrikkreis","Leseratten","Lesen","kreatives Schreiben","Schreibwerkstatt","Zeitung","Schülerbücherei","Bibliothek","Literaturwerkstatt","Lecturas","Leseclub","Büchercafe","Bücher","Jugendliteratur","Kinderliteratur","Writing","Lesepaten","Praktikumsvorbereitung","Beratung in Ausbildungsfragen","Beratung","MSA","Bewerbungstraining","Lernförderung","Hochbegabtenförderung","Begabtenförderung","Berufsorientierung","Nachhilfe","Hausaufgabenbetreuung","Hausaufgaben","Lernwerkstatt","Eisenbahn AG","Chinesisch","Russisch","Griechisch","Italienisch","Japanisch","Frendsprachen","Cambridge Proficiency","Englisch","Französisch","Spanisch","Frankreich","Latein","Vorbereitung DELF-Sprachdiplom","Vorbereitung Cambridge-Sprachdiplom","Sprachkundigenprüfung","E1ploring Advanced English","Neugriechisch","Türkisch","Polnisch","Arabisch","Deutsch","Hebräisch","Sprachen","Norwegisch","Deutschförderung","Altgriechisch","Sprachförderung","Ungarisch","Schwedisch","Chinesische & Japanische Schriftzeichen","Sprachzertifikat","vielfältige externe Partner","Sportclub Berlin e.V.","Tanzwerkstatt no limit e.V.","Samuel's Dance Hall","Pfefferwerk","CBB (Computerausbildung)","Musikschule Charlottenburg-Wilmersdorf","National Honor Society","Naturkundemuseum","Atelier Villa Comenius","Technische Jugendfreizeit- u. Bildungsgesellschaft gGmbH","Technische Universität Berlin","Telekom","Musikschule Steglitz-Zehlendorf","Musikschule Tempelhof Schöneberg","Musikschule Fröhlich","Kooperation Musikschule Tastenteufel","Katholische Kirche","Musikschulen","Kooperation mit Vereinen","Sportvereine","Fußballclub SV Tiergarten","Fußball SV Pfefferwerk","Kampfsportschule Klostergarten","Deutsch Brittischer Yachtclub e.V.","Köpenicker Kanusportclub e.V.","SC Berlin-Grünau e.V.","Cöpenicker Segler-Verein e.V.","Surfcenter Wandlitz","Vocatium - Fachmesse für Ausbildung und Beruf","Kooperationen","BerMUN","kleine Forscher","Model European Parliament","Jugend debattiert","Kleine Forscher","Mathewettbewerb Ideefix","Naturwissenschaftliche Wettbewerbe","Physikolympiade","Mathe Plus Mathematiknachhilfe","Debating Society (Debattierclub)","Unesco-Projektschule","Model United Nations (MUN)","Jump in MINT","UNESCO-Projektschule","Roberta Kleine Forscher","Forschen mit Fred","Schule ohne Rassismus - Schule mit Courage","Katholische Studierende Jugend","Schule ohne Rassimus – Schule mit Courage","Studenten machen Schule (Workshops von Studierenden)"]
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

        var SarchControl = L.Control.extend({
            options: {
                position: 'topright'
            },

            onAdd: function (map) {
                var container = L.DomUtil.create('div', 'mapSearchBox');
                var input = document.createElement('input');
                input.placeholder = "Schulnamen oder ID filtern...";
                input.oninput = _.debounce(function (event){
                    $scope.searchText = event.srcElement.value;
                    $scope.$apply();
                }, 300);
                container.appendChild(input);

                // We do not want to zoom/pan when the user is interacting with the
                // search box and this seems to be the only way of preventing this....
                input.addEventListener('mouseover', function () {
                    map.dragging.disable();
                    map.doubleClickZoom.disable();
                });
                input.addEventListener('mouseout', function () {
                    map.dragging.enable();
                    map.doubleClickZoom.enable();
                });

                return container;
            }
        });



        map.addControl(new SarchControl());

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
        });

        $scope.workingGroups = allActivites.map(function(x) { return {name: x}});
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

        if ($scope.workingGroupsFilter.selected.length){
            filtered.forEach(function (school) {
                if (school.displayed) {
                    var workingGroups = _.get(school, 'profile.working_groups');
                    var selected = _.map($scope.workingGroupsFilter.selected, 'name');
                    if (workingGroups){
                        var thisSchoolOffers = _.flatMap(_.values(workingGroups), _.identity);
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

        if ($scope.searchText){
            filtered.forEach(function(school){
                var searchText = $scope.searchText.toLowerCase();
                var nameMatches = _.includes(school.name.toLowerCase(), searchText);
                var idMatches = _.includes(school.id.toLowerCase(), searchText);
                if (!nameMatches && !idMatches){
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

    $scope.$watchGroup(['schoolProfileFilter', 'fullTimeSchoolFilter', 'workingGroupsFilter.selected', 'searchText'], display);
    $scope.$watchCollection('selected', display);
});