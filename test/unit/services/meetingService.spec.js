define([
    'angular',
    'app',
    'angular-mocks',
    '/services/meetings.js',
    'text!/base/test/unit/fixtures/meetingsRaw.json',
    'text!/base/test/unit/fixtures/meetings.json'
  ],
  function(angular, app, mocks, meetingsService, meetingsRawJSON, processedMeetings) {
    describe('Meeting Service', function() {

      var meetings,
        $httpBackend,
        rawJSON = JSON.parse(meetingsRawJSON),
        processed = JSON.parse(processedMeetings),
        previousMeetingsUrl = '/api/v2013/index?rows=100000&q=schema_s:meeting%20AND%20startDate_dt:%5B*%20TO%20NOW%5D%20AND%20title_t:*EBSA*&sort=startDate_dt%20desc',
        upcomingMeetingsUrl = '/api/v2013/index?rows=100000&q=schema_s:meeting%20AND%20startDate_dt:%5BNOW%20TO%20*%5D%20AND%20title_t:*EBSA*&sort=startDate_dt%20asc';

      beforeEach(function() {
        mocks.module('app');
        mocks.module('app.services');


        mocks.inject(function(_$httpBackend_, _meetings_) {
          meetings = _meetings_;
          $httpBackend = _$httpBackend_;
        });

        $httpBackend.when('GET', upcomingMeetingsUrl).respond(rawJSON.upcoming);
        $httpBackend.when('GET', previousMeetingsUrl).respond(rawJSON.previous);
      });

      it('should fetch a list of meetings by timeframe', function(done) {
        var promise = meetings.getMeetingsPage({
          timeframe: 'upcoming'
        });

        promise.then(function(results) {
          // convert the startDate and endDate to strings so we can compare.
          // By default the service delivers them with Date objects so we can
          // manipulate them later.
          var meeting = results[0];
          meeting.startDate = meeting.startDate.toISOString();
          meeting.endDate = meeting.endDate.toISOString();

          expect(meeting).to.deep.equal(processed.upcoming[0]);
          done();
        });

        $httpBackend.flush();
      });

      it('should create correctly formatted date ranges for Solr consumption', function() {
        var range = meetings.createDateRange(new Date(2013, 0), new Date(2013, 11, 31));
        expect(range).to.equal('[2013-01-01T05:00:00.000Z TO 2013-12-31T05:00:00.000Z]');
      });

    });
  });