define([
    'app',
    'underscore'
  ],
  function(app, _) {
    'use strict';

    app.controller('MeetingsCtrl', ['$http', '$scope', '$locale', 'meetings', 'lists',
      function($http, $scope, $locale, Meetings, Lists) {
        // default timeframe for meetings
        $scope.timeframe = 'upcoming';

        // load country list.
        Lists.getCountries(function(json) {
          $scope.memberCountries = json;
          // set the default option to be all meetings
          // see below in setSelectedCountry for handling of special case.
          $scope.memberCountries.unshift({
            name: 'All',
            countryCode: 'All'
          });
          $scope.setFilterParam('country', $scope.memberCountries[0].countryCode);
        });

        // $scope.setSelectedCountry = function setSelectedCountry(countryCode) {
        //   var country = _.findWhere($scope.memberCountries, {
        //     'countryCode': countryCode
        //   });
        //   $scope.selectedCountry = country;
        //   countryCode = country.countryCode === 'All' ? undefined : countryCode.toLowerCase();
        //   $scope.setPage($scope.currentPage, countryCode); //proper solution
        // };

        function capitalise(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        }
        var filters = {
          country: undefined,
          year: undefined
        };
        function resetFilters () {
          filters.country = filters.year = undefined;
          $scope.selectedCountry = 'All';
          $scope.selectedYear = 'All';
        }
        $scope.setFilterParam = function(paramName, value) {
          var country,
            selectedParam = 'selected' + capitalise(paramName),
            isCountry = paramName === 'country',
            // normalize
            filterValue = (/[a|A]ll/.test(value)) ? null : value;


          if (!angular.equals(filters[paramName], filterValue)) {
            if (isCountry) {
              country = _.findWhere($scope.memberCountries, {
                countryCode: value
              });
            }
            $scope[selectedParam] = isCountry ? country.name : value;
            filterValue = isCountry && filterValue ? value.toLowerCase() : filterValue;

            filters[paramName] = filterValue;
            // kick off the filtering
            $scope.setPage($scope.currentPage, filters.country, filters.year);
          }
        };

        $scope.setPage = function(page, countryCode, year) {
          Meetings.getMeetingsPage(function(meetingSet) {
            $scope.totalMeetings = meetingSet.pagination.totalMeetings;
            $scope.currentPage = meetingSet.pagination.currentPage;
            $scope.perPage = meetingSet.pagination.perPage;
            $scope.meetings = meetingSet.meetings;
          }, page, $scope.timeframe, filters.country, filters.year);
        };

        $scope.setTimeframe = function(timeframe) {
          resetFilters();
          $scope.timeframe = timeframe;
          $scope.setPage($scope.currentPage);
        };

        Lists.getYears(function(years) {
          $scope.yearList = years;
          $scope.yearList.unshift('All');
          $scope.setFilterParam('year', $scope.yearList[0]);
        });

        $scope.setPage($scope.currentPage, null, null);

        // $scope.setYear = function(year) {
        //   $scope.selectedYear = year;
        //   $scope.setPage($scope.currentPage, $scope.selectedCountry.countryCode, $scope.selectedYear);
        // };
      }
    ]);

  });