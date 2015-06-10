define(['./module.js', 'underscore'], function(module, _) {
  return module.factory('lists', ['$http', '$locale', '$q','$filter',
    function($http, $locale, $q, $filter) {
      var lists = {};

      lists.getCountries = function() {
        var deferred = $q.defer();
        $http.get('langs/en/countries.json')
          .then(function(response) {
            deferred.resolve(response.data);
          });
        return deferred.promise;
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

    lists.getEbsasRegions = function() {
      var deferred = $q.defer();
      $http.get('/api/v2013/thesaurus/domains/0AE91664-5C43-46FB-9959-0744AD1B0E91/terms')
        .then(function(response) {
          deferred.resolve($filter("orderBy")(response.data, 'title.en'));
        });
      return deferred.promise;
    };
    lists.getEbsasRegionMapping = function() {
        return {
            'B58E1174-BA60-481A-83EA-CD0310DCFCFD':{ name:'caribbean', title:'Wider Caribbean and Western Mid-Atlantic'},
            'CA3259CC-2FA6-4E8C-8560-967DB05C5D48':{ name:'southPacific', title:'Western South Pacific'},
            '800F52F9-E7A7-47F2-94E4-EA34F60A13A1':{ name:'southernIndianOcean', title:'Southern Indian Ocean'},
            '3CD91D7F-785A-4F87-BD8C-8CC7B837DE59':{ name:'easternTropical', title:'Eastern Tropical and Temperate Pacific'},
            '16EA9FE2-323D-40EB-ACF0-EEB3C164F107':{ name:'northPacific', title:'North Pacific'},
            '41778E79-EC55-4717-B500-165999F07D74':{ name:'southEasternAtlantic', title:'South-Eastern Atlantic'},
            'B23DF27C-4E0C-481F-90DE-0120B095AB29':{ name:'arctic', title:'Arctic'},
            '81893F06-7D2D-43FE-B13B-098C335C9A3B':{ name:'northWestAtlantic', title:'North-west Atlantic'},
            '48C4C187-A6A6-4F36-9024-DE73E2BB0721':{ name:'mediterranean', title:'Mediterranean'}
        };
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

         return $http.get("/api/v2013/index", { params : qsParams });
    };

      return lists;
    }
  ]);
});
