"use strict";

define(['jquery'], function ($) {
    return {
        getDbTable: function getDbTable(dataCol) {
            return new Promise(function getData(resolve, reject) {
                $.ajax({
                    method: "GET",
                    url: "/data/" + dataCol,
                    success: function success(response) {
                        try {
                            var jsonData = JSON.parse(response);
                            resolve(jsonData);
                        } catch (e) {
                            reject(e);
                        }
                    },
                    error: function error(request, respError) {
                        reject(respError);
                    }
                });
            });
        }
    };
});
