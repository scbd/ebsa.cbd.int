define(['./module.js', './solrQuery.js'], function(module, Query) {
  return module.factory('meetings', ['$http', '$locale', 'growl',
    function($http, $locale, growl) {

      var baseUrl = '/api/v2013/index',
        baseQuery = 'schema_s:meeting',
        meetings = {},
        perPage = 10,
        currentPage = 1,
        sortField = 'startDate_dt',
        dir = 'asc',
        queryUpcoming = '[NOW TO *]',
        queryPrevious = '[* TO NOW]',
        querySort = [sortField, dir].join(' '),
        fieldMap = {
          schema: 'schema_s',
          country: 'eventCountry_s',
          startDate: 'startDate_dt',
          year: 'startDate_dt',
          sort: 'sort'
        };

      function computePagination(total, curPage, perPage) {
        return {
          totalMeetings: total,
          currentPage: curPage || 1,
          totalPages: Math.ceil(total / perPage),
          perPage: perPage
        };
      }

      function normalizeMeetings(response) {
        var processed = {
          meetings: [],
          pagination: computePagination(response.numFound, currentPage, perPage)
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

        $http.get(baseUrl, {
          params: {
            q: baseQuery
          }
        })
          .then(function(results) {
            cb(results.data);
          });
      };

      function issueRequest(query, cb) {
        // because we build the query by hand using solrQuery, we
        // dont use the usual params hash the $http.get() accepts.
        $http.get([baseUrl, query].join('?'))
          .then(function(results) {
            cb(normalizeMeetings(results.data.response));
          })
          .catch(function(results) {
          if (results.status !== 200) {
            growl.addErrorMessage('Failed to fetch meetings! Please refresh the page.');
          }
        });
      }

      function createDateRange (start, end) {
        return '[' + start.toISOString() + ' TO ' + end.toISOString() + ']';
      }

      function buildSolrQuery(paramMap) {
        // clean out any keys that have falsy values so that we don't
        // send empty params to Solr.
        var cleanMap = _.chain(paramMap)
          .pairs()
          .filter(function(val) {
            return !!val[1];
          })
          .object()
          .value();

        var query = new Query();
        var q = {}, params, sortParams, start;

        angular.forEach(cleanMap, function(val, fname) {
          switch (fname) {
            case 'schema':
              q[translateFieldName(fname)] = val;
              break;

            case 'country':
              q[translateFieldName(fname)] = val;
              break;

            case 'startDate':
              // the year param is more specific than startDate and we favour
              // it over startDate's wider range.
              if (cleanMap.year) break;
              var startRange = val === 'upcoming' ? queryUpcoming : queryPrevious;
              q[translateFieldName(fname)] = startRange;
              break;

            case 'year': //TODO: handling for year
              //create a range from [Jan 1st, yearGiven TO Dec 31st, yearGiven]
              var range = createDateRange(new Date(val, 0), new Date(val, 11, 31));
              q[translateFieldName(fname)] = range;
              break;

            case 'sort':
              sortParams = _.object([val.map(translateFieldName)]);
              break;

            case 'start':
              start = val;
              break;

            default:
              q[translateFieldName(fname)] = val;
              break;
          }
        });

        query.q(q);
        if (start) query.start(start);
        if (_.keys(sortParams).length) query.sort(sortParams);

        return query.build();
      }

      function translateFieldName(fieldName) {
        return fieldMap[fieldName] || fieldName;
      }

      meetings.getMeetingsPage = function(cb, pageNum, timeframe, countryCode, year) {
        currentPage = pageNum || 1;
        var solrQuery = buildSolrQuery({
          schema: 'meeting',
          startDate: timeframe,
          country: countryCode,
          year: year,
          sort: [sortField, dir],
          start: (currentPage - 1) * perPage
        });
        issueRequest(solrQuery, cb);
      };

      return meetings;
    }
  ]);
});