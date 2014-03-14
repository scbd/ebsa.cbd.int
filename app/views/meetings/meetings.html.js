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
        // kick off the process
        $scope.setSelectedCountry('All');
      });

      $scope.setSelectedCountry = function setSelectedCountry(countryCode) {
        var country = _.findWhere($scope.memberCountries, {'countryCode': countryCode});
        $scope.selectedCountry = country;
        var countryCode = country.countryCode === 'All' ? undefined : countryCode.toLowerCase();
        $scope.setPage($scope.currentPage, countryCode); //proper solution
      };

      $scope.yearList = Lists.getYears();

      $scope.setPage = function(page, query) {
        Meetings.getMeetingsPage(function(meetingSet) {
          $scope.totalMeetings = meetingSet.totalMeetings;
          $scope.currentPage = meetingSet.currentPage;
          $scope.perPage = meetingSet.perPage;
          $scope.meetings = meetingSet.meetings;
        }, page, $scope.timeframe, query);
      }

      $scope.setTimeframe = function(timeframe) {
        $scope.timeframe = timeframe;
        $scope.setPage($scope.currentPage, timeframe);
      }
    }
  ]);

});