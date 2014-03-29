/* jshint node:true */
var fs = require('fs');
var http = require('http');
var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');
var siteSearch = require('./siteSearch');

// Create server

var app = express();
var oneDay = 24*60*60*1000;

app.configure(function() {
  app.set('port', process.env.PORT || 2010, '127.0.0.1');

  app.use(express.favicon(path.join(__dirname, 'app/img/favicon.png')));//'/favicon.png', express.static(__dirname + '/app/img/favicon.png', { maxAge: oneDay }));
  app.use(express.logger('dev'));
  // app.use(express.compress());

  app.configure('development', function() {
    console.log('use: connect-livereload');
    app.use(require('connect-livereload')());
  });

  app.use(app.router); 
  app.use(express.static(path.join(__dirname, 'app')));
});

// Configure routes

var proxy = httpProxy.createProxyServer({});

app.get   ('/app/*'   , function(req, res) { res.send('404', 404); } );
app.get   ('/api/search', siteSearch.route);

// app.get   ('/api/*', function(req, res) { res.send(502); } ); //emulate failure of backend api;
app.all('/api/*', function(req, res) { proxy.web(req, res, { target: 'https://api.cbd.int', secure: false }); } );


// Start server
console.log('Server listening on port ' + app.get('port'));
http.createServer(app).listen(app.get('port'));