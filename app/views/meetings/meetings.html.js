'use strict';

define(['app',
        '../../services/meetingService.js',
        '../../services/listService.js',
        '../../filters/meetingsFilter.js',
        'underscore'
  ],
  function(app, Meetings, Lists, meetingsFilter, _) {

  app.controller('MeetingsCtrl', ['$http', '$scope', '$locale', 'meetings', 'lists',
    function($http, $scope, $locale, Meetings, Lists) {

      // load country list.
      Lists.getCountries(function(json) {
        $scope.memberCountries = json;
        // set the default option to be all meetings
        // see meetingsFilter.js for handling of special case.
        $scope.selectedCountry = {
          name: 'All',
          countryCode: 'All'
        };
      });

      $scope.setSelectedCountry = function setSelectedCountry(countryCode) {
        var country = _.findWhere($scope.memberCountries, {'countryCode': countryCode});
        $scope.selectedCountry = country;
      };

      function sortMeetingsByDate(meetings) {
        return meetings.sort(function(ma, mb) {
          return ma.startDate.getTime() - mb.startDate.getTime();
        });
      }

      $scope.getLocalizedMonth = function getLocalizedMonth(index) {
        return $locale.DATETIME_FORMATS.MONTH[index];
      };

      function normalizeDates(meetings) {
        angular.forEach(meetings, function(month, meetings) {
          angular.forEach(meetings, function(meeting) {
            meeting.startMonth = $scope.getLocalizedMonth(meeting.startMonth);
            meeting.year = meeting.getFullYear();
          });
        });

        return meetings;
      }

      Meetings.getUpcoming(function(dataSet) {
        $scope.meetingSet = {};
        // sorts meetings by date in descending order, localizes the dates, and groups the meeting by years
        // and then subgroups by months.
        // ex: {
        //   2014: {
        //     4: [{meeting}], // 4 is the ISO month index
        //     5: [{meeting}]
        //   }
        // }
        var chronoSorted = sortMeetingsByDate(dataSet.meetings),
          groupedByYear = _.groupBy(chronoSorted, 'startYear'),
          groupedByMonthAndYear = {};

        angular.forEach(groupedByYear, function(meetings, year) {});
        groupedByMonthAndYear = _.groupBy(dataSet.meetings, 'startMonth');
        $scope.meetingSet.meetings = groupedByMonthAndYear; //_.groupBy(normalizeDates(chronoSorted), 'year');
        $scope.meetingSet.count = dataSet.count;
        console.log($scope.meetingSet.meetings);
      });

      var date = new Date();
      $scope.dateInfo = {
        year: date.getFullYear()
      };
    }
  ]);

});