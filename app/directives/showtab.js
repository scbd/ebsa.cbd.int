define(['./module.js'], function(module) {
  return module.directive('showtab', ['$location', '$route', '$window', '$rootScope',
    function($location, $route, $window, $rootScope) {
      var linkSelector = 'a',
        firstLink = 'li:first';

      function highlightCurrentTab(el, hash) {
        el.find(linkSelector + '[href="' + hash + '"]').tab('show');
      }

      return {
        scope: {
          activeTab: '='
        },
        restrict: 'A',
        link: function(scope, element, attrs) {

          element.find(linkSelector).click(function(event) {
            event.preventDefault();
            var $a = angular.element(event.target);

            // show the tab
            $a.tab('show');
            // push the new route onto history but don't reload.
            if ($window.history.pushState) $window.history.pushState(null, null, $a.attr('href'));
            else $location.hash = $a.attr('href');
          });

          $rootScope.$on('$locationChangeSuccess', function(event, current, next) {
            var tabHash = '#' + $location.hash();
            if (current.split('#')[0] !== next.split('#')[0]) return;

            if (tabHash === '#') element.find(firstLink).tab('show');
            else highlightCurrentTab(element, tabHash);
          });

          var tabHash = '#' + $location.hash();
          highlightCurrentTab(element, tabHash);
        }
      };
    }
  ]);
});