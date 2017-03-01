/*jshint node:true*/

'use strict';
window.name = 'NG_DEFER_BOOTSTRAP!';

require.config({
    baseUrl : './',
    waitSeconds : 120,
    paths: {
        'angular'         : 'libs/angular/angular.min',
        'angular-route'   : 'libs/angular-route/angular-route.min',
        'ng-breadcrumbs'  : 'libs/es-breadcrumbs/dist/ng-breadcrumbs.min',
        'async'           : 'libs/requirejs-plugins/src/async',
        'domReady'        : 'libs/requirejs-domready/domReady',
        'jquery'          : 'libs/jquery/jquery.min',
        'bootstrap'       : 'libs/bootstrap/dist/js/bootstrap.min',
        'underscore'      : 'libs/underscore/underscore-min',
        'angular-growl'   : 'libs/angular-growl/build/angular-growl.min',
        'geojson-area'    : 'libs/geojson-area/index',
        'gmapsapi'         : '//maps.googleapis.com/maps/api/js?v=3.exp&sensor=false'
    },
    shim: {
        'angular'        : { 'deps': ['jquery'], 'exports': 'angular' },
        'angular-route'  : { 'deps': ['angular'] },
        'bootstrap'      : { 'deps': ['jquery'] },
        'underscore'     : { 'exports': '_' },
        'ng-breadcrumbs' : { 'deps': ['angular'] },
        'angular-growl'  : { 'deps': ['angular'] }
    }
});

require(['angular', 'domReady'],
 function (ng) {

    // NOTE: place operations that need to initialize prior to app start here using the `run` function on the top-level module

    require(['domReady!', './main'], function (document) {
        ng.bootstrap(document, ['app']);
        ng.resumeBootstrap();
    });
});
