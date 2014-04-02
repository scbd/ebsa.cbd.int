define([
    'angular',
    'app',
    'angular-mocks',
    '/services/lists.js',
    '/views/meetings/meetings.html.js',
    'text!/base/test/unit/fixtures/meetings.json',
    'text!/langs/en/countries.json',
  ],
  function(angular, app, mocks, ctrl, lists, fixtureMeetings, countryList) {
    describe('MeetingsCtrl', function() {

      var fixtures = JSON.parse(fixtureMeetings),
        upcomingMeetings = fixtures.upcoming,
        previousMeetings = fixtures.previous;

      countryList = JSON.parse(countryList);


      var scope, controller, timeout, paginatorService, mockMeetings;
      beforeEach(function() {
        mocks.module('app');

        mocks.inject(function($q, $timeout, $http, $rootScope, $locale,
          $location, $controller, lists, paginator) {

          timeout = $timeout;
          paginatorService = paginator;

          // We could use httpBackend instead of these mocks but then we'll
          // be testing the meetingService as well and generally violating
          // single responsibility.
          mockMeetings = {
            getMeetingsPage: function(options) {
              var deferred = $q.defer(),
                meetings = (options.timeframe === 'upcoming') ?
                  upcomingMeetings :
                  previousMeetings;

              $timeout(function() {
                deferred.resolve(meetings);
              }, 0);
              return deferred.promise;
            }
          };

          var mockLists = {
            getCountries: function(cb) {
              var deferred = $q.defer();
              $timeout(function() {
                deferred.resolve(countryList);
              }, 0);
              return deferred.promise;
            }
          };

          scope = $rootScope.$new();
          controller = $controller('MeetingsCtrl', {
            $http: $http,
            $scope: scope,
            $locale: $locale,
            $location: $location,
            meetings: mockMeetings,
            lists: mockLists,
            paginator: paginator
          });
        });
      });

      it('should have a default timeframe', function() {
        expect(scope.timeframe).to.eql('upcoming');
      });

      it('should set filter when calling setFilter()', function() {
        var promise = controller.fetchMeetings('upcoming');
        // stub out update so we don't trigger requests.
        controller.updateMeetingData = sinon.stub().returns(undefined);
        controller.filterMeetings = sinon.stub().returns(undefined);
        controller.generateCountryList = sinon.stub().returns(undefined);
        controller.generateYearList = sinon.stub().returns(undefined);

        expect(scope.loading).to.be.true;
        timeout.flush();
        expect(scope.loading).to.be.false;

        scope.setFilter('country', {
          value: 'CA'
        });
        expect(controller.filters.country).to.eql('CA');

        // check handling for special case 'All'
        scope.setFilter('country', {
          value: 'All'
        });
        expect(controller.filters.country).to.be.undefined;
      });

      it('should return a list of conutries filtered by those that appear in the meeting set', function() {
        var list = controller.generateCountryList(upcomingMeetings);
        timeout.flush();

        expect(scope.countryList).to.deep.equal([{
          text: 'All',
          value: 'All'
        }, {
          text: 'Spain',
          value: 'ES'
        }]);
      });

      it('should cache the countries JSON after generating the country list for the first time', function() {
        var list = controller.generateCountryList(upcomingMeetings);
        timeout.flush();
        expect(controller.countriesCache).to.be.an('Array').and.not.be.empty;
      });

      it('should return a list of years filtered by those that appear in the meeting set', function() {
        var list = controller.generateYearList(upcomingMeetings);
        expect(list).to.deep.equal([{
          text: 'All',
          value: 'All'
        }, {
          text: '2014',
          value: 2014
        }]);
      });

      it('should filter meetings by selected country filter', function() {
        controller.meetingsCache.previous = previousMeetings;
        scope.timeframe = 'previous';
        var filtered = controller.filterMeetings({
          country: 'BR'
        });

        expect(filtered).to.be.an('Array')
          .and.have.length(1)
          .with.deep.property('[0]')
          .that.have.property('country')
          .that.equals('Brazil');

        // Check that undefined filters return all meetings.
        filtered = controller.filterMeetings({});
        expect(filtered).to.be.an('Array')
          .and.to.be.deep.equal(previousMeetings);
      });

      it('should reset filters to undefined on resetFilters()', function() {
        controller.filters = {
          country: 'All',
          year: 2014
        };

        controller.resetFilters();
        expect(controller.filters).to.deep.equal({country: undefined, year: undefined});
      });

      it('should set the time frame and reset filters when calling setTimeframe()', function() {
        controller.fetchMeetings = sinon.stub().returns(undefined);
        scope.setTimeframe('previous');

        expect(scope.timeframe).to.equal('previous');
        expect(controller.filters).to.deep.equal({country: undefined, year: undefined});
      });

      it('should set the proper page on the paginator when calling setPage', function() {
        controller.fetchMeetings('previous');
        timeout.flush();

        controller.updateMeetingData = sinon.spy();
        scope.setPage(1);

        expect(paginatorService.getPage(1).pagination.currentPage).to.be.equal(1);
        expect(controller.updateMeetingData).to.have.been.called;
      });

      it('should fetch meetings and populate cache when calling fetchMeetings()', function() {
        controller.fetchMeetings('previous');
        timeout.flush();

        expect(scope.meetings).to.deep.equal(previousMeetings);
        expect(controller.meetingsCache.previous).to.be.deep.equal(previousMeetings);
      });

      it('should deliver any subsequent call to fetchMeetings from cache', function() {
        controller.fetchMeetings('previous');
        timeout.flush();

        mockMeetings.getMeetingsPage = sinon.spy(mockMeetings.getMeetingsPage);
        controller.fetchMeetings('previous');

        expect(mockMeetings.getMeetingsPage).not.to.have.been.called;
        expect(controller.meetingsCache.previous).to.deep.equal(previousMeetings);
      });

    });

  });