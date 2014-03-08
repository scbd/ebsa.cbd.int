'use strict';

define(['app', '../../services/meetingService.js', 'underscore'], function(app, Meetings, _) {

  app.controller('MeetingsCtrl', ['$http', '$scope', '$locale', 'Meetings',
    function($http, $scope, $locale, Meetings) {

      function sortMeetingsByDate(meetings) {
        return meetings.sort(function(ma, mb) {
          return ma.startDate.getTime() - mb.startDate.getTime();
        });
      }

      function getLocalizedMonth(index) {
        return $locale.DATETIME_FORMATS.MONTH[index];
      }

      function normalizeDates(meetings) {
        meetings.forEach(function(meeting) {
          meeting.month = getLocalizedMonth(meeting.startDate.getMonth());
          meeting.year = meeting.startDate.getFullYear();
        });

        return meetings;
      }

      Meetings.getUpcoming(function(dataSet) {
        $scope.meetingSet = {};
        // sorts meetings by date in descending order, localizes the dates, and groups the meeting by month
        $scope.meetingSet.meetings = _.groupBy(normalizeDates(sortMeetingsByDate(dataSet.meetings)), 'month');
        $scope.meetingSet.count = dataSet.count;
      });

      var date = new Date();
      $scope.dateInfo = {
        year: date.getFullYear()
      };
    }
  ]);

});