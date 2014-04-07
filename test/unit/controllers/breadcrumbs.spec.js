define([
  'angular',
  'app',
  'angular-mocks',
  '/views/header/breadcrumbs.js'
], function(angular, app, mocks, bcCtrl) {

  describe('Breadcrumbs Controller', function() {

    var controller, $rootScope, scope, $location, ngBreadcrumbs,
      mockCrumbs = [{label: 'Home', path: '/'}, {label: 'Meetings', path: '/meetings'}];

    beforeEach(function() {
      mocks.module('app');

      mocks.inject(function(_$rootScope_, _$location_, $controller, _breadcrumbs_) {
        $rootScope = _$rootScope_;
        $location = _$location_;
        ngBreadcrumbs = _breadcrumbs_;

        scope = $rootScope.$new();
        controller = $controller('BreadcrumbsCtrl', {
          $rootScope: $rootScope,
          $scope: scope,
          $location: _$location_,
          breadcrumbs: _breadcrumbs_
        });

      });
    });

    it('should not show any breadcrumbs on the homepage', function() {
      $location.path = sinon.stub().returns('/');
      controller.computeCrumbs();
      expect(scope.showCrumbs).to.be.false;
    });

    it('should add a dynamic crumb to the trail when the breadcrumbs:add event is fired', function() {

      ngBreadcrumbs.get = sinon.stub().returns(mockCrumbs);

      $location.path = sinon.stub().returns('/meetings');
      controller.computeCrumbs();
      controller.addCrumb = sinon.spy(controller.addCrumb);

      $rootScope.$emit('breadcrumbs:add', 'The title', '#path');

      expect(controller.addCrumb).to.have.been.called;
      expect(scope.showCrumbs).to.be.true;
      expect(scope.breadcrumbs).to.include.something.that.deep.equals({
        label: 'The title',
        path: '#path',
        dynamic: true
      });
    });

    it('should replace the last dynamic crumb with a new one', function() {
      ngBreadcrumbs.get = sinon.stub().returns(mockCrumbs);

      $location.path = sinon.stub().returns('/meetings');
      controller.computeCrumbs();
      controller.addCrumb = sinon.spy(controller.addCrumb);

      $rootScope.$emit('breadcrumbs:add', 'The title', '#path');
      $rootScope.$emit('breadcrumbs:add', 'New title', '#new_path');

      expect(scope.breadcrumbs).to.not.include.something.that.deep.equals({
        label: 'The title',
        path: '#path',
        dynamic: true
      });

      expect(scope.breadcrumbs).to.include.something.that.deep.equals({
        label: 'New title',
        path: '#new_path',
        dynamic: true
      });
    });

  });
});