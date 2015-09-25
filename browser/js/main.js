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
        queryDb.getDbTable("wqewqe")
            .then(function showData(dbData) {
                console.log('Display data');
                console.log(dbData);
                deleteGraph();
                d3.select("#graph")
                    .append("svg")
                    .attr("id", "svg-id")
                    .attr("width", 50)
                    .attr("height", 50)
                    .append("circle")
                    .attr("cx", 25)
                    .attr("cy", 25)
                    .attr("r", 25)
                    .style("fill", "purple");
            });
    }

    function deleteGraph() {
        d3.select("#svg-id")
            .remove();
    }
});
