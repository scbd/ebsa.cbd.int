define([
    '/app/directives/meetingsCalendar.js',
    '/app/services/meetingsService.js',
    '/app/filters/meetingsFilter.js',
    '/app/services/listService.js'
  ],
  function() {
    'use strict';

    var app = require('angular').module('app',
      ['ngRoute', 'ng-breadcrumbs', 'angular-growl', 'app.directives', 'app.services', 'app.filters']);

    app.config(['$controllerProvider', '$compileProvider', '$provide', '$filterProvider', 'growlProvider',
      function($controllerProvider, $compileProvider, $provide, $filterProvider, growlProvider) {

        // Allow dynamic registration

        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.value = $provide.value;
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;

        // configure growl
        growlProvider.globalTimeToLive(10000);
      }
    ]);

    return app;
  });