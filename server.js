/* jshint node: true, browser: false */
var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');
var siteSearch = require('./siteSearch');

// Create server

var app = express();

app.set('port', process.env.PORT || 2040, '127.0.0.1');

app.use(function(req, res, next) {
    if(req.url.indexOf('.geojson')>0)
        res.contentType('application/json');
    next();
});

app.use(express.static(path.join(__dirname, 'app/img/favicon.png')));

// Configure routes

var proxy = httpProxy.createProxyServer({});

app.get( '/ebsa/api/search',    siteSearch.route);
app.use( '/ebsa/app',           express.static(path.join(__dirname, 'app')));
app.use( '/ebsa',               express.static(path.join(__dirname, 'app'))); // hack
app.use( '/ebsa',               function(req, res) { res.sendfile(__dirname + '/app/index.html'); } );
app.all( '/api/*' ,             function(req, res) {  proxy.web(req, res, { target: 'https://api.cbd.int:443', secure: false, changeOrigin:true } ); } );

// LOG PROXY ERROR & RETURN http:500

proxy.on('error', function (e, req, res) {
    console.error(new Date().toUTCString() + ' error proxying: '+req.url);
    console.error('proxy error:', e);
    res.send( { code: 500, source:'www.infra/proxy', message : 'proxy error', proxyError: e }, 500);
});


// Start server
app.listen(app.get('port'), function () {
	console.log('Server listening on %j', this.address());
});
