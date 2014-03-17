define(['./module.js'], function(module) {
  return module.directive('gmap', ['regionsGeojson',
    function(regions) {

      var map;
      var currentFeatures = null;

      var caribbeanStyle = {
        strokeColor: '#A9DDA6',
        strokeOpacity: 0.75,
        strokeWeight: 2,
        fillColor: '#96DD92',
        fillOpacity: 0.25
      };

      var pacificStyle = {
        strokeColor: '#F1EFE0',
        strokeOpacity: 0.75,
        strokeWeight: 2,
        fillColor: '#EFE8BB',
        fillOpacity: 0.25
      };

      var infowindow;

      function init() {
        infowindow = new google.maps.InfoWindow();

        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 2,
          center: new google.maps.LatLng(13.6036603, -101.313101),
          mapTypeId: google.maps.MapTypeId.SATELLITE
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
        google.maps.event.addListener(feature, 'click', function(event) {
          var content = '<div id=\'infoBox\'>';
          for (var j in this.geojsonProperties) {
            content += j + ': ' + this.geojsonProperties[j] + '<br />';
          }
          content += '</div>';
          infowindow.setContent(content);
          infowindow.setPosition(event.latLng);
          infowindow.open(map);
        });
      }



      return {
        restrict: 'EA',
        templateUrl: '/app/views/gmap/gmap.html',
        replace: true,
        scope: {},
        link: function(scope, element, attrs) {

        }
      };

    }
  ]);
});