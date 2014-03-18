define(['./module.js', 'underscore'], function(module, _) {
  return module.factory('regionsGeojson', ['$http', '$locale',
    function($http, $locale) {
      var regionsGeojson = {};

      regionsGeojson.getRegionByName = function(regionName, cb) {
        return $http.get('/app/regions/' + regionName + '.geojson')
          .then(function(response) {
            cb(response.data);
          });
      };

      return regionsGeojson;
    }
  ]);
});