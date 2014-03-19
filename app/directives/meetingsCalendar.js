define(['./module.js'], function(module) {
  return module.directive('meetingsCalendar', ['meetings', '$locale', '$http', '$compile', '$templateCache',
    function(meetings, $locale, $http, $compile, $templateCache) {

      function getLocalizedMonth(index) {
        return $locale.DATETIME_FORMATS.MONTH[index];
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

      function setupWatches(scope, element, isShort) {

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
            console.log(meetings);
            if (!meetings) return;

            meetings = sortByYear(meetings).slice(0, scope.itemsPerTimeframe || meetings.length);
            if (isShort) {
              scope.meetings = meetings;
              return;
            }

            scope.meetings = processMeetings(meetings);
          });

          // load the appropriate template dynamically.
          loader
            .success(function(html) {
              element.replaceWith($compile(html)(scope));
            })
            .then(function(response) {
            }).finally(function() {

          });
        }
      };
    }


  ]);
});