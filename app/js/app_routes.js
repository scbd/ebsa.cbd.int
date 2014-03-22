define(['app'], function(app) {
  'use strict';

  app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');

      $routeProvider.
      when('/', {
        templateUrl: '/app/views/index/index.html',
        reloadOnSearch: false,
        resolve: {
          dependencies: resolveJS()
        },
        label: 'Home'

      }).
      when('/about', {
        templateUrl: '/app/views/about/about.html',
        reloadOnSearch: false,
        resolve: {
          dependencies: resolveJS()
        },
        label: 'About'

      }).
      when('/meetings', {
        templateUrl: '/app/views/meetings/meetings.html',
        reloadOnSearch: false,
        resolve: {
          dependencies: resolveJS()
        },
        label: 'Meetings'

      }).
      when('/ebsas', {
        templateUrl: '/app/views/ebsas/ebsas.html',
        reloadOnSearch: false,
        resolve: {
          dependencies: resolveJS()
        },
        label: 'EBSAs'

      }).
      when('/resources', {
        templateUrl: '/app/views/resources/resources.html',
        reloadOnSearch: false,
        resolve: {
          dependencies: resolveJS()
        },
        label: 'Resources'

      }).
      when('/partners', {
        templateUrl: '/app/views/partners/partners.html',
        reloadOnSearch: false,
        resolve: {
          dependencies: resolveJS()
        },
        label: 'Partners'

      }).
      when('/404', {
        templateUrl: '/app/views/404.html',
        resolve: {},
        label: '404'

      }).
      otherwise({
        redirectTo: '/404'
      });



      //==================================================
      //
      //
      //==================================================
      function resolveJS(dependencies) {
        return ['$q', '$route', function($q, $route) {

          var deferred = $q.defer();
          dependencies = dependencies || ['$route'];

          for (var i = 0; i < dependencies.length; ++i) {
            if (dependencies[i] == '$route') {
              dependencies[i] = $route.current.$$route.templateUrl + '.js';
            }
          }

          require(dependencies || [], function onResolved() {

            var results = Array.prototype.slice.call(arguments, 1);

            deferred.resolve(results);

            return results;
          });

          return deferred.promise;
        }];
      }
    }
  ]);
});