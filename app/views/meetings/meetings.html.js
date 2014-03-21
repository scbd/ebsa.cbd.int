define([
    'app',
    'underscore',
    '../../util/strings.js'
  ],
  function(app, _, strings) {
    'use strict';

    app.controller('MeetingsCtrl', ['$http', '$scope', '$locale', 'meetings', 'lists', 'paginator',
      function($http, $scope, $locale, Meetings, Lists, paginator) {
        // default timeframe for meetings
        $scope.timeframe = 'upcoming';

        var filters = {
          country: undefined,
          year: undefined
        };

        function resetFilters() {
          filters.country = filters.year = undefined;
          setSelectedTitle('country', 'All');
          setSelectedTitle('year', 'All');
        }

        $scope.setFilterParam = function(paramName, value) {
          var country,
            isCountry = paramName === 'country',
            // normalize
            filterValue = (/[a|A]ll/.test(value)) ? null : value;


          if (!angular.equals(filters[paramName], filterValue)) {
            if (isCountry) {
              country = _.findWhere($scope.memberCountries, {
                countryCode: value
              });
            }
            setSelectedTitle(paramName, isCountry ? country.name : value);
            filterValue = isCountry && filterValue ? value : filterValue;

            filters[paramName] = filterValue;

            updateMeetingData(filterMeetings(filters));
          }
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
          resetFilters();
          $scope.timeframe = timeframe;
          fetchMeetings(timeframe);
        };

        function setSelectedTitle(paramName, title) {
          $scope['selected' + strings.capitalise(paramName)] = title;
        }

        function generateCountryList(meetings) {
          Lists.getCountries(function(json) {
            var countryNames = [];
            meetings.forEach(function(meeting) {
              countryNames.push(_.findWhere(json, {
                countryCode: meeting.countryCode
              }));
            });
            $scope.memberCountries = _.sortBy(_.uniq(countryNames), function(country) {
              return country && country.name;
            });
            // set the default option to be all meetings
            // see below in setSelectedCountry for handling of special case.
            $scope.memberCountries.unshift({
              name: 'All',
              countryCode: 'All'
            });
            setSelectedTitle('country', $scope.memberCountries[0].name);
          });
        }

        function generateYearList(meetings) {
          var yearList = meetings.map(function(meeting) {
            return meeting.startYear;
          });
          yearList.unshift('All');
          $scope.yearList = _.uniq(yearList);
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

          if (timeframe && meetingsCache[timeframe])
            return updateMeetingData(meetingsCache[timeframe]);

          Meetings.getMeetingsPage({
            timeframe: timeframe,
            title: title,
            countryCode: country,
            year: year
          }, function(meetingSet) {
            // cache the results since we ask the backend for all rows.
            meetingsCache[timeframe] = meetingSet;
            updateMeetingData(meetingSet);
            generateCountryList(meetingSet);
            generateYearList(meetingSet);
          });
        }

        fetchMeetings('upcoming', filters.country, filters.year);
      }
    ]);

  });