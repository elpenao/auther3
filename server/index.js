'use strict';
var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
};

var app = require('./app'),
	db = require('./db');

var port = 8080;
var server = https.createServer(options, app)
var server = server.listen(port, function () {
	console.log('HTTP server patiently listening on port', port);
});

module.exports = server;