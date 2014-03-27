define(['./module.js', 'jquery'], function(module, $) {
  return module.directive('highlighter', ['$location', '$route', '$rootScope',
    function($location, $route, $rootScope) {

      function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      }

      function searchAndHighlight(searchTerm, selector, highlightClass, removePreviousHighlights) {
        var $el = angular.element(selector),
          searchTermRegEx = new RegExp('(' + escapeRegExp(searchTerm) + ')', 'gi');

        if ($el.length) {
          var matches = $el.text().match(searchTermRegEx);
          if (matches.length) {
            var highlightedEl = ['<span class=', highlightClass, '>', matches[0], '</span>'].join('');
            $el.html($el.html().replace(searchTermRegEx, highlightedEl));
            scrollToElement($el);
          }
        }
      }

      function scrollToElement(element, time, verticalOffset) {
        time = typeof(time) != 'undefined' ? time : 500;
        verticalOffset = typeof(verticalOffset) !== 'undefined' ? verticalOffset : 0;
        offset = element.offset();
        offsetTop = offset.top + verticalOffset;
        $('html, body').animate({
          scrollTop: offsetTop
        }, time);
      }

      function extractUrlParams() {
        var searchParams = $location.search();
        var highlightParam = searchParams.highlight,
          termParam = searchParams.term;

        var shouldHighlight = angular.isString(highlightParam) && highlightParam;

        return {
          highlight: highlightParam,
          term: termParam
        };
      }

      function highlight() {
        var params = extractUrlParams();

        if (params.highlight) {
          searchAndHighlight(params.term, params.highlight, 'highlight', true);
        }
      }

      return {
        restrict: 'A',
        priority: -1,
        link: function(scope, element, attrs) {
          scope.$on('$locationChangeSuccess', function(event) {
            highlight();
          });

          highlight();
        }
      };
    }
  ]);
});