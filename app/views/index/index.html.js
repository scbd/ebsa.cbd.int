define(['app'], function(app) {
  'use strict';

  return app.controller('IndexCtrl', ['$scope', 'regionsGeojson',
    function($scope, regions) {
      var regionData;
      regions.getRegionByName('caribbean', function(caribbean) {
        regions.getRegionByName('southPacific', function(southPacific) {
          regionData = {
            caribbean: caribbean,
            southPacific: southPacific
          };
        });

        $scope.showFeature = function(regionName, styleName) {
          $scope.selectedRegion = {
            geojson: regionData[regionName],
            styleName: regionName
          };
        };
      });
    }
  ]);
});