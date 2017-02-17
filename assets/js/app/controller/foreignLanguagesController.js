app.controller('foreignLanguagesController', function ($scope, $http, $location, schools, states) {
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
    $scope.options = {
        chart: {
            type: 'multiBarChart',
            height: 450,
            x: function(d){return d[0];},
            y: function(d){return d[1];},
            stacked: true,
            // barColor: function(d, i){
            //     var colors = d3.scale.category20().range();
            //     //var rnd = Math.floor(Math.random() * colors.length)
            //     console.log(i);
            //     console.log(d);
            //     return colors[i];
            // }
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
});