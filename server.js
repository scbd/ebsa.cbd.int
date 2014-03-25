/* jshint node:true */
var fs = require('fs');
var http = require('http');
var express = require('express');
var httpProxy = require('http-proxy');
var siteSearch = require('./siteSearch');

// Create server

var app = express();
var server = http.createServer(app);
var oneDay = 24*60*60*1000;

app.configure(function() {
  app.set('port', process.env.PORT || 2010, '127.0.0.1');

  app.use(express.logger('dev'));
  app.use(express.compress());

  app.configure('development', function() {
    console.log('use: connect-livereload');
    app.use(require('connect-livereload')());
  });

  app.use('/app', express.static(__dirname + '/app'));
  app.use('/favicon.png', express.static(__dirname + '/app/templates/favicon.png', { maxAge: oneDay }));
});

// Configure routes

var proxy = httpProxy.createProxyServer({});

app.get   ('/api/search', siteSearch.route);
app.get   ('/app/*'   , function(req, res) { res.send('404', 404); } );
app.get   ('/public/*', function(req, res) { res.send('404', 404); } );

var proxyFn = function(req, res) {
  proxy.web(req, res, {
    target: 'https://api.cbd.int',
    secure: false
  });
};
// app.get   ('/api/*', function(req, res) { res.send(502); } ); //emulate failure of backend api;
app.get   ('/api/*', proxyFn);
app.put   ('/api/*', proxyFn);
app.post  ('/api/*', proxyFn);
app.delete('/api/*', proxyFn);

// Configure index.html

app.get('/*', function(req, res) {
  fs.readFile(__dirname + '/app/templates/master.html', 'utf8', function (error, text) {
    res.send(text);
  });
});

// Start server

console.log('Server listening on port ' + app.get('port'));
server.listen(app.get('port'));