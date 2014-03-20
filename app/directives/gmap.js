define(['./module.js', 'async!http://maps.google.com/maps/api/js?v=3.exp&sensor=false', 'geojson', '../util/colors.js'],
  function(module, google, geojson, colors) {
    return module.directive('gmap', ['$window',
      function($window, regions) {

        var map,
          currentFeatures = null,
          infowindow,
          gmapsListeners = [],
          defaultStyle = {
            strokeColor: '',
            strokeOpacity: 0.75,
            strokeWeight: 2,
            fillColor: '',
            fillOpacity: 0.25
          };

        function randomStyle() {
          var style = angular.copy(defaultStyle);
          // we set random color to start at 50 so we don't get
          // straight black on the map.
          style.strokeColor = colors.changeLuminance(colors.randomHexColor(50), 1);
          // Make the fill color be 20% brighter than the stroke color.
          style.fillColor = colors.changeLuminance(style.strokeColor, -0.3);
          return style;
        }

        function init(rootEl) {
          infowindow = new $window.google.maps.InfoWindow();

          map = new $window.google.maps.Map(rootEl, {
            zoom: 2,
            center: new $window.google.maps.LatLng(13.6036603, -101.313101),
            mapTypeId: $window.google.maps.MapTypeId.SATELLITE
          });
        }

        function setInfoWindow(event) {
            var content = '<div id=\'infoBox\'>';
            event.feature.forEachProperty(function(propVal, propName) {
              content += propName + ': ' + propVal + '<br />';
            });

            content += '</div>';
            infowindow.setContent(content);
            infowindow.setPosition(event.latLng);
            infowindow.open(map);
        }

        function cleanupListeners(e) {
          $window.google.maps.event.removeListener(listener);
        }

        function cleamMap(map) {
          if (infowindow.getMap()) infowindow.close();
          map.data.forEach(function(feature) {
            map.data.remove(feature);
          });
        }

        var listener;
        return {
          restrict: 'EA',
          template: '<div id="map"></div>',
          replace: true,
          scope: {
            region: '='
          },
          link: function(scope, element, attrs) {
            init(element.get(0));
            scope.$watch('region', function(region) {
              if (region && region.geojson) {
                cleamMap(map);
                map.data.addGeoJson(region.geojson);
                map.data.setStyle(randomStyle());
                // addListener in fact interates over all the features
                // and assigns a callback to the click event.
                listener = map.data.addListener('click', setInfoWindow);
              }
            });

            scope.$on('$destroy', cleanupListeners);
          }
        };

      }
    ]);
  });