'use strict';

define(['app', '../../services/meetingService.js', 'underscore'], function(app, Meetings, _) {

  app.controller('MeetingsCtrl', ['$http', '$scope', '$locale', 'Meetings',
    function($http, $scope, $locale, Meetings) {

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
        // sorts meetings by date in descending order, localizes the dates, and groups the meeting by month
        var chronoSorted = sortMeetingsByDate(dataSet.meetings);
        var grouped = _.groupBy(chronoSorted, 'startMonth');
        console.log(grouped);
        $scope.meetingSet.meetings = grouped;//_.groupBy(normalizeDates(chronoSorted), 'year');
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