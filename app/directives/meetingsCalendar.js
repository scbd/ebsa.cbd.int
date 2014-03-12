define(['./module.js'], function(module) {
  return module.directive('meetingsCalendar', ['meetings',
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