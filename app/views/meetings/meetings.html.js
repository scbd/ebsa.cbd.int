'use strict';

define(['app', '../../services/meetingService.js'], function(app, Meetings) {

  app.controller('MeetingsCtrl', ['$http', '$scope', '$locale', 'Meetings',
    function($http, $scope, $locale, Meetings) {

      function sortMeetingsByDate(meetings) {
        return meetings.sort(function(ma, mb) {
          return ma.startDate.getTime() - mb.startDate.getTime();
        });
      }

      Meetings.getUpcoming(function(dataSet) {
        $scope.meetingSet = {};
        $scope.meetingSet.meetings = sortMeetingsByDate(dataSet.meetings);
        $scope.meetingSet.count = dataSet.count;
        console.log($scope.meetingSet.meetings);
      });

      var date = new Date();
      $scope.dateInfo = {
        year: date.getFullYear(),
        month: $locale.DATETIME_FORMATS.MONTH[date.getMonth()]
      };
    }
  ]);

});