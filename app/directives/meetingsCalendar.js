define(['./module.js', 'underscore'], function(module, _) {
  return module.directive('meetingsCalendar', ['meetings', '$locale', '$http', '$compile', '$templateCache',
    function(meetings, $locale, $http, $compile, $templateCache) {

      function getLocalizedMonth(index, format) {
        format = format === 'long' ? 'MONTH' : 'SHORTMONTH';
        return $locale.DATETIME_FORMATS[format][index];
      }

      function processMeetings(meetings, dir) {
        // dir == true is ASC and false is DESC
        if (!meetings) return meetings;

        // Sorts the meetings array into grouped objects, ex:
        //  {
        //    index: 2014,
        //    months: [{
        //      index: 1,
        //      meetings: [{
        //        city: 'Montreal',
        //        country: 'Canada',
        //        startDay: 1
        //        ...
        //      }, {
        //        city: 'New York',
        //        country: 'United States',
        //        startDay: 4
        //        ...
        //      }]
        //    }]
        //  }
        var sorted = _.chain(meetings)
          .groupBy('startYear')
          .pairs()
          .map(function(year) { return { index: parseInt(year[0], 10), months: year[1] }; })
          .sortBy('index')
          .each(function(year, index, list) {
            var sortedMonths = _.chain(year.months)
              .groupBy('startMonth')
              .pairs()
              .map(function(month) { return { index: parseInt(month[0], 10), meetings: month[1] }; })
              .sortBy('index')
              .each(function(month, index, list) {
                var sortedDays = _.sortBy(month.meetings, 'startDay');
                month.meetings = dir ? sortedDays : sortedDays.reverse();
              })
              .value();
            year.months = dir ? sortedMonths : sortedMonths.reverse();
          })
          .value();

        return dir ? sorted : sorted.reverse();
      }

      function getMeetingsPerTimeFrame (meetings, numItems) {
        var latestMeetings = [];
        if (!meetings.length) return latestMeetings;

        while(latestMeetings.length < numItems) {
          var year = meetings.shift();

          if(!year)
              break;

          while(year.months.length) {
            latestMeetings = latestMeetings.concat(year.months.shift().meetings);
            if (latestMeetings.length > numItems) return latestMeetings.slice(0, numItems);
            else if (latestMeetings.length === numItems) return latestMeetings;
          }
        }

        return latestMeetings;
      }

      var getTemplate = function(format) {
        var templateLoader,
          baseUrl = 'views/meetings/',
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
        replace: true,
        scope: {
          format: '@',
          meetingData: '=',
          itemsPerTimeframe: '@',
          tableTitle: '@',
          dir: '=',
          hashTag: '@'
        },
        link: function(scope, element, attrs) {
          var isShortFormat = scope.format === 'short';
          scope.getLocalizedMonth = getLocalizedMonth;
          scope.itemsPerTimeframe = scope.itemsPerTimeframe || 0;

          var loader = getTemplate(scope.format);

          scope.$watch('meetingData', function(meetings) {
            if (!meetings) return;

            meetings = processMeetings(meetings, scope.dir);
            meetings = isShortFormat && meetings.length ?
              getMeetingsPerTimeFrame(meetings, parseInt(scope.itemsPerTimeframe)) :
              meetings;

            scope.meetings = meetings;
          });
          // inject the right template based on the required scope.format
          loader.success(function(html) {
            element.replaceWith($compile(html)(scope));
          });
        }
      };
    }
  ]);
});