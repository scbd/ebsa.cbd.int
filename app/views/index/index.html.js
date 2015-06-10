define(['app'], function(app) {
  'use strict';

  return app.controller('IndexCtrl', ['$scope', 'geojson', 'meetings','lists',
    function($scope, regions, Meetings, lists) {

      var regionData = {};
    //   var regionList = ['caribbean', 'southPacific','southernIndianOcean', 'easternTropical', 'northPacific', 'southEasternAtlantic',
    //                     'arctic', 'northWestAtlantic', 'mediterranean'];

      $scope.showFeature = function(region) {
        $scope.selectedRegion = region ? regionMappingList[region.identifier].name : region;
      };



     var regionMappingList = lists.getEbsasRegionMapping();
     lists.getEbsasRegions()
     .then(function(regionList){
         $scope.regionList = regionList;

         $scope.loading = 2 + regionList.length;
         regionList.forEach(function(region) {
           regions.getRegionByName(regionMappingList[region.identifier].name, function(regionGeojson) {

             regionData[regionMappingList[region.identifier].name] = regionGeojson;
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


     });





    }
  ]);
});
