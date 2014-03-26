define(['./module.js', 'jquery'], function(module, $) {
  return module.directive('highlighter', ['$location', '$route', '$rootScope',
    function($location, $route, $rootScope) {

      function searchAndHighlight(searchTerm, selector, highlightClass, removePreviousHighlights) {
        var $el = angular.element(selector),
          searchTermRegEx = new RegExp('(' + searchTerm + ')', 'gi');

        if ($el.length) {
          // if ($el.text().match(searchTermRegEx)) {
            // var $temp = $('<span></span>');
            // $temp.addClass('highlight');
            // $temp.html($el.text().replace(searchTermRegEx, '$1'));
            // debugger;
            // $el.parent().insertBefore($temp, $el);
            // $el.parent().remove($el);
            $el.addClass(highlightClass);
            scrollToElement($el);
          // }
        }
      }

      function scrollToElement(element, time, verticalOffset) {
        time = typeof(time) != 'undefined' ? time : 1000;
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