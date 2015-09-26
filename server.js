"use strict";

const PORT = 9090;

var lightDebug = require('debug')('light');
var serverDebug = require('debug')('light:server');
var db = require('./node/db');
var express = require('express');
var app = express();

var server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

app.get('/data/kwh', function (req, res) {
    db.queryDb('SELECT DATE_FORMAT(months.date,\'%Y-%m\') AS \'xLabel\', months.kwh AS yValue FROM months ORDER BY DATE(months.date)')
        .then(function sendData(results) {
            var dataJson = JSON.stringify({
                    dbData: results,
                    unit: "Kwh"
            });
            res.send(dataJson);
        });
});

app.get('/data/cost', function (req, res) {
    db.queryDb('SELECT DATE_FORMAT(months.date,\'%Y-%m\') AS \'xLabel\', months.cost AS yValue FROM months ORDER BY DATE(months.date)')
        .then(function sendData(results) {
            var dataJson = JSON.stringify({
                    dbData: results,
                    unit: "€"
            });
            res.send(dataJson);
        });
});

app.get('/data/cost-kwh', function (req, res) {
    db.queryDb('SELECT DATE_FORMAT(months.date,\'%Y-%m\') AS \'xLabel\', months.cost AS cost, months.kwh AS kwh FROM months ORDER BY DATE(months.date)')
        .then(function sendData(results) {
            results.forEach(row => {
                    row.yValue = ((row.cost / row.kwh) * 100).toFixed(1);
            });
            var dataJson = JSON.stringify({
                    dbData: results,
                    unit: "€ cent"
            });
            res.send(dataJson);
        });
});
