define([
    'app',
    'underscore',
    '../../util/strings.js'
  ],
  function(app, _, strings) {
    'use strict';

    app.controller('MeetingsCtrl', ['$http', '$scope', '$locale', 'meetings', 'lists',
      function($http, $scope, $locale, Meetings, Lists) {
        // default timeframe for meetings
        $scope.timeframe = 'upcoming';

        Lists.getCountries(function(json) {
          $scope.memberCountries = json;
          // set the default option to be all meetings
          // see below in setSelectedCountry for handling of special case.
          $scope.memberCountries.unshift({
            name: 'All',
            countryCode: 'All'
          });
          setSelectedTitle('country', $scope.memberCountries[0].name);
        });

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
            filterValue = isCountry && filterValue ? value.toLowerCase() : filterValue;

            filters[paramName] = filterValue;
            // kick off the filtering
            $scope.setPage($scope.currentPage, filters.country, filters.year);
          }
        };

        $scope.setPage = function(page, countryCode, year) {
          // we're looking only for EBSA meetings
          var titleFilter = '*EBSA*';
          Meetings.getMeetingsPage($scope.timeframe, page, filters.country, filters.year, titleFilter, function(meetingSet) {
            $scope.totalMeetings = meetingSet.pagination.totalMeetings;
            $scope.currentPage = meetingSet.pagination.currentPage;
            $scope.perPage = meetingSet.pagination.perPage;
            $scope.meetings = meetingSet.meetings;
          });
        };

        $scope.setTimeframe = function(timeframe) {
          resetFilters();
          $scope.timeframe = timeframe;
          $scope.setPage($scope.currentPage);
        };

        function setSelectedTitle(paramName, title) {
          $scope['selected' + strings.capitalise(paramName)] = title;
        }

        Lists.getYears(function(years) {
          $scope.yearList = years;
          $scope.yearList.unshift('All');
          setSelectedTitle('year', $scope.yearList[0]);
        });

        $scope.setPage($scope.currentPage, null, null);
      }
    ]);

  });