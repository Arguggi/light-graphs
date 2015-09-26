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
        left: 60
    };
    var w = $('#graph').width() - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;
    var padding = w / 25;
    var dataset;
    var unit;
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    var monthColors = {
        '01': '#D8D8D8',
        '02': '#858585',
        '03': '#0FA1FF',
        '04': '#00548B',
        '05': '#00416B',
        '06': '#93FB56',
        '07': '#18F484',
        '08': '#B4FD00',
        '09': '#FFA558',
        '10': '#FFAD19',
        '11': '#FF2800',
        '12': '#ECEBEC'
    };

    $(function () {
        $("#showCost").click(ev => getData('cost'));
        $("#showKwh").click(ev => getData('kwh'));
        $("#showCostKwh").click(ev => getData('cost-kwh'));
        $("#sortMonth").click(ev => sortGraph('month'));
        $("#sortTime").click(ev => sortGraph('xLabel'));
        $("#sortValue").click(ev => sortGraph('yValue'));
    });

    function getData(url) {
        queryDb.getDbTable(url)
            .then(showData);
    }

    function deleteGraph() {
        d3.select("#svg-id")
            .remove();
    }

    function showData(data) {
        deleteGraph();

        dataset = data.dbData;
        unit = data.unit;

        var maxy = d3.max(dataset, function (d) {
            return d.yValue;
        });

        var i = 0;
        dataset.forEach(row => {
            var splitDate = row.xLabel.split('-');
            row.year = splitDate[0];
            row.month = splitDate[1];
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
            //.attr("fill", function (d) {
            //    return "rgb(" + Math.round(((d.yValue / maxy) * 255)) + ", 0, 0)";
            //})
            .attr("fill", function (d) {
                return monthColors[d.month];
            })
            .on("mouseover", function (d) {
                return tooltip.style("visibility", "visible").text(d.xLabel + ': ' + d.yValue + ' ' + unit);
            })
            .on("mousemove", function (d) {
                return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function (d) {
                return tooltip.style("visibility", "hidden");
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
        // Add an x-axis label.
        svg.append("text")
            .attr("class", "ylabel")
            // x and y are swapped since we rotate -90°
            .attr("x", -(h/2) - 10)
            .attr("y", '-30px')
            .attr("transform", "rotate(-90)")
            .text(data.unit);
    }

    function sortGraph(sortProp) {
        if (typeof dataset != 'object') {
            return;
        }
        if (sortProp === 'month') {
            dataset.sort((a, b) => {
                var elem1 = a.month;
                var elem2 = b.month;
                if (elem1 > elem2) {
                    return 1;
                }
                if (elem1 < elem2) {
                    return -1;
                }
                var elem1Month = a.year;
                var elem2Month = b.year;
                if (elem1Month > elem2Month) {
                    return 1;
                }
                if (elem1Month < elem2Month) {
                    return -1;
                }
                return 0;
            });
        } else {
            dataset.sort(function (a, b) {
                var elem1 = a[sortProp];
                var elem2 = b[sortProp];
                if (elem1 > elem2) {
                    return 1;
                }
                if (elem1 < elem2) {
                    return -1;
                }
                return 0;
            });
        }
        showData({
            dbData: dataset,
            unit: unit
        });
    }
});
