app.directive('sankey', function($window, $timeout) {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            label: '='
        },
        template: '<div class="sankeychart"></div>',
        replace: true,
        link: function(scope, element, attrs) {
            var data, g_links, g_nodes, root, sankey, links;

            var margin = {top: 1, right: 1, bottom: 6, left: 1},
                width = 600 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

            var formatNumber = d3.format(",.0f");
            var format = function(d) {
                return formatNumber(d) + " " + scope.label;
            };
            // var color;
            // if (d3.scale) { //old d3
            //     color = d3.scale.category10();
            // } else {
            //     color = d3.scaleOrdinal(d3.schemeCategory10);
            // }
            function init() {
                root = d3.select(element[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);
                var svg = root.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                g_links = svg.append("g");
                g_nodes = svg.append("g");
                sankey = d3.sankey()
                .nodeWidth(15)
                .nodePadding(10)
                .size([width, height]);
            }

            var updateLinks = function() {
                var path = sankey.link();

                // Join new data with old elements, if any.
                links = g_links.selectAll(".sankey-link").data(data.links);

                // UPDATE
                // Update old elements as needed.
                links
                .attr("d", path)
                .style("stroke-width", function(d) {
                    return Math.max(1, d.dy);
                })
                .sort(function(a, b) {
                    return b.dy - a.dy;
                });

                // ENTER
                // Create new elements as needed.
                //
                // ENTER + UPDATE
                // After merging the entered elements with the update selection,
                // apply operations to both.
                var linkEnter = links.enter().append("path")
                .attr("class", "sankey-link")
                .attr("d", path)
                .style("stroke-width", function(d) {
                    return Math.max(1, d.dy);
                })
                .sort(function(a, b) {
                    return b.dy - a.dy;
                });
                linkEnter.append("title")
                .text(function(d) {
                    return d.source.name + " ↔ " + d.target.name + "\n" + format(d.value);
                });

                // EXIT
                // Remove old elements as needed.
                links.exit().remove();
            };

            function updateBounds() {
                width = getElementWidth(element) - margin.left - margin.right;
                height = getElementHeight(element) - margin.top - margin.bottom;
            }

            function updateData() {
                sankey
                .size([width, height])
                .nodes(data.nodes)
                .links(data.links)
                .layout(32);
            }

            function updateNodes() {
                // Join new data with old elements, if any.
                var nodes = g_nodes.selectAll(".sankey-node").data(data.nodes);

                // UPDATE
                // Update old elements as needed.
                nodes.attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

                // ENTER
                // Create new elements as needed.
                //
                // ENTER + UPDATE
                // After merging the entered elements with the update selection,
                // apply operations to both.
                var nodeEnter = nodes.enter().append("g");
                nodeEnter
                .attr("class", function(d, i) {
                    return "sankey-node sankey-node-" + i;
                }).attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
                nodeEnter.append("title")
                .text(function(d) {
                    return d.count + ' ' + scope.label;
                });
                nodeEnter
                .append("rect")
                .attr("height", function(d) {
                    return d.dy;
                })
                .attr("width", sankey.nodeWidth());
                // .style("fill", function(d) {
                //     return d.color = color(d.name.replace(/ .*/, ""));
                // })
                // .style("stroke", function(d) {
                //     return d3.rgb(d.color).darker(2);
                // });
                // .call(d3.behavior.drag()
                // .origin(function(d) {
                //     return d;
                // })
                // .on("dragstart", function() {
                //     this.parentNode.appendChild(this);
                // })
                // .on("drag", function(d) {
                //     d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
                //     sankey.relayout();
                //     links.attr("d", sankey.link());
                // }));

                nodeEnter.append("text")
                .attr("x", -6)
                .attr("y", function(d) {
                    return d.dy / 2;
                })
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .attr("transform", null)
                .text(function(d) {
                    return d.name;
                })
                .filter(function(d) {
                    return d.x < width / 2;
                })
                .attr("x", 6 + sankey.nodeWidth())
                .attr("text-anchor", "start");

                nodes.exit().remove();
            }

            function update() {
                updateData();
                updateLinks();
                updateNodes();
            }

            scope.$watch('data', function(newVal, oldVal) {
                if (newVal) {
                    data = newVal;
                    update();
                }
            });

            var onResize = function() {
                updateBounds();
                if (data) {
                    root
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);
                    update();
                }
            };

            var getElementWidth = function(element) {
                return element[0].clientWidth;
            };
            var getElementHeight = function(element) {
                return element[0].clientHeight;
            };
            var registerResize = function() {
                var w = angular.element($window);
                var resizetimer;

                scope.getWatchWidth = function() {
                    return getElementWidth(element);
                };
                scope.getWatchHeight = function() {
                    return getElementHeight(element);
                };

                var resize = function() {
                    onResize();
                };

                var change = function(old_value, new_value) {
                    if (old_value !== new_value) {
                        if (resizetimer) $timeout.cancel(resizetimer);
                        resizetimer = $timeout(resize, 400);
                    }
                };

                scope.$watch(scope.getWatchWidth, change);
                scope.$watch(scope.getWatchHeight, change);

                w.bind('resize', function() {
                    scope.$apply();
                });
            };

            updateBounds();
            init();
            registerResize();
            onResize();
        }
    }
});

