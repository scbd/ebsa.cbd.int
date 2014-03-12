define([
  'app',
  'underscore'
  ],
  function(app, _) {
  'use strict';

  app.controller('MeetingsCtrl', ['$http', '$scope', '$locale', 'meetings', 'lists',
    function($http, $scope, $locale, Meetings, Lists) {

      // load country list.
      Lists.getCountries(function(json) {
        $scope.memberCountries = json;
        // set the default option to be all meetings
        // see meetingsFilter.js for handling of special case.
        $scope.selectedCountry = {
          name: 'All',
          countryCode: 'All'
        };
      });

      $scope.setSelectedCountry = function setSelectedCountry(countryCode) {
        var country = _.findWhere($scope.memberCountries, {'countryCode': countryCode});
        $scope.selectedCountry = country;
      };



      var date = new Date();
      $scope.dateInfo = {
        year: date.getFullYear()
      };
    }
  ]);

});