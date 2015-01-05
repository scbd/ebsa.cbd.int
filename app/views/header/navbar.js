define(['app'], function(app) {
  'use strict';

  app.controller('NavbarCtrl', ['$scope', '$location', '$sce', function($scope, $location, $sce) {
      var menu = [{
        'title': 'Home',
        'link': '/ebsa'
      }, {
        'title': 'About',
        'link': 'about'
      }, {
        'title': 'EBSA<span class="lower">s</span>',
        'link': 'ebsas'
      }, {
        'title': 'Meetings',
        'link': 'meetings'
      }, {
        'title': 'Resources',
        'link': 'resources'
      }, {
        'title': 'Collaborators',
        'link': 'collaborators'
      }];
      // bad hack to accomodate the one item that has HTML in it...
      angular.forEach(menu, function(menuItem) {
        menuItem.title = $sce.trustAsHtml(menuItem.title);
      });

      $scope.menu = menu;

      $scope.isActive = function(route) {
        route = route === '/ebsa' ? '' : route;
        return '/' + route === $location.path();
      };
  }]);
});