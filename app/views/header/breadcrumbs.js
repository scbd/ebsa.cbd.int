define(['app'], function(app) {

    return app.controller('BreadcrumbsCtrl', ['$scope', 'breadcrumbs', function ($scope, breadcrumbs) {
      breadcrumbs.init();
      $scope.breadcrumbs = breadcrumbs;
      $scope.hasCrumbs = breadcrumbs.getAll().length;
    }]);
});