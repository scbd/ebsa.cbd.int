define(['app'], function(app) {

  return app.controller('BreadcrumbsCtrl', ['$rootScope', '$scope', '$location', 'breadcrumbs',
    function($rootScope, $scope, $location, breadcrumbs) {
      // breadcrumbs.init();

      function computeCrumbs () {
        $scope.breadcrumbs = breadcrumbs;
        $scope.showCrumbs = $location.path() !== '/';
      }

      $rootScope.$on('$routeChangeSuccess', function(e, route) {
        computeCrumbs();
      });
    }
  ]);
});