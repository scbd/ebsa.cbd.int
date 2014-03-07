'use strict';

define(['app'], function(app) {

  app.controller('MeetingsCtrl', ['$http', '$scope', function($http, $scope) {

    $http.get('https://api.cbd.int/api/v2013/index?q=schema_s:meeting')
      .then(function(meetings) {
        $scope.meetings = meetings;
      });

  }]);

});