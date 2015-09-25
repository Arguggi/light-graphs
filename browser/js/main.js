requirejs.config({
    paths: {
        'jquery': 'lib/jquery.min',
        'd3': 'lib/d3.v3',
        'queryDb': 'scripts/queryDb',
    }
});

requirejs(['jquery', 'd3', 'queryDb'], function ($, d3, queryDb) {
    "use strict";

    $(function () {
        $("#showPrice").click(showPrice);
    });

    function showPrice() {
        var w = $('#graph').width();
        var h = 500;
        var padding = 40;
        queryDb.getDbTable("wqewqe")
            .then(function showData(data) {
                deleteGraph();
                var dataset;
                try {
                    dataset = JSON.parse(data);
                } catch (e) {
                    console.log("no parse");
                    return;
                }

                var i = 0;
                dataset.forEach(row => {
                    row.order = i++;
                });
                var xScale = d3.scale.linear()
                    .domain([0, d3.max(dataset, function (d) {
                        return d.order;
                    })])
                    .range([padding, w - padding * 2]);

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(dataset, function (d) {
                        return d.kwh;
                    })])
                    .range([h - padding, padding]);

                var rScale = d3.scale.linear()
                    .domain([0, d3.max(dataset, function (d) {
                        return d.kwh;
                    })])
                    .range([2, 5]);
                var formatAxis = d3.format("  0");

                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");

                //Create SVG element
                var svg = d3.select("#graph")
                    .append("svg")
                    .attr("id", "svg-id")
                    .attr("width", w)
                    .attr("height", h);

                svg.selectAll("circle")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) {
                        return xScale(d.order);
                    })
                    .attr("cy", function (d) {
                        return yScale(d.kwh);
                    })
                    .attr("r", function (d) {
                        return rScale(d.kwh);
                    })
                    .style("fill", "purple");

                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (h - padding) + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding  + ",0)")
                    .call(yAxis);
            });
    }

    function deleteGraph() {
        d3.select("#svg-id")
            .remove();
    }
});
