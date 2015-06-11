define(['app'], function(app) {
  'use strict';

  app.controller('EbsasCtrl', ['$scope', 'lists',
    function($scope, Lists) {

      $scope.setActiveRegion = function(region) {

        $scope.activeRegion = region;
        $scope.regionData=undefined;

        Lists.getEbsasRegionDocuments(region.identifier).then(function(res) {
            $scope.regionData = res.data.response.docs;
        });

      };

      Lists.getEbsasRegions().then(function(regions){
          $scope.regionList = regions;
          $scope.setActiveRegion(regions[0]);
      });
    }
  ]);
});
