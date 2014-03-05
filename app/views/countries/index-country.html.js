define(['app'], function(app) {

  return app.controller('CountriesIndexCountryController', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams) {

      $http.get('/api/v2013/countries/' + $routeParams.country, {cache: true })
      .then(function(result) {
        $scope.country = result.data;
      });

    }
  ]);

});