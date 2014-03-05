'use strict';

window.name = 'NG_DEFER_BOOTSTRAP!';

require.config({
    baseUrl : '/app/js',
    paths: {
        'angular'         : '../libs/angular/angular',
        'angular-route'   : '../libs/angular-route/angular-route',
        'ng-breadcrumbs'   : '../libs/ng-breadcrumbs/dist/js/ng-breadcrumbs',
        'async'           : '../libs/requirejs-plugins/src/async',
        'domReady'        : '../libs/requirejs-domready/domReady',
        'jquery'          : '../libs/jquery/jquery',
        'bootstrap'       : '../libs/bootstrap-sass/dist/js/bootstrap',
        'underscore'      : '../libs/underscore/underscore'
    },
    shim: {
        'angular'        : { 'deps': ['jquery'], 'exports': 'angular' },
        'angular-route'  : { 'deps': ['angular'] },
        'bootstrap'      : { 'deps': ['jquery'] },
        'underscore'     : { 'exports': '_' }
    }
});

require(['angular', 'angular-route', 'bootstrap', 'domReady'], function (ng) {

    // NOTE: place operations that need to initialize prior to app start here using the `run` function on the top-level module

    require(['domReady!', 'main', '../views/header/header'], function (document) {
        ng.bootstrap(document, ['app']);
        ng.resumeBootstrap();
    });
});

