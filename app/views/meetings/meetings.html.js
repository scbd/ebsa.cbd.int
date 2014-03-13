define([
  'app',
  'underscore'
  ],
  function(app, _) {
  'use strict';

  app.controller('MeetingsCtrl', ['$http', '$scope', '$locale', 'meetings', 'lists',
    function($http, $scope, $locale, Meetings, Lists) {

      // load country list.
      Lists.getCountries(function(json) {
        $scope.memberCountries = json;
        // set the default option to be all meetings
        // see meetingsFilter.js for handling of special case.
        $scope.memberCountries.unshift({
          name: 'All',
          countryCode: 'All'
        });
        $scope.setSelectedCountry('All');
      });

      $scope.setSelectedCountry = function setSelectedCountry(countryCode) {
        // $scope.setPage(1, {country: countryCode}); //proper solution
        var country = _.findWhere($scope.memberCountries, {'countryCode': countryCode});
        $scope.selectedCountry = country;
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
        console.log(timeframe);
        $scope.timeframe = timeframe;
        $scope.setPage($scope.currentPage, timeframe);
      }

      // kick off the process
      $scope.timeframe = 'upcoming';
      $scope.setPage(1);
    }
  ]);

});