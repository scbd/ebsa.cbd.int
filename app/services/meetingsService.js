define(['angular'], function(ng) {
  var services = ng.module('app.services', []);
  return services.factory('meetings', ['$http', '$locale', 'growl', function($http, $locale, growl) {

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

          var m = {
            country: meeting.eventCountry_EN_t,
            city: meeting.eventCity_EN_t,
            title: meeting.title_s,
            startDate: startDate,
            endDate: endDate,
            documentsUrl: meeting.symbol_s,
            startMonth: startDate.getMonth(),
            endMonth: endDate.getMonth(),
            startDay: startDate.getDate(),
            endDay: endDate.getDate(),
            startYear: startDate.getFullYear(),
            endYear: endDate.getFullYear(),
            countryCode: meeting.eventCountry_s && meeting.eventCountry_s.toUpperCase()
          };

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
            cb(normalizeMeetings(results.data.response));
          })
          .catch(function(results) {
            if (results.status !== 200) {
              growl.addErrorMessage('Failed to fetch meetings! Please refresh the page.');
            }
          });
      };

      return meetings;

    }
  ]);
});