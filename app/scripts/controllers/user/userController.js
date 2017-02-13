'use strict';

(function() {
    angular.module('myApp')
        .controller('userController', userController);

    userController.$inject = ['$scope', 'ValidationService', '$state'];

    function userController($scope, ValidationService, $state) {

            if (ValidationService.userData.rola !== 'user') {
                $state.go('login');
            }

            $scope.userMenu = [{
                icon: 'fa fa-gift',
                state: 'user.products',
                text: 'Products'
            }, {
                icon: 'fa fa-shopping-cart',
                state: 'user.cart',
                text: 'Shopping Cart'
            }, {
                icon: 'fa fa-truck',
                state: 'user.order',
                text: 'My Order'
            }, {
                icon: 'fa fa-sign-out',
                state: 'logout',
                text: 'Log out'
            }];

        }
})();