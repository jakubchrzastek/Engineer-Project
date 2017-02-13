'use strict';

(function() {
    angular.module('myApp')
        .controller('orderViewController', orderViewController);

    orderViewController.$inject = ['$scope', 'CartService', 'orderService', '$stateParams'];

    function orderViewController($scope, CartService, orderService, $stateParams) {

            orderService.getOrderDetail($stateParams.id).then(function(response) {
                var data = response.detail;
                var totalPrice = function(data) {
                    return data.map((item) => {
                        return item.cena * item.ilosc;
                    }).reduce((a, b) => {
                        return a + b;
                    });
                };
                $scope.sum = totalPrice(data);
                return $scope.orderDetail = response;
            });
            //end
        }
})();