define(['angular'], function(ng) {
  var directives = ng.module('app.directives', []);

  return directives.directive('meetingsCalendar', ['meetings',
    function(meetings) {

      return {
        restrict: 'EA',
        templateUrl: '/app/views/meetings/meetingsCalendar.html',
        replace: true,
        scope: {
          format: '@',
          meetings: '=',
          selectedCountry: '=',
          selectedYear: '='
        },
        link: function(scope, element, attrs) {
        }
      };
    }


  ]);
});