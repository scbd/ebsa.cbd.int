define(['./module.js'], function(module) {
  return module.factory('lists', ['$http', '$locale',
    function($http, $locale) {
      var lists = {};

      lists.getCountries = function(cb) {
        $http.get('/app/langs/en/countries.json')
          .then(function(response) {
            cb(response.data);
          });
      };

      return lists;
    }
  ]);
});