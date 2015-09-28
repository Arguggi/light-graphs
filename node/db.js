"use strict";

module.exports = {
    pool: pool,
    getDeviceLists: getDeviceLists,
    getConn: getConn,
    queryDb: queryDb,
};

var mysql = require('mysql');
var myDebug = require('./myDebug.js');
var dbDebug = require('debug')('light:db');
var config = require('../config/development.config.json');
var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

function getDeviceLists() {
    return queryDB('SELECT deviceslist.titolo FROM deviceslist')
        .then(function prepareData(queryResults) {
            let responseJson = JSON.stringify({
                action: 'get_device_lists',
                data: queryResults
            });
            return Promise.resolve(responseJson);
        });
}

function getConn() {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function getPoolConn(err, connection) {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
}


function queryDb(query, data, checkRowLength) {
    myDebug.debug(dbDebug, 'queryDb', arguments);
    return getConn().then(function queryData(connection) {
        // Default value: true, unless checkRows === false;
        let checkRows = checkRowLength !== false;
        return new Promise(function getDBData(resolve, reject) {
            connection.query(query, data, function (err, rows, fields) {
                connection.release();
                if (err) {
                    reject(err);
                    // If checkRows === true also check if we got any data
                    // from the query
                } else if (checkRows && !rows.length) {
                    reject(Error('No_rows'));
                } else {
                    resolve(rows);
                }
            });
        });
    });
}
