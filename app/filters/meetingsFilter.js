define(['angular'], function(ng) {
  var filters = ng.module('app.filters', []);

  return filters.filter('meetingFilter', function() {

    return function(meetings, selector) {
      if (selector === 'All') {
        return meetings;
      }
      return meetings.filter(function(meeting) {
        return meeting.countryCode === selector;
      });
    };

  });
});
