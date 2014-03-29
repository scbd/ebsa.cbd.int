define(['./module.js', 'underscore'], function(module, _) {
  return module.factory('lists', ['$http', '$locale', '$q',
    function($http, $locale, $q) {
      var lists = {};

      lists.getCountries = function(cb) {
        $http.get('langs/en/countries.json')
          .then(function(response) {
            cb(response.data);
          });
      };

      lists.getYears = function(rstart, rend, callback) {
        if (angular.isFunction(rstart)) {
          callback = rstart;
          rstart = null;
        }
        var end = rend || (new Date()).getFullYear() + 1,
          start = rstart || end - 25 - 1;
        return callback(_.range(start, end).reverse());
      };

      lists.getEbsas = function(regionName) {
        var deferred = $q.defer();
        $http.get('ebsaData/' + regionName + '.json')
          .then(function(response) {
            deferred.resolve(response.data);
          });
        return deferred.promise;
      };

      return lists;
    }
  ]);
});