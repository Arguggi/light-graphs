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

app.post('/data', function (req, res) {
    db.queryDb('SELECT DATE_FORMAT(months.date,\'%Y-%m\') AS \'date\', months.kwh FROM months ORDER BY DATE(months.date)')
        .then(function sendData(results) {
            res.send(JSON.stringify(results));
        });
});
