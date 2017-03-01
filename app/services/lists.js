define(['./module.js', 'underscore', 'geojson-area'], function(module, _, geojsonArea) {
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


    lists.getEbsasRegions = function() {

        return $http.get('/api/v2013/thesaurus/domains/0AE91664-5C43-46FB-9959-0744AD1B0E91/terms', {cache:true}).then(function(response) {
            return $filter("orderBy")(response.data, 'title.en');
        });
    };

    lists.getEbsasRegionDocuments = function(region) {
        var qsParams =
          {
              "q"  : "schema_s:marineEbsa AND NOT version_s:* AND region_s:" + region,
              "fl" : "title_t, url_ss",
              "sort"  : "updatedDate_dt desc",
              "start" : 0,
              "rows"  : 999999,
          };

         return $http.get("/api/v2013/index", { params : qsParams, cache:true });
    };


    var _shapes = null;

    lists.getShapes = function(regionId) {

        if(_shapes) {
            return $q.when(_shapes[regionId]);
        }

        var qsParams =
        {
            "q"  : "schema_s:marineEbsa AND NOT version_s:*",
            "fl" : "url_ss,region_s,title_t,description_t,shapeUrl_ss,simplifiedShape_ss",
            "sort"  : "updatedDate_dt desc",
            "start" : 0,
            "rows"  : 999999,
        };

        var qRegions = lists.getEbsasRegions();

        var qRecords = $http.get("https://api.cbd.int/api/v2013/index", { params : qsParams, cache:true }).then(function(response) {

            return _.map(response.data.response.docs, function(record) {
                 record.simplifiedShape_ss = _.map(record.simplifiedShape_ss, JSON.parse);
                 return record;
            });
        });

        return $q.all([qRegions, qRecords]).then(function(results) {

            var regions = results[0];
            var records = results[1];
            var maxArea = 0;

            var allFeatures = _.map(records, function(record) {

                var region   = _.findWhere(regions, {identifier : record.region_s }) || { identifier : record.region_s, title : { en : "" } };

                var features = _.map(record.simplifiedShape_ss, function(fc) {
                    return fc.features;
                });

                features = _.flatten(features);

                features = _.map(features, function(f) {

                    f.properties = f.properties || {};
                    f.properties.area  = Math.abs(geojsonArea.geometry(f.geometry));
                    f.properties.style =  {
                        strokeColor: "#FFFFFF",
                        fillColor  : "#FFFFFF"
                    };

                    f.properties.__record = {
                        url         : _.first(record.url_ss),
                        title       : { en : record.title_t },
                        description : { en : record.description_t },
                        region      : {
                            identifier : region.identifier,
                            title : region.title
                        }
                    };

                    maxArea = Math.max(maxArea, Math.abs(f.properties.area));

                    return f;
                });

                return features;
            });

            allFeatures = _.flatten(allFeatures);

            for(var i=0; i<allFeatures.length; ++i) {
                allFeatures[i].properties.style.zIndex = Math.floor(maxArea/allFeatures[i].properties.area);
            }

            _shapes = {};

            _.each(regions, function(region){

                _shapes[region.identifier] = {
                     type: "FeatureCollection",
                     features : _.filter(allFeatures, function(f){

                         return f.properties.__record.region.identifier == region.identifier;
                     })
                 };
            });

            return _shapes[regionId];
        });
    };

    return lists;

}]);
});
