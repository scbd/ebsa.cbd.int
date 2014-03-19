define(['app'], function(app) {
  'use strict';

  return app.controller('IndexCtrl', ['$scope', 'geojson', 'meetings',
    function($scope, regions, Meetings) {
      var regionData = {},
        regionList = ['caribbean', 'southPacific'];

      regionList.forEach(function(regionName) {
        regions.getRegionByName(regionName, function(regionGeojson) {
          regionData[regionName] = regionGeojson;
        });
      });

      $scope.showFeature = function(regionName, styleName) {
        $scope.selectedRegion = {
          geojson: regionData[regionName],
          styleName: regionName
        };
      };

      Meetings.getMeetingsPage('upcoming', function(meetingSet) {
        $scope.meetingsUpcoming = meetingSet.meetings;
        console.log($scope.meetingsUpcoming);
      });

      Meetings.getMeetingsPage('previous', function(meetingSet) {
        $scope.meetingsPrevious = meetingSet.meetings;
        console.log($scope.meetingsPrevious);
      });

      $scope.meetings = [1,2,3,4,5,6];
    }
  ]);
});