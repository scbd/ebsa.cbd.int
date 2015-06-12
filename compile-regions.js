var fs    = require('fs');
var path = require('path');
var _     = require('lodash');
var when  = require('when');
var keys  = require('when/keys');
var guard = require('when/guard');
var agent = require('superagent-promise')(require('superagent'), this.Promise || require('when/es6-shim/Promise'));


var regions = agent.get("https://api.cbd.int/api/v2013/thesaurus/domains/0AE91664-5C43-46FB-9959-0744AD1B0E91/terms")
    .accept("application/json")
    .end()
    .then(function(res){
        return _.union([{
            "identifier": "other",
            "name": "No regions assigned",
            "title": {
                "en": "No regions assigned"
            },
        }], res.body);
    });

// LOAD Regions
when.map(regions, guard(guard.n(1), function(region){

    // Load Records

    var regionCriteria = region.identifier == "other" ? "NOT region_s:*" : "region_s:"+region.identifier;

    var records = agent.get("https://api.cbd.int/api/v2013/index")
        .accept("application/json")
        .query({ q  : 'schema_s:marineEbsa AND NOT version_s:* AND ' + regionCriteria})
        .query({ fl : 'url_ss, shapeUrl_ss,title_AR_t,title_EN_t,title_ES_t,title_FR_t,title_RU_t,title_ZH_t,description_AR_t,description_EN_t,description_ES_t,description_FR_t,description_RU_t,description_ZH_t'})
        .query({ rows : 999999})
        .end()
        .then(function(res){

            console.log("Region '%s' %d records", region.title.en, res.body.response.docs.length);
            return res.body.response.docs;
        });

    region.records = when.map(records, guard(guard.n(5), function(record){

        if(_.isEmpty(record.shapeUrl_ss))
            return record;

        // Load Records shapes
        record.shapes = when.map(record.shapeUrl_ss, function(url) {

            console.log("Dowloading: %s", url);

            return agent.get(url)
              .accept("application/json")
              .end()
              .then(function(res){
                  return res.body.features;
              });

        }).then(function(shapes){

            // consvert array of arrays to array
            return _.flatten(shapes);

        });

        return keys.all(record);
    }));

    return keys.all(region);

})).then(function(regions){

    // Generate GEO JSON for each regions with extra infos!!! __xyz

    return when.map(regions, function(region){

        var features = _(region.records).map(function(record){

            if(_.isEmpty(record.shapes))
                return;

            _.each(record.shapes, function(feature){

                feature.properties = _.defaults(feature.properties||{}, {
                    NAME: record.title_t,
                    Workshop: region.title.en,
                    __record: {
                        title : {
                            ar : record.title_AR_t,
                            en : record.title_EN_t,
                            es : record.title_ES_t,
                            fr : record.title_FR_t,
                            ru : record.title_RU_t,
                            zh : record.title_ZH_t
                        },
                        description : {
                            ar : record.description_AR_t,
                            en : record.description_EN_t,
                            es : record.description_ES_t,
                            fr : record.description_FR_t,
                            ru : record.description_RU_t,
                            zh : record.description_ZH_t
                        },
                        region : region.identifier,
                        url   : _.first(record.url_ss)
                    }
                });

                feature.properties.style = {
                    strokeColor: "#FFFFFF",
                    fillColor: "#FFFFFF"
                };

            });

            return record.shapes;
        })
        .flatten()
        .compact()
        .value();

        return {
            type: "FeatureCollection",
            crs: {
                type: "name",
                properties: {
                    name: "urn:ogc:def:crs:OGC:1.3:CRS84"
                }
            },
            __region : {
                identifier : region.identifier,
                name  : region.name || (region.title||{}).en,
                title : region.title,
                recordCount :  region.records.length
            },
            features: features
        };

    });

}).then(function(featureCollections){

    //Save to file

    return when.map(featureCollections, function(collection){

        var filePath = path.join(__dirname, 'app','regions', collection.__region.identifier+'.json');

        console.log("Writing  shape : %s - %s to %s", collection.__region.title.en, collection.__region.identifier, filePath);

        fs.writeFileSync(filePath, JSON.stringify(collection), 'utf8');

        return collection;

    });
});
