define(['app', './navbar', './breadcrumbs'], function(app) {
  'use strict';

  app.controller('HeaderCtrl', ['$rootScope', '$location', '$scope', function($rootScope, $location, $scope) {
    function computeHeader() {
      var currentPath = $location.path().slice(1);
      return {
        'class': currentPath,
        title: currentPath,
        hasHeadImg: currentPath !== '' && currentPath !== '404'
      };
    }
    $rootScope.$on('$routeChangeSuccess', function(e, route) {
      $scope.page = computeHeader();
    });
  }]);

});