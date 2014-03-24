define(['./module.js'], function(module) {
  return module.directive('meetingsCalendar', ['meetings', '$locale', '$http', '$compile', '$templateCache',
    function(meetings, $locale, $http, $compile, $templateCache) {

      function getLocalizedMonth(index, format) {
        return $locale.DATETIME_FORMATS.SHORTMONTH[index];
      }

      function sortByYear(meetings) {
        return meetings.sort(function(a, b) {
          return a.startYear < b.startYear;
        });
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
        // sorts meetings by date in descending order, localizes the dates, and groups the meeting by years
        // and then subgroups by months.
        // ex: {
        //   2014: {
        //     4: [{meeting}], // 4 is the ISO month index
        //     5: [{meeting}]
        //   }
        // }
        var groupedByYear = _.groupBy(meetings, 'startYear'),
          sortedByMonthAndYear = [];

        angular.forEach(groupedByYear, function(meetings, year) {
          sortedByMonthAndYear.push({
            numeric: year,
            months: _.groupBy(meetings, 'startMonth')
          });
        });
        meetings = _.sortBy(sortedByMonthAndYear, function(year) {
          return year.numeric;
        }).reverse();
        return meetings;
      }

      var getTemplate = function(format) {
        var templateLoader,
          baseUrl = '/app/views/meetings/',
          templateMap = {
            'short': 'meetingsCalendar.short.html',
            'long': 'meetingsCalendar.html',
          };

        var templateUrl = baseUrl + templateMap[format];
        templateLoader = $http.get(templateUrl, {
          cache: $templateCache
        });

        return templateLoader;
      };

      return {
        restrict: 'EA',
        // templateUrl: '/app/views/meetings/meetingsCalendar.html',
        replace: true,
        scope: {
          format: '@',
          meetingData: '=',
          itemsPerTimeframe: '@',
          tableTitle: '@'
        },
        link: function(scope, element, attrs) {
          var isShort = scope.format === 'short';
          scope.getLocalizedMonth = getLocalizedMonth;
          scope.itemsPerTimeframe = scope.itemsPerTimeframe || 0;

          var loader = getTemplate(scope.format);

          scope.$watch('meetingData', function(meetings) {
            if (!meetings) return;

            meetings = sortByYear(meetings).slice(0, scope.itemsPerTimeframe || meetings.length);
            if (isShort) {
              scope.meetings = meetings;
              return;
            }

            scope.meetings = processMeetings(meetings);
          });

          loader.success(function(html) {
            element.replaceWith($compile(html)(scope));
          });

          // Provide a proper hashTag link to the right tab on the meetings page
          scope.hashTag = scope.tableTitle && scope.tableTitle === 'Upcoming Meetings' ? 'upcoming' : 'previous';
        }
      };
    }
  ]);
});