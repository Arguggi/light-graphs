requirejs.config({
    paths: {
        'jquery': 'lib/jquery.min',
        'd3': 'lib/d3.v3',
    }
});

requirejs(['jquery', 'd3'], function ($, d3) {
    "use strict";

    $(function () {
        console.log("Hello");
    });
});
