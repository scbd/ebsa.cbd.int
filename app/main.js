define(['app', 'jquery', 'router/routes', 'views/header/header'], function(app, $) {
  'use strict';

  app.controller('MasterTemplateController', ['$scope', '$rootScope', '$anchorScroll', '$window', '$location',
    function($scope, $rootScope, $anchorScroll, $window, $location) {
      $rootScope.$on('$routeChangeSuccess', function(event) {
        // snap the page back to the top on route change.
        $anchorScroll();
        $rootScope.$on('$routeChangeSuccess', function(){
            $window.gtag('event', 'page_view', {
              'page_location' : basePath+$location.path()
            });
        });

        function basePath() {
          return $('head>base').attr('href').replace(/\/$/, '')
        }
      });
    }
  ]);

});
