'use strict';

(function() {
    angular.module('myApp')
        .controller('CartController', CartController);

    CartController.$inject = ['$scope', 'CartService'];

    function CartController($scope, CartService) {
        CartService.getProducts()
            .then(function(response) {
                return $scope.products = response;
            });

        $scope.cartData = [];

        $scope.removeFromCard = function(id) {
            $scope.cartData.splice(id, 1);
        }

        $scope.addToCard = function(id, nazwa, cena, kategoria) {
            var obj = {
                'id': id,
                'nazwa': nazwa,
                'ilosc': 1,
                'Kategorie': kategoria,
                'cena': cena
            };

            if ($scope.cartData.find(el => el.id === id)) {
                const index = $scope.cartData.findIndex(el => el.id === id)
                if (index !== -1) {
                    $scope.cartData[index].ilosc++;
                }
            } else {
                $scope.cartData.push(obj);
            }
        }

        $scope.moreItem = function(id) {
            if ($scope.cartData.find(el => el.id === id)) {
                const index = $scope.cartData.findIndex(el => el.id === id)
                if (index !== -1) {
                    $scope.cartData[index].ilosc++;
                } else {

                }
            }
        }

        $scope.lessItem = function(id) {
            if ($scope.cartData.find(el => el.id === id)) {
                const index = $scope.cartData.findIndex(el => el.id === id)
                if (index !== -1) {
                    $scope.cartData[index].ilosc--;
                } else {

                }
            }
        }
        var totals = [];

        $scope.totalPrice = function() {

            var buy = $scope.cartData;
            buy.filter(function(item) {
                var itemPrice = item.cena * item.ilosc;
                totals.push(itemPrice);
            });


            var sumTotals = 0;
            totals = totals.filter(function(item) {
                sumTotals += item;
            });
            return sumTotals;
        }

        $scope.setCart = function() {
                sessionStorage.setItem('shoppingCart', JSON.stringify($scope.cartData));
                swal("Cart Saved!", "Go to Shopping Cart", "success");
            }
            //end
    }
})();