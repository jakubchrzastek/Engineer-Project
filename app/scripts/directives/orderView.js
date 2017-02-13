'use strict';
(function() {
angular.module('myApp')
    .directive('orderView', [function() {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'templates/html/functional/_orderview.html',
            link: function($scope, $element, $attrs) {
                $scope.element = $element;
            }
        }
    }]);
})();