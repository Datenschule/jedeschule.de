app.controller('foreignLanguagesController', function ($scope, $http, $location, schools, states) {
    $scope.colorScale = function(amount) {
        var scale = chroma.scale(['white', 'red']);
        return scale(amount);
    };

    $scope.languages = ['Englisch', 'Französisch', 'Latein', 'Altgriechisch', 'Spanisch', 'Italienisch', 'Russisch',
        'Türkisch', 'Sonstige Sprachen'];

    $scope.languageSums = [];

    $scope.bardata = {
        labels: ['Englisch', 'Französisch', 'Latein', 'Altgriechisch', 'Spanisch', 'Italienisch', 'Russisch',
            'Türkisch', 'Sonstige Sprachen'],
        series: [20, 60, 120, 200, 180, 20, 10,20, 60]
    };

    $scope.langdata = {
        labels: ['Grundschulen', 'Schulartunab- hängige Orientie- rungsstufe', 'Hauptschulen',
            'Schularten mit mehreren Bildungsgängen', 'Realschulen', 'Gymnasien (G8)', 'Gymnasien (G9)',
            'Integrierte Gesamtschulen', 'Freie Waldorfschulen', 'Förderschulen', 'Abendschulen und Kollegs'],
        series: [20, 60, 120, 200, 180, 20, 10,20, 60,20, 60]
    };

    $scope.langoptions = {
        height: '200px',
        chartPadding: {
            top: 20,
            right: 0,
            bottom: 55,
            left: 40
        },
        distributeSeries: true,
        plugins: [
            Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: '',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 0
                    },
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: 'Anzahl',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: -50,
                        y: -5
                    },
                    flipTitle: true
                }
            })
        ]
    };

    $scope.baroptions = {
        height: '200px',
        distributeSeries: true,
        chartPadding: {
            top: 20,
            right: 0,
            bottom: 55,
            left: 40
        },
        plugins: [
            Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: '',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 0
                    },
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: 'Anzahl',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: -50,
                        y: -5
                    },
                    flipTitle: true
                }
            })
        ]
    };

    $scope.init = function(state) {
        $scope.state = state;
        console.log(state);
        states.get($scope.state, function(err, statedata) {
            console.log(statedata);
            var students_by_schooltype = get_students_by_schooltype(statedata.schueler);
            var schooltypes = _.groupBy(statedata.fremdsprachen, 'schooltype');
            var language_dict = schooltypes['Realschulen'].map(function(elem) { return elem.language}); //TODO: collect keys
            console.log(statedata);

            $scope.data = [];

            for (var schooltype in schooltypes) {
                var current = schooltypes[schooltype];
                var languages = language_dict.map(function(language) {
                    // console.log(current);
                    var amountIndex = _.findIndex(current, {language: language});
                    // console.log('Schooltype:' + schooltype);
                    // console.log('Students: ' + students_by_schooltype[schooltype]);
                    var amountnom = amountIndex >= 0 && students_by_schooltype[schooltype] > 0 ? current[amountIndex].amount : 0;
                    var amount = amountIndex >= 0 && students_by_schooltype[schooltype] > 0 ?
                        Math.round(current[amountIndex].amount * 100 / students_by_schooltype[schooltype]) : 0;
                    // console.log('Language: ' + language);
                    // console.log('Amount: ' + amount);
                    return [language, amount, amountnom]
                });
                // console.log(languages);
                $scope.data.push({
                    key: schooltype,
                    values: languages
                })
            }
            $scope.nvd3data = $scope.data;
            var languages_obj = _.groupBy(statedata.fremdsprachen, 'language');
            var languages_obj_
            var languages = Object.values(languages_obj).map(function(o) { return o.amount });
            $scope.languageSums = languages
            //renderHeatmap();
        });
    };

    $scope.options = {
        chart: {
            type: 'multiBarChart',
            height: 450,
            x: function(d){return d[0];},
            y: function(d){return d[1];},
            stacked: true
        }
    };

    $scope.data = [
        {
            "key": "Englisch",
            "values": [['Gymnasium', 250000], ['Realschule',100000], ['Hauptschule', 250000], ['Gesamtschule',100000]]
        }, {
            "key": "Französisch",
            "values": [['Gymnasium', 250000], ['Realschule',200000], ['Hauptschule', 250000], ['Gesamtschule',100000]]
        }, {
            "key": "Latein",
            "values": [['Gymnasium',300000], ['Realschule', 1000000], ['Hauptschule', 250000], ['Gesamtschule',100000]]
        }];

    function get_students_by_schooltype(students_data) {
        var  result = {};
        for (var schooltype in students_data) {
            var curr_schooltype = students_data[schooltype];
            result[schooltype] = Object.keys(curr_schooltype).reduce(function(prev, key) {
                return prev + curr_schooltype[key];
            }, 0)
        }
        console.log(result);
        return result;
    }
function renderHeatmap() {
    var data = [
        // {score: 0.5, row: 0, col: 0},
        // {score: 0.7, row: 0, col: 1},
        // {score: 0.7, row: 0, col: 2},
        // {score: 0.2, row: 1, col: 0},
        // {score: 0.4, row: 1, col: 1},
        // {score: 0.7, row: 1, col: 2},
        // {score: 0.2, row: 2, col: 0},
        // {score: 0.4, row: 2, col: 1},
        // {score: 0.7, row: 2, col: 2}
    ];

    var languages = ['Englisch', 'Französisch', 'Latein', 'Altgriechisch', 'Spanisch', 'Italienisch', 'Russisch',
        'Türkisch', 'Sonstige Sprachen'];

    var schooltypes = ['Grundschulen', 'Schulartunabhängige Orientierungsstufe', 'Hauptschulen',
        'Schularten mit mehreren Bildungsgängen', 'Realschulen', 'Gymnasien (G8)', 'Gymnasien (G9)',
        'Integrierte Gesamtschulen', 'Freie Waldorfschulen', 'Förderschulen', 'Abendschulen und Kollegs'];

    for (var i = 0; i < schooltypes.length; i++) {
        var schooltype = _.find($scope.data, {'key': schooltypes[i]});
        for (var ii = 0; ii < languages.length; ii++) {
            var language = languages[ii];
            var curr = _.find(schooltype.values, function (o) {
                return o[0] === language
            });
            data.push({score: curr[1] / 100, row: ii, col: i})
        }
    }

    console.log(data);

//height of each row in the heatmap
//width of each column in the heatmap

    var h = 25;
    var w = 80;

    var colorLow = 'orange', colorHigh = 'red';

    var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = 900 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // var colorScale = d3.scale.linear()
    //     .domain([0, 1])
    //     .range([colorLow, colorHigh]);

    var colorScale = chroma.scale(['white', 'red']);

    var svg = d3.select("#heatmap").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var heatMap = svg.selectAll(".heatmap")
        .data(data, function (d) {
            return d.col + ':' + d.row;
        })
        .enter().append("svg:rect")
        .attr("x", function (d) {
            return (d.row + 1) * w;
        })
        .attr("y", function (d) {
            return (d.col + 1) * h;
        })
        .attr("width", function (d) {
            return w;
        })
        .attr("height", function (d) {
            return h;
        })
        .style("fill", function (d) {
            return colorScale(d.score);
        })
        .style("stroke", "black")
        .style("stroke-width", 0.2)
        .text(function (d) {
            return d
        });

    svg.selectAll('.heatmap')
        .data(languages)
        .enter().append("svg:text")
        .attr("x", function (d, i) {
            return (i + 1) * w
        })
        .attr('y', 0)
        .attr("width", w)
        .attr("height", h)
        .style("font-size", "10pt");

    svg.selectAll('.heatmap')
        .data(schooltypes)
        .enter().append("svg:text")
        .attr("x", 0)
        .attr('y', function (d, i) {
            return (i + 1) * h + 20
        })
        .attr("width", w)
        .attr("height", h)
        .style("font-size", "10pt")
        .text(function (d) {
            return d
        });
}


    // $scope.test = "TestABC";
    // var svg = d3.select(".zoomablepack"),
    //     margin = 20,
    //     diameter = +svg.attr("width"),
    //     g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
    //
    // var color = d3.scaleLinear()
    //     .domain([-1, 5])
    //     .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    //     .interpolate(d3.interpolateHcl);
    //
    // var pack = d3.pack()
    //     .size([diameter - margin, diameter - margin])
    //     .padding(2);
    //
    // d3.json("/assets/js/app/data/flare-pack.json", function(error, root) {
    //     if (error) throw error;
    //
    //     root = d3.hierarchy(root)
    //         .sum(function(d) { return d.size; })
    //         .sort(function(a, b) { return b.value - a.value; });
    //
    //     var focus = root,
    //         nodes = pack(root).descendants(),
    //         view;
    //
    //     var circle = g.selectAll("circle")
    //         .data(nodes)
    //         .enter().append("circle")
    //         .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
    //         .style("fill", function(d) { return d.children ? color(d.depth) : null; })
    //         .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });
    //
    //     var text = g.selectAll("text")
    //         .data(nodes)
    //         .enter().append("text")
    //         .attr("class", "label")
    //         .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
    //         .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
    //         .text(function(d) { return d.data.name; });
    //
    //     var node = g.selectAll("circle,text");
    //
    //     svg
    //         .style("background", color(-1))
    //         .on("click", function() { zoom(root); });
    //
    //     zoomTo([root.x, root.y, root.r * 2 + margin]);
    //
    //     function zoom(d) {
    //         var focus0 = focus; focus = d;
    //
    //         var transition = d3.transition()
    //             .duration(d3.event.altKey ? 7500 : 750)
    //             .tween("zoom", function(d) {
    //                 var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
    //                 return function(t) { zoomTo(i(t)); };
    //             });
    //
    //         transition.selectAll(".label")
    //             .filter(function(d) {
    //                 console.log(d);
    //                 return d.parent === focus || this.style.display === "inline"; })
    //             .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
    //             .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
    //             .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    //     }
    //
    //     function zoomTo(v) {
    //         var k = diameter / v[2]; view = v;
    //         node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    //         circle.attr("r", function(d) { return d.r * k; });
    //     }
    // });
});