define(['app'], function(app) {
  app.module('directives.meetingsCalendar', []);

  app.directive('meetingsCalendar', ['meetings',
    function(meetings) {
      console.log('exec');

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
          console.log(scope);
        }
      };
    }


  ]);
});