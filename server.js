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

  app.use(express.favicon(path.join(__dirname, 'app/img/favicon.png')));
  app.use(express.logger('dev'));
  app.use(express.compress());

  app.configure('development', function() {
    app.use(require('connect-livereload')());
  });

  app.use(app.router);
  app.use('/ebsa', express.static(path.join(__dirname, 'app')));

  // catch all handler
  app.use('/ebsa', function(req, res) {
    res.sendfile(__dirname + '/app/index.html');
  });
});

// Configure routes

var proxy = httpProxy.createProxyServer({});

app.get   ('/ebsa/api/search', siteSearch.route);
// app.get   ('/api/*', function(req, res) { res.send(502); } ); //emulate failure of backend api;
app.all('/api/*', function(req, res) {  
    proxy.web(req, res, { target: 'https://api.cbd.int:443', secure: false } );  
} );

// LOG PROXY ERROR & RETURN http:500

proxy.on('error', function (e, req, res) {
    console.error(new Date().toUTCString() + ' error proxying: '+req.url);
    console.error('proxy error:', e);
    res.send( { code: 500, source:'www.infra/proxy', message : 'proxy error', proxyError: e }, 500);
});


// Start server
console.log('Server listening on port ' + app.get('port'));
http.createServer(app).listen(app.get('port'));