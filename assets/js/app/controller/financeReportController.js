app.controller('FinanceReportController', function ($scope, $http, $location, schools, states) {

    $scope.init = function(state) {
        $scope.state = state;
        console.log(state);
        states.get($scope.state, function(err, statedata) {
            console.log(statedata);
            var year_dict = ['2000', '2005', '2010', '2015\n vorl. Ist'];
            var entries = _.filter(statedata.finanzbericht, function(o) { return year_dict.indexOf(o.jahr) >= 0 });
            entries = _.groupBy(entries, 'Kategorie');
            $scope.data = [];
            for (var category in entries) {
                var current = entries[category];
                $scope.data.push({ key: category, values: current.map(function(o) { return [o.jahr, o.wert] }) })
            }
        });
    };

    $scope.options = {
        chart: {
            type: 'multiBarChart',
            height: 450,
            x: function(d){return d[0];},
            y: function(d){return d[1];},
            stacked: true
            // barColor: function(d, i){
            //     var colors = d3.scale.category20().range();
            //     //var rnd = Math.floor(Math.random() * colors.length)
            //     console.log(i);
            //     console.log(d);
            //     return colors[i];
            // }
        }
    }

    $scope.data = [
        {
            "key": "Allgemeinbildende und berufliche Schulen",
            "values": [['1995', 250000], ['2005',100000], ['2010', 250000], ['Vorlage 2015',100000]]
        }, {
            "key": "Hochschule",
            "values": [['1995', 250000], ['2005',200000], ['2010', 250000], ['Vorlage 2015',100000]]
        }, {
            "key": "Jugendarbeit, Tageseinrichtungen für Kinder",
            "values": [['1995',300000], ['2005', 1000000], ['2010', 250000], ['Vorlage 2015',100000]]
        },
        {
            "key": "Förderung des Bildungswesens",
            "values": [['1995',300000], ['2005', 1000000], ['2010', 250000], ['Vorlage 2015',100000]]
        },
        {
            "key": "Sonstiges Bildungswesen",
            "values": [['1995',300000], ['2005', 1000000], ['2010', 250000], ['Vorlage 2015',100000]]
        }
    ];
    //var container = d3.select('#treemap');
    // var container = document.getElementById('treemap');
    // var locationParts = $location.absUrl().split('/');
    //
    // $scope.state = locationParts[locationParts.length - 2];
    //
    // states.get($scope.state, function(err, data) {
    //     if (err) {
    //         console.log(err)
    //     }
    //     console.log(data);
    //     $scope.reports = data.finanzbericht;
    //     updateTreemap(data.finanzbericht[1997]);
    // });
    //
    // var width = window.getComputedStyle(container).width.replace('px', '');
    // var height = width / 2;//window.getComputedStyle(container).height.replace('px', '');
    //
    // $scope.refreshTreemap = function(year) {
    //     updateTreemap($scope.reports[year]);
    //     console.log('refreshed for' + year)
    // }
    //
    // var svg = d3.select('#treemap').append("svg")
    //     .attr("width", width)
    //     .attr("height", height);
    //
    // var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); },
    //     color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
    //     format = d3.format(",d");
    //
    // function updateTreemap(data) {
    //
    //     var treemap = d3.treemap()
    //         .tile(d3.treemapResquarify)
    //         .size([width, height])
    //         .round(true)
    //         .paddingInner(1);
    //
    //     var root = d3.hierarchy(data)
    //         .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
    //         .sum(sumBySize)
    //         .sort(function(a, b) { return b.height - a.height || b.value - a.value; });
    //
    //     treemap(root);
    //     console.log(root);
    //
    //     svg.selectAll('g').remove();
    //
    //     var cell = svg.selectAll("g")
    //         //.remove()
    //         .data(root.leaves())
    //         .enter()
    //         .append("g")
    //         .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });
    //
    //     cell.append("rect")
    //         .attr("id", function(d) {
    //             return d.data.id; })
    //         .attr("width", function(d) { return d.x1 - d.x0; })
    //         .attr("height", function(d) { return d.y1 - d.y0; })
    //         .attr("fill", function(d) {
    //             return color(d.data.id); });
    //
    //     cell.append("clipPath")
    //         .attr("id", function(d) { return "clip-" + d.data.id; })
    //         .append("use")
    //         .attr("xlink:href", function(d) { return "#" + d.data.id; });
    //
    //     cell.append("text")
    //         .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
    //         .selectAll("tspan")
    //         .data(function(d) {
    //             return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
    //         .enter().append("tspan")
    //         .attr("x", 10)
    //         .attr("y", function(d, i) { return 20 + i * 20; })
    //         .style('font-size', '14pt')
    //         .text(function(d) {
    //             return d; });
    //
    //     cell.append("title")
    //         .text(function(d) { return d.data.id + "\n" + format(d.value); });
    //
    //     // cell.transition()
    //     //     .attr('transform', function(d) {
    //     //         return 'translate(' + d.x + ',' + d.y + ')';
    //     //     });
    //
    //     function sumBySize(d) {
    //         return d.size;
    //     }
    // }
});
