define(['app'], function(app) {
  'use strict';

  app.controller('MasterTemplateController', ['$scope', '$rootScope', '$anchorScroll',
    function($scope, $rootScope, $anchorScroll) {
      $rootScope.$on('$routeChangeSuccess', function(event) {
        // snap the page back to the top on route change.
        $anchorScroll();
        $rootScope.$on('$routeChangeSuccess', function(){
            $window.ga('set',  'page', basePath+$location.path());
            $window.ga('send', 'pageview');
        });
      });
    }
  ]);

});
