'use strict';

(function() {
    angular.module('myApp')
        .controller('orderController', orderController);

    orderController.$inject = ['$scope', 'CartService', 'orderService'];

    function orderController($scope, CartService, orderService) {
        $scope.sortType = 'id';
        $scope.sortReverse = false;

        var userId = CartService.getName();

        orderService.getOrder(userId).then(function(response) {
            return $scope.order = response;
        });

    }
})();