requirejs.config({
    paths: {
        'jquery': 'lib/jquery.min',
        'd3': 'lib/d3.v3',
        'queryDb': 'scripts/queryDb',
    }
});

requirejs(['jquery', 'd3', 'queryDb'], function ($, d3, queryDb) {
    "use strict";
    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 40
    };
    var w = $('#graph').width() - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;
    var padding = w / 25;

    $(function () {
        $("#showKwh").click(showKwh);
        $("#showCost").click(showCost);
    });

    function showCost() {
        queryDb.getDbTable("cost")
            .then(showData);
    }

    function showKwh() {
        queryDb.getDbTable("kwh")
            .then(showData);
    }

    function deleteGraph() {
        d3.select("#svg-id")
            .remove();
    }

    function showData(data) {
        deleteGraph();
        var dataset;
        var months = [];
        try {
            dataset = JSON.parse(data);
        } catch (e) {
            console.log("no parse");
            return;
        }
        var maxy = d3.max(dataset, function (d) {
            return d.yValue;
        });

        var i = 0;
        dataset.forEach(row => {
            row.order = i++;
            months.push(row.xLabel);
        });
        var xScale = d3.scale.ordinal()
            .domain(d3.range(dataset.length))
            .rangeRoundBands([0, w], 0.05);

        var yScale = d3.scale.linear()
            .domain([maxy, 0])
            .range([0, h]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .tickFormat(function (d) {
                return dataset[d].xLabel;
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
            .attr("x", function (d, i) {
                return xScale(i);
            })
            .attr("width", xScale.rangeBand())
            .attr("y", function (d) {
                return yScale(d.yValue);
            })
            .attr("height", function (d) {
                return yScale(0) - yScale(d.yValue);
            })
            .attr("fill", function (d) {
                return "rgb(" + Math.round(((d.yValue / maxy) * 255)) + ", 0, 0)";
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
            .call(yAxis);
    }
});
