define(['app'], function(app) {
  'use strict';

  return app.controller('IndexCtrl', ['$scope', 'geojson', 'meetings',
    function($scope, regions, Meetings) {
      var regionData = {},
        regionList = ['caribbean', 'southPacific'];

      $scope.showFeature = function(regionName) {
        $scope.selectedRegion = regionName;
      };

      regionList.forEach(function(regionName, index) {
        regions.getRegionByName(regionName, function(regionGeojson) {
          regionData[regionName] = regionGeojson;
          // check to see if we loaded everything and update the $scope.
          if (Object.keys(regionData).length === regionList.length) {
            $scope.regionData = regionData;
          }
        });
      });

      Meetings.getMeetingsPage('upcoming', function(meetingSet) {
        $scope.meetingsUpcoming = meetingSet.meetings;
      });

      Meetings.getMeetingsPage('previous', function(meetingSet) {
        $scope.meetingsPrevious = meetingSet.meetings;
      });
    }
  ]);
});