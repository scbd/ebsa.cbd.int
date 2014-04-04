define(['app'], function(app) {

  return app.controller('BreadcrumbsCtrl', ['$rootScope', '$scope', '$location', 'breadcrumbs',
    function($rootScope, $scope, $location, breadcrumbs) {
      var self = this;

      this.computeCrumbs = function() {
        $scope.breadcrumbs = breadcrumbs.get();
        $scope.showCrumbs = $location.path() !== '/';
      };

      this.addCrumb = function(title, url) {
        // if the last current crumbs is dynamic, we replace it with the
        // new incoming one;
        if ($scope.breadcrumbs[$scope.breadcrumbs.length-1].dynamic)
          $scope.breadcrumbs.pop();

        $scope.breadcrumbs.push({
          label: title,
          path: url,
          dynamic: true
        });
      };

      var crumblistener = $rootScope.$on('breadcrumbs:add', function(event, title, url) {
        self.addCrumb(title, url);
      });

      var routeChangeListener = $rootScope.$on('$routeChangeSuccess', function(e, route) {
        self.computeCrumbs();
      });

      $scope.$on('$destroy', function() {
        crumblistener();
        routeChangeListener();
      });
    }
  ]);
});