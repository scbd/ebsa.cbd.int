define(['./module.js', 'underscore'], function(module, _) {
  return module.factory('lists', ['$http', '$locale', '$q','$filter',
    function($http, $locale, $q, $filter) {
      var lists = {};

      lists.getCountries = function() {
        return $http.get('langs/en/countries.json', {cache:true}).then(function(response) {
            return response.data;
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

        return $http.get('ebsaData/' + regionName + '.json', {cache:true}).then(function(response) {
            return response.data;
        });
      };

    lists.getEbsasRegions = function() {

        return $http.get('/api/v2013/thesaurus/domains/0AE91664-5C43-46FB-9959-0744AD1B0E91/terms', {cache:true}).then(function(response) {
            return $filter("orderBy")(response.data, 'title.en');
        });
    };

    lists.getEbsasRegionDocuments = function(region) {
        var qsParams =
          {
              "q"  : "schema_s:marineEbsa AND region_s:" + region,
              "fl" : "title_t, url_ss",
              "sort"  : "updatedDate_dt desc",
              "start" : 0,
              "rows"  : 1000,
          };

         return $http.get("/api/v2013/index", { params : qsParams, cache:true });
    };

      return lists;
    }
  ]);
});
