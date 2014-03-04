define(['app'], function(app) {

    return app.controller('CountriesIndexController', ['$scope', '$http', function ($scope, $http) {

        $scope.countries = $http.get('/api/v2013/countries', { cache : true }).then(function(result){
            return $scope.countries = result.data;
        });

    }]);
});