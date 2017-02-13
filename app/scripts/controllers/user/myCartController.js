'use strict';

(function() {
    angular.module('myApp')
        .controller('myCartController', myCartController);

    myCartController.$inject = ['$scope', 'CartService', '$http', 'API', '$state'];

    function myCartController($scope, CartService, $http, API, $state) {

        var init = (function() {
            var totalPrice = function(cartData) {
                return cartData.map((item) => {
                    return item.cena * item.ilosc;
                }).reduce((a, b) => {
                    return a + b;
                });
            };
            const cart = CartService.getFromStorage();
            if (!cart) return;
            $scope.cart = cart;
            $scope.sum = totalPrice(cart);
        })();

        var totalPrice = function(cartData) {
            return cartData.map((item) => {
                return item.cena * item.ilosc;
            }).reduce((a, b) => {
                return a + b;
            });
        };

        var save = function(data) {
            $http.post(API + '/api/order/new', {
                    data
                })
                .success(() => {
                    sessionStorage.removeItem('shoppingCart');
                    swal(
                        'Great!',
                        'You have ordered products!',
                        'success'
                    );
                    //$state.go('order')
                })
                .error(() => {
                    swal(
                        'Error!',
                        'Problem with connect to database!',
                        'error'
                    );
                });
        };

        var onSave = function() {
            if (!$scope.cart) return;
            const cart = [];
            $scope.cart.map(function(data) {
                cart.push({
                    productId: data.id,
                    count: data.ilosc
                });
            });
            const username = CartService.getName();
            const order = {
                cart: cart,
                userId: username
            };
            save(JSON.stringify(order));
        };

        Object.assign($scope, {
            onSave
        });

    }
})();