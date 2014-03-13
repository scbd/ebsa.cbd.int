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

      lists.getYears = function() {
        var end = (new Date).getFullYear() + 1, start = end - 10;
        return _.range(start, end).reverse();
      }

      return lists;
    }
  ]);
});