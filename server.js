"use strict";

const PORT=9090;

var lightDebug = require('debug')('light');
var serverDebug = require('debug')('light:server');
var http = require('http');
var util = require('util');
var db = require('./node/db');

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

//We need a function which handles requests and send response
function handleRequest(request, res){
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ a: 1 }));
}
