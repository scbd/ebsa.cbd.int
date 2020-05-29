/*jshint node:true*/

'use strict';
var cdnHost = 'https://cdn.cbd.int/';

require.config({
    baseUrl : './',
    waitSeconds : 120,
    paths: {
        'angular'         : cdnHost + 'angular@1.2.28/angular.min',
        'angular-route'   : cdnHost + 'angular-route@1.2.28/angular-route.min',
        'async'           : cdnHost + 'requirejs-plugins@1.0.2/src/async',
        'jquery'          : cdnHost + 'jquery@2.2.4/dist/jquery.min',
        'bootstrap'       : cdnHost + 'bootstrap@3.3.7/dist/js/bootstrap.min',
        'underscore'      : cdnHost + 'underscore@1.10.2/underscore-min',
        'angular-growl'   : 'libs/angular-growl/build/angular-growl.min',
        'geojson-area'    : 'libs/geojson-area/index',
        'ng-breadcrumbs'  : 'libs/es-breadcrumbs/dist/ng-breadcrumbs.min',
        'gmapsapi'         : '//maps.googleapis.com/maps/api/js?v=3.exp&sensor=false',

        /*
        'angular-growl'   : cdnHost + 'angular-growl@0.1.0/build/angular-growl',
        
        */
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

require(['angular', 'app', './main'], function(angular, app) {
    angular.bootstrap(document, [app.name]);  
});