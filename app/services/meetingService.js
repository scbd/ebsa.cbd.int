define(['app'], function(app) {
  return app.factory('Meetings', ['$http', '$locale', function($http, $locale) {

      var baseUrl = '/api/v2013/index',
        baseQuery = 'schema_s:meeting',
        meetings = {};

      function normalizeMeetings(response) {
        var processed = {
          meetings: [],
          count: response.numFound
        };

        response.docs.forEach(function(meeting) {
          var startDate = new Date(meeting.startDate_dt);
          var endDate = new Date(meeting.endDate_dt);

          var m = {};
          m.country = meeting.locationCountry_s;
          m.city = meeting.locationCity_t;
          m.title = meeting.title_t;
          m.startDate = startDate;
          m.endDate = endDate;
          m.documentsUrl = meeting.symbol_s;
          m.startDay = startDate.getDay();

          processed.meetings.push(m);
        });

        return processed;
      }

      meetings.getAll = function(cb) {

        $http.get(baseUrl, { params: {q: baseQuery} })
          .then(function(results) {
            cb(results.data);
          });
      };

      meetings.getUpcoming = function(cb) {
        var query = baseQuery + ' AND startDate_dt:[NOW TO *]';

        $http.get(baseUrl, { params: {q: query} })
          .then(function(results) {
            console.log(results.data);
            cb(normalizeMeetings(results.data.response));
          });
      };

      return meetings;

    }
  ]);
});