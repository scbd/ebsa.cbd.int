define(['app', 'underscore'], function(app, _) { 'use strict';

    return app.controller('IndexCtrl', ['$scope', 'geojson', 'meetings','lists', '$q', function($scope, geojson, Meetings, lists, $q) {

        $scope.loading = 3;

        lists.getEbsasRegions().then(function(regions) {

            $scope.regionList = regions;

            return $q.all(_.map(regions, function(region) {
                return geojson.getRegionById(region.identifier).then(function(regionGeojson) {
                    return {
                        identifier : region.identifier,
                        shapes : regionGeojson
                    };
                });
            }));

        }).then(function(data){

            $scope.regionData = _.reduce(data, function(result, e) {

                result[e.identifier] = e.shapes;

                return result;
            }, {});

        }).finally(function() {
            $scope.loading --;
        });

        Meetings.getMeetingsPage({timeframe: 'upcoming'}).then(function(meetingSet) {
            $scope.meetingsUpcoming = meetingSet;
            $scope.loading --;
        });

        Meetings.getMeetingsPage({timeframe: 'previous'}).then(function(meetingSet) {
            $scope.meetingsPrevious = meetingSet;
            $scope.loading --;
        });
    }]);
});
