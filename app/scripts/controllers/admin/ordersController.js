'use strict';

(function() {

    angular.module('myApp')
        .controller('ordersController', ordersController);

    ordersController.$inject = ['$scope', 'orderService', 'CartService'];

    function ordersController($scope, orderService, CartService) {
        $scope.sortType = 'id';
        $scope.sortReverse = false;

        var userId = CartService.getName();

        orderService.getAllOrder().then(function(response) {
            return $scope.orders = response;
        });

        $scope.deleteOrder = function(item) {
            swal({
                    title: "Are you sure?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function() {
                    orderService.deleteOrder(item.id).then(function(response) {
                        var index = $scope.orders.indexOf(item);
                        if (response === 200) {
                            $scope.orders.splice(index, 1);
                            swal("Deleted!", "Product has been removed", "success");
                        }
                    })
                });
        };
    }
})();