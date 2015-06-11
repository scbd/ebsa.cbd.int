define(['./module.js'], function(module) {

    return module.factory('geojson', ['$http', function($http) {

        var mapping = {
            'B58E1174-BA60-481A-83EA-CD0310DCFCFD' : 'caribbean',
            'CA3259CC-2FA6-4E8C-8560-967DB05C5D48' : 'southPacific',
            '800F52F9-E7A7-47F2-94E4-EA34F60A13A1' : 'southernIndianOcean',
            '3CD91D7F-785A-4F87-BD8C-8CC7B837DE59' : 'easternTropical',
            '16EA9FE2-323D-40EB-ACF0-EEB3C164F107' : 'northPacific',
            '41778E79-EC55-4717-B500-165999F07D74' : 'southEasternAtlantic',
            'B23DF27C-4E0C-481F-90DE-0120B095AB29' : 'arctic',
            '81893F06-7D2D-43FE-B13B-098C335C9A3B' : 'northWestAtlantic',
            '48C4C187-A6A6-4F36-9024-DE73E2BB0721' : 'mediterranean'
        };

        return {

            getRegionById : function(identifier) {

                return $http.get('regions/' + mapping[identifier] + '.geojson').then(function(res) {
                    return res.data;
                });
            }
        };
    }]);
});
