define(['app', './navbar', './breadcrumbs'], function(app) {
  'use strict';

  app.controller('HeaderCtrl', ['$rootScope', '$location', '$scope', function($rootScope, $location, $scope) {
    function computeHeader() {
      var currentPath = $location.path().slice(1);
      return {
        'class': currentPath,
        title: currentPath,
        hasHeadImg: currentPath !== '' && currentPath !== '404' && currentPath !== 'search'
      };
    }

    $scope.searchSite = function() {
      if (!$scope.searchQuery || $scope.searchQuery.length <= 3) return;
      $location.path('/search', {search: $scope.searchQuery});
      $location.search({q: $scope.searchQuery});
    };

    $rootScope.$on('$routeChangeSuccess', function(e, route) {
      $scope.page = computeHeader();
    });
  }]);

});