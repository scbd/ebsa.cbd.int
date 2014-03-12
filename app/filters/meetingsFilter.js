define(['./module.js'], function(module) {
  return module.filter('meetingFilter', function() {

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
