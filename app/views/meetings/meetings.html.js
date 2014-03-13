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
        $scope.selectedCountry = $scope.memberCountries[0];
      });

      $scope.setSelectedCountry = function setSelectedCountry(countryCode) {
        var country = _.findWhere($scope.memberCountries, {'countryCode': countryCode});
        $scope.selectedCountry = country;
      };

      $scope.yearList = Lists.getYears();

      $scope.setPage = function(page) {
        Meetings.getMeetingsPage(function(meetingSet) {
          $scope.totalMeetings = meetingSet.totalMeetings;
          $scope.currentPage = meetingSet.currentPage;
          $scope.perPage = meetingSet.perPage;
          $scope.meetings = meetingSet.meetings;
        }, page, 'upcoming');

        $scope.currentPage = page;
      }

      var date = new Date();
      $scope.dateInfo = {
        year: date.getFullYear()
      };

      $scope.setPage(1);
    }
  ]);

});