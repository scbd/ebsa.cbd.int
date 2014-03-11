define(['app'], function(app) {
  app.directive('meetingsCalendar', ['meetings', function(meetings) {

    return {
      restrict: 'EA',
      template: '',
      replace: true,
      scope: {},
      link: function(scope, element, attrs) {}
    };
  }]);
});
