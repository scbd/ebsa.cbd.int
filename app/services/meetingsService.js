define(['./module.js'], function(module) {
  return module.factory('meetings', ['$http', '$locale', 'growl', function($http, $locale, growl) {

      var baseUrl = '/api/v2013/index',
        baseQuery = 'schema_s:meeting',
        meetings = {},
        perPage = 10,
        currentPage = 1,
        sortField = 'startDate_dt',
        dir = 'asc',
        queryUpcoming = '[NOW TO *]',
        queryPrevious = '[* TO NOW]';
        querySort = [sortField, dir].join(' ');

      function normalizeMeetings(response) {
        var processed = {
          meetings: [],
          totalMeetings: response.numFound,
          currentPage: currentPage || 1,
          totalPages: Math.ceil(response.numFound / perPage),
          perPage: perPage
        };

        // console.log(processed);

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

      function getMeetingsByTime(cb, timeframe, pageNum) {
        var query = baseQuery + ' AND startDate_dt:' + timeframe;
        startItem = (pageNum - 1) * perPage;

        $http.get(baseUrl, { params: {q: query, start: startItem, sort: querySort } })
          .then(function(results) {
            cb(normalizeMeetings(results.data.response));
          })
          .catch(function(results) {
            if (results.status !== 200) {
              growl.addErrorMessage('Failed to fetch meetings! Please refresh the page.');
            }
          });
      };

      meetings.getMeetingsPage = function(cb, pageNum, timeframe) {
        switch(timeframe) {
          case 'upcoming': timeframe = queryUpcoming; break;
          case 'previous': timeframe = queryPrevious; break;
          default: timeframe = queryUpcoming;
        }
        currentPage = pageNum || 1;
        getMeetingsByTime(cb, timeframe, currentPage);
      }

      return meetings;
    }
  ]);
});