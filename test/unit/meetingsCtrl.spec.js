define([
    'angular',
    'app',
    'angular-mocks',
    '/views/meetings/meetings.html.js',
    'text!/base/test/unit/fixtures/meetings.json'
  ],
  function(angular, app, mocks, ctrl, fixtureMeetings) {
    describe('MeetingsCtrl', function() {
      var $http, $scope, $locale, $location, Meetings, Lists, paginator;

      var fixtures = JSON.parse(fixtureMeetings),
        upcomingMeetings = fixtures.upcoming,
        previousMeetings = fixtures.previous;

      var scope, controller, timeout;
      beforeEach(function() {
        mocks.module('app');

        mocks.inject(function($q, $timeout, $http, $rootScope, $locale, $location, $controller, lists, paginator) {
          timeout = $timeout;
          var meetings = {
            getMeetingsPage: function(options) {
              var deferred = $q.defer(),
                meetings = (options.timeframe === 'upcoming') ? upcomingMeetings : previousMeetings;

              $timeout(function() {
                deferred.resolve(meetings);
              }, 10);

              return deferred.promise;
            }
          };

          scope = $rootScope.$new();
          controller = $controller('MeetingsCtrl', {
            $http: $http,
            $scope: scope,
            $locale: $locale,
            $location: $location,
            meetings: meetings,
            lists: lists,
            paginator: paginator
          });

          var promise = controller.fetchMeetings({timeframe: 'upcoming'});
        });
      });

      it('should have a default timeframe', function() {
        expect(scope.timeframe).to.eql('upcoming');
      });

      it('should set filter when calling setFilter()', function() {
        // stub out update so we don't trigger requests.
        controller.updateMeetingData = sinon.stub().returns(undefined);
        controller.filterMeetings = sinon.stub().returns(undefined);
        controller.generateCountryList = sinon.stub().returns(undefined);
        controller.generateYearList = sinon.stub().returns(undefined);

        expect(scope.loading).to.be.true;
        timeout.flush();
        expect(scope.loading).to.be.false;

        scope.setFilter('country', {value: 'CA'});
        expect(controller.filters.country).to.eql('CA');
      });

    });

  });