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
          style.fillColor = colors.changeLuminance(style.strokeColor, -0.1);
          return style;
        }

        function init(rootEl) {
          infowindow = new $window.google.maps.InfoWindow();

          // map = new $window.google.maps.Map(document.getElementById('map'), {
          map = new $window.google.maps.Map(rootEl, {
            zoom: 2,
            center: new $window.google.maps.LatLng(13.6036603, -101.313101),
            mapTypeId: $window.google.maps.MapTypeId.SATELLITE
          });
          //showFeature(geojson_southpacific, pacificStyle);
        }

        function clearMap() {
          if (!currentFeatures)
            return;
          if (currentFeatures.length) {
            for (var i = 0; i < currentFeatures.length; i++) {
              if (currentFeatures[i].length) {
                for (var j = 0; j < currentFeatures[i].length; j++) {
                  currentFeatures[i][j].setMap(null);
                }
              } else {
                currentFeatures[i].setMap(null);
              }
            }
          } else {
            currentFeatures.setMap(null);
          }
          if (infowindow.getMap()) {
            infowindow.close();
          }
        }

        function showFeature(geojson, style) {
          clearMap();
          currentFeatures = new GeoJSON(geojson, style || null);
          if (currentFeatures.type && currentFeatures.type == 'Error') {
            return;
          }
          if (currentFeatures.length) {
            for (var i = 0; i < currentFeatures.length; i++) {
              if (currentFeatures[i].length) {
                for (var j = 0; j < currentFeatures[i].length; j++) {
                  currentFeatures[i][j].setMap(map);
                  if (currentFeatures[i][j].geojsonProperties) {
                    setInfoWindow(currentFeatures[i][j]);
                  }
                }
              } else {
                currentFeatures[i].setMap(map);
              }
              if (currentFeatures[i].geojsonProperties) {
                setInfoWindow(currentFeatures[i]);
              }
            }
          } else {
            currentFeatures.setMap(map);
            if (currentFeatures.geojsonProperties) {
              setInfoWindow(currentFeatures);
            }
          }
        }

        function setInfoWindow(feature) {
          gmapsListeners.push($window.google.maps.event.addListener(feature, 'click', function(event) {
            var content = '<div id=\'infoBox\'>';
            for (var j in this.geojsonProperties) {
              content += j + ': ' + this.geojsonProperties[j] + '<br />';
            }
            content += '</div>';
            infowindow.setContent(content);
            infowindow.setPosition(event.latLng);
            infowindow.open(map);
          }));
        }

        function cleanupListeners(e) {
          gmapsListeners.forEach(function(listener) {
            $window.google.maps.event.removeListener(listener);
          });
        }



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
              if (region && region.geojson)
                showFeature(region.geojson, randomStyle());
            });

            scope.$on('$destroy', cleanupListeners);

          }
        };

      }
    ]);
  });