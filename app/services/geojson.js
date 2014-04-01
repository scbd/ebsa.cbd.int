define(['./module.js', 'underscore'], function(module, _) {
  return module.factory('geojson', ['$http', '$locale',
    function($http, $locale) {
      var geojson = {};

      geojson.getRegionByName = function(regionName, cb) {
        return $http.get('regions/' + regionName + '.geojson')
          .then(function(response) {
            cb(response.data);
          });
      };

      return geojson;
    }
  ]);
});