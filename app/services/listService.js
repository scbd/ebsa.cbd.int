define(['./module.js', 'underscore'], function(module, _) {
  return module.factory('lists', ['$http', '$locale',
    function($http, $locale) {
      var lists = {};

      lists.getCountries = function(cb) {
        $http.get('/app/langs/en/countries.json')
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

      return lists;
    }
  ]);
});