/*jshint node:true*/

'use strict';
window.name = 'NG_DEFER_BOOTSTRAP!';

require.config({
    baseUrl : './',
    paths: {
        'angular'         : '/libs/angular/angular',
        'angular-route'   : '/libs/angular-route/angular-route',
        'ng-breadcrumbs'  : '/libs/ng-breadcrumbs/dist/ng-breadcrumbs',
        'async'           : '/libs/requirejs-plugins/src/async',
        'domReady'        : '/libs/requirejs-domready/domReady',
        'jquery'          : '/libs/jquery/jquery',
        'bootstrap'       : '/libs/bootstrap-sass/dist/js/bootstrap',
        'underscore'      : '/libs/underscore/underscore',
        'angular-growl'   : '/libs/angular-growl/build/angular-growl',
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

require(['angular', 'angular-route', 'bootstrap', 'ng-breadcrumbs', 'domReady', 'angular-growl'],
 function (ng) {

    // NOTE: place operations that need to initialize prior to app start here using the `run` function on the top-level module

    require(['domReady!', './main'], function (document) {
        ng.bootstrap(document, ['app']);
        ng.resumeBootstrap();
    });
});

