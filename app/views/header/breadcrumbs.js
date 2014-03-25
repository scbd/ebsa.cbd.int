define(['app'], function(app) {

  return app.controller('BreadcrumbsCtrl', ['$rootScope', '$scope', '$location', 'breadcrumbs',
    function($rootScope, $scope, $location, breadcrumbs) {

      function computeCrumbs() {
        $scope.breadcrumbs = breadcrumbs.get();
        $scope.showCrumbs = $location.path() !== '/';
      }

      function addCrumb(title, url) {
        // if the last current crumbs is dynamic, we replace it with the
        // new incoming one;
        if ($scope.breadcrumbs[$scope.breadcrumbs.length-1].dynamic)
          $scope.breadcrumbs.pop();

        $scope.breadcrumbs.push({
          label: title,
          path: url,
          dynamic: true
        });
      }

      var crumblistener = $rootScope.$on('breadcrumbs:add', function(event, title, url) {
        addCrumb(title, url);
      });

      var routeChangeListener = $rootScope.$on('$routeChangeSuccess', function(e, route) {
        computeCrumbs();
      });

      $scope.$on('$destroy', function() {
        crumblistener();
        routeChangeListener();
      });
    }
  ]);
});