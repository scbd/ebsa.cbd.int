define(['app', 'underscore'], function(app, _) {
  app.controller('SearchCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

      function search(query) {
        $http.get('/api/search', {params: {q: query}})
          .then(function(response) {
            $scope.matchCount = response.data.length;
            $scope.searchResults = _.groupBy(response.data, 'pageName');
            console.log($scope.searchResults);
          });
      }

      var queryParams = $location.search();
      if (queryParams.q && angular.isString(queryParams.q)) {
        $scope.query = queryParams.q;
        search(queryParams.q);
      }
    }
  ]);
});