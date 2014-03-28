define(['./module.js'], function(module) {
  return module.directive('selectbox', ['$locale',
    function($locale) {
      return {
        templateUrl: '/app/views/selectbox/selectbox.html',
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

          $scope.setSelection = function(selection) {
            if (!angular.equals(this.selection, selection)) {
              self.selection = selection;
              self.setSelectedTitle(self.selection.text);
              $scope.onSelect()($scope.name, self.selection);
            }
          };

          this.setSelectedTitle = function(newTitle) {
            $scope.selectedTitle = newTitle;
          };

          this.setList = function(newList) {
            this.list = newList;
          };

          $scope.$watch('items', function(newList) {
            if (newList && newList.length) self.setList(newList);
            if (!_.isEmpty($scope.defaultItem)) $scope.setSelection($scope.defaultItem);
          });

        },
        link: function(scope, element, attrs, controller) {
        }
      };
    }
  ]);
});