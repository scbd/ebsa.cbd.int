define(['app'], function(app) {
  'use strict';

  return app.controller('IndexCtrl', ['$scope', 'geojson',
    function($scope, regions) {
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

    }
  ]);
});