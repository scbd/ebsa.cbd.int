define(['app'], function(app) {
  'use strict';

  return app.controller('IndexCtrl', ['$scope', 'geojson', 'meetings',
    function($scope, regions, Meetings) {
      var regionData = {};
      var regionList = ['caribbean', 'southPacific'];

      $scope.showFeature = function(regionName) {
        $scope.selectedRegion = regionName;
      };

      $scope.loading = 2 + regionList.length;

      regionList.forEach(function(regionName) {
        regions.getRegionByName(regionName, function(regionGeojson) {
          regionData[regionName] = regionGeojson;
          // check to see if we loaded everything and update the $scope.
          if (Object.keys(regionData).length === regionList.length) {
            $scope.regionData = regionData;
          }
          $scope.loading --;
        });
      });

      Meetings.getMeetingsPage({timeframe: 'upcoming'})
        .then(function(meetingSet) {
          $scope.meetingsUpcoming = meetingSet;
          $scope.loading --;
        });

      Meetings.getMeetingsPage({timeframe: 'previous'})
        .then(function(meetingSet) {
          $scope.meetingsPrevious = meetingSet;
          $scope.loading --;
        });


    }
  ]);
});
