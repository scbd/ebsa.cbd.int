define(['app'], function(app) {
  return app.filter('MeetingFilter', function() {

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
