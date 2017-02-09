define(['./module.js', '../util/colors.js', 'underscore'],
  function(module, colors, _) {
    return module.directive('gmap', ['$window',
      function($window, regions) {
        var map,
          currentFeatures = null,
          infowindow,
          gmapsListeners = [],
          geojsonCache,
          defaultStyle = {
            strokeColor: null,
            strokeOpacity: 0.75,
            strokeWeight: 2,
            fillColor: null,
            fillOpacity: 0.25
          };


        function init(rootEl) {
          infowindow = new $window.google.maps.InfoWindow();

          map = new $window.google.maps.Map(rootEl, {
            zoom: 2,
            center: new $window.google.maps.LatLng(13.6036603, -101.313101),
            mapTypeId: $window.google.maps.MapTypeId.SATELLITE,
            mapTypeControlOptions: {
              mapTypeIds: [$window.google.maps.MapTypeId.SATELLITE]
            }
          });
        }

        function setInfoWindow(event) {
            var record = event.feature.getProperty('__record');
            var summary = record.description.en.replace(/\r\n|\r|\n/g, '<br />');
            var content =
                '<div id="infoBox" class="scrollFix">'+
                    '<p><b>'+htmlEncode(record.title.en)+'</b></p>'+
                    '<p style="white-space:normal">'+summary+'</p>'+
                    '<a class="pull-right" target="ebsa" href="' + record.url + '">Details »</a>'+
                    '<em>'+htmlEncode(record.region.title.en)+'</em>'+
                '</div>';

          infowindow.setContent(content);
          infowindow.setPosition(event.latLng);
          infowindow.open(map);
        }

        function htmlEncode(value){
          //create a in-memory div, set it's inner text(which jQuery automatically encodes)
          //then grab the encoded contents back out.  The div never exists on the page.
          return $('<div/>').text(value).html();
        }

        function cleanupListeners(e) {
          $window.google.maps.event.removeListener(listener);
          $window.google.maps.event.clearInstanceListeners($window);
          $window.google.maps.event.clearInstanceListeners($window.document);
          $window.google.maps.event.clearInstanceListeners(map);
        }

        function clearMap(map) {
          if (infowindow.getMap()) infowindow.close();
          map.data.forEach(function(feature) {
            map.data.remove(feature);
          });
        }

        var listener;

        function displayRegion(regionData, regionName) {
          map.data.addGeoJson(regionData);
          listener = map.data.addListener('click', setInfoWindow);
        }

        function applyStyles() {
          map.data.setStyle(function(feature) {
            return angular.extend({}, defaultStyle, feature.getProperty('style'));
          });
        }

        function updateSelectedRegion(regionName) {
          if (!geojsonCache) return;
          clearMap(map);
          if (!regionName) {
            angular.forEach(geojsonCache, function(regionData, regionName) {
              displayRegion(regionData, regionName);
            });
            applyStyles();
            return;
          }
          displayRegion(geojsonCache[regionName], regionName);
          applyStyles();
        }

        return {
          restrict: 'EA',
          template: '<div id="map"></div>',
          replace: true,
          scope: {
            regions: '=',
            selectedRegion: '='
          },
          link: function(scope, element, attrs) {
            require(['async!https://maps.google.com/maps/api/js?v=3.exp&sensor=false'], function(maps) {
              init(element.get(0));


              scope.$watch('selectedRegion', updateSelectedRegion);

              scope.$watch('regions', function(regions) {
                if (!regions) return;
                geojsonCache = regions;
                updateSelectedRegion(null);
              });

              scope.$on('$destroy', cleanupListeners);
            });
          }
        };

      }
    ]);
  });
