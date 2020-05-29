define(['./module.js', 'underscore'], function(module, _) {
  return module.directive('selectbox', ['$locale',
    function($locale) {
      return {
        templateUrl: 'views/selectbox/selectbox.html',
        restrict: 'EA',
        scope: {
          onSelect: '&',
          items: '=',
          title: '@',
          name: '@',
          defaultItem: '='
        },
        controller: function($scope, $element, $attrs) {
          var self = this;

          $scope.updateSelection = function(selection) {
            if (!angular.equals(self.selection, selection)) {
              self.setSelection(selection);
              $scope.onSelect({name: $scope.name, selection: self.selection});
            }
          };

          this.setSelection = function(selection) {
            self.selection = selection;
            self.setSelectedTitle(self.selection.text);
          };

          this.setSelectedTitle = function(newTitle) {
            $scope.selectedTitle = newTitle;
          };

          this.setList = function(newList) {
            this.list = newList;
          };

          $scope.$watch('items', function(newList) {
            if (newList && newList.length) self.setList(newList);
            if (!_.isEmpty($scope.defaultItem)) self.setSelection($scope.defaultItem);
          });

        },
        // link: function(scope, element, attrs, controller) {}
      };
    }
  ]);
});