define([
  'angular',
  'app',
  'angular-mocks',
  '/views/header/breadcrumbs.js'
], function(angular, app, mocks, bcCtrl) {

  describe('Breadcrumbs Controller', function() {

    var controller, $rootScope, $scope, $location;
    beforeEach(function() {
      mocks.module('app');

      mocks.inject(function(_$rootScope_, _$location_, $controller, _breadcrumbs_) {
        $rootScope = _$rootScope_;
        $location = _$location_;

        $scope = $rootScope.$new();
        controller = $controller('BreadcrumbsCtrl', {
          $rootScope: $rootScope,
          $scope: $scope,
          $location: _$location_,
          breadcrumbs: _breadcrumbs_
        });

      });
    });

    it('should not show any breadcrumbs on the homepage', function() {
      $location.path = sinon.stub($location.path).returns('/');
      contorller.computeCrumbs();
      expect($scope.showCrumbs).to.be.false;
    });
  });
});