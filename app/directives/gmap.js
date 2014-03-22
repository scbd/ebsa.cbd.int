define(['./module.js', 'async!http://maps.google.com/maps/api/js?v=3.exp&sensor=false', '../util/colors.js'],
  function(module, google, colors) {
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
            mapTypeId: $window.google.maps.MapTypeId.SATELLITE
          });
        }

        function setInfoWindow(event) {
          var content = '<div id="infoBox">',
            key,
            CBDbaseUrl = 'https://chm.cbd.int/database/record?documentID=';

          event.feature.forEachProperty(function(propVal, propName) {
            if (propName == 'NAME') {
              content += propName + ': ' + '<strong>' + propVal + '</strong><br />';
            } else if (propName == 'KEY') {
              key = propVal;
            } else {
              content += propName + ': ' + propVal + '<br /><br />';
            }
          });

          content += '<a class="pull-right" target="_blank" href="' + CBDbaseUrl + key + '">Details »</a>';
          content += '</div>';
          infowindow.setContent(content);
          infowindow.setPosition(event.latLng);
          infowindow.open(map);
        }

        function cleanupListeners(e) {
          $window.google.maps.event.removeListener(listener);
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
            init(element.get(0));


            scope.$watch('selectedRegion', updateSelectedRegion);

            scope.$watch('regions', function(regions) {
              if (!regions) return;
              geojsonCache = regions;
              updateSelectedRegion(null);
            });

            scope.$on('$destroy', cleanupListeners);
          }
        };

      }
    ]);
  });