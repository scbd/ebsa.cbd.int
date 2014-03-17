define(['app'], function(app) {

  return app.controller('BreadcrumbsCtrl', ['$rootScope', '$scope', '$location', 'breadcrumbs',
    function($rootScope, $scope, $location, breadcrumbs) {

      function computeCrumbs () {
        $scope.breadcrumbs = breadcrumbs;
        $scope.showCrumbs = $location.path() !== '/';
      }

      function addCrumb (crumb) {
        // TODO: add support for pushing crumbs dynamically by page
        // widgets.
      }

      $rootScope.$on('$routeChangeSuccess', function(e, route) {
        computeCrumbs();
      });
    }
  ]);
});