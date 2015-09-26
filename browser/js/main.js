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
        var margin = {top: 20, right: 40, bottom: 60, left: 40};
        var w = $('#graph').width() - margin.left - margin.right;
        var h = 800 - margin.top - margin.bottom;
        var padding = w / 25;
        queryDb.getDbTable("wqewqe")
            .then(function showData(data) {
                deleteGraph();
                var dataset;
                var months = [];
                try {
                    dataset = JSON.parse(data);
                } catch (e) {
                    console.log("no parse");
                    return;
                }
                console.log(dataset);
                var maxy = d3.max(dataset, function (d) {
                    return d.kwh;
                });

                var i = 0;
                dataset.forEach(row => {
                    row.order = i++;
                    months.push(row.date);
                });
                var xScale = d3.scale.ordinal()
                    .domain(d3.range(dataset.length))
                    .rangeRoundBands([0, w], 0.05);

                var yScale = d3.scale.linear()
                    .domain([maxy , 0])
                    .range([0 , h]);

                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .tickFormat(function (d) {
                        return dataset[d].date;
                    })
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");

                //Create SVG element
                var svg = d3.select("#graph")
                    .append("svg")
                    .attr("id", "svg-id")
                    .attr("width", w + margin.left + margin.right)
                    .attr("height", h + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                svg.selectAll("rect")
                    .data(dataset)
                    .enter()
                    .append("rect")
                    .attr("x", function(d, i) {
                        return xScale(i);
                    })
                    .attr("y", function(d) {
                        return h - d.kwh;
                    })
                    .attr("width", xScale.rangeBand())
                    .attr("height", function(d) {
                        return d.kwh;
                    })
                    .attr("fill", function(d) {
                        return "rgb(" + Math.round(((d.kwh / maxy) * 255)) +", 0, 0)";
                    });

                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + h + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "start")
                    .attr("dx", ".8em")
                    .attr("dy", "-.15em")
                    .attr("transform", "rotate(65)");

                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0,0)")
                    .call(yAxis);
            });
    }

    function deleteGraph() {
        d3.select("#svg-id")
            .remove();
    }
});
