define(['angular', 'app', 'angular-mocks', 'base/app/views/meetings/meetings.html.js'], function(angular, app, mocks, meetingsCtrl) {
  describe('meetingsCtrl', function() {
    var $http, $scope, $locale, $location, Meetings, Lists, paginator;

    beforeEach(module('app'));

    beforeEach(inject(function($injector) {
      $http = $injector.get('$http');
      $scope = $injector.get('$http');
      $locale = $injector.get('$http');
      Meetings = $injector.get('meetings');
      Lists = $injector.get('lists');
      paginator = $injector.get('paginator');
    }));
  });
});