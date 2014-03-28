define([
    'app',
    'underscore',
    '../../util/strings.js'
  ],
  function(app, _, strings) {
    'use strict';

    app.controller('MeetingsCtrl', ['$http', '$scope', '$locale', 'meetings', 'lists', 'paginator', '$location',
      function($http, $scope, $locale, Meetings, Lists, paginator, $location) {
        // default timeframe for meetings
        $scope.timeframe = 'upcoming';

        var filters = {
          country: undefined,
          year: undefined
        };

        function resetFilters() {
          filters.country = filters.year = undefined;
        }

        $scope.setFilter = function(filterName, selection) {
          filters[filterName] = selection.value === 'All' ? undefined : selection.value;
          updateMeetingData(filterMeetings(filters));
        };

        function filterMeetings(filters) {
          var filtered,
            meetings = meetingsCache[$scope.timeframe];

          if (!filters.country && !filters.year) return meetings;

          if (filters.country) {
            filtered = meetings.filter(function(meeting) {
              return meeting.countryCode === filters.country;
            });
          }
          if (filters.year) {
            if (!filtered) filtered = meetings;
            filtered = filtered.filter(function(meeting) {
              return meeting.startYear === filters.year;
            });
          }
          return filtered;
        }

        $scope.setPage = function(page, countryCode, year) {
          paginator.setPage(page);
          updateMeetingData();
        };

        $scope.setTimeframe = function(timeframe) {
          timeframe = timeframe || 'upcoming';
          resetFilters();
          $scope.timeframe = timeframe;
          fetchMeetings(timeframe);
        };

        function generateCountryList(meetings) {
          Lists.getCountries(function(json) {
            var filteredCountries = [];
            meetings.forEach(function(meeting) {
              filteredCountries.push(_.findWhere(json, {
                countryCode: meeting.countryCode
              }));
            });
            $scope.countryList = _.chain(filteredCountries)
              .uniq()
              .sortBy(function(country) {
                return country && country.name;
              })
              .map(function(country) {
                return {
                  text: country.name,
                  value: country.countryCode
                };
              })
              .value();
            // set the default option to be all meetings
            // see below in setSelectedCountry for handling of special case.
            $scope.countryList.unshift({
              text: 'All',
              value: 'All'
            });
          });
        }

        function generateYearList(meetings) {
          var yearList = meetings.map(function(meeting) {
            return meeting.startYear;
          });
          yearList.unshift('All');
          return _.uniq(yearList)
            .map(function(year) {
              return {
                text: year.toString(),
                value: year
              };
            });
        }

        function computeOptionLists(meetingSet) {
          $scope.countryList = generateCountryList(meetingSet);
          $scope.yearList = generateYearList(meetingSet);
        }

        function updateMeetingData(meetings) {
          if (meetings) paginator.resetCollection(meetings);
          var page = paginator.getCurrentPage();
          $scope.meetings = page.data;
          $scope.pagination = page.pagination;
        }

        var meetingsCache = {};

        function fetchMeetings(timeframe, country, year) {
          // we're looking only for EBSA meetings
          var title = '*EBSA*';
          // var title = '';

          if (timeframe && meetingsCache[timeframe]) {
            computeOptionLists(meetingsCache[timeframe]);
            return updateMeetingData(meetingsCache[timeframe]);
          }

          Meetings.getMeetingsPage({
            timeframe: timeframe,
            title: title,
            countryCode: country,
            year: year
          })
          .then(function(meetingSet) {
            // cache the results since we ask the backend for all rows.
            meetingsCache[timeframe] = meetingSet;
            updateMeetingData(meetingSet);
            computeOptionLists(meetingSet);
          });
        }
      }
    ]);

  });