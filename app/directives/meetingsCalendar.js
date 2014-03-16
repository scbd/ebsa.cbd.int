define(['./module.js'], function(module) {
  return module.directive('meetingsCalendar', ['meetings', '$locale',
    function(meetings, $locale) {

      function getLocalizedMonth(index) {
        return $locale.DATETIME_FORMATS.MONTH[index];
      }

      // function normalizeDates(meetings) {
      //   angular.forEach(meetings, function(month, meetings) {
      //     angular.forEach(meetings, function(meeting) {
      //       meeting.startMonth = scope.getLocalizedMonth(meeting.startMonth);
      //       meeting.year = meeting.getFullYear();
      //     });
      //   });

      //   return meetings;
      // }

      function processMeetings(meetings) {
        if (!meetings) return meetings;
        console.log('meetings: ', meetings);
        // sorts meetings by date in descending order, localizes the dates, and groups the meeting by years
        // and then subgroups by months.
        // ex: {
        //   2014: {
        //     4: [{meeting}], // 4 is the ISO month index
        //     5: [{meeting}]
        //   }
        // }
        var groupedByYear = _.groupBy(meetings, 'startYear'),
          groupedByMonthAndYear = {};

        angular.forEach(groupedByYear, function(meetings, year) {
          groupedByMonthAndYear[year] = _.groupBy(meetings, 'startMonth');
        });
        meetings = groupedByMonthAndYear;
        return meetings;
      }

      return {
        restrict: 'EA',
        templateUrl: '/app/views/meetings/meetingsCalendar.html',
        replace: true,
        scope: {
          format: '@',
          meetingData: '=',
          country: '=',
          selectedYear: '='
        },
        link: function(scope, element, attrs) {
          scope.getLocalizedMonth = getLocalizedMonth;

          scope.$watch('meetingData', function(meetings) {
            scope.meetings = processMeetings(meetings);
          });
        }
      };
    }


  ]);
});