define(['app'], function(app) {

    return app.controller('CountriesIndexCountryController', ['$scope', '$http', '$route', function ($scope, $http, $route) {

        $scope.country = $http.get('/api/v2013/countries/'+$route.current.params.country, { cache : true }).then(function(result){
            return $scope.country = result.data;
        });

    }]);
});