define(['./module.js'], function(module) {
  return module.directive('meetingsCalendar', ['meetings', '$locale',
    function(meetings, $locale) {

      function sortMeetingsByDate(meetings) {
        return meetings.sort(function(ma, mb) {
          return ma.startDate.getTime() - mb.startDate.getTime();
        });
      }

      function getLocalizedMonth(index) {
        return $locale.DATETIME_FORMATS.MONTH[index];
      };

      function normalizeDates(meetings) {
        angular.forEach(meetings, function(month, meetings) {
          angular.forEach(meetings, function(meeting) {
            meeting.startMonth = scope.getLocalizedMonth(meeting.startMonth);
            meeting.year = meeting.getFullYear();
          });
        });

        return meetings;
      }

      return {
        restrict: 'EA',
        templateUrl: '/app/views/meetings/meetingsCalendar.html',
        replace: true,
        scope: {
          format: '@',
          meetings: '=',
          country: '=',
          selectedYear: '='
        },
        link: function(scope, element, attrs) {
          meetings.getUpcoming(function(dataSet) {
            scope.meetingSet = {};

            scope.getLocalizedMonth = getLocalizedMonth;

            scope.$watch('country', function(selectedCountry) {
              scope.selectedCountry = selectedCountry;
            });

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
            scope.meetingSet.meetings = groupedByMonthAndYear; //_.groupBy(normalizeDates(chronoSorted), 'year');
            scope.meetingSet.count = dataSet.count;
            console.log(scope.meetingSet.meetings);
          });
        }
      };
    }


  ]);
});