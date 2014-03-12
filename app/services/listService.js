define(['angular'], function(ng) {
  var services = ng.module('app.services');
  return services.factory('lists', ['$http', '$locale',
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