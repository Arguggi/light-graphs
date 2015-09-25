"use strict";

define(['jquery'], function ($) {
    return {
        getDbTable: function getDbTable(table) {
            return new Promise(function getData(resolve, reject) {
                $.ajax({
                    method: "POST",
                    //dataType: "json",
                    url: "/data/",
                    data: {
                        table: table
                    },
                    success: function success(response) {
                        resolve(response);
                    },
                    error: function error(request, respError) {
                        reject(respError);
                    }
                });
            });
        }
    };
});
