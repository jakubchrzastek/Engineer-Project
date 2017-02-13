'use strict';
(function() {
angular.module('myApp')
	.directive('menu', [function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'templates/html/functional/_menu.html',
			scope: {
				content: '='
			},
			link: function($scope, $element, $attrs) {
				$scope.element = $element;
			},
			controller: function($scope) {
				//console.log($scope.element); // wyswietli html elementu na ktory jest nalozona dyrektywa
			}
		}
	}]);
})();