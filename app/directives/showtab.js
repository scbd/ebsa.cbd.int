define(['./module.js'], function(module) {
  return module.directive('showtab', ['$location', '$route', '$rootScope',
    function($location, $route, $rootScope) {
      var linkSelector = 'a',
        firstLink = 'li:first a',
        lastRoute = $location.path(),
        currentCrumb;

      function highlightCurrentTab(el, selectedTab, scope) {
        var $el = el.find(!selectedTab ? firstLink : linkSelector + '[href="#' + selectedTab + '"]');
        $el.tab('show');
        updateCurrentCrumb($el.text(), $el.attr('href'));
        var clickCallback = scope.onClick();
        $rootScope.$emit('breadcrumbs:add', currentCrumb.title, currentCrumb.url);
        return clickCallback && clickCallback(selectedTab);
      }

      function updateCurrentCrumb(title, url) {
        currentCrumb = {
          title: title,
          url: url
        };
      }

      function getSelectedTab() {
        var searchParams = $location.search();
        // we check for isString because if the someone input blah?tab= and no value
        // $location.search will return {tab: true}, so instead we force a null
        // to show there's no tab selected.
        return angular.isString(searchParams.tab) && searchParams.tab || null;
      }

      return {
        scope: {
          onClick: '&'
        },
        restrict: 'A',
        link: function(scope, element, attrs) {

          element.find(linkSelector).click(function(event) {
            event.preventDefault();
            var $a = angular.element(event.target);

            // push the new route onto history but don't reload. the locationChangeSuccess
            // event will handle the rest. This covers both cases where we load fresh
            // or a change is triggered by user click.
            // PLEASE DON'T BE CLEVER AND SWITCH THIS TO USING HASHES. THIS WILL FAIL BECAUSE
            // OF Html5Mode(true) IN app_routes.js.
            scope.$apply(function() {
              $location.search({
                'tab': $a.attr('href').slice(1)
              });
            });
          });

          scope.$on('$locationChangeSuccess', function(event, current, next) {
            var selectedTab = getSelectedTab();
            if ($location.path() !== lastRoute) {
              lastRoute = $location.path();
              return;
            }
            highlightCurrentTab(element, selectedTab, scope);
          });

          scope.$on('$destroy', function() {
            element.find(linkSelector).off();
          });

          // Kick off the process on page load because locationChange doesn't
          // fire on first load.
          highlightCurrentTab(element, getSelectedTab(), scope);
        }
      };
    }
  ]);
});