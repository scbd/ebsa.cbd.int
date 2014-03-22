define(['app'], function(app) {
  'use strict';

  app.controller('EbsasCtrl', ['$scope', 'lists',
    function($scope, Lists) {
      $scope.caribbeanData = Lists.getEbsas('caribbean')
        .then(function(ebsas) {
          $scope.caribbeanData = ebsas;
        });

      $scope.southPacificData = Lists.getEbsas('southPacific')
        .then(function(ebsas) {
          $scope.southPacificData = ebsas;
        });

      $scope.setActiveRegion = function(regionName) {
        $scope.activeRegion = regionName;
      };

      $scope.activeRegion = 'southPacific';
    }
  ]);

});