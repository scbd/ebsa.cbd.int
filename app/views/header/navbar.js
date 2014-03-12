define(['app'], function(app) {
  'use strict';

  app.controller('NavbarCtrl', ['$scope', '$location', function($scope, $location) {
      $scope.menu = [{
        'title': 'Home',
        'link': '/'
      }, {
        'title': 'About',
        'link': '/about'
      }, {
        'title': 'EBSAs',
        'link': '/ebsas'
      }, {
        'title': 'Meetings',
        'link': '/meetings'
      }, {
        'title': 'Resources',
        'link': '/resources'
      }, {
        'title': 'Partners',
        'link': '/partners'
      }];

      $scope.isActive = function(route) {
        return route === $location.path();
      };
  }]);
});