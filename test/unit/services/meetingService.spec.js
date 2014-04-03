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
        var start = (new Date(2013, 0)).toISOString(),
          end = (new Date(2013, 11, 31)).toISOString();

        var range = meetings.createDateRange(start, end);
        expect(range).to.equal('[2013-01-01T05:00:00.000Z TO 2013-12-31T05:00:00.000Z]');
      });

      it('should construct a proper query for Solr consumtption', function() {
        var defaultOptions = {
          schema: 'meeting',
          startDate: 'upcoming',
          country: null,
          year: null,
          sort: ['startDate_dt', 'asc'],
          title_t: '*EBSA*',
          rows: 100000
        };
        var q = meetings._buildSolrQuery(defaultOptions);

        var compQ = 'rows=100000&q=schema_s:meeting%20AND%20startDate_dt:%5BNOW%20TO%20*%5D%20AND%20title_t:*EBSA*&sort=startDate_dt%20asc';
        expect(q).to.be.equal(compQ);

        var qc = angular.extend({}, defaultOptions);
        qc.sort[1] = 'desc';
        qc.startDate = 'previous';
        q = meetings._buildSolrQuery(qc);

        compQ = 'rows=100000&q=schema_s:meeting%20AND%20startDate_dt:%5B*%20TO%20NOW%5D%20AND%20title_t:*EBSA*&sort=startDate_dt%20desc';
        expect(q).to.be.equal(compQ);

        qc = angular.extend({}, defaultOptions);
        qc.schema = 'news';
        qc.sort = ['sortField', 'desc'];
        qc.title_t = 'test_title';
        qc.country = 'BA';
        qc.year = 2014;
        qc.rows = 400;
        q = meetings._buildSolrQuery(qc);

        compQ = 'rows=400&q=schema_s:news%20AND%20eventCountry_s:BA%20AND%20startDate_dt:%5B2014-01-01T05%3A00%3A00.000Z%20TO%202014-12-31T05%3A00%3A00.000Z%5D%20AND%20title_t:test_title&sort=sortField%20desc';
        expect(q).to.be.equal(compQ);
      });

    });
  });